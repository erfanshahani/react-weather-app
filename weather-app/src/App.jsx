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
  const [showSidebar, setShowSidebar] = useState(false);
  const [locationSearch, setLocationSearch] = useState('');
  const [locationResults, setLocationResults] = useState([]);

  const API_KEY = '3588bc818593915563499238cac95b0a';
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef(null);
  const [forecast, setForecast] = useState([]);

  // ۱. اصلاح جستجوی موقعیت در سایدبار برای دریافت نام‌های فارسی
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

  // ۲. اصلاح انتخاب لوکیشن برای ترجیح دادن نام فارسی
  const selectLocation = (location) => {
    // اگر نام فارسی در دیتابیس بود از آن استفاده کن، در غیر این صورت نام اصلی
    const displayName = location.local_names?.fa || location.name;
    setCity(displayName);
    setShowSidebar(false);
    setLocationSearch('');
    setLocationResults([]);
    fetchWeather(location.name); // برای سرچ دقیق به API، نام اصلی (انگلیسی) بهتر است
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchWeather = async (cityName = city) => {
    if (!cityName || !cityName.trim()) return;
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric&lang=fa`
      );
      const data = await response.json();

      if (data.cod === 200) {
        setWeather(data);
        setWeatherCondition(data.weather[0].main);
        
        const forecastResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${API_KEY}&units=metric&lang=fa`
        );
        const forecastData = await forecastResponse.json();
        const dailyForecast = forecastData.list.filter(item => item.dt_txt.includes('12:00:00'));
        setForecast(dailyForecast);
      } else {
        alert('شهر یافت نشد!');
      }
    } catch (error) {
      alert('خطا در دریافت اطلاعات!');
    }
    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') fetchWeather();
  };

  return (
    <div className="app">
      <WeatherBackground weatherCondition={weatherCondition} />
      <div className="container">
        <header>
          <h1>🌤 آسمان انگار</h1>
        </header>

        <button className="floating-add-btn" onClick={() => setShowSidebar(true)} title="جستجوی موقعیت جدید">+</button>

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
            <button onClick={() => fetchWeather()} className="search-btn" disabled={loading}>
              {loading ? 'در حال دریافت...' : 'مشاهده آب‌وهوا'}
            </button>

            {showSuggestions && city && (
              <div className="suggestions-list">
                {iranCities
                  .filter(cityName => cityName.toLowerCase().includes(city.toLowerCase()))
                  .slice(0, 8)
                  .map((cityName, index) => (
                    <div
                      key={index}
                      className="suggestion-item"
                      onClick={() => {
                        setCity(cityName);
                        setShowSuggestions(false);
                        fetchWeather(cityName);
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

        {weather && (
          <div className="weather-card">
            <div className="city-name">
              {/* نمایش نام فارسی در کارت اصلی */}
              <h2>{city}</h2> 
              <p>ایران</p>
            </div>

            <div className="weather-main">
              <div className="temp-section">
                <p className="temperature">{Math.round(weather.main.temp)}°C</p>
                <p className="feels-like">احساس واقعی: {Math.round(weather.main.feels_like)}°C</p>
              </div>
              <div className="weather-icon">
                <img src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`} alt={weather.weather[0].description} />
                <p className="weather-desc">{weather.weather[0].description}</p>
              </div>
            </div>

            <div className="details-grid">
              <div className="detail-item"><span className="label">رطوبت</span><span className="value">{weather.main.humidity}%</span></div>
              <div className="detail-item"><span className="label">باد</span><span className="value">{weather.wind.speed} m/s</span></div>
              <div className="detail-item"><span className="label">فشار</span><span className="value">{weather.main.pressure} hPa</span></div>
              <div className="detail-item"><span className="label">دید</span><span className="value">{weather.visibility / 1000} km</span></div>
            </div>
          </div>
        )}

        {forecast.length > 0 && (
          <div className="forecast-section">
            <h3 className="forecast-title">پیش‌بینی ۵ روز آینده</h3>
            <div className="forecast-container">
              {forecast.map((day, index) => {
                const date = new Date(day.dt * 1000);
                const dayNames = ['یک‌شنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه', 'شنبه'];
                return (
                  <div className="forecast-card" key={index} onClick={() => openDayDetails(day)}>
                    <p className="forecast-day">{dayNames[date.getDay()]}</p>
                    <p className="forecast-date">{date.toLocaleDateString('fa-IR', {day: 'numeric', month: 'long'})}</p>
                    <img src={`http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`} alt={day.weather[0].description} className="forecast-icon" />
                    <p className="forecast-temp">{Math.round(day.main.temp)}°C</p>
                    <p className="forecast-desc">{day.weather[0].description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Modal و Sidebar مشابه قبل اما با منطق نام فارسی */}
        {showDetails && selectedDay && (
           <div className="modal-overlay">
             <div className="modal-container">
               <div className="modal-header">
                 <h2>📅 جزئیات کامل روز</h2>
                 <button className="close-btn" onClick={() => setShowDetails(false)}>✕</button>
               </div>
               <div className="modal-content">
                  <h3>{new Date(selectedDay.dt * 1000).toLocaleDateString('fa-IR', {weekday: 'long', day: 'numeric', month: 'long'})}</h3>
                  <div className="day-main-info">
                    <img src={`http://openweathermap.org/img/wn/${selectedDay.weather[0].icon}@4x.png`} alt="weather" />
                    <div className="temp-display">
                      <span className="main-temp">{Math.round(selectedDay.main.temp)}°C</span>
                    </div>
                  </div>
               </div>
             </div>
           </div>
        )}

        <div className={`sidebar-overlay ${showSidebar ? 'active' : ''}`}>
          <div className="sidebar-backdrop" onClick={() => setShowSidebar(false)}></div>
          <div className="sidebar-container">
            <div className="sidebar-header">
              <h3>🌍 جستجوی موقعیت</h3>
              <button className="sidebar-close" onClick={() => setShowSidebar(false)}>✕</button>
            </div>
            <div className="sidebar-content">
              <div className="location-search-box">
                <input
                  type="text"
                  placeholder="نام شهر (فارسی یا انگلیسی)..."
                  value={locationSearch}
                  onChange={(e) => {
                    setLocationSearch(e.target.value);
                    if (e.target.value.length > 2) searchLocation();
                  }}
                  className="location-input"
                />
              </div>
              <div className="location-results">
                {locationResults.map((loc, index) => (
                  <div key={index} className="location-item" onClick={() => selectLocation(loc)}>
                    {/* اولویت با نام فارسی در لیست نتایج */}
                    <span className="location-name">{loc.local_names?.fa || loc.name}</span>
                    <span className="location-details">{loc.country}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;