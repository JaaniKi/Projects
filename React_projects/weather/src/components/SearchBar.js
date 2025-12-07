export default function SearchBar({ city, setCity, onSearch }) {
    return (
        <div className="search">
            <input
                type="text"
                placeholder="Syötä kaupunki"
                value={city}
                onChange={(e) => setCity(e.target.value)}
            />
            <button onClick={onSearch}>Hae sää</button>
        </div>
    );
}