// تابع تشخیص وضعیت آب‌وهوا برای انیمیشن
export const getWeatherAnimationClass = (main, description = '') => {
  const descLower = description.toLowerCase();
  if (main === 'Snow' || descLower.includes('برف') || descLower.includes('snow')) {
    return 'snow-animation';
  }
  if (main === 'Rain' || main === 'Drizzle' || descLower.includes('باران') || descLower.includes('rain')) {
    return 'rain-animation';
  }
  if (main === 'Clear' || descLower.includes('صاف') || descLower.includes('آفتابی') || descLower.includes('clear')) {
    return 'sun-animation';
  }
  return '';
};

// تابع تولید توصیه بر اساس شرایط آب و هوا
export const getWeatherAdvice = (dayData) => {
  const condition = dayData.weather[0].main;
  const temp = dayData.main.temp;
  const wind = dayData.wind.speed;
  const humidity = dayData.main.humidity;

  if (condition === 'Rain' || condition === 'Drizzle') {
    return 'چتر یا بارانی همراه داشته باشید، جاده‌ها ممکن است لغزنده باشند ☔';
  }
  if (condition === 'Snow') {
    return 'لباس گرم بپوشید و از زیبایی برف لذت ببرید، مراقب یخ‌زدگی باشید ❄️';
  }
  if (condition === 'Thunderstorm') {
    return 'رعد و برق در پیش است، از فضای باز دوری کنید و در خانه بمانید ⚡️';
  }
  if (condition === 'Clear') {
    if (temp > 35) {
      return 'هوای بسیار گرم و آفتابیه! آب زیاد بنوشید، ضدآفتاب بزنید و در سایه بمانید ☀️🔥';
    }
    if (temp > 28) {
      return 'هوای آفتابی و گرمه، لباس سبک بپوشید و از روز لذت ببرید ☀️';
    }
    if (temp < 10) {
      return 'هوای صاف و خنکه، روز عالی برای پیاده‌روی و تنفس هوای تازه 🌤️';
    }
    return 'هوای پاک و دلپذیره، بهترین روز برای فعالیت در فضای باز 😊';
  }
  if (condition === 'Clouds') {
    return 'هوا ابری است، اما باران در پیش نیست — روز آرام و مناسبی پیش رو دارید ☁️';
  }
  if (condition === 'Fog' || condition === 'Mist') {
    return 'مه غلیظ است، با احتیاط رانندگی کنید و از چراغ مه‌شکن استفاده کنید 🌫️';
  }
  if (temp > 38) {
    return 'هشدار گرمای شدید! از فعالیت سنگین خودداری کنید و در خانه بمانید 🥵';
  }
  if (temp < -5) {
    return 'هوای یخبندانه، لباس چند لایه بپوشید و مراقب سرمازدگی باشید 🥶';
  }
  if (humidity > 85) {
    return 'رطوبت بسیار بالاست، هوا شرجی است — تهویه مناسب داشته باشید 💧';
  }
  if (wind > 20) {
    return 'باد شدید است، مراقب اشیاء سبک و کلاه خود باشید 💨';
  }
  return 'روز خوبی پیش رو دارید، از آن لذت ببرید! 🌈';
};

