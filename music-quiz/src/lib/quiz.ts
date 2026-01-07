// src/lib/quiz.ts

export type Track = {
  id: string;
  title: string;
  artist: string;
  previewUrl: string;
  genre?: string;
};

export type Question = {
  correct: Track;
  choices: Track[];
  correctIndex: number;
};

export type RoomForQuiz = {
  trackPool: Track[];
  usedTrackIds: Set<string>;
};

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function buildQuestion(room: RoomForQuiz): Question {
  // varmista että poolissa on jotain
  if (!room.trackPool || room.trackPool.length < 4) {
    throw new Error("Track pool is too small to build a question");
  }

  // jos käytetyt alkaa loppua, nollaa
  const available = room.trackPool.filter((t) => !room.usedTrackIds.has(t.id));
  if (available.length < 4) {
    room.usedTrackIds = new Set<string>();
  }

  const fresh = room.trackPool.filter((t) => !room.usedTrackIds.has(t.id));
  const correct = pickRandom(fresh.length ? fresh : room.trackPool);
  room.usedTrackIds.add(correct.id);

  // distractorit: mieluiten sama genre
  const sameGenre = room.trackPool.filter(
    (t) =>
      t.id !== correct.id &&
      !!t.genre &&
      !!correct.genre &&
      t.genre === correct.genre
  );

  const distractorPool = (sameGenre.length >= 3 ? sameGenre : room.trackPool).filter(
    (t) => t.id !== correct.id
  );

  const distractors: Track[] = [];
  // varmistetaan ettei tule duplikaatteja
  while (distractors.length < 3) {
    if (distractorPool.length === 0) break;

    const d = pickRandom(distractorPool);
    if (!distractors.some((x) => x.id === d.id)) distractors.push(d);

    // turvajarru (ettei jää ikuisesti looppaamaan)
    if (distractors.length < 3 && distractors.length + 1 > room.trackPool.length) break;
  }

  // fallback jos distractoreita ei saatu tarpeeksi (esim. pool liian pieni / geneerinen)
  if (distractors.length < 3) {
    const fallback = room.trackPool.filter(
      (t) => t.id !== correct.id && !distractors.some((x) => x.id === t.id)
    );
    while (distractors.length < 3 && fallback.length > 0) {
      const d = pickRandom(fallback);
      distractors.push(d);
      // poista valittu fallbackista ettei tule duplikaatteja
      const idx = fallback.findIndex((x) => x.id === d.id);
      if (idx >= 0) fallback.splice(idx, 1);
    }
  }

  // viimeinen varmistus: aina 4 vaihtoehtoa
  const rawChoices = [correct, ...distractors].slice(0, 4);
  const choices = shuffle(rawChoices);

  const correctIndex = choices.findIndex((c) => c.id === correct.id);
  if (correctIndex < 0) {
    throw new Error("Correct track missing from choices (should never happen)");
  }

  return { correct, choices, correctIndex };
}

export function scoreAnswer(params: {
  receivedAt: number;
  startAt: number;
  answerWindowMs: number;
}): number {
  const base = 500;
  const elapsed = Math.max(0, params.receivedAt - params.startAt);
  const timeLeft = Math.max(0, params.answerWindowMs - elapsed);
  const speedBonus = Math.floor(500 * (timeLeft / params.answerWindowMs));
  return base + speedBonus; // 500..1000
}
