import { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaUser } from "react-icons/fa";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <nav className="bg-gradient-to-r from-green-500 via-blue-400 to-green-500 p-4 fixed w-full top-0 shadow-2xl z-50">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo with Icon */}
        <Link
          to="/"
          className="text-white text-2xl font-extrabold tracking-widest flex items-center"
        >
          𝕄𝕠𝕟𝕖𝕪 𝕄𝕖𝕟𝕥𝕠𝕣
        </Link>

        {/* Nav Links */}
        <div className="hidden md:flex space-x-8">
          <Link
            to="/"
            className="text-white hover:text-yellow-400 transition duration-300 ease-in-out"
          >
            Home
          </Link>
          <Link
            to="/about"
            className="text-white hover:text-yellow-400 transition duration-300 ease-in-out"
          >
            About
          </Link>
          <Link
            to="/service"
            className="text-white hover:text-yellow-400 transition duration-300 ease-in-out"
          >
            Service
          </Link>
          <Link
            to="/contact"
            className="text-white hover:text-yellow-400 transition duration-300 ease-in-out"
          >
            Contact
          </Link>
          {/* Removed the right corner FaUser icon */}
          {isAuthenticated ? (
            <>
            <Link to="/profile" className="flex items-center justify-center">
            <FaUser className="text-2xl" />
            </Link></>
          ) : (
            <Link
              to="/login"
              className="text-white hover:text-yellow-400 transition duration-300 ease-in-out"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-white focus:outline-none"
          >
            {/* Icon for mobile menu */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="flex flex-col space-y-2 mt-4">
            <Link
              to="/"
              className="text-white hover:text-yellow-400 transition duration-300 ease-in-out"
            >
              Home
            </Link>
            <Link
              to="/about"
              className="text-white hover:text-yellow-400 transition duration-300 ease-in-out"
            >
              About
            </Link>
            <Link
              to="/service"
              className="text-white hover:text-yellow-400 transition duration-300 ease-in-out"
            >
              Service
            </Link>
            <Link
              to="/contact"
              className="text-white hover:text-yellow-400 transition duration-300 ease-in-out"
            >
              Contact
            </Link>
            {/* Removed the FaUser icon for the mobile menu */}
            {isAuthenticated ? null : (
              <Link
                to="/login"
                className="text-white hover:text-yellow-400 transition duration-300 ease-in-out"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;