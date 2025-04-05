// redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import weatherReducer from '../redux/slices/weatherSlice.js';


export const store = configureStore({
  reducer: {
    weather: weatherReducer,
  
  },
});
