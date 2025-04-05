'use client';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWeatherData } from '../redux/slices/weatherSlice.js';
import { Cloud } from 'lucide-react';
import { useRouter } from 'next/router'; // <-- Import useRouter

const Home = () => {
  const dispatch = useDispatch();
  const weather = useSelector((state) => state.weather);
  const router = useRouter(); // <-- Initialize router

  useEffect(() => {
    dispatch(fetchWeatherData());

    const interval = setInterval(() => {
      dispatch(fetchWeatherData());
    }, 60000);

    return () => clearInterval(interval);
  }, [dispatch]);

  const navigateToCityDetails = (cityId) => {
    router.push(`/city/${cityId}`);
  };

  const renderWeatherSection = (cities) => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {cities.map((city) => (
        <div
          key={city.id}
          className="bg-gray-800 p-6 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors"
          onClick={() => navigateToCityDetails(city.id)}
        >
          <h3 className="text-xl font-semibold mb-2">{city.name}</h3>
          <div className="space-y-2">
            <p className="text-3xl">{Math.round(city.main.temp)}°C</p>
            <p className="text-gray-400">{city.weather[0].description}</p>
            <p>Humidity: {city.main.humidity}%</p>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-8 p-6">
      <section>
        <div className="flex items-center mb-4">
          <Cloud className="h-6 w-6 mr-2 text-blue-400" />
          <h2 className="text-2xl font-bold">Weather Overview</h2>
        </div>
        {weather.status === 'loading' ? (
          <p className="text-gray-400">Loading weather data...</p>
        ) : weather.error ? (
          <p className="text-red-400">{weather.error}</p>
        ) : (
          renderWeatherSection(weather.data)
        )}
      </section>
    </div>
  );
};

export default Home;
