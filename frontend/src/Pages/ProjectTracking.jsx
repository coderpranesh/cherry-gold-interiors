import React, { useState, useEffect } from 'react';
import { Search, Calendar, CheckCircle, Clock, AlertCircle, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const statusConfig = {
  completed: {
    icon: <CheckCircle className="w-5 h-5 text-green-600" />,
    color: 'bg-green-100 text-green-800',
    label: 'Completed'
  },
  current: {
    icon: <Clock className="w-5 h-5 text-orange-600" />,
    color: 'bg-orange-100 text-orange-800',
    label: 'In Progress'
  },
  upcoming: {
    icon: <AlertCircle className="w-5 h-5 text-gray-400" />,
    color: 'bg-gray-100 text-gray-600',
    label: 'Pending'
  }
};

const ProjectTracking = () => {
  const { serviceNumber: initialServiceNumber } = useParams();
  const [serviceNumber, setServiceNumber] = useState(initialServiceNumber || '');
  const [projectData, setProjectData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (initialServiceNumber) {
      handleSearch({ preventDefault: () => {} });
    }
  }, [initialServiceNumber]);

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!serviceNumber.trim()) {
      setError('Please enter a service number');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/projects/track/${serviceNumber.trim()}/`
      );
      
      if (!response.data || !response.data.stages) {
        throw new Error('Invalid project data received');
      }

      setProjectData({
        ...response.data,
        startDate: response.data.start_date,
        expectedCompletion: response.data.expected_completion,
        currentStage: response.data.current_stage,
        stages: response.data.stages.sort((a, b) => a.order - b.order),
        updates: response.data.updates?.map(update => ({
          ...update,
          images: update.images || []
        })) || []
      });
    } catch (err) {
      const errorMessage = err.response?.status === 404 
        ? 'Project not found. Please check your service number.'
        : err.message || 'Failed to fetch project data. Please try again later.';
      setError(errorMessage);
      setProjectData(null);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setServiceNumber('');
    setProjectData(null);
    setError(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="py-12 md:py-32 bg-[#FDFBD4] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
            Track Your Project
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Stay updated on your project's progress with real-time updates.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-12 max-w-2xl mx-auto">
          <form onSubmit={handleSearch} className="space-y-4 md:space-y-6">
            <div>
              <label htmlFor="serviceNumber" className="block text-sm font-medium text-gray-700 mb-2">
                Service Number
              </label>
              <div className="relative">
                <input
                  id="serviceNumber"
                  type="text"
                  value={serviceNumber}
                  onChange={(e) => setServiceNumber(e.target.value)}
                  className="w-full px-4 py-3 pl-12 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Enter your service number (e.g., CG24001234)"
                />
                <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                {serviceNumber && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600"
                    aria-label="Clear search"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
            
            <button
              type="submit"
              className="w-full bg-red-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-red-700 transition-colors disabled:bg-red-400 flex justify-center items-center"
              disabled={loading || !serviceNumber.trim()}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Searching...
                </>
              ) : 'Track Project'}
            </button>

            {error && (
              <div className="text-red-600 text-center py-2 animate-pulse">
                {error}
              </div>
            )}
          </form>
        </div>

        {projectData && (
          <div className="space-y-6 md:space-y-8 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">Project Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <div>
                  <h3 className="text-xs md:text-sm font-medium text-gray-500">Customer Name</h3>
                  <p className="text-base md:text-lg font-semibold text-gray-900">{projectData.customer_name}</p>
                </div>
                <div>
                  <h3 className="text-xs md:text-sm font-medium text-gray-500">Project Type</h3>
                  <p className="text-base md:text-lg font-semibold text-gray-900">{projectData.project_type}</p>
                </div>
                <div>
                  <h3 className="text-xs md:text-sm font-medium text-gray-500">Start Date</h3>
                  <p className="text-base md:text-lg font-semibold text-gray-900">{formatDate(projectData.startDate)}</p>
                </div>
                <div>
                  <h3 className="text-xs md:text-sm font-medium text-gray-500">Expected Completion</h3>
                  <p className="text-base md:text-lg font-semibold text-gray-900">{formatDate(projectData.expectedCompletion)}</p>
                </div>
              </div>
              
              <div className="mt-4 md:mt-6">
                <div className="flex items-center justify-between mb-1 md:mb-2">
                  <h3 className="text-xs md:text-sm font-medium text-gray-500">Progress</h3>
                  <span className="text-xs md:text-sm font-semibold text-gray-900">{projectData.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-red-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${projectData.progress}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">Project Timeline</h2>
              
              <div className="space-y-4 md:space-y-6">
                {projectData.stages.map((stage) => {
                  const config = statusConfig[stage.status] || statusConfig.upcoming;
                  return (
                    <div key={stage.id} className="flex items-start space-x-3 md:space-x-4">
                      <div className="flex-shrink-0 pt-0.5">
                        {config.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                          <h3 className="text-base md:text-lg font-semibold text-gray-900">{stage.name}</h3>
                          <span className={`px-2 py-1 md:px-3 md:py-1 rounded-full text-xs md:text-sm ${config.color}`}>
                            {config.label}
                          </span>
                        </div>
                        <p className="text-xs md:text-sm text-gray-600 mt-1">
                          <Calendar className="w-3 h-3 md:w-4 md:h-4 inline mr-1" />
                          {stage.date}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">Recent Updates</h2>
              
              {projectData.updates.length === 0 ? (
                <div className="text-center py-6 text-gray-500">
                  No updates available for this project yet.
                </div>
              ) : (
                <div className="space-y-4 md:space-y-6">
                  {projectData.updates.map((update) => (
                    <div key={update.id} className="border-l-4 border-red-500 pl-4 md:pl-6 pb-4 md:pb-6">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-1 md:mb-2">
                        <h3 className="text-base md:text-lg font-semibold text-gray-900">{update.title}</h3>
                        <span className="text-xs md:text-sm text-gray-500">{update.date}</span>
                      </div>
                      <p className="text-sm md:text-base text-gray-600 mb-3 md:mb-4">{update.description}</p>
                      
                      {update.images.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
                          {update.images.map((image, index) => (
                            <img
                              key={index}
                              src={image}
                              alt={`Update ${update.id} - ${index + 1}`}
                              className="w-full h-24 md:h-32 object-cover rounded-lg hover:scale-105 transition-transform cursor-pointer"
                              onClick={() => window.open(image, '_blank')}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="mt-12 md:mt-16 bg-gradient-to-r from-gray-900 to-red-800 rounded-2xl p-6 md:p-8 text-white text-center">
          <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">Need Help?</h3>
          <p className="text-base md:text-lg mb-4 md:mb-6 opacity-90">
            Can't find your service number or have questions about your project?
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 md:gap-4">
            <Link to="/contact" className="focus:outline-none focus:ring-2 focus:ring-white">
              <button className="w-full sm:w-auto bg-white text-gray-900 px-6 py-2 md:px-8 md:py-3 rounded-2xl font-medium hover:bg-gray-100 transition-all duration-200 transform hover:scale-105">
                Contact Support
              </button>
            </Link>
            <a
              href="https://wa.me/919433889668"
              target="_blank"
              rel="noopener noreferrer"
              className="focus:outline-none focus:ring-2 focus:ring-white"
            >
              <button className="w-full sm:w-auto bg-green-500 text-white px-6 py-2 md:px-8 md:py-3 rounded-2xl font-medium hover:bg-green-600 transition-all duration-200 transform hover:scale-105">
                WhatsApp Us
              </button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectTracking;