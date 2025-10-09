import React from 'react';
import { UserPlus, CreditCard, CheckCircle, ArrowRight, Trophy } from 'lucide-react';

const AdvantagesSection = () => {
  const steps = [
    {
      id: 1,
      step: "STEP ONE",
      title: "Smart Registration",
      subtitle: "Easy Peasy!",
      icon: UserPlus,
      bgGradient: "from-indigo-100 via-indigo-50 to-white"
    },
    {
      id: 2,
      step: "STEP TWO", 
      title: "Choose Your Event",
      subtitle: "Superfast!",
      icon: CreditCard,
      bgGradient: "from-blue-100 via-blue-50 to-white"
    },
    {
      id: 3,
      step: "STEP THREE",
      title: "Secure Payment",
      subtitle: "Smartest!",
      icon: CheckCircle,
      bgGradient: "from-indigo-100 via-indigo-50 to-white"
    },
    {
      id: 4,
      step: "STEP FOUR",
      title: "Enjoy Your Event",
      subtitle: "Amazing Experience!",
      icon: Trophy,
      bgGradient: "from-purple-100 via-purple-50 to-white"
    }
  ];

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-sm font-medium text-indigo-600 mb-4 block uppercase tracking-wide">
            How It Works
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 max-w-4xl mx-auto leading-tight">
            Join Events in 4 Simple Steps
          </h2>
        </div>

        {/* Steps Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-7xl mx-auto mb-12">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <div key={step.id} className="relative">
                {/* Step Card */}
                <div className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                  {/* Step Label */}
                  <div className="text-xs font-medium text-gray-400 mb-3 tracking-wider">
                    {step.step}
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-gray-900 mb-6 leading-tight">
                    {step.title}
                  </h3>

                  {/* Illustration Area */}
                  <div className={`relative mb-6 flex items-center justify-center bg-gradient-to-br ${step.bgGradient} rounded-2xl h-40 overflow-hidden`}>
                    {step.id === 1 && (
                      <div className="relative w-full h-full flex items-center justify-center">
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-200/30 to-transparent"></div>
                        <div className="w-20 h-28 bg-white/40 backdrop-blur-sm rounded-2xl shadow-lg flex items-center justify-center">
                          <div className="w-16 h-24 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-xl flex items-center justify-center">
                            <UserPlus className="w-10 h-10 text-indigo-600" />
                          </div>
                        </div>
                      </div>
                    )}
                    {step.id === 2 && (
                      <div className="relative w-full h-full flex items-center justify-center">
                        <div className="flex gap-3">
                          <div className="w-12 h-3 bg-gray-300 rounded-full"></div>
                          <div className="w-20 h-3 bg-indigo-400 rounded-full"></div>
                        </div>
                        <div className="absolute bottom-4 left-4 w-6 h-6 bg-gray-200 rounded"></div>
                        <div className="absolute bottom-4 right-4 flex gap-1">
                          <div className="w-8 h-2 bg-gray-300 rounded"></div>
                          <div className="w-8 h-2 bg-gray-300 rounded"></div>
                        </div>
                      </div>
                    )}
                    {step.id === 3 && (
                      <div className="relative w-full h-full flex items-center justify-center">
                        <div className="w-24 h-24 bg-white/50 backdrop-blur-sm rounded-2xl shadow-lg flex items-center justify-center">
                          <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-xl flex items-center justify-center relative">
                            <CheckCircle className="w-10 h-10 text-indigo-600" />
                            <div className="absolute top-2 right-2 w-3 h-3 bg-indigo-500 rounded-full animate-pulse"></div>
                          </div>
                        </div>
                      </div>
                    )}
                    {step.id === 4 && (
                      <div className="relative w-full h-full flex items-center justify-center">
                        <div className="relative">
                          <div className="absolute top-0 right-0 text-2xl">🎉</div>
                          <div className="w-24 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center px-4 shadow-xl">
                            <Trophy className="w-8 h-8 text-white" />
                          </div>
                          <div className="absolute -bottom-2 -right-2 bg-white rounded-lg px-3 py-1 shadow-md text-xs font-medium">
                            Finally
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Subtitle */}
                  <div className="bg-indigo-50 rounded-full px-4 py-2 text-xs font-medium text-indigo-700 text-center">
                    {step.subtitle}
                  </div>
                </div>

                {/* Arrow Connector */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-2 transform -translate-y-1/2 z-10">
                    <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center shadow-md">
                      <ArrowRight className="w-5 h-5 text-white" />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Description */}
        <div className="mt-8 text-center max-w-4xl mx-auto">
          <p className="text-sm text-gray-600 leading-relaxed">
            Bergabunglah dengan EventHub dan rasakan pengalaman mendaftar event yang revolusioner dalam 4 langkah mudah. Platform kami menjamin keamanan data dan memberikan pengalaman terbaik untuk setiap event.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AdvantagesSection;
