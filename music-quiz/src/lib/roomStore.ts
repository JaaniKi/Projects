// src/lib/roomStore.ts

export type Player = { name: string; score: number };
export type Track = { id: string; title: string; artist: string; previewUrl: string; genre?: string };

export type Config = {
    categoryQuery: string;
    categoryId: string | null;
    categoryGenres: string[] | null;

    rounds: number;
    clipMs: number;
    answerWindowMs: number;
};

export type Question = {
    correct: Track;
    choices: Track[];
    correctIndex: number;
};

export type GameState = {
    phase: "PLAYING" | "FINISHED";
    currentRound: number;
    roundId: string;
    question: Question;
    startAt: number;
    clipMs: number;
    answerWindowMs: number;
    answers: Record<string, { choiceIndex: number; receivedAt: number; clientTimeMs?: number }>;
};

export type Room = {
    id: string;
    hostSocketId: string;
    players: Record<string, Player>;
    config: Config;
    trackPool: Track[];
    usedTrackIds: Set<string>;
    game: GameState | null;
};

const _rooms = new Map<string, Room>();

export const rooms = {
    create(roomId: string, hostSocketId: string) {
        const room: Room = {
            id: roomId,
            hostSocketId,
            players: {}, // tyhjä aluksi (host liittyy myöhemmin nimellä)
            config: {
                categoryQuery: "rock",
                categoryId: null,
                categoryGenres: null,

                rounds: 10,
                clipMs: 10000,
                answerWindowMs: 10000,
            },

            trackPool: [],
            usedTrackIds: new Set<string>(),
            game: null,
        };

        _rooms.set(roomId, room);
    },

    get(roomId: string) {
        return _rooms.get(roomId);
    },

    join(roomId: string, socketId: string, name: string) {
        const r = _rooms.get(roomId);
        if (!r) return false;

        const trimmed = String(name ?? "").trim().slice(0, 24) || "Player";
        r.players[socketId] = { name: trimmed, score: 0 };
        return true;
    },

    leave(roomId: string, socketId: string) {
        const r = _rooms.get(roomId);
        if (!r) return false;

        if (r.players[socketId]) {
            delete r.players[socketId];
        }

        // jos peli käynnissä, poista myös vastaus ettei jää "haamuvastauksia"
        if (r.game) {
            delete r.game.answers[socketId];
        }

        // jos host lähti, siirrä host tai poista huone
        if (r.hostSocketId === socketId) {
            const newHost = Object.keys(r.players)[0];
            if (newHost) r.hostSocketId = newHost;
            else _rooms.delete(roomId);
        }

        return true;
    },


    leaveAny(socketId: string) {
        for (const [id] of _rooms) {
            const r = _rooms.get(id);
            if (!r) continue;
            if (r.players[socketId]) {
                this.leave(id, socketId);
                return id;
            }
        }
        return null;
    },


    configure(roomId: string, patch: Partial<Config>) {
        const r = _rooms.get(roomId);
        if (!r) return;
        r.config = { ...r.config, ...patch };
    },

    startGame(roomId: string) {
        const r = _rooms.get(roomId);
        if (!r) return;

        for (const p of Object.values(r.players)) p.score = 0;
        r.usedTrackIds = new Set<string>();
        r.game = null;
    },

    setTrackPool(roomId: string, tracks: Track[]) {
        const r = _rooms.get(roomId);
        if (!r) return;
        r.trackPool = tracks;
    },

    beginRound(
        roomId: string,
        payload: { roundId: string; question: Question; startAt: number; answerWindowMs: number; clipMs: number }
    ) {
        const r = _rooms.get(roomId);
        if (!r) return;

        r.game = {
            phase: "PLAYING",
            currentRound: r.game?.currentRound ?? 0,
            roundId: payload.roundId,
            question: payload.question,
            startAt: payload.startAt,
            answerWindowMs: payload.answerWindowMs,
            clipMs: payload.clipMs,
            answers: {},
        };
    },

    scoreboard(roomId: string) {
        const r = _rooms.get(roomId);
        if (!r) return [];

        return Object.entries(r.players)
            .map(([sid, p]) => ({ socketId: sid, name: p.name, score: p.score }))
            .sort((a, b) => b.score - a.score);
    },

    publicState(roomId: string) {
        const r = _rooms.get(roomId);
        if (!r) return null;

        const players = Object.entries(r.players).map(([sid, p]) => ({
            socketId: sid,
            name: p.name,
            score: p.score,
        }));

        return {
            roomId: r.id,
            hostSocketId: r.hostSocketId,
            players,
            scoreboard: [...players].sort((a, b) => b.score - a.score),
            config: r.config,
            game: r.game ? { phase: r.game.phase, currentRound: r.game.currentRound, roundId: r.game.roundId } : null,
        };
    },
};
