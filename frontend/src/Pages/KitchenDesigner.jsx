import React, { useState, useEffect, useRef } from 'react';
import {
  Palette,
  RotateCcw,
  Download,
  Share2,
  Eye,
  Save,
  Heart,
  Maximize2,
  Minimize2,
  Layers,
  Sparkles,
  Play,
  Pause,
  Ruler,
  PaintBucket,
  Sun,
  Moon,
  Check,
  Crown,
  ShieldCheck,
  Award,
  Phone,
  MessageSquare,
  HelpCircle,
  Clock,
  ChevronRight,
  Info,
  X,
  FileText,
  Sliders,
  Compass
} from 'lucide-react';
import ConsultationModal from '../Components/ConsultationModal';

// U-shaped kitchen images – paths relative to public folder
const uShapeImageMap = {
  // Lacquered Glass
  'teal-dark': '/Ushape/glossy teal dark.png',
  'charcoal-grey': '/Ushape/glossy charcoal grey.png',
  'navy-blue': '/Ushape/glossy navy blue.png',
  'black-pearl': '/Ushape/glossy black pearl.png',
  'cream-white': '/Ushape/glossy cream white.png',
  'wine-red': '/Ushape/glossy wine red.png',
  'forest-green': '/Ushape/glossy forest green.png',
  'lavender-grey': '/Ushape/glossy lavender grey.png',
  'golden-beige': '/Ushape/glossy golden beige.png',
  'aquamarine': '/Ushape/glossy aquamarine.png',
  // Acrylics
  'burgundy-red': '/Ushape/smooth burgundy red.png',
  'teal-blue': '/Ushape/smooth teal blue.png',
  'charcoal-black': '/Ushape/smooth charcoal black.png',
  'slate-black': '/Ushape/smooth slate black.png',
  'sand-beige': '/Ushape/smooth sand beige.png',
  'silver-grey': '/Ushape/smooth silver grey.png',
  'midnight-blue': '/Ushape/smooth midnight blue.png',
  'pearl-white': '/Ushape/smooth pearl white.png',
  'cream-ivory': '/Ushape/smooth cream ivory.png',
  'warm-grey': '/Ushape/smooth warm grey.png',
  // Veneers
  'walnut-brown': '/Ushape/walnut brown wood.png',
  'light-oak': '/Ushape/light oak wood.png',
  'teak-brown': '/Ushape/teak brown wood.png',
  'dark-walnut': '/Ushape/dark walnut wood.png',
  'cherry-wood': '/Ushape/cherry wood.png',
  'mahogany-dark': '/Ushape/mahogany dark wood.png',
  'maple-light': '/Ushape/maple light wood.png',
  'ebony-black': '/Ushape/ebony black wood.png',
  'pine-natural': '/Ushape/pine natural wood.png',
  'rosewood': '/Ushape/rosewood wood.png',
  // Standard Laminates
  'dark-brown': '/Ushape/matte dark brown.png',
  'teal-green': '/Ushape/matte teal green.png',
  'beige-sand': '/Ushape/matte beige sand.png',
  'grey-stone': '/Ushape/matte grey.png',
  'coffee-brown': '/Ushape/matte coffee brown.png',
  'mint-green': '/Ushape/matte mint green.png',
  'slate-blue': '/Ushape/matte slate blue.png',
  'warm-white': '/Ushape/matte warm white.png',
  'horizontal-zircote': '/Ushape/horizontal zircote wood.png',
  // Premium Laminates
  'espresso-brown': '/Ushape/matte espresso brown.png',
  'sage-green': '/Ushape/matte sage green.png',
  'pearl-grey': '/Ushape/matte pearl grey.png',
  'champagne-gold': '/Ushape/matte champagne gold.png',
  'steel-grey': '/Ushape/matte steel grey.png',
  'midnight-black': '/Ushape/matte midnight black.png',
  'ivory-cream': '/Ushape/matte ivory cream.png',
  'bronze-brown': '/Ushape/matte bronze brown.png',
  'platinum-silver': '/Ushape/matte platinum silve.png',
};

// L-shaped kitchen images – paths relative to public folder
const lShapeImageMap = {
  // Lacquered Glass colors
  'teal-dark': '/Lshape/teal dark.png',
  'charcoal-grey': '/Lshape/charcoal grey.png',
  'navy-blue': '/Lshape/navy blue.png',
  'black-pearl': '/Lshape/black pearl.png',
  'cream-white': '/Lshape/cream white.png',
  'wine-red': '/Lshape/wine red.png',
  'forest-green': '/Lshape/forest green.png',
  'lavender-grey': '/Lshape/lavender grey.png',
  'golden-beige': '/Lshape/golden beige.png',
  'aquamarine': '/Lshape/aquamarine glossy.png',

  // Acrylics colors
  'burgundy-red': '/Lshape/burgundy red.png',
  'teal-blue': '/Lshape/teal blue.png',
  'charcoal-black': '/Lshape/charcoal black.png',
  'slate-black': '/Lshape/slate black.png',
  'sand-beige': '/Lshape/sand beige.png',
  'silver-grey': '/Lshape/silver grey.png',
  'midnight-blue': '/Lshape/midnight blue.png',
  'pearl-white': '/Lshape/pearl white.png',
  'cream-ivory': '/Lshape/cream ivory.png',
  'warm-grey': '/Lshape/warm grey.png',

  // Veneers colors
  'walnut-brown': '/Lshape/walnut brown wood.png',
  'light-oak': '/Lshape/light oak wood.png',
  'teak-brown': '/Lshape/teak brown wood.png',
  'dark-walnut': '/Lshape/dark walnut wood.png',
  'cherry-wood': '/Lshape/cherry wood wood.png',
  'mahogany-dark': '/Lshape/mahogany dark wood.png',
  'maple-light': '/Lshape/maple light wood.png',
  'ebony-black': '/Lshape/ebony black wood.png',
  'pine-natural': '/Lshape/pine natural wood.png',
  'rosewood': '/Lshape/rosewood wood.png',

  // Standard Laminates colors
  'dark-brown': '/Lshape/dark brown.png',
  'teal-green': '/Lshape/teal green.png',
  'beige-sand': '/Lshape/sand beige.png',
  'grey-stone': '/Lshape/grey stone.png',
  'coffee-brown': '/Lshape/coffee brown.png',
  'mint-green': '/Lshape/mint green.png',
  'slate-blue': '/Lshape/slate blue.png',
  'warm-white': '/Lshape/warm white.png',
  'horizontal-zircote': '/Lshape/horizontal zircote wood.png',

  // Premium Laminates colors
  'espresso-brown': '/Lshape/espresso brown matte.png',
  'sage-green': '/Lshape/sage green matte.png',
  'pearl-grey': '/Lshape/pearl grey matte.png',
  'champagne-gold': '/Lshape/champagne gold matte.png',
  'steel-grey': '/Lshape/steel grey matte.png',
  'midnight-black': '/Lshape/midnight black matte.png',
  'ivory-cream': '/Lshape/ivory cream matte.png',
  'bronze-brown': '/Lshape/bronze brown matte.png',
  'platinum-silver': '/Lshape/platinum silver matte.png'
};

const kitchenViewImages = {
  'front': {
    'L-shaped': (color) => lShapeImageMap[color] || '/Lshape/wine red.png',
    'U-shaped': (color) => uShapeImageMap[color] || '/Ushape/glossy wine red.png',
  },
  'side': {
    'L-shaped': (color) => lShapeImageMap[color] || '/Lshape/wine red.png',
    'U-shaped': (color) => uShapeImageMap[color] || '/Ushape/glossy wine red.png',
  },
  'top': {
    'L-shaped': (color) => lShapeImageMap[color] || '/Lshape/wine red.png',
    'U-shaped': (color) => uShapeImageMap[color] || '/Ushape/glossy wine red.png',
  },
  '3d': {
    'L-shaped': (color) => lShapeImageMap[color] || '/Lshape/wine red.png',
    'U-shaped': (color) => uShapeImageMap[color] || '/Ushape/glossy wine red.png',
  }
};

const KitchenDesigner = () => {
  const [selectedFinish, setSelectedFinish] = useState('lacquered-glass');
  const [selectedColor, setSelectedColor] = useState('golden-beige');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [savedDesigns, setSavedDesigns] = useState([]);
  const [currentView, setCurrentView] = useState('front');
  const [isAutoRotate, setIsAutoRotate] = useState(false);
  const [lighting, setLighting] = useState('natural');
  const [kitchenLayout, setKitchenLayout] = useState('L-shaped');
  const [showMeasurements, setShowMeasurements] = useState(false);
  const [compareDesigns, setCompareDesigns] = useState([]);
  const [showPriceBreakdown, setShowPriceBreakdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const canvasRef = useRef(null);
  const [zoom, setZoom] = useState(1);

  const finishes = {
    'lacquered-glass': {
      name: 'Lacquered Glass',
      tagline: 'High-Gloss Diamond Mirror Reflection',
      description: 'Ultra-luxurious back-painted toughened glass shutters with scratch-resistant surface and seamless aluminium profile framing.',
      tierBadge: 'ROYAL LUXURY',
      colors: {
        'teal-dark': { name: 'Teal Dark', hex: '#2F4F4F', texture: 'glossy' },
        'charcoal-grey': { name: 'Charcoal Grey', hex: '#36454F', texture: 'glossy' },
        'navy-blue': { name: 'Navy Blue', hex: '#1E3A8A', texture: 'glossy' },
        'black-pearl': { name: 'Black Pearl', hex: '#1C1C1C', texture: 'glossy' },
        'cream-white': { name: 'Cream White', hex: '#F5F5DC', texture: 'glossy' },
        'wine-red': { name: 'Wine Red', hex: '#722F37', texture: 'glossy' },
        'forest-green': { name: 'Forest Green', hex: '#355E3B', texture: 'glossy' },
        'lavender-grey': { name: 'Lavender Grey', hex: '#C4C3D0', texture: 'glossy' },
        'golden-beige': { name: 'Golden Beige', hex: '#F5DEB3', texture: 'glossy' },
        'aquamarine': { name: 'Aquamarine', hex: '#7FFFD4', texture: 'glossy' }
      }
    },
    'acrylics': {
      name: 'Seamless Acrylics',
      tagline: 'Vibrant Glass-Look High Gloss',
      description: 'Premium European non-toxic acrylic sheets pressed on BWP Marine Plywood with laser PUR edge-banding for zero moisture ingress.',
      tierBadge: 'POPULAR CHOICE',
      colors: {
        'burgundy-red': { name: 'Burgundy Red', hex: '#800020', texture: 'smooth' },
        'teal-blue': { name: 'Teal Blue', hex: '#008080', texture: 'smooth' },
        'charcoal-black': { name: 'Charcoal Black', hex: '#36454F', texture: 'smooth' },
        'slate-black': { name: 'Slate Black', hex: '#2F4F4F', texture: 'smooth' },
        'sand-beige': { name: 'Sand Beige', hex: '#F5DEB3', texture: 'smooth' },
        'silver-grey': { name: 'Silver Grey', hex: '#C0C0C0', texture: 'smooth' },
        'midnight-blue': { name: 'Midnight Blue', hex: '#191970', texture: 'smooth' },
        'pearl-white': { name: 'Pearl White', hex: '#F8F6F0', texture: 'smooth' },
        'cream-ivory': { name: 'Cream Ivory', hex: '#FFFFF0', texture: 'smooth' },
        'warm-grey': { name: 'Warm Grey', hex: '#8B8680', texture: 'smooth' }
      }
    },
    'veneers': {
      name: 'Natural Wood Veneers',
      tagline: 'Authentic Exotic Timber Grain',
      description: 'Hand-selected natural sliced timber flitches with open-grain PU matte polish bringing organic warmth and timeless elegance.',
      tierBadge: 'TIMELESS CLASSIC',
      colors: {
        'walnut-brown': { name: 'Walnut Brown', hex: '#8B4513', texture: 'wood' },
        'light-oak': { name: 'Light Oak', hex: '#D2B48C', texture: 'wood' },
        'teak-brown': { name: 'Teak Brown', hex: '#CD853F', texture: 'wood' },
        'dark-walnut': { name: 'Dark Walnut', hex: '#654321', texture: 'wood' },
        'cherry-wood': { name: 'Cherry Wood', hex: '#DE3163', texture: 'wood' },
        'mahogany-dark': { name: 'Mahogany Dark', hex: '#C04000', texture: 'wood' },
        'maple-light': { name: 'Maple Light', hex: '#F5DEB3', texture: 'wood' },
        'ebony-black': { name: 'Ebony Black', hex: '#555D50', texture: 'wood' },
        'pine-natural': { name: 'Pine Natural', hex: '#FDF5E6', texture: 'wood' },
        'rosewood': { name: 'Rosewood', hex: '#65000B', texture: 'wood' }
      }
    },
    'premium-laminates': {
      name: 'Super-Matte Laminates',
      tagline: 'Anti-Fingerprint Velvet Texture',
      description: 'Thermal healing zero-glare soft-touch surfaces resistant to grease, fingerprints, and household scratches.',
      tierBadge: 'CONTEMPORARY',
      colors: {
        'espresso-brown': { name: 'Espresso Brown', hex: '#3C2415', texture: 'matte' },
        'sage-green': { name: 'Sage Green', hex: '#9CAF88', texture: 'matte' },
        'pearl-grey': { name: 'Pearl Grey', hex: '#E5E4E2', texture: 'matte' },
        'champagne-gold': { name: 'Champagne Gold', hex: '#F7E7CE', texture: 'matte' },
        'steel-grey': { name: 'Steel Grey', hex: '#71797E', texture: 'matte' },
        'midnight-black': { name: 'Midnight Black', hex: '#2C3E50', texture: 'matte' },
        'ivory-cream': { name: 'Ivory Cream', hex: '#FFFFF0', texture: 'matte' },
        'bronze-brown': { name: 'Bronze Brown', hex: '#CD7F32', texture: 'matte' },
        'platinum-silver': { name: 'Platinum Silver', hex: '#E5E4E2', texture: 'matte' }
      }
    },
    'standard-laminates': {
      name: 'Textured Standard Laminates',
      tagline: 'High-Durability Cost Effective',
      description: '1.0mm thickness high-pressure decorative laminates crafted for everyday resilient Indian cooking conditions.',
      tierBadge: 'VALUE ESSENTIAL',
      colors: {
        'dark-brown': { name: 'Dark Brown', hex: '#654321', texture: 'matte' },
        'teal-green': { name: 'Teal Green', hex: '#008080', texture: 'matte' },
        'beige-sand': { name: 'Beige Sand', hex: '#F5F5DC', texture: 'matte' },
        'grey-stone': { name: 'Grey Stone', hex: '#708090', texture: 'matte' },
        'coffee-brown': { name: 'Coffee Brown', hex: '#6F4E37', texture: 'matte' },
        'mint-green': { name: 'Mint Green', hex: '#98FB98', texture: 'matte' },
        'slate-blue': { name: 'Slate Blue', hex: '#6A5ACD', texture: 'matte' },
        'warm-white': { name: 'Warm White', hex: '#FAF0E6', texture: 'matte' },
        'horizontal-zircote': { name: 'Horizontal Zircote', hex: '#8B7355', texture: 'wood' }
      }
    }
  };

  const currentFinish = finishes[selectedFinish];
  const currentColor = currentFinish.colors[selectedColor] || Object.values(currentFinish.colors)[0];

  const kitchenLayouts = {
    'L-shaped': { name: 'L-Shaped Configuration', description: 'Corner efficiency with ergonomic golden work triangle', multiplier: 1.0 },
    'U-shaped': { name: 'U-Shaped Configuration', description: 'Maximum counter space & dedicated breakfast island bar', multiplier: 1.3 },
  };

  const lightingOptions = {
    'natural': { name: '3000K Warm Ambient', icon: Sun, filter: 'brightness(1.05) contrast(1.02)' },
    'warm': { name: '4000K Neutral Day', icon: Sun, filter: 'sepia(0.15) brightness(1.08)' },
    'cool': { name: '6000K Modern Crisp', icon: Moon, filter: 'hue-rotate(190deg) brightness(1.08)' }
  };

  // Toast helper
  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Saved designs from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('savedKitchenDesigns');
    if (saved) {
      try {
        setSavedDesigns(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  // Auto-rotate 3D camera
  useEffect(() => {
    let interval;
    if (isAutoRotate) {
      interval = setInterval(() => {
        setCurrentView(prev => {
          const views = ['front', 'side', 'top', '3d'];
          const currentIndex = views.indexOf(prev);
          return views[(currentIndex + 1) % views.length];
        });
      }, 3500);
    }
    return () => clearInterval(interval);
  }, [isAutoRotate]);

  const resetToDefault = () => {
    setSelectedFinish('lacquered-glass');
    setSelectedColor('wine-red');
    setCurrentView('front');
    setLighting('natural');
    setKitchenLayout('L-shaped');
    setZoom(1);
    triggerToast('Configuration reset to Royal Wine Red Glass');
  };

  const calculateEstimatedCost = () => {
    const baseCost = {
      'lacquered-glass': 3500,
      'acrylics': 2800,
      'veneers': 2200,
      'premium-laminates': 2000,
      'standard-laminates': 1500
    };
    const basePrice = baseCost[selectedFinish] || 2000;
    const multiplier = kitchenLayouts[kitchenLayout]?.multiplier || 1.0;
    const sqft = 120;
    return Math.round(basePrice * multiplier * sqft);
  };

  const saveDesign = () => {
    const design = {
      id: Date.now(),
      name: `${currentFinish.name} • ${currentColor.name}`,
      finish: selectedFinish,
      color: selectedColor,
      layout: kitchenLayout,
      lighting: lighting,
      view: currentView,
      timestamp: new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
      estimatedCost: calculateEstimatedCost()
    };
    const updated = [...savedDesigns, design];
    setSavedDesigns(updated);
    localStorage.setItem('savedKitchenDesigns', JSON.stringify(updated));
    triggerToast('✨ Kitchen Design successfully saved to your private portfolio!');
  };

  const shareDesign = () => {
    const text = `Take a look at my customized Cherry Gold Modular Kitchen! 🍳✨\nFinish: ${currentFinish.name}\nShade: ${currentColor.name}\nLayout: ${kitchenLayouts[kitchenLayout].name}\nEstimated Turnkey Value: ₹${calculateEstimatedCost().toLocaleString('en-IN')}\nExplore it here: ${window.location.origin}/kitchen-designer`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const downloadDesign = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 1200;
    canvas.height = 800;

    // Background Luxury Gradient
    const grad = ctx.createLinearGradient(0, 0, 1200, 800);
    grad.addColorStop(0, '#1E090C');
    grad.addColorStop(1, '#120406');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1200, 800);

    // Decorative Borders
    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 4;
    ctx.strokeRect(30, 30, 1140, 740);

    // Header
    ctx.fillStyle = '#D4AF37';
    ctx.font = 'bold 36px Georgia';
    ctx.fillText('CHERRY GOLD INTERIORS', 60, 90);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '22px Arial';
    ctx.fillText('Bespoke Modular Kitchen Specification Blueprint', 60, 130);

    // Specs
    ctx.fillStyle = '#F3E5AB';
    ctx.font = 'bold 28px Georgia';
    ctx.fillText(`${currentFinish.name} — ${currentColor.name}`, 60, 220);

    ctx.fillStyle = '#E0D0C5';
    ctx.font = '20px Arial';
    ctx.fillText(`Configuration: ${kitchenLayouts[kitchenLayout].name}`, 60, 270);
    ctx.fillText(`Hardware: German Hafele / Hettich Soft-Close Hydraulics`, 60, 310);
    ctx.fillText(`Carcass: IS 710 Boiling Water Proof (BWP) Marine Ply`, 60, 350);
    ctx.fillText(`Warranty: 20-Year Anti-Termite & Zero-Delamination Stamp`, 60, 390);

    // Cost Pill
    ctx.fillStyle = '#C0142B';
    ctx.fillRect(60, 440, 480, 70);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 28px Arial';
    ctx.fillText(`Turnkey Budget: ₹${calculateEstimatedCost().toLocaleString('en-IN')}`, 85, 485);

    // Color Swatch Box
    ctx.fillStyle = currentColor.hex;
    ctx.fillRect(600, 220, 520, 420);
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.strokeRect(600, 220, 520, 420);

    // Footer
    ctx.fillStyle = '#A09088';
    ctx.font = '14px Arial';
    ctx.fillText('Corporate Reg: CIN U74102WB2025PTC279494 • Kolkata, West Bengal • +91 94338 89668', 60, 730);

    const link = document.createElement('a');
    link.download = `CherryGold-Kitchen-${currentColor.name.replace(/\s+/g, '_')}.png`;
    link.href = canvas.toDataURL();
    link.click();
    triggerToast('📥 Specification Blueprint downloaded as HD PNG!');
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const addToCompare = () => {
    if (compareDesigns.length < 3) {
      const design = {
        finish: selectedFinish,
        color: selectedColor,
        layout: kitchenLayout,
        cost: calculateEstimatedCost()
      };
      setCompareDesigns([...compareDesigns, design]);
      triggerToast(`Added ${currentColor.name} to side-by-side comparison (${compareDesigns.length + 1}/3)`);
    }
  };

  // Safe image path getter
  const getImageSrc = () => {
    const viewImages = kitchenViewImages[currentView] || kitchenViewImages['front'];
    const layoutImage = viewImages[kitchenLayout];

    if (typeof layoutImage === 'function') {
      const path = layoutImage(selectedColor);
      return encodeURI(path);
    }
    if (typeof layoutImage === 'string') {
      return layoutImage;
    }
    return '/Lshape/wine red.png';
  };

  const imageSrc = getImageSrc();

  const getKitchenStyle = () => {
    const isDarkShade = ['wine-red', 'burgundy-red', 'black-pearl', 'charcoal-black', 'midnight-black', 'slate-black'].includes(selectedColor);
    const shadowBoost = isDarkShade ? ' contrast(1.06) brightness(1.12)' : '';

    const baseStyle = {
      transition: 'all 0.5s ease-in-out',
      position: 'relative'
    };
    switch (currentView) {
      case '3d':
        return {
          ...baseStyle,
          transform: `perspective(1000px) rotateY(12deg) scale(${zoom})`,
          filter: `${lightingOptions[lighting].filter}${shadowBoost} drop-shadow(0 15px 30px rgba(0,0,0,0.5))`
        };
      case 'top':
        return {
          ...baseStyle,
          transform: `perspective(800px) rotateX(35deg) scale(${zoom})`,
          filter: `${lightingOptions[lighting].filter}${shadowBoost}`
        };
      case 'side':
        return {
          ...baseStyle,
          transform: `perspective(700px) rotateY(-8deg) scale(${zoom})`,
          filter: `${lightingOptions[lighting].filter}${shadowBoost}`
        };
      default:
        return {
          ...baseStyle,
          transform: `scale(${zoom})`,
          filter: `${lightingOptions[lighting].filter}${shadowBoost}`
        };
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF3E8] pt-28 pb-20 relative overflow-hidden font-sans text-gray-800">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-[#1E090C] text-[#F3E5AB] border border-[#D4AF37] px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs sm:text-sm font-medium animate-fade-in">
          <Sparkles className="w-4 h-4 text-[#D4AF37]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Ambient Lighting Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-gradient-to-b from-[#C0142B]/10 via-[#D4AF37]/15 to-transparent blur-3xl pointer-events-none rounded-full" />
      <div className="absolute top-96 -right-40 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-[800px] -left-40 w-96 h-96 bg-[#C0142B]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* ================= HERO HEADER ================= */}
        <div className="text-center max-w-4xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#1E090C] to-[#2E0D12] text-[#D4AF37] border border-[#D4AF37]/40 shadow-md mb-6">
            <Crown className="w-4 h-4 text-[#D4AF37] animate-pulse" />
            <span className="text-xs font-semibold tracking-widest uppercase">
              STUDIO 3D • INTERACTIVE KITCHEN DESIGNER
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-[#1E090C] tracking-tight leading-tight mb-5">
            Configure Your Dream Modular Kitchen in <br />
            <span className="bg-gradient-to-r from-[#C0142B] via-[#D4AF37] to-[#C0142B] bg-clip-text text-transparent">
              Photorealistic Real-Time 3D.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-[#5A4A42] max-w-2xl mx-auto leading-relaxed mb-8">
            Select from 50+ German-engineered finishes, lacquered glasses, and exotic veneers. 
            Simulate lighting conditions, preview camera perspectives, and get transparent turnkey pricing instantly.
          </p>

          {/* Quick Pillars */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs sm:text-sm font-medium text-[#3A2A28]">
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-xl border border-[#D4AF37]/30 shadow-sm">
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              <span>50+ Authentic Finishes & Wood Grains</span>
            </div>
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-xl border border-[#D4AF37]/30 shadow-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>IS 710 Marine Plywood (BWP)</span>
            </div>
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-xl border border-[#D4AF37]/30 shadow-sm">
              <Award className="w-4 h-4 text-[#C0142B]" />
              <span>German Hafele / Hettich Soft-Close</span>
            </div>
          </div>
        </div>

        {/* ================= MAIN DESIGNER STUDIO GRID ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">

          {/* LEFT 7 COLS: 3D SHOWROOM VIEWPORT */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className={`bg-white rounded-3xl border border-[#E8DACB] shadow-2xl overflow-hidden transition-all duration-300 ${
              isFullscreen
                ? 'fixed inset-0 z-[9999] h-screen w-screen flex flex-col rounded-none border-none bg-[#120406]'
                : 'relative'
            }`}>

              {/* Viewport Header Bar (Cinema Bezel) */}
              <div className="bg-gradient-to-r from-[#1E090C] via-[#2A0E13] to-[#140507] p-3 sm:p-4 px-4 sm:px-6 text-white border-b border-[#D4AF37]/30 flex items-center justify-between gap-2 sm:gap-4 shrink-0 overflow-x-auto no-scrollbar">
                
                {/* Camera Angles */}
                <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                  <span className="text-xs uppercase text-[#D4AF37] font-semibold tracking-wider mr-1 hidden sm:inline">
                    Camera:
                  </span>
                  {[
                    { key: 'front', label: 'Front Angle' },
                    { key: 'side', label: '45° Isometric' },
                    { key: 'top', label: 'Ceiling View' },
                    { key: '3d', label: '3D Elevation' }
                  ].map((v) => (
                    <button
                      key={v.key}
                      onClick={() => {
                        setIsLoading(true);
                        setTimeout(() => {
                          setCurrentView(v.key);
                          setIsLoading(false);
                        }, 200);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition-all shrink-0 ${
                        currentView === v.key
                          ? 'bg-gradient-to-r from-[#D4AF37] to-[#B38F24] text-[#1E090C] shadow-md font-bold'
                          : 'bg-white/10 text-gray-300 hover:bg-white/20'
                      }`}
                    >
                      {v.label}
                    </button>
                  ))}
                </div>

                {/* Viewport Quick Utility Icons */}
                <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                  <button
                    onClick={() => setIsAutoRotate(!isAutoRotate)}
                    className={`p-2 rounded-xl transition-all ${
                      isAutoRotate ? 'bg-[#C0142B] text-white shadow-md' : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    }`}
                    title="Auto-Rotate Camera Turntable"
                  >
                    {isAutoRotate ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => setShowMeasurements(!showMeasurements)}
                    className={`p-2 rounded-xl transition-all ${
                      showMeasurements ? 'bg-[#D4AF37] text-[#1E090C] font-bold' : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    }`}
                    title="Toggle Metric Dimensions"
                  >
                    <Ruler className="w-4 h-4" />
                  </button>

                  <button
                    onClick={toggleFullscreen}
                    className={`p-2 rounded-xl transition-all ${
                      isFullscreen ? 'bg-[#C0142B] text-white hover:bg-red-700' : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    }`}
                    title={isFullscreen ? "Exit Fullscreen (Esc)" : "Toggle Fullscreen Canvas"}
                  >
                    {isFullscreen ? <Minimize2 className="w-5 h-5 text-white" /> : <Maximize2 className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Viewport Stage Screen */}
              <div className={`relative bg-gradient-to-b from-[#221014] via-[#1A0A0E] to-[#120508] flex items-center justify-center overflow-hidden ${
                isFullscreen ? 'flex-1 w-full h-full min-h-0' : 'h-[380px] sm:h-[460px] lg:h-[520px]'
              }`}>
                {/* Center Studio Spotlight Halo */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(212,175,55,0.14)_0%,_rgba(255,248,238,0.05)_40%,_transparent_75%)] pointer-events-none" />

                {/* Loading Spinner */}
                {isLoading && (
                  <div className="absolute inset-0 bg-[#1E090C]/80 backdrop-blur-sm flex items-center justify-center z-20">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-10 h-10 border-3 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
                      <span className="text-xs uppercase text-[#F3E5AB] tracking-widest font-mono">
                        Rendering Shading Matrix...
                      </span>
                    </div>
                  </div>
                )}

                {/* Main Render Image */}
                <div
                  className="relative w-full h-full flex items-center justify-center p-3 sm:p-6 pb-14 sm:pb-8 select-none z-10"
                  style={getKitchenStyle()}
                >
                  <img
                    ref={canvasRef}
                    key={imageSrc}
                    src={imageSrc}
                    alt={`${currentColor.name} kitchen preview`}
                    className={`object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)] transition-all duration-500 rounded-xl mx-auto ${
                      isFullscreen ? 'max-h-[75vh] max-w-[85vw]' : 'max-h-[85%] sm:max-h-[88%] max-w-full'
                    }`}
                    onLoad={() => setIsLoading(false)}
                    onError={() => setIsLoading(false)}
                  />

                  {/* Dimension HUD Overlay */}
                  {showMeasurements && (
                    <div className="absolute inset-4 pointer-events-none border-2 border-dashed border-[#D4AF37]/50 rounded-2xl flex flex-col justify-between p-3 text-[11px] font-mono text-[#D4AF37]">
                      <div className="flex justify-between">
                        <span className="bg-[#1E090C]/80 px-2 py-0.5 rounded">Wall Width: 12' 0"</span>
                        <span className="bg-[#1E090C]/80 px-2 py-0.5 rounded">Counter Height: 34"</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="bg-[#1E090C]/80 px-2 py-0.5 rounded">Floor Run: 10' 6"</span>
                        <span className="bg-[#1E090C]/80 px-2 py-0.5 rounded">Total Area: 120 sq.ft</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Bottom-Right Floating Specification HUD Badge (Guaranteed z-30 on top of 3D image) */}
                <div className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4 z-30 pointer-events-auto bg-white/95 backdrop-blur-md p-3 sm:p-4 rounded-2xl border border-[#D4AF37]/50 shadow-[0_12px_36px_rgba(0,0,0,0.45)] min-w-[190px] sm:min-w-[220px] max-w-[260px]">
                  <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
                    <span className="text-[9px] sm:text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-[#C0142B] text-white tracking-wide shrink-0">
                      {currentFinish.tierBadge}
                    </span>
                    <span className="text-xs font-serif font-bold text-[#1E090C] truncate">
                      {currentFinish.name}
                    </span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-[#5A4A42] font-medium truncate">
                    {currentColor.name} • {kitchenLayouts[kitchenLayout].name.split(' ')[0]}
                  </p>
                  <div className="mt-1.5 pt-1.5 border-t border-[#EFE4D6] flex items-center justify-between gap-2">
                    <span className="text-[11px] sm:text-xs font-medium text-[#7A655C]">Turnkey Est:</span>
                    <span className="text-sm sm:text-base font-serif font-bold text-[#C0142B] whitespace-nowrap">
                      ₹{calculateEstimatedCost().toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Left Zoom Controls */}
                <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 z-30 pointer-events-auto flex flex-col gap-1.5">
                  <button
                    onClick={() => setZoom(Math.min(zoom + 0.1, 1.8))}
                    className="w-8 h-8 rounded-xl bg-white/90 hover:bg-white text-[#1E090C] font-bold text-sm shadow-md flex items-center justify-center transition-all active:scale-95 border border-[#E8DACB]"
                    title="Zoom In"
                  >
                    +
                  </button>
                  <button
                    onClick={() => setZoom(Math.max(zoom - 0.1, 0.7))}
                    className="w-8 h-8 rounded-xl bg-white/90 hover:bg-white text-[#1E090C] font-bold text-sm shadow-md flex items-center justify-center transition-all active:scale-95 border border-[#E8DACB]"
                    title="Zoom Out"
                  >
                    −
                  </button>
                </div>
              </div>

              {/* Viewport Action Footer Bar */}
              <div className={`p-4 sm:p-5 border-t flex flex-wrap items-center justify-between gap-3 shrink-0 ${
                isFullscreen 
                  ? 'bg-gradient-to-r from-[#1A080C] to-[#250E14] text-white border-t border-[#D4AF37]/30' 
                  : 'bg-white border-[#EFE4D6]'
              }`}>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={saveDesign}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#1E090C] text-[#D4AF37] text-xs font-semibold uppercase tracking-wider hover:brightness-125 transition-all shadow-sm active:scale-95"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Design</span>
                  </button>

                  <button
                    onClick={shareDesign}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold uppercase tracking-wider transition-all shadow-sm active:scale-95"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>WhatsApp Spec</span>
                  </button>

                  <button
                    onClick={downloadDesign}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FBF3E8] hover:bg-[#EFE4D6] text-[#5A4A42] border border-[#E8DACB] text-xs font-semibold uppercase tracking-wider transition-all active:scale-95"
                  >
                    <Download className="w-3.5 h-3.5 text-[#C0142B]" />
                    <span>Download Blueprint</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={resetToDefault}
                    className="p-2 rounded-xl text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-all"
                    title="Reset to Default"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>

                  <button
                    onClick={addToCompare}
                    disabled={compareDesigns.length >= 3}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#C0142B]/10 hover:bg-[#C0142B]/20 text-[#C0142B] text-xs font-semibold transition-all disabled:opacity-40"
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>Compare ({compareDesigns.length}/3)</span>
                  </button>

                  <button
                    onClick={() => setShowPriceBreakdown(!showPriceBreakdown)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#D4AF37]/20 hover:bg-[#D4AF37]/30 text-[#8B6B10] text-xs font-bold transition-all"
                  >
                    <Info className="w-3.5 h-3.5" />
                    <span>Specifications</span>
                  </button>
                </div>
              </div>

            </div>

            {/* Quick Consultation Ribbon */}
            <div className="bg-gradient-to-r from-[#1E090C] via-[#2F0E14] to-[#120406] rounded-2xl p-5 text-white border border-[#D4AF37]/30 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-center sm:text-left">
                <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] shrink-0">
                  <Crown className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-sm sm:text-base text-white">
                    Want this exact kitchen customized for your home?
                  </h4>
                  <p className="text-xs text-gray-300">
                    Book a free site laser measurement & 3D photorealistic render with our architects.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B38F24] text-[#1E090C] font-bold text-xs uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all shadow-md shrink-0"
              >
                Book VIP 3D Consultation
              </button>
            </div>
          </div>

          {/* RIGHT 5 COLS: CUSTOMIZATION CONTROLS PANEL */}
          <div className="lg:col-span-5 flex flex-col gap-6">

            {/* 1. Layout Configuration */}
            <div className="bg-white rounded-3xl p-6 border border-[#E8DACB] shadow-xl">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#68554F] mb-3 flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#C0142B]" />
                <span>1. Select Kitchen Layout</span>
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(kitchenLayouts).map(([key, layout]) => (
                  <button
                    key={key}
                    onClick={() => {
                      setIsLoading(true);
                      setTimeout(() => {
                        setKitchenLayout(key);
                        setIsLoading(false);
                      }, 200);
                    }}
                    className={`p-3.5 rounded-2xl border text-left transition-all ${
                      kitchenLayout === key
                        ? 'border-[#C0142B] bg-[#C0142B]/5 shadow-sm'
                        : 'border-[#E8DACB] hover:border-[#DAC7B5] bg-[#FBF3E8]/30'
                    }`}
                  >
                    <div className="font-serif font-bold text-sm text-[#1E090C] mb-1">
                      {layout.name.split(' ')[0]} Kitchen
                    </div>
                    <div className="text-[11px] text-[#68554F] leading-tight">
                      {layout.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Studio Lighting */}
            <div className="bg-white rounded-3xl p-6 border border-[#E8DACB] shadow-xl">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#68554F] mb-3 flex items-center gap-2">
                <Sun className="w-4 h-4 text-[#D4AF37]" />
                <span>2. Studio Ambient Lighting</span>
              </h3>
              <div className="grid grid-cols-3 gap-2.5">
                {Object.entries(lightingOptions).map(([key, opt]) => (
                  <button
                    key={key}
                    onClick={() => setLighting(key)}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      lighting === key
                        ? 'border-[#D4AF37] bg-[#D4AF37]/15 text-[#1E090C] font-bold shadow-sm'
                        : 'border-[#E8DACB] text-[#68554F] hover:bg-gray-50'
                    }`}
                  >
                    <opt.icon className="w-3.5 h-3.5 mx-auto mb-1 text-[#D4AF37]" />
                    <div className="text-[11px] font-medium leading-tight">{opt.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Material Finish Category */}
            <div className="bg-white rounded-3xl p-6 border border-[#E8DACB] shadow-xl">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#68554F] mb-3 flex items-center gap-2">
                <PaintBucket className="w-4 h-4 text-[#C0142B]" />
                <span>3. Cabinet Shutter Material</span>
              </h3>
              <div className="space-y-2.5">
                {Object.entries(finishes).map(([key, finish]) => (
                  <button
                    key={key}
                    onClick={() => {
                      setIsLoading(true);
                      setTimeout(() => {
                        setSelectedFinish(key);
                        setSelectedColor(Object.keys(finish.colors)[0]);
                        setIsLoading(false);
                      }, 250);
                    }}
                    className={`w-full p-3.5 rounded-2xl border text-left transition-all ${
                      selectedFinish === key
                        ? 'border-[#C0142B] bg-[#C0142B]/5 shadow-sm'
                        : 'border-[#E8DACB] hover:border-[#DAC7B5] bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-serif font-bold text-sm text-[#1E090C]">
                        {finish.name}
                      </span>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-[#1E090C] text-[#D4AF37]">
                        {finish.tierBadge}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#68554F] mb-2 leading-tight">
                      {finish.tagline}
                    </p>
                    {/* Swatch Mini Row */}
                    <div className="flex items-center gap-1.5">
                      {Object.values(finish.colors).slice(0, 7).map((c, i) => (
                        <div
                          key={i}
                          className="w-3.5 h-3.5 rounded-full border border-black/10 shadow-xs"
                          style={{ backgroundColor: c.hex }}
                        />
                      ))}
                      <span className="text-[10px] text-[#8A756C] ml-1">
                        +{Object.keys(finish.colors).length} shades
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Active Color Palette Swatches */}
            <div className="bg-white rounded-3xl p-6 border border-[#E8DACB] shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#68554F] flex items-center gap-2">
                  <Palette className="w-4 h-4 text-[#D4AF37]" />
                  <span>4. Choose Finish Shade</span>
                </h3>
                <span className="text-xs text-[#C0142B] font-serif font-bold">
                  {currentColor.name}
                </span>
              </div>

              {/* Swatch Grid */}
              <div className="grid grid-cols-5 gap-2.5 mb-4">
                {Object.entries(currentFinish.colors).map(([key, col]) => (
                  <button
                    key={key}
                    onClick={() => {
                      setIsLoading(true);
                      setTimeout(() => {
                        setSelectedColor(key);
                        setIsLoading(false);
                      }, 150);
                    }}
                    className={`aspect-square rounded-2xl p-1 transition-all relative ${
                      selectedColor === key
                        ? 'ring-2 ring-[#C0142B] scale-105 shadow-md'
                        : 'hover:scale-105 shadow-xs'
                    }`}
                    title={col.name}
                  >
                    <div
                      className="w-full h-full rounded-xl border border-black/15 shadow-inner"
                      style={{ backgroundColor: col.hex }}
                    />
                    {selectedColor === key && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-4 h-4 rounded-full bg-white text-[#C0142B] flex items-center justify-center shadow">
                          <Check className="w-2.5 h-2.5" />
                        </div>
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {/* Selected Swatch Details Card */}
              <div className="p-3.5 rounded-2xl bg-[#FBF3E8] border border-[#EFE4D6] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl border border-black/10 shadow-md shrink-0"
                    style={{ backgroundColor: currentColor.hex }}
                  />
                  <div>
                    <span className="font-serif font-bold text-sm text-[#1E090C] block leading-tight">
                      {currentColor.name}
                    </span>
                    <span className="text-[11px] text-[#68554F] uppercase font-mono">
                      {currentColor.hex} • {currentColor.texture} finish
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase text-[#8A756C] font-semibold block">
                    Estimated Rate
                  </span>
                  <span className="text-xs font-bold text-[#C0142B]">
                    ₹{selectedFinish === 'lacquered-glass' ? '3,500' : selectedFinish === 'acrylics' ? '2,800' : '2,200'}/sq.ft
                  </span>
                </div>
              </div>
            </div>

            {/* 5. Saved Designs Quick Access */}
            {savedDesigns.length > 0 && (
              <div className="bg-white rounded-3xl p-6 border border-[#E8DACB] shadow-xl">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#68554F] mb-3 flex items-center gap-2">
                  <Heart className="w-4 h-4 text-[#C0142B]" />
                  <span>Saved Designs ({savedDesigns.length})</span>
                </h3>
                <div className="space-y-2 max-h-36 overflow-y-auto">
                  {savedDesigns.slice(-3).map((d) => (
                    <div
                      key={d.id}
                      className="p-2.5 rounded-xl bg-[#FAF4EC] border border-[#EFE4D6] flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-semibold text-[#1E090C] block">{d.name}</span>
                        <span className="text-[10px] text-[#8A756C]">₹{d.estimatedCost.toLocaleString('en-IN')} • {d.timestamp}</span>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedFinish(d.finish);
                          setSelectedColor(d.color);
                          setKitchenLayout(d.layout);
                          setLighting(d.lighting);
                          triggerToast(`Loaded design: ${d.name}`);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-[#1E090C] text-[#D4AF37] font-semibold hover:brightness-125 transition-all text-[11px]"
                      >
                        Load
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>

        {/* ================= SIDE-BY-SIDE DESIGN COMPARISON TRAY ================= */}
        {compareDesigns.length > 0 && (
          <div className="mb-16 bg-white rounded-3xl p-6 sm:p-10 border border-[#E8DACB] shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] block mb-1">
                  Side-by-Side Evaluation
                </span>
                <h3 className="text-2xl font-serif font-bold text-[#1E090C]">
                  Compare Kitchen Configurations
                </h3>
              </div>
              <button
                onClick={() => setCompareDesigns([])}
                className="text-xs text-[#C0142B] font-semibold hover:underline"
              >
                Clear All Comparisons
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {compareDesigns.map((d, index) => {
                const fin = finishes[d.finish];
                const col = fin.colors[d.color] || Object.values(fin.colors)[0];
                return (
                  <div key={index} className="rounded-2xl border border-[#E8DACB] p-5 bg-[#FAF4EC]/50 flex flex-col justify-between">
                    <div>
                      <div
                        className="w-full h-28 rounded-xl border border-black/10 shadow-sm mb-4"
                        style={{ backgroundColor: col.hex }}
                      />
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-[#1E090C] text-[#D4AF37]">
                        {fin.tierBadge}
                      </span>
                      <h4 className="text-lg font-serif font-bold text-[#1E090C] mt-2">
                        {fin.name}
                      </h4>
                      <p className="text-xs text-[#5A4A42] mb-1">
                        Shade: <strong>{col.name}</strong> ({col.texture})
                      </p>
                      <p className="text-xs text-[#8A756C]">
                        Layout: {kitchenLayouts[d.layout].name}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#EFE4D6] flex items-center justify-between">
                      <span className="text-xs text-[#68554F]">Estimated Turnkey:</span>
                      <span className="text-base font-serif font-bold text-[#C0142B]">
                        ₹{d.cost.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= SPECIFICATIONS & PRICE BREAKDOWN MODAL ================= */}
        {showPriceBreakdown && (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-[#E8DACB] shadow-2xl relative max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setShowPriceBreakdown(false)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#C0142B]/10 flex items-center justify-center text-[#C0142B]">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-serif font-bold text-[#1E090C]">
                    Kitchen Specifications & Cost Breakdown
                  </h3>
                  <p className="text-xs text-[#68554F]">
                    {currentFinish.name} • {currentColor.name} ({kitchenLayouts[kitchenLayout].name})
                  </p>
                </div>
              </div>

              <div className="space-y-4 my-6 text-xs sm:text-sm">
                <div className="p-4 rounded-xl bg-[#FBF3E8] border border-[#EFE4D6] space-y-2">
                  <div className="flex justify-between font-semibold text-[#1E090C]">
                    <span>Carcass Base: IS 710 Boiling Water Proof (BWP) Marine Ply</span>
                    <span>Included</span>
                  </div>
                  <p className="text-xs text-[#68554F]">Calibrated 18mm core with 0.8mm internal balancing laminate. 100% termite & borer proof.</p>
                </div>

                <div className="p-4 rounded-xl bg-[#FBF3E8] border border-[#EFE4D6] space-y-2">
                  <div className="flex justify-between font-semibold text-[#1E090C]">
                    <span>Shutters & Finish: {currentFinish.name}</span>
                    <span>Included</span>
                  </div>
                  <p className="text-xs text-[#68554F]">{currentFinish.description}</p>
                </div>

                <div className="p-4 rounded-xl bg-[#FBF3E8] border border-[#EFE4D6] space-y-2">
                  <div className="flex justify-between font-semibold text-[#1E090C]">
                    <span>Hardware: German Hafele / Hettich Soft-Close</span>
                    <span>Included</span>
                  </div>
                  <p className="text-xs text-[#68554F]">Tandem box drawer systems, corner carousel pull-outs, and hydraulic gas lifts tested for 1,00,000 cycles.</p>
                </div>

                <div className="p-4 rounded-xl bg-[#FBF3E8] border border-[#EFE4D6] space-y-2">
                  <div className="flex justify-between font-semibold text-[#1E090C]">
                    <span>Laser Edge-Banding: German PUR Zero-Glue-Line</span>
                    <span>Included</span>
                  </div>
                  <p className="text-xs text-[#68554F]">Precision hot-air PUR banding completely prevents shutter swelling from steam or hot oil.</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#1E090C] text-white flex items-center justify-between">
                <div>
                  <span className="text-xs text-[#D4AF37] uppercase font-semibold block">Estimated Turnkey Budget</span>
                  <span className="text-2xl font-serif font-bold text-[#F3E5AB]">
                    ₹{calculateEstimatedCost().toLocaleString('en-IN')}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setShowPriceBreakdown(false);
                    setIsModalOpen(true);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B38F24] text-[#1E090C] font-bold text-xs uppercase tracking-wider hover:brightness-110"
                >
                  Confirm with Free 3D Consult
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= WHY CHOOSE CHERRY GOLD KITCHENS ================= */}
        <div className="mb-16 bg-white rounded-3xl p-8 sm:p-12 border border-[#E8DACB] shadow-xl">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-[#C0142B] block mb-2">
              Engineering Excellence
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#1E090C] mb-3">
              Why Homeowners Trust Cherry Gold Kitchens
            </h2>
            <p className="text-sm sm:text-base text-[#68554F]">
              Designed to withstand heavy Indian culinary preparations with effortless maintenance and luxury appeal.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-[#FAF4EC] border border-[#EFE4D6] text-center">
              <div className="w-12 h-12 rounded-2xl bg-[#C0142B]/10 flex items-center justify-center mx-auto mb-4 text-[#C0142B]">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="font-serif font-bold text-base text-[#1E090C] mb-2">20 Years Warranty</h4>
              <p className="text-xs text-[#68554F] leading-relaxed">
                Guaranteed replacement against termite infestation, borer attack, or structural delamination.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#FAF4EC] border border-[#EFE4D6] text-center">
              <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/20 flex items-center justify-center mx-auto mb-4 text-[#8B6B10]">
                <Clock className="w-6 h-6" />
              </div>
              <h4 className="font-serif font-bold text-base text-[#1E090C] mb-2">10-15 Days Delivery</h4>
              <p className="text-xs text-[#68554F] leading-relaxed">
                Direct factory manufacturing ensures rapid precision assembly without carpenter delays on site.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#FAF4EC] border border-[#EFE4D6] text-center">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center mx-auto mb-4 text-emerald-800">
                <Crown className="w-6 h-6" />
              </div>
              <h4 className="font-serif font-bold text-base text-[#1E090C] mb-2">100% In-House Factory</h4>
              <p className="text-xs text-[#68554F] leading-relaxed">
                German laser beam CNC sawing and edge-banders operate under stringent quality management.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#FAF4EC] border border-[#EFE4D6] text-center">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center mx-auto mb-4 text-purple-800">
                <Award className="w-6 h-6" />
              </div>
              <h4 className="font-serif font-bold text-base text-[#1E090C] mb-2">500+ Luxury Homes</h4>
              <p className="text-xs text-[#68554F] leading-relaxed">
                Completed across Kolkata's top residential towers including South City, Uniworld, and Silver Spring.
              </p>
            </div>
          </div>
        </div>

        {/* ================= VIP CTA BANNER ================= */}
        <div className="rounded-3xl p-8 sm:p-12 bg-gradient-to-br from-[#1E090C] via-[#2A0E13] to-[#120507] text-white border border-[#D4AF37]/40 shadow-2xl relative overflow-hidden text-center">
          <div className="absolute top-0 right-1/2 translate-x-1/2 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <div className="w-16 h-16 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center mx-auto text-[#D4AF37]">
              <Crown className="w-8 h-8" />
            </div>

            <h3 className="text-3xl sm:text-4xl font-serif font-bold text-white leading-tight">
              Ready to Bring This Kitchen into Your Home?
            </h3>

            <p className="text-xs sm:text-base text-gray-300 leading-relaxed">
              Book a Free In-Home Consultation. Our senior kitchen architects will visit with physical material swatches, conduct laser measurements, and generate full 3D CAD plans.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B38F24] text-[#1E090C] text-xs sm:text-sm font-bold uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all shadow-lg"
              >
                Book Free 3D Design Consultation
              </button>

              <a
                href="https://wa.me/919433889668?text=Hi%20Cherry%20Gold%20Interiors,%20I%20designed%20a%20modular%20kitchen%20on%20your%20website%20and%20want%20to%20discuss%20pricing."
                target="_blank"
                rel="noreferrer"
                className="px-8 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs sm:text-sm font-semibold uppercase tracking-wider active:scale-95 transition-all flex items-center gap-2"
              >
                <MessageSquare className="w-4 h-4 text-[#D4AF37]" />
                <span>WhatsApp Kitchen Specialist</span>
              </a>
            </div>
          </div>
        </div>

      </div>

      {/* Consultation Modal */}
      <ConsultationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Book Modular Kitchen 3D Consultation"
      />
    </div>
  );
};

export default KitchenDesigner;