import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/getATSScore", label: "Find Your ATS Score" },
    { path: "/compareJobs", label: "Match Your Job" },
    { path: "/findAJob", label: "Find a Job" },
    { path: "/skillUp", label: "Skill Up" },
    { path: "/aboutUs", label: "About Us" },
    { path: "/contactUs", label: "Contact Us" },
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-gray-200/50 shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Logo */}
                 <Link
  to="/"
  className="flex items-center group transition-transform duration-300 hover:scale-105 -ml-10">
  <img
    src="src/assets/SkillMatchr_logo.png"
    alt="SkillMatchr Logo"
    className="w-60 h-60 object-contain drop-shadow-md px-2
               transition-transform duration-300
               group-hover:-translate-y-0.5"
  />
</Link>



          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                  isActive(link.path)
                    ? "text-primary-600 bg-primary-50"
                    : "text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                }`}
              >
                {link.label}
                {isActive(link.path) && (
                  <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary-600 rounded-full"></span>
                )}
              </Link>
            ))}
          </div>

          {/* Right side buttons */}
          <div className="flex items-center space-x-3">
            <Link
              to="/login"
              className="hidden sm:block px-4 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-all duration-300 hover:text-primary-600"
            >
              Log in
            </Link>

            <Link
              to="/register"
              className="hidden sm:block btn-primary text-sm"
            >
              Get started
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              type="button"
              className="lg:hidden inline-flex items-center justify-center p-2 rounded-lg text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200"
              aria-label="Toggle menu"
            >
              <svg
                className={`w-6 h-6 transition-transform duration-300 ${
                  isMobileMenuOpen ? "rotate-90" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-2 pt-2 pb-4 space-y-1 border-t border-gray-200 mt-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-4 py-3 text-base font-medium rounded-lg transition-all duration-200 ${
                  isActive(link.path)
                    ? "text-primary-600 bg-primary-50"
                    : "text-gray-700 hover:bg-gray-50 hover:text-primary-600"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 space-y-2 border-t border-gray-200">
              <Link
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-4 py-2 text-center text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-all duration-200"
              >
                Log in
              </Link>
              <Link
                to="/register"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-4 py-2 text-center text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-all duration-200"
              >
                Get started
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
