import React, { useState } from 'react';
import { 
  Calculator, 
  Home, 
  DollarSign, 
  Info, 
  Printer, 
  Download, 
  Edit3, 
  Check, 
  X, 
  FileText, 
  Sparkles, 
  Plus, 
  Trash2, 
  User, 
  Phone, 
  MapPin, 
  Layers, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import ConsultationModal from '../Components/ConsultationModal';

const CostEstimator = () => {
  // Current active work configuration form
  const [formData, setFormData] = useState({
    projectType: 'kitchen',
    roomLabel: '',
    kitchenPackage: 'standard',
    wallPanelingPackage: 'standard',
    falseCeilingType: 'gypsum',
    interiorPackage: 'standard',
    wardrobePackage: 'standard',
    length: '10',
    width: '12',
    height: '9',
    contact_phone: '',
    additionalFeatures: [],
    includeGST: true
  });

  // Client Details state
  const [clientDetails, setClientDetails] = useState({
    clientName: '',
    projectName: 'Interior Work',
    location: '',
    quotationNo: `CGI/${new Date().getFullYear()}/${Math.floor(100 + Math.random() * 900)}`,
    date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }),
    validity: '15 Days',
    warrantyYears: '20',
    workingDays: '10–15',
    contact_phone: ''
  });

  // Items List: supports multiple works (Kitchen + Wardrobe + Ceiling + Paneling, etc.)
  const [itemsList, setItemsList] = useState([]);

  // Modals state
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState('download'); // 'download' | 'preview'
  const [customerForm, setCustomerForm] = useState({
    clientName: '',
    contact_phone: '',
    location: '',
    projectName: ''
  });
  const [nameError, setNameError] = useState('');
  const [phoneError, setPhoneError] = useState('');

  const [isEditingClient, setIsEditingClient] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isQuotationModalOpen, setIsQuotationModalOpen] = useState(false);
  const [estimationId, setEstimationId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [successToast, setSuccessToast] = useState('');

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
    { id: 'wardrobe', name: 'Wardrobe', baseRate: 1400, defaultWork: 'Master Bedroom Wardrobe Work' },
    { id: 'false-ceiling', name: 'False Ceiling', baseRate: 140, defaultWork: 'False Ceiling & Lighting Work' },
    { id: 'wall-paneling', name: 'Wall Paneling', baseRate: 475, defaultWork: 'Wall Paneling & Decor Work' },
    { id: 'interior-decoration', name: 'Interior Decoration', baseRate: 1400, defaultWork: 'Complete Home Interior Work' },
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

  const commonRooms = ['Kitchen', 'Master Bedroom', 'Living Room', 'Dining Area', 'Guest Bedroom', 'Kids Room'];

  const getCSRFToken = () => {
    const cookieValue = document.cookie
      .split('; ')
      .find(row => row.startsWith('csrftoken='))
      ?.split('=')[1];
    return cookieValue || '';
  };

  const saveEstimationToBackend = async (calculatedItems) => {
    setIsSaving(true);
    try {
      const totalBasePrice = calculatedItems.reduce((sum, item) => sum + item.basePrice, 0);
      const totalFeaturesTotal = calculatedItems.reduce((sum, item) => sum + item.featuresTotal, 0);
      const subtotal = totalBasePrice + totalFeaturesTotal;
      const gst = formData.includeGST ? subtotal * 0.18 : 0;
      const finalCost = subtotal + gst;
      const totalArea = calculatedItems.reduce((sum, item) => sum + item.area, 0);

      const response = await fetch('http://127.0.0.1:8000/api/quote/api/estimations/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCSRFToken(),
        },
        body: JSON.stringify({
          project_type: calculatedItems.map(i => i.projectTypeName).join(' + '),
          kitchen_package: formData.kitchenPackage,
          wall_paneling_package: formData.wallPanelingPackage,
          false_ceiling_type: formData.falseCeilingType,
          interior_package: formData.interiorPackage,
          wardrobe_package: formData.wardrobePackage,
          length: parseFloat(formData.length || 0),
          width: parseFloat(formData.width || 0),
          height: parseFloat(formData.height || 0),
          contact_phone: formData.contact_phone || clientDetails.contact_phone,
          area: totalArea,
          base_price: totalBasePrice,
          features_total: totalFeaturesTotal,
          subtotal: subtotal,
          gst: gst,
          final_cost: finalCost,
          include_gst: formData.includeGST,
          additional_features: formData.additionalFeatures,
          package_description: calculatedItems.map(i => `${i.projectTypeName}: ${i.packageName}`).join(', '),
          package_features: calculatedItems[0]?.packageFeatures || [],
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

  // Build a single work item object from current form values
  const buildCurrentWorkItem = () => {
    const projectType = projectTypes.find(p => p.id === formData.projectType) || projectTypes[0];
    const length = parseFloat(formData.length) || 1;
    const width = parseFloat(formData.width) || 1;
    const area = length * width;

    let baseRate = 0;
    let selectedPackage = '';
    let packageDescription = '';
    let packageFeatures = [];

    const getRate = (pkg) => parseRate(pkg.rate);

    if (formData.projectType === 'kitchen') {
      const pkg = kitchenPackages.find(p => p.id === formData.kitchenPackage) || kitchenPackages[0];
      baseRate = getRate(pkg);
      selectedPackage = pkg.name;
      packageDescription = pkg.description;
      packageFeatures = pkg.features;
    } else if (formData.projectType === 'wall-paneling') {
      const pkg = wallPanelingPackages.find(p => p.id === formData.wallPanelingPackage) || wallPanelingPackages[0];
      baseRate = getRate(pkg);
      selectedPackage = pkg.name;
      packageDescription = pkg.description;
      packageFeatures = pkg.features;
    } else if (formData.projectType === 'false-ceiling') {
      const pkg = falseCeilingTypes.find(t => t.id === formData.falseCeilingType) || falseCeilingTypes[0];
      baseRate = getRate(pkg);
      selectedPackage = pkg.name;
      packageDescription = pkg.description;
      packageFeatures = pkg.features;
    } else if (formData.projectType === 'interior-decoration') {
      const pkg = interiorPackages.find(p => p.id === formData.interiorPackage) || interiorPackages[0];
      baseRate = getRate(pkg);
      selectedPackage = pkg.name;
      packageDescription = pkg.description;
      packageFeatures = pkg.features;
    } else if (formData.projectType === 'wardrobe') {
      const pkg = wardrobePackages.find(p => p.id === formData.wardrobePackage) || wardrobePackages[0];
      baseRate = getRate(pkg);
      selectedPackage = pkg.name;
      packageDescription = pkg.description;
      packageFeatures = pkg.features;
    } else {
      baseRate = parseRate(projectType.baseRate);
      selectedPackage = 'Standard Package';
      packageDescription = 'Basic package with standard features';
      packageFeatures = ['Termite-proof materials', 'Standard fitting warranty'];
    }

    const basePrice = area * baseRate;

    // Resolve additional features selected for this work
    const selectedFeaturesObj = formData.additionalFeatures.map(featId => {
      return additionalFeatures.find(f => f.id === featId);
    }).filter(Boolean);

    const featuresTotal = selectedFeaturesObj.reduce((total, feat) => total + feat.cost, 0);
    const itemTotal = basePrice + featuresTotal;

    return {
      id: 'work_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      projectType: formData.projectType,
      projectTypeName: projectType.name,
      roomLabel: formData.roomLabel.trim(),
      packageName: selectedPackage,
      packageDescription,
      packageFeatures,
      length,
      width,
      area,
      baseRate,
      basePrice,
      additionalFeatures: selectedFeaturesObj,
      featuresTotal,
      itemTotal
    };
  };

  // Add work to itemsList
  const handleAddWorkToQuotation = (e) => {
    if (e) e.preventDefault();

    const newItem = buildCurrentWorkItem();
    const updatedList = [...itemsList, newItem];
    setItemsList(updatedList);

    // Auto-update project title if not manually edited
    const workNames = updatedList.map(item => item.roomLabel ? `${item.projectTypeName} (${item.roomLabel})` : item.projectTypeName);
    const autoTitle = workNames.join(' + ') + ' Work';
    setClientDetails(prev => ({
      ...prev,
      projectName: autoTitle,
      contact_phone: formData.contact_phone || prev.contact_phone
    }));

    // Reset current form to prepare for next work addition, or switch to next popular work type
    const nextType = formData.projectType === 'kitchen' ? 'wardrobe' : formData.projectType === 'wardrobe' ? 'false-ceiling' : 'wall-paneling';
    setFormData(prev => ({
      ...prev,
      projectType: nextType,
      roomLabel: '',
      additionalFeatures: []
    }));

    setSuccessToast(`✓ ${newItem.projectTypeName} added to quotation!`);
    setTimeout(() => setSuccessToast(''), 3500);

    saveEstimationToBackend(updatedList);
  };

  // Remove a work item
  const handleRemoveItem = (id) => {
    const updated = itemsList.filter(item => item.id !== id);
    setItemsList(updated);
    if (updated.length > 0) {
      const workNames = updated.map(item => item.roomLabel ? `${item.projectTypeName} (${item.roomLabel})` : item.projectTypeName);
      setClientDetails(prev => ({
        ...prev,
        projectName: workNames.join(' + ') + ' Work'
      }));
    }
  };

  // Calculations across all items
  const totalBasePrice = itemsList.reduce((sum, item) => sum + item.basePrice, 0);
  const totalFeaturesTotal = itemsList.reduce((sum, item) => sum + item.featuresTotal, 0);
  const subtotal = totalBasePrice + totalFeaturesTotal;
  const gst = formData.includeGST ? Math.round(subtotal * 0.18) : 0;
  const finalCost = subtotal + gst;
  const totalArea = itemsList.reduce((sum, item) => sum + item.area, 0);

  // Scope of Work generator combining all selected works
  const getScopeOfWorkForItems = (items) => {
    if (!items || items.length === 0) return [];

    const allScopes = [];
    items.forEach((item) => {
      const pType = item.projectType;
      const pkg = item.packageName;
      const room = item.roomLabel ? ` [${item.roomLabel}]` : '';

      if (pType === 'kitchen') {
        allScopes.push(
          { work: `Kitchen Carcass${room}`, desc: `Heavy duty BWP Marine Plywood carcass with ${pkg} finish` },
          { work: `Shutters & Hardware${room}`, desc: 'Soft-close hydraulic hinges, precision edge-banded shutters with premium laminates' },
          { work: `Lighting & Finishing${room}`, desc: 'Concealed LED profile light channels, laser leveling, putty & protective seal coating' }
        );
      } else if (pType === 'wardrobe') {
        allScopes.push(
          { work: `Wardrobe Carcass${room}`, desc: `BWP Termite-proof plywood structure with full internal laminate balance (${pkg})` },
          { work: `Front Shutters${room}`, desc: 'Designer shutters with heavy-duty soft-close slide channels and profile handles' },
          { work: `Internal Organizers${room}`, desc: 'Dedicated hanging rods, pull-out drawers, concealed locks and accessory slots' }
        );
      } else if (pType === 'false-ceiling') {
        allScopes.push(
          { work: `Ceiling Structure${room}`, desc: `Precision perimeter channel framework for ${pkg || 'False Ceiling'}` },
          { work: `Ceiling Design & Board${room}`, desc: 'Basket-pattern / tray ceiling design with POP/Gypsum border detailing and garnish' },
          { work: `Finishing & Jointing${room}`, desc: 'Full joint-tape application, complete putty and primer protective coating' }
        );
      } else if (pType === 'wall-paneling') {
        allScopes.push(
          { work: `Wall Paneling Core${room}`, desc: `12mm calibrated plywood base paneling according to ${pkg}` },
          { work: `Decorative Paneling${room}`, desc: 'Designer PVC louvers / UV marble sheets / CNC styling as per specifications' },
          { work: `Trim & Finishing${room}`, desc: 'Seamless flush-fit edge joints and architectural border symmetry' }
        );
      } else if (pType === 'interior-decoration') {
        allScopes.push(
          { work: `Modular Carpentry${room}`, desc: `Custom modular carpentry with ${pkg} materials and soft edge-banding` },
          { work: `Surface Finish & Polish${room}`, desc: 'High gloss / acrylic scratch-resistant laminate overlay with seamless edges' },
          { work: `Hardware & Inspection${room}`, desc: 'Branded soft-close hardware, alignment check and handover testing' }
        );
      } else {
        allScopes.push(
          { work: `${item.projectTypeName} Layout${room}`, desc: `Precision installation according to ${pkg} design concept` },
          { work: `Paneling & Surface${room}`, desc: 'Termite and borer resistant engineered panels with premium surface finish' },
          { work: `Finishing & Handover${room}`, desc: 'Complete high-adhesion putty base, primer coating, and protective sealing' }
        );
      }
    });

    return allScopes;
  };

  // Open the Client Name Modal before triggering PDF download or Letterhead preview
  const handleRequestDownload = () => {
    // If no items in list yet, add the currently configured work first
    let activeList = itemsList;
    if (activeList.length === 0) {
      const newItem = buildCurrentWorkItem();
      activeList = [newItem];
      setItemsList(activeList);
      setClientDetails(prev => ({
        ...prev,
        projectName: `${newItem.projectTypeName} Work`
      }));
    }

    setPendingAction('download');
    setCustomerForm({
      clientName: clientDetails.clientName || '',
      contact_phone: clientDetails.contact_phone || formData.contact_phone || '',
      location: clientDetails.location || '',
      projectName: clientDetails.projectName || `${activeList.map(i => i.projectTypeName).join(' + ')} Work`
    });
    setNameError('');
    setPhoneError('');
    setIsCustomerModalOpen(true);
  };

  const handleRequestLetterheadPreview = () => {
    let activeList = itemsList;
    if (activeList.length === 0) {
      const newItem = buildCurrentWorkItem();
      activeList = [newItem];
      setItemsList(activeList);
      setClientDetails(prev => ({
        ...prev,
        projectName: `${newItem.projectTypeName} Work`
      }));
    }

    if (!clientDetails.clientName || clientDetails.clientName.trim() === '' || !clientDetails.contact_phone || clientDetails.contact_phone.trim() === '') {
      setPendingAction('preview');
      setCustomerForm({
        clientName: clientDetails.clientName || '',
        contact_phone: clientDetails.contact_phone || formData.contact_phone || '',
        location: clientDetails.location || '',
        projectName: clientDetails.projectName || `${activeList.map(i => i.projectTypeName).join(' + ')} Work`
      });
      setNameError('');
      setPhoneError('');
      setIsCustomerModalOpen(true);
    } else {
      setIsQuotationModalOpen(true);
    }
  };

  // Handle submit of customer name & phone modal
  const handleConfirmCustomerDetails = (e) => {
    e.preventDefault();
    let hasError = false;

    if (!customerForm.clientName || !customerForm.clientName.trim()) {
      setNameError('Please enter customer / client name');
      hasError = true;
    }

    const rawPhone = (customerForm.contact_phone || '').trim();
    const cleanPhone = rawPhone.replace(/\D/g, '');

    if (!rawPhone) {
      setPhoneError('Phone number is compulsory');
      hasError = true;
    } else if (cleanPhone.length < 10) {
      setPhoneError('Please enter a valid 10-digit mobile number');
      hasError = true;
    }

    if (hasError) return;

    const formattedPhone = cleanPhone.slice(-10);

    const updatedClient = {
      ...clientDetails,
      clientName: customerForm.clientName.trim(),
      contact_phone: formattedPhone,
      location: customerForm.location.trim() || clientDetails.location,
      projectName: customerForm.projectName.trim() || clientDetails.projectName
    };

    setClientDetails(updatedClient);
    setFormData(prev => ({ ...prev, contact_phone: formattedPhone }));

    setIsCustomerModalOpen(false);

    if (pendingAction === 'download') {
      setTimeout(() => {
        executePrint(updatedClient, itemsList.length > 0 ? itemsList : [buildCurrentWorkItem()]);
      }, 150);
    } else {
      setIsQuotationModalOpen(true);
    }
  };

  // Generate and print the official 2-Page Letterhead PDF Quote via iframe
  const executePrint = (client, itemsToPrint) => {
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
    const origin = window.location.origin;

    const printBasePrice = itemsToPrint.reduce((sum, item) => sum + item.basePrice, 0);
    const printFeaturesTotal = itemsToPrint.reduce((sum, item) => sum + item.featuresTotal, 0);
    const printSubtotal = printBasePrice + printFeaturesTotal;
    const printGst = formData.includeGST ? Math.round(printSubtotal * 0.18) : 0;
    const printFinalCost = printSubtotal + printGst;
    const printTotalArea = itemsToPrint.reduce((sum, item) => sum + item.area, 0);

    const scopeRows = getScopeOfWorkForItems(itemsToPrint).map((item, idx) => `
      <tr style="border-bottom: 1px solid #f1d5d5; background: ${idx % 2 === 0 ? '#ffffff' : '#fdf8f8'};">
        <td style="padding: 6px 10px; font-weight: 600; color: #111; font-style: italic; vertical-align: top; width: 34%;">${item.work}</td>
        <td style="padding: 6px 10px; color: #333; font-style: italic; vertical-align: top; width: 66%;">${item.desc}</td>
      </tr>
    `).join('');

    const itemizedRows = itemsToPrint.map((item, idx) => `
      <tr style="border-bottom: 1px solid #f1d5d5; background: ${idx % 2 === 0 ? '#ffffff' : '#fdf8f8'};">
        <td style="padding: 6px 8px; font-weight: bold; color: #555; text-align: center;">${idx + 1}</td>
        <td style="padding: 6px 8px; font-weight: 600; color: #111;">
          ${item.projectTypeName} ${item.roomLabel ? `<span style="color: #666; font-weight: normal;">(${item.roomLabel})</span>` : ''}
          ${item.additionalFeatures && item.additionalFeatures.length > 0 
            ? `<div style="font-size: 8.5px; color: #777; font-weight: normal; margin-top: 2px;">+ Add-ons: ${item.additionalFeatures.map(f => f.name).join(', ')}</div>` 
            : ''}
        </td>
        <td style="padding: 6px 8px; color: #333; font-size: 10px;">
          ${item.packageName} (${item.length}ft × ${item.width}ft = ${item.area} sq.ft)
        </td>
        <td style="padding: 6px 8px; text-align: right; font-weight: bold; color: #111;">
          ₹${item.itemTotal.toLocaleString('en-IN')}
        </td>
      </tr>
    `).join('');

    const worksOverviewText = itemsToPrint.map(i => i.roomLabel ? `${i.projectTypeName} (${i.roomLabel})` : i.projectTypeName).join(', ');

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Quotation_${(client.clientName || 'Customer').replace(/\\s+/g, '_')}_${client.quotationNo || 'CGI_2026'}</title>
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

              <div style="height: 1.5px; background: #c0142b; margin: 8px 0 14px;"></div>

              <!-- Project & Client Metadata Box (CLIENT NAME PROMINENTLY DISPLAYED) -->
              <div style="display: flex; justify-content: space-between; align-items: flex-start; font-size: 11.5px; margin-bottom: 12px; line-height: 1.5; background: #faf8f8; border: 1px solid #ebd4d4; border-radius: 4px; padding: 8px 12px;">
                <div>
                  <p style="margin: 1px 0;">
                    <span style="color: #666; font-size: 10px; text-transform: uppercase; font-weight: bold; letter-spacing: 0.5px;">Quotation Prepared For:</span>
                  </p>
                  <p style="margin: 2px 0;">
                    <strong style="font-size: 14px; color: #c0142b; text-transform: uppercase;">${client.clientName || 'Valued Customer'}</strong>
                  </p>
                  <p style="margin: 1px 0;">
                    <span style="color: #444;">Project Scope:</span> <strong>${client.projectName || 'Interior Works'}</strong>
                  </p>
                  ${client.location ? `<p style="margin: 1px 0;"><span style="color: #444;">Site / Location:</span> <strong>${client.location}</strong></p>` : ''}
                  ${client.contact_phone ? `<p style="margin: 1px 0;"><span style="color: #444;">Contact Phone:</span> <strong>+91 ${client.contact_phone}</strong></p>` : ''}
                </div>
                <div style="text-align: right;">
                  <p style="margin: 1px 0;"><span style="color: #444;">Quotation No:</span> <strong>${client.quotationNo || 'CGI/2026/502'}</strong></p>
                  <p style="margin: 1px 0;"><span style="color: #444;">Date:</span> <strong>${client.date}</strong></p>
                  <p style="margin: 1px 0;"><span style="color: #444;">Validity:</span> ${client.validity || '15 Days'}</p>
                </div>
              </div>

              <h2 style="text-align: center; color: #c0142b; font-family: 'Times New Roman', serif; text-decoration: underline; font-size: 15px; font-weight: 700; margin: 12px 0 10px;">
                Luxury Design Proposal
              </h2>

              <div style="border-left: 2px solid #c0142b; padding-left: 14px; margin-left: 2px;">
                <!-- DESIGN CONCEPT -->
                <div style="margin-bottom: 14px;">
                  <h3 style="color: #c0142b; font-size: 11px; font-weight: 800; text-transform: uppercase; margin: 0 0 4px; display: flex; align-items: center; gap: 6px;">
                    <span style="color: #eab308; font-size: 12px;">✦</span> DESIGN CONCEPT & SCOPE
                  </h3>
                  <p style="font-size: 10px; font-style: italic; color: #222; line-height: 1.55; margin: 0; text-align: justify;">
                    A personalized luxury interior design proposal curated exclusively for <strong>${client.clientName || 'our client'}</strong> covering <strong>${worksOverviewText}</strong> spanning a total calculated layout area of <strong>${printTotalArea} sq.ft</strong>. Designed with high-durability BWP marine materials, smooth edge-banding, designer aesthetics, and precision laser alignment as discussed.
                  </p>
                </div>

                <!-- SCOPE OF WORK -->
                <div style="margin-bottom: 12px;">
                  <h3 style="color: #c0142b; font-size: 11px; font-weight: 800; text-transform: uppercase; margin: 0 0 6px; display: flex; align-items: center; gap: 6px;">
                    <span style="color: #eab308; font-size: 12px;">✦</span> SCOPE OF WORK DETAILS
                  </h3>
                  <div style="border-radius: 2px; overflow: hidden; border: 1px solid #c0142b;">
                    <table style="font-size: 10px;">
                      <thead>
                        <tr style="background: #b91c1c; color: #ffffff;">
                          <th style="padding: 5px 10px; text-align: left; font-weight: bold; width: 34%; font-style: italic;">Scope / Work Item</th>
                          <th style="padding: 5px 10px; text-align: left; font-weight: bold; width: 66%; font-style: italic;">Specifications & Execution</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${scopeRows}
                      </tbody>
                    </table>
                  </div>
                </div>

                <!-- NOT INCLUDED -->
                <div style="margin-bottom: 8px;">
                  <h3 style="color: #c0142b; font-size: 10.5px; font-weight: 800; text-transform: uppercase; margin: 0 0 4px; display: flex; align-items: center; gap: 6px;">
                    <span style="color: #eab308; font-size: 12px;">✦</span> NOT INCLUDED
                  </h3>
                  <ul style="margin: 0; padding-left: 4px; list-style: none; font-size: 9.5px; font-style: italic; color: #333; line-height: 1.55;">
                    <li>• Electrical wiring, electrical points, fixtures and related heavy electrical work.</li>
                    <li>• Wooden garnish or any woodwork beyond agreed scope.</li>
                    <li>• Final colour paint/painting work is not included unless specified.</li>
                    <li>• Any additional work or design modifications beyond the approved scope will be charged separately.</li>
                  </ul>
                </div>
              </div>
            </div>

            <div style="text-align: right; font-size: 9.5px; color: #888; padding-top: 8px;">
              Page 1 of 2
            </div>
          </div>

          <!-- PAGE 2 -->
          <div class="a4-page">
            <div>
              <div style="border-left: 2px solid #c0142b; padding-left: 14px; margin-left: 2px; padding-top: 6px;">
                <!-- WARRANTY -->
                <div style="margin-bottom: 12px;">
                  <h3 style="color: #c0142b; font-size: 10.5px; font-weight: 800; text-transform: uppercase; margin: 0 0 3px; display: flex; align-items: center; gap: 6px;">
                    <span style="color: #eab308; font-size: 12px;">✦</span> WARRANTY & WORKMANSHIP ASSURANCE
                  </h3>
                  <h4 style="font-size: 11px; font-weight: 800; margin: 2px 0 3px; color: #111;">
                    ${client.warrantyYears || '20'} YEARS WORKMANSHIP WARRANTY
                  </h4>
                  <p style="font-size: 10px; font-style: italic; color: #222; line-height: 1.45; margin: 0 0 3px;">
                    The executed interior work is covered under our official ${client.warrantyYears || '20'}-year warranty against workmanship defects, subject to standard site conditions.
                  </p>
                  <p style="font-size: 9px; font-style: italic; color: #555; margin: 0; line-height: 1.4;">
                    Note: Warranty excludes seepage, severe external water damage, civil movement, or third-party electrical modifications.
                  </p>
                </div>

                <div style="height: 1px; background: #f0dada; margin: 10px 0;"></div>

                <!-- PAYMENT TERMS -->
                <div style="margin-bottom: 12px;">
                  <p style="font-size: 10px; line-height: 1.5; margin: 0;">
                    <span style="color: #c0142b; text-decoration: underline; font-weight: bold;">Payment Terms:</span> Work commences upon receipt of 60% advance. Mid-work stage payment of 30% upon structure readiness, and remaining 10% upon final installation handover.
                  </p>
                </div>

                <div style="height: 1px; background: #f0dada; margin: 10px 0;"></div>

                <!-- ESTIMATED TIMELINE -->
                <div style="margin-bottom: 12px;">
                  <h3 style="color: #c0142b; font-size: 10.5px; font-weight: 800; text-transform: uppercase; margin: 0 0 3px; display: flex; align-items: center; gap: 6px;">
                    <span style="color: #eab308; font-size: 12px;">✦</span> ESTIMATED TIMELINE
                  </h3>
                  <h4 style="font-size: 11px; font-weight: 800; margin: 2px 0 3px; color: #111;">
                    ${client.workingDays || '10–15'} WORKING DAYS
                  </h4>
                  <p style="font-size: 10px; font-style: italic; color: #222; line-height: 1.45; margin: 0 0 2px;">
                    Estimated handover period is ${client.workingDays || '10–15'} working days from date of commencement and site clearance.
                  </p>
                </div>

                <div style="height: 1px; background: #f0dada; margin: 10px 0;"></div>

                <!-- PRICE DESCRIPTION & ITEMIZED BREAKDOWN TABLE -->
                <div style="margin-bottom: 16px;">
                  <h3 style="color: #c0142b; font-size: 11px; font-weight: 800; text-transform: uppercase; margin: 0 0 8px; display: flex; align-items: center; gap: 6px;">
                    <span style="color: #eab308; font-size: 12px;">✦</span> PRICE DESCRIPTION & ITEMIZED SUMMARY
                  </h3>

                  <!-- Itemized Table -->
                  <div style="border-radius: 2px; overflow: hidden; border: 1px solid #c0142b; margin-bottom: 10px;">
                    <table style="font-size: 10px;">
                      <thead>
                        <tr style="background: #b91c1c; color: #ffffff;">
                          <th style="padding: 5px 8px; text-align: center; width: 6%;">#</th>
                          <th style="padding: 5px 8px; text-align: left; width: 38%;">Scope / Work Item</th>
                          <th style="padding: 5px 8px; text-align: left; width: 32%;">Package & Dimensions</th>
                          <th style="padding: 5px 8px; text-align: right; width: 24%;">Amount (₹)</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${itemizedRows}
                      </tbody>
                      <tfoot>
                        <tr style="border-top: 1.5px solid #c0142b; background: #fff5f5; font-weight: 600;">
                          <td colspan="3" style="padding: 5px 8px; text-align: right;">Subtotal:</td>
                          <td style="padding: 5px 8px; text-align: right;">₹${printSubtotal.toLocaleString('en-IN')}</td>
                        </tr>
                        ${formData.includeGST ? `
                        <tr style="background: #fff5f5;">
                          <td colspan="3" style="padding: 4px 8px; text-align: right; color: #555;">GST (18%):</td>
                          <td style="padding: 4px 8px; text-align: right; color: #555;">₹${printGst.toLocaleString('en-IN')}</td>
                        </tr>` : ''}
                        <tr style="background: #ffff00; font-weight: 800; font-size: 11.5px; color: #000;">
                          <td colspan="3" style="padding: 6px 8px; text-align: right;">Total Quotation Cost:</td>
                          <td style="padding: 6px 8px; text-align: right;">₹${printFinalCost.toLocaleString('en-IN')}/-</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>

                  <p style="font-size: 9.5px; font-style: italic; color: #333; line-height: 1.45; margin: 0; text-align: justify;">
                    The quoted price includes the complete agreed scope of works including all specified materials, master layout, edge-banding, hardware fittings, primer finishing, and installation.
                  </p>
                </div>
              </div>

              <!-- Signatory Section -->
              <div style="display: flex; justify-content: flex-end; margin-top: 16px; margin-bottom: 8px;">
                <div style="text-align: center; position: relative; padding-right: 16px; min-width: 200px;">
                  <p style="font-size: 11px; font-weight: 700; color: #111; margin: 0 0 4px;">
                    For Cherry Gold Interiors Pvt Ltd
                  </p>
                  <div style="position: relative; height: 75px; margin: 2px 0; display: flex; align-items: center; justify-content: center;">
                    <img src="${origin}/images/company-stamp.svg" style="position: absolute; width: 92px; height: 92px; opacity: 0.85; transform: rotate(-8deg); left: 15px;" />
                    <img src="${origin}/images/signature.svg" style="position: relative; z-index: 10; width: 120px; height: auto; opacity: 0.95; transform: rotate(-2deg);" />
                  </div>
                  <p style="font-weight: 800; font-size: 11.5px; margin: 2px 0 1px; color: #111;">
                    Ankit Sharma
                  </p>
                  <p style="font-weight: 600; font-size: 9.5px; margin: 1px 0; color: #333;">
                    Founder & Interior Designer
                  </p>
                  <p style="font-weight: 600; font-size: 9px; margin: 1px 0; color: #555;">
                    Authorized Signatory
                  </p>
                </div>
              </div>
            </div>

            <!-- Footer -->
            <div>
              <div style="height: 1.5px; background: #c9a84c; margin: 12px 0 4px;"></div>
              <div style="text-align: center; color: #c9a84c; font-size: 9.5px; font-weight: 600; letter-spacing: 0.3px;">
                www.cherrygoldinteriors.com | info@cherrygoldinteriors.com
              </div>
              <div style="text-align: right; font-size: 9.5px; color: #888; margin-top: 6px;">
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
    }, 400);
  };

  return (
    <div className="py-24 lg:py-32 bg-[#FDFBD4] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 no-print">
        
        {/* Page Heading */}
        <div className="text-center mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-100 text-red-700 text-xs font-bold mb-3">
            <Sparkles size={14} /> Multi-Room Quotation Builder
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3 tracking-tight">
            Cost Estimator & Quotation Generator
          </h1>
          <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
            Configure all your interior requirements — Modular Kitchen, Wardrobe, False Ceiling, Paneling — into one comprehensive proposal and download your official PDF quote.
          </p>
        </div>

        {/* Success toast notification */}
        {successToast && (
          <div className="mb-6 max-w-xl mx-auto bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-lg flex items-center justify-between text-sm font-semibold animate-bounce">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={18} />
              <span>{successToast}</span>
            </div>
            <button onClick={() => setSuccessToast('')} className="p-1 hover:bg-emerald-700 rounded-lg">
              <X size={16} />
            </button>
          </div>
        )}

        {/* 2-Column Grid: Left Work Form, Right Quotation Summary Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ========================================================================= */}
          {/* LEFT COLUMN: Add Work / Service Form                                     */}
          {/* ========================================================================= */}
          <div className="lg:col-span-6 bg-[#f1f1de] rounded-2xl shadow-lg p-6 sm:p-8 border border-[#e5e5ce]">
            
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-300">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-red-600 text-white flex items-center justify-center shadow-md">
                  <Calculator size={20} />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 leading-tight">
                    Add Work to Quotation
                  </h2>
                  <p className="text-xs text-gray-500">
                    Step {itemsList.length + 1}: Select service & room details
                  </p>
                </div>
              </div>

              {itemsList.length > 0 && (
                <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold border border-red-200">
                  {itemsList.length} Work{itemsList.length > 1 ? 's' : ''} in Quote
                </span>
              )}
            </div>

            <form onSubmit={handleAddWorkToQuotation} className="space-y-5">
              
              {/* 1. Project / Work Type Selector */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  1. Select Work Type *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {projectTypes.map(type => {
                    const isSelected = formData.projectType === type.id;
                    return (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, projectType: type.id })}
                        className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                          isSelected
                            ? 'bg-red-600 text-white border-red-600 shadow-md ring-2 ring-red-300'
                            : 'bg-white hover:bg-gray-50 text-gray-800 border-gray-200'
                        }`}
                      >
                        <span className="font-bold text-xs truncate">{type.name}</span>
                        <span className={`text-[10px] mt-1 ${isSelected ? 'text-red-100' : 'text-gray-500'}`}>
                          from ₹{type.baseRate}/sq ft
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Optional Room / Space Label */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                    2. Room / Space Name (Optional)
                  </label>
                  <span className="text-[11px] text-gray-500">helps distinguish multiple works</span>
                </div>
                
                <input
                  type="text"
                  name="roomLabel"
                  value={formData.roomLabel}
                  onChange={handleInputChange}
                  placeholder="e.g. Master Bedroom, Living Room, Kitchen 2..."
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white text-gray-800 text-xs sm:text-sm"
                />

                {/* Quick Chips */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {commonRooms.map(room => (
                    <button
                      key={room}
                      type="button"
                      onClick={() => setFormData({ ...formData, roomLabel: room })}
                      className={`text-[11px] px-2 py-0.5 rounded-md border transition-all ${
                        formData.roomLabel === room 
                          ? 'bg-red-600 text-white border-red-600' 
                          : 'bg-white/80 text-gray-600 border-gray-200 hover:border-gray-400'
                      }`}
                    >
                      + {room}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Package Selection (Dynamic per Work Type) */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  3. Select Package / Quality Tier *
                </label>

                {formData.projectType === 'kitchen' && (
                  <select
                    name="kitchenPackage"
                    value={formData.kitchenPackage}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 bg-white text-gray-800 text-xs sm:text-sm font-medium"
                  >
                    {kitchenPackages.map(pkg => (
                      <option key={pkg.id} value={pkg.id}>
                        {pkg.name} — ₹{pkg.rate}/sq.ft ({pkg.description})
                      </option>
                    ))}
                  </select>
                )}

                {formData.projectType === 'wardrobe' && (
                  <select
                    name="wardrobePackage"
                    value={formData.wardrobePackage}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 bg-white text-gray-800 text-xs sm:text-sm font-medium"
                  >
                    {wardrobePackages.map(pkg => (
                      <option key={pkg.id} value={pkg.id}>
                        {pkg.name} — ₹{pkg.rate}/sq.ft ({pkg.description})
                      </option>
                    ))}
                  </select>
                )}

                {formData.projectType === 'false-ceiling' && (
                  <select
                    name="falseCeilingType"
                    value={formData.falseCeilingType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 bg-white text-gray-800 text-xs sm:text-sm font-medium"
                  >
                    {falseCeilingTypes.map(type => (
                      <option key={type.id} value={type.id}>
                        {type.name} — ₹{type.rate}/sq.ft ({type.description})
                      </option>
                    ))}
                  </select>
                )}

                {formData.projectType === 'wall-paneling' && (
                  <select
                    name="wallPanelingPackage"
                    value={formData.wallPanelingPackage}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 bg-white text-gray-800 text-xs sm:text-sm font-medium"
                  >
                    {wallPanelingPackages.map(pkg => (
                      <option key={pkg.id} value={pkg.id}>
                        {pkg.name} — ₹{pkg.rate}/sq.ft ({pkg.description})
                      </option>
                    ))}
                  </select>
                )}

                {formData.projectType === 'interior-decoration' && (
                  <select
                    name="interiorPackage"
                    value={formData.interiorPackage}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 bg-white text-gray-800 text-xs sm:text-sm font-medium"
                  >
                    {interiorPackages.map(pkg => (
                      <option key={pkg.id} value={pkg.id}>
                        {pkg.name} — ₹{pkg.rate}/sq.ft ({pkg.description})
                      </option>
                    ))}
                  </select>
                )}

                {formData.projectType === 'complete-home' && (
                  <div className="p-3 bg-white rounded-lg border border-gray-200 text-xs text-gray-700">
                    <span className="font-bold text-gray-900">Luxury Turnkey Plan:</span> ₹1,600/sq.ft covering living, kitchen, master & guest bedroom turnkey woodwork.
                  </div>
                )}
              </div>

              {/* 4. Dimensions (Length & Width) */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                    4. Area Dimensions (Feet) *
                  </label>
                  <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                    Area: {(parseFloat(formData.length || 0) * parseFloat(formData.width || 0))} sq ft
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-gray-500 mb-1">Length (ft)</label>
                    <input
                      type="number"
                      name="length"
                      value={formData.length}
                      onChange={handleInputChange}
                      required
                      min="1"
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 bg-white text-gray-800 text-xs sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-gray-500 mb-1">Width / Height (ft)</label>
                    <input
                      type="number"
                      name="width"
                      value={formData.width}
                      onChange={handleInputChange}
                      required
                      min="1"
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 bg-white text-gray-800 text-xs sm:text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* 5. Optional Add-on Features for this work */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                    5. Add-on Accessories for this Work
                  </label>
                  <span className="text-[11px] text-gray-500 font-medium">(Optional upgrades)</span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {additionalFeatures.map(feat => {
                    const isSelected = formData.additionalFeatures.includes(feat.id);
                    return (
                      <label 
                        key={feat.id} 
                        className={`flex items-center justify-between gap-2 p-2 rounded-lg border transition-all cursor-pointer ${
                          isSelected 
                            ? 'border-red-400 bg-red-50 shadow-sm' 
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => handleFeatureChange(feat.id, e.target.checked)}
                            className="rounded text-red-600 focus:ring-red-500 w-3.5 h-3.5 flex-shrink-0 cursor-pointer"
                          />
                          <span className={`truncate text-xs ${isSelected ? 'text-red-900 font-bold' : 'text-gray-700'}`}>
                            {feat.name}
                          </span>
                        </div>
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold flex-shrink-0 ${
                          isSelected ? 'bg-red-600 text-white' : 'bg-gray-100 text-red-600'
                        }`}>
                          +₹{feat.cost.toLocaleString('en-IN')}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="w-full bg-[#c0142b] hover:bg-[#a01024] text-white py-3.5 px-6 rounded-xl font-bold transition-all shadow-md hover:shadow-lg text-sm flex items-center justify-center gap-2"
                >
                  <Plus size={18} />
                  <span>+ Add This Work to Quotation</span>
                </button>
                <p className="text-center text-[11px] text-gray-500 mt-2">
                  You can add multiple rooms & works (Kitchen, Wardrobe, Ceiling) together.
                </p>
              </div>

            </form>
          </div>


          {/* ========================================================================= */}
          {/* RIGHT COLUMN: Quotation Summary with All Added Works & PDF Download       */}
          {/* ========================================================================= */}
          <div className="lg:col-span-6 bg-[#f1f1de] rounded-2xl shadow-lg p-6 sm:p-8 border border-[#e5e5ce] sticky top-28">
            
            {/* Header */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-300">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Quotation Summary</h3>
                <p className="text-xs text-gray-600">
                  {itemsList.length === 0 
                    ? 'No works added yet. Click "+ Add This Work" on the left.'
                    : `${itemsList.length} Work${itemsList.length > 1 ? 's' : ''} combined in this quotation proposal`}
                </p>
              </div>

              {itemsList.length > 0 && (
                <button
                  onClick={() => setItemsList([])}
                  className="text-xs text-red-600 hover:text-red-800 font-semibold underline"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* List of Added Works */}
            {itemsList.length > 0 ? (
              <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1 mb-4">
                {itemsList.map((item, index) => (
                  <div 
                    key={item.id} 
                    className="bg-white rounded-xl p-3.5 border border-gray-200 shadow-sm relative group hover:border-red-300 transition-all"
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="w-5 h-5 rounded-full bg-red-100 text-red-700 text-xs font-bold flex items-center justify-center flex-shrink-0">
                            {index + 1}
                          </span>
                          <h4 className="font-bold text-gray-900 text-sm truncate">
                            {item.projectTypeName}
                            {item.roomLabel && (
                              <span className="ml-1 text-xs text-gray-500 font-normal">
                                ({item.roomLabel})
                              </span>
                            )}
                          </h4>
                          <span className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-700 rounded font-medium">
                            {item.packageName}
                          </span>
                        </div>

                        <p className="text-xs text-gray-500 mt-1 pl-7">
                          {item.length}ft × {item.width}ft = <strong className="text-gray-700">{item.area} sq ft</strong> @ ₹{item.baseRate}/sq ft
                        </p>

                        {/* Add-ons tag list */}
                        {item.additionalFeatures && item.additionalFeatures.length > 0 && (
                          <div className="pl-7 mt-1.5 flex flex-wrap gap-1">
                            {item.additionalFeatures.map(feat => (
                              <span key={feat.id} className="text-[10px] bg-red-50 text-red-700 px-1.5 py-0.5 rounded font-medium">
                                + {feat.name}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2.5 flex-shrink-0">
                        <span className="font-extrabold text-gray-900 text-sm">
                          ₹{item.itemTotal.toLocaleString('en-IN')}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Remove this work"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 px-4 bg-white/60 rounded-xl border border-dashed border-gray-300 mb-4">
                <Home className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-gray-700">Quotation is Currently Empty</h4>
                <p className="text-xs text-gray-500 max-w-xs mx-auto mt-1">
                  Configure your room on the left (e.g. Modular Kitchen) and click <strong className="text-red-600 font-semibold">+ Add This Work</strong> to start building your quote.
                </p>
              </div>
            )}

            {/* Client Info Status Banner */}
            <div className="bg-white rounded-xl p-3.5 border border-gray-200 mb-4 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center flex-shrink-0">
                  <User size={16} />
                </div>
                <div className="truncate">
                  <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">
                    Quotation Prepared For:
                  </span>
                  <strong className="text-gray-900 text-xs truncate block">
                    {clientDetails.clientName ? clientDetails.clientName : 'Customer Name (Required)'}
                  </strong>
                  <span className="text-[10px] block truncate">
                    Phone: {clientDetails.contact_phone 
                      ? <strong className="text-gray-700">+91 {clientDetails.contact_phone}</strong> 
                      : <span className="text-red-600 font-semibold">Required (Compulsory)</span>}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setPendingAction('download');
                  setCustomerForm({
                    clientName: clientDetails.clientName || '',
                    contact_phone: clientDetails.contact_phone || formData.contact_phone || '',
                    location: clientDetails.location || '',
                    projectName: clientDetails.projectName || ''
                  });
                  setNameError('');
                  setPhoneError('');
                  setIsCustomerModalOpen(true);
                }}
                className="px-2.5 py-1 text-xs text-red-600 hover:text-red-800 hover:bg-red-50 font-bold rounded-lg transition-colors flex items-center gap-1 flex-shrink-0"
              >
                <Edit3 size={13} />
                {clientDetails.clientName && clientDetails.contact_phone ? 'Edit Details' : '+ Set Details'}
              </button>
            </div>

            {/* Financial Summary */}
            {itemsList.length > 0 && (
              <div className="space-y-2.5 pt-3 border-t border-gray-300 text-xs sm:text-sm">
                
                <div className="flex justify-between items-center text-gray-700">
                  <span>Base Works Total ({itemsList.length} items, {totalArea} sq ft)</span>
                  <span className="font-semibold text-gray-900">₹{totalBasePrice.toLocaleString('en-IN')}</span>
                </div>

                {totalFeaturesTotal > 0 && (
                  <div className="flex justify-between items-center text-gray-700">
                    <span>Accessories & Add-ons</span>
                    <span className="font-semibold text-gray-900">+₹{totalFeaturesTotal.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="flex justify-between items-center text-gray-700">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>

                {/* GST Toggle */}
                <div className="flex items-center justify-between p-2.5 bg-amber-50 rounded-lg border border-amber-200">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="summary-gst"
                      checked={formData.includeGST}
                      onChange={(e) => setFormData(prev => ({ ...prev, includeGST: e.target.checked }))}
                      className="w-4 h-4 text-red-600 rounded focus:ring-red-500 cursor-pointer"
                    />
                    <label htmlFor="summary-gst" className="text-xs font-semibold text-gray-800 cursor-pointer">
                      Include GST (18%)
                    </label>
                  </div>
                  <span className="text-xs font-bold text-gray-900">
                    {formData.includeGST ? `₹${gst.toLocaleString('en-IN')}` : '₹0'}
                  </span>
                </div>

                {/* Grand Total */}
                <div className="border-t border-gray-300 pt-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-sm sm:text-base font-bold text-gray-900 block">Total Project Cost</span>
                      <span className="text-[11px] text-gray-500">Includes materials, design & installation</span>
                    </div>
                    <span className="text-2xl sm:text-3xl font-extrabold text-[#c0142b]">
                      ₹{finalCost.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

              </div>
            )}

            {/* Action Buttons: Prompts for Customer Name before PDF download */}
            <div className="space-y-3 pt-5 mt-4 border-t border-gray-300">
              <button 
                onClick={handleRequestDownload}
                className="w-full bg-[#c0142b] hover:bg-[#a01024] text-white py-3.5 px-4 rounded-xl font-bold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-sm"
              >
                <Download size={16} />
                <span>Download Official PDF Quotation (Letterhead)</span>
              </button>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleRequestLetterheadPreview}
                  className="bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                >
                  <FileText size={14} className="text-red-600" />
                  <span>View Letterhead</span>
                </button>
                
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-amber-100 hover:bg-amber-200 text-amber-900 py-2.5 px-3 rounded-xl text-xs font-bold transition-colors shadow-sm"
                >
                  Book Free Consultation
                </button>
              </div>
            </div>

          </div>

        </div>

        {/* ========================================================================= */}
        {/* EXAMPLE CALCULATIONS SECTION                                              */}
        {/* ========================================================================= */}
        <div className="mt-16 bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Example Project Calculations</h3>

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

            {/* Wardrobe Example */}
            <div className="bg-purple-50/70 rounded-xl p-6 border border-purple-100">
              <h4 className="font-bold text-gray-900 mb-3">Master Wardrobe - 8ft × 9ft</h4>
              <div className="text-sm space-y-2 text-gray-700">
                <p><span className="font-medium text-gray-900">Area:</span> 8 × 9 = 72 sq ft</p>
                <p><span className="font-medium text-gray-900">Premium Package:</span> ₹1,400 per sq ft</p>
                <p><span className="font-medium text-gray-900">Base Cost:</span> 72 × ₹1,400 = ₹1,00,800</p>
                <p><span className="font-medium text-gray-900">GST (18%):</span> ₹18,144</p>
                <p className="font-bold text-purple-700 pt-2 border-t border-purple-200"><span className="font-medium text-gray-900">Total:</span> ₹1,18,944</p>
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
                <p className="font-bold text-emerald-600 pt-2 border-t border-green-200"><span className="font-medium text-gray-900">Total:</span> ₹29,736</p>
              </div>
            </div>
          </div>
        </div>

      </div>


      {/* ========================================================================= */}
      {/* CUSTOMER NAME & DETAILS MODAL (MANDATORY BEFORE PDF DOWNLOAD)              */}
      {/* ========================================================================= */}
      {isCustomerModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 no-print animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-100">
            
            <div className="bg-[#c0142b] p-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                  <User size={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold">Client Quotation Details</h3>
                  <p className="text-xs text-red-100">Enter customer name for the official proposal</p>
                </div>
              </div>
              <button 
                onClick={() => setIsCustomerModalOpen(false)}
                className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleConfirmCustomerDetails} className="p-6 space-y-4">
              
              {/* Customer Name */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Customer / Client Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3 top-3.5 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={customerForm.clientName}
                    onChange={(e) => {
                      setCustomerForm({ ...customerForm, clientName: e.target.value });
                      if (nameError) setNameError('');
                    }}
                    placeholder="e.g. Mr. Narayan Jana / Priya Roy"
                    className="w-full pl-9 pr-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm bg-white"
                    autoFocus
                  />
                </div>
                {nameError && (
                  <p className="text-xs text-red-600 font-semibold mt-1">{nameError}</p>
                )}
                <p className="text-[11px] text-gray-500 mt-1">
                  This name will be printed on Page 1 & Page 2 of the official letterhead quotation.
                </p>
              </div>

              {/* Phone Number (Compulsory) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Contact Phone Number *
                  </label>
                  <span className="text-[10px] text-red-600 font-bold uppercase tracking-wider bg-red-50 px-1.5 py-0.5 rounded border border-red-200">
                    Compulsory
                  </span>
                </div>
                <div className="relative">
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3.5 pointer-events-none" />
                  <input
                    type="tel"
                    required
                    value={customerForm.contact_phone}
                    onChange={(e) => {
                      setCustomerForm({ ...customerForm, contact_phone: e.target.value });
                      if (phoneError) setPhoneError('');
                    }}
                    placeholder="Enter 10-digit mobile number (e.g. 9433889668)"
                    className={`w-full pl-9 pr-3.5 py-2.5 border rounded-lg focus:ring-2 focus:ring-red-500 text-sm bg-white ${
                      phoneError ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300'
                    }`}
                  />
                </div>
                {phoneError && (
                  <p className="text-xs text-red-600 font-semibold mt-1">{phoneError}</p>
                )}
                <p className="text-[11px] text-gray-500 mt-1">
                  10-digit mobile number is required to generate your official quotation.
                </p>
              </div>

              {/* Site Location */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Project Location / Address (Optional)
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-3.5 pointer-events-none" />
                  <input
                    type="text"
                    value={customerForm.location}
                    onChange={(e) => setCustomerForm({ ...customerForm, location: e.target.value })}
                    placeholder="e.g. Noapara, Belgharia 700090"
                    className="w-full pl-9 pr-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-sm bg-white"
                  />
                </div>
              </div>

              {/* Project Title */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Project Work Title
                </label>
                <input
                  type="text"
                  value={customerForm.projectName}
                  onChange={(e) => setCustomerForm({ ...customerForm, projectName: e.target.value })}
                  placeholder="e.g. Modular Kitchen & Wardrobe Interior Work"
                  className="w-full px-3.5 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-xs sm:text-sm bg-white"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-3 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsCustomerModalOpen(false)}
                  className="px-4 py-2.5 rounded-lg text-xs font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#c0142b] hover:bg-[#a01024] text-white px-5 py-2.5 rounded-lg text-xs font-bold flex items-center gap-2 shadow-md transition-all"
                >
                  <Download size={14} />
                  <span>{pendingAction === 'download' ? 'Download Official PDF' : 'Open Letterhead'}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}


      {/* ========================================================================= */}
      {/* SCREEN MODAL: INTERACTIVE 2-PAGE LETTERHEAD PREVIEW                        */}
      {/* ========================================================================= */}
      {isQuotationModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 no-print">
          
          <div className="bg-gray-100 rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden flex flex-col max-h-[92vh]">
            
            {/* Modal Top Control Bar */}
            <div className="bg-white px-4 sm:px-6 py-3.5 border-b border-gray-200 flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="font-bold text-sm text-gray-900">
                  Official Letterhead Proposal ({clientDetails.quotationNo})
                </span>
                {clientDetails.clientName && (
                  <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-bold">
                    For: {clientDetails.clientName}
                  </span>
                )}
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
                  onClick={() => executePrint(clientDetails, itemsList.length > 0 ? itemsList : [buildCurrentWorkItem()])}
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
              <div className="bg-amber-50/90 px-4 sm:px-6 py-3 border-b border-amber-200 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-gray-700 block mb-1">Customer Name:</label>
                    <input
                      type="text"
                      value={clientDetails.clientName}
                      onChange={(e) => setClientDetails({ ...clientDetails, clientName: e.target.value })}
                      className="w-full px-2.5 py-1.5 border border-gray-300 rounded bg-white"
                      placeholder="e.g. Narayan Jana"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-gray-700 block mb-1">Project Title:</label>
                    <input
                      type="text"
                      value={clientDetails.projectName}
                      onChange={(e) => setClientDetails({ ...clientDetails, projectName: e.target.value })}
                      className="w-full px-2.5 py-1.5 border border-gray-300 rounded bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-gray-700 block mb-1">Quotation No:</label>
                    <input
                      type="text"
                      value={clientDetails.quotationNo}
                      onChange={(e) => setClientDetails({ ...clientDetails, quotationNo: e.target.value })}
                      className="w-full px-2.5 py-1.5 border border-gray-300 rounded bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-gray-700 block mb-1">Site Location:</label>
                    <input
                      type="text"
                      value={clientDetails.location}
                      onChange={(e) => setClientDetails({ ...clientDetails, location: e.target.value })}
                      className="w-full px-2.5 py-1.5 border border-gray-300 rounded bg-white"
                      placeholder="Kolkata"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Scrollable Document Container */}
            <div className="overflow-y-auto p-4 sm:p-6 flex-1 space-y-6 flex flex-col items-center">
              
              <div className="bg-white rounded-lg shadow-xl border border-gray-300 w-full max-w-2xl font-sans text-gray-900">
                
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

                  <div style={{ height: '1.5px', background: '#c0142b', margin: '8px 0 14px' }} />

                  {/* Project & Client Metadata Box (CLIENT NAME SHOWN) */}
                  <div className="flex justify-between items-start text-xs mb-3 leading-relaxed text-gray-900 bg-[#faf8f8] p-3 rounded border border-[#ebd4d4]">
                    <div>
                      <p style={{ margin: '1px 0', fontSize: '10px', textTransform: 'uppercase', color: '#666', fontWeight: 'bold' }}>
                        Quotation Prepared For:
                      </p>
                      <p style={{ margin: '1px 0' }}>
                        <strong style={{ fontSize: '13px', color: '#c0142b', textTransform: 'uppercase' }}>
                          {clientDetails.clientName || 'Valued Customer'}
                        </strong>
                      </p>
                      <p style={{ margin: '1px 0' }}>
                        <span style={{ color: '#555' }}>Project:</span> <strong>{clientDetails.projectName || 'Interior Work'}</strong>
                      </p>
                      {clientDetails.location && (
                        <p style={{ margin: '1px 0' }}>
                          <span style={{ color: '#555' }}>Site Location:</span> <strong>{clientDetails.location}</strong>
                        </p>
                      )}
                      {clientDetails.contact_phone && (
                        <p style={{ margin: '1px 0' }}>
                          <span style={{ color: '#555' }}>Phone:</span> <strong>+91 {clientDetails.contact_phone}</strong>
                        </p>
                      )}
                    </div>

                    <div className="text-right">
                      <p style={{ margin: '1px 0' }}>
                        <span style={{ color: '#555' }}>Quotation No:</span> <strong>{clientDetails.quotationNo || 'CGI/2026/502'}</strong>
                      </p>
                      <p style={{ margin: '1px 0' }}>
                        <span style={{ color: '#555' }}>Date:</span> <strong>{clientDetails.date}</strong>
                      </p>
                      <p style={{ margin: '1px 0' }}>
                        <span style={{ color: '#555' }}>Validity:</span> {clientDetails.validity || '15 Days'}
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
                      fontSize: '15px', 
                      fontWeight: '700', 
                      margin: '14px 0 10px' 
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
                    <div className="mb-3.5">
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
                        <span style={{ color: '#eab308', fontSize: '12px' }}>✦</span> DESIGN CONCEPT & SCOPE
                      </h3>
                      
                      <p 
                        style={{ 
                          fontSize: '10px', 
                          fontStyle: 'italic', 
                          color: '#222', 
                          lineHeight: '1.55', 
                          margin: 0,
                          textAlign: 'justify'
                        }}
                      >
                        A customized interior design proposal prepared for <strong>{clientDetails.clientName || 'our client'}</strong> covering <strong>{itemsList.length > 0 ? itemsList.map(i => i.roomLabel ? `${i.projectTypeName} (${i.roomLabel})` : i.projectTypeName).join(', ') : 'Modular Interior Work'}</strong> spanning a combined layout area of <strong>{totalArea || 120} sq.ft</strong>. Designed with premium BWP marine plywood, scratch-resistant surface finish, and precision laser alignment.
                      </p>
                    </div>

                    {/* SCOPE OF WORK */}
                    <div className="mb-3">
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
                        <span style={{ color: '#eab308', fontSize: '12px' }}>✦</span> SCOPE OF WORK
                      </h3>

                      <div style={{ borderRadius: '2px', overflow: 'hidden', border: '1px solid #c0142b' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10px' }}>
                          <thead>
                            <tr style={{ background: '#b91c1c', color: '#ffffff' }}>
                              <th style={{ padding: '5px 10px', textAlign: 'left', fontWeight: 'bold', width: '34%', fontStyle: 'italic' }}>
                                Work Item / Scope
                              </th>
                              <th style={{ padding: '5px 10px', textAlign: 'left', fontWeight: 'bold', width: '66%', fontStyle: 'italic' }}>
                                Execution Details & Specs
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {getScopeOfWorkForItems(itemsList.length > 0 ? itemsList : [buildCurrentWorkItem()]).map((item, idx) => (
                              <tr key={idx} style={{ borderBottom: '1px solid #f1d5d5', background: idx % 2 === 0 ? '#ffffff' : '#fdf8f8' }}>
                                <td style={{ padding: '5px 10px', fontWeight: '600', color: '#111', fontStyle: 'italic', verticalAlign: 'top' }}>
                                  {item.work}
                                </td>
                                <td style={{ padding: '5px 10px', color: '#333', fontStyle: 'italic', verticalAlign: 'top' }}>
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
                          fontSize: '10.5px', 
                          fontWeight: '800', 
                          textTransform: 'uppercase', 
                          margin: '0 0 4px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <span style={{ color: '#eab308', fontSize: '12px' }}>✦</span> NOT INCLUDED
                      </h3>
                      
                      <ul style={{ margin: 0, paddingLeft: '4px', listStyle: 'none', fontSize: '9.5px', fontStyle: 'italic', color: '#333', lineHeight: '1.55' }}>
                        <li>• Electrical wiring, electrical points, fixtures and related electrical work.</li>
                        <li>• Wooden garnish or any woodwork beyond agreed scope.</li>
                        <li>• Final colour paint/painting work is not included unless specified.</li>
                        <li>• Any additional work or design changes beyond agreed scope will be charged separately.</li>
                      </ul>
                    </div>

                  </div>

                  <div className="text-right text-[9.5px] text-gray-400 mt-3">
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
                    <div className="mb-3.5">
                      <h3 
                        style={{ 
                          color: '#c0142b', 
                          fontSize: '10.5px', 
                          fontWeight: '800', 
                          textTransform: 'uppercase', 
                          margin: '0 0 3px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <span style={{ color: '#eab308', fontSize: '12px' }}>✦</span> WARRANTY ASSURANCE
                      </h3>
                      
                      <h4 style={{ fontSize: '11px', fontWeight: '800', margin: '2px 0 3px', color: '#111' }}>
                        {clientDetails.warrantyYears || '20'} YEARS WORKMANSHIP WARRANTY
                      </h4>
                      
                      <p style={{ fontSize: '10px', fontStyle: 'italic', color: '#222', lineHeight: '1.45', margin: '0 0 2px' }}>
                        The interior works are covered under our {clientDetails.warrantyYears || '20'}-year warranty against workmanship defects under standard site conditions.
                      </p>
                      
                      <p style={{ fontSize: '9px', fontStyle: 'italic', color: '#555', margin: 0, lineHeight: '1.4' }}>
                        Note: Warranty does not cover damage caused by water leakage, seepage, moisture, structural movement, or third-party electrical work.
                      </p>
                    </div>

                    <div style={{ height: '1px', background: '#f0dada', margin: '10px 0' }} />

                    {/* PAYMENT TERMS */}
                    <div className="mb-3.5">
                      <p style={{ fontSize: '10px', lineHeight: '1.5', margin: 0 }}>
                        <span style={{ color: '#c0142b', textDecoration: 'underline', fontWeight: 'bold' }}>Payment Terms:</span> Work will commence upon receipt of 60% advance. The subsequent 30% payment will be due at mid-work stage, with remaining 10% payable upon handover.
                      </p>
                    </div>

                    <div style={{ height: '1px', background: '#f0dada', margin: '10px 0' }} />

                    {/* ESTIMATED TIMELINE */}
                    <div className="mb-3.5">
                      <h3 
                        style={{ 
                          color: '#c0142b', 
                          fontSize: '10.5px', 
                          fontWeight: '800', 
                          textTransform: 'uppercase', 
                          margin: '0 0 3px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <span style={{ color: '#eab308', fontSize: '12px' }}>✦</span> ESTIMATED TIMELINE
                      </h3>
                      
                      <h4 style={{ fontSize: '11px', fontWeight: '800', margin: '2px 0 3px', color: '#111' }}>
                        {clientDetails.workingDays || '10–15'} WORKING DAYS
                      </h4>
                      
                      <p style={{ fontSize: '10px', fontStyle: 'italic', color: '#222', lineHeight: '1.45', margin: 0 }}>
                        Estimated completion period is {clientDetails.workingDays || '10–15'} working days from date of site handover and material clearance.
                      </p>
                    </div>

                    <div style={{ height: '1px', background: '#f0dada', margin: '10px 0' }} />

                    {/* PRICE DESCRIPTION & ITEMIZED TABLE */}
                    <div className="mb-6">
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
                        <span style={{ color: '#eab308', fontSize: '12px' }}>✦</span> PRICE DESCRIPTION & ITEMIZED BREAKDOWN
                      </h3>

                      {/* Itemized Table */}
                      <div style={{ borderRadius: '2px', overflow: 'hidden', border: '1px solid #c0142b', margin: '6px 0 10px' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10px' }}>
                          <thead>
                            <tr style={{ background: '#b91c1c', color: '#ffffff' }}>
                              <th style={{ padding: '5px 8px', textAlign: 'center', width: '6%' }}>#</th>
                              <th style={{ padding: '5px 8px', textAlign: 'left', width: '38%' }}>Scope / Work Item</th>
                              <th style={{ padding: '5px 8px', textAlign: 'left', width: '32%' }}>Package & Area</th>
                              <th style={{ padding: '5px 8px', textAlign: 'right', width: '24%' }}>Amount (₹)</th>
                            </tr>
                          </thead>
                          <tbody>
                            {(itemsList.length > 0 ? itemsList : [buildCurrentWorkItem()]).map((item, idx) => (
                              <tr key={idx} style={{ borderBottom: '1px solid #f1d5d5', background: idx % 2 === 0 ? '#ffffff' : '#fdf8f8' }}>
                                <td style={{ padding: '5px 8px', fontWeight: 'bold', color: '#555', textAlign: 'center' }}>{idx + 1}</td>
                                <td style={{ padding: '5px 8px', fontWeight: '600', color: '#111' }}>
                                  {item.projectTypeName} {item.roomLabel ? <span style={{ color: '#666', fontWeight: 'normal' }}>({item.roomLabel})</span> : ''}
                                  {item.additionalFeatures && item.additionalFeatures.length > 0 && (
                                    <div style={{ fontSize: '8.5px', color: '#777', fontWeight: 'normal', marginTop: '2px' }}>
                                      + Add-ons: {item.additionalFeatures.map(f => f.name).join(', ')}
                                    </div>
                                  )}
                                </td>
                                <td style={{ padding: '5px 8px', color: '#333' }}>
                                  {item.packageName} ({item.length}ft × {item.width}ft = {item.area} sq ft)
                                </td>
                                <td style={{ padding: '5px 8px', textAlign: 'right', fontWeight: 'bold', color: '#111' }}>
                                  ₹{item.itemTotal.toLocaleString('en-IN')}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot>
                            <tr style={{ borderTop: '1.5px solid #c0142b', background: '#fff5f5', fontWeight: '600' }}>
                              <td colspan="3" style={{ padding: '5px 8px', textAlign: 'right' }}>Subtotal:</td>
                              <td style={{ padding: '5px 8px', textAlign: 'right' }}>₹{subtotal.toLocaleString('en-IN')}</td>
                            </tr>
                            {formData.includeGST && (
                              <tr style={{ background: '#fff5f5' }}>
                                <td colspan="3" style={{ padding: '4px 8px', textAlign: 'right', color: '#555' }}>GST (18%):</td>
                                <td style={{ padding: '4px 8px', textAlign: 'right', color: '#555' }}>₹{gst.toLocaleString('en-IN')}</td>
                              </tr>
                            )}
                            <tr style={{ background: '#ffff00', fontWeight: '800', fontSize: '11px', color: '#000' }}>
                              <td colspan="3" style={{ padding: '6px 8px', textAlign: 'right' }}>Total Project Cost:</td>
                              <td style={{ padding: '6px 8px', textAlign: 'right' }}>₹{finalCost.toLocaleString('en-IN')}/-</td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>

                      <p style={{ fontSize: '9.5px', fontStyle: 'italic', color: '#333', lineHeight: '1.5', margin: 0, textAlign: 'justify' }}>
                        The quoted price includes the complete agreed scope of works including all specified materials, master layout, border detailing, primer finishing, and installation.
                      </p>
                    </div>

                  </div>

                  {/* Signatory Section */}
                  <div className="flex justify-end mt-4 mb-2">
                    <div className="text-center relative pr-4" style={{ minWidth: '200px' }}>
                      <p style={{ fontSize: '11px', fontWeight: '700', color: '#111', margin: '0 0 4px' }}>
                        For Cherry Gold Interiors Pvt Ltd
                      </p>

                      <div className="relative h-18 my-1 flex items-center justify-center">
                        <img 
                          src="/images/company-stamp.svg" 
                          alt="Official Seal" 
                          className="absolute w-22 h-22 opacity-85 pointer-events-none"
                          style={{ transform: 'rotate(-8deg)', left: '15px' }}
                        />
                        <img 
                          src="/images/signature.svg" 
                          alt="Ankit Sharma Signature" 
                          className="relative z-10 w-28 h-auto opacity-95 pointer-events-none"
                          style={{ transform: 'rotate(-2deg)' }}
                        />
                      </div>

                      <p style={{ fontWeight: '800', fontSize: '11.5px', margin: '2px 0 1px', color: '#111' }}>
                        Ankit Sharma
                      </p>
                      <p style={{ fontWeight: '600', fontSize: '9.5px', margin: '1px 0', color: '#333' }}>
                        Founder & Interior Designer
                      </p>
                      <p style={{ fontWeight: '600', fontSize: '9px', margin: '1px 0', color: '#555' }}>
                        Authorized Signatory
                      </p>
                    </div>
                  </div>

                  {/* Gold Footer */}
                  <div style={{ height: '1.5px', background: '#c9a84c', margin: '16px 0 4px' }} />
                  <div 
                    style={{ 
                      textAlign: 'center', 
                      color: '#c9a84c', 
                      fontSize: '9.5px', 
                      fontWeight: '600',
                      letterSpacing: '0.3px'
                    }}
                  >
                    www.cherrygoldinteriors.com | info@cherrygoldinteriors.com
                  </div>

                  <div className="text-right text-[9.5px] text-gray-400 mt-2">
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
                  onClick={() => executePrint(clientDetails, itemsList.length > 0 ? itemsList : [buildCurrentWorkItem()])}
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