import React, { useState, useEffect, useRef } from 'react';
import { iranCities } from './cities';
import './App.css';

function App() {
  const [city, setCity] = useState('تهران');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🔑 کلید API خودت را اینجا بگذار
  const API_KEY = '3588bc818593915563499238cac95b0a';
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef(null);

// بستن پیشنهادات با کلیک بیرون
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
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=fa`
      );
      const data = await response.json();
      if (data.cod === 200) {
        setWeather(data);
      } else {
        alert('شهر یافت نشد!');
      }
    } catch (error) {
      alert('خطا در دریافت اطلاعات!');
    }
    setLoading(false);
  };

  // فشار دادن Enter برای جستجو
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      fetchWeather();
    }
  };

  return (
    <div className="app">
      <div className="container">
        {/* هدر */}
        <header>
          <h1>🌤 هوای‌خاله</h1>
          <p>سایت شیک آب‌وهوا برای خانم‌های خوش‌سلیقه</p>
        </header>

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
    
    {/* لیست پیشنهادات */}
    {showSuggestions && city && (
      <div className="suggestions-list">
        {iranCities
          .filter(cityName => 
            cityName.toLowerCase().includes(city.toLowerCase())
          )
          .slice(0, 8) // فقط ۸ پیشنهاد اول
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

        {/* راهنما */}
        <div className="instructions"></div>
        <h3>📝 راهنمای استفاده برای خاله:</h3>
          <ol>
            <li>نام شهر را در جعبه بالا بنویسید (مثلاً: اصفهان)</li>
            <li>دکمه «مشاهده آب‌وهوا» را بزنید یا Enter را فشار دهید</li>
            <li>اطلاعات را ببینید و نکته پایینی را بخوانید</li>
          </ol>
          <p className="note">⚠️ دقت کنید: نام شهر باید به فارسی یا انگلیسی صحیح نوشته شود</p>
        </div>

        {/* فوتر */}
        <footer>
          <p>طراحی شده با ❤️ برای خاله‌های دوست‌داشتنی</p>
          <p className="footer-note">داده‌های آب‌وهوا از OpenWeatherMap دریافت می‌شود</p>
        </footer>
      </div>
      
  );
  
}

export default App;