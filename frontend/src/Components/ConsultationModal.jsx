/*frontend/src/Components/ConsultationModal.jsx */
import React, { useState } from 'react';
import { 
  X, 
  User, 
  Phone, 
  MapPin, 
  Calendar, 
  ArrowRight, 
  Home, 
  Building2, 
  ShieldCheck, 
  Award, 
  IndianRupee, 
  Check, 
  ChevronDown 
} from 'lucide-react';
import logoImg from '../assets/cherry-gold-full-logo-transparent.png';
import modalDiningImg from '../assets/consultation-dining-room.jpg';

const ConsultationModal = ({
  isOpen,
  onClose,
  title = "Get a Free Design Consultation"
}) => {
  const [formData, setFormData] = useState({
    propertyType: '1 BHK',
    location: '',
    name: '',
    mobile: '',
    whatsappUpdates: true
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const propertyTypes = [
    { id: '1 BHK', label: '1 BHK', icon: Home },
    { id: '2 BHK', label: '2 BHK', icon: Building2 },
    { id: '3 BHK', label: '3 BHK', icon: Building2 },
    { id: '4+ BHK / Duplex', label: '4+ BHK / Duplex', icon: Home }
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.mobile) {
      alert('Please fill in your name and mobile number.');
      return;
    }
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 2500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 z-50 overflow-y-auto animate-fadeIn">
      
      {/* Modal Dialog Container */}
      <div 
        className="relative w-full max-w-xl md:max-w-4xl lg:max-w-5xl bg-[#FFFDF9] rounded-[28px] sm:rounded-[36px] overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.65)] border-2 border-[#D4AF37] my-auto flex flex-col md:flex-row max-h-[94vh]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* ========================================================= */}
        {/* LEFT COLUMN: Luxury Dining Interior & Ruby Trust Wave     */}
        {/* ========================================================= */}
        <div className="md:w-[38%] lg:w-[36%] relative hidden md:flex flex-col justify-between overflow-hidden bg-[#240107]">
          
          {/* Top Half: Luxury Dining Room Interior Photo */}
          <div className="relative h-[48%] w-full overflow-hidden shrink-0">
            <img 
              src={modalDiningImg} 
              alt="Luxury Dining Interior by Cherry Gold Interiors" 
              className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
            />
            {/* Subtle dark vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#240107] via-transparent to-black/30 pointer-events-none" />
          </div>

          {/* Bottom Half: Curved Ruby Wave with 3 Trust Badges */}
          <div 
            className="relative flex-1 p-6 lg:p-7 flex flex-col justify-center space-y-5"
            style={{
              background: 'linear-gradient(165deg, #4d0210 0%, #290108 50%, #150004 100%)'
            }}
          >
            {/* Gold Wave Partition Separator */}
            <div className="absolute -top-6 left-0 right-0 pointer-events-none overflow-hidden leading-none z-10">
              <svg viewBox="0 0 500 40" preserveAspectRatio="none" className="w-full h-6">
                <path d="M0,0 C150,35 350,5 500,25 L500,40 L0,40 Z" fill="#4d0210" />
                <path d="M0,0 C150,35 350,5 500,25" fill="none" stroke="#D4AF37" strokeWidth="2.5" />
              </svg>
            </div>

            {/* Badge 1: Expert Guidance */}
            <div className="flex items-center gap-3.5 relative z-10">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#800020] to-[#3a000d] border border-[#D4AF37]/60 flex items-center justify-center shrink-0 shadow-[0_2px_10px_rgba(0,0,0,0.5)] text-[#F5D580]">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-white text-sm font-bold tracking-wide">Expert Guidance</h4>
                <p className="text-[#E5C378]/90 text-[11px] leading-tight">Get advice from our experienced designers</p>
              </div>
            </div>

            {/* Divider */}
            <div className="h-[1px] bg-gradient-to-r from-[#D4AF37]/40 via-[#D4AF37]/10 to-transparent" />

            {/* Badge 2: 100% Confidential */}
            <div className="flex items-center gap-3.5 relative z-10">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#800020] to-[#3a000d] border border-[#D4AF37]/60 flex items-center justify-center shrink-0 shadow-[0_2px_10px_rgba(0,0,0,0.5)] text-[#F5D580]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-white text-sm font-bold tracking-wide">100% Confidential</h4>
                <p className="text-[#E5C378]/90 text-[11px] leading-tight">Your information is safe with us</p>
              </div>
            </div>

            {/* Divider */}
            <div className="h-[1px] bg-gradient-to-r from-[#D4AF37]/40 via-[#D4AF37]/10 to-transparent" />

            {/* Badge 3: Free Consultation */}
            <div className="flex items-center gap-3.5 relative z-10">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#800020] to-[#3a000d] border border-[#D4AF37]/60 flex items-center justify-center shrink-0 shadow-[0_2px_10px_rgba(0,0,0,0.5)] text-[#F5D580]">
                <IndianRupee className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-white text-sm font-bold tracking-wide">Free Consultation</h4>
                <p className="text-[#E5C378]/90 text-[11px] leading-tight">No hidden costs, just honest advice</p>
              </div>
            </div>

          </div>

        </div>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: Luxury Ivory Form                           */}
        {/* ========================================================= */}
        <div className="md:w-[62%] lg:w-[64%] p-5 sm:p-7 lg:p-9 relative bg-[#FFFDF9] flex flex-col justify-between overflow-y-auto">
          
          {/* Top Decorative Warm Sash Accent */}
          <div className="absolute top-0 right-0 w-48 sm:w-64 h-32 bg-gradient-to-bl from-[#F6E6CD]/50 via-[#FAF0DF]/30 to-transparent pointer-events-none rounded-bl-[100px]" />
          
          {/* Close Button */}
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-4 right-4 sm:top-5 sm:right-5 w-8 h-8 rounded-full bg-[#F3EADF] hover:bg-[#E8D8C3] text-gray-700 flex items-center justify-center transition-colors z-20 shadow-sm"
          >
            <X className="w-4 h-4" />
          </button>

          <div>
            {/* Header: Logo + Headline */}
            <div className="mb-5 sm:mb-6">
              <img 
                src={logoImg} 
                alt="Cherry Gold Interiors" 
                className="h-8 sm:h-9 w-auto object-contain mb-2"
              />
              <h2 className="text-2xl sm:text-[28px] lg:text-[32px] font-serif font-bold text-gray-950 leading-tight tracking-tight">
                Get a Free <br className="sm:hidden" />
                <span className="text-[#800020]">Design Consultation</span>
              </h2>
              <p className="text-gray-600 text-xs sm:text-[13px] font-normal leading-relaxed mt-1.5 max-w-lg">
                Tell us a few details and our design expert will get in touch with you to discuss your dream space.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-4.5">
              
              {/* STEP 1: Property Type */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#E5C378] text-[#3d2703] text-[11px] font-bold flex items-center justify-center shrink-0">
                      1
                    </span>
                    <label className="text-xs sm:text-sm font-serif font-bold text-gray-900">
                      Property Type
                    </label>
                  </div>
                  <span className="text-[11px] font-medium text-red-500">
                    Required
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  {propertyTypes.map((type) => {
                    const IconComponent = type.icon;
                    const isSelected = formData.propertyType === type.id;
                    return (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, propertyType: type.id }))}
                        className={`relative p-2.5 sm:p-3 rounded-xl border text-left flex items-center justify-between transition-all duration-200 ${
                          isSelected
                            ? 'border-[#800020] bg-[#FFF8EE] shadow-sm ring-1 ring-[#800020]/25'
                            : 'border-[#E5C378]/40 bg-white hover:border-[#D4AF37] hover:bg-[#FFFCF7]'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                            isSelected ? 'text-[#800020]' : 'text-[#8B734B]'
                          }`}>
                            <IconComponent className="w-4 h-4" />
                          </div>
                          <span className={`text-xs sm:text-sm font-medium ${
                            isSelected ? 'text-[#800020] font-bold' : 'text-gray-800'
                          }`}>
                            {type.label}
                          </span>
                        </div>

                        {isSelected && (
                          <div className="w-4 h-4 rounded-full bg-[#800020] text-white flex items-center justify-center shrink-0 shadow-xs">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* STEP 2: Property Location */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#E5C378] text-[#3d2703] text-[11px] font-bold flex items-center justify-center shrink-0">
                      2
                    </span>
                    <label className="text-xs sm:text-sm font-serif font-bold text-gray-900">
                      Property Location
                    </label>
                  </div>
                  <span className="text-[11px] font-medium text-red-500">
                    Required
                  </span>
                </div>

                <div className="relative">
                  <MapPin className="w-4 h-4 text-[#C49B30] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <select
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-10 pr-9 py-2.5 sm:py-3 rounded-xl border border-[#E5C378]/50 bg-white text-xs sm:text-sm text-gray-800 focus:outline-none focus:border-[#800020] focus:ring-1 focus:ring-[#800020] transition-all appearance-none cursor-pointer shadow-2xs"
                  >
                    <option value="">Select Location</option>
                    <option value="Delhi NCR">Delhi NCR</option>
                    <option value="Gurugram">Gurugram</option>
                    <option value="Noida">Noida</option>
                    <option value="Bengaluru">Bengaluru</option>
                    <option value="Mumbai">Mumbai</option>
                    <option value="Hyderabad">Hyderabad</option>
                    <option value="Pune">Pune</option>
                    <option value="Kolkata">Kolkata</option>
                    <option value="Jaipur">Jaipur</option>
                    <option value="Other">Other Location</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* STEP 3: Your Details */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#E5C378] text-[#3d2703] text-[11px] font-bold flex items-center justify-center shrink-0">
                      3
                    </span>
                    <label className="text-xs sm:text-sm font-serif font-bold text-gray-900">
                      Your Details
                    </label>
                  </div>
                  <span className="text-[11px] font-medium text-red-500">
                    Required
                  </span>
                </div>

                <div className="space-y-2.5">
                  {/* Name Input */}
                  <div className="relative">
                    <User className="w-4 h-4 text-[#8B734B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      placeholder="Your Name"
                      className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-xl border border-[#E5C378]/50 bg-white text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#800020] focus:ring-1 focus:ring-[#800020] transition-all shadow-2xs"
                    />
                  </div>

                  {/* Mobile Input with +91 Country Code Selector */}
                  <div className="flex rounded-xl border border-[#E5C378]/50 bg-white overflow-hidden shadow-2xs focus-within:border-[#800020] focus-within:ring-1 focus-within:ring-[#800020]">
                    <div className="flex items-center gap-1.5 pl-3 pr-2.5 bg-[#FAF4EA]/50 border-r border-[#E5C378]/40 text-xs sm:text-sm text-gray-700 select-none">
                      <Phone className="w-3.5 h-3.5 text-[#8B734B]" />
                      <span className="font-medium">+91</span>
                      <ChevronDown className="w-3 h-3 text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleInputChange}
                      required
                      placeholder="Mobile Number"
                      className="flex-1 px-3.5 py-2.5 sm:py-3 text-xs sm:text-sm text-gray-800 placeholder-gray-400 bg-transparent focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* WhatsApp Updates Checkbox */}
              <div className="pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none text-xs sm:text-[13px] text-gray-700">
                  <input
                    type="checkbox"
                    name="whatsappUpdates"
                    checked={formData.whatsappUpdates}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-[#800020] border-gray-300 rounded focus:ring-[#800020] accent-[#800020]"
                  />
                  <span>Yes, send me updates via WhatsApp</span>
                  {/* WhatsApp Icon */}
                  <svg viewBox="0 0 24 24" fill="#25D366" className="w-4 h-4 shrink-0">
                    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19.02L7.55 18.84L4.44 19.66L5.27 16.63L5.07 16.31C4.24 14.99 3.81 13.47 3.81 11.91C3.81 7.37 7.5 3.67 12.05 3.67M9.53 7.34C9.35 7.34 9.06 7.41 8.81 7.68C8.56 7.95 7.84 8.63 7.84 10.02C7.84 11.41 8.85 12.75 9 12.94C9.15 13.13 11.02 16.03 13.9 17.15C16.3 18.09 16.78 17.9 17.31 17.85C17.84 17.8 19.02 17.15 19.26 16.47C19.5 15.79 19.5 15.2 19.43 15.08C19.36 14.96 19.18 14.89 18.9 14.75C18.62 14.61 17.26 13.94 17 13.84C16.74 13.74 16.56 13.69 16.37 13.96C16.18 14.23 15.65 14.89 15.49 15.08C15.33 15.27 15.17 15.29 14.89 15.15C14.61 15.01 13.73 14.72 12.69 13.79C11.87 13.06 11.32 12.16 11.16 11.89C11 11.62 11.14 11.47 11.28 11.33C11.41 11.2 11.57 10.99 11.72 10.82C11.86 10.65 11.91 10.53 12 10.35C12.09 10.17 12.04 10.01 11.97 9.87C11.9 9.73 11.34 8.35 11.11 7.79C10.88 7.25 10.65 7.33 10.48 7.33C10.32 7.33 10.13 7.34 9.94 7.34H9.53Z" />
                  </svg>
                </label>
              </div>

              {/* Submit CTA Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 sm:py-4 px-6 rounded-full bg-gradient-to-r from-[#660018] via-[#8B0022] to-[#B31034] text-white font-serif font-bold text-sm sm:text-base flex items-center justify-between shadow-[0_8px_25px_rgba(128,0,32,0.4)] hover:shadow-[0_12px_32px_rgba(128,0,32,0.6)] hover:scale-[1.01] active:scale-98 transition-all duration-300 group"
                >
                  <div className="w-8 h-8 rounded-full border border-[#E5C378]/50 flex items-center justify-center bg-white/10 shrink-0">
                    <Calendar className="w-4 h-4 text-[#F5D580]" />
                  </div>
                  
                  <span className="tracking-wide">Book a Free Consultation</span>

                  <div className="w-8 h-8 rounded-full bg-[#E5C378] text-[#3d2703] flex items-center justify-center shrink-0 group-hover:translate-x-0.5 transition-transform">
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </div>
                </button>

                {isSubmitted && (
                  <div className="mt-3 p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-center text-xs font-medium">
                    ✓ Thank you! Your consultation request has been received. Our expert will call you shortly.
                  </div>
                )}
              </div>

              {/* Disclaimer */}
              <p className="text-center text-[11px] text-gray-500 pt-1">
                By submitting, you agree to our{' '}
                <a href="/privacy-policy" className="text-gray-700 underline hover:text-[#800020]">
                  privacy policy
                </a>{' '}
                &{' '}
                <a href="/terms" className="text-gray-700 underline hover:text-[#800020]">
                  terms
                </a>
              </p>

            </form>
          </div>

        </div>

      </div>

    </div>
  );
};

export default ConsultationModal;