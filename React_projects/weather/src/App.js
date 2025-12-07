import { useState } from "react";
import "./App.css";
import SearchBar from "./components/SearchBar";
import CurrentWeather from "./components/CurrentWeather";
import ForecastDay from "./components/ForecastDay";
import HourlyForecast from "./components/HourlyForecast";
import { formatDateFi } from "./utils/format";


function App() {
    const [city, setCity] = useState("");
    const [weather, setWeather] = useState(null);
    const [selectedDay, setSelectedDay] = useState(null);
    const [error, setError] = useState("");

    const fetchWeather = async () => {
        setError("");
        setWeather(null);
        setSelectedDay(null);

        try {
            const geoRes = await fetch(
                `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`
            );
            const geoData = await geoRes.json();

            if (!geoData.results || geoData.results.length === 0) {
                setError("Kaupunkia ei löytynyt.");
                return;
            }

            const { latitude, longitude, name, country } = geoData.results[0];

            const weatherRes = await fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,weathercode&hourly=temperature_2m,windspeed_10m,weathercode&timezone=auto`
            );
            const weatherData = await weatherRes.json();

            setWeather({
                city: name,
                country: country,
                current: weatherData.current_weather,
                forecast: weatherData.daily,
                hourly: weatherData.hourly,
            });
        } catch (err) {
            setError("Tapahtui virhe tietojen haussa.");
        }
    };

    return (
        <div className="container">
            <h1>Sääsovellus</h1>
            <SearchBar city={city} setCity={setCity} onSearch={fetchWeather} />
            {error && <p className="error">{error}</p>}

            {weather && (
                <>
                    <CurrentWeather data={weather} />
                    <h3>7 päivän ennuste</h3>
                    <div className="forecast">
                        {weather.forecast.time.slice(0, 7).map((date, i) => (
                            <ForecastDay
                                key={i}
                                date={date}
                                index={i}
                                forecast={weather.forecast}
                                selected={selectedDay}
                                onClick={setSelectedDay}
                            />
                        ))}
                    </div>

                    {selectedDay && (
                        <>
                            <h4>Tuntiennuste: {formatDateFi(selectedDay)}</h4>
                            <HourlyForecast hourly={weather.hourly} selectedDay={selectedDay} />
                        </>
                    )}
                </>
            )}
        </div>
    );
}

export default App;
