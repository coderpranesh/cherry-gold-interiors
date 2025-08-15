/*frontend/src/Pages/Catalogue.jsx */
import React, { useState } from 'react';
import { Eye, Heart, Palette, Lightbulb, Grid } from 'lucide-react';

const Catalogue = () => {
  const [activeCategory, setActiveCategory] = useState('kitchen');
  const [selectedItem, setSelectedItem] = useState(null);

  const categories = [
    { id: 'kitchen', name: 'Modular Kitchen', icon: Grid },
    { id: 'wardrobe', name: 'Wardrobe', icon: Grid },
    { id: 'ceiling', name: 'False Ceiling', icon: Grid },
    { id: 'tv-unit', name: 'TV Unit', icon: Grid },
    { id: 'bed', name: 'Bed Designs', icon: Grid },
    { id: 'wallpaper', name: 'Wallpapers', icon: Grid },
    { id: 'flooring', name: 'Flooring', icon: Grid },
    { id: 'paneling', name: 'Wall Paneling', icon: Grid }
  ];

  const catalogueItems = {
    kitchen: [
      {
        id: 1,
        title: 'Modern L-Shaped Kitchen',
        image: 'https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg?auto=compress&cs=tinysrgb&w=600',
        price: '₹2,50,000 - ₹4,50,000',
        colors: ['White', 'Grey', 'Walnut', 'Oak'],
        lighting: ['Under-cabinet LED', 'Pendant lights', 'Cove lighting'],
        features: ['Soft-close hinges', 'Pull-out drawers', 'Granite countertop']
      },
      {
        id: 2,
        title: 'U-Shaped Modular Kitchen',
        image: 'https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg?auto=compress&cs=tinysrgb&w=600',
        price: '₹3,50,000 - ₹6,50,000',
        colors: ['Black', 'White', 'Cream', 'Wood'],
        lighting: ['Strip lighting', 'Spotlights', 'Island lighting'],
        features: ['Maximum storage', 'Corner solutions', 'Premium hardware']
      }
    ],
    wardrobe: [
      {
        id: 1,
        title: 'Sliding Door Wardrobe',
        image: 'https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=600',
        price: '₹1,50,000 - ₹2,50,000',
        colors: ['White', 'Walnut', 'Oak', 'Wenge'],
        lighting: ['LED strips', 'Motion sensors', 'Spotlights'],
        features: ['Soft-close doors', 'Internal organizers', 'Mirror options']
      },
      {
        id: 2,
        title: 'Walk-in Wardrobe',
        image: 'https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=600',
        price: '₹2,50,000 - ₹4,50,000',
        colors: ['Custom colors', 'Wood finishes', 'Lacquered'],
        lighting: ['Central chandelier', 'Perimeter lighting', 'Accent lights'],
        features: ['Open shelving', 'Drawers', 'Shoe racks', 'Seating']
      }
    ]
  };

  const currentItems = catalogueItems[activeCategory] || [];

  return (
    <div className="py-32 bg-[#FDFBD4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Our Catalogue
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore our extensive collection of premium interior design solutions. From modular kitchens to complete home furnishing, find inspiration for your dream space.
          </p>
        </div>

        {/* QR Code Section */}
        <div className="bg-[#f1f1de] rounded-2xl shadow-lg p-8 mb-12 max-w-4xl mx-auto">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              View Our Complete Catalogue
            </h2>
            <p className="text-gray-600 mb-6">
              Scan the QR code to access our complete digital catalogue on your mobile device
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-8">
              <div className="bg-gray-100 p-8 rounded-lg">
                <div className="w-32 h-32 bg-black flex items-center justify-center rounded">
                  <span className="text-white text-xs">QR Code</span>
                </div>
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-gray-900 mb-2">Or visit directly:</h3>
                <p className="text-red-500 font-medium">www.cherrygoldinteriors.com/catalogue</p>
                <p className="text-sm text-gray-500 mt-2">
                  Add this QR code to your visiting card for easy access
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex items-center space-x-3 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                activeCategory === category.id
                  ? 'bg-[#f4d83e] text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-red-50 hover:text-red-600'
              }`}
            >
              <category.icon className="w-5 h-5" />
              <span>{category.name}</span>
            </button>
          ))}
        </div>

        {/* Catalogue Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentItems.map((item) => (
            <div key={item.id} className="bg-[#f1f1de] rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-200 group">
              <div className="relative overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-200"
                />
                <div className="absolute top-4 right-4 flex space-x-2">
                  <button className="bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 transition-colors">
                    <Heart className="w-4 h-4 text-gray-600" />
                  </button>
                  <button 
                    onClick={() => setSelectedItem(item)}
                    className="bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                  >
                    <Eye className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-lg font-bold text-red-500 mb-4">{item.price}</p>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Palette className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      Colors: {item.colors.join(', ')}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Lightbulb className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      Lighting: {item.lighting.join(', ')}
                    </span>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Key Features:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {item.features.map((feature, index) => (
                      <li key={index}>• {feature}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="mt-6 flex space-x-3">
                  <button className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors">
                    Get Quote
                  </button>
                  <button className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors">
                    View Variants
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Login Required Notice */}
        <div className="mt-16 bg-[#f1f1de] rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Unlock Premium Features
          </h3>
          <p className="text-gray-600 mb-6">
            Login to access our Color Palette tool, 3D Room Designer, and personalized recommendations
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="bg-[#f4d83e] text-white px-8 py-3 rounded-lg font-medium hover:bg-red-600 transition-colors">
              Login / Sign Up
            </button>
            <button className="bg-white text-gray-700 px-8 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors border border-gray-200">
              Guest Preview
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Session valid for 1 hour • Re-login required after expiry
          </p>
        </div>
      </div>
    </div>
  );
};

export default Catalogue;