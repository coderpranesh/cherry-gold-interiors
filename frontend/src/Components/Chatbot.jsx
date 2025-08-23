import { useState, useRef, useEffect, useCallback } from "react";
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
  Clock
} from "lucide-react";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
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
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  const packages = {
    basic: { rate: 1200, name: "Basic Package" },
    premium: { rate: 1800, name: "Premium Package" },
    luxury: { rate: 2500, name: "Luxury Package" }
  };

  const faqData = {
    services: "We offer modular kitchens, wardrobes, false ceilings, TV units, bed designs, wallpapers, flooring, wall paneling, and complete home interiors with 3D design preview.",
    locations: "We serve Kolkata, and other cities on request. Free site visits available in service areas.",
    costs: "Basic: ₹1,200/sqft, Premium: ₹1,800/sqft, Luxury: ₹2,500/sqft. Includes design, materials, and installation. Use our budget calculator for estimates!",
    timeline: "Modular kitchens: 3-4 weeks, Wardrobes: 2-3 weeks, Complete homes: 8-12 weeks. Timeline depends on project complexity and approvals.",
    warranty: "Modular Kitchen & Wardrobes: 5 years, TV Units & Storage: 3 years, False Ceiling & Lighting: 2 years. Covers manufacturing defects and hardware failures.",
    payment: "Advance: 20%, Design Approval: 40%, Manufacturing Complete: 30%, Final Delivery: 10%. EMI options available.",
    booking: "You can book through our website forms, call +91 9876543210, or WhatsApp us. For rescheduling, contact our support team with your booking reference.",
    howwework: "Our process: 1) Free Consultation 2) Site Survey 3) 2D/3D Design 4) Material Selection 5) Execution 6) Quality Check 7) Handover"
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

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const greeting = userPreferences.name
        ? `Welcome back, ${userPreferences.name}! ✨ Great to see you again at Cherry Gold Interiors!`
        : "Hello! 👋 Welcome to Cherry Gold Interiors! I'm your AI assistant here to help you with:";

      const welcomeMessage = userPreferences.name
        ? `${greeting}\n\n🎯 **Quick Access to All Features:**`
        : `${greeting}\n\n🏠 Interior design guidance\n📞 Booking consultations\n💰 Budget estimation\n🍳 3D Kitchen Designer\n📊 Cost Estimator\n📋 Project tracking\n🎁 Current offers & deals\n📸 Portfolio gallery\n💎 Refer & earn rewards\n❓ Complete FAQ support\n\n🎯 **Choose what interests you most:**`;

      addBotMessage(welcomeMessage, [
        { text: "💰 Get Budget Estimate", action: () => handleOptionClick("Get Budget Estimate") },
        { text: "📞 Book Consultation", action: () => handleOptionClick("Book Consultation") },
        { text: "🍳 Kitchen Designer", action: () => handleOptionClick("Kitchen Designer") },
        { text: "📊 Cost Estimator", action: () => handleOptionClick("Cost Estimator") },
        { text: "🎁 Current Offers", action: () => handleOptionClick("Current Offers") },
        { text: "📸 View Portfolio", action: () => handleOptionClick("View Portfolio") },
        { text: "🛍️ Browse Services", action: () => handleOptionClick("Browse Services") },
        { text: "💎 Refer & Earn", action: () => handleOptionClick("Refer & Earn") },
        { text: "📋 Track Project", action: () => handleOptionClick("Track My Project") },
        { text: "❓ FAQ & Help", action: () => handleOptionClick("FAQ") }
      ]);
    }
  }, [isOpen, userPreferences.name]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

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

    // Save to chat history
    if (type === 'user' || type === 'bot') {
      setChatHistory(prev => [...prev.slice(-20), newMessage]); // Keep last 20 messages
    }
  }, []);

  const addBotMessage = useCallback((content, options, showBudgetCalculator = false, showLeadForm = false, showProjectTracker = false) => {
    setIsTyping(true);
    const typingDelay = Math.min(content.length * 20, 2000); // Dynamic typing delay based on content length
    setTimeout(() => {
      setIsTyping(false);
      addMessage(content, 'bot', options, showBudgetCalculator, showLeadForm, showProjectTracker);
    }, typingDelay);
  }, [addMessage]);

  // Voice input functionality
  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      alert('Voice recognition is not supported in your browser.');
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
    // Enhanced AI-like responses with more natural language processing
    const responses = {
      greetings: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening'],
      services: ['service', 'what do you offer', 'what can you do', 'offerings', 'specialties'],
      location: ['location', 'where', 'city', 'area', 'serve', 'available'],
      cost: ['cost', 'price', 'budget', 'expensive', 'cheap', 'affordable', 'rate'],
      time: ['time', 'duration', 'how long', 'timeline', 'when', 'schedule'],
      warranty: ['warranty', 'guarantee', 'protection', 'coverage'],
      payment: ['payment', 'emi', 'installment', 'pay', 'finance'],
      booking: ['book', 'appointment', 'consultation', 'schedule', 'meet'],
      tracking: ['track', 'status', 'project', 'progress', 'update'],
      help: ['faq', 'help', 'support', 'question', 'doubt'],
      thanks: ['thank', 'thanks', 'appreciate', 'grateful'],
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
        const greetingResponses = [
          "Hello there! 😊 Welcome to Cherry Gold Interiors!",
          "Hi! Great to have you here! ✨",
          "Hey! Ready to transform your space? 🏠"
        ];
        const randomGreeting = greetingResponses[Math.floor(Math.random() * greetingResponses.length)];
        addBotMessage(randomGreeting + " How can I help you today?", [
          { text: "Get Budget Estimate", action: () => handleOptionClick("Get Budget Estimate") },
          { text: "Book Consultation", action: () => handleOptionClick("Book Consultation") },
          { text: "Browse Services", action: () => handleOptionClick("Browse Services") }
        ]);
        break;

      case 'services':
        addBotMessage("🌟 " + faqData.services + "\n\nWhich service interests you the most?", [
          { text: "Get Budget Estimate", action: () => handleOptionClick("Get Budget Estimate") },
          { text: "Book Consultation", action: () => handleOptionClick("Book Consultation") },
          { text: "View Portfolio", action: () => addBotMessage("Visit our portfolio section to see our amazing completed projects! 🎨") }
        ]);
        break;

      case 'location':
        addBotMessage("📍 " + faqData.locations + "\n\nWould you like to schedule a free site visit?", [
          { text: "Book Site Visit", action: () => handleOptionClick("Book Consultation") },
          { text: "Get Budget Estimate", action: () => handleOptionClick("Get Budget Estimate") }
        ]);
        break;

      case 'cost':
        addBotMessage("💰 " + faqData.costs + "\n\n✨ Would you like me to calculate a personalized estimate for your space?", [
          { text: "Calculate My Budget", action: () => handleOptionClick("Get Budget Estimate") },
          { text: "Book Free Consultation", action: () => handleOptionClick("Book Consultation") }
        ]);
        break;

      case 'time':
        addBotMessage("⏰ " + faqData.timeline + "\n\nWant to get started with your project timeline?", [
          { text: "Book Consultation", action: () => handleOptionClick("Book Consultation") },
          { text: "How We Work", action: () => handleOptionClick("How We Work") }
        ]);
        break;

      case 'warranty':
        addBotMessage("🛡️ " + faqData.warranty + "\n\nOur warranty ensures your peace of mind!", [
          { text: "Book Consultation", action: () => handleOptionClick("Book Consultation") },
          { text: "Terms & Conditions", action: () => addBotMessage("For detailed terms and conditions, please contact us at +91 9876543210 📞") }
        ]);
        break;

      case 'payment':
        addBotMessage("💳 " + faqData.payment + "\n\n🏦 We also offer flexible EMI options through our financial partners to make your dream home affordable!", [
          { text: "Get Budget Estimate", action: () => handleOptionClick("Get Budget Estimate") },
          { text: "Book Consultation", action: () => handleOptionClick("Book Consultation") }
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
        const thankResponses = [
          "You're very welcome! 😊 Happy to help!",
          "My pleasure! 🌟 Anything else I can assist with?",
          "Glad I could help! ✨ What else would you like to know?"
        ];
        const randomThank = thankResponses[Math.floor(Math.random() * thankResponses.length)];
        addBotMessage(randomThank, [
          { text: "Get Budget Estimate", action: () => handleOptionClick("Get Budget Estimate") },
          { text: "Book Consultation", action: () => handleOptionClick("Book Consultation") },
          { text: "Browse Services", action: () => handleOptionClick("Browse Services") }
        ]);
        break;

      case 'goodbye':
        addBotMessage("Thank you for visiting Cherry Gold Interiors! 👋 Feel free to come back anytime. Have a wonderful day! ✨", [
          { text: "Quick Question", action: () => showMainMenu() },
          { text: "Book Consultation", action: () => handleOptionClick("Book Consultation") }
        ]);
        break;

      default:
        const smartResponses = [
          "I understand you're looking for information about interior design! 🏠",
          "That's a great question! Let me help you with that. ✨",
          "I'm here to assist you with all your interior design needs! 🎨"
        ];
        const randomSmart = smartResponses[Math.floor(Math.random() * smartResponses.length)];
        addBotMessage(randomSmart + " Here are all the ways I can help:", [
          { text: "💰 Get Budget Estimate", action: () => handleOptionClick("Get Budget Estimate") },
          { text: "📞 Book Consultation", action: () => handleOptionClick("Book Consultation") },
          { text: "📋 Track My Project", action: () => handleOptionClick("Track My Project") },
          { text: "🍳 Kitchen Designer", action: () => handleOptionClick("Kitchen Designer") },
          { text: "📊 Cost Estimator", action: () => handleOptionClick("Cost Estimator") },
          { text: "🎁 Current Offers", action: () => handleOptionClick("Current Offers") },
          { text: "📸 View Portfolio", action: () => handleOptionClick("View Portfolio") },
          { text: "💎 Refer & Earn", action: () => handleOptionClick("Refer & Earn") },
          { text: "🛍️ Browse Services", action: () => handleOptionClick("Browse Services") },
          { text: "❓ FAQ & Help", action: () => handleOptionClick("FAQ") }
        ]);
    }
  };

  const handleOptionClick = (option) => {
    addMessage(option, 'user');

    switch (option) {
      case "Get Budget Estimate":
        setCurrentFlow('budgetEstimation');
        addBotMessage("Great! I'll help you calculate a budget estimate for your interior project. What's the length of your room in feet?", [], true);
        break;

      case "Book Consultation":
        setCurrentFlow('leadCollection');
        addBotMessage("Excellent! I'll help you book a free consultation with our design experts. What's your full name?", [], false, true);
        break;

      case "Track My Project":
        setCurrentFlow('projectTracking');
        addBotMessage("Please enter your project name or Unique Work Code (UWC) to track your project status:", [], false, false, true);
        break;

      case "Browse Services":
        addBotMessage("🌟 **Our Complete Interior Design Services:**\n\n🍳 **Modular Kitchen** - Starting ₹1,50,000\n• L-shaped, U-shaped, Island designs\n• Premium finishes & smart storage\n• 3D Kitchen Designer available\n\n🛏️ **Bedroom Interior** - Starting ₹80,000\n• Wardrobes, bed designs, lighting\n• Space optimization solutions\n\n🛋️ **Living Room** - Starting ₹1,00,000\n• TV units, false ceiling, furniture\n• Modern & traditional designs\n\n🛁 **Bathroom Interior** - Starting ₹60,000\n• Complete renovation solutions\n• Premium fixtures & fittings\n\n🏠 **Complete Home** - Starting ₹5,00,000\n• End-to-end interior solutions\n• Project management included\n\n🏢 **Office Interior** - Starting ₹2,00,000\n• Corporate & co-working spaces\n• Ergonomic designs\n\nWhich service interests you?", [
          { text: "🍳 Kitchen Designer", action: () => handleOptionClick("Kitchen Designer") },
          { text: "📋 Cost Estimator", action: () => handleOptionClick("Cost Estimator") },
          { text: "📸 View Portfolio", action: () => handleOptionClick("View Portfolio") },
          { text: "🎁 Current Offers", action: () => handleOptionClick("Current Offers") },
          { text: "📖 Service Catalogue", action: () => handleOptionClick("Service Catalogue") },
          { text: "Get Budget Estimate", action: () => handleOptionClick("Get Budget Estimate") }
        ]);
        break;

      case "How We Work":
        addBotMessage(faqData.howwework, [
          { text: "Book Consultation", action: () => handleOptionClick("Book Consultation") },
          { text: "Get Budget Estimate", action: () => handleOptionClick("Get Budget Estimate") },
          { text: "View Portfolio", action: () => addBotMessage("Visit /portfolio to see our completed projects.") }
        ]);
        break;

      case "Kitchen Designer":
        addBotMessage("🍳 **3D Kitchen Designer** - Design your dream kitchen!\n\n✨ **Features:**\n• Real-time 3D visualization\n• 50+ premium finishes & colors\n• L-shaped, U-shaped, Island layouts\n• Lacquered glass, acrylics, veneers\n• Instant cost estimation\n• Save & share designs\n\n🎨 **Available Finishes:**\n• Lacquered Glass (High-gloss)\n• Acrylics (Smooth & vibrant)\n• Veneers (Natural wood grain)\n• Standard & Premium Laminates\n\nReady to design your kitchen?", [
          { text: "🚀 Open Kitchen Designer", action: () => addBotMessage("Visit /kitchen-designer to start designing your dream kitchen! 🍳✨") },
          { text: "📞 Book Kitchen Consultation", action: () => handleOptionClick("Book Consultation") },
          { text: "💰 Get Kitchen Quote", action: () => handleOptionClick("Get Budget Estimate") },
          { text: "📸 Kitchen Portfolio", action: () => addBotMessage("Check our stunning kitchen designs at /portfolio! 🎨") }
        ]);
        break;

      case "Cost Estimator":
        addBotMessage("📊 **Advanced Cost Estimator** - Get detailed project estimates!\n\n🔧 **Features:**\n• Room-wise cost breakdown\n• Material & labor estimates\n• Multiple package options\n• Instant calculations\n• PDF report generation\n• Comparison tools\n\n💡 **Estimate Types:**\n• Basic Package: ₹1,200/sqft\n• Premium Package: ₹1,800/sqft\n• Luxury Package: ₹2,500/sqft\n\nGet your detailed estimate now!", [
          { text: "🧮 Open Cost Estimator", action: () => addBotMessage("Visit /cost-estimator for detailed project estimates! 📊💰") },
          { text: "📞 Book Free Site Visit", action: () => handleOptionClick("Book Consultation") },
          { text: "🍳 Kitchen Cost Calculator", action: () => handleOptionClick("Get Budget Estimate") }
        ]);
        break;

      case "View Portfolio":
        addBotMessage("📸 **Our Stunning Portfolio** - See our completed projects!\n\n🏆 **Featured Projects:**\n• 500+ completed projects\n• Modern & traditional designs\n• Before & after galleries\n• Customer testimonials\n• Award-winning designs\n\n🎨 **Categories:**\n• Modular Kitchens\n• Bedroom Interiors\n• Living Rooms\n• Complete Homes\n• Office Spaces\n• Luxury Apartments\n\nExplore our work!", [
          { text: "🖼️ View Full Portfolio", action: () => addBotMessage("Explore our amazing work at /portfolio! 📸✨") },
          { text: "🍳 Kitchen Gallery", action: () => addBotMessage("See our kitchen designs at /portfolio#kitchens! 🍳") },
          { text: "🛏️ Bedroom Gallery", action: () => addBotMessage("Check bedroom designs at /portfolio#bedrooms! 🛏️") },
          { text: "📞 Discuss Your Project", action: () => handleOptionClick("Book Consultation") }
        ]);
        break;

      case "Current Offers":
        addBotMessage("🎁 **Exclusive Offers & Deals** - Save big on your dream home!\n\n🔥 **Current Promotions:**\n• 20% OFF on complete home interiors\n• Free 3D design consultation\n• Zero-cost EMI options\n• Monsoon special discounts\n• Festive season bonuses\n\n💎 **Premium Benefits:**\n• Extended warranty\n• Priority scheduling\n• Premium material upgrades\n• Dedicated project manager\n\nDon't miss these amazing deals!", [
          { text: "🎯 View All Offers", action: () => addBotMessage("Check all current offers at /offers! 🎁💰") },
          { text: "📞 Book to Claim Offer", action: () => handleOptionClick("Book Consultation") },
          { text: "💰 Calculate Savings", action: () => handleOptionClick("Get Budget Estimate") },
          { text: "⏰ Offer Validity", action: () => addBotMessage("Most offers valid till month-end. Book now to secure your discount! ⏰") }
        ]);
        break;

      case "Service Catalogue":
        addBotMessage("📖 **Complete Service Catalogue** - Everything we offer!\n\n📋 **Detailed Services:**\n• Service descriptions\n• Material specifications\n• Design options\n• Price ranges\n• Timeline estimates\n• Warranty details\n\n🎨 **Categories:**\n• Modular Kitchens\n• Wardrobes & Storage\n• Living Room Solutions\n• Bedroom Interiors\n• Bathroom Renovations\n• Office Interiors\n• False Ceilings\n• Flooring & Wall Panels\n\nExplore our complete range!", [
          { text: "📚 Browse Catalogue", action: () => addBotMessage("View our complete catalogue at /catalogue! 📖✨") },
          { text: "🍳 Kitchen Catalogue", action: () => addBotMessage("Kitchen designs at /catalogue#kitchens! 🍳") },
          { text: "📞 Discuss Requirements", action: () => handleOptionClick("Book Consultation") },
          { text: "💰 Get Service Quote", action: () => handleOptionClick("Get Budget Estimate") }
        ]);
        break;

      case "Refer & Earn":
        addBotMessage("💎 **Refer & Earn Program** - Earn rewards for referrals!\n\n🎯 **How It Works:**\n1. Refer friends & family\n2. They book our services\n3. You earn cash rewards\n4. No limit on referrals!\n\n💰 **Reward Structure:**\n• Kitchen projects: ₹5,000\n• Bedroom interiors: ₹3,000\n• Complete homes: ₹15,000\n• Office projects: ₹8,000\n\n🏆 **Benefits:**\n• Instant reward credits\n• Multiple referral bonuses\n• Special recognition\n• Exclusive member perks\n\nStart earning today!", [
          { text: "🚀 Join Refer & Earn", action: () => addBotMessage("Join our referral program at /refer-earn! 💎💰") },
          { text: "📞 Refer Someone Now", action: () => handleOptionClick("Book Consultation") },
          { text: "💰 Check Reward Rates", action: () => addBotMessage("Rewards: Kitchen ₹5K, Bedroom ₹3K, Complete Home ₹15K! 💰") },
          { text: "📋 Terms & Conditions", action: () => addBotMessage("Visit /refer-earn for complete T&C! 📋") }
        ]);
        break;

      case "About Us":
        addBotMessage("🏢 **About Cherry Gold Interiors** - Your trusted design partner!\n\n🌟 **Our Story:**\n• 10+ years of excellence\n• 500+ happy customers\n• Award-winning designs\n• Expert team of designers\n• Quality craftsmanship\n\n🎯 **Our Mission:**\nTo transform spaces into beautiful, functional homes that reflect your personality and lifestyle.\n\n🏆 **Why Choose Us:**\n• Free 3D design consultation\n• Premium quality materials\n• Timely project delivery\n• Comprehensive warranty\n• Post-installation support\n\nLet's create your dream space!", [
          { text: "📖 Read Full Story", action: () => addBotMessage("Learn more about us at /about! 🏢✨") },
          { text: "👥 Meet Our Team", action: () => addBotMessage("Meet our expert designers at /about#team! 👥") },
          { text: "🏆 Our Achievements", action: () => addBotMessage("See our awards at /about#achievements! 🏆") },
          { text: "📞 Start Your Project", action: () => handleOptionClick("Book Consultation") }
        ]);
        break;

      case "FAQ":
        addBotMessage("❓ **Frequently Asked Questions** - Get instant answers!\n\n📋 **Popular Questions:**", [
          { text: "What services do you offer?", action: () => addBotMessage("🌟 " + faqData.services) },
          { text: "Which locations do you serve?", action: () => addBotMessage("📍 " + faqData.locations) },
          { text: "What are your package costs?", action: () => addBotMessage("💰 " + faqData.costs) },
          { text: "How long does a project take?", action: () => addBotMessage("⏰ " + faqData.timeline) },
          { text: "What warranty do you provide?", action: () => addBotMessage("🛡️ " + faqData.warranty) },
          { text: "What's the payment schedule?", action: () => addBotMessage("💳 " + faqData.payment) },
          { text: "📚 View All FAQs", action: () => addBotMessage("Visit /faq for comprehensive answers! ❓📚") },
          { text: "🔙 Back to Main Menu", action: () => showMainMenu() }
        ]);
        break;

      default:
        addBotMessage("Thank you for your interest! How else can I assist you?", [
          { text: "Get Budget Estimate", action: () => handleOptionClick("Get Budget Estimate") },
          { text: "Book Consultation", action: () => handleOptionClick("Book Consultation") },
          { text: "Browse Services", action: () => handleOptionClick("Browse Services") }
        ]);
    }
  };

  const handleServiceOption = (service) => {
    addBotMessage(`Great choice! ${service} is one of our specialties. Would you like to:\n\n📏 Get a budget estimate\n📞 Book a consultation\n🎨 See design ideas`, [
      { text: "Get Budget Estimate", action: () => handleOptionClick("Get Budget Estimate") },
      { text: "Book Consultation", action: () => handleOptionClick("Book Consultation") },
      { text: "Design Ideas", action: () => addBotMessage(`For ${service}, we recommend modern designs with premium materials. Visit /portfolio for inspiration!`) }
    ]);
  };

  const showMainMenu = () => {
    setCurrentFlow('main');
    const menuMessage = userPreferences.name
      ? `What else can I help you with today, ${userPreferences.name}? ✨\n\n🎯 **All Available Features:**`
      : "How else can I help you today? 😊\n\n🎯 **Complete Feature Menu:**";

    addBotMessage(menuMessage, [
      { text: "💰 Get Budget Estimate", action: () => handleOptionClick("Get Budget Estimate") },
      { text: "📞 Book Consultation", action: () => handleOptionClick("Book Consultation") },
      { text: "🍳 Kitchen Designer", action: () => handleOptionClick("Kitchen Designer") },
      { text: "📊 Cost Estimator", action: () => handleOptionClick("Cost Estimator") },
      { text: "📋 Track My Project", action: () => handleOptionClick("Track My Project") },
      { text: "🎁 Current Offers", action: () => handleOptionClick("Current Offers") },
      { text: "📸 View Portfolio", action: () => handleOptionClick("View Portfolio") },
      { text: "💎 Refer & Earn", action: () => handleOptionClick("Refer & Earn") },
      { text: "🛍️ Browse Services", action: () => handleOptionClick("Browse Services") },
      { text: "📖 Service Catalogue", action: () => handleOptionClick("Service Catalogue") },
      { text: "🏢 About Us", action: () => handleOptionClick("About Us") },
      { text: "❓ FAQ & Help", action: () => handleOptionClick("FAQ") }
    ]);
  };

  const clearChat = () => {
    setMessages([]);
    setChatHistory([]);
    setCurrentFlow('main');
    setTimeout(() => {
      const greeting = userPreferences.name
        ? `Welcome back, ${userPreferences.name}! ✨ Ready for a fresh start?`
        : "Hello! 👋 Welcome to Cherry Gold Interiors!";

      addBotMessage(greeting + " How can I assist you today?\n\n🎯 **All Features Available:**", [
        { text: "💰 Get Budget Estimate", action: () => handleOptionClick("Get Budget Estimate") },
        { text: "📞 Book Consultation", action: () => handleOptionClick("Book Consultation") },
        { text: "🍳 Kitchen Designer", action: () => handleOptionClick("Kitchen Designer") },
        { text: "📊 Cost Estimator", action: () => handleOptionClick("Cost Estimator") },
        { text: "🎁 Current Offers", action: () => handleOptionClick("Current Offers") },
        { text: "📸 View Portfolio", action: () => handleOptionClick("View Portfolio") },
        { text: "💎 Refer & Earn", action: () => handleOptionClick("Refer & Earn") },
        { text: "🛍️ Browse Services", action: () => handleOptionClick("Browse Services") },
        { text: "📋 Track Project", action: () => handleOptionClick("Track My Project") },
        { text: "❓ FAQ & Help", action: () => handleOptionClick("FAQ") }
      ]);
    }, 500);
  };

  const calculateBudget = () => {
    const { height, width, package: pkg } = budgetCalc;
    if (!height || !width || !pkg) {
      addBotMessage("Please fill in all the required fields for an accurate budget calculation! 📊", [], true);
      return;
    }

    const area = parseFloat(height) * parseFloat(width);
    const rate = packages[pkg].rate;
    const totalCost = area * rate;

    // Add some additional cost breakdowns
    const designCost = Math.round(totalCost * 0.15);
    const materialCost = Math.round(totalCost * 0.60);
    const laborCost = Math.round(totalCost * 0.25);

    addBotMessage(`🎉 **Your Personalized Budget Estimate**\n\n📐 **Room Dimensions:** ${height}' × ${width}' (${area} sq ft)\n📦 **Selected Package:** ${packages[pkg].name}\n💰 **Rate:** ₹${rate.toLocaleString()}/sq ft\n\n💎 **Cost Breakdown:**\n🎨 Design & Planning: ₹${designCost.toLocaleString()}\n🏗️ Materials: ₹${materialCost.toLocaleString()}\n👷 Labor & Installation: ₹${laborCost.toLocaleString()}\n\n✨ **Total Estimated Cost: ₹${totalCost.toLocaleString()}**\n\n*This is a preliminary estimate. Final cost may vary based on specific materials, finishes, and design complexity.*\n\n🎯 Ready to bring your vision to life?`, [
      { text: "Book Free Consultation", action: () => handleOptionClick("Book Consultation") },
      { text: "Recalculate", action: () => setBudgetCalc({ height: "", width: "", package: 'basic', roomType: "" }) },
      { text: "View Our Services", action: () => handleOptionClick("Browse Services") },
      { text: "How We Work", action: () => handleOptionClick("How We Work") }
    ]);

    setCurrentFlow('main');
  };

  const handleBudgetEstimation = (input) => {
    if (!budgetCalc.height) {
      const length = parseFloat(input);
      if (isNaN(length)) {
        addBotMessage("Please enter a valid number for length (e.g., 10)", [], true);
        return;
      }
      setBudgetCalc(prev => ({ ...prev, height: input }));
      addBotMessage("What's the width of your room in feet?", [], true);
    } else if (!budgetCalc.width) {
      const width = parseFloat(input);
      if (isNaN(width)) {
        addBotMessage("Please enter a valid number for width (e.g., 12)", [], true);
        return;
      }
      setBudgetCalc(prev => ({ ...prev, width: input }));
      addBotMessage("Which package would you prefer?", [
        { text: "Basic (₹1,200/sqft)", action: () => setBudgetCalc(prev => ({ ...prev, package: 'basic' })) },
        { text: "Premium (₹1,800/sqft)", action: () => setBudgetCalc(prev => ({ ...prev, package: 'premium' })) },
        { text: "Luxury (₹2,500/sqft)", action: () => setBudgetCalc(prev => ({ ...prev, package: 'luxury' })) }
      ], true);
    }
  };

  const submitLeadForm = () => {
    const { name, phone, email } = leadData;

    // Enhanced validation
    if (!name.trim()) {
      addBotMessage("Please enter your full name to proceed. 😊", [], false, true);
      return;
    }

    if (!phone.trim() || !/^\d{10}$/.test(phone.replace(/\D/g, ''))) {
      addBotMessage("Please enter a valid 10-digit phone number. 📱", [], false, true);
      return;
    }

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      addBotMessage("Please enter a valid email address. 📧", [], false, true);
      return;
    }

    // Save user preferences
    localStorage.setItem('chatbot_user_name', name);
    localStorage.setItem('chatbot_lead', JSON.stringify(leadData));
    setUserPreferences(prev => ({ ...prev, name }));

    const referenceId = `CG${Date.now().toString().slice(-6)}`;

    addBotMessage(`🎉 Fantastic, ${name}! Your consultation is booked!\n\n✨ **Confirmation Details:**\n📋 Reference ID: ${referenceId}\n📞 We'll call you within 2 hours\n📧 Confirmation email sent\n📅 Free site visit scheduled\n🎨 3D design consultation included\n💎 Premium service guaranteed\n\n🌟 **What's Next?**\nOur design expert will contact you to discuss your vision and schedule the perfect time for your consultation!\n\nAnything else I can help you with today?`, [
      { text: "Get Budget Estimate", action: () => handleOptionClick("Get Budget Estimate") },
      { text: "How We Work", action: () => handleOptionClick("How We Work") },
      { text: "Track My Project", action: () => handleOptionClick("Track My Project") },
      { text: "Browse Portfolio", action: () => addBotMessage("Check out our stunning portfolio at /portfolio! 🎨✨") }
    ]);

    setLeadData({ name: "", phone: "", email: "", city: "", roomType: "", budget: "" });
    setCurrentFlow('main');
  };

  const handleLeadCollection = (input) => {
    if (!leadData.name) {
      setLeadData(prev => ({ ...prev, name: input }));
      addBotMessage("What's your phone number?", [], false, true);
    } else if (!leadData.phone) {
      setLeadData(prev => ({ ...prev, phone: input }));
      addBotMessage("What's your email address?", [], false, true);
    } else if (!leadData.email) {
      setLeadData(prev => ({ ...prev, email: input }));
      addBotMessage("Which city are you located in?", [], false, true);
    } else if (!leadData.city) {
      setLeadData(prev => ({ ...prev, city: input }));
      addBotMessage("What type of room/project are you planning?", [
        { text: "Kitchen", action: () => setLeadData(prev => ({ ...prev, roomType: "Kitchen" })) },
        { text: "Bedroom", action: () => setLeadData(prev => ({ ...prev, roomType: "Bedroom" })) },
        { text: "Living Room", action: () => setLeadData(prev => ({ ...prev, roomType: "Living Room" })) },
        { text: "Office", action: () => setLeadData(prev => ({ ...prev, roomType: "Office" })) },
        { text: "Complete Home", action: () => setLeadData(prev => ({ ...prev, roomType: "Complete Home" })) }
      ], false, true);
    } else if (!leadData.roomType) {
      setLeadData(prev => ({ ...prev, roomType: input }));
      addBotMessage("What's your estimated budget range?", [
        { text: "₹1-2 Lakhs", action: () => setLeadData(prev => ({ ...prev, budget: "1-2" })) },
        { text: "₹2-5 Lakhs", action: () => setLeadData(prev => ({ ...prev, budget: "2-5" })) },
        { text: "₹5-10 Lakhs", action: () => setLeadData(prev => ({ ...prev, budget: "5-10" })) },
        { text: "₹10+ Lakhs", action: () => setLeadData(prev => ({ ...prev, budget: "10+" })) }
      ], false, true);
    } else if (!leadData.budget) {
      setLeadData(prev => ({ ...prev, budget: input }));
      submitLeadForm();
    }
  };

  const trackProject = () => {
    if (!projectCode.trim()) {
      addBotMessage("Please enter your project name or Unique Work Code (UWC). 😊", [], false, false, true);
      return;
    }

    // Mock project data for demo
    const mockProjects = {
      "CG2024001": {
        serviceNumber: "CG2024001",
        customerName: "Amit Sharma",
        projectType: "Modular Kitchen",
        startDate: "2024-01-15",
        expectedCompletion: "2024-02-15",
        status: "In Progress",
        currentStage: "Manufacturing",
        progress: 60
      },
      "ISHMA": {
        serviceNumber: "IS2025001",
        customerName: "Ishma Team",
        projectType: "Music Studio Interior",
        startDate: "2025-07-01",
        expectedCompletion: "2025-08-15",
        status: "In Progress",
        currentStage: "Design Approval",
        progress: 20
      }
    };

    const project = mockProjects[projectCode.toUpperCase()];

    if (project) {
      setProjectData(project);
      addBotMessage(`📋 **Project Status for ${projectCode.toUpperCase()}**\n\n🔄 **Current Status:** ${project.status}\n📊 **Progress:** ${project.progress}%\n👨‍🎨 **Customer:** ${project.customerName}\n🏗️ **Project Type:** ${project.projectType}\n📅 **Start Date:** ${project.startDate}\n⏰ **Expected Completion:** ${project.expectedCompletion}\n📝 **Current Stage:** ${project.currentStage}\n\n✨ Your project is progressing well!`, [
        { text: "Contact Support", action: () => addBotMessage("Contact us at +91 9876543210 for support. 📞") },
        { text: "Book New Consultation", action: () => handleOptionClick("Book Consultation") },
        { text: "Track Another Project", action: () => handleOptionClick("Track My Project") }
      ]);
    } else {
      setProjectData(null);
      addBotMessage("❌ Project code not found. Please check your project name or Unique Work Code (UWC) and try again.\n\n💡 **You can find your UWC in:**\n• Confirmation email\n• Site visit receipt\n• WhatsApp updates\n\nNeed help finding your code?", [
        { text: "Contact Support", action: () => addBotMessage("Contact us at +91 9876543210 for support. 📞") },
        { text: "Book New Project", action: () => handleOptionClick("Book Consultation") },
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
      {/* Floating Chat Button */}
      <div className="fixed bottom-8 right-4 z-50">
        {/* Notification badge for new messages */}
        {!isOpen && messages.length > 0 && (
          <div className="absolute -top-2 -left-2 w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
            <Sparkles className="w-3 h-3" />
          </div>
        )}

        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-all duration-300 transform hover:scale-110 ${isOpen
            ? 'bg-red-600 hover:bg-red-700 border-2 border-white/30 hover:border-white/50 rotate-180'
            : 'bg-gradient-to-br from-yellow-400 via-yellow-500 to-red-600 hover:from-yellow-500 hover:to-red-700 animate-pulse'
            } text-white`}
        >
          {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
        </button>

        {/* Floating action hint */}
        {!isOpen && (
          <div className="absolute bottom-16 right-0 bg-black/80 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            Chat with us! 💬
          </div>
        )}
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className={`fixed bottom-24 right-4 w-[90vw] max-w-[420px] sm:w-96 sm:max-w-[450px] bg-white border border-gray-200 rounded-2xl shadow-2xl z-50 flex flex-col transition-all duration-300 ${isMinimized ? 'h-16' : 'h-[calc(100vh-120px)] max-h-[650px] sm:h-[650px]'
          } sm:bottom-20`}>

          {/* Enhanced Header */}
          <div className="bg-gradient-to-br from-yellow-400 via-yellow-500 to-red-600 text-white rounded-t-2xl py-4 px-4 flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-lg font-bold">🍒 Cherry Gold AI</span>
                <div className="flex items-center gap-1 text-xs opacity-90">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>Online & Ready to Help</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {messages.length > 0 && (
                <button
                  onClick={clearChat}
                  className="text-white/80 hover:text-white transition-colors p-1"
                  title="Clear Chat"
                >
                  <FileText className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="text-white/80 hover:text-white transition-colors p-1"
                title={isMinimized ? "Expand" : "Minimize"}
              >
                {isMinimized ? <Zap className="w-5 h-5" /> : <Zap className="w-5 h-5 rotate-180" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white transition-colors p-1"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages Container */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 to-white">
                {messages.map((message, index) => (
                  <div key={message.id} className={`space-y-3 animate-fadeIn ${message.isNew ? 'animate-slideUp' : ''}`}>
                    <div className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`flex items-start gap-3 max-w-[85%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                        {/* Enhanced Avatar */}
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md ${message.type === 'user'
                          ? 'bg-gradient-to-br from-blue-500 to-blue-600'
                          : 'bg-gradient-to-br from-yellow-400 to-red-600'
                          }`}>
                          {message.type === 'user' ? (
                            <User className="w-4 h-4 text-white" />
                          ) : (
                            <Bot className="w-4 h-4 text-white" />
                          )}
                        </div>

                        {/* Enhanced Message Bubble */}
                        <div className={`rounded-2xl p-4 shadow-sm border ${message.type === 'user'
                          ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white border-blue-200'
                          : 'bg-white text-gray-800 border-gray-200'
                          }`}>
                          <div className="text-sm leading-relaxed whitespace-pre-line">
                            {message.content}
                          </div>

                          {/* Timestamp */}
                          <div className={`text-xs mt-2 ${message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                            }`}>
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Enhanced Quick Action Buttons */}
                    {message.options && (
                      <div className="flex flex-wrap gap-2 ml-11 mt-3">
                        {message.options.map((option, optionIndex) => (
                          <button
                            key={optionIndex}
                            onClick={() => option.action()}
                            className="text-sm bg-gradient-to-r from-yellow-400 to-red-500 text-white border-0 rounded-full px-4 py-2 hover:from-yellow-500 hover:to-red-600 transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center gap-2"
                          >
                            {option.text.includes('Budget') && <Calculator className="w-4 h-4" />}
                            {option.text.includes('Book') && <Calendar className="w-4 h-4" />}
                            {option.text.includes('Track') && <Search className="w-4 h-4" />}
                            {option.text.includes('FAQ') && <Info className="w-4 h-4" />}
                            <span>{option.text}</span>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Budget Calculator */}
                    {message.showBudgetCalculator && (
                      <div className="ml-11 p-4 bg-yellow-50 border border-yellow-200 rounded-lg space-y-3">
                        <h4 className="font-semibold flex items-center gap-2 text-yellow-800">
                          <Calculator className="w-4 h-4 text-yellow-600" />
                          Budget Calculator
                        </h4>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-xs text-yellow-600">Height (ft)</label>
                            <input
                              type="number"
                              placeholder="e.g. 10"
                              value={budgetCalc.height}
                              onChange={(e) => setBudgetCalc(prev => ({ ...prev, height: e.target.value }))}
                              className="w-full p-2 border border-yellow-300 rounded text-sm bg-white text-yellow-900"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-yellow-600">Width (ft)</label>
                            <input
                              type="number"
                              placeholder="e.g. 12"
                              value={budgetCalc.width}
                              onChange={(e) => setBudgetCalc(prev => ({ ...prev, width: e.target.value }))}
                              className="w-full p-2 border border-yellow-300 rounded text-sm bg-white text-yellow-900"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-xs text-yellow-600">Package</label>
                          <select
                            className="w-full p-2 border border-yellow-300 rounded text-sm bg-white text-yellow-900"
                            value={budgetCalc.package}
                            onChange={(e) => setBudgetCalc(prev => ({ ...prev, package: e.target.value }))}
                          >
                            <option value="basic">Basic - ₹1,200/sqft</option>
                            <option value="premium">Premium - ₹1,800/sqft</option>
                            <option value="luxury">Luxury - ₹2,500/sqft</option>
                          </select>
                        </div>
                        <button onClick={calculateBudget} className="w-full bg-gradient-to-br from-yellow-400 to-red-600 text-white rounded p-2 hover:from-yellow-500 hover:to-red-700 text-sm">
                          Calculate Budget
                        </button>
                      </div>
                    )}

                    {/* Lead Form */}
                    {message.showLeadForm && (
                      <div className="ml-11 p-4 bg-yellow-50 border border-yellow-200 rounded-lg space-y-3">
                        <h4 className="font-semibold flex items-center gap-2 text-yellow-800">
                          <Calendar className="w-4 h-4 text-yellow-600" />
                          Book Free Consultation
                        </h4>
                        <div className="space-y-2">
                          <input
                            placeholder="Full Name *"
                            value={leadData.name}
                            onChange={(e) => setLeadData(prev => ({ ...prev, name: e.target.value }))}
                            className="w-full p-2 border border-yellow-300 rounded text-sm bg-white text-yellow-900"
                          />
                          <input
                            placeholder="Phone Number *"
                            value={leadData.phone}
                            onChange={(e) => setLeadData(prev => ({ ...prev, phone: e.target.value }))}
                            className="w-full p-2 border border-yellow-300 rounded text-sm bg-white text-yellow-900"
                          />
                          <input
                            placeholder="Email Address *"
                            value={leadData.email}
                            onChange={(e) => setLeadData(prev => ({ ...prev, email: e.target.value }))}
                            className="w-full p-2 border border-yellow-300 rounded text-sm bg-white text-yellow-900"
                          />
                          <input
                            placeholder="City"
                            value={leadData.city}
                            onChange={(e) => setLeadData(prev => ({ ...prev, city: e.target.value }))}
                            className="w-full p-2 border border-yellow-300 rounded text-sm bg-white text-yellow-900"
                          />
                          <select
                            className="w-full p-2 border border-yellow-300 rounded text-sm bg-white text-yellow-900"
                            value={leadData.roomType}
                            onChange={(e) => setLeadData(prev => ({ ...prev, roomType: e.target.value }))}
                          >
                            <option value="">Select Room Type</option>
                            <option value="kitchen">Kitchen</option>
                            <option value="bedroom">Bedroom</option>
                            <option value="living">Living Room</option>
                            <option value="bathroom">Bathroom</option>
                            <option value="complete">Complete Home</option>
                            <option value="office">Office</option>
                          </select>
                          <select
                            className="w-full p-2 border border-yellow-300 rounded text-sm bg-white text-yellow-900"
                            value={leadData.budget}
                            onChange={(e) => setLeadData(prev => ({ ...prev, budget: e.target.value }))}
                          >
                            <option value="">Budget Range</option>
                            <option value="1-2">₹1-2 Lakhs</option>
                            <option value="2-5">₹2-5 Lakhs</option>
                            <option value="5-10">₹5-10 Lakhs</option>
                            <option value="10+">₹10+ Lakhs</option>
                          </select>
                        </div>
                        <button onClick={submitLeadForm} className="w-full bg-gradient-to-br from-yellow-400 to-red-600 text-white rounded p-2 hover:from-yellow-500 hover:to-red-700 text-sm">
                          Book Consultation
                        </button>
                      </div>
                    )}

                    {/* Project Tracker */}
                    {message.showProjectTracker && (
                      <div className="ml-11 p-4 bg-yellow-50 border border-yellow-200 rounded-lg space-y-3">
                        <h4 className="font-semibold flex items-center gap-2 text-yellow-800">
                          <CheckCircle className="w-4 h-4 text-yellow-600" />
                          Project Status Tracker
                        </h4>
                        <div className="space-y-2">
                          <div className="relative">
                            <input
                              placeholder="Enter your project name or Unique Work Code (UWC)"
                              value={projectCode}
                              onChange={(e) => setProjectCode(e.target.value)}
                              className="w-full p-2 pl-10 border border-yellow-300 rounded text-sm bg-white text-yellow-900"
                            />
                            <Search className="absolute left-2 top-2.5 w-5 h-5 text-yellow-400" />
                          </div>
                          <div className="text-xs text-yellow-600">
                            Example: Ishma or CG2024001 (Try this for demo)
                          </div>
                        </div>
                        <button onClick={trackProject} className="w-full bg-gradient-to-br from-yellow-400 to-red-600 text-white rounded p-2 hover:from-yellow-500 hover:to-red-700 text-sm">
                          Track Project
                        </button>
                      </div>
                    )}
                  </div>
                ))}

                {/* Enhanced Typing Indicator */}
                {isTyping && (
                  <div className="flex justify-start animate-fadeIn">
                    <div className="flex items-start gap-3 max-w-[85%]">
                      <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-red-600 rounded-full flex items-center justify-center shadow-md">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200">
                        <div className="flex items-center gap-2">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                          <span className="text-xs text-gray-500">AI is thinking...</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Enhanced Input Area */}
              <div className="p-4 border-t border-gray-200 bg-white rounded-b-2xl">
                <div className="flex gap-3 items-end">
                  <div className="flex-1 relative">
                    <input
                      placeholder="Type your message... 💬"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                      className="w-full p-3 pr-12 border-2 border-gray-200 rounded-2xl text-sm bg-gray-50 text-gray-900 focus:border-yellow-400 focus:bg-white transition-all duration-200 resize-none"
                      disabled={isTyping}
                    />

                    {/* Voice Input Button */}
                    <button
                      onClick={toggleVoiceInput}
                      className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1.5 rounded-full transition-all duration-200 ${isListening
                        ? 'bg-red-500 text-white animate-pulse'
                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                        }`}
                      title={isListening ? "Stop listening" : "Voice input"}
                    >
                      {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Send Button */}
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isTyping}
                    className="p-3 bg-gradient-to-r from-yellow-400 to-red-600 text-white rounded-2xl hover:from-yellow-500 hover:to-red-700 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>

                {/* Quick Actions */}
                <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                  <button
                    onClick={() => handleOptionClick("Get Budget Estimate")}
                    className="flex items-center gap-2 px-3 py-1.5 bg-yellow-100 text-yellow-700 rounded-full text-xs whitespace-nowrap hover:bg-yellow-200 transition-colors"
                  >
                    <Calculator className="w-3 h-3" />
                    Budget
                  </button>
                  <button
                    onClick={() => handleOptionClick("Book Consultation")}
                    className="flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-xs whitespace-nowrap hover:bg-blue-200 transition-colors"
                  >
                    <Calendar className="w-3 h-3" />
                    Book
                  </button>
                  <button
                    onClick={() => handleOptionClick("Track My Project")}
                    className="flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-xs whitespace-nowrap hover:bg-green-200 transition-colors"
                  >
                    <Search className="w-3 h-3" />
                    Track
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Enhanced CSS Styles */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from { 
            opacity: 0; 
            transform: translateY(20px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        @keyframes bounce {
          0%, 20%, 53%, 80%, 100% {
            transform: translate3d(0,0,0);
          }
          40%, 43% {
            transform: translate3d(0, -8px, 0);
          }
          70% {
            transform: translate3d(0, -4px, 0);
          }
          90% {
            transform: translate3d(0, -2px, 0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        .animate-slideUp {
          animation: slideUp 0.4s ease-out;
        }
        
        .animate-bounce-gentle {
          animation: bounce 2s infinite;
        }
        
        /* Custom scrollbar */
        .overflow-y-auto::-webkit-scrollbar {
          width: 6px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 3px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #fbbf24, #ef4444);
          border-radius: 3px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #f59e0b, #dc2626);
        }
        
        @media (max-width: 640px) {
          .fixed.bottom-24.right-4 {
            bottom: 6rem;
            right: 0.5rem;
            width: calc(100vw - 1rem);
            height: calc(100vh - 120px);
            max-height: none;
            border-radius: 1rem;
          }
          .fixed.bottom-8.right-4 {
            bottom: 2rem;
            right: 1rem;
          }
        }
        
        /* Pulse animation for new messages */
        @keyframes pulse-ring {
          0% {
            transform: scale(0.33);
          }
          40%, 50% {
            opacity: 0;
          }
          100% {
            opacity: 0;
            transform: scale(1.2);
          }
        }
        
        .pulse-ring {
          animation: pulse-ring 1.25s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
        }
      `}</style>
    </>
  );
};

export default ChatBot;