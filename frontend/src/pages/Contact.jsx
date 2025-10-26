import React, { useState, useEffect } from 'react';
import { Phone, Mail, MapPin, Send, MessageSquare, CheckCircle, Facebook, Instagram, Twitter, Wifi, Plus, Minus } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    type: 'general'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [openFAQ, setOpenFAQ] = useState(null);
  const [hasLoaded, setHasLoaded] = useState(false);

  // Animation hooks
  const [heroRef, heroVisible] = useScrollAnimation(0.1);
  const [contactFormRef, contactFormVisible] = useScrollAnimation(0.1);
  const [faqHeaderRef, faqHeaderVisible] = useScrollAnimation(0.1);
  const [faqListRef, faqListVisible] = useScrollAnimation(0.1);

  // Page load animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setHasLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        type: 'general'
      });
    }, 2000);
  };

  const contactInfo = {
    phone: '+62 859-3971-1150',
    email: 'tanjintar01@gmail.com',
    address: 'Jl. Raya Tajur, Kp. Buntar RT.02/RW.08, Kel. Muara Sari, Kec. Bogor Selatan'
  };

  const faqData = [
    {
      id: 1,
      question: "Apa itu platform event management?",
      answer: "Platform event management adalah sistem digital yang membantu Anda merencanakan, mengelola, dan melaksanakan event dari awal hingga akhir. Mulai dari pendaftaran peserta, manajemen tiket, hingga laporan analytics."
    },
    {
      id: 2,
      question: "Jenis event apa saja yang bisa dikelola?",
      answer: "Platform kami mendukung berbagai jenis event seperti konferensi, seminar, workshop, webinar, festival, pameran, konser, dan acara korporat lainnya dengan skala kecil hingga besar."
    },
    {
      id: 3,
      question: "Bagaimana cara memulai menggunakan platform ini?",
      answer: "Sangat mudah! Cukup daftar akun, verifikasi email, buat event pertama Anda dengan mengisi detail acara, atur pendaftaran peserta, dan platform siap digunakan. Tim support kami siap membantu jika diperlukan."
    },
    {
      id: 4,
      question: "Apakah ada biaya berlangganan atau per event?",
      answer: "Kami menyediakan berbagai paket yang fleksibel, mulai dari paket gratis untuk event kecil hingga paket premium untuk event besar. Hubungi tim sales kami untuk konsultasi paket yang sesuai kebutuhan Anda."
    },
    {
      id: 5,
      question: "Bagaimana dengan keamanan data peserta event?",
      answer: "Keamanan data adalah prioritas utama kami. Kami menggunakan enkripsi tingkat enterprise, backup rutin, dan mematuhi standar keamanan internasional untuk melindungi data pribadi peserta event Anda."
    }
  ];

  const toggleFAQ = (id) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Hero Section */}
      <section ref={heroRef} className="pt-20 pb-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className={`text-4xl lg:text-5xl font-bold text-gray-900 mb-4 transition-all duration-1000 ${
              hasLoaded || heroVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 -translate-y-8'
            }`}>
              Hubungi Kami
            </h1>
            <p className={`text-lg text-gray-600 max-w-3xl mx-auto transition-all duration-1000 delay-200 ${
              hasLoaded || heroVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 -translate-y-8'
            }`}>
              Kami akan membantu Anda menciptakan event yang berkualitas tinggi dan membangun pengalaman 
              yang tak terlupakan, membuka jalan bagi kesuksesan acara Anda.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section ref={contactFormRef} className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative">
            {/* Contact Form - Full Width */}
            <div className={`bg-white rounded-3xl p-8 shadow-sm border border-gray-100 transition-all duration-1000 ${
              hasLoaded || contactFormVisible
                ? 'opacity-100 translate-y-0 scale-100'
                : 'opacity-0 translate-y-12 scale-95'
            }`}>
              <div className="grid lg:grid-cols-3 gap-8">
                
                {/* Contact Information Card - Full Height */}
                <div className={`bg-gray-50 rounded-3xl p-8 text-gray-900 relative overflow-hidden flex flex-col justify-between min-h-full transition-all duration-1000 delay-200 ${
                  hasLoaded || contactFormVisible
                    ? 'opacity-100 translate-x-0'
                    : 'opacity-0 -translate-x-8'
                }`}>
                  <div className="relative z-10">
                    {/* Informasi Kontak Section */}
                    <div className="mb-8">
                      <h3 className="text-xl font-bold mb-6 text-gray-900">Informasi Kontak</h3>
                      
                      <div className="space-y-4">
                        <div className="flex items-start space-x-3">
                          <div className="w-6 h-6 flex items-center justify-center mt-1">
                            <MapPin className="w-5 h-5 text-blue-600" />
                          </div>
                          <div className="text-sm text-gray-700 leading-relaxed">
                            {contactInfo.address}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <div className="w-6 h-6 flex items-center justify-center">
                            <Phone className="w-5 h-5 text-blue-600" />
                          </div>
                          <div className="text-sm text-gray-700">
                            {contactInfo.phone}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <div className="w-6 h-6 flex items-center justify-center">
                            <Mail className="w-5 h-5 text-blue-600" />
                          </div>
                          <div className="text-sm text-gray-700">
                            {contactInfo.email}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Ikuti Kami Section */}
                    <div className="mb-8">
                      <h3 className="text-xl font-bold mb-4 text-gray-900">Ikuti Kami</h3>
                      <div className="flex space-x-4">
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-blue-50 transition-all duration-300 cursor-pointer shadow-sm hover:scale-110 hover:-translate-y-1 hover:shadow-md">
                          <Facebook className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-blue-50 transition-all duration-300 cursor-pointer shadow-sm hover:scale-110 hover:-translate-y-1 hover:shadow-md">
                          <Instagram className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-blue-50 transition-all duration-300 cursor-pointer shadow-sm hover:scale-110 hover:-translate-y-1 hover:shadow-md">
                          <Twitter className="w-5 h-5 text-blue-600" />
                        </div>
                      </div>
                    </div>

                    {/* Logo Section */}
                    <div className="flex justify-center mt-8">
                      <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center">
                        <div className="text-white font-bold text-lg">
                          E
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Form Content */}
                <div className={`lg:col-span-2 transition-all duration-1000 delay-300 ${
                  hasLoaded || contactFormVisible
                    ? 'opacity-100 translate-x-0'
                    : 'opacity-0 translate-x-8'
                }`}>
              {isSubmitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Pesan Terkirim!</h3>
                  <p className="text-gray-600 mb-6">
                    Terima kasih atas pesan Anda. Tim kami akan segera menghubungi Anda.
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="text-gray-900 hover:text-gray-700 font-medium"
                  >
                    Kirim Pesan Lain
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">Your Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-0 py-3 border-0 border-b-2 border-gray-200 focus:border-indigo-600 focus:ring-0 bg-transparent transition-all duration-300 placeholder-gray-500"
                        placeholder="Nama Lengkap"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">Your Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-0 py-3 border-0 border-b-2 border-gray-200 focus:border-indigo-600 focus:ring-0 bg-transparent transition-all duration-300 placeholder-gray-500"
                        placeholder="email@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">Your Subject</label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full px-0 py-3 border-0 border-b-2 border-gray-200 focus:border-indigo-600 focus:ring-0 bg-transparent transition-all duration-300 placeholder-gray-500"
                      placeholder="Saya ingin menanyakan tentang layanan event management"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pesan
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      className="w-full px-0 py-3 border-0 border-b-2 border-gray-200 focus:border-gray-900 focus:ring-0 bg-transparent transition-all duration-300 resize-none placeholder-gray-500"
                      placeholder="Tulis pesan Anda di sini..."
                    />
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-medium py-3 px-8 rounded-lg transition-all duration-300 flex items-center"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Mengirim...
                        </>
                      ) : (
                        <>
                          Kirim Pesan
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* FAQ Header */}
          <div ref={faqHeaderRef} className="text-center mb-16">
            <div className={`inline-block bg-gray-200 text-gray-600 text-sm font-medium px-4 py-2 rounded-full mb-6 transition-all duration-1000 ${
              faqHeaderVisible
                ? 'opacity-100 scale-100'
                : 'opacity-0 scale-90'
            }`}>
              Sering Ditanya
            </div>
            <h2 className={`text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight transition-all duration-1000 delay-100 ${
              faqHeaderVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-8'
            }`}>
              We're here to answer all your questions.
            </h2>
            <p className={`text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed transition-all duration-1000 delay-200 ${
              faqHeaderVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-8'
            }`}>
              Jika Anda baru mengenal platform kami atau ingin meningkatkan pengalaman event Anda, 
              bagian ini akan membantu Anda mempelajari lebih lanjut tentang platform dan fitur-fiturnya.
            </p>
          </div>

          {/* FAQ Items */}
          <div ref={faqListRef} className="space-y-4">
            {faqData.map((faq, index) => (
              <div 
                key={faq.id} 
                className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-700 hover:shadow-lg hover:-translate-y-1 ${
                  faqListVisible
                    ? 'opacity-100 translate-y-0 scale-100'
                    : 'opacity-0 translate-y-12 scale-95'
                }`}
                style={{ 
                  transitionDelay: `${index * 100}ms`,
                  animationFillMode: 'both'
                }}
              >
                <button
                  onClick={() => toggleFAQ(faq.id)}
                  className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
                >
                  <span className="text-lg font-semibold text-gray-900 pr-4">
                    {faq.question}
                  </span>
                  <div className="flex-shrink-0">
                    <div className={`transform transition-transform duration-300 ${openFAQ === faq.id ? 'rotate-45' : 'rotate-0'}`}>
                      <Plus className="w-6 h-6 text-gray-600" />
                    </div>
                  </div>
                </button>
                <div className={`overflow-hidden transition-all duration-500 ease-in-out ${
                  openFAQ === faq.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}>
                  <div className={`px-8 pb-6 transform transition-all duration-500 ease-out ${
                    openFAQ === faq.id ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
                  }`}>
                    <div className="border-t border-gray-100 pt-6">
                      <p className="text-gray-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
