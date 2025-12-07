import { getWeatherIcon, getWeatherDescription } from "../utils/format";

export default function CurrentWeather({ data }) {
    return (
        <div className="weather-box">
            <h2>
                {data.city}, {data.country}
            </h2>
            <p>Lämpötila nyt: {data.current.temperature} °C</p>
            <p>Tuulen nopeus: {data.current.windspeed} m/s</p>
            <p style={{ fontSize: "2rem" }}>
                {getWeatherIcon(data.current.weathercode)}
            </p>
            <p>{getWeatherDescription(data.current.weathercode)}</p>
        </div>
    );
}
