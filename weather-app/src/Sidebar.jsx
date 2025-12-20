import React from 'react';

const Sidebar = ({ 
  showSidebar, setShowSidebar, locationSearch, setLocationSearch, 
  searchLocation, locationResults, selectLocation, 
  loading, setLoading, setCity, fetchWeather, API_KEY 
}) => {
  
  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const res = await fetch(`https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`);
            const data = await res.json();
            if(data.length > 0) {
              setCity(data[0].name);
              setShowSidebar(false);
              fetchWeather(data[0].name);
            }
          } catch(e) { 
            fetchWeather(`${latitude},${longitude}`);
          }
        },
        () => {
          setLoading(false);
          alert('دسترسی به موقعیت مکانی غیرمجاز است.');
        }
      );
    }
  };

  return (
    <div className={`sidebar-overlay ${showSidebar ? 'active' : ''}`}>
      <div className="sidebar-backdrop" onClick={() => setShowSidebar(false)}></div>
      <div className="sidebar-container">
        <div className="sidebar-header">
          <h3>🌍 جستجوی موقعیت مکانی</h3>
          <button className="sidebar-close" onClick={() => setShowSidebar(false)}>✕</button>
        </div>
        
        <div className="sidebar-content">
          <div className="location-search-box">
            <input
              type="text"
              value={locationSearch}
              onChange={(e) => {
                setLocationSearch(e.target.value);
                if (e.target.value.length > 2) searchLocation();
              }}
              placeholder="نام شهر یا کشور..."
              className="location-input"
            />
          </div>

          <div className="location-results">
            {locationResults.map((loc, index) => (
              <div key={index} className="location-item" onClick={() => selectLocation(loc)}>
                {loc.name}, {loc.country}
              </div>
            ))}
          </div>

          <div className="current-location-section">
            <button className="get-location-btn" onClick={handleGetCurrentLocation}>
              {loading ? 'در حال دریافت...' : 'دریافت موقعیت خودکار'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;