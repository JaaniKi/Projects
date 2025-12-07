export default function HourlyForecast({ hourly, selectedDay }) {
    const filtered = hourly.time
        .map((time, index) => {
            if (time.startsWith(selectedDay)) {
                return {
                    time: time.slice(11, 16),
                    temp: hourly.temperature_2m[index],
                    wind: hourly.windspeed_10m[index],
                };
            }
            return null;
        })
        .filter((entry, index) => entry && index % 3 === 0);

    return (
        <div className="hourly">
            {filtered.map((entry, i) => (
                <div key={i} className="hour">
                    <p><strong>{entry.time}</strong></p>
                    <p>{entry.temp} °C</p>
                    <p>{entry.wind} m/s</p>
                </div>
            ))}
        </div>
    );
}
