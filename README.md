# CryptoWeather Nexus

## Description
A modern dashboard combining live crypto prices, weather data, and crypto news with WebSocket notifications.

## Tech Stack
- Next.js 13+
- Redux Toolkit
- React
- Tailwind CSS
- WebSocket

## Features
- **Real-time Weather:** Live weather data for 3 cities (e.g., New York, London, Tokyo).
- **Live Cryptocurrency Tracking:** Display live prices, market changes, and details for at least 3 cryptocurrencies (e.g., Bitcoin, Ethereum, and one more).
- **Crypto News:** Real-time news headlines related to cryptocurrency.
- **Real-Time Notifications:** WebSocket notifications for significant price shifts and simulated weather alerts.
- **Detail Pages:** In-depth pages for each city and cryptocurrency.
- **Responsive Design:** Fully responsive, adapting to mobile, tablet, and desktop devices.
-  **User Features:**  avorite cities and cryptocurrencies, Real-time notifications for significant changes

## APIs Used

- **Weather Data**: OpenWeather API
- **Cryptocurrency Data**: CoinCap API
- **News Data**: CryptoCompare News API


## Design Decisions

1. **Real-time Updates**
   - Used WebSocket for live cryptocurrency price updates
   - Implemented simulated weather alerts for demonstration

2. **State Management**
   - Redux Toolkit for predictable state updates
   - Separate slices for weather, crypto, and news

3. **Error Handling**
   - Comprehensive error states
   - Fallback UI components
   - Retry logic for API calls


## Setup
```bash
   git clone https://github.com/Sitharak/CryptoWeather-Nexus.git
    
    npm install
    npm run dev
```


## Deployment
- Deployed on Vercel
