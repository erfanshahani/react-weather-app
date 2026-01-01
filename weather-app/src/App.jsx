import React, { useState } from 'react';
import WeatherBackground from './WeatherBackground';
import { fetchWeather, fetchForecast } from './services/weatherService';
import Header from './components/Header';
import ThemeToggle from './components/ThemeToggle';
import AddLocationButton from './components/AddLocationButton';
import SearchBox from './components/SearchBox';
import WeatherCard from './components/WeatherCard';
import ForecastSection from './components/ForecastSection';
import DayDetailsModal from './components/DayDetailsModal';
import LocationSidebar from './components/LocationSidebar';
import './App.css';

function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [forecast, setForecast] = useState([]);

  const handleWeatherSearch = async (cityName = city) => {
    if (!cityName || !cityName.trim()) return;

    setLoading(true);
    try {
      const weatherData = await fetchWeather(cityName);
      setWeather(weatherData);

      const forecastData = await fetchForecast(cityName);
      setForecast(forecastData);
    } catch (error) {
      alert(error.message);
    }
    setLoading(false);
  };

  const openDayDetails = (dayData) => {
    setSelectedDay(dayData);
    setShowDetails(true);
  };

  const handleLocationSelect = (location) => {
    setCity(location.name);
    handleWeatherSearch(location.name);
  };

  const handleGetCurrentLocation = async (locationName) => {
    setCity(locationName);
    await handleWeatherSearch(locationName);
    setLoading(false);
  };

  return (
    <div className="app">
      <WeatherBackground weather={weather} />

      <div className="container">
        <Header />

        <ThemeToggle />

        <AddLocationButton onClick={() => setShowSidebar(true)} />

        <SearchBox
          city={city}
          setCity={setCity}
          onSearch={handleWeatherSearch}
          loading={loading}
        />

        <WeatherCard weather={weather} />

        <ForecastSection
          forecast={forecast}
          onDayClick={openDayDetails}
        />

        {showDetails && selectedDay && (
          <DayDetailsModal
            selectedDay={selectedDay}
            onClose={() => setShowDetails(false)}
          />
        )}

        <LocationSidebar
          showSidebar={showSidebar}
          setShowSidebar={setShowSidebar}
          onLocationSelect={handleLocationSelect}
          onGetCurrentLocation={handleGetCurrentLocation}
          loading={loading}
          setLoading={setLoading}
        />
      </div>
    </div>
  );
}

export default App;
