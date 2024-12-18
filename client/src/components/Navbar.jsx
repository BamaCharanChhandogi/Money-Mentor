import { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { UserCircle, Menu, X } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <nav className="fixed w-full top-0 z-50">
      {/* Background gradient wrapper */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-500 via-blue-400 to-green-500 opacity-90"></div>
      
      {/* Optional animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-teal-500/20 to-blue-600/20 animate-gradient-x"></div>

      <div className="relative container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-2"
          >
            <span className="text-white text-2xl font-bold drop-shadow-md">
              MoneyMentor
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-white hover:text-yellow-300 font-medium transition-colors duration-200 hover:drop-shadow-lg"
            >
              Home
            </Link>
            <Link
              to="/about"
              className="text-white hover:text-yellow-300 font-medium transition-colors duration-200 hover:drop-shadow-lg"
            >
              About
            </Link>
            <Link
              to="/service"
              className="text-white hover:text-yellow-300 font-medium transition-colors duration-200 hover:drop-shadow-lg"
            >
              Services
            </Link>
            <Link
              to="/contact"
              className="text-white hover:text-yellow-300 font-medium transition-colors duration-200 hover:drop-shadow-lg"
            >
              Contact
            </Link>
            {isAuthenticated ? (
              <Link
                to="/profile"
                className="flex items-center justify-center p-2 rounded-full hover:bg-white/20 transition-colors duration-200"
              >
                <UserCircle className="h-6 w-6 text-white" />
              </Link>
            ) : (
              <Link
                to="/login"
                className="bg-white/20 hover:bg-white/30 text-white px-6 py-2 rounded-full font-medium transition-all duration-200 hover:shadow-lg backdrop-blur-sm"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-white/20 transition-colors duration-200"
          >
            {isOpen ? (
              <X className="h-6 w-6 text-white" />
            ) : (
              <Menu className="h-6 w-6 text-white" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-gradient-to-b from-green-500 to-blue-400 shadow-lg border-t border-white/20">
            <div className="flex flex-col space-y-4 px-4 py-6">
              <Link
                to="/"
                className="text-white hover:text-yellow-300 font-medium transition-colors duration-200"
              >
                Home
              </Link>
              <Link
                to="/about"
                className="text-white hover:text-yellow-300 font-medium transition-colors duration-200"
              >
                About
              </Link>
              <Link
                to="/service"
                className="text-white hover:text-yellow-300 font-medium transition-colors duration-200"
              >
                Services
              </Link>
              <Link
                to="/contact"
                className="text-white hover:text-yellow-300 font-medium transition-colors duration-200"
              >
                Contact
              </Link>
              {isAuthenticated ? (
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 text-white hover:text-yellow-300 font-medium transition-colors duration-200"
                >
                  <UserCircle className="h-5 w-5" />
                  <span>Profile</span>
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="bg-white/20 hover:bg-white/30 text-white px-6 py-2 rounded-full font-medium transition-all duration-200 text-center backdrop-blur-sm"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;