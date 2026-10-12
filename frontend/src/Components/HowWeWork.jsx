/*frontend/src/Components/HowWeWork.jsx */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight } from 'lucide-react';
import ctaLivingRoom from '../assets/cta-living-room.jpg';
import ConsultationModal from './ConsultationModal';

const HowWeWork = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const steps = [
    {
      id: 1,
      title: 'Book Consultation',
      description: 'Schedule a free consultation with our design experts to discuss your vision and requirements.',
      renderIcon: () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
          <circle cx="16" cy="16" r="3" />
          <polyline points="16 15 16 16 17 17" />
        </svg>
      )
    },
    {
      id: 2,
      title: 'Site Visit & Design',
      description: 'Our team visits your space, takes measurements, and creates detailed 3D designs tailored to your needs.',
      renderIcon: () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
          <path d="M3 10L12 3L21 10V20C21 20.5 20.5 21 20 21H4C3.5 21 3 20.5 3 20V10Z" />
          <path d="M9 21V12H15V21" />
          <path d="M19 6V2H15" />
        </svg>
      )
    },
    {
      id: 3,
      title: 'Budget Approval',
      description: 'We provide transparent pricing with detailed quotations. No hidden costs, just honest pricing.',
      renderIcon: () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
          <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" />
          <path d="M14 2V8H20" />
          <circle cx="12" cy="15" r="4" />
          <path d="M10.5 13.8H13.5" />
          <path d="M10.5 15H13" />
          <path d="M11.5 13.8V16.8" />
        </svg>
      )
    },
    {
      id: 4,
      title: 'Manufacturing & Installation',
      description: 'Quality manufacturing in our facility followed by professional installation at your location.',
      renderIcon: () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      )
    },
    {
      id: 5,
      title: 'Final Delivery',
      description: 'Quality check, final touches, and handover of your beautiful new space with warranty coverage.',
      renderIcon: () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
          <path d="M12 3L2 12H5V20H19V12H22L12 3Z" />
          <path d="M9 13L11 15L15 11" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    }
  ];

  return (
    <section className="relative pt-20 pb-28 bg-[#FBF3E8] overflow-hidden">
      
      {/* Top Left Delicate Flourish Background Lines */}
      <div className="absolute top-0 left-0 w-80 h-80 pointer-events-none opacity-40">
        <svg viewBox="0 0 200 200" fill="none" stroke="#D4AF37" strokeWidth="0.8" className="w-full h-full">
          <path d="M-20,40 Q60,60 80,-20" />
          <path d="M-30,70 Q90,90 120,-30" />
          <path d="M-10,110 Q120,130 160,-10" />
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16 sm:mb-20">
          {/* Gold Diamond Ornament */}
          <div className="flex items-center justify-center gap-3 mb-3.5">
            <div className="w-14 sm:w-20 h-[1.5px] bg-gradient-to-r from-transparent to-[#D4AF37]"></div>
            <div className="w-2.5 h-2.5 rotate-45 bg-[#D4AF37] shadow-[0_0_8px_rgba(212,175,55,0.6)]"></div>
            <div className="w-14 sm:w-20 h-[1.5px] bg-gradient-to-l from-transparent to-[#D4AF37]"></div>
          </div>

          {/* Heading */}
          <h2 className="text-3.5xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-gray-900 mb-4 leading-tight">
            How Our{' '}
            <span className="text-[#800020] block sm:inline">
              Company Works
            </span>
          </h2>

          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed font-normal">
            From concept to completion, we guide you through every step of your interior design journey with transparency and expertise.
          </p>
        </div>

        {/* 5-Step Vertical Timeline (Desktop Centered Showcase) */}
        <div className="max-w-4xl mx-auto mb-20 sm:mb-24">
          <div className="relative pl-14 sm:pl-20">
            
            {/* Continuous Vertical Golden Timeline Line */}
            <div className="absolute left-5 sm:left-7 top-6 bottom-6 w-0.5 bg-gradient-to-b from-[#D4AF37]/30 via-[#D4AF37] to-[#D4AF37]/30"></div>

            {/* Steps List */}
            <div className="space-y-6 sm:space-y-8">
              {steps.map((step) => (
                <div key={step.id} className="relative group">
                  
                  {/* Numbered Ruby Badge on the Timeline */}
                  <div className="absolute -left-14 sm:-left-20 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#800020] text-white font-serif font-bold text-base sm:text-lg flex items-center justify-center border-2 border-[#E5C378] shadow-[0_3px_12px_rgba(128,0,32,0.45)] transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_16px_rgba(212,175,55,0.7)] z-10">
                    {step.id}
                  </div>

                  {/* Step Card */}
                  <div className="relative rounded-2xl sm:rounded-3xl bg-gradient-to-r from-white via-[#FCF9F3] to-[#FAF2E6] border border-[#E5C378]/35 p-5 sm:p-7 shadow-[0_4px_22px_rgba(212,175,55,0.06)] transform hover:-translate-y-2 hover:shadow-[0_20px_45px_rgba(212,175,55,0.2)] hover:border-[#D4AF37] transition-all duration-400 ease-out cursor-pointer flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                    
                    {/* Golden Sunburst Circle Medallion */}
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-b from-[#FFFBF2] via-[#FCEECC] to-[#F5DFAC] border border-[#E2B755]/50 flex items-center justify-center text-[#9E6D14] shadow-[0_4px_14px_rgba(226,183,85,0.22)] flex-shrink-0 transition-transform duration-400 group-hover:scale-110 group-hover:shadow-[0_6px_20px_rgba(226,183,85,0.4)]">
                      {step.renderIcon()}
                    </div>

                    {/* Vertical Gold Divider Line (Hidden on tiny mobile) */}
                    <div className="hidden sm:block w-[1.5px] h-12 bg-gradient-to-b from-transparent via-[#E2B755]/50 to-transparent flex-shrink-0"></div>

                    {/* Text Content */}
                    <div className="flex-1">
                      <h3 className="text-xl sm:text-[22px] font-serif font-bold text-[#800020] mb-1.5 tracking-tight group-hover:text-[#660018] transition-colors">
                        {step.title}
                      </h3>
                      <p className="text-gray-600 text-sm sm:text-[15px] leading-relaxed font-normal">
                        {step.description}
                      </p>
                    </div>

                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* Masterpiece: "Ready to Get Started?" Luxury Banner Card (Desktop Executive Showcase) */}
        <div className="max-w-6xl mx-auto">
          <div className="relative overflow-hidden rounded-[28px] sm:rounded-[36px] lg:rounded-[40px] border border-[#E5C378]/40 shadow-[0_30px_70px_rgba(0,0,0,0.5),0_0_40px_rgba(128,0,32,0.25)]">
            
            {/* Top Curved Gold Wave Border */}
            <div className="absolute top-0 left-0 right-0 z-20 pointer-events-none overflow-hidden leading-none">
              <svg viewBox="0 0 1200 45" preserveAspectRatio="none" className="w-full h-6 sm:h-8">
                <path d="M0,0 C300,35 600,0 900,25 C1050,35 1150,10 1200,15 L1200,0 L0,0 Z" fill="#FBF3E8" />
                <path d="M0,0 C300,35 600,0 900,25 C1050,35 1150,10 1200,15" fill="none" stroke="#D4AF37" strokeWidth="2.5" />
              </svg>
            </div>

            {/* Banner Grid (Desktop 2-Column: Content on Left, Living Room Photo on Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[420px] lg:min-h-[460px]">
              
              {/* Left Column (lg:col-span-7): Rich Dark Ruby Content */}
              <div 
                className="lg:col-span-7 p-8 sm:p-12 lg:p-16 flex flex-col justify-center relative z-10"
                style={{
                  background: 'linear-gradient(135deg, #090103 0%, #160207 30%, #35040e 70%, #580616 100%)'
                }}
              >
                {/* Gold Accent Dash */}
                <div className="w-12 h-1 bg-gradient-to-r from-[#f0d290] to-[#b8860b] rounded-full mb-5 shadow-[0_0_10px_rgba(240,210,144,0.45)]"></div>
                
                {/* Headline */}
                <h3 className="text-3.5xl sm:text-4xl lg:text-5xl font-serif font-bold text-white tracking-wide leading-tight mb-4">
                  Ready to<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#fce2a1] via-[#e5c378] to-[#c99636]">
                    Get Started?
                  </span>
                </h3>

                {/* Subtitle */}
                <p className="text-gray-200 text-base sm:text-lg mb-8 font-light max-w-lg leading-relaxed">
                  Transform your space with our proven 5-step process. Schedule a one-on-one session with our master designers today.
                </p>

                {/* CTA Button */}
                <div>
                  <button 
                    onClick={() => setIsModalOpen(true)}
                    className="py-4 px-8 rounded-full bg-gradient-to-r from-[#e7c371] via-[#f7dda0] to-[#d69f3d] text-[#2c1a04] font-serif font-bold text-base sm:text-lg flex items-center justify-center gap-3 shadow-[0_6px_25px_rgba(231,195,113,0.45)] hover:shadow-[0_10px_35px_rgba(231,195,113,0.7)] hover:scale-105 active:scale-95 transition-all duration-300 group"
                  >
                    <Calendar className="w-5 h-5 text-[#2c1a04]" />
                    <span className="tracking-wide">Book Your Free Consultation</span>
                    <ArrowRight className="w-5 h-5 text-[#2c1a04] transition-transform duration-300 group-hover:translate-x-1" />
                  </button>
                </div>
              </div>

              {/* Right Column (lg:col-span-5): Luxury Interior Living Room Photo */}
              <div className="lg:col-span-5 relative min-h-[300px] lg:min-h-full overflow-hidden">
                <img 
                  src={ctaLivingRoom} 
                  alt="Luxury Modern Living Room Interior" 
                  className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700" 
                />
                
                {/* Left Edge Dark Vignette Overlay for Seamless Blend with Ruby Side */}
                <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#35040e]/90 to-transparent hidden lg:block pointer-events-none"></div>
                <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#35040e]/70 to-transparent lg:hidden pointer-events-none"></div>

                {/* Floating WhatsApp Action Button in Corner */}
                <a 
                  href="https://wa.me/919999999999" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label="Chat on WhatsApp"
                  className="absolute bottom-5 right-5 sm:bottom-6 sm:right-6 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-[#800020] to-[#500010] border-2 border-[#D4AF37] flex items-center justify-center text-white shadow-[0_4px_16px_rgba(0,0,0,0.6)] hover:scale-110 active:scale-95 transition-all duration-300 z-10"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 sm:w-7 sm:h-7 text-white">
                    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19.02L7.55 18.84L4.44 19.66L5.27 16.63L5.07 16.31C4.24 14.99 3.81 13.47 3.81 11.91C3.81 7.37 7.5 3.67 12.05 3.67M9.53 7.34C9.35 7.34 9.06 7.41 8.81 7.68C8.56 7.95 7.84 8.63 7.84 10.02C7.84 11.41 8.85 12.75 9 12.94C9.15 13.13 11.02 16.03 13.9 17.15C16.3 18.09 16.78 17.9 17.31 17.85C17.84 17.8 19.02 17.15 19.26 16.47C19.5 15.79 19.5 15.2 19.43 15.08C19.36 14.96 19.18 14.89 18.9 14.75C18.62 14.61 17.26 13.94 17 13.84C16.74 13.74 16.56 13.69 16.37 13.96C16.18 14.23 15.65 14.89 15.49 15.08C15.33 15.27 15.17 15.29 14.89 15.15C14.61 15.01 13.73 14.72 12.69 13.79C11.87 13.06 11.32 12.16 11.16 11.89C11 11.62 11.14 11.47 11.28 11.33C11.41 11.2 11.57 10.99 11.72 10.82C11.86 10.65 11.91 10.53 12 10.35C12.09 10.17 12.04 10.01 11.97 9.87C11.9 9.73 11.34 8.35 11.11 7.79C10.88 7.25 10.65 7.33 10.48 7.33C10.32 7.33 10.13 7.34 9.94 7.34H9.53Z" />
                  </svg>
                </a>
              </div>

            </div>

          </div>
        </div>

      </div>

      {/* Luxury Consultation Modal */}
      <ConsultationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />

    </section>
  );
};

export default HowWeWork;