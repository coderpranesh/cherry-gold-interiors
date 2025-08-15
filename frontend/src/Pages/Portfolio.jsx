// src/Pages/Portfolio.jsx
import React, { useEffect, useState } from 'react';
import { Filter, X, MapPin, Clock, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';
import { fetchPortfolioItems, fetchPortfolioItemBySlug } from '../api/portfolioAPI';


const Portfolio = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);

  const categories = [
    { id: 'all', name: 'All Projects' },
    { id: 'kitchen', name: 'Kitchen' },
    { id: 'living-room', name: 'Living Room' },
    { id: 'bedroom', name: 'Bedroom' },
    { id: 'wardrobe', name: 'Wardrobe' },
    { id: 'office', name: 'Office' },
    { id: 'complete-home', name: 'Complete Home' },
  ];

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = await fetchPortfolioItems();
        console.log('Portfolio items from API:', data);  // debug line
        setProjects(data.results || []);
      } catch (error) {
        console.error('Error loading portfolio items:', error);
      }
    };
    loadProjects();
  }, []);


  const filteredProjects =
    activeFilter === 'all'
      ? projects
      : projects.filter((project) => project.category === activeFilter);

  const handleViewDetails = async (slug) => {
  try {
    const fullProject = await fetchPortfolioItemBySlug(slug);
    setSelectedProject(fullProject);
  } catch (error) {
    console.error('Error fetching full project details:', error);
  }
};


  return (
    <div className="py-32 bg-[#FDFBD4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Our Portfolio</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore our collection of stunning interior design projects. From modern kitchens to complete home transformations, see how we bring dreams to life.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveFilter(category.id)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                activeFilter === category.id
                  ? 'bg-[#f4d83e] text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-red-50 hover:text-red-500'
              }`}
            >
              <Filter className="w-4 h-4 inline mr-2" />
              {category.name}
            </button>
          ))}
        </div>

        {/* Project Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-200 group"
            >
              <div className="relative overflow-hidden">
                <img
                  src={project.main_image}
                  alt={project.title}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-200"
                />
              </div>

              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{project.title}</h3>
                <p className="text-gray-600 mb-4">{project.description}</p>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span className="flex items-center">
                    <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                    {project.location}
                  </span>
                  <span>{project.completion_time}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-red-600">{project.budget}</span>
                  <button
                    onClick={() => handleViewDetails(project.slug)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-[#f4d83e] transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {selectedProject && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-[#FDFBD4] rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-[#f1f1de] border-b border-gray-200 p-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">{selectedProject.title}</h2>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>

              <div className="p-6">
                {/* Gallery */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                  {selectedProject.images?.map((img, index) => (
                    <img
                      key={index}
                      src={`http://127.0.0.1:8000${img.image}`}
                      alt={img.caption || `Image ${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  ))}
                </div>

                {/* Info Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Project Details</h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <MapPin className="w-5 h-5 text-red-500" />
                        <span className="text-gray-700">{selectedProject.location}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Clock className="w-5 h-5 text-red-500" />
                        <span className="text-gray-700">Completed in {selectedProject.completion_time}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <DollarSign className="w-5 h-5 text-red-500" />
                        <span className="text-gray-700">{selectedProject.budget}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Detailed Description</h3>
                    <p className="text-gray-600 leading-relaxed">{selectedProject.detailed_description || 'No additional details provided.'}</p>
                  </div>
                </div>

                {/* Features & Materials */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  {selectedProject.features?.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Features</h3>
                      <ul className="space-y-2">
                        {selectedProject.features.map((feature, i) => (
                          <li key={i} className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                            <span className="text-gray-700">{feature.feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {selectedProject.materials?.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Materials Used</h3>
                      <ul className="space-y-2">
                        {selectedProject.materials.map((material, i) => (
                          <li key={i} className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-gray-700">{material.material}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Case Studies */}
                {selectedProject.case_studies?.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-4">Case Studies</h3>
                    {selectedProject.case_studies.map((cs) => (
                      <div key={cs.id} className="mb-6">
                        <h4 className="text-md font-bold">{cs.title}</h4>
                        <p className="text-sm text-gray-600">{cs.content}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="mt-8 flex flex-wrap gap-4">
                  <button
                    onClick={() => alert('Get Similar Design')}
                    className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors"
                  >
                    Get Similar Design
                  </button>
                  <button
                    onClick={() => alert('Request Quote')}
                    className="bg-[#f9d921] text-gray-700 px-6 py-3 rounded-lg hover:bg-yellow-600 transition-colors"
                  >
                    Request Quote
                  </button>
                  <Link to="/services">
                    <button className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors">
                      Book Consultation
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-gray-900 to-red-800 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Ready to Start Your Project?</h3>
            <p className="text-lg mb-6 opacity-90">
              Let's create something beautiful together. Get a free consultation and see how we can transform your space.
            </p>
            <Link to="/services">
              <button className="bg-gradient-to-br from-white to-gray text-white px-8 py-3 rounded-2xl font-medium hover:bg-yellow-600 transition-all duration-200 transform hover:scale-105">
                Get Free Consultation
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
