"use client";

type Choice = { title: string; artist: string };

export function AnswersGrid({
  choices,
  disabled,
  picked,
  onPick,
  reveal,
  picksByChoice,
}: {
  choices: Choice[];
  disabled: boolean;
  picked: number | null;
  onPick: (idx: number) => void;
  reveal: null | { correctIndex: number };
  picksByChoice?: null | Record<number, string[]>;
}) {
  return (
    <section className="mt-5 sm:mt-6">
      <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
        {choices.map((c, idx) => {
          const isReveal = !!reveal;
          const isPicked = picked === idx;

          const isCorrect = isReveal && reveal!.correctIndex === idx;
          const isWrongPicked = isReveal && isPicked && !isCorrect;

          // Ennen revealia: kun valittu, himmennä muut
          const lockedPreReveal = picked !== null && !isReveal;
          const dim = lockedPreReveal && !isPicked;

          // borderit: EI mitään “valkoista hohtoa” muille
          const borderClass = isCorrect
            ? "border-emerald-500"
            : isWrongPicked
            ? "border-rose-500"
            : !isReveal && isPicked
            ? "border-blue-500"
            : "border-zinc-800";

          // hehku vain oikealle/väärälle (jos haluat)
          const shadowClass = isCorrect
            ? "shadow-[0_0_20px_rgba(16,185,129,0.30)]"
            : isWrongPicked
            ? "shadow-[0_0_18px_rgba(244,63,94,0.22)]"
            : "shadow-none";

          const bgClass = !isReveal && isPicked ? "bg-blue-500/10" : "bg-zinc-950/40";

          const names = picksByChoice?.[idx] ?? [];
          const showNames = isReveal && names.length > 0;

          return (
            <button
              key={`${c.title}-${c.artist}-${idx}`}
              type="button"
              className={[
                // peukaloystävällinen mobiilissa
                "cursor-pointer rounded-2xl border-2 p-4 text-left transition focus:outline-none active:scale-[0.99]",
                "min-h-[84px] sm:min-h-[96px]",
                borderClass,
                shadowClass,
                bgClass,
                !isReveal ? "hover:bg-zinc-900/50" : "",
                dim ? "opacity-45" : "",
                // disabled vain ennen revealia (että revealissä värit näkyy)
                disabled && !isReveal ? "cursor-not-allowed opacity-60" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              disabled={disabled}
              onClick={() => {
                // Estä lisäklikkailu: ensimmäinen valinta lukitsee
                if (disabled) return;
                if (picked !== null) return;
                onPick(idx);
              }}
            >
              <div className="min-w-0">
                <div className="truncate text-base font-semibold text-zinc-50">
                  {c.title}
                </div>
                <div className="mt-1 truncate text-sm text-zinc-400">
                  {c.artist}
                </div>
              </div>

              {/* Nimet vain jos joku valitsi tämän (ei “No picks”) */}
              {showNames && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {names.slice(0, 12).map((name) => (
                    <span
                      key={`${idx}-${name}`}
                      className="rounded-full border border-zinc-700 bg-zinc-900 px-2 py-0.5 text-xs text-zinc-200"
                    >
                      {name}
                    </span>
                  ))}
                  {names.length > 12 && (
                    <span className="rounded-full border border-zinc-700 bg-zinc-900 px-2 py-0.5 text-xs text-zinc-300">
                      +{names.length - 12}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}
