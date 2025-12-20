import React, { useState, useEffect, useRef } from 'react';
import { iranCities } from './cities'; // فایل شهرها کنار App.jsx است
import WeatherBackground from './WeatherBackground';

// آدرس‌ها باید به پوشه components اشاره کنند
// آدرس درست وقتی فایل‌ها کنار App.jsx هستند:
import Header from "./Header.jsx";
import SearchBar from "./SearchBar.jsx";
import WeatherCard from "./WeatherCard.jsx";
import Forecast from "./Forecast.jsx";
import WeatherModal from "./WeatherModal.jsx";
import Sidebar from "./Sidebar.jsx";

import './App.css';

// بقیه کد App همان است که قبلاً داشتیم...
// بقیه کد App همان است که قبلاً داشتیم...

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
  const [forecast, setForecast] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const suggestionsRef = useRef(null);
  const API_KEY = '3588bc818593915563499238cac95b0a';

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

  const searchLocation = async () => {
    if (!locationSearch.trim()) return;
    try {
      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${locationSearch}&limit=5&appid=${API_KEY}`
      );
      const data = await response.json();
      setLocationResults(data);
    } catch (error) {
      console.error('خطا در جستجو:', error);
    }
  };

  const selectLocation = (location) => {
    setCity(location.name);
    setShowSidebar(false);
    setLocationSearch('');
    setLocationResults([]);
    fetchWeather(location.name);
  };

  const openDayDetails = (dayData) => {
    setSelectedDay(dayData);
    setShowDetails(true);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') fetchWeather();
  };

  return (
    <div className="app">
      <WeatherBackground weatherCondition={weatherCondition} />

      <div className="container">
        <Header />

        <button 
          className="floating-add-btn"
          onClick={() => setShowSidebar(true)}
        >
          +
        </button>

        <SearchBar 
          city={city}
          setCity={setCity}
          showSuggestions={showSuggestions}
          setShowSuggestions={setShowSuggestions}
          suggestionsRef={suggestionsRef}
          handleKeyPress={handleKeyPress}
          fetchWeather={fetchWeather}
          loading={loading}
          iranCities={iranCities}
        />

        {weather && <WeatherCard weather={weather} />}

        {forecast.length > 0 && (
          <Forecast 
            forecast={forecast} 
            openDayDetails={openDayDetails} 
          />
        )}

        <WeatherModal 
          showDetails={showDetails}
          selectedDay={selectedDay}
          setShowDetails={setShowDetails}
        />
      </div>

      <Sidebar 
        showSidebar={showSidebar}
        setShowSidebar={setShowSidebar}
        locationSearch={locationSearch}
        setLocationSearch={setLocationSearch}
        searchLocation={searchLocation}
        locationResults={locationResults}
        selectLocation={selectLocation}
        loading={loading}
        setLoading={setLoading}
        setCity={setCity}
        fetchWeather={fetchWeather}
        API_KEY={API_KEY}
      />
    </div>
  );
}

export default App;