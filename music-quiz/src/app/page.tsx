"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useSocket } from "../lib/useSocket";

const NAME_KEY = "musicquiz:name";

export default function Home() {
  const router = useRouter();
  const socket = useSocket();

  const [name, setName] = useState(() => {
    if (typeof window === "undefined") return "";
    return localStorage.getItem(NAME_KEY) ?? "";
  });

  const [roomCode, setRoomCode] = useState("");
  const [busy, setBusy] = useState<"create" | "join" | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  const normalizedCode = useMemo(
    () => roomCode.trim().toUpperCase().replace(/\s+/g, ""),
    [roomCode]
  );

  const persistName = () => {
    const trimmed = name.trim().slice(0, 24);
    if (!trimmed) return null;
    localStorage.setItem(NAME_KEY, trimmed);
    return trimmed;
  };

  const createRoom = () => {
    if (!socket) return;

    setMsg(null);
    const saved = persistName();
    if (!saved) {
      setMsg("Please enter your name first.");
      return;
    }

    setBusy("create");
    socket.emit("room:create", {}, (resp: any) => {
      setBusy(null);

      const roomId = resp?.roomId;
      if (roomId) {
        router.replace(`/lobby/${roomId}`);
        return;
      }

      setMsg("Could not create room.");
    });
  };

  const joinRoom = () => {
    setMsg(null);
    const saved = persistName();
    if (!saved) {
      setMsg("Please enter your name first.");
      return;
    }

    const code = normalizedCode;
    if (!code) {
      setMsg("Enter a room code.");
      return;
    }

    setBusy("join");
    router.replace(`/lobby/${code}`);
  };

  return (
    <div className="min-h-screen text-zinc-50">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 bg-zinc-950" />
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(65%_55%_at_50%_0%,rgba(59,130,246,0.22),transparent_60%)]" />
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(55%_45%_at_90%_20%,rgba(16,185,129,0.14),transparent_55%)]" />

      <main className="relative mx-auto flex min-h-screen max-w-5xl items-center justify-center p-6">
        <div className="w-full">
          {/* Header */}
          <div className="flex items-center justify-between gap-4">
            {/* mahdollinen header */}
          </div>

          {/* Hero + Card */}
          <div className="mt-10 grid gap-6 lg:grid-cols-2 lg:items-center">
            {/* Hero */}
            <div>
              <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                Guess the song.
                <span className="block text-zinc-300">Beat your friends.</span>
              </h1>

              <p className="mt-4 max-w-xl text-base leading-relaxed text-zinc-400">
                Create a room, invite friends and race to identify songs.
              </p>


            </div>

            {/* Start Card */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 shadow-xl backdrop-blur">
              <h2 className="text-lg font-semibold">Start playing</h2>
              <p className="mt-1 text-sm text-zinc-400">
                Enter your name, then create or join a room.
              </p>

              <div className="mt-5 space-y-3">
                <label className="block">
                  <span className="text-sm text-zinc-400">Your name</span>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={24}
                    placeholder="Your name"
                    className="mt-1 w-full rounded-xl border border-zinc-800 bg-zinc-950/40 px-3 py-2.5 text-sm outline-none placeholder:text-zinc-600 focus:border-blue-500"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") createRoom();
                    }}
                  />
                </label>

                <button
                  onClick={createRoom}
                  disabled={!socket || busy !== null}
                  className="w-full cursor-pointer rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.99]"
                >
                  {busy === "create" ? "Creating…" : "Create room"}
                </button>

                <div className="flex items-center gap-3">
                  <div className="h-px flex-1 bg-zinc-800" />
                  <span className="text-xs text-zinc-500">or</span>
                  <div className="h-px flex-1 bg-zinc-800" />
                </div>

                <div className="flex gap-2">
                  <input
                    value={roomCode}
                    onChange={(e) => setRoomCode(e.target.value)}
                    placeholder="ROOM CODE"
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950/40 px-3 py-2.5 text-sm uppercase tracking-widest outline-none placeholder:text-zinc-600 focus:border-blue-500"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") joinRoom();
                    }}
                  />
                  <button
                    onClick={joinRoom}
                    disabled={busy !== null}
                    className="shrink-0 cursor-pointer rounded-xl border border-zinc-800 bg-zinc-950/40 px-4 py-2.5 text-sm font-semibold hover:bg-zinc-900/50 disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.99]"
                  >
                    Join
                  </button>
                </div>

                {msg && (
                  <div className="rounded-xl border border-zinc-800 bg-zinc-950/40 px-3 py-2 text-sm text-amber-300">
                    {msg}
                  </div>
                )}

                {!socket && (
                  <div className="rounded-xl border border-zinc-800 bg-zinc-950/40 px-3 py-2 text-sm text-zinc-400">
                    Connecting…
                  </div>
                )}

              </div>
            </div>
          </div>

          {/* How to play */}
          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5 backdrop-blur">
              <div className="flex items-start gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl border border-zinc-800 bg-zinc-950/40">
                  1
                </div>
                <div>
                  <h3 className="font-semibold">Create or join</h3>
                  <p className="mt-1 text-sm text-zinc-400">
                    Enter your name, create a room, or join with a room code.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5 backdrop-blur">
              <div className="flex items-start gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl border border-zinc-800 bg-zinc-950/40">
                  2
                </div>
                <div>
                  <h3 className="font-semibold">Listen & answer</h3>
                  <p className="mt-1 text-sm text-zinc-400">
                    A short preview plays. Pick the correct song as fast as you can.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5 backdrop-blur">
              <div className="flex items-start gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl border border-zinc-800 bg-zinc-950/40">
                  3
                </div>
                <div>
                  <h3 className="font-semibold">Score & win</h3>
                  <p className="mt-1 text-sm text-zinc-400">
                    Points are based on speed and correctness. Top of the leaderboard wins.
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* Footer */}
          <div className="mt-10 flex flex-col gap-2 text-xs text-zinc-600 sm:flex-row sm:items-center sm:justify-between">
            <span>Made with Next.js + Socket.IO</span>
            <span className="text-zinc-600">Have fun 🎶</span>
          </div>
        </div>
      </main>
    </div>
  );
}
