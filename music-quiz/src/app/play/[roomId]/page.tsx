"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSocket } from "../../../lib/useSocket";

import { AppShell } from "../../../components/shared/AppShell";
import { PlayHeader } from "../../../components/play/PlayHeader";
import { AnswersGrid } from "../../../components/play/AnswersGrid";
import { GameOverCard } from "../../../components/play/GameOverCard";
import { ScoreboardPanel } from "../../../components/play/ScoreboardPanel";

export default function Play() {
  const params = useParams();
  const roomId = Array.isArray((params as any).roomId)
    ? (params as any).roomId[0]
    : (params as any).roomId;

  const socket = useSocket();
  const router = useRouter();

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playTimerRef = useRef<number | null>(null);
  const stopTimerRef = useRef<number | null>(null);
  const backTimerRef = useRef<number | null>(null);

  const [round, setRound] = useState<any>(null);
  const [reveal, setReveal] = useState<any>(null);
  const [scoreboard, setScoreboard] = useState<any[]>([]);
  const [picked, setPicked] = useState<number | null>(null);
  const [now, setNow] = useState<number>(Date.now());

  const [finished, setFinished] = useState(false);
  const [finalScoreboard, setFinalScoreboard] = useState<any[] | null>(null);

  const [volume, setVolume] = useState(0.8);
  const volumeRef = useRef(volume);

  // mobiilin scoreboard “bottom sheet”
  const [showBoard, setShowBoard] = useState(false);

  useEffect(() => {
    volumeRef.current = volume;
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 100);
    return () => clearInterval(t);
  }, []);

  // ✅ Hook ennen returneja
  const picksByChoice = useMemo(() => {
    const result: Record<number, string[]> = {};
    const answers = reveal?.answers ?? [];

    for (const a of answers) {
      const idx = Number(a.choiceIndex);
      if (!Number.isFinite(idx)) continue;
      if (!result[idx]) result[idx] = [];
      if (a?.name) result[idx].push(String(a.name));
    }

    for (const k of Object.keys(result)) {
      result[Number(k)].sort((x, y) => x.localeCompare(y));
    }

    return result;
  }, [reveal]);

  useEffect(() => {
    if (!socket || !roomId) return;

    let tries = 0;
    const maxTries = 16; // 16 * 500ms = 8s

    const tick = () => {
      if (!socket) return;
      if (round) return; // jos round jo saatu, lopeta
      if (tries >= maxTries) return;

      tries += 1;
      socket.emit("game:sync", { roomId });
    };

    // heti + sitten 500ms välein kunnes round tulee
    tick();
    const t = window.setInterval(tick, 500);

    return () => window.clearInterval(t);
  }, [socket, roomId, round]);


  useEffect(() => {
    if (!socket || !roomId) return;

    const clearRoundTimers = () => {
      if (playTimerRef.current) window.clearTimeout(playTimerRef.current);
      if (stopTimerRef.current) window.clearTimeout(stopTimerRef.current);
      playTimerRef.current = null;
      stopTimerRef.current = null;
    };

    const stopAudioNow = () => {
      const a = audioRef.current;
      if (!a) return;
      a.pause();
      a.currentTime = 0;
    };

    const onRound = (payload: any) => {
      setFinished(false);
      setFinalScoreboard(null);

      setReveal(null);
      setPicked(null);
      setRound(payload);

      clearRoundTimers();
      stopAudioNow();

      const delay = Math.max(0, payload.startAt - Date.now());

      playTimerRef.current = window.setTimeout(async () => {
        const a = audioRef.current;
        if (!a) return;

        a.src = payload.audioUrl;
        a.volume = volumeRef.current;

        try {
          await a.play();
        } catch (e) {
          console.log("audio play blocked:", e);
        }

        stopTimerRef.current = window.setTimeout(() => {
          stopAudioNow();
        }, payload.clipMs);
      }, delay);
    };

    const onReveal = (payload: any) => {
      setReveal(payload);
      setScoreboard(payload.scoreboard ?? []);
    };

    const onFinished = (payload: any) => {
      setFinished(true);
      setFinalScoreboard(payload?.scoreboard ?? []);

      if (backTimerRef.current) window.clearTimeout(backTimerRef.current);

      backTimerRef.current = window.setTimeout(() => {
        router.replace(`/lobby/${roomId}`);
      }, 5000);
    };

    socket.on("game:round", onRound);
    socket.on("game:reveal", onReveal);
    socket.on("game:finished", onFinished);

    return () => {
      socket.off("game:round", onRound);
      socket.off("game:reveal", onReveal);
      socket.off("game:finished", onFinished);

      if (backTimerRef.current) window.clearTimeout(backTimerRef.current);
      if (playTimerRef.current) window.clearTimeout(playTimerRef.current);
      if (stopTimerRef.current) window.clearTimeout(stopTimerRef.current);
    };
  }, [socket, roomId, router]);

  const leaveToHome = () => {
    if (!socket) return;
    socket.emit("room:leave", { roomId }, () => {
      router.replace("/");
    });
  };

  // --- UI states ---
  if (!roomId || !socket) {
    return (
      <AppShell>
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/40 px-5 py-4">
          {!roomId ? "Loading…" : "Connecting…"}
        </div>
      </AppShell>
    );
  }

  // Yhteinen scoreboard data
  const boardData = finished && finalScoreboard ? finalScoreboard : scoreboard;

  // Desktop: fixed vasen scoreboard (ei vie playltä tilaa)
  const DesktopScoreboard = (
    <div className="hidden xl:block fixed left-6 top-24 w-72 z-30">
      <ScoreboardPanel scoreboard={boardData} mySocketId={socket.id ?? ""} />
    </div>
  );

  // Mobile/Tablet: bottom sheet scoreboard
  const MobileScoreboardButton = (
    <div className="mb-3 flex items-center justify-between xl:hidden">
      <button
        type="button"
        onClick={() => setShowBoard(true)}
        className="cursor-pointer rounded-xl border border-zinc-800 bg-zinc-950/40 px-3 py-2 text-sm hover:bg-zinc-900/50 active:scale-[0.99]"
      >
        Scoreboard
      </button>

      {/* pieni vihje */}
      <span className="text-xs text-zinc-500">Tap to view</span>
    </div>
  );

  const MobileScoreboardSheet = showBoard ? (
    <div className="fixed inset-0 z-50 xl:hidden">
      <button
        aria-label="Close scoreboard"
        className="absolute inset-0 bg-black/60"
        onClick={() => setShowBoard(false)}
      />
      <div className="absolute bottom-0 left-0 right-0 rounded-t-2xl border border-zinc-800 bg-zinc-950 p-4 shadow-2xl">
        <div className="mb-3 flex items-center justify-between">
          <div className="text-sm font-semibold">Scoreboard</div>
          <button
            className="cursor-pointer text-sm text-zinc-400 hover:text-zinc-200"
            onClick={() => setShowBoard(false)}
          >
            Close
          </button>
        </div>
        <ScoreboardPanel scoreboard={boardData} mySocketId={socket.id ?? ""} />
      </div>
    </div>
  ) : null;

  if (finished && finalScoreboard) {
    return (
      <>
        {DesktopScoreboard}
        {MobileScoreboardSheet}

        <AppShell>
          {MobileScoreboardButton}

          <GameOverCard
            roomId={roomId}
            finalScoreboard={finalScoreboard}
            onBackNow={() => router.replace(`/lobby/${roomId}`)}
          />
        </AppShell>
      </>
    );
  }

  if (!round) {
    return (
      <>
        {DesktopScoreboard}
        {MobileScoreboardSheet}

        <AppShell>
          {MobileScoreboardButton}

          <div>
            <h2 className="text-2xl font-semibold tracking-tight">
              Waiting for round…
            </h2>
            <p className="mt-2 text-sm text-zinc-400">
              If nothing happens, go back to lobby and start a new game.
            </p>
          </div>
        </AppShell>
      </>
    );
  }

  const timeLeftMs = Math.max(0, round.startAt + round.answerWindowMs - now);
  const total = Math.max(1, round.answerWindowMs);
  const progress = 1 - Math.min(1, timeLeftMs / total);

  // Tässä disabled ohjaa “voiko enää vastata”
  const disabled = picked !== null || timeLeftMs <= 0;

  return (
    <>
      {DesktopScoreboard}
      {MobileScoreboardSheet}

      <AppShell>
        {MobileScoreboardButton}

        <audio ref={audioRef} />

        <PlayHeader
          roomId={roomId}
          timeLeftMs={timeLeftMs}
          progress={progress}
          volume={volume}
          setVolume={setVolume}
          onBack={leaveToHome}
        />

        <AnswersGrid
          choices={round.choices}
          disabled={disabled}
          picked={picked}
          reveal={reveal ? { correctIndex: reveal.correctIndex } : null}
          picksByChoice={reveal ? picksByChoice : null}
          onPick={(idx) => {
            setPicked(idx);
            socket.emit("answer:submit", {
              roomId,
              roundId: round.roundId,
              choiceIndex: idx,
              clientTimeMs: Date.now(),
            });
          }}
        />
      </AppShell>
    </>
  );
}
