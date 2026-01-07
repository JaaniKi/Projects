export type Category = {
  id: string;
  title: string;
  subtitle?: string;
  term: string;
  genres: string[]; // iTunes primaryGenreName -filtteriin
};

export const CATEGORIES: Category[] = [
  { id: "pop", title: "Pop", subtitle: "Hits & charts", term: "pop", genres: ["Pop"] },
  { id: "rock", title: "Rock", subtitle: "Classics & modern", term: "rock", genres: ["Rock"] },
  { id: "alt", title: "Alternative", subtitle: "Indie / alt", term: "alternative", genres: ["Alternative"] },
  { id: "indie", title: "Indie", subtitle: "Indie favorites", term: "indie", genres: ["Alternative"] },

  { id: "hiphop", title: "Hip-Hop/Rap", subtitle: "Rap & hip-hop", term: "hip hop", genres: ["Hip-Hop/Rap"] },
  { id: "trap", title: "Trap", subtitle: "Trap", term: "trap", genres: ["Hip-Hop/Rap"] },
  { id: "drill", title: "Drill", subtitle: "Drill", term: "drill", genres: ["Hip-Hop/Rap"] },

  { id: "rnb", title: "R&B/Soul", subtitle: "Smooth & soulful", term: "r&b", genres: ["R&B/Soul"] },
  { id: "soul", title: "Soul", subtitle: "Soul classics", term: "soul", genres: ["R&B/Soul"] },
  { id: "funk", title: "Funk", subtitle: "Groove", term: "funk", genres: ["R&B/Soul"] },

  { id: "dance", title: "Dance", subtitle: "Dancefloor", term: "dance", genres: ["Dance"] },
  { id: "edm", title: "EDM", subtitle: "Festival bangers", term: "edm", genres: ["Dance", "Electronic"] },
  { id: "electronic", title: "Electronic", subtitle: "Electronica", term: "electronic", genres: ["Electronic"] },
  { id: "house", title: "House", subtitle: "House vibes", term: "house", genres: ["Dance", "Electronic"] },
  { id: "techno", title: "Techno", subtitle: "Rave / techno", term: "techno", genres: ["Electronic", "Dance"] },
  { id: "trance", title: "Trance", subtitle: "Trance", term: "trance", genres: ["Dance", "Electronic"] },
  { id: "dubstep", title: "Dubstep", subtitle: "Bass", term: "dubstep", genres: ["Dance", "Electronic"] },

  { id: "metal", title: "Metal", subtitle: "Heavy", term: "metal", genres: ["Metal", "Rock"] },
  { id: "hardrock", title: "Hard Rock", subtitle: "Guitars", term: "hard rock", genres: ["Rock", "Metal"] },
  { id: "punk", title: "Punk", subtitle: "Punk / hardcore", term: "punk", genres: ["Rock", "Alternative"] },
  { id: "emo", title: "Emo", subtitle: "Emo / pop punk", term: "emo", genres: ["Alternative", "Rock"] },

  { id: "jazz", title: "Jazz", subtitle: "Jazz essentials", term: "jazz", genres: ["Jazz"] },
  { id: "blues", title: "Blues", subtitle: "Blue notes", term: "blues", genres: ["Blues"] },
  { id: "classical", title: "Classical", subtitle: "Orchestral", term: "classical", genres: ["Classical"] },

  { id: "country", title: "Country", subtitle: "Country", term: "country", genres: ["Country"] },
  { id: "folk", title: "Folk", subtitle: "Folk / acoustic", term: "folk", genres: ["Singer/Songwriter", "Country"] },
  { id: "singersongwriter", title: "Singer/Songwriter", subtitle: "Acoustic stories", term: "singer songwriter", genres: ["Singer/Songwriter"] },

  { id: "reggae", title: "Reggae", subtitle: "Reggae", term: "reggae", genres: ["Reggae"] },
  { id: "ska", title: "Ska", subtitle: "Ska", term: "ska", genres: ["Reggae"] },

  { id: "latin", title: "Latin", subtitle: "Latin hits", term: "latin", genres: ["Latino"] },
  { id: "reggaeton", title: "Reggaeton", subtitle: "Reggaeton", term: "reggaeton", genres: ["Latino"] },

  { id: "kpop", title: "K-Pop", subtitle: "Korea charts", term: "k-pop", genres: ["K-Pop"] },
  { id: "jpop", title: "J-Pop", subtitle: "Japan pop", term: "j-pop", genres: ["J-Pop"] },

  // Decades (ei genre-filtteriä -> genres: [])
  { id: "80s", title: "80s", subtitle: "80s hits", term: "1980s hits", genres: [] },
  { id: "90s", title: "90s", subtitle: "90s hits", term: "1990s hits", genres: [] },
  { id: "00s", title: "2000s", subtitle: "2000s hits", term: "2000s hits", genres: [] },
  { id: "10s", title: "2010s", subtitle: "2010s hits", term: "2010s hits", genres: [] },

  // Vibes / moods (usein toimii paremmin ilman tiukkaa genreä)
  { id: "party", title: "Party", subtitle: "Bangers", term: "party hits", genres: [] },
  { id: "chill", title: "Chill", subtitle: "Chill vibes", term: "chill", genres: [] },
];
