'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router'; // Import from 'next/router' instead of 'next/navigation'
import { useSelector, useDispatch } from 'react-redux';
import { ArrowLeft, TrendingUp, DollarSign, BarChart3, Heart,Clock, Percent } from 'lucide-react';
import { format } from 'date-fns';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area, AreaChart } from 'recharts';
import { toggleCityFavorite } from '../../redux/slices/favouritesSlice.js';
import { fetchCryptoHistory } from '../../redux/slices/cryptoSlice.js';

const INTERVALS = [
  { label: '1H', value: 'm1', duration: 60 * 60 * 1000 },
  { label: '24H', value: 'm15', duration: 24 * 60 * 60 * 1000 },
  { label: '7D', value: 'h1', duration: 7 * 24 * 60 * 60 * 1000 },
  { label: '30D', value: 'h6', duration: 30 * 24 * 60 * 60 * 1000 },
];

const CryptoDetails = () => {
  const router = useRouter();
  const { id } = router.query; // Use router.query to access dynamic route parameter
  const dispatch = useDispatch();

  const [selectedInterval, setSelectedInterval] = useState(INTERVALS[2]);

  const cryptoData = useSelector((state) =>
    state.crypto.data.find((crypto) => crypto.id === id)
  );
  const history = useSelector((state) => state.crypto.history[id] || []);
  const historyStatus = useSelector((state) => state.crypto.historyStatus);
  const historyError = useSelector((state) => state.crypto.historyError);
  const isFavorite = useSelector((state) => 
    state.favorites.cryptos.includes(id)
  );

  useEffect(() => {
    if (id) {
      const end = Date.now();
      const start = end - selectedInterval.duration;
      dispatch(
        fetchCryptoHistory({
          id,
          interval: selectedInterval.value,
          start,
          end,
        })
      );
    }
  }, [id, selectedInterval, dispatch]);

  if (!cryptoData) {
    return (
      <div className="text-center py-12">
        <p className="text-xl text-gray-400">Cryptocurrency not found</p>
        <button
          onClick={() => router.push('/')}
          className="text-blue-400 hover:text-blue-300 mt-4 inline-block"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const chartData = history.map((item) => ({
    time: format(new Date(item.timestamp), 'MMM d, HH:mm'),
    price: parseFloat(item.price).toFixed(2),
    volume: (item.volume / 1e6).toFixed(2),
    marketCap: (item.marketCap / 1e9).toFixed(2),
  }));

  const priceChange = parseFloat(cryptoData.changePercent24Hr);
  const priceChangeColor =
    priceChange >= 0 ? 'text-green-400' : 'text-red-400';

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
          onClick={() => dispatch(toggleCryptoFavorite(id))}
          className={`p-2 rounded-full transition ${
            isFavorite ? 'text-red-400 hover:text-red-300' : 'text-gray-400 hover:text-white'
          }`}
        >
          <Heart className="h-6 w-6" fill={isFavorite ? 'currentColor' : 'none'} />
        </button>
      </div>

      <div className="bg-gray-800 rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{cryptoData.name}</h1>
            <p className="text-5xl font-bold mb-4">
              ${parseFloat(cryptoData.priceUsd).toFixed(2)}
            </p>
            <p className={`text-xl mb-4 ${priceChangeColor}`}>
              {priceChange.toFixed(2)}% (24h)
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center">
                <DollarSign className="h-5 w-5 text-yellow-400 mr-2" />
                <span>
                  Market Cap: $
                  {(parseFloat(cryptoData.marketCapUsd) / 1e9).toFixed(2)}B
                </span>
              </div>
              <div className="flex items-center">
                <BarChart3 className="h-5 w-5 text-yellow-400 mr-2" />
                <span>
                  Volume (24h): $
                  {(parseFloat(cryptoData.volumeUsd24Hr) / 1e6).toFixed(2)}M
                </span>
              </div>
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-yellow-400 mr-2" />
                <span>Rank: #{cryptoData.rank}</span>
              </div>
              <div className="flex items-center">
                <Percent className="h-5 w-5 text-yellow-400 mr-2" />
                <span>
                  Supply: {(parseFloat(cryptoData.supply) / 1e6).toFixed(2)}M
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <TrendingUp className={`h-32 w-32 ${priceChangeColor}`} />
          </div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Price History</h2>
          <div className="flex space-x-2">
            {INTERVALS.map((interval) => (
              <button
                key={interval.value}
                onClick={() => setSelectedInterval(interval)}
                className={`px-3 py-1 rounded ${
                  selectedInterval.value === interval.value
                    ? 'bg-yellow-400 text-gray-900'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {interval.label}
              </button>
            ))}
          </div>
        </div>

        {historyStatus === 'loading' ? (
          <div className="h-96 flex items-center justify-center">
            <p className="text-gray-400">Loading price history...</p>
          </div>
        ) : historyError ? (
          <div className="h-96 flex items-center justify-center">
            <p className="text-red-400">{historyError}</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
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
                    stroke="#FCD34D"
                    tick={{ fill: '#9CA3AF' }}
                    domain={['auto', 'auto']}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: 'none',
                      borderRadius: '0.5rem',
                    }}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="price"
                    name="Price"
                    stroke="#FCD34D"
                    fill="#FCD34D"
                    fillOpacity={0.2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
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
                    stroke="#34D399"
                    tick={{ fill: '#9CA3AF' }}
                    domain={['auto', 'auto']}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: 'none',
                      borderRadius: '0.5rem',
                    }}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="volume"
                    name="Volume (M)"
                    stroke="#34D399"
                    fill="#34D399"
                    fillOpacity={0.2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CryptoDetails;
