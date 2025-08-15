import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import heroInterior1 from "../assets/3.png";
import hi from "../assets/55.png";
import img1 from "../assets/2.png";
import img2 from "../assets/5.png";
import ConsultationModal from '../Components/ConsultationModal';

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const images = [
    { src: heroInterior1, alt: "Modern living room design" },
    { src: hi, alt: "Elegant kitchen interior" },
    { src: img1, alt: "Interior design" },
    { src: img2, alt: "Stylish bedroom design" }
  ];

  // Auto slide every 5s
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  // Auto open modal after 4s
  useEffect(() => {
    const timer = setTimeout(() => setIsModalOpen(true), 4000);
    return () => clearTimeout(timer);
  }, []);

  const goToSlide = (index) => setCurrentSlide(index);
  const goToPrevSlide = () => setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
  const goToNextSlide = () => setCurrentSlide((prev) => (prev + 1) % images.length);

  // Responsive OfferBox
  const OfferBox = ({ bg }) => (
    <div
      className={`
        relative mx-auto mt-6
        sm:absolute sm:z-20 sm:left-1/2 sm:top-1/2 sm:transform sm:-translate-x-1/2 sm:-translate-y-1/2
        
        w-full max-w-[320px] sm:max-w-[350px] md:max-w-[400px]
        px-4 sm:px-6 py-6 sm:py-8
        rounded-xl sm:rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]
        ${bg} backdrop-blur-md sm:backdrop-blur-xl border border-yellow-400/20
        flex flex-col justify-center items-center animate-slidein
      `}
    >
      <div className="w-fit px-4 sm:px-6 py-1.5 sm:py-2 rounded-full bg-white/30 flex items-center gap-2 mb-2 shadow-inner border border-yellow-200/50">
        <span className="animate-pulse text-lg sm:text-xl text-yellow-500">✨</span>
        <span className="font-semibold text-blue-900 text-sm sm:text-lg">10% OFF</span>
      </div>
      <span className="mt-1 text-xs sm:text-base font-medium text-blue-800 text-center leading-snug drop-shadow">
        Full interiors work<br />
        <span className="font-normal text-gray-900 text-xs sm:text-base">
          except false ceiling and paneling
        </span>
      </span>
      <span className="mt-4 text-xs sm:text-sm md:text-base font-medium text-gray-900 text-center">
        Offer ends on{" "}
        <span className="text-red-600 font-bold animate-blink">15th August, 2025</span>
      </span>
    </div>
  );

  return (
    <section className="relative min-h-screen overflow-hidden bg-gray-900">
      {/* Background Carousel */}
      <div className="absolute inset-0">
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-70" : "opacity-0"
            }`}
          >
            <img src={image.src} alt={image.alt} className="w-full h-full object-cover" loading="lazy" />
          </div>
        ))}
      </div>
    
      {/* Carousel Controls */}
      <button
        onClick={goToPrevSlide}
        className="absolute left-2 sm:left-4 top-1/2 z-10 p-1 sm:p-2 rounded-full bg-black/50 text-white hover:bg-black/75 transition-all"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>
      <button
        onClick={goToNextSlide}
        className="absolute right-2 sm:right-4 top-1/2 z-10 p-1 sm:p-2 rounded-full bg-black/50 text-white hover:bg-black/75 transition-all"
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-4 sm:bottom-8 left-0 right-0 flex justify-center space-x-2 z-10">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all ${
              index === currentSlide ? "bg-yellow-400 sm:w-6" : "bg-white/50"
            }`}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[80vh]">
          {/* Left Side */}
          <div className="space-y-6 md:space-y-8 order-2 lg:order-1 mt-8 lg:mt-0 text-center lg:text-left">
            <div className="space-y-3 md:space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 sm:px-5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold text-yellow-300 border border-yellow-400 bg-yellow-200/10 backdrop-blur-sm shadow-inner shadow-yellow-400/30 ring-1 ring-yellow-500/30">
                <span className="animate-pulse">✨</span>
                Premium Interior Design Services
              </div>

              <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                Transform your{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-400">
                  space into Palace
                </span>
              </h1>

              <p className="text-sm sm:text-lg text-gray-200">
                Bringing a Cherished Life with Golden Moments
              </p>
            </div>

            {/* CTA Button */}
            <div className="flex justify-center lg:justify-start mt-6">
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-red-600 hover:bg-red-700 text-white px-5 sm:px-6 py-3 rounded-xl text-base sm:text-lg font-semibold shadow-lg transition-transform hover:scale-105"
              >
                Book a Free Consultation
              </button>
            </div>
          </div>

          {/* Offer Box - conditional per slide */}
          {currentSlide === 0 && <OfferBox bg="bg-gray-500/80" />}
          {currentSlide === 1 && <OfferBox bg="bg-gradient-to-br from-yellow-200/80 via-yellow-300/70 to-yellow-500/90" />}
          {currentSlide === 2 && <OfferBox bg="bg-gradient-to-br from-yellow-200/80 via-yellow-300/70 to-yellow-500/90" />}
          {currentSlide === 3 && <OfferBox bg="bg-gray-600/80" />}
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes slidein {
          0% { opacity: 0; transform: translateX(70px);}
          80% { opacity: 0.8; }
          100% { opacity: 1; transform: translateX(0);}
        }
        @keyframes blink {
          0%,100%{opacity:1}
          50%{opacity:0.5}
        }
        .animate-slidein{ animation:slidein .9s cubic-bezier(.43,.04,.49,.98) both; }
        .animate-blink{ animation:blink 1.3s linear infinite; }
        .animate-pulse{ animation:pulse 1.2s infinite; }
        @keyframes pulse {
          0% { opacity: 1;}
          50% {opacity: 0.6;}
          100% {opacity: 1;}
        }
      `}</style>

      {/* Modal */}
      <ConsultationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  );
};

export default HeroSection;