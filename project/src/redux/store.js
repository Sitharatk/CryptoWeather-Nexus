// redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import weatherReducer from '../redux/slices/weatherSlice.js';
import cryptoReducer from '../redux/slices/cryptoSlice.js';
import newsReducer from '../redux/slices/newsSlice.js'

export const store = configureStore({
  reducer: {
    weather: weatherReducer,
    crypto: cryptoReducer,
    news: newsReducer,
  },
});
