
 import Link from 'next/link';

  const Navbar = () => {
    return (
      <nav className="bg-gray-800 border-b rounded-xl border-gray-700">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex items-center">

              </div>
              <span className="text-xl font-bold text-white">
                CryptoWeather Nexus
              </span>
            </Link>
  
            <div className="flex space-x-4">
              {/* <ul className="flex space-x-4">
//             <li><a href="/" className="text-white">Home</a></li>
//             <li><a href="/city" className="text-white">City</a></li>
//             <li><a href="/crypto" className="text-white">Crypto</a></li>
//           </ul> */}
            </div>
          </div>
        </div>
      </nav>
    );
  };
  
  export default Navbar;
  