import { useEffect, useRef } from 'react';

const Shuffle = ({
  text = "Hello World",
  shuffleDirection = "right",
  triggerOnHover = true,
  respectReducedMotion = true
}) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check for reduced motion preference
    if (respectReducedMotion && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      container.classList.add('is-ready');
      return;
    }

    // Split text into characters
    const chars = text.split('').map((char, index) => {
      const wrapper = document.createElement('span');
      wrapper.className = 'shuffle-char-wrapper';
      wrapper.style.animationDelay = `${index * 0.05}s`;
      
      const charSpan = document.createElement('span');
      charSpan.className = 'shuffle-char';
      charSpan.textContent = char === ' ' ? '\u00A0' : char;
      
      wrapper.appendChild(charSpan);
      return wrapper;
    });

    // Clear container and add chars
    container.innerHTML = '';
    chars.forEach(char => container.appendChild(char));

    // Add direction class
    container.classList.add(`shuffle-${shuffleDirection}`);
    
    // Trigger animation
    setTimeout(() => {
      container.classList.add('is-ready', 'animate-in');
    }, 100);

    // Hover animation
    if (triggerOnHover) {
      const handleHover = () => {
        container.classList.remove('animate-in');
        setTimeout(() => {
          container.classList.add('animate-in');
        }, 50);
      };
      
      container.addEventListener('mouseenter', handleHover);
      return () => container.removeEventListener('mouseenter', handleHover);
    }
  }, [text, shuffleDirection, triggerOnHover, respectReducedMotion]);

  return (
    <div 
      ref={containerRef}
      className="shuffle-parent"
    >
      {text}
    </div>
  );
};

export default Shuffle;