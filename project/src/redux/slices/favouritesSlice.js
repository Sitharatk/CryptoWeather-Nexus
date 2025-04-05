import { createSlice } from '@reduxjs/toolkit';

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState: {
    cities: [],
    cryptos: [],
  },
  reducers: {
    toggleCityFavorite: (state, action) => {
      const cityId = action.payload;
      const index = state.cities.indexOf(cityId);
      if (index === -1) {
        state.cities.push(cityId);
      } else {
        state.cities.splice(index, 1);
      }
    },
    toggleCryptoFavorite: (state, action) => {
      const cryptoId = action.payload;
      const index = state.cryptos.indexOf(cryptoId);
      if (index === -1) {
        state.cryptos.push(cryptoId);
      } else {
        state.cryptos.splice(index, 1);
      }
    },
  },
});

export const { toggleCityFavorite, toggleCryptoFavorite } = favoritesSlice.actions;
export default favoritesSlice.reducer;