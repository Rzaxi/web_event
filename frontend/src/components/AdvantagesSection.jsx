import React from 'react';
import { UserPlus, CreditCard, CheckCircle } from 'lucide-react';

const AdvantagesSection = () => {
  const advantages = [
    {
      id: 1,
      icon: UserPlus,
      title: "Buat Akun",
      description: "Daftar dengan mudah dan akses ribuan event menarik",
      gradient: "from-indigo-500 to-indigo-600",
      bgGradient: "from-indigo-50 to-indigo-100"
    },
    {
      id: 2,
      icon: CreditCard,
      title: "Pilih & Bayar Event",
      description: "Pilih event favorit dan bayar dengan aman dalam hitungan detik",
      gradient: "from-green-500 to-green-600",
      bgGradient: "from-green-50 to-green-100"
    },
    {
      id: 3,
      icon: CheckCircle,
      title: "Dapatkan Tiket",
      description: "Terima tiket digital langsung dan siap untuk mengikuti event",
      gradient: "from-orange-400 to-orange-500",
      bgGradient: "from-orange-50 to-orange-100"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2 animate-pulse"></span>
            Proses Mudah & Cepat
          </div>

          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Tidak Perlu Antri!
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-green-500">
              3 Langkah Mudah
            </span>
          </h2>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Pesan tiket event impianmu secara online dengan proses yang super mudah dan dapatkan kepastian tempat tanpa perlu mengantri
          </p>
        </div>

        {/* Advantages Grid */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12 relative">
          {advantages.map((advantage, index) => {
            const IconComponent = advantage.icon;
            return (
              <div key={advantage.id} className="relative group">
                {/* Card */}
                <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                  {/* Step Number */}
                  <div className={`absolute -top-4 left-8 w-8 h-8 bg-gradient-to-r ${advantage.gradient} text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg`}>
                    {advantage.id}
                  </div>

                  {/* Icon */}
                  <div className={`w-20 h-20 bg-gradient-to-br ${advantage.bgGradient} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className={`w-10 h-10 text-gradient-to-r ${advantage.gradient.replace('from-', 'text-').replace('to-', '').split(' ')[0]}`} />
                  </div>

                  {/* Content */}
                  <div className="text-center space-y-4">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                      {advantage.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {advantage.description}
                    </p>
                  </div>

                  {/* Hover Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-green-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                {/* Arrow Connector - improved */}
                {index < advantages.length - 1 && (
                  <div
                    className="hidden lg:flex absolute top-1/2 left-full ml-10 -translate-y-1/2 w-40 items-center justify-center z-0 pointer-events-none"
                    aria-hidden="true"
                  >
                    <svg
                      width="160"
                      height="60"
                      viewBox="0 0 160 60"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="overflow-visible"
                    >
                      <defs>
                        <linearGradient id={`grad-${index}`} x1="0" y1="30" x2="160" y2="30" gradientUnits="userSpaceOnUse">
                          <stop offset="0%" stopColor="#6366F1" />
                          <stop offset="100%" stopColor="#22C55E" />
                        </linearGradient>
                      </defs>

                      {/* smooth curved line */}
                      <path
                        d="M10 30 C 50 30, 110 30, 140 30"
                        stroke={`url(#grad-${index})`}
                        strokeWidth="3"
                        strokeLinecap="round"
                        fill="none"
                      />

                      {/* subtle dotted background guide */}
                      <path
                        d="M10 30 C 50 30, 110 30, 140 30"
                        stroke="#E0E7FF"
                        strokeWidth="1"
                        strokeDasharray="4 6"
                        fill="none"
                      />

                      {/* arrow head */}
                      <path d="M140 24 L154 30 L140 36 Z" fill="#4F46E5" />

                      {/* highlight line on arrow head */}
                      <path d="M142 30 L150 30" stroke="white" strokeWidth="1.2" opacity="0.7" />
                    </svg>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default AdvantagesSection;
