import React, { useRef, useEffect, useState } from 'react';

const AnimatedSection = ({ 
  children, 
  animation = 'fade-up', 
  delay = 0, 
  threshold = 0.1, 
  duration = 800,
  easing = 'ease-out',
  once = true 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const currentRef = sectionRef.current;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && (!hasAnimated || !once)) {
          setTimeout(() => {
            setIsVisible(true);
            setHasAnimated(true);
          }, delay);
          
          if (once && currentRef) {
            observer.unobserve(currentRef);
          }
        } else if (!entry.isIntersecting && !once) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin: '50px' }
    );

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold, delay, once, hasAnimated]);

  const getAnimationStyles = () => {
    const baseStyles = {
      transition: `all ${duration}ms ${easing}`,
      willChange: 'transform, opacity'
    };

    if (!isVisible) {
      switch (animation) {
        case 'fade-up':
          return { ...baseStyles, opacity: 0, transform: 'translateY(60px)' };
        case 'fade-down':
          return { ...baseStyles, opacity: 0, transform: 'translateY(-60px)' };
        case 'fade-left':
          return { ...baseStyles, opacity: 0, transform: 'translateX(-60px)' };
        case 'fade-right':
          return { ...baseStyles, opacity: 0, transform: 'translateX(60px)' };
        case 'scale':
          return { ...baseStyles, opacity: 0, transform: 'scale(0.8)' };
        case 'zoom':
          return { ...baseStyles, opacity: 0, transform: 'scale(1.2)' };
        case 'rotate':
          return { ...baseStyles, opacity: 0, transform: 'rotate(-10deg) scale(0.9)' };
        case 'slide-up':
          return { ...baseStyles, opacity: 0, transform: 'translateY(100px) scale(0.95)' };
        case 'bounce':
          return { ...baseStyles, opacity: 0, transform: 'translateY(60px) scale(0.9)' };
        default:
          return { ...baseStyles, opacity: 0 };
      }
    }

    // Visible state
    const visibleTransform = animation === 'bounce' ? 'translateY(0) scale(1)' : 'translateY(0) translateX(0) scale(1) rotate(0deg)';
    return {
      ...baseStyles,
      opacity: 1,
      transform: visibleTransform,
      ...(animation === 'bounce' && {
        transition: `all ${duration}ms cubic-bezier(0.68, -0.55, 0.265, 1.55)`
      })
    };
  };

  return (
    <div
      ref={sectionRef}
      style={getAnimationStyles()}
      className="animated-section"
    >
      {children}
    </div>
  );
};

export default AnimatedSection;
