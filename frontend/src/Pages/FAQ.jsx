/*frontend/src/Pages/FAQ.jsx */
import React, { useState } from 'react';
import { Plus, Minus, Search, HelpCircle } from 'lucide-react';

const FAQ = () => {
  const [openFAQ, setOpenFAQ] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const faqs = [
    {
      id: 1,
      category: 'General',
      question: 'Why should I choose Cherry Gold Interiors?',
      answer: 'Cherry Gold Interiors offers personalized service with expert designers who understand your vision. We provide 3D design previews, use quality materials, offer transparent pricing, and deliver end-to-end solutions with a 5-year warranty. Our experienced team has successfully completed over 1000+ projects across India.'
    },
    {
      id: 2,
      category: 'General',
      question: 'How are you better than other interior firms?',
      answer: 'We stand out with our quality materials sourced from trusted suppliers, affordable and transparent pricing with no hidden costs, timely delivery commitment, experienced design team, comprehensive warranty coverage, and personalized attention to every client. Our 3D visualization helps you see your space before execution.'
    },
    {
      id: 3,
      category: 'Warranty',
      question: 'Do you provide a warranty on your work?',
      answer: 'Yes, we provide up to 5 years warranty on major installations like modular kitchens and wardrobes. TV units come with 3 years warranty, and false ceilings have 2 years warranty. Our warranty covers manufacturing defects, hardware failures, and structural integrity issues.'
    },
    {
      id: 4,
      category: 'Design',
      question: 'What if I want changes after the design is approved?',
      answer: 'Minor revisions and adjustments are allowed during the initial phase at no extra cost. However, major changes that affect the overall design, materials, or scope may incur additional charges. We discuss all changes transparently before implementation.'
    },
    {
      id: 5,
      category: 'Design',
      question: 'Can I see my space in 3D before finalizing?',
      answer: 'Absolutely! Our 3D room designer helps you visualize your space with photorealistic renderings. You can see exactly how your kitchen, wardrobe, or complete home will look before we begin manufacturing. This ensures complete satisfaction with the final design.'
    },
    {
      id: 6,
      category: 'Pricing',
      question: 'How do you calculate project costs?',
      answer: 'Our pricing is based on area (square footage), material quality, finish type, and additional features. We provide detailed quotations with itemized costs. Use our online cost estimator for quick estimates, or schedule a consultation for precise pricing.'
    },
    {
      id: 7,
      category: 'Process',
      question: 'How long does a typical project take?',
      answer: 'Timeline varies by project scope: Modular kitchens take 3-4 weeks, wardrobes 2-3 weeks, complete home interiors 8-12 weeks. We provide detailed timelines during consultation and keep you updated throughout the project.'
    },
    {
      id: 8,
      category: 'Services',
      question: 'Do you provide installation services?',
      answer: 'Yes, we provide complete installation services with our skilled technicians. Installation is included in our project cost, and we ensure proper fitting, finishing, and cleanup. Our team handles everything from delivery to final setup.'
    },
    {
      id: 9,
      category: 'Payment',
      question: 'What are your payment terms?',
      answer: 'We follow a milestone-based payment structure: 20% advance, 40% on design approval, 30% on manufacturing completion, and 10% on final delivery. We accept various payment methods including cash, bank transfer, and EMI options.'
    },
    {
      id: 10,
      category: 'Support',
      question: 'Do you provide post-installation support?',
      answer: 'Yes, we provide comprehensive post-installation support including free maintenance visits in the first year, 24/7 customer support, and quick response for any issues. Our service team is always ready to help.'
    }
  ];

  const categories = ['All', 'General', 'Warranty', 'Design', 'Pricing', 'Process', 'Services', 'Payment', 'Support'];
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredFAQs = faqs.filter(faq => {
    const matchesCategory = activeCategory === 'All' || faq.category === activeCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFAQ = (id) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };

  return (
    <div className="py-32 bg-[#FDFBD4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Find answers to common questions about our services, process, warranty, and more. Can't find what you're looking for? Contact our support team.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search FAQs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeCategory === category
                      ? 'bg-[#f4d83e] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-600'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {filteredFAQs.map(faq => (
            <div key={faq.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <button
                onClick={() => toggleFAQ(faq.id)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-xs font-medium text-red-600 bg-orange-100 px-2 py-1 rounded">
                    {faq.category}
                  </span>
                  <h3 className="text-lg font-semibold text-gray-900">{faq.question}</h3>
                </div>
                <div className="flex-shrink-0">
                  {openFAQ === faq.id ? (
                    <Minus className="w-5 h-5 text-gray-500" />
                  ) : (
                    <Plus className="w-5 h-5 text-gray-500" />
                  )}
                </div>
              </button>
              
              {openFAQ === faq.id && (
                <div className="px-6 pb-4">
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredFAQs.length === 0 && (
          <div className="text-center py-12">
            <HelpCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No FAQs found matching your search.</p>
            <p className="text-gray-400 mt-2">Try a different search term or browse all categories.</p>
          </div>
        )}

        {/* Contact Support */}
        <div className="mt-16 bg-gradient-to-r from-gray-900 to-red-800 rounded-2xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">Still Have Questions?</h3>
          <p className="text-lg mb-6 opacity-90">
            Our support team is here to help. Get in touch with us for personalized assistance.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-700 transition-colors">
              Contact Support
            </button>
            <button className="bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-700 transition-colors">
              WhatsApp Us
            </button>
            <button className="bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-700 transition-colors">
              Call Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;