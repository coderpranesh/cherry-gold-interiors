import React, { useState, useEffect, useRef } from 'react';
import { 
  Gift, Tv, CheckCircle, Star, AlertTriangle, Calendar, X, Phone, User,
  Clock, History, Sparkles, Tag, Award, ShieldCheck, ChevronRight, BellRing
} from 'lucide-react';
import { getActiveOffer, getPastOffersList } from '../data/offersData';

function useCountdown(targetDate) {
  const calculate = () => {
    const diff = new Date(targetDate) - new Date();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  };
  const [time, setTime] = useState(calculate);
  useEffect(() => { const id = setInterval(() => setTime(calculate()), 1000); return () => clearInterval(id); }, [targetDate]);
  return time;
}

const Particles = () => {
  const particles = React.useMemo(() =>
    Array.from({ length: 20 }).map((_, i) => ({
      left: `${(i * 5.1 + 2) % 100}%`,
      delay: `${(i * 0.31) % 6}s`,
      duration: `${4 + (i % 5)}s`,
      size: `${8 + (i % 10)}px`,
    })), []);
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }} aria-hidden="true">
      {particles.map((p, i) => (
        <span key={i} style={{
          position: 'absolute', left: p.left, color: '#C9A84C',
          fontSize: p.size, opacity: 0.7,
          animation: `sepFloat ${p.duration} ${p.delay} linear infinite`,
        }}>✦</span>
      ))}
    </div>
  );
};

