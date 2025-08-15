import React, { useState } from "react";
import {
  Palette, RotateCcw, Download, Share2, Eye, Save, Heart,
} from "lucide-react";

// Helper to lighten/darken color – for 3D effect
function lightenColor(color, percent) {
  return color; // replace with actual color manipulation logic
}
function darkenColor(color, percent) {
  return color; // replace with actual color manipulation logic
}

// Textures for cabinets (glossy, matte, wooden)
function getTextureStyle(color, textureType) {
  switch (textureType) {
    case "glossy":
      return {
        background: `linear-gradient(135deg, ${color.hex} 0%, ${color.hex} 98%)`,
        transform: "perspective(1200px) rotateX(2.5deg)",
        filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.1))",
        border: "1px solid rgba(0,0,0,0.1)",
        borderLeft: `3px solid ${lightenColor(color.hex, 20)}`,
        borderBottom: `3px solid ${darkenColor(color.hex, 20)}`,
        boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
      };
    case "wood":
      return {
        background: `repeating-linear-gradient(90deg, ${color.hex} 0%, ${color.hex} 100%)`, // Add wood pattern image here
        filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.1))",
        border: "1px solid rgba(0,0,0,0.1)",
        boxShadow: "1px 3px 10px rgba(0,0,0,0.15)",
      };
    default: // matte/smooth
      return {
        backgroundColor: color.hex,
        filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.1))",
        border: "1px solid rgba(0,0,0,0.1)",
      };
  }
}

// Cabinet/Drawer/TallUnit components
function CabinetDoor({ color, texture, isDrawer }) {
  const baseStyle = {
    backgroundColor: color.hex,
    opacity: 0.88,
    mixBlendMode: "multiply",
    border: "1px solid rgba(0,0,0,0.08)",
    borderTop: "1px solid rgba(255,255,255,0.12)",
    borderLeft: "2px solid rgba(255,255,255,0.1)",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1), inset 0 1px 3px rgba(255,255,255,0.15)",
    backgroundImage:
      texture === "wood"
        ? "url(/wood-grain-light.png), linear-gradient(135deg, currentColor 0%, currentColor 100%)"
        : "",
    backgroundBlendMode: texture === "wood" ? "overlay, multiply" : "",
    position: "relative",
    overflow: "hidden",
  };

  return (
    <div className="relative w-full h-full" style={baseStyle}>
      {/* Glossy reflection for glossy finishes */}
      {texture === "glossy" && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "15%",
            background: "linear-gradient(180deg, rgba(255,255,255,0.35), transparent)",
            pointerEvents: "none",
          }}
        />
      )}
      {/* Drawer divider line */}
      {isDrawer && (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: "50%",
            height: 1,
            background: "rgba(255,255,255,0.13)",
          }}
        />
      )}
    </div>
  );


  return (
    <div className="relative h-full">
      <div className="h-full w-full rounded-sm" style={style}>
        <div className="absolute inset-0 border border-black border-opacity-10 rounded-sm"></div>
        {isDrawer && (
          <div className="absolute left-2 right-2 top-1/2 h-px bg-white bg-opacity-15"></div>
        )}
        <div className="absolute top-1 w-full h-1 bg-white bg-opacity-15"></div>
        {hasHandle && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2 w-1 h-8 bg-gray-400 rounded-full"></div>
        )}
      </div>
    </div>
  );
}

// Kitchen Island (same as CabinetDoor, just different placement)
function KitchenIsland({ color, texture }) {
  const style = {
    ...getTextureStyle(color, texture),
    width: "100%",
    height: "100%",
    position: "relative",
    marginLeft: "auto",
    marginRight: "auto",
    boxSizing: "border-box",
    opacity: "0.92",
    mixBlendMode: "overlay",
  };

  return (
    <div className="relative">
      <div className="h-full w-full rounded-sm" style={style}>
        <div className="absolute inset-0 border border-black border-opacity-10 rounded-sm"></div>
        <div className="absolute left-4 right-4 top-4 h-1 bg-white bg-opacity-15 rounded-sm"></div>
        {/* Drawer-like divisions */}
        {[1, 2, 3].map((_, i) => (
          <div
            key={i}
            className="absolute left-4 right-4 top-8 h-6 border-t border-black border-opacity-10"
          ></div>
        ))}
        {[1, 2].map((_, i) => (
          <div
            key={i}
            className="absolute h-full w-1 bg-gray-400 rounded-full"
            style={{
              right: 8,
              top: "24px",
            }}
          ></div>
        ))}
      </div>
    </div>
  );
}

