import { useEffect, useRef } from 'react';
import './GridMotion.css';

const GridMotion = ({ items = [] }) => {
  const rowRefs = useRef([]);

  const foodItems = [
    '🍕', '🍔', '🍣', '🍝', '🌮', '🍜', '🥗', '🥩',
    '🍛', '🍩', '🍦', '☕', '🥪', '🍲', '🥞', '🌭',
    '🍚', '🍗', '🦐', '🍞', '🧀', '🍎', '🥕', '🍰',
    '🥤', '🍖', '🥙', '🍤'
  ];

  useEffect(() => {
    const handleMouseMove = (e) => {
      const mouseX = e.clientX;
      const maxMove = 100;
      
      rowRefs.current.forEach((row, index) => {
        if (row) {
          const direction = index % 2 === 0 ? 1 : -1;
          const moveAmount = ((mouseX / window.innerWidth) * maxMove - maxMove / 2) * direction;
          
          row.style.transform = `translateX(${moveAmount}px)`;
        }
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="grid-motion-bg">
      {Array.from({ length: 4 }, (_, rowIndex) => (
        <div
          key={rowIndex}
          className="grid-row"
          ref={el => {
            rowRefs.current[rowIndex] = el;
          }}
        >
          {Array.from({ length: 8 }, (_, itemIndex) => {
            const foodItem = foodItems[(rowIndex * 8 + itemIndex) % foodItems.length];
            return (
              <div key={itemIndex} className="grid-item">
                <span className="food-emoji">{foodItem}</span>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default GridMotion;