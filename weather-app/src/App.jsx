import React, { useState, useEffect, useRef } from 'react';
import { iranCities } from './cities';
import WeatherBackground from './WeatherBackground';
import './App.css';

function App() {
  const API_KEY = '3588bc818593915563499238cac95b0a';

  const [city, setCity] = useState('تهران');
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [weatherCondition, setWeatherCondition] = useState('Default');

  const [airQuality, setAirQuality] = useState(null);
  const [aqiLevel, setAqiLevel] = useState(null);

  const [selectedDay, setSelectedDay] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef(null);

  const [showSidebar, setShowSidebar] = useState(false);
  const [locationSearch, setLocationSearch] = useState('');
  const [locationResults, setLocationResults] = useState([]);

  const aqiLabels = {
    1: { label: 'عالی', color: '#00E400', emoji: '😊', desc: 'هوای پاک و سالم' },
    2: { label: 'خوب', color: '#FFFF00', emoji: '🙂', desc: 'هوای قابل قبول' },
    3: { label: 'متوسط', color: '#FF7E00', emoji: '😐', desc: 'حساسیت برای گروه‌های آسیب‌پذیر' },
    4: { label: 'ناسالم', color: '#FF0000', emoji: '😷', desc: 'برای همه ناسالم' },
    5: { label: 'بسیار ناسالم', color: '#8F3F97', emoji: '🤢', desc: 'هشدار سلامت جدی' }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchWeather = async () => {
    if (!city.trim()) return;
    setLoading(true);

    try {
      // Weather
      const weatherRes = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=fa`
      );
      const weatherData = await weatherRes.json();

      if (weatherData.cod !== 200) {
        alert('شهر یافت نشد!');
        setLoading(false);
        return;
      }

      setWeather(weatherData);
      setWeatherCondition(weatherData.weather[0].main);

      const { lat, lon } = weatherData.coord;

      // Air Quality
      const airRes = await fetch(
        `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
      );
      const airData = await airRes.json();

      if (airData.list?.length) {
        const aqi = airData.list[0].main.aqi;
        setAirQuality(airData.list[0]);
        setAqiLevel(aqiLabels[aqi]);
      }

      // Forecast
      const forecastRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric&lang=fa`
      );
      const forecastData = await forecastRes.json();

      const daily = forecastData.list.filter(item =>
        item.dt_txt.includes('12:00:00')
      );
      setForecast(daily);

    } catch (err) {
      console.error(err);
      alert('خطا در دریافت اطلاعات!');
    }

    setLoading(false);
  };

  const searchLocation = async () => {
    if (!locationSearch.trim()) return;
    const res = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${locationSearch}&limit=5&appid=${API_KEY}`
    );
    setLocationResults(await res.json());
  };

  const selectLocation = (loc) => {
    setCity(loc.name);
    setShowSidebar(false);
    setLocationSearch('');
    setLocationResults([]);
    setTimeout(fetchWeather, 300);
  };

  return (
    <div className="app">
      <WeatherBackground weatherCondition={weatherCondition} />

      <div className="container">
        <header>
          <h1>🌤 آسمان انگار</h1>
        </header>

        <button className="floating-add-btn" onClick={() => setShowSidebar(true)}>+</button>

        <div className="search-container" ref={suggestionsRef}>
          <input
            value={city}
            placeholder="نام شهر را جستجو کنید..."
            onChange={(e) => {
              setCity(e.target.value);
              setShowSuggestions(true);
            }}
            onKeyDown={(e) => e.key === 'Enter' && fetchWeather()}
          />
          <button onClick={fetchWeather} disabled={loading}>
            {loading ? 'در حال دریافت...' : 'مشاهده آب‌وهوا'}
          </button>

          {showSuggestions && (
            <div className="suggestions-list">
              {iranCities
                .filter(c => c.includes(city))
                .slice(0, 8)
                .map((c, i) => (
                  <div key={i} onClick={() => { setCity(c); setShowSuggestions(false); fetchWeather(); }}>
                    {c}
                  </div>
                ))}
            </div>
          )}
        </div>

        {weather && (
          <div className="weather-card">
            <h2>{weather.name}</h2>
            <p>{Math.round(weather.main.temp)}°C</p>
          </div>
        )}

        {airQuality && aqiLevel && (
          <div className="air-quality-section">
            <h3>🌫 کیفیت هوا</h3>
            <p>{aqiLevel.emoji} {aqiLevel.label}</p>
            <p>{aqiLevel.desc}</p>
          </div>
        )}

        {forecast.length > 0 && (
          <div className="forecast-section">
            {forecast.map((d, i) => (
              <div key={i} onClick={() => { setSelectedDay(d); setShowDetails(true); }}>
                <p>{Math.round(d.main.temp)}°C</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {showSidebar && (
        <div className="sidebar-overlay">
          <input
            value={locationSearch}
            onChange={(e) => {
              setLocationSearch(e.target.value);
              if (e.target.value.length > 2) searchLocation();
            }}
          />
          {locationResults.map((loc, i) => (
            <div key={i} onClick={() => selectLocation(loc)}>
              {loc.name} ({loc.country})
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
