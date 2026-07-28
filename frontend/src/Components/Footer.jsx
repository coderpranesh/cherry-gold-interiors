import React from 'react';
import lo from '../assets/logo_foot.png';
import { MapPin, Phone, Mail, Facebook, Instagram, Twitter, Youtube, Shield, FileText, Users, Clock } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-gray-900 to-red-800 text-[#F5F5F5]">
      {/* Main Footer */}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <p className="text-base sm:text-lg text-[#FFD700]">
                Bringing a Cherished Life with Golden Moments
              </p>
              <br></br>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            
            <div className="flex items-center space-x-2 mb-6">
              <img src={lo} alt="Cherry Gold Interiors Logo" className="w-12 h-12" />
              <span className="font-bold text-xl">Cherry Gold Interiors</span>
            </div>
            <p className="text-[#F5F5F5] mb-6 leading-relaxed">
              Transforming homes with premium interior design solutions. 15 years of expertise in creating beautiful, functional spaces.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/share/16rBKYqwHA/" className="bg-[#2A2A2A] p-2 rounded-lg hover:bg-[#FFD700] hover:text-[#3A2C0D] transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://www.instagram.com/cherrygoldinteriors?igsh=bDNsd216ZDMzbmVs" className="bg-[#2A2A2A] p-2 rounded-lg hover:bg-[#FFD700] hover:text-[#3A2C0D] transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              {/* <a href="#" className="bg-[#2A2A2A] p-2 rounded-lg hover:bg-[#FFD700] hover:text-[#3A2C0D] transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="bg-[#2A2A2A] p-2 rounded-lg hover:bg-[#FFD700] hover:text-[#3A2C0D] transition-colors">
                <Youtube className="w-5 h-5" />
              </a> */}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-[#FFD700]">Quick Links</h3>
            <ul className="space-y-3">
              <li><a href="/portfolio" className="text-[#F5F5F5] hover:text-[#FFD700] transition-colors">Portfolio</a></li>
              <li><a href="/" className="text-[#F5F5F5] hover:text-[#FFD700] transition-colors">How We Work</a></li>
              <li><a href="/services" className="text-[#F5F5F5] hover:text-[#FFD700] transition-colors">Services</a></li>
              <li><a href="/catalogue" className="text-[#F5F5F5] hover:text-[#FFD700] transition-colors">Catalogue</a></li>
              <li><a href="/faq" className="text-[#F5F5F5] hover:text-[#FFD700] transition-colors">FAQ</a></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-[#FFD700]">Our Services</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-[#F5F5F5] hover:text-[#FFD700] transition-colors">Modular Kitchen</a></li>
              <li><a href="#" className="text-[#F5F5F5] hover:text-[#FFD700] transition-colors">Wardrobe Design</a></li>
              <li><a href="#" className="text-[#F5F5F5] hover:text-[#FFD700] transition-colors">False Ceiling</a></li>
              <li><a href="#" className="text-[#F5F5F5] hover:text-[#FFD700] transition-colors">TV Unit Design</a></li>
              <li><a href="#" className="text-[#F5F5F5] hover:text-[#FFD700] transition-colors">Complete Home Interior</a></li>
              <li><a href="#" className="text-[#F5F5F5] hover:text-[#FFD700] transition-colors">Office Interior</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-[#FFD700]">Contact Information</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-[#FFD700]" />
                <p className="text-[#F5F5F5]">+91 9433889668</p>
              </div>
              
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-[#FFD700]" />
                <p className="text-[#999999]">Monday - Saturday, 9 AM - 7 PM</p>
              </div>
              
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-[#FFD700]" />
                <p className="text-[#F5F5F5]">info@cherrygoldinteriors.space</p>
              </div>
              
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-[#FFD700] mt-1" />
                <p className="text-[#F5F5F5]">Kolkata, West Bengal<br />We serve Pan India</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Warranty Information */}
      <div className="border-t border-[#3A2C0D] ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ">
          <div className="inline-flex items-center gap-2 px-12 py-14 rounded-lg text-sm font-semibold text-yellow-300 bg-yellow-200/10 backdrop-blur-sm shadow-inner shadow-yellow-400/30 ring-1 ring-yellow-500/30 transition-all p-6 border border-[#3A2C0D] ">
            <div className="flex items-center mb-4">
              <Shield className="w-6 h-6 text-[#FFD700] mr-3" />
              <h3 className="text-lg font-semibold text-[#FFD700]">Warranty Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-[#FFD700] rounded-full"></div>
                <div>
                  <p className="text-[#F5F5F5]">15 Years Warranty</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-[#FFD700] rounded-full"></div>
                <div>
                  <p className="text-[#F5F5F5]">500+ Happy Clients</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-[#FFD700] rounded-full"></div>
                <div>
                  <p className="text-[#F5F5F5]">4.9/5 Customer Rating</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-[#FFD700] rounded-full"></div>
                <div>
                  <p className="text-[#F5F5F5]">On-Time Delivery</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-[#3A2C0D]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex flex-wrap items-center space-x-6 mb-4 md:mb-0">
              <p className="text-[#999999] text-sm">
                © {currentYear} Cherry Gold Interiors. All rights reserved.
              </p>
              <div className="flex items-center space-x-4 text-sm">
                <a href="#" className="text-[#999999] hover:text-[#FFD700] transition-colors">
                  Privacy Policy
                </a>
                <a href="#" className="text-[#999999] hover:text-[#FFD700] transition-colors">
                  Terms & Conditions
                </a>
                <a href="#" className="text-[#999999] hover:text-[#FFD700] transition-colors">
                  Warranty Information
                </a>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <p className="text-[#999999] text-sm">Follow Us:</p>
              <div className="flex space-x-2">
                <a href="https://www.facebook.com/share/16rBKYqwHA/" className="text-[#999999] hover:text-[#FFD700]">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="https://www.instagram.com/cherrygoldinteriors?igsh=bDNsd216ZDMzbmVs" className="text-[#999999] hover:text-[#FFD700]">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="text-[#999999] hover:text-[#FFD700]">
                  <Twitter className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;