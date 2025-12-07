export const getWeekday = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("fi-FI", { weekday: "short" });
};

export const formatDateFi = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString("fi-FI", {
        day: "numeric",
        month: "numeric",
        year: "numeric",
    });
};

const weatherDescriptions = {
    0: "Aurinkoista",
    1: "Enimmäkseen selkeää",
    2: "Puolipilvistä",
    3: "Pilvistä",
    45: "Sumuista",
    48: "Sumua ja kuuraa",
    51: "Kevyttä tihkusadetta",
    53: "Tihkusadetta",
    55: "Voimakasta tihkusadetta",
    61: "Kevyttä sadetta",
    63: "Sadetta",
    65: "Voimakasta sadetta",
    71: "Kevyttä lunta",
    73: "Lunta",
    75: "Voimakasta lumisadetta",
    80: "Sadekuuroja",
    81: "Sadekuuroja",
    82: "Voimakkaita sadekuuroja",
    95: "Ukkosta",
    96: "Ukkosta ja rakeita",
    99: "Voimakasta ukkosta ja rakeita",
};

export const getWeatherDescription = (code) => {
    return weatherDescriptions[code] || "Tuntematon sää";
};

export const getWeatherIcon = (code) => {
    if (code === 0) return "☀️";
    if (code <= 2) return "🌤️";
    if (code === 3) return "☁️";
    if (code >= 45 && code <= 48) return "🌫️";
    if (code >= 51 && code <= 67) return "🌦️";
    if (code >= 61 && code <= 77) return "🌧️";
    if (code >= 80 && code <= 82) return "🌧️";
    if (code >= 95) return "⛈️";
    return "❓";
};
