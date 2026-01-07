"use client";

import { useEffect, useMemo, useState } from "react";
import { MIN_ROUNDS, MAX_ROUNDS } from "../../lib/gameConfig";
import { CATEGORIES } from "../../lib/categories";

export function HostSettings({
  roomId,
  state,
  socket,
  onStart,
}: {
  roomId: string;
  state: any;
  socket: any;
  onStart: () => void;
}) {
  const [query, setQuery] = useState<string>(state.config.categoryQuery ?? "");

  const [showAll, setShowAll] = useState(false);
  const visibleCats = showAll ? CATEGORIES : CATEGORIES.slice(0, 12);


  useEffect(() => {
    setQuery(state.config.categoryQuery ?? "");
  }, [state.config.categoryQuery]);

  const selectedId = state.config?.categoryId ?? null;

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return CATEGORIES.map((c) => c.title).slice(0, 10);
    return CATEGORIES.map((c) => c.title)
      .filter((t) => t.toLowerCase().includes(q))
      .slice(0, 10);
  }, [query]);

  // debounce: custom query -> server (tyhjennä genre-filtteri)
  useEffect(() => {
    if (!socket || !roomId) return;

    const t = window.setTimeout(() => {
      const trimmed = query.trim();
      if (!trimmed) return;

      socket.emit("room:configure", {
        roomId,
        config: {
          categoryQuery: trimmed,
          categoryId: null,
          categoryGenres: null, // 👈 custom search = ei genre-filteriä
        },
      });
    }, 300);

    return () => window.clearTimeout(t);
  }, [query, socket, roomId]);

  const pickCategory = (id: string) => {
    const cat = CATEGORIES.find((c) => c.id === id);
    if (!cat) return;

    setQuery(cat.term);

    socket.emit("room:configure", {
      roomId,
      config: {
        categoryId: cat.id,
        categoryQuery: cat.term,
        categoryGenres: cat.genres.length ? cat.genres : null,
      },
    });
  };

  return (
    <section className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-950/40 p-4">
      <h3 className="text-lg font-semibold">Settings</h3>

      <div className="mt-3 space-y-4">
        {/* Category */}
        <div>
          <span className="text-sm text-zinc-400">Category</span>

          {/* Presets grid */}
          <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {visibleCats.map((c) => {
              const active = selectedId === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => pickCategory(c.id)}
                  className={[
                    "cursor-pointer rounded-xl border px-3 py-2 text-left text-sm transition active:scale-[0.98]",
                    active
                      ? "border-blue-500 bg-blue-500/10 text-zinc-50"
                      : "border-zinc-800 bg-zinc-950/40 text-zinc-300 hover:bg-zinc-900/50",
                  ].join(" ")}
                >
                  <div className="font-semibold">{c.title}</div>
                  {c.subtitle ? (
                    <div className="text-xs text-zinc-500">{c.subtitle}</div>
                  ) : null}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => setShowAll((v) => !v)}
            className="mt-2 cursor-pointer text-sm text-zinc-300 underline decoration-zinc-700 underline-offset-4 hover:text-zinc-50"
          >
            {showAll ? "Show less" : "Show more"}
          </button>


          {/* Custom search */}
          <label className="mt-3 block">
            <span className="text-xs text-zinc-500">Custom search (artist / song / anything)</span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder='Try "kendrick", "finnish pop", "90s rock"…'
              className="mt-1 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm outline-none focus:border-blue-500"
              list="category-suggestions"
            />
            <datalist id="category-suggestions">
              {suggestions.map((s) => (
                <option key={s} value={s} />
              ))}
            </datalist>
          </label>
        </div>

        {/* Rounds */}
        <div>
          <div className="flex items-end justify-between">
            <span className="text-sm text-zinc-400">Rounds</span>
            <span className="text-sm font-mono text-zinc-200">{state.config.rounds}</span>
          </div>

          <input
            type="range"
            min={MIN_ROUNDS}
            max={MAX_ROUNDS}
            step={1}
            value={state.config.rounds}
            onChange={(e) => {
              socket.emit("room:configure", {
                roomId,
                config: { rounds: Number(e.target.value) },
              });
            }}
            className="cursor-pointer mt-2 w-full accent-blue-500"
          />

          <div className="mt-1 flex justify-between text-xs text-zinc-500">
            <span>{MIN_ROUNDS}</span>
            <span>{MAX_ROUNDS}</span>
          </div>
        </div>

        <button
          disabled={state.game?.phase === "PLAYING"}
          onClick={onStart}
          className="mt-2 w-full cursor-pointer rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.99]"
        >
          Start game
        </button>

        <p className="text-xs text-zinc-500">
          Tip: Share the invite link so others can join before starting.
        </p>
      </div>
    </section>
  );
}
