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
  Camera,
  Layers,
  Settings,
  Zap,
  Star,
  ShoppingCart,
  Calculator,
  Phone,
  Mail,
  MessageCircle,
  Grid3X3,
  Ruler,
  PaintBucket,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  RotateCw,
  Move3D,
  Sun,
  Moon
} from 'lucide-react';
// import k from '../assets/k.png'; // Import for the 'teal-dark' color

// L-shaped kitchen images mapping to your local files
const lShapeImageMap = {
  // Lacquered Glass colors
  'teal-dark': '/src/Lshape/teal dark.png',
  'charcoal-grey': '/src/Lshape/charcoal grey.png',
  'navy-blue': '/src/Lshape/navy blue.png',
  'black-pearl': '/src/Lshape/black pearl.png',
  'cream-white': '/src/Lshape/cream white.png',
  'wine-red': '/src/Lshape/wine red.png',
  'forest-green': '/src/Lshape/forest green.png',
  'lavender-grey': '/src/Lshape/lavender grey.png',
  'golden-beige': '/src/Lshape/golden beige.png',
  'aquamarine': '/src/Lshape/aquamarine glossy.png',

  // Acrylics colors
  'burgundy-red': '/src/Lshape/burgundy red.png',
  'teal-blue': '/src/Lshape/teal blue.png',
  'charcoal-black': '/src/Lshape/charcoal black.png',
  'slate-black': '/src/Lshape/slate black.png',
  'sand-beige': '/src/Lshape/sand beige.png',
  'silver-grey': '/src/Lshape/silver grey.png',
  'midnight-blue': '/src/Lshape/midnight blue.png',
  'pearl-white': '/src/Lshape/pearl white.png',
  'cream-ivory': '/src/Lshape/cream ivory.png',
  'warm-grey': '/src/Lshape/warm grey.png',

  // Veneers colors
  'walnut-brown': '/src/Lshape/walnut brown wood.png',
  'light-oak': '/src/Lshape/light oak wood.png',
  'teak-brown': '/src/Lshape/teak brown wood.png',
  'dark-walnut': '/src/Lshape/dark walnut wood.png',
  'cherry-wood': '/src/Lshape/cherry wood wood.png',
  'mahogany-dark': '/src/Lshape/mahogany dark wood.png',
  'maple-light': '/src/Lshape/maple light wood.png',
  'ebony-black': '/src/Lshape/ebony black wood.png',
  'pine-natural': '/src/Lshape/pine natural wood.png',
  'rosewood': '/src/Lshape/rosewood wood.png',

  // Standard Laminates colors - Now with proper unique mappings
  'dark-brown': '/src/Lshape/dark brown.png',
  'teal-green': '/src/Lshape/teal green.png',
  'beige-sand': '/src/Lshape/sand beige.png',
  'grey-stone': '/src/Lshape/grey stone.png',
  'coffee-brown': '/src/Lshape/coffee brown.png',
  'mint-green': '/src/Lshape/mint green.png',
  'slate-blue': '/src/Lshape/slate blue.png',
  'warm-white': '/src/Lshape/warm white.png',
  'charcoal-grey': '/src/Lshape/charcoal grey.png', // This will override the lacquered glass one for laminates
  'horizontal-zircote': '/src/Lshape/horizontal zircote wood.png',

  // Premium Laminates colors - Now with proper matte finish mappings
  'espresso-brown': '/src/Lshape/espresso brown matte.png',
  'sage-green': '/src/Lshape/sage green matte.png',
  'pearl-grey': '/src/Lshape/pearl grey matte.png',
  'charcoal-black': '/src/Lshape/charcoal black matte.png', // This will override the acrylics one for premium laminates
  'champagne-gold': '/src/Lshape/champagne gold matte.png',
  'steel-grey': '/src/Lshape/steel grey matte.png',
  'midnight-black': '/src/Lshape/midnight black matte.png',
  'ivory-cream': '/src/Lshape/ivory cream matte.png',
  'bronze-brown': '/src/Lshape/bronze brown matte.png',
  'platinum-silver': '/src/Lshape/platinum silver matte.png'
};

// Enhanced image system with local L-shaped images
const generateKitchenImage = (color, view, layout) => {
  // If it's L-shaped layout and we have a local image, use it
  if (layout === 'L-shaped' && lShapeImageMap[color]) {
    return lShapeImageMap[color];
  }

  // Fallback to Unsplash for other layouts
  const baseImages = {
    'front': {
      'L-shaped': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop',
      'U-shaped': 'https://images.unsplash.com/photo-1556909045-f7c5c2b4b2b2?w=800&h=600&fit=crop',
      'straight': 'https://images.unsplash.com/photo-1556909045-4d5c2b4b2b2?w=800&h=600&fit=crop',
      'island': 'https://images.unsplash.com/photo-1556909045-5d5c2b4b2b2?w=800&h=600&fit=crop'
    },
    'side': {
      'L-shaped': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop&crop=left',
      'U-shaped': 'https://images.unsplash.com/photo-1556909045-f7c5c2b4b2b2?w=800&h=600&fit=crop&crop=left',
      'straight': 'https://images.unsplash.com/photo-1556909045-4d5c2b4b2b2?w=800&h=600&fit=crop&crop=left',
      'island': 'https://images.unsplash.com/photo-1556909045-5d5c2b4b2b2?w=800&h=600&fit=crop&crop=left'
    },
    'top': {
      'L-shaped': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop&crop=top',
      'U-shaped': 'https://images.unsplash.com/photo-1556909045-f7c5c2b4b2b2?w=800&h=600&fit=crop&crop=top',
      'straight': 'https://images.unsplash.com/photo-1556909045-4d5c2b4b2b2?w=800&h=600&fit=crop&crop=top',
      'island': 'https://images.unsplash.com/photo-1556909045-5d5c2b4b2b2?w=800&h=600&fit=crop&crop=top'
    },
    '3d': {
      'L-shaped': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop&auto=enhance',
      'U-shaped': 'https://images.unsplash.com/photo-1556909045-f7c5c2b4b2b2?w=800&h=600&fit=crop&auto=enhance',
      'straight': 'https://images.unsplash.com/photo-1556909045-4d5c2b4b2b2?w=800&h=600&fit=crop&auto=enhance',
      'island': 'https://images.unsplash.com/photo-1556909045-5d5c2b4b2b2?w=800&h=600&fit=crop&auto=enhance'
    }
  };

  return baseImages[view]?.[layout] || baseImages['front']['L-shaped'];
};

