export function GameOverCard({
  roomId,
  finalScoreboard,
  onBackNow,
}: {
  roomId: string;
  finalScoreboard: any[];
  onBackNow: () => void;
}) {
  const winner = finalScoreboard?.[0];

  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">🏁 Game Over</h1>
          <p className="mt-1 text-sm text-zinc-400">
            Room: <span className="font-mono text-zinc-200">{roomId}</span>
          </p>
        </div>

        <button
          onClick={onBackNow}
          className="cursor-pointer rounded-xl bg-zinc-100 px-3 py-2 text-sm font-medium text-zinc-900 hover:bg-white active:scale-[0.98]"
        >
          Back now
        </button>
      </div>

      {winner && (
        <div className="mt-4 rounded-2xl border border-zinc-800 bg-zinc-950/40 p-4">
          <p className="text-sm text-zinc-300">
            Winner:{" "}
            <span className="font-semibold text-zinc-50">{winner.name}</span>{" "}
            <span className="text-zinc-500">•</span>{" "}
            <span className="font-mono text-zinc-200">{winner.score} pts</span>
          </p>
        </div>
      )}

      <div className="mt-6">
        <h2 className="text-lg font-semibold">Leaderboard</h2>
        <ol className="mt-3 space-y-2">
          {finalScoreboard.map((p: any, idx: number) => (
            <li
              key={p.socketId}
              className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-950/40 px-4 py-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-800 text-sm font-semibold">
                  {idx + 1}
                </span>
                <div className="truncate font-medium">{p.name}</div>
              </div>
              <div className="font-mono text-sm text-zinc-200">{p.score} pts</div>
            </li>
          ))}
        </ol>
      </div>

      <p className="mt-5 text-sm text-zinc-500">Returning to lobby…</p>
    </div>
  );
}
