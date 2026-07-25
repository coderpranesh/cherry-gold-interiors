import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, LogOut } from 'lucide-react';
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
  const navigate = useNavigate();
  const navRef = useRef(null);

  // 🔐 Auth check
  const isAuthenticated = !!localStorage.getItem('access_token');

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

  // 🚪 Logout
  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    handleLinkClick();
    navigate('/login');
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

  // Close dropdown on Escape
  useEffect(() => {
    const keyHandler = (e) => {
      if (e.key === 'Escape') setActiveDropdown(null);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  }, []);

  // Close the mobile menu & any open dropdown whenever the route changes
  // (e.g. browser back/forward, or a navigate() call fired elsewhere)
  useEffect(() => {
    setIsMenuOpen(false);
    setActiveDropdown(null);
  }, [location.pathname, location.search]);

  return (
    <nav
      ref={navRef}
      className="sticky top-0 z-50 bg-[#f8f8ed] shadow-sm border-b border-gray-200"
    >
      <div className="max-w-7xl mx-auto px-6 py-2 flex justify-between items-center">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group" onClick={handleLinkClick}>
          <img
            src={lo}
            alt="Logo"
            className="w-12 h-12 md:w-16 md:h-16 object-contain transition-transform duration-300 group-hover:scale-110"
          />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-6">
          {navItems.map((item, index) => (
            <div key={item.path} className="relative">
              {item.dropdown ? (
                <>
                  <button
                    onClick={(e) => toggleDropdown(index, e)}
                    aria-expanded={activeDropdown === index}
                    className={`flex items-center gap-1 px-3 py-2 text-lg font-serif rounded-lg ${
                      isActive(item.path) || activeDropdown === index
                        ? 'text-[#FFD700] border-b-2 border-[#FFD700]'
                        : 'text-[#3A2C0D] hover:text-[#FFD700]'
                    }`}
                  >
                    {item.label}
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${
                        activeDropdown === index ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {activeDropdown === index && (
                    <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-xl border py-2">
                      {item.dropdown.map((d) => (
                        <Link
                          key={d.path}
                          to={d.path}
                          onClick={handleLinkClick}
                          className={`block px-4 py-2 text-sm ${
                            d.highlight
                              ? 'text-[#FFD700] font-semibold'
                              : 'text-gray-700 hover:text-[#FFD700]'
                          }`}
                        >
                          {d.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  to={item.path}
                  onClick={handleLinkClick}
                  className={`px-3 py-2 text-lg font-serif rounded-lg ${
                    isActive(item.path)
                      ? 'text-[#FFD700]'
                      : 'text-gray-700 hover:text-[#FFD700]'
                  }`}
                >
                  {item.label}
                </Link>
              )}
            </div>
          ))}
        </div>

        {/* Desktop Auth */}
        <div className="hidden md:flex items-center gap-4">
          {!isAuthenticated ? (
            <>
              <Link to="/login" className="text-gray-700 hover:text-red-600">
                Login
              </Link>
              <Link to="/register" className="bg-red-500 text-white px-4 py-2 rounded-lg">
                Sign Up
              </Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-red-600 hover:text-red-700"
            >
              <LogOut size={18} />
              Logout
            </button>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMenuOpen}
          className="md:hidden p-2 -mr-2 text-[#3A2C0D]"
        >
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t py-2 px-4 space-y-1 max-h-[calc(100vh-4rem)] overflow-y-auto">
          {navItems.map((item, index) =>
            item.dropdown ? (
              <div key={item.path} className="border-b border-gray-100 last:border-b-0">
                <button
                  onClick={(e) => toggleDropdown(index, e)}
                  aria-expanded={activeDropdown === index}
                  className={`w-full flex items-center justify-between py-3 text-left text-base font-serif ${
                    isActive(item.path) || activeDropdown === index
                      ? 'text-[#FFD700]'
                      : 'text-gray-700'
                  }`}
                >
                  {item.label}
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      activeDropdown === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {activeDropdown === index && (
                  <div className="pb-2 pl-3 space-y-1">
                    {item.dropdown.map((d) => (
                      <Link
                        key={d.path}
                        to={d.path}
                        onClick={handleLinkClick}
                        className={`block py-2.5 text-sm ${
                          d.highlight
                            ? 'text-[#FFD700] font-semibold'
                            : 'text-gray-600 hover:text-[#FFD700]'
                        }`}
                      >
                        {d.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={item.path}
                to={item.path}
                onClick={handleLinkClick}
                className={`block py-3 text-base font-serif border-b border-gray-100 last:border-b-0 ${
                  isActive(item.path) ? 'text-[#FFD700]' : 'text-gray-700'
                }`}
              >
                {item.label}
              </Link>
            )
          )}

          <div className="pt-3 mt-1 space-y-1">
            {!isAuthenticated ? (
              <>
                <Link to="/login" 
                onClick={handleLinkClick} 
                className="block text-center bg-green-500 text-white py-3 rounded-lg font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={handleLinkClick}
                  className="block text-center bg-red-500 text-white py-3 rounded-lg font-medium"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <button onClick={handleLogout} className="flex items-center gap-2 py-3 text-red-600">
                <LogOut size={18} />
                Logout
              </button>
            )}
          </div>
        </div>
        
      )}
    </nav>
  );
};

export default Navbar;