// Kitchen layout images for different views - now using local L-shaped images
const kitchenViewImages = {
  'front': {
    'L-shaped': (color) => lShapeImageMap[color] || '/src/Lshape/wine red.png',
    'U-shaped': 'https://images.unsplash.com/photo-1556909045-f7c5c2b4b2b2?w=800&h=600&fit=crop',
    'straight': 'https://images.unsplash.com/photo-1556909045-4d5c2b4b2b2?w=800&h=600&fit=crop',
    'island': 'https://images.unsplash.com/photo-1556909045-5d5c2b4b2b2?w=800&h=600&fit=crop'
  },
  'side': {
    'L-shaped': (color) => lShapeImageMap[color] || '/src/Lshape/wine red.png',
    'U-shaped': 'https://images.unsplash.com/photo-1556909045-f7c5c2b4b2b2?w=800&h=600&fit=crop&crop=entropy',
    'straight': 'https://images.unsplash.com/photo-1556909045-4d5c2b4b2b2?w=800&h=600&fit=crop&crop=entropy',
    'island': 'https://images.unsplash.com/photo-1556909045-5d5c2b4b2b2?w=800&h=600&fit=crop&crop=entropy'
  },
  'top': {
    'L-shaped': (color) => lShapeImageMap[color] || '/src/Lshape/wine red.png',
    'U-shaped': 'https://images.unsplash.com/photo-1556909045-f7c5c2b4b2b2?w=800&h=600&fit=crop&crop=top',
    'straight': 'https://images.unsplash.com/photo-1556909045-4d5c2b4b2b2?w=800&h=600&fit=crop&crop=top',
    'island': 'https://images.unsplash.com/photo-1556909045-5d5c2b4b2b2?w=800&h=600&fit=crop&crop=top'
  },
  '3d': {
    'L-shaped': (color) => lShapeImageMap[color] || '/src/Lshape/wine red.png',
    'U-shaped': 'https://images.unsplash.com/photo-1556909045-f7c5c2b4b2b2?w=800&h=600&fit=crop&auto=enhance',
    'straight': 'https://images.unsplash.com/photo-1556909045-4d5c2b4b2b2?w=800&h=600&fit=crop&auto=enhance',
    'island': 'https://images.unsplash.com/photo-1556909045-5d5c2b4b2b2?w=800&h=600&fit=crop&auto=enhance'
  }
};

