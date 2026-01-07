import React from "react";

export function LobbyShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-full grid place-items-center p-6">
      <main className="w-full max-w-xl">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 shadow-xl backdrop-blur">
          {children}
        </div>
      </main>
    </div>
  );
}
