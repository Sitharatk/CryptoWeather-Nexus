import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { updateCryptoPrice } from '../redux/slices/cryptoSlice.js';
import { updateWeatherAlert } from '../redux/slices/weatherSlice.js';

const WebSocketManager = () => {
  const dispatch = useDispatch();
  const activeNotificationsRef = useRef(0);

  useEffect(() => {
    let ws;
    let reconnectAttempts = 0;
    const maxNotifications = 3;
    const maxReconnectAttempts = 5;
    const reconnectDelay = 5000;

    // Function to show toast only if under the limit
    const showLimitedToast = (message, options = {}) => {
      if (activeNotificationsRef.current < maxNotifications) {
        activeNotificationsRef.current += 1;
        return toast(message, {
          ...options,
          onClose: () => {
            activeNotificationsRef.current -= 1;
            if (options.onClose) options.onClose();
          }
        });
      }
      return null;
    };
    
    const connectWebSocket = () => {
      ws = new WebSocket('wss://ws.coincap.io/prices?assets=bitcoin,ethereum,dogecoin');
      
      ws.onopen = () => {
        console.log('WebSocket connected');
        reconnectAttempts = 0;
      };
      
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          Object.entries(data).forEach(([crypto, price]) => {
            dispatch(updateCryptoPrice({ id: crypto, price }));
            
            const priceChange = Math.abs(parseFloat(price));
            if (priceChange > 5) {
              showLimitedToast(`${crypto.toUpperCase()} price changed by ${priceChange.toFixed(2)}%!`);
            }
          });
        } catch (error) {
          console.error('Error processing WebSocket message:', error);
        }
      };
      
      ws.onclose = () => {
        console.log('WebSocket disconnected');
        if (reconnectAttempts < maxReconnectAttempts) {
          setTimeout(() => {
            reconnectAttempts++;
            connectWebSocket();
          }, reconnectDelay);
        }
      };
      
      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    };
    
    connectWebSocket();
    
    const weatherAlertInterval = setInterval(() => {
      const cities = [
        { name: 'New York', id: '5128581' },
        { name: 'London', id: '2643743' },
        { name: 'Tokyo', id: '1850147' }
      ];
      const alerts = [
        { type: 'Heavy Rain'},
        { type: 'Strong Winds'},
        { type: 'Heat Wave'},
        { type: 'Storm Warning' }
      ];
      
      const randomCity = cities[Math.floor(Math.random() * cities.length)];
      const randomAlert = alerts[Math.floor(Math.random() * alerts.length)];
      
      const alert = {
        city: randomCity.name,
        cityId: randomCity.id,
        type: randomAlert.type,
        icon: randomAlert.icon,
        timestamp: new Date().toISOString(),
      };
      
      dispatch(updateWeatherAlert(alert));
      showLimitedToast(` Weather Alert: ${randomAlert.type} in ${randomCity.name}`, {
        duration: 5000,
      });
    }, 300000);
    
    return () => {
      if (ws) {
        ws.close();
      }
      clearInterval(weatherAlertInterval);
    };
  }, [dispatch]);
  
  return null;
};

export default WebSocketManager;