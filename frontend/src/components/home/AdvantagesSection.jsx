import React, { useState, useEffect } from 'react';
import { 
  UserPlus, 
  LogIn, 
  Search, 
  CreditCard, 
  CheckCircle, 
  FileText,
  ArrowRight,
  Settings,
  Sparkles,
  Shield
} from 'lucide-react';
import { useScrollAnimation, useStaggeredAnimation } from '../../hooks/useScrollAnimation';

const AdvantagesSection = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  // Add custom CSS animations
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
      }
      
      @keyframes sway {
        0%, 100% { transform: translateX(0px) rotate(0deg); }
        25% { transform: translateX(-3px) rotate(-0.5deg); }
        75% { transform: translateX(3px) rotate(0.5deg); }
      }
      
      @keyframes bounce-slow {
        0%, 100% { transform: translateY(0px) scale(1); }
        50% { transform: translateY(-5px) scale(1.05); }
      }
      
      .animate-float {
        animation: float 3s ease-in-out infinite;
      }
      
      .animate-sway {
        animation: sway 4s ease-in-out infinite;
      }
      
      .animate-bounce-slow {
        animation: bounce-slow 2s ease-in-out infinite;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  
  const registrationSteps = [
    {
      id: 1,
      step: "Step 1 of 4",
      title: "Browse & Select Events",
      description: "Search events...",
      icon: Search,
      illustration: "search",
      gradient: "from-blue-50 to-indigo-50",
      color: "blue"
    },
    {
      id: 2,
      step: "Step 2 of 4", 
      title: "Complete Registration",
      description: "Fill in your details",
      icon: FileText,
      illustration: "registration",
      gradient: "from-green-50 to-emerald-50",
      color: "green"
    },
    {
      id: 3,
      step: "Step 3 of 4",
      title: "Secure Payment",
      description: "Card, Bank",
      icon: CreditCard,
      illustration: "payment",
      gradient: "from-blue-50 to-cyan-50",
      color: "blue"
    },
    {
      id: 4,
      step: "Step 4 of 4",
      title: "Attend Event",
      description: "Check-in Successful!",
      icon: CheckCircle,
      illustration: "success",
      gradient: "from-green-50 to-emerald-50",
      color: "green"
    }
  ];

  // Animation hooks
  const [headerRef, isHeaderVisible] = useScrollAnimation(0.2);
  const [stepsRef, visibleSteps] = useStaggeredAnimation(registrationSteps, 200);
  
  // Page load animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Custom illustrations for each step
  const renderIllustration = (step, index) => {
    const stepColor = step.color === 'green' ? 'green' : 'blue';
    const bgColor = stepColor === 'green' ? 'bg-green-500' : 'bg-blue-500';
    const borderColor = stepColor === 'green' ? 'border-green-200' : 'border-blue-200';
    
    switch(step.illustration) {
      case 'search':
        return (
          <div className="relative w-full h-40 bg-gray-50 rounded-2xl p-4 overflow-hidden">
            {/* Search Interface */}
            <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
                <div className="flex-1 h-2 bg-gray-100 rounded"></div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-blue-100 rounded w-3/4"></div>
                <div className="h-2 bg-gray-100 rounded w-1/2"></div>
                <div className="h-3 bg-green-100 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        );
      
      case 'registration':
        return (
          <div className="relative w-full h-40 bg-gray-50 rounded-2xl p-4 overflow-hidden">
            {/* Registration Form */}
            <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
              <div className="mb-2">
                <div className="h-1 bg-green-400 rounded w-1/2 mb-2"></div>
                <div className="text-xs text-gray-500">Step 2 of 4</div>
              </div>
              <div className="space-y-2">
                <div className="h-2 bg-gray-200 rounded w-full"></div>
                <div className="h-2 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        );
      
      case 'payment':
        return (
          <div className="relative w-full h-40 bg-gray-50 rounded-2xl p-4 overflow-hidden">
            {/* Payment Interface */}
            <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
              <div className="flex gap-2 mb-3">
                <div className="flex-1 bg-blue-100 rounded p-2 text-center">
                  <div className="text-xs font-medium text-blue-600">Card</div>
                </div>
                <div className="flex-1 bg-gray-100 rounded p-2 text-center">
                  <div className="text-xs text-gray-500">Bank</div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-2 bg-blue-200 rounded w-full"></div>
                <div className="h-2 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        );
      
      case 'success':
        return (
          <div className="relative w-full h-40 bg-gray-50 rounded-2xl p-4 overflow-hidden">
            {/* Success State */}
            <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200 text-center">
              <div className="w-8 h-8 bg-green-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <div className="text-xs font-medium text-green-600 mb-1">Check-in Successful!</div>
              <div className="space-y-1">
                <div className="h-2 bg-gray-200 rounded w-3/4 mx-auto"></div>
                <div className="h-1 bg-orange-200 rounded w-1/2 mx-auto"></div>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div 
          ref={headerRef}
          className={`text-center mb-16 transition-all duration-1000 ease-out ${
            isHeaderVisible && isLoaded 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          }`}
        >
          <div className={`text-sm font-medium text-blue-600 mb-4 transition-all duration-700 delay-200 ${
            isHeaderVisible && isLoaded 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-4'
          }`}>
            How It Works
          </div>
          <h2 className={`text-3xl md:text-4xl font-bold text-gray-900 max-w-3xl mx-auto leading-tight transition-all duration-1000 delay-300 ${
            isHeaderVisible && isLoaded 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          }`}>
            4 Simple Steps
          </h2>
        </div>

        {/* Registration Steps Container - Straight Layout with Floating Animation */}
        <div ref={stepsRef} className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-200 via-green-200 to-blue-200 transform -translate-y-1/2 z-0"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {registrationSteps.map((step, index) => {
              const isVisible = visibleSteps.has(index) && isLoaded;
              const stepColor = step.color === 'green' ? 'green' : 'blue';
              const bgColor = stepColor === 'green' ? 'bg-green-500' : 'bg-blue-500';
              
              return (
                <div 
                  key={step.id} 
                  className={`transition-all duration-700 ease-out animate-float ${
                    isVisible 
                      ? 'opacity-100 translate-y-0 scale-100' 
                      : 'opacity-0 translate-y-12 scale-95'
                  }`}
                  style={{ 
                    transitionDelay: `${index * 150}ms`,
                    animationDelay: `${index * 0.5}s`,
                    animationDuration: `${3 + index * 0.3}s`
                  }}
                >
                  {/* Step Number Circle - Floating */}
                  <div className={`w-12 h-12 ${bgColor} rounded-full flex items-center justify-center text-white font-bold text-lg mb-6 mx-auto shadow-lg relative z-20 animate-bounce-slow`}
                       style={{
                         animationDelay: `${index * 0.7}s`,
                         animationDuration: `${2 + index * 0.2}s`
                       }}>
                    {step.id}
                  </div>
                  
                  {/* Step Card with floating animation */}
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-500 group relative overflow-hidden animate-sway"
                       style={{
                         animationDelay: `${index * 0.8}s`,
                         animationDuration: `${4 + index * 0.4}s`
                       }}>
                    {/* Step Badge */}
                    <div className="px-4 pt-4 pb-2">
                      <div className="text-xs font-medium text-gray-500 mb-2">
                        {step.step}
                      </div>
                    </div>
                    
                    {/* Illustration */}
                    <div className="px-4 mb-4">
                      {renderIllustration(step, index)}
                    </div>
                    
                    {/* Content */}
                    <div className="px-4 pb-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight">
                        {step.title}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {step.description}
                      </p>
                    </div>
                    
                    {/* Floating decorative elements */}
                    <div className="absolute top-2 right-2 w-2 h-2 bg-blue-400 rounded-full opacity-40 animate-ping" style={{animationDelay: `${index * 1.2}s`}}></div>
                    <div className="absolute bottom-2 left-2 w-1.5 h-1.5 bg-green-400 rounded-full opacity-30 animate-pulse" style={{animationDelay: `${index * 0.9}s`}}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdvantagesSection;
