import http from "http";
import next from "next";
import { Server } from "socket.io";
import { nanoid } from "nanoid";

import { rooms } from "./src/lib/roomStore";
import { buildQuestion, scoreAnswer } from "./src/lib/quiz";
import { fetchTracksForCategory } from "./src/lib/itunes";
import { MIN_ROUNDS, MAX_ROUNDS } from "./src/lib/gameConfig";


const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const PORT = Number(process.env.PORT ?? 3000);


async function main() {
  await app.prepare();

  const server = http.createServer((req, res) => handle(req, res));

  const io = new Server(server, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {
    socket.on("room:create", (_payload, cb) => {
      const roomId = nanoid(6).toUpperCase();

      // luodaan huone ilman pelaajaa – host liittyy vasta nimensä annettua
      rooms.create(roomId, socket.id);

      cb?.({ roomId });
    });

    socket.on("room:join", ({ roomId, name }, cb) => {
      const ok = rooms.join(roomId, socket.id, name);
      if (!ok) return cb?.({ error: "ROOM_NOT_FOUND" });
      socket.join(roomId);
      io.to(roomId).emit("room:update", rooms.publicState(roomId));
      cb?.({ ok: true });
    });

    socket.on("room:configure", ({ roomId, config }) => {
      const r = rooms.get(roomId);
      if (!r || r.hostSocketId !== socket.id) return;

      if (typeof config.rounds === "number") {
        config.rounds = Math.max(
          MIN_ROUNDS,
          Math.min(MAX_ROUNDS, config.rounds)
        );
      }

      rooms.configure(roomId, config);
      io.to(roomId).emit("room:update", rooms.publicState(roomId));
    });

    socket.on("game:start", async ({ roomId }) => {
      const r = rooms.get(roomId);
      if (!r || r.hostSocketId !== socket.id) return;

      console.log("game:start", roomId, r.config);

      rooms.startGame(roomId);
      io.to(roomId).emit("room:update", rooms.publicState(roomId));

      try {
        const tracks = await fetchTracksForCategory(
          r.config.categoryQuery,
          150,
          { categoryGenres: r.config.categoryGenres }
        );
        console.log("tracks fetched", tracks.length);

        rooms.setTrackPool(roomId, tracks);

        io.to(roomId).emit("room:update", rooms.publicState(roomId));
        startNextRound(io, roomId);
      } catch (e) {
        console.error("fetchTracksForCategory failed", e);
        io.to(roomId).emit("game:error", { message: "Failed to fetch tracks for category." });
      }
    });

    socket.on("player:setName", ({ roomId, name }, cb) => {
      const r = rooms.get(roomId);
      if (!r) return cb?.({ error: "ROOM_NOT_FOUND" });

      const trimmed = String(name ?? "").trim().slice(0, 24);
      if (!trimmed) return cb?.({ error: "INVALID_NAME" });

      const player = r.players[socket.id];
      if (!player) return cb?.({ error: "NOT_IN_ROOM" });

      player.name = trimmed;

      io.to(roomId).emit("room:update", rooms.publicState(roomId));
      cb?.({ ok: true, name: trimmed });
    });

    socket.on("game:sync", ({ roomId }, cb) => {
      const r = rooms.get(roomId);
      if (!r || !r.game || r.game.phase !== "PLAYING") {
        cb?.({ ok: false });
        return;
      }

      const q = r.game.question;

      const payload = {
        roundId: r.game.roundId,
        startAt: r.game.startAt,
        answerWindowMs: r.game.answerWindowMs,
        clipMs: r.game.clipMs,
        audioUrl: q.correct.previewUrl,
        choices: q.choices.map((c) => ({ title: c.title, artist: c.artist })),
      };

      // lähetä tälle soketille nykyinen round
      socket.emit("game:round", payload);
      cb?.({ ok: true });
    });


    socket.on("answer:submit", ({ roomId, roundId, choiceIndex, clientTimeMs }) => {
      const r = rooms.get(roomId);
      if (!r || !r.game || r.game.roundId !== roundId) return;

      const player = r.players[socket.id];
      if (!player || r.game.answers[socket.id]) return;

      const receivedAt = Date.now();
      r.game.answers[socket.id] = { choiceIndex, receivedAt, clientTimeMs };

      io.to(roomId).emit("game:answers", { count: Object.keys(r.game.answers).length });
    });

    socket.on("room:leave", ({ roomId }, cb) => {
      const r = rooms.get(roomId);
      if (!r) return cb?.({ ok: true }); // huone jo poissa

      rooms.leave(roomId, socket.id);
      socket.leave(roomId);

      io.to(roomId).emit("room:update", rooms.publicState(roomId));
      cb?.({ ok: true });
    });


    socket.on("disconnect", () => {
      const rid = rooms.leaveAny(socket.id);
      if (rid) io.to(rid).emit("room:update", rooms.publicState(rid));
    });
  });

  server.listen(PORT, () => console.log(`http://localhost:${PORT}`));
}

