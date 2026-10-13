import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  X, 
  Sparkles, 
  ShieldCheck, 
  Building2, 
  User, 
  Phone, 
  MessageSquare, 
  Download, 
  Printer, 
  Eye, 
  ChevronRight, 
  Layers, 
  Hammer, 
  Award, 
  Crown,
  FileCheck,
  MapPin,
  Check
} from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

// Assets for photorealistic site updates & demo visual feedback
import imgDining from '../assets/consultation-dining-room.jpg';
import imgLiving from '../assets/about-living-room.jpg';
import imgHero from '../assets/hero-interior.jpg';
import imgCta from '../assets/cta-living-room.jpg';

// Pre-configured rich luxury demonstration projects for instant client preview
const DEMO_PROJECTS = {
  'CG-2025-VILLA1': {
    customer_name: "Vikram & Ananya Sengupta",
    location: "South City Residences, Prince Anwar Shah Rd, Kolkata",
    project_type: "3BHK Luxury Turnkey Residence",
    service_number: "CG-2025-VILLA1",
    startDate: "2026-09-28",
    expectedCompletion: "2026-10-18",
    progress: 75,
    lead_architect: "Ar. Debanjan Mitra",
    site_engineer: "Subhashis Roy (+91 9433889668)",
    warranty_status: "20-Year Marine Plywood Warranty Stamped",
    stages: [
      { id: 1, order: 1, name: "3D Design & Material Curation", status: "completed", date: "Sep 28, 2026", note: "3D walkthrough finalized & European acrylic laminates approved." },
      { id: 2, order: 2, name: "In-House Factory Laser Cutting & CNC", status: "completed", date: "Oct 02, 2026", note: "German PUR edge-banded carcasses fabricated at our Rajarhat factory." },
      { id: 3, order: 3, name: "Civil, 4-Trade Electrical & Plaster Prep", status: "completed", date: "Oct 06, 2026", note: "Concealed conduit electrical, fan clamp repositioning, and Birla Putty." },
      { id: 4, order: 4, name: "Modular Carcass & Cabinet Installation", status: "current", date: "Oct 11, 2026", note: "Wardrobe boxes, hydraulic kitchen tandems & soft-close hinges being mounted." },
      { id: 5, order: 5, name: "Quartz Countertops & Ambient Lighting", status: "upcoming", date: "Oct 15, 2026", note: "Nano-polished quartz counters & warm 3000K profile LED strips." },
      { id: 6, order: 6, name: "Deep Cleaning & 20-Year Handover", status: "upcoming", date: "Oct 18, 2026", note: "50-point audit, brass polish, key handover & official warranty card." }
    ],
    updates: [
      {
        id: 101,
        title: "Modular Carcass Alignment & Hydraulic Hardware Installed",
        date: "Oct 12, 2026 - 04:30 PM",
        description: "Kitchen tall units and master wardrobe modular frames successfully anchored with laser-level alignment. German Hafele soft-close channels tested under load.",
        images: [imgLiving, imgDining],
        badge: "On-Site Installation"
      },
      {
        id: 102,
        title: "Electrical Concealment & False Ceiling Profile Testing",
        date: "Oct 08, 2026 - 11:15 AM",
        description: "Four-trade electrical work complete: concealed wiring conduits laid, fan clamp centered, and gypsum acoustic false ceiling perimeter illuminated.",
        images: [imgHero, imgCta],
        badge: "Electrical & Civil"
      }
    ]
  },
  'CG-2025-MOD4': {
    customer_name: "Dr. K. R. Banerjee",
    location: "Uniworld City, Action Area III, New Town, Kolkata",
    project_type: "Modular Kitchen & Master Wardrobes",
    service_number: "CG-2025-MOD4",
    startDate: "2026-10-04",
    expectedCompletion: "2026-10-19",
    progress: 45,
    lead_architect: "Soma Sen (Modular Specialist)",
    site_engineer: "Amitabha Das (+91 9433889668)",
    warranty_status: "20-Year Termite Proof Certified",
    stages: [
      { id: 1, order: 1, name: "3D Design & Material Curation", status: "completed", date: "Oct 04, 2026", note: "Matte Slate Grey & Champagne Gold hardware approved." },
      { id: 2, order: 2, name: "In-House Factory Laser Cutting & CNC", status: "completed", date: "Oct 08, 2026", note: "BWP grade plywood calibrated & CNC drilled." },
      { id: 3, order: 3, name: "Civil & Plumbing Rough-in", status: "current", date: "Oct 12, 2026", note: "Under-sink plumbing line & RO switch point creation." },
      { id: 4, order: 4, name: "Cabinet Carcass Assembly", status: "upcoming", date: "Oct 14, 2026", note: "Delivery to site scheduled from factory warehouse." },
      { id: 5, order: 5, name: "Quartz Top & Profile Lighting", status: "upcoming", date: "Oct 17, 2026", note: "Kalinga Stone quartz slab installation." },
      { id: 6, order: 6, name: "Final Handover & Cleaning", status: "upcoming", date: "Oct 19, 2026", note: "Deep sanitation and client handover ceremony." }
    ],
    updates: [
      {
        id: 201,
        title: "Factory Edge-Banding & CNC Milling Complete",
        date: "Oct 10, 2026 - 02:00 PM",
        description: "All 18mm BWP marine shutters passed 0.2mm tolerance tests and edge-banded with zero glue lines. Dispatched for site logistics.",
        images: [imgDining],
        badge: "Factory Progress"
      }
    ]
  },
  'CG-2025-HANDOVER': {
    customer_name: "Mr. Sanjeev Jalan",
    location: "Ballygunge Circular Road, Kolkata",
    project_type: "4BHK Complete Penthouse Interiors",
    service_number: "CG-2025-HANDOVER",
    startDate: "2026-09-10",
    expectedCompletion: "2026-09-28",
    progress: 100,
    lead_architect: "Ar. Debanjan Mitra",
    site_engineer: "Subhashis Roy (+91 9433889668)",
    warranty_status: "20-Year Certificate #CG-WAR-7749 Disbursed",
    stages: [
      { id: 1, order: 1, name: "3D Design & Material Curation", status: "completed", date: "Sep 10, 2026", note: "Full turnkey blueprint signed." },
      { id: 2, order: 2, name: "In-House Factory Laser Cutting & CNC", status: "completed", date: "Sep 14, 2026", note: "All panels fabricated in-house." },
      { id: 3, order: 3, name: "Civil, 4-Trade Electrical & Plaster", status: "completed", date: "Sep 18, 2026", note: "Concealed wiring and false ceiling complete." },
      { id: 4, order: 4, name: "Modular Carcass & Cabinet Installation", status: "completed", date: "Sep 22, 2026", note: "Soft-close German fittings erected." },
      { id: 5, order: 5, name: "Quartz Countertops & Ambient Lighting", status: "completed", date: "Sep 25, 2026", note: "Italian marble finish & recessed profiles." },
      { id: 6, order: 6, name: "Deep Cleaning & 20-Year Handover", status: "completed", date: "Sep 28, 2026", note: "100% Handover complete with warranty documents." }
    ],
    updates: [
      {
        id: 301,
        title: "Final 50-Point Quality Audit Passed & Keys Delivered",
        date: "Sep 28, 2026 - 06:00 PM",
        description: "Zero snag defects identified. Complete residence deep-cleaned and official 20-Year Warranty document presented to Mr. Jalan.",
        images: [imgHero, imgLiving, imgDining],
        badge: "Milestone Handover"
      }
    ]
  }
};

