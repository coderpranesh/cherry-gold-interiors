/*frontend/src/Pages/HomePage.jsx */
import React from 'react';
import HeroSection from '../Components/HeroSection';
import AboutSection from '../Components/AboutSection';
import HowWeWork from '../Components/HowWeWork';
import WarrantySection from '../Components/WarrantySection';
import TestimonialsSection from '../Components/TestimonialsSection';

const HomePage = () => {
  return (
    <div className="bg-[#FBF3E8]">
      <HeroSection />
      <AboutSection />
      <HowWeWork />
      <WarrantySection />
      <TestimonialsSection />
    </div>
  );
};

export default HomePage;
