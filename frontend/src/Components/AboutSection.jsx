/*frontend/src/Components/AboutSection.jsx */
import React from 'react';
import { Award, Users, Clock, CheckCircle, Star, Shield, Heart, Target, Hammer, Crown } from 'lucide-react';
import { Link } from 'react-router-dom';
const AboutSection = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-amber-50 to-orange-50 py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              About <span className="text-amber-600">Cherry Gold Interiors</span>
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              A creative interior design firm based in Kolkata, dedicated to turning your empty spaces 
              into beautiful, functional environments that reflect your personality and lifestyle.
            </p>
          </div>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-20 bg-[#f1f1de]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Story</h2>
              <div className="space-y-6 text-gray-700 leading-relaxed">
                <p>
                  Cherry Gold Interiors was founded with a simple yet powerful vision: to make beautiful, 
                  high-quality interior design accessible to everyone. Based in the cultural heart of India, 
                  Kolkata, we understand the importance of creating spaces that not only look stunning but 
                  also feel like home.
                </p>
                <p>
                  What started as a passion project has grown into a trusted name in the interior design 
                  industry. We specialize in residential, commercial, and salon interiors, offering stylish 
                  designs with long-lasting quality — all at affordable prices that don't compromise on excellence.
                </p>
                <p>
                  Our tagline, <strong>"Bringing a Cherished Life with Golden Moments,"</strong> reflects our 
                  commitment to creating spaces where life's most precious moments unfold. Every project we 
                  undertake is a step towards making someone's dream space a reality.
                </p>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800" 
                alt="Interior Design Process" 
                className="rounded-2xl shadow-2xl w-full"
              />
              <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center">
                  <Heart className="h-6 w-6 text-red-500 fill-current mr-2" />
                  <span className="font-semibold text-gray-900">Passion Driven</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What Makes Us Different */}
      <section className="py-20 ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Makes Us Stand Out</h2>
            <p className="text-xl text-gray-600">Our unique approach to interior design sets us apart</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
              <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Transparent Pricing</h3>
              <p className="text-gray-600">
                No hidden charges or surprise costs. You pay only for what you need with complete transparency.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
              <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Experienced Team</h3>
              <p className="text-gray-600">
                Craftsmen with 10-20 years of industry experience ensuring precision and excellence.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
              <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Long-term Warranty</h3>
              <p className="text-gray-600">
                Up to 15 years service warranty on our work, giving you peace of mind for years to come.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
              <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Personal Touch</h3>
              <p className="text-gray-600">
                Direct involvement from our founder in every project ensures personalized attention.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-[#f1f1de]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-xl text-gray-600">The principles that guide everything we do</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-gradient-to-br from-amber-400 to-yellow-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Target className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Quality First</h3>
              <p className="text-gray-600 leading-relaxed">
                We never compromise on quality. Every material, every finish, every detail is carefully 
                selected to ensure durability and beauty that lasts for years.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-br from-amber-400 to-yellow-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Customer Satisfaction</h3>
              <p className="text-gray-600 leading-relaxed">
                Your happiness is our success. We listen to your needs, understand your vision, and work 
                tirelessly to exceed your expectations in every project.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-br from-amber-400 to-yellow-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Integrity</h3>
              <p className="text-gray-600 leading-relaxed">
                Honest communication, transparent pricing, and ethical business practices form the 
                foundation of our relationship with every client.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Over Branded Companies */}
      <section className="py-20 bg-gradient-to-br from-amber-50 to-orange-50 text-amber-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose Us Over Branded Companies?</h2>
            <p className="text-xl ">Superior value without compromising on quality</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-r from-gray-900 to-red-800 p-8 rounded-2xl">
              <div className="text-amber-400 text-5xl font-bold mb-4">50%</div>
              <h3 className="text-xl font-semibold mb-3">Cost Savings</h3>
              <p className="text-gray-300">
                Branded companies charge ₹2500-₹3500/sq.ft. We offer premium quality starting at just ₹1200/sq.ft
              </p>
            </div>
            
            <div className="bg-gradient-to-r from-gray-900 to-red-800 p-8 rounded-2xl">
              <div className="text-amber-400 text-5xl font-bold mb-4">15</div>
              <h3 className="text-xl font-semibold mb-3">Years Warranty</h3>
              <p className="text-gray-300">
                Long-term warranty just like top brands, but at much lower cost with transparent pricing
              </p>
            </div>
            
            <div className="bg-gradient-to-r from-gray-900 to-red-800 p-8 rounded-2xl">
              <div className="text-amber-400 text-5xl font-bold mb-4">0</div>
              <h3 className="text-xl font-semibold mb-3">Hidden Charges</h3>
              <p className="text-gray-300">
                Complete transparency - you pay only for actual work based on your space and needs
              </p>
            </div>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-r from-gray-900 to-red-800 p-8 rounded-2xl">
              <Crown className="h-12 w-12 text-amber-400 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Personalized Service</h3>
              <p className="text-gray-300">
                We focus on your pain points, preferences, and vision. Direct involvement from the founder 
                for every project ensures personalized attention you won't get from big brands.
              </p>
            </div>
            
            <div className="bg-gradient-to-r from-gray-900 to-red-800 p-8 rounded-2xl">
              <Hammer className="h-12 w-12 text-amber-400 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Quality Without Compromise</h3>
              <p className="text-gray-300">
                Same materials, finishing, and designs used by big brands, delivered by a passionate, 
                experienced team with faster communication and support.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Expertise */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Expertise</h2>
            <p className="text-xl text-gray-600">Comprehensive interior solutions under one roof</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
              <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Award className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Residential Interiors</h3>
              <p className="text-gray-600">
                Complete home makeovers from living rooms to bedrooms, creating spaces that reflect your lifestyle.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
              <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Users className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Commercial Spaces</h3>
              <p className="text-gray-600">
                Professional office designs that enhance productivity and create impressive business environments.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
              <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Star className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Salon Interiors</h3>
              <p className="text-gray-600">
                Specialized salon designs that create the perfect ambiance for beauty and wellness businesses.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Promise */}
      <section className="py-20 bg-amber-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Promise to You</h2>
            <div className="max-w-4xl mx-auto">
              <p className="text-xl text-gray-700 leading-relaxed mb-8">
                At Cherry Gold Interiors, we don't just create beautiful spaces – we create experiences. 
                Our commitment goes beyond the final handover. We provide ongoing support, honor our warranties, 
                and ensure that your investment continues to bring joy for years to come.
              </p>
              <div className="bg-white p-8 rounded-2xl shadow-lg">
                <h3 className="text-2xl font-bold text-amber-600 mb-4">
                  "Bringing a Cherished Life with Golden Moments"
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  This isn't just our tagline – it's our mission. Every project we undertake is designed to 
                  create spaces where life's most precious moments unfold. From intimate family gatherings 
                  to professional achievements, we craft environments that enhance every experience.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-[#f1f1de]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl text-amber-600 font-bold mb-6">Ready to Transform Your Space?</h2>
          <p className="text-xl  mb-8 max-w-2xl mx-auto">
            Let's discuss your vision and create something beautiful together. 
            Get your free consultation today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/services">
            <button className="bg-red-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-orange-700 transition-colors shadow-lg">
              Get Free Consultation
            </button>
            </Link>
            <Link to="/portfolio">
            <button className="border-2 bg-red-600 border-amber-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-orange-700 hover:text-white transition-colors">
              View Our Portfolio
            </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutSection;