'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Cloud, 
  Sun, 
  CloudRain, 
  CloudSnow, 
  CloudLightning, 
  CloudFog, 
  Wind, 
  Droplets, 
  Thermometer, 
  MapPin, 
  Search, 
  Moon, 
  SunMoon, 
  Globe,
  Star,
  StarOff,
  AlertCircle
} from 'lucide-react';

interface WeatherData {
  name: string;
  country: string;
  temp: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  description: string;
  main: string;
  icon: string;
}

interface ForecastData {
  date: string;
  temp: { min: number; max: number };
  description: string;
  main: string;
  icon: string;
}

const translations = {
  en: {
    title: 'Weather App',
    search: 'Search city...',
    searchButton: 'Search',
    currentLocation: 'Use Current Location',
    temperature: 'Temperature',
    feelsLike: 'Feels like',
    humidity: 'Humidity',
    windSpeed: 'Wind Speed',
    forecast: '5-Day Forecast',
    darkMode: 'Dark Mode',
    language: 'Language',
    favorite: 'Favorite',
    removeFavorite: 'Remove Favorite',
    addFavorite: 'Add to Favorites',
    loading: 'Loading...',
    error: 'Error loading weather data',
    locationError: 'Unable to get your location',
    cityNotFound: 'City not found. Please check the spelling and try again.',
    apiError: 'Weather service temporarily unavailable. Please try again later.',
    days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  },
  ar: {
    title: 'تطبيق الطقس',
    search: 'البحث عن مدينة...',
    searchButton: 'بحث',
    currentLocation: 'استخدام الموقع الحالي',
    temperature: 'درجة الحرارة',
    feelsLike: 'تشعر وكأنها',
    humidity: 'الرطوبة',
    windSpeed: 'سرعة الرياح',
    forecast: 'توقعات 5 أيام',
    darkMode: 'الوضع المظلم',
    language: 'اللغة',
    favorite: 'المفضلة',
    removeFavorite: 'إزالة من المفضلة',
    addFavorite: 'أضف إلى المفضلة',
    loading: 'جاري التحميل...',
    error: 'خطأ في تحميل بيانات الطقس',
    locationError: 'غير قادر على الحصول على موقعك',
    cityNotFound: 'المدينة غير موجودة. يرجى التحقق من الإملاء والمحاولة مرة أخرى.',
    apiError: 'خدمة الطقس غير متاحة مؤقتاً. يرجى المحاولة مرة أخرى لاحقاً.',
    days: ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
    months: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر']
  },
  tr: {
    title: 'Hava Durumu',
    search: 'Şehir ara...',
    searchButton: 'Ara',
    currentLocation: 'Mevcut Konumu Kullan',
    temperature: 'Sıcaklık',
    feelsLike: 'Hissedilen',
    humidity: 'Nem',
    windSpeed: 'Rüzgar Hızı',
    forecast: '5 Günlük Tahmin',
    darkMode: 'Karanlık Mod',
    language: 'Dil',
    favorite: 'Favori',
    removeFavorite: 'Favorilerden Kaldır',
    addFavorite: 'Favorilere Ekle',
    loading: 'Yükleniyor...',
    error: 'Hava durumu verileri yüklenirken hata',
    locationError: 'Konumunuz alınamadı',
    cityNotFound: 'Şehir bulunamadı. Lütfen yazımı kontrol edin ve tekrar deneyin.',
    apiError: 'Hava durumu servisi geçici olarak kullanılamıyor. Lütfen daha sonra tekrar deneyin.',
    days: ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'],
    months: ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara']
  }
};

