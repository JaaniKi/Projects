import { useMemo } from "react";

export function JoinCard({
  roomId,
  nameInput,
  setNameInput,
  onJoin,
  joinMsg,
  setNameDirty,
}: {
  roomId: string;
  nameInput: string;
  setNameInput: (v: string) => void;
  setNameDirty: (v: boolean) => void;
  onJoin: () => void;
  joinMsg: string | null;
}) {
  const hint = useMemo(() => "Please enter your name before joining:", []);

  return (
    <div>
      <h2 className="text-2xl font-semibold tracking-tight">Lobby</h2>
      <p className="mt-1 text-sm text-zinc-400">
        Room: <span className="font-mono text-zinc-200">{roomId}</span>
      </p>

      <p className="mt-4 text-sm text-zinc-300">{hint}</p>

      <div className="mt-3 flex gap-2">
        <input
          value={nameInput}
          onChange={(e) => {
            setNameDirty(true);
            setNameInput(e.target.value);
          }}
          maxLength={24}
          placeholder="Your name"
          className="w-full rounded-xl border border-zinc-800 bg-zinc-950/40 px-3 py-2 text-sm outline-none placeholder:text-zinc-500 focus:border-blue-500"
          onKeyDown={(e) => {
            if (e.key === "Enter") onJoin();
          }}
        />
        <button
          onClick={onJoin}
          className="shrink-0 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold hover:bg-blue-500 active:scale-[0.98]"
        >
          Join
        </button>
      </div>

      {joinMsg && (
        <div className="mt-3 rounded-xl border border-zinc-800 bg-zinc-950/40 px-3 py-2 text-sm text-amber-300">
          {joinMsg}
        </div>
      )}
    </div>
  );
}
