"use client";

export function LobbyHeader({
  roomId,
  onInvite,
  copied,
  onBack,
}: {
  roomId: string;
  onInvite?: () => void;
  copied?: boolean;
  onBack?: () => void;
}) {
  return (
    <div>
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
            <h2 className="text-2xl font-semibold tracking-tight">Lobby</h2>
            <p className="mt-1 text-sm text-zinc-400">
              Room: <span className="font-mono text-zinc-200">{roomId}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onInvite && (
            <button
              onClick={onInvite}
              className="cursor-pointer rounded-xl bg-zinc-100 px-3 py-2 text-sm font-medium text-zinc-900 hover:bg-white active:scale-[0.98]"
            >
              Invite
            </button>
          )}
        </div>
      </div>

      {copied && <p className="mt-2 text-sm text-emerald-400">✅ Copied!</p>}
    </div>
  );
}
