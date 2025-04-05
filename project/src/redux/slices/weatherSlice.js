// redux/slices/weatherSlice.js
import { createSlice } from '@reduxjs/toolkit';

export const weatherSlice = createSlice({
  name: 'weather',
  initialState: {
    data: [],
    forecasts: {},
  },
  reducers: {
    setWeatherData: (state, action) => {
      state.data = action.payload;
    },
    setCityForecast: (state, action) => {
      state.forecasts[action.payload.cityId] = action.payload.forecast;
    },
  },
});

export const { setWeatherData, setCityForecast } = weatherSlice.actions;
export default weatherSlice.reducer;
