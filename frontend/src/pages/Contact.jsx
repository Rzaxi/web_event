import React, { useState } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send,
  MessageSquare,
  Users,
  Building,
  ArrowRight,
  CheckCircle,
  Globe,
  Facebook,
  Instagram,
  Twitter,
  Linkedin
} from 'lucide-react';
import AnimatedSection from '../components/common/AnimatedSection';

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

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      details: 'info@schoolevents.id',
      subtitle: 'Respon dalam 24 jam',
      color: 'blue'
    },
    {
      icon: Phone,
      title: 'Telepon',
      details: '+62 21 1234 5678',
      subtitle: 'Senin - Jumat, 08:00 - 17:00',
      color: 'green'
    },
    {
      icon: MapPin,
      title: 'Alamat',
      details: 'Jl. Pendidikan No. 123',
      subtitle: 'Jakarta Selatan, 12345',
      color: 'purple'
    },
    {
      icon: Clock,
      title: 'Jam Operasional',
      details: 'Senin - Jumat',
      subtitle: '08:00 - 17:00 WIB',
      color: 'orange'
    }
  ];

  const inquiryTypes = [
    { value: 'general', label: 'Pertanyaan Umum', icon: MessageSquare },
    { value: 'partnership', label: 'Kemitraan Sekolah', icon: Building },
    { value: 'support', label: 'Bantuan Teknis', icon: Users },
    { value: 'feedback', label: 'Saran & Masukan', icon: CheckCircle }
  ];

  const socialLinks = [
    { icon: Facebook, name: 'Facebook', url: '#', color: 'blue' },
    { icon: Instagram, name: 'Instagram', url: '#', color: 'pink' },
    { icon: Twitter, name: 'Twitter', url: '#', color: 'sky' },
    { icon: Linkedin, name: 'LinkedIn', url: '#', color: 'indigo' }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="pt-20 pb-16 bg-gradient-to-br from-slate-50 via-white to-blue-50 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-teal-100 to-cyan-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <AnimatedSection animation="fade-up">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 px-6 py-3 rounded-full text-sm font-semibold mb-8 border border-blue-200/50 shadow-sm">
                <MessageSquare className="w-4 h-4 mr-2" />
                Hubungi Kami
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-8 leading-tight">
                Mari Berkolaborasi
                <br />
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Bersama Kami
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto mb-12">
                Kami siap membantu sekolah Anda dalam menghadirkan event-event yang berkesan. 
                Hubungi tim kami untuk konsultasi gratis dan solusi terbaik.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactInfo.map((info, index) => {
              const Icon = info.icon;
              const colorClasses = {
                blue: 'from-blue-100 to-blue-200 text-blue-600',
                green: 'from-green-100 to-green-200 text-green-600',
                purple: 'from-purple-100 to-purple-200 text-purple-600',
                orange: 'from-orange-100 to-orange-200 text-orange-600'
              };
              
              return (
                <AnimatedSection key={index} animation="fade-up" delay={index * 200}>
                  <div className="text-center group hover:transform hover:-translate-y-2 transition-all duration-300">
                    <div className={`w-16 h-16 bg-gradient-to-br ${colorClasses[info.color]} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{info.title}</h3>
                    <p className="text-gray-900 font-semibold mb-1">{info.details}</p>
                    <p className="text-gray-600 text-sm">{info.subtitle}</p>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Form */}
            <AnimatedSection animation="fade-right">
              <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">Kirim Pesan</h2>
                  <p className="text-gray-600">
                    Isi formulir di bawah ini dan tim kami akan segera menghubungi Anda.
                  </p>
                </div>

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
                      className="text-blue-600 hover:text-blue-700 font-semibold"
                    >
                      Kirim Pesan Lain
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Nama Lengkap *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                          placeholder="Masukkan nama lengkap"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                          placeholder="nama@email.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Jenis Pertanyaan
                      </label>
                      <select
                        name="type"
                        value={formData.type}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      >
                        {inquiryTypes.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Subjek *
                      </label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                        placeholder="Subjek pesan Anda"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Pesan *
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        rows={6}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none"
                        placeholder="Tulis pesan Anda di sini..."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none disabled:hover:shadow-lg flex items-center justify-center"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Mengirim...
                        </>
                      ) : (
                        <>
                          Kirim Pesan
                          <Send className="w-5 h-5 ml-2" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </AnimatedSection>

            {/* Additional Info */}
            <AnimatedSection animation="fade-left">
              <div className="space-y-8">
                {/* FAQ */}
                <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Pertanyaan Umum</h3>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Bagaimana cara mendaftar sekolah?</h4>
                      <p className="text-gray-600 text-sm">
                        Hubungi tim kami melalui formulir atau email untuk konsultasi gratis dan proses onboarding.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Apakah ada biaya berlangganan?</h4>
                      <p className="text-gray-600 text-sm">
                        Kami menyediakan berbagai paket sesuai kebutuhan sekolah. Konsultasi gratis untuk menentukan paket terbaik.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Bagaimana dukungan teknis?</h4>
                      <p className="text-gray-600 text-sm">
                        Tim support kami siap membantu 24/7 melalui berbagai channel komunikasi.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Social Media */}
                <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Ikuti Kami</h3>
                  <p className="text-gray-600 mb-6">
                    Dapatkan update terbaru dan tips mengelola event sekolah di media sosial kami.
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    {socialLinks.map((social, index) => {
                      const Icon = social.icon;
                      const colorClasses = {
                        blue: 'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
                        pink: 'from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700',
                        sky: 'from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700',
                        indigo: 'from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700'
                      };
                      
                      return (
                        <a
                          key={index}
                          href={social.url}
                          className={`flex items-center justify-center bg-gradient-to-r ${colorClasses[social.color]} text-white p-4 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg group`}
                        >
                          <Icon className="w-6 h-6 mr-2 group-hover:scale-110 transition-transform" />
                          <span className="font-semibold">{social.name}</span>
                        </a>
                      );
                    })}
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Map Section (Placeholder) */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <AnimatedSection animation="fade-up">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Lokasi Kami</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Kunjungi kantor kami untuk diskusi lebih lanjut tentang kebutuhan event sekolah Anda.
              </p>
            </div>
            
            <div className="bg-gray-100 rounded-3xl h-96 flex items-center justify-center border border-gray-200">
              <div className="text-center">
                <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 font-medium">Interactive Map</p>
                <p className="text-gray-400 text-sm">Jl. Pendidikan No. 123, Jakarta Selatan</p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
};

export default Contact;
