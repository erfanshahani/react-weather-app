const WeatherBackground = ({ weather }) => {
    const getBackground = () => {
      switch (weather) {
        case "Clear":
          return "linear-gradient(to right, #fbc531, #e1b12c)";
        case "Clouds":
          return "linear-gradient(to right, #7f8fa6, #718093)";
        case "Rain":
          return "linear-gradient(to right, #00a8ff, #0097e6)";
        default:
          return "#dcdde1";
      }
    };
  
    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: getBackground(),
          zIndex: -1,
        }}
      />
    );
  };
  
  export default WeatherBackground;
  