// Your data structure (unchanged)
const FINISHES = {
  'lacquered-glass': {
    name: 'Lacquered Glass',
    description: 'High-gloss finish with mirror-like reflection',
    defaultColor: 'wine-red',
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
    defaultColor: 'burgundy-red',
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
    defaultColor: 'walnut-brown',
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
      'horizontal-zircote': { name: 'Horizontal Zircote', hex: '#8B7355', texture: 'wood' }
    }
  },
  'standard-laminates': {
    name: 'Standard Laminates',
    description: 'Cost-effective with various patterns',
    defaultColor: 'dark-brown',
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
    defaultColor: 'espresso-brown',
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

// Main kitchen preview image background (static, can be changed to your own)
const KITCHEN_IMAGE_URL = "https://media.designcafe.com/wp-content/uploads/2020/07/24234108/aqua-blue-lacquered-glass-modular-kitchen-interior-design.jpg";

function KitchenDesigner() {
  const [selectedFinish, setSelectedFinish] = useState("lacquered-glass");
  const [selectedColor, setSelectedColor] = useState(FINISHES["lacquered-glass"].defaultColor);

  // In case you want to change default, set here:
  // useEffect(() => {
  //   setSelectedFinish("lacquered-glass");
  //   setSelectedColor(FINISHES["lacquered-glass"].defaultColor);
  // }, []);

  // Current finish/color
  const currentFinish = FINISHES[selectedFinish];
  const currentColor = currentFinish.colors[selectedColor];

  // Reset to default
  const resetToDefault = () => {
    setSelectedFinish("lacquered-glass");
    setSelectedColor(FINISHES["lacquered-glass"].defaultColor);
  };

  // Finish type selector
  const handleFinishChange = (finishKey) => {
    setSelectedFinish(finishKey);
    setSelectedColor(FINISHES[finishKey].defaultColor);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl md:text-3xl font-medium text-gray-800 mb-2">
            Looking to customise your Kitchen? Check out the looks for the popular Modular Kitchen finishes amongst our 10,000+ customers.
          </h1>
        </div>
      </div>

      {/* Main Kitchen Customizer Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Kitchen Preview - Left Side (Large) */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden relative">
              <div className="relative h-96 lg:h-[500px]">
                {/* Background Image - This is your kitchen background (change URL if you want) */}
                <div 
                  className="absolute inset-0 bg-cover bg-center z-0"
                  style={{ backgroundImage: `url('${KITCHEN_IMAGE_URL}')` }}
                >
                  <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                </div>

                {/* Upper Cabinets (Color/Finish Overlay) */}
                <div className="absolute top-8 left-8 right-8 h-24 z-10 grid grid-cols-6 gap-1">
                  {[...Array(6)].map((_, i) => (
                    <CabinetDoor
                      key={`upper-${i}`}
                      color={currentColor}
                      texture={currentColor.texture}
                    />
                  ))}
                </div>

                {/* Lower Cabinets (Drawers, Color/Finish Overlay) */}
                <div className="absolute bottom-16 left-8 right-8 h-32 z-10 grid grid-cols-6 gap-1">
                  {[...Array(6)].map((_, i) => (
                    <CabinetDoor
                      key={`lower-${i}`}
                      color={currentColor}
                      texture={currentColor.texture}
                      isDrawer
                    />
                  ))}
                </div>

                {/* Kitchen Island (Optional, Color/Finish Overlay) */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-48 h-20 z-20">
                  <KitchenIsland
                    color={currentColor}
                    texture={currentColor.texture}
                  />
                </div>

                {/* Tall Units (Optional, Color/Finish Overlay) */}
                <div className="absolute top-8 right-8 w-16 h-80 z-10 grid grid-rows-4 gap-1">
                  {[...Array(4)].map((_, i) => (
                    <CabinetDoor
                      key={`tall-${i}`}
                      color={currentColor}
                      texture={currentColor.texture}
                    />
                  ))}
                </div>

                {/* Finish/Color Label */}
                <div className="absolute bottom-4 left-4 bg-white bg-opacity-95 px-4 py-2 rounded-lg shadow-lg z-30">
                  <p className="text-sm font-medium text-gray-800">
                    {currentFinish.name} - {currentColor.name}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Controls Panel - Right Side */}
          <div className="space-y-6">
            {/* Finish Type Selector */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="mb-4">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Lacquered Glass</h3>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleFinishChange('acrylics')}
                    className={`px-4 py-3 rounded-lg font-bold text-sm transition-all duration-300 ${
                      selectedFinish === 'acrylics'
                        ? 'bg-orange-500 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    Acrylics
                  </button>
                  <button
                    onClick={() => handleFinishChange('veneers')}
                    className={`px-4 py-3 rounded-lg font-bold text-sm transition-all duration-300 ${
                      selectedFinish === 'veneers'
                        ? 'bg-orange-500 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    Veneers
                  </button>
                </div>
              </div>

              <div>
                <h4 className="text-md font-semibold text-gray-700 mb-2">Standard Laminates</h4>
                <button
                  onClick={() => handleFinishChange('standard-laminates')}
                  className={`w-full px-4 py-3 rounded-lg font-bold text-sm transition-all duration-300 mb-3 ${
                    selectedFinish === 'standard-laminates'
                      ? 'bg-orange-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  Standard Laminates
                </button>

                <h4 className="text-md font-semibold text-gray-700 mb-2">Premium Laminates</h4>
                <button
                  onClick={() => handleFinishChange('premium-laminates')}
                  className={`w-full px-4 py-3 rounded-lg font-bold text-sm transition-all duration-300 ${
                    selectedFinish === 'premium-laminates'
                      ? 'bg-orange-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  Premium Laminates
                </button>
              </div>

              <div className="border-t border-gray-200 my-4"></div>

              <div className="text-center">
                <p className="text-sm font-medium text-gray-600">Horizontal Zircote</p>
              </div>
            </div>

            {/* Color Palette Grid */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Color Palette</h3>
              {[0, 5].map((startIndex) => (
                <div
                  key={`row-${startIndex}`}
                  className="grid grid-cols-5 gap-2 mb-2"
                >
                  {Object.entries(currentFinish.colors)
                    .slice(startIndex, startIndex + 5)
                    .map(([key, color]) => (
                      <button
                        key={key}
                        onClick={() => setSelectedColor(key)}
                        className={`aspect-square rounded-lg border-2 transition-all duration-300 hover:scale-105 ${
                          selectedColor === key
                            ? "border-orange-500 ring-2 ring-orange-200"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div
                          className="w-full h-full rounded-md"
                          style={getTextureStyle(color, color.texture)}
                        />
                        {selectedColor === key && (
                          <span className="sr-only">
                            {color.name} (selected)
                          </span>
                        )}
                      </button>
                    ))}
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="space-y-3">
                <button
                  onClick={resetToDefault}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-300"
                >
                  <RotateCcw size={16} />
                  <span>Reset to Default</span>
                </button>

                <button className="w-full bg-orange-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-orange-600 transition-colors duration-300">
                  Get Quote for This Design
                </button>

                <button className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-600 transition-colors duration-300">
                  Book 3D Consultation
                </button>

                <div className="grid grid-cols-3 gap-2">
                  <button className="flex items-center justify-center p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-300">
                    <Save size={16} />
                  </button>
                  <button className="flex items-center justify-center p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-300">
                    <Share2 size={16} />
                  </button>
                  <button className="flex items-center justify-center p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-300">
                    <Download size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Price Estimate */}
            <div className="bg-gradient-to-r from-orange-500 to-yellow-600 rounded-lg p-6 text-white">
              <h3 className="text-lg font-semibold mb-2">Estimated Cost</h3>
              <div className="text-2xl font-bold mb-2">₹2,50,000 – ₹4,50,000</div>
              <div className="text-sm opacity-90 mb-4">
                Based on L-shaped kitchen (120 sq ft) with{" "}
                {currentFinish.name} finish
              </div>
              <button className="bg-white text-orange-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-300 w-full">
                Get Detailed Quote
              </button>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-16 bg-white rounded-lg shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Why Choose Our Kitchen Designer?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                Icon: Eye,
                color: "orange",
                title: "Real-time Preview",
                description: "See instant changes as you select different finishes and colors",
              },
              {
                Icon: Palette,
                color: "blue",
                title: "50+ Color Options",
                description: "Choose from premium materials and extensive color palette",
              },
              {
                Icon: Download,
                color: "green",
                title: "Save & Share",
                description: "Save your designs and share with family for feedback",
              },
              {
                Icon: Heart,
                color: "purple",
                title: "10,000+ Happy Customers",
                description: "Trusted by thousands of satisfied customers across India",
              },
            ].map(({ Icon, color, title, description }, idx) => (
              <div key={idx} className="text-center">
                <div
                  className={`w-16 h-16 bg-${color}-100 rounded-full flex items-center justify-center mx-auto mb-4`}
                >
                  <Icon className={`w-8 h-8 text-${color}-600`} />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">{title}</h4>
                <p className="text-gray-600 text-sm">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default KitchenDesigner;