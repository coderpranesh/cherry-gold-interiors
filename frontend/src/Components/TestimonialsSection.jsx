/*frontend/src/Components/TestimonialsSection.jsx */
import React from 'react';
import { Star, Quote } from 'lucide-react';

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: 'Priya Sharma',
      location: 'Kolkata',
      rating: 5,
      text: 'Cherry Gold Interiors transformed our kitchen into a dream space. The 3D design preview helped us visualize everything perfectly. Excellent quality and timely delivery!',
      project: 'Modular Kitchen',
      image: 'https://images.pexels.com/photos/1102341/pexels-photo-1102341.jpeg?auto=compress&cs=tinysrgb&w=150'
    },
    {
      name: 'Rajesh Kumar',
      location: 'Kolkata',
      rating: 5,
      text: 'Outstanding service from consultation to final installation. The team was professional, and the wardrobe design exceeded our expectations. Highly recommended!',
      project: 'Wardrobe Design',
      image: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150'
    },
    {
      name: 'Anjali Patel',
      location: 'Kolkata',
      rating: 5,
      text: 'The complete home interior project was handled brilliantly. From false ceiling to TV units, everything was perfect. Great value for money with 5-year warranty.',
      project: 'Complete Home Interior',
      image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150'
    }
  ];

  return (
    <section className="py-16 bg-[#FDFBD4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            What Our Clients Say
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Don't just take our word for it. Here's what our satisfied customers have to say about their experience with Cherry Gold Interiors.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-200">
              <div className="flex items-center mb-4">
                <Quote className="w-8 h-8 text-red-500 mr-3" />
                <div className="flex text-yellow-400">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
              </div>
              
              <p className="text-gray-600 mb-6 leading-relaxed">{testimonial.text}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.location}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-red-600">{testimonial.project}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Join Our Happy Customers</h3>
            <p className="text-gray-600 mb-6">
              Over 1000+ satisfied customers across India trust Cherry Gold Interiors for their dream home transformations.
            </p>
            <div className="flex flex-wrap justify-center gap-8 mb-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">1000+</div>
                <div className="text-sm text-gray-500">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">50+</div>
                <div className="text-sm text-gray-500">Cities Served</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">4.9</div>
                <div className="text-sm text-gray-500">Average Rating</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">5</div>
                <div className="text-sm text-gray-500">Years Warranty</div>
              </div>
            </div>
            <button className="bg-gradient-to-br from-white to-gray text-white px-8 py-3 rounded-2xl font-medium hover:bg-yellow-600 transition-all duration-200 transform hover:scale-105">
              Share Your Experience
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;