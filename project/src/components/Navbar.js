// components/Navbar.js
const Navbar = () => {
    return (
      <nav className="bg-gray-900 text-white p-4">
        <div className="container mx-auto flex justify-between">
          <h1 className="text-xl">CryptoWeather Nexus</h1>
          {/* <ul className="flex space-x-4">
            <li><a href="/" className="text-white">Home</a></li>
            <li><a href="/city" className="text-white">City</a></li>
            <li><a href="/crypto" className="text-white">Crypto</a></li>
          </ul> */}
        </div>
      </nav>
    );
  };
  
  export default Navbar;
  
//   import React from 'react';
// import { Link } from 'react-router-dom';
// import { Cloud, CreditCard, Home } from 'lucide-react';

// const Navbar = () => {
//   return (
//     <nav className="bg-gray-800 border-b border-gray-700">
//       <div className="container mx-auto px-4">
//         <div className="flex items-center justify-between h-16">
//           <Link to="/" className="flex items-center space-x-2">
//             <div className="flex items-center">
//               <Cloud className="h-8 w-8 text-blue-400" />
//               <CreditCard className="h-8 w-8 text-yellow-400 -ml-4" />
//             </div>
//             <span className="text-xl font-bold">CryptoWeather Nexus</span>
//           </Link>
          
//           <div className="flex space-x-4">
//             <Link
//               to="/"
//               className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center"
//             >
//               <Home className="h-4 w-4 mr-1" />
//               Dashboard
//             </Link>
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;