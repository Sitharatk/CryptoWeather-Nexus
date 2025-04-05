import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const COINS = ['bitcoin', 'ethereum', 'dogecoin'];
const RATE_LIMIT_DELAY = 1000; 

const fetchWithRetry = async (url, retries = 3, delay = RATE_LIMIT_DELAY) => {
  for (let i = 0; i < retries; i++) {
    try {
      await new Promise(resolve => setTimeout(resolve, delay * i)); 
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      if (i === retries - 1) throw error;
      if (error.response?.status !== 429) throw error;
    }
  }
};

export const fetchCryptoData = createAsyncThunk(
  'crypto/fetchCryptoData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchWithRetry(
        `https://api.coincap.io/v2/assets?ids=${COINS.join(',')}`
      );
      return response.data;
    } catch (error) {
      if (error.response?.status === 429) {
        return rejectWithValue('Rate limit exceeded. Please try again in a few minutes.');
      }
      return rejectWithValue('Failed to fetch cryptocurrency data. Please try again later.');
    }
  }
);

export const fetchCryptoHistory = createAsyncThunk(
  'crypto/fetchCryptoHistory',
  async ({ id, interval = 'h1', start, end }, { rejectWithValue }) => {
    try {
      const response = await fetchWithRetry(
        `https://api.coincap.io/v2/assets/${id}/history?interval=${interval}${start ? `&start=${start}` : ''}${end ? `&end=${end}` : ''}`
      );
      return {
        id,
        history: response.data.map(item => ({
          timestamp: item.time,
          price: parseFloat(item.priceUsd),
          volume: parseFloat(item.volumeUsd),
          marketCap: parseFloat(item.marketCapUsd)
        }))
      };
    } catch (error) {
      return rejectWithValue('Failed to fetch cryptocurrency history');
    }
  }
);

const cryptoSlice = createSlice({
  name: 'crypto',
  initialState: {
    data: [],
    status: 'idle',
    error: null,
    history: {},
    historyStatus: 'idle',
    historyError: null
  },
  reducers: {
    updateCryptoPrice: (state, action) => {
      const { id, price } = action.payload;
      const crypto = state.data.find(c => c.id === id);
      if (crypto) {
        crypto.priceUsd = price;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCryptoData.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchCryptoData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
        state.error = null;
      })
      .addCase(fetchCryptoData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch crypto data';
      })
      .addCase(fetchCryptoHistory.pending, (state) => {
        state.historyStatus = 'loading';
        state.historyError = null;
      })
      .addCase(fetchCryptoHistory.fulfilled, (state, action) => {
        state.historyStatus = 'succeeded';
        state.history[action.payload.id] = action.payload.history;
        state.historyError = null;
      })
      .addCase(fetchCryptoHistory.rejected, (state, action) => {
        state.historyStatus = 'failed';
        state.historyError = action.payload;
      });
  },
});

export const { updateCryptoPrice } = cryptoSlice.actions;
export default cryptoSlice.reducer;