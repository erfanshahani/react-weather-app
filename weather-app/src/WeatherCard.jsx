import React from 'react';
import './WeatherCard.css'

const WeatherCard = ({ weather }) => {
  if (!weather) return null;

  return (
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
        {/* سایر جزئیات را هم اینجا قرار دهید */}
      </div>
    </div>
  );
};

export default WeatherCard;