import React, { useState } from 'react';
import { X } from 'lucide-react';

const ConsultationModal = ({
  isOpen,
  onClose,
  title = "Get a free design consultation"
}) => {
  const [formData, setFormData] = useState({
    propertyType: '',
    location: '',
    name: '',
    mobile: '',
    whatsappUpdates: true
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Consultation booked successfully! We will contact you soon.');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-lg sm:max-w-4xl max-h-[95vh] overflow-hidden shadow-2xl flex flex-col md:flex-row">
        
        {/* LEFT SIDE - Image & Offer */}
        <div className="relative bg-gradient-to-br from-orange-100 to-yellow-100 md:w-1/2 hidden md:flex flex-col">
          {/* Close for desktop */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/70 hover:bg-white rounded-full transition-colors z-10"
          >
            <X className="w-6 h-6 text-gray-700" />
          </button>

          {/* Offer Banner */}
          <div className="absolute top-6 left-6 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-full text-sm font-bold transform -rotate-12">
            MORE ROOM for FREEDOM
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col justify-center items-center p-6 text-center overflow-y-auto">
            <img
              src="https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=400"
              alt="Modern Interior Design"
              className="w-full h-48 object-cover rounded-lg shadow-lg mb-6"
            />
            <h2 className="text-xl font-bold text-gray-800">
              Freedom To Design <br />
              <span className="text-orange-600">Freedom To Save</span>
            </h2>
            <div className="text-4xl font-bold text-teal-600 mt-2">
              FLAT 10% OFF
            </div>
            <div className="text-sm text-gray-700 mt-1">
             Full interiors work exceot false ceiling and paneling
            </div>
            <div className="text-xs text-gray-600 bg-white bg-opacity-80 rounded-lg p-2 mt-3">
              Hurry, Book Now .
              {/* <strong>15th August, 2025</strong> */}
            </div>
          </div>
        </div>

        {/* RIGHT SIDE - Form */}
        <div className="w-full md:w-1/2 p-5 sm:p-8 overflow-y-auto">
          {/* Close for mobile */}
          <div className="flex justify-between items-center mb-4 md:hidden">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full"
            >
              <X className="w-5 h-5 text-gray-700" />
            </button>
          </div>

          {/* Desktop Title */}
          <div className="hidden md:block mb-6">
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Property Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Property type
              </label>
              <div className="grid grid-cols-2 gap-2">
                {['1 BHK', '2 BHK', '3 BHK', '4+ BHK/Duplex'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, propertyType: type }))}
                    className={`p-2 text-xs sm:text-sm rounded-lg border-2 transition-all ${
                      formData.propertyType === type
                        ? 'border-teal-600 bg-teal-50 text-teal-700'
                        : 'border-gray-200 text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Property Location
              </label>
              <select
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              >
                <option value="">Select Location</option>
                <option value="Mumbai">Kolkata</option>
                <option value="Delhi NCR">Mumbai</option>
             
                <option value="Pune">Pune</option>
                 <option value="Kolkata">Rachi</option>
                <option value="Hyderabad">Hyderabad</option>
                
               
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Name */}
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              placeholder="Name"
              className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
            />

            {/* Mobile */}
            <div className="flex">
              <span className="flex items-center px-3 border border-r-0 border-gray-300 rounded-l-lg bg-gray-50 text-sm">
                +91
              </span>
              <input
                type="tel"
                name="mobile"
                value={formData.mobile}
                onChange={handleInputChange}
                required
                placeholder="Mobile Number"
                className="flex-1 px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-teal-500"
              />
            </div>

            {/* WhatsApp Updates */}
            <label className="flex items-center text-sm gap-2">
              <input
                type="checkbox"
                name="whatsappUpdates"
                checked={formData.whatsappUpdates}
                onChange={handleInputChange}
                className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
              />
              Yes, send me updates via WhatsApp 📱
            </label>

            {/* Submit */}
            <button
              type="submit"
              onClick={() => window.location.href = '/services'}
              className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-3 rounded-lg font-semibold text-lg hover:from-red-700 hover:to-red-800 transition-transform hover:scale-105"
            >
              Book a Free Consultation
            </button>

            <p className="text-center text-xs text-gray-500">
              By submitting, you agree to our{' '}
              <a href="#" className="text-teal-600 hover:underline">privacy policy</a> &{' '}
              <a href="#" className="text-teal-600 hover:underline">terms</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ConsultationModal;