const getWeatherIcon = (main: string, size: number = 48) => {
  const iconProps = { size, className: 'text-blue-500' };
  
  switch (main.toLowerCase()) {
    case 'clear':
      return <Sun {...iconProps} className="text-yellow-500" />;
    case 'clouds':
      return <Cloud {...iconProps} className="text-gray-500" />;
    case 'rain':
      return <CloudRain {...iconProps} className="text-blue-500" />;
    case 'snow':
      return <CloudSnow {...iconProps} className="text-blue-200" />;
    case 'thunderstorm':
      return <CloudLightning {...iconProps} className="text-purple-500" />;
    case 'drizzle':
      return <CloudRain {...iconProps} className="text-blue-400" />;
    case 'mist':
    case 'fog':
    case 'haze':
    case 'smoke':
    case 'dust':
    case 'sand':
      return <CloudFog {...iconProps} className="text-gray-400" />;
    default:
      return <Sun {...iconProps} className="text-yellow-500" />;
  }
};

const getWeatherBackground = (main: string) => {
  switch (main.toLowerCase()) {
    case 'clear':
      return 'bg-gradient-to-br from-yellow-400 via-orange-500 to-pink-500';
    case 'clouds':
      return 'bg-gradient-to-br from-gray-400 via-gray-500 to-gray-600';
    case 'rain':
    case 'drizzle':
      return 'bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600';
    case 'snow':
      return 'bg-gradient-to-br from-blue-200 via-blue-300 to-blue-400';
    case 'thunderstorm':
      return 'bg-gradient-to-br from-purple-400 via-purple-500 to-purple-600';
    case 'mist':
    case 'fog':
    case 'haze':
    case 'smoke':
    case 'dust':
    case 'sand':
      return 'bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500';
    default:
      return 'bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600';
  }
};

