import React, { useState } from 'react';
import { Calculator, Home, DollarSign, Info, Printer, Download, Edit3, Check, X, FileText, Sparkles } from 'lucide-react';
import ConsultationModal from '../Components/ConsultationModal';

const CostEstimator = () => {
  const [formData, setFormData] = useState({
    projectType: 'kitchen',
    kitchenPackage: 'standard',
    wallPanelingPackage: '',
    falseCeilingType: '',
    interiorPackage: '',
    wardrobePackage: '',
    length: '10',
    width: '12',
    height: '9',
    additionalFeatures: [],
    includeGST: true
  });

  const [clientDetails, setClientDetails] = useState({
    clientName: 'Mr Narayan Jana',
    projectName: 'Bedroom Interior Work',
    location: 'Noapara 700090',
    quotationNo: 'CGI/2026/502',
    date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }),
    validity: '15 Days',
    warrantyYears: '20',
    workingDays: '10–15'
  });

  const [isEditingClient, setIsEditingClient] = useState(false);
  const [estimate, setEstimate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isQuotationModalOpen, setIsQuotationModalOpen] = useState(false);
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
    { id: 'kitchen', name: 'Modular Kitchen', baseRate: 1650, defaultWork: 'Modular Kitchen Interior Work' },
    { id: 'wall-paneling', name: 'Wall Paneling', baseRate: 475, defaultWork: 'Wall Paneling & Decor Work' },
    { id: 'false-ceiling', name: 'False Ceiling', baseRate: 140, defaultWork: 'False Ceiling & Lighting Work' },
    { id: 'interior-decoration', name: 'Interior Decoration', baseRate: 1400, defaultWork: 'Complete Home Interior Work' },
    { id: 'wardrobe', name: 'Wardrobe', baseRate: 1400, defaultWork: 'Master Bedroom Wardrobe Work' },
    { id: 'complete-home', name: 'Complete Home', baseRate: 1600, defaultWork: 'Luxury Villa / Apartment Interior Work' }
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

  const getCSRFToken = () => {
    const cookieValue = document.cookie
      .split('; ')
      .find(row => row.startsWith('csrftoken='))
      ?.split('=')[1];
    return cookieValue || '';
  };

  const saveEstimationToBackend = async (estimationData) => {
    setIsSaving(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/quote/api/estimations/', {
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
        setEstimationId(data.id);
        setIsSaving(false);
        return data.id;
      } else {
        setIsSaving(false);
        return null;
      }
    } catch (error) {
      setIsSaving(false);
      return null;
    }
  };

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
      const pkg = kitchenPackages.find(p => p.id === formData.kitchenPackage) || kitchenPackages[0];
      basePrice = area * getRate(pkg);
      selectedPackage = pkg.name;
      packageDescription = pkg.description;
      packageFeatures = pkg.features;
    } else if (formData.projectType === 'wall-paneling') {
      const pkg = wallPanelingPackages.find(p => p.id === formData.wallPanelingPackage) || wallPanelingPackages[0];
      basePrice = area * getRate(pkg);
      selectedPackage = pkg.name;
      packageDescription = pkg.description;
      packageFeatures = pkg.features;
    } else if (formData.projectType === 'false-ceiling') {
      const pkg = falseCeilingTypes.find(t => t.id === formData.falseCeilingType) || falseCeilingTypes[0];
      basePrice = area * getRate(pkg);
      selectedPackage = pkg.name;
      packageDescription = pkg.description;
      packageFeatures = pkg.features;
    } else if (formData.projectType === 'interior-decoration') {
      const pkg = interiorPackages.find(p => p.id === formData.interiorPackage) || interiorPackages[0];
      basePrice = area * getRate(pkg);
      selectedPackage = pkg.name;
      packageDescription = pkg.description;
      packageFeatures = pkg.features;
    } else if (formData.projectType === 'wardrobe') {
      const pkg = wardrobePackages.find(p => p.id === formData.wardrobePackage) || wardrobePackages[0];
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
    
    // Auto-update project work title in clientDetails if not edited
    setClientDetails(prev => ({
      ...prev,
      projectName: `${projectType.name} Interior Work`
    }));

    await saveEstimationToBackend(newEstimate);
  };

  // Scope of Work items based on active project type & package
  const getScopeOfWorkItems = () => {
    if (formData.projectType === 'false-ceiling') {
      return [
        { work: 'Tray Ceiling', desc: 'Tray ceiling design covering all four sides of the room' },
        { work: 'Master Ceiling', desc: 'Basket-pattern ceiling with POP border design around the sides, as discussed' },
        { work: 'Decorative Work', desc: 'Additional POP garnish/decorative work as per approved design' },
        { work: 'Finishing', desc: 'Complete putty and primer work for the false ceiling' }
      ];
    } else if (formData.projectType === 'kitchen') {
      return [
        { work: 'Base & Wall Cabinets', desc: `Heavy duty BWP Marine Plywood carcass with ${estimate?.selectedPackage || 'Standard'} finish` },
        { work: 'Shutters & Drawers', desc: 'Soft-close hydraulic hinges, precision edge-banded shutters with premium laminates' },
        { work: 'Profile Lighting', desc: 'Concealed LED profile light channels inside cabinets and under-counter work area' },
        { work: 'Finishing & Alignment', desc: 'Precision laser leveling, seamless alignment, putty & protective seal coating' }
      ];
    } else if (formData.projectType === 'wardrobe') {
      return [
        { work: 'Wardrobe Carcass', desc: 'BWP Termite-proof plywood structure with full internal laminate balance' },
        { work: 'Front Shutters', desc: `Designer ${estimate?.selectedPackage || 'High Gloss'} shutters with heavy-duty soft-close slide channels` },
        { work: 'Internal Organizers', desc: 'Dedicated hanging rods, pull-out trays, concealed drawer locks and accessory slots' },
        { work: 'Finishing', desc: 'Full edge-banding with zero glue marks and protective scratch-resistant coating' }
      ];
    } else {
      return [
        { work: 'Primary Layout Structure', desc: `Precision installation according to the ${estimate?.selectedPackage || 'Luxury'} design concept` },
        { work: 'Core Material Paneling', desc: 'Termite and borer resistant calibrated engineered panels with premium surface finish' },
        { work: 'Decorative Details', desc: 'Custom CNC border detailing, accent garnish work, and architectural symmetry' },
        { work: 'Surface Finishing', desc: 'Complete high-adhesion putty base, primer coating, and protective sealing' }
      ];
    }
  };

  const handleOpenDownloadModal = () => {
    setIsQuotationModalOpen(true);
  };

  const handlePrint = () => {
    // Remove any existing print iframe
    const existing = document.getElementById('quotation-print-frame');
    if (existing) {
      existing.remove();
    }

    const iframe = document.createElement('iframe');
    iframe.id = 'quotation-print-frame';
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0px';
    iframe.style.height = '0px';
    iframe.style.border = '0';
    iframe.style.visibility = 'hidden';

    document.body.appendChild(iframe);

    const doc = iframe.contentWindow.document;

    const scopeRows = getScopeOfWorkItems().map((item, idx) => `
      <tr style="border-bottom: 1px solid #f1d5d5; background: ${idx % 2 === 0 ? '#ffffff' : '#fdf8f8'};">
        <td style="padding: 7px 10px; font-weight: 600; color: #111; font-style: italic; vertical-align: top; width: 32%;">${item.work}</td>
        <td style="padding: 7px 10px; color: #333; font-style: italic; vertical-align: top; width: 68%;">${item.desc}</td>
      </tr>
    `).join('');

    const origin = window.location.origin;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Quotation_${clientDetails.quotationNo || 'CGI_2026_502'}</title>
          <style>
            @page {
              size: A4 portrait;
              margin: 10mm 14mm;
            }
            * {
              box-sizing: border-box;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            html, body {
              margin: 0;
              padding: 0;
              background: #fff;
              color: #111;
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            }
            .a4-page {
              width: 100%;
              min-height: 270mm;
              max-height: 270mm;
              box-sizing: border-box;
              padding: 0;
              margin: 0;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              page-break-after: always;
              break-after: page;
              page-break-inside: avoid;
              break-inside: avoid;
            }
            .a4-page:last-child {
              page-break-after: avoid;
              break-after: avoid;
            }
            table {
              width: 100%;
              border-collapse: collapse;
            }
          </style>
        </head>
        <body>
          <!-- PAGE 1 -->
          <div class="a4-page">
            <div>
              <!-- Header -->
              <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 6px;">
                <div style="width: 75px; flex-shrink: 0;">
                  <img src="${origin}/images/logo.png" style="width: 100%; height: auto;" />
                </div>
                <div style="text-align: center; flex: 1; padding-right: 20px;">
                  <h1 style="color: #c0142b; font-family: 'Times New Roman', serif; font-size: 24px; font-weight: 800; letter-spacing: 0.8px; margin: 0; line-height: 1.15;">
                    CHERRY GOLD INTERIORS PVT. LTD.
                  </h1>
                  <p style="font-weight: 800; font-size: 11px; margin: 3px 0 2px; color: #111; letter-spacing: 0.5px;">
                    U74102WB2025PTC279494
                  </p>
                  <p style="font-size: 10.5px; margin: 2px 0; color: #333; line-height: 1.3;">
                    75 Prafulla Nagar Colony, Belgharia, North 24 Parganas, West Bengal - <span style="color: #2563eb; font-weight: 700;">700056</span>
                  </p>
                  <p style="font-size: 10.5px; font-weight: 700; margin: 2px 0; color: #111;">
                    9433889668 | 7687914255
                  </p>
                  <p style="font-size: 10px; margin: 2px 0; color: #2563eb;">
                    <span style="text-decoration: underline;">info@cherrygoldinteriors.com</span> | <span style="text-decoration: underline;">www.cherrygoldinteriors.com</span>
                  </p>
                </div>
              </div>

              <div style="height: 1.5px; background: #c0142b; margin: 8px 0 16px;"></div>

              <!-- Project & Quotation Metadata Box -->
              <div style="display: flex; justify-content: space-between; align-items: flex-start; font-size: 12px; margin-bottom: 14px; line-height: 1.5;">
                <div>
                  <p style="margin: 1px 0;">
                    <span style="color: #444;">Project:</span> <strong>${clientDetails.projectName || `${estimate?.projectType || 'Interior'} Work`}</strong>
                  </p>
                </div>
                <div style="text-align: right;">
                  <p style="margin: 1px 0;"><span style="color: #444;">Quotation No:</span> <strong>${clientDetails.quotationNo || 'CGI/2026/502'}</strong></p>
                  <p style="margin: 1px 0;"><span style="color: #444;">Date:</span> <strong>${clientDetails.date}</strong></p>
                  <p style="margin: 1px 0;"><span style="color: #444;">Validity:</span> ${clientDetails.validity || '15 Days'}</p>
                </div>
              </div>

              <h2 style="text-align: center; color: #c0142b; font-family: 'Times New Roman', serif; text-decoration: underline; font-size: 16px; font-weight: 700; margin: 16px 0 14px;">
                Luxury Design Proposal
              </h2>

              <div style="border-left: 2px solid #c0142b; padding-left: 14px; margin-left: 2px;">
                <!-- DESIGN CONCEPT -->
                <div style="margin-bottom: 16px;">
                  <h3 style="color: #c0142b; font-size: 11px; font-weight: 800; text-transform: uppercase; margin: 0 0 5px; display: flex; align-items: center; gap: 6px;">
                    <span style="color: #eab308; font-size: 12px;">✦</span> DESIGN CONCEPT
                  </h3>
                  <p style="font-size: 10.5px; font-style: italic; color: #222; line-height: 1.6; margin: 0; text-align: justify;">
                    A premium ${estimate?.selectedPackage || 'Interior Design'} created to give the ${estimate?.projectType || 'master bedroom'} a refined and elegant appearance. The concept features a curated layout covering ${estimate?.area || '120'} sq.ft, complemented by high-durability fittings and an intricate border detail around the sides, as discussed. Additional garnish work is incorporated to enhance the overall depth, symmetry, and visual appeal.
                  </p>
                </div>

                <!-- SCOPE OF WORK -->
                <div style="margin-bottom: 16px;">
                  <h3 style="color: #c0142b; font-size: 11px; font-weight: 800; text-transform: uppercase; margin: 0 0 8px; display: flex; align-items: center; gap: 6px;">
                    <span style="color: #eab308; font-size: 12px;">✦</span> SCOPE OF WORK
                  </h3>
                  <div style="border-radius: 2px; overflow: hidden; border: 1px solid #c0142b;">
                    <table style="font-size: 10.5px;">
                      <thead>
                        <tr style="background: #b91c1c; color: #ffffff;">
                          <th style="padding: 6px 10px; text-align: left; font-weight: bold; width: 32%; font-style: italic;">Work</th>
                          <th style="padding: 6px 10px; text-align: left; font-weight: bold; width: 68%; font-style: italic;">Description</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${scopeRows}
                      </tbody>
                    </table>
                  </div>
                </div>

                <!-- NOT INCLUDED -->
                <div style="margin-bottom: 10px;">
                  <h3 style="color: #c0142b; font-size: 11px; font-weight: 800; text-transform: uppercase; margin: 0 0 6px; display: flex; align-items: center; gap: 6px;">
                    <span style="color: #eab308; font-size: 12px;">✦</span> NOT INCLUDED
                  </h3>
                  <ul style="margin: 0; padding-left: 4px; list-style: none; font-size: 10px; font-style: italic; color: #333; line-height: 1.65;">
                    <li>• Electrical wiring, electrical points, fixtures and related electrical work.</li>
                    <li>• Wooden garnish or any wooden work beyond agreed scope.</li>
                    <li>• Final colour paint/painting work is not included.</li>
                    <li>• Any additional work or design changes beyond the agreed scope will be charged separately.</li>
                  </ul>
                </div>
              </div>
            </div>

            <div style="text-align: right; font-size: 10px; color: #888; padding-top: 10px;">
              Page 1 of 2
            </div>
          </div>

          <!-- PAGE 2 -->
          <div class="a4-page">
            <div>
              <div style="border-left: 2px solid #c0142b; padding-left: 14px; margin-left: 2px; padding-top: 10px;">
                <!-- WARRANTY -->
                <div style="margin-bottom: 16px;">
                  <h3 style="color: #c0142b; font-size: 11px; font-weight: 800; text-transform: uppercase; margin: 0 0 4px; display: flex; align-items: center; gap: 6px;">
                    <span style="color: #eab308; font-size: 12px;">✦</span> WARRANTY
                  </h3>
                  <h4 style="font-size: 11.5px; font-weight: 800; margin: 2px 0 4px; color: #111;">
                    ${clientDetails.warrantyYears || '20'} YEARS WARRANTY
                  </h4>
                  <p style="font-size: 10.5px; font-style: italic; color: #222; line-height: 1.5; margin: 0 0 4px;">
                    The interior work is covered under a ${clientDetails.warrantyYears || '20'}-year warranty against workmanship-related defects, subject to proper site conditions and standard warranty terms.
                  </p>
                  <p style="font-size: 9.5px; font-style: italic; color: #555; margin: 0; line-height: 1.45;">
                    Note: Warranty does not cover damage caused by water leakage, seepage, moisture, structural movement, external damage, electrical work, or alterations carried out by others.
                  </p>
                </div>

                <div style="height: 1px; background: #f0dada; margin: 14px 0;"></div>

                <!-- PAYMENT TERMS -->
                <div style="margin-bottom: 16px;">
                  <p style="font-size: 10.5px; line-height: 1.55; margin: 0;">
                    <span style="color: #c0142b; text-decoration: underline; font-weight: bold;">Payment Terms:</span> will commence upon receipt of the 60% advance. The subsequent 30% payment will be due at the agreed mid-work stage, with the remaining 10% payable upon completion and handover of the work.
                  </p>
                </div>

                <div style="height: 1px; background: #f0dada; margin: 14px 0;"></div>

                <!-- ESTIMATED TIMELINE -->
                <div style="margin-bottom: 16px;">
                  <h3 style="color: #c0142b; font-size: 11px; font-weight: 800; text-transform: uppercase; margin: 0 0 4px; display: flex; align-items: center; gap: 6px;">
                    <span style="color: #eab308; font-size: 12px;">✦</span> ESTIMATED TIMELINE
                  </h3>
                  <h4 style="font-size: 11.5px; font-weight: 800; margin: 2px 0 4px; color: #111;">
                    ${clientDetails.workingDays || '10–15'} WORKING DAYS
                  </h4>
                  <p style="font-size: 10.5px; font-style: italic; color: #222; line-height: 1.5; margin: 0 0 4px;">
                    The estimated completion period for the interior work is ${clientDetails.workingDays || '10–15'} working days from the commencement of work.
                  </p>
                  <p style="font-size: 9.5px; font-style: italic; color: #555; margin: 0; line-height: 1.45;">
                    Timeline may vary depending on site conditions, material availability, design approvals, and any additional work requested by the client.
                  </p>
                </div>

                <div style="height: 1px; background: #f0dada; margin: 14px 0;"></div>

                <!-- PRICE DESCRIPTION -->
                <div style="margin-bottom: 24px;">
                  <h3 style="color: #c0142b; font-size: 11px; font-weight: 800; text-transform: uppercase; margin: 0 0 8px; display: flex; align-items: center; gap: 6px;">
                    <span style="color: #eab308; font-size: 12px;">✦</span> PRICE DESCRIPTION
                  </h3>
                  <div style="font-size: 12.5px; font-weight: bold; margin: 0 0 8px; color: #111;">
                    Total Project Cost: <mark style="background: #ffff00; color: #000000; padding: 2px 7px; font-weight: 800; border-radius: 2px;">₹${estimate ? estimate.finalCost.toLocaleString('en-IN') : '48,000'}/-</mark>
                  </div>
                  <p style="font-size: 10px; font-style: italic; color: #333; line-height: 1.55; margin: 0 0 6px; text-align: justify;">
                    The quoted price includes the complete ${estimate?.projectType || 'Interior'} work as per the discussed design, including all specified materials, master layout, border detailing, additional garnish work, putty and primer finishing.
                  </p>
                  <p style="font-size: 10px; font-style: italic; color: #333; line-height: 1.55; margin: 0; text-align: justify;">
                    The above price is inclusive of the complete agreed scope of work. Electrical work, wooden garnish/woodwork, and final colour painting are not included and will be charged separately if required.
                  </p>
                </div>
              </div>

              <!-- Signatory Section -->
              <div style="display: flex; justify-content: flex-end; margin-top: 24px; margin-bottom: 12px;">
                <div style="text-align: center; position: relative; padding-right: 16px; min-width: 200px;">
                  <p style="font-size: 11.5px; font-weight: 700; color: #111; margin: 0 0 6px;">
                    For Cherry Gold Interiors Pvt Ltd
                  </p>
                  <div style="position: relative; height: 80px; margin: 4px 0; display: flex; align-items: center; justify-content: center;">
                    <img src="${origin}/images/company-stamp.svg" style="position: absolute; width: 96px; height: 96px; opacity: 0.85; transform: rotate(-8deg); left: 15px;" />
                    <img src="${origin}/images/signature.svg" style="position: relative; z-index: 10; width: 128px; height: auto; opacity: 0.95; transform: rotate(-2deg);" />
                  </div>
                  <p style="font-weight: 800; font-size: 12px; margin: 2px 0 1px; color: #111;">
                    Ankit Sharma
                  </p>
                  <p style="font-weight: 600; font-size: 10px; margin: 1px 0; color: #333;">
                    Founder & Interior Designer
                  </p>
                  <p style="font-weight: 600; font-size: 9.5px; margin: 1px 0; color: #555;">
                    Authorized Signatory
                  </p>
                </div>
              </div>
            </div>

            <!-- Footer -->
            <div>
              <div style="height: 1.5px; background: #c9a84c; margin: 16px 0 6px;"></div>
              <div style="text-align: center; color: #c9a84c; font-size: 10px; font-weight: 600; letter-spacing: 0.3px;">
                www.cherrygoldinteriors.com | info@cherrygoldinteriors.com
              </div>
              <div style="text-align: right; font-size: 10px; color: #888; margin-top: 8px;">
                Page 2 of 2
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    doc.open();
    doc.write(html);
    doc.close();

    setTimeout(() => {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
    }, 350);
  };

  return (
    <div className="py-28 lg:py-32 bg-[#FDFBD4]">


      {/* ========================================================================= */}
      {/* SCREEN VIEW: EXACT ORIGINAL INTERACTIVE UI FOR THE COST ESTIMATOR PAGE    */}
      {/* ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 no-print">
        
        {/* Page Heading */}
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            Cost Estimator
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
            Get an instant estimate for your interior design project. Enter your space dimensions and preferences to calculate approximate costs.
          </p>
        </div>

        {/* 2-Column Grid: Left Form, Right Clean Estimate Breakdown (Original UI) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          
          {/* LEFT COLUMN: Estimation Input Form */}
          <div className="bg-[#f1f1de] rounded-2xl shadow-lg p-6 sm:p-8 border border-[#e5e5ce]">
            <div className="flex items-center mb-6">
              <Calculator className="w-6 h-6 text-red-600 mr-3" />
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Calculate Your Project Cost</h2>
            </div>

            <form onSubmit={calculateEstimate} className="space-y-5 sm:space-y-6">
              
              {/* Project Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Project Type *
                </label>
                <select
                  name="projectType"
                  value={formData.projectType}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white text-gray-800 text-sm"
                >
                  <option value="">Select project type</option>
                  {projectTypes.map(type => (
                    <option key={type.id} value={type.id}>
                      {type.name} {type.baseRate ? `(from ₹${type.baseRate}/sq ft)` : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Dynamic Packages based on Project Type */}
              {formData.projectType === 'kitchen' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Kitchen Package *
                  </label>
                  <select
                    name="kitchenPackage"
                    value={formData.kitchenPackage}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white text-gray-800 text-sm"
                  >
                    {kitchenPackages.map(pkg => (
                      <option key={pkg.id} value={pkg.id}>
                        {pkg.name} — ₹{pkg.rate}/sq.ft
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {formData.projectType === 'wall-paneling' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Wall Paneling Package *
                  </label>
                  <select
                    name="wallPanelingPackage"
                    value={formData.wallPanelingPackage}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white text-gray-800 text-sm"
                  >
                    <option value="">Select Package</option>
                    {wallPanelingPackages.map(pkg => (
                      <option key={pkg.id} value={pkg.id}>
                        {pkg.name} — ₹{pkg.rate}/sq.ft
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {formData.projectType === 'false-ceiling' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    False Ceiling Type *
                  </label>
                  <select
                    name="falseCeilingType"
                    value={formData.falseCeilingType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white text-gray-800 text-sm"
                  >
                    <option value="">Select Type</option>
                    {falseCeilingTypes.map(type => (
                      <option key={type.id} value={type.id}>
                        {type.name} — ₹{type.rate}/sq.ft
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {formData.projectType === 'wardrobe' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Wardrobe Package *
                  </label>
                  <select
                    name="wardrobePackage"
                    value={formData.wardrobePackage}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white text-gray-800 text-sm"
                  >
                    <option value="">Select Package</option>
                    {wardrobePackages.map(pkg => (
                      <option key={pkg.id} value={pkg.id}>
                        {pkg.name} — ₹{pkg.rate}/sq.ft
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {formData.projectType === 'interior-decoration' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Interior Plan *
                  </label>
                  <select
                    name="interiorPackage"
                    value={formData.interiorPackage}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white text-gray-800 text-sm"
                  >
                    {interiorPackages.map(pkg => (
                      <option key={pkg.id} value={pkg.id}>
                        {pkg.name} — ₹{pkg.rate}/sq.ft
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Dimensions */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Length (ft) *
                  </label>
                  <input
                    type="number"
                    name="length"
                    value={formData.length}
                    onChange={handleInputChange}
                    required
                    min="1"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white text-gray-800 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Width (ft) *
                  </label>
                  <input
                    type="number"
                    name="width"
                    value={formData.width}
                    onChange={handleInputChange}
                    required
                    min="1"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white text-gray-800 text-sm"
                  />
                </div>
              </div>

              {/* Optional Add-on Features */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Optional Add-on Features
                  </label>
                  <span className="text-[11px] text-gray-500 font-medium">(Prices mentioned per item)</span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                  {additionalFeatures.map(feat => {
                    const isSelected = formData.additionalFeatures.includes(feat.id);
                    return (
                      <label 
                        key={feat.id} 
                        className={`flex items-center justify-between gap-2 p-2.5 rounded-lg border transition-all cursor-pointer ${
                          isSelected 
                            ? 'border-red-400 bg-red-50/80 shadow-sm' 
                            : 'border-gray-200 hover:border-gray-300 hover:bg-white bg-white/80'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => handleFeatureChange(feat.id, e.target.checked)}
                            className="rounded text-red-600 focus:ring-red-500 w-4 h-4 flex-shrink-0 cursor-pointer"
                          />
                          <span className={`truncate font-medium ${isSelected ? 'text-red-900 font-semibold' : 'text-gray-700'}`}>
                            {feat.name}
                          </span>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold flex-shrink-0 ${
                          isSelected ? 'bg-red-600 text-white' : 'bg-gray-100 text-red-600 border border-gray-200'
                        }`}>
                          +₹{feat.cost.toLocaleString('en-IN')}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* GST Toggle */}
              <div className="flex items-center justify-between p-3.5 bg-amber-50/70 rounded-lg border border-amber-200">
                <span className="text-xs sm:text-sm font-medium text-gray-800">Include GST (18%) in Estimate</span>
                <input
                  type="checkbox"
                  checked={formData.includeGST}
                  onChange={(e) => setFormData(prev => ({ ...prev, includeGST: e.target.checked }))}
                  className="w-4 h-4 text-red-600 rounded focus:ring-red-500 cursor-pointer"
                />
              </div>

              <button
                type="submit"
                disabled={isSaving}
                className="w-full bg-red-600 text-white py-3.5 px-6 rounded-lg font-bold hover:bg-red-700 transition-all shadow-md hover:shadow-lg text-sm flex items-center justify-center gap-2"
              >
                <Calculator size={18} />
                {isSaving ? 'Calculating...' : 'Calculate Estimate'}
              </button>
            </form>
          </div>


          {/* RIGHT COLUMN: Original Clean Estimate Breakdown Card */}
          <div className="bg-[#f1f1de] rounded-2xl shadow-lg p-6 sm:p-8 border border-[#e5e5ce]">
            {estimate ? (
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">Project Estimate</h3>
                  <p className="text-sm font-semibold text-red-700">
                    {estimate.projectType} — {estimate.selectedPackage}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Area: {formData.length}ft × {formData.width}ft ({estimate.area} sq ft)
                  </p>
                </div>

                {estimate.packageDescription && (
                  <div className="p-3 bg-white/70 rounded-lg border border-gray-200 text-xs text-gray-700">
                    <span className="font-semibold text-gray-900">Package Spec: </span>
                    {estimate.packageDescription}
                  </div>
                )}

                {estimate.packageFeatures && estimate.packageFeatures.length > 0 && (
                  <div className="bg-blue-50/80 rounded-lg p-4 border border-blue-100">
                    <h4 className="font-semibold text-gray-900 mb-2 text-xs uppercase tracking-wider text-blue-900">
                      Included Package Features:
                    </h4>
                    <ul className="text-xs text-gray-700 space-y-1">
                      {estimate.packageFeatures.map((feature, index) => (
                        <li key={index} className="flex items-start gap-1.5">
                          <Check size={14} className="text-emerald-600 mt-0.5 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Cost Breakdown */}
                <div className="space-y-3 pt-2 border-t border-gray-200 text-sm">
                  <div className="flex justify-between items-center text-gray-700">
                    <span>Base Cost</span>
                    <span className="font-semibold text-gray-900">₹{estimate.basePrice.toLocaleString('en-IN')}</span>
                  </div>

                  {estimate.featuresTotal > 0 && (
                    <div className="space-y-1.5 py-1">
                      <div className="flex justify-between items-center text-gray-700">
                        <span className="font-medium text-gray-800">Additional Features</span>
                        <span className="font-semibold text-gray-900">+₹{estimate.featuresTotal.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="pl-2.5 py-1 border-l-2 border-red-300 space-y-1 text-xs">
                        {formData.additionalFeatures.map(featId => {
                          const item = additionalFeatures.find(f => f.id === featId);
                          if (!item) return null;
                          return (
                            <div key={item.id} className="flex justify-between items-center text-gray-600">
                              <span className="truncate pr-2">• {item.name}</span>
                              <span className="font-semibold text-red-700 flex-shrink-0">+₹{item.cost.toLocaleString('en-IN')}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between items-center text-gray-700">
                    <span>Subtotal</span>
                    <span className="font-semibold text-gray-900">₹{estimate.subtotal.toLocaleString('en-IN')}</span>
                  </div>

                  <div className="flex justify-between items-center text-gray-700">
                    <span>GST (18%)</span>
                    <span className="font-semibold text-gray-900">₹{estimate.gst.toLocaleString('en-IN')}</span>
                  </div>

                  {!formData.includeGST && (
                    <p className="text-xs text-gray-500 italic">GST (18%) not included as per your selection.</p>
                  )}

                  <div className="border-t border-gray-300 pt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-lg sm:text-xl font-bold text-gray-900">Total Cost</span>
                      <span className="text-2xl sm:text-3xl font-extrabold text-red-600">
                        ₹{estimate.finalCost.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Important Notes */}
                <div className="bg-blue-50/80 rounded-lg p-3.5 border border-blue-200">
                  <div className="flex items-start space-x-2.5">
                    <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="text-xs text-blue-900">
                      <p className="font-semibold mb-1">Important Notes:</p>
                      <ul className="space-y-0.5 text-blue-800">
                        <li>• This is an approximate estimate based on entered dimensions.</li>
                        <li>• Final cost may vary based on actual site conditions.</li>
                        <li>• Includes design, material supply, and skilled installation.</li>
                        {estimationId && (
                          <li className="font-bold text-emerald-700 mt-1">• Estimate saved to your session (ID: #{estimationId})</li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* ACTION BUTTONS: Download Official PDF Quote triggers the exact letterhead modal */}
                <div className="space-y-3 pt-2">
                  <button 
                    onClick={handlePrint}
                    className="w-full bg-[#c0142b] hover:bg-[#a01024] text-white py-3.5 px-4 rounded-xl font-bold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-sm"
                  >
                    <Download size={16} />
                    Download PDF Quote (2-Page Official Proposal)
                  </button>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={handleOpenDownloadModal}
                      className="bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                    >
                      <FileText size={14} className="text-red-600" />
                      View Letterhead
                    </button>
                    
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="bg-amber-100 hover:bg-amber-200 text-amber-900 py-2.5 px-3 rounded-xl text-xs font-bold transition-colors shadow-sm"
                    >
                      Book Consultation
                    </button>
                  </div>
                </div>

              </div>
            ) : (
              <div className="text-center py-16 flex flex-col items-center justify-center min-h-[380px]">
                <Home className="w-16 h-16 text-gray-300 mb-4" />
                <h4 className="text-base font-semibold text-gray-700 mb-1">No Estimate Yet</h4>
                <p className="text-xs sm:text-sm text-gray-500 max-w-xs">
                  Fill out the form on the left and click "Calculate Estimate" to get your instant cost breakdown.
                </p>
              </div>
            )}
          </div>

        </div>

        {/* Example Calculations (Original section preserved) */}
        <div className="mt-16 bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Example Calculations</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Kitchen Example */}
            <div className="bg-orange-50/70 rounded-xl p-6 border border-orange-100">
              <h4 className="font-bold text-gray-900 mb-3">Modular Kitchen - 10ft × 12ft</h4>
              <div className="text-sm space-y-2 text-gray-700">
                <p><span className="font-medium text-gray-900">Area:</span> 10 × 12 = 120 sq ft</p>
                <p><span className="font-medium text-gray-900">Standard Package:</span> ₹1,500 per sq ft</p>
                <p><span className="font-medium text-gray-900">Base Cost:</span> 120 × ₹1,500 = ₹1,80,000</p>
                <p><span className="font-medium text-gray-900">GST (18%):</span> ₹32,400</p>
                <p className="font-bold text-red-600 pt-2 border-t border-orange-200"><span className="font-medium text-gray-900">Total:</span> ₹2,12,400</p>
              </div>
            </div>

            {/* Wall Paneling Example */}
            <div className="bg-blue-50/70 rounded-xl p-6 border border-blue-100">
              <h4 className="font-bold text-gray-900 mb-3">Wall Paneling - 8ft × 10ft</h4>
              <div className="text-sm space-y-2 text-gray-700">
                <p><span className="font-medium text-gray-900">Area:</span> 8 × 10 = 80 sq ft</p>
                <p><span className="font-medium text-gray-900">Standard Package:</span> ₹475 per sq ft</p>
                <p><span className="font-medium text-gray-900">Base Cost:</span> 80 × ₹475 = ₹38,000</p>
                <p><span className="font-medium text-gray-900">GST (18%):</span> ₹6,840</p>
                <p className="font-bold text-blue-600 pt-2 border-t border-blue-200"><span className="font-medium text-gray-900">Total:</span> ₹44,840</p>
              </div>
            </div>

            {/* False Ceiling Example */}
            <div className="bg-green-50/70 rounded-xl p-6 border border-green-100">
              <h4 className="font-bold text-gray-900 mb-3">POP False Ceiling - 12ft × 14ft</h4>
              <div className="text-sm space-y-2 text-gray-700">
                <p><span className="font-medium text-gray-900">Area:</span> 12 × 14 = 168 sq ft</p>
                <p><span className="font-medium text-gray-900">POP Ceiling:</span> ₹120 per sq ft</p>
                <p><span className="font-medium text-gray-900">Cost:</span> 168 × ₹120 = ₹20,160</p>
                <p><span className="font-medium text-gray-900">Paint & Putty:</span> 168 × ₹30 = ₹5,040</p>
                <p><span className="font-medium text-gray-900">Subtotal:</span> ₹25,200</p>
                <p><span className="font-medium text-gray-900">GST (18%):</span> ₹4,536</p>
                <p className="font-bold text-emerald-600 pt-2 border-t border-green-200"><span className="font-medium text-gray-900">Total:</span> ₹29,736</p>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-100/80 rounded-xl border border-gray-200">
            <h5 className="font-bold text-gray-900 mb-2 text-sm">Important Notes:</h5>
            <ul className="text-xs sm:text-sm text-gray-600 space-y-1">
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


      {/* ========================================================================= */}
      {/* DOWNLOAD TIME: MODAL SHOWING THE EXACT 2-PAGE LETTERHEAD PROPOSAL         */}
      {/* ========================================================================= */}
      {isQuotationModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 no-print">
          
          <div className="bg-gray-100 rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden flex flex-col max-h-[92vh]">
            
            {/* Modal Top Control Bar */}
            <div className="bg-white px-4 sm:px-6 py-3.5 border-b border-gray-200 flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="font-bold text-sm text-gray-900">
                  Official Letterhead Proposal (CGI/2026/502)
                </span>
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  onClick={() => setIsEditingClient(!isEditingClient)}
                  className="px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-50 flex items-center gap-1.5 transition-colors"
                >
                  <Edit3 size={13} className="text-red-600" />
                  {isEditingClient ? 'Hide Customizer' : 'Edit Quotation Details'}
                </button>

                <button
                  onClick={handlePrint}
                  className="bg-[#c0142b] hover:bg-[#a01024] text-white px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-md transition-all"
                >
                  <Printer size={14} /> Print / Save as PDF
                </button>

                <button
                  onClick={() => setIsQuotationModalOpen(false)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Quotation Customization Drawer */}
            {isEditingClient && (
              <div className="bg-amber-50/80 px-4 sm:px-6 py-3 border-b border-amber-200 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg">
                  <div>
                    <label className="text-[11px] font-semibold text-gray-700 block mb-1">Project Work Title:</label>
                    <input
                      type="text"
                      value={clientDetails.projectName}
                      onChange={(e) => setClientDetails({ ...clientDetails, projectName: e.target.value })}
                      className="w-full px-2.5 py-1.5 border border-gray-300 rounded bg-white"
                      placeholder="Bedroom Interior Work"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-gray-700 block mb-1">Quotation No:</label>
                    <input
                      type="text"
                      value={clientDetails.quotationNo}
                      onChange={(e) => setClientDetails({ ...clientDetails, quotationNo: e.target.value })}
                      className="w-full px-2.5 py-1.5 border border-gray-300 rounded bg-white"
                      placeholder="CGI/2026/502"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Scrollable Document Container */}
            <div className="overflow-y-auto p-4 sm:p-6 flex-1 space-y-6 flex flex-col items-center">
              
              {/* THE OFFICIAL 2-PAGE DOCUMENT MATCHING USER'S PHOTOS SAME TO SAME */}
              <div 
                className="bg-white rounded-lg shadow-xl border border-gray-300 w-full max-w-2xl font-sans text-gray-900"
              >
                
                {/* ===================== PAGE 1 ===================== */}
                <div 
                  className="quotation-page p-6 sm:p-10 bg-white relative border-b-2 border-dashed border-gray-200"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  
                  {/* Header */}
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-16 sm:w-20 flex-shrink-0">
                      <img 
                        src="/images/logo.png" 
                        alt="Cherry Gold Interiors" 
                        className="w-full h-auto object-contain"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/vite.png';
                        }}
                      />
                    </div>

                    <div className="text-center flex-1 pr-2 sm:pr-6">
                      <h1 
                        style={{ 
                          color: '#c0142b', 
                          fontFamily: "'Times New Roman', serif", 
                          fontSize: 'clamp(16px, 2.8vw, 24px)', 
                          fontWeight: '800', 
                          letterSpacing: '0.8px', 
                          margin: 0,
                          lineHeight: 1.15
                        }}
                      >
                        CHERRY GOLD INTERIORS PVT. LTD.
                      </h1>
                      
                      <p style={{ fontWeight: 800, fontSize: '10.5px', margin: '3px 0 2px', color: '#111', letterSpacing: '0.5px' }}>
                        U74102WB2025PTC279494
                      </p>
                      
                      <p style={{ fontSize: '10px', margin: '2px 0', color: '#333', lineHeight: 1.3 }}>
                        75 Prafulla Nagar Colony, Belgharia, North 24 Parganas, West Bengal - <span style={{ color: '#2563eb', fontWeight: 700 }}>700056</span>
                      </p>
                      
                      <p style={{ fontSize: '10px', fontWeight: 700, margin: '2px 0', color: '#111' }}>
                        9433889668 | 7687914255
                      </p>
                      
                      <p style={{ fontSize: '9.5px', margin: '2px 0', color: '#2563eb' }}>
                        <span style={{ textDecoration: 'underline' }}>info@cherrygoldinteriors.com</span> | <span style={{ textDecoration: 'underline' }}>www.cherrygoldinteriors.com</span>
                      </p>
                    </div>
                  </div>

                  <div style={{ height: '1.5px', background: '#c0142b', margin: '8px 0 16px' }} />

                  {/* Project & Quotation Metadata Box */}
                  <div className="flex justify-between items-start text-xs mb-3 leading-relaxed text-gray-900">
                    <div>
                      <p style={{ margin: '1px 0' }}>
                        <span style={{ color: '#444' }}>Project:</span> <strong>{clientDetails.projectName || `${estimate?.projectType || 'Bedroom'} Interior Work`}</strong>
                      </p>
                    </div>

                    <div className="text-right">
                      <p style={{ margin: '1px 0' }}>
                        <span style={{ color: '#444' }}>Quotation No:</span> <strong>{clientDetails.quotationNo || 'CGI/2026/502'}</strong>
                      </p>
                      <p style={{ margin: '1px 0' }}>
                        <span style={{ color: '#444' }}>Date:</span> <strong>{clientDetails.date}</strong>
                      </p>
                      <p style={{ margin: '1px 0' }}>
                        <span style={{ color: '#444' }}>Validity:</span> {clientDetails.validity || '15 Days'}
                      </p>
                    </div>
                  </div>

                  {/* Luxury Design Proposal Center Heading */}
                  <h2 
                    style={{ 
                      textAlign: 'center', 
                      color: '#c0142b', 
                      fontFamily: "'Times New Roman', serif", 
                      textDecoration: 'underline', 
                      fontSize: '16px', 
                      fontWeight: '700', 
                      margin: '16px 0 14px' 
                    }}
                  >
                    Luxury Design Proposal
                  </h2>

                  {/* Left Red Accent Line Container */}
                  <div 
                    style={{ 
                      borderLeft: '2px solid #c0142b', 
                      paddingLeft: '14px', 
                      marginLeft: '2px' 
                    }}
                  >
                    {/* DESIGN CONCEPT */}
                    <div className="mb-4">
                      <h3 
                        style={{ 
                          color: '#c0142b', 
                          fontSize: '11px', 
                          fontWeight: '800', 
                          textTransform: 'uppercase', 
                          margin: '0 0 5px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <span style={{ color: '#eab308', fontSize: '12px' }}>✦</span> DESIGN CONCEPT
                      </h3>
                      
                      <p 
                        style={{ 
                          fontSize: '10.5px', 
                          fontStyle: 'italic', 
                          color: '#222', 
                          lineHeight: '1.6', 
                          margin: 0,
                          textAlign: 'justify'
                        }}
                      >
                        A premium {estimate?.selectedPackage || 'Paris/POP false ceiling design'} created to give the {estimate?.projectType || 'master bedroom'} a refined and elegant appearance. The concept features a four-sided tray ceiling, complemented by a central master ceiling with a basket-pattern design and an intricate POP border detail around the sides, as discussed. Additional POP garnish work is incorporated to enhance the overall depth, symmetry, and visual appeal of the ceiling.
                      </p>
                    </div>

                    {/* SCOPE OF WORK */}
                    <div className="mb-4">
                      <h3 
                        style={{ 
                          color: '#c0142b', 
                          fontSize: '11px', 
                          fontWeight: '800', 
                          textTransform: 'uppercase', 
                          margin: '0 0 8px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <span style={{ color: '#eab308', fontSize: '12px' }}>✦</span> SCOPE OF WORK
                      </h3>

                      <div style={{ borderRadius: '2px', overflow: 'hidden', border: '1px solid #c0142b' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10.5px' }}>
                          <thead>
                            <tr style={{ background: '#b91c1c', color: '#ffffff' }}>
                              <th style={{ padding: '6px 10px', textAlign: 'left', fontWeight: 'bold', width: '32%', fontStyle: 'italic' }}>
                                Work
                              </th>
                              <th style={{ padding: '6px 10px', textAlign: 'left', fontWeight: 'bold', width: '68%', fontStyle: 'italic' }}>
                                Description
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {getScopeOfWorkItems().map((item, idx) => (
                              <tr key={idx} style={{ borderBottom: '1px solid #f1d5d5', background: idx % 2 === 0 ? '#ffffff' : '#fdf8f8' }}>
                                <td style={{ padding: '7px 10px', fontWeight: '600', color: '#111', fontStyle: 'italic', verticalAlign: 'top' }}>
                                  {item.work}
                                </td>
                                <td style={{ padding: '7px 10px', color: '#333', fontStyle: 'italic', verticalAlign: 'top' }}>
                                  {item.desc}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* NOT INCLUDED */}
                    <div className="mb-2">
                      <h3 
                        style={{ 
                          color: '#c0142b', 
                          fontSize: '11px', 
                          fontWeight: '800', 
                          textTransform: 'uppercase', 
                          margin: '0 0 6px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <span style={{ color: '#eab308', fontSize: '12px' }}>✦</span> NOT INCLUDED
                      </h3>
                      
                      <ul style={{ margin: 0, paddingLeft: '4px', listStyle: 'none', fontSize: '10px', fontStyle: 'italic', color: '#333', lineHeight: '1.65' }}>
                        <li>• Electrical wiring, electrical points, fixtures and related electrical work.</li>
                        <li>• Wooden garnish or any wooden work.</li>
                        <li>• Final colour paint/painting work is not included.</li>
                        <li>• Any additional work or design changes beyond the agreed scope will be charged separately.</li>
                      </ul>
                    </div>

                  </div>

                  <div className="text-right text-[10px] text-gray-400 mt-4">
                    Page 1 of 2
                  </div>
                </div>


                {/* ===================== PAGE 2 ===================== */}
                <div 
                  className="quotation-page p-6 sm:p-10 bg-white relative"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  <div 
                    style={{ 
                      borderLeft: '2px solid #c0142b', 
                      paddingLeft: '14px', 
                      marginLeft: '2px' 
                    }}
                  >
                    
                    {/* WARRANTY */}
                    <div className="mb-4">
                      <h3 
                        style={{ 
                          color: '#c0142b', 
                          fontSize: '11px', 
                          fontWeight: '800', 
                          textTransform: 'uppercase', 
                          margin: '0 0 4px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <span style={{ color: '#eab308', fontSize: '12px' }}>✦</span> WARRANTY
                      </h3>
                      
                      <h4 style={{ fontSize: '11.5px', fontWeight: '800', margin: '2px 0 4px', color: '#111' }}>
                        {clientDetails.warrantyYears || '20'} YEARS WARRANTY
                      </h4>
                      
                      <p style={{ fontSize: '10.5px', fontStyle: 'italic', color: '#222', lineHeight: '1.5', margin: '0 0 4px' }}>
                        The false ceiling work is covered under a {clientDetails.warrantyYears || '20'}-year warranty against workmanship-related defects, subject to proper site conditions and standard warranty terms.
                      </p>
                      
                      <p style={{ fontSize: '9.5px', fontStyle: 'italic', color: '#555', margin: 0, lineHeight: '1.45' }}>
                        Note: Warranty does not cover damage caused by water leakage, seepage, moisture, structural movement, external damage, electrical work, or alterations carried out by others.
                      </p>
                    </div>

                    <div style={{ height: '1px', background: '#f0dada', margin: '14px 0' }} />

                    {/* PAYMENT TERMS */}
                    <div className="mb-4">
                      <p style={{ fontSize: '10.5px', lineHeight: '1.55', margin: 0 }}>
                        <span style={{ color: '#c0142b', textDecoration: 'underline', fontWeight: 'bold' }}>Payment Terms:</span> will commence upon receipt of the 60% advance. The subsequent 30% payment will be due at the agreed mid-work stage, with the remaining 10% payable upon completion and handover of the work.
                      </p>
                    </div>

                    <div style={{ height: '1px', background: '#f0dada', margin: '14px 0' }} />

                    {/* ESTIMATED TIMELINE */}
                    <div className="mb-4">
                      <h3 
                        style={{ 
                          color: '#c0142b', 
                          fontSize: '11px', 
                          fontWeight: '800', 
                          textTransform: 'uppercase', 
                          margin: '0 0 4px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <span style={{ color: '#eab308', fontSize: '12px' }}>✦</span> ESTIMATED TIMELINE
                      </h3>
                      
                      <h4 style={{ fontSize: '11.5px', fontWeight: '800', margin: '2px 0 4px', color: '#111' }}>
                        {clientDetails.workingDays || '10–15'} WORKING DAYS
                      </h4>
                      
                      <p style={{ fontSize: '10.5px', fontStyle: 'italic', color: '#222', lineHeight: '1.5', margin: '0 0 4px' }}>
                        The estimated completion period for the false ceiling work is {clientDetails.workingDays || '10–15'} working days from the commencement of work.
                      </p>
                      
                      <p style={{ fontSize: '9.5px', fontStyle: 'italic', color: '#555', margin: 0, lineHeight: '1.45' }}>
                        Timeline may vary depending on site conditions, material availability, design approvals, and any additional work requested by the client.
                      </p>
                    </div>

                    <div style={{ height: '1px', background: '#f0dada', margin: '14px 0' }} />

                    {/* PRICE DESCRIPTION */}
                    <div className="mb-8">
                      <h3 
                        style={{ 
                          color: '#c0142b', 
                          fontSize: '11px', 
                          fontWeight: '800', 
                          textTransform: 'uppercase', 
                          margin: '0 0 8px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <span style={{ color: '#eab308', fontSize: '12px' }}>✦</span> PRICE DESCRIPTION
                      </h3>

                      <div style={{ fontSize: '12.5px', fontWeight: 'bold', margin: '0 0 8px', color: '#111' }}>
                        Total Project Cost:{' '}
                        <mark 
                          style={{ 
                            background: '#ffff00', 
                            color: '#000000', 
                            padding: '2px 7px', 
                            fontWeight: '800', 
                            borderRadius: '2px' 
                          }}
                        >
                          ₹{estimate ? estimate.finalCost.toLocaleString('en-IN') : '48,000'}/-
                        </mark>
                      </div>

                      <p style={{ fontSize: '10px', fontStyle: 'italic', color: '#333', lineHeight: '1.55', margin: '0 0 6px', textAlign: 'justify' }}>
                        The quoted price includes the complete Paris/POP false ceiling work as per the discussed design, including the four-sided tray ceiling, master ceiling with basket design, POP border detailing, additional POP garnish work, putty and primer finishing.
                      </p>

                      <p style={{ fontSize: '10px', fontStyle: 'italic', color: '#333', lineHeight: '1.55', margin: 0, textAlign: 'justify' }}>
                        The above price is inclusive of the complete agreed scope of false ceiling work. Electrical work, wooden garnish/woodwork, and final colour painting are not included and will be charged separately if required.
                      </p>
                    </div>

                  </div>

                  {/* Signatory Section */}
                  <div className="flex justify-end mt-6 mb-3">
                    <div className="text-center relative pr-4" style={{ minWidth: '200px' }}>
                      <p style={{ fontSize: '11.5px', fontWeight: '700', color: '#111', margin: '0 0 6px' }}>
                        For Cherry Gold Interiors Pvt Ltd
                      </p>

                      <div className="relative h-20 my-1 flex items-center justify-center">
                        <img 
                          src="/images/company-stamp.svg" 
                          alt="Official Seal" 
                          className="absolute w-24 h-24 opacity-85 pointer-events-none"
                          style={{ transform: 'rotate(-8deg)', left: '15px' }}
                        />
                        <img 
                          src="/images/signature.svg" 
                          alt="Ankit Sharma Signature" 
                          className="relative z-10 w-32 h-auto opacity-95 pointer-events-none"
                          style={{ transform: 'rotate(-2deg)' }}
                        />
                      </div>

                      <p style={{ fontWeight: '800', fontSize: '12px', margin: '2px 0 1px', color: '#111' }}>
                        Ankit Sharma
                      </p>
                      <p style={{ fontWeight: '600', fontSize: '10px', margin: '1px 0', color: '#333' }}>
                        Founder & Interior Designer
                      </p>
                      <p style={{ fontWeight: '600', fontSize: '9.5px', margin: '1px 0', color: '#555' }}>
                        Authorized Signatory
                      </p>
                    </div>
                  </div>

                  {/* Gold Footer */}
                  <div style={{ height: '1.5px', background: '#c9a84c', margin: '20px 0 6px' }} />
                  <div 
                    style={{ 
                      textAlign: 'center', 
                      color: '#c9a84c', 
                      fontSize: '10px', 
                      fontWeight: '600',
                      letterSpacing: '0.3px'
                    }}
                  >
                    www.cherrygoldinteriors.com | info@cherrygoldinteriors.com
                  </div>

                  <div className="text-right text-[10px] text-gray-400 mt-3">
                    Page 2 of 2
                  </div>
                </div>

              </div>

            </div>

            {/* Modal Bottom Action Bar */}
            <div className="bg-white px-4 sm:px-6 py-3 border-t border-gray-200 flex items-center justify-between">
              <span className="text-xs text-gray-500">
                Official quotation ready for export & printing.
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsQuotationModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={handlePrint}
                  className="bg-[#c0142b] hover:bg-[#a01024] text-white px-5 py-2 rounded-lg text-xs font-bold flex items-center gap-2 shadow-md transition-all"
                >
                  <Printer size={15} /> Print / Save as PDF
                </button>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* Free consultation modal */}
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