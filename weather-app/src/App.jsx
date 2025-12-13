import React, { useState, useEffect, useRef } from 'react';
import { iranCities } from './cities';
import WeatherBackground from './WeatherBackground';
import './App.css';

function App() {
  const [city, setCity] = useState('تهران');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [weatherCondition, setWeatherCondition] = useState('Default');
  const [selectedDay, setSelectedDay] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  

  // بعد از stateهای دیگر
const [showSidebar, setShowSidebar] = useState(false);
const [locationSearch, setLocationSearch] = useState('');
const [locationResults, setLocationResults] = useState([]);

// تابع جستجوی موقعیت مکانی
const searchLocation = async () => {
  if (!locationSearch.trim()) return;
  
  try {
    const response = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${locationSearch}&limit=5&appid=${API_KEY}`
    );
    const data = await response.json();
    setLocationResults(data);
  } catch (error) {
    console.error('خطا در جستجوی موقعیت:', error);
  }
};

// انتخاب موقعیت
const selectLocation = (location) => {
  setCity(location.name);
  setShowSidebar(false);
  setLocationSearch('');
  setLocationResults([]);
  // بعد از بسته شدن سایدبار، آب‌وهوا را بگیر
  setTimeout(() => {
    fetchWeather();
  }, 300);
};

  const openDayDetails = (dayData) => {
    setSelectedDay(dayData);
    setShowDetails(true);
  };

  const API_KEY = '3588bc818593915563499238cac95b0a';
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef(null);
  const [forecast, setForecast] = useState([]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const fetchWeather = async () => {
    if (!city.trim()) return;

    setLoading(true);
    try {
      // weather
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=fa`
      );
      const data = await response.json();

      if (data.cod === 200) {
        setWeather(data);
        setWeatherCondition(data.weather[0].main);
        // forecast
        const forecastResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric&lang=fa`
        );
        const forecastData = await forecastResponse.json();

        const dailyForecast = forecastData.list.filter(item =>
          item.dt_txt.includes('12:00:00')
        );
        setForecast(dailyForecast);

      } else {
        alert('شهر یافت نشد!');
      }

    } catch (error) {
      alert('خطا در دریافت اطلاعات!');
    }

    setLoading(false);
  };

  // ENTER key
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      fetchWeather();
    }
  };

  return (
    <div className="app">
      <WeatherBackground weatherCondition={weatherCondition} />

      <div className="container">

        {/* هدر */}
        <header>
          <h1>🌤 آسمان انگار</h1>
        </header>

        {/* دکمه + در گوشه بالا چپ */}
<button 
  className="floating-add-btn"
  onClick={() => setShowSidebar(true)}
  title="جستجوی موقعیت جدید"
>
  +
</button>

        {/* جستجو */}
        <div className="search-container" ref={suggestionsRef}>
          <div className="search-box">

            <input
              type="text"
              placeholder="نام شهر را جستجو کنید..."
              value={city}
              onChange={(e) => {
                setCity(e.target.value);
                setShowSuggestions(e.target.value.length > 0);
              }}
              onKeyPress={handleKeyPress}
              className="search-input"
              onFocus={() => setShowSuggestions(true)}
            />

            <button
              onClick={fetchWeather}
              className="search-btn"
              disabled={loading}
            >
              {loading ? 'در حال دریافت...' : 'مشاهده آب‌وهوا'}
            </button>

            {showSuggestions && city && (
              <div className="suggestions-list">
                {iranCities
                  .filter(cityName =>
                    cityName.toLowerCase().includes(city.toLowerCase())
                  )
                  .slice(0, 8)
                  .map((cityName, index) => (
                    <div
                      key={index}
                      className="suggestion-item"
                      onClick={() => {
                        setCity(cityName);
                        setShowSuggestions(false);
                        fetchWeather();
                      }}
                    >
                      {cityName}
                    </div>
                  ))
                }
              </div>
            )}
          </div>
        </div>


        {/* نمایش نتیجه */}
        {weather && (
          <div className="weather-card">
            <div className="city-name">
              <h2>{weather.name}</h2>
              <p>ایران</p>
            </div>

            <div className="weather-main">
              <div className="temp-section">
                <p className="temperature">{Math.round(weather.main.temp)}°C</p>
                <p className="feels-like">احساس واقعی: {Math.round(weather.main.feels_like)}°C</p>
              </div>

              <div className="weather-icon">
                <img
                  src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`}
                  alt={weather.weather[0].description}
                />
                <p className="weather-desc">{weather.weather[0].description}</p>
              </div>
            </div>

            <div className="details-grid">
              <div className="detail-item">
                <span className="label">رطوبت</span>
                <span className="value">{weather.main.humidity}%</span>
              </div>
              <div className="detail-item">
                <span className="label">باد</span>
                <span className="value">{weather.wind.speed} m/s</span>
              </div>
              <div className="detail-item">
                <span className="label">فشار</span>
                <span className="value">{weather.main.pressure} hPa</span>
              </div>
              <div className="detail-item">
                <span className="label">دید</span>
                <span className="value">{weather.visibility / 1000} km</span>
              </div>
            </div>

            <div className="tips">
              💡 نکته روز: {
                weather.weather[0].main === 'Rain' ? 'چتر همراه داشته باشید' :
                  weather.main.temp > 30 ? 'آب زیاد بنوشید' :
                    'روز خوبی برای پیاده‌روی است'
              }
            </div>
          </div>
        )}

       

        {/* پیش‌بینی ۵ روزه */}
        {forecast.length > 0 && (
          <div className="forecast-section">
            <h3 className="forecast-title">پیش‌بینی ۵ روز آینده</h3>
            <div className="forecast-container">

              {forecast.map((day, index) => {
                const date = new Date(day.dt * 1000);
                const dayNames = ['یک‌شنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه', 'شنبه'];
                const dayName = dayNames[date.getDay()];
                const month = date.toLocaleDateString('fa-IR', { month: 'long' });

                return (
                  <div
                    className="forecast-card"
                    key={index}
                    onClick={() => openDayDetails(day)}
                    style={{ cursor: 'pointer' }}
                  >
                    <p className="forecast-day">{dayName}</p>
                    <p className="forecast-date">{date.getDate()} {month}</p>

                    <img
                      src={`http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                      alt={day.weather[0].description}
                      className="forecast-icon"
                    />

                    <p className="forecast-temp">{Math.round(day.main.temp)}°C</p>
                    <p className="forecast-desc">{day.weather[0].description}</p>

                    <div className="forecast-details">
                      <span>💧 {day.main.humidity}%</span>
                      <span>💨 {day.wind.speed} m/s</span>
                    </div>
                  </div>
                );
              })}

            </div>
          </div>
        )}

        {/* مودال جزئیات روز */}
        {showDetails && selectedDay && (
          <div className="modal-overlay">
            <div className="modal-container">
              <div className="modal-header">
                <h2>📅 جزئیات کامل روز</h2>
                <button
                  className="close-btn"
                  onClick={() => setShowDetails(false)}
                >
                  ✕
                </button>
              </div>

              <div className="modal-content">
                <div className="day-header">
                  <h3>
                    {new Date(selectedDay.dt * 1000).toLocaleDateString('fa-IR', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </h3>

                  <div className="day-main-info">
                    <img
                      src={`http://openweathermap.org/img/wn/${selectedDay.weather[0].icon}@4x.png`}
                      alt={selectedDay.weather[0].description}
                    />

                    <div className="temp-display">
                      <span className="main-temp">{Math.round(selectedDay.main.temp)}°C</span>
                      <span className="feels-like">احساس واقعی: {Math.round(selectedDay.main.feels_like)}°C</span>
                    </div>
                  </div>
                </div>

                <div className="details-grid-modal">

                  <div className="detail-box">
                    <div className="detail-icon">🌡️</div>
                    <div className="detail-text">
                      <h4>دمای روز</h4>
                      <p>حداکثر: {Math.round(selectedDay.main.temp_max)}°C</p>
                      <p>حداقل: {Math.round(selectedDay.main.temp_min)}°C</p>
                    </div>
                  </div>

                  <div className="detail-box">
                    <div className="detail-icon">💧</div>
                    <div className="detail-text">
                      <h4>رطوبت</h4>
                      <p>{selectedDay.main.humidity}%</p>
                    </div>
                  </div>

                  <div className="detail-box">
                    <div className="detail-icon">💨</div>
                    <div className="detail-text">
                      <h4>باد</h4>
                      <p>{selectedDay.wind.speed} m/s</p>
                    </div>
                  </div>

                  <div className="detail-box">
                    <div className="detail-icon">👁️</div>
                    <div className="detail-text">
                      <h4>دید</h4>
                      <p>{(selectedDay.visibility / 1000).toFixed(1)} km</p>
                    </div>
                  </div>

                </div>

                <div className="weather-poem">
                  <p className="poem-title">✨ توصیه امروز:</p>
                  <p className="poem-text">
                    {selectedDay.weather[0].main === 'Clear'
                      ? 'روزی آفتابی و زیبا در پیش است.'
                      : selectedDay.weather[0].main === 'Rain'
                        ? 'چتر را فراموش نکنید.'
                        : 'روز خوبی داشته باشید.'}
                  </p>
                </div>

              </div>
            </div>
          </div>
        )}

      </div>
      {/* سایدبار کشویی */}
<div className={`sidebar-overlay ${showSidebar ? 'active' : ''}`}>
  <div className="sidebar-backdrop" onClick={() => setShowSidebar(false)}></div>
  
  <div className="sidebar-container">
    <div className="sidebar-header">
      <h3>🌍 جستجوی موقعیت مکانی</h3>
      <button 
        className="sidebar-close"
        onClick={() => setShowSidebar(false)}
      >
        ✕
      </button>
    </div>
    
    <div className="sidebar-content">
      <div className="location-search-box">
        <input
          type="text"
          placeholder="نام شهر، کشور یا مختصات جغرافیایی..."
          value={locationSearch}
          onChange={(e) => {
            setLocationSearch(e.target.value);
            if (e.target.value.length > 2) {
              searchLocation();
            }
          }}
          onKeyPress={(e) => e.key === 'Enter' && searchLocation()}
          className="location-input"
        />
        <button 
          onClick={searchLocation}
          className="location-search-btn"
        >
          🔍
        </button>
      </div>
      
      {/* نتایج جستجو */}
      <div className="location-results">
        {locationResults.length > 0 ? (
          locationResults.map((loc, index) => (
            <div 
              key={index}
              className="location-item"
              onClick={() => selectLocation(loc)}
            >
              <div className="location-info">
                <span className="location-name">{loc.name}</span>
                <span className="location-details">
                  {loc.state && `${loc.state}, `}{loc.country}
                </span>
              </div>
              <div className="location-coords">
                <span>🌐 {loc.lat.toFixed(2)}, {loc.lon.toFixed(2)}</span>
              </div>
            </div>
          ))
        ) : locationSearch.length > 2 ? (
          <div className="no-results">
            <p>📍 موقعیتی یافت نشد</p>
            <p className="hint">نام شهر را به انگلیسی یا فارسی کامل بنویسید</p>
          </div>
        ) : (
          <div className="search-hint">
            <p>💡 برای شروع جستجو، حداقل ۳ حرف وارد کنید</p>
            <div className="examples">
              <p>مثال‌ها:</p>
              <ul>
                <li>Tehran, Iran</li>
                <li>35.6892, 51.3890 (مختصات)</li>
                <li>مشهد</li>
                <li>New York, US</li>
              </ul>
            </div>
          </div>
        )}
      </div>
      
      {/* موقعیت فعلی کاربر */}
      <div className="current-location-section">
        <h4>📍 موقعیت فعلی شما</h4>
        <button 
          className="get-location-btn"
          onClick={() => {
            if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(
                (position) => {
                  const { latitude, longitude } = position.coords;
                  setCity(`${latitude},${longitude}`);
                  setShowSidebar(false);
                  setTimeout(() => fetchWeather(), 300);
                },
                () => alert('دسترسی به موقعیت مکانی مجاز نیست')
              );
            } else {
              alert('مرورگر شما از موقعیت‌یابی پشتیبانی نمی‌کند');
            }
          }}
        >
          دریافت موقعیت خودکار
        </button>
      </div>
    </div>
  </div>
</div>
    </div>
  );
}

export default App;
