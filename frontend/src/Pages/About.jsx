/*frontend/src/Pages/About.jsx */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  ArrowRight, 
  Award, 
  ShieldCheck, 
  Sparkles, 
  Heart, 
  Users, 
  Clock, 
  CheckCircle2, 
  Layers, 
  Target, 
  Compass, 
  ExternalLink,
  Instagram,
  Youtube,
  Star
} from 'lucide-react';
import ConsultationModal from '../Components/ConsultationModal';

// Images
import aboutHeroImg from '../assets/about-living-room.jpg';
import diningImg from '../assets/consultation-dining-room.jpg';
import emblemImg from '../assets/cherry-gold-emblem.png';

const About = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const pillars = [
    {
      icon: Layers,
      title: "End-to-End Execution",
      description: "From 3D space planning to in-house manufacturing and precision site installation, everything is managed under one roof with single-point accountability."
    },
    {
      icon: ShieldCheck,
      title: "Material Transparency",
      description: "Zero compromise on quality. We specify genuine BWP/BWR marine grade plywood, anti-bubble laminates, and German hardware brands with authentic batch codes."
    },
    {
      icon: Clock,
      title: "Guaranteed Timelines",
      description: "We work with fixed stage-wise completion schedules and transparent milestone tracking, ensuring on-time handover without unexpected delays."
    },
    {
      icon: Award,
      title: "Documented Written Warranty",
      description: "Up to 10 years warranty on modular kitchens and wardrobes with clear written terms, exclusions, and rapid post-installation support."
    }
  ];

  const milestones = [
    { number: "May 2025", label: "Founded in Kolkata", sub: "Built with fresh vision & integrity" },
    { number: "10+ Years", label: "Craftsmanship Heritage", sub: "Team's combined trade expertise" },
    { number: "4.9 / 5", label: "Client Satisfaction", sub: "Verified reviews across platforms" },
    { number: "100%", label: "Transparent Pricing", sub: "Itemized BOQ with zero hidden costs" }
  ];

  return (
    <div className="bg-[#FBF3E8] min-h-screen pt-24 lg:pt-28">
      
      {/* ========================================================= */}
      {/* 1. HERO STORY SECTION (Matches User Screenshot 4)         */}
      {/* ========================================================= */}
      <section className="relative py-12 lg:py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Top Breadcrumb & Tag */}
          <div className="flex items-center gap-2 mb-6">
            <span className="w-8 h-[2px] bg-[#800020]" />
            <span className="text-xs sm:text-sm font-bold tracking-widest uppercase text-[#800020]">
              Our Story
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            
            {/* Left Column: Headline, Philosophy & Dual Buttons */}
            <div className="lg:col-span-7 space-y-6 sm:space-y-7">
              
              <h1 className="text-3xl sm:text-5xl lg:text-[52px] font-serif font-bold text-gray-950 leading-[1.15] tracking-tight">
                Beautiful Spaces.<br />
                Thoughtful Design.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#800020] via-[#A0112E] to-[#600018]">
                  Lasting Value.
                </span>
              </h1>

              <div className="space-y-4 text-gray-700 text-base sm:text-lg leading-relaxed font-light">
                <p>
                  Cherry Gold Interiors provides interior design and end-to-end execution, from modular kitchens and wardrobes to complete home interiors.
                </p>
                <p>
                  Our focus is on combining thoughtful design, quality materials and personalized service to create spaces that feel like home.
                </p>
              </div>

              {/* Dual Action Buttons matching Screenshot 4 */}
              <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
                <Link to="/portfolio" className="w-full sm:w-auto">
                  <button className="w-full sm:w-auto py-4 px-8 rounded-full bg-gradient-to-r from-[#800020] via-[#9E122B] to-[#680016] text-white font-serif font-bold text-sm sm:text-base flex items-center justify-center gap-3 shadow-[0_8px_25px_rgba(128,0,32,0.4)] hover:shadow-[0_12px_32px_rgba(128,0,32,0.6)] hover:scale-105 active:scale-95 transition-all duration-300 group border border-[#D4AF37]/40">
                    <span className="tracking-wide">Explore Our Projects</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>

                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="w-full sm:w-auto py-4 px-8 rounded-full bg-[#FFFDF9] hover:bg-[#FFF5E6] border-2 border-[#D4AF37] text-[#800020] font-serif font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-sm transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  <Calendar className="w-4 h-4 text-[#800020]" />
                  <span>Book Consultation</span>
                </button>
              </div>

            </div>

            {/* Right Column: Hero Real Project Visual Frame */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-[32px] overflow-hidden border-2 border-[#D4AF37]/60 shadow-[0_20px_50px_rgba(0,0,0,0.15)] group">
                <img 
                  src={aboutHeroImg} 
                  alt="Cherry Gold Luxury Living Room Project" 
                  className="w-full h-[360px] sm:h-[440px] lg:h-[480px] object-cover object-center transform group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10 pointer-events-none" />

                {/* Floating Studio Emblem */}
                <div className="absolute top-4 right-4 p-2 rounded-2xl bg-[#FFFDF9]/90 backdrop-blur-md border border-[#E5C378]/50 shadow-md">
                  <img src={emblemImg} alt="Cherry Gold Emblem" className="w-8 h-8 object-contain" />
                </div>

                <div className="absolute bottom-4 left-4 right-4 p-3.5 rounded-xl bg-black/60 backdrop-blur-md border border-[#D4AF37]/40 text-white text-xs">
                  <span className="text-[#F5D580] font-semibold">Signature Craftsmanship:</span> Arched cove niche, fluted panelling & bespoke furniture
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* 2. FOUNDING STORY & HONEST OPERATING HISTORY               */}
      {/* ========================================================= */}
      <section className="py-16 lg:py-24 bg-[#FFFDF9] border-y border-[#E5C378]/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 relative">
              <div className="rounded-3xl overflow-hidden border-2 border-[#D4AF37]/50 shadow-xl">
                <img 
                  src={diningImg} 
                  alt="Cherry Gold Dining Room Project" 
                  className="w-full h-[380px] sm:h-[440px] object-cover object-center"
                />
              </div>

              {/* Trust Callout */}
              <div className="absolute -bottom-6 -right-4 sm:right-6 p-5 rounded-2xl bg-[#800020] text-white border border-[#D4AF37] shadow-xl max-w-xs">
                <div className="flex items-center gap-2 mb-1 text-[#F5D580] text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Honest Transparency</span>
                </div>
                <p className="text-xs text-gray-200 leading-snug">
                  Founded May 2025, driven by 10+ years cumulative architectural & master carpentry experience.
                </p>
              </div>
            </div>

            <div className="lg:col-span-6 space-y-6">
              
              <div className="inline-flex items-center gap-2">
                <span className="w-8 h-[2px] bg-[#800020]" />
                <span className="text-xs sm:text-sm font-bold tracking-widest uppercase text-[#800020]">
                  Why We Founded Cherry Gold
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-gray-950 leading-tight">
                Solving the Hardest Problem in Home Interiors.
              </h2>

              <div className="space-y-4 text-gray-700 text-sm sm:text-base leading-relaxed">
                <p>
                  For years, homeowners faced a frustrating dilemma: choosing between unorganized local carpenters with unpredictable timelines, or overpriced corporate aggregators who deliver cookie-cutter templates with zero personal care.
                </p>
                <p>
                  <strong className="text-gray-900 font-semibold">Founded in May 2025 in Kolkata</strong>, Cherry Gold Interiors was created to bridge this exact gap. While our company was formally established in 2025, our lead architects, production managers, and master artisans bring over <strong className="text-[#800020] font-semibold">a decade of hands-on interior craftsmanship</strong> to every site.
                </p>
                <p>
                  We bring design creativity, factory-precision manufacturing, and on-site execution together so you get bespoke luxury at honest factory-direct pricing.
                </p>
              </div>

              {/* Tagline Box */}
              <div className="p-4 rounded-xl bg-[#FFF8EE] border-l-4 border-[#800020] text-[#800020] text-sm font-serif font-bold italic">
                “Bringing a Cherished Life with Golden Moments.”
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* 3. ACHIEVEMENTS & MILESTONES NUMBERS                      */}
      {/* ========================================================= */}
      <section className="py-16 bg-[#FBF3E8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 sm:gap-6">
            {milestones.map((item, index) => (
              <div 
                key={index}
                className="p-6 sm:p-7 rounded-2xl bg-[#FFFDF9] border border-[#E5C378]/50 shadow-sm text-center hover:border-[#D4AF37] hover:shadow-md transition-all duration-300"
              >
                <div className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#800020] mb-1">
                  {item.number}
                </div>
                <div className="text-sm font-bold text-gray-900 mb-0.5">
                  {item.label}
                </div>
                <div className="text-xs text-gray-500">
                  {item.sub}
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* 4. WHAT MAKES US DIFFERENT (Our 4 Pillars)                */}
      {/* ========================================================= */}
      <section className="py-20 lg:py-24 bg-[#FFFDF9] border-t border-[#E5C378]/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs sm:text-sm font-bold tracking-widest uppercase text-[#800020]">
              Our Core Strengths
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-serif font-bold text-gray-950 mt-2 mb-4">
              What Makes Cherry Gold Different
            </h2>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              We replace guesswork and broken promises with structured design methodology, certified materials, and verified warranties.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {pillars.map((pillar, index) => {
              const IconComp = pillar.icon;
              return (
                <div 
                  key={index}
                  className="p-7 rounded-2xl bg-[#FBF3E8] border border-[#E5C378]/40 hover:border-[#D4AF37] hover:bg-white hover:shadow-xl transition-all duration-300 group flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-[#FFFDF9] border border-[#D4AF37]/50 flex items-center justify-center text-[#800020] group-hover:bg-[#800020] group-hover:text-[#F5D580] transition-colors mb-5 shadow-sm">
                      <IconComp className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-serif font-bold text-gray-950 mb-2.5">
                      {pillar.title}
                    </h3>
                    <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* 5. FUTURE VISION & CHERRYVISION AI                        */}
      {/* ========================================================= */}
      <section className="py-20 bg-gradient-to-br from-[#1A0206] via-[#2F030B] to-[#0A0103] text-white relative overflow-hidden">
        
        {/* Gold curved accent */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#800020]/70 border border-[#D4AF37]/50 text-[#F5D580] text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Our Future Vision</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold leading-tight">
                Pioneering the Next Era of <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FCE2A1] via-[#E5C378] to-[#C99636]">
                  AI-Powered Interior Design
                </span>
              </h2>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed max-w-2xl font-light">
                We are actively integrating our proprietary <strong className="text-[#F5D580] font-medium">CherryVision AI</strong> platform, empowering clients to upload floor plans and see photorealistic interior transformations before site work even begins.
              </p>
            </div>

            <div className="lg:col-span-4 flex justify-start lg:justify-end">
              <button 
                onClick={() => setIsModalOpen(true)}
                className="py-4 px-8 rounded-full bg-gradient-to-r from-[#e7c371] via-[#f7dda0] to-[#d69f3d] text-[#2c1a04] font-serif font-bold text-sm sm:text-base flex items-center gap-2.5 shadow-[0_6px_25px_rgba(231,195,113,0.4)] hover:scale-105 active:scale-95 transition-all"
              >
                <span>Schedule a Walkthrough</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 6. CONNECT WITH US (Matches User Screenshot 4)            */}
      {/* ========================================================= */}
      <section className="py-20 bg-[#FBF3E8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-gray-950">
              Connect with us
            </h2>
            <p className="text-gray-600 text-xs sm:text-sm mt-1">
              Explore real site transformations, client reviews, and behind-the-scenes reels.
            </p>
          </div>

          {/* 3 Social / Proof Cards matching Screenshot 4 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            
            {/* 1. Instagram */}
            <a 
              href="https://instagram.com/cherrygoldinteriors?mdxt=bDNsd216ZDMzbmVs" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-7 rounded-2xl bg-[#FFFDF9] border border-[#E5C378]/50 shadow-sm hover:shadow-xl hover:border-[#800020] transition-all duration-300 text-center flex flex-col justify-between group"
            >
              <div>
                <div className="w-14 h-14 rounded-2xl bg-[#FFF0F3] border border-[#800020]/20 flex items-center justify-center text-[#800020] mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Instagram className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-serif font-bold text-gray-900 mb-1">
                  Instagram
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed mb-6">
                  Design inspiration, reels and project updates
                </p>
              </div>

              <div className="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-[#800020] group-hover:underline">
                <span>Follow Us</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </div>
            </a>

            {/* 2. YouTube */}
            <a 
              href="https://youtube.com/@cherrygoldinteriors?si=YJx1kZxQ-Se7cAbh" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-7 rounded-2xl bg-[#FFFDF9] border border-[#E5C378]/50 shadow-sm hover:shadow-xl hover:border-[#800020] transition-all duration-300 text-center flex flex-col justify-between group"
            >
              <div>
                <div className="w-14 h-14 rounded-2xl bg-[#FFF0F0] border border-red-200 flex items-center justify-center text-red-600 mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Youtube className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-serif font-bold text-gray-900 mb-1">
                  YouTube
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed mb-6">
                  Room tours, transformations and design videos
                </p>
              </div>

              <div className="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-[#800020] group-hover:underline">
                <span>Watch Videos</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </div>
            </a>

            {/* 3. Reviews */}
            <Link 
              to="/#testimonials"
              className="p-7 rounded-2xl bg-[#FFFDF9] border border-[#E5C378]/50 shadow-sm hover:shadow-xl hover:border-[#800020] transition-all duration-300 text-center flex flex-col justify-between group"
            >
              <div>
                <div className="w-14 h-14 rounded-2xl bg-[#FFF9E6] border border-amber-300 flex items-center justify-center text-amber-600 mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Star className="w-7 h-7 fill-amber-500 text-amber-500" />
                </div>
                <h3 className="text-lg font-serif font-bold text-gray-900 mb-1">
                  Reviews
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed mb-6">
                  Customer feedback and project experiences
                </p>
              </div>

              <div className="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-[#800020] group-hover:underline">
                <span>Read Reviews</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </div>
            </Link>

          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* 7. BOTTOM CONSULTATION BANNER                             */}
      {/* ========================================================= */}
      <section className="py-16 bg-[#FFFDF9] border-t border-[#E5C378]/40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-gray-950">
            Let's Design a Home You'll Love Coming Back To.
          </h2>
          <p className="text-gray-600 text-sm sm:text-base max-w-xl mx-auto">
            Schedule your free consultation with our senior designers. Explore bespoke layouts, materials, and itemized quotations tailored to your budget.
          </p>
          <div className="pt-2">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="py-4 px-10 rounded-full bg-gradient-to-r from-[#800020] via-[#9E122B] to-[#680016] text-white font-serif font-bold text-base sm:text-lg inline-flex items-center justify-center gap-3 shadow-[0_8px_30px_rgba(128,0,32,0.45)] hover:scale-105 active:scale-95 transition-all border border-[#D4AF37]/50"
            >
              <Calendar className="w-5 h-5 text-[#F5D580]" />
              <span>Book Your Free Consultation</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Consultation Modal */}
      <ConsultationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />

    </div>
  );
};

export default About;
