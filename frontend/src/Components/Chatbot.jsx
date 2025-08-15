/*frontend/src/Components/Chatbot.jsx */
import { useState, useRef, useEffect } from "react";
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User, 
  Calculator,
  MapPin,
  Calendar,
  Phone,
  Mail,
  Home,
  IndianRupee,
  Clock,
  Shield,
  CheckCircle,
  ExternalLink,
  Search,
  AlertCircle,
  Info
} from "lucide-react";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [leadData, setLeadData] = useState({
    name: "", phone: "", email: "", city: "", roomType: "", budget: ""
  });
  const [budgetCalc, setBudgetCalc] = useState({
    height: "", width: "", package: 'basic', roomType: ""
  });
  const [projectCode, setProjectCode] = useState("");
  const [projectData, setProjectData] = useState(null);
  const [currentFlow, setCurrentFlow] = useState('main');
  const messagesEndRef = useRef(null);

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

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      addBotMessage("Hello! 👋 Welcome to Cherry Gold Interiors! I'm your AI assistant here to help you with:\n\n🏠 Interior design guidance\n📞 Booking consultations\n💰 Budget estimation\n📋 Project tracking\n❓ Answering your questions\n\nHow can I assist you today?", [
        { text: "Get Budget Estimate", action: () => handleOptionClick("Get Budget Estimate") },
        { text: "Book Consultation", action: () => handleOptionClick("Book Consultation") },
        { text: "Browse Services", action: () => handleOptionClick("Browse Services") },
        { text: "How We Work", action: () => handleOptionClick("How We Work") },
        { text: "FAQ & Help", action: () => handleOptionClick("FAQ") }
      ]);
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const addMessage = (content, type, options, showBudgetCalculator, showLeadForm, showProjectTracker) => {
    const newMessage = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date(),
      options,
      showBudgetCalculator,
      showLeadForm,
      showProjectTracker
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const addBotMessage = (content, options, showBudgetCalculator = false, showLeadForm = false, showProjectTracker = false) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      addMessage(content, 'bot', options, showBudgetCalculator, showLeadForm, showProjectTracker);
    }, 1000);
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
    if (message.includes('service') || message.includes('what do you offer')) {
      addBotMessage(faqData.services, [
        { text: "Get Budget Estimate", action: () => handleOptionClick("Get Budget Estimate") },
        { text: "Book Consultation", action: () => handleOptionClick("Book Consultation") },
        { text: "View Portfolio", action: () => addBotMessage("Visit /portfolio to see our completed projects.") }
      ]);
    } else if (message.includes('location') || message.includes('where') || message.includes('city')) {
      addBotMessage(faqData.locations, [
        { text: "Book Consultation", action: () => handleOptionClick("Book Consultation") },
        { text: "Get Budget Estimate", action: () => handleOptionClick("Get Budget Estimate") }
      ]);
    } else if (message.includes('cost') || message.includes('price') || message.includes('budget')) {
      addBotMessage(faqData.costs + "\n\nWould you like me to calculate an estimate for your space?", [
        { text: "Calculate Budget", action: () => handleOptionClick("Get Budget Estimate") },
        { text: "Book Consultation", action: () => handleOptionClick("Book Consultation") }
      ]);
    } else if (message.includes('time') || message.includes('duration') || message.includes('how long')) {
      addBotMessage(faqData.timeline, [
        { text: "Book Consultation", action: () => handleOptionClick("Book Consultation") },
        { text: "How We Work", action: () => handleOptionClick("How We Work") }
      ]);
    } else if (message.includes('warranty') || message.includes('guarantee')) {
      addBotMessage(faqData.warranty, [
        { text: "Book Consultation", action: () => handleOptionClick("Book Consultation") },
        { text: "Terms & Conditions", action: () => addBotMessage("Contact us at +91 9876543210 for detailed terms.") }
      ]);
    } else if (message.includes('payment') || message.includes('emi')) {
      addBotMessage(faqData.payment + "\n\nWe also offer flexible EMI options through our financial partners.", [
        { text: "Get Budget Estimate", action: () => handleOptionClick("Get Budget Estimate") },
        { text: "Book Consultation", action: () => handleOptionClick("Book Consultation") }
      ]);
    } else if (message.includes('book') || message.includes('appointment') || message.includes('consultation')) {
      handleOptionClick("Book Consultation");
    } else if (message.includes('track') || message.includes('status') || message.includes('project')) {
      handleOptionClick("Track My Project");
    } else if (message.includes('faq') || message.includes('help')) {
      handleOptionClick("FAQ");
    } else {
      addBotMessage("I understand you're looking for information. Here are some things I can help you with:", [
        { text: "Get Budget Estimate", action: () => handleOptionClick("Get Budget Estimate") },
        { text: "Book Consultation", action: () => handleOptionClick("Book Consultation") },
        { text: "Track My Project", action: () => handleOptionClick("Track My Project") },
        { text: "Browse Services", action: () => handleOptionClick("Browse Services") },
        { text: "How We Work", action: () => handleOptionClick("How We Work") },
        { text: "FAQ & Help", action: () => handleOptionClick("FAQ") }
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
        addBotMessage("We offer comprehensive interior design services:\n\n🍳 Modular Kitchen - Starting ₹1,50,000\n🛏️ Bedroom Interior - Starting ₹80,000\n🛋️ Living Room - Starting ₹1,00,000\n🛁 Bathroom Interior - Starting ₹60,000\n🏠 Complete Home - Starting ₹5,00,000\n🏢 Office Interior - Starting ₹2,00,000\n\nWhich service interests you?", [
          { text: "Modular Kitchen", action: () => handleServiceOption("Modular Kitchen") },
          { text: "Bedroom Interior", action: () => handleServiceOption("Bedroom Interior") },
          { text: "Living Room", action: () => handleServiceOption("Living Room") },
          { text: "Complete Home", action: () => handleServiceOption("Complete Home") },
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
      
      case "FAQ":
        addBotMessage("Here are some frequently asked questions:", [
          { text: "What services do you offer?", action: () => addBotMessage(faqData.services, [], false, false, false, <Info className="w-4 h-4 text-blue-600 inline ml-1" />) },
          { text: "Which locations do you serve?", action: () => addBotMessage(faqData.locations, [], false, false, false, <Info className="w-4 h-4 text-blue-600 inline ml-1" />) },
          { text: "What are your package costs?", action: () => addBotMessage(faqData.costs, [], false, false, false, <Info className="w-4 h-4 text-blue-600 inline ml-1" />) },
          { text: "How long does a project take?", action: () => addBotMessage(faqData.timeline, [], false, false, false, <Info className="w-4 h-4 text-blue-600 inline ml-1" />) },
          { text: "What warranty do you provide?", action: () => addBotMessage(faqData.warranty, [], false, false, false, <Info className="w-4 h-4 text-blue-600 inline ml-1" />) },
          { text: "What's the payment schedule?", action: () => addBotMessage(faqData.payment, [], false, false, false, <Info className="w-4 h-4 text-blue-600 inline ml-1" />) },
          { text: "How to book/reschedule?", action: () => addBotMessage(faqData.booking, [], false, false, false, <Info className="w-4 h-4 text-blue-600 inline ml-1" />) },
          { text: "Back to Main Menu", action: () => showMainMenu() }
        ]);
        break;
      
      case "Calculate Budget":
        addBotMessage("Let me help you calculate the budget for your space:", [], true);
        break;
      
      default:
        if (option.includes("sqft")) {
          const service = option.split(" - ")[0];
          addBotMessage(`Great choice! ${service} is one of our most popular services. Would you like to:\n\n📏 Get a budget estimate\n📞 Book a consultation\n🎨 See design ideas`, [
            { text: "Get Budget Estimate", action: () => handleOptionClick("Get Budget Estimate") },
            { text: "Book Consultation", action: () => handleOptionClick("Book Consultation") },
            { text: "Design Ideas", action: () => addBotMessage(`For ${service}, we recommend modern designs with premium materials. Visit /portfolio for inspiration!`) }
          ]);
        } else {
          addBotMessage("Thank you for your interest! How else can I assist you?", [
            { text: "Get Budget Estimate", action: () => handleOptionClick("Get Budget Estimate") },
            { text: "Book Consultation", action: () => handleOptionClick("Book Consultation") },
            { text: "Browse Services", action: () => handleOptionClick("Browse Services") }
          ]);
        }
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
    addBotMessage("How else can I help you today?", [
      { text: "Get Budget Estimate", action: () => handleOptionClick("Get Budget Estimate") },
      { text: "Book Consultation", action: () => handleOptionClick("Book Consultation") },
      { text: "Track My Project", action: () => handleOptionClick("Track My Project") },
      { text: "Browse Services", action: () => handleOptionClick("Browse Services") },
      { text: "How We Work", action: () => handleOptionClick("How We Work") },
      { text: "FAQ & Help", action: () => handleOptionClick("FAQ") }
    ]);
  };

  const calculateBudget = () => {
    const { height, width, package: pkg } = budgetCalc;
    if (!height || !width || !pkg) {
      alert("Please fill all required fields for budget calculation.");
      return;
    }

    const area = parseFloat(height) * parseFloat(width);
    const rate = packages[pkg].rate;
    const totalCost = area * rate;

    addBotMessage(`Based on your requirements:\n\n📐 Area: ${area} sq ft\n📦 Package: ${packages[pkg].name}\n💰 Rate: ₹${rate}/sq ft\n\n Estimated Cost: ₹${totalCost.toLocaleString()}**\n\n*This is a rough estimate. Final cost may vary based on materials, finishes, and specific requirements.\n\nWould you like to proceed with a free consultation?`, [
      { text: "Book Consultation", action: () => handleOptionClick("Book Consultation") },
      { text: "Modify Calculation", action: () => setBudgetCalc({ height: "", width: "", package: 'basic', roomType: "" }) },
      { text: "View Services", action: () => handleOptionClick("Browse Services") }
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
    } else if (!budgetCalc.package) {
      const pkg = input.toLowerCase();
      if (pkg === 'basic' || pkg === 'premium' || pkg === 'luxury') {
        setBudgetCalc(prev => ({ ...prev, package: pkg }));
        calculateBudget();
      } else {
        addBotMessage("Please select a valid package (Basic, Premium, or Luxury)", [], true);
      }
    }
  };

  const submitLeadForm = () => {
    const { name, phone, email } = leadData;
    if (!name || !phone || !email) {
      alert("Please fill in Name, Phone, and Email to proceed.");
      return;
    }

    localStorage.setItem('chatbot_lead', JSON.stringify(leadData));
    
    addBotMessage(`Thank you ${name}! 🎉\n\nYour consultation request has been submitted successfully. Here's what happens next:\n\n📞 Our team will call you within 2 hours\n📧 You'll receive a confirmation email\n📅 We'll schedule a convenient time for site visit\n🎨 Free 3D design consultation included\n\n**Your Reference ID**: CG${Date.now().toString().slice(-6)}\n\nIs there anything else I can help you with?`, [
      { text: "Get Budget Estimate", action: () => handleOptionClick("Get Budget Estimate") },
      { text: "How We Work", action: () => handleOptionClick("How We Work") },
      { text: "Track My Project", action: () => handleOptionClick("Track My Project") }
    ]);

    setLeadData({ name: "", phone: "", email: "", city: "", roomType: "", budget: "" });
    setCurrentFlow('main');
    
    alert("Consultation Booked! Our team will contact you within 2 hours.");
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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'current':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'current':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-200 text-gray-600';
    }
  };

  const trackProject = () => {
    if (!projectCode.trim()) {
      alert("Please enter your project name or Unique Work Code (UWC).");
      return;
    }

    let project = null;
    const mockProjects = {
      "CG2024001": {
        serviceNumber: "CG2024001",
        customerName: "Amit Sharma",
        projectType: "Modular Kitchen",
        startDate: "2024-01-15",
        expectedCompletion: "2024-02-15",
        status: "In Progress",
        currentStage: "Manufacturing",
        progress: 60,
        stages: [
          { id: 1, name: "Consultation", status: "completed", date: "2024-01-15" },
          { id: 2, name: "Design Approval", status: "completed", date: "2024-01-20" },
          { id: 3, name: "Manufacturing", status: "current", date: "2024-01-25" },
          { id: 4, name: "Installation", status: "upcoming", date: "2024-02-10" },
          { id: 5, name: "Final Delivery", status: "upcoming", date: "2024-02-15" }
        ],
        updates: [
          {
            id: 1,
            date: "2024-01-25",
            title: "Manufacturing Started",
            description: "Kitchen modules manufacturing has begun at our facility.",
            images: ["https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg?auto=compress&cs=tinysrgb&w=300"]
          },
          {
            id: 2,
            date: "2024-01-20",
            title: "Design Approved",
            description: "Final design approved by customer. Manufacturing will begin soon.",
            images: []
          },
          {
            id: 3,
            date: "2024-01-15",
            title: "Project Initiated",
            description: "Initial consultation completed and project officially started.",
            images: []
          }
        ]
      },
      "CG2024002": {
        serviceNumber: "CG2024002",
        customerName: "Priya Patel",
        projectType: "Bedroom Interior",
        startDate: "2024-02-01",
        expectedCompletion: "2024-03-01",
        status: "In Progress",
        currentStage: "Installation",
        progress: 75,
        stages: [
          { id: 1, name: "Consultation", status: "completed", date: "2024-02-01" },
          { id: 2, name: "Design Approval", status: "completed", date: "2024-02-05" },
          { id: 3, name: "Manufacturing", status: "completed", date: "2024-02-15" },
          { id: 4, name: "Installation", status: "current", date: "2024-02-20" },
          { id: 5, name: "Final Delivery", status: "upcoming", date: "2024-03-01" }
        ],
        updates: [
          {
            id: 1,
            date: "2024-02-20",
            title: "Installation Started",
            description: "Bedroom installation is in progress.",
            images: ["https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=300"]
          },
          {
            id: 2,
            date: "2024-02-15",
            title: "Manufacturing Completed",
            description: "All components have been manufactured.",
            images: []
          }
        ]
      }
    };

    project = mockProjects[projectCode.toUpperCase()];
    
    if (!project && projectCode.toLowerCase() === "ishma") {
      project = {
        serviceNumber: "IS2025001",
        customerName: "Ishma Team",
        projectType: "Music Studio Interior",
        startDate: "2025-07-01",
        expectedCompletion: "2025-08-15",
        status: "In Progress",
        currentStage: "Design Approval",
        progress: 20,
        stages: [
          { id: 1, name: "Consultation", status: "completed", date: "2025-07-01" },
          { id: 2, name: "Design Approval", status: "current", date: "2025-07-10" },
          { id: 3, name: "Manufacturing", status: "upcoming", date: "2025-07-20" },
          { id: 4, name: "Installation", status: "upcoming", date: "2025-08-01" },
          { id: 5, name: "Final Delivery", status: "upcoming", date: "2025-08-15" }
        ],
        updates: [
          {
            id: 1,
            date: "2025-07-01",
            title: "Project Initiated",
            description: "Consultation completed for Ishma studio setup.",
            images: []
          }
        ]
      };

      let progress = project.progress;
      const interval = setInterval(() => {
        progress = Math.min(progress + 5, 100);
        const currentStageIndex = project.stages.findIndex(s => s.status === "current");
        if (currentStageIndex !== -1 && progress >= 100) {
          project.stages[currentStageIndex].status = "completed";
          if (currentStageIndex + 1 < project.stages.length) {
            project.stages[currentStageIndex + 1].status = "current";
            project.currentStage = project.stages[currentStageIndex + 1].name;
          }
          project.updates.push({
            id: project.updates.length + 1,
            date: new Date().toISOString().split('T')[0],
            title: `Stage ${project.currentStage} Started`,
            description: `Work on ${project.currentStage} has begun for Ishma project.`,
            images: []
          });
        }
        project.progress = progress;
        if (progress === 100) {
          clearInterval(interval);
          project.status = "Completed";
        }
        setProjectData({ ...project });
      }, 5000);
    }

    if (project) {
      setProjectData(project);
      addBotMessage(`📋 Project Status for ${projectCode.toUpperCase()} \n\n🔄 Current Status: ${project.status}\n📊 Progress: ${project.progress}%\n👨‍🎨 Customer: ${project.customerName}\n⏰ Expected Completion: ${project.expectedCompletion}\n📝 Current Stage: ${project.currentStage}\n\nView detailed project information below:`, [
        { text: "Contact Support", action: () => addBotMessage("Contact us at +91 9876543210 for support.") },
        { text: "Book New Consultation", action: () => handleOptionClick("Book Consultation") },
        { text: "Track Another Project", action: () => handleOptionClick("Track My Project") }
      ], false, false, true);
    } else {
      setProjectData(null);
      addBotMessage("❌ Project code not found. Please check your project name or Unique Work Code (UWC) and try again.\n\n💡 You can find your UWC in:\n• Confirmation email\n• Site visit receipt\n• WhatsApp updates\n\nNeed help finding your code?", [
        { text: "Contact Support", action: () => addBotMessage("Contact us at +91 9876543210 for support.") },
        { text: "Book New Project", action: () => handleOptionClick("Book Consultation") },
        { text: "Try Again", action: () => handleOptionClick("Track My Project") }
      ], false, false, true);
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
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-8 right-4 w-12 h-12 sm:w-14 sm:h-14 rounded-full shadow-lg z-50 flex items-center justify-center transition-colors ${
          isOpen
            ? 'bg-red-600 hover:bg-red-700 border border-white/30 hover:border-white/50'
            : 'bg-gradient-to-br from-yellow-400 to-yellow-600 hover:from-red-600 hover:to-red-700'
        } text-white`}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-4 w-[90vw] max-w-[400px] h-[calc(100vh-120px)] max-h-[600px] sm:w-96 sm:max-w-[450px] sm:h-[600px] sm:bottom-20 bg-white border border-gray-200 rounded-lg shadow-lg z-50 flex flex-col">
          <div className="bg-gradient-to-br from-yellow-400 to-red-600 text-white rounded-t-lg py-3 px-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold">🍒 Cherry Gold Interiors</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white hover:text-gray-200">
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
            {messages.map((message) => (
              <div key={message.id} className="space-y-2">
                <div className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex items-start gap-2 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${message.type === 'user' ? 'bg-yellow-600' : 'bg-gradient-to-br from-yellow-400 to-red-600'}`}>
                      {message.type === 'user' ? (
                        <User className="w-3 h-3 text-white" />
                      ) : (
                        <Bot className="w-3 h-3 text-white" />
                      )}
                    </div>
                    <div className={`rounded-lg p-2 sm:p-3 ${message.type === 'user' ? 'bg-yellow-100 text-yellow-800' : 'bg-yellow-50 text-yellow-900'}`}>
                      <div className="text-xs sm:text-sm whitespace-pre-line">{message.content}{message.showProjectTracker && message.options && message.options.length > 0 ? message.options.map(opt => <span key={opt.text} className="text-red-600">{opt.text}</span>) : null}</div>
                    </div>
                  </div>
                </div>

                {message.options && (
                  <div className="flex flex-wrap gap-2 ml-6 sm:ml-8">
                    {message.options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => option.action()}
                        className="text-xs sm:text-sm bg-gradient-to-br from-yellow-200 to-red-300 text-white border border-red-300 rounded px-3 py-1.5 hover:from-yellow-300 hover:to-red-400 transition-colors"
                      >
                        {option.text}
                      </button>
                    ))}
                  </div>
                )}

                {message.showBudgetCalculator && (
                  <div className="ml-6 sm:ml-8 p-3 sm:p-4 bg-yellow-50 border border-yellow-200 rounded-lg space-y-3">
                    <h4 className="font-semibold flex items-center gap-2 text-yellow-800 text-sm sm:text-base">
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
                          className="w-full p-2 border border-yellow-300 rounded text-xs sm:text-sm bg-white text-yellow-900"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-yellow-600">Width (ft)</label>
                        <input
                          type="number"
                          placeholder="e.g. 12"
                          value={budgetCalc.width}
                          onChange={(e) => setBudgetCalc(prev => ({ ...prev, width: e.target.value }))}
                          className="w-full p-2 border border-yellow-300 rounded text-xs sm:text-sm bg-white text-yellow-900"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-yellow-600">Package</label>
                      <select 
                        className="w-full p-2 border border-yellow-300 rounded text-xs sm:text-sm bg-white text-yellow-900"
                        value={budgetCalc.package}
                        onChange={(e) => setBudgetCalc(prev => ({ ...prev, package: e.target.value }))}
                      >
                        <option value="basic">Basic - ₹1,200/sqft</option>
                        <option value="premium">Premium - ₹1,800/sqft</option>
                        <option value="luxury">Luxury - ₹2,500/sqft</option>
                      </select>
                    </div>
                    <button onClick={calculateBudget} className="w-full bg-gradient-to-br from-yellow-400 to-red-600 text-white rounded p-2 hover:from-yellow-500 hover:to-red-700 text-xs sm:text-sm">
                      Calculate Budget
                    </button>
                  </div>
                )}

                {message.showLeadForm && (
                  <div className="ml-6 sm:ml-8 p-3 sm:p-4 bg-yellow-50 border border-yellow-200 rounded-lg space-y-3">
                    <h4 className="font-semibold flex items-center gap-2 text-yellow-800 text-sm sm:text-base">
                      <Calendar className="w-4 h-4 text-yellow-600" />
                      Book Free Consultation
                    </h4>
                    <div className="space-y-2">
                      <input
                        placeholder="Full Name *"
                        value={leadData.name}
                        onChange={(e) => setLeadData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full p-2 border border-yellow-300 rounded text-xs sm:text-sm bg-white text-yellow-900"
                      />
                      <input
                        placeholder="Phone Number *"
                        value={leadData.phone}
                        onChange={(e) => setLeadData(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full p-2 border border-yellow-300 rounded text-xs sm:text-sm bg-white text-yellow-900"
                      />
                      <input
                        placeholder="Email Address *"
                        value={leadData.email}
                        onChange={(e) => setLeadData(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full p-2 border border-yellow-300 rounded text-xs sm:text-sm bg-white text-yellow-900"
                      />
                      <input
                        placeholder="City"
                        value={leadData.city}
                        onChange={(e) => setLeadData(prev => ({ ...prev, city: e.target.value }))}
                        className="w-full p-2 border border-yellow-300 rounded text-xs sm:text-sm bg-white text-yellow-900"
                      />
                      <select 
                        className="w-full p-2 border border-yellow-300 rounded text-xs sm:text-sm bg-white text-yellow-900"
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
                        className="w-full p-2 border border-yellow-300 rounded text-xs sm:text-sm bg-white text-yellow-900"
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
                    <button onClick={submitLeadForm} className="w-full bg-gradient-to-br from-yellow-400 to-red-600 text-white rounded p-2 hover:from-yellow-500 hover:to-red-700 text-xs sm:text-sm">
                      Book Consultation
                    </button>
                  </div>
                )}

                {message.showProjectTracker && (
                  <div className="ml-6 sm:ml-8 p-3 sm:p-4 bg-yellow-50 border border-yellow-200 rounded-lg space-y-3">
                    <h4 className="font-semibold flex items-center gap-2 text-yellow-800 text-sm sm:text-base">
                      <CheckCircle className="w-4 h-4 text-yellow-600" />
                      Project Status Tracker
                    </h4>
                    <div className="space-y-2">
                      <div className="relative">
                        <input
                          placeholder="Enter your project name or Unique Work Code (UWC)"
                          value={projectCode}
                          onChange={(e) => setProjectCode(e.target.value)}
                          className="w-full p-2 pl-10 border border-yellow-300 rounded text-xs sm:text-sm bg-white text-yellow-900"
                        />
                        <Search className="absolute left-2 top-2.5 w-5 h-5 text-yellow-400" />
                      </div>
                      <div className="text-xs text-yellow-600">
                        Example: Ishma or CG2024001 (Try this for demo)
                      </div>
                    </div>
                    <button onClick={trackProject} className="w-full bg-gradient-to-br from-yellow-400 to-red-600 text-white rounded p-2 hover:from-yellow-500 hover:to-red-700 text-xs sm:text-sm">
                      Track Project
                    </button>

                    {projectData && (
                      <div className="space-y-4 mt-4">
                        <div className="p-3 sm:p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                            <div>
                              <h5 className="text-xs sm:text-sm text-yellow-600">Customer Name</h5>
                              <p className="text-sm sm:text-base font-semibold text-yellow-900">{projectData.customerName}</p>
                            </div>
                            <div>
                              <h5 className="text-xs sm:text-sm text-yellow-600">Project Type</h5>
                              <p className="text-sm sm:text-base font-semibold text-yellow-900">{projectData.projectType}</p>
                            </div>
                            <div>
                              <h5 className="text-xs sm:text-sm text-yellow-600">Start Date</h5>
                              <p className="text-sm sm:text-base font-semibold text-yellow-900">{projectData.startDate}</p>
                            </div>
                            <div>
                              <h5 className="text-xs sm:text-sm text-yellow-600">Expected Completion</h5>
                              <p className="text-sm sm:text-base font-semibold text-yellow-900">{projectData.expectedCompletion}</p>
                            </div>
                          </div>
                          <div className="mt-3 sm:mt-4">
                            <div className="flex items-center justify-between mb-2">
                              <h5 className="text-xs sm:text-sm text-yellow-600">Progress</h5>
                              <span className="text-xs sm:text-sm font-semibold text-yellow-900">{projectData.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${projectData.progress}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>

                        <div className="p-3 sm:p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <h4 className="text-sm sm:text-lg font-bold text-yellow-900 mb-3 sm:mb-4">Project Timeline</h4>
                          <div className="space-y-3 sm:space-y-4">
                            {projectData.stages.map((stage) => (
                              <div key={stage.id} className="flex items-center space-x-3 sm:space-x-4">
                                <div className="flex-shrink-0">
                                  {getStatusIcon(stage.status)}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between">
                                    <h5 className="text-sm sm:text-base font-semibold text-yellow-900">{stage.name}</h5>
                                    <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm ${getStatusColor(stage.status)}`}>
                                      {stage.status.charAt(0).toUpperCase() + stage.status.slice(1)}
                                    </span>
                                  </div>
                                  <p className="text-xs sm:text-sm text-yellow-900 mt-1">
                                    <Calendar className="w-3 sm:w-4 h-3 sm:h-4 inline mr-1 text-yellow-400" />
                                    {stage.date}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="p-3 sm:p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <h4 className="text-sm sm:text-lg font-bold text-yellow-900 mb-3 sm:mb-4">Recent Updates</h4>
                          <div className="space-y-3 sm:space-y-4">
                            {projectData.updates.map((update) => (
                              <div key={update.id} className="border-l-4 border-yellow-500 pl-4 sm:pl-6 pb-3 sm:pb-4">
                                <div className="flex items-center justify-between mb-2">
                                  <h5 className="text-sm sm:text-base font-semibold text-yellow-900">{update.title}</h5>
                                  <span className="text-xs sm:text-sm text-yellow-600">{update.date}</span>
                                </div>
                                <p className="text-xs sm:text-sm text-yellow-700 mb-2">{update.description}</p>
                                {update.images && update.images.length > 0 && (
                                  <div className="grid grid-cols-1 gap-3 sm:gap-4">
                                    {update.images.map((image, index) => (
                                      <img
                                        key={index}
                                        src={image}
                                        alt={`Update ${update.id} - ${index + 1}`}
                                        className="w-full h-24 sm:h-32 object-cover rounded-lg border border-yellow-200"
                                      />
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="p-3 sm:p-4 bg-gradient-to-br from-yellow-400 to-red-600 rounded-lg text-white text-center">
                          <h4 className="text-sm sm:text-lg font-bold mb-2">Need Help?</h4>
                          <p className="text-xs sm:text-sm mb-3 sm:mb-4 opacity-90">
                            Can't find your service number or have questions about your project?
                          </p>
                          <div className="flex flex-wrap justify-center gap-2">
                            <button className="bg-red-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-xs sm:text-sm">
                              Contact Support
                            </button>
                            <button className="bg-red-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-xs sm:text-sm">
                              WhatsApp Us
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-start gap-2 max-w-[80%]">
                  <div className="w-6 h-6 bg-gradient-to-br from-yellow-400 to-red-600 rounded-full flex items-center justify-center">
                    <Bot className="w-3 h-3 text-white" />
                  </div>
                  <div className="bg-gray-100 rounded-lg p-2 sm:p-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 sm:p-4 border-t border-gray-200">
            <div className="flex gap-2 items-center">
              <input
                placeholder="Type your message..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1 p-2 sm:p-3 border border-gray-300 rounded text-xs sm:text-sm bg-white text-gray-900 min-h-[40px]"
              />
              <button onClick={handleSendMessage} className="p-2 sm:p-3 bg-gradient-to-br from-yellow-400 to-red-600 text-white rounded flex items-center justify-center hover:from-yellow-500 hover:to-red-700 transition-colors">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @media (max-width: 640px) {
          .fixed.bottom-24.right-4 {
            bottom: 6rem;
            right: 0.5rem;
            width: calc(100vw - 1rem);
            height: calc(100vh - 120px);
            max-height: none;
            border-radius: 0;
          }
          .fixed.bottom-8.right-4 {
            bottom: 2rem;
            right: 1rem;
          }
        }
      `}</style>
    </>
  );
};

export default ChatBot;