/*frontend/src/Components/WarrantySection.jsx */
import React from 'react';
import { 
  ShieldCheck, Headset, Award, FileText, ChevronRight,
  Settings, Wrench, Home, PaintRoller
} from 'lucide-react';
import { Link } from 'react-router-dom';

const WarrantySection = () => {
  const promiseCards = [
    {
      icon: ShieldCheck,
      title: '5 Years Warranty',
      description: 'Comprehensive warranty on modular kitchens and wardrobes.'
    },
    {
      icon: Headset,
      title: '24/7 Support',
      description: 'Round-the-clock customer support for all your queries.'
    },
    {
      icon: Award,
      title: 'Quality Guarantee',
      description: 'Premium materials and certified quality standards.'
    },
    {
      icon: FileText,
      title: 'Clear Terms',
      description: 'Transparent warranty terms and reliable service support.'
    }
  ];

  const coveredItems = [
    { icon: Settings, text: 'Manufacturing defects in materials' },
    { icon: Wrench, text: 'Hardware and fitting failures' },
    { icon: Home, text: 'Structural integrity issues' },
    { icon: PaintRoller, text: 'Finish quality problems' },
  ];

  const warrantyPeriods = [
    {
      label: 'Modular Kitchen:',
      period: '10 years',
      renderIcon: () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4">
          <rect x="3" y="3" width="7" height="8" rx="1" />
          <rect x="14" y="3" width="7" height="8" rx="1" />
          <rect x="3" y="14" width="18" height="7" rx="1" />
          <line x1="12" y1="14" x2="12" y2="21" />
          <circle cx="6.5" cy="7" r="0.8" fill="currentColor" />
          <circle cx="17.5" cy="7" r="0.8" fill="currentColor" />
        </svg>
      )
    },
    {
      label: 'Wardrobes:',
      period: '5 years',
      renderIcon: () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4">
          <rect x="4" y="2" width="16" height="20" rx="1.5" />
          <line x1="12" y1="2" x2="12" y2="22" />
          <line x1="9.5" y1="11" x2="9.5" y2="13" />
          <line x1="14.5" y1="11" x2="14.5" y2="13" />
        </svg>
      )
    },
    {
      label: 'TV Units:',
      period: '2 years',
      renderIcon: () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4">
          <rect x="2" y="4" width="20" height="13" rx="1.5" />
          <line x1="8" y1="20" x2="16" y2="20" />
          <line x1="12" y1="17" x2="12" y2="20" />
        </svg>
      )
    },
    {
      label: 'False Ceiling:',
      period: '5 years',
      renderIcon: () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4">
          <ellipse cx="12" cy="7" rx="8" ry="3.5" />
          <ellipse cx="12" cy="12" rx="5" ry="2" />
          <line x1="12" y1="14" x2="12" y2="19" />
          <line x1="8" y1="18" x2="16" y2="18" />
        </svg>
      )
    }
  ];

  return (
    <section className="relative pt-20 pb-28 bg-[#FBF3E8] overflow-hidden">
      
      {/* Top Left Delicate Flourish Lines */}
      <div className="absolute top-0 left-0 w-80 h-80 pointer-events-none opacity-40">
        <svg viewBox="0 0 200 200" fill="none" stroke="#D4AF37" strokeWidth="0.8" className="w-full h-full">
          <path d="M-20,40 Q60,60 80,-20" />
          <path d="M-30,70 Q90,90 120,-30" />
          <path d="M-10,110 Q120,130 160,-10" />
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          {/* Gold Diamond Ornament */}
          <div className="flex items-center justify-center gap-3 mb-3.5">
            <div className="w-14 sm:w-20 h-[1.5px] bg-gradient-to-r from-transparent to-[#D4AF37]"></div>
            <div className="w-2.5 h-2.5 rotate-45 bg-[#D4AF37] shadow-[0_0_8px_rgba(212,175,55,0.6)]"></div>
            <div className="w-14 sm:w-20 h-[1.5px] bg-gradient-to-l from-transparent to-[#D4AF37]"></div>
          </div>

          {/* Heading */}
          <h2 className="text-3.5xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-gray-900 mb-4 leading-tight">
            Our Warranty{' '}
            <span className="text-[#800020] block sm:inline">
              Promise
            </span>
          </h2>

          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed font-normal">
            We stand behind our work with comprehensive warranty coverage and ongoing support to ensure your complete satisfaction.
          </p>
        </div>

        {/* 4 Feature Badges Grid (Desktop 4-Column Showcase) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-20">
          {promiseCards.map((card, index) => (
            <div 
              key={index} 
              className="relative p-7 sm:p-8 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-white via-[#FCF9F3] to-[#FAF2E6] border border-[#E5C378]/35 shadow-[0_4px_22px_rgba(212,175,55,0.08)] transform hover:-translate-y-3 hover:shadow-[0_22px_50px_rgba(184,134,11,0.22)] hover:border-[#D4AF37] transition-all duration-400 ease-out cursor-pointer group flex flex-col items-center text-center"
            >
              {/* Golden Sunburst Glow Behind Icon */}
              <div className="relative mb-5">
                <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-gradient-to-b from-[#FFFBF2] via-[#FCEECC] to-[#F5DFAC] border border-[#E2B755]/50 flex items-center justify-center text-[#9E6D14] shadow-[0_4px_16px_rgba(226,183,85,0.25)] transition-all duration-400 group-hover:scale-110 group-hover:shadow-[0_6px_22px_rgba(226,183,85,0.4)]">
                  <card.icon className="w-8 h-8 stroke-[1.8]" />
                </div>
              </div>

              {/* Title in Rich Ruby Red Serif */}
              <h3 className="text-xl sm:text-[22px] font-serif font-bold text-[#800020] mb-2.5 tracking-tight group-hover:text-[#660018] transition-colors">
                {card.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 text-[14px] sm:text-[15px] leading-relaxed font-normal">
                {card.description}
              </p>
            </div>
          ))}
        </div>

        {/* Centerpiece: Luxury Warranty Terms & Conditions Card (Desktop Executive Layout) */}
        <div className="max-w-6xl mx-auto">
          <div 
            className="relative overflow-hidden rounded-[28px] sm:rounded-[36px] lg:rounded-[40px] p-6 sm:p-9 lg:p-12 text-white border border-[#e5c378]/35 shadow-[0_25px_70px_-15px_rgba(0,0,0,0.9),0_0_40px_rgba(138,10,32,0.35)] transform hover:-translate-y-2.5 hover:shadow-[0_40px_85px_-15px_rgba(0,0,0,0.95),0_0_55px_rgba(138,10,32,0.45)] hover:border-[#e5c378]/65 transition-all duration-500 ease-out cursor-pointer group/card"
            style={{
              background: 'linear-gradient(135deg, #0a0103 0%, #150207 25%, #2a030c 60%, #520616 100%)'
            }}
          >
            {/* Top Right Decorative Ambient Glow & Light Rays */}
            <div className="absolute top-0 right-0 w-72 h-72 pointer-events-none overflow-hidden rounded-tr-[28px] sm:rounded-tr-[40px]">
              <div className="absolute -top-16 -right-16 w-64 h-64 bg-gradient-to-br from-[#f0d290]/25 via-[#b8860b]/15 to-transparent rounded-full blur-3xl"></div>
              <div className="absolute top-0 right-12 w-px h-52 bg-gradient-to-b from-[#f0d290]/35 to-transparent rotate-45 transform origin-top"></div>
              <div className="absolute top-4 right-24 w-px h-44 bg-gradient-to-b from-[#f0d290]/20 to-transparent rotate-45 transform origin-top"></div>
              <div className="absolute top-8 right-36 w-px h-36 bg-gradient-to-b from-[#f0d290]/15 to-transparent rotate-45 transform origin-top"></div>
            </div>

            {/* Desktop 2-Column Grid */}
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              
              {/* Left Column (lg:col-span-5): Branding, Title, 3D Shield & CTA */}
              <div className="lg:col-span-5 flex flex-col justify-between h-full">
                <div>
                  {/* Gold Accent Dash */}
                  <div className="w-12 h-1 bg-gradient-to-r from-[#f0d290] to-[#b8860b] rounded-full mb-4 shadow-[0_0_10px_rgba(240,210,144,0.45)]"></div>
                  
                  {/* Card Title */}
                  <h3 className="text-3xl sm:text-4xl lg:text-[42px] font-serif font-bold text-white tracking-wide leading-[1.15] mb-4">
                    Warranty Terms &<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#fce2a1] via-[#e5c378] to-[#c99636]">
                      Conditions
                    </span>
                  </h3>

                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-6 lg:mb-8 font-light">
                    Every installation by Cherry Gold Interiors is engineered with premium materials, trusted craftsmanship, and backed by comprehensive multi-year coverage.
                  </p>

                  {/* 3D Shield + Assurance Seal */}
                  <div className="flex items-center gap-5 p-4 rounded-2xl bg-white/[0.04] border border-[#e5c378]/25 backdrop-blur-sm mb-6 lg:mb-8 shadow-inner">
                    <div className="relative flex-shrink-0 w-16 h-20 sm:w-20 sm:h-24">
                      <div className="absolute inset-0 bg-[#e5c378]/25 rounded-full blur-md pointer-events-none"></div>
                      <svg viewBox="0 0 100 120" className="w-full h-full filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.7)]">
                        <defs>
                          <linearGradient id="shieldGoldRim" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#fae5a8" />
                            <stop offset="35%" stopColor="#d4af37" />
                            <stop offset="70%" stopColor="#8a6318" />
                            <stop offset="100%" stopColor="#f3d288" />
                          </linearGradient>

                          <linearGradient id="shieldInnerGold" x1="0%" y1="100%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#a3761a" />
                            <stop offset="50%" stopColor="#f7e1a0" />
                            <stop offset="100%" stopColor="#c5982e" />
                          </linearGradient>

                          <radialGradient id="shieldRuby" cx="38%" cy="32%" r="68%">
                            <stop offset="0%" stopColor="#b91c3c" />
                            <stop offset="45%" stopColor="#7a0a20" />
                            <stop offset="80%" stopColor="#430410" />
                            <stop offset="100%" stopColor="#220107" />
                          </radialGradient>

                          <linearGradient id="checkGold" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#fff8db" />
                            <stop offset="45%" stopColor="#f3ce76" />
                            <stop offset="100%" stopColor="#b6821d" />
                          </linearGradient>

                          <filter id="shieldShadow" x="-20%" y="-20%" width="140%" height="140%">
                            <feDropShadow dx="0" dy="3" stdDeviation="2.5" floodColor="#000" floodOpacity="0.6"/>
                          </filter>
                        </defs>

                        <path 
                          d="M50 4 C78 4, 94 14, 94 36 C94 76, 50 114, 50 114 C50 114, 6 76, 6 36 C6 14, 22 4, 50 4 Z" 
                          fill="url(#shieldGoldRim)" 
                        />
                        <path 
                          d="M50 9 C74 9, 88 17, 88 37 C88 72, 50 107, 50 107 C50 107, 12 72, 12 37 C12 17, 26 9, 50 9 Z" 
                          fill="#1f0208" 
                        />
                        <path 
                          d="M50 12 C71 12, 84 19, 84 38 C84 69, 50 102, 50 102 C50 102, 16 69, 16 38 C16 19, 29 12, 50 12 Z" 
                          fill="url(#shieldInnerGold)" 
                        />
                        <path 
                          d="M50 15 C69 15, 80 21, 80 39 C80 67, 50 98, 50 98 C50 98, 20 67, 20 39 C20 21, 31 15, 50 15 Z" 
                          fill="url(#shieldRuby)" 
                        />
                        <path 
                          d="M50 17 C66 17, 76 22, 77 36 C68 40, 52 38, 38 48 C27 48, 23 42, 23 37 C23 22, 34 17, 50 17 Z" 
                          fill="#ffffff" 
                          opacity="0.22" 
                        />
                        <path 
                          d="M36 57 L46 68 L68 43 L73 48 L46 78 L31 62 Z" 
                          fill="url(#checkGold)" 
                          filter="url(#shieldShadow)" 
                        />
                      </svg>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 text-[#fce2a1] font-serif font-bold text-base sm:text-lg">
                        <span>Certified Assurance</span>
                      </div>
                      <p className="text-gray-300 text-xs sm:text-sm mt-0.5 leading-snug">
                        Official stamped warranty certificate provided on project handover.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Desktop Left Button */}
                <div className="hidden lg:block mt-auto">
                  <Link to="/about" className="block w-full">
                    <button className="w-full py-4 px-8 rounded-full bg-gradient-to-r from-[#e7c371] via-[#f7dda0] to-[#d69f3d] text-[#2c1a04] font-serif font-bold text-base flex items-center justify-center gap-2.5 shadow-[0_6px_22px_rgba(231,195,113,0.4)] hover:shadow-[0_8px_30px_rgba(231,195,113,0.65)] hover:scale-[1.02] active:scale-[0.99] transition-all duration-300 group">
                      <span className="tracking-wide">View Full Warranty Terms</span>
                      <ChevronRight className="w-5 h-5 text-[#2c1a04] stroke-[2.5] transition-transform duration-300 group-hover:translate-x-1" />
                    </button>
                  </Link>
                </div>
              </div>

              {/* Right Column (lg:col-span-7): What's Covered + Warranty Period */}
              <div className="lg:col-span-7 flex flex-col gap-6 lg:gap-8 bg-black/25 lg:p-8 rounded-2xl lg:border lg:border-[#e5c378]/20">
                
                {/* Section 1: What's Covered */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <h4 className="text-white font-serif font-bold text-lg sm:text-xl tracking-wide whitespace-nowrap">
                      What's Covered:
                    </h4>
                    <div className="h-[1px] flex-1 bg-gradient-to-r from-[#d4af37]/70 via-[#d4af37]/30 to-transparent"></div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {coveredItems.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.08] transition-all duration-300 transform hover:-translate-y-1 border border-transparent hover:border-[#e5c378]/35 group/item">
                        <div className="w-7 h-7 rounded-full border border-[#e5c378]/90 flex items-center justify-center text-[#e5c378] flex-shrink-0 bg-[#e5c378]/10 shadow-[0_0_6px_rgba(229,195,120,0.25)] transition-transform duration-300 group-hover/item:scale-110">
                          <item.icon className="w-4 h-4 stroke-[2]" />
                        </div>
                        <span className="text-[14px] sm:text-[15px] font-normal tracking-wide text-white/90 group-hover/item:text-white">
                          {item.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section 2: Warranty Period */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <h4 className="text-white font-serif font-bold text-lg sm:text-xl tracking-wide whitespace-nowrap">
                      Warranty Period:
                    </h4>
                    <div className="h-[1px] flex-1 bg-gradient-to-r from-[#d4af37]/70 via-[#d4af37]/30 to-transparent"></div>
                  </div>

                  <div className="divide-y divide-[#e5c378]/15">
                    {warrantyPeriods.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between py-3 hover:bg-white/[0.06] px-2.5 rounded-lg transition-all duration-300 transform hover:translate-x-1.5 group/row">
                        <div className="flex items-center gap-3.5">
                          <div className="w-7 h-7 rounded-full border border-[#e5c378]/90 flex items-center justify-center text-[#e5c378] flex-shrink-0 bg-[#e5c378]/10 shadow-[0_0_6px_rgba(229,195,120,0.25)] transition-transform duration-300 group-hover/row:scale-110">
                            {item.renderIcon()}
                          </div>
                          <span className="text-[14px] sm:text-[15.5px] text-white/95 font-medium tracking-wide group-hover/row:text-[#fce2a1]">
                            {item.label}
                          </span>
                        </div>
                        <span className="text-[#fce2a1] font-serif font-bold text-base sm:text-lg tracking-wide drop-shadow-[0_1px_6px_rgba(252,226,161,0.35)] transition-transform duration-300 group-hover/row:scale-105">
                          {item.period}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mobile Bottom Button */}
                <div className="block lg:hidden pt-2">
                  <Link to="/about" className="block w-full">
                    <button className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-[#e7c371] via-[#f7dda0] to-[#d69f3d] text-[#2c1a04] font-serif font-bold text-[15px] sm:text-base flex items-center justify-center gap-2 shadow-[0_6px_22px_rgba(231,195,113,0.4)] hover:shadow-[0_8px_28px_rgba(231,195,113,0.6)] active:scale-[0.99] transition-all duration-300">
                      <span className="tracking-wide">View Full Warranty Terms</span>
                      <ChevronRight className="w-4.5 h-4.5 text-[#2c1a04] stroke-[2.5]" />
                    </button>
                  </Link>
                </div>

              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Elegant Curved Gold & Ruby Wave Divider at Bottom */}
      <div className="relative w-full overflow-hidden leading-none mt-20 -mb-28">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-12 md:h-16">
          <path d="M0,45 C300,95 600,10 900,65 C1050,90 1150,45 1200,52 L1200,120 L0,120 Z" fill="#660018" />
          <path d="M0,40 C300,90 600,5 900,60 C1050,85 1150,40 1200,47" fill="none" stroke="#D4AF37" strokeWidth="2.5" />
        </svg>
      </div>

    </section>
  );
};

export default WarrantySection;