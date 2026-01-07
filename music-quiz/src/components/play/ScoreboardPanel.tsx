"use client";

export function ScoreboardPanel({
  scoreboard,
  mySocketId,
}: {
  scoreboard: any[];
  mySocketId: string;
}) {
  const sorted = [...(scoreboard ?? [])].sort((a: any, b: any) => (b.score ?? 0) - (a.score ?? 0));

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 shadow-xl backdrop-blur">
      <div className="flex items-baseline justify-between">
        <h3 className="text-lg font-semibold">Scoreboard</h3>
        <span className="text-xs text-zinc-400">{sorted.length} player{sorted.length === 1 ? "" : "s"}</span>
      </div>

      <div className="mt-4 space-y-2">
        {sorted.length === 0 ? (
          <div className="text-sm text-zinc-400">No scores yet.</div>
        ) : (
          sorted.map((p: any, i: number) => {
            const isMe = p.socketId === mySocketId;
            return (
              <div
                key={p.socketId ?? i}
                className={[
                  "flex items-center justify-between rounded-xl border px-3 py-2",
                  isMe ? "border-blue-500/40 bg-blue-500/10" : "border-zinc-800 bg-zinc-950/30",
                ].join(" ")}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="grid h-8 w-8 place-items-center rounded-lg bg-zinc-800/50 text-sm font-semibold">
                    {i + 1}
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium text-zinc-50">
                      {p.name} {isMe ? <span className="text-xs text-zinc-400">(You)</span> : null}
                    </div>
                  </div>
                </div>

                <div className="shrink-0 text-sm font-semibold">
                  {p.score ?? 0} <span className="text-xs font-normal text-zinc-400">pts</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