const ProjectTracking = () => {
  const { serviceNumber: initialServiceNumber } = useParams();
  const [serviceNumber, setServiceNumber] = useState(initialServiceNumber || 'CG-2025-VILLA1');
  const [projectData, setProjectData] = useState(DEMO_PROJECTS['CG-2025-VILLA1']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (initialServiceNumber) {
      setServiceNumber(initialServiceNumber);
      fetchProject(initialServiceNumber);
    }
  }, [initialServiceNumber]);

  const fetchProject = async (queryNumber) => {
    const code = queryNumber.trim().toUpperCase();
    if (!code) {
      setError('Please enter your project service number');
      return;
    }

    setLoading(true);
    setError(null);

    // 1. Check local demo projects first for instant demonstration
    if (DEMO_PROJECTS[code]) {
      setTimeout(() => {
        setProjectData(DEMO_PROJECTS[code]);
        setLoading(false);
      }, 400);
      return;
    }

    // 2. Query backend API endpoint
    try {
      const response = await axios.get(`/api/projects/track/${code}/`);
      if (!response.data || !response.data.stages) {
        throw new Error('Invalid project structure received');
      }

      setProjectData({
        ...response.data,
        service_number: code,
        startDate: response.data.start_date,
        expectedCompletion: response.data.expected_completion,
        currentStage: response.data.current_stage,
        stages: response.data.stages.sort((a, b) => a.order - b.order),
        updates: response.data.updates?.map(update => ({
          ...update,
          images: update.images || []
        })) || []
      });
    } catch (err) {
      // If not in database, inform user and give 1-click option to preview demo
      const errorMessage = err.response?.status === 404 
        ? `No active project found with code "${code}". Try one of our demo sample codes below.`
        : err.message || 'Unable to fetch project data. Please verify your service number.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProject(serviceNumber);
  };

  const loadDemo = (code) => {
    setServiceNumber(code);
    setError(null);
    setProjectData(DEMO_PROJECTS[code]);
  };

  const clearSearch = () => {
    setServiceNumber('');
    setError(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Pending Schedule';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const copyServiceNumber = () => {
    if (projectData?.service_number) {
      navigator.clipboard.writeText(projectData.service_number);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF3E8] pt-28 pb-20 relative overflow-hidden font-sans text-gray-800">
      {/* Ambient Luxury Lighting Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-b from-[#C0142B]/10 via-[#D4AF37]/15 to-transparent blur-3xl pointer-events-none rounded-full" />
      <div className="absolute top-96 -right-40 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-[800px] -left-40 w-96 h-96 bg-[#C0142B]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* ================= HERO HEADER ================= */}
        <div className="text-center max-w-4xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#1E090C] to-[#2E0D12] text-[#D4AF37] border border-[#D4AF37]/40 shadow-md mb-6">
            <Crown className="w-4 h-4 text-[#D4AF37] animate-pulse" />
            <span className="text-xs font-semibold tracking-widest uppercase">
              LIVE SITE TRACKER & QUALITY PORTAL
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-[#1E090C] tracking-tight leading-tight mb-5">
            Track Your Home's <br />
            <span className="bg-gradient-to-r from-[#C0142B] via-[#D4AF37] to-[#C0142B] bg-clip-text text-transparent">
              Golden Transformation.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-[#5A4A42] max-w-2xl mx-auto leading-relaxed mb-8">
            Experience complete transparency. Track real-time factory laser CNC cutting, 
            4-trade site electrical-civil preparations, and modular installation milestones with certified 20-year quality records.
          </p>

          {/* Quick Pillars */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs sm:text-sm font-medium text-[#3A2A28]">
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-xl border border-[#D4AF37]/30 shadow-sm">
              <Clock className="w-4 h-4 text-[#C0142B]" />
              <span>10–15 Days Guaranteed Delivery</span>
            </div>
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-xl border border-[#D4AF37]/30 shadow-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>20-Year Marine Plywood Warranty</span>
            </div>
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-xl border border-[#D4AF37]/30 shadow-sm">
              <Building2 className="w-4 h-4 text-[#D4AF37]" />
              <span>100% In-House Factory Machined</span>
            </div>
          </div>
        </div>

        {/* ================= SEARCH & DEMO CHIPS CARD ================= */}
        <div className="max-w-3xl mx-auto mb-14">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DACB] shadow-xl relative overflow-hidden">
            <form onSubmit={handleSearch} className="space-y-4">
              <div>
                <label htmlFor="serviceNumber" className="block text-xs font-bold uppercase tracking-wider text-[#68554F] mb-2">
                  Enter Your Project Service / Work Code
                </label>
                <div className="relative">
                  <input
                    id="serviceNumber"
                    type="text"
                    value={serviceNumber}
                    onChange={(e) => setServiceNumber(e.target.value)}
                    placeholder="e.g., CG-2025-VILLA1 or Work Order ID"
                    className="w-full px-5 py-3.5 pl-12 pr-12 text-sm sm:text-base border border-[#DAC7B5] rounded-2xl bg-[#FBF3E8]/40 focus:bg-white focus:ring-2 focus:ring-[#C0142B] focus:border-transparent transition-all uppercase font-mono tracking-wider text-[#1E090C]"
                  />
                  <Search className="absolute left-4 top-4 w-5 h-5 text-[#8A756C]" />
                  {serviceNumber && (
                    <button
                      type="button"
                      onClick={clearSearch}
                      className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 p-0.5 rounded-full"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  disabled={loading || !serviceNumber.trim()}
                  className="flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#1E090C] via-[#350E14] to-[#1E090C] text-[#F3E5AB] font-serif font-bold text-sm tracking-wider uppercase hover:brightness-110 active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2 border border-[#D4AF37]/40 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
                      <span>Retrieving Site Status...</span>
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4 text-[#D4AF37]" />
                      <span>Track Live Project Status</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-5 py-3.5 rounded-2xl bg-[#FBF3E8] hover:bg-[#EFE4D6] text-[#5A4A42] border border-[#E8DACB] text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                  title="Print Project Progress Sheet"
                >
                  <Printer className="w-4 h-4 text-[#8A756C]" />
                  <span className="hidden sm:inline">Print Record</span>
                </button>
              </div>

              {error && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs sm:text-sm text-red-700 flex items-start gap-2.5">
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">{error}</p>
                    <p className="text-xs text-red-600 mt-1">
                      Click any live demo project below to preview a real turnkey execution timeline.
                    </p>
                  </div>
                </div>
              )}

              {/* Demo Sample Quick Chips */}
              <div className="pt-4 border-t border-[#F1E4D3] text-xs">
                <span className="text-[#8A756C] font-semibold block mb-2">
                  💡 Explore Live Sample Turnkey Projects:
                </span>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => loadDemo('CG-2025-VILLA1')}
                    className={`px-3 py-1.5 rounded-xl border font-mono transition-all ${
                      projectData?.service_number === 'CG-2025-VILLA1'
                        ? 'bg-[#1E090C] text-[#D4AF37] border-[#D4AF37] shadow-sm'
                        : 'bg-[#FBF3E8] text-[#5A4A42] border-[#E8DACB] hover:bg-[#EFE4D6]'
                    }`}
                  >
                    ⭐ CG-2025-VILLA1 (South City 3BHK - 75%)
                  </button>
                  <button
                    type="button"
                    onClick={() => loadDemo('CG-2025-MOD4')}
                    className={`px-3 py-1.5 rounded-xl border font-mono transition-all ${
                      projectData?.service_number === 'CG-2025-MOD4'
                        ? 'bg-[#1E090C] text-[#D4AF37] border-[#D4AF37] shadow-sm'
                        : 'bg-[#FBF3E8] text-[#5A4A42] border-[#E8DACB] hover:bg-[#EFE4D6]'
                    }`}
                  >
                    📐 CG-2025-MOD4 (New Town Modular - 45%)
                  </button>
                  <button
                    type="button"
                    onClick={() => loadDemo('CG-2025-HANDOVER')}
                    className={`px-3 py-1.5 rounded-xl border font-mono transition-all ${
                      projectData?.service_number === 'CG-2025-HANDOVER'
                        ? 'bg-[#1E090C] text-[#D4AF37] border-[#D4AF37] shadow-sm'
                        : 'bg-[#FBF3E8] text-[#5A4A42] border-[#E8DACB] hover:bg-[#EFE4D6]'
                    }`}
                  >
                    👑 CG-2025-HANDOVER (Ballygunge Penthouse - 100%)
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* ================= PROJECT MASTER CARD & PROGRESS ================= */}
        {projectData && (
          <div className="space-y-10 animate-fade-in mb-16">
            
            {/* Overview Card */}
            <div className="bg-white rounded-3xl border border-[#E8DACB] shadow-xl overflow-hidden">
              {/* Obsidian Gold Header Ribbon */}
              <div className="bg-gradient-to-r from-[#1A080B] via-[#2E0D13] to-[#120406] text-white p-6 sm:p-8 border-b border-[#D4AF37]/30 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-3 py-0.5 rounded-full bg-[#D4AF37] text-[#1A080B] text-[10px] font-extrabold uppercase tracking-wider">
                      Turnkey Residence Order
                    </span>
                    <span className="text-xs text-gray-300 font-mono">
                      CIN: U74102WB2025PTC279494
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-wide">
                    {projectData.customer_name}
                  </h2>
                  <div className="flex items-center gap-1.5 text-xs text-gray-300 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>{projectData.location || "Kolkata, West Bengal"}</span>
                  </div>
                </div>

                {/* Service Code Pill with Copy */}
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/20">
                  <div>
                    <span className="text-[10px] uppercase text-[#D4AF37] font-semibold block">
                      Tracking Code
                    </span>
                    <span className="text-lg font-mono font-bold text-white tracking-wider">
                      {projectData.service_number || serviceNumber}
                    </span>
                  </div>
                  <button
                    onClick={copyServiceNumber}
                    className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-[#D4AF37] transition-all"
                    title="Copy Tracking ID"
                  >
                    {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <ChevronRight className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* 4 Key Metric Columns */}
              <div className="p-6 sm:p-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-8 border-b border-[#EFE4D6]">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#8A756C] block mb-1">
                      Project Scope
                    </span>
                    <p className="text-base font-serif font-bold text-[#1E090C]">
                      {projectData.project_type}
                    </p>
                    <span className="text-xs text-emerald-700 font-medium">Full Execution</span>
                  </div>

                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#8A756C] block mb-1">
                      Start & Handover Window
                    </span>
                    <p className="text-sm font-semibold text-[#1E090C]">
                      {formatDate(projectData.startDate)}
                    </p>
                    <span className="text-xs text-[#C0142B] font-semibold">
                      Target: {formatDate(projectData.expectedCompletion)}
                    </span>
                  </div>

                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#8A756C] block mb-1">
                      Lead Interior Architect
                    </span>
                    <p className="text-sm font-semibold text-[#1E090C]">
                      {projectData.lead_architect || "Ar. Debanjan Mitra"}
                    </p>
                    <span className="text-xs text-[#8A756C]">Senior Design Team</span>
                  </div>

                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#8A756C] block mb-1">
                      Warranty Guarantee
                    </span>
                    <p className="text-sm font-semibold text-emerald-800 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>20 Years Marine Grade</span>
                    </p>
                    <span className="text-xs text-[#8A756C]">Zero Delamination Clause</span>
                  </div>
                </div>

                {/* Overall Execution Progress Bar */}
                <div className="pt-6">
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#1E090C]">
                        Overall Handover Completion
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#C0142B]/10 text-[#C0142B]">
                        {projectData.progress}% Executed
                      </span>
                    </div>
                    <span className="text-xs text-[#8A756C]">
                      Guaranteed 10-15 Day Promise
                    </span>
                  </div>

                  {/* Gradient Progress Track */}
                  <div className="w-full bg-[#F1E4D3] rounded-full h-3.5 p-0.5 overflow-hidden shadow-inner">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#C0142B] via-[#D4AF37] to-[#C0142B] transition-all duration-700 shadow"
                      style={{ width: `${projectData.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* ================= 6-STAGE LUXURY MILESTONE TIMELINE ================= */}
            <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E8DACB] shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] block mb-1">
                    Certified Milestones
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#1E090C]">
                    Project Execution Journey
                  </h3>
                </div>
                <div className="text-xs text-[#8A756C] flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Completed
                  <div className="w-2.5 h-2.5 rounded-full bg-[#C0142B] animate-pulse" /> In Progress
                  <div className="w-2.5 h-2.5 rounded-full bg-gray-300" /> Pending
                </div>
              </div>

              {/* Stepper Grid / List */}
              <div className="space-y-6">
                {projectData.stages.map((stage, idx) => {
                  const isDone = stage.status === 'completed';
                  const isCurrent = stage.status === 'current';

                  return (
                    <div
                      key={stage.id || idx}
                      className={`relative flex items-start gap-4 sm:gap-6 p-4 sm:p-5 rounded-2xl border transition-all ${
                        isCurrent
                          ? 'bg-[#FBF3E8] border-[#D4AF37] shadow-md scale-[1.01]'
                          : isDone
                          ? 'bg-white border-[#EFE4D6]'
                          : 'bg-gray-50/50 border-gray-200 opacity-60'
                      }`}
                    >
                      {/* Step Number Circle */}
                      <div
                        className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center shrink-0 font-serif font-bold text-base sm:text-lg shadow-sm ${
                          isDone
                            ? 'bg-emerald-600 text-white'
                            : isCurrent
                            ? 'bg-gradient-to-br from-[#1E090C] to-[#C0142B] text-[#D4AF37] border border-[#D4AF37]'
                            : 'bg-gray-200 text-gray-500'
                        }`}
                      >
                        {isDone ? <Check className="w-5 h-5 sm:w-6 sm:h-6" /> : idx + 1}
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                          <h4 className="text-base sm:text-lg font-serif font-bold text-[#1E090C]">
                            {stage.name}
                          </h4>
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider self-start sm:self-auto ${
                              isDone
                                ? 'bg-emerald-100 text-emerald-800'
                                : isCurrent
                                ? 'bg-[#C0142B] text-white animate-pulse'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {isDone ? 'Completed' : isCurrent ? 'Active On-Site' : 'Scheduled'}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-[#8A756C] mb-2 font-mono">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{stage.date}</span>
                        </div>

                        {stage.note && (
                          <p className="text-xs sm:text-sm text-[#5A4A42] leading-relaxed">
                            {stage.note}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ================= REAL-TIME SITE UPDATES PHOTO FEED ================= */}
            <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E8DACB] shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#C0142B] block mb-1">
                    Quality Inspection Log
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#1E090C]">
                    Live Site Notes & Fabrication Photos
                  </h3>
                </div>
                <span className="text-xs text-gray-500">
                  Updated directly by Site Lead
                </span>
              </div>

              {projectData.updates && projectData.updates.length > 0 ? (
                <div className="space-y-8">
                  {projectData.updates.map((update) => (
                    <div
                      key={update.id}
                      className="p-6 rounded-2xl border border-[#EFE4D6] bg-[#FAF4EC]/40 hover:bg-[#FAF4EC] transition-all"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          {update.badge && (
                            <span className="px-2.5 py-0.5 rounded-md bg-[#1E090C] text-[#D4AF37] text-[10px] font-bold uppercase tracking-wider">
                              {update.badge}
                            </span>
                          )}
                          <h4 className="text-base sm:text-lg font-serif font-bold text-[#1E090C]">
                            {update.title}
                          </h4>
                        </div>
                        <span className="text-xs text-[#8A756C] font-mono">
                          {update.date}
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm text-[#5A4A42] leading-relaxed mb-4">
                        {update.description}
                      </p>

                      {/* Image Preview Thumbnails */}
                      {update.images && update.images.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {update.images.map((img, i) => (
                            <div
                              key={i}
                              onClick={() => setPreviewImage(img)}
                              className="group relative rounded-xl overflow-hidden border border-[#DAC7B5] aspect-video cursor-pointer shadow-sm hover:shadow-md transition-all"
                            >
                              <img
                                src={img}
                                alt={`Site update ${i + 1}`}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                              <div className="absolute inset-0 bg-[#1E090C]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                                <Eye className="w-5 h-5 text-[#D4AF37]" />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-[#8A756C] text-sm">
                  Site engineers are preparing your first milestone report. Please check back shortly.
                </div>
              )}
            </div>

            {/* ================= AUDIT DOCUMENTS & WARRANTY DOWNLOADS ================= */}
            <div className="bg-gradient-to-r from-white to-[#F8EEE0] rounded-3xl p-6 sm:p-8 border border-[#E8DACB] shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
                  <FileCheck className="w-3.5 h-3.5 text-emerald-700" />
                  <span>50-Point Quality Inspection Passed</span>
                </div>
                <h4 className="text-xl font-serif font-bold text-[#1E090C]">
                  Official Warranty & Material Documentation
                </h4>
                <p className="text-xs sm:text-sm text-[#68554F] max-w-xl">
                  Download certified material batch test reports, termite-resistance certifications, and your official 20-Year Marine Ply Warranty Card.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => alert('Downloading Certified Quality Inspection & 20-Year Warranty PDF...')}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#1E090C] to-[#350E14] text-[#D4AF37] text-xs font-bold uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all shadow-md flex items-center gap-2 border border-[#D4AF37]/40"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Warranty PDF</span>
                </button>
              </div>
            </div>

          </div>
        )}

        {/* ================= DIRECT SITE CONCIERGE BANNER ================= */}
        <div className="rounded-3xl p-8 sm:p-12 bg-gradient-to-br from-[#1E090C] via-[#2A0E13] to-[#120507] text-white border border-[#D4AF37]/40 shadow-2xl relative overflow-hidden text-center">
          <div className="absolute top-0 right-1/2 translate-x-1/2 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <div className="w-16 h-16 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center mx-auto text-[#D4AF37]">
              <Crown className="w-8 h-8" />
            </div>

            <h3 className="text-2xl sm:text-4xl font-serif font-bold text-white leading-tight">
              Have Questions About Today's Site Progress?
            </h3>

            <p className="text-xs sm:text-base text-gray-300 leading-relaxed">
              Our site supervisor and lead interior architects are available for direct site inspections, live video walkthroughs, and material approvals.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <a
                href="https://wa.me/919433889668?text=Hi%20Cherry%20Gold%20Interiors,%20I%20have%20an%20inquiry%20regarding%20my%20ongoing%20project."
                target="_blank"
                rel="noopener noreferrer"
                className="px-7 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold uppercase tracking-wider active:scale-95 transition-all shadow-lg flex items-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp Site Concierge</span>
              </a>

              <a
                href="tel:+919433889668"
                className="px-7 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs sm:text-sm font-semibold uppercase tracking-wider active:scale-95 transition-all flex items-center gap-2"
              >
                <Phone className="w-4 h-4 text-[#D4AF37]" />
                <span>Call +91 94338 89668</span>
              </a>

              <Link
                to="/contact"
                className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B38F24] text-[#1E090C] text-xs sm:text-sm font-bold uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all shadow-md"
              >
                Schedule Site Visit
              </Link>
            </div>
          </div>
        </div>

      </div>

      {/* ================= LIGHTBOX IMAGE PREVIEW MODAL ================= */}
      {previewImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center">
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute -top-12 right-0 text-white hover:text-[#D4AF37] p-2"
            >
              <X className="w-8 h-8" />
            </button>
            <img
              src={previewImage}
              alt="Site update enlarged"
              className="w-full h-auto max-h-[80vh] object-contain rounded-2xl border border-[#D4AF37]/50 shadow-2xl"
            />
            <p className="text-xs text-gray-300 mt-3 font-serif">
              Cherry Gold Interiors • Live Site Milestone Audit Photograph
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectTracking;