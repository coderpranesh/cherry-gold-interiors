// frontend/src/Components/Footer.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import brandLogo from '../assets/cherry-gold-full-logo-transparent.png';
import brandEmblem from '../assets/cherry-gold-emblem.png';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  ChevronRight, 
  ShieldCheck, 
  Users, 
  Star, 
  Truck, 
  Facebook, 
  Instagram, 
  Youtube, 
  Linkedin 
} from 'lucide-react';
import ConsultationModal from './ConsultationModal';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);

  return (
    <footer className="relative bg-[#1A0307] text-[#E0D0C0] overflow-hidden font-sans border-t border-[#D4AF37]/20">
      
      {/* ========================================================================= */}
      {/* BACKGROUND DECORATIONS (BOTANICAL LEAVES & GEOMETRIC CURVES)              */}
      {/* ========================================================================= */}
      
      {/* Ambient background glows */}
      <div className="absolute top-0 right-0 w-[550px] h-[400px] bg-[radial-gradient(ellipse_at_top_right,_rgba(212,175,55,0.12)_0%,_transparent_70%)] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[450px] h-[350px] bg-[radial-gradient(ellipse_at_bottom_left,_rgba(192,20,43,0.15)_0%,_transparent_70%)] pointer-events-none" />

      {/* Golden Botanical Leaf Branch (Right Side - Matching User Image) */}
      <svg 
        className="absolute right-0 top-1/2 -translate-y-1/2 w-48 sm:w-64 md:w-80 h-[380px] pointer-events-none opacity-40 select-none hidden sm:block" 
        viewBox="0 0 240 360" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Main Stem */}
        <path d="M240,360 C200,310 170,240 160,170 C150,110 165,50 190,0" stroke="#D4AF37" strokeWidth="1.2" strokeLinecap="round" />
        
        {/* Leaf 1 (Top Left) */}
        <path d="M166,60 C135,45 120,20 135,10 C155,0 170,30 166,60 Z" stroke="#D4AF37" strokeWidth="0.9" fill="rgba(212,175,55,0.02)" />
        <path d="M166,60 C150,40 140,25 135,10" stroke="#D4AF37" strokeWidth="0.5" />
        
        {/* Leaf 2 (Upper Middle Left) */}
        <path d="M160,120 C120,110 100,85 115,70 C132,55 155,85 160,120 Z" stroke="#D4AF37" strokeWidth="0.9" fill="rgba(212,175,55,0.02)" />
        <path d="M160,120 C138,100 125,85 115,70" stroke="#D4AF37" strokeWidth="0.5" />
        
        {/* Leaf 3 (Middle Left Large) */}
        <path d="M162,180 C115,180 95,210 110,225 C130,240 152,210 162,180 Z" stroke="#D4AF37" strokeWidth="0.9" fill="rgba(212,175,55,0.02)" />
        <path d="M162,180 C135,200 120,215 110,225" stroke="#D4AF37" strokeWidth="0.5" />

        {/* Leaf 4 (Lower Left) */}
        <path d="M175,250 C130,265 115,300 132,315 C152,328 170,290 175,250 Z" stroke="#D4AF37" strokeWidth="0.9" fill="rgba(212,175,55,0.02)" />
        <path d="M175,250 C150,285 140,305 132,315" stroke="#D4AF37" strokeWidth="0.5" />

        {/* Leaf 5 (Right upper accent) */}
        <path d="M175,90 C198,75 220,80 215,95 C208,110 190,105 175,90 Z" stroke="#D4AF37" strokeWidth="0.8" fill="rgba(212,175,55,0.02)" />

        {/* Leaf 6 (Right middle accent) */}
        <path d="M172,160 C200,150 225,160 218,175 C210,190 188,180 172,160 Z" stroke="#D4AF37" strokeWidth="0.8" fill="rgba(212,175,55,0.02)" />

        {/* Leaf 7 (Right lower accent) */}
        <path d="M185,230 C212,225 235,240 228,255 C218,270 198,255 185,230 Z" stroke="#D4AF37" strokeWidth="0.8" fill="rgba(212,175,55,0.02)" />
      </svg>

      {/* Elegant Curved Ribbon Accents in Corners */}
      <svg className="absolute bottom-0 left-0 w-72 h-36 pointer-events-none opacity-25" viewBox="0 0 280 140" fill="none">
        <path d="M0,140 C80,120 160,95 230,55 C260,38 280,18 280,0" stroke="#D4AF37" strokeWidth="1" />
        <path d="M0,120 C70,105 140,80 205,45 C235,28 255,10 255,0" stroke="#9E1B2D" strokeWidth="1.5" />
      </svg>
      <svg className="absolute bottom-0 right-0 w-72 h-36 pointer-events-none opacity-25" viewBox="0 0 280 140" fill="none">
        <path d="M280,140 C200,120 120,95 50,55 C20,38 0,18 0,0" stroke="#D4AF37" strokeWidth="1" />
        <path d="M280,120 C210,105 140,80 75,45 C45,28 25,10 25,0" stroke="#9E1B2D" strokeWidth="1.5" />
      </svg>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8 relative z-10">
        
        {/* ========================================================================= */}
        {/* MAIN 4-COLUMN FOOTER CONTENT                                              */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 mb-10">
          
          {/* Column 1: Brand Heritage (Col Span 4) */}
          <div className="lg:col-span-4 space-y-4">
            
            {/* High-definition Cherry Gold brand emblem with warm gold drop shadow & Times New Roman brand name */}
            <Link to="/" className="inline-flex items-center gap-3.5 group focus:outline-none">
              <img 
                src={brandEmblem} 
                alt="Cherry Gold Interiors Emblem" 
                className="h-14 sm:h-16 w-auto object-contain filter drop-shadow-[0_4px_16px_rgba(212,175,55,0.45)] transition-transform duration-300 group-hover:scale-105 shrink-0" 
              />
              <div>
                <h3 
                  style={{ fontFamily: '"Times New Roman", Times, serif' }} 
                  className="font-bold text-[17px] sm:text-[19px] tracking-wider text-[#F5E6BE] uppercase leading-tight group-hover:text-[#D4AF37] transition-colors"
                >
                  CHERRY GOLD
                  <span className="block text-[13px] sm:text-[14px] text-[#D4AF37] tracking-[0.16em] font-normal mt-0.5">
                    INTERIORS PVT. LTD.
                  </span>
                </h3>
              </div>
            </Link>

            {/* Official registration badge: CIN: U74102WB2025PTC279494 */}
            <div className="pt-0.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#220409]/90 border border-[#D4AF37]/50 text-[11px] text-[#E8C872] shadow-[0_2px_10px_rgba(0,0,0,0.4)] font-mono tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] shadow-[0_0_6px_#D4AF37]" />
                <span>CIN: U74102WB2025PTC279494</span>
              </div>
            </div>

            {/* Brand Heritage Description */}
            <p className="text-[12px] sm:text-[13px] text-[#C8B8AB] leading-[1.65] max-w-[280px]">
              Transforming homes with premium interior design solutions, 15 years of expertise in creating beautiful, functional spaces.
            </p>

            {/* Active metallic social badges: Facebook, Instagram, YouTube */}
            <div className="pt-1">
              <div className="flex items-center gap-3">
                <a 
                  href="https://www.facebook.com/share/16rBKYqwHA/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-9 h-9 rounded-full bg-gradient-to-b from-[#2A060C] to-[#180306] border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#180306] hover:border-[#D4AF37] flex items-center justify-center transition-all duration-300 shadow-[0_0_10px_rgba(212,175,55,0.2)] group"
                  title="Follow us on Facebook"
                >
                  <Facebook size={15} className="transition-transform group-hover:scale-110" />
                </a>

                <a 
                  href="https://instagram.com/cherrygoldinteriors?mdxt=bDNsd216ZDMzbmVs" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-9 h-9 rounded-full bg-gradient-to-b from-[#2A060C] to-[#180306] border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#180306] hover:border-[#D4AF37] flex items-center justify-center transition-all duration-300 shadow-[0_0_10px_rgba(212,175,55,0.2)] group"
                  title="Follow us on Instagram @cherrygoldinteriors"
                >
                  <Instagram size={15} className="transition-transform group-hover:scale-110" />
                </a>

                <a 
                  href="https://youtube.com/@cherrygoldinteriors?si=YJx1kZxQ-Se7cAbh" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-9 h-9 rounded-full bg-gradient-to-b from-[#2A060C] to-[#180306] border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#180306] hover:border-[#D4AF37] flex items-center justify-center transition-all duration-300 shadow-[0_0_10px_rgba(212,175,55,0.2)] group"
                  title="Subscribe on YouTube @cherrygoldinteriors"
                >
                  <Youtube size={15} className="transition-transform group-hover:scale-110" />
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links (Col Span 2 or 3) */}
          <div className="lg:col-span-2 space-y-3">
            <div>
              <h4 className="font-serif text-base sm:text-lg font-bold text-[#F5E6BE] tracking-wide">
                Quick Links
              </h4>
              <div className="w-8 h-[2px] bg-[#D4AF37] mt-1.5 rounded-full" />
            </div>

            <ul className="space-y-2 text-xs sm:text-[13px] text-[#CBB8AB] pt-1">
              {[
                { label: 'Portfolio', path: '/portfolio' },
                { label: 'How We Work', path: '/about' },
                { label: 'Services', path: '/services' },
                { label: 'Catalogue', path: '/catalogue' },
                { label: 'FAQ', path: '/faq' }
              ].map((link, idx) => (
                <li key={idx}>
                  <Link 
                    to={link.path}
                    className="flex items-center justify-between hover:text-[#E8C872] transition-colors py-1 group"
                  >
                    <span>{link.label}</span>
                    <ChevronRight size={13} className="text-[#D4AF37]/70 group-hover:text-[#E8C872] group-hover:translate-x-1 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Our Services (Col Span 3) */}
          <div className="lg:col-span-3 space-y-3">
            <div>
              <h4 className="font-serif text-base sm:text-lg font-bold text-[#F5E6BE] tracking-wide">
                Our Services
              </h4>
              <div className="w-8 h-[2px] bg-[#D4AF37] mt-1.5 rounded-full" />
            </div>

            <ul className="space-y-2 text-xs sm:text-[13px] text-[#CBB8AB] pt-1">
              {[
                { label: 'Modular Kitchen', path: '/kitchen-designer' },
                { label: 'Wardrobe Design', path: '/catalogue' },
                { label: 'False Ceiling', path: '/services' },
                { label: 'TV Unit Design', path: '/catalogue' },
                { label: 'Complete Home Interior', path: '/cost-estimator' },
                { label: 'Office Interior', path: '/services' }
              ].map((srv, idx) => (
                <li key={idx}>
                  <Link 
                    to={srv.path}
                    className="flex items-center justify-between hover:text-[#E8C872] transition-colors py-1 group"
                  >
                    <span>{srv.label}</span>
                    <ChevronRight size={13} className="text-[#D4AF37]/70 group-hover:text-[#E8C872] group-hover:translate-x-1 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact Information (Col Span 3) */}
          <div className="lg:col-span-3 space-y-3">
            <div>
              <h4 className="font-serif text-base sm:text-lg font-bold text-[#F5E6BE] tracking-wide">
                Contact Information
              </h4>
              <div className="w-8 h-[2px] bg-[#D4AF37] mt-1.5 rounded-full" />
            </div>

            <div className="space-y-3.5 pt-1 text-xs sm:text-[13px] text-[#CBB8AB]">
              
              {/* Phone */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#1A0307] border border-[#D4AF37] flex items-center justify-center shrink-0 text-[#D4AF37]">
                  <Phone size={14} />
                </div>
                <a href="tel:+919433889668" className="hover:text-[#E8C872] transition-colors font-medium">
                  +91 9433889668
                </a>
              </div>

              {/* Working Hours */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#1A0307] border border-[#D4AF37] flex items-center justify-center shrink-0 text-[#D4AF37]">
                  <Clock size={14} />
                </div>
                <span>Monday - Saturday, 9 AM - 7 PM</span>
              </div>

              {/* Email */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#1A0307] border border-[#D4AF37] flex items-center justify-center shrink-0 text-[#D4AF37]">
                  <Mail size={14} />
                </div>
                <a href="mailto:info@cherrygoldinteriors.space" className="hover:text-[#E8C872] transition-colors truncate">
                  info@cherrygoldinteriors.space
                </a>
              </div>

              {/* Location */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#1A0307] border border-[#D4AF37] flex items-center justify-center shrink-0 text-[#D4AF37] mt-0.5">
                  <MapPin size={14} />
                </div>
                <div className="leading-snug">
                  <p className="font-medium text-white">Kolkata, West Bengal</p>
                  <p className="text-[11px] text-[#D4AF37] mt-0.5">We serve Pan India</p>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* PROMINENT TRUST BOX (THE GOLDEN ROUNDED FRAME - EXACT MATCH)              */}
        {/* ========================================================================= */}
        <div className="rounded-2xl bg-gradient-to-r from-[#200308]/90 via-[#27040B]/90 to-[#1F0307]/90 border border-[#D4AF37]/50 px-6 py-5 shadow-[0_8px_30px_rgba(0,0,0,0.6)] mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-4 divide-y sm:divide-y-0 lg:divide-x divide-[#D4AF37]/20">
            
            {/* Pillar 1: Up to 10 Years Warranty */}
            <div className="flex items-center gap-3.5 pt-2 sm:pt-0 lg:px-4 first:lg:pl-0">
              <div className="w-10 h-10 rounded-full bg-[#1A0307] border border-[#D4AF37] flex items-center justify-center text-[#D4AF37] shrink-0">
                <ShieldCheck size={19} />
              </div>
              <div>
                <h5 className="font-serif font-bold text-white text-xs sm:text-sm tracking-wide">
                  Up to 10 Years Warranty
                </h5>
                <p className="text-[11px] text-[#CBB8AB] mt-0.5">
                  Quality You Can Trust
                </p>
              </div>
            </div>

            {/* Pillar 2: 500+ Happy Clients */}
            <div className="flex items-center gap-3.5 pt-3 sm:pt-0 lg:px-4">
              <div className="w-10 h-10 rounded-full bg-[#1A0307] border border-[#D4AF37] flex items-center justify-center text-[#D4AF37] shrink-0">
                <Users size={19} />
              </div>
              <div>
                <h5 className="font-serif font-bold text-white text-xs sm:text-sm tracking-wide">
                  500+ Happy Clients
                </h5>
                <p className="text-[11px] text-[#CBB8AB] mt-0.5">
                  Beautiful Homes Delivered
                </p>
              </div>
            </div>

            {/* Pillar 3: 4.9/5 Customer Rating */}
            <div className="flex items-center gap-3.5 pt-3 sm:pt-0 lg:px-4">
              <div className="w-10 h-10 rounded-full bg-[#1A0307] border border-[#D4AF37] flex items-center justify-center text-[#D4AF37] shrink-0">
                <Star size={19} className="fill-[#D4AF37]" />
              </div>
              <div>
                <h5 className="font-serif font-bold text-white text-xs sm:text-sm tracking-wide">
                  4.9/5 Customer Rating
                </h5>
                <p className="text-[11px] text-[#CBB8AB] mt-0.5">
                  Based on Real Feedback
                </p>
              </div>
            </div>

            {/* Pillar 4: On-Time Delivery */}
            <div className="flex items-center gap-3.5 pt-3 sm:pt-0 lg:px-4 last:lg:pr-0">
              <div className="w-10 h-10 rounded-full bg-[#1A0307] border border-[#D4AF37] flex items-center justify-center text-[#D4AF37] shrink-0">
                <Truck size={19} />
              </div>
              <div>
                <h5 className="font-serif font-bold text-white text-xs sm:text-sm tracking-wide">
                  On-Time Delivery
                </h5>
                <p className="text-[11px] text-[#CBB8AB] mt-0.5">
                  Committed to Your Timeline
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* ========================================================================= */}
        {/* CENTERED GOLDEN DIAMOND DIVIDER (LOCATED DIRECTLY ABOVE LEGAL STRIP)      */}
        {/* ========================================================================= */}
        <div className="relative flex items-center justify-center my-6">
          <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent" />
          <div className="absolute w-3.5 h-3.5 rotate-45 bg-[#1A0307] border border-[#D4AF37] flex items-center justify-center shadow-[0_0_8px_rgba(212,175,55,0.6)]">
            <div className="w-1.5 h-1.5 bg-[#D4AF37] rotate-45" />
          </div>
        </div>

        {/* ========================================================================= */}
        {/* BOTTOM COPYRIGHT & LEGAL STRIP (EXACT MATCHING REFERENCE)                 */}
        {/* ========================================================================= */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#BFAEA3]">
          
          {/* Copyright */}
          <div>
            © {currentYear} Cherry Gold Interiors. All rights reserved.
          </div>

          {/* Legal Links */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-[11px] sm:text-xs">
            <span className="hidden md:inline text-[#D4AF37]/40">|</span>
            <Link to="/faq" className="hover:text-[#E8C872] transition-colors">Privacy Policy</Link>
            <span className="text-[#D4AF37]/40">|</span>
            <Link to="/faq" className="hover:text-[#E8C872] transition-colors">Terms &amp; Conditions</Link>
            <span className="text-[#D4AF37]/40">|</span>
            <Link to="/faq" className="hover:text-[#E8C872] transition-colors">Warranty Information</Link>
          </div>

          {/* Follow Us Mini Badges */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-gray-300">Follow Us:</span>
            <a 
              href="https://www.facebook.com/share/16rBKYqwHA/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-6 h-6 rounded-full bg-[#1A0307] border border-[#D4AF37]/70 flex items-center justify-center text-white hover:text-[#D4AF37] hover:border-[#D4AF37] transition-all"
              title="Facebook"
            >
              <Facebook size={11} />
            </a>
            <a 
              href="https://instagram.com/cherrygoldinteriors?mdxt=bDNsd216ZDMzbmVs" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-6 h-6 rounded-full bg-[#1A0307] border border-[#D4AF37]/70 flex items-center justify-center text-white hover:text-[#D4AF37] hover:border-[#D4AF37] transition-all"
              title="Instagram"
            >
              <Instagram size={11} />
            </a>
            <a 
              href="https://www.linkedin.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-6 h-6 rounded-full bg-[#1A0307] border border-[#D4AF37]/70 flex items-center justify-center text-white hover:text-[#D4AF37] hover:border-[#D4AF37] transition-all"
              title="LinkedIn"
            >
              <Linkedin size={11} />
            </a>
            <a 
              href="https://youtube.com/@cherrygoldinteriors?si=YJx1kZxQ-Se7cAbh" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-6 h-6 rounded-full bg-[#1A0307] border border-[#D4AF37]/70 flex items-center justify-center text-white hover:text-[#D4AF37] hover:border-[#D4AF37] transition-all"
              title="YouTube"
            >
              <Youtube size={11} />
            </a>
          </div>

        </div>

      </div>

      {/* Free Consultation Modal */}
      <ConsultationModal
        isOpen={isConsultationModalOpen}
        onClose={() => setIsConsultationModalOpen(false)}
        title="Schedule Your Free Design Consultation"
      />
    </footer>
  );
};

export default Footer;