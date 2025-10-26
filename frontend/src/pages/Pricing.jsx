import React, { useState, useEffect } from 'react';
import { Check, Star, ArrowRight, Zap, Shield, Users, Crown, Plus, Minus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AnimatedSection from '../components/common/AnimatedSection';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const Pricing = () => {
  const [billingPeriod, setBillingPeriod] = useState('monthly');
  const [openFAQ, setOpenFAQ] = useState(null);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const navigate = useNavigate();

  // Animation hooks for FAQ section
  const [faqHeaderRef, faqHeaderVisible] = useScrollAnimation(0.1);
  const [faqListRef, faqListVisible] = useScrollAnimation(0.1);

  // Page load animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setHasLoaded(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const plans = [
    {
      name: 'User',
      subtitle: 'Untuk peserta event',
      price: 'Gratis',
      originalPrice: null,
      period: 'Selamanya',
      features: [
        'Daftar event unlimited',
        'Download e-tiket',
        'Notifikasi event',
        'Riwayat event',
        'QR code check-in'
      ],
      buttonText: 'Mulai Gratis',
      buttonStyle: 'dark',
      role: 'user'
    },
    {
      name: 'Event Organizer Basic',
      subtitle: 'Untuk penyelenggara pemula',
      price: billingPeriod === 'monthly' ? 'Rp 99.000' : 'Rp 89.000',
      originalPrice: billingPeriod === 'monthly' ? 'Rp 149.000' : 'Rp 129.000',
      period: billingPeriod === 'monthly' ? 'per bulan' : 'per bulan (bayar tahunan)',
      features: [
        'Buat maksimal 5 event per bulan',
        'Kelola peserta event',
        'Dashboard analytics dasar',
        'Export data peserta',
        'Notifikasi event'
      ],
      buttonText: 'Pilih Basic',
      buttonStyle: 'dark',
      role: 'event_organizer_basic'
    },
    {
      name: 'Event Organizer Pro',
      subtitle: 'Untuk penyelenggara profesional',
      price: billingPeriod === 'monthly' ? 'Rp 199.000' : 'Rp 179.000',
      originalPrice: billingPeriod === 'monthly' ? 'Rp 299.000' : 'Rp 259.000',
      period: billingPeriod === 'monthly' ? 'per bulan' : 'per bulan (bayar tahunan)',
      features: [
        'Buat event unlimited',
        'Kelola peserta unlimited',
        'Dashboard analytics lengkap',
        'Export data peserta',
        'Notifikasi event',
        'QR code untuk absensi'
      ],
      buttonText: 'Pilih Pro',
      buttonStyle: 'primary',
      popular: true,
      role: 'event_organizer_pro'
    }
  ];

  const faqData = [
    {
      id: 1,
      question: "Apa perbedaan antara Event Organizer Basic dan Pro?",
      answer: "Event Organizer Basic cocok untuk pemula dengan limit 5 event per bulan dan fitur dasar. Event Organizer Pro untuk profesional dengan unlimited event dan analytics lengkap."
    },
    {
      id: 2,
      question: "Bagaimana cara upgrade dari User ke Event Organizer?",
      answer: "Pilih paket Basic atau Pro sesuai kebutuhan, lakukan pembayaran, dan akun Anda akan langsung diupgrade. Anda bisa mulai membuat event setelah upgrade berhasil."
    },
    {
      id: 3,
      question: "Apakah bisa upgrade dari Basic ke Pro?",
      answer: "Ya, Anda dapat upgrade dari Basic ke Pro kapan saja. Selisih harga akan dihitung secara proporsional dan limit event akan langsung berubah menjadi unlimited."
    },
    {
      id: 4,
      question: "Apa yang terjadi jika sudah buat 5 event di paket Basic?",
      answer: "Setelah mencapai limit 5 event per bulan, Anda tidak dapat membuat event baru sampai bulan berikutnya atau upgrade ke paket Pro untuk unlimited event."
    },
    {
      id: 5,
      question: "Metode pembayaran apa saja yang diterima?",
      answer: "Kami menerima transfer bank, kartu kredit (Visa, MasterCard), dan berbagai metode pembayaran digital seperti GoPay, OVO, DANA, dan ShopeePay."
    },
    {
      id: 6,
      question: "Apakah ada trial period?",
      answer: "Ya, kami menyediakan trial period 7 hari untuk semua paket berbayar. Jika tidak puas dalam 14 hari pertama, kami akan mengembalikan uang Anda 100%."
    },
    {
      id: 7,
      question: "Bisakah saya downgrade paket?",
      answer: "Ya, Anda dapat downgrade kapan saja. Event yang sudah dibuat akan tetap aktif, namun fitur dan limit akan disesuaikan dengan paket baru mulai periode berikutnya."
    }
  ];

  const toggleFAQ = (id) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };

  const handlePlanSelect = (plan) => {
    if (!user) {
      toast.info('Silakan login terlebih dahulu untuk memilih paket');
      navigate('/login');
      return;
    }

    switch (plan.role) {
      case 'user':
        if (user.role === 'user') {
          toast.info('Anda sudah menggunakan paket User');
        } else {
          toast.info('Anda sudah memiliki akses Event Organizer');
        }
        break;
      
      case 'event_organizer_basic':
        if (user.role === 'event_organizer_basic') {
          toast.info('Anda sudah menggunakan paket Event Organizer Basic');
        } else if (user.role === 'event_organizer_pro') {
          toast.info('Anda sudah memiliki paket Pro yang lebih tinggi');
        } else {
          handleUpgradeToOrganizer(plan);
        }
        break;
      
      case 'event_organizer_pro':
        if (user.role === 'event_organizer_pro') {
          toast.info('Anda sudah menggunakan paket Event Organizer Pro');
        } else {
          handleUpgradeToOrganizer(plan);
        }
        break;
      
      default:
        toast.error('Paket tidak valid');
    }
  };

  const handleUpgradeToOrganizer = (plan) => {
    // Simulate payment process
    const planName = plan.role === 'event_organizer_basic' ? 'Event Organizer Basic' : 'Event Organizer Pro';
    toast.success(`Mengarahkan ke halaman pembayaran untuk ${planName}...`);
    
    // In real implementation, redirect to payment gateway
    setTimeout(() => {
      // Simulate successful payment
      const updatedUser = { ...user, role: plan.role };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      toast.success(`Selamat! Akun Anda telah diupgrade ke ${planName}`);
      navigate('/profile/settings');
    }, 2000);
  };

  const faqs = [
    {
      question: 'Apakah ada biaya tersembunyi?',
      answer: 'Tidak ada biaya tersembunyi. Semua fitur yang tercantum dalam paket sudah termasuk dalam harga yang ditampilkan.'
    },
    {
      question: 'Bisakah upgrade atau downgrade paket?',
      answer: 'Ya, Anda dapat mengubah paket kapan saja. Perubahan akan berlaku pada periode billing berikutnya.'
    },
    {
      question: 'Apakah data kami aman?',
      answer: 'Keamanan data adalah prioritas utama kami. Kami menggunakan enkripsi tingkat enterprise dan mematuhi standar keamanan internasional.'
    },
    {
      question: 'Bagaimana cara pembayaran?',
      answer: 'Kami menerima transfer bank, kartu kredit, dan berbagai metode pembayaran digital lainnya.'
    }
  ];

  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Hero Section */}
      <section className="pt-20 pb-16 relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <AnimatedSection animation="fade-up">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Paket & Harga
              </h1>
              
              <p className="text-lg text-gray-600 mb-12 leading-relaxed max-w-2xl mx-auto">
                Pilih paket yang sesuai dengan kebutuhan Anda. Upgrade ke Event Organizer untuk mulai membuat event sendiri.
              </p>

              {/* Billing Toggle */}
              <div className="inline-flex items-center bg-white rounded-full p-1 shadow-sm border border-gray-200 mb-16">
                <button
                  onClick={() => setBillingPeriod('monthly')}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    billingPeriod === 'monthly'
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Bulanan
                </button>
                <button
                  onClick={() => setBillingPeriod('annual')}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    billingPeriod === 'annual'
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Tahunan
                </button>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="pb-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl p-8 md:p-12">
            <div className="grid md:grid-cols-3 gap-8">
              {plans.map((plan, index) => (
                <AnimatedSection key={index} animation="fade-up" delay={index * 200}>
                  <div className={`relative rounded-2xl p-8 h-full flex flex-col ${
                    plan.popular 
                      ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 shadow-xl' 
                      : 'bg-gray-50 border border-gray-200'
                  }`}>
                    {/* Popular Badge */}
                    {plan.popular && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                          Paling Populer
                        </span>
                      </div>
                    )}

                    {/* Plan Header */}
                    <div className="mb-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                      <p className="text-gray-600 text-sm">{plan.subtitle}</p>
                    </div>

                    {/* Pricing */}
                    <div className="mb-6">
                      <div className="flex items-baseline mb-2">
                        <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                        {plan.originalPrice && (
                          <span className="text-lg text-gray-400 line-through ml-2">{plan.originalPrice}</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{plan.period}</p>
                    </div>

                    {/* Features */}
                    <div className="mb-8 flex-grow">
                      <h4 className="text-sm font-semibold text-gray-900 mb-4">Fitur yang termasuk:</h4>
                      <ul className="space-y-3">
                        {plan.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-start">
                            <Check className="w-4 h-4 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-700">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Button */}
                    <button 
                      onClick={() => handlePlanSelect(plan)}
                      className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
                        plan.buttonStyle === 'primary'
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl'
                          : 'bg-gray-900 text-white hover:bg-gray-800'
                      } ${user && user.role === plan.role ? 'opacity-50 cursor-not-allowed' : ''}`}
                      disabled={user && user.role === plan.role}
                    >
                      {user && user.role === plan.role ? 'Paket Aktif' : plan.buttonText}
                    </button>
                  </div>
                </AnimatedSection>
              ))}
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
              Pertanyaan yang Sering Diajukan
            </h2>
            <p className={`text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed transition-all duration-1000 delay-200 ${
              faqHeaderVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-8'
            }`}>
              Temukan jawaban untuk pertanyaan umum tentang paket berlangganan dan fitur platform kami.
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
                  transitionDelay: faqListVisible ? `${index * 100}ms` : '0ms',
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

export default Pricing;
