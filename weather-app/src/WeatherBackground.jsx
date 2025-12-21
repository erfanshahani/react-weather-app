// WeatherBackground.jsx - نسخه نهایی 3D و حرفه‌ای
import React from 'react';

const WeatherBackground = ({ weather }) => {
  if (!weather || !weather.weather || !weather.weather[0]) {
    return <div className="wb scene default"><div className="celestial sun" /></div>;
  }

  const main = weather.weather[0].main.toLowerCase();
  const icon = weather.weather[0].icon || '';
  const isDay = icon.endsWith('d');

  let weatherClass = 'default';
  if (main.includes('clear')) weatherClass = isDay ? 'clear day' : 'clear night';
  else if (main.includes('clouds')) weatherClass = 'clouds';
  else if (main.includes('rain')) weatherClass = 'rain';
  else if (main.includes('drizzle')) weatherClass = 'drizzle';
  else if (main.includes('snow')) weatherClass = 'snow';
  else if (main.includes('thunderstorm')) weatherClass = 'thunderstorm';
  else if (main.includes('fog') || main.includes('mist') || main.includes('haze')) weatherClass = 'fog';

  const celestialClass = isDay ? 'sun' : 'moon';

  return (
    <div className={`wb scene ${weatherClass}`}>
      <div className="sky">
        {/* خورشید یا ماه با افکت 3D و glow */}
        <div className={`celestial ${celestialClass}`} />

        {/* ابرهای سه‌بعدی شناور (فقط برای آفتابی و ابری) */}
        {(weatherClass.includes('clear') || weatherClass.includes('clouds')) && (
          <div className="clouds-3d">
            <div className="cloud cloud-1" />
            <div className="cloud cloud-2" />
            <div className="cloud cloud-3" />
            <div className="cloud cloud-4" />
          </div>
        )}

        {/* لایه‌های باران/برف سه‌بعدی */}
        {weatherClass.includes('rain') || weatherClass.includes('drizzle') ? (
          <div className="precipitation rain-3d">
            {Array.from({ length: 80 }).map((_, i) => (
              <div key={i} className="drop" style={{ '--i': i }} />
            ))}
          </div>
        ) : weatherClass.includes('snow') ? (
          <div className="precipitation snow-3d">
            {Array.from({ length: 100 }).map((_, i) => (
              <div key={i} className="flake" style={{ '--i': i }} />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default WeatherBackground;