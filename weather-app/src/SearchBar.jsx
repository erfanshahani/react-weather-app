import React from 'react';
import { iranCities } from '../cities';

const SearchBar = ({ city, setCity, showSuggestions, setShowSuggestions, suggestionsRef, handleKeyPress, fetchWeather, loading }) => {
  return (
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
          onClick={() => fetchWeather()}
          className="search-btn"
          disabled={loading}
        >
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
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;