const Offers = () => {
  // Automatically loads current active offer and past offers from centralized data
  const activeOffer = getActiveOffer();
  const pastOffers = getPastOffersList();
  const currentOffers = activeOffer?.packages || [];

  const [showPopup, setShowPopup] = useState(false);
  const [popupTitle, setPopupTitle] = useState(activeOffer?.title || 'The September Privilege');
  const [popupSubtitle, setPopupSubtitle] = useState('Register to claim your exclusive offer');
  const [formData, setFormData] = useState({ name: '', phone: '', otp: '' });
  const [showOtpField, setShowOtpField] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [pastFilter, setPastFilter] = useState('All');
  const audioRef = useRef(null);
  const countdown = useCountdown(activeOffer?.endDate || '2026-09-15T23:59:59+05:30');

  // Royalty-free calm luxury instrumental — plays silently on page load
  useEffect(() => {
    const audio = new Audio('/dreamy.mp3');
    audio.loop = true;
    audio.volume = 0.32;
    audioRef.current = audio;
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        const unlock = () => {
          audio.play().catch(() => {});
          window.removeEventListener('click', unlock);
          window.removeEventListener('touchstart', unlock);
        };
        window.addEventListener('click', unlock, { once: true });
        window.addEventListener('touchstart', unlock, { once: true });
      });
    }
    return () => {
      audio.pause();
      audio.src = '';
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPopupTitle(activeOffer?.title || 'The September Privilege');
      setPopupSubtitle(`Register now to claim your ${activeOffer?.reward || 'exclusive interior reward'}!`);
      setShowPopup(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, [activeOffer]);

  const openClaimPopup = (title, subtitle) => {
    setPopupTitle(title || activeOffer?.title || 'Exclusive Offer');
    setPopupSubtitle(subtitle || 'Register to claim your exclusive offer');
    setShowPopup(true);
  };

  const handleSendOtp = () => {
    if (formData.name && formData.phone) {
      setShowOtpField(true);
      alert('OTP sent to your mobile number!');
    }
  };

  const handleSubmitForm = () => {
    if (formData.name && formData.phone && formData.otp) {
      alert('Thank you! We will contact you soon with the latest offers.');
      setShowPopup(false);
      setFormData({ name: '', phone: '', otp: '' });
      setShowOtpField(false);
    }
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const filteredPastOffers = pastFilter === 'All' 
    ? pastOffers 
    : pastOffers.filter(o => o.category === pastFilter);

  const eligibility = [
    { icon: <CheckCircle size={18} />, text: 'Terms & conditions apply. Gift models/brands are subject to availability.' },
    { icon: <CheckCircle size={18} />, text: 'Offer applicable on eligible interior packages and confirmed bookings.' },
    { icon: <Gift size={18} />, text: 'More you invest in your dream home, bigger your FREE gift! Assured gift for every bracket.' },
    { icon: <Calendar size={18} />, text: 'Offer valid till 31st October 2026 only.' },
    { icon: <AlertTriangle size={18} />, text: 'Valid only for new quotations generated and confirmed during the promotional period.' },
  ];

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Inter:wght@300;400;500;600;700&display=swap');
    @keyframes sepFloat { 0%{transform:translateY(100vh) rotate(0deg);opacity:0} 10%{opacity:.8} 90%{opacity:.8} 100%{transform:translateY(-30px) rotate(720deg);opacity:0} }
    @keyframes sepShimmer { 0%{background-position:200% center} 100%{background-position:-200% center} }
    .sep-page { font-family:'Inter',sans-serif; background:#0a0804; color:#f5e9c8; min-height:100vh; overflow-x:hidden; }
    .sep-hero { position:relative; background:radial-gradient(ellipse at 50% -10%,#1f1508 0%,#0a0804 65%); padding:80px 24px 50px; text-align:center; overflow:hidden; }
    .sep-badge { display:inline-flex; align-items:center; gap:8px; background:linear-gradient(135deg,#2a1e06,#3d2d0a); border:1px solid #C9A84C55; border-radius:50px; padding:8px 22px; font-size:11px; letter-spacing:3px; color:#C9A84C; text-transform:uppercase; margin-bottom:32px; }
    .sep-title { font-family:'Cormorant Garamond',serif; font-size:clamp(52px,11vw,100px); font-weight:700; line-height:.95; letter-spacing:-2px; color:#fff; margin:0 0 16px; }
    .sep-title-gold { background:linear-gradient(135deg,#C9A84C 0%,#f5d77c 50%,#C9A84C 100%); background-size:200%; -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; animation:sepShimmer 4s linear infinite; }
    .sep-subtitle { font-family:'Cormorant Garamond',serif; font-size:clamp(17px,2.5vw,24px); font-style:italic; color:#c8b07a; margin:0 0 32px; letter-spacing:.5px; }
    
    .sep-quick-nav { display:flex; justify-content:center; gap:12px; margin-bottom:36px; flex-wrap:wrap; }
    .sep-nav-pill { display:inline-flex; align-items:center; gap:8px; padding:10px 22px; border-radius:50px; font-size:13px; font-weight:600; cursor:pointer; transition:all .3s; text-decoration:none; }
    .sep-nav-pill-active { background:linear-gradient(135deg,#C9A84C,#f5d77c); color:#0a0804; box-shadow:0 4px 20px rgba(201,168,76,.35); border:1px solid #f5d77c; }
    .sep-nav-pill-archive { background:rgba(37,25,5,.7); color:#f5d77c; border:1px solid #C9A84C44; }
    .sep-nav-pill-archive:hover { background:rgba(201,168,76,.15); border-color:#C9A84C; transform:translateY(-2px); }

    .sep-divider { display:flex; align-items:center; justify-content:center; gap:14px; margin-bottom:40px; }
    .sep-divider-line { flex:1; max-width:100px; height:1px; background:linear-gradient(90deg,transparent,#C9A84C88,transparent); }
    .sep-divider-text { color:#C9A84C; font-size:12px; letter-spacing:3px; text-transform:uppercase; }
    .sep-countdown { display:flex; gap:14px; justify-content:center; flex-wrap:wrap; margin-bottom:44px; }
    .sep-count-box { background:linear-gradient(145deg,#1a1205,#251905); border:1px solid #C9A84C44; border-radius:14px; padding:20px 22px; text-align:center; min-width:78px; position:relative; }
    .sep-count-box::after { content:''; position:absolute; top:0; left:0; right:0; height:1px; background:linear-gradient(90deg,transparent,#C9A84C,transparent); border-radius:14px 14px 0 0; }
    .sep-count-num { font-family:'Cormorant Garamond',serif; font-size:44px; font-weight:700; color:#f5d77c; line-height:1; }
    .sep-count-label { font-size:10px; letter-spacing:3px; text-transform:uppercase; color:#8a7550; margin-top:4px; }
    .sep-hero-note { color:#8a7550; font-size:14px; letter-spacing:1px; }
    .sep-shimmer-bar { height:2px; background:linear-gradient(90deg,transparent 0%,#C9A84C 30%,#f5d77c 50%,#C9A84C 70%,transparent 100%); background-size:200%; animation:sepShimmer 3s linear infinite; }
    
    .sep-offers-section { background:radial-gradient(ellipse at 50% 50%,#130e03 0%,#0a0804 80%); padding:60px 24px; }
    .sep-offers-title { font-family:'Cormorant Garamond',serif; font-size:clamp(32px,5vw,52px); color:#f5d77c; text-align:center; margin:0 0 8px; }
    .sep-offers-sub { color:#8a7550; text-align:center; font-size:14px; letter-spacing:1px; margin-bottom:48px; }
    .sep-cards { display:flex; gap:20px; justify-content:center; flex-wrap:wrap; max-width:1200px; margin:0 auto; }
    .sep-card { flex:1 1 250px; min-width:250px; max-width:350px; background:linear-gradient(145deg,#130e03,#1e1606); border-radius:24px; overflow:hidden; position:relative; transition:transform .4s cubic-bezier(.22,1,.36,1),box-shadow .4s; }
    .sep-card:hover { transform:translateY(-10px) scale(1.01); }
    .sep-card-featured { border:1.5px solid #C9A84C99; }
    .sep-card-regular { border:1px solid #251905; }
    .sep-featured-tag { position:absolute; top:16px; right:16px; background:linear-gradient(135deg,#C9A84C,#f5d77c); color:#0a0804; font-size:10px; font-weight:700; letter-spacing:2px; text-transform:uppercase; padding:5px 14px; border-radius:50px; z-index:3; }
    .sep-card-top { padding:28px 28px 0; }
    .sep-tier-label { font-size:11px; letter-spacing:3px; text-transform:uppercase; color:#6a5830; margin-bottom:4px; }
    .sep-tier-amount { font-family:'Cormorant Garamond',serif; font-size:36px; font-weight:700; color:#f5d77c; line-height:1; }
    .sep-tier-sub { font-size:12px; color:#6a5830; margin-top:3px; }
    .sep-card-img { margin:20px 20px 0; border-radius:16px; overflow:hidden; height:200px; background:#050302; position:relative; }
    .sep-card-img img { width:100%; height:100%; object-fit:cover; transition:transform .6s cubic-bezier(.22,1,.36,1); display:block; }
    .sep-card:hover .sep-card-img img { transform:scale(1.08); }
    .sep-free-ribbon { position:absolute; bottom:0; left:0; right:0; background:linear-gradient(135deg,#C9A84C,#f5d77c); text-align:center; padding:8px; font-family:'Cormorant Garamond',serif; font-size:20px; font-weight:700; color:#0a0804; letter-spacing:3px; }
    .sep-card-bottom { padding:20px 28px 28px; }
    .sep-get-label { font-size:10px; letter-spacing:3px; text-transform:uppercase; color:#6a5830; margin-bottom:4px; }
    .sep-reward-name { font-family:'Cormorant Garamond',serif; font-size:26px; font-weight:700; color:#fff; }
    .sep-reward-note { margin-top:12px; display:inline-flex; align-items:center; gap:8px; background:#0a0804; border:1px solid #C9A84C44; border-radius:8px; padding:8px 14px; color:#C9A84C; font-size:13px; font-weight:500; }
    .sep-validity { text-align:center; padding:20px 24px 44px; }
    .sep-validity-pill { display:inline-flex; align-items:center; gap:10px; background:linear-gradient(135deg,#1a1205,#251905); border:1.5px solid #C9A84C; border-radius:50px; padding:14px 32px; font-size:15px; font-weight:600; color:#f5d77c; letter-spacing:.5px; }
    .sep-validity-pill span { color:#C9A84C; font-weight:700; }

    /* PAST OFFERS ARCHIVE SECTION */
    .sep-past-section { padding:80px 24px 70px; background:linear-gradient(180deg,#0a0804 0%,#110c03 50%,#0a0804 100%); position:relative; }
    .sep-past-container { max-width:1160px; margin:0 auto; }
    .sep-past-header { text-align:center; margin-bottom:44px; }
    .sep-past-badge { display:inline-flex; align-items:center; gap:8px; background:rgba(201,168,76,.12); border:1px solid rgba(201,168,76,.3); padding:7px 20px; border-radius:50px; font-size:11px; letter-spacing:2.5px; color:#f5d77c; text-transform:uppercase; margin-bottom:16px; }
    .sep-past-title { font-family:'Cormorant Garamond',serif; font-size:clamp(32px,5.5vw,56px); color:#fff; margin:0 0 12px; }
    .sep-past-title span { color:#f5d77c; }
    .sep-past-subtitle { color:#9d8860; max-width:680px; margin:0 auto; font-size:15px; line-height:1.6; }

    /* Past stats banner */
    .sep-stats-banner { display:grid; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); gap:18px; margin-bottom:48px; }
    .sep-stat-box { background:linear-gradient(145deg,#161005,#1f1607); border:1px solid #C9A84C33; border-radius:18px; padding:22px; text-align:center; position:relative; overflow:hidden; }
    .sep-stat-box::before { content:''; position:absolute; top:0; left:15%; right:15%; height:1px; background:linear-gradient(90deg,transparent,#C9A84C,transparent); }
    .sep-stat-num { font-family:'Cormorant Garamond',serif; font-size:36px; font-weight:700; color:#f5d77c; margin-bottom:4px; }
    .sep-stat-label { font-size:13px; font-weight:600; color:#e0d2af; margin-bottom:4px; }
    .sep-stat-desc { font-size:11px; color:#7d6a45; }

    /* Past filters */
    .sep-past-filters { display:flex; justify-content:center; gap:10px; margin-bottom:40px; flex-wrap:wrap; }
    .sep-filter-btn { background:#140e04; color:#a8946e; border:1px solid #C9A84C33; padding:9px 20px; border-radius:50px; font-size:13px; font-weight:500; cursor:pointer; transition:all .25s; font-family:'Inter',sans-serif; }
    .sep-filter-btn:hover { border-color:#C9A84C; color:#f5d77c; }
    .sep-filter-btn.active { background:linear-gradient(135deg,#C9A84C,#f5d77c); color:#0a0804; font-weight:700; border-color:#f5d77c; box-shadow:0 4px 18px rgba(201,168,76,.3); }

    /* Past grid */
    .sep-past-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(330px,1fr)); gap:28px; }
    .sep-past-card { background:linear-gradient(145deg,#130e03,#1a1306); border:1px solid #C9A84C2e; border-radius:20px; overflow:hidden; display:flex; flex-direction:column; transition:transform .3s,box-shadow .3s,border-color .3s; }
    .sep-past-card:hover { transform:translateY(-6px); border-color:#C9A84C77; box-shadow:0 16px 40px rgba(0,0,0,.6),0 0 25px rgba(201,168,76,.15); }
    
    .sep-past-img-wrap { height:180px; position:relative; overflow:hidden; background:#060402; }
    .sep-past-img-wrap img { width:100%; height:100%; object-fit:cover; opacity:0.85; transition:transform .6s ease; filter:brightness(0.92); }
    .sep-past-card:hover .sep-past-img-wrap img { transform:scale(1.06); filter:brightness(1.02); }
    .sep-past-status-pill { position:absolute; top:14px; right:14px; background:rgba(10,8,4,.85); backdrop-filter:blur(6px); border:1px solid #6b562a; color:#cbb584; font-size:10px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; padding:4px 12px; border-radius:30px; display:inline-flex; align-items:center; gap:5px; }
    .sep-past-season-tag { position:absolute; bottom:14px; left:14px; background:linear-gradient(135deg,#241906,#3a290a); border:1px solid #C9A84C66; color:#f5d77c; font-size:11px; font-weight:600; padding:4px 12px; border-radius:20px; }

    .sep-past-body { padding:24px 22px; flex:1; display:flex; flex-direction:column; }
    .sep-past-date { display:flex; align-items:center; gap:7px; color:#8e774f; font-size:12px; font-weight:500; margin-bottom:10px; }
    .sep-past-name { font-family:'Cormorant Garamond',serif; font-size:22px; font-weight:700; color:#fff; line-height:1.25; margin:0 0 10px; }
    .sep-past-tier { display:inline-block; font-size:12px; font-weight:600; color:#C9A84C; background:rgba(201,168,76,.1); border:1px solid #C9A84C33; padding:3px 10px; border-radius:6px; margin-bottom:14px; width:fit-content; }
    .sep-past-reward-box { background:#0a0702; border:1px solid #281d09; border-radius:12px; padding:14px; margin-bottom:16px; }
    .sep-past-reward-title { font-size:10px; text-transform:uppercase; letter-spacing:2px; color:#78643e; margin-bottom:4px; }
    .sep-past-reward-val { font-family:'Cormorant Garamond',serif; font-size:17px; font-weight:700; color:#f5d77c; line-height:1.3; }
    .sep-past-worth { font-size:11px; font-weight:600; color:#34d399; margin-top:4px; display:inline-block; }
    
    .sep-past-desc { font-size:13px; color:#a18c66; line-height:1.55; margin-bottom:18px; }
    .sep-past-benefits { list-style:none; padding:0; margin:0 0 20px; display:flex; flex-direction:column; gap:8px; }
    .sep-past-benefit-item { display:flex; align-items:center; gap:8px; font-size:12px; color:#c7b58c; }
    .sep-past-benefit-item svg { flex-shrink:0; color:#C9A84C; }

    .sep-past-footer { margin-top:auto; padding-top:16px; border-top:1px solid #221808; display:flex; justify-content:space-between; align-items:center; }
    .sep-past-notify-btn { background:transparent; color:#C9A84C; border:1px solid #C9A84C66; padding:8px 16px; border-radius:50px; font-size:12px; font-weight:600; cursor:pointer; transition:all .2s; display:inline-flex; align-items:center; gap:6px; font-family:'Inter',sans-serif; }
    .sep-past-notify-btn:hover { background:rgba(201,168,76,.15); border-color:#C9A84C; color:#f5d77c; }

    /* Calendar schedule card */
    .sep-calendar-box { margin-top:54px; background:linear-gradient(135deg,#140e04,#1e1507); border:1px solid #C9A84C44; border-radius:22px; padding:32px; display:grid; grid-template-columns:1.2fr 1fr; gap:28px; align-items:center; }
    .sep-cal-title { font-family:'Cormorant Garamond',serif; font-size:28px; color:#f5d77c; margin:0 0 10px; }
    .sep-cal-text { color:#9d8860; font-size:14px; line-height:1.6; margin-bottom:18px; }
    .sep-cal-list { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
    .sep-cal-item { background:#0a0702; border:1px solid #281d09; border-radius:10px; padding:12px 14px; }
    .sep-cal-season { font-size:11px; text-transform:uppercase; letter-spacing:1px; color:#C9A84C; font-weight:700; }
    .sep-cal-offer { font-size:13px; font-weight:600; color:#fff; margin-top:2px; }
    .sep-cal-months { font-size:11px; color:#6b5731; margin-top:2px; }

    .sep-cta { background:linear-gradient(135deg,#130e03,#1e1606); border-top:1px solid #C9A84C22; border-bottom:1px solid #C9A84C22; padding:48px 24px; text-align:center; }
    .sep-cta h3 { font-family:'Cormorant Garamond',serif; font-size:clamp(26px,4vw,40px); color:#f5d77c; margin:0 0 10px; }
    .sep-cta p { color:#8a7550; font-size:15px; margin-bottom:28px; }
    .sep-cta-btns { display:flex; gap:16px; justify-content:center; flex-wrap:wrap; }
    .sep-btn-gold { background:linear-gradient(135deg,#C9A84C,#f5d77c); color:#0a0804; border:none; padding:15px 36px; border-radius:50px; font-weight:700; font-size:14px; letter-spacing:1px; cursor:pointer; transition:all .3s; box-shadow:0 4px 24px rgba(201,168,76,.3); font-family:'Inter',sans-serif; }
    .sep-btn-gold:hover { transform:translateY(-3px); box-shadow:0 10px 36px rgba(201,168,76,.5); }
    .sep-btn-outline { background:transparent; color:#C9A84C; border:1.5px solid #C9A84C; padding:15px 36px; border-radius:50px; font-weight:600; font-size:14px; cursor:pointer; transition:all .3s; text-decoration:none; display:inline-block; font-family:'Inter',sans-serif; }
    .sep-btn-outline:hover { background:#C9A84C18; transform:translateY(-3px); }
    .sep-eligibility { padding:60px 24px; max-width:760px; margin:0 auto; }
    .sep-section-title { font-family:'Cormorant Garamond',serif; font-size:clamp(30px,5vw,44px); color:#f5d77c; text-align:center; margin:0 0 8px; }
    .sep-section-sub { color:#8a7550; font-size:14px; text-align:center; margin-bottom:36px; }
    .sep-eli-list { display:flex; flex-direction:column; gap:12px; }
    .sep-eli-item { display:flex; align-items:flex-start; gap:14px; background:linear-gradient(135deg,#130e03,#1a1205); border:1px solid #251905; border-radius:14px; padding:18px 20px; transition:border-color .3s,background .3s; }
    .sep-eli-item:hover { border-color:#C9A84C44; background:linear-gradient(135deg,#1a1205,#251905); }
    .sep-eli-icon { flex-shrink:0; color:#C9A84C; margin-top:1px; }
    .sep-eli-text { color:#c8b07a; font-size:14px; line-height:1.65; }
    .sep-contact { border-top:1px solid #C9A84C18; padding:32px 24px; display:flex; justify-content:center; gap:40px; flex-wrap:wrap; background:#080601; }
    .sep-contact-item { display:flex; align-items:center; gap:10px; color:#8a7550; font-size:15px; }
    .sep-contact-item a { color:#f5d77c; text-decoration:none; font-weight:600; transition:color .2s; }
    .sep-contact-item a:hover { color:#C9A84C; }
    .sep-footer-note { text-align:center; padding:16px 24px 32px; color:#4a3b1a; font-size:11px; letter-spacing:3px; text-transform:uppercase; background:#080601; }
    .sep-popup-overlay { position:fixed; inset:0; background:rgba(0,0,0,.82); backdrop-filter:blur(8px); display:flex; align-items:center; justify-content:center; z-index:1000; padding:20px; }
    .sep-popup { background:linear-gradient(145deg,#130e03,#1e1606); border:1px solid #C9A84C44; border-radius:24px; max-width:420px; width:100%; padding:40px 32px; position:relative; }
    .sep-popup-close { position:absolute; top:14px; right:14px; background:#2a1e06; border:none; color:#6a5830; width:32px; height:32px; border-radius:50%; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:all .2s; }
    .sep-popup-close:hover { background:#C9A84C22; color:#f5d77c; }
    .sep-popup h3 { font-family:'Cormorant Garamond',serif; font-size:30px; color:#f5d77c; text-align:center; margin:0 0 8px; }
    .sep-popup p { color:#8a7550; text-align:center; font-size:14px; margin-bottom:28px; line-height:1.5; }
    .sep-popup-input { width:100%; padding:13px 14px 13px 42px; background:#050302; border:1px solid #251905; border-radius:10px; color:#f5e9c8; font-size:15px; outline:none; box-sizing:border-box; transition:border-color .2s; margin-bottom:12px; font-family:'Inter',sans-serif; }
    .sep-popup-input:focus { border-color:#C9A84C; }
    .sep-popup-input::placeholder { color:#4a3a14; }
    .sep-popup-input-wrap { position:relative; }
    .sep-popup-input-wrap svg { position:absolute; left:13px; top:50%; transform:translateY(-50%); color:#6a5830; pointer-events:none; }
    .sep-popup-note { font-size:11px; color:#5a471c; text-align:center; margin-top:14px; }
    
    @media(max-width:850px) {
      .sep-calendar-box { grid-template-columns:1fr; gap:20px; }
    }
    @media(max-width:600px) { 
      .sep-cards{gap:16px;} 
      .sep-card{min-width:100%;} 
      .sep-contact{gap:18px;} 
      .sep-cta-btns{flex-direction:column;align-items:center;}
      .sep-past-grid { grid-template-columns:1fr; }
      .sep-cal-list { grid-template-columns:1fr; }
    }
  `;

  return (
    <>
      <style>{css}</style>

      <div className="sep-page">

        {/* HERO SECTION */}
        <section className="sep-hero">
          <Particles />
          <div className="sep-badge">
            <Star size={11} /> {activeOffer?.brandPrefix || 'CHERRY GOLD INTERIORS'} <Star size={11} />
          </div>
          <h1 className="sep-title" style={{ fontSize: 'clamp(36px, 7vw, 72px)', lineHeight: '1.05' }}>
            <span className="sep-title-gold">{activeOffer?.title || 'BIG HOME INTERIOR OFFER'}</span>
          </h1>
          <p className="sep-subtitle" style={{ marginBottom: activeOffer?.tagline ? '14px' : '32px' }}>
            {activeOffer?.subtitle || 'Complete your home interiors & get a FREE GIFT!'}
          </p>
          {activeOffer?.tagline && (
            <div style={{ color: '#f5d77c', fontSize: 'clamp(14px, 2vw, 17px)', fontWeight: '600', marginBottom: '28px', letterSpacing: '.5px' }}>
              {activeOffer.tagline}
            </div>
          )}

          {/* Quick Navigation Pills */}
          <div className="sep-quick-nav">
            <button 
              className="sep-nav-pill sep-nav-pill-active"
              onClick={() => scrollToSection('current-offers')}
            >
              <Sparkles size={15} /> Active Offer: {activeOffer?.title || 'Current Deal'}
            </button>
            <button 
              className="sep-nav-pill sep-nav-pill-archive"
              onClick={() => scrollToSection('past-offers')}
            >
              <History size={15} /> Past Offers Archive ({pastOffers.length} Deals)
            </button>
          </div>

          <div className="sep-divider">
            <div className="sep-divider-line" />
            <span style={{ color: '#C9A84C', fontSize: '14px' }}>✦</span>
            <span className="sep-divider-text">Capture the Golden Moments</span>
            <span style={{ color: '#C9A84C', fontSize: '14px' }}>✦</span>
            <div className="sep-divider-line" />
          </div>

          <div className="sep-countdown">
            {[
              { val: countdown.days, label: 'Days' },
              { val: countdown.hours, label: 'Hours' },
              { val: countdown.minutes, label: 'Minutes' },
              { val: countdown.seconds, label: 'Seconds' },
            ].map(({ val, label }) => (
              <div key={label} className="sep-count-box">
                <div className="sep-count-num">{String(val).padStart(2, '0')}</div>
                <div className="sep-count-label">{label}</div>
              </div>
            ))}
          </div>

          <p className="sep-hero-note">{activeOffer?.description || 'Elevate your home with Cherry Gold Interiors.'}</p>
        </section>

        <div className="sep-shimmer-bar" />

        {/* CURRENT OFFERS SECTION */}
        <section className="sep-offers-section" id="current-offers">
          <h2 className="sep-offers-title">Current Exclusive Offers</h2>
          <p className="sep-offers-sub">ELEVATE YOUR HOME. ENJOY MORE.</p>

          <div className="sep-cards">
            {currentOffers.map((offer, i) => (
              <div
                key={i}
                className={`sep-card ${offer.featured ? 'sep-card-featured' : 'sep-card-regular'}`}
                onMouseEnter={() => setHoveredCard(i)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{ boxShadow: hoveredCard === i ? `0 24px 64px ${offer.glow}` : '0 4px 32px rgba(0,0,0,.7)' }}
              >
                {offer.featured && <div className="sep-featured-tag">Best Offer</div>}

                <div className="sep-card-top">
                  <div className="sep-tier-label">Booking Bracket</div>
                  <div className="sep-tier-amount" style={{ fontSize: '28px' }}>{offer.tier}</div>
                  <div className="sep-tier-sub">{offer.amount || 'Starting From Onwards'}</div>
                </div>

                <div className="sep-card-img">
                  <img 
                    src={offer.img} 
                    alt={offer.reward} 
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                  <div className="sep-free-ribbon">FREE GIFT</div>
                </div>

                <div className="sep-card-bottom">
                  <div className="sep-get-label">You Get Assured</div>
                  <div className="sep-reward-name" style={{ fontSize: '20px', minHeight: '52px' }}>{offer.reward}</div>
                  <div className="sep-reward-note">
                    <Gift size={14} /> {offer.note || 'Complimentary Gift with Quotation'}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Surprise Gift Spotlight for Under 6 Lakh */}
          <div style={{
            maxWidth: '1000px',
            margin: '40px auto 0',
            background: 'linear-gradient(135deg, #181206, #241806)',
            border: '1.5px solid #C9A84C88',
            borderRadius: '20px',
            padding: '24px 28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '18px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
          }}>
            <div style={{ flex: '1', minWidth: '260px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#352508', border: '1px solid #C9A84C55', borderRadius: '30px', padding: '4px 12px', fontSize: '11px', color: '#f5d77c', fontWeight: '700', textTransform: 'uppercase', marginBottom: '8px' }}>
                <Sparkles size={12} /> Assured Guarantee
              </div>
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '24px', color: '#fff', margin: '0 0 6px' }}>
                🎁 Booking Value Under ₹6 Lakh?
              </h3>
              <p style={{ color: '#c8b07a', fontSize: '14px', margin: 0, lineHeight: '1.5' }}>
                You still get an assured <strong>SURPRISE GIFT! 🎉</strong> Possible gifts include: <strong>Geyser 🚿</strong>, <strong>Microwave Oven 🍿</strong>, <strong>Air Fryer 🍟</strong> & other surprise gifts.
              </p>
            </div>
            <button 
              className="sep-btn-gold"
              style={{ padding: '12px 28px', fontSize: '13px', whiteSpace: 'nowrap' }}
              onClick={() => openClaimPopup('Surprise Gift Claim', 'Register your booking quotation to unlock your assured surprise gift!')}
            >
              Claim Surprise Gift
            </button>
          </div>
        </section>

        <div className="sep-validity">
          <div className="sep-validity-pill">
            <Calendar size={18} style={{ color: '#C9A84C' }} />
            Offer valid till <span>&nbsp;{activeOffer?.period || '15th September 2026'}&nbsp;</span> only
          </div>
        </div>

        <div className="sep-shimmer-bar" />

        {/* PAST OFFERS & CELEBRATION ARCHIVE SECTION */}
        <section className="sep-past-section" id="past-offers">
          <div className="sep-past-container">
            
            <div className="sep-past-header">
              <div className="sep-past-badge">
                <History size={13} /> Offers History & Previous Privileges
              </div>
              <h2 className="sep-past-title">
                Previous <span>Offers & Rewards</span> Archive
              </h2>
              <p className="sep-past-subtitle">
                At Cherry Gold Interiors, we celebrate every season and festival with our valued homeowners. 
                Explore the past rewards, appliances, and exclusive bonuses we have delivered over the years.
              </p>
            </div>

            {/* Statistics and Highlights */}
            <div className="sep-stats-banner">
              <div className="sep-stat-box">
                <div className="sep-stat-num">4–5</div>
                <div className="sep-stat-label">Annual Privileges</div>
                <div className="sep-stat-desc">Curated festive campaigns every single year</div>
              </div>
              <div className="sep-stat-box">
                <div className="sep-stat-num">₹50L+</div>
                <div className="sep-stat-label">Free Rewards Given</div>
                <div className="sep-stat-desc">Branded TVs, ACs, Modular Kitchens & Gold Coins</div>
              </div>
              <div className="sep-stat-box">
                <div className="sep-stat-num">100%</div>
                <div className="sep-stat-label">Genuine Deliveries</div>
                <div className="sep-stat-desc">Top brands: Samsung, Daikin, Faber, Blum & BIS Gold</div>
              </div>
              <div className="sep-stat-box">
                <div className="sep-stat-num">1200+</div>
                <div className="sep-stat-label">Happy Homeowners</div>
                <div className="sep-stat-desc">Enjoying premium handcrafted luxury spaces</div>
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="sep-past-filters">
              {[
                { key: 'All', label: `All Past Offers (${pastOffers.length})` },
                { key: 'Festive', label: `Festive Specials (${pastOffers.filter(o => o.category === 'Festive').length})` },
                { key: 'Seasonal', label: `Seasonal Specials (${pastOffers.filter(o => o.category === 'Seasonal').length})` },
                { key: 'Auspicious', label: `Auspicious Occasions (${pastOffers.filter(o => o.category === 'Auspicious').length})` },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  className={`sep-filter-btn ${pastFilter === key ? 'active' : ''}`}
                  onClick={() => setPastFilter(key)}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Past Offers Grid */}
            <div className="sep-past-grid">
              {filteredPastOffers.map((offer) => (
                <div key={offer.id} className="sep-past-card">
                  
                  <div className="sep-past-img-wrap">
                    <img 
                      src={offer.img} 
                      alt={offer.title} 
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=700&q=80';
                      }}
                    />
                    <div className="sep-past-status-pill">
                      <Clock size={11} /> Concluded
                    </div>
                    <div className="sep-past-season-tag">
                      {offer.season}
                    </div>
                  </div>

                  <div className="sep-past-body">
                    
                    <div className="sep-past-date">
                      <Calendar size={13} style={{ color: '#C9A84C' }} />
                      <span>{offer.period}</span>
                    </div>

                    <h3 className="sep-past-name">{offer.title}</h3>

                    <div className="sep-past-tier">
                      Minimum Booking: {offer.tier}
                    </div>

                    <div className="sep-past-reward-box">
                      <div className="sep-past-reward-title">Complimentary Reward Given</div>
                      <div className="sep-past-reward-val">{offer.reward}</div>
                      <span className="sep-past-worth">{offer.worth}</span>
                    </div>

                    <p className="sep-past-desc">{offer.description}</p>

                    <ul className="sep-past-benefits">
                      {offer.benefits.map((benefit, bi) => (
                        <li key={bi} className="sep-past-benefit-item">
                          <CheckCircle size={13} />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="sep-past-footer">
                      <span style={{ fontSize: '11px', color: '#7a6741', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        Closed Deal
                      </span>
                      <button 
                        className="sep-past-notify-btn"
                        onClick={() => openClaimPopup('Upcoming Seasonal Privileges', `Register to receive instant WhatsApp notifications when our next seasonal offer launches!`)}
                      >
                        <BellRing size={12} /> Get Next Season Alert
                      </button>
                    </div>

                  </div>

                </div>
              ))}
            </div>

            {/* Annual Calendar & Seasonal Schedule Box */}
            <div className="sep-calendar-box">
              <div>
                <h3 className="sep-cal-title">Our Annual Privilege Calendar</h3>
                <p className="sep-cal-text">
                  Wondering when our next big interior bonanza goes live? Cherry Gold Interiors curates 
                  exclusive reward opportunities around every major festive milestone:
                </p>
                <button 
                  className="sep-btn-gold" 
                  style={{ padding: '12px 28px', fontSize: '13px' }}
                  onClick={() => openClaimPopup('Get Priority Festive Alerts', 'Be the first to unlock our upcoming festive discounts & free appliance gifts!')}
                >
                  <BellRing size={14} style={{ display: 'inline', marginRight: '6px' }} />
                  Register for Early Bird Alerts
                </button>
              </div>

              <div className="sep-cal-list">
                <div className="sep-cal-item">
                  <div className="sep-cal-season">Diwali Festive</div>
                  <div className="sep-cal-offer">Modular Kitchen & Silver</div>
                  <div className="sep-cal-months">October – November</div>
                </div>
                <div className="sep-cal-item">
                  <div className="sep-cal-season">New Year Welcome</div>
                  <div className="sep-cal-offer">Home Automation & Lighting</div>
                  <div className="sep-cal-months">December – January</div>
                </div>
                <div className="sep-cal-item">
                  <div className="sep-cal-season">Akshaya Tritiya</div>
                  <div className="sep-cal-offer">Pure 24K Gold Coin</div>
                  <div className="sep-cal-months">April – May</div>
                </div>
                <div className="sep-cal-item">
                  <div className="sep-cal-season">Monsoon & Autumn</div>
                  <div className="sep-cal-offer">Smart TVs & Recliners</div>
                  <div className="sep-cal-months">July – September</div>
                </div>
              </div>
            </div>

          </div>
        </section>

        <div className="sep-shimmer-bar" />

        {/* CTA SECTION */}
        <section className="sep-cta">
          <h3>Create Your Dream Home</h3>
          <p>Let Cherry Gold Interiors craft a space where every moment feels special.</p>
          <div className="sep-cta-btns">
            <button className="sep-btn-gold" onClick={() => openClaimPopup(activeOffer?.title, `Register now to claim your ${activeOffer?.reward}!`)}>
              Claim Your Active Offer Now
            </button>
            <a href="tel:9433889668" className="sep-btn-outline">
              Call: 9433889668
            </a>
          </div>
        </section>

        {/* ELIGIBILITY SECTION */}
        <section className="sep-eligibility">
          <h2 className="sep-section-title">Eligibility and Terms</h2>
          <p className="sep-section-sub">New quotation under this period is eligible for this offer.</p>
          <div className="sep-eli-list">
            {eligibility.map((item, i) => (
              <div key={i} className="sep-eli-item">
                <div className="sep-eli-icon">{item.icon}</div>
                <div className="sep-eli-text">{item.text}</div>
              </div>
            ))}
          </div>
        </section>

        {/* CONTACT BAR */}
        <div className="sep-contact">
          <div className="sep-contact-item">
            <Phone size={16} style={{ color: '#C9A84C' }} />
            Call Us: <a href="tel:9433889668">9433889668</a>
          </div>
          <div className="sep-contact-item">
            <Gift size={16} style={{ color: '#C9A84C' }} />
            <a href="https://www.cherrygoldinteriors.com" target="_blank" rel="noopener noreferrer">
              www.cherrygoldinteriors.com
            </a>
          </div>
        </div>

        <div className="sep-footer-note">Luxury Spaces. Timeless Elegance. Made Just For You.</div>

        {/* POPUP MODAL */}
        {showPopup && (
          <div className="sep-popup-overlay" onClick={(e) => { if (e.target === e.currentTarget) setShowPopup(false); }}>
            <div className="sep-popup">
              <button className="sep-popup-close" onClick={() => setShowPopup(false)}>
                <X size={15} />
              </button>
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <div style={{ fontSize: '40px', marginBottom: '10px' }}>✨</div>
                <h3>{popupTitle}</h3>
                <p>{popupSubtitle}</p>
              </div>

              <div className="sep-popup-input-wrap">
                <User size={15} />
                <input
                  className="sep-popup-input"
                  type="text"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="sep-popup-input-wrap">
                <Phone size={15} />
                <input
                  className="sep-popup-input"
                  type="tel"
                  placeholder="Mobile Number"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              {!showOtpField ? (
                <button className="sep-btn-gold" style={{ width: '100%' }} onClick={handleSendOtp}>
                  Send OTP
                </button>
              ) : (
                <>
                  <input
                    className="sep-popup-input"
                    type="text"
                    placeholder="Enter OTP"
                    value={formData.otp}
                    style={{ textAlign: 'center', letterSpacing: '6px', fontSize: '20px', paddingLeft: '14px' }}
                    onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
                  />
                  <button className="sep-btn-gold" style={{ width: '100%' }} onClick={handleSubmitForm}>
                    Verify and Claim Offer
                  </button>
                </>
              )}

              <p className="sep-popup-note">By submitting, you agree to receive offers via SMS / WhatsApp</p>
            </div>
          </div>
        )}

      </div>
    </>
  );
};

export default Offers;
