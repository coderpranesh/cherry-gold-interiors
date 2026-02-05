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

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 w-full z-50 bg-[#f8f8ed] shadow-sm border-b border-gray-200"
    >
      <div className="max-w-7xl mx-auto px-6 py-2 flex justify-between items-center">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group" onClick={handleLinkClick}>
          <img
            src={lo}
            alt="Logo"
            className="w-16 h-16 object-contain transition-transform duration-300 group-hover:scale-110"
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
          className="md:hidden"
        >
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t py-4 px-4 space-y-3">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={handleLinkClick}
              className="block text-gray-700 hover:text-[#FFD700]"
            >
              {item.label}
            </Link>
          ))}

          {!isAuthenticated ? (
            <>
              <Link to="/login" onClick={handleLinkClick}>Login</Link>
              <Link to="/register" onClick={handleLinkClick}>Sign Up</Link>
            </>
          ) : (
            <button onClick={handleLogout} className="text-red-600">
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
