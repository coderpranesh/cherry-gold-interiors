import React, { useState } from 'react';
import { 
  Users, 
  Gift, 
  Share2, 
  Trophy, 
  Copy, 
  Check, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Wallet, 
  Phone, 
  MessageSquare, 
  Percent, 
  Calculator, 
  ChevronDown, 
  Award, 
  ExternalLink,
  Crown,
  CreditCard,
  Building,
  CheckCircle2,
  Clock,
  Coins
} from 'lucide-react';
import ConsultationModal from '../Components/ConsultationModal';

const ReferEarn = () => {
  const [referralCode, setReferralCode] = useState('CG-LUXE-8821');
  const [copied, setCopied] = useState(false);
  const [calculatorValue, setCalculatorValue] = useState(600000);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);

  // Dynamic reward calculation based on project value
  const isPremiumTier = calculatorValue >= 200000;
  const rewardPercentage = isPremiumTier ? 5 : 3;
  const rewardAmount = Math.round((calculatorValue * rewardPercentage) / 100);

  const copyReferralCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const shareViaWhatsApp = () => {
    const text = `Hey! I'm inviting you to experience luxury home interiors by Cherry Gold Interiors (Kolkata). Book a Free 3D Design Consultation using my VIP referral code *${referralCode}* to unlock exclusive client privileges and guaranteed 20-year warranty! Check them out: ${window.location.origin}/refer-earn?ref=${referralCode}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const budgetPresets = [
    { label: '₹2.5 Lakhs (Kitchen)', value: 250000 },
    { label: '₹5 Lakhs (2BHK Complete)', value: 500000 },
    { label: '₹8 Lakhs (3BHK Luxury)', value: 800000 },
    { label: '₹12 Lakhs (Turnkey Villa)', value: 1200000 },
    { label: '₹18 Lakhs (Penthouse)', value: 1800000 },
  ];

  const recentReferrals = [
    {
      name: "Rajesh Kumar",
      location: "South City Villa, Kolkata",
      project: "Turnkey Luxury Interior",
      value: "₹8,50,000",
      tier: "5% Royal Tier",
      status: "Completed",
      reward: "₹42,500",
      paymentMethod: "IMPS Bank Transfer"
    },
    {
      name: "Priya Patel",
      location: "Silver Spring 3BHK",
      project: "Modular Living & Bedrooms",
      value: "₹4,20,000",
      tier: "5% Royal Tier",
      status: "In Execution",
      reward: "₹21,000",
      paymentMethod: "Milestone Scheduled"
    },
    {
      name: "Amit Sharma",
      location: "New Town Heights",
      project: "Acrylic Modular Kitchen",
      value: "₹1,80,000",
      tier: "3% Signature Tier",
      status: "Completed",
      reward: "₹5,400",
      paymentMethod: "Instant UPI Transfer"
    },
    {
      name: "Sneha Sen",
      location: "Alipore Grand Residence",
      project: "Complete Duplex Turnkey",
      value: "₹12,00,000",
      tier: "5% Royal Tier",
      status: "Design Approved",
      reward: "₹60,000",
      paymentMethod: "On Execution Start"
    }
  ];

  const faqs = [
    {
      q: "Who is eligible to join the Cherry Gold Ambassador Club?",
      a: "Anyone! Whether you are an existing Cherry Gold homeowner, an architect, a real estate professional, or someone who loves luxury living, you can share your VIP code with friends and family planning their home renovation."
    },
    {
      q: "When and how will I receive my referral reward?",
      a: "Referral payouts are disbursed directly via IMPS / NEFT bank transfer or UPI within 14 days of your referred friend confirming their project agreement and project execution commencement. No delays, 100% transparent."
    },
    {
      q: "Is there any limit to the total amount I can earn?",
      a: "No! There is absolutely no cap on referral earnings. If you refer 5 friends with ₹10,00,000 projects, you earn ₹2,50,000 directly. Top ambassadors regularly earn over ₹1,00,000+ each quarter."
    },
    {
      q: "What exclusive benefit does my friend receive by using my code?",
      a: "Your friend receives VIP Priority Onboarding, a Complimentary 3D Photorealistic Design Walkthrough (worth ₹15,000), and a complimentary smart LED mood-lighting upgrade with their turnkey contract."
    },
    {
      q: "Can I refer commercial offices or boutique hospitality projects?",
      a: "Yes! For large corporate, office, or retail commercial spaces exceeding ₹25,00,000, please speak directly with our VIP Referral Concierge for custom corporate alliance reward terms."
    }
  ];

  return (
    <div className="min-h-screen bg-[#FBF3E8] pt-28 pb-20 relative overflow-hidden font-sans text-gray-800">
      {/* Ambient Luxury Glow Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-gradient-to-b from-[#C0142B]/10 via-[#D4AF37]/15 to-transparent blur-3xl pointer-events-none rounded-full" />
      <div className="absolute top-96 -right-40 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-[800px] -left-40 w-96 h-96 bg-[#C0142B]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* ================= HERO SECTION ================= */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#1E090C] to-[#2E0D12] text-[#D4AF37] border border-[#D4AF37]/40 shadow-md mb-6">
            <Crown className="w-4 h-4 text-[#D4AF37] animate-pulse" />
            <span className="text-xs font-semibold tracking-widest uppercase">
              CHERRY GOLD VIP AMBASSADOR CLUB
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-[#1E090C] tracking-tight leading-tight mb-6">
            Share Golden Living. <br />
            <span className="bg-gradient-to-r from-[#C0142B] via-[#D4AF37] to-[#C0142B] bg-clip-text text-transparent">
              Earn Unlimited Cash Rewards.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-[#5A4A42] max-w-2xl mx-auto leading-relaxed mb-8">
            Introduce your friends, family, and colleagues to bespoke, factory-crafted interiors. 
            Earn up to <strong className="text-[#C0142B] font-semibold">5% direct cash payout (₹10,000 to ₹60,000+ per home)</strong> with 
            guaranteed bank transfers and zero limits.
          </p>

          {/* Key Value Proposition Badges */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs sm:text-sm font-medium text-[#3A2A28]">
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-xl border border-[#D4AF37]/30 shadow-sm">
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              <span>Up to 5% Cash Back per Project</span>
            </div>
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-xl border border-[#D4AF37]/30 shadow-sm">
              <Wallet className="w-4 h-4 text-[#C0142B]" />
              <span>Direct Bank IMPS / UPI Transfer</span>
            </div>
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-xl border border-[#D4AF37]/30 shadow-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>100% Transparent Tracking</span>
            </div>
          </div>
        </div>

        {/* ================= VIP AMBASSADOR CARD & SHARING HUB ================= */}
        <div className="max-w-4xl mx-auto mb-20">
          <div className="relative rounded-3xl p-1 bg-gradient-to-r from-[#D4AF37]/60 via-[#C0142B]/50 to-[#D4AF37]/60 shadow-2xl">
            <div className="bg-gradient-to-br from-[#1A080B] via-[#240B10] to-[#120406] rounded-[22px] p-6 sm:p-10 text-white relative overflow-hidden">
              {/* Card Watermark */}
              <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 opacity-5 pointer-events-none select-none">
                <Crown className="w-96 h-96 text-white" />
              </div>
              <div className="absolute top-0 right-0 w-80 h-80 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                {/* Left: Card Emblem & Details */}
                <div className="text-center md:text-left space-y-3">
                  <div className="flex items-center justify-center md:justify-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#997A15] p-2 flex items-center justify-center shadow-lg">
                      <Crown className="w-6 h-6 text-[#1A080B]" />
                    </div>
                    <div>
                      <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-semibold block">
                        Privilege Membership
                      </span>
                      <h3 className="text-xl font-serif font-bold text-white tracking-wide">
                        Cherry Gold Ambassador
                      </h3>
                    </div>
                  </div>
                  <p className="text-sm text-gray-300 max-w-md leading-relaxed">
                    Share your unique invitation pass. Your referee gets complimentary 3D photorealistic walkthroughs and priority factory slotting.
                  </p>
                </div>

                {/* Right: Code Block & Copy Button */}
                <div className="w-full md:w-auto flex flex-col items-center md:items-end gap-3">
                  <span className="text-xs text-[#D4AF37] uppercase tracking-wider font-medium">
                    Your Personal Referral Code
                  </span>
                  <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md border border-[#D4AF37]/40 rounded-2xl p-2.5 px-4 shadow-inner w-full md:w-auto justify-between">
                    <span className="text-2xl font-mono font-bold tracking-widest text-[#F3E5AB]">
                      {referralCode}
                    </span>
                    <button
                      onClick={copyReferralCode}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B38F24] text-[#1A080B] text-xs font-bold uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all shadow-md"
                      title="Copy Referral Code"
                    >
                      {copied ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-900" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs text-gray-300">
                  <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
                  <span>Instant Verification Active</span>
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                  <button
                    onClick={shareViaWhatsApp}
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold uppercase tracking-wider transition-all shadow-lg active:scale-95"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Share on WhatsApp</span>
                  </button>

                  <button
                    onClick={copyReferralCode}
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold uppercase tracking-wider transition-all active:scale-95"
                  >
                    <Share2 className="w-4 h-4 text-[#D4AF37]" />
                    <span>Share Link</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= INTERACTIVE EARNINGS SIMULATOR ================= */}
        <div className="mb-20">
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#E8DACB] shadow-xl relative overflow-hidden">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C0142B]/10 text-[#C0142B] text-xs font-bold uppercase tracking-wider mb-3">
                <Calculator className="w-3.5 h-3.5" />
                <span>Rewards Calculator</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#1E090C] mb-3">
                Simulate Your Referral Earnings
              </h2>
              <p className="text-sm sm:text-base text-[#68554F]">
                Drag the slider or choose a home configuration to calculate your direct bank payout upon execution.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Column: Interactive Slider & Quick Presets */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#68554F]">
                      Referee's Estimated Project Value
                    </span>
                    <span className="text-2xl sm:text-3xl font-serif font-bold text-[#C0142B]">
                      ₹{calculatorValue.toLocaleString('en-IN')}
                    </span>
                  </div>

                  {/* Range Slider */}
                  <input
                    type="range"
                    min="100000"
                    max="2000000"
                    step="50000"
                    value={calculatorValue}
                    onChange={(e) => setCalculatorValue(Number(e.target.value))}
                    className="w-full h-3 bg-[#F1E4D3] rounded-lg appearance-none cursor-pointer accent-[#C0142B]"
                  />

                  <div className="flex justify-between text-xs text-[#8A756C] mt-2 font-mono">
                    <span>₹1,00,000 (Min)</span>
                    <span>₹10,00,000</span>
                    <span>₹20,00,000 (Max)</span>
                  </div>
                </div>

                {/* Quick Presets */}
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#68554F] block mb-2.5">
                    Or select a typical home requirement:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {budgetPresets.map((preset) => (
                      <button
                        key={preset.label}
                        onClick={() => setCalculatorValue(preset.value)}
                        className={`text-xs px-3.5 py-2 rounded-xl font-medium transition-all ${
                          calculatorValue === preset.value
                            ? 'bg-[#1E090C] text-[#D4AF37] font-bold shadow-md scale-105'
                            : 'bg-[#FBF3E8] text-[#5A4A42] hover:bg-[#EFE4D6] border border-[#E8DACB]'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Earnings Highlight Box */}
              <div className="lg:col-span-5">
                <div className="rounded-2xl p-6 sm:p-8 bg-gradient-to-br from-[#1E090C] via-[#2B0E13] to-[#120507] text-white shadow-xl border border-[#D4AF37]/30 relative overflow-hidden">
                  <div className="absolute top-0 right-0 -mt-6 -mr-6 w-32 h-32 bg-[#D4AF37]/20 rounded-full blur-2xl pointer-events-none" />

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-semibold">
                      Your Direct Cash Reward
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#C0142B] text-white">
                      {rewardPercentage}% Cash Tier
                    </span>
                  </div>

                  <div className="text-4xl sm:text-5xl font-serif font-bold text-[#F3E5AB] tracking-tight mb-3">
                    ₹{rewardAmount.toLocaleString('en-IN')}
                  </div>

                  <p className="text-xs text-gray-300 leading-relaxed mb-6">
                    {isPremiumTier ? (
                      <span>
                        🔥 <strong className="text-white">Royal Tier Qualification:</strong> 5% direct cash bonus on all turnkey, multi-room, or luxury villa projects exceeding ₹2,00,000.
                      </span>
                    ) : (
                      <span>
                        ✨ <strong className="text-white">Signature Tier Qualification:</strong> 3% direct cash reward for individual modular kitchens, wardrobes, or compact rooms.
                      </span>
                    )}
                  </p>

                  <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-[#D4AF37]">
                    <span>Disbursement via Direct IMPS</span>
                    <span>TDS Compliance Included</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= TIERED REWARD ARCHITECTURE ================= */}
        <div className="mb-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#1E090C] mb-3">
              Two Prestigious Reward Tiers
            </h2>
            <p className="text-sm sm:text-base text-[#68554F]">
              Designed to maximize your return whether your contact is styling a single room or redesigning an entire home.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Card 1: Royal Turnkey Tier (5%) */}
            <div className="rounded-3xl p-8 bg-gradient-to-br from-[#1E090C] via-[#2A0E13] to-[#120507] text-white border-2 border-[#D4AF37]/60 shadow-2xl relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-4 right-4 bg-[#D4AF37] text-[#1E090C] text-[10px] font-extrabold uppercase px-3 py-1 rounded-full tracking-wider shadow">
                MOST POPULAR
              </div>

              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] mb-6">
                  <Trophy className="w-6 h-6" />
                </div>

                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-5xl font-serif font-bold text-[#F3E5AB]">5%</span>
                  <span className="text-lg text-gray-300 font-medium">Direct Cash Reward</span>
                </div>

                <h3 className="text-2xl font-serif font-bold text-white mb-2">
                  Royal Turnkey Tier
                </h3>
                <p className="text-sm text-[#D4AF37] font-semibold mb-6">
                  Applicable on all project values above ₹2,00,000
                </p>

                <ul className="space-y-3.5 text-sm text-gray-200 mb-8">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#D4AF37] mt-0.5 shrink-0" />
                    <span>Complete 2BHK, 3BHK, 4BHK Turnkey Interiors</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#D4AF37] mt-0.5 shrink-0" />
                    <span>Luxury modular kitchen + designer wardrobes combo</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#D4AF37] mt-0.5 shrink-0" />
                    <span>Bespoke villas, duplexes & penthouses</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#D4AF37] mt-0.5 shrink-0" />
                    <span>Average ambassador payout: <strong className="text-white">₹25,000 to ₹60,000+</strong></span>
                  </li>
                </ul>
              </div>

              <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs text-gray-400">Payout: Upon site execution start</span>
                <span className="text-xs font-semibold text-[#D4AF37]">Zero Earning Cap</span>
              </div>
            </div>

            {/* Card 2: Signature Modular Tier (3%) */}
            <div className="rounded-3xl p-8 bg-white border border-[#E8DACB] text-[#1E090C] shadow-lg relative overflow-hidden flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#C0142B]/10 border border-[#C0142B]/20 flex items-center justify-center text-[#C0142B] mb-6">
                  <Gift className="w-6 h-6" />
                </div>

                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-5xl font-serif font-bold text-[#C0142B]">3%</span>
                  <span className="text-lg text-[#68554F] font-medium">Direct Cash Reward</span>
                </div>

                <h3 className="text-2xl font-serif font-bold text-[#1E090C] mb-2">
                  Signature Modular Tier
                </h3>
                <p className="text-sm text-[#C0142B] font-semibold mb-6">
                  Applicable on project values ₹1,00,000 – ₹2,00,000
                </p>

                <ul className="space-y-3.5 text-sm text-[#5A4A42] mb-8">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#C0142B] mt-0.5 shrink-0" />
                    <span>Standalone Modular Kitchens (Hydraulic / Soft-close)</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#C0142B] mt-0.5 shrink-0" />
                    <span>Master Bedroom Wardrobes (Acrylic / PU Lacquered)</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#C0142B] mt-0.5 shrink-0" />
                    <span>Living room false ceiling & acoustic accent walls</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#C0142B] mt-0.5 shrink-0" />
                    <span>Average ambassador payout: <strong className="text-[#1E090C]">₹3,000 to ₹6,000</strong></span>
                  </li>
                </ul>
              </div>

              <div className="pt-6 border-t border-[#EFE4D6] flex items-center justify-between">
                <span className="text-xs text-[#8A756C]">Payout: Instant Bank Transfer</span>
                <span className="text-xs font-semibold text-[#C0142B]">Direct UPI Eligible</span>
              </div>
            </div>
          </div>
        </div>

        {/* ================= 3-STEP ROYAL WORKFLOW ================= */}
        <div className="mb-20">
          <div className="bg-gradient-to-b from-white to-[#F8EEE0] rounded-3xl p-8 sm:p-12 border border-[#E8DACB] shadow-lg">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-[#C0142B] block mb-2">
                Effortless Process
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#1E090C] mb-3">
                How Your Golden Rewards Work
              </h2>
              <p className="text-sm sm:text-base text-[#68554F]">
                Three seamless steps from initial conversation to receiving cash in your account.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {/* Step 1 */}
              <div className="relative text-center p-6 bg-white/70 backdrop-blur-sm rounded-2xl border border-[#E8DACB] hover:shadow-md transition-all">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1E090C] to-[#3A0F15] text-[#D4AF37] flex items-center justify-center mx-auto mb-5 text-xl font-serif font-bold shadow-md">
                  1
                </div>
                <h3 className="text-lg font-serif font-bold text-[#1E090C] mb-2">
                  Share Your VIP Code
                </h3>
                <p className="text-xs sm:text-sm text-[#68554F] leading-relaxed">
                  Send your personalized link or code via WhatsApp, SMS, or email to anyone planning home renovations or modular updates.
                </p>
              </div>

              {/* Step 2 */}
              <div className="relative text-center p-6 bg-white/70 backdrop-blur-sm rounded-2xl border border-[#E8DACB] hover:shadow-md transition-all">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#C0142B] to-[#8C0C1E] text-white flex items-center justify-center mx-auto mb-5 text-xl font-serif font-bold shadow-md">
                  2
                </div>
                <h3 className="text-lg font-serif font-bold text-[#1E090C] mb-2">
                  They Book & Finalize 3D Design
                </h3>
                <p className="text-xs sm:text-sm text-[#68554F] leading-relaxed">
                  Your friend receives a free consultation, site visit, and 3D design quote. Upon signing their turnkey agreement, your reward locks in.
                </p>
              </div>

              {/* Step 3 */}
              <div className="relative text-center p-6 bg-white/70 backdrop-blur-sm rounded-2xl border border-[#E8DACB] hover:shadow-md transition-all">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#A07C18] text-[#1E090C] flex items-center justify-center mx-auto mb-5 text-xl font-serif font-bold shadow-md">
                  3
                </div>
                <h3 className="text-lg font-serif font-bold text-[#1E090C] mb-2">
                  Direct Cash Transfer
                </h3>
                <p className="text-xs sm:text-sm text-[#68554F] leading-relaxed">
                  You receive an instant IMPS transfer or UPI deposit directly into your designated bank account with zero waiting period.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ================= AMBASSADOR DASHBOARD & PROOF OF PAYOUTS ================= */}
        <div className="mb-20">
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#E8DACB] shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] block mb-1">
                  Verified Ledger
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1E090C]">
                  Live Ambassador Dashboard
                </h2>
              </div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span>Live Payout Tracking Active</span>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              <div className="p-5 rounded-2xl bg-[#FBF3E8] border border-[#EFE4D6]">
                <span className="text-xs text-[#8A756C] font-semibold uppercase tracking-wider block mb-1">
                  Total Referrals
                </span>
                <span className="text-3xl font-serif font-bold text-[#1E090C]">14</span>
                <span className="text-[11px] text-[#68554F] block mt-1">Homes introduced</span>
              </div>

              <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-100">
                <span className="text-xs text-emerald-800 font-semibold uppercase tracking-wider block mb-1">
                  Completed Projects
                </span>
                <span className="text-3xl font-serif font-bold text-emerald-900">9</span>
                <span className="text-[11px] text-emerald-700 block mt-1">100% Handover done</span>
              </div>

              <div className="p-5 rounded-2xl bg-[#1E090C] text-white border border-[#D4AF37]/30 shadow-md">
                <span className="text-xs text-[#D4AF37] font-semibold uppercase tracking-wider block mb-1">
                  Total Cash Earned
                </span>
                <span className="text-3xl font-serif font-bold text-[#F3E5AB]">₹68,900</span>
                <span className="text-[11px] text-gray-300 block mt-1">Disbursed to bank</span>
              </div>

              <div className="p-5 rounded-2xl bg-[#C0142B]/5 border border-[#C0142B]/20">
                <span className="text-xs text-[#C0142B] font-semibold uppercase tracking-wider block mb-1">
                  Pipeline Rewards
                </span>
                <span className="text-3xl font-serif font-bold text-[#C0142B]">₹60,000</span>
                <span className="text-[11px] text-[#8C0C1E] block mt-1">Execution phase</span>
              </div>
            </div>

            {/* Recent Referral Activity Table */}
            <div>
              <h3 className="text-base font-serif font-bold text-[#1E090C] mb-4">
                Recent Referral Activity Log
              </h3>
              <div className="overflow-x-auto rounded-2xl border border-[#EFE4D6]">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-[#F8EEE0] text-[#1E090C] font-serif uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="py-3.5 px-4">Referee & Location</th>
                      <th className="py-3.5 px-4">Project Scope</th>
                      <th className="py-3.5 px-4">Project Value</th>
                      <th className="py-3.5 px-4">Tier</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Cash Reward</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EFE4D6] text-[#3E2F2B]">
                    {recentReferrals.map((item, index) => (
                      <tr key={index} className="hover:bg-[#FAF4EC] transition-colors">
                        <td className="py-3.5 px-4 font-medium">
                          <div className="text-[#1E090C] font-semibold">{item.name}</div>
                          <div className="text-[11px] text-[#8A756C]">{item.location}</div>
                        </td>
                        <td className="py-3.5 px-4">{item.project}</td>
                        <td className="py-3.5 px-4 font-mono font-medium">{item.value}</td>
                        <td className="py-3.5 px-4">
                          <span className="text-xs px-2 py-0.5 rounded-md bg-[#D4AF37]/15 text-[#8F7012] font-semibold">
                            {item.tier}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            item.status === 'Completed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : item.status === 'In Execution'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-current" />
                            {item.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right font-serif font-bold text-base text-[#C0142B]">
                          {item.reward}
                          <div className="text-[10px] font-sans font-normal text-[#8A756C]">{item.paymentMethod}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* ================= TRANSPARENT CHARTER & FREQUENTLY ASKED QUESTIONS ================= */}
        <div className="mb-20">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-[#C0142B] block mb-2">
              Transparency First
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#1E090C] mb-3">
              Ambassador Club Guidelines & FAQs
            </h2>
            <p className="text-sm sm:text-base text-[#68554F]">
              Everything you need to know about eligibility, payouts, and compliance.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="rounded-2xl border border-[#E8DACB] bg-white overflow-hidden transition-all shadow-sm"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full py-4 px-6 flex items-center justify-between text-left gap-4 hover:bg-[#FAF4EC] transition-colors"
                  >
                    <span className="font-serif font-semibold text-base sm:text-lg text-[#1E090C]">
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-[#8A756C] transition-transform duration-300 shrink-0 ${
                        isOpen ? 'rotate-180 text-[#C0142B]' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-[#5A4A42] leading-relaxed border-t border-[#F1E4D3] bg-[#FBF3E8]/40">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ================= VIP REFERRAL CONCIERGE CTA BANNER ================= */}
        <div className="rounded-3xl p-8 sm:p-12 bg-gradient-to-br from-[#1E090C] via-[#2A0E13] to-[#120507] text-white border border-[#D4AF37]/40 shadow-2xl relative overflow-hidden text-center">
          <div className="absolute top-0 right-1/2 translate-x-1/2 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <div className="w-16 h-16 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center mx-auto text-[#D4AF37]">
              <Crown className="w-8 h-8" />
            </div>

            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white leading-tight">
              Have a Large Home or Commercial Project in Mind?
            </h2>

            <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
              Speak directly with our Chief Relationship Officer for custom real-estate alliance payouts, corporate contracts, or VIP site visits.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B38F24] text-[#1E090C] text-xs sm:text-sm font-bold uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all shadow-lg"
              >
                Book VIP Consultation
              </button>

              <a
                href="https://api.whatsapp.com/send?phone=919830000000&text=Hi%20Cherry%20Gold%20Interiors,%20I%20want%20to%20discuss%20a%20VIP%20Referral%20Partnership"
                target="_blank"
                rel="noreferrer"
                className="px-8 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs sm:text-sm font-semibold uppercase tracking-wider active:scale-95 transition-all flex items-center gap-2"
              >
                <Phone className="w-4 h-4 text-[#D4AF37]" />
                <span>Contact Referral Concierge</span>
              </a>
            </div>
          </div>
        </div>

      </div>

      {/* Consultation Modal */}
      <ConsultationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Book VIP Design Consultation"
      />
    </div>
  );
};

export default ReferEarn;