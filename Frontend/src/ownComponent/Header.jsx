import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi"; // Icons for mobile menu
import { Link } from "react-router-dom";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-[#0F1117] px-6 py-4 flex justify-between items-center border-b border-gray-700">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-purple-500 rounded-full"></div>
        <h1 className="text-white font-bold text-2xl">Shreedeep Hostel</h1>
      </div>

      {/* Navigation Links */}
      <ul className="hidden md:flex gap-8 text-lg">
        <li className="text-white hover:text-gray-400 cursor-pointer">Home</li>
        <li className="text-white hover:text-gray-400 cursor-pointer">About Us</li>
        <li className="text-white hover:text-gray-400 cursor-pointer">Contact Us</li>
      </ul>

      {/* Login & Register Buttons */}
      <div className="hidden md:flex gap-4">
        <Link to='/Login' >
          <button className="text-white px-5 py-2 rounded-lg hover:text-gray-400 bg-[#1B1D23]">
            Login
          </button>
        </Link>

        <Link to='/AdminRegestration' >
        <button className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold">
          Register as Admin
        </button>
        </Link>
        
      </div>

      {/* Mobile Menu Icon */}
      <div className="md:hidden flex items-center">
        <button onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FiX size={30} className="text-white" /> : <FiMenu size={30} className="text-white" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <ul className="absolute top-16 left-0 w-full bg-[#0F1117] flex flex-col items-center gap-4 py-4 border-b border-gray-700">
          <li className="text-white hover:text-gray-400 cursor-pointer">Home</li>
          <li className="text-white hover:text-gray-400 cursor-pointer">About Us</li>
          <li className="text-white hover:text-gray-400 cursor-pointer">Contact Us</li>
          <button className="text-white px-5 py-2 rounded-lg hover:text-gray-400 bg-[#1B1D23]">
            Login
          </button>
          <button className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold">
            Register as Admin
          </button>
        </ul>
      )}
    </nav>
  );
}

export default Header;
