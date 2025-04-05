import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const WEATHER_API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;

const CITIES = [
  { name: 'New York', id: '5128581' },
  { name: 'London', id: '2643743' },
  { name: 'Tokyo', id: '1850147' }
];

export const fetchWeatherData = createAsyncThunk(
  'weather/fetchWeatherData',
  async (_, { rejectWithValue }) => {
    try {
      const promises = CITIES.map(city =>
        axios.get(`https://api.openweathermap.org/data/2.5/weather?id=${city.id}&appid=${WEATHER_API_KEY}&units=metric`)
      );
      const responses = await Promise.all(promises);
      return responses.map(response => response.data);
    } catch (error) {
      if (error.response?.status === 401) {
        return rejectWithValue('Invalid API key. Please check your OpenWeather API key in the .env file.');
      }
      return rejectWithValue('Failed to fetch weather data. Please try again later.');
    }
  }
);

export const fetchCityForecast = createAsyncThunk(
  'weather/fetchCityForecast',
  async (cityId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?id=${cityId}&appid=${WEATHER_API_KEY}&units=metric`
      );
      return {
        cityId,
        forecast: response.data.list.map(item => ({
          dt: item.dt,
          temp: item.main.temp,
          humidity: item.main.humidity,
          description: item.weather[0].description,
          icon: item.weather[0].icon,
          wind: item.wind.speed
        }))
      };
    } catch (error) {
      return rejectWithValue('Failed to fetch city forecast data');
    }
  }
);

const weatherSlice = createSlice({
  name: 'weather',
  initialState: {
    data: [],
    status: 'idle',
    error: null,
    alerts: [],
    forecasts: {},
    forecastStatus: 'idle',
    forecastError: null
  },
  reducers: {
    updateWeatherAlert: (state, action) => {
      state.alerts = [...(state.alerts || []), action.payload];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeatherData.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchWeatherData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
        state.error = null;
      })
      .addCase(fetchWeatherData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch weather data';
      })
      .addCase(fetchCityForecast.pending, (state) => {
        state.forecastStatus = 'loading';
        state.forecastError = null;
      })
      .addCase(fetchCityForecast.fulfilled, (state, action) => {
        state.forecastStatus = 'succeeded';
        state.forecasts[action.payload.cityId] = action.payload.forecast;
        state.forecastError = null;
      })
      .addCase(fetchCityForecast.rejected, (state, action) => {
        state.forecastStatus = 'failed';
        state.forecastError = action.payload;
      });
  },
});

export const { updateWeatherAlert } = weatherSlice.actions;
export default weatherSlice.reducer;