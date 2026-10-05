import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ChevronDown, LogOut, Sparkles } from 'lucide-react';
import brandLogo from '../assets/cherry-gold-full-logo.png';

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
  { path: '/refer-earn', label: 'Refer & Earn' },
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
  useEffect(() => {
    setIsMenuOpen(false);
    setActiveDropdown(null);
  }, [location.pathname, location.search]);

  return (
    <header
      ref={navRef}
      className="sticky top-0 z-50 w-full transition-all duration-300"
      style={{
        background: 'linear-gradient(110deg, #fdfbf7 0%, #faf6ee 45%, #f6efe0 100%)',
        boxShadow: '0 4px 20px -3px rgba(184, 134, 11, 0.14), 0 1px 3px rgba(0, 0, 0, 0.04)',
        borderBottom: '1px solid rgba(212, 175, 55, 0.35)',
      }}
    >
      {/* Decorative Golden Ribbon Waves (Vector curves matching brand identity) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        {/* Top-Right Flowing Gold Ribbons */}
        <svg
          className="absolute -top-1 right-0 w-64 sm:w-96 md:w-[480px] lg:w-[620px] h-full opacity-65"
          viewBox="0 0 620 90"
          fill="none"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="headerGoldWave1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#d4af37" stopOpacity="0.15" />
              <stop offset="50%" stopColor="#f5e6b3" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#aa7c11" stopOpacity="0.95" />
            </linearGradient>
            <linearGradient id="headerGoldWave2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#b8860b" stopOpacity="0.1" />
              <stop offset="40%" stopColor="#dfb746" stopOpacity="0.65" />
              <stop offset="100%" stopColor="#fbe9b6" stopOpacity="0.9" />
            </linearGradient>
          </defs>
          <path
            d="M80 0 C 260 30, 420 8, 620 75"
            stroke="url(#headerGoldWave1)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M160 0 C 330 45, 460 22, 620 88"
            stroke="url(#headerGoldWave2)"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>

        {/* Bottom-Left Flowing Gold Ribbons */}
        <svg
          className="absolute bottom-0 left-0 w-44 sm:w-72 md:w-96 h-16 md:h-20 opacity-55"
          viewBox="0 0 380 80"
          fill="none"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="headerGoldWaveBottom" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#aa7c11" stopOpacity="0.85" />
              <stop offset="50%" stopColor="#f5e6b3" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#d4af37" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          <path
            d="M0 65 C 120 58, 240 38, 380 0"
            stroke="url(#headerGoldWaveBottom)"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <path
            d="M0 76 C 110 70, 210 52, 320 12"
            stroke="url(#headerGoldWaveBottom)"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Main Header Bar */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 md:py-2.5 flex justify-between items-center">
        
        {/* Brand Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 group transition-transform duration-300 focus:outline-none"
          onClick={handleLinkClick}
        >
          <img
            src={brandLogo}
            alt="Cherry Gold Interiors"
            className="h-10 sm:h-12 md:h-14 lg:h-16 w-auto object-contain transition-transform duration-300 group-hover:scale-[1.03] filter drop-shadow-[0_2px_4px_rgba(184,134,11,0.18)]"
          />
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
          {navItems.map((item, index) => (
            <div key={item.path} className="relative">
              {item.dropdown ? (
                <>
                  <button
                    onClick={(e) => toggleDropdown(index, e)}
                    aria-expanded={activeDropdown === index}
                    className={`flex items-center gap-1.5 px-3.5 py-2 font-serif text-[15px] xl:text-[16px] rounded-lg transition-all duration-200 tracking-wide ${
                      isActive(item.path) || activeDropdown === index
                        ? 'text-[#8b1828] font-semibold bg-[#d4af37]/15 shadow-sm'
                        : 'text-[#3a2c0d] font-medium hover:text-[#8b1828] hover:bg-[#d4af37]/10'
                    }`}
                  >
                    <span>{item.label}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#b8860b] transition-transform duration-200 ${
                        activeDropdown === index ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {/* Dropdown Menu */}
                  {activeDropdown === index && (
                    <div
                      className="absolute top-full left-0 mt-2.5 w-64 rounded-xl shadow-[0_12px_36px_rgba(58,44,13,0.18)] py-2 border border-[#d4af37]/40 z-50 backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-150"
                      style={{
                        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98), rgba(251, 246, 236, 0.98))',
                      }}
                    >
                      {item.dropdown.map((d) => (
                        <Link
                          key={d.path}
                          to={d.path}
                          onClick={handleLinkClick}
                          className={`flex items-center justify-between px-4 py-2.5 text-sm font-serif transition-colors duration-150 ${
                            d.highlight
                              ? 'text-[#8b1828] font-semibold bg-amber-50/60 hover:bg-amber-100/60'
                              : 'text-[#3a2c0d] hover:text-[#8b1828] hover:bg-[#d4af37]/10'
                          }`}
                        >
                          <span>{d.label}</span>
                          {d.highlight && (
                            <Sparkles className="w-3.5 h-3.5 text-[#b8860b]" />
                          )}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  to={item.path}
                  onClick={handleLinkClick}
                  className={`relative px-3.5 py-2 font-serif text-[15px] xl:text-[16px] rounded-lg transition-all duration-200 tracking-wide ${
                    isActive(item.path)
                      ? 'text-[#8b1828] font-semibold bg-[#d4af37]/15 shadow-sm'
                      : 'text-[#3a2c0d] font-medium hover:text-[#8b1828] hover:bg-[#d4af37]/10'
                  }`}
                >
                  {item.label}
                  {isActive(item.path) && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-6 h-[2px] bg-gradient-to-r from-[#b8860b] via-[#e5b84c] to-[#b8860b] rounded-full" />
                  )}
                </Link>
              )}
            </div>
          ))}
        </nav>

        {/* Desktop Auth / CTA */}
        <div className="hidden lg:flex items-center gap-3">
          {!isAuthenticated ? (
            <>
              <Link
                to="/login"
                className="px-4 py-2 text-[#3a2c0d] font-serif text-[15px] font-medium hover:text-[#8b1828] hover:bg-[#d4af37]/10 rounded-lg transition-all duration-200"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="relative group overflow-hidden px-5 py-2 rounded-lg font-serif font-medium text-white shadow-md bg-gradient-to-r from-[#7a0a18] via-[#9e1224] to-[#700713] border border-[#e5b84c]/70 hover:shadow-[0_4px_16px_rgba(158,18,36,0.35)] hover:scale-[1.02] transition-all duration-200"
              >
                <span className="relative z-10 flex items-center gap-1.5 text-sm tracking-wide text-amber-50">
                  Sign Up
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 font-serif text-[15px] text-[#8b1828] hover:bg-[#8b1828]/10 rounded-lg transition-colors"
            >
              <LogOut size={17} />
              Logout
            </button>
          )}
        </div>

        {/* Mobile Golden Hamburger Toggle Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMenuOpen}
          className="lg:hidden p-2 rounded-lg focus:outline-none transition-all duration-300 hover:bg-[#d4af37]/10"
        >
          {/* Custom Luxury Golden 3-Bar Hamburger */}
          <div className="w-7 h-5 flex flex-col justify-between items-center relative">
            <span
              className={`w-7 h-[3px] rounded-full transition-all duration-300 shadow-sm ${
                isMenuOpen
                  ? 'rotate-45 translate-y-2 bg-[#8b1828]'
                  : 'bg-gradient-to-r from-[#aa7c11] via-[#e5b84c] to-[#c59828]'
              }`}
            />
            <span
              className={`w-7 h-[3px] rounded-full transition-all duration-300 shadow-sm ${
                isMenuOpen
                  ? 'opacity-0 scale-x-0'
                  : 'opacity-100 bg-gradient-to-r from-[#aa7c11] via-[#e5b84c] to-[#c59828]'
              }`}
            />
            <span
              className={`w-7 h-[3px] rounded-full transition-all duration-300 shadow-sm ${
                isMenuOpen
                  ? '-rotate-45 -translate-y-2 bg-[#8b1828]'
                  : 'bg-gradient-to-r from-[#aa7c11] via-[#e5b84c] to-[#c59828]'
              }`}
            />
          </div>
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {isMenuOpen && (
        <div
          className="lg:hidden border-t border-[#d4af37]/35 py-3 px-6 space-y-1 max-h-[calc(100vh-4.5rem)] overflow-y-auto shadow-2xl animate-in slide-in-from-top-3 duration-200"
          style={{
            background: 'linear-gradient(180deg, #fdfcf9 0%, #faf5ec 100%)',
          }}
        >
          {navItems.map((item, index) =>
            item.dropdown ? (
              <div key={item.path} className="border-b border-[#d4af37]/20 last:border-b-0">
                <button
                  onClick={(e) => toggleDropdown(index, e)}
                  aria-expanded={activeDropdown === index}
                  className={`w-full flex items-center justify-between py-3 text-left font-serif text-base tracking-wide ${
                    isActive(item.path) || activeDropdown === index
                      ? 'text-[#8b1828] font-semibold'
                      : 'text-[#3a2c0d]'
                  }`}
                >
                  <span>{item.label}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#b8860b] transition-transform duration-200 ${
                      activeDropdown === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {activeDropdown === index && (
                  <div className="pb-2.5 pl-3.5 space-y-1 border-l-2 border-[#d4af37]/40 ml-1 mb-2">
                    {item.dropdown.map((d) => (
                      <Link
                        key={d.path}
                        to={d.path}
                        onClick={handleLinkClick}
                        className={`flex items-center justify-between py-2 text-sm font-serif ${
                          d.highlight
                            ? 'text-[#8b1828] font-semibold'
                            : 'text-[#5a4820] hover:text-[#8b1828]'
                        }`}
                      >
                        <span>{d.label}</span>
                        {d.highlight && <Sparkles className="w-3.5 h-3.5 text-[#b8860b]" />}
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
                className={`block py-3 font-serif text-base tracking-wide border-b border-[#d4af37]/20 last:border-b-0 ${
                  isActive(item.path) ? 'text-[#8b1828] font-semibold' : 'text-[#3a2c0d]'
                }`}
              >
                {item.label}
              </Link>
            )
          )}

          {/* Mobile Auth Buttons */}
          <div className="pt-4 pb-2 space-y-2.5">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/login"
                  onClick={handleLinkClick}
                  className="block text-center py-2.5 rounded-lg font-serif font-medium text-[#3a2c0d] border border-[#d4af37]/50 bg-white/70 hover:bg-[#d4af37]/15 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={handleLinkClick}
                  className="block text-center py-2.5 rounded-lg font-serif font-medium text-white shadow-md bg-gradient-to-r from-[#7a0a18] via-[#9e1224] to-[#700713] border border-[#e5b84c]/70 transition-transform active:scale-95"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-2.5 font-serif text-[#8b1828] hover:bg-[#8b1828]/10 rounded-lg transition-colors"
              >
                <LogOut size={18} />
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;