import React, { useState } from 'react';
import { Calculator, Home, DollarSign, Info } from 'lucide-react';
import ConsultationModal from '../Components/ConsultationModal';
import { jsPDF } from 'jspdf';

const CostEstimator = () => {
  const [formData, setFormData] = useState({
    projectType: '',
    kitchenPackage: '',
    wallPanelingPackage: '',
    falseCeilingType: '',
    interiorPackage: '',
    wardrobePackage: '',
    length: '',
    width: '',
    height: '',
    additionalFeatures: [],
    includeGST: true // GST toggle
  });

  const [estimate, setEstimate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [estimationId, setEstimationId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Helper to parse first number from rate string
  const parseRate = (rate) => {
    if (typeof rate === 'string') {
      let cleaned = rate.replace(/₹/g, '').replace(/,/g, '').trim();
      let firstPart = cleaned.split(/[-–—]/)[0].trim();
      let num = parseFloat(firstPart);
      return isNaN(num) ? 0 : num;
    }
    return rate;
  };

  // Data arrays
  const projectTypes = [
    { id: 'kitchen', name: 'Modular Kitchen', baseRate: 1650 },
    { id: 'wall-paneling', name: 'Wall Paneling', baseRate: 475 },
    { id: 'false-ceiling', name: 'False Ceiling', baseRate: 140 },
    { id: 'interior-decoration', name: 'Interior Decoration', baseRate: 1400 },
    { id: 'wardrobe', name: 'Wardrobe', baseRate: 1400 },
    { id: 'complete-home', name: 'Complete Home', baseRate: 1600 }
  ];

  const kitchenPackages = [
    { id: 'standard', name: 'Standard Package', rate: 1500, description: 'BWP Plywood + Choice of Veneer or Glossy Laminate', features: ['Smooth edge banding', 'Soft-close hinges & channels', 'Profile lights inside cabinets', '2 Years Hardware Warranty', '10 Years Service Warranty'], notIncluded: ['Magic corner', 'Stainless steel baskets', 'Tandem (charged extra)'] },
    { id: 'luxury', name: 'Luxury Package', rate: '1,800–₹2,000', description: 'BWP Plywood + Acrylic Finish (High Gloss)', features: ['Mirror-like glossy look', 'Scratch-resistant surface', 'Premium durability', 'Soft-close hardware', 'Profile lighting inside cabinets', '5 Years Hardware Warranty', '10 Years Service Warranty'], notIncluded: ['Magic corner', 'Stainless steel baskets'] }
  ];

  const wallPanelingPackages = [
    { id: 'standard', name: 'Standard Package', rate: '450-₹500', description: '25% area covered with design materials', features: ['12mm plywood base', 'Cushion panels', 'Laminates', 'UV marble sheets', 'Designer PVC louvers', 'CNC-cut designs'] },
    { id: 'premium', name: 'Premium Package', rate: '550–₹600', description: '50% area covered with design materials', features: ['12mm plywood base', 'Premium design materials', 'More design flexibility', 'Enhanced finishes', 'Custom CNC work'] }
  ];

  const falseCeilingTypes = [
    { id: 'gypsum', name: 'Gypsum False Ceiling', rate: 100, description: 'Sleek, modern look with clean lines', features: ['Best for standard rooms', 'Minimalistic designs', 'Paint & Putty: ₹30/sq.ft extra'] },
    { id: 'pop', name: 'POP False Ceiling', rate: 120, description: 'Smooth surface, ideal for curves & creative shapes', features: ['Best for living rooms', 'Artistic ceiling concepts', 'Paint & Putty: ₹30/sq.ft extra'] },
    { id: 'pvc', name: 'PVC False Ceiling', rate: 220, description: 'Available in textures & prints - no painting needed', features: ['Water-resistant', 'Termite-proof', 'Low-maintenance', 'Lighting charges based on custom design'] }
  ];

  const interiorPackages = [
    { id: 'standard', name: 'Standard Plan', rate: 1250, description: '0.8mm/1mm Glossy Laminate with Basic PVC Edge Banding', features: ['7 Years Warranty', 'Moisture & scratch-resistant', 'Budget-friendly', 'Simple modular finish', 'Low-maintenance'], bestFor: 'Budget-conscious projects that need reliable, neat modular work' },
    { id: 'premium', name: 'Premium Plan', rate: 1450, description: 'High Gloss Laminate with Soft PVC Edge Banding', features: ['10 Years Warranty', 'Sleek gloss & modern finish', 'Soft edge banding', 'Enhanced elegance', 'Premium brand quality'], bestFor: 'Stylish, mid-range home interiors with perfect price-aesthetics balance' },
    { id: 'royal', name: 'Royal Plan', rate: 1800, description: 'Acrylic High Gloss Laminate with Seamless Finish', features: ['15 Years Warranty', 'Mirror-like shine', 'Premium appearance', 'Scratch-resistant', 'Seamless edge finish'], bestFor: 'Ultra-premium interiors with maximum durability and luxury appeal' }
  ];

  const wardrobePackages = [
    { id: 'standard', name: 'Standard Package', rate: '1200 - ₹1300', description: 'Premium Plywood + Slightly Glossy Laminate', features: ['7 Years Service Warranty', '1 Year Hardware Warranty', 'Durable laminate finish', 'Customizable design'], profileLight: false },
    { id: 'premium', name: 'Premium Package', rate: '1400- ₹1500', description: 'BWP Termite-Proof Plywood + High Gloss Laminate/Veneer', features: ['10 Years Service Warranty', '2 Years Hardware Warranty', 'Superior water & termite resistance', 'Ultra-glossy premium look', 'Profile light inside wardrobe included'], profileLight: true },
    { id: 'luxury', name: 'Luxury Package', rate: '1,700–₹1,900', description: 'BWP Plywood + Acrylic Laminate (Scratch-Resistant)', features: ['15 Years Service Warranty', '3 Years Hardware Warranty', 'Ultra-premium mirror gloss finish', 'Maximum durability', 'Scratch-resistant', 'Profile light inside wardrobe included'], profileLight: true }
  ];

  const additionalFeatures = [
    { id: 'soft-close', name: 'Soft Close Hinges', cost: 15000 },
    { id: 'led-lighting', name: 'LED Lighting', cost: 8000 },
    { id: 'pull-out-drawers', name: 'Pull-out Drawers', cost: 12000 },
    { id: 'mirror-work', name: 'Mirror Work', cost: 10000 },
    { id: 'glass-shutters', name: 'Glass Shutters', cost: 18000 },
    { id: 'magic-corner', name: 'Magic Corner (Kitchen)', cost: 25000 },
    { id: 'steel-baskets', name: 'Stainless Steel Baskets', cost: 15000 }
  ];

  // Function to get CSRF token
  const getCSRFToken = () => {
    const cookieValue = document.cookie
      .split('; ')
      .find(row => row.startsWith('csrftoken='))
      ?.split('=')[1];
    return cookieValue || '';
  };

  // Function to save estimation to Django backend
  const saveEstimationToBackend = async (estimationData) => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/quote/api/estimations/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCSRFToken(),
        },
        body: JSON.stringify({
          project_type: formData.projectType,
          kitchen_package: formData.kitchenPackage,
          wall_paneling_package: formData.wallPanelingPackage,
          false_ceiling_type: formData.falseCeilingType,
          interior_package: formData.interiorPackage,
          wardrobe_package: formData.wardrobePackage,
          length: parseFloat(formData.length),
          width: parseFloat(formData.width),
          height: parseFloat(formData.height || 0),
          contact_phone: formData.contact_phone,
          area: estimationData.area,
          base_price: estimationData.basePrice,
          features_total: estimationData.featuresTotal,
          subtotal: estimationData.subtotal,
          gst: estimationData.gst,
          final_cost: estimationData.finalCost,
          include_gst: formData.includeGST,
          additional_features: formData.additionalFeatures,
          package_description: estimationData.packageDescription,
          package_features: estimationData.packageFeatures,
        })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Estimation saved with ID:', data.id);
        setEstimationId(data.id);
        setIsSaving(false);
        return data.id;
      } else {
        console.error('Failed to save estimation');
        setIsSaving(false);
        return null;
      }
    } catch (error) {
      console.error('Error saving estimation:', error);
      setIsSaving(false);
      return null;
    }
  };

  // Handlers
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFeatureChange = (featureId, checked) => {
    setFormData({
      ...formData,
      additionalFeatures: checked
        ? [...formData.additionalFeatures, featureId]
        : formData.additionalFeatures.filter(f => f !== featureId)
    });
  };

  const calculateEstimate = async (e) => {
    e.preventDefault();
    const projectType = projectTypes.find(p => p.id === formData.projectType);
    if (!projectType) return;

    const area = parseFloat(formData.length) * parseFloat(formData.width);
    let basePrice = 0;
    let selectedPackage = '';
    let packageDescription = '';
    let packageFeatures = [];

    const getRate = (pkg) => parseRate(pkg.rate);

    if (formData.projectType === 'kitchen') {
      const pkg = kitchenPackages.find(p => p.id === formData.kitchenPackage);
      if (!pkg) return;
      basePrice = area * getRate(pkg);
      selectedPackage = pkg.name;
      packageDescription = pkg.description;
      packageFeatures = pkg.features;
    } else if (formData.projectType === 'wall-paneling') {
      const pkg = wallPanelingPackages.find(p => p.id === formData.wallPanelingPackage);
      if (!pkg) return;
      basePrice = area * getRate(pkg);
      selectedPackage = pkg.name;
      packageDescription = pkg.description;
      packageFeatures = pkg.features;
    } else if (formData.projectType === 'false-ceiling') {
      const pkg = falseCeilingTypes.find(t => t.id === formData.falseCeilingType);
      if (!pkg) return;
      basePrice = area * getRate(pkg);
      selectedPackage = pkg.name;
      packageDescription = pkg.description;
      packageFeatures = pkg.features;
    } else if (formData.projectType === 'interior-decoration') {
      const pkg = interiorPackages.find(p => p.id === formData.interiorPackage);
      if (!pkg) return;
      basePrice = area * getRate(pkg);
      selectedPackage = pkg.name;
      packageDescription = pkg.description;
      packageFeatures = pkg.features;
    } else if (formData.projectType === 'wardrobe') {
      const pkg = wardrobePackages.find(p => p.id === formData.wardrobePackage);
      if (!pkg) return;
      basePrice = area * getRate(pkg);
      selectedPackage = pkg.name;
      packageDescription = pkg.description;
      packageFeatures = pkg.features;
    } else {
      basePrice = area * parseRate(projectType.baseRate);
      selectedPackage = 'Standard Package';
      packageDescription = 'Basic package with standard features';
    }

    const featuresTotal = formData.additionalFeatures.reduce((total, featureId) => {
      const feature = additionalFeatures.find(f => f.id === featureId);
      return total + (feature ? feature.cost : 0);
    }, 0);

    const subtotal = basePrice + featuresTotal;
    let gst = 0, finalCost = subtotal;
    if (formData.includeGST) {
      gst = subtotal * 0.18;
      finalCost += gst;
    }

    const newEstimate = {
      area,
      basePrice,
      selectedPackage,
      packageDescription,
      packageFeatures,
      featuresTotal,
      subtotal,
      gst,
      finalCost,
      projectType: projectType.name,
    };

    setEstimate(newEstimate);
    
    // Save to backend
    await saveEstimationToBackend(newEstimate);
  };

  const generatePDF = () => {
    if (!estimate) return;

    const doc = new jsPDF();

    // Title
    doc.setFontSize(20);
    doc.setTextColor(40);
    doc.text('Project Cost Estimate', 105, 20, { align: 'center' });

    // Project Details
    doc.setFontSize(12);
    doc.text('Project Details', 14, 35);
    doc.line(14, 37, 60, 37);
    
    doc.text(`Type: ${estimate.projectType}`, 14, 45);
    doc.text(`Package: ${estimate.selectedPackage}`, 14, 55);
    doc.text(`Area: ${estimate.area} sq ft`, 14, 65);
    doc.text(`Description: ${estimate.packageDescription}`, 14, 75);

    // Cost Breakdown
    doc.text('Cost Breakdown', 105, 35);
    doc.line(105, 37, 150, 37);
    
    let yPosition = 45;
    doc.text(`Base Cost: ₹${estimate.basePrice.toLocaleString()}`, 105, yPosition);
    yPosition += 10;
    
    if (estimate.featuresTotal > 0) {
      doc.text(`Additional Features: ₹${estimate.featuresTotal.toLocaleString()}`, 105, yPosition);
      yPosition += 10;
    }
    
    doc.text(`Subtotal: ₹${estimate.subtotal.toLocaleString()}`, 105, yPosition);
    yPosition += 10;
    doc.text(`GST (18%): ₹${estimate.gst.toLocaleString()}`, 105, yPosition);
    yPosition += 15;
    
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text(`Total Cost: ₹${estimate.finalCost.toLocaleString()}`, 105, yPosition);
    doc.setFont(undefined, 'normal');

    // Features List
    if (estimate.packageFeatures && estimate.packageFeatures.length > 0) {
      yPosition += 20;
      doc.setFontSize(12);
      doc.text('Package Features:', 14, yPosition);
      yPosition += 10;
      
      estimate.packageFeatures.forEach((feature, index) => {
        if (yPosition > 250) {
          doc.addPage();
          yPosition = 20;
        }
        doc.text(`• ${feature}`, 20, yPosition);
        yPosition += 7;
      });
    }

    // Footer
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text('Note: This is an approximate estimate. Final cost may vary based on site conditions.', 105, 280, { align: 'center' });
    doc.text('Thank you for using our cost estimator!', 105, 285, { align: 'center' });

    // Save the PDF
    doc.save(`Project_Estimate_${new Date().toISOString().slice(0,10)}.pdf`);
  };

  return (
    <div className="py-32 bg-[#FDFBD4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Cost Estimator
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get an instant estimate for your interior design project. Enter your space dimensions and preferences to calculate approximate costs.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Estimation Form */}
          <div className="bg-[#f1f1de] rounded-2xl shadow-lg p-8">
            <div className="flex items-center mb-6">
              <Calculator className="w-6 h-6 text-red-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Calculate Your Project Cost</h2>
            </div>

            <form onSubmit={calculateEstimate} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Type *
                </label>
                <select
                  name="projectType"
                  value={formData.projectType}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="">Select project type</option>
                  {projectTypes.map(type => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Kitchen Package Selection */}
              {formData.projectType === 'kitchen' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kitchen Package *
                  </label>
                  <div className="space-y-3">
                    {kitchenPackages.map(pkg => (
                      <label key={pkg.id} className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg hover:border-red-300 cursor-pointer">
                        <input
                          type="radio"
                          name="kitchenPackage"
                          value={pkg.id}
                          checked={formData.kitchenPackage === pkg.id}
                          onChange={handleInputChange}
                          className="mt-1 w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-gray-900">{pkg.name}</h4>
                            <span className="text-red-600 font-semibold">₹{pkg.rate}/sq ft</span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{pkg.description}</p>
                          <div className="mt-2">
                            <p className="text-xs text-gray-500 font-medium">Features:</p>
                            <ul className="text-xs text-gray-500 mt-1 grid grid-cols-1 gap-1">
                              {pkg.features.slice(0, 3).map((feature, index) => (
                                <li key={index}>• {feature}</li>
                              ))}
                            </ul>
                            {pkg.notIncluded && (
                              <p className="text-xs text-red-500 mt-1">
                                <strong>Add-ons:</strong> {pkg.notIncluded.join(', ')}
                              </p>
                            )}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                  <div className="mt-3 p-3 bg-yellow-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Note:</strong> Price may increase after visiting your home for correct estimation.
                    </p>
                  </div>
                </div>
              )}

              {/* Wall Paneling Package Selection */}
              {formData.projectType === 'wall-paneling' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Wall Paneling Package *
                  </label>
                  <div className="space-y-3">
                    {wallPanelingPackages.map(pkg => (
                      <label key={pkg.id} className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg hover:border-red-300 cursor-pointer">
                        <input
                          type="radio"
                          name="wallPanelingPackage"
                          value={pkg.id}
                          checked={formData.wallPanelingPackage === pkg.id}
                          onChange={handleInputChange}
                          className="mt-1 w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-gray-900">{pkg.name}</h4>
                            <span className="text-red-600 font-semibold">₹{pkg.rate}/sq ft</span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{pkg.description}</p>
                          <div className="mt-2">
                            <p className="text-xs text-gray-500 font-medium">Includes:</p>
                            <ul className="text-xs text-gray-500 mt-1 grid grid-cols-2 gap-1">
                              {pkg.features.slice(0, 4).map((feature, index) => (
                                <li key={index}>• {feature}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                  <div className="mt-3 p-3 bg-yellow-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Note:</strong> Lighting is not included in the above rates but can be added separately.
                    </p>
                  </div>
                </div>
              )}

              {/* False Ceiling Type Selection */}
              {formData.projectType === 'false-ceiling' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    False Ceiling Type *
                  </label>
                  <div className="space-y-3">
                    {falseCeilingTypes.map(type => (
                      <label key={type.id} className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg hover:border-orange-300 cursor-pointer">
                        <input
                          type="radio"
                          name="falseCeilingType"
                          value={type.id}
                          checked={formData.falseCeilingType === type.id}
                          onChange={handleInputChange}
                          className="mt-1 w-4 h-4 text-red-600 border-gray-300 focus:ring-orange-red"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-gray-900">{type.name}</h4>
                            <span className="text-red-600 font-semibold">₹{type.rate}/sq ft</span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{type.description}</p>
                          <div className="mt-2">
                            <ul className="text-xs text-gray-500 space-y-1">
                              {type.features.map((feature, index) => (
                                <li key={index}>• {feature}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Note:</strong> Price will be charged according to design complexity. Basic ceiling rates shown above.
                    </p>
                  </div>
                </div>
              )}

              {/* Interior Decoration Package Selection */}
              {formData.projectType === 'interior-decoration' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Interior Package *
                  </label>
                  <div className="space-y-3">
                    {interiorPackages.map(pkg => (
                      <label key={pkg.id} className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg hover:border-orange-300 cursor-pointer">
                        <input
                          type="radio"
                          name="interiorPackage"
                          value={pkg.id}
                          checked={formData.interiorPackage === pkg.id}
                          onChange={handleInputChange}
                          className="mt-1 w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-gray-900">{pkg.name}</h4>
                            <span className="text-red-600 font-semibold">₹{pkg.rate}/sq ft</span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{pkg.description}</p>
                          <div className="mt-2">
                            <ul className="text-xs text-gray-500 space-y-1">
                              {pkg.features.slice(0, 3).map((feature, index) => (
                                <li key={index}>• {feature}</li>
                              ))}
                            </ul>
                            <p className="text-xs text-blue-600 mt-2 font-medium">
                              Best For: {pkg.bestFor}
                            </p>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Wardrobe Package Selection */}
              {formData.projectType === 'wardrobe' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Wardrobe Package *
                  </label>
                  <div className="space-y-3">
                    {wardrobePackages.map(pkg => (
                      <label key={pkg.id} className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg hover:border-orange-300 cursor-pointer">
                        <input
                          type="radio"
                          name="wardrobePackage"
                          value={pkg.id}
                          checked={formData.wardrobePackage === pkg.id}
                          onChange={handleInputChange}
                          className="mt-1 w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-gray-900">{pkg.name}</h4>
                            <span className="text-red-600 font-semibold">₹{pkg.rate}/sq ft</span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{pkg.description}</p>
                          <div className="mt-2">
                            <ul className="text-xs text-gray-500 space-y-1">
                              {pkg.features.slice(0, 3).map((feature, index) => (
                                <li key={index}>• {feature}</li>
                              ))}
                            </ul>
                            {pkg.profileLight && (
                              <p className="text-xs text-green-600 mt-1 font-medium">
                                ✅ Profile light inside wardrobe included
                              </p>
                            )}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Length (ft) *
                  </label>
                  <input
                    type="number"
                    name="length"
                    value={formData.length}
                    onChange={handleInputChange}
                    required
                    step="0.1"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="10"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Width (ft) *
                  </label>
                  <input
                    type="number"
                    name="width"
                    value={formData.width}
                    onChange={handleInputChange}
                    required
                    step="0.1"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="12"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="number"
                  name="contact_phone"
                  value={formData.contact_phone}
                  onChange={handleInputChange}
                  step="0.1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="10"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Features
                </label>
                <div className="space-y-2">
                  {additionalFeatures.map(feature => (
                    <label key={feature.id} className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={formData.additionalFeatures.includes(feature.id)}
                        onChange={(e) => handleFeatureChange(feature.id, e.target.checked)}
                        className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                      />
                      <span className="text-sm text-gray-700">{feature.name}</span>
                      <span className="text-sm text-gray-500">(+₹{feature.cost.toLocaleString()})</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* GST Checkbox */}
              <div>
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    name="includeGST"
                    checked={formData.includeGST}
                    onChange={(e) => setFormData({ ...formData, includeGST: e.target.checked })}
                    className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                  />
                  <span className="text-sm text-gray-700">Include GST (18%)</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isSaving}
                className="w-full bg-red-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? 'Saving Estimate...' : 'Calculate Estimate'}
              </button>
            </form>
          </div>

          {/* Estimate Results */}
          <div className="bg-[#f1f1de] rounded-2xl shadow-lg p-8">
            <div className="flex items-center mb-6">
              <DollarSign className="w-6 h-6 text-green-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Your Estimate</h2>
            </div>

            {estimate ? (
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Project Details</h3>
                  <div className="space-y-1 text-sm">
                    <p><span className="text-gray-500">Type:</span> {estimate.projectType}</p>
                    <p><span className="text-gray-500">Package:</span> {estimate.selectedPackage}</p>
                    <p><span className="text-gray-500">Area:</span> {estimate.area} sq ft</p>
                    <p><span className="text-gray-500">Description:</span> {estimate.packageDescription}</p>
                  </div>
                </div>

                {estimate.packageFeatures && estimate.packageFeatures.length > 0 && (
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Package Features:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {estimate.packageFeatures.map((feature, index) => (
                        <li key={index}>• {feature}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Base Cost</span>
                    <span className="font-semibold">₹{estimate.basePrice.toLocaleString()}</span>
                  </div>

                  {estimate.featuresTotal > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Additional Features</span>
                      <span className="font-semibold">₹{estimate.featuresTotal.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Subtotal</span>
                    <span className="font-semibold">₹{estimate.subtotal.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">GST (18%)</span>
                    <span className="font-semibold">₹{estimate.gst.toLocaleString()}</span>
                  </div>

                  {estimate.gst === 0 && (
                    <p className="text-sm text-gray-500 mt-2">GST (18%) not included as per your selection.</p>
                  )}

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-gray-900">Total Cost</span>
                      <span className="text-2xl font-bold text-red-600">₹{estimate.finalCost.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div className="text-sm text-blue-800">
                      <p className="font-medium mb-1">Important Notes:</p>
                      <ul className="space-y-1 text-xs">
                        <li>• This is an approximate estimate</li>
                        <li>• Final cost may vary based on site conditions</li>
                        <li>• Free consultation available for detailed quote</li>
                        <li>• Includes design, material, and installation</li>
                        {estimationId && (
                          <li className="font-bold mt-2">• Your estimate has been saved and will be available for 7 days</li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button 
                    onClick={generatePDF}
                    className="flex-1 bg-red-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-600 transition-colors"
                  >
                    Download PDF Quote
                  </button>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                  >
                    Book Consultation
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Home className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">
                  Fill out the form to get your instant estimate
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Example Calculations */}
        <div className="mt-16 bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Example Calculations</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Kitchen Example */}
            <div className="bg-orange-50 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-4">Modular Kitchen - 10ft x 12ft</h4>
              <div className="text-sm space-y-2">
                <p><span className="font-medium">Area:</span> 10 × 12 = 120 sq ft</p>
                <p><span className="font-medium">Standard Package:</span> ₹1,500 per sq ft</p>
                <p><span className="font-medium">Cost:</span> 120 × ₹1,500 = ₹1,80,000</p>
                <p><span className="font-medium">GST (18%):</span> ₹32,400</p>
                <p className="font-bold text-red-600 pt-2 border-t"><span className="font-medium">Total:</span> ₹2,12,400</p>
              </div>
            </div>

            {/* Wall Paneling Example */}
            <div className="bg-blue-50 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-4">Wall Paneling - 8ft x 10ft</h4>
              <div className="text-sm space-y-2">
                <p><span className="font-medium">Area:</span> 8 × 10 = 80 sq ft</p>
                <p><span className="font-medium">Standard Package:</span> ₹475 per sq ft</p>
                <p><span className="font-medium">Cost:</span> 80 × ₹475 = ₹38,000</p>
                <p><span className="font-medium">GST (18%):</span> ₹6,840</p>
                <p className="font-bold text-blue-600 pt-2 border-t"><span className="font-medium">Total:</span> ₹44,840</p>
              </div>
            </div>

            {/* False Ceiling Example */}
            <div className="bg-green-50 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-4">POP False Ceiling - 12ft x 14ft</h4>
              <div className="text-sm space-y-2">
                <p><span className="font-medium">Area:</span> 12 × 14 = 168 sq ft</p>
                <p><span className="font-medium">POP Ceiling:</span> ₹120 per sq ft</p>
                <p><span className="font-medium">Cost:</span> 168 × ₹120 = ₹20,160</p>
                <p><span className="font-medium">Paint & Putty:</span> 168 × ₹30 = ₹5,040</p>
                <p><span className="font-medium">Subtotal:</span> ₹25,200</p>
                <p><span className="font-medium">GST (18%):</span> ₹4,536</p>
                <p className="font-bold text-green-600 pt-2 border-t"><span className="font-medium">Total:</span> ₹29,736</p>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-100 rounded-lg">
            <h5 className="font-medium text-gray-900 mb-2">Important Notes:</h5>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Wall Paneling prices do not include lighting (can be added separately)</li>
              <li>• False Ceiling prices may vary based on design complexity</li>
              <li>• Kitchen prices include standard accessories and hardware</li>
              <li>• Profile lights included in Premium & Luxury wardrobe packages</li>
              <li>• All estimates include material, labor, and installation</li>
              <li>• All estimates are automatically saved for 7 days for your reference</li>
            </ul>
          </div>
        </div>
      </div>

      <ConsultationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Get a free design consultation"
        estimationId={estimationId}
      />
    </div>
  );
};

export default CostEstimator;