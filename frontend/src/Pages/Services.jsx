import React, { useState, useEffect } from 'react';
import { Wrench, Video, Phone, MessageCircle, Loader2 } from 'lucide-react';
import axios from 'axios';

const Services = () => {
  const [activeService, setActiveService] = useState('repair');
  const [formData, setFormData] = useState({
    service_type: 'repair',
    full_name: '',
    phone_number: '',
    email: '',
    issue_description: '',
    preferred_date: '',
    preferred_time: '',
    complete_address: '',
    project_type: '',
    project_details: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const [serviceNumber, setServiceNumber] = useState('');

  const services = [
    {
      id: 'repair',
      icon: Wrench,
      title: 'Repair Request',
      description: 'Quick and efficient repair services for all your interior fixtures'
    },
    {
      id: 'video',
      icon: Video,
      title: 'Video Consultancy',
      description: 'Get expert advice through video consultation from our designers'
    },
    {
      id: 'onsite',
      icon: Phone,
      title: 'On-site Free Consultancy',
      description: 'Free on-site consultation and assessment for your project'
    }
  ];

  const generateServiceNumberPreview = () => {
    const now = new Date();
    const year = now.getFullYear().toString().slice(-2);
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    return `CG${year}${month}XXXX`;
  };

  const [serviceNumberPreview] = useState(generateServiceNumberPreview());

  useEffect(() => {
    // Reset form when service type changes
    setFormData({
      service_type: activeService,
      full_name: '',
      phone_number: '',
      email: '',
      issue_description: '',
      preferred_date: '',
      preferred_time: '',
      complete_address: '',
      project_type: '',
      project_details: ''
    });
    setSubmitSuccess(false);
    setSubmitError('');
    setValidationErrors({});
    setServiceNumber('');
  }, [activeService]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Format date to YYYY-MM-DD when coming from date input
    const formattedValue = name === 'preferred_date' && value 
      ? new Date(value).toISOString().split('T')[0]
      : value;

    setFormData(prev => ({
      ...prev,
      [name]: formattedValue
    }));
    
    // Clear validation error when user types
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    const requiredFields = {
      repair: ['full_name', 'phone_number', 'issue_description'],
      video: ['full_name', 'phone_number', 'email', 'preferred_date', 'preferred_time'],
      onsite: ['full_name', 'phone_number', 'complete_address', 'preferred_date', 'preferred_time', 'project_type']
    };

    requiredFields[activeService].forEach(field => {
      if (!formData[field]) {
        errors[field] = 'This field is required';
      }
    });

    if (formData.phone_number && !/^\d{10,15}$/.test(formData.phone_number)) {
      errors.phone_number = 'Please enter a valid phone number (10-15 digits)';
    }

    if (activeService === 'video' && formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Date validation
    if (formData.preferred_date) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const selectedDate = new Date(formData.preferred_date);
      
      if (selectedDate < today) {
        errors.preferred_date = 'Preferred date cannot be in the past';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');
    
    try {
      // Prepare the data with properly formatted date
      const submissionData = {
        ...formData,
        service_type: activeService,
        preferred_date: formData.preferred_date || null
      };

      console.log('Submitting:', submissionData); // Debug log

      const response = await axios.post(
        'http://127.0.0.1:8000/api/services/requests/',
        submissionData,
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
   
      if (response.status === 201) {
        setSubmitSuccess(true);
        setServiceNumber(response.data.service_number);
        setFormData({
          service_type: activeService,
          full_name: '',
          phone_number: '',
          email: '',
          issue_description: '',
          preferred_date: '',
          preferred_time: '',
          complete_address: '',
          project_type: '',
          project_details: ''
        });
      }
    } catch (error) {
      console.error('Submission error:', error.response?.data || error.message);
      
      if (error.response) {
        if (error.response.status === 400) {
          // Handle field validation errors
          if (error.response.data.preferred_date) {
            setValidationErrors({
              ...validationErrors,
              preferred_date: 'Please use YYYY-MM-DD format'
            });
          } else {
            setValidationErrors(error.response.data);
          }
          setSubmitError('Please correct the errors in the form');
        } else {
          setSubmitError(error.response.data?.detail || 'Failed to submit. Please try again.');
        }
      } else if (error.request) {
        setSubmitError('Network error. Please check your connection and try again.');
      } else {
        setSubmitError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderInput = (name, label, type = 'text', required = false, options = null) => {
    const isError = validationErrors[name];
    
    // Handle date input display value
    const inputValue = name === 'preferred_date' && formData[name] 
      ? formData[name].includes('T') 
        ? formData[name].split('T')[0]
        : formData[name]
      : formData[name];

    return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        {type === 'select' ? (
          <select
            name={name}
            value={formData[name]}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
              isError ? 'border-red-500' : 'border-gray-300'
            }`}
            required={required}
          >
            <option value="">Select {label.toLowerCase()}</option>
            {options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : type === 'textarea' ? (
          <textarea
            name={name}
            value={formData[name]}
            onChange={handleInputChange}
            rows={4}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none ${
              isError ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder={`Enter your ${label.toLowerCase()}`}
            required={required}
          />
        ) : (
          <input
            type={type}
            name={name}
            value={inputValue}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
              isError ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder={`Enter your ${label.toLowerCase()}`}
            required={required}
            min={type === 'date' ? new Date().toISOString().split('T')[0] : undefined}
          />
        )}
        {isError && (
          <p className="mt-1 text-sm text-red-600">{validationErrors[name]}</p>
        )}
      </div>
    );
  };

  return (
    <div className="py-32 bg-[#FDFBD4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Our Services
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive interior design services to meet all your needs. From repairs to complete consultations, we're here to help.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {services.map((service) => (
            <button
              key={service.id}
              onClick={() => setActiveService(service.id)}
              className={`flex items-center space-x-3 px-6 py-4 rounded-xl font-medium transition-all duration-200 ${
                activeService === service.id
                  ? 'bg-[#f4d83e] text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <service.icon className="w-5 h-5" />
              <span>{service.title}</span>
            </button>
          ))}
        </div>

        {submitSuccess && (
          <div className="max-w-4xl mx-auto mb-6 p-4 bg-green-100 text-green-800 rounded-lg">
            <p className="font-semibold">Your request has been submitted successfully!</p>
            <p className="mt-2">
              <span className="font-bold">Service Number:</span> {serviceNumber}
            </p>
            <p className="mt-1">We'll contact you shortly.</p>
          </div>
        )}

        {submitError && (
          <div className="max-w-4xl mx-auto mb-6 p-4 bg-red-100 text-red-800 rounded-lg">
            {submitError}
          </div>
        )}

        <div className="max-w-4xl mx-auto">
          <div className="bg-[#f1f1de] rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {activeService === 'repair' && 'Repair Request Service'}
              {activeService === 'video' && 'Video Consultancy Service'}
              {activeService === 'onsite' && 'On-site Free Consultancy Service'}
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {activeService === 'repair' && 'Submit Repair Request'}
                  {activeService === 'video' && 'Book Video Consultation'}
                  {activeService === 'onsite' && 'Schedule Site Visit'}
                </h3>
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Service Number
                    </label>
                    <div className="px-4 py-3 bg-gray-100 rounded-lg font-mono">
                      {submitSuccess ? serviceNumber : serviceNumberPreview}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {!submitSuccess && "This will be generated in CGyymmXXXX format upon submission"}
                    </p>
                  </div>

                  {activeService === 'repair' && (
                    <>
                      {renderInput('full_name', 'Full Name', 'text', true)}
                      {renderInput('phone_number', 'Phone Number', 'tel', true)}
                      {renderInput('issue_description', 'Issue Description', 'textarea', true)}
                    </>
                  )}

                  {activeService === 'video' && (
                    <>
                      {renderInput('full_name', 'Full Name', 'text', true)}
                      {renderInput('email', 'Email Address', 'email', true)}
                      {renderInput('phone_number', 'Phone Number', 'tel', true)}
                      {renderInput('preferred_date', 'Preferred Date', 'date', true)}
                      {renderInput('preferred_time', 'Preferred Time', 'select', true, [
                        { value: '10:00', label: '10:00 AM' },
                        { value: '11:00', label: '11:00 AM' },
                        { value: '12:00', label: '12:00 PM' },
                        { value: '14:00', label: '2:00 PM' },
                        { value: '15:00', label: '3:00 PM' },
                        { value: '16:00', label: '4:00 PM' }
                      ])}
                      {renderInput('project_details', 'Project Details', 'textarea')}
                    </>
                  )}

                  {activeService === 'onsite' && (
                    <>
                      {renderInput('full_name', 'Full Name', 'text', true)}
                      {renderInput('phone_number', 'Phone Number', 'tel', true)}
                      {renderInput('complete_address', 'Complete Address', 'textarea', true)}
                      {renderInput('preferred_date', 'Preferred Date', 'date', true)}
                      {renderInput('preferred_time', 'Preferred Time', 'select', true, [
                        { value: 'morning', label: 'Morning (9 AM - 12 PM)' },
                        { value: 'afternoon', label: 'Afternoon (12 PM - 4 PM)' },
                        { value: 'evening', label: 'Evening (4 PM - 7 PM)' }
                      ])}
                      {renderInput('project_type', 'Project Type', 'select', true, [
                        { value: 'kitchen', label: 'Modular Kitchen' },
                        { value: 'wardrobe', label: 'Wardrobe' },
                        { value: 'living-room', label: 'Living Room' },
                        { value: 'bedroom', label: 'Bedroom' },
                        { value: 'complete-home', label: 'Complete Home' },
                        { value: 'office', label: 'Office Interior' }
                      ])}
                    </>
                  )}
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-red-500 text-white py-3 rounded-lg font-medium hover:bg-red-600 transition-colors disabled:opacity-50 flex justify-center items-center"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        {activeService === 'repair' && 'Submit Repair Request'}
                        {activeService === 'video' && 'Book Video Consultation'}
                        {activeService === 'onsite' && 'Schedule Free Site Visit'}
                      </>
                    )}
                  </button>
                </form>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {activeService === 'repair' && 'Or Contact Us Directly'}
                  {activeService === 'video' && 'What You\'ll Get'}
                  {activeService === 'onsite' && 'What We\'ll Do'}
                </h3>

                {activeService === 'repair' && (
                  <div className="space-y-4">
                    <a
                      href="https://wa.me/919876543210"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                    >
                      <MessageCircle className="w-6 h-6 text-green-600" />
                      <div>
                        <p className="font-medium text-gray-900">WhatsApp</p>
                        <p className="text-sm text-gray-600">Get instant support</p>
                      </div>
                    </a>
                    
                    <a
                      href="tel:+919876543210"
                      className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      <Phone className="w-6 h-6 text-blue-600" />
                      <div>
                        <p className="font-medium text-gray-900">Call Now</p>
                        <p className="text-sm text-gray-600">+91 9876543210</p>
                      </div>
                    </a>

                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">Common Issues We Fix:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Cabinet door adjustments</li>
                        <li>• Drawer repair and replacement</li>
                        <li>• Hardware replacements</li>
                        <li>• Finish touch-ups</li>
                        <li>• Lighting fixture issues</li>
                      </ul>
                    </div>
                  </div>
                )}

                {activeService === 'video' && (
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-red-600 rounded-full mt-2"></div>
                      <div>
                        <h4 className="font-medium text-gray-900">Expert Design Advice</h4>
                        <p className="text-sm text-gray-600">Professional guidance from our experienced designers</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-red-600 rounded-full mt-2"></div>
                      <div>
                        <h4 className="font-medium text-gray-900">Space Planning</h4>
                        <p className="text-sm text-gray-600">Optimize your space layout for maximum functionality</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-red-600 rounded-full mt-2"></div>
                      <div>
                        <h4 className="font-medium text-gray-900">Budget Planning</h4>
                        <p className="text-sm text-gray-600">Get realistic budget estimates for your project</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-red-600 rounded-full mt-2"></div>
                      <div>
                        <h4 className="font-medium text-gray-900">Material Suggestions</h4>
                        <p className="text-sm text-gray-600">Recommendations for best materials and finishes</p>
                      </div>
                    </div>
                    
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">Consultation Details:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Duration: 45-60 minutes</li>
                        <li>• Platform: Google Meet/Zoom</li>
                        <li>• Cost: ₹500 (Adjustable in final project)</li>
                        <li>• Follow-up: Detailed proposal via email</li>
                      </ul>
                    </div>
                  </div>
                )}

                {activeService === 'onsite' && (
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                      <div>
                        <h4 className="font-medium text-gray-900">Site Assessment</h4>
                        <p className="text-sm text-gray-600">Thorough evaluation of your space and requirements</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                      <div>
                        <h4 className="font-medium text-gray-900">Measurements</h4>
                        <p className="text-sm text-gray-600">Accurate measurements for precise planning</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                      <div>
                        <h4 className="font-medium text-gray-900">Design Consultation</h4>
                        <p className="text-sm text-gray-600">Expert advice on design possibilities and solutions</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                      <div>
                        <h4 className="font-medium text-gray-900">Budget Estimation</h4>
                        <p className="text-sm text-gray-600">Detailed cost breakdown for your project</p>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <a
                        href="tel:+919876543210"
                        className="flex items-center justify-center space-x-3 w-full bg-green-500 text-white py-4 rounded-lg hover:bg-green-600 transition-colors"
                      >
                        <Phone className="w-5 h-5" />
                        <span className="font-medium">Call Now for Instant Booking</span>
                      </a>
                    </div>
                    
                    <div className="mt-6 p-4 bg-green-50 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">Service Areas:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Kolkata</li>
                        <li>• Mumbai</li>
                        <li>• Pune</li>
                        <li>• Rachi</li>
                        <li>• Hyderabad</li>
                        <li>• Other cities on request</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;