import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const CRYPTO_NEWS_API = 'https://min-api.cryptocompare.com/data/v2/news/?lang=EN';

export const fetchNewsData = createAsyncThunk(
  'news/fetchNewsData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(CRYPTO_NEWS_API);
      return response.data.Data.slice(0, 5).map(article => ({
        title: article.title,
        url: article.url,
        description: article.body.slice(0, 150) + '...',
        publishedAt: article.published_on,
      }));
    } catch (error) {
      return rejectWithValue('Failed to fetch news data. Please try again later.');
    }
  }
);

const newsSlice = createSlice({
  name: 'news',
  initialState: {
    articles: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNewsData.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchNewsData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.articles = action.payload;
        state.error = null;
      })
      .addCase(fetchNewsData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch news data';
      });
  },
});

export default newsSlice.reducer;