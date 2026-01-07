"use client";

export function PlayHeader({
  roomId,
  timeLeftMs,
  progress,
  volume,
  setVolume,
  roundLabel,
  onBack,
}: {
  roomId: string;
  timeLeftMs: number;
  progress: number; // 0..1
  volume: number;
  setVolume: (v: number) => void;
  roundLabel?: string;
  onBack?: () => void;
}) {
  const secs = Math.max(0, timeLeftMs) / 1000;

  return (
    <header className="flex flex-col gap-3">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="cursor-pointer mt-0.5 rounded-xl border border-zinc-800 bg-zinc-950/40 px-3 py-2 text-sm font-medium text-zinc-200 hover:bg-zinc-900/50 active:scale-[0.98]"
              aria-label="Back to menu"
              title="Back to menu"
            >
              ←
            </button>
          )}

          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Play</h2>
            <p className="mt-1 text-sm text-zinc-400">
              Room: <span className="font-mono text-zinc-200">{roomId}</span>
              {roundLabel ? (
                <span className="ml-2 text-zinc-500">• {roundLabel}</span>
              ) : null}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-full border border-zinc-800 bg-zinc-950/40 px-3 py-1.5 text-sm font-medium">
            {secs.toFixed(1)}s
          </div>

          <div className="flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-950/40 px-3 py-1.5">
            <span className="text-sm">🔊</span>
            <input
              className="cursor-pointer w-24"
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              aria-label="Volume"
            />
          </div>
        </div>
      </div>

      <div className="h-2 w-full overflow-hidden rounded-full border border-zinc-800 bg-zinc-950/40">
        <div
          className="h-full rounded-full bg-blue-600 transition-[width] duration-100"
          style={{ width: `${Math.max(0, Math.min(1, progress)) * 100}%` }}
        />
      </div>
    </header>
  );
}
