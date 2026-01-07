import React from "react";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-full grid place-items-center p-6">
      <main className="w-full max-w-3xl">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 shadow-xl backdrop-blur">
          {children}
        </div>
      </main>
    </div>
  );
}
