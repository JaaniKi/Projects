import { getWeekday, getWeatherDescription, getWeatherIcon, formatDateFi } from "../utils/format";

export default function ForecastDay({ date, index, selected, onClick, forecast }) {
    return (
        <div
            className={`forecast-day ${selected === date ? "selected" : ""}`}
            onClick={() => onClick(date)}
        >
            <strong>{getWeekday(date)}</strong>
            <p className="forecast-date">{formatDateFi(date)}</p>
            <p style={{ fontSize: "1.5rem" }}>{getWeatherIcon(forecast.weathercode[index])}</p>
            <p style={{ fontSize: "0.9rem" }}>{getWeatherDescription(forecast.weathercode[index])}</p>
            <p>
                {forecast.temperature_2m_min[index]}°C – {forecast.temperature_2m_max[index]}°C
            </p>
        </div>
    );
}