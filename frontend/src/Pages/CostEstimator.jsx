import React, { useState } from 'react';
import { 
  Calculator, 
  Home, 
  DollarSign, 
  Info, 
  Printer, 
  Download, 
  Edit3, 
  Check, 
  X, 
  FileText, 
  Sparkles, 
  Plus, 
  Trash2, 
  User, 
  Phone, 
  MapPin, 
  Layers, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Paintbrush,
  Zap,
  Box,
  Wrench,
  Palette,
  Sliders,
  ChevronDown,
  Eye,
  AlertCircle,
  Hammer,
  Crown,
  Award,
  CheckCheck,
  Star
} from 'lucide-react';
import ConsultationModal from '../Components/ConsultationModal';

// High-Resolution 3D Concept Model Assets
import aboutLivingRoom from '../assets/about-living-room.jpg';
import consultationDining from '../assets/consultation-dining-room.jpg';
import ctaLivingRoom from '../assets/cta-living-room.jpg';
import heroInterior from '../assets/hero-interior.jpg';

const CostEstimator = () => {
  // Navigation tab: 'estimator' | '3d-models' | 'rate-card'
  const [activeTab, setActiveTab] = useState('estimator');

  // Current active work configuration form
  const [formData, setFormData] = useState({
    projectType: 'kitchen',
    roomLabel: '',
    // Painting specific
    paintingPackage: 'with-putty', // 'without-putty' (₹30) | 'with-putty' (₹35)
    colorOption: 'Warm Ivory (#FBF3E8)',
    customColor: '',
    // Standard modular packages
    kitchenPackage: 'standard',
    wallPanelingPackage: 'standard',
    falseCeilingType: 'gypsum',
    interiorPackage: 'standard',
    wardrobePackage: 'standard',
    // Minor Electrical
    minorElectricalItem: 'electrical-point',
    wireLength: 'standard', // 'standard' (₹4,000) | 'long' (₹5,000)
    // Doors & Carpentry
    doorsCarpentryItem: 'custom-drawer',
    // Gate & Grill painting
    gateGrillItem: 'collapsible-gate',
    // Civil works & Outsourced
    civilWorkType: 'Wall Demolition & Plastering',
    civilBaseCost: 20000,
    outsourcedWorkType: 'Sliding Aluminium Windows',
    outsourcedBaseCost: 30000,
    // Dimensions & Quantities
    quantity: 1,
    length: '10',
    width: '12',
    height: '9',
    contact_phone: '',
    additionalFeatures: [],
    includeGST: true
  });

  // Client Details state
  const [clientDetails, setClientDetails] = useState({
    clientName: '',
    projectName: 'Interior Work',
    location: '',
    quotationNo: `CGI/${new Date().getFullYear()}/${Math.floor(100 + Math.random() * 900)}`,
    date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }),
    validity: '15 Days',
    warrantyYears: '20',
    workingDays: '10–15',
    contact_phone: ''
  });

  // Items List: supports multiple works (Kitchen + Wardrobe + Painting + Electrical + Doors, etc.)
  const [itemsList, setItemsList] = useState([]);

  // Modals state
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState('download'); // 'download' | 'preview'
  const [customerForm, setCustomerForm] = useState({
    clientName: '',
    contact_phone: '',
    location: '',
    projectName: ''
  });
  const [nameError, setNameError] = useState('');
  const [phoneError, setPhoneError] = useState('');

  const [isEditingClient, setIsEditingClient] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isQuotationModalOpen, setIsQuotationModalOpen] = useState(false);
  const [estimationId, setEstimationId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [successToast, setSuccessToast] = useState('');

  // Helper to parse first number from rate string
  const parseRate = (rate) => {
    if (typeof rate === 'string') {
      let cleaned = rate.replace(/₹/g, '').replace(/,/g, '').trim();
      let firstPart = cleaned.split(/[-–—]/)[0].trim();
      let num = parseFloat(firstPart);
      return isNaN(num) ? 0 : num;
    }
    return rate;
  };

  // Luxury Color Palette Presets
  const colorPresets = [
    { name: 'Warm Ivory (#FBF3E8)', hex: '#FBF3E8', label: 'Warm Ivory (Signature Neutral)', border: '#e8d8be' },
    { name: 'Royal Ivory (#FDFBD4)', hex: '#FDFBD4', label: 'Royal Ivory Glow', border: '#e6e2a8' },
    { name: 'Soft Cashmere (#EFE6DD)', hex: '#EFE6DD', label: 'Soft Cashmere / Beige', border: '#d9cdbf' },
    { name: 'Muted Gold (#D4AF37)', hex: '#D4AF37', label: 'Metallic Gold Accent', border: '#b89425' },
    { name: 'Ruby Crimson (#C0142B)', hex: '#C0142B', label: 'Cherry Red / Ruby', border: '#9e0d20' },
    { name: 'Pearl White (#FFFFFF)', hex: '#FFFFFF', label: 'Pearl Pure White', border: '#dcdcdc' },
    { name: 'Charcoal Slate (#2D3748)', hex: '#2D3748', label: 'Charcoal Slate Dark', border: '#1a202c' },
    { name: 'Pastel Sage (#E2EBD8)', hex: '#E2EBD8', label: 'Pastel Sage Mint', border: '#c7d6ba' },
    { name: 'Custom Shade Code', hex: '#E2E8F0', label: 'Custom Shade Code / Asian Paints', border: '#cbd5e1' }
  ];

  // Common Room Space Chips
  const commonRooms = [
    'Living Room',
    'Master Bedroom',
    'Modular Kitchen',
    'Dining Area',
    'Kids Bedroom',
    'Guest Bedroom',
    'Puja Room',
    'Balcony',
    'Foyer / Entrance',
    'Study Room'
  ];

  // Project Types Catalog
  const projectTypes = [
    { id: 'kitchen', name: 'Modular Kitchen', baseRate: 1500, unit: 'sq ft', icon: Home, category: 'area', badge: 'BWP Marine Ply' },
    { id: 'wardrobe', name: 'Modular Wardrobe', baseRate: 1200, unit: 'sq ft', icon: Box, category: 'area', badge: 'Soft-Close' },
    { id: 'painting', name: 'Wall & Ceiling Paint', baseRate: 30, unit: 'sq ft', icon: Paintbrush, category: 'area', badge: '₹30 or ₹35' },
    { id: 'false-ceiling', name: 'False Ceiling', baseRate: 100, unit: 'sq ft', icon: Layers, category: 'area', badge: 'Gypsum/POP' },
    { id: 'wall-paneling', name: 'Wall Paneling', baseRate: 450, unit: 'sq ft', icon: Layers, category: 'area', badge: 'Louvers & Marble' },
    { id: 'minor-electrical', name: 'Electrical & Minor Works', baseRate: 1200, unit: 'point / item', icon: Zap, category: 'item', badge: '4-Trade Labour' },
    { id: 'doors-carpentry', name: 'Doors & Custom Cabinetry', baseRate: 5000, unit: 'item', icon: Wrench, category: 'item', badge: 'Solid Core / Ply' },
    { id: 'gate-grill-paint', name: 'Gate & Grill Paint Package', baseRate: 2500, unit: 'unit', icon: Paintbrush, category: 'item', badge: 'Enamel Coating' },
    { id: 'civil-work', name: 'Civil Works (10% Markup)', baseRate: 'Base + 10%', unit: 'estimate', icon: Hammer, category: 'civil', badge: 'Site Supervised' },
    { id: 'outsourced-work', name: 'Outsourced Specialist (5%)', baseRate: 'Base + 5%', unit: 'estimate', icon: ShieldCheck, category: 'outsourced', badge: 'Vendor Vetted' },
    { id: 'interior-decoration', name: 'Interior Decoration', baseRate: 1250, unit: 'sq ft', icon: Sparkles, category: 'area', badge: 'Styling & Polish' },
    { id: 'complete-home', name: 'Complete Home Turnkey', baseRate: 1600, unit: 'sq ft', icon: Home, category: 'area', badge: 'All-Inclusive' }
  ];

  // Minor Electrical Rate Items
  const minorElectricalRates = [
    { 
      id: 'electrical-point', 
      name: 'New Concealed Electrical Point', 
      rateStandard: 4000, 
      rateLong: 5000, 
      description: '₹4,000 fixed (up to ₹5,000 for long wire runs > 15ft)',
      breakdown: 'Includes 4-trade coordination: 1. Wall cutting labour → 2. Electrician wiring & metal box → 3. Rajmistry cement plaster leveling → 4. Painter putty touch-up'
    },
    { 
      id: 'fan-hook', 
      name: 'Fan Hook & Clamp Repositioning', 
      rate: 1200, 
      description: '₹1,200 fixed per hook / room',
      breakdown: 'Precision middle clamp repositioning, anchoring, ceiling hook adjustment & surface leveling.'
    },
    { 
      id: 'switchboard-8', 
      name: '8-Module Modular Switchboard Replacement', 
      rate: 1500, 
      description: '₹1,500 / board',
      breakdown: 'Includes 8-module modular plate & box, switches, sockets, wiring adjustments, installation & testing.'
    },
    { 
      id: 'switchboard-6', 
      name: '6-Module Modular Switchboard Replacement', 
      rate: 1200, 
      description: '₹1,200 / board',
      breakdown: 'Includes 6-module modular plate & box, switches, sockets, wiring adjustments, installation & testing.'
    },
    { 
      id: 'profile-light-6ft', 
      name: 'Profile Light 6-Foot Run', 
      rate: 2000, 
      description: '₹2,000 / 6 ft',
      breakdown: 'Includes 6ft aluminium profile channel, LED strip light, milky diffuser, concealed driver & fitting.'
    },
    { 
      id: 'ceiling-downlight', 
      name: 'Ceiling Downlight Fixture', 
      rate: 1200, 
      description: '₹1,200 / light',
      breakdown: 'Includes ceiling hole cutting, branded downlight fixture, wiring connection, testing & alignment.'
    },
    { 
      id: 'cob-spotlight', 
      name: 'Small COB Spotlight Fixture', 
      rate: 1000, 
      description: '₹1,000 / light',
      breakdown: 'Includes focused spotlight fixture, concealed driver connection, ceiling clamp & lighting test.'
    }
  ];

  // Doors & Custom Carpentry Items
  const doorsCarpentryRates = [
    { 
      id: 'custom-drawer', 
      name: 'Custom Drawer with Lock', 
      rate: 5000, 
      description: '₹5,000 / drawer (Fixed selling price)',
      breakdown: 'Includes: 2 telescopic drawer channels (one each side) + Additional BWP marine plywood construction + Carpenter cutting, assembly & fitting + Laminate pasting & finishing + Lock with fitting & alignment.'
    },
    { 
      id: 'hidden-drawer-kitchen', 
      name: 'Hidden Drawer Inside Kitchen', 
      rate: 5000, 
      description: '₹5,000 / unit',
      breakdown: 'Concealed drawer construction, extra BWP ply, 2 side channels, internal laminate finish, hardware & carpenter labour.'
    },
    { 
      id: 'door-frame', 
      name: 'Door Frame (Chaukhat)', 
      rate: 12000, 
      description: '₹12,000 fixed / door frame',
      breakdown: 'Heavy-duty Hardwood / WPC door frame, sizing, anti-termite treatment, anchoring, holdfasts & precision vertical alignment.'
    },
    { 
      id: 'entrance-door', 
      name: 'Entrance Main Door (Plain)', 
      rate: 25500, 
      description: 'Starting at ₹25,500 fixed',
      breakdown: 'Heavy-duty solid core entrance door, plain laminate/veneer finish, heavy brass hinges, branded lockset & master fitting.'
    },
    { 
      id: 'wardrobe-led', 
      name: 'LED Lighting Inside Wardrobe', 
      rate: 10000, 
      description: '₹10,000 / wardrobe',
      breakdown: 'Includes interior vertical LED strip lighting, sensor auto-switch, concealed wiring, power supply driver & finishing.'
    },
    { 
      id: 'loft-led', 
      name: 'LED Lighting Under Kitchen Loft Cabinets', 
      rate: 10000, 
      description: '₹10,000 / kitchen layout',
      breakdown: 'Under-cabinet profile LED strip along overhead loft bottom, wiring, dedicated driver, installation & finish.'
    },
    { 
      id: 'profile-glass-shutter', 
      name: 'Profile Shutter Door with Plain Glass', 
      rate: 7500, 
      description: '₹7,500 / unit (up to 5 ft long)',
      breakdown: 'Profile shutter up to 5 ft long, 1–1.5 ft wide plain glass panel, slim aluminium profile frame, glass fitting & hardware.'
    },
    { 
      id: 'double-door-shutter', 
      name: 'Double-Door Cabinet Shutter Set', 
      rate: 8000, 
      description: '₹8,000 / set (Two cabinet shutters)',
      breakdown: 'Two cabinet shutters, selected laminate finish, soft-close hinges, standard hardware, carpenter labour & alignment.'
    }
  ];

  // Gate & Grill Painting Packages
  const gateGrillRates = [
    {
      id: 'collapsible-gate',
      name: 'Collapsible Gate Painting Package',
      rate: 3500,
      description: '₹3,500 / gate',
      breakdown: 'Surface sanding & minor rust removal, metal primer application, final synthetic enamel paint coating, labour & finishing.'
    },
    {
      id: 'window-grill',
      name: 'Window Grill & Frame Painting Package',
      rate: 2500,
      description: '₹2,500 / window',
      breakdown: 'Surface sanding & minor rust removal, primer application, final colour coating, labour & finishing (standard window).'
    }
  ];

  // Civil Works Examples & Markup
  const civilWorkExamples = [
    'Wall Breaking & Demolition',
    'Brickwork & Plastering',
    'Floor & Wall Tiling Work',
    'Waterproofing & Seepage Repair',
    'Cement Work & Wall Levelling',
    'Other Civil Contractor Services'
  ];

  // Outsourced Specialist Works Examples & Markup
  const outsourcedWorkExamples = [
    'Collapsible Gate Supply & Fitting',
    'Sliding Aluminium Door Fitting',
    'Aluminium Window Supply & Fitting',
    'Steel Fabrication & Installation',
    'Grill & Railing Work',
    'Glass Partition Installation',
    'Other Specialist Vendor Work'
  ];

  // Standard Modular Packages
  const kitchenPackages = [
    { id: 'standard', name: 'Standard Package', rate: 1500, description: 'BWP Plywood + Choice of Veneer or Glossy Laminate', features: ['Smooth edge banding', 'Soft-close hinges & channels', 'Profile lights inside cabinets', '2 Years Hardware Warranty', '10 Years Service Warranty'] },
    { id: 'luxury', name: 'Luxury Package', rate: 1900, description: 'BWP Plywood + Acrylic Finish (High Gloss)', features: ['Mirror-like glossy look', 'Scratch-resistant surface', 'Premium durability', 'Soft-close hardware', 'Profile lighting inside cabinets', '5 Years Hardware Warranty', '10 Years Service Warranty'] }
  ];

  const wallPanelingPackages = [
    { id: 'standard', name: 'Standard Package', rate: 475, description: '25% area covered with design materials', features: ['12mm plywood base', 'Cushion panels', 'Laminates', 'UV marble sheets', 'Designer PVC louvers', 'CNC-cut designs'] },
    { id: 'premium', name: 'Premium Package', rate: 575, description: '50% area covered with design materials', features: ['12mm plywood base', 'Premium design materials', 'More design flexibility', 'Enhanced finishes', 'Custom CNC work'] }
  ];

  const falseCeilingTypes = [
    { id: 'gypsum', name: 'Gypsum False Ceiling', rate: 100, description: 'Sleek, modern look with clean lines', features: ['Best for standard rooms', 'Minimalistic designs', 'Paint & Putty: ₹35/sq.ft extra'] },
    { id: 'pop', name: 'POP False Ceiling', rate: 120, description: 'Smooth surface, ideal for curves & creative shapes', features: ['Best for living rooms', 'Artistic ceiling concepts', 'Paint & Putty: ₹35/sq.ft extra'] },
    { id: 'pvc', name: 'PVC False Ceiling', rate: 220, description: 'Available in textures & prints - no painting needed', features: ['Water-resistant', 'Termite-proof', 'Low-maintenance'] }
  ];

  const interiorPackages = [
    { id: 'standard', name: 'Standard Plan', rate: 1250, description: '0.8mm/1mm Glossy Laminate with Basic PVC Edge Banding', features: ['7 Years Warranty', 'Moisture & scratch-resistant', 'Budget-friendly', 'Simple modular finish'] },
    { id: 'premium', name: 'Premium Plan', rate: 1450, description: 'High Gloss Laminate with Soft PVC Edge Banding', features: ['10 Years Warranty', 'Sleek gloss & modern finish', 'Soft edge banding', 'Enhanced elegance'] },
    { id: 'royal', name: 'Royal Plan', rate: 1800, description: 'Acrylic High Gloss Laminate with Seamless Finish', features: ['15 Years Warranty', 'Mirror-like shine', 'Premium appearance', 'Scratch-resistant'] }
  ];

  const wardrobePackages = [
    { id: 'standard', name: 'Standard Package', rate: 1250, description: 'Premium Plywood + Slightly Glossy Laminate', features: ['7 Years Service Warranty', '1 Year Hardware Warranty', 'Durable laminate finish'] },
    { id: 'premium', name: 'Premium Package', rate: 1450, description: 'BWP Termite-Proof Plywood + High Gloss Laminate/Veneer', features: ['10 Years Service Warranty', '2 Years Hardware Warranty', 'Superior water resistance', 'Profile light included'] },
    { id: 'luxury', name: 'Luxury Package', rate: 1800, description: 'BWP Plywood + Acrylic Laminate (Scratch-Resistant)', features: ['15 Years Service Warranty', '3 Years Hardware Warranty', 'Mirror gloss finish', 'Profile light included'] }
  ];

  // Comprehensive List of Add-ons / Accessories
  const additionalFeatures = [
    { id: 'custom-drawer', name: 'Custom Drawer with Lock', cost: 5000, desc: '2 channels, extra ply, laminate & lock' },
    { id: 'hidden-drawer', name: 'Hidden Kitchen Drawer', cost: 5000, desc: 'Concealed box with channels & ply' },
    { id: 'profile-glass-shutter', name: 'Profile Plain Glass Shutter', cost: 7500, desc: '5ft profile aluminium & plain glass' },
    { id: 'double-door-shutter', name: 'Double-Door Cabinet Shutter Set', cost: 8000, desc: '2 shutters with hinges & labour' },
    { id: 'loft-led', name: 'LED Under Kitchen Loft', cost: 10000, desc: 'Profile LED run with driver' },
    { id: 'wardrobe-led', name: 'Wardrobe Interior LED Strip', cost: 10000, desc: 'Vertical strip with sensor' },
    { id: 'profile-light-6ft', name: 'Profile Light 6-ft Run', cost: 2000, desc: 'Channel + LED strip + diffuser' },
    { id: 'ceiling-downlight', name: 'Ceiling Downlight', cost: 1200, desc: 'Downlight fixture with wiring' },
    { id: 'cob-spotlight', name: 'Small COB Spotlight', cost: 1000, desc: 'Focused COB fixture' },
    { id: 'fan-hook', name: 'Fan Hook & Clamp Reposition', cost: 1200, desc: 'Ceiling clamp repositioning' },
    { id: 'electrical-point-std', name: 'New Electrical Point (4-Trade)', cost: 4000, desc: 'Cutting + Wiring + Mason + Putty' },
    { id: 'switchboard-8', name: '8-Module Switchboard', cost: 1500, desc: 'Plate, box, switches & sockets' },
    { id: 'switchboard-6', name: '6-Module Switchboard', cost: 1200, desc: 'Plate, box, switches & sockets' },
    { id: 'soft-close', name: 'Soft Close Hinges (Full Unit)', cost: 15000, desc: 'Hydraulic soft-close hinges' },
    { id: 'mirror-work', name: 'Mirror Work', cost: 10000, desc: 'Beveled designer mirror' },
    { id: 'magic-corner', name: 'Magic Corner (Kitchen)', cost: 25000, desc: 'Chrome pull-out corner basket' },
    { id: 'steel-baskets', name: 'Stainless Steel Baskets (Set)', cost: 15000, desc: 'SS 304 modular kitchen baskets' }
  ];

  // 3D Interior Concept Models for Packages
  const conceptModels3D = [
    {
      id: 'kitchen-3d',
      title: 'Modular Kitchen 3D Architecture',
      tag: 'L-Shaped & Parallel Layouts',
      rate: '₹1,500 – ₹1,900 / sq.ft',
      image: heroInterior,
      badge: 'Royal Acrylic Gloss',
      specs: [
        'BWP Marine Grade Plywood Carcass (Waterproof)',
        'Anti-scratch Acrylic High Gloss Finish with Laser Edge-band',
        'Under-Cabinet Profile LED Strip Lighting (₹10k value)',
        'Concealed In-Drawer Cutlery Tray & Soft-close Tandem Boxes',
        '20 Years Workmanship Warranty & Lifetime Service Assurance'
      ],
      description: 'Ergonomic 3D modular kitchen model engineered for smooth movement between hob, sink, and refrigerator with moisture-sealed jointing.',
      targetType: 'kitchen'
    },
    {
      id: 'wardrobe-3d',
      title: 'Master Bedroom Wardrobe 3D Layout',
      tag: 'Floor-to-Ceiling Luxury Storage',
      rate: '₹1,200 – ₹1,800 / sq.ft',
      image: consultationDining,
      badge: 'Profile Glass Shutter',
      specs: [
        'Full-height BWP Termite-Proof Plywood internal carcass',
        'Slim Profile Shutter with Tinted/Plain Glass (₹7,500/unit)',
        'Custom Drawers with Concealed Locksets (₹5,000/drawer)',
        'Integrated Interior Vertical Sensor LED Strip Lighting',
        'Dedicated Saree / Suit Hanging & Velvet Accessory Trays'
      ],
      description: 'Architectural floor-to-ceiling 3D wardrobe concept with internal concealed locks, soft-close sliding channels, and ambient vertical illumination.',
      targetType: 'wardrobe'
    },
    {
      id: 'living-3d',
      title: 'Luxury Living Room 3D Concept',
      tag: 'Wall Paneling + POP Ceiling + Lighting',
      rate: 'Turnkey Layout Package',
      image: aboutLivingRoom,
      badge: 'Fluted Louvers & UV Marble',
      specs: [
        'Designer Fluted PVC Louvers & UV Marble Sheet TV Unit',
        'Perimeter POP False Ceiling with Concealed Cove Lights',
        '6-Foot Warm Gold Profile Light Runs (₹2,000/run)',
        'Integrated 8-Module & 6-Module Modular Switchboards',
        'Signature Warm Ivory (#FBF3E8) Surface Harmony'
      ],
      description: 'Acoustic fluted wall paneling combined with architectural layered false ceiling and warm indirect cove lighting for a five-star ambience.',
      targetType: 'wall-paneling'
    },
    {
      id: 'complete-home-3d',
      title: 'Turnkey 2BHK / 3BHK Home 3D Layout',
      tag: 'All-Inclusive Interior Package',
      rate: '₹1,600 / sq.ft Turnkey',
      image: ctaLivingRoom,
      badge: 'Turnkey Handover',
      specs: [
        'Turnkey Living, Dining, Master Bedroom & Kitchen',
        'Civil Works & Wall Levelling with 10% Coordination',
        'Outsourced Sliding Aluminium Windows with 5% Coordination',
        'Birla Putty + Luxury Emulsion Painting @ ₹35/sq.ft',
        'Guaranteed Handover in 10–15 Working Days'
      ],
      description: 'Complete home turnkey model synchronizing civil masonry, electrical point additions, carpentry, and painting under one unified proposal.',
      targetType: 'complete-home'
    }
  ];

  const getCSRFToken = () => {
    const cookieValue = document.cookie
      .split('; ')
      .find(row => row.startsWith('csrftoken='))
      ?.split('=')[1];
    return cookieValue || '';
  };

  const saveEstimationToBackend = async (calculatedItems) => {
    setIsSaving(true);
    try {
      const totalBasePrice = calculatedItems.reduce((sum, item) => sum + item.basePrice, 0);
      const totalFeaturesTotal = calculatedItems.reduce((sum, item) => sum + item.featuresTotal, 0);
      const subtotal = totalBasePrice + totalFeaturesTotal;
      const gst = formData.includeGST ? subtotal * 0.18 : 0;
      const finalCost = subtotal + gst;
      const totalArea = calculatedItems.reduce((sum, item) => sum + (item.area || 0), 0);

      const response = await fetch('http://127.0.0.1:8000/api/quote/api/estimations/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCSRFToken(),
        },
        body: JSON.stringify({
          project_type: calculatedItems.map(i => i.projectTypeName).join(' + '),
          kitchen_package: formData.kitchenPackage,
          wall_paneling_package: formData.wallPanelingPackage,
          false_ceiling_type: formData.falseCeilingType,
          interior_package: formData.interiorPackage,
          wardrobe_package: formData.wardrobePackage,
          length: parseFloat(formData.length || 0),
          width: parseFloat(formData.width || 0),
          height: parseFloat(formData.height || 0),
          contact_phone: formData.contact_phone || clientDetails.contact_phone,
          area: totalArea,
          base_price: totalBasePrice,
          features_total: totalFeaturesTotal,
          subtotal: subtotal,
          gst: gst,
          final_cost: finalCost,
          include_gst: formData.includeGST,
          additional_features: formData.additionalFeatures,
          package_description: calculatedItems.map(i => `${i.projectTypeName}: ${i.packageName}`).join(', '),
          package_features: calculatedItems[0]?.packageFeatures || [],
        })
      });

      if (response.ok) {
        const data = await response.json();
        setEstimationId(data.id);
        setIsSaving(false);
        return data.id;
      } else {
        setIsSaving(false);
        return null;
      }
    } catch (error) {
      setIsSaving(false);
      return null;
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFeatureChange = (featureId, checked) => {
    setFormData({
      ...formData,
      additionalFeatures: checked
        ? [...formData.additionalFeatures, featureId]
        : formData.additionalFeatures.filter(f => f !== featureId)
    });
  };

  // Build a single work item object from current form values
  const buildCurrentWorkItem = () => {
    const projectTypeObj = projectTypes.find(p => p.id === formData.projectType) || projectTypes[0];
    const qty = Math.max(1, parseInt(formData.quantity, 10) || 1);
    const length = parseFloat(formData.length) || 1;
    const width = parseFloat(formData.width) || 1;
    const area = length * width;

    let baseRate = 0;
    let basePrice = 0;
    let selectedPackage = '';
    let packageDescription = '';
    let packageFeatures = [];
    let unitLabel = 'sq ft';
    let extraDetails = {};

    const getRate = (pkg) => parseRate(pkg.rate);

    // 1. PAINTING WORK
    if (formData.projectType === 'painting') {
      const withPutty = formData.paintingPackage === 'with-putty';
      baseRate = withPutty ? 35 : 30;
      basePrice = area * baseRate;
      const shadeName = formData.colorOption === 'Custom Shade Code' && formData.customColor.trim() 
        ? formData.customColor.trim() 
        : formData.colorOption;

      selectedPackage = withPutty ? 'Painting with Birla Putty (₹35/sq.ft)' : 'Standard Painting (₹30/sq.ft)';
      packageDescription = withPutty 
        ? `Sanding + 2 coats Birla Putty + Primer + 2 coats Luxury Emulsion in shade "${shadeName}"`
        : `Surface Sanding + 1 coat Primer + 2 coats Premium Emulsion in shade "${shadeName}"`;
      packageFeatures = withPutty
        ? ['Surface sanding & crack repair', '2 coats Birla White wall putty', '1 coat acrylic primer', '2 coats luxury emulsion paint', 'Switchboard & floor masking']
        : ['Mechanical surface sanding', '1 coat primer base', '2 coats premium emulsion paint', 'Floor protection & final clean'];
      extraDetails = { shadeName, withPutty };
    }
    // 2. MINOR ELECTRICAL WORKS
    else if (formData.projectType === 'minor-electrical') {
      const elecItem = minorElectricalRates.find(r => r.id === formData.minorElectricalItem) || minorElectricalRates[0];
      if (elecItem.id === 'electrical-point') {
        const isLong = formData.wireLength === 'long';
        baseRate = isLong ? 5000 : 4000;
        selectedPackage = `New Electrical Point (${isLong ? 'Long Run >15ft @ ₹5k' : 'Standard Run @ ₹4k'})`;
      } else {
        baseRate = elecItem.rate;
        selectedPackage = elecItem.name;
      }
      basePrice = baseRate * qty;
      unitLabel = `${qty} unit${qty > 1 ? 's' : ''}`;
      packageDescription = elecItem.breakdown;
      packageFeatures = [
        'Concealed wall grooving / cutting',
        'FR copper wiring & modular metal box',
        'Cement plastering by Rajmistry flush with wall',
        'Painter putty touch-up & finish',
        'Circuit testing & safety inspection'
      ];
      extraDetails = { quantity: qty, isLongWire: formData.wireLength === 'long' };
    }
    // 3. DOORS & CUSTOM CARPENTRY
    else if (formData.projectType === 'doors-carpentry') {
      const doorItem = doorsCarpentryRates.find(d => d.id === formData.doorsCarpentryItem) || doorsCarpentryRates[0];
      baseRate = doorItem.rate;
      basePrice = baseRate * qty;
      selectedPackage = `${doorItem.name} (₹${baseRate.toLocaleString('en-IN')})`;
      unitLabel = `${qty} unit${qty > 1 ? 's' : ''}`;
      packageDescription = doorItem.breakdown;
      packageFeatures = [
        'BWP Marine / Hardwood structural integrity',
        'Heavy-duty hardware & slide alignment',
        'Multi-layer laminate / veneer protective finish',
        'Branded locks & precision fitting'
      ];
      extraDetails = { quantity: qty };
    }
    // 4. GATE & GRILL PAINTING
    else if (formData.projectType === 'gate-grill-paint') {
      const ggItem = gateGrillRates.find(g => g.id === formData.gateGrillItem) || gateGrillRates[0];
      baseRate = ggItem.rate;
      basePrice = baseRate * qty;
      selectedPackage = `${ggItem.name} (₹${baseRate.toLocaleString('en-IN')})`;
      unitLabel = `${qty} unit${qty > 1 ? 's' : ''}`;
      packageDescription = ggItem.breakdown;
      packageFeatures = [
        'Surface sanding & rust scraping',
        'Red oxide / metal anti-corrosive primer',
        '2 coats premium synthetic enamel gloss finish',
        'Full labour and edge finishing included'
      ];
      extraDetails = { quantity: qty };
    }
    // 5. CIVIL WORKS (10% MARKUP)
    else if (formData.projectType === 'civil-work') {
      const baseCost = Math.max(1000, parseFloat(formData.civilBaseCost) || 20000);
      const markupAmount = Math.round(baseCost * 0.10);
      basePrice = baseCost + markupAmount;
      baseRate = basePrice;
      selectedPackage = `Civil Work: ${formData.civilWorkType}`;
      unitLabel = '1 Project Scope';
      packageDescription = `Contractor base: ₹${baseCost.toLocaleString('en-IN')} + 10% coordination fee (₹${markupAmount.toLocaleString('en-IN')})`;
      packageFeatures = [
        'Site supervision & contractor alignment',
        'Quality inspection of cement mortar & leveling',
        'Debris clearance & site management',
        '10% transparent coordination fee'
      ];
      extraDetails = { baseCost, markupPercent: 10, markupAmount };
    }
    // 6. OUTSOURCED SPECIALIST (5% MARKUP)
    else if (formData.projectType === 'outsourced-work') {
      const baseCost = Math.max(1000, parseFloat(formData.outsourcedBaseCost) || 30000);
      const markupAmount = Math.round(baseCost * 0.05);
      basePrice = baseCost + markupAmount;
      baseRate = basePrice;
      selectedPackage = `Outsourced: ${formData.outsourcedWorkType}`;
      unitLabel = '1 Vendor Scope';
      packageDescription = `Vendor base quote: ₹${baseCost.toLocaleString('en-IN')} + 5% coordination fee (₹${markupAmount.toLocaleString('en-IN')})`;
      packageFeatures = [
        'Specialist vendor sourcing & dimension verification',
        'Transportation & on-site fitting coordination',
        'Hardware alignment and quality check',
        '5% transparent coordination fee'
      ];
      extraDetails = { baseCost, markupPercent: 5, markupAmount };
    }
    // 7. MODULAR KITCHEN
    else if (formData.projectType === 'kitchen') {
      const pkg = kitchenPackages.find(p => p.id === formData.kitchenPackage) || kitchenPackages[0];
      baseRate = getRate(pkg);
      basePrice = area * baseRate;
      selectedPackage = pkg.name;
      packageDescription = pkg.description;
      packageFeatures = pkg.features;
    }
    // 8. WALL PANELING
    else if (formData.projectType === 'wall-paneling') {
      const pkg = wallPanelingPackages.find(p => p.id === formData.wallPanelingPackage) || wallPanelingPackages[0];
      baseRate = getRate(pkg);
      basePrice = area * baseRate;
      selectedPackage = pkg.name;
      packageDescription = pkg.description;
      packageFeatures = pkg.features;
    }
    // 9. FALSE CEILING
    else if (formData.projectType === 'false-ceiling') {
      const pkg = falseCeilingTypes.find(t => t.id === formData.falseCeilingType) || falseCeilingTypes[0];
      baseRate = getRate(pkg);
      basePrice = area * baseRate;
      selectedPackage = pkg.name;
      packageDescription = pkg.description;
      packageFeatures = pkg.features;
    }
    // 10. INTERIOR DECORATION
    else if (formData.projectType === 'interior-decoration') {
      const pkg = interiorPackages.find(p => p.id === formData.interiorPackage) || interiorPackages[0];
      baseRate = getRate(pkg);
      basePrice = area * baseRate;
      selectedPackage = pkg.name;
      packageDescription = pkg.description;
      packageFeatures = pkg.features;
    }
    // 11. WARDROBE
    else if (formData.projectType === 'wardrobe') {
      const pkg = wardrobePackages.find(p => p.id === formData.wardrobePackage) || wardrobePackages[0];
      baseRate = getRate(pkg);
      basePrice = area * baseRate;
      selectedPackage = pkg.name;
      packageDescription = pkg.description;
      packageFeatures = pkg.features;
    }
    // 12. COMPLETE HOME / TURNKEY
    else {
      baseRate = parseRate(projectTypeObj.baseRate);
      basePrice = area * baseRate;
      selectedPackage = 'Turnkey Complete Home';
      packageDescription = 'Full home modular woodwork, hardware & installation';
      packageFeatures = ['Termite-proof BWP materials', 'Turnkey coordination', '20 Years Workmanship Warranty'];
    }

    // Resolve additional features selected for this work
    const selectedFeaturesObj = formData.additionalFeatures.map(featId => {
      return additionalFeatures.find(f => f.id === featId);
    }).filter(Boolean);

    const featuresTotal = selectedFeaturesObj.reduce((total, feat) => total + feat.cost, 0);
    const itemTotal = basePrice + featuresTotal;

    return {
      id: 'work_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      projectType: formData.projectType,
      projectTypeName: projectTypeObj.name,
      roomLabel: formData.roomLabel.trim(),
      packageName: selectedPackage,
      packageDescription,
      packageFeatures,
      unitLabel,
      quantity: qty,
      length,
      width,
      area: projectTypeObj.category === 'area' ? area : qty,
      isAreaBased: projectTypeObj.category === 'area',
      baseRate,
      basePrice,
      additionalFeatures: selectedFeaturesObj,
      featuresTotal,
      itemTotal,
      extraDetails
    };
  };

  // Add work to itemsList
  const handleAddWorkToQuotation = (e) => {
    if (e) e.preventDefault();

    const newItem = buildCurrentWorkItem();
    const updatedList = [...itemsList, newItem];
    setItemsList(updatedList);

    // Auto-update project title if not manually edited
    const workNames = updatedList.map(item => item.roomLabel ? `${item.projectTypeName} (${item.roomLabel})` : item.projectTypeName);
    const autoTitle = workNames.join(' + ') + ' Work';
    setClientDetails(prev => ({
      ...prev,
      projectName: autoTitle,
      contact_phone: formData.contact_phone || prev.contact_phone
    }));

    // Reset current form to prepare for next work addition
    const nextType = formData.projectType === 'kitchen' ? 'wardrobe' : formData.projectType === 'wardrobe' ? 'painting' : 'kitchen';
    setFormData(prev => ({
      ...prev,
      projectType: nextType,
      roomLabel: '',
      additionalFeatures: []
    }));

    setSuccessToast(`✓ ${newItem.projectTypeName} added to quotation!`);
    setTimeout(() => setSuccessToast(''), 3500);

    saveEstimationToBackend(updatedList);
  };

  // Remove a work item
  const handleRemoveItem = (id) => {
    const updated = itemsList.filter(item => item.id !== id);
    setItemsList(updated);
    if (updated.length > 0) {
      const workNames = updated.map(item => item.roomLabel ? `${item.projectTypeName} (${item.roomLabel})` : item.projectTypeName);
      setClientDetails(prev => ({
        ...prev,
        projectName: workNames.join(' + ') + ' Work'
      }));
    }
  };

  // Calculations across all items
  const totalBasePrice = itemsList.reduce((sum, item) => sum + item.basePrice, 0);
  const totalFeaturesTotal = itemsList.reduce((sum, item) => sum + item.featuresTotal, 0);
  const subtotal = totalBasePrice + totalFeaturesTotal;
  const gst = formData.includeGST ? Math.round(subtotal * 0.18) : 0;
  const finalCost = subtotal + gst;
  const totalArea = itemsList.filter(i => i.isAreaBased).reduce((sum, item) => sum + (item.area || 0), 0);

  // Scope of Work generator combining all selected works
  const getScopeOfWorkForItems = (items) => {
    if (!items || items.length === 0) return [];

    const allScopes = [];
    items.forEach((item) => {
      const pType = item.projectType;
      const pkg = item.packageName;
      const room = item.roomLabel ? ` [${item.roomLabel}]` : '';

      if (pType === 'painting') {
        const shade = item.extraDetails?.shadeName || 'Selected Palette';
        const withPutty = item.extraDetails?.withPutty;
        allScopes.push(
          { work: `Surface Preparation${room}`, desc: withPutty ? 'Mechanical sanding, crack bridging & double-coat Birla White Wall Putty application' : 'Surface sanding, dust clearing and high-adhesion primer base application' },
          { work: `Paint Application${room}`, desc: `2 coats luxury emulsion coating in shade: ${shade} with seamless roller finish` },
          { work: `Masking & Protection${room}`, desc: 'Switchboard tape masking, floor drop-cloth protection, and post-application cleanup' }
        );
      } else if (pType === 'minor-electrical') {
        allScopes.push(
          { work: `Concealed Chasing & Conduit${room}`, desc: `4-Trade coordination: wall cutting, PVC pipe & FR copper wiring (Polycab/Finolex) for ${pkg}` },
          { work: `Civil Plastering & Putty${room}`, desc: 'Rajmistry cement mortar leveling flush with wall + painter putty pre-finish' },
          { work: `Modular Fixtures & Testing${room}`, desc: 'Modular plate mounting, switch alignment, load testing & circuit balancing' }
        );
      } else if (pType === 'doors-carpentry') {
        allScopes.push(
          { work: `Woodwork & Carcass${room}`, desc: `Heavy-duty structural execution (${pkg}) with BWP marine grade plywood / hardwood` },
          { work: `Hardware & Channels${room}`, desc: 'Dual-side telescopic channels, heavy brass/SS hinges & laser-aligned fittings' },
          { work: `Laminate & Lock Fitting${room}`, desc: 'Scratch-resistant laminate balance, branded lock installation & smooth slide test' }
        );
      } else if (pType === 'gate-grill-paint') {
        allScopes.push(
          { work: `Rust Treatment & Primer${room}`, desc: 'Wire-brush scraping, rust removal & anti-corrosive metal red oxide/zinc primer' },
          { work: `Enamel Paint Finishing${room}`, desc: '2 coats high-gloss synthetic enamel finish for outdoor weather resistance' }
        );
      } else if (pType === 'civil-work') {
        allScopes.push(
          { work: `Civil Execution & Supervision${room}`, desc: `${item.packageName} with end-to-end site supervision & quality control` },
          { work: `Contractor Coordination (10%)${room}`, desc: '10% coordination charge for site logistics, material procurement & safety administration' }
        );
      } else if (pType === 'outsourced-work') {
        allScopes.push(
          { work: `Specialist Fabrication${room}`, desc: `${item.packageName} with on-site dimension vetting & specialist fabrication` },
          { work: `Vendor Management (5%)${room}`, desc: '5% vendor coordination charge covering delivery logistics, installation & inspection' }
        );
      } else if (pType === 'kitchen') {
        allScopes.push(
          { work: `Kitchen Carcass${room}`, desc: `Heavy duty BWP Marine Plywood carcass with ${pkg} finish` },
          { work: `Shutters & Hardware${room}`, desc: 'Soft-close hydraulic hinges, precision edge-banded shutters with premium laminates' },
          { work: `Lighting & Finishing${room}`, desc: 'Concealed LED profile light channels, laser leveling, putty & protective seal coating' }
        );
      } else if (pType === 'wardrobe') {
        allScopes.push(
          { work: `Wardrobe Carcass${room}`, desc: `BWP Termite-proof plywood structure with full internal laminate balance (${pkg})` },
          { work: `Front Shutters${room}`, desc: 'Designer shutters with heavy-duty soft-close slide channels and profile handles' },
          { work: `Internal Organizers${room}`, desc: 'Dedicated hanging rods, pull-out drawers, concealed locks and accessory slots' }
        );
      } else if (pType === 'false-ceiling') {
        allScopes.push(
          { work: `Ceiling Structure${room}`, desc: `Precision perimeter channel framework for ${pkg || 'False Ceiling'}` },
          { work: `Ceiling Design & Board${room}`, desc: 'Tray ceiling design with POP/Gypsum border detailing, joint taping & primer' }
        );
      } else if (pType === 'wall-paneling') {
        allScopes.push(
          { work: `Wall Paneling Core${room}`, desc: `12mm calibrated plywood base paneling according to ${pkg}` },
          { work: `Decorative Paneling${room}`, desc: 'Designer PVC louvers / UV marble sheets / CNC styling as per specifications' }
        );
      } else {
        allScopes.push(
          { work: `${item.projectTypeName} Layout${room}`, desc: `Precision installation according to ${pkg} design concept` },
          { work: `Paneling & Surface${room}`, desc: 'Termite and borer resistant engineered panels with premium surface finish' }
        );
      }
    });

    return allScopes;
  };

  // Open the Client Name Modal before triggering PDF download or Letterhead preview
  const handleRequestDownload = () => {
    let activeList = itemsList;
    if (activeList.length === 0) {
      const newItem = buildCurrentWorkItem();
      activeList = [newItem];
      setItemsList(activeList);
      setClientDetails(prev => ({
        ...prev,
        projectName: `${newItem.projectTypeName} Work`
      }));
    }

    setPendingAction('download');
    setCustomerForm({
      clientName: clientDetails.clientName || '',
      contact_phone: clientDetails.contact_phone || formData.contact_phone || '',
      location: clientDetails.location || '',
      projectName: clientDetails.projectName || `${activeList.map(i => i.projectTypeName).join(' + ')} Work`
    });
    setNameError('');
    setPhoneError('');
    setIsCustomerModalOpen(true);
  };

  const handleRequestLetterheadPreview = () => {
    let activeList = itemsList;
    if (activeList.length === 0) {
      const newItem = buildCurrentWorkItem();
      activeList = [newItem];
      setItemsList(activeList);
      setClientDetails(prev => ({
        ...prev,
        projectName: `${newItem.projectTypeName} Work`
      }));
    }

    if (!clientDetails.clientName || clientDetails.clientName.trim() === '' || !clientDetails.contact_phone || clientDetails.contact_phone.trim() === '') {
      setPendingAction('preview');
      setCustomerForm({
        clientName: clientDetails.clientName || '',
        contact_phone: clientDetails.contact_phone || formData.contact_phone || '',
        location: clientDetails.location || '',
        projectName: clientDetails.projectName || `${activeList.map(i => i.projectTypeName).join(' + ')} Work`
      });
      setNameError('');
      setPhoneError('');
      setIsCustomerModalOpen(true);
    } else {
      setIsQuotationModalOpen(true);
    }
  };

  // Handle submit of customer name & phone modal
  const handleConfirmCustomerDetails = (e) => {
    e.preventDefault();
    let hasError = false;

    if (!customerForm.clientName || !customerForm.clientName.trim()) {
      setNameError('Please enter customer / client name');
      hasError = true;
    }

    const rawPhone = (customerForm.contact_phone || '').trim();
    const cleanPhone = rawPhone.replace(/\D/g, '');

    if (!rawPhone) {
      setPhoneError('Phone number is compulsory');
      hasError = true;
    } else if (cleanPhone.length < 10) {
      setPhoneError('Please enter a valid 10-digit mobile number');
      hasError = true;
    }

    if (hasError) return;

    const formattedPhone = cleanPhone.slice(-10);

    const updatedClient = {
      ...clientDetails,
      clientName: customerForm.clientName.trim(),
      contact_phone: formattedPhone,
      location: customerForm.location.trim() || clientDetails.location,
      projectName: customerForm.projectName.trim() || clientDetails.projectName
    };

    setClientDetails(updatedClient);
    setFormData(prev => ({ ...prev, contact_phone: formattedPhone }));

    setIsCustomerModalOpen(false);

    if (pendingAction === 'download') {
      setTimeout(() => {
        executePrint(updatedClient, itemsList.length > 0 ? itemsList : [buildCurrentWorkItem()]);
      }, 150);
    } else {
      setIsQuotationModalOpen(true);
    }
  };

  // Generate and print the official 2-Page Letterhead PDF Quote via iframe
  const executePrint = (client, itemsToPrint) => {
    const existing = document.getElementById('quotation-print-frame');
    if (existing) {
      existing.remove();
    }

    const iframe = document.createElement('iframe');
    iframe.id = 'quotation-print-frame';
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0px';
    iframe.style.height = '0px';
    iframe.style.border = '0';
    iframe.style.visibility = 'hidden';

    document.body.appendChild(iframe);

    const doc = iframe.contentWindow.document;
    const origin = window.location.origin;

    const printBasePrice = itemsToPrint.reduce((sum, item) => sum + item.basePrice, 0);
    const printFeaturesTotal = itemsToPrint.reduce((sum, item) => sum + item.featuresTotal, 0);
    const printSubtotal = printBasePrice + printFeaturesTotal;
    const printGst = formData.includeGST ? Math.round(printSubtotal * 0.18) : 0;
    const printFinalCost = printSubtotal + printGst;
    const printTotalArea = itemsToPrint.filter(i => i.isAreaBased).reduce((sum, item) => sum + (item.area || 0), 0);

    const scopeRows = getScopeOfWorkForItems(itemsToPrint).map((item, idx) => `
      <tr style="border-bottom: 1px solid #f1d5d5; background: ${idx % 2 === 0 ? '#ffffff' : '#fdf8f8'};">
        <td style="padding: 6px 10px; font-weight: 600; color: #111; font-style: italic; vertical-align: top; width: 34%;">${item.work}</td>
        <td style="padding: 6px 10px; color: #333; font-style: italic; vertical-align: top; width: 66%;">${item.desc}</td>
      </tr>
    `).join('');

    const itemizedRows = itemsToPrint.map((item, idx) => {
      let dimensionOrQty = '';
      if (item.isAreaBased) {
        dimensionOrQty = `${item.packageName} (${item.length}ft × ${item.width}ft = ${item.area} sq.ft)`;
        if (item.extraDetails?.shadeName) {
          dimensionOrQty += `<br/><span style="color: #c0142b; font-weight: 600;">Color: ${item.extraDetails.shadeName}</span>`;
        }
      } else {
        dimensionOrQty = `${item.packageName} [${item.unitLabel}]`;
      }

      return `
        <tr style="border-bottom: 1px solid #f1d5d5; background: ${idx % 2 === 0 ? '#ffffff' : '#fdf8f8'};">
          <td style="padding: 6px 8px; font-weight: bold; color: #555; text-align: center;">${idx + 1}</td>
          <td style="padding: 6px 8px; font-weight: 600; color: #111;">
            ${item.projectTypeName} ${item.roomLabel ? `<span style="color: #666; font-weight: normal;">(${item.roomLabel})</span>` : ''}
            ${item.additionalFeatures && item.additionalFeatures.length > 0 
              ? `<div style="font-size: 8.5px; color: #777; font-weight: normal; margin-top: 2px;">+ Add-ons: ${item.additionalFeatures.map(f => f.name).join(', ')}</div>` 
              : ''}
          </td>
          <td style="padding: 6px 8px; color: #333; font-size: 10px;">
            ${dimensionOrQty}
          </td>
          <td style="padding: 6px 8px; text-align: right; font-weight: bold; color: #111;">
            ₹${item.itemTotal.toLocaleString('en-IN')}
          </td>
        </tr>
      `;
    }).join('');

    const worksOverviewText = itemsToPrint.map(i => i.roomLabel ? `${i.projectTypeName} (${i.roomLabel})` : i.projectTypeName).join(', ');

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Quotation_${(client.clientName || 'Customer').replace(/\\s+/g, '_')}_${client.quotationNo || 'CGI_2026'}</title>
          <style>
            @page {
              size: A4 portrait;
              margin: 10mm 14mm;
            }
            * {
              box-sizing: border-box;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            html, body {
              margin: 0;
              padding: 0;
              background: #fff;
              color: #111;
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            }
            .a4-page {
              width: 100%;
              min-height: 270mm;
              max-height: 270mm;
              box-sizing: border-box;
              padding: 0;
              margin: 0;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              page-break-after: always;
              break-after: page;
              page-break-inside: avoid;
              break-inside: avoid;
            }
            .a4-page:last-child {
              page-break-after: avoid;
              break-after: avoid;
            }
            table {
              width: 100%;
              border-collapse: collapse;
            }
          </style>
        </head>
        <body>
          <!-- PAGE 1 -->
          <div class="a4-page">
            <div>
              <!-- Header -->
              <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 6px;">
                <div style="width: 75px; flex-shrink: 0;">
                  <img src="${origin}/images/logo.png" style="width: 100%; height: auto;" />
                </div>
                <div style="text-align: center; flex: 1; padding-right: 20px;">
                  <h1 style="color: #c0142b; font-family: 'Times New Roman', serif; font-size: 24px; font-weight: 800; letter-spacing: 0.8px; margin: 0; line-height: 1.15;">
                    CHERRY GOLD INTERIORS PVT. LTD.
                  </h1>
                  <p style="font-weight: 800; font-size: 11px; margin: 3px 0 2px; color: #111; letter-spacing: 0.5px;">
                    U74102WB2025PTC279494
                  </p>
                  <p style="font-size: 10.5px; margin: 2px 0; color: #333; line-height: 1.3;">
                    75 Prafulla Nagar Colony, Belgharia, North 24 Parganas, West Bengal - <span style="color: #2563eb; font-weight: 700;">700056</span>
                  </p>
                  <p style="font-size: 10.5px; font-weight: 700; margin: 2px 0; color: #111;">
                    9433889668 | 7687914255
                  </p>
                  <p style="font-size: 10px; margin: 2px 0; color: #2563eb;">
                    <span style="text-decoration: underline;">info@cherrygoldinteriors.com</span> | <span style="text-decoration: underline;">www.cherrygoldinteriors.com</span>
                  </p>
                </div>
              </div>

              <div style="height: 1.5px; background: #c0142b; margin: 8px 0 14px;"></div>

              <!-- Project & Client Metadata Box -->
              <div style="display: flex; justify-content: space-between; align-items: flex-start; font-size: 11.5px; margin-bottom: 12px; line-height: 1.5; background: #faf8f8; border: 1px solid #ebd4d4; border-radius: 4px; padding: 8px 12px;">
                <div>
                  <p style="margin: 1px 0;">
                    <span style="color: #666; font-size: 10px; text-transform: uppercase; font-weight: bold; letter-spacing: 0.5px;">Quotation Prepared For:</span>
                  </p>
                  <p style="margin: 2px 0;">
                    <strong style="font-size: 14px; color: #c0142b; text-transform: uppercase;">${client.clientName || 'Valued Customer'}</strong>
                  </p>
                  <p style="margin: 1px 0;">
                    <span style="color: #444;">Project Scope:</span> <strong>${client.projectName || 'Interior Works'}</strong>
                  </p>
                  ${client.location ? `<p style="margin: 1px 0;"><span style="color: #444;">Site / Location:</span> <strong>${client.location}</strong></p>` : ''}
                  ${client.contact_phone ? `<p style="margin: 1px 0;"><span style="color: #444;">Contact Phone:</span> <strong>+91 ${client.contact_phone}</strong></p>` : ''}
                </div>
                <div style="text-align: right;">
                  <p style="margin: 1px 0;"><span style="color: #444;">Quotation No:</span> <strong>${client.quotationNo || 'CGI/2026/502'}</strong></p>
                  <p style="margin: 1px 0;"><span style="color: #444;">Date:</span> <strong>${client.date}</strong></p>
                  <p style="margin: 1px 0;"><span style="color: #444;">Validity:</span> ${client.validity || '15 Days'}</p>
                </div>
              </div>

              <h2 style="text-align: center; color: #c0142b; font-family: 'Times New Roman', serif; text-decoration: underline; font-size: 15px; font-weight: 700; margin: 12px 0 10px;">
                Luxury Design Proposal
              </h2>

              <div style="border-left: 2px solid #c0142b; padding-left: 14px; margin-left: 2px;">
                <!-- DESIGN CONCEPT -->
                <div style="margin-bottom: 14px;">
                  <h3 style="color: #c0142b; font-size: 11px; font-weight: 800; text-transform: uppercase; margin: 0 0 4px; display: flex; align-items: center; gap: 6px;">
                    <span style="color: #eab308; font-size: 12px;">✦</span> DESIGN CONCEPT & SCOPE
                  </h3>
                  <p style="font-size: 10px; font-style: italic; color: #222; line-height: 1.55; margin: 0; text-align: justify;">
                    A personalized luxury interior design proposal curated exclusively for <strong>${client.clientName || 'our client'}</strong> covering <strong>${worksOverviewText}</strong> ${printTotalArea > 0 ? `spanning a total calculated layout area of <strong>${printTotalArea} sq.ft</strong>` : ''}. Designed with high-durability BWP marine materials, smooth edge-banding, transparent labour coordination, and precision laser alignment as discussed.
                  </p>
                </div>

                <!-- SCOPE OF WORK -->
                <div style="margin-bottom: 12px;">
                  <h3 style="color: #c0142b; font-size: 11px; font-weight: 800; text-transform: uppercase; margin: 0 0 6px; display: flex; align-items: center; gap: 6px;">
                    <span style="color: #eab308; font-size: 12px;">✦</span> SCOPE OF WORK DETAILS
                  </h3>
                  <div style="border-radius: 2px; overflow: hidden; border: 1px solid #c0142b;">
                    <table style="font-size: 10px;">
                      <thead>
                        <tr style="background: #b91c1c; color: #ffffff;">
                          <th style="padding: 5px 10px; text-align: left; font-weight: bold; width: 34%; font-style: italic;">Scope / Work Item</th>
                          <th style="padding: 5px 10px; text-align: left; font-weight: bold; width: 66%; font-style: italic;">Specifications & Execution</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${scopeRows}
                      </tbody>
                    </table>
                  </div>
                </div>

                <!-- NOT INCLUDED -->
                <div style="margin-bottom: 8px;">
                  <h3 style="color: #c0142b; font-size: 10.5px; font-weight: 800; text-transform: uppercase; margin: 0 0 4px; display: flex; align-items: center; gap: 6px;">
                    <span style="color: #eab308; font-size: 12px;">✦</span> TERMS & TRANSPARENCY NOTES
                  </h3>
                  <ul style="margin: 0; padding-left: 4px; list-style: none; font-size: 9.5px; font-style: italic; color: #333; line-height: 1.55;">
                    <li>• Civil Works: 10% coordination charge applied to external contractor base cost for site supervision.</li>
                    <li>• Outsourced Works: 5% vendor management charge applied to specialist base vendor costs (aluminium, fabrication, gates).</li>
                    <li>• New Electrical Point: ₹4,000 includes 4-trade coordination (cutter, electrician, mason, painter). Wire runs >15ft charged at ₹5,000.</li>
                    <li>• Any modifications or work beyond agreed scope will be charged separately with prior client approval.</li>
                  </ul>
                </div>
              </div>
            </div>

            <div style="text-align: right; font-size: 9.5px; color: #888; padding-top: 8px;">
              Page 1 of 2
            </div>
          </div>

          <!-- PAGE 2 -->
          <div class="a4-page">
            <div>
              <div style="border-left: 2px solid #c0142b; padding-left: 14px; margin-left: 2px; padding-top: 6px;">
                <!-- WARRANTY -->
                <div style="margin-bottom: 12px;">
                  <h3 style="color: #c0142b; font-size: 10.5px; font-weight: 800; text-transform: uppercase; margin: 0 0 3px; display: flex; align-items: center; gap: 6px;">
                    <span style="color: #eab308; font-size: 12px;">✦</span> WARRANTY & WORKMANSHIP ASSURANCE
                  </h3>
                  <h4 style="font-size: 11px; font-weight: 800; margin: 2px 0 3px; color: #111;">
                    ${client.warrantyYears || '20'} YEARS WORKMANSHIP WARRANTY
                  </h4>
                  <p style="font-size: 10px; font-style: italic; color: #222; line-height: 1.45; margin: 0 0 3px;">
                    The executed interior work is covered under our official ${client.warrantyYears || '20'}-year warranty against workmanship defects, subject to standard site conditions.
                  </p>
                  <p style="font-size: 9px; font-style: italic; color: #555; margin: 0; line-height: 1.4;">
                    Note: Warranty excludes seepage, severe external water damage, civil movement, or third-party electrical modifications.
                  </p>
                </div>

                <div style="height: 1px; background: #f0dada; margin: 10px 0;"></div>

                <!-- PAYMENT TERMS -->
                <div style="margin-bottom: 12px;">
                  <p style="font-size: 10px; line-height: 1.5; margin: 0;">
                    <span style="color: #c0142b; text-decoration: underline; font-weight: bold;">Payment Terms:</span> Work commences upon receipt of 60% advance. Mid-work stage payment of 30% upon structure readiness, and remaining 10% upon final installation handover.
                  </p>
                </div>

                <div style="height: 1px; background: #f0dada; margin: 10px 0;"></div>

                <!-- ESTIMATED TIMELINE -->
                <div style="margin-bottom: 12px;">
                  <h3 style="color: #c0142b; font-size: 10.5px; font-weight: 800; text-transform: uppercase; margin: 0 0 3px; display: flex; align-items: center; gap: 6px;">
                    <span style="color: #eab308; font-size: 12px;">✦</span> ESTIMATED TIMELINE
                  </h3>
                  <h4 style="font-size: 11px; font-weight: 800; margin: 2px 0 3px; color: #111;">
                    ${client.workingDays || '10–15'} WORKING DAYS
                  </h4>
                  <p style="font-size: 10px; font-style: italic; color: #222; line-height: 1.45; margin: 0 0 2px;">
                    Estimated handover period is ${client.workingDays || '10–15'} working days from date of commencement and site clearance.
                  </p>
                </div>

                <div style="height: 1px; background: #f0dada; margin: 10px 0;"></div>

                <!-- PRICE DESCRIPTION & ITEMIZED BREAKDOWN TABLE -->
                <div style="margin-bottom: 16px;">
                  <h3 style="color: #c0142b; font-size: 11px; font-weight: 800; text-transform: uppercase; margin: 0 0 8px; display: flex; align-items: center; gap: 6px;">
                    <span style="color: #eab308; font-size: 12px;">✦</span> PRICE DESCRIPTION & ITEMIZED SUMMARY
                  </h3>

                  <!-- Itemized Table -->
                  <div style="border-radius: 2px; overflow: hidden; border: 1px solid #c0142b; margin-bottom: 10px;">
                    <table style="font-size: 10px;">
                      <thead>
                        <tr style="background: #b91c1c; color: #ffffff;">
                          <th style="padding: 5px 8px; text-align: center; width: 6%;">#</th>
                          <th style="padding: 5px 8px; text-align: left; width: 38%;">Scope / Work Item</th>
                          <th style="padding: 5px 8px; text-align: left; width: 32%;">Package & Details</th>
                          <th style="padding: 5px 8px; text-align: right; width: 24%;">Amount (₹)</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${itemizedRows}
                      </tbody>
                      <tfoot>
                        <tr style="border-top: 1.5px solid #c0142b; background: #fff5f5; font-weight: 600;">
                          <td colspan="3" style="padding: 5px 8px; text-align: right;">Subtotal:</td>
                          <td style="padding: 5px 8px; text-align: right;">₹${printSubtotal.toLocaleString('en-IN')}</td>
                        </tr>
                        ${formData.includeGST ? `
                        <tr style="background: #fff5f5;">
                          <td colspan="3" style="padding: 4px 8px; text-align: right; color: #555;">GST (18%):</td>
                          <td style="padding: 4px 8px; text-align: right; color: #555;">₹${printGst.toLocaleString('en-IN')}</td>
                        </tr>` : ''}
                        <tr style="background: #ffff00; font-weight: 800; font-size: 11.5px; color: #000;">
                          <td colspan="3" style="padding: 6px 8px; text-align: right;">Total Quotation Cost:</td>
                          <td style="padding: 6px 8px; text-align: right;">₹${printFinalCost.toLocaleString('en-IN')}/-</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>

                  <p style="font-size: 9.5px; font-style: italic; color: #333; line-height: 1.45; margin: 0; text-align: justify;">
                    The quoted price includes the complete agreed scope of works including all specified materials, master layout, edge-banding, hardware fittings, primer finishing, and installation.
                  </p>
                </div>
              </div>

              <!-- Signatory Section -->
              <div style="display: flex; justify-content: flex-end; margin-top: 16px; margin-bottom: 8px;">
                <div style="text-align: center; position: relative; padding-right: 16px; min-width: 200px;">
                  <p style="font-size: 11px; font-weight: 700; color: #111; margin: 0 0 4px;">
                    For Cherry Gold Interiors Pvt Ltd
                  </p>
                  <div style="position: relative; height: 75px; margin: 2px 0; display: flex; align-items: center; justify-content: center;">
                    <img src="${origin}/images/company-stamp.svg" style="position: absolute; width: 92px; height: 92px; opacity: 0.85; transform: rotate(-8deg); left: 15px;" />
                    <img src="${origin}/images/signature.svg" style="position: relative; z-index: 10; width: 120px; height: auto; opacity: 0.95; transform: rotate(-2deg);" />
                  </div>
                  <p style="font-weight: 800; font-size: 11.5px; margin: 2px 0 1px; color: #111;">
                    Ankit Sharma
                  </p>
                  <p style="font-weight: 600; font-size: 9.5px; margin: 1px 0; color: #333;">
                    Founder & Interior Designer
                  </p>
                  <p style="font-weight: 600; font-size: 9px; margin: 1px 0; color: #555;">
                    Authorized Signatory
                  </p>
                </div>
              </div>
            </div>

            <!-- Footer -->
            <div>
              <div style="height: 1.5px; background: #c9a84c; margin: 12px 0 4px;"></div>
              <div style="text-align: center; color: #c9a84c; font-size: 9.5px; font-weight: 600; letter-spacing: 0.3px;">
                www.cherrygoldinteriors.com | info@cherrygoldinteriors.com
              </div>
              <div style="text-align: right; font-size: 9.5px; color: #888; margin-top: 6px;">
                Page 2 of 2
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    doc.open();
    doc.write(html);
    doc.close();

    setTimeout(() => {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
    }, 400);
  };

  return (
    <div className="relative py-20 lg:py-28 bg-[#FBF3E8] min-h-screen overflow-hidden">
      
      {/* Opulent Ambient Background Glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-amber-200/35 to-amber-100/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-10 w-[550px] h-[550px] bg-gradient-to-bl from-red-200/25 to-rose-100/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 w-[600px] h-[600px] bg-gradient-to-tr from-amber-100/30 to-amber-50/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 no-print">
        
        {/* Page Heading — Ultra Luxury Hero Header */}
        <div className="text-center mb-8 sm:mb-12">
          
          {/* Royal Seal Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-100/90 via-white to-amber-100/90 border border-amber-300/80 text-amber-900 text-xs font-bold uppercase tracking-wider mb-4 shadow-sm backdrop-blur-sm">
            <Crown size={14} className="text-[#c0142b]" />
            <span>Cherry Gold Signature Quotation Studio</span>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            <span className="text-amber-800 font-semibold lowercase">20-yr warranty</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-4 tracking-tight font-serif">
            Cost Estimator & Transparent Proposal
          </h1>
          
          <p className="text-xs sm:text-sm md:text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Craft your home interior quotation with instant space personalization, curated color palettes, transparent trade labour breakdowns, and download an official letterhead quotation.
          </p>

          {/* Segmented Luxury Tab Navigation */}
          <div className="mt-8 inline-flex p-1.5 bg-white/80 backdrop-blur-md border border-amber-200/70 rounded-2xl shadow-sm gap-1 sm:gap-2">
            <button
              onClick={() => setActiveTab('estimator')}
              className={`px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                activeTab === 'estimator'
                  ? 'bg-gradient-to-r from-[#c0142b] to-[#8f0e1f] text-white shadow-md shadow-red-900/20 ring-1 ring-amber-400/50'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-amber-50/60'
              }`}
            >
              <Calculator size={16} /> Quotation Builder
            </button>
            <button
              onClick={() => setActiveTab('3d-models')}
              className={`px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                activeTab === '3d-models'
                  ? 'bg-gradient-to-r from-[#c0142b] to-[#8f0e1f] text-white shadow-md shadow-red-900/20 ring-1 ring-amber-400/50'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-amber-50/60'
              }`}
            >
              <Eye size={16} /> 3D Concept Models
            </button>
            <button
              onClick={() => setActiveTab('rate-card')}
              className={`px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                activeTab === 'rate-card'
                  ? 'bg-gradient-to-r from-[#c0142b] to-[#8f0e1f] text-white shadow-md shadow-red-900/20 ring-1 ring-amber-400/50'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-amber-50/60'
              }`}
            >
              <FileText size={16} /> Fixed Rate Cards
            </button>
          </div>
        </div>

        {/* Success toast notification */}
        {successToast && (
          <div className="mb-6 max-w-xl mx-auto bg-gradient-to-r from-emerald-600 to-teal-700 text-white px-5 py-3.5 rounded-2xl shadow-xl flex items-center justify-between text-sm font-semibold animate-bounce border border-emerald-400/30">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 size={18} />
              <span>{successToast}</span>
            </div>
            <button onClick={() => setSuccessToast('')} className="p-1 hover:bg-white/20 rounded-lg">
              <X size={16} />
            </button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 1: QUOTATION BUILDER & FORM                                            */}
        {/* ========================================================================= */}
        {activeTab === 'estimator' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT COLUMN: Add Work / Service Form in Luxury White Porcelain Card */}
            <div className="lg:col-span-7 bg-white/95 backdrop-blur-md rounded-3xl shadow-[0_12px_40px_-10px_rgba(192,20,43,0.06),0_4px_20px_-2px_rgba(212,175,55,0.06)] p-6 sm:p-8 border border-amber-200/80">
              
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-amber-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#c0142b] to-[#8a0b1c] text-white flex items-center justify-center shadow-md shadow-red-950/20 ring-2 ring-amber-300/60">
                    <Calculator size={20} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 font-serif leading-tight">
                      Add Work to Quotation
                    </h2>
                    <p className="text-xs text-amber-900/70 font-medium">
                      Step {itemsList.length + 1}: Select service, space & custom specifications
                    </p>
                  </div>
                </div>

                {itemsList.length > 0 && (
                  <span className="px-3.5 py-1 bg-gradient-to-r from-amber-50 to-red-50 text-[#c0142b] rounded-full text-xs font-bold border border-amber-200 shadow-sm">
                    {itemsList.length} Work{itemsList.length > 1 ? 's' : ''} in Quote
                  </span>
                )}
              </div>

              <form onSubmit={handleAddWorkToQuotation} className="space-y-6">
                
                {/* 1. Project / Work Type Selector */}
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider">
                      1. Select Work Type *
                    </label>
                    <span className="text-[11px] text-amber-800 font-medium">Click to configure</span>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {projectTypes.map(type => {
                      const isSelected = formData.projectType === type.id;
                      const IconComponent = type.icon;
                      return (
                        <button
                          key={type.id}
                          type="button"
                          onClick={() => setFormData({ ...formData, projectType: type.id })}
                          className={`p-3 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between group ${
                            isSelected
                              ? 'bg-gradient-to-br from-[#c0142b] to-[#8a0b1c] text-white border-transparent shadow-lg shadow-red-900/25 ring-2 ring-amber-400'
                              : 'bg-[#FDFBF7] hover:bg-white text-gray-800 border-amber-200/70 hover:border-amber-400 hover:shadow-md'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1.5 w-full">
                            <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                              isSelected ? 'bg-white/20 text-white' : 'bg-red-50 text-[#c0142b]'
                            }`}>
                              <IconComponent size={14} />
                            </div>
                            <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${
                              isSelected ? 'bg-black/20 text-amber-200' : 'bg-amber-100/70 text-amber-900'
                            }`}>
                              {type.badge}
                            </span>
                          </div>

                          <div>
                            <span className="font-bold text-xs truncate block">{type.name}</span>
                            <span className={`text-[10px] mt-0.5 block ${isSelected ? 'text-red-100' : 'text-gray-500'}`}>
                              {typeof type.baseRate === 'number' ? `from ₹${type.baseRate}/${type.unit}` : type.baseRate}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Room / Space Name Preset Chips + Custom Input */}
                <div className="p-4 bg-[#FDFBF7] rounded-2xl border border-amber-200/60">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider">
                      2. Room / Space Name
                    </label>
                    <span className="text-[11px] text-amber-800 font-medium">Quick chips or custom type</span>
                  </div>
                  
                  <input
                    type="text"
                    name="roomLabel"
                    value={formData.roomLabel}
                    onChange={handleInputChange}
                    placeholder="e.g. Master Bedroom, Living Room, Kitchen 2..."
                    className="w-full px-4 py-2.5 border border-amber-200 rounded-xl focus:ring-2 focus:ring-[#c0142b] focus:border-transparent bg-white text-gray-800 text-xs sm:text-sm font-medium shadow-inner"
                  />

                  {/* Quick Chips */}
                  <div className="flex flex-wrap gap-1.5 mt-2.5">
                    {commonRooms.map(room => (
                      <button
                        key={room}
                        type="button"
                        onClick={() => setFormData({ ...formData, roomLabel: room })}
                        className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all font-medium ${
                          formData.roomLabel === room 
                            ? 'bg-gradient-to-r from-[#c0142b] to-[#990011] text-white border-transparent shadow-sm' 
                            : 'bg-white text-gray-700 border-amber-200/80 hover:border-amber-400 hover:bg-amber-50/50'
                        }`}
                      >
                        + {room}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. DYNAMIC CONFIGURATION ACCORDING TO WORK TYPE */}

                {/* --- A. PAINTING CONFIGURATION --- */}
                {formData.projectType === 'painting' && (
                  <div className="p-5 bg-gradient-to-br from-amber-50/50 via-white to-red-50/30 rounded-2xl border border-amber-200 space-y-5 shadow-sm">
                    <div className="flex items-center justify-between border-b border-amber-200/60 pb-3">
                      <div className="flex items-center gap-2 text-xs font-bold text-red-800 uppercase tracking-wider">
                        <Paintbrush size={16} className="text-[#c0142b]" />
                        <span>Wall & Ceiling Painting Rates & Palettes</span>
                      </div>
                      <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                        Smooth Emulsion
                      </span>
                    </div>

                    {/* Putty Option Toggle */}
                    <div>
                      <label className="block text-xs font-bold text-gray-800 mb-2">
                        Select Surface Preparation & Finish Tier:
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <label className={`p-3.5 rounded-2xl border cursor-pointer flex flex-col justify-between transition-all ${
                          formData.paintingPackage === 'without-putty'
                            ? 'border-[#c0142b] bg-red-50/80 shadow-md ring-1 ring-red-400'
                            : 'border-amber-200 hover:border-amber-300 bg-white'
                        }`}>
                          <div className="flex items-center gap-2.5">
                            <input
                              type="radio"
                              name="paintingPackage"
                              value="without-putty"
                              checked={formData.paintingPackage === 'without-putty'}
                              onChange={handleInputChange}
                              className="text-red-600 focus:ring-red-500 w-4 h-4"
                            />
                            <span className="font-bold text-xs text-gray-900">Standard Painting</span>
                          </div>
                          <p className="text-[11px] text-gray-600 mt-1.5 pl-6 leading-relaxed">
                            Sanding + 1 coat Primer + 2 coats Premium Emulsion
                          </p>
                          <span className="text-sm font-extrabold text-[#c0142b] mt-2 pl-6">
                            ₹30 / sq.ft
                          </span>
                        </label>

                        <label className={`p-3.5 rounded-2xl border cursor-pointer flex flex-col justify-between transition-all ${
                          formData.paintingPackage === 'with-putty'
                            ? 'border-[#c0142b] bg-red-50/80 shadow-md ring-1 ring-red-400'
                            : 'border-amber-200 hover:border-amber-300 bg-white'
                        }`}>
                          <div className="flex items-center gap-2.5">
                            <input
                              type="radio"
                              name="paintingPackage"
                              value="with-putty"
                              checked={formData.paintingPackage === 'with-putty'}
                              onChange={handleInputChange}
                              className="text-red-600 focus:ring-red-500 w-4 h-4"
                            />
                            <span className="font-bold text-xs text-gray-900">Painting with Birla Putty</span>
                          </div>
                          <p className="text-[11px] text-gray-600 mt-1.5 pl-6 leading-relaxed">
                            Sanding + 2 coats Birla Putty + Primer + 2 coats Emulsion
                          </p>
                          <span className="text-sm font-extrabold text-[#c0142b] mt-2 pl-6 flex items-center gap-1.5">
                            ₹35 / sq.ft <span className="text-[10px] bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded font-bold uppercase">Popular</span>
                          </span>
                        </label>
                      </div>
                    </div>

                    {/* Color Option Selector */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-xs font-bold text-gray-800">
                          Select Color Shade Palette:
                        </label>
                        <span className="text-[11px] text-[#c0142b] font-bold">
                          Selected: {formData.colorOption}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {colorPresets.map((clr) => {
                          const isClrSelected = formData.colorOption === clr.name;
                          return (
                            <button
                              key={clr.name}
                              type="button"
                              onClick={() => setFormData({ ...formData, colorOption: clr.name })}
                              className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                                isClrSelected
                                  ? 'border-[#c0142b] bg-red-50 shadow-sm ring-1 ring-red-400'
                                  : 'border-amber-200/70 hover:border-amber-300 bg-white'
                              }`}
                            >
                              <span 
                                className="w-5 h-5 rounded-full border shadow-inner flex-shrink-0"
                                style={{ backgroundColor: clr.hex, borderColor: clr.border }}
                              />
                              <span className="text-[11px] font-semibold text-gray-800 truncate">
                                {clr.label}
                              </span>
                            </button>
                          );
                        })}
                      </div>

                      {formData.colorOption === 'Custom Shade Code' && (
                        <div className="mt-3">
                          <input
                            type="text"
                            name="customColor"
                            value={formData.customColor}
                            onChange={handleInputChange}
                            placeholder="Enter Paint Brand & Shade Code (e.g. Asian Paints Royale L123 Whispering White)..."
                            className="w-full px-3.5 py-2.5 border border-amber-200 rounded-xl text-xs bg-white focus:ring-2 focus:ring-[#c0142b]"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* --- B. MINOR ELECTRICAL WORKS CONFIGURATION --- */}
                {formData.projectType === 'minor-electrical' && (
                  <div className="p-5 bg-gradient-to-br from-amber-50/50 via-white to-amber-50/20 rounded-2xl border border-amber-200 space-y-4 shadow-sm">
                    <div className="flex items-center justify-between border-b border-amber-200/60 pb-3">
                      <div className="flex items-center gap-2 text-xs font-bold text-amber-900 uppercase tracking-wider">
                        <Zap size={16} className="text-amber-600" />
                        <span>Electrical Points & Minor Fixtures</span>
                      </div>
                      <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                        Fixed Rates
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-800 mb-1.5">
                        Select Electrical / Minor Work Item:
                      </label>
                      <select
                        name="minorElectricalItem"
                        value={formData.minorElectricalItem}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border border-amber-200 rounded-xl focus:ring-2 focus:ring-[#c0142b] bg-white text-gray-800 text-xs sm:text-sm font-semibold shadow-inner"
                      >
                        {minorElectricalRates.map(r => (
                          <option key={r.id} value={r.id}>
                            {r.name} — {r.description}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Specific wire run selector for electrical point */}
                    {formData.minorElectricalItem === 'electrical-point' && (
                      <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200 text-xs space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-amber-950">Wire Run Distance:</span>
                          <div className="flex items-center gap-4">
                            <label className="flex items-center gap-1.5 cursor-pointer">
                              <input
                                type="radio"
                                name="wireLength"
                                value="standard"
                                checked={formData.wireLength === 'standard'}
                                onChange={handleInputChange}
                                className="text-red-600 focus:ring-red-500"
                              />
                              <span className="font-bold text-gray-800">Standard Run (₹4,000)</span>
                            </label>
                            <label className="flex items-center gap-1.5 cursor-pointer">
                              <input
                                type="radio"
                                name="wireLength"
                                value="long"
                                checked={formData.wireLength === 'long'}
                                onChange={handleInputChange}
                                className="text-red-600 focus:ring-red-500"
                              />
                              <span className="font-bold text-gray-800">Long Run &gt;15ft (₹5,000)</span>
                            </label>
                          </div>
                        </div>

                        {/* Transparent 4-Trade Labour Visual Stepper */}
                        <div className="mt-2 p-3 bg-white rounded-xl border border-amber-300 text-[11px] text-gray-700 leading-relaxed shadow-sm">
                          <strong className="text-[#c0142b] block mb-2 font-serif text-xs">
                            ✦ Why ₹4,000 Fixed per Point? (Comprehensive 4-Trade Labour Stepper):
                          </strong>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px]">
                            <div className="p-2 bg-amber-50/50 rounded-lg border border-amber-200">
                              <span className="font-bold text-red-700 block">1. Wall Cutter</span>
                              Trench chipping in solid brick/concrete.
                            </div>
                            <div className="p-2 bg-amber-50/50 rounded-lg border border-amber-200">
                              <span className="font-bold text-red-700 block">2. Electrician</span>
                              Conduit laying & FR copper wiring.
                            </div>
                            <div className="p-2 bg-amber-50/50 rounded-lg border border-amber-200">
                              <span className="font-bold text-red-700 block">3. Rajmistry</span>
                              Cement mortar plaster leveling.
                            </div>
                            <div className="p-2 bg-amber-50/50 rounded-lg border border-amber-200">
                              <span className="font-bold text-red-700 block">4. Painter</span>
                              Putty filling & primer finish.
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Quantity input */}
                    <div className="flex items-center justify-between pt-1">
                      <label className="text-xs font-bold text-gray-800">
                        Quantity / Number of Points / Units:
                      </label>
                      <input
                        type="number"
                        name="quantity"
                        min="1"
                        value={formData.quantity}
                        onChange={handleInputChange}
                        className="w-24 px-3 py-2 border border-amber-200 rounded-xl text-center text-sm font-bold bg-white focus:ring-2 focus:ring-[#c0142b]"
                      />
                    </div>
                  </div>
                )}

                {/* --- C. DOORS & CUSTOM CARPENTRY CONFIGURATION --- */}
                {formData.projectType === 'doors-carpentry' && (
                  <div className="p-5 bg-gradient-to-br from-purple-50/40 via-white to-amber-50/20 rounded-2xl border border-amber-200 space-y-4 shadow-sm">
                    <div className="flex items-center justify-between border-b border-amber-200/60 pb-3">
                      <div className="flex items-center gap-2 text-xs font-bold text-purple-900 uppercase tracking-wider">
                        <Wrench size={16} className="text-purple-700" />
                        <span>Doors, Frames & Custom Cabinetry</span>
                      </div>
                      <span className="text-[10px] font-bold text-purple-900 bg-purple-100 px-2 py-0.5 rounded-full">
                        Precision Fitting
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-800 mb-1.5">
                        Select Custom Carpentry Item:
                      </label>
                      <select
                        name="doorsCarpentryItem"
                        value={formData.doorsCarpentryItem}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border border-amber-200 rounded-xl focus:ring-2 focus:ring-[#c0142b] bg-white text-gray-800 text-xs sm:text-sm font-semibold shadow-inner"
                      >
                        {doorsCarpentryRates.map(d => (
                          <option key={d.id} value={d.id}>
                            {d.name} — {d.description}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Breakdown explanation box */}
                    {(() => {
                      const selectedItem = doorsCarpentryRates.find(d => d.id === formData.doorsCarpentryItem);
                      return selectedItem ? (
                        <div className="p-3.5 bg-purple-50/70 rounded-xl border border-purple-200 text-xs">
                          <strong className="text-purple-950 block mb-1">
                            ✦ Item Specifications & Material Breakdown:
                          </strong>
                          <p className="text-[11px] text-gray-700 leading-relaxed">
                            {selectedItem.breakdown}
                          </p>
                        </div>
                      ) : null;
                    })()}

                    {/* Quantity */}
                    <div className="flex items-center justify-between pt-1">
                      <label className="text-xs font-bold text-gray-800">
                        Quantity / Number of Doors / Drawers / Sets:
                      </label>
                      <input
                        type="number"
                        name="quantity"
                        min="1"
                        value={formData.quantity}
                        onChange={handleInputChange}
                        className="w-24 px-3 py-2 border border-amber-200 rounded-xl text-center text-sm font-bold bg-white focus:ring-2 focus:ring-[#c0142b]"
                      />
                    </div>
                  </div>
                )}

                {/* --- D. GATE & GRILL PAINTING PACKAGE --- */}
                {formData.projectType === 'gate-grill-paint' && (
                  <div className="p-5 bg-gradient-to-br from-emerald-50/40 via-white to-amber-50/20 rounded-2xl border border-amber-200 space-y-4 shadow-sm">
                    <div className="flex items-center justify-between border-b border-amber-200/60 pb-3">
                      <div className="flex items-center gap-2 text-xs font-bold text-emerald-900 uppercase tracking-wider">
                        <Paintbrush size={16} className="text-emerald-700" />
                        <span>Gate & Window Grill Painting Package</span>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded-full">
                        Enamel Coat
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-800 mb-1.5">
                        Select Painting Package:
                      </label>
                      <select
                        name="gateGrillItem"
                        value={formData.gateGrillItem}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border border-amber-200 rounded-xl focus:ring-2 focus:ring-[#c0142b] bg-white text-gray-800 text-xs sm:text-sm font-semibold shadow-inner"
                      >
                        {gateGrillRates.map(g => (
                          <option key={g.id} value={g.id}>
                            {g.name} — {g.description}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Breakdown */}
                    {(() => {
                      const selectedItem = gateGrillRates.find(g => g.id === formData.gateGrillItem);
                      return selectedItem ? (
                        <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200 text-xs">
                          <strong className="text-emerald-950 block mb-1">Package Inclusions:</strong>
                          <p className="text-[11px] text-gray-700 leading-relaxed">
                            {selectedItem.breakdown}
                          </p>
                        </div>
                      ) : null;
                    })()}

                    {/* Quantity */}
                    <div className="flex items-center justify-between pt-1">
                      <label className="text-xs font-bold text-gray-800">
                        Quantity of Gates / Windows:
                      </label>
                      <input
                        type="number"
                        name="quantity"
                        min="1"
                        value={formData.quantity}
                        onChange={handleInputChange}
                        className="w-24 px-3 py-2 border border-amber-200 rounded-xl text-center text-sm font-bold bg-white focus:ring-2 focus:ring-[#c0142b]"
                      />
                    </div>
                  </div>
                )}

                {/* --- E. CIVIL WORKS (10% MARKUP) --- */}
                {formData.projectType === 'civil-work' && (
                  <div className="p-5 bg-gradient-to-br from-blue-50/40 via-white to-amber-50/20 rounded-2xl border border-amber-200 space-y-4 shadow-sm">
                    <div className="flex items-center justify-between border-b border-amber-200/60 pb-3">
                      <div className="flex items-center gap-2 text-xs font-bold text-blue-900 uppercase tracking-wider">
                        <Hammer size={16} className="text-blue-700" />
                        <span>Civil Contractor Works (Base Cost + 10% Coordination)</span>
                      </div>
                      <span className="text-[10px] font-bold text-blue-900 bg-blue-100 px-2 py-0.5 rounded-full">
                        Supervised
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-800 mb-1.5">
                        Civil Work Description / Service:
                      </label>
                      <select
                        name="civilWorkType"
                        value={formData.civilWorkType}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border border-amber-200 rounded-xl focus:ring-2 focus:ring-[#c0142b] bg-white text-gray-800 text-xs sm:text-sm font-semibold shadow-inner"
                      >
                        {civilWorkExamples.map(ex => (
                          <option key={ex} value={ex}>{ex}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-800 mb-1">
                        Estimated External Contractor Base Cost (₹):
                      </label>
                      <input
                        type="number"
                        name="civilBaseCost"
                        value={formData.civilBaseCost}
                        onChange={handleInputChange}
                        min="1000"
                        step="1000"
                        className="w-full px-4 py-2.5 border border-amber-200 rounded-xl bg-white text-sm font-bold text-gray-800 focus:ring-2 focus:ring-[#c0142b]"
                      />
                    </div>

                    {/* Markup live display */}
                    <div className="p-3.5 bg-blue-50/70 rounded-xl border border-blue-200 text-xs space-y-1.5">
                      <div className="flex justify-between text-gray-700">
                        <span>External Contractor Base Cost:</span>
                        <strong>₹{(parseFloat(formData.civilBaseCost) || 0).toLocaleString('en-IN')}</strong>
                      </div>
                      <div className="flex justify-between text-blue-900 font-semibold">
                        <span>+ 10% Site Supervision & Coordination:</span>
                        <strong>₹{Math.round((parseFloat(formData.civilBaseCost) || 0) * 0.10).toLocaleString('en-IN')}</strong>
                      </div>
                      <div className="flex justify-between text-gray-900 font-bold border-t border-blue-200 pt-1.5">
                        <span>Total Scope Price:</span>
                        <strong className="text-[#c0142b] text-sm">₹{Math.round((parseFloat(formData.civilBaseCost) || 0) * 1.10).toLocaleString('en-IN')}</strong>
                      </div>
                      <p className="text-[10px] text-gray-500 pt-1">
                        *An additional 10% coordination charge applies to external contractor base cost for site supervision, procurement, and quality verification.
                      </p>
                    </div>
                  </div>
                )}

                {/* --- F. OUTSOURCED SPECIALIST (5% MARKUP) --- */}
                {formData.projectType === 'outsourced-work' && (
                  <div className="p-5 bg-gradient-to-br from-emerald-50/40 via-white to-amber-50/20 rounded-2xl border border-amber-200 space-y-4 shadow-sm">
                    <div className="flex items-center justify-between border-b border-amber-200/60 pb-3">
                      <div className="flex items-center gap-2 text-xs font-bold text-emerald-900 uppercase tracking-wider">
                        <ShieldCheck size={16} className="text-emerald-700" />
                        <span>Outsourced Specialist Works (Vendor Base + 5% Markup)</span>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded-full">
                        Vendor Managed
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-800 mb-1.5">
                        Outsourced Service Type:
                      </label>
                      <select
                        name="outsourcedWorkType"
                        value={formData.outsourcedWorkType}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border border-amber-200 rounded-xl focus:ring-2 focus:ring-[#c0142b] bg-white text-gray-800 text-xs sm:text-sm font-semibold shadow-inner"
                      >
                        {outsourcedWorkExamples.map(ex => (
                          <option key={ex} value={ex}>{ex}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-800 mb-1">
                        External Specialist Vendor Base Cost (₹):
                      </label>
                      <input
                        type="number"
                        name="outsourcedBaseCost"
                        value={formData.outsourcedBaseCost}
                        onChange={handleInputChange}
                        min="1000"
                        step="1000"
                        className="w-full px-4 py-2.5 border border-amber-200 rounded-xl bg-white text-sm font-bold text-gray-800 focus:ring-2 focus:ring-[#c0142b]"
                      />
                    </div>

                    {/* Markup live display */}
                    <div className="p-3.5 bg-emerald-50/70 rounded-xl border border-emerald-200 text-xs space-y-1.5">
                      <div className="flex justify-between text-gray-700">
                        <span>Vendor Base Quotation:</span>
                        <strong>₹{(parseFloat(formData.outsourcedBaseCost) || 0).toLocaleString('en-IN')}</strong>
                      </div>
                      <div className="flex justify-between text-emerald-900 font-semibold">
                        <span>+ 5% Vendor Management & Coordination:</span>
                        <strong>₹{Math.round((parseFloat(formData.outsourcedBaseCost) || 0) * 0.05).toLocaleString('en-IN')}</strong>
                      </div>
                      <div className="flex justify-between text-gray-900 font-bold border-t border-emerald-200 pt-1.5">
                        <span>Total Scope Price:</span>
                        <strong className="text-[#c0142b] text-sm">₹{Math.round((parseFloat(formData.outsourcedBaseCost) || 0) * 1.05).toLocaleString('en-IN')}</strong>
                      </div>
                      <p className="text-[10px] text-gray-500 pt-1">
                        *An additional 5% coordination charge applies for dimension vetting, site logistics, and installation oversight.
                      </p>
                    </div>
                  </div>
                )}

                {/* --- G. STANDARD MODULAR CARPENTRY PACKAGES --- */}
                {['kitchen', 'wardrobe', 'false-ceiling', 'wall-paneling', 'interior-decoration', 'complete-home'].includes(formData.projectType) && (
                  <div className="p-4 bg-[#FDFBF7] rounded-2xl border border-amber-200/70">
                    <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-2">
                      3. Select Package / Quality Tier *
                    </label>

                    {formData.projectType === 'kitchen' && (
                      <select
                        name="kitchenPackage"
                        value={formData.kitchenPackage}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border border-amber-200 rounded-xl focus:ring-2 focus:ring-[#c0142b] bg-white text-gray-800 text-xs sm:text-sm font-semibold shadow-inner"
                      >
                        {kitchenPackages.map(pkg => (
                          <option key={pkg.id} value={pkg.id}>
                            {pkg.name} — ₹{pkg.rate}/sq.ft ({pkg.description})
                          </option>
                        ))}
                      </select>
                    )}

                    {formData.projectType === 'wardrobe' && (
                      <select
                        name="wardrobePackage"
                        value={formData.wardrobePackage}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border border-amber-200 rounded-xl focus:ring-2 focus:ring-[#c0142b] bg-white text-gray-800 text-xs sm:text-sm font-semibold shadow-inner"
                      >
                        {wardrobePackages.map(pkg => (
                          <option key={pkg.id} value={pkg.id}>
                            {pkg.name} — ₹{pkg.rate}/sq.ft ({pkg.description})
                          </option>
                        ))}
                      </select>
                    )}

                    {formData.projectType === 'false-ceiling' && (
                      <select
                        name="falseCeilingType"
                        value={formData.falseCeilingType}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border border-amber-200 rounded-xl focus:ring-2 focus:ring-[#c0142b] bg-white text-gray-800 text-xs sm:text-sm font-semibold shadow-inner"
                      >
                        {falseCeilingTypes.map(type => (
                          <option key={type.id} value={type.id}>
                            {type.name} — ₹{type.rate}/sq.ft ({type.description})
                          </option>
                        ))}
                      </select>
                    )}

                    {formData.projectType === 'wall-paneling' && (
                      <select
                        name="wallPanelingPackage"
                        value={formData.wallPanelingPackage}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border border-amber-200 rounded-xl focus:ring-2 focus:ring-[#c0142b] bg-white text-gray-800 text-xs sm:text-sm font-semibold shadow-inner"
                      >
                        {wallPanelingPackages.map(pkg => (
                          <option key={pkg.id} value={pkg.id}>
                            {pkg.name} — ₹{pkg.rate}/sq.ft ({pkg.description})
                          </option>
                        ))}
                      </select>
                    )}

                    {formData.projectType === 'interior-decoration' && (
                      <select
                        name="interiorPackage"
                        value={formData.interiorPackage}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border border-amber-200 rounded-xl focus:ring-2 focus:ring-[#c0142b] bg-white text-gray-800 text-xs sm:text-sm font-semibold shadow-inner"
                      >
                        {interiorPackages.map(pkg => (
                          <option key={pkg.id} value={pkg.id}>
                            {pkg.name} — ₹{pkg.rate}/sq.ft ({pkg.description})
                          </option>
                        ))}
                      </select>
                    )}

                    {formData.projectType === 'complete-home' && (
                      <div className="p-3 bg-white rounded-xl border border-amber-200 text-xs text-gray-700">
                        <span className="font-bold text-gray-900">Luxury Turnkey Plan:</span> ₹1,600/sq.ft covering living, kitchen, master & guest bedroom turnkey woodwork.
                      </div>
                    )}
                  </div>
                )}

                {/* 4. AREA DIMENSIONS (FEET) — Only shown for area-based services */}
                {['kitchen', 'wardrobe', 'painting', 'false-ceiling', 'wall-paneling', 'interior-decoration', 'complete-home'].includes(formData.projectType) && (
                  <div className="p-4 bg-[#FDFBF7] rounded-2xl border border-amber-200/70">
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider">
                        4. Area Dimensions (Feet) *
                      </label>
                      <span className="text-xs font-bold text-[#c0142b] bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200">
                        Area: {(parseFloat(formData.length || 0) * parseFloat(formData.width || 0))} sq ft
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] text-gray-600 mb-1 font-medium">Length (ft)</label>
                        <input
                          type="number"
                          name="length"
                          value={formData.length}
                          onChange={handleInputChange}
                          required
                          min="1"
                          className="w-full px-3.5 py-2.5 border border-amber-200 rounded-xl focus:ring-2 focus:ring-[#c0142b] bg-white text-gray-800 text-xs sm:text-sm font-semibold"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-gray-600 mb-1 font-medium">Width / Height (ft)</label>
                        <input
                          type="number"
                          name="width"
                          value={formData.width}
                          onChange={handleInputChange}
                          required
                          min="1"
                          className="w-full px-3.5 py-2.5 border border-amber-200 rounded-xl focus:ring-2 focus:ring-[#c0142b] bg-white text-gray-800 text-xs sm:text-sm font-semibold"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 5. ADD-ON ACCESSORIES & MINOR WORK CHIPS FOR THIS WORK */}
                <div className="p-4 bg-[#FDFBF7] rounded-2xl border border-amber-200/70">
                  <div className="flex items-center justify-between mb-2.5">
                    <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider">
                      5. Add-on Accessories & Minor Works
                    </label>
                    <span className="text-[11px] text-amber-800 font-medium">(Optional upgrades)</span>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs max-h-56 overflow-y-auto pr-1">
                    {additionalFeatures.map(feat => {
                      const isSelected = formData.additionalFeatures.includes(feat.id);
                      return (
                        <label 
                          key={feat.id} 
                          className={`flex items-center justify-between gap-2 p-2.5 rounded-xl border transition-all cursor-pointer ${
                            isSelected 
                              ? 'border-[#c0142b] bg-red-50/80 shadow-sm' 
                              : 'border-amber-200/60 hover:border-amber-300 bg-white'
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={(e) => handleFeatureChange(feat.id, e.target.checked)}
                              className="rounded text-red-600 focus:ring-red-500 w-3.5 h-3.5 flex-shrink-0 cursor-pointer"
                            />
                            <div className="min-w-0">
                              <span className={`block truncate text-xs ${isSelected ? 'text-[#c0142b] font-bold' : 'text-gray-800 font-medium'}`}>
                                {feat.name}
                              </span>
                              {feat.desc && (
                                <span className="text-[10px] text-gray-500 block truncate">
                                  {feat.desc}
                                </span>
                              )}
                            </div>
                          </div>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex-shrink-0 ${
                            isSelected ? 'bg-gradient-to-r from-[#c0142b] to-[#990011] text-white' : 'bg-amber-100/70 text-amber-900'
                          }`}>
                            +₹{feat.cost.toLocaleString('en-IN')}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="w-full bg-gradient-to-r from-[#c0142b] via-[#a31024] to-[#800010] hover:from-[#a31024] hover:to-[#66000c] text-white py-4 px-6 rounded-2xl font-bold transition-all shadow-xl shadow-red-950/20 text-sm flex items-center justify-center gap-2 ring-1 ring-amber-400/40 hover:scale-[1.01]"
                  >
                    <Plus size={18} />
                    <span>+ Add This Work to Quotation</span>
                  </button>
                  <p className="text-center text-[11px] text-gray-500 mt-2">
                    Combine Kitchen, Wardrobe, Painting, Electrical points & Doors into one unified client proposal.
                  </p>
                </div>

              </form>
            </div>


            {/* RIGHT COLUMN: Luxury Quotation Summary Receipt & PDF Download */}
            <div className="lg:col-span-5 bg-white/95 backdrop-blur-md rounded-3xl shadow-[0_12px_40px_-10px_rgba(192,20,43,0.08),0_4px_20px_-2px_rgba(212,175,55,0.08)] p-6 sm:p-7 border border-amber-200/90 sticky top-28">
              
              {/* Header with Luxury Ribbon */}
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-amber-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shadow-sm">
                    <Award size={18} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 font-serif">Quotation Summary</h3>
                    <p className="text-xs text-amber-900/70">
                      {itemsList.length === 0 
                        ? 'Proposal is currently empty.'
                        : `${itemsList.length} Work${itemsList.length > 1 ? 's' : ''} in this proposal`}
                    </p>
                  </div>
                </div>

                {itemsList.length > 0 && (
                  <button
                    onClick={() => setItemsList([])}
                    className="text-xs text-[#c0142b] hover:text-red-800 font-semibold underline"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {/* List of Added Works */}
              {itemsList.length > 0 ? (
                <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1 mb-4">
                  {itemsList.map((item, index) => (
                    <div 
                      key={item.id} 
                      className="bg-[#FDFBF7] rounded-2xl p-3.5 border border-amber-200/70 shadow-sm relative group hover:border-[#c0142b]/50 hover:bg-white transition-all"
                    >
                      <div className="flex justify-between items-start gap-2">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="w-5 h-5 rounded-full bg-red-100 text-[#c0142b] text-[11px] font-bold flex items-center justify-center flex-shrink-0">
                              {index + 1}
                            </span>
                            <h4 className="font-bold text-gray-900 text-xs sm:text-sm truncate">
                              {item.projectTypeName}
                              {item.roomLabel && (
                                <span className="ml-1 text-xs text-gray-500 font-normal">
                                  ({item.roomLabel})
                                </span>
                              )}
                            </h4>
                          </div>

                          <div className="text-[11px] text-gray-600 mt-1 pl-6">
                            {item.isAreaBased ? (
                              <span>
                                {item.length}ft × {item.width}ft = <strong className="text-gray-800">{item.area} sq ft</strong> @ ₹{item.baseRate}/sq ft
                                {item.extraDetails?.shadeName && (
                                  <span className="block text-[#c0142b] font-medium">
                                    Color Shade: {item.extraDetails.shadeName}
                                  </span>
                                )}
                              </span>
                            ) : (
                              <span>
                                {item.packageName} ({item.unitLabel})
                              </span>
                            )}
                          </div>

                          {/* Add-ons tag list */}
                          {item.additionalFeatures && item.additionalFeatures.length > 0 && (
                            <div className="pl-6 mt-1.5 flex flex-wrap gap-1">
                              {item.additionalFeatures.map(feat => (
                                <span key={feat.id} className="text-[10px] bg-red-50 text-[#c0142b] px-2 py-0.5 rounded-full font-medium border border-red-200/60">
                                  + {feat.name}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="font-extrabold text-gray-900 text-sm">
                            ₹{item.itemTotal.toLocaleString('en-IN')}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(item.id)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Remove this work"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 px-4 bg-[#FDFBF7] rounded-2xl border border-dashed border-amber-200 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-400 flex items-center justify-center mx-auto mb-2">
                    <Home size={22} />
                  </div>
                  <h4 className="text-sm font-bold text-gray-800 font-serif">Quotation is Empty</h4>
                  <p className="text-xs text-gray-500 max-w-xs mx-auto mt-1">
                    Select your space on the left and click <strong className="text-[#c0142b] font-semibold">+ Add This Work</strong> to start building your luxury quote.
                  </p>
                </div>
              )}

              {/* Client Info Status Banner */}
              <div className="bg-[#FDFBF7] rounded-2xl p-3.5 border border-amber-200/80 mb-4 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-100 to-amber-200 text-amber-900 flex items-center justify-center flex-shrink-0 shadow-inner">
                    <User size={16} />
                  </div>
                  <div className="truncate">
                    <span className="text-[9px] uppercase font-bold text-amber-800/80 block tracking-wider">
                      Prepared Exclusively For:
                    </span>
                    <strong className="text-gray-900 text-xs truncate block">
                      {clientDetails.clientName ? clientDetails.clientName : 'Customer Name (Required)'}
                    </strong>
                    <span className="text-[10px] block truncate">
                      Phone: {clientDetails.contact_phone 
                        ? <strong className="text-gray-700">+91 {clientDetails.contact_phone}</strong> 
                        : <span className="text-red-600 font-semibold">Required for PDF</span>}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setPendingAction('download');
                    setCustomerForm({
                      clientName: clientDetails.clientName || '',
                      contact_phone: clientDetails.contact_phone || formData.contact_phone || '',
                      location: clientDetails.location || '',
                      projectName: clientDetails.projectName || ''
                    });
                    setNameError('');
                    setPhoneError('');
                    setIsCustomerModalOpen(true);
                  }}
                  className="px-3 py-1.5 text-xs text-[#c0142b] hover:bg-red-50 font-bold rounded-xl transition-colors flex items-center gap-1 flex-shrink-0 border border-red-200"
                >
                  <Edit3 size={13} />
                  {clientDetails.clientName && clientDetails.contact_phone ? 'Edit' : '+ Set'}
                </button>
              </div>

              {/* Financial Summary */}
              {itemsList.length > 0 && (
                <div className="space-y-2 pt-3 border-t border-amber-100 text-xs sm:text-sm">
                  
                  <div className="flex justify-between items-center text-gray-700">
                    <span>Base Works Total ({itemsList.length} items)</span>
                    <span className="font-semibold text-gray-900">₹{totalBasePrice.toLocaleString('en-IN')}</span>
                  </div>

                  {totalFeaturesTotal > 0 && (
                    <div className="flex justify-between items-center text-gray-700">
                      <span>Accessories & Add-ons</span>
                      <span className="font-semibold text-gray-900">+₹{totalFeaturesTotal.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center text-gray-700">
                    <span>Subtotal</span>
                    <span className="font-semibold text-gray-900">₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>

                  {/* GST Toggle with Luxury Card */}
                  <div className="flex items-center justify-between p-2.5 bg-gradient-to-r from-amber-50 to-orange-50/60 rounded-xl border border-amber-200">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="summary-gst"
                        checked={formData.includeGST}
                        onChange={(e) => setFormData(prev => ({ ...prev, includeGST: e.target.checked }))}
                        className="w-4 h-4 text-red-600 rounded focus:ring-red-500 cursor-pointer"
                      />
                      <label htmlFor="summary-gst" className="text-xs font-semibold text-gray-800 cursor-pointer">
                        Include GST (18%)
                      </label>
                    </div>
                    <span className="text-xs font-bold text-gray-900">
                      {formData.includeGST ? `₹${gst.toLocaleString('en-IN')}` : '₹0'}
                    </span>
                  </div>

                  {/* Grand Total */}
                  <div className="border-t border-amber-200 pt-3 mt-1">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-sm sm:text-base font-bold text-gray-900 font-serif block">Total Project Cost</span>
                        <span className="text-[10px] text-gray-500">Materials, hardware & labour included</span>
                      </div>
                      <span className="text-2xl sm:text-3xl font-extrabold text-[#c0142b] font-serif">
                        ₹{finalCost.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-4 mt-4 border-t border-amber-100">
                <button 
                  onClick={handleRequestDownload}
                  className="w-full bg-gradient-to-r from-[#c0142b] via-[#a31024] to-[#800010] hover:from-[#a31024] hover:to-[#66000c] text-white py-3.5 px-4 rounded-2xl font-bold transition-all shadow-xl shadow-red-950/20 flex items-center justify-center gap-2 text-sm ring-1 ring-amber-400/40 hover:scale-[1.01]"
                >
                  <Download size={16} />
                  <span>Download Official PDF Letterhead</span>
                </button>

                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    onClick={handleRequestLetterheadPreview}
                    className="bg-white hover:bg-amber-50/50 text-gray-800 border border-amber-200/90 py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                  >
                    <FileText size={14} className="text-[#c0142b]" />
                    <span>View Letterhead</span>
                  </button>
                  
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-gradient-to-r from-amber-100 to-amber-200 hover:from-amber-200 hover:to-amber-300 text-amber-950 py-2.5 px-3 rounded-xl text-xs font-bold transition-colors shadow-sm border border-amber-300/80"
                  >
                    Free Consultation
                  </button>
                </div>
              </div>

            </div>

          </div>
        )}


        {/* ========================================================================= */}
        {/* TAB 2: 3D CONCEPT MODELS & PACKAGES (USER REQUEST)                        */}
        {/* ========================================================================= */}
        {activeTab === '3d-models' && (
          <div className="space-y-8">
            <div className="text-center max-w-2xl mx-auto">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100/80 px-3 py-1 rounded-full border border-amber-200">
                Visual Architectural Gallery
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 font-serif mt-2">
                Interactive 3D Interior Concept Models
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 mt-1.5">
                Inspect realistic interior package layouts, verify materials, and apply complete package specifications directly to your quotation in one click.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {conceptModels3D.map(model => (
                <div 
                  key={model.id}
                  className="bg-white/95 backdrop-blur-md rounded-3xl overflow-hidden shadow-[0_12px_40px_-10px_rgba(0,0,0,0.08)] border border-amber-200/80 flex flex-col justify-between hover:shadow-2xl hover:border-amber-400 transition-all duration-300 group"
                >
                  <div>
                    {/* High-Resolution Architectural Photo Container */}
                    <div className="relative h-64 sm:h-72 bg-gray-900 overflow-hidden">
                      <img 
                        src={model.image} 
                        alt={model.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-95"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/images/logo.png';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                      
                      <div className="absolute top-4 left-4 flex gap-2">
                        <span className="px-3 py-1 bg-gradient-to-r from-[#c0142b] to-[#8a0b1c] text-white rounded-full text-[11px] font-bold uppercase tracking-wider shadow-md ring-1 ring-amber-400/50">
                          {model.tag}
                        </span>
                      </div>

                      <div className="absolute top-4 right-4">
                        <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-amber-950 rounded-full text-[10px] font-extrabold uppercase tracking-wider shadow border border-amber-300">
                          {model.badge}
                        </span>
                      </div>

                      <div className="absolute bottom-4 left-4 right-4 text-white">
                        <h3 className="text-xl font-bold font-serif drop-shadow">{model.title}</h3>
                        <p className="text-xs text-amber-300 font-bold mt-0.5">{model.rate}</p>
                      </div>
                    </div>

                    <div className="p-6 sm:p-7 space-y-4">
                      <p className="text-xs text-gray-600 leading-relaxed">
                        {model.description}
                      </p>

                      <div className="p-4 bg-[#FDFBF7] rounded-2xl border border-amber-200/60">
                        <h4 className="text-xs font-bold text-amber-950 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                          <CheckCheck size={14} className="text-[#c0142b]" />
                          <span>Standard Inclusions in this 3D Package:</span>
                        </h4>
                        <ul className="space-y-2 text-xs text-gray-700">
                          {model.specs.map((sp, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <Star size={12} className="text-amber-600 flex-shrink-0 mt-0.5 fill-amber-400" />
                              <span>{sp}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 sm:p-7 pt-0">
                    <button
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          projectType: model.targetType
                        }));
                        setActiveTab('estimator');
                      }}
                      className="w-full bg-gradient-to-r from-amber-100 to-amber-200 hover:from-amber-200 hover:to-amber-300 text-amber-950 font-bold py-3 px-4 rounded-2xl text-xs border border-amber-300 flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow-md"
                    >
                      <Sparkles size={14} className="text-[#c0142b]" />
                      <span>Configure This 3D Package in Estimator</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}


        {/* ========================================================================= */}
        {/* TAB 3: FIXED RATE CARDS & TRANSPARENT PRICING CHEAT-SHEET                  */}
        {/* ========================================================================= */}
        {activeTab === 'rate-card' && (
          <div className="space-y-8">
            <div className="text-center max-w-2xl mx-auto">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100/80 px-3 py-1 rounded-full border border-amber-200">
                Zero Hidden Surprises
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 font-serif mt-2">
                Official Rate Card & Trade Labour Breakdown
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 mt-1.5">
                Every minor fixture, electrical point, custom drawer, and civil markup explained with complete transparency.
              </p>
            </div>

            {/* 1. Painting Rates */}
            <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-sm border border-amber-200/80">
              <div className="flex items-center gap-3 mb-5 border-b border-amber-100 pb-3">
                <div className="w-10 h-10 rounded-2xl bg-red-50 text-[#c0142b] flex items-center justify-center shadow-sm">
                  <Paintbrush size={22} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 font-serif">Wall & Ceiling Painting Rates</h3>
                  <p className="text-xs text-amber-900/70">Fixed square foot pricing with color choice</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 bg-[#FDFBF7] rounded-2xl border border-amber-200">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="font-bold text-sm text-gray-900">Standard Painting</span>
                    <span className="text-base font-extrabold text-[#c0142b]">₹30 / sq.ft</span>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Includes mechanical surface sanding, 1 coat primer base, 2 coats premium emulsion paint, and clean edge finish.
                  </p>
                </div>

                <div className="p-5 bg-gradient-to-br from-red-50/70 to-amber-50/30 rounded-2xl border border-red-200">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="font-bold text-sm text-gray-900">Painting with Birla Putty</span>
                    <span className="text-base font-extrabold text-[#c0142b]">₹35 / sq.ft</span>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Includes full surface sanding, 2 coats Birla White Wall Putty, 1 coat acrylic primer, 2 coats luxury emulsion paint, and mirror-smooth touch-up.
                  </p>
                </div>
              </div>
            </div>

            {/* 2. Minor Works & Electrical Breakdown */}
            <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-sm border border-amber-200/80">
              <div className="flex items-center gap-3 mb-5 border-b border-amber-100 pb-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shadow-sm">
                  <Zap size={22} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 font-serif">Minor Electrical Works & 4-Trade Labour</h3>
                  <p className="text-xs text-amber-900/70">Why new electrical points cost ₹4,000–₹5,000</p>
                </div>
              </div>

              <div className="mb-6 p-5 bg-gradient-to-r from-amber-50 to-orange-50/50 rounded-2xl border border-amber-200">
                <h4 className="text-xs font-bold text-amber-950 uppercase tracking-wider mb-2.5">
                  ✦ Why does a new electrical point cost ₹4,000 fixed (up to ₹5,000 for long runs)?
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs text-gray-800">
                  <div className="bg-white p-3 rounded-xl border border-amber-300">
                    <span className="font-bold text-[#c0142b] block mb-1">1. Wall Cutter Labour</span>
                    Grooving, trench chipping into solid brick/concrete wall.
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-amber-300">
                    <span className="font-bold text-[#c0142b] block mb-1">2. Electrician</span>
                    Conduit laying, metal concealed box fixing, drawing FR copper wire.
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-amber-300">
                    <span className="font-bold text-[#c0142b] block mb-1">3. Rajmistry (Mason)</span>
                    Cement mortar plastering to level groove flush with wall.
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-amber-300">
                    <span className="font-bold text-[#c0142b] block mb-1">4. Painter</span>
                    Two coats wall putty filling, sanding & primer touch-up.
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {minorElectricalRates.map(item => (
                  <div key={item.id} className="p-4 bg-[#FDFBF7] rounded-2xl border border-amber-200/70 text-xs">
                    <div className="flex justify-between items-start gap-2 mb-1.5">
                      <span className="font-bold text-gray-900">{item.name}</span>
                      <span className="font-extrabold text-[#c0142b] flex-shrink-0">
                        {item.rate ? `₹${item.rate.toLocaleString('en-IN')}` : item.description}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-600 leading-relaxed">{item.breakdown}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Custom Carpentry & Drawer Rates */}
            <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-sm border border-amber-200/80">
              <div className="flex items-center gap-3 mb-5 border-b border-amber-100 pb-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shadow-sm">
                  <Wrench size={22} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 font-serif">Custom Drawers, Doors & Cabinetry</h3>
                  <p className="text-xs text-amber-900/70">Fixed item rates with full material breakdown</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {doorsCarpentryRates.map(item => (
                  <div key={item.id} className="p-4 bg-[#FDFBF7] rounded-2xl border border-purple-200/70 text-xs">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="font-bold text-gray-900 text-sm">{item.name}</span>
                      <span className="text-sm font-extrabold text-purple-900">
                        ₹{item.rate.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-700 leading-relaxed">{item.breakdown}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Gate & Grill Painting Packages */}
            <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-sm border border-amber-200/80">
              <div className="flex items-center gap-3 mb-5 border-b border-amber-100 pb-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-sm">
                  <ShieldCheck size={22} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 font-serif">Metal Gates & Window Grill Painting</h3>
                  <p className="text-xs text-amber-900/70">Fixed package rates per unit (not sq.ft)</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {gateGrillRates.map(item => (
                  <div key={item.id} className="p-4 bg-[#FDFBF7] rounded-2xl border border-emerald-200 text-xs">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-gray-900 text-sm">{item.name}</span>
                      <span className="font-extrabold text-emerald-900 text-sm">
                        ₹{item.rate.toLocaleString('en-IN')} / unit
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-700 mt-1 leading-relaxed">{item.breakdown}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 5. Civil & Outsourced Markups Policy */}
            <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-sm border border-amber-200/80">
              <div className="flex items-center gap-3 mb-5 border-b border-amber-100 pb-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-sm">
                  <Layers size={22} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 font-serif">Civil & Outsourced Work Charges Policy</h3>
                  <p className="text-xs text-amber-900/70">Transparent markups for external contractors</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-gray-700 leading-relaxed">
                <div className="p-5 bg-blue-50/60 rounded-2xl border border-blue-200">
                  <div className="flex justify-between items-center mb-2.5">
                    <span className="font-bold text-blue-950 text-sm font-serif">1. Civil Works</span>
                    <span className="px-2.5 py-0.5 bg-blue-600 text-white rounded-full font-bold text-xs">10% Markup</span>
                  </div>
                  <p className="mb-2">
                    An additional 10% coordination and service charge applies to the base cost of civil works executed through external contractors:
                  </p>
                  <ul className="list-disc pl-4 space-y-1 text-[11px] text-gray-600">
                    <li>Wall breaking, demolition & debris removal</li>
                    <li>Brickwork and cement plastering</li>
                    <li>Floor and wall tiling & leveling</li>
                    <li>Waterproofing and seepage treatment</li>
                  </ul>
                </div>

                <div className="p-5 bg-emerald-50/60 rounded-2xl border border-emerald-200">
                  <div className="flex justify-between items-center mb-2.5">
                    <span className="font-bold text-emerald-950 text-sm font-serif">2. Outsourced Works</span>
                    <span className="px-2.5 py-0.5 bg-emerald-600 text-white rounded-full font-bold text-xs">5% Markup</span>
                  </div>
                  <p className="mb-2">
                    An additional 5% coordination and vendor management charge applies to the base vendor quotation:
                  </p>
                  <ul className="list-disc pl-4 space-y-1 text-[11px] text-gray-600">
                    <li>Collapsible gate supply & fitting</li>
                    <li>Sliding aluminium doors & window systems</li>
                    <li>Steel fabrication, grills and railing work</li>
                    <li>Toughened glass partition installations</li>
                  </ul>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>


      {/* ========================================================================= */}
      {/* CUSTOMER NAME & DETAILS MODAL (MANDATORY BEFORE PDF DOWNLOAD)              */}
      {/* ========================================================================= */}
      {isCustomerModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 no-print animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-amber-200">
            
            <div className="bg-gradient-to-r from-[#c0142b] via-[#a31024] to-[#800010] p-6 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                  <User size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold font-serif">Client Quotation Details</h3>
                  <p className="text-xs text-red-100">Enter customer name for the official proposal</p>
                </div>
              </div>
              <button 
                onClick={() => setIsCustomerModalOpen(false)}
                className="p-1 rounded-xl text-white/80 hover:text-white hover:bg-white/10"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleConfirmCustomerDetails} className="p-6 space-y-4">
              
              {/* Customer Name */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Customer / Client Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={customerForm.clientName}
                    onChange={(e) => {
                      setCustomerForm({ ...customerForm, clientName: e.target.value });
                      if (nameError) setNameError('');
                    }}
                    placeholder="e.g. Mr. Narayan Jana / Priya Roy"
                    className="w-full pl-10 pr-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#c0142b] focus:border-transparent text-sm bg-white"
                    autoFocus
                  />
                </div>
                {nameError && (
                  <p className="text-xs text-red-600 font-semibold mt-1">{nameError}</p>
                )}
                <p className="text-[11px] text-gray-500 mt-1">
                  This name will be printed on Page 1 & Page 2 of the official letterhead quotation.
                </p>
              </div>

              {/* Phone Number (Compulsory) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Contact Phone Number *
                  </label>
                  <span className="text-[10px] text-red-600 font-bold uppercase tracking-wider bg-red-50 px-2 py-0.5 rounded-full border border-red-200">
                    Compulsory
                  </span>
                </div>
                <div className="relative">
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5 pointer-events-none" />
                  <input
                    type="tel"
                    required
                    value={customerForm.contact_phone}
                    onChange={(e) => {
                      setCustomerForm({ ...customerForm, contact_phone: e.target.value });
                      if (phoneError) setPhoneError('');
                    }}
                    placeholder="Enter 10-digit mobile number (e.g. 9433889668)"
                    className={`w-full pl-10 pr-3.5 py-2.5 border rounded-xl focus:ring-2 focus:ring-[#c0142b] text-sm bg-white ${
                      phoneError ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300'
                    }`}
                  />
                </div>
                {phoneError && (
                  <p className="text-xs text-red-600 font-semibold mt-1">{phoneError}</p>
                )}
                <p className="text-[11px] text-gray-500 mt-1">
                  10-digit mobile number is required to generate your official quotation.
                </p>
              </div>

              {/* Site Location */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Project Location / Address (Optional)
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5 pointer-events-none" />
                  <input
                    type="text"
                    value={customerForm.location}
                    onChange={(e) => setCustomerForm({ ...customerForm, location: e.target.value })}
                    placeholder="e.g. Noapara, Belgharia 700090"
                    className="w-full pl-10 pr-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#c0142b] text-sm bg-white"
                  />
                </div>
              </div>

              {/* Project Title */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Project Work Title
                </label>
                <input
                  type="text"
                  value={customerForm.projectName}
                  onChange={(e) => setCustomerForm({ ...customerForm, projectName: e.target.value })}
                  placeholder="e.g. Modular Kitchen & Wardrobe Interior Work"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#c0142b] text-xs sm:text-sm bg-white"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-3 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsCustomerModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-[#c0142b] to-[#990011] hover:from-[#a31024] hover:to-[#7a000d] text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition-all"
                >
                  <Download size={14} />
                  <span>{pendingAction === 'download' ? 'Download Official PDF' : 'Open Letterhead'}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}


      {/* ========================================================================= */}
      {/* SCREEN MODAL: INTERACTIVE 2-PAGE LETTERHEAD PREVIEW                        */}
      {/* ========================================================================= */}
      {isQuotationModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 no-print">
          
          <div className="bg-gray-100 rounded-3xl shadow-2xl max-w-4xl w-full overflow-hidden flex flex-col max-h-[92vh] border border-amber-300/40">
            
            {/* Modal Top Control Bar */}
            <div className="bg-white px-4 sm:px-6 py-4 border-b border-gray-200 flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="font-bold text-sm text-gray-900 font-serif">
                  Official Letterhead Proposal ({clientDetails.quotationNo})
                </span>
                {clientDetails.clientName && (
                  <span className="text-xs bg-red-100 text-[#c0142b] px-2.5 py-0.5 rounded-full font-bold">
                    For: {clientDetails.clientName}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  onClick={() => setIsEditingClient(!isEditingClient)}
                  className="px-3 py-1.5 rounded-xl border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-50 flex items-center gap-1.5 transition-colors"
                >
                  <Edit3 size={13} className="text-[#c0142b]" />
                  {isEditingClient ? 'Hide Customizer' : 'Edit Quotation Details'}
                </button>

                <button
                  onClick={() => executePrint(clientDetails, itemsList.length > 0 ? itemsList : [buildCurrentWorkItem()])}
                  className="bg-gradient-to-r from-[#c0142b] to-[#990011] hover:from-[#a31024] hover:to-[#7a000d] text-white px-4 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md transition-all"
                >
                  <Printer size={14} /> Print / Save as PDF
                </button>

                <button
                  onClick={() => setIsQuotationModalOpen(false)}
                  className="p-1.5 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Quotation Customization Drawer */}
            {isEditingClient && (
              <div className="bg-amber-50/90 px-4 sm:px-6 py-3 border-b border-amber-200 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-gray-700 block mb-1">Customer Name:</label>
                    <input
                      type="text"
                      value={clientDetails.clientName}
                      onChange={(e) => setClientDetails({ ...clientDetails, clientName: e.target.value })}
                      className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg bg-white"
                      placeholder="e.g. Narayan Jana"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-gray-700 block mb-1">Project Title:</label>
                    <input
                      type="text"
                      value={clientDetails.projectName}
                      onChange={(e) => setClientDetails({ ...clientDetails, projectName: e.target.value })}
                      className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-gray-700 block mb-1">Quotation No:</label>
                    <input
                      type="text"
                      value={clientDetails.quotationNo}
                      onChange={(e) => setClientDetails({ ...clientDetails, quotationNo: e.target.value })}
                      className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-gray-700 block mb-1">Site Location:</label>
                    <input
                      type="text"
                      value={clientDetails.location}
                      onChange={(e) => setClientDetails({ ...clientDetails, location: e.target.value })}
                      className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg bg-white"
                      placeholder="Kolkata"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Scrollable Document Container */}
            <div className="overflow-y-auto p-4 sm:p-6 flex-1 space-y-6 flex flex-col items-center">
              
              <div className="bg-white rounded-lg shadow-xl border border-gray-300 w-full max-w-2xl font-sans text-gray-900">
                
                {/* PAGE 1 */}
                <div 
                  className="quotation-page p-6 sm:p-10 bg-white relative border-b-2 border-dashed border-gray-200"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  
                  {/* Header */}
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-16 sm:w-20 flex-shrink-0">
                      <img 
                        src="/images/logo.png" 
                        alt="Cherry Gold Interiors" 
                        className="w-full h-auto object-contain"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/vite.png';
                        }}
                      />
                    </div>

                    <div className="text-center flex-1 pr-2 sm:pr-6">
                      <h1 
                        style={{ 
                          color: '#c0142b', 
                          fontFamily: "'Times New Roman', serif", 
                          fontSize: 'clamp(16px, 2.8vw, 24px)', 
                          fontWeight: '800', 
                          letterSpacing: '0.8px', 
                          margin: 0,
                          lineHeight: 1.15
                        }}
                      >
                        CHERRY GOLD INTERIORS PVT. LTD.
                      </h1>
                      
                      <p style={{ fontWeight: 800, fontSize: '10.5px', margin: '3px 0 2px', color: '#111', letterSpacing: '0.5px' }}>
                        U74102WB2025PTC279494
                      </p>
                      
                      <p style={{ fontSize: '10px', margin: '2px 0', color: '#333', lineHeight: 1.3 }}>
                        75 Prafulla Nagar Colony, Belgharia, North 24 Parganas, West Bengal - <span style={{ color: '#2563eb', fontWeight: 700 }}>700056</span>
                      </p>
                      
                      <p style={{ fontSize: '10px', fontWeight: 700, margin: '2px 0', color: '#111' }}>
                        9433889668 | 7687914255
                      </p>
                      
                      <p style={{ fontSize: '9.5px', margin: '2px 0', color: '#2563eb' }}>
                        <span style={{ textDecoration: 'underline' }}>info@cherrygoldinteriors.com</span> | <span style={{ textDecoration: 'underline' }}>www.cherrygoldinteriors.com</span>
                      </p>
                    </div>
                  </div>

                  <div style={{ height: '1.5px', background: '#c0142b', margin: '8px 0 14px' }} />

                  {/* Project & Client Metadata Box */}
                  <div className="flex justify-between items-start text-xs mb-3 leading-relaxed text-gray-900 bg-[#faf8f8] p-3 rounded border border-[#ebd4d4]">
                    <div>
                      <p style={{ margin: '1px 0', fontSize: '10px', textTransform: 'uppercase', color: '#666', fontWeight: 'bold' }}>
                        Quotation Prepared For:
                      </p>
                      <p style={{ margin: '1px 0' }}>
                        <strong style={{ fontSize: '13px', color: '#c0142b', textTransform: 'uppercase' }}>
                          {clientDetails.clientName || 'Valued Customer'}
                        </strong>
                      </p>
                      <p style={{ margin: '1px 0' }}>
                        <span style={{ color: '#555' }}>Project:</span> <strong>{clientDetails.projectName || 'Interior Work'}</strong>
                      </p>
                      {clientDetails.location && (
                        <p style={{ margin: '1px 0' }}>
                          <span style={{ color: '#555' }}>Site Location:</span> <strong>{clientDetails.location}</strong>
                        </p>
                      )}
                      {clientDetails.contact_phone && (
                        <p style={{ margin: '1px 0' }}>
                          <span style={{ color: '#555' }}>Phone:</span> <strong>+91 {clientDetails.contact_phone}</strong>
                        </p>
                      )}
                    </div>

                    <div className="text-right">
                      <p style={{ margin: '1px 0' }}>
                        <span style={{ color: '#555' }}>Quotation No:</span> <strong>{clientDetails.quotationNo || 'CGI/2026/502'}</strong>
                      </p>
                      <p style={{ margin: '1px 0' }}>
                        <span style={{ color: '#555' }}>Date:</span> <strong>{clientDetails.date}</strong>
                      </p>
                      <p style={{ margin: '1px 0' }}>
                        <span style={{ color: '#555' }}>Validity:</span> {clientDetails.validity || '15 Days'}
                      </p>
                    </div>
                  </div>

                  {/* Luxury Design Proposal Center Heading */}
                  <h2 
                    style={{ 
                      textAlign: 'center', 
                      color: '#c0142b', 
                      fontFamily: "'Times New Roman', serif", 
                      textDecoration: 'underline', 
                      fontSize: '15px', 
                      fontWeight: '700', 
                      margin: '14px 0 10px' 
                    }}
                  >
                    Luxury Design Proposal
                  </h2>

                  {/* Left Red Accent Line Container */}
                  <div 
                    style={{ 
                      borderLeft: '2px solid #c0142b', 
                      paddingLeft: '14px', 
                      marginLeft: '2px' 
                    }}
                  >
                    {/* DESIGN CONCEPT */}
                    <div className="mb-3.5">
                      <h3 
                        style={{ 
                          color: '#c0142b', 
                          fontSize: '11px', 
                          fontWeight: '800', 
                          textTransform: 'uppercase', 
                          margin: '0 0 4px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <span style={{ color: '#eab308', fontSize: '12px' }}>✦</span> DESIGN CONCEPT & SCOPE
                      </h3>
                      
                      <p 
                        style={{ 
                          fontSize: '10px', 
                          fontStyle: 'italic', 
                          color: '#222', 
                          lineHeight: '1.55', 
                          margin: 0,
                          textAlign: 'justify'
                        }}
                      >
                        A customized interior design proposal prepared for <strong>{clientDetails.clientName || 'our client'}</strong> covering <strong>{itemsList.length > 0 ? itemsList.map(i => i.roomLabel ? `${i.projectTypeName} (${i.roomLabel})` : i.projectTypeName).join(', ') : 'Modular Interior Work'}</strong> {totalArea > 0 ? `spanning a combined layout area of <strong>${totalArea} sq.ft</strong>` : ''}. Designed with premium BWP marine plywood, scratch-resistant surface finish, and precision laser alignment.
                      </p>
                    </div>

                    {/* SCOPE OF WORK */}
                    <div className="mb-3">
                      <h3 
                        style={{ 
                          color: '#c0142b', 
                          fontSize: '11px', 
                          fontWeight: '800', 
                          textTransform: 'uppercase', 
                          margin: '0 0 6px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <span style={{ color: '#eab308', fontSize: '12px' }}>✦</span> SCOPE OF WORK
                      </h3>

                      <div style={{ borderRadius: '2px', overflow: 'hidden', border: '1px solid #c0142b' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10px' }}>
                          <thead>
                            <tr style={{ background: '#b91c1c', color: '#ffffff' }}>
                              <th style={{ padding: '5px 10px', textAlign: 'left', fontWeight: 'bold', width: '34%', fontStyle: 'italic' }}>
                                Work Item / Scope
                              </th>
                              <th style={{ padding: '5px 10px', textAlign: 'left', fontWeight: 'bold', width: '66%', fontStyle: 'italic' }}>
                                Execution Details & Specs
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {getScopeOfWorkForItems(itemsList.length > 0 ? itemsList : [buildCurrentWorkItem()]).map((item, idx) => (
                              <tr key={idx} style={{ borderBottom: '1px solid #f1d5d5', background: idx % 2 === 0 ? '#ffffff' : '#fdf8f8' }}>
                                <td style={{ padding: '5px 10px', fontWeight: '600', color: '#111', fontStyle: 'italic', verticalAlign: 'top' }}>
                                  {item.work}
                                </td>
                                <td style={{ padding: '5px 10px', color: '#333', fontStyle: 'italic', verticalAlign: 'top' }}>
                                  {item.desc}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* TRANSPARENT POLICY NOTES */}
                    <div className="mb-2">
                      <h3 
                        style={{ 
                          color: '#c0142b', 
                          fontSize: '10.5px', 
                          fontWeight: '800', 
                          textTransform: 'uppercase', 
                          margin: '0 0 4px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <span style={{ color: '#eab308', fontSize: '12px' }}>✦</span> POLICY & INCLUSION NOTES
                      </h3>
                      
                      <ul style={{ margin: 0, paddingLeft: '4px', listStyle: 'none', fontSize: '9.5px', fontStyle: 'italic', color: '#333', lineHeight: '1.55' }}>
                        <li>• Civil Works: 10% coordination charge applied to external contractor base cost for site supervision.</li>
                        <li>• Outsourced Works: 5% vendor management charge applied to specialist base vendor costs (aluminium, fabrication, gates).</li>
                        <li>• New Electrical Point: ₹4,000 fixed includes 4-trade coordination (cutter, electrician, mason, painter). Wire runs &gt;15ft charged at ₹5,000.</li>
                        <li>• Any additional work or design changes beyond agreed scope will be charged separately with prior approval.</li>
                      </ul>
                    </div>

                  </div>

                  <div className="text-right text-[9.5px] text-gray-400 mt-3">
                    Page 1 of 2
                  </div>
                </div>


                {/* PAGE 2 */}
                <div 
                  className="quotation-page p-6 sm:p-10 bg-white relative"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  <div 
                    style={{ 
                      borderLeft: '2px solid #c0142b', 
                      paddingLeft: '14px', 
                      marginLeft: '2px' 
                    }}
                  >
                    
                    {/* WARRANTY */}
                    <div className="mb-3.5">
                      <h3 
                        style={{ 
                          color: '#c0142b', 
                          fontSize: '10.5px', 
                          fontWeight: '800', 
                          textTransform: 'uppercase', 
                          margin: '0 0 3px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <span style={{ color: '#eab308', fontSize: '12px' }}>✦</span> WARRANTY ASSURANCE
                      </h3>
                      
                      <h4 style={{ fontSize: '11px', fontWeight: '800', margin: '2px 0 3px', color: '#111' }}>
                        {clientDetails.warrantyYears || '20'} YEARS WORKMANSHIP WARRANTY
                      </h4>
                      
                      <p style={{ fontSize: '10px', fontStyle: 'italic', color: '#222', lineHeight: '1.45', margin: '0 0 2px' }}>
                        The interior works are covered under our {clientDetails.warrantyYears || '20'}-year warranty against workmanship defects under standard site conditions.
                      </p>
                      
                      <p style={{ fontSize: '9px', fontStyle: 'italic', color: '#555', margin: 0, lineHeight: '1.4' }}>
                        Note: Warranty does not cover damage caused by water leakage, seepage, moisture, structural movement, or third-party modifications.
                      </p>
                    </div>

                    <div style={{ height: '1px', background: '#f0dada', margin: '10px 0' }} />

                    {/* PAYMENT TERMS */}
                    <div className="mb-3.5">
                      <p style={{ fontSize: '10px', lineHeight: '1.5', margin: 0 }}>
                        <span style={{ color: '#c0142b', textDecoration: 'underline', fontWeight: 'bold' }}>Payment Terms:</span> Work will commence upon receipt of 60% advance. The subsequent 30% payment will be due at mid-work stage, with remaining 10% payable upon handover.
                      </p>
                    </div>

                    <div style={{ height: '1px', background: '#f0dada', margin: '10px 0' }} />

                    {/* ESTIMATED TIMELINE */}
                    <div className="mb-3.5">
                      <h3 
                        style={{ 
                          color: '#c0142b', 
                          fontSize: '10.5px', 
                          fontWeight: '800', 
                          textTransform: 'uppercase', 
                          margin: '0 0 3px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <span style={{ color: '#eab308', fontSize: '12px' }}>✦</span> ESTIMATED TIMELINE
                      </h3>
                      
                      <h4 style={{ fontSize: '11px', fontWeight: '800', margin: '2px 0 3px', color: '#111' }}>
                        {clientDetails.workingDays || '10–15'} WORKING DAYS
                      </h4>
                      
                      <p style={{ fontSize: '10px', fontStyle: 'italic', color: '#222', lineHeight: '1.45', margin: 0 }}>
                        Estimated completion period is {clientDetails.workingDays || '10–15'} working days from date of site handover and material clearance.
                      </p>
                    </div>

                    <div style={{ height: '1px', background: '#f0dada', margin: '10px 0' }} />

                    {/* PRICE DESCRIPTION & ITEMIZED TABLE */}
                    <div className="mb-6">
                      <h3 
                        style={{ 
                          color: '#c0142b', 
                          fontSize: '11px', 
                          fontWeight: '800', 
                          textTransform: 'uppercase', 
                          margin: '0 0 6px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <span style={{ color: '#eab308', fontSize: '12px' }}>✦</span> PRICE DESCRIPTION & ITEMIZED BREAKDOWN
                      </h3>

                      {/* Itemized Table */}
                      <div style={{ borderRadius: '2px', overflow: 'hidden', border: '1px solid #c0142b', margin: '6px 0 10px' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10px' }}>
                          <thead>
                            <tr style={{ background: '#b91c1c', color: '#ffffff' }}>
                              <th style={{ padding: '5px 8px', textAlign: 'center', width: '6%' }}>#</th>
                              <th style={{ padding: '5px 8px', textAlign: 'left', width: '38%' }}>Scope / Work Item</th>
                              <th style={{ padding: '5px 8px', textAlign: 'left', width: '32%' }}>Package & Area / Qty</th>
                              <th style={{ padding: '5px 8px', textAlign: 'right', width: '24%' }}>Amount (₹)</th>
                            </tr>
                          </thead>
                          <tbody>
                            {(itemsList.length > 0 ? itemsList : [buildCurrentWorkItem()]).map((item, idx) => {
                              let dimDisplay = '';
                              if (item.isAreaBased) {
                                dimDisplay = `${item.packageName} (${item.length}ft × ${item.width}ft = ${item.area} sq ft)`;
                                if (item.extraDetails?.shadeName) {
                                  dimDisplay += ` [Color: ${item.extraDetails.shadeName}]`;
                                }
                              } else {
                                dimDisplay = `${item.packageName} (${item.unitLabel})`;
                              }

                              return (
                                <tr key={idx} style={{ borderBottom: '1px solid #f1d5d5', background: idx % 2 === 0 ? '#ffffff' : '#fdf8f8' }}>
                                  <td style={{ padding: '5px 8px', fontWeight: 'bold', color: '#555', textAlign: 'center' }}>{idx + 1}</td>
                                  <td style={{ padding: '5px 8px', fontWeight: '600', color: '#111' }}>
                                    {item.projectTypeName} {item.roomLabel ? <span style={{ color: '#666', fontWeight: 'normal' }}>({item.roomLabel})</span> : ''}
                                    {item.additionalFeatures && item.additionalFeatures.length > 0 && (
                                      <div style={{ fontSize: '8.5px', color: '#777', fontWeight: 'normal', marginTop: '2px' }}>
                                        + Add-ons: {item.additionalFeatures.map(f => f.name).join(', ')}
                                      </div>
                                    )}
                                  </td>
                                  <td style={{ padding: '5px 8px', color: '#333' }}>
                                    {dimDisplay}
                                  </td>
                                  <td style={{ padding: '5px 8px', textAlign: 'right', fontWeight: 'bold', color: '#111' }}>
                                    ₹{item.itemTotal.toLocaleString('en-IN')}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                          <tfoot>
                            <tr style={{ borderTop: '1.5px solid #c0142b', background: '#fff5f5', fontWeight: '600' }}>
                              <td colspan="3" style={{ padding: '5px 8px', textAlign: 'right' }}>Subtotal:</td>
                              <td style={{ padding: '5px 8px', textAlign: 'right' }}>₹{subtotal.toLocaleString('en-IN')}</td>
                            </tr>
                            {formData.includeGST && (
                              <tr style={{ background: '#fff5f5' }}>
                                <td colspan="3" style={{ padding: '4px 8px', textAlign: 'right', color: '#555' }}>GST (18%):</td>
                                <td style={{ padding: '4px 8px', textAlign: 'right', color: '#555' }}>₹{gst.toLocaleString('en-IN')}</td>
                              </tr>
                            )}
                            <tr style={{ background: '#ffff00', fontWeight: '800', fontSize: '11px', color: '#000' }}>
                              <td colspan="3" style={{ padding: '6px 8px', textAlign: 'right' }}>Total Project Cost:</td>
                              <td style={{ padding: '6px 8px', textAlign: 'right' }}>₹{finalCost.toLocaleString('en-IN')}/-</td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>

                      <p style={{ fontSize: '9.5px', fontStyle: 'italic', color: '#333', lineHeight: '1.5', margin: 0, textAlign: 'justify' }}>
                        The quoted price includes the complete agreed scope of works including all specified materials, master layout, border detailing, primer finishing, and installation.
                      </p>
                    </div>

                  </div>

                  {/* Signatory Section */}
                  <div className="flex justify-end mt-4 mb-2">
                    <div className="text-center relative pr-4" style={{ minWidth: '200px' }}>
                      <p style={{ fontSize: '11px', fontWeight: '700', color: '#111', margin: '0 0 4px' }}>
                        For Cherry Gold Interiors Pvt Ltd
                      </p>

                      <div className="relative h-18 my-1 flex items-center justify-center">
                        <img 
                          src="/images/company-stamp.svg" 
                          alt="Official Seal" 
                          className="absolute w-22 h-22 opacity-85 pointer-events-none"
                          style={{ transform: 'rotate(-8deg)', left: '15px' }}
                        />
                        <img 
                          src="/images/signature.svg" 
                          alt="Ankit Sharma Signature" 
                          className="relative z-10 w-28 h-auto opacity-95 pointer-events-none"
                          style={{ transform: 'rotate(-2deg)' }}
                        />
                      </div>

                      <p style={{ fontWeight: '800', fontSize: '11.5px', margin: '2px 0 1px', color: '#111' }}>
                        Ankit Sharma
                      </p>
                      <p style={{ fontWeight: '600', fontSize: '9.5px', margin: '1px 0', color: '#333' }}>
                        Founder & Interior Designer
                      </p>
                      <p style={{ fontWeight: '600', fontSize: '9px', margin: '1px 0', color: '#555' }}>
                        Authorized Signatory
                      </p>
                    </div>
                  </div>

                  {/* Gold Footer */}
                  <div style={{ height: '1.5px', background: '#c9a84c', margin: '16px 0 4px' }} />
                  <div 
                    style={{ 
                      textAlign: 'center', 
                      color: '#c9a84c', 
                      fontSize: '9.5px', 
                      fontWeight: '600',
                      letterSpacing: '0.3px'
                    }}
                  >
                    www.cherrygoldinteriors.com | info@cherrygoldinteriors.com
                  </div>

                  <div className="text-right text-[9.5px] text-gray-400 mt-2">
                    Page 2 of 2
                  </div>
                </div>

              </div>

            </div>

            {/* Modal Bottom Action Bar */}
            <div className="bg-white px-4 sm:px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <span className="text-xs text-gray-500">
                Official quotation proposal formatted for 2-page A4 print.
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsQuotationModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => executePrint(clientDetails, itemsList.length > 0 ? itemsList : [buildCurrentWorkItem()])}
                  className="bg-gradient-to-r from-[#c0142b] to-[#990011] hover:from-[#a31024] hover:to-[#7a000d] text-white px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition-all"
                >
                  <Printer size={15} /> Print / Save as PDF
                </button>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* Free consultation modal */}
      <ConsultationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Get a free design consultation"
        estimationId={estimationId}
      />
    </div>
  );
};

export default CostEstimator;