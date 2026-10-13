// frontend/src/Components/Chatbot.jsx
import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  Calculator,
  Calendar,
  Phone,
  Search,
  AlertCircle,
  Info,
  Mic,
  MicOff,
  FileText,
  Zap,
  Sparkles,
  CheckCircle,
  Clock,
  Maximize2,
  Minimize2,
  Minus,
  RotateCcw,
  Crown,
  Layers,
  ArrowRight,
  ExternalLink
} from "lucide-react";
import cherryEmblem from "../assets/cherry-gold-emblem.png";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [leadData, setLeadData] = useState({
    name: "", phone: "", email: "", city: "", roomType: "", budget: ""
  });
  const [budgetCalc, setBudgetCalc] = useState({
    height: "", width: "", package: 'basic', roomType: ""
  });
  const [projectCode, setProjectCode] = useState("");
  const [projectData, setProjectData] = useState(null);
  const [currentFlow, setCurrentFlow] = useState('main');
  const [userPreferences, setUserPreferences] = useState({
    name: localStorage.getItem('chatbot_user_name') || '',
    preferredContact: localStorage.getItem('chatbot_preferred_contact') || 'phone'
  });
  const [chatHistory, setChatHistory] = useState([]);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  const packages = {
    basic: { rate: 1200, name: "Basic Luxury Package" },
    premium: { rate: 1800, name: "Premium Royal Package" },
    luxury: { rate: 2500, name: "Imperia Ultra-Luxury" }
  };

  const faqData = {
    services: "We offer bespoke modular kitchens, luxury wardrobes, acoustic false ceilings, TV entertainment units, king master bedrooms, wall paneling, and turnkey 3D architectural execution.",
    locations: "Headquartered in Kolkata, with turnkey project execution available across Mumbai, Pune, Ranchi, Hyderabad, and other metropolitan cities on request.",
    costs: "Basic Package: ₹1,200/sqft • Premium: ₹1,800/sqft • Ultra-Luxury: ₹2,500/sqft. Includes 3D blueprints, IS 710 BWP plywood carcass, Hafele hardware, and master installation.",
    timeline: "Modular Kitchens: 21-28 days • Walk-in Wardrobes: 14-21 days • Turnkey Villas & Full Homes: 60-90 days with guaranteed on-time penalty clause.",
    warranty: "20-Year Anti-Delamination & Termite Warranty on BWP Carcass, 10-Year Warranty on Hafele / Hettich soft-close hydraulics, and 5-Year finish maintenance cover.",
    payment: "Structured 4-Phase Escrow: 20% Initial Booking • 40% Design & 3D Approval • 30% Factory Manufacturing • 10% Final White-Glove Handover. Zero-cost EMI available.",
    booking: "You can book directly via our Services page, call our Chief Architect at +91 9433889668, or chat with our Concierge right here.",
    howwework: "Our 5-Stage Journey: 1) Site Laser Audit 2) 3D Virtual Elevation 3) Factory Precision Tooling 4) White-Glove Assembly 5) 20-Year Certified Handover."
  };

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const addMessage = useCallback((content, type, options, showBudgetCalculator, showLeadForm, showProjectTracker) => {
    const newMessage = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date(),
      options,
      showBudgetCalculator,
      showLeadForm,
      showProjectTracker,
      isNew: true
    };
    setMessages(prev => [...prev, newMessage]);

    if (type === 'user' || type === 'bot') {
      setChatHistory(prev => [...prev.slice(-20), newMessage]);
    }
  }, []);

  const addBotMessage = useCallback((content, options, showBudgetCalculator = false, showLeadForm = false, showProjectTracker = false) => {
    setIsTyping(true);
    const typingDelay = Math.min(content.length * 12, 1200);
    setTimeout(() => {
      setIsTyping(false);
      addMessage(content, 'bot', options, showBudgetCalculator, showLeadForm, showProjectTracker);
    }, typingDelay);
  }, [addMessage]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const greeting = userPreferences.name
        ? `Welcome back, ${userPreferences.name}! ✨ Good to see you again at Cherry Gold Interiors!`
        : "Namaste! 👋 Welcome to Cherry Gold Interiors. I'm your AI Concierge, here to craft your bespoke dream space:";

      const welcomeMessage = userPreferences.name
        ? `${greeting}\n\n👑 **What would you like to explore today?**`
        : `${greeting}\n\n🏛️ Bespoke 3D Interior Design Guidance\n💰 Instant Turnkey Budget Estimation\n📞 Book Free Site Measurement & Consultation\n🍳 Interactive 3D Kitchen Designer (50+ Finishes)\n📋 Real-Time Project Status Tracking\n🎁 Exclusive Seasonal Privileges & Offers\n\n✨ **Choose an option below or type your query:**`;

      addBotMessage(welcomeMessage, [
        { text: "💰 Instant Budget Calculator", action: () => handleOptionClick("Get Budget Estimate") },
        { text: "📞 Book Free Consultation", action: () => handleOptionClick("Book Consultation") },
        { text: "🍳 3D Kitchen Designer", action: () => handleOptionClick("Kitchen Designer") },
        { text: "📋 Track Project Status", action: () => handleOptionClick("Track My Project") },
        { text: "📊 Cost Estimator Tool", action: () => handleOptionClick("Cost Estimator") },
        { text: "🎁 Current Offers", action: () => handleOptionClick("Current Offers") },
        { text: "📸 View Portfolio", action: () => handleOptionClick("View Portfolio") },
        { text: "🛍️ Browse Services", action: () => handleOptionClick("Browse Services") },
        { text: "💎 VIP Refer & Earn", action: () => handleOptionClick("Refer & Earn") },
        { text: "❓ FAQ & Support", action: () => handleOptionClick("FAQ") }
      ]);
    }
  }, [isOpen, userPreferences.name, addBotMessage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      alert('Voice recognition is not supported in this browser.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    addMessage(inputValue, 'user');
    processUserMessage(inputValue);
    setInputValue("");
  };

  const processUserMessage = (message) => {
    const lowerMessage = message.toLowerCase();

    switch (currentFlow) {
      case 'leadCollection':
        handleLeadCollection(lowerMessage);
        break;
      case 'budgetEstimation':
        handleBudgetEstimation(lowerMessage);
        break;
      case 'projectTracking':
        handleProjectTracking(lowerMessage);
        break;
      default:
        handleGeneralInput(lowerMessage);
    }
  };

  const handleGeneralInput = (message) => {
    const responses = {
      greetings: ['hello', 'hi', 'hey', 'namaste', 'good morning', 'good afternoon', 'good evening'],
      services: ['service', 'what do you offer', 'what can you do', 'offerings', 'specialties', 'work'],
      location: ['location', 'where', 'city', 'area', 'serve', 'available', 'kolkata'],
      cost: ['cost', 'price', 'budget', 'expensive', 'cheap', 'affordable', 'rate', 'sqft'],
      time: ['time', 'duration', 'how long', 'timeline', 'when', 'schedule', 'days'],
      warranty: ['warranty', 'guarantee', 'protection', 'termite'],
      payment: ['payment', 'emi', 'installment', 'pay', 'finance'],
      booking: ['book', 'appointment', 'consultation', 'schedule', 'meet', 'visit'],
      tracking: ['track', 'status', 'project', 'progress', 'update', 'uwc'],
      help: ['faq', 'help', 'support', 'question', 'doubt'],
      thanks: ['thank', 'thanks', 'appreciate', 'shukriya'],
      goodbye: ['bye', 'goodbye', 'see you', 'later', 'exit']
    };

    const getResponseType = (msg) => {
      for (const [type, keywords] of Object.entries(responses)) {
        if (keywords.some(keyword => msg.includes(keyword))) {
          return type;
        }
      }
      return 'general';
    };

    const responseType = getResponseType(message);

    switch (responseType) {
      case 'greetings':
        addBotMessage("Namaste! 😊 Welcome to Cherry Gold Interiors! How can our design team help elevate your space today?", [
          { text: "💰 Instant Budget Calculator", action: () => handleOptionClick("Get Budget Estimate") },
          { text: "📞 Book Free Consultation", action: () => handleOptionClick("Book Consultation") },
          { text: "🍳 3D Kitchen Designer", action: () => handleOptionClick("Kitchen Designer") }
        ]);
        break;

      case 'services':
        addBotMessage("👑 " + faqData.services + "\n\nWhich space would you like to design first?", [
          { text: "🍳 3D Kitchen Designer", action: () => handleOptionClick("Kitchen Designer") },
          { text: "💰 Turnkey Budget Estimate", action: () => handleOptionClick("Get Budget Estimate") },
          { text: "📸 View Portfolio", action: () => handleOptionClick("View Portfolio") }
        ]);
        break;

      case 'location':
        addBotMessage("📍 " + faqData.locations + "\n\nWould you like our senior architect to visit your site for free laser measurement?", [
          { text: "📞 Book Free Site Visit", action: () => handleOptionClick("Book Consultation") },
          { text: "💰 Calculate Budget", action: () => handleOptionClick("Get Budget Estimate") }
        ]);
        break;

      case 'cost':
        addBotMessage("💰 " + faqData.costs + "\n\n✨ Want an instant calculation for your exact room dimensions?", [
          { text: "💰 Calculate My Budget", action: () => handleOptionClick("Get Budget Estimate") },
          { text: "📞 Book Free Site Visit", action: () => handleOptionClick("Book Consultation") }
        ]);
        break;

      case 'time':
        addBotMessage("⏰ " + faqData.timeline + "\n\nReady to get your 3D blueprints started?", [
          { text: "📞 Book Consultation", action: () => handleOptionClick("Book Consultation") },
          { text: "How We Work", action: () => handleOptionClick("How We Work") }
        ]);
        break;

      case 'warranty':
        addBotMessage("🛡️ " + faqData.warranty + "\n\nEvery project includes our certified stamp and official warranty certificate.", [
          { text: "📞 Book Free Consultation", action: () => handleOptionClick("Book Consultation") },
          { text: "How We Work", action: () => handleOptionClick("How We Work") }
        ]);
        break;

      case 'payment':
        addBotMessage("💳 " + faqData.payment, [
          { text: "💰 Calculate Budget", action: () => handleOptionClick("Get Budget Estimate") },
          { text: "📞 Discuss with Consultant", action: () => handleOptionClick("Book Consultation") }
        ]);
        break;

      case 'booking':
        handleOptionClick("Book Consultation");
        break;

      case 'tracking':
        handleOptionClick("Track My Project");
        break;

      case 'help':
        handleOptionClick("FAQ");
        break;

      case 'thanks':
        addBotMessage("It is our absolute pleasure! ✨ If you have any more questions about layouts, materials, or finishes, I'm right here for you.", [
          { text: "💰 Calculate Budget", action: () => handleOptionClick("Get Budget Estimate") },
          { text: "📞 Book Site Visit", action: () => handleOptionClick("Book Consultation") }
        ]);
        break;

      case 'goodbye':
        addBotMessage("Thank you for visiting Cherry Gold Interiors! 👋 May your home become a masterpiece. Have a wonderful day! 🥂", [
          { text: "Start Fresh Chat", action: () => clearChat() },
          { text: "Book Consultation", action: () => handleOptionClick("Book Consultation") }
        ]);
        break;

      default:
        addBotMessage("I'm here to assist you with all aspects of luxury home interiors! 🏛️ Here are the most popular concierge services available right now:", [
          { text: "💰 Instant Budget Calculator", action: () => handleOptionClick("Get Budget Estimate") },
          { text: "📞 Book Free Consultation", action: () => handleOptionClick("Book Consultation") },
          { text: "🍳 3D Kitchen Designer", action: () => handleOptionClick("Kitchen Designer") },
          { text: "📋 Track Project Status", action: () => handleOptionClick("Track My Project") },
          { text: "🎁 Current Offers", action: () => handleOptionClick("Current Offers") },
          { text: "❓ FAQ & Support", action: () => handleOptionClick("FAQ") }
        ]);
    }
  };

  const handleOptionClick = (option) => {
    addMessage(option, 'user');

    switch (option) {
      case "Get Budget Estimate":
        setCurrentFlow('budgetEstimation');
        addBotMessage("Let's calculate your turnkey budget! 📐 What is the length of your room in feet (e.g. 12)?", [], true);
        break;

      case "Book Consultation":
        setCurrentFlow('leadCollection');
        addBotMessage("Splendid! Let's arrange a free design consultation. What is your full name?", [], false, true);
        break;

      case "Track My Project":
        setCurrentFlow('projectTracking');
        addBotMessage("Please enter your Project Code, Service Number, or Unique Work Code (e.g. CG2024001 or CG-2025-VILLA1):", [], false, false, true);
        break;

      case "Browse Services":
        addBotMessage("👑 **Our Turnkey Bespoke Offerings:**\n\n🍳 **Modular Kitchens** — From ₹1,50,000 (Lacquered Glass, Acrylics, Veneers)\n🛏️ **Master Bedrooms & Wardrobes** — From ₹1,20,000\n🛋️ **Living & Entertainment Lounges** — From ₹1,80,000\n🏠 **Turnkey Complete Home Execution** — From ₹5,00,000\n\nExplore our interactive design tools:", [
          { text: "🍳 3D Kitchen Designer", action: () => handleOptionClick("Kitchen Designer") },
          { text: "📊 Full Cost Estimator", action: () => handleOptionClick("Cost Estimator") },
          { text: "📸 View Portfolio", action: () => handleOptionClick("View Portfolio") }
        ]);
        break;

      case "How We Work":
        addBotMessage(faqData.howwework, [
          { text: "📞 Book Consultation", action: () => handleOptionClick("Book Consultation") },
          { text: "💰 Calculate Budget", action: () => handleOptionClick("Get Budget Estimate") }
        ]);
        break;

      case "Kitchen Designer":
        addBotMessage("🍳 **Interactive 3D Kitchen Designer:**\n\n• Real-time 3D camera angles (Front, 45° Isometric, Top)\n• 50+ German-engineered finishes (Lacquered Glass, Acrylics, Wood Veneers, Super-Matte Laminates)\n• L-Shaped & U-Shaped floor configurations\n• Instant turnkey quotation preview & blueprint download!", [
          { text: "🚀 Launch 3D Kitchen Studio", action: () => window.location.href = '/kitchen-designer' },
          { text: "📞 Book Kitchen Consultation", action: () => handleOptionClick("Book Consultation") },
          { text: "💰 Get Quick Budget", action: () => handleOptionClick("Get Budget Estimate") }
        ]);
        break;

      case "Cost Estimator":
        addBotMessage("📊 **Advanced Turnkey Cost Estimator:**\n\nConfigure room-by-room specifications, choose between Basic (₹1,200), Premium (₹1,800), and Luxury (₹2,500) tiers, and get a complete line-item PDF breakdown.", [
          { text: "🧮 Open Cost Estimator", action: () => window.location.href = '/cost-estimator' },
          { text: "📞 Schedule Site Visit", action: () => handleOptionClick("Book Consultation") }
        ]);
        break;

      case "View Portfolio":
        addBotMessage("📸 **Cherry Gold Design Gallery:**\n\nBrowse 500+ completed turnkey luxury residences, modular kitchens, and penthouses executed across Kolkata and India.", [
          { text: "🖼️ Browse Portfolio", action: () => window.location.href = '/portfolio' },
          { text: "📞 Discuss My Space", action: () => handleOptionClick("Book Consultation") }
        ]);
        break;

      case "Current Offers":
        addBotMessage("🎁 **Royal Seasonal Privileges:**\n\n• Up to ₹1,50,000 Festive Cashback on Turnkey Full Homes\n• Free 3D Photorealistic Architectural Walkthrough\n• Zero-Cost 12-Month EMI on Select Packages\n• Complimentary Hafele Soft-Close Hardware Upgrade!", [
          { text: "🎯 View All Offers", action: () => window.location.href = '/offers' },
          { text: "📞 Claim This Offer", action: () => handleOptionClick("Book Consultation") }
        ]);
        break;

      case "Refer & Earn":
        addBotMessage("💎 **Cherry Gold Ambassador Club:**\n\nEarn up to ₹15,000 instant direct bank reward for every friend or neighbor who books their turnkey home with us. Zero limits!", [
          { text: "👑 Ambassador Dashboard", action: () => window.location.href = '/refer-earn' },
          { text: "📞 Refer a Friend", action: () => handleOptionClick("Book Consultation") }
        ]);
        break;

      case "FAQ":
        addBotMessage("❓ **Frequently Asked Questions:**\n\nSelect a topic below for instant verification:", [
          { text: "What services do you offer?", action: () => addBotMessage("🌟 " + faqData.services) },
          { text: "Which cities do you serve?", action: () => addBotMessage("📍 " + faqData.locations) },
          { text: "What are your package rates?", action: () => addBotMessage("💰 " + faqData.costs) },
          { text: "What is the project timeline?", action: () => addBotMessage("⏰ " + faqData.timeline) },
          { text: "What warranty is provided?", action: () => addBotMessage("🛡️ " + faqData.warranty) },
          { text: "🔙 Return to Main Menu", action: () => showMainMenu() }
        ]);
        break;

      default:
        addBotMessage("How else may I assist you with your interior design journey?", [
          { text: "💰 Instant Budget Calculator", action: () => handleOptionClick("Get Budget Estimate") },
          { text: "📞 Book Free Consultation", action: () => handleOptionClick("Book Consultation") }
        ]);
    }
  };

  const showMainMenu = () => {
    setCurrentFlow('main');
    addBotMessage("How else can our Concierge assist you today?", [
      { text: "💰 Instant Budget Calculator", action: () => handleOptionClick("Get Budget Estimate") },
      { text: "📞 Book Free Consultation", action: () => handleOptionClick("Book Consultation") },
      { text: "🍳 3D Kitchen Designer", action: () => handleOptionClick("Kitchen Designer") },
      { text: "📋 Track Project Status", action: () => handleOptionClick("Track My Project") },
      { text: "🎁 Current Offers", action: () => handleOptionClick("Current Offers") },
      { text: "❓ FAQ & Support", action: () => handleOptionClick("FAQ") }
    ]);
  };

  const clearChat = () => {
    setMessages([]);
    setChatHistory([]);
    setCurrentFlow('main');
    setTimeout(() => {
      addBotMessage("Conversation reset! ✨ How can I assist you with your home interior today?", [
        { text: "💰 Instant Budget Calculator", action: () => handleOptionClick("Get Budget Estimate") },
        { text: "📞 Book Free Consultation", action: () => handleOptionClick("Book Consultation") },
        { text: "🍳 3D Kitchen Designer", action: () => handleOptionClick("Kitchen Designer") },
        { text: "📋 Track Project Status", action: () => handleOptionClick("Track My Project") }
      ]);
    }, 300);
  };

  const calculateBudget = () => {
    const { height, width, package: pkg } = budgetCalc;
    if (!height || !width || !pkg) {
      addBotMessage("Please provide both length and width for an accurate calculation. 📐", [], true);
      return;
    }

    const area = parseFloat(height) * parseFloat(width);
    const rate = packages[pkg].rate;
    const totalCost = area * rate;
    const designCost = Math.round(totalCost * 0.15);
    const materialCost = Math.round(totalCost * 0.60);
    const laborCost = Math.round(totalCost * 0.25);

    addBotMessage(`🎉 **Turnkey Budget Breakdown**\n\n📐 **Dimensions:** ${height}' × ${width}' (${area} sq.ft)\n📦 **Tier:** ${packages[pkg].name} (₹${rate.toLocaleString('en-IN')}/sq.ft)\n\n💎 **Cost Allocation:**\n🎨 3D Architectural CAD & Planning: ₹${designCost.toLocaleString('en-IN')}\n🏗️ IS 710 Carcass & Hafele Hardware: ₹${materialCost.toLocaleString('en-IN')}\n👷 Master White-Glove Installation: ₹${laborCost.toLocaleString('en-IN')}\n\n✨ **Turnkey Total: ₹${totalCost.toLocaleString('en-IN')}**\n\n*Preliminary estimate. Includes 20-year carcass warranty & zero hidden charges.*`, [
      { text: "📞 Lock Quote & Book Visit", action: () => handleOptionClick("Book Consultation") },
      { text: "🔄 Recalculate Dimensions", action: () => setBudgetCalc({ height: "", width: "", package: 'basic', roomType: "" }) }
    ]);
  };

  const handleBudgetEstimation = (input) => {
    if (!budgetCalc.height) {
      const length = parseFloat(input);
      if (isNaN(length)) {
        addBotMessage("Please enter a valid numeric value for length (e.g. 12):", [], true);
        return;
      }
      setBudgetCalc(prev => ({ ...prev, height: input }));
      addBotMessage("And what is the width of the room in feet (e.g. 10)?", [], true);
    } else if (!budgetCalc.width) {
      const width = parseFloat(input);
      if (isNaN(width)) {
        addBotMessage("Please enter a valid numeric value for width (e.g. 10):", [], true);
        return;
      }
      setBudgetCalc(prev => ({ ...prev, width: input }));
      addBotMessage("Which luxury package tier would you like to price?", [
        { text: "Basic (₹1,200/sqft)", action: () => setBudgetCalc(prev => ({ ...prev, package: 'basic' })) },
        { text: "Premium (₹1,800/sqft)", action: () => setBudgetCalc(prev => ({ ...prev, package: 'premium' })) },
        { text: "Luxury (₹2,500/sqft)", action: () => setBudgetCalc(prev => ({ ...prev, package: 'luxury' })) }
      ], true);
    }
  };

  const submitLeadForm = () => {
    const { name, phone, email } = leadData;

    if (!name.trim()) {
      addBotMessage("Please provide your full name to reserve your consultation.", [], false, true);
      return;
    }

    if (!phone.trim() || !/^\d{10}$/.test(phone.replace(/\D/g, ''))) {
      addBotMessage("Please enter a valid 10-digit mobile number.", [], false, true);
      return;
    }

    localStorage.setItem('chatbot_user_name', name);
    localStorage.setItem('chatbot_lead', JSON.stringify(leadData));
    setUserPreferences(prev => ({ ...prev, name }));

    const referenceId = `CG${new Date().getFullYear().toString().slice(-2)}${Math.floor(1000 + Math.random() * 9000)}`;

    addBotMessage(`🎉 **Consultation Confirmed, ${name}!**\n\n📋 **Service Reference ID:** ${referenceId}\n📞 Senior Architect Callback: Within 2 Business Hours\n📍 Location: ${leadData.city || 'Kolkata'}\n🏡 Scope: ${leadData.roomType || 'Complete Home'}\n\nOur design consultant will contact you to confirm your convenient slot for site laser measurement!`, [
      { text: "💰 Instant Budget Calculator", action: () => handleOptionClick("Get Budget Estimate") },
      { text: "🍳 3D Kitchen Designer", action: () => handleOptionClick("Kitchen Designer") },
      { text: "📋 Track Project Status", action: () => handleOptionClick("Track My Project") }
    ]);

    setLeadData({ name: "", phone: "", email: "", city: "", roomType: "", budget: "" });
    setCurrentFlow('main');
  };

  const handleLeadCollection = (input) => {
    if (!leadData.name) {
      setLeadData(prev => ({ ...prev, name: input }));
      addBotMessage("What is your mobile number?", [], false, true);
    } else if (!leadData.phone) {
      setLeadData(prev => ({ ...prev, phone: input }));
      addBotMessage("What is your email address?", [], false, true);
    } else if (!leadData.email) {
      setLeadData(prev => ({ ...prev, email: input }));
      addBotMessage("Which city is the property located in?", [], false, true);
    } else if (!leadData.city) {
      setLeadData(prev => ({ ...prev, city: input }));
      addBotMessage("What type of space are you planning?", [
        { text: "Modular Kitchen", action: () => setLeadData(prev => ({ ...prev, roomType: "Modular Kitchen" })) },
        { text: "Complete Home", action: () => setLeadData(prev => ({ ...prev, roomType: "Complete Home" })) },
        { text: "Master Bedroom", action: () => setLeadData(prev => ({ ...prev, roomType: "Master Bedroom" })) },
        { text: "Living & Dining", action: () => setLeadData(prev => ({ ...prev, roomType: "Living & Dining" })) }
      ], false, true);
    } else if (!leadData.roomType) {
      setLeadData(prev => ({ ...prev, roomType: input }));
      addBotMessage("What is your expected budget range?", [
        { text: "₹2-5 Lakhs", action: () => setLeadData(prev => ({ ...prev, budget: "2-5" })) },
        { text: "₹5-10 Lakhs", action: () => setLeadData(prev => ({ ...prev, budget: "5-10" })) },
        { text: "₹10-20 Lakhs", action: () => setLeadData(prev => ({ ...prev, budget: "10-20" })) },
        { text: "₹20+ Lakhs (Luxury Villa)", action: () => setLeadData(prev => ({ ...prev, budget: "20+" })) }
      ], false, true);
    } else if (!leadData.budget) {
      setLeadData(prev => ({ ...prev, budget: input }));
      submitLeadForm();
    }
  };

  const trackProject = () => {
    if (!projectCode.trim()) {
      addBotMessage("Please enter your Project Code or Service Number (e.g. CG2024001 or CG-2025-VILLA1):", [], false, false, true);
      return;
    }

    const mockProjects = {
      "CG2024001": {
        serviceNumber: "CG2024001",
        customerName: "Amit Sharma",
        projectType: "Modular Kitchen",
        startDate: "2024-01-15",
        expectedCompletion: "2024-02-15",
        status: "In Progress",
        currentStage: "Precision Manufacturing",
        progress: 60
      },
      "CG-2025-VILLA1": {
        serviceNumber: "CG-2025-VILLA1",
        customerName: "Vikramaditya Roy",
        projectType: "Complete 4BHK Villa Interior",
        startDate: "2025-01-10",
        expectedCompletion: "2025-03-30",
        status: "In Progress",
        currentStage: "Hardware & On-Site Installation",
        progress: 78
      },
      "ISHMA": {
        serviceNumber: "IS2025001",
        customerName: "Ishma Sound Studio",
        projectType: "Acoustic Commercial Studio",
        startDate: "2025-07-01",
        expectedCompletion: "2025-08-15",
        status: "In Progress",
        currentStage: "3D CAD Blueprint Approval",
        progress: 35
      }
    };

    const project = mockProjects[projectCode.toUpperCase()];

    if (project) {
      setProjectData(project);
      addBotMessage(`📋 **Live Milestone for ${projectCode.toUpperCase()}:**\n\n🏛️ **Client:** ${project.customerName}\n🏗️ **Scope:** ${project.projectType}\n🔄 **Status:** ${project.status} (${project.progress}% Complete)\n🛠️ **Current Milestone:** ${project.currentStage}\n⏰ **Estimated Handover:** ${project.expectedCompletion}\n\n✨ All quality audit parameters meet IS 710 certification benchmarks.`, [
        { text: "🔍 Open Dedicated Tracking Page", action: () => window.location.href = `/track-project?serviceNo=${encodeURIComponent(project.serviceNumber)}` },
        { text: "📞 Contact Dedicated Manager", action: () => addBotMessage("Direct concierge hotline: +91 9433889668. Our team is available 7 days a week! 📞") },
        { text: "Track Another Code", action: () => handleOptionClick("Track My Project") }
      ]);
    } else {
      setProjectData(null);
      addBotMessage(`❌ Project code "${projectCode.toUpperCase()}" was not found in active records.\n\n💡 Try demo codes: **CG-2025-VILLA1** or **CG2024001**, or check your reservation receipt.`, [
        { text: "Try Code: CG-2025-VILLA1", action: () => { setProjectCode("CG-2025-VILLA1"); trackProject(); } },
        { text: "📞 Call Helpline", action: () => addBotMessage("Call our concierge at +91 9433889668. We'll look up your record instantly! 📞") },
        { text: "Try Again", action: () => handleOptionClick("Track My Project") }
      ]);
    }

    setProjectCode("");
    setCurrentFlow('main');
  };

  const handleProjectTracking = (input) => {
    setProjectCode(input);
    trackProject();
  };

  return (
    <>
      {/* ================= FLOATING LAUNCHER (SHOWN WHEN CLOSED) ================= */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50">
          <div className="relative group">
            {/* Glowing Golden Ambient Ping */}
            <span className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#C0142B] opacity-75 blur-sm group-hover:opacity-100 transition-opacity animate-pulse pointer-events-none" />

            <button
              onClick={() => setIsOpen(true)}
              className="relative w-14 h-14 rounded-full bg-gradient-to-br from-[#1E090C] via-[#350D14] to-[#120406] border-2 border-[#D4AF37] shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex items-center justify-center p-2.5 hover:scale-105 active:scale-95 transition-all cursor-pointer group"
              aria-label="Open Cherry Gold AI Concierge"
            >
              <img
                src={cherryEmblem}
                alt="Cherry Gold Monogram"
                className="w-full h-full object-contain filter drop-shadow-[0_2px_6px_rgba(212,175,55,0.4)] group-hover:scale-110 transition-transform"
              />
              
              {/* Unread Sparkle Badge */}
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#C0142B] border-2 border-white text-white rounded-full flex items-center justify-center shadow-md">
                <Sparkles className="w-2.5 h-2.5 text-white" />
              </div>
            </button>

            {/* Hover Tooltip Pill */}
            <div className="absolute bottom-16 right-0 bg-[#1E090C] text-[#F3E5AB] border border-[#D4AF37]/40 text-xs px-3.5 py-1.5 rounded-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all pointer-events-none shadow-xl">
              Cherry Gold AI Concierge ✨
            </div>
          </div>
        </div>
      )}

      {/* ================= REDESIGNED LUXURY CHAT WINDOW (WHEN OPEN) ================= */}
      {isOpen && (
        <div
          className={`fixed z-50 flex flex-col bg-[#FAF7F2] border border-[#D4AF37]/50 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.45)] transition-all duration-300 font-sans ${
            isMinimized
              ? 'bottom-6 right-6 w-80 sm:w-96 h-16 rounded-2xl overflow-hidden'
              : `rounded-3xl overflow-hidden ${
                  // Responsive height & width: never clips off screen
                  isExpanded
                    ? 'bottom-4 sm:bottom-6 right-3 sm:right-6 w-[calc(100vw-24px)] sm:w-[540px] max-w-[calc(100vw-24px)] h-[calc(100vh-90px)] max-h-[640px]'
                    : 'bottom-4 sm:bottom-6 right-3 sm:right-6 w-[calc(100vw-24px)] sm:w-[410px] max-w-[calc(100vw-24px)] h-[calc(100vh-90px)] max-h-[580px]'
                }`
          }`}
        >

          {/* ================= ROYAL HEADER WITH CHERRY GOLD MONOGRAM ================= */}
          <div className="bg-gradient-to-r from-[#1A0609] via-[#2F0D14] to-[#140407] text-white py-3 px-4 flex items-center justify-between border-b border-[#D4AF37]/40 shrink-0">
            
            {/* Left: Brand Monogram & Status */}
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#2A0E13] via-[#1E090C] to-[#120406] border border-[#D4AF37]/60 p-1 flex items-center justify-center shadow-md shrink-0">
                <img 
                  src={cherryEmblem} 
                  alt="Cherry Gold Emblem" 
                  className="w-full h-full object-contain filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]" 
                />
              </div>
              <div className="leading-tight">
                <div className="flex items-center gap-1.5">
                  <span className="font-serif font-bold text-base sm:text-lg tracking-tight text-white leading-none">
                    <span className="text-[#FF4A60]">Cherry</span> <span className="bg-gradient-to-r from-[#F7E198] via-[#D4AF37] to-[#C19B2A] bg-clip-text text-transparent">Gold</span>
                  </span>
                </div>
                <div className="text-[9px] uppercase tracking-[0.25em] text-[#D4AF37] font-semibold mt-0.5">
                  — INTERIORS —
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-gray-300 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse inline-block" />
                  <span>Online • AI Concierge</span>
                </div>
              </div>
            </div>

            {/* Right: Window Controls & AI 24/7 Badge */}
            <div className="flex items-center gap-1 sm:gap-1.5">
              <span className="px-2 py-0.5 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#B89222] text-[#1E090C] font-extrabold text-[10px] uppercase tracking-wider shadow-sm mr-0.5">
                AI 24/7
              </span>

              {/* Expand / Compact Width Toggle */}
              {!isMinimized && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-1.5 text-gray-300 hover:text-[#D4AF37] hover:bg-white/10 rounded-lg transition-all hidden sm:flex"
                  title={isExpanded ? "Standard Compact Width" : "Expand Studio Width"}
                >
                  {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
              )}

              {/* Reset Chat */}
              {!isMinimized && messages.length > 0 && (
                <button
                  onClick={clearChat}
                  className="p-1.5 text-gray-300 hover:text-[#D4AF37] hover:bg-white/10 rounded-lg transition-all"
                  title="Reset Conversation"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}

              {/* Minimize / Expand Height */}
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 text-gray-300 hover:text-[#D4AF37] hover:bg-white/10 rounded-lg transition-all"
                title={isMinimized ? "Expand Window" : "Minimize Window"}
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
              </button>

              {/* Close Window */}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-gray-300 hover:text-white hover:bg-red-900/60 rounded-lg transition-all"
                title="Close Concierge"
              >
                <X className="w-4 h-4" />
              </button>

            </div>
          </div>

          {/* ================= EXPANDED MESSAGES BODY ================= */}
          {!isMinimized && (
            <>
              {/* Messages Scroll Area */}
              <div className="flex-1 overflow-y-auto p-3.5 sm:p-4 space-y-3.5 bg-[#FAF7F2]">
                {messages.map((message) => (
                  <div key={message.id} className="space-y-2.5">
                    
                    {/* Message Bubble Row */}
                    <div className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`flex items-start gap-2.5 max-w-[88%] sm:max-w-[84%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                        
                        {/* Avatar */}
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
                          message.type === 'user'
                            ? 'bg-[#1E090C] text-[#D4AF37] border border-[#D4AF37]/30'
                            : 'bg-gradient-to-br from-[#2A0E13] to-[#140407] border border-[#D4AF37]/60 p-0.5'
                        }`}>
                          {message.type === 'user' ? (
                            <User className="w-3.5 h-3.5" />
                          ) : (
                            <img src={cherryEmblem} alt="Cherry Gold AI" className="w-full h-full object-contain" />
                          )}
                        </div>

                        {/* Bubble Content */}
                        <div className={`p-3.5 rounded-2xl shadow-sm border transition-all ${
                          message.type === 'user'
                            ? 'bg-gradient-to-r from-[#A71124] to-[#8C0D1B] text-white border-[#C0142B] rounded-tr-sm'
                            : 'bg-white text-[#2C1810] border-[#EBDCCF] rounded-tl-sm'
                        }`}>
                          <div className="text-xs sm:text-[13px] leading-relaxed whitespace-pre-line font-normal">
                            {message.content}
                          </div>
                          
                          <div className={`text-[10px] mt-1.5 ${
                            message.type === 'user' ? 'text-rose-200 text-right' : 'text-gray-400'
                          }`}>
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>

                      </div>
                    </div>

                    {/* Quick Action Suggestion Options */}
                    {message.options && (
                      <div className="flex flex-wrap gap-1.5 ml-9 sm:ml-10">
                        {message.options.map((option, optIdx) => (
                          <button
                            key={optIdx}
                            onClick={() => option.action()}
                            className="bg-white hover:bg-[#FFFDF5] text-[#1E090C] hover:text-[#C0142B] border border-[#D4AF37]/50 hover:border-[#C0142B] shadow-sm rounded-full px-3 py-1.5 text-xs font-semibold tracking-wide transition-all transform hover:scale-[1.02] active:scale-95 flex items-center gap-1.5"
                          >
                            <span>{option.text}</span>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Interactive Budget Calculator Widget */}
                    {message.showBudgetCalculator && (
                      <div className="ml-9 sm:ml-10 p-4 bg-white border border-[#D4AF37]/60 rounded-2xl shadow-md space-y-3">
                        <div className="flex items-center gap-2 text-xs font-serif font-bold text-[#1E090C]">
                          <Calculator className="w-4 h-4 text-[#C0142B]" />
                          <span>Turnkey Budget Estimator</span>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[10px] text-gray-500 uppercase font-semibold">Length (ft)</label>
                            <input
                              type="number"
                              placeholder="e.g. 12"
                              value={budgetCalc.height}
                              onChange={(e) => setBudgetCalc(prev => ({ ...prev, height: e.target.value }))}
                              className="w-full p-2 bg-[#FCFAF7] border border-[#E5D7C9] focus:border-[#D4AF37] rounded-xl text-xs text-gray-800"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-gray-500 uppercase font-semibold">Width (ft)</label>
                            <input
                              type="number"
                              placeholder="e.g. 10"
                              value={budgetCalc.width}
                              onChange={(e) => setBudgetCalc(prev => ({ ...prev, width: e.target.value }))}
                              className="w-full p-2 bg-[#FCFAF7] border border-[#E5D7C9] focus:border-[#D4AF37] rounded-xl text-xs text-gray-800"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-[10px] text-gray-500 uppercase font-semibold">Luxury Tier</label>
                          <select
                            value={budgetCalc.package}
                            onChange={(e) => setBudgetCalc(prev => ({ ...prev, package: e.target.value }))}
                            className="w-full p-2 bg-[#FCFAF7] border border-[#E5D7C9] focus:border-[#D4AF37] rounded-xl text-xs text-gray-800"
                          >
                            <option value="basic">Basic Luxury — ₹1,200/sqft</option>
                            <option value="premium">Premium Royal — ₹1,800/sqft</option>
                            <option value="luxury">Imperia Ultra-Luxury — ₹2,500/sqft</option>
                          </select>
                        </div>

                        <button
                          onClick={calculateBudget}
                          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#A71124] to-[#8C0D1B] text-white font-serif font-bold text-xs uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all shadow-md"
                        >
                          Calculate Turnkey Budget
                        </button>
                      </div>
                    )}

                    {/* Interactive Lead Form Widget */}
                    {message.showLeadForm && (
                      <div className="ml-9 sm:ml-10 p-4 bg-white border border-[#D4AF37]/60 rounded-2xl shadow-md space-y-2.5">
                        <div className="flex items-center gap-2 text-xs font-serif font-bold text-[#1E090C]">
                          <Calendar className="w-4 h-4 text-[#C0142B]" />
                          <span>Book Free Design Consultation</span>
                        </div>

                        <div className="space-y-2">
                          <input
                            placeholder="Full Name *"
                            value={leadData.name}
                            onChange={(e) => setLeadData(prev => ({ ...prev, name: e.target.value }))}
                            className="w-full p-2 bg-[#FCFAF7] border border-[#E5D7C9] focus:border-[#D4AF37] rounded-xl text-xs text-gray-800"
                          />
                          <input
                            placeholder="Mobile Number (10 digits) *"
                            value={leadData.phone}
                            onChange={(e) => setLeadData(prev => ({ ...prev, phone: e.target.value }))}
                            className="w-full p-2 bg-[#FCFAF7] border border-[#E5D7C9] focus:border-[#D4AF37] rounded-xl text-xs text-gray-800"
                          />
                          <input
                            placeholder="Email Address (Optional)"
                            value={leadData.email}
                            onChange={(e) => setLeadData(prev => ({ ...prev, email: e.target.value }))}
                            className="w-full p-2 bg-[#FCFAF7] border border-[#E5D7C9] focus:border-[#D4AF37] rounded-xl text-xs text-gray-800"
                          />
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              placeholder="City (e.g. Kolkata)"
                              value={leadData.city}
                              onChange={(e) => setLeadData(prev => ({ ...prev, city: e.target.value }))}
                              className="w-full p-2 bg-[#FCFAF7] border border-[#E5D7C9] focus:border-[#D4AF37] rounded-xl text-xs text-gray-800"
                            />
                            <select
                              value={leadData.roomType}
                              onChange={(e) => setLeadData(prev => ({ ...prev, roomType: e.target.value }))}
                              className="w-full p-2 bg-[#FCFAF7] border border-[#E5D7C9] focus:border-[#D4AF37] rounded-xl text-xs text-gray-800"
                            >
                              <option value="">Space Type</option>
                              <option value="Modular Kitchen">Kitchen</option>
                              <option value="Complete Home">Full Home</option>
                              <option value="Master Bedroom">Bedroom</option>
                              <option value="Living Room">Living</option>
                            </select>
                          </div>
                        </div>

                        <button
                          onClick={submitLeadForm}
                          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#A71124] to-[#8C0D1B] text-white font-serif font-bold text-xs uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all shadow-md"
                        >
                          Confirm &amp; Request Callback
                        </button>
                      </div>
                    )}

                    {/* Interactive Project Tracker Widget */}
                    {message.showProjectTracker && (
                      <div className="ml-9 sm:ml-10 p-4 bg-white border border-[#D4AF37]/60 rounded-2xl shadow-md space-y-3">
                        <div className="flex items-center gap-2 text-xs font-serif font-bold text-[#1E090C]">
                          <Search className="w-4 h-4 text-[#C0142B]" />
                          <span>Track Milestone Status</span>
                        </div>

                        <div className="space-y-1.5">
                          <input
                            placeholder="Enter Code (e.g. CG-2025-VILLA1)"
                            value={projectCode}
                            onChange={(e) => setProjectCode(e.target.value)}
                            className="w-full p-2 bg-[#FCFAF7] border border-[#E5D7C9] focus:border-[#D4AF37] rounded-xl text-xs font-mono text-gray-800"
                          />
                          <p className="text-[10px] text-gray-400">
                            Demo codes: <strong>CG-2025-VILLA1</strong> or <strong>CG2024001</strong>
                          </p>
                        </div>

                        <button
                          onClick={trackProject}
                          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#A71124] to-[#8C0D1B] text-white font-serif font-bold text-xs uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all shadow-md"
                        >
                          Lookup Live Status
                        </button>
                      </div>
                    )}

                  </div>
                ))}

                {/* Live Typing Indicator */}
                {isTyping && (
                  <div className="flex items-center gap-2 ml-2 py-1 text-xs text-gray-500 font-medium">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#2A0E13] to-[#140407] border border-[#D4AF37]/60 flex items-center justify-center p-0.5 shrink-0">
                      <img src={cherryEmblem} alt="Cherry Gold AI" className="w-full h-full object-contain animate-pulse" />
                    </div>
                    <span>Concierge is writing...</span>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* ================= INPUT & QUICK ACTION TOOLBAR ================= */}
              <div className="p-3 bg-white border-t border-[#EFE4D6] shrink-0">
                
                {/* Input Textbox & Buttons */}
                <div className="flex items-center gap-2">
                  <div className="flex-1 relative">
                    <input
                      placeholder="Ask about design, budget, finishes... 💬"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                      className="w-full py-2.5 pl-3.5 pr-10 border border-[#E0D0C0] focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] rounded-xl text-xs sm:text-sm bg-[#FCFAF7] focus:bg-white text-gray-800 transition-all outline-none"
                      disabled={isTyping}
                    />

                    {/* Microphone Toggle Button */}
                    <button
                      type="button"
                      onClick={toggleVoiceInput}
                      className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-all ${
                        isListening
                          ? 'bg-red-500 text-white animate-pulse'
                          : 'text-gray-400 hover:text-gray-700'
                      }`}
                      title={isListening ? "Stop Voice Input" : "Voice Input"}
                    >
                      {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Send Button */}
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isTyping}
                    className="p-2.5 rounded-xl bg-gradient-to-r from-[#A71124] to-[#8C0D1B] hover:brightness-110 text-white shadow-md active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    title="Send Message"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>

                {/* Bottom Quick Feature Tag Chips */}
                <div className="flex items-center gap-1.5 mt-2.5 overflow-x-auto no-scrollbar pb-0.5">
                  <button
                    onClick={() => handleOptionClick("Get Budget Estimate")}
                    className="px-2.5 py-1 rounded-lg bg-[#FAF3EA] hover:bg-[#F3E5AB]/40 text-[#8C6D23] border border-[#E8DACB] text-[11px] font-semibold whitespace-nowrap transition-colors flex items-center gap-1 shrink-0"
                  >
                    <Calculator className="w-3 h-3 text-[#C0142B]" />
                    <span>Budget</span>
                  </button>
                  <button
                    onClick={() => handleOptionClick("Book Consultation")}
                    className="px-2.5 py-1 rounded-lg bg-[#FAF3EA] hover:bg-[#F3E5AB]/40 text-[#8C6D23] border border-[#E8DACB] text-[11px] font-semibold whitespace-nowrap transition-colors flex items-center gap-1 shrink-0"
                  >
                    <Calendar className="w-3 h-3 text-[#C0142B]" />
                    <span>Book Visit</span>
                  </button>
                  <button
                    onClick={() => handleOptionClick("Kitchen Designer")}
                    className="px-2.5 py-1 rounded-lg bg-[#FAF3EA] hover:bg-[#F3E5AB]/40 text-[#8C6D23] border border-[#E8DACB] text-[11px] font-semibold whitespace-nowrap transition-colors flex items-center gap-1 shrink-0"
                  >
                    <Crown className="w-3 h-3 text-[#C0142B]" />
                    <span>3D Kitchen</span>
                  </button>
                  <button
                    onClick={() => handleOptionClick("Track My Project")}
                    className="px-2.5 py-1 rounded-lg bg-[#FAF3EA] hover:bg-[#F3E5AB]/40 text-[#8C6D23] border border-[#E8DACB] text-[11px] font-semibold whitespace-nowrap transition-colors flex items-center gap-1 shrink-0"
                  >
                    <Search className="w-3 h-3 text-[#C0142B]" />
                    <span>Track Order</span>
                  </button>
                  <button
                    onClick={() => handleOptionClick("Current Offers")}
                    className="px-2.5 py-1 rounded-lg bg-[#FAF3EA] hover:bg-[#F3E5AB]/40 text-[#8C6D23] border border-[#E8DACB] text-[11px] font-semibold whitespace-nowrap transition-colors flex items-center gap-1 shrink-0"
                  >
                    <Sparkles className="w-3 h-3 text-[#C0142B]" />
                    <span>Offers</span>
                  </button>
                </div>

              </div>
            </>
          )}

        </div>
      )}
    </>
  );
};

export default ChatBot;