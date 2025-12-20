import React from 'react';

const Forecast = ({ forecast, openDayDetails }) => {
  if (forecast.length === 0) return null;

  const dayNames = ['یک‌شنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه', 'شنبه'];

  return (
    <div className="forecast-section">
      <h3 className="forecast-title">پیش‌بینی ۵ روز آینده</h3>
      <div className="forecast-container">
        {forecast.map((day, index) => {
          const date = new Date(day.dt * 1000);
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
  );
};

export default Forecast;