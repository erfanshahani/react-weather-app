import React from 'react';


const WeatherBackground = ({ weatherCondition }) => {
  const getAnimationClass = () => {
    switch(weatherCondition) {
      case 'Clear': return 'sunny-animation';
      case 'Clouds': return 'cloudy-animation';
      case 'Rain': return 'rainy-animation';
      case 'Snow': return 'snowy-animation';
      case 'Thunderstorm': return 'stormy-animation';
      default: return 'default-animation';
    }
  };

  return (
    <div className={`weather-background ${getAnimationClass()}`}>
      {/* المنت‌های انیمیشنی */}
      <div className="animation-elements">
        {weatherCondition === 'Clear' && (
          <>
            <div className="sun"></div>
            <div className="sun-ray ray1"></div>
            <div className="sun-ray ray2"></div>
            <div className="sun-ray ray3"></div>
            <div className="bird bird1"></div>
            <div className="bird bird2"></div>
            <div className="cloud cloud1"></div>
            <div className="cloud cloud2"></div>
          </>
        )}
        
        {weatherCondition === 'Clouds' && (
          <>
            <div className="cloud heavy-cloud1"></div>
            <div className="cloud heavy-cloud2"></div>
            <div className="cloud heavy-cloud3"></div>
            <div className="fog"></div>
          </>
        )}
        
        {weatherCondition === 'Rain' && (
          <>
            {[...Array(60)].map((_, i) => (
              <div key={i} className="raindrop"></div>
            ))}
            <div className="window"></div>
            {[...Array(15)].map((_, i) => (
              <div key={i} className="raindrop-window"></div>
            ))}
          </>
        )}
        
        {weatherCondition === 'Snow' && (
          <>
            {[...Array(80)].map((_, i) => (
              <div key={i} className="snowflake"></div>
            ))}
            <div className="snow-pile pile1"></div>
            <div className="snow-pile pile2"></div>
          </>
        )}
        
        {weatherCondition === 'Thunderstorm' && (
          <>
            {[...Array(40)].map((_, i) => (
              <div key={i} className="storm-raindrop"></div>
            ))}
            <div className="lightning"></div>
            <div className="wind-leaf leaf1"></div>
            <div className="wind-leaf leaf2"></div>
            <div className="wind-leaf leaf3"></div>
          </>
        )}
      </div>
    </div>
  );
};

export default WeatherBackground;