import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { ArrowLeft, Heart, Cloud, Droplets, Wind, Thermometer, Sun } from 'lucide-react';
import { format } from 'date-fns';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { toggleCityFavorite } from '../../redux/slices/favouritesSlice.js';
import { fetchCityForecast } from '../../redux/slices/weatherSlice.js';

const CityDetails = () => {
  const router = useRouter();
  const { id } = router.query;
  const dispatch = useDispatch();
  const cityData = useSelector((state) => 
    state.weather.data.find(city => city.id.toString() === id)
  );
  const forecast = useSelector((state) => state.weather.forecasts[id] || []);
  const forecastStatus = useSelector((state) => state.weather.forecastStatus);
  const forecastError = useSelector((state) => state.weather.forecastError);
  const isFavorite = useSelector((state) => 
    state.favorites.cities.includes(id)
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchCityForecast(id));
    }
  }, [id, dispatch]);

  if (!cityData) {
    return (
      <div className="text-center py-12">
        <p className="text-xl text-gray-400">City not found</p>
        <button
          onClick={() => router.push('/')}
          className="text-blue-400 hover:text-blue-300 mt-4 inline-block"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const chartData = forecast.map(item => ({
    time: format(new Date(item.dt * 1000), 'MMM d, HH:mm'),
    temperature: Math.round(item.temp),
    humidity: item.humidity,
    windSpeed: Math.round(item.wind)
  }));

  return (
    <div className="space-y-6 ">
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push('/')}
          className="flex items-center text-gray-400 hover:text-white transition"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Dashboard
        </button>
        <button
          onClick={() => dispatch(toggleCityFavorite(id))}
          className={`p-2 rounded-full transition ${isFavorite ? 'text-red-400 hover:text-red-300' : 'text-gray-400 hover:text-white'}`}
        >
          <Heart className="h-6 w-6" fill={isFavorite ? 'currentColor' : 'none'} />
        </button>
      </div>

      <div className="bg-gray-800 rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{cityData.name}</h1>
            <p className="text-5xl font-bold mb-4">
              {Math.round(cityData.main.temp)}°C
            </p>
            <p className="text-xl text-gray-400 capitalize mb-4">
              {cityData.weather[0].description}
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center">
                <Droplets className="h-5 w-5 text-blue-400 mr-2" />
                <span>Humidity: {cityData.main.humidity}%</span>
              </div>
              <div className="flex items-center">
                <Wind className="h-5 w-5 text-blue-400 mr-2" />
                <span>Wind: {Math.round(cityData.wind.speed)} m/s</span>
              </div>
              <div className="flex items-center">
                <Thermometer className="h-5 w-5 text-blue-400 mr-2" />
                <span>Feels like: {Math.round(cityData.main.feels_like)}°C</span>
              </div>
              <div className="flex items-center">
                <Sun className="h-5 w-5 text-blue-400 mr-2" />
                <span>Pressure: {cityData.main.pressure} hPa</span>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <Cloud className="h-32 w-32 text-blue-400" />
          </div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">5-Day Forecast</h2>
        {forecastStatus === 'loading' ? (
          <div className="h-96 flex items-center justify-center">
            <p className="text-gray-400">Loading forecast data...</p>
          </div>
        ) : forecastError ? (
          <div className="h-96 flex items-center justify-center">
            <p className="text-red-400">{forecastError}</p>
          </div>
        ) : (
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="time"
                  stroke="#9CA3AF"
                  tick={{ fill: '#9CA3AF' }}
                  angle={-45}
                  textAnchor="end"
                  height={70}
                />
                <YAxis
                  yAxisId="temp"
                  stroke="#60A5FA"
                  tick={{ fill: '#60A5FA' }}
                  label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft', fill: '#60A5FA' }}
                />
                <YAxis
                  yAxisId="humidity"
                  orientation="right"
                  stroke="#34D399"
                  tick={{ fill: '#34D399' }}
                  label={{ value: 'Humidity (%)', angle: 90, position: 'insideRight', fill: '#34D399' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: 'none',
                    borderRadius: '0.5rem',
                  }}
                />
                <Legend />
                <Line
                  yAxisId="temp"
                  type="monotone"
                  dataKey="temperature"
                  name="Temperature"
                  stroke="#60A5FA"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  yAxisId="humidity"
                  type="monotone"
                  dataKey="humidity"
                  name="Humidity"
                  stroke="#34D399"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Hourly Forecast</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {forecast.slice(0, 12).map((item, index) => (
            <div key={index} className="bg-gray-700 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-400 mb-2">
                {format(new Date(item.dt * 1000), 'HH:mm')}
              </p>
              <img
                src={`https://openweathermap.org/img/wn/${item.icon}.png`}
                alt={item.description}
                className="w-12 h-12 mx-auto"
              />
              <p className="text-xl font-bold">{Math.round(item.temp)}°C</p>
              <p className="text-sm text-gray-400 mt-1">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CityDetails;

