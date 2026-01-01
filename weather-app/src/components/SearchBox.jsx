import React, { useState, useRef, useEffect } from 'react';
import { iranCities } from '../cities';

const SearchBox = ({ city, setCity, onSearch, loading }) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef(null);

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

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  const handleCitySelect = (cityName) => {
    setCity(cityName);
    setShowSuggestions(false);
    onSearch(cityName);
  };

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
          onClick={() => onSearch()}
          className="search-btn"
          disabled={loading}
        >
          {loading ? 'در حال دریافت...' : 'مشاهده آب‌وهوا'}
        </button>

        {showSuggestions && city && (
          <div className="suggestions-list">
            {iranCities
              .filter(cityName =>
                cityName.toLowerCase().includes(city.toLowerCase())
              )
              .slice(0, 8)
              .map((cityName, index) => (
                <div
                  key={index}
                  className="suggestion-item"
                  onClick={() => handleCitySelect(cityName)}
                >
                  {cityName}
                </div>
              ))
            }
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBox;

