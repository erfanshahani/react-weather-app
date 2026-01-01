const API_KEY = '3588bc818593915563499238cac95b0a';

// دریافت اطلاعات آب و هوای فعلی
export const fetchWeather = async (cityName) => {
  if (!cityName || !cityName.trim()) return null;

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric&lang=fa`
    );
    const data = await response.json();

    if (data.cod === 200) {
      return data;
    } else {
      throw new Error('شهر یافت نشد!');
    }
  } catch (error) {
    throw new Error('خطا در دریافت اطلاعات!');
  }
};

// دریافت پیش‌بینی ۵ روزه
export const fetchForecast = async (cityName) => {
  if (!cityName || !cityName.trim()) return [];

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${API_KEY}&units=metric&lang=fa`
    );
    const data = await response.json();

    if (data.cod === '200') {
      // فیلتر کردن برای نمایش فقط ساعت 12:00 هر روز
      const dailyForecast = data.list.filter(item =>
        item.dt_txt.includes('12:00:00')
      );
      return dailyForecast;
    }
    return [];
  } catch (error) {
    console.error('خطا در دریافت پیش‌بینی:', error);
    return [];
  }
};

// جستجوی موقعیت جغرافیایی
export const searchLocation = async (query) => {
  if (!query || !query.trim()) return [];

  try {
    const response = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${API_KEY}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('خطا در جستجوی موقعیت:', error);
    return [];
  }
};

// دریافت نام شهر از مختصات جغرافیایی
export const reverseGeocode = async (latitude, longitude) => {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('خطا در دریافت نام شهر:', error);
    return [];
  }
};

