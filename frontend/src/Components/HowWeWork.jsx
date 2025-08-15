/*frontend/src/Components/HowWeWork.jsx */
import React from 'react';
import { Link } from 'react-router-dom';

import { Calendar, Home, DollarSign, Wrench, CheckCircle } from 'lucide-react';

const HowWeWork = () => {
  const steps = [
    {
      id: 1,
      icon: Calendar,
      title: 'Book Consultation',
      description: 'Schedule a free consultation with our design experts to discuss your vision and requirements.',
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 2,
      icon: Home,
      title: 'Site Visit & Design',
      description: 'Our team visits your space, takes measurements, and creates detailed 3D designs tailored to your needs.',
      color: 'from-green-500 to-green-600'
    },
    {
      id: 3,
      icon: DollarSign,
      title: 'Budget Approval',
      description: 'We provide transparent pricing with detailed quotations. No hidden costs, just honest pricing.',
      color: 'from-yellow-500 to-yellow-600'
    },
    {
      id: 4,
      icon: Wrench,
      title: 'Manufacturing & Installation',
      description: 'Quality manufacturing in our facility followed by professional installation at your location.',
      color: 'from-orange-500 to-orange-600'
    },
    {
      id: 5,
      icon: CheckCircle,
      title: 'Final Delivery',
      description: 'Quality check, final touches, and handover of your beautiful new space with warranty coverage.',
      color: 'from-purple-500 to-purple-600'
    }
  ];

  return (
    <section className="py-28 bg-[#f1f1de]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How Our Company Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From concept to completion, we guide you through every step of your interior design journey with transparency and expertise.
          </p>
        </div>

        {/* Desktop Timeline */}
        <div className="hidden lg:block">
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute top-24 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-yellow-500 to-purple-500"></div>
            
            <div className="flex justify-between items-start">
              {steps.map((step, index) => (
                <div key={step.id} className="flex flex-col items-center max-w-xs">
                  {/* Step Icon */}
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center text-white shadow-lg mb-6 relative z-10`}>
                    <step.icon className="w-8 h-8" />
                  </div>
                  
                  {/* Step Number */}
                  <div className="bg-white border-2 border-gray-200 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold text-gray-600 mb-4">
                    {step.id}
                  </div>
                  
                  {/* Step Content */}
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Timeline */}
        <div className="lg:hidden space-y-8">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center text-white shadow-lg`}>
                  <step.icon className="w-6 h-6" />
                </div>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="bg-white border-2 border-gray-200 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold text-gray-600">
                    {step.id}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{step.title}</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-gray-900 to-red-800 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
            <p className="text-lg mb-6 opacity-90">
              Let's transform your space with our proven 5-step process. Book your free consultation today!
            </p>
            <Link to='/services'>
            <button className="bg-gradient-to-br from-white to-gray text-white px-8 py-3 rounded-2xl font-medium hover:bg-yellow-600 transition-all duration-200 transform hover:scale-105">
              Start Your Journey
            </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowWeWork;