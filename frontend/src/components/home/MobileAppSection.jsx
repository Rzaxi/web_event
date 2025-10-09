import React from 'react';
import { Download, Calendar, Users, Bell, Search } from 'lucide-react';
import { motion } from 'framer-motion';

const MobileAppSection = () => {
  const stats = [
    { value: '8M+', label: 'Active Users' },
    { value: '0%', label: 'Commission' },
    { value: '4.7', label: 'App Rating' }
  ];

  const events = [
    {
      id: 1,
      title: 'Tech Conference 2024',
      date: 'Dec 15, 2024',
      price: 'Free',
      attendees: 1250
    },
    {
      id: 2,
      title: 'Music Festival',
      date: 'Dec 20, 2024',
      price: '$25',
      attendees: 5000
    },
    {
      id: 3,
      title: 'Startup Meetup',
      date: 'Dec 18, 2024',
      price: 'Free',
      attendees: 300
    }
  ];

  return (
    <section className="py-32 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header Section */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-sm font-medium text-indigo-600 mb-4 block uppercase tracking-wide">
              Mobile App
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 max-w-4xl mx-auto leading-tight">
              EventHub Mobile App
            </h2>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-10"
          >
            <div>
              <h2 className="text-6xl lg:text-7xl xl:text-8xl font-bold text-gray-900 leading-tight mb-8">
                Manage Events
                <br />
                <span className="text-indigo-600">More Easily</span>
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed mb-10">
                Help you fulfill all aspirations in life. Discover amazing events, connect with communities, and manage your schedule with our innovative platform.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-4 bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-5 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <Download className="w-6 h-6" />
                Download Now
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-4 text-indigo-600 font-bold text-lg hover:text-indigo-700 transition-colors"
              >
                <div className="w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center">
                  <div className="w-0 h-0 border-l-[8px] border-l-indigo-600 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent ml-1"></div>
                </div>
                See How it Works
              </motion.button>
            </div>
          </motion.div>

          {/* Right Content - Phone + Floating Elements */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative flex justify-center"
          >
            {/* Floating Event Stats Card - Left Top */}
            <motion.div
              initial={{ opacity: 0, x: -30, y: 20 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="absolute -left-20 top-8 z-20"
            >
              <motion.div
                animate={{ 
                  y: [0, -10, 0],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 3,
                  ease: "easeInOut"
                }}
              >
                <div className="w-52 h-32 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-2xl p-5 shadow-xl">
                  <div className="flex justify-between items-start mb-4">
                    <div className="text-white text-xs font-medium">Total Events</div>
                    <div className="w-10 h-10 bg-white/20 rounded-xl backdrop-blur-sm flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <div className="text-white text-3xl font-bold mb-2">156</div>
                  <div className="flex items-center gap-2">
                    <div className="text-white/80 text-xs">This Month</div>
                    <div className="px-2 py-1 bg-green-400/20 rounded-full">
                      <span className="text-green-300 text-xs font-semibold">+12%</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Floating Events Chart - Right Top */}
            <motion.div
              initial={{ opacity: 0, x: 30, y: 20 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="absolute -right-16 top-24 z-20"
            >
              <motion.div
                animate={{ 
                  y: [0, -8, 0],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2.5,
                  ease: "easeInOut"
                }}
              >
                <div className="w-44 bg-white rounded-2xl p-5 shadow-xl border border-gray-100">
                  <div className="text-xs font-bold text-gray-900 mb-4">Events by Category</div>
                  <div className="flex items-end justify-between h-20 gap-2">
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-6 bg-indigo-200 rounded-t" style={{ height: '45%' }}></div>
                      <span className="text-xs text-gray-500">Tech</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-6 bg-indigo-600 rounded-t" style={{ height: '75%' }}></div>
                      <span className="text-xs text-gray-500">Music</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-6 bg-indigo-200 rounded-t" style={{ height: '55%' }}></div>
                      <span className="text-xs text-gray-500">Sport</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-6 bg-indigo-200 rounded-t" style={{ height: '65%' }}></div>
                      <span className="text-xs text-gray-500">Art</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Floating Attendance Rate - Left Bottom */}
            <motion.div
              initial={{ opacity: 0, x: -30, y: -20 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="absolute -left-20 bottom-12 z-20"
            >
              <motion.div
                animate={{ 
                  y: [0, 10, 0],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 3.5,
                  ease: "easeInOut"
                }}
              >
                <div className="w-36 bg-white rounded-2xl p-5 shadow-xl border border-gray-100">
                  <div className="relative w-20 h-20 mx-auto mb-3">
                    <svg className="transform -rotate-90 w-20 h-20">
                      <circle cx="40" cy="40" r="34" stroke="#E5E7EB" strokeWidth="7" fill="none" />
                      <circle cx="40" cy="40" r="34" stroke="#4F46E5" strokeWidth="7" fill="none"
                        strokeDasharray="213.6" strokeDashoffset="53.4" strokeLinecap="round" />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xl font-bold text-indigo-600">75%</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs font-bold text-gray-900 mb-1">Attendance Rate</div>
                    <div className="flex items-center justify-center gap-1">
                      <Users className="w-3 h-3 text-gray-500" />
                      <span className="text-xs text-gray-500">1,248 people</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Floating Active Users - Right Bottom */}
            <motion.div
              initial={{ opacity: 0, x: 30, y: -20 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="absolute -right-16 bottom-4 z-20"
            >
              <motion.div
                animate={{ 
                  y: [0, -8, 0],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2.8,
                  ease: "easeInOut"
                }}
              >
                <div className="w-40 bg-white rounded-2xl p-4 shadow-xl border border-gray-100">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                      <Users className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Active Users</div>
                      <div className="text-lg font-bold text-gray-900">2.4K</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full" style={{ width: '68%' }}></div>
                    </div>
                    <span className="text-xs text-gray-500">68%</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* iPhone Mockup - 1:1 Scale */}
            <div className="relative w-[280px] mx-auto">
              <div className="relative bg-black rounded-[3rem] p-2 shadow-2xl">
                {/* iPhone Notch */}
                <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-24 h-5 bg-black rounded-b-2xl z-30"></div>

                <div className="bg-white rounded-[2.8rem] overflow-hidden relative">
                  <div className="relative h-[570px]">
                    {/* Status Bar */}
                    <div className="flex items-center justify-between px-6 py-3 bg-white">
                      <span className="text-sm font-semibold text-gray-900">9:41</span>
                      <div className="flex items-center gap-1">
                        <div className="flex gap-0.5">
                          <div className="w-0.5 h-0.5 bg-gray-900 rounded-full"></div>
                          <div className="w-0.5 h-0.5 bg-gray-900 rounded-full"></div>
                          <div className="w-0.5 h-0.5 bg-gray-900 rounded-full"></div>
                          <div className="w-0.5 h-0.5 bg-gray-400 rounded-full"></div>
                        </div>
                        <div className="w-5 h-2.5 border border-gray-900 rounded-sm ml-1">
                          <div className="w-full h-full bg-green-500"></div>
                        </div>
                      </div>
                    </div>

                    {/* App Content - Event App */}
                    <div className="h-full bg-white px-4 py-4">
                      {/* Header */}
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center mb-2">
                            <Calendar className="w-5 h-5 text-white" />
                          </div>
                          <h3 className="text-sm font-bold text-gray-900">EventHub</h3>
                        </div>
                        <div className="flex gap-2">
                          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                            <Search className="w-4 h-4 text-gray-600" />
                          </div>
                          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                            <Bell className="w-4 h-4 text-gray-600" />
                          </div>
                        </div>
                      </div>

                      {/* Card Section */}
                      <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-2xl p-4 mb-6 shadow-lg">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <p className="text-white/80 text-xs mb-1">Total Events</p>
                            <p className="text-white text-2xl font-bold">156</p>
                          </div>
                          <div className="w-10 h-10 bg-white/20 rounded-xl backdrop-blur-sm flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-white" />
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="text-white/80 text-xs">Next Event</div>
                          <div className="text-white text-xs font-semibold">Tech Conf 2024</div>
                        </div>
                      </div>

                      {/* Recent Transactions / Events */}
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="text-xs font-bold text-gray-900">Recent Registrations</h4>
                          <button className="text-xs text-indigo-600 font-medium">See all</button>
                        </div>
                        
                        <div className="space-y-3">
                          {/* Event Item 1 */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                                <div className="w-5 h-6 bg-red-500 rounded-sm"></div>
                              </div>
                              <div>
                                <p className="text-xs font-semibold text-gray-900">Tech Conference</p>
                                <p className="text-xs text-gray-500">Dec 28, 2024</p>
                              </div>
                            </div>
                            <p className="text-xs font-bold text-gray-900">+50</p>
                          </div>

                          {/* Event Item 2 */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                                <Users className="w-5 h-5 text-blue-600" />
                              </div>
                              <div>
                                <p className="text-xs font-semibold text-gray-900">Music Festival</p>
                                <p className="text-xs text-gray-500">Dec 30, 2024</p>
                              </div>
                            </div>
                            <p className="text-xs font-bold text-gray-900">+125</p>
                          </div>

                          {/* Event Item 3 */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                                <Calendar className="w-5 h-5 text-green-600" />
                              </div>
                              <div>
                                <p className="text-xs font-semibold text-gray-900">Startup Meetup</p>
                                <p className="text-xs text-gray-500">Jan 5, 2025</p>
                              </div>
                            </div>
                            <p className="text-xs font-bold text-gray-900">+32</p>
                          </div>
                        </div>
                      </div>

                      {/* Bottom Navigation */}
                      <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 px-4 py-3">
                        <div className="flex justify-around">
                          <div className="flex flex-col items-center gap-1 text-indigo-600">
                            <Calendar className="w-5 h-5" />
                            <span className="text-xs font-medium">Events</span>
                          </div>
                          <div className="flex flex-col items-center gap-1 text-gray-400">
                            <Search className="w-5 h-5" />
                            <span className="text-xs font-medium">Search</span>
                          </div>
                          <div className="flex flex-col items-center gap-1 text-gray-400">
                            <Users className="w-5 h-5" />
                            <span className="text-xs font-medium">Community</span>
                          </div>
                          <div className="flex flex-col items-center gap-1 text-gray-400">
                            <Bell className="w-5 h-5" />
                            <span className="text-xs font-medium">Profile</span>
                          </div>
                        </div>

                        {/* iPhone Home Indicator */}
                        <div className="flex justify-center mt-2">
                          <div className="w-24 h-1 bg-gray-900 rounded-full opacity-50"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default MobileAppSection;

