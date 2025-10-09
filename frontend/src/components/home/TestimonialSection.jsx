import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, ArrowLeft, ArrowRight, Users, Calendar, Award } from 'lucide-react';

const TestimonialSection = () => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [expandedCard, setExpandedCard] = useState(null);

  const testimonials = [
    {
      id: 1,
      title: "Amazing Event Management",
      subtitle: "Client Testimonial",
      name: "Sarah Johnson",
      role: "Event Organizer",
      company: "Creative Events Co.",
      description: "EventHub has completely transformed how we manage our events. The platform is incredibly intuitive and user-friendly.",
      fullDescription: "Our innovative event management platform represents the perfect balance between functionality and ease of use. EventHub has revolutionized how we organize events, making it simple for our entire team to collaborate effectively. We've seen a 300% increase in attendee engagement and our event planning time has been reduced by 50%. The real-time analytics help us make data-driven decisions, and the automated features have streamlined our entire workflow process.",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face",
      bgColor: "bg-indigo-50",
      color: "text-indigo-600"
    },
    {
      id: 2,
      title: "Outstanding Analytics Platform",
      subtitle: "Client Testimonial",
      name: "Michael Chen",
      role: "Marketing Director",
      company: "Tech Innovations Ltd.",
      description: "The analytics and reporting features are absolutely outstanding. We can track every aspect of our events in real-time.",
      fullDescription: "Our event analytics platform is engineered for the most demanding marketing campaigns. With enhanced real-time tracking and comprehensive reporting, EventHub provides reliable insights in dynamic event environments. The platform features advanced integration capabilities and automated reporting, making it ideal for both small and large-scale event management operations.",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
      bgColor: "bg-indigo-50",
      color: "text-indigo-600"
    },
    {
      id: 3,
      title: "Seamless Event Coordination",
      subtitle: "Client Testimonial",
      name: "Emily Rodriguez",
      role: "Community Manager",
      company: "Global Conferences",
      description: "Managing multiple events simultaneously has never been easier. The automated features save us countless hours.",
      fullDescription: "Our specialized event coordination platform delivers exceptional performance for critical business events. Built with precision and user experience in mind, EventHub offers outstanding team collaboration, automated workflows, and excellent scalability. The platform is designed to meet the stringent requirements of modern event management, providing reliable performance and long-term value.",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face",
      bgColor: "bg-indigo-50",
      color: "text-indigo-600"
    }
  ];

  const toggleExpanded = (cardId) => {
    setExpandedCard(expandedCard === cardId ? null : cardId);
  };

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-sm font-medium text-indigo-600 mb-4 block uppercase tracking-wide">
              Testimonials
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 max-w-4xl mx-auto leading-tight">
              What Our Clients Say
            </h2>
          </motion.div>
        </div>

        {/* Testimonial Cards Grid - Horizontal Layout */}
        <div className="flex flex-wrap gap-4 justify-center items-start max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => {
            const isExpanded = expandedCard === testimonial.id;

            return (
              <motion.div
                key={testimonial.id}
                className={`rounded-2xl shadow-lg border border-gray-100 ${testimonial.bgColor}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                animate={{
                  width: isExpanded ? "520px" : "280px",
                  height: "280px"
                }}
                whileHover={{
                  y: -4,
                  boxShadow: "0 15px 30px -10px rgba(0, 0, 0, 0.1)"
                }}
                transition={{
                  opacity: { duration: 0.6, delay: index * 0.1 },
                  y: { duration: 0.6, delay: index * 0.1 },
                  width: { duration: 0.6, ease: [0.4, 0, 0.2, 1] },
                  height: { duration: 0 },
                  default: { duration: 0.3 }
                }}
                layout
              >
                <div className="p-5 h-full flex flex-col">
                  {/* Client Photo */}
                  <div className="mb-3">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md"
                    />
                  </div>

                  <span className="text-xs font-medium text-gray-500 mb-2 block">
                    {testimonial.subtitle}
                  </span>

                  <h3 className="text-sm font-bold text-gray-900 mb-2 leading-tight">
                    {testimonial.title}
                  </h3>

                  {/* Client Info */}
                  <div className="mb-3">
                    <p className="text-sm font-semibold text-gray-800">{testimonial.name}</p>
                    <p className="text-xs text-gray-600">{testimonial.role}</p>
                  </div>

                  {/* Description - Expands horizontally */}
                  <div
                    className={`flex-1 mb-2 pr-2 ${isExpanded ? 'overflow-y-auto overflow-x-hidden max-h-32 scrollbar-thin scrollbar-thumb-indigo-400 scrollbar-track-gray-100 hover:scrollbar-thumb-indigo-500' : 'overflow-hidden'}`}
                    style={isExpanded ? {
                      scrollbarWidth: 'thin',
                      scrollbarColor: '#818cf8 #f3f4f6'
                    } : {}}
                  >
                    <motion.p
                      className={`text-xs text-gray-600 leading-relaxed break-words ${!isExpanded ? 'line-clamp-3' : ''}`}
                      layout="position"
                      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                      style={{
                        wordWrap: 'break-word',
                        overflowWrap: 'break-word',
                        hyphens: 'auto'
                      }}
                    >
                      {isExpanded ? testimonial.fullDescription : testimonial.description}
                    </motion.p>
                  </div>

                  {/* Star Rating - Appears when expanded */}
                  {isExpanded && (
                    <motion.div
                      className="mb-2"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3, duration: 0.3 }}
                    >
                      <div className="flex items-center gap-1">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-current" />
                          ))}
                        </div>
                        <span className="text-xs text-gray-500">5.0</span>
                      </div>
                    </motion.div>
                  )}

                  {/* Read More Link */}
                  <motion.button
                    onClick={() => toggleExpanded(testimonial.id)}
                    className={`text-xs font-medium ${testimonial.color} hover:underline transition-colors duration-200 flex items-center gap-1 mt-auto`}
                    whileHover={{ x: 2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span>{isExpanded ? 'Read Less' : 'Read More'}</span>
                    <motion.span
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                      className="text-xs"
                    >
                      →
                    </motion.span>
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
