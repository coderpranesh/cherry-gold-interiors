/*frontend/src/Components/WarrantySection.jsx */
import React from 'react';
import { Shield, Clock, PenTool as Tools, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
const WarrantySection = () => {
  const warrantyFeatures = [
    {
      icon: Shield,
      title: '5 Years Warranty',
      description: 'Comprehensive warranty on modular kitchens and wardrobes',
      color: 'text-green-600'
    },
    {
      icon: Clock,
      title: '24/7 Support',
      description: 'Round-the-clock customer support for all your queries',
      color: 'text-blue-600'
    },
    {
      icon: Tools,
      title: 'Free Maintenance',
      description: 'Complimentary maintenance visits in the first year',
      color: 'text-orange-600'
    },
    {
      icon: Award,
      title: 'Quality Guarantee',
      description: 'Premium materials and certified quality standards',
      color: 'text-purple-600'
    }
  ];

  return (
    <section className="py-16 bg-[#FDFBD4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Warranty Promise
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We stand behind our work with comprehensive warranty coverage and ongoing support to ensure your complete satisfaction.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {warrantyFeatures.map((feature, index) => (
            <div key={index} className="text-center p-6 rounded-xl bg-gray-50 hover:bg-white hover:shadow-lg transition-all duration-200">
              <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-white shadow-lg flex items-center justify-center ${feature.color}`}>
                <feature.icon className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-gradient-to-r from-gray-900 to-red-800 rounded-2xl p-8 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-4">Warranty Terms & Conditions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div>
                <h4 className="font-semibold mb-2">What's Covered:</h4>
                <ul className="space-y-1 text-sm opacity-90">
                  <li>• Manufacturing defects in materials</li>
                  <li>• Hardware and fitting failures</li>
                  <li>• Structural integrity issues</li>
                  <li>• Finish quality problems</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Warranty Period:</h4>
                <ul className="space-y-1 text-sm opacity-90">
                  <li>• Modular Kitchen: 10 years</li>
                  <li>• Wardrobes: 5 years</li>
                  <li>• TV Units: 2 years</li>
                  <li>• False Ceiling: 5 years</li>
                </ul>
              </div>
            </div>
            <div className="mt-6">
              <Link to="/about">
              <button className="bg-gradient-to-br from-white to-gray text-white px-8 py-3 rounded-2xl font-medium hover:bg-yellow-600 transition-all duration-200 transform hover:scale-105">
                View Full Warranty Terms
              </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WarrantySection;