const KitchenDesigner = () => {
  const [selectedFinish, setSelectedFinish] = useState('lacquered-glass');
  const [selectedColor, setSelectedColor] = useState('wine-red');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [savedDesigns, setSavedDesigns] = useState([]);
  const [currentView, setCurrentView] = useState('front'); // front, side, top, 3d
  const [isAutoRotate, setIsAutoRotate] = useState(false);
  const [lighting, setLighting] = useState('natural'); // natural, warm, cool
  const [kitchenLayout, setKitchenLayout] = useState('L-shaped'); // L-shaped, U-shaped, straight, island
  const [showMeasurements, setShowMeasurements] = useState(false);
  const [isComparing, setIsComparing] = useState(false);
  const [compareDesigns, setCompareDesigns] = useState([]);
  const [showPriceBreakdown, setShowPriceBreakdown] = useState(false);
  const [userPreferences, setUserPreferences] = useState({
    budget: '2-5 lakhs',
    style: 'modern',
    size: 'medium'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const canvasRef = useRef(null);
  const [zoom, setZoom] = useState(1);

  const finishes = {
    'lacquered-glass': {
      name: 'Lacquered Glass',
      description: 'High-gloss finish with mirror-like reflection',
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
      name: 'Acrylics',
      description: 'Smooth, durable finish with vibrant colors',
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
      name: 'Veneers',
      description: 'Natural wood grain with rich textures',
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
    'standard-laminates': {
      name: 'Standard Laminates',
      description: 'Cost-effective with various patterns',
      colors: {
        'dark-brown': { name: 'Dark Brown', hex: '#654321', texture: 'matte' },
        'teal-green': { name: 'Teal Green', hex: '#008080', texture: 'matte' },
        'beige-sand': { name: 'Beige Sand', hex: '#F5F5DC', texture: 'matte' },
        'grey-stone': { name: 'Grey Stone', hex: '#708090', texture: 'matte' },
        'coffee-brown': { name: 'Coffee Brown', hex: '#6F4E37', texture: 'matte' },
        'mint-green': { name: 'Mint Green', hex: '#98FB98', texture: 'matte' },
        'slate-blue': { name: 'Slate Blue', hex: '#6A5ACD', texture: 'matte' },
        'warm-white': { name: 'Warm White', hex: '#FAF0E6', texture: 'matte' },
        'charcoal-grey': { name: 'Charcoal Grey', hex: '#36454F', texture: 'matte' },
        'horizontal-zircote': { name: 'Horizontal Zircote', hex: '#8B7355', texture: 'wood' }
      }
    },
    'premium-laminates': {
      name: 'Premium Laminates',
      description: 'High-quality laminates with premium finishes',
      colors: {
        'espresso-brown': { name: 'Espresso Brown', hex: '#3C2415', texture: 'matte' },
        'sage-green': { name: 'Sage Green', hex: '#9CAF88', texture: 'matte' },
        'pearl-grey': { name: 'Pearl Grey', hex: '#E5E4E2', texture: 'matte' },
        'charcoal-black': { name: 'Charcoal Black', hex: '#36454F', texture: 'matte' },
        'champagne-gold': { name: 'Champagne Gold', hex: '#F7E7CE', texture: 'matte' },
        'steel-grey': { name: 'Steel Grey', hex: '#71797E', texture: 'matte' },
        'midnight-black': { name: 'Midnight Black', hex: '#2C3E50', texture: 'matte' },
        'ivory-cream': { name: 'Ivory Cream', hex: '#FFFFF0', texture: 'matte' },
        'bronze-brown': { name: 'Bronze Brown', hex: '#CD7F32', texture: 'matte' },
        'platinum-silver': { name: 'Platinum Silver', hex: '#E5E4E2', texture: 'matte' }
      }
    }
  };

  const currentFinish = finishes[selectedFinish];
  const currentColor = currentFinish.colors[selectedColor];

  // Helper function to convert hex to RGB
  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? 
      `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : 
      'Invalid';
  };

  const getTextureStyle = (color, texture) => {
    const baseStyle = {
      backgroundColor: color.hex,
      transition: 'all 0.3s ease'
    };

    switch (texture) {
      case 'glossy':
        return {
          ...baseStyle,
          background: `linear-gradient(135deg, ${color.hex} 0%, ${color.hex}dd 30%, ${color.hex}ff 50%, ${color.hex}dd 70%, ${color.hex} 100%)`,
          boxShadow: 'inset 0 0 30px rgba(255,255,255,0.4), 0 4px 12px rgba(0,0,0,0.3)',
          border: '1px solid rgba(255,255,255,0.3)',
          position: 'relative'
        };
      case 'smooth':
        return {
          ...baseStyle,
          background: `linear-gradient(45deg, ${color.hex} 0%, ${color.hex}ee 50%, ${color.hex} 100%)`,
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
        };
      case 'wood':
        return {
          ...baseStyle,
          background: `
            linear-gradient(90deg, 
              ${color.hex} 0%, 
              ${color.hex}cc 15%, 
              ${color.hex} 30%, 
              ${color.hex}dd 45%, 
              ${color.hex} 60%, 
              ${color.hex}bb 75%, 
              ${color.hex} 90%, 
              ${color.hex}ee 100%
            ),
            repeating-linear-gradient(0deg, 
              transparent, 
              transparent 3px, 
              rgba(0,0,0,0.1) 3px, 
              rgba(0,0,0,0.1) 6px
            )
          `,
          boxShadow: 'inset 0 0 15px rgba(0,0,0,0.2), 0 2px 6px rgba(0,0,0,0.1)'
        };
      case 'matte':
        return {
          ...baseStyle,
          background: color.hex,
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        };
      default:
        return baseStyle;
    }
  };

  // Enhanced functionality
  useEffect(() => {
    // Load saved designs from localStorage
    const saved = localStorage.getItem('savedKitchenDesigns');
    if (saved) {
      setSavedDesigns(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    // Auto-rotate functionality
    let interval;
    if (isAutoRotate) {
      interval = setInterval(() => {
        setCurrentView(prev => {
          const views = ['front', 'side', 'top', '3d'];
          const currentIndex = views.indexOf(prev);
          return views[(currentIndex + 1) % views.length];
        });
      }, 3000);
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
  };

  const saveDesign = () => {
    const design = {
      id: Date.now(),
      name: `${currentFinish.name} - ${currentColor.name}`,
      finish: selectedFinish,
      color: selectedColor,
      layout: kitchenLayout,
      lighting: lighting,
      view: currentView,
      timestamp: new Date().toISOString(),
      estimatedCost: calculateEstimatedCost()
    };

    const updatedDesigns = [...savedDesigns, design];
    setSavedDesigns(updatedDesigns);
    localStorage.setItem('savedKitchenDesigns', JSON.stringify(updatedDesigns));

    // Show success notification
    alert('Design saved successfully! 🎉');
  };

  const calculateEstimatedCost = () => {
    const baseCost = {
      'lacquered-glass': 3500,
      'acrylics': 2800,
      'veneers': 2200,
      'standard-laminates': 1500,
      'premium-laminates': 2000
    };

    const layoutMultiplier = {
      'L-shaped': 1.0,
      'U-shaped': 1.3,
      'straight': 0.8,
      'island': 1.5
    };

    const basePrice = baseCost[selectedFinish] || 2000;
    const multiplier = layoutMultiplier[kitchenLayout] || 1.0;
    const sqft = 120; // Default kitchen size

    return Math.round(basePrice * multiplier * sqft);
  };

  const shareDesign = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Kitchen Design',
          text: `Check out my ${currentFinish.name} kitchen design in ${currentColor.name}!`,
          url: window.location.href
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert('Design link copied to clipboard! 📋');
    }
  };

  const downloadDesign = () => {
    // Create a canvas and draw the current design
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 800;
    canvas.height = 600;

    // Fill with background color
    ctx.fillStyle = currentColor.hex;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add text overlay
    ctx.fillStyle = '#ffffff';
    ctx.font = '24px Arial';
    ctx.fillText(`${currentFinish.name} - ${currentColor.name}`, 20, 40);
    ctx.font = '16px Arial';
    ctx.fillText(`Layout: ${kitchenLayout}`, 20, 70);
    ctx.fillText(`Estimated Cost: ₹${calculateEstimatedCost().toLocaleString()}`, 20, 95);

    // Download the canvas as image
    const link = document.createElement('a');
    link.download = `kitchen-design-${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
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
    }
  };

  // Get correct image source based on view, layout, and color
  const getImageSrc = () => {
    const viewImages = kitchenViewImages[currentView];
    if (!viewImages) return '/src/Lshape/wine red.png';

    const layoutImage = viewImages[kitchenLayout];

    // If it's L-shaped and we have a function (for local images)
    if (kitchenLayout === 'L-shaped' && typeof layoutImage === 'function') {
      return layoutImage(selectedColor);
    }

    // For other layouts, return the URL directly
    if (typeof layoutImage === 'string') {
      // Add color and finish parameters to the URL for variety
      const colorParam = encodeURIComponent(currentColor.hex.replace('#', ''));
      const finishParam = encodeURIComponent(selectedFinish);
      return `${layoutImage}&color=${colorParam}&finish=${finishParam}&t=${Date.now()}`;
    }

    // Fallback
    return '/src/Lshape/wine red.png';
  };

  const imageSrc = getImageSrc();

  // Create a visual representation of the kitchen with color overlay
  const getKitchenStyle = () => {
    const baseStyle = {
      transition: 'all 0.5s ease-in-out',
      position: 'relative'
    };

    // Add different effects based on view
    switch (currentView) {
      case '3d':
        return {
          ...baseStyle,
          transform: `perspective(1000px) rotateY(15deg) scale(${zoom})`,
          filter: `${lightingOptions[lighting].filter} drop-shadow(0 10px 20px rgba(0,0,0,0.3))`
        };
      case 'top':
        return {
          ...baseStyle,
          transform: `perspective(800px) rotateX(45deg) scale(${zoom})`,
          filter: lightingOptions[lighting].filter
        };
      case 'side':
        return {
          ...baseStyle,
          transform: `perspective(600px) rotateY(-10deg) scale(${zoom})`,
          filter: lightingOptions[lighting].filter
        };
      default:
        return {
          ...baseStyle,
          transform: `scale(${zoom})`,
          filter: lightingOptions[lighting].filter
        };
    }
  };

  const kitchenLayouts = {
    'L-shaped': { name: 'L-Shaped', description: 'Perfect for corner spaces', multiplier: 1.0 },
    'U-shaped': { name: 'U-Shaped', description: 'Maximum storage & counter space', multiplier: 1.3 },
    'straight': { name: 'Straight', description: 'Ideal for narrow spaces', multiplier: 0.8 },
    'island': { name: 'Island', description: 'Spacious with central workspace', multiplier: 1.5 }
  };

  const lightingOptions = {
    'natural': { name: 'Natural Light', icon: Sun, filter: 'brightness(1.1)' },
    'warm': { name: 'Warm LED', icon: Sun, filter: 'sepia(0.3) brightness(1.05)' },
    'cool': { name: 'Cool LED', icon: Moon, filter: 'hue-rotate(200deg) brightness(1.1)' }
  };

  return (
    <div className="py-16 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="w-8 h-8 text-yellow-500 mr-3" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-red-600 to-yellow-600 bg-clip-text text-transparent">
              AI-Powered Kitchen Designer
            </h1>
            <Sparkles className="w-8 h-8 text-yellow-500 ml-3" />
          </div>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-6">
            Design your dream kitchen with our advanced 3D visualizer. Choose from premium finishes, see real-time changes, and get instant cost estimates.
          </p>

          {/* Quick Stats */}
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            <div className="flex items-center bg-white px-4 py-2 rounded-full shadow-md">
              <Star className="w-5 h-5 text-yellow-500 mr-2" />
              <span className="text-sm font-medium">10,000+ Happy Customers</span>
            </div>
            <div className="flex items-center bg-white px-4 py-2 rounded-full shadow-md">
              <Palette className="w-5 h-5 text-blue-500 mr-2" />
              <span className="text-sm font-medium">50+ Premium Finishes</span>
            </div>
            <div className="flex items-center bg-white px-4 py-2 rounded-full shadow-md">
              <Zap className="w-5 h-5 text-green-500 mr-2" />
              <span className="text-sm font-medium">Real-time 3D Preview</span>
            </div>
          </div>

          {/* Tutorial Button */}
          <button
            onClick={() => setShowTutorial(true)}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-full font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            <Play className="w-5 h-5 inline mr-2" />
            Watch Tutorial
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Enhanced Kitchen Preview */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
              {/* Preview Controls */}
              <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <h3 className="font-semibold">Kitchen Preview</h3>
                    <div className="flex items-center space-x-2">
                      {[
                        { key: 'front', label: 'Front View', icon: '🏠' },
                        { key: 'side', label: 'Side View', icon: '📐' },
                        { key: 'top', label: 'Top View', icon: '🔍' },
                        { key: '3d', label: '3D View', icon: '🎯' }
                      ].map((view) => (
                        <button
                          key={view.key}
                          onClick={() => {
                            setIsLoading(true);
                            setTimeout(() => {
                              setCurrentView(view.key);
                              setIsLoading(false);
                            }, 300);
                          }}
                          className={`px-4 py-2 rounded-full text-xs font-medium transition-all transform hover:scale-105 ${currentView === view.key
                            ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                          title={view.label}
                        >
                          <span className="mr-1">{view.icon}</span>
                          {view.key.charAt(0).toUpperCase() + view.key.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setIsAutoRotate(!isAutoRotate)}
                      className={`p-2 rounded-lg transition-all ${isAutoRotate ? 'bg-red-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      title="Auto Rotate"
                    >
                      {isAutoRotate ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </button>

                    <button
                      onClick={() => setShowMeasurements(!showMeasurements)}
                      className={`p-2 rounded-lg transition-all ${showMeasurements ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      title="Show Measurements"
                    >
                      <Ruler className="w-4 h-4" />
                    </button>

                    <button
                      onClick={toggleFullscreen}
                      className="p-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-all"
                      title="Fullscreen"
                    >
                      {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Main Preview Area */}
              <div className={`relative bg-gray-100 flex items-center justify-center ${isFullscreen ? 'h-screen' : 'h-96 lg:h-[500px]'
                }`}>
                {isLoading && (
                  <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center z-10">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
                  </div>
                )}

                <div
                  className="relative w-full h-full overflow-hidden kitchen-view-transition"
                  style={getKitchenStyle()}
                >
                  {/* Base Kitchen Image */}
                  <img
                    ref={canvasRef}
                    src={imageSrc}
                    alt={`${currentColor.name} kitchen in ${currentView} view`}
                    className="object-cover w-full h-full transition-all duration-500"
                    onLoad={() => setIsLoading(false)}
                    onError={() => setIsLoading(false)}
                  />

                  {/* Only add overlays for non-L-shaped layouts or when using Unsplash images */}
                  {(kitchenLayout !== 'L-shaped' || !lShapeImageMap[selectedColor]) && (
                    <>
                      {/* Color Overlay for Cabinet Doors */}
                      <div
                        className="absolute inset-0 opacity-60 mix-blend-multiply transition-all duration-500"
                        style={{
                          background: `linear-gradient(135deg, ${currentColor.hex}88 0%, ${currentColor.hex}44 50%, ${currentColor.hex}88 100%)`,
                          maskImage: 'linear-gradient(to bottom, transparent 20%, black 40%, black 80%, transparent 100%)'
                        }}
                      />

                      {/* Texture Overlay based on finish type */}
                      {currentColor.texture === 'glossy' && (
                        <div
                          className="absolute inset-0 opacity-20 mix-blend-overlay transition-all duration-500"
                          style={{
                            background: 'linear-gradient(45deg, transparent 30%, white 50%, transparent 70%)',
                            animation: 'shimmer 3s ease-in-out infinite'
                          }}
                        />
                      )}

                      {currentColor.texture === 'wood' && (
                        <div
                          className="absolute inset-0 opacity-30 mix-blend-multiply transition-all duration-500"
                          style={{
                            backgroundImage: `repeating-linear-gradient(90deg, 
                              ${currentColor.hex}22 0px, 
                              ${currentColor.hex}44 2px, 
                              ${currentColor.hex}22 4px, 
                              ${currentColor.hex}66 6px
                            )`
                          }}
                        />
                      )}
                    </>
                  )}

                  {/* Subtle enhancement overlay for L-shaped local images */}
                  {kitchenLayout === 'L-shaped' && lShapeImageMap[selectedColor] && (
                    <div
                      className="absolute inset-0 opacity-10 mix-blend-overlay transition-all duration-500"
                      style={{
                        background: `linear-gradient(135deg, ${currentColor.hex}22 0%, transparent 50%, ${currentColor.hex}22 100%)`
                      }}
                    />
                  )}

                  {/* Measurements Overlay */}
                  {showMeasurements && (
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="absolute top-4 left-4 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
                        12' × 10'
                      </div>
                      <div className="absolute bottom-4 left-4 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
                        120 sq ft
                      </div>
                      <div className="absolute top-4 right-4 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
                        {kitchenLayouts[kitchenLayout].name}
                      </div>
                    </div>
                  )}

                  {/* View Indicator */}
                  <div className="absolute top-4 left-4 bg-black bg-opacity-70 text-white px-3 py-2 rounded-xl text-sm font-medium">
                    {currentView.charAt(0).toUpperCase() + currentView.slice(1)} View
                  </div>

                  {/* Design Info Overlay */}
                  <div className="absolute bottom-4 right-4 bg-white bg-opacity-95 backdrop-blur-sm px-4 py-3 rounded-xl shadow-lg border">
                    <p className="text-sm font-semibold text-gray-800">
                      {currentFinish.name}
                    </p>
                    <p className="text-xs text-gray-600">
                      {currentColor.name} • {kitchenLayouts[kitchenLayout].name}
                    </p>
                    <p className="text-xs font-medium text-red-600 mt-1">
                      ₹{calculateEstimatedCost().toLocaleString()}
                    </p>
                    <div className="flex items-center mt-2 text-xs text-gray-500">
                      <div
                        className="w-3 h-3 rounded-full mr-2 border border-gray-300"
                        style={{ backgroundColor: currentColor.hex }}
                      />
                      {currentColor.texture} finish
                    </div>
                  </div>
                </div>

                {/* Zoom Controls */}
                <div className="absolute bottom-4 left-4 flex flex-col space-y-2">
                  <button
                    onClick={() => setZoom(Math.min(zoom + 0.1, 2))}
                    className="bg-white bg-opacity-90 p-2 rounded-lg shadow-md hover:bg-opacity-100 transition-all"
                  >
                    <span className="text-lg font-bold">+</span>
                  </button>
                  <button
                    onClick={() => setZoom(Math.max(zoom - 0.1, 0.5))}
                    className="bg-white bg-opacity-90 p-2 rounded-lg shadow-md hover:bg-opacity-100 transition-all"
                  >
                    <span className="text-lg font-bold">−</span>
                  </button>
                </div>
              </div>
              {/* Enhanced Action Bar */}
              <div className="p-6 bg-gradient-to-r from-gray-50 to-white border-t">
                <div className="flex flex-wrap gap-3 justify-between">
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={resetToDefault}
                      className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all transform hover:scale-105 shadow-md"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Reset</span>
                    </button>

                    <button
                      onClick={saveDesign}
                      className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all transform hover:scale-105 shadow-md"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Design</span>
                    </button>

                    <button
                      onClick={shareDesign}
                      className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-105 shadow-md"
                    >
                      <Share2 className="w-4 h-4" />
                      <span>Share</span>
                    </button>

                    <button
                      onClick={downloadDesign}
                      className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105 shadow-md"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download</span>
                    </button>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={addToCompare}
                      disabled={compareDesigns.length >= 3}
                      className="flex items-center space-x-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-xl hover:bg-purple-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Layers className="w-4 h-4" />
                      <span>Compare ({compareDesigns.length}/3)</span>
                    </button>

                    <button
                      onClick={() => setShowPriceBreakdown(!showPriceBreakdown)}
                      className="flex items-center space-x-2 px-4 py-2 bg-yellow-100 text-yellow-700 rounded-xl hover:bg-yellow-200 transition-all"
                    >
                      <Calculator className="w-4 h-4" />
                      <span>Price Details</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Controls Panel */}
          <div className="space-y-6">
            {/* Kitchen Layout Selection */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Grid3X3 className="w-5 h-5 mr-2 text-blue-600" />
                Kitchen Layout
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(kitchenLayouts).map(([key, layout]) => (
                  <button
                    key={key}
                    onClick={() => setKitchenLayout(key)}
                    className={`p-3 rounded-xl border-2 transition-all text-sm ${kitchenLayout === key
                      ? 'border-blue-500 bg-blue-50 text-blue-800'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                  >
                    <div className="font-medium">{layout.name}</div>
                    <div className="text-xs opacity-75 mt-1">{layout.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Lighting Options */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Sun className="w-5 h-5 mr-2 text-yellow-600" />
                Lighting
              </h3>
              <div className="flex gap-2">
                {Object.entries(lightingOptions).map(([key, option]) => (
                  <button
                    key={key}
                    onClick={() => setLighting(key)}
                    className={`flex-1 p-3 rounded-xl border-2 transition-all text-sm ${lighting === key
                      ? 'border-yellow-500 bg-yellow-50 text-yellow-800'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                  >
                    <option.icon className="w-4 h-4 mx-auto mb-1" />
                    <div className="font-medium text-xs">{option.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Enhanced Finish Selection */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <PaintBucket className="w-5 h-5 mr-2 text-purple-600" />
                Finish Type
              </h3>
              <div className="space-y-3">
                {Object.entries(finishes).map(([key, finish]) => (
                  <button
                    key={key}
                    onClick={() => {
                      setIsLoading(true);
                      setTimeout(() => {
                        setSelectedFinish(key);
                        setSelectedColor(Object.keys(finish.colors)[0]);
                        setIsLoading(false);
                      }, 500);
                    }}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${selectedFinish === key
                      ? 'border-red-500 bg-gradient-to-r from-red-50 to-orange-50 text-red-800 shadow-md'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700 hover:shadow-md'
                      }`}
                  >
                    <div className="font-semibold">{finish.name}</div>
                    <div className="text-xs opacity-75 mt-1">{finish.description}</div>
                    <div className="flex items-center mt-2">
                      <div className="flex -space-x-1">
                        {Object.values(finish.colors).slice(0, 4).map((color, index) => (
                          <div
                            key={index}
                            className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                            style={{ backgroundColor: color.hex }}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-500 ml-2">
                        {Object.keys(finish.colors).length} colors
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Enhanced Color Palette */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Palette className="w-5 h-5 mr-2 text-pink-600" />
                Color Palette
              </h3>
              <div className="grid grid-cols-5 gap-3">
                {Object.entries(currentFinish.colors).map(([key, color]) => (
                  <button
                    key={key}
                    onClick={() => {
                      setIsLoading(true);
                      setTimeout(() => {
                        setSelectedColor(key);
                        setIsLoading(false);
                      }, 300);
                    }}
                    className={`relative aspect-square rounded-xl border-3 transition-all hover:scale-110 transform ${selectedColor === key
                      ? 'border-red-500 ring-4 ring-red-200 shadow-lg'
                      : 'border-gray-200 hover:border-gray-400 shadow-md hover:shadow-lg'
                      }`}
                    title={color.name}
                  >
                    <div
                      className="w-full h-full rounded-lg relative overflow-hidden border border-gray-100"
                      style={{
                        backgroundColor: color.hex,
                        minHeight: '60px'
                      }}
                    >
                      {/* Enhanced texture indicators with better visibility */}
                      {color.texture === 'glossy' && (
                        <div
                          className="absolute inset-0 opacity-25"
                          style={{
                            background: `
                              linear-gradient(45deg, transparent 20%, rgba(255,255,255,0.8) 50%, transparent 80%),
                              radial-gradient(ellipse at 30% 30%, rgba(255,255,255,0.4) 0%, transparent 70%)
                            `
                          }}
                        />
                      )}
                      {color.texture === 'wood' && (
                        <div
                          className="absolute inset-0 opacity-25"
                          style={{
                            backgroundImage: `
                              repeating-linear-gradient(90deg, 
                                rgba(139, 69, 19, 0.15) 0px, 
                                transparent 2px, 
                                rgba(139, 69, 19, 0.15) 4px, 
                                transparent 8px
                              ),
                              repeating-linear-gradient(0deg, 
                                transparent 0px, 
                                rgba(0,0,0,0.05) 12px, 
                                transparent 24px
                              )
                            `
                          }}
                        />
                      )}
                      {color.texture === 'smooth' && (
                        <div
                          className="absolute inset-0 opacity-15"
                          style={{
                            background: `linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 50%, rgba(0,0,0,0.1) 100%)`
                          }}
                        />
                      )}
                      {color.texture === 'matte' && (
                        <div
                          className="absolute inset-0 opacity-15"
                          style={{
                            background: `
                              radial-gradient(circle at center, rgba(0,0,0,0.1) 0%, transparent 60%),
                              linear-gradient(45deg, rgba(255,255,255,0.05) 0%, transparent 100%)
                            `
                          }}
                        />
                      )}
                      
                      {/* Color name overlay for better identification */}
                      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white text-xs px-2 py-1 opacity-0 hover:opacity-100 transition-opacity duration-200">
                        {color.name}
                      </div>
                    </div>
                    {selectedColor === key && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        </div>
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {/* Color Info */}
              <div className="mt-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{currentColor.name}</p>
                    <p className="text-xs text-gray-600">{currentFinish.description}</p>
                    <p className="text-xs text-gray-500 mt-1">Texture: {currentColor.texture}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    {/* Large color preview */}
                    <div
                      className="w-16 h-16 rounded-xl border-3 border-white shadow-lg relative overflow-hidden"
                      style={{ backgroundColor: currentColor.hex }}
                    >
                      {/* Enhanced texture preview */}
                      {currentColor.texture === 'glossy' && (
                        <div
                          className="absolute inset-0 opacity-35"
                          style={{
                            background: `
                              linear-gradient(45deg, transparent 20%, rgba(255,255,255,0.9) 50%, transparent 80%),
                              radial-gradient(ellipse at 70% 30%, rgba(255,255,255,0.5) 0%, transparent 60%)
                            `
                          }}
                        />
                      )}
                      {currentColor.texture === 'wood' && (
                        <div
                          className="absolute inset-0 opacity-30"
                          style={{
                            backgroundImage: `
                              repeating-linear-gradient(90deg, 
                                rgba(139, 69, 19, 0.2) 0px, 
                                transparent 2px, 
                                rgba(139, 69, 19, 0.2) 4px, 
                                transparent 6px
                              )
                            `
                          }}
                        />
                      )}
                      {currentColor.texture === 'matte' && (
                        <div
                          className="absolute inset-0 opacity-20"
                          style={{
                            background: 'radial-gradient(circle, rgba(0,0,0,0.15) 0%, transparent 70%)'
                          }}
                        />
                      )}
                    </div>
                    
                    {/* Color details */}
                    <div className="text-right">
                      <div className="text-sm font-bold text-gray-800">{currentColor.hex}</div>
                      <div className="text-xs text-gray-500 capitalize font-medium">{currentColor.texture} finish</div>
                      <div className="text-xs text-gray-400">RGB: {hexToRgb(currentColor.hex)}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Saved Designs */}
            {savedDesigns.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Heart className="w-5 h-5 mr-2 text-red-600" />
                  Saved Designs ({savedDesigns.length})
                </h3>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {savedDesigns.slice(-3).map((design) => (
                    <div key={design.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium">{design.name}</p>
                        <p className="text-xs text-gray-500">₹{design.estimatedCost.toLocaleString()}</p>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedFinish(design.finish);
                          setSelectedColor(design.color);
                          setKitchenLayout(design.layout);
                          setLighting(design.lighting);
                        }}
                        className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded"
                      >
                        Load
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Enhanced Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Zap className="w-5 h-5 mr-2 text-green-600" />
                Quick Actions
              </h3>
              <div className="space-y-3">
                <button className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-3 px-4 rounded-xl font-medium hover:from-red-600 hover:to-red-700 transition-all transform hover:scale-105 shadow-md flex items-center justify-center">
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Get Quote for This Design
                </button>

                <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-xl font-medium hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-105 shadow-md flex items-center justify-center">
                  <Move3D className="w-5 h-5 mr-2" />
                  Book 3D Consultation
                </button>

                <div className="grid grid-cols-2 gap-3">
                  <button className="bg-green-100 text-green-700 py-2 px-3 rounded-xl font-medium hover:bg-green-200 transition-all flex items-center justify-center">
                    <Phone className="w-4 h-4 mr-1" />
                    Call
                  </button>
                  <button className="bg-purple-100 text-purple-700 py-2 px-3 rounded-xl font-medium hover:bg-purple-200 transition-all flex items-center justify-center">
                    <MessageCircle className="w-4 h-4 mr-1" />
                    Chat
                  </button>
                </div>

                <button className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-xl font-medium hover:bg-gray-200 transition-all flex items-center justify-center">
                  <Heart className="w-4 h-4 mr-2" />
                  Add to Wishlist
                </button>
              </div>
            </div>

            {/* Enhanced Price Estimate */}
            <div className="bg-gradient-to-br from-red-500 via-red-600 to-yellow-600 rounded-2xl p-6 text-white shadow-xl">
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <Calculator className="w-5 h-5 mr-2" />
                Smart Cost Estimate
              </h3>

              <div className="text-3xl font-bold mb-2">
                ₹{calculateEstimatedCost().toLocaleString()}
              </div>

              <div className="text-sm opacity-90 mb-4">
                {kitchenLayouts[kitchenLayout].name} kitchen (120 sq ft)
                <br />
                {currentFinish.name} finish in {currentColor.name}
              </div>

              {showPriceBreakdown && (
                <div className="bg-white bg-opacity-20 rounded-lg p-3 mb-4 text-sm">
                  <div className="flex justify-between mb-1">
                    <span>Base Cost:</span>
                    <span>₹{Math.round(calculateEstimatedCost() * 0.6).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span>Installation:</span>
                    <span>₹{Math.round(calculateEstimatedCost() * 0.25).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Accessories:</span>
                    <span>₹{Math.round(calculateEstimatedCost() * 0.15).toLocaleString()}</span>
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <button className="flex-1 bg-white text-red-600 px-4 py-2 rounded-xl font-medium hover:bg-gray-100 transition-all">
                  Get Detailed Quote
                </button>
                <button
                  onClick={() => setShowPriceBreakdown(!showPriceBreakdown)}
                  className="bg-white bg-opacity-20 text-white px-3 py-2 rounded-xl hover:bg-opacity-30 transition-all"
                >
                  {showPriceBreakdown ? '−' : '+'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Design Comparison Tool */}
        {compareDesigns.length > 0 && (
          <div className="mt-12 bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                <Layers className="w-6 h-6 mr-3 text-purple-600" />
                Design Comparison
              </h3>
              <button
                onClick={() => setCompareDesigns([])}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                Clear All
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {compareDesigns.map((design, index) => (
                <div key={index} className="border border-gray-200 rounded-xl p-4">
                  <div className="h-32 bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                    <div
                      className="w-full h-full rounded-lg"
                      style={{ backgroundColor: finishes[design.finish].colors[design.color].hex }}
                    />
                  </div>
                  <h4 className="font-semibold text-gray-900">{finishes[design.finish].name}</h4>
                  <p className="text-sm text-gray-600">{finishes[design.finish].colors[design.color].name}</p>
                  <p className="text-sm text-gray-500">{kitchenLayouts[design.layout].name}</p>
                  <p className="text-lg font-bold text-red-600 mt-2">₹{design.cost.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Enhanced Features Section */}
        <div className="mt-16 bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl p-8 border border-gray-200">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
              Why Choose Our AI Kitchen Designer?
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Experience the future of kitchen design with our cutting-edge technology and premium materials
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Eye className="w-10 h-10 text-red-600" />
              </div>
              <h4 className="font-bold text-gray-900 mb-3">Real-time 3D Preview</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                See instant changes with our advanced 3D rendering engine. Multiple viewing angles and lighting options.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Palette className="w-10 h-10 text-blue-600" />
              </div>
              <h4 className="font-bold text-gray-900 mb-3">50+ Premium Finishes</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                Choose from lacquered glass, acrylics, veneers, and premium laminates with authentic textures.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Calculator className="w-10 h-10 text-green-600" />
              </div>
              <h4 className="font-bold text-gray-900 mb-3">Smart Cost Calculator</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                Get instant, accurate cost estimates based on your selections with detailed price breakdowns.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Star className="w-10 h-10 text-purple-600" />
              </div>
              <h4 className="font-bold text-gray-900 mb-3">10,000+ Happy Customers</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                Trusted by thousands across India with 4.8★ rating and premium after-sales service.
              </p>
            </div>
          </div>

          {/* Additional Features */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
              <div className="flex items-center mb-3">
                <Save className="w-5 h-5 text-blue-600 mr-2" />
                <h5 className="font-semibold text-gray-900">Save & Share Designs</h5>
              </div>
              <p className="text-gray-600 text-sm">Save unlimited designs and share with family for feedback</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
              <div className="flex items-center mb-3">
                <Move3D className="w-5 h-5 text-green-600 mr-2" />
                <h5 className="font-semibold text-gray-900">AR Visualization</h5>
              </div>
              <p className="text-gray-600 text-sm">See your kitchen design in your actual space using AR technology</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
              <div className="flex items-center mb-3">
                <Settings className="w-5 h-5 text-purple-600 mr-2" />
                <h5 className="font-semibold text-gray-900">Expert Consultation</h5>
              </div>
              <p className="text-gray-600 text-sm">Free consultation with certified interior designers</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 bg-gradient-to-r from-red-600 to-yellow-600 rounded-2xl p-8 text-white text-center shadow-xl">
          <h3 className="text-2xl font-bold mb-4">Ready to Transform Your Kitchen?</h3>
          <p className="text-lg opacity-90 mb-6">Get a free consultation and 3D design for your dream kitchen</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-red-600 px-8 py-3 rounded-xl font-bold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg">
              Book Free Consultation
            </button>
            <button className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-xl font-bold hover:bg-white hover:text-red-600 transition-all">
              Call +91 9876543210
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KitchenDesigner;

// Add CSS animations
const styles = `
  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
  
  .kitchen-view-transition {
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .kitchen-color-overlay {
    transition: background-color 0.5s ease-in-out;
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}
