import React, { useState, useEffect } from 'react';

const AppLoader = ({ onLoadingComplete }) => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');

  const loadingSteps = [
    { step: 'Initializing...', duration: 200 },
    { step: 'Loading components...', duration: 300 },
    { step: 'Connecting to server...', duration: 250 },
    { step: 'Almost ready...', duration: 150 }
  ];

  useEffect(() => {
    let currentProgress = 0;
    let stepIndex = 0;

    const updateProgress = () => {
      if (stepIndex < loadingSteps.length) {
        setCurrentStep(loadingSteps[stepIndex].step);
        
        const stepDuration = loadingSteps[stepIndex].duration;
        const stepProgress = 100 / loadingSteps.length;
        const startProgress = currentProgress;
        const endProgress = currentProgress + stepProgress;
        
        let startTime = Date.now();
        
        const animateStep = () => {
          const elapsed = Date.now() - startTime;
          const stepProgressPercent = Math.min(elapsed / stepDuration, 1);
          const newProgress = startProgress + (stepProgress * stepProgressPercent);
          
          setProgress(newProgress);
          
          if (stepProgressPercent < 1) {
            requestAnimationFrame(animateStep);
          } else {
            currentProgress = endProgress;
            stepIndex++;
            
            if (stepIndex < loadingSteps.length) {
              setTimeout(updateProgress, 100);
            } else {
              setTimeout(() => {
                onLoadingComplete && onLoadingComplete();
              }, 200);
            }
          }
        };
        
        requestAnimationFrame(animateStep);
      }
    };

    updateProgress();
  }, [onLoadingComplete]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-indigo-50 to-blue-50 flex items-center justify-center z-50">
      <div className="text-center space-y-8 max-w-md mx-auto px-6">
        {/* Logo Animation */}
        <div className="relative">
          <div className="bg-indigo-500 p-6 rounded-2xl shadow-2xl transform animate-bounce">
            <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center">
              <span className="text-indigo-500 font-bold text-2xl">SE</span>
            </div>
          </div>
          
          {/* Floating particles */}
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-blue-400 rounded-full animate-ping"></div>
          <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-purple-400 rounded-full animate-ping animation-delay-200"></div>
          <div className="absolute top-1/2 -right-4 w-2 h-2 bg-green-400 rounded-full animate-ping animation-delay-400"></div>
        </div>

        {/* App Name */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 animate-fade-in">
            SchoolEvents
          </h1>
          <p className="text-gray-600 animate-fade-in animation-delay-300">
            Platform Terpercaya
          </p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-4">
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full transition-all duration-300 ease-out relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
            </div>
          </div>
          
          {/* Loading Text */}
          <div className="min-h-[24px]">
            <p className="text-gray-700 font-medium animate-pulse">
              {currentStep}
            </p>
          </div>
          
          {/* Progress Percentage */}
          <p className="text-sm text-gray-500">
            {Math.round(progress)}%
          </p>
        </div>

        {/* Loading Dots */}
        <div className="flex justify-center space-x-2">
          <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce animation-delay-200"></div>
          <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce animation-delay-400"></div>
        </div>
      </div>
    </div>
  );
};

export default AppLoader;
