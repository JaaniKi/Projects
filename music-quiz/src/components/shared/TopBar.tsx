"use client";

import { useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSocket } from "../../lib/useSocket";

export function TopBar() {
  const pathname = usePathname();
  const router = useRouter();
  const socket = useSocket();

  // tunnista roomId urlista: /lobby/ABC123 tai /play/ABC123
  const roomId = useMemo(() => {
    const m = pathname?.match(/^\/(lobby|play)\/([^/]+)/);
    return m?.[2] ?? null;
  }, [pathname]);

  const goHome = () => {
    // jos ollaan roomissa, poistutaan ensin
    if (roomId && socket) {
      socket.emit("room:leave", { roomId }, () => {
        router.replace("/");
      });
      return;
    }
    router.replace("/");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/70 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <button
          onClick={goHome}
          className="cursor-pointer inline-flex items-center gap-2 rounded-xl px-2 py-1 hover:bg-zinc-900/50 active:scale-[0.99]"
          aria-label="Go to main menu"
          title="Main menu"
        >
          <div className="grid h-9 w-9 place-items-center rounded-xl border border-zinc-800 bg-zinc-900/60">
            🎵
          </div>
          <div className="leading-tight text-left">
            <div className="text-sm font-semibold tracking-wide text-zinc-100">
              MUSIC QUIZ
            </div>
            <div className="text-xs text-zinc-500">
              {roomId ? `Room ${roomId}` : "Main menu"}
            </div>
          </div>
        </button>

        <div className="text-xs text-zinc-500">
          {pathname?.startsWith("/play") ? "Playing" : pathname?.startsWith("/lobby") ? "Lobby" : ""}
        </div>
      </div>
    </header>
  );
}
