export function RevealPanel({
  reveal,
  scoreboard,
  mySocketId,
}: {
  reveal: any | null;
  scoreboard: any[];
  mySocketId: string;
}) {
  if (!reveal) return null;

  return (
    <section className="mt-6 grid gap-4 lg:grid-cols-2">
      <div className="rounded-2xl border border-zinc-800 bg-zinc-950/40 p-4">
        <h3 className="text-lg font-semibold">Scoreboard</h3>
        <ol className="mt-3 space-y-2">
          {scoreboard.map((p: any, idx: number) => (
            <li
              key={p.socketId}
              className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-950/40 px-3 py-2"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-800 text-xs font-semibold">
                  {idx + 1}
                </span>
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium">
                    {p.name}
                    {p.socketId === mySocketId ? (
                      <span className="ml-2 text-xs text-zinc-500">(You)</span>
                    ) : null}
                  </div>
                </div>
              </div>
              <div className="font-mono text-sm text-zinc-200">{p.score} pts</div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
