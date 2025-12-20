import React from 'react';
import './WeatherModal.css';

const WeatherModal = ({ showDetails, selectedDay, setShowDetails }) => {
  if (!showDetails || !selectedDay) return null;

  const formattedDate = new Date(selectedDay.dt * 1000).toLocaleDateString('fa-IR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>📅 جزئیات کامل روز</h2>
          <button className="close-btn" onClick={() => setShowDetails(false)}>✕</button>
        </div>

        <div className="modal-content">
          <div className="day-header">
            <h3>{formattedDate}</h3>
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
            {/* بقیه باکس‌های رطوبت، باد و دید را هم مشابه کد بالا قرار بده */}
          </div>

          <div className="weather-poem">
            <p className="poem-title">✨ توصیه امروز:</p>
            <p className="poem-text">
              {selectedDay.weather[0].main === 'Clear' ? 'روزی آفتابی و زیبا در پیش است.' :
               selectedDay.weather[0].main === 'Rain' ? 'چتر را فراموش نکنید.' : 'روز خوبی داشته باشید.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherModal;