// pages/_app.js
import { Provider } from 'react-redux';
import { store } from '../redux/store.js';  // Updated import path
import { Toaster } from 'react-hot-toast';
import '../styles/globals.css'; // Ensure you have a global CSS file for Tailwind CSS

 // Updated import path

function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        
        <main className="container mx-auto px-4 py-8">
          <Component {...pageProps} />
        </main>
        <Toaster position="top-right" />
      </div>
    </Provider>
  );
}

export default MyApp;
