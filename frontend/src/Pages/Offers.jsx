import React, { useState, useEffect } from 'react';
import { Gift, Refrigerator, Tv, Wind, Zap, CheckCircle, Clock, Star, AlertTriangle, Calendar, ChevronDown, X, Phone, Mail, User } from 'lucide-react';

const Offers = () => {
  const [selectedMonth, setSelectedMonth] = useState('August 2026');
  const [showPopup, setShowPopup] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', otp: '' });
  const [showOtpField, setShowOtpField] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPopup(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const monthlyOffers = {
    'August 2026': {
      theme: 'Independence Day Special',
      rewards: [
        {
          icon: <Refrigerator className="h-12 w-12 text-blue-500" />,
          title: "Refrigerator (2000L)",
          dealAmount: "₹5,00,000",
          gradient: "from-blue-500 to-cyan-500",
          image: "https://m.media-amazon.com/images/I/61duw-IR8kL._SX679_.jpg"
        },
        {
          icon: <Zap className="h-12 w-12 text-purple-500" />,
          title: "Washing Machine",
          dealAmount: "₹6,00,000",
          gradient: "from-purple-500 to-pink-500",
          image: "https://m.media-amazon.com/images/I/71EcoZ+-PDL._SX522_.jpg"
        },
        {
          icon: <Wind className="h-12 w-12 text-green-500" />,
          title: "Air Conditioner",
          dealAmount: "₹7,00,000",
          gradient: "from-green-500 to-teal-500",
          image: "https://m.media-amazon.com/images/I/61G9Df+4ciL._SX679_.jpg"
        },
        {
          icon: <Tv className="h-12 w-12 text-red-500" />,
          title: "LG 55\"+ Smart TV",
          dealAmount: "₹10,00,000",
          gradient: "from-red-500 to-orange-500",
          image: "https://m.media-amazon.com/images/I/81tjZ4vI7xL._SX522_.jpg"
        }
      ]
    },
    'September 2026': {
      theme: 'Festive Season Bonanza',
      rewards: [
        {
          icon: <Gift className="h-12 w-12 text-purple-500" />,
          title: "Home Theater System",
          dealAmount: "₹8,00,000",
          gradient: "from-purple-500 to-indigo-500",
          image: "https://images.pexels.com/photos/1444416/pexels-photo-1444416.jpeg?auto=compress&cs=tinysrgb&w=400"
        }
      ]
    },
    'October 2026': {
      theme: 'Diwali Dhamaka Offer',
      rewards: [
        {
          icon: <Star className="h-12 w-12 text-yellow-500" />,
          title: "Gold Jewelry Voucher",
          dealAmount: "₹12,00,000",
          gradient: "from-yellow-500 to-orange-500",
          image: "https://images.pexels.com/photos/1444416/pexels-photo-1444416.jpeg?auto=compress&cs=tinysrgb&w=400"
        }
      ]
    }
  };

  const currentOffers = monthlyOffers[selectedMonth] || monthlyOffers['August 2026'];

  const terms = [
    {
      icon: <Clock className="h-6 w-6 text-amber-600" />,
      title: "On-Time Payments",
      description: "Offer valid only if all installments are paid on or before due dates. Any payment delay will void the offer."
    },
    {
      icon: <Calendar className="h-6 w-6 text-amber-600" />,
      title: "Hand-Over Time",
      description: "Reward will be handed over 10 days after final payment completion."
    },
    {
      icon: <Gift className="h-6 w-6 text-amber-600" />,
      title: "Claim Process",
      description: "Must claim offer at booking. Receive Half Token with advance payment, Second Half Token after full payment. Both tokens required for reward collection."
    },
    {
      icon: <AlertTriangle className="h-6 w-6 text-amber-600" />,
      title: "Behavior Policy",
      description: "Any misbehavior, misconduct, or abusive behavior towards staff will automatically void the offer."
    },
    {
      icon: <Star className="h-6 w-6 text-amber-600" />,
      title: "Review Requirement",
      description: "Must provide honest review based on experience when receiving reward."
    },
    {
      icon: <CheckCircle className="h-6 w-6 text-amber-600" />,
      title: "Next Deal Discount",
      description: "Receive 5% flat discount on next deal, valid for one year from issue date."
    }
  ];

  const handleSendOtp = () => {
    if (formData.name && formData.phone) {
      setShowOtpField(true);
      alert('OTP sent to your mobile number!');
    }
  };

  const handleSubmitForm = () => {
    if (formData.name && formData.phone && formData.otp) {
      alert('Thank you! We will contact you soon with the latest offers.');
      setShowPopup(false);
      setFormData({ name: '', phone: '', otp: '' });
      setShowOtpField(false);
    }
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Tricolor Wave Background */}
      <div className="absolute inset-0 z-0">
        <svg className="w-full h-full" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="tricolor" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FF9933" stopOpacity="0.1" />
              <stop offset="33%" stopColor="#FF9933" stopOpacity="0.1" />
              <stop offset="33%" stopColor="#FFFFFF" stopOpacity="0.1" />
              <stop offset="66%" stopColor="#FFFFFF" stopOpacity="0.1" />
              <stop offset="66%" stopColor="#138808" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#138808" stopOpacity="0.1" />
            </linearGradient>
            <filter id="wave">
              <feTurbulence type="fractalNoise" baseFrequency="0.001 0.02" numOctaves="2" seed="2" result="turbulence"/>
              <feOffset in="turbulence" result="offset">
                <animate attributeName="dx" values="0;20;0;-20;0" dur="4s" repeatCount="indefinite"/>
              </feOffset>
              <feDisplacementMap in="SourceGraphic" in2="offset" scale="30" xChannelSelector="R" yChannelSelector="G"/>
            </filter>
          </defs>
          <rect width="1200" height="800" fill="url(#tricolor)" filter="url(#wave)"/>
        </svg>
      </div>

      {/* Hero Section */}
      <section className="relative z-10 bg-gradient-to-br from-orange-50 via-white to-green-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-gradient-to-r from-orange-500 via-white to-green-500 p-4 rounded-full">
                <Gift className="h-16 w-16 text-blue-600" />
              </div>
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              🇮🇳 <span className="text-orange-600">Independence Day</span> Special Offers
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed mb-8">
              Celebrate freedom with exclusive appliance rewards! Transform your space and get amazing gifts FREE!
            </p>
            
            {/* Month Selection Dropdown */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <select 
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="bg-white border-2 border-orange-300 rounded-lg px-6 py-3 pr-10 text-lg font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none cursor-pointer"
                >
                  {Object.keys(monthlyOffers).map((month) => (
                    <option key={month} value={month}>{month}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-600 pointer-events-none" />
              </div>
            </div>

            <div className="bg-gradient-to-r from-orange-500 via-white to-green-500 p-1 rounded-lg inline-block">
              <div className="bg-white px-6 py-3 rounded-lg">
                <h2 className="text-2xl font-bold text-gray-800">{currentOffers.theme}</h2>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Rewards Section with Image Zoom Out Effect */}
      <section className="relative z-10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Available Rewards</h2>
            <p className="text-xl text-gray-600">Choose your interior package and get amazing appliances FREE!</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {currentOffers.rewards.map((reward, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-xl overflow-visible border border-gray-100 hover:shadow-2xl transition-shadow duration-300 relative group">
                <div className="relative h-48 overflow-visible">
                  <img 
                    src={reward.image} 
                    alt={reward.title}
                    className="w-full h-full object-cover absolute top-0 left-0 transition-all duration-500 transform group-hover:scale-125 group-hover:z-10 group-hover:shadow-xl"
                  />
                  <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold z-20">
                    FREE
                  </div>
                </div>
                <div className={`bg-gradient-to-br ${reward.gradient} p-6 text-white text-center`}>
                  <div className="flex justify-center mb-3">
                    {reward.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{reward.title}</h3>
                </div>
                <div className="p-6 text-center">
                  <p className="text-gray-600 mb-2">On interior deal of</p>
                  <p className="text-2xl font-bold text-orange-600">{reward.dealAmount}</p>
                  <p className="text-sm text-gray-500 mt-2">or above</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enquiry Section */}
      <section className="relative z-10 py-16 bg-gradient-to-r from-orange-100 via-white to-green-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Want to Know About Latest Offers?</h2>
          <p className="text-lg text-gray-600 mb-8">Get notified about exclusive deals and seasonal offers</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => setShowPopup(true)}
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              📱 Get Latest Offers
            </button>
            <button className="border-2 border-orange-500 text-orange-600 px-8 py-4 rounded-lg font-semibold hover:bg-orange-50 transition-colors">
              📞 Call: +91 9433889668
            </button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative z-10 py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">Simple steps to claim your reward</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-orange-600">1</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Book Your Interior</h3>
              <p className="text-gray-600">Choose a package worth ₹5L+ and claim the offer at booking</p>
            </div>
            
            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-orange-600">2</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Get Half Token</h3>
              <p className="text-gray-600">Receive your first token with advance payment</p>
            </div>
            
            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-orange-600">3</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Complete Payment</h3>
              <p className="text-gray-600">Make all payments on time and get second token</p>
            </div>
            
            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-orange-600">4</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Claim Reward</h3>
              <p className="text-gray-600">Submit both tokens and collect your free appliance!</p>
            </div>
          </div>
        </div>
      </section>

      {/* Terms & Conditions */}
      <section className="relative z-10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Eligibility & Terms</h2>
            <p className="text-xl text-gray-600">Important conditions to qualify for rewards</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {terms.map((term, index) => (
              <div key={index} className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-4">
                    {term.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{term.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{term.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      {/* <section className="relative z-10 py-20 bg-gradient-to-r from-orange-500 via-red-500 to-green-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Space?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Book your interior design project today and claim your FREE appliance reward!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-orange-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg">
              Book Consultation & Claim Offer
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-orange-600 transition-colors">
              Call: 6201082668
            </button>
          </div>
        </div>
      </section> */}

      {/* Popup Modal */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
            <button 
              onClick={() => setShowPopup(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
            
            <div className="text-center mb-6">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gift className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Latest Offers For You!</h3>
              <p className="text-gray-600">Get exclusive deals and seasonal offers</p>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="tel"
                  placeholder="Mobile Number"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              {!showOtpField ? (
                <button
                  onClick={handleSendOtp}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
                >
                  Send OTP
                </button>
              ) : (
                <>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Enter OTP"
                      value={formData.otp}
                      onChange={(e) => setFormData({...formData, otp: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-center text-lg font-semibold"
                    />
                  </div>
                  <button
                    onClick={handleSubmitForm}
                    className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
                  >
                    Verify & Get Offers
                  </button>
                </>
              )}
            </div>

            <p className="text-xs text-gray-500 text-center mt-4">
              By submitting, you agree to receive offers via SMS/WhatsApp
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Offers;