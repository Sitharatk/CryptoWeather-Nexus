'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { Heart, X } from 'lucide-react';

const Navbar = () => {
  const [showFavorites, setShowFavorites] = useState(false);
  const favorites = useSelector((state) => state.favorites);

  const toggleFavorites = () => {
    setShowFavorites(!showFavorites);
  };

  return (
    <>
      <nav className="bg-gray-300 border-b rounded-md border-gray-600 mx-4 p-2">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
    
              <span className="text-2xl font-bold text-gray-700 font-">
                CryptoWeather Nexus
              </span>
        

            <div className="flex items-center space-x-4">
              <button onClick={toggleFavorites} className="text-gray-900 hover:text-red-400 transition">
                <Heart className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>

    
      {showFavorites && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-gray-300 rounded-lg w-11/12 max-w-lg p-6 relative">
            <button 
              onClick={toggleFavorites} 
              className="absolute top-3 right-3 text-gray-400 hover:text-white transition"
            >
              <X className="h-6 w-6" />
            </button>
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-4">Favorites</h2>

            <div className="mb-6">
              <h3 className="text-xl text-black mb-2">Favorite Cities</h3>
              {favorites.cities.length === 0 ? (
                <p className="text-gray-600">No favorite cities added.</p>
              ) : (
                <ul className="space-y-2">
                  {favorites.cities.map((cityId) => (
                    <li key={cityId}>
                      <Link href={`/city/${cityId}`} onClick={toggleFavorites} className="text-blue-800 hover:underline">
                        City ID: {cityId}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div>
              <h3 className="text-xl text-black mb-2">Favorite Cryptos</h3>
              {favorites.cryptos.length === 0 ? (
                <p className="text-gray-600">No favorite cryptocurrencies added.</p>
              ) : (
                <ul className="space-y-2">
                  {favorites.cryptos.map((cryptoId) => (
                    <li key={cryptoId}>
                      <Link href={`/crypto/${cryptoId}`} onClick={toggleFavorites} className="text-blue-800 hover:underline">
                        Crypto ID: {cryptoId}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
