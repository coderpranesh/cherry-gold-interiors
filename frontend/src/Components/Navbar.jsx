import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import lo from '../assets/logo.svg';

const navItems = [
  { path: '/about', label: 'About' },
  { path: '/offers', label: 'Offers' },
  {
    path: '/portfolio',
    label: 'Portfolio',
    dropdown: [
      { path: '/portfolio?filter=kitchen', label: 'Portfolio' },
      { path: '/catalogue', label: 'Catalogue', highlight: true },
    ]
  },
  {
    path: '/services',
    label: 'Services',
    dropdown: [
      { path: '/services?tab=repair', label: 'Repair Request' },
      { path: '/services?tab=video', label: 'Video Consultancy' },
      { path: '/services?tab=onsite', label: 'On-site Free Consultation' }
    ]
  },
  { path: '/refer-earn', label: 'Refer&Earn' },
  { 
    path: '/tools', 
    label: 'Tools',
    dropdown: [
      { path: '/track-project', label: 'Track Project Status' },
      { path: '/cost-estimator', label: 'Cost Estimator' },
      { path: '/kitchen-designer', label: 'Interactive Kitchen Designer' }
    ]
  },
];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const location = useLocation();
  const navRef = useRef(null);

  const isActive = useCallback(
    (path) => location.pathname === path,
    [location.pathname]
  );

  const toggleDropdown = (index, e) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  const handleLinkClick = () => {
    setIsMenuOpen(false);
    setActiveDropdown(null);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('click', handleClickOutside);

    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Close dropdown on Escape key
  useEffect(() => {
    const keyHandler = (e) => {
      if (e.key === 'Escape') setActiveDropdown(null);
    };
    document.addEventListener('keydown', keyHandler);

    return () => document.removeEventListener('keydown', keyHandler);
  }, []);

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 w-full z-50 bg-[#f8f8ed] shadow-sm border-b border-gray-200"
    >
      <div className="max-w-7xl mx-auto px-6 py-2 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group" onClick={handleLinkClick}>
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ backgroundColor: '#f8f8ed' }}
          >
            <img
              src={lo}
              alt="Cherry Gold Interiors Logo"
              className="w-16 h-16 object-contain transition-transform duration-300 group-hover:scale-110"
              loading="lazy"
            />
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {navItems.map((item, index) => (
            <div key={item.path} className="relative">
              {item.dropdown ? (
                <>
                  <button
                    onClick={(e) => toggleDropdown(index, e)}
                    aria-haspopup="true"
                    aria-expanded={activeDropdown === index}
                    className={`flex items-center space-x-1 px-3 py-2 text-lg font-serif transition-colors duration-200 rounded-lg ${
                      isActive(item.path) || activeDropdown === index
                        ? 'text-[#FFD700] font-semibold border-b-2 border-[#FFD700]'
                        : 'text-[#3A2C0D] hover:text-[#FFD700] hover:border-b-2 hover:border-[#FFD700]'
                    }`}
                  >
                    <span>{item.label}</span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        activeDropdown === index ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {activeDropdown === index && (
                    <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50 max-h-96 overflow-y-auto">
                      {item.dropdown.map((dropdownItem, dropIndex) =>
                        dropdownItem.type === 'divider' ? (
                          <div
                            key={dropIndex}
                            className="border-t border-gray-200 my-2"
                          ></div>
                        ) : (
                          <Link
                            key={dropdownItem.path}
                            to={dropdownItem.path}
                            className={`block px-4 py-2 text-sm transition-colors duration-200 ${
                              dropdownItem.highlight
                                ? 'text-[#FFD700] font-semibold hover:bg-orange-50'
                                : dropdownItem.label.startsWith('→')
                                ? 'text-gray-600 hover:bg-gray-50 pl-6'
                                : 'text-gray-700 hover:bg-orange-50 hover:text-[#FFD700]'
                            }`}
                            onClick={handleLinkClick}
                          >
                            {dropdownItem.label}
                          </Link>
                        )
                      )}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  to={item.path}
                  onClick={handleLinkClick}
                  className={`px-3 py-2 text-lg font-serif transition-colors duration-200 rounded-lg ${
                    isActive(item.path)
                      ? 'text-[#FFD700] bg-orange-50'
                      : 'text-gray-700 hover:text-[#FFD700] hover:bg-orange-50'
                  }`}
                >
                  {item.label}
                </Link>
              )}
            </div>
          ))}
        </div>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center space-x-3">
          <Link
            to="/login"
            className="text-gray-700 hover:text-red-600 font-medium transition-colors"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600 transition-colors"
          >
            Sign Up
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 rounded-md text-gray-700 hover:text-[#FFD700]"
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-200 py-4">
          <div className="flex flex-col space-y-2">
            {navItems.map((item, index) => (
              <div key={item.path}>
                {item.dropdown ? (
                  <>
                    <button
                      onClick={(e) => toggleDropdown(index, e)}
                      className={`flex items-center justify-between w-full text-left px-3 py-2 text-base font-medium transition-colors duration-200 rounded-lg ${
                        isActive(item.path) || activeDropdown === index
                          ? 'text-[#FFD700] bg-orange-50'
                          : 'text-gray-700 hover:text-[#FFD700] hover:bg-orange-50'
                      }`}
                    >
                      <span>{item.label}</span>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${
                          activeDropdown === index ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {activeDropdown === index && (
                      <div className="ml-4 mt-2 space-y-1">
                        {item.dropdown.map((dropdownItem, dropIndex) =>
                          dropdownItem.type === 'divider' ? (
                            <div
                              key={dropIndex}
                              className="border-t border-gray-200 my-2"
                            ></div>
                          ) : (
                            <Link
                              key={dropdownItem.path}
                              to={dropdownItem.path}
                              onClick={handleLinkClick}
                              className={`block px-3 py-2 text-sm transition-colors duration-200 rounded-lg ${
                                dropdownItem.highlight
                                  ? 'text-[#FFD700] font-semibold hover:bg-orange-50'
                                  : dropdownItem.label.startsWith('→')
                                  ? 'text-gray-600 hover:bg-gray-50 pl-6'
                                  : 'text-gray-600 hover:text-[#FFD700] hover:bg-orange-50'
                              }`}
                            >
                              {dropdownItem.label}
                            </Link>
                          )
                        )}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    to={item.path}
                    onClick={handleLinkClick}
                    className={`block px-3 py-2 text-base font-medium transition-colors duration-200 rounded-lg ${
                      isActive(item.path)
                        ? 'text-[#FFD700] bg-orange-50'
                        : 'text-gray-700 hover:text-[#FFD700] hover:bg-orange-50'
                    }`}
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}

            {/* Mobile Auth Buttons */}
            <div className="flex items-center space-x-3 mt-4 px-3">
              <Link
                to="/login"
                className="text-gray-700 hover:text-red-600 font-medium transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600 transition-colors"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;