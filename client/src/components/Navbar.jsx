import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { UserCircle, Menu, X, Wallet, TrendingUp, Home, Info, Briefcase, Mail } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: "/", label: "Home", icon: Home },
    { path: "/about", label: "About", icon: Info },
    { path: "/service", label: "Services", icon: Briefcase },
    { path: "/contact", label: "Contact", icon: Mail },
  ];

  return (
    <nav className="fixed w-full top-0 z-50">
      {/* Glassmorphism Background */}
      <div className="glass-card border-b border-white/20 backdrop-blur-xl">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center space-x-3 group"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
                <div className="relative bg-gradient-to-br from-primary-500 to-accent-600 p-2.5 rounded-xl shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                  <Wallet className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-display font-bold gradient-text-ocean">
                  Money Mentor
                </span>
                <span className="text-xs text-slate-500 font-medium -mt-1">
                  Smart Finance Management
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`
                      flex items-center space-x-2 px-4 py-2.5 rounded-xl font-medium
                      transition-all duration-300 transform hover:scale-105
                      ${active
                        ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/30'
                        : 'text-slate-700 hover:bg-white/60 hover:shadow-md'
                      }
                    `}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}

              {isAuthenticated ? (
                <Link
                  to="/profile"
                  className="flex items-center justify-center p-2.5 rounded-xl bg-gradient-to-r from-accent-500 to-accent-600 text-white shadow-lg shadow-accent-500/30 hover:shadow-xl hover:scale-105 transition-all duration-300 ml-2"
                >
                  <UserCircle className="h-5 w-5" />
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="btn-primary ml-2 flex items-center space-x-2"
                >
                  <TrendingUp className="h-4 w-4" />
                  <span>Get Started</span>
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2.5 rounded-xl hover:bg-white/60 transition-all duration-300 hover:shadow-md"
            >
              {isOpen ? (
                <X className="h-6 w-6 text-slate-700" />
              ) : (
                <Menu className="h-6 w-6 text-slate-700" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {isOpen && (
            <div className="md:hidden pb-6 fade-in-up">
              <div className="flex flex-col space-y-2">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const active = isActive(link.path);
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setIsOpen(false)}
                      className={`
                        flex items-center space-x-3 px-4 py-3 rounded-xl font-medium
                        transition-all duration-300
                        ${active
                          ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg'
                          : 'text-slate-700 hover:bg-white/60'
                        }
                      `}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{link.label}</span>
                    </Link>
                  );
                })}

                {isAuthenticated ? (
                  <Link
                    to="/profile"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center space-x-3 px-4 py-3 rounded-xl font-medium bg-gradient-to-r from-accent-500 to-accent-600 text-white shadow-lg"
                  >
                    <UserCircle className="h-5 w-5" />
                    <span>Profile</span>
                  </Link>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="btn-primary flex items-center justify-center space-x-2"
                  >
                    <TrendingUp className="h-5 w-5" />
                    <span>Get Started</span>
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;