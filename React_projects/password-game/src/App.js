import { useState, useEffect } from "react";
import "./App.css";
import RuleBox from "./components/RuleBox";
import puliImg from "./assets/images/puli.jpg";

function App() {
  const [password, setPassword] = useState("");
  const [visibleRuleCount, setVisibleRuleCount] = useState(1);
  const [justCompletedId, setJustCompletedId] = useState(null); // animaatiota varten

  const [hasWon, setHasWon] = useState(false);
  const [confirmStep, setConfirmStep] = useState("none");
  // "none" | "retype" | "success"

  const passwordLocked = confirmStep === "retype" || confirmStep === "success";




  const [finalTargetPassword, setFinalTargetPassword] = useState("");
  const [retypeValue, setRetypeValue] = useState("");
  const [retypeError, setRetypeError] = useState("");
  const [isPasswordLocked, setIsPasswordLocked] = useState(false);


  // finnish Cities words list
  const FinnishCities = [
    "Helsinki", "Espoo", "Vantaa", "Turku", "Tampere", "Oulu", "Lahti",
    "Kuopio", "Jyväskylä", "Pori", "Lappeenranta", "Vaasa", "Seinäjoki",
    "Rovaniemi", "Mikkeli", "Kotka", "Hämeenlinna", "Porvoo", "Joensuu",
    "Kajaani", "Kokkola", "Rauma", "Salo", "Iisalmi", "Varkaus",
    "Raisio", "Imatra", "Kemi", "Savonlinna", "Heinola",
    "Nokia", "Ylöjärvi", "Kangasala", "Riihimäki",
    "Raasepori", "Valkeakoski", "Forssa", "Äänekoski", "Loimaa",
    "Akaa", "Raahe", "Tornio", "Pieksämäki", "Orimattila",
    "Parkano", "Keuruu", "Uusikaupunki"
  ];
  // Poista rivinvaihdot (ja emoji-variation selectorin varmuudeksi)
  const normalizePassword = (s) =>
    s.replace(/\r?\n/g, "").replace(/\uFE0F/g, "");


  // maze
  const [mazeSymbol] = useState(() => {
    const symbols = ["@", "#", "$", "%", "&", "?", "!", "§", "*", "+", "~"];
    const idx = Math.floor(Math.random() * symbols.length);
    return symbols[idx];
  });
  const [mazeSolved, setMazeSolved] = useState(false);

  // dog breed
  const dogPicture = "https://www.monkoodog.com/wp-content/uploads/2020/03/Perfect-Hypoallergenic-Long-coat-Dog-breeds-for-Dog-Lovers.jpg";
  const dogBreed = "puli";

  // music note
  const [musicNote] = useState(() => {
    const notes = ["C", "D", "E"];
    const idx = Math.floor(Math.random() * notes.length);
    return notes[idx];
  });

  const [morseWord] = useState(() => {
    const options = ["apple", "dog", "sun", "radio", "train", "house", "computer", "keyboard", "javascript", "puzzle", "galaxy", "universe"];
    return options[Math.floor(Math.random() * options.length)];
  });

  function randomFibonacciStart() {
    const starts = [
      [1, 1, 2, 3, 5],
      [3, 5, 8, 13, 21],
      [5, 8, 13, 21, 34],
    ];
    return starts[Math.floor(Math.random() * starts.length)];
  }

  function toRoman(num) {
    const map = [
      { value: 1000, symbol: "M" },
      { value: 900, symbol: "CM" },
      { value: 500, symbol: "D" },
      { value: 400, symbol: "CD" },
      { value: 100, symbol: "C" },
      { value: 90, symbol: "XC" },
      { value: 50, symbol: "L" },
      { value: 40, symbol: "XL" },
      { value: 10, symbol: "X" },
      { value: 9, symbol: "IX" },
      { value: 5, symbol: "V" },
      { value: 4, symbol: "IV" },
      { value: 1, symbol: "I" },
    ];

    let result = "";
    let remaining = num;

    for (const { value, symbol } of map) {
      while (remaining >= value) {
        result += symbol;
        remaining -= value;
      }
    }
    return result;
  }

  // laske numeromerkkien (0–9) summa annetusta merkkijonosta
  function digitSumFromString(s) {
    return s
      .replace(/\D/g, "")
      .split("")
      .reduce((sum, ch) => sum + Number(ch), 0);
  }

  // roomalaisten merkkien arvo (I=1, V=5, X=10 jne.)
  function romanCharValue(ch) {
    switch (ch) {
      case "I": return 1;
      case "V": return 5;
      case "X": return 10;
      case "L": return 50;
      case "C": return 100;
      case "D": return 500;
      case "M": return 1000;
      default: return 0;
    }
  }

  function sumRomanString(str) {
    const upper = str.toUpperCase();
    let total = 0;
    for (const ch of upper) {
      total += romanCharValue(ch);
    }
    return total;
  }

  function getDaysUntilNextBirthday(month, day) {
    const now = new Date();
    const currentYear = now.getFullYear();

    // seuraavan syntymäpäivän päivämäärä
    let next = new Date(currentYear, month - 1, day);

    // jos tämän vuoden synttärit menivät jo → käytä ensi vuotta
    if (next < now) {
      next = new Date(currentYear + 1, month - 1, day);
    }

    // Laske erotus päivissä
    const diffMs = next - now;
    return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  }

  const niiloBirthdayDays = getDaysUntilNextBirthday(7, 17); // 17. heinäkuuta


  const [fibSequence] = useState(() => randomFibonacciStart());
  const nextFib = fibSequence[3] + fibSequence[4];
  const nextFibRoman = toRoman(nextFib);


  const zodiacSigns = [
    { name: "aries", emoji: "♈", start: [3, 21], end: [4, 19] },
    { name: "taurus", emoji: "♉", start: [4, 20], end: [5, 20] },
    { name: "gemini", emoji: "♊", start: [5, 21], end: [6, 20] },
    { name: "cancer", emoji: "♋", start: [6, 21], end: [7, 22] },
    { name: "leo", emoji: "♌", start: [7, 23], end: [8, 22] },
    { name: "virgo", emoji: "♍", start: [8, 23], end: [9, 22] },
    { name: "libra", emoji: "♎", start: [9, 23], end: [10, 22] },
    { name: "scorpio", emoji: "♏", start: [10, 23], end: [11, 21] },
    { name: "sagittarius", emoji: "♐", start: [11, 22], end: [12, 21] },
    { name: "capricorn", emoji: "♑", start: [12, 22], end: [1, 19] },
    { name: "aquarius", emoji: "♒", start: [1, 20], end: [2, 18] },
    { name: "pisces", emoji: "♓", start: [2, 19], end: [3, 20] },
  ];

  function getTodayZodiac() {
    const now = new Date();
    const month = now.getMonth() + 1;
    const day = now.getDate();

    const check = (m, d, start, end) => {
      if (start[0] === end[0]) {
        // same month
        return m === start[0] && d >= start[1] && d <= end[1];
      }
      // ranges across months
      return (
        (m === start[0] && d >= start[1]) ||
        (m === end[0] && d <= end[1])
      );
    };

    for (const z of zodiacSigns) {
      if (check(month, day, z.start, z.end)) return z;
    }

    return zodiacSigns[0]; // fallback aries
  }

  const [todayZodiac] = useState(() => getTodayZodiac());



  function getRandomSnakeWord() {
    const candidates = [
      "extraterrestrial",
      "cybersecurity",
      "hypersensitive",
      "discombobulated",
      "unbelievable",
      "thunderstorming",
      "brainstorming",
      "transportation",
      "misunderstood",
      "environmental",
      "mathematical",
      "communication",
      "imagination",
      "overconfident",
      "international",
      "responsibility",
      "unpredictable",
      "knowledgeable",
      "determination",
      "grandmotherly",
      "underestimate",
      "supercomputer",
      "microbiology",
      "lightningbolt",
      "cryptography",
      "bioluminescent",
      "interstellar",
    ];
    const idx = Math.floor(Math.random() * candidates.length);
    return candidates[idx];
  };

  const [snakeWord, setSnakeWord] = useState(() => getRandomSnakeWord());

  // moving cucumber mopeds
  const [passingTarget] = useState(() => {
    // numerot jotka halutaan sallia
    const allowed = [10, 11, 12, 13, 14, 15, 16, 17, 18, 20];

    // valitaan yksi sallituista
    const idx = Math.floor(Math.random() * allowed.length);
    return allowed[idx];
  });

  // frozen word
  const [frozenWord] = useState(() => {
    const words = [
      "❄️", "🔥", "🌙", "⭐", "☁️", "🌧️", "🌩️", "🌪️",
      "🌊", "🍃", "🌱", "🌵", "🌼", "🍂",
      "🎲", "🔑", "🧩", "📦", "🎈",
      "⚡", "✨", "💫", "🌟",
      "🔮", "🪄", "💀", "☠️", "🤡", "🤠",
      "🍀", "🪨", "🌋",
      "🐚", "🦋"
    ];

    const i = Math.floor(Math.random() * words.length);
    return words[i];
  });

  // ASCII-summa-puzzle (esim. K + A + T -> 224)
  const [asciiPuzzle] = useState(() => {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const count = 3 + Math.floor(Math.random() * 3); // 3–5 kirjainta

    const letters = [];
    for (let i = 0; i < count; i++) {
      const ch = alphabet[Math.floor(Math.random() * alphabet.length)];
      letters.push(ch);
    }

    const sum = letters.reduce((acc, ch) => acc + ch.charCodeAt(0), 0);

    return { letters, sum };
  });



  const [pokemon] = useState(() => {
    const options = [
      { name: "Bulbasaur", type: "grass", id: 1 },
      { name: "Charmander", type: "fire", id: 4 },
      { name: "Squirtle", type: "water", id: 7 },
      { name: "Pikachu", type: "electric", id: 25 },
    ];
    const idx = Math.floor(Math.random() * options.length);
    return options[idx];
  });

  // game start time (hour + minutes as numbers)
  const [startTime] = useState(() => {
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();

    return {
      hour,
      minute,
      hourStr: hour.toString().padStart(2, "0"),
      minuteStr: minute.toString().padStart(2, "0"),
    };
  });

  const startHourRoman = toRoman(startTime.hour);
  const startMinuteRoman = toRoman(startTime.minute);

  // flag
  const [flagCountry, setFlagCountry] = useState(null); // esim. "Sweden"
  const [flagUrl, setFlagUrl] = useState(null);         // lipun kuva

  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all?fields=name,flags,independent")
      .then((res) => res.json())
      .then((data) => {
        if (!Array.isArray(data) || data.length === 0) return;

        const valid = data.filter((c) => {
          const name = c?.name?.common;
          const flag = c?.flags?.svg || c?.flags?.png;
          const independent = c?.independent;

          return (
            name &&
            flag &&
            independent !== false &&        // 🔥 pudottaa Bouvet Islandin ym.
            /^[A-Za-z ]+$/.test(name)
          );
        });

        if (valid.length === 0) return;

        const idx = Math.floor(Math.random() * valid.length);
        const picked = valid[idx];

        const name = picked.name.common;
        const flag = picked.flags.svg || picked.flags.png;

        setFlagCountry(name);
        setFlagUrl(flag);

      })
      .catch((err) => {
        console.error("Failed to fetch country flags", err);
      });
  }, []);

  // 🔢 LASKETTU SALASANAN NUMEROTAVOITE
  const mandatoryDigitSum =
    digitSumFromString(niiloBirthdayDays.toString()) +
    digitSumFromString(passingTarget.toString()) +
    digitSumFromString(asciiPuzzle.sum.toString()) +
    digitSumFromString(nextFib.toString()) +
    digitSumFromString(startTime.minuteStr);

  const [digitTarget] = useState(() => mandatoryDigitSum + 5);
  // +5 → pelaajan täytyy keksiä vielä lisää numeroita


  // 🔢 Random yhtälö, jossa ratkaistaan x ja kirjoitetaan x roomalaisilla
  const [romanEquation] = useState(() => {
    const options = [
      { question: "x + 7 = 19", value: 12 },
      { question: "3 × x = 27", value: 9 },
      { question: "40 - x = 13", value: 27 },
      { question: "2x + 5 = 17", value: 6 },
      { question: "5x = 35", value: 7 },
    ];
    const pick = options[Math.floor(Math.random() * options.length)];
    return {
      ...pick,
      roman: toRoman(pick.value), // esim. 12 -> XII
    };
  });

  // pakolliset roomalaiset: Fibonacci + x-yhtälö
  const mandatoryRomanSum =
    sumRomanString(nextFibRoman) +
    sumRomanString(romanEquation.roman);

  const [romanSumTarget] = useState(() => mandatoryRomanSum + 5);
  // +5 → pelaajan täytyy lisätä vähän ekstra-roomalaisia

  const baseRules = [
    {
      id: "length5",
      number: 1,
      message: "Password must be at least 5 characters long.",
      test: (pwd) => pwd.length >= 5,
    },
    {
      id: "number",
      number: 2,
      message: "Password must include a number.",
      test: (pwd) => /[0-9]/.test(pwd),
    },
    {
      id: "uppercase",
      number: 3,
      message: "Password must include an uppercase letter.",
      test: (pwd) => /[A-ZÅÄÖ]/.test(pwd),
    },
    {
      id: "special-char",
      number: 4,
      message: "Password must include a special character.",
      test: (pwd) => /[!"#$%&'()*+,\-./:;<=>?@[\]^_`{|}~]/.test(pwd),
    },
    {
      id: "digit-sum",
      number: 5,
      message: `The digits in your password must add up to ${digitTarget}.`,
      test: (pwd) =>
        pwd.split("").reduce((sum, char) => {
          const digit = parseInt(char, 10);
          return sum + (isNaN(digit) ? 0 : digit);
        }, 0) === digitTarget,
    },
    {
      id: "city-name",
      number: 6,
      message: "Password must include a Finnish city name.",
      test: (pwd) =>
        FinnishCities.some((word) =>
          pwd.toLowerCase().includes(word.toLowerCase())
        ),
    },
    {
      id: "Niilo22-birthday-days",
      number: 7,
      message: `Password must include the number of days remaining until Niilo22's next birthday.`,
      test: (pwd) => pwd.includes(niiloBirthdayDays.toString()),
    }

  ];


  const playMusicNote = () => {
    if (!window.AudioContext && !window.webkitAudioContext) {
      alert("Audio not supported in this browser.");
      return;
    }

    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    const freqMap = {
      C: 261.63,
      D: 293.66,
      E: 329.63,
    };

    osc.frequency.value = freqMap[musicNote] || 261.63;
    osc.type = "sine";

    osc.connect(gain);
    gain.connect(ctx.destination);

    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    osc.start();

    osc.stop(ctx.currentTime + 0.4);
  };


  // --- SÄÄNNÖT ---------------------------
  const mazeRule = {
    id: "maze",
    number: baseRules.length + 1,
    message:
      "Password must include the symbol revealed by solving the maze.",
    test: (pwd) => {
      // sääntö täyttyy vain jos:
      // 1) labyrintti ratkaistu
      // 2) salasana sisältää erikoismerkin
      return mazeSolved && pwd.includes(mazeSymbol);
    },
  };

  const movingObjectsRule = {
    id: "moving-objects",
    number: baseRules.length + 2,
    message:
      "Password must include the amount of cucumber mopeds 🛵.",
    test: (pwd) => {
      // pitää sisältää esim. "5" jos passingTarget === 5
      return pwd.includes(passingTarget.toString());
    },
  };

  const musicRule = {
    id: "music-note",
    number: baseRules.length + 3,
    message:
      "Password must include the correct note letter after listening to the note.",
    test: (pwd) => {
      // ainoa tapa ratkaista: nuottikirjain on salasanassa
      return pwd.toUpperCase().includes(musicNote);
    },
  };

  const dogRule = dogBreed
    ? {
      id: "dog-breed",
      number: baseRules.length + 4,
      message:
        'Password must include the breed of this dog.',
      test: (pwd) => pwd.toLowerCase().includes(dogBreed.toLowerCase()),
    }
    : null;

  const salonsaariRule = {
    id: "salonsaari-map",
    number: baseRules.length + 5,
    message:
      "Password must include the name of this island.",
    test: (pwd) => {
      return pwd.toLowerCase().includes("salonsaari");
    },
  };

  const frozenRule = {
    id: "frozen-word",
    number: baseRules.length + 6,
    message:
      "Password must include this frozen emoji.",
    test: (pwd) =>
      pwd.toLowerCase().includes(frozenWord.toLowerCase()),
  };

  const snakeRule = {
    id: "snake-word",
    number: baseRules.length + 7,
    message:
      "Play the snake game and then include the revealed word in your password.",
    test: (pwd) =>
      pwd.toLowerCase().includes(snakeWord.toLowerCase()),
  };

  // 🔢 ASCII-SUMMA-SÄÄNTÖ
  const asciiRule = {
    id: "ascii-sum",
    number: baseRules.length + 8, // numerointi on vain ulkonäköä varten
    message:
      "Password must include the sum of the ASCII codes of the letters shown in this rule.",
    test: (pwd) => pwd.includes(asciiPuzzle.sum.toString()),
  };

  // 🧬 POKÉMON-TYYPPI-SÄÄNTÖ
  const pokemonRule = {
    id: "pokemon-type",
    number: baseRules.length + 9,
    message:
      "Password must include the elemental type of the shown Pokémon.",
    test: (pwd) =>
      pokemon && pwd.toLowerCase().includes(pokemon.type.toLowerCase()),
  };

  const morseRule = {
    id: "morse-code",
    number: baseRules.length + 10,
    message: "Solve the Morse code and include the decoded word in your password.",
    test: (pwd) => pwd.toLowerCase().includes(morseWord.toLowerCase()),
  };

  const fibonacciRule = {
    id: "fibonacci",
    number: baseRules.length + 11,
    message:
      "Password must include the next Fibonacci number in UPPERCASE Roman numerals.",
    test: (pwd) => pwd.includes(nextFibRoman),  // 🔥 ei uppercase-muunnosta
  };

  const flagRule = flagCountry
    ? {
      id: "flag-country",
      number: baseRules.length + 12,
      message:
        "Password must include this country's name.",
      test: (pwd) =>
        pwd.toLowerCase().includes(flagCountry.toLowerCase()),
    }
    : null;

  // ⏰ MINUTE GUESS RULE
  const timeRule = {
    id: "local-time",
    number: baseRules.length + 13,
    message: `Password must include the two-digit minutes when the game started. The time was ${startTime.hourStr}:??`,
    test: (pwd) => pwd.includes(startTime.minuteStr),
  };

  // 🧮 X-YHTÄLÖ ROOMALAISIKSI
  const romanEquationRule = {
    id: "roman-x",
    number: baseRules.length + 14,
    message: `Solve this equation for x and include the value of x in UPPERCASE Roman numerals: ${romanEquation.question}`,
    test: (pwd) => pwd.includes(romanEquation.roman),
  };

  const timeRomanSumRule = {
    id: "roman-sum",
    number: baseRules.length + 15,
    message: `The total value of all UPPERCASE Roman numerals in your password must add up to ${romanSumTarget}.`,
    test: (pwd) => {
      let total = 0;

      for (const ch of pwd) {
        // lasketaan VAIN valmiiksi isot roomalaiset kirjaimet
        if ("IVXLCDM".includes(ch)) {
          total += romanCharValue(ch);
        }
      }

      return total === romanSumTarget;
    },
  };

  const zodiacRule = {
    id: "zodiac-today",
    number: baseRules.length + 16,
    message: `Password must include today's zodiac emoji.`,
    test: (pwd) => pwd.includes(todayZodiac.emoji),
  };


  const palindromeFinalRule = {
    id: "palindrome-final",
    number: baseRules.length + 17,
    message:
      "All LOWERCASE letters in your password must form a perfect palindrome.",
    subMessage:
      "(Digits, symbols, emojis and UPPERCASE letters, including Roman numerals, can be anywhere).",
    test: (pwd) => {
      const cleaned = pwd
        .replace(/\s+/g, "")
        .replace(/\uFE0F/g, "");

      const letters = Array.from(cleaned).filter((ch) =>
        /[a-zåäö]/.test(ch)
      );

      if (letters.length < 2) return false;

      for (let i = 0, j = letters.length - 1; i < j; i++, j--) {
        if (letters[i] !== letters[j]) {
          return false;
        }
      }
      return true;
    },
  };

  // --------------------------



  // 🔥 Lopullinen rules-lista
  const rules = [
    ...baseRules,
    mazeRule,
    movingObjectsRule,
    musicRule,
    dogRule,
    salonsaariRule,
    frozenRule,
    snakeRule,
    asciiRule,
    pokemonRule,
    morseRule,
    fibonacciRule,
    ...(flagRule ? [flagRule] : []),
    timeRule,
    romanEquationRule,
    timeRomanSumRule,
    zodiacRule,
    palindromeFinalRule,
  ];

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    const previousPassword = password; // vanha arvo vertailuun
    setPassword(value);

    // 1) Etsitään, mikä sääntö juuri täyttyi (nykyisistä näkyvistä)
    const currentVisibleRules = rules.slice(0, visibleRuleCount);
    let newlyCompletedId = null;

    for (const rule of currentVisibleRules) {
      const wasOk = rule.test(previousPassword);
      const isOk = rule.test(value);
      if (!wasOk && isOk) {
        newlyCompletedId = rule.id;
      }
    }

    if (newlyCompletedId) {
      setJustCompletedId(newlyCompletedId);
    }

    // 2) Laajennetaan näkyvien sääntöjen määrää niin pitkälle kuin
    //    KAIKKI siihen asti olevat säännöt täyttyvät
    let nextCount = visibleRuleCount;

    while (nextCount < rules.length) {
      const slice = rules.slice(0, nextCount);
      const allOk = slice.every((rule) => rule.test(value));

      if (!allOk) {
        // heti kun yksikin sääntö ei täyty, lopetetaan
        break;
      }

      // kaikki tähän asti täyttyvät -> avataan seuraava sääntö
      nextCount++;
    }

    if (nextCount !== visibleRuleCount) {
      setVisibleRuleCount(nextCount);
    }
  };

  // kaikki säännöt täynnä = peli “voitettu”
  useEffect(() => {
    const allRulesVisible = visibleRuleCount === rules.length;
    const allOkNow =
      allRulesVisible && rules.every((rule) => rule.test(password));

    if (allOkNow && !hasWon) {
      setHasWon(true);

      // jäädytetään senhetkinen valmis salasana
      setFinalTargetPassword(password);
      setRetypeValue("");
      setRetypeError("");

      // suoraan retype-vaiheeseen
      setConfirmStep("retype");
    }
  }, [password, visibleRuleCount, rules, hasWon]);

  const handleStartConfirmPassword = () => {
    setFinalTargetPassword(password); // jäädytetään valmis salasana
    setRetypeValue("");
    setRetypeError("");
    setIsPasswordLocked(true);        // 🔒 lukitse pääsalasana
    setConfirmStep("retype");
  };

  const handleCheckRetyped = () => {
    const original = normalizePassword(finalTargetPassword);
    const retyped = normalizePassword(retypeValue);

    if (retyped === original) {
      setRetypeError("");
      setConfirmStep("success");  // 🎉 voitto
    } else {
      setRetypeError("Password does not match. Try again!");
    }
  };

  const shownRules = rules.slice(0, visibleRuleCount);
  const allShownOk = shownRules.every((rule) => rule.test(password));

  // punaiset ensin, vihreät perään
  const sortedRules = [...shownRules].sort((a, b) => {
    const aOk = a.test(password);
    const bOk = b.test(password);

    // 1) Punaiset ensin, vihreät perään
    if (aOk !== bOk) {
      return aOk ? 1 : -1; // false (punainen) ennen true (vihreä)
    }

    // 2) Jos molemmat ovat vihreitä → järjestä uusimmat ensin
    if (aOk && bOk) {
      // etsitään näiden indeksit koko rules-listasta
      const aIndex = rules.indexOf(a);
      const bIndex = rules.indexOf(b);

      // suurempi index = uudempi sääntö → tulee ylemmäs vihreiden joukossa
      return bIndex - aIndex; // UUSIN -> vanhin
    }

    // 3) Jos molemmat ovat punaisia → pidä alkuperäinen järjestys (vanhimmat ensin)
    const aIndex = rules.indexOf(a);
    const bIndex = rules.indexOf(b);
    return aIndex - bIndex;

  });

  // kaikki mahdolliset säännöt täyttyvät -> peli läpi
  const allRulesOk = rules.every((rule) => rule.test(password));

  const handleNewSnakeWord = () => {
    setSnakeWord(getRandomSnakeWord());
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Password Puzzle</h1>

        <textarea
          className={
            "password-input" + (passwordLocked ? " password-locked" : "")
          }
          value={password}
          onChange={(e) => {
            if (passwordLocked) return;  // 🔒 ei muutoksia retype/success-vaiheessa

            handlePasswordChange(e);

            const el = e.target;
            el.style.height = "auto";
            el.style.height = el.scrollHeight + "px";
          }}
          placeholder="Enter your password"
          rows={1}
          disabled={passwordLocked}        // estää fokuksen ja kirjoittamisen
          spellCheck="false"   // 🔥 estää punaiset alleviivaukset

        />

        {hasWon && confirmStep === "retype" && (
          <div className="win-box">
            <h2>All rules are satisfied!</h2>
            <p>Please retype your password.</p>

            <textarea
              className="password-input retype-textarea"
              value={retypeValue}
              onChange={(e) => {
                setRetypeValue(e.target.value);

                // sama auto-korkeuden säätö kuin pääsalasanassa
                const el = e.target;
                el.style.height = "auto";
                el.style.height = el.scrollHeight + "px";
              }}
              placeholder="Type your password again"
              rows={1}
              spellCheck="false"   // 🔥 estää punaiset alleviivaukset
            />

            {retypeError && (
              <div className="retype-error">{retypeError}</div>
            )}

            <button
              type="button"
              className="retype-confirm-btn"
              onClick={handleCheckRetyped}
            >
              Check password
            </button>
          </div>
        )}

        {confirmStep === "success" && (
          <div className="game-complete">
            <h2>🎉 Congratulations!</h2>
            <p>
              Password confirmed!
              This is now your ultimate password. Guard it with your life.
            </p>
          </div>
        )}

        <div className="rules-container">
          {sortedRules.map((rule) => {
            const ok = rule.test(password);
            const justCompleted = ok && rule.id === justCompletedId;

            return (
              <RuleBox
                key={rule.id}
                rule={rule}
                isOk={ok}
                justCompleted={justCompleted}
                dogImage={puliImg}
                musicNote={musicNote}
                onPlayNote={playMusicNote}
                mazeSymbol={mazeSymbol}
                mazeSolved={mazeSolved}
                onMazeSolved={() => setMazeSolved(true)}
                passingTarget={passingTarget}
                flagUrl={flagUrl}
                frozenWord={frozenWord}
                snakeWord={snakeWord}
                asciiPuzzle={asciiPuzzle}
                pokemon={pokemon}
                onNewSnakeWord={handleNewSnakeWord}
                morseWord={morseWord}
                fibSequence={fibSequence}
              />
            );
          })}
        </div>
      </header>
    </div>
  );
}

export default App;
