/*frontend/src/Components/HeroSection.jsx */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  ArrowRight, 
  Star, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  ChevronLeft, 
  ChevronRight,
  Award
} from 'lucide-react';
import ConsultationModal from '../Components/ConsultationModal';

// High-resolution photography assets
import heroLivingRoom from '../assets/cta-living-room.jpg';
import heroDiningRoom from '../assets/consultation-dining-room.jpg';
import heroSlide1 from '../assets/3.png';
import heroSlide2 from '../assets/55.png';
import emblemImg from '../assets/cherry-gold-emblem.png';

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const heroSlides = [
    {
      image: heroLivingRoom,
      title: "Luxury Living Spaces",
      tag: "Living Rooms & TV Units"
    },
    {
      image: heroDiningRoom,
      title: "Designer Dining & Kitchens",
      tag: "Modular Kitchens & Dining"
    },
    {
      image: heroSlide1,
      title: "Contemporary Interiors",
      tag: "Complete Home Interiors"
    },
    {
      image: heroSlide2,
      title: "Master Bedroom Suites",
      tag: "Wardrobes & Bedrooms"
    }
  ];

  // Auto slide every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);

  return (
    <section className="relative min-h-[92vh] lg:min-h-screen flex items-center overflow-hidden bg-[#0A0204]">
      
      {/* ========================================================= */}
      {/* 1. CINEMATIC BACKGROUND SLIDER                            */}
      {/* ========================================================= */}
      <div className="absolute inset-0 z-0">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? "opacity-100 scale-100" : "opacity-0 scale-105 pointer-events-none"
            }`}
            style={{ transition: 'opacity 1.2s ease-in-out, transform 7s ease-out' }}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover object-center"
            />
          </div>
        ))}

        {/* Master Luxury Dark Vignette Overlay: Deep Charcoal & Midnight Ruby */}
        <div 
          className="absolute inset-0 z-10"
          style={{
            background: 'linear-gradient(90deg, rgba(8,1,3,0.95) 0%, rgba(15,2,6,0.88) 45%, rgba(10,1,4,0.65) 100%)'
          }}
        />

        {/* Bottom Wave to blend seamlessly into #FBF3E8 homepage background */}
        <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none overflow-hidden leading-none">
          <svg viewBox="0 0 1200 40" preserveAspectRatio="none" className="w-full h-6 sm:h-8">
            <path d="M0,40 L1200,40 L1200,15 C900,35 600,0 300,25 L0,15 Z" fill="#FBF3E8" />
          </svg>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. HERO CONTENT CONTAINER (Desktop-First 12-Column Grid)   */}
      {/* ========================================================= */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-24 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* ------------------------------------------------------- */}
          {/* LEFT COLUMN: Headline, Story, CTAs & Trust Line         */}
          {/* ------------------------------------------------------- */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-6 sm:space-y-7">
            
            {/* Top Studio Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-gradient-to-r from-[#3D030F]/90 to-[#1F0107]/90 border border-[#D4AF37]/50 shadow-[0_4px_16px_rgba(212,175,55,0.2)] backdrop-blur-md">
              <img 
                src={emblemImg} 
                alt="Cherry Gold 3D Emblem" 
                className="w-5 h-5 object-contain"
              />
              <span className="text-xs sm:text-sm font-semibold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-[#FCE2A1] via-[#E5C378] to-[#C99636]">
                Kolkata's Premier Luxury Interior Studio
              </span>
            </div>

            {/* Suggested Headline: “Your Space. Your Story. Beautifully Designed.” */}
            <h1 className="text-3xl sm:text-5xl lg:text-5xl xl:text-6xl font-serif font-bold text-white leading-[1.14] tracking-tight">
              Your Space. Your Story.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FCE2A1] via-[#E5C378] to-[#C99636]">
                Beautifully Designed.
              </span>
            </h1>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg lg:text-xl text-gray-200/95 font-light leading-relaxed max-w-xl mx-auto lg:mx-0">
              Premium interior design and end-to-end execution, thoughtfully tailored to your lifestyle and budget.
            </p>

            {/* Primary & Secondary Dual CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              
              {/* Primary CTA: Book Free Consultation */}
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full sm:w-auto py-4 px-8 rounded-full bg-gradient-to-r from-[#800020] via-[#9E122B] to-[#680016] text-white font-serif font-bold text-base sm:text-lg flex items-center justify-center gap-3 shadow-[0_8px_30px_rgba(128,0,32,0.5)] hover:shadow-[0_12px_38px_rgba(128,0,32,0.7)] hover:scale-105 active:scale-95 transition-all duration-300 group border border-[#D4AF37]/40"
              >
                <Calendar className="w-5 h-5 text-[#F5D580]" />
                <span className="tracking-wide">Book Free Consultation</span>
                <div className="w-6 h-6 rounded-full bg-white/15 flex items-center justify-center group-hover:bg-white group-hover:text-[#800020] transition-colors">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </button>

              {/* Secondary CTA: Explore Our Projects */}
              <Link to="/portfolio" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto py-4 px-8 rounded-full bg-white/10 hover:bg-white/20 border border-[#E5C378]/60 text-[#F5D580] hover:text-white font-serif font-semibold text-base sm:text-lg flex items-center justify-center gap-2.5 backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_4px_16px_rgba(0,0,0,0.3)] group">
                  <span>Explore Our Projects</span>
                  <ArrowRight className="w-4 h-4 text-[#E5C378] group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>

            </div>

            {/* Small Trust Line: “Design • Manufacturing • Installation” */}
            <div className="pt-3">
              <div className="inline-flex items-center gap-3 sm:gap-4 px-4 py-2 rounded-xl bg-black/40 border border-[#E5C378]/25 backdrop-blur-sm text-xs sm:text-sm font-medium tracking-widest uppercase text-[#E5C378]">
                <span className="text-gray-100">Design</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] shadow-[0_0_6px_#D4AF37]" />
                <span className="text-gray-100">Manufacturing</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] shadow-[0_0_6px_#D4AF37]" />
                <span className="text-gray-100">Installation</span>
              </div>
            </div>

          </div>

          {/* ------------------------------------------------------- */}
          {/* RIGHT COLUMN: Desktop Executive Visual & Glass Badges   */}
          {/* ------------------------------------------------------- */}
          <div className="lg:col-span-5 relative mt-6 lg:mt-0">
            
            {/* Master Luxury Frame Container */}
            <div className="relative rounded-3xl p-2.5 sm:p-3 bg-gradient-to-br from-[#D4AF37]/50 via-[#800020]/30 to-[#D4AF37]/20 shadow-[0_25px_60px_rgba(0,0,0,0.7)] backdrop-blur-lg">
              
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3] sm:aspect-[16/11] bg-black/60">
                <img 
                  src={heroSlides[currentSlide].image} 
                  alt={heroSlides[currentSlide].title}
                  className="w-full h-full object-cover object-center transition-all duration-700" 
                />

                {/* Subtle dark gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

                {/* Slide Caption Banner */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between z-10">
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[#E5C378] bg-black/60 px-2.5 py-0.5 rounded-full border border-[#D4AF37]/40">
                      {heroSlides[currentSlide].tag}
                    </span>
                    <h3 className="text-lg font-serif font-bold text-white mt-1 drop-shadow">
                      {heroSlides[currentSlide].title}
                    </h3>
                  </div>

                  {/* Manual Arrow Controls */}
                  <div className="flex items-center gap-1.5">
                    <button 
                      onClick={prevSlide}
                      aria-label="Previous slide"
                      className="w-8 h-8 rounded-full bg-black/60 hover:bg-[#800020] text-white border border-[#D4AF37]/50 flex items-center justify-center transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={nextSlide}
                      aria-label="Next slide"
                      className="w-8 h-8 rounded-full bg-black/60 hover:bg-[#800020] text-white border border-[#D4AF37]/50 flex items-center justify-center transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>

              {/* Floating Badge 1: Top Right - 4.9 Rating & 1000+ Homes */}
              <div className="absolute -top-4 -right-3 sm:-right-4 px-3.5 py-2.5 rounded-2xl bg-gradient-to-br from-[#1C0308]/95 to-[#0A0103]/95 border border-[#D4AF37]/60 shadow-[0_10px_30px_rgba(0,0,0,0.6)] backdrop-blur-md flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37] flex items-center justify-center text-[#F5D580] shrink-0">
                  <Star className="w-4 h-4 fill-[#D4AF37] text-[#D4AF37]" />
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <span className="text-white text-xs font-bold">4.9 / 5</span>
                    <span className="text-amber-400 text-[10px]">★★★★★</span>
                  </div>
                  <div className="text-[#E5C378] text-[10px]">1000+ Homes Designed</div>
                </div>
              </div>

              {/* Floating Badge 2: Bottom Left - 10-Year Warranty */}
              <div className="absolute -bottom-5 -left-3 sm:-left-4 px-3.5 py-2.5 rounded-2xl bg-gradient-to-br from-[#1C0308]/95 to-[#0A0103]/95 border border-[#D4AF37]/60 shadow-[0_10px_30px_rgba(0,0,0,0.6)] backdrop-blur-md flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#800020] border border-[#D4AF37] flex items-center justify-center text-[#F5D580] shrink-0">
                  <ShieldCheck className="w-4 h-4 text-[#F5D580]" />
                </div>
                <div>
                  <div className="text-white text-xs font-bold">Up to 10-Year Warranty</div>
                  <div className="text-[#E5C378] text-[10px]">Written Policy Guaranteed</div>
                </div>
              </div>

            </div>

            {/* Carousel Slider Dot Indicators */}
            <div className="flex justify-center items-center gap-2 mt-7">
              {heroSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  aria-label={`Go to slide ${index + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentSlide 
                      ? 'w-7 bg-gradient-to-r from-[#D4AF37] to-[#F5D580] shadow-[0_0_8px_#D4AF37]' 
                      : 'w-2 bg-white/30 hover:bg-white/60'
                  }`}
                />
              ))}
            </div>

          </div>

        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. MODAL INTEGRATION                                      */}
      {/* ========================================================= */}
      <ConsultationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

    </section>
  );
};

export default HeroSection;