function startNextRound(io: Server, roomId: string) {
  const room = rooms.get(roomId);
  if (!room) return;

  // varmista perus game state
  if (!room.game) {
    (room as any).game = { phase: "PLAYING", currentRound: 0 };
  }

  const game = room.game!;

  if (game.currentRound >= room.config.rounds) {
    game.phase = "FINISHED";
    io.to(roomId).emit("game:finished", { scoreboard: rooms.scoreboard(roomId) });
    io.to(roomId).emit("room:update", rooms.publicState(roomId));
    return;
  }

  if (!room.trackPool || room.trackPool.length < 4) {
    io.to(roomId).emit("game:error", { message: "Track pool too small. Try another category." });
    return;
  }

  const question = buildQuestion(room);
  const roundId = nanoid(8);
  const now = Date.now();
  const isFirstRound = (room.game?.currentRound ?? 0) === 0;
  const startDelayMs = isFirstRound ? 5000 : 1500;

  const startAt = now + startDelayMs;

  rooms.beginRound(roomId, {
    roundId,
    question,
    startAt,
    answerWindowMs: room.config.answerWindowMs,
    clipMs: room.config.clipMs,
  });

  io.to(roomId).emit("game:round", {
    roundId,
    startAt,
    answerWindowMs: room.config.answerWindowMs,
    clipMs: room.config.clipMs,
    audioUrl: question.correct.previewUrl,
    choices: question.choices.map((c) => ({ title: c.title, artist: c.artist })),
  });

  setTimeout(() => {
    const rr = rooms.get(roomId);
    if (!rr || !rr.game || rr.game.roundId !== roundId) return;

    const correctIndex = rr.game.question.correctIndex;

    for (const [sid, ans] of Object.entries(rr.game.answers)) {
      const isCorrect = ans.choiceIndex === correctIndex;
      const pts = isCorrect
        ? scoreAnswer({
          receivedAt: ans.receivedAt,
          startAt: rr.game.startAt,
          answerWindowMs: rr.game.answerWindowMs,
        })
        : 0;

      if (rr.players[sid]) rr.players[sid].score += pts;
    }

    io.to(roomId).emit("game:reveal", {
      correctIndex,
      correct: rr.game.question.choices[correctIndex],
      scoreboard: rooms.scoreboard(roomId),

      // mitä kukin vastasi
      answers: Object.entries(rr.game.answers)
        .map(([sid, ans]: any) => {
          const player = rr.players[sid];
          if (!player) return null;
          return { socketId: sid, name: player.name, choiceIndex: ans.choiceIndex };
        })
        .filter(Boolean),
    });

    rr.game.currentRound += 1;
    setTimeout(() => startNextRound(io, roomId), 5000);
  }, (startAt - now) + room.config.answerWindowMs);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