export default function WeatherApp() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [forecastData, setForecastData] = useState<ForecastData[]>([]);
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState<'en' | 'ar' | 'tr'>('en');
  const [favoriteCity, setFavoriteCity] = useState<string>('');

  const t = translations[language];
  // Using a working API key
  const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;

  useEffect(() => {
    // Load saved preferences
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    const savedLanguage = (localStorage.getItem('language') as 'en' | 'ar' | 'tr') || 'en';
    const savedFavorite = localStorage.getItem('favoriteCity') || '';
    
    setDarkMode(savedDarkMode);
    setLanguage(savedLanguage);
    setFavoriteCity(savedFavorite);
    
    // Load weather for favorite city or get current location
    if (savedFavorite) {
      fetchWeatherByCity(savedFavorite);
    } else {
      getCurrentLocation();
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode.toString());
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeatherByCoords(latitude, longitude);
        },
        (error) => {
          console.error('Geolocation error:', error.message);
          setError(t.locationError);
          setLoading(false);
          // Fallback to a default city
          fetchWeatherByCity('London');
        }
      );
    } else {
      setError(t.locationError);
      // Fallback to a default city
      fetchWeatherByCity('London');
    }
  };

  const fetchWeatherByCity = async (cityName: string) => {
    setLoading(true);
    setError('');
    
    try {
      console.log('Fetching weather for:', cityName);
      
      // Fetch current weather
      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cityName)}&appid=${API_KEY}&units=metric`;
      console.log('Weather URL:', weatherUrl);
      
      const weatherResponse = await fetch(weatherUrl);
      console.log('Weather response status:', weatherResponse.status);
      
      if (!weatherResponse.ok) {
        const errorText = await weatherResponse.text();
        console.error('Weather API error:', errorText);
        
        if (weatherResponse.status === 404) {
          throw new Error(t.cityNotFound);
        } else if (weatherResponse.status === 401) {
          throw new Error('Invalid API key. Please check your OpenWeatherMap API key.');
        } else {
          throw new Error(`${t.apiError} (Status: ${weatherResponse.status})`);
        }
      }
      
      const weatherJson = await weatherResponse.json();
      console.log('Weather data:', weatherJson);
      
      const currentWeather: WeatherData = {
        name: weatherJson.name,
        country: weatherJson.sys.country,
        temp: Math.round(weatherJson.main.temp),
        feelsLike: Math.round(weatherJson.main.feels_like),
        humidity: weatherJson.main.humidity,
        windSpeed: Math.round(weatherJson.wind.speed * 10) / 10,
        description: weatherJson.weather[0].description,
        main: weatherJson.weather[0].main,
        icon: weatherJson.weather[0].icon
      };
      
      // Fetch 5-day forecast
      const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(cityName)}&appid=${API_KEY}&units=metric`;
      console.log('Forecast URL:', forecastUrl);
      
      const forecastResponse = await fetch(forecastUrl);
      console.log('Forecast response status:', forecastResponse.status);
      
      if (!forecastResponse.ok) {
        const errorText = await forecastResponse.text();
        console.error('Forecast API error:', errorText);
        throw new Error(`${t.apiError} (Forecast Status: ${forecastResponse.status})`);
      }
      
      const forecastJson = await forecastResponse.json();
      console.log('Forecast data:', forecastJson);
      
      // Process forecast data - get one forecast per day at noon
      const dailyForecasts: ForecastData[] = [];
      const processedDates = new Set();
      
      forecastJson.list.forEach((item: any) => {
        const date = new Date(item.dt * 1000);
        const dateString = date.toDateString();
        
        // Skip today and only process each day once, preferring noon forecasts
        if (!processedDates.has(dateString) && dailyForecasts.length < 5) {
          const hour = date.getHours();
          if (hour >= 11 && hour <= 13) { // Prefer noon forecasts
            processedDates.add(dateString);
            dailyForecasts.push({
              date: item.dt_txt,
              temp: {
                min: Math.round(item.main.temp_min),
                max: Math.round(item.main.temp_max)
              },
              description: item.weather[0].description,
              main: item.weather[0].main,
              icon: item.weather[0].icon
            });
          }
        }
      });
      
      // If we don't have enough noon forecasts, fill with any available
      if (dailyForecasts.length < 5) {
        const remainingForecasts: ForecastData[] = [];
        const usedDates = new Set(dailyForecasts.map(f => new Date(f.date).toDateString()));
        
        forecastJson.list.forEach((item: any) => {
          const date = new Date(item.dt * 1000);
          const dateString = date.toDateString();
          
          if (!usedDates.has(dateString) && remainingForecasts.length < (5 - dailyForecasts.length)) {
            usedDates.add(dateString);
            remainingForecasts.push({
              date: item.dt_txt,
              temp: {
                min: Math.round(item.main.temp_min),
                max: Math.round(item.main.temp_max)
              },
              description: item.weather[0].description,
              main: item.weather[0].main,
              icon: item.weather[0].icon
            });
          }
        });
        
        dailyForecasts.push(...remainingForecasts);
      }
      
      setWeatherData(currentWeather);
      setForecastData(dailyForecasts.slice(0, 5));
      console.log('Weather data set successfully');
    } catch (err) {
      console.error('Error fetching weather:', err);
      setError(err instanceof Error ? err.message : t.error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWeatherByCoords = async (lat: number, lon: number) => {
    setLoading(true);
    setError('');
    
    try {
      console.log('Fetching weather for coordinates:', lat, lon);
      
      // Fetch current weather by coordinates
      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
      console.log('Weather URL:', weatherUrl);
      
      const weatherResponse = await fetch(weatherUrl);
      console.log('Weather response status:', weatherResponse.status);
      
      if (!weatherResponse.ok) {
        const errorText = await weatherResponse.text();
        console.error('Weather API error:', errorText);
        
        if (weatherResponse.status === 401) {
          throw new Error('Invalid API key. Please check your OpenWeatherMap API key.');
        } else {
          throw new Error(`${t.apiError} (Status: ${weatherResponse.status})`);
        }
      }
      
      const weatherJson = await weatherResponse.json();
      console.log('Weather data:', weatherJson);
      
      const currentWeather: WeatherData = {
        name: weatherJson.name,
        country: weatherJson.sys.country,
        temp: Math.round(weatherJson.main.temp),
        feelsLike: Math.round(weatherJson.main.feels_like),
        humidity: weatherJson.main.humidity,
        windSpeed: Math.round(weatherJson.wind.speed * 10) / 10,
        description: weatherJson.weather[0].description,
        main: weatherJson.weather[0].main,
        icon: weatherJson.weather[0].icon
      };
      
      // Fetch 5-day forecast by coordinates
      const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
      console.log('Forecast URL:', forecastUrl);
      
      const forecastResponse = await fetch(forecastUrl);
      console.log('Forecast response status:', forecastResponse.status);
      
      if (!forecastResponse.ok) {
        const errorText = await forecastResponse.text();
        console.error('Forecast API error:', errorText);
        throw new Error(`${t.apiError} (Forecast Status: ${forecastResponse.status})`);
      }
      
      const forecastJson = await forecastResponse.json();
      console.log('Forecast data:', forecastJson);
      
      // Process forecast data - get one forecast per day at noon
      const dailyForecasts: ForecastData[] = [];
      const processedDates = new Set();
      
      forecastJson.list.forEach((item: any) => {
        const date = new Date(item.dt * 1000);
        const dateString = date.toDateString();
        
        // Skip today and only process each day once, preferring noon forecasts
        if (!processedDates.has(dateString) && dailyForecasts.length < 5) {
          const hour = date.getHours();
          if (hour >= 11 && hour <= 13) { // Prefer noon forecasts
            processedDates.add(dateString);
            dailyForecasts.push({
              date: item.dt_txt,
              temp: {
                min: Math.round(item.main.temp_min),
                max: Math.round(item.main.temp_max)
              },
              description: item.weather[0].description,
              main: item.weather[0].main,
              icon: item.weather[0].icon
            });
          }
        }
      });
      
      // If we don't have enough noon forecasts, fill with any available
      if (dailyForecasts.length < 5) {
        const remainingForecasts: ForecastData[] = [];
        const usedDates = new Set(dailyForecasts.map(f => new Date(f.date).toDateString()));
        
        forecastJson.list.forEach((item: any) => {
          const date = new Date(item.dt * 1000);
          const dateString = date.toDateString();
          
          if (!usedDates.has(dateString) && remainingForecasts.length < (5 - dailyForecasts.length)) {
            usedDates.add(dateString);
            remainingForecasts.push({
              date: item.dt_txt,
              temp: {
                min: Math.round(item.main.temp_min),
                max: Math.round(item.main.temp_max)
              },
              description: item.weather[0].description,
              main: item.weather[0].main,
              icon: item.weather[0].icon
            });
          }
        });
        
        dailyForecasts.push(...remainingForecasts);
      }
      
      setWeatherData(currentWeather);
      setForecastData(dailyForecasts.slice(0, 5));
      console.log('Weather data set successfully');
    } catch (err) {
      console.error('Error fetching weather:', err);
      setError(err instanceof Error ? err.message : t.error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (city.trim()) {
      fetchWeatherByCity(city.trim());
    }
  };

  const toggleFavorite = () => {
    if (weatherData) {
      const cityName = weatherData.name;
      if (favoriteCity === cityName) {
        setFavoriteCity('');
        localStorage.removeItem('favoriteCity');
      } else {
        setFavoriteCity(cityName);
        localStorage.setItem('favoriteCity', cityName);
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const dayName = t.days[date.getDay()];
    const month = t.months[date.getMonth()];
    const day = date.getDate();
    return `${dayName}, ${month} ${day}`;
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      weatherData ? getWeatherBackground(weatherData.main) : 'bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600'
    }`}>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-2">
              <SunMoon className="text-yellow-300" />
              {t.title}
            </h1>
          </div>

          {/* Controls */}
          <Card className="mb-8 backdrop-blur-md bg-white/10 border-white/20">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4 items-center">
                <form onSubmit={handleSearch} className="flex-1 flex gap-2">
                  <Input
                    type="text"
                    placeholder={t.search}
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="flex-1 bg-white/20 border-white/30 text-white placeholder:text-white/70"
                  />
                  <Button type="submit" variant="secondary">
                    <Search className="w-4 h-4 mr-2" />
                    {t.searchButton}
                  </Button>
                </form>
                
                <Button onClick={getCurrentLocation} variant="outline" className="border-white/30 text-black hover:bg-white/20">
                  <MapPin className="w-4 h-4 mr-2" />
                  {t.currentLocation}
                </Button>
              </div>
              
              <Separator className="my-4 bg-white/20" />
              
              <div className="flex flex-wrap gap-4 items-center justify-center">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="dark-mode"
                    checked={darkMode}
                    onCheckedChange={setDarkMode}
                  />
                  <Label htmlFor="dark-mode" className="text-white flex items-center gap-2">
                    <Moon className="w-4 h-4" />
                    {t.darkMode}
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Globe className="w-4 h-4 text-white" />
                  <Label className="text-white">{t.language}:</Label>
                  <Select value={language} onValueChange={(value: 'en' | 'ar' | 'tr') => setLanguage(value)}>
                    <SelectTrigger className="w-32 bg-white/20 border-white/30 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="ar">العربية</SelectItem>
                      <SelectItem value="tr">Türkçe</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Loading State */}
          {loading && (
            <Card className="mb-8 backdrop-blur-md bg-white/10 border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-center space-x-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                  <span className="text-white text-lg">{t.loading}</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Error State */}
          {error && (
            <Card className="mb-8 backdrop-blur-md bg-red-500/20 border-red-500/30">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2 text-white">
                  <AlertCircle className="w-5 h-5" />
                  <span>{error}</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Current Weather */}
          {weatherData && (
            <Card className="mb-8 backdrop-blur-md bg-white/10 border-white/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-white flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    {weatherData.name}, {weatherData.country}
                  </div>
                  <Button
                    onClick={toggleFavorite}
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20"
                  >
                    {favoriteCity === weatherData.name ? (
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ) : (
                      <StarOff className="w-5 h-5" />
                    )}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="flex justify-center mb-4">
                      {getWeatherIcon(weatherData.main, 80)}
                    </div>
                    <div className="text-6xl font-bold text-white mb-2">
                      {weatherData.temp}°C
                    </div>
                    <div className="text-white/80 text-lg capitalize mb-2">
                      {weatherData.description}
                    </div>
                    <div className="text-white/70">
                      {t.feelsLike} {weatherData.feelsLike}°C
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/10 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <Droplets className="w-5 h-5 text-blue-300 mr-2" />
                        <span className="text-white/80 text-sm">{t.humidity}</span>
                      </div>
                      <div className="text-white text-xl font-semibold">
                        {weatherData.humidity}%
                      </div>
                    </div>
                    
                    <div className="bg-white/10 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <Wind className="w-5 h-5 text-green-300 mr-2" />
                        <span className="text-white/80 text-sm">{t.windSpeed}</span>
                      </div>
                      <div className="text-white text-xl font-semibold">
                        {weatherData.windSpeed} m/s
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 5-Day Forecast */}
          {forecastData.length > 0 && (
            <Card className="backdrop-blur-md bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Thermometer className="w-5 h-5" />
                  {t.forecast}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {forecastData.map((day, index) => (
                    <div key={index} className="bg-white/10 rounded-lg p-4 text-center">
                      <div className="text-white/80 text-sm mb-2">
                        {formatDate(day.date)}
                      </div>
                      <div className="flex justify-center mb-2">
                        {getWeatherIcon(day.main, 32)}
                      </div>
                      <div className="text-white text-lg font-semibold mb-1">
                        {day.temp.max}°
                      </div>
                      <div className="text-white/70 text-sm">
                        {day.temp.min}°
                      </div>
                      <div className="text-white/60 text-xs mt-2 capitalize">
                        {day.description}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}