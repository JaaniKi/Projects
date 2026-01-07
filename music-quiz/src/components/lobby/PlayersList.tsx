export function PlayersList({
  players,
  mySocketId,
  finished,
  titleOverride,
  showScores = true,
}: {
  players: any[];
  mySocketId: string;
  finished: boolean;
  titleOverride?: string;
  showScores?: boolean;
}) {
  const sorted = [...(players ?? [])].sort(
    (a: any, b: any) => (b.score ?? 0) - (a.score ?? 0)
  );

  const title = titleOverride ?? (finished ? "Leaderboard" : "Players");

  return (
    <section className="mt-6">
      <div className="flex items-end justify-between gap-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <span className="text-sm text-zinc-400">
          {sorted.length} player{sorted.length === 1 ? "" : "s"}
        </span>
      </div>

      <ol className="mt-3 space-y-2">
        {sorted.map((p: any, idx: number) => (
          <li
            key={p.socketId}
            className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-950/40 px-4 py-3"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-800 text-sm font-semibold">
                {idx + 1}
              </span>
              <div>
                <div className="font-medium">{p.name}</div>
                <div className="text-xs text-zinc-500">
                  {p.socketId === mySocketId ? "You" : "\u00A0"}
                </div>
              </div>
            </div>

            {showScores && (
              <div className="font-mono text-sm text-zinc-200">
                {p.score ?? 0} pts
              </div>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}
