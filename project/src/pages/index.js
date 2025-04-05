// pages/index.js
import React from 'react';
import Navbar from '../components/Navbar';
import Home from '../components/Home'; // Import the Home component

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <Navbar />
        
      <Home/>
    </div>
  );
};

export default Dashboard;
