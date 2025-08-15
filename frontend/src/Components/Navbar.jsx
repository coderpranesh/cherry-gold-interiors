/*frontend/src/Components/Navbar.jsx */
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, Mail } from 'lucide-react';
import lo from '../assets/logo.svg';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    // { path: '/', label: 'Home' },
    {path: '/about', label: 'About' },
    

    { path: '/portfolio', label: ( <select 
          className="bg-transparent border-none focus:outline-none text-[#3A2C0D] hover:text-[#FFD700] cursor-pointer"
          onChange={(e) => window.location.href = e.target.value}
        >
          <option value="/portfolio">Portfolio</option>
          <option value="/catalogue">Catalogue</option>
        </select>
      ) 
    },
    { path: '/services', label: 'Services' },
    // { path: '/catalogue', label: 'Catalogue' },
    { path: '/refer-earn', label: 'Refer&Earn' },
    { path: '/track-project', label: 'ProjectTracking' },
    { path: '/cost-estimator', label: 'CostEstimator' },
    // { path: '/faq', label: 'FAQ' },
    // { path: '/kitchen-designer', label: 'KitchenDesigne' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
       <nav className="fixed top-0 left-0 w-full z-50 bg-[#f8f8ed] shadow-sm border-b border-gray-200 py-">
   
   
     

      {/* Top Bar */}
     
          
            {/* <span>info@cherrygoldinteriors.com</span> */}
         
      
     
          {/* Get Free Consultation | 10 Years Warranty */}
     
     
      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-6 py-2 flex justify-between items-center bg-[#f8f8ed]">
  {/* Logo */}
  <Link to="/" className="flex items-center gap-3 group">
    <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: "#f8f8ed" }}>
      <img
        src={lo}
        alt="Cherry Gold Interiors Logo"
        className="w-16 h-16 object-contain transition-transform duration-300 group-hover:scale-110"
        loading="lazy"
      />
    </div>
    {/* <span className="text-xl font-serif font-bold text-[#3A2C0D] group-hover:text-[#FFD700] transition-colors">
      Cherry Gold Interiors
    </span> */}
  </Link>

  {/* Nav Links */}
  <div className="hidden md:flex items-center space-x-6">
    {navItems.map((item) => (
      <Link
        key={item.path}
        to={item.path}
        className={`text-lg font-serif transition-all ${
          isActive(item.path)
            ? 'text-[#FFD700] font-semibold border-b-2 border-[#FFD700]'
            : 'text-[#3A2C0D] hover:text-[#FFD700] hover:border-b-2 hover:border-[#FFD700]'
        } py-1`}
      >
        {item.label}
      </Link>
    ))}
  </div>


        {/* CTA Button */}
        {/* <div className="hidden md:block">
          <Link
            to="/book-consultation"
             className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow transition-all"
          >
            Book Consultation
          </Link>
        </div> */}

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 rounded-md text-[#3A2C0D] hover:text-[#FFD700]"
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-[#3A2C0D] px-4 py-4 bg-white shadow-md">
          <div className="flex flex-col space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={`text-base font-medium ${
                  isActive(item.path)
                    ? 'text-[#FFD700] font-semibold'
                    : 'text-[#3A2C0D] hover:text-[#FFD700]'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/book-consultation"
              onClick={() => setIsMenuOpen(false)}
              className=" bg-[#3A2C0D] hover:bg-[#FFD700] text-white hover:text-[#3A2C0D] text-center py-2 rounded-lg font-medium border border-[#3A2C0D]"
            >
              Book Consultation
            </Link>

            {/* Contact Info in Mobile */}
            <div className="pt-4 border-t border-[#3A2C0D] text-sm text-[#3A2C0D]">
              <div className="flex items-center gap-2 mb-2">
                <Phone className="w-4 h-4 text-[#FFD700]" />
                <span>+91 9876543210</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#FFD700]" />
                <span>info@cherrygoldinteriors.com</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;