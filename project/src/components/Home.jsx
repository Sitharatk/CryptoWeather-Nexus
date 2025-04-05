'use client';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWeatherData } from '../redux/slices/weatherSlice.js';
import { fetchCryptoData } from '../redux/slices/cryptoSlice.js';
import { Cloud, TrendingUp, Newspaper, Star } from 'lucide-react';
import { useRouter } from 'next/router'; // <-- Import useRouter

const Home = () => {
  const dispatch = useDispatch();
  const weather = useSelector((state) => state.weather);
  const crypto = useSelector((state) => state.crypto);
  const router = useRouter(); // <-- Initialize router

  useEffect(() => {
    dispatch(fetchWeatherData());
    dispatch(fetchCryptoData());


    const interval = setInterval(() => {
      dispatch(fetchWeatherData());
      dispatch(fetchCryptoData());
    
    }, 60000);

    return () => clearInterval(interval);
  }, [dispatch]);


  const navigateToCityDetails = (cityId) => {
    router.push(`/city/${cityId}`);
  };

  const navigateToCryptoDetails = (coinId) => {
    router.push(`/crypto/${coinId}`);
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

  const renderCryptoSection = (coins) => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {coins.map((coin) => (
        <div
          key={coin.id}
          className="bg-gray-800 p-6 rounded-lg cursor-pointer hover:bg-gray-700 transition relative"
          onClick={() => navigateToCryptoDetails(coin.id)}
        >
         
          <h3 className="text-xl font-semibold mb-2">{coin.name}</h3>
          <div className="space-y-2">
            <p className="text-3xl">${parseFloat(coin.priceUsd).toFixed(2)}</p>
            <p className={`${parseFloat(coin.changePercent24Hr) > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {parseFloat(coin.changePercent24Hr).toFixed(2)}% (24h)
            </p>
            <p className="text-gray-400">
              Market Cap: ${(parseFloat(coin.marketCapUsd) / 1e9).toFixed(2)}B
            </p>
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

      <section>
        <div className="flex items-center mb-4">
          <TrendingUp className="h-6 w-6 mr-2 text-yellow-400" />
          <h2 className="text-2xl font-bold">Crypto Markets</h2>
        </div>
        {crypto.status === 'loading' ? (
          <div className="text-center py-8">
            <p className="text-gray-400">Loading crypto data...</p>
          </div>
        ) : crypto.error ? (
          <div className="text-center py-8">
            <p className="text-red-400">{crypto.error}</p>
          </div>
        ) : (
          renderCryptoSection(crypto.data)
        )}
      </section>
    </div>
  );
};

export default Home;
