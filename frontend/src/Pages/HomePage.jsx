/*frontend/src/Pages/HomePage.jsx */
import React from 'react';
import HeroSection from '../Components/HeroSection';
import HowWeWork from '../Components/HowWeWork';
import WarrantySection from '../Components/WarrantySection';
import TestimonialsSection from '../Components/TestimonialsSection';

const HomePage = () => {
  return (
    <div>
      <HeroSection />
      <HowWeWork />
      <WarrantySection />
      <TestimonialsSection />
    </div>
  );
};

export default HomePage;
