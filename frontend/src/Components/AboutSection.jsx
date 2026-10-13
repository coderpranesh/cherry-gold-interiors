/*frontend/src/Components/AboutSection.jsx */
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Palette, 
  Layers, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import aboutLivingRoom from '../assets/about-living-room.jpg';

const AboutSection = () => {
  const strengths = [
    {
      icon: Palette,
      title: "Personalized Design",
      description: "Spaces tailored to your needs and budget."
    },
    {
      icon: Layers,
      title: "Quality Materials",
      description: "Material options selected for your project."
    },
    {
      icon: CheckCircle2,
      title: "End-to-End Execution",
      description: "From planning through installation."
    },
    {
      icon: ShieldCheck,
      title: "Transparent Process",
      description: "Clear communication and project guidance."
    }
  ];

  return (
    <section className="py-20 lg:py-28 bg-[#FBF3E8] relative overflow-hidden">
      
      {/* Background Decorative Ambient Flares */}
      <div className="absolute top-1/4 -left-48 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -right-48 w-96 h-96 bg-[#800020]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Desktop 2-Column Luxury Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* ========================================================= */}
          {/* LEFT: Luxury Real Project Photograph Showcase             */}
          {/* ========================================================= */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-[28px] sm:rounded-[36px] overflow-hidden border-2 border-[#D4AF37]/60 shadow-[0_20px_60px_rgba(0,0,0,0.12),0_4px_20px_rgba(212,175,55,0.2)] group">
              
              <img 
                src={aboutLivingRoom} 
                alt="Luxury Arched Living Room by Cherry Gold Interiors" 
                className="w-full h-[360px] sm:h-[460px] lg:h-[520px] object-cover object-center transform group-hover:scale-105 transition-transform duration-700"
              />

              {/* Gradient Vignette at Bottom */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10 pointer-events-none" />

              {/* Verified Studio Tag in Corner */}
              <div className="absolute top-4 left-4 px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-[#D4AF37]/40 text-[#F5D580] text-xs font-semibold flex items-center gap-1.5 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-[#E5C378]" />
                <span>Cherry Gold Signature Living</span>
              </div>

              {/* Founded Trust Pill */}
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-[#FFFDF9]/95 backdrop-blur-md border border-[#E5C378]/50 shadow-lg flex items-center justify-between">
                <div>
                  <div className="text-[#800020] text-xs font-bold uppercase tracking-wider">Design Excellence</div>
                  <div className="text-gray-900 text-sm sm:text-base font-serif font-bold">Thoughtful Aesthetics & Lasting Quality</div>
                </div>
                <div className="w-10 h-10 rounded-full bg-[#800020] text-[#F5D580] flex items-center justify-center font-serif font-bold text-sm shrink-0 border border-[#D4AF37]/50 shadow-sm">
                  CG
                </div>
              </div>

            </div>
          </div>

          {/* ========================================================= */}
          {/* RIGHT: About Copy, 4 Key Strengths & CTA Button           */}
          {/* ========================================================= */}
          <div className="lg:col-span-6 space-y-6 sm:space-y-7">
            
            {/* Tag matching screenshot */}
            <div className="inline-flex items-center gap-2">
              <span className="w-8 h-[2px] bg-[#800020]" />
              <span className="text-xs sm:text-sm font-bold tracking-widest uppercase text-[#800020]">
                About Cherry Gold Interiors
              </span>
            </div>

            {/* Headline matching screenshot */}
            <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-serif font-bold text-gray-950 leading-[1.18] tracking-tight">
              We Create Spaces That <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#800020] via-[#A0112E] to-[#600018]">
                Feel Like Home.
              </span>
            </h2>

            {/* Story Paragraphs matching screenshot */}
            <div className="space-y-4 text-gray-700 text-sm sm:text-base leading-relaxed font-normal">
              <p>
                At Cherry Gold Interiors, we believe every home deserves thoughtful design, quality materials and a finish that reflects the people living in it.
              </p>
              <p>
                From modular kitchens and wardrobes to complete home interiors, we bring design, material selection and installation together under one roof.
              </p>
            </div>

            {/* Gold Divider Line */}
            <div className="h-[1.5px] w-full bg-gradient-to-r from-[#D4AF37]/80 via-[#E5C378]/40 to-transparent my-6" />

            {/* 4 Key Strengths Grid (2x2 on desktop/tablet) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-1">
              {strengths.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <div key={index} className="flex items-start gap-3.5 group">
                    <div className="w-10 h-10 rounded-xl bg-[#FFFDF9] border border-[#D4AF37]/50 flex items-center justify-center shrink-0 shadow-sm text-[#800020] group-hover:bg-[#800020] group-hover:text-[#F5D580] transition-colors duration-300">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-serif font-bold text-gray-900 mb-0.5">
                        {item.title}
                      </h4>
                      <p className="text-xs text-gray-600 leading-snug">
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Discover Our Story CTA Button */}
            <div className="pt-4">
              <Link to="/about">
                <button className="py-3.5 sm:py-4 px-8 rounded-full bg-gradient-to-r from-[#800020] via-[#9E122B] to-[#680016] text-white font-serif font-bold text-sm sm:text-base flex items-center justify-center gap-3 shadow-[0_8px_25px_rgba(128,0,32,0.4)] hover:shadow-[0_12px_32px_rgba(128,0,32,0.6)] hover:scale-105 active:scale-95 transition-all duration-300 group border border-[#D4AF37]/40">
                  <span className="tracking-wide">Discover Our Story</span>
                  <div className="w-6 h-6 rounded-full bg-white/15 flex items-center justify-center group-hover:bg-white group-hover:text-[#800020] transition-colors">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </button>
              </Link>
            </div>

          </div>

        </div>

      </div>

    </section>
  );
};

export default AboutSection;