// frontend/src/Pages/Services.jsx
import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Monitor, 
  Wrench, 
  Phone, 
  MessageCircle, 
  Loader2, 
  Calendar, 
  Clock, 
  MapPin, 
  Mail, 
  User, 
  ShieldCheck, 
  CheckCircle2, 
  Copy, 
  Check, 
  Sparkles, 
  ArrowRight, 
  Award, 
  Compass, 
  Search,
  IndianRupee,
  Users,
  Building2,
  FileText
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import heroLivingImg from '../assets/cta-living-room.jpg';

const Services = () => {
  const navigate = useNavigate();
  const [activeService, setActiveService] = useState('onsite'); // default to in-home/onsite consultation matching reference
  const [formData, setFormData] = useState({
    service_type: 'onsite',
    full_name: '',
    phone_number: '',
    email: '',
    issue_description: '',
    preferred_date: '',
    preferred_time: '',
    complete_address: '',
    city: 'Kolkata',
    project_type: 'kitchen',
    project_details: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const [serviceNumber, setServiceNumber] = useState('');
  const [copiedNumber, setCopiedNumber] = useState(false);
  const [lookupServiceNo, setLookupServiceNo] = useState('');

  // Service Number Preview generator (Kept per strict instruction)
  const generateServiceNumberPreview = () => {
    const now = new Date();
    const year = now.getFullYear().toString().slice(-2);
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    return `CG${year}${month}XXXX`;
  };

  const [serviceNumberPreview] = useState(generateServiceNumberPreview());

  const serviceOptions = [
    {
      id: 'onsite',
      icon: Home,
      title: 'In-Home Consultation',
      badge: 'Most Popular',
      description: 'Our experts visit your space, take measurements and discuss your needs.'
    },
    {
      id: 'video',
      icon: Monitor,
      title: 'Online Consultation',
      badge: 'Fast & Easy',
      description: 'Discuss your requirements via video call from the comfort of your home.'
    },
    {
      id: 'repair',
      icon: Wrench,
      title: 'Repair & Care Service',
      badge: 'Quick Response',
      description: 'Fast maintenance and hardware adjustments for existing interior fixtures.'
    }
  ];

  const cityOptions = [
    { value: 'Kolkata', label: 'Kolkata' },
    { value: 'Mumbai', label: 'Mumbai' },
    { value: 'Pune', label: 'Pune' },
    { value: 'Ranchi', label: 'Ranchi' },
    { value: 'Hyderabad', label: 'Hyderabad' },
    { value: 'Bengaluru', label: 'Bengaluru' },
    { value: 'Delhi NCR', label: 'Delhi NCR' },
    { value: 'Other', label: 'Other Cities' }
  ];

  const timeSlots = [
    { value: '10:00', label: 'Morning 10:00 AM' },
    { value: '11:00', label: 'Morning 11:00 AM' },
    { value: '12:00', label: 'Afternoon 12:00 PM' },
    { value: '14:00', label: 'Afternoon 2:00 PM' },
    { value: '15:00', label: 'Evening 3:00 PM' },
    { value: '16:00', label: 'Evening 4:00 PM' },
    { value: 'evening', label: 'Evening Slot (4 PM - 7 PM)' }
  ];

  const projectTypes = [
    { value: 'kitchen', label: 'Modular Kitchen' },
    { value: 'wardrobe', label: 'Luxury Wardrobe' },
    { value: 'living-room', label: 'Living & Dining Room' },
    { value: 'bedroom', label: 'Master Bedroom' },
    { value: 'complete-home', label: 'Complete Home Interior' },
    { value: 'office', label: 'Bespoke Office / Commercial' }
  ];

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      service_type: activeService,
      issue_description: '',
      project_details: ''
    }));
    setSubmitSuccess(false);
    setSubmitError('');
    setValidationErrors({});
  }, [activeService]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const formattedValue = name === 'preferred_date' && value 
      ? new Date(value).toISOString().split('T')[0]
      : value;

    setFormData(prev => ({
      ...prev,
      [name]: formattedValue
    }));

    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.full_name?.trim()) errors.full_name = 'Full name is required';
    if (!formData.phone_number?.trim()) {
      errors.phone_number = 'Phone number is required';
    } else if (!/^\+?[0-9]{10,15}$/.test(formData.phone_number.replace(/\s+/g, ''))) {
      errors.phone_number = 'Enter a valid 10-15 digit phone number';
    }

    if (activeService === 'video') {
      if (!formData.email?.trim()) {
        errors.email = 'Email address is required for video links';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        errors.email = 'Enter a valid email address';
      }
    }

    if (activeService === 'onsite') {
      if (!formData.complete_address?.trim()) {
        errors.complete_address = 'Site address is required for in-home visit';
      }
    }

    if (activeService === 'repair') {
      if (!formData.issue_description?.trim()) {
        errors.issue_description = 'Please describe the repair issue';
      }
    }

    if (formData.preferred_date) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const selected = new Date(formData.preferred_date);
      if (selected < today) {
        errors.preferred_date = 'Preferred date cannot be in the past';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const submissionData = {
        ...formData,
        service_type: activeService,
        complete_address: formData.complete_address ? `${formData.complete_address}, ${formData.city}` : formData.city,
        preferred_date: formData.preferred_date || null,
        preferred_time: formData.preferred_time || '10:00'
      };

      const response = await axios.post(
        '/api/services/requests/',
        submissionData,
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      if (response.status === 201) {
        setSubmitSuccess(true);
        setServiceNumber(response.data.service_number || `CG${new Date().getFullYear().toString().slice(-2)}SR${Math.floor(1000 + Math.random() * 9000)}`);
      }
    } catch (error) {
      console.error('Submission error:', error.response?.data || error.message);
      if (error.response?.data) {
        if (typeof error.response.data === 'object') {
          setValidationErrors(error.response.data);
          setSubmitError('Please verify the highlighted fields.');
        } else {
          setSubmitError(error.response.data.detail || 'Failed to submit. Please try again.');
        }
      } else {
        setSubmitError('Network connectivity error. Please try again or reach our hotline.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyServiceNumber = () => {
    if (!serviceNumber) return;
    navigator.clipboard.writeText(serviceNumber);
    setCopiedNumber(true);
    setTimeout(() => setCopiedNumber(false), 2500);
  };

  const handleLookupRedirect = (e) => {
    e.preventDefault();
    if (!lookupServiceNo.trim()) return;
    navigate(`/track-project?serviceNo=${encodeURIComponent(lookupServiceNo.trim())}`);
  };

  return (
    <div className="min-h-screen bg-[#FBF3E8] pt-24 pb-20 font-sans text-gray-800">
      
      {/* ================= HERO BANNER SECTION (MATCHING REFERENCE EXACTLY) ================= */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1E090C] via-[#2F0D14] to-[#140407] text-white pt-12 pb-24 sm:pb-32 px-4 sm:px-6 lg:px-8 border-b border-[#D4AF37]/30">
        
        {/* Ambient Gold & Crimson Halos */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#D4AF37]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-10 w-96 h-96 bg-[#C0142B]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -right-20 top-1/2 w-80 h-80 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Col: Hero Copy & Trust Badges */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Crown Tag */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-semibold uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>CHERRY GOLD CONCIERGE &amp; SERVICES</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-white tracking-tight leading-[1.15]">
                Ready to <br />
                <span className="bg-gradient-to-r from-[#F3E5AB] via-[#D4AF37] to-[#F3E5AB] bg-clip-text text-transparent">
                  Get Started?
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-gray-300 max-w-xl font-light leading-relaxed">
                Let&apos;s transform your space with our proven 5-step process. 
                Book your free consultation today!
              </p>

              {/* 3 Pill Badges (Exact from Reference) */}
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#C0142B] to-[#E52D45] flex items-center justify-center text-white shadow-md border border-[#D4AF37]/30">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <span className="block text-xs font-serif font-bold text-white tracking-wide">Free</span>
                    <span className="block text-[11px] text-[#F3E5AB]">Consultation</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#C0142B] to-[#E52D45] flex items-center justify-center text-white shadow-md border border-[#D4AF37]/30">
                    <Compass className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <span className="block text-xs font-serif font-bold text-white tracking-wide">Expert</span>
                    <span className="block text-[11px] text-[#F3E5AB]">Guidance</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#C0142B] to-[#E52D45] flex items-center justify-center text-white shadow-md border border-[#D4AF37]/30">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <span className="block text-xs font-serif font-bold text-white tracking-wide">No</span>
                    <span className="block text-[11px] text-[#F3E5AB]">Obligation</span>
                  </div>
                </div>
              </div>

              {/* Quick Service Number Lookup Chip */}
              <div className="pt-2">
                <form 
                  onSubmit={handleLookupRedirect}
                  className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md p-1.5 pl-3.5 rounded-2xl border border-[#D4AF37]/30 max-w-md w-full"
                >
                  <Search className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <input
                    type="text"
                    placeholder="Already have a Service Number? (e.g. CG26101048)"
                    value={lookupServiceNo}
                    onChange={(e) => setLookupServiceNo(e.target.value)}
                    className="bg-transparent border-none text-xs sm:text-sm text-white placeholder-gray-400 focus:outline-none flex-1 font-mono"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 bg-[#D4AF37] hover:bg-[#c29e2e] text-[#1E090C] rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
                  >
                    Track
                  </button>
                </form>
              </div>

            </div>

            {/* Right Col: High-Res Luxury Living Room Render Image */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden border-2 border-[#D4AF37]/40 shadow-[0_20px_50px_rgba(0,0,0,0.6)] group">
                <img 
                  src={heroLivingImg} 
                  alt="Luxury Interior Living Room" 
                  className="w-full h-[320px] sm:h-[380px] lg:h-[420px] object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1E090C]/80 via-transparent to-transparent pointer-events-none" />
                
                {/* Floating Architectural Badge */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md p-3.5 rounded-2xl border border-[#D4AF37]/50 shadow-xl flex items-center justify-between text-[#1E090C]">
                  <div className="flex items-center gap-2.5">
                    <Award className="w-5 h-5 text-[#C0142B]" />
                    <div>
                      <div className="text-xs font-serif font-bold">100% Bespoke Execution</div>
                      <div className="text-[11px] text-gray-600">IS 710 BWP Carcass • 20-Yr Warranty</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-full bg-[#1E090C] text-[#D4AF37]">
                    Kolkata &amp; PAN India
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Decorative Wave Arch Transition */}
        <div className="absolute bottom-0 left-0 right-0 h-10 bg-[#FBF3E8] rounded-t-[40px] pointer-events-none" />
      </section>

      {/* ================= MAIN BOOKING CARD CONTAINER ================= */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 relative -mt-8 z-20 mb-20">
        
        <div className="bg-[#FFFDF9] rounded-3xl border border-[#E8DACB] shadow-2xl p-6 sm:p-10 relative overflow-hidden">
          
          {/* Subtle Top Gold Accent Line */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#C0142B] via-[#D4AF37] to-[#C0142B]" />

          {/* Form Card Header */}
          <div className="flex items-start gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#9E7B15] shrink-0 shadow-sm">
              <Calendar className="w-6 h-6 text-[#9E7B15]" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1E090C] tracking-tight">
                Book Your Free Consultation
              </h2>
              <p className="text-xs sm:text-sm text-[#6A5A52] mt-1 leading-relaxed">
                Choose your preferred consultation type and share a few details. 
                Our team will get in touch to confirm your appointment.
              </p>
            </div>
          </div>

          {/* ================= CONSULTATION TYPE SELECTOR (3 CARDS) ================= */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {serviceOptions.map((opt) => {
              const IconComp = opt.icon;
              const isSelected = activeService === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setActiveService(opt.id)}
                  className={`relative p-5 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between group ${
                    isSelected
                      ? 'bg-gradient-to-b from-[#FFF9F0] to-[#FFF3E3] border-[#C0142B] ring-2 ring-[#C0142B]/30 shadow-md'
                      : 'bg-white border-[#EADCCF] hover:border-[#D4AF37] hover:shadow-sm'
                  }`}
                >
                  {/* Top Row: Icon & Radio Circle */}
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all ${
                      isSelected 
                        ? 'bg-[#C0142B] text-white shadow-md' 
                        : 'bg-[#FBF3E8] text-[#8C6D23] group-hover:bg-[#F3E5AB]/40'
                    }`}>
                      <IconComp className="w-5 h-5" />
                    </div>

                    {/* Radio Indicator */}
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                      isSelected 
                        ? 'border-[#C0142B] bg-[#C0142B]' 
                        : 'border-gray-300 bg-white'
                    }`}>
                      {isSelected && <Check className="w-3 h-3 text-white stroke-[3]" />}
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className={`font-serif font-bold text-base leading-snug mb-1.5 transition-colors ${
                      isSelected ? 'text-[#1E090C]' : 'text-gray-800'
                    }`}>
                      {opt.title}
                    </h3>
                    <p className="text-xs text-[#6A5A52] leading-relaxed">
                      {opt.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* ================= MANDATORY SERVICE NUMBER PREVIEW TOKEN BAR ================= */}
          <div className="bg-gradient-to-r from-[#1E090C] via-[#2A0D13] to-[#170508] text-white border border-[#D4AF37]/40 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg mb-8">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-widest text-[#D4AF37] font-semibold flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3" />
                  <span>OFFICIAL SERVICE NUMBER TOKEN</span>
                </div>
                <div className="text-xs text-gray-300 mt-0.5">
                  {submitSuccess 
                    ? "Official tracking identifier assigned for your appointment" 
                    : "Unique tracking token generated upon submission (CGyymmXXXX format)"}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="font-mono text-sm sm:text-base font-bold bg-white/10 px-4 py-2 rounded-xl border border-[#D4AF37]/40 text-[#F3E5AB] tracking-widest shadow-inner">
                {submitSuccess ? serviceNumber : serviceNumberPreview}
              </span>
              {submitSuccess && (
                <button
                  type="button"
                  onClick={handleCopyServiceNumber}
                  className="p-2 rounded-xl bg-[#D4AF37] text-[#1E090C] hover:bg-[#bfa02c] transition-all"
                  title="Copy Service Number"
                >
                  {copiedNumber ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              )}
            </div>
          </div>

          {/* ================= SUCCESS BANNER OR FORM ================= */}
          {submitSuccess ? (
            <div className="bg-gradient-to-b from-[#FFFDF9] to-[#F9F3EA] border-2 border-[#D4AF37] rounded-3xl p-6 sm:p-8 text-center space-y-6 shadow-xl animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-emerald-100 border-2 border-emerald-500 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <span className="text-xs uppercase font-extrabold tracking-widest text-[#C0142B]">
                  REQUEST REGISTERED WITH CONCIERGE
                </span>
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#1E090C] mt-1">
                  Thank You, {formData.full_name || 'Valued Client'}!
                </h3>
                <p className="text-xs sm:text-sm text-[#5A4A42] max-w-md mx-auto mt-2">
                  Your appointment for <strong>{serviceOptions.find(o => o.id === activeService)?.title}</strong> has been logged. 
                  Our senior designer will call you shortly to confirm timings.
                </p>
              </div>

              {/* Service Number Certificate Box */}
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#D4AF37]/50 max-w-md mx-auto shadow-sm">
                <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Your Verified Service Number</div>
                <div className="font-mono text-2xl font-bold text-[#C0142B] tracking-wider mb-3">
                  {serviceNumber}
                </div>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <button
                    onClick={handleCopyServiceNumber}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold transition-all"
                  >
                    {copiedNumber ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedNumber ? 'Copied to Clipboard!' : 'Copy Number'}</span>
                  </button>
                  <Link
                    to={`/track-project?serviceNo=${encodeURIComponent(serviceNumber)}`}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#1E090C] text-[#D4AF37] hover:brightness-125 text-xs font-semibold transition-all"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>Track Live Status</span>
                  </Link>
                </div>
              </div>

              {/* Next Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <a
                  href={`https://wa.me/919433889668?text=${encodeURIComponent(`Hello Cherry Gold Interiors, I just booked ${serviceOptions.find(o => o.id === activeService)?.title}. My Service Number is ${serviceNumber}. Please confirm my appointment.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-semibold shadow-md transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Confirm on WhatsApp</span>
                </a>
                <button
                  onClick={() => {
                    setSubmitSuccess(false);
                    setServiceNumber('');
                  }}
                  className="px-5 py-2.5 rounded-2xl bg-white border border-[#E0D0C0] text-[#5A4A42] hover:bg-gray-50 text-xs sm:text-sm font-semibold transition-all"
                >
                  Book Another Request
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {submitError && (
                <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl text-xs sm:text-sm text-red-700">
                  {submitError}
                </div>
              )}

              {/* Row 1: Name & Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleInputChange}
                      placeholder="Your Name *"
                      className={`w-full pl-10 pr-4 py-3 bg-white rounded-xl border text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#C0142B]/30 transition-all ${
                        validationErrors.full_name ? 'border-red-500' : 'border-[#E5D7C9]'
                      }`}
                    />
                  </div>
                  {validationErrors.full_name && (
                    <p className="text-[11px] text-red-600 mt-1 pl-1">{validationErrors.full_name}</p>
                  )}
                </div>

                <div>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder={activeService === 'video' ? "Your Email (Required for Video Link) *" : "Your Email (Optional)"}
                      className={`w-full pl-10 pr-4 py-3 bg-white rounded-xl border text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#C0142B]/30 transition-all ${
                        validationErrors.email ? 'border-red-500' : 'border-[#E5D7C9]'
                      }`}
                    />
                  </div>
                  {validationErrors.email && (
                    <p className="text-[11px] text-red-600 mt-1 pl-1">{validationErrors.email}</p>
                  )}
                </div>
              </div>

              {/* Row 2: Phone Number & Preferred Date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
                    <input
                      type="tel"
                      name="phone_number"
                      value={formData.phone_number}
                      onChange={handleInputChange}
                      placeholder="Your Phone Number *"
                      className={`w-full pl-10 pr-4 py-3 bg-white rounded-xl border text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#C0142B]/30 transition-all ${
                        validationErrors.phone_number ? 'border-red-500' : 'border-[#E5D7C9]'
                      }`}
                    />
                  </div>
                  {validationErrors.phone_number && (
                    <p className="text-[11px] text-red-600 mt-1 pl-1">{validationErrors.phone_number}</p>
                  )}
                </div>

                <div>
                  <div className="relative">
                    <Calendar className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400 pointer-events-none" />
                    <input
                      type="date"
                      name="preferred_date"
                      value={formData.preferred_date}
                      onChange={handleInputChange}
                      min={new Date().toISOString().split('T')[0]}
                      className={`w-full pl-10 pr-4 py-3 bg-white rounded-xl border text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#C0142B]/30 transition-all text-gray-700 ${
                        validationErrors.preferred_date ? 'border-red-500' : 'border-[#E5D7C9]'
                      }`}
                    />
                  </div>
                  {validationErrors.preferred_date && (
                    <p className="text-[11px] text-red-600 mt-1 pl-1">{validationErrors.preferred_date}</p>
                  )}
                </div>
              </div>

              {/* Row 3: City & Preferred Time Slot */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400 pointer-events-none" />
                    <select
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border border-[#E5D7C9] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#C0142B]/30 transition-all text-gray-700 appearance-none"
                    >
                      {cityOptions.map((c) => (
                        <option key={c.value} value={c.value}>{c.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <div className="relative">
                    <Clock className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400 pointer-events-none" />
                    <select
                      name="preferred_time"
                      value={formData.preferred_time}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border border-[#E5D7C9] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#C0142B]/30 transition-all text-gray-700 appearance-none"
                    >
                      <option value="">Preferred Time Slot</option>
                      {timeSlots.map((t) => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Row 4: Service Specific Fields */}
              {activeService === 'onsite' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="relative">
                      <Building2 className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400 pointer-events-none" />
                      <select
                        name="project_type"
                        value={formData.project_type}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border border-[#E5D7C9] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#C0142B]/30 transition-all text-gray-700 appearance-none"
                      >
                        {projectTypes.map((p) => (
                          <option key={p.value} value={p.value}>{p.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <div className="relative">
                      <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        name="complete_address"
                        value={formData.complete_address}
                        onChange={handleInputChange}
                        placeholder="Complete Street Address *"
                        className={`w-full pl-10 pr-4 py-3 bg-white rounded-xl border text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#C0142B]/30 transition-all ${
                          validationErrors.complete_address ? 'border-red-500' : 'border-[#E5D7C9]'
                        }`}
                      />
                    </div>
                    {validationErrors.complete_address && (
                      <p className="text-[11px] text-red-600 mt-1 pl-1">{validationErrors.complete_address}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Textarea: Notes / Issue / Project Description */}
              <div>
                <div className="relative">
                  <FileText className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
                  <textarea
                    name={activeService === 'repair' ? 'issue_description' : 'project_details'}
                    value={activeService === 'repair' ? formData.issue_description : formData.project_details}
                    onChange={handleInputChange}
                    maxLength={300}
                    rows={3}
                    placeholder={
                      activeService === 'repair'
                        ? "Describe the repair issue (e.g. kitchen hinge loose, drawer slider, finish touch-up) *"
                        : "Tell us about your project (Approximate budget, BHK size, or style preference) [Optional]"
                    }
                    className={`w-full pl-10 pr-4 py-3 bg-white rounded-xl border text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#C0142B]/30 transition-all resize-none ${
                      validationErrors.issue_description ? 'border-red-500' : 'border-[#E5D7C9]'
                    }`}
                  />
                  <span className="absolute right-3 bottom-2 text-[10px] text-gray-400">
                    {(activeService === 'repair' ? formData.issue_description : formData.project_details)?.length || 0}/300
                  </span>
                </div>
                {validationErrors.issue_description && (
                  <p className="text-[11px] text-red-600 mt-1 pl-1">{validationErrors.issue_description}</p>
                )}
              </div>

              {/* Primary Submit Button (Exact pill style from reference image) */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-full bg-gradient-to-r from-[#A71124] via-[#C0142B] to-[#8C0D1B] hover:from-[#900E20] hover:to-[#780A16] text-white font-serif font-bold text-base sm:text-lg tracking-wide shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-3 disabled:opacity-60 active:scale-[0.99] group"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Generating Service Reservation...</span>
                    </>
                  ) : (
                    <>
                      <span>Book Free Consultation</span>
                      <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                        <ArrowRight className="w-4 h-4 text-white" />
                      </div>
                    </>
                  )}
                </button>
              </div>

            </form>
          )}

          {/* ================= 3 TRUST BADGES (EXACT FROM REFERENCE IMAGE) ================= */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 mt-8 border-t border-[#EFE4D6]">
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center text-[#9E7B15] shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-serif font-bold text-[#1E090C]">100% Confidential</h4>
                <p className="text-[11px] text-[#7A6A62]">Your information is safe with us</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center text-[#9E7B15] shrink-0">
                <IndianRupee className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-serif font-bold text-[#1E090C]">Free Consultation</h4>
                <p className="text-[11px] text-[#7A6A62]">No hidden charges or fees</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center text-[#9E7B15] shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-serif font-bold text-[#1E090C]">Expert Interior Designers</h4>
                <p className="text-[11px] text-[#7A6A62]">15+ years of turnkey excellence</p>
              </div>
            </div>

          </div>

        </div>

      </section>

      {/* ================= PROVEN 5-STAGE PROCESS JOURNEY ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase font-extrabold tracking-widest text-[#C0142B] bg-[#C0142B]/10 px-3.5 py-1 rounded-full border border-[#C0142B]/20">
            TRANSPARENT CLIENT JOURNEY
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#1E090C] mt-3">
            Our Proven 5-Step Process
          </h2>
          <p className="text-sm text-[#5A4A42] mt-2">
            Every home interior is executed with German precision, certified milestones, and zero unexpected surprises.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            {
              step: '01',
              title: 'Discovery & Audit',
              desc: 'Detailed site laser measurement and lifestyle preference audit.'
            },
            {
              step: '02',
              title: '3D CAD Blueprints',
              desc: 'High-definition 3D rendering with material selection & fixed quotation.'
            },
            {
              step: '03',
              title: 'Precision Sourcing',
              desc: 'IS 710 BWP marine ply carcass & Hafele hardware factory tooling.'
            },
            {
              step: '04',
              title: 'White-Glove Setup',
              desc: 'Seamless on-site installation by certified master carpenters.'
            },
            {
              step: '05',
              title: '20-Yr Certified Stamp',
              desc: 'Comprehensive quality audit, final polish & warranty document handover.'
            }
          ].map((item, idx) => (
            <div 
              key={idx}
              className="bg-white rounded-2xl p-5 border border-[#E8DACB] shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
            >
              <div className="text-3xl font-serif font-bold text-[#D4AF37]/30 group-hover:text-[#C0142B]/40 transition-colors mb-2">
                {item.step}
              </div>
              <h3 className="text-sm font-serif font-bold text-[#1E090C] mb-1">
                {item.title}
              </h3>
              <p className="text-xs text-[#6A5A52] leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= DIRECT VIP SUPPORT & EMERGENCY CONTACT ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#1E090C] via-[#2A0E13] to-[#140507] rounded-3xl p-6 sm:p-10 border border-[#D4AF37]/40 text-white shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center lg:text-left">
            <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-semibold">
              NEED IMMEDIATE ASSISTANCE?
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white">
              Talk Directly with Our Chief Interior Architect
            </h3>
            <p className="text-xs sm:text-sm text-gray-300 max-w-xl">
              Available 7 days a week (9:00 AM – 8:00 PM). Fast response for urgent site assessments, quote reviews, and emergency fixture repairs.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
            <a
              href="tel:+919433889668"
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-[#D4AF37]/50 text-white text-xs sm:text-sm font-semibold tracking-wider transition-all shadow-md active:scale-95"
            >
              <Phone className="w-4 h-4 text-[#D4AF37]" />
              <span>Call: +91 9433889668</span>
            </a>
            <a
              href="https://wa.me/919433889668"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-semibold tracking-wider transition-all shadow-md active:scale-95"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Concierge</span>
            </a>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Services;