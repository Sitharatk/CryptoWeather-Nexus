// redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import weatherReducer from '../redux/slices/weatherSlice.js';
import cryptoReducer from '../redux/slices/cryptoSlice.js';

export const store = configureStore({
  reducer: {
    weather: weatherReducer,
    crypto: cryptoReducer,
  },
});
