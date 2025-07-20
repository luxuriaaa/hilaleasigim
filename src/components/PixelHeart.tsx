import React from 'react';

interface PixelHeartProps {
  size?: number;
  className?: string;
  animated?: boolean;
  animationDelay?: number;
}

const PixelHeart: React.FC<PixelHeartProps> = ({ 
  size = 64, 
  className = '', 
  animated = false, 
  animationDelay = 0 
}) => {
  const pixelSize = size / 16;
  
  // Detailed pixel heart pattern (16x16 grid) with border and highlights
  // 0 = transparent, 1 = black border, 2 = red fill, 3 = white highlight
  const heartPattern = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0],
    [0, 0, 1, 2, 2, 2, 1, 0, 0, 1, 2, 2, 2, 1, 0, 0],
    [0, 1, 2, 3, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 1, 0],
    [0, 1, 2, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0],
    [0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0],
    [0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0],
    [0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 1, 2, 2, 1, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ];

  const getPixelColor = (pixel: number) => {
    switch (pixel) {
      case 0: return 'bg-transparent';
      case 1: return 'bg-gray-900 shadow-lg'; // Black border with shadow
      case 2: return 'bg-red-600 shadow-md'; // Darker red fill with shadow
      case 3: return 'bg-white shadow-sm'; // White highlight with shadow
      default: return 'bg-transparent';
    }
  };

  // Calculate animation delay for each pixel based on distance from center
  const getPixelAnimationDelay = (rowIndex: number, colIndex: number) => {
    if (!animated) return 0;
    
    const centerX = 8;
    const centerY = 8;
    const distance = Math.sqrt(Math.pow(colIndex - centerX, 2) + Math.pow(rowIndex - centerY, 2));
    return animationDelay + (distance * 50); // 50ms per distance unit
  };

  return (
    <div className={`inline-block ${className}`} style={{ width: size, height: size }}>
      <div 
        className="grid gap-0" 
        style={{ 
          gridTemplateColumns: 'repeat(16, 1fr)',
          width: size,
          height: size
        }}
      >
        {heartPattern.map((row, rowIndex) =>
          row.map((pixel, colIndex) => {
            const delay = getPixelAnimationDelay(rowIndex, colIndex);
            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`${getPixelColor(pixel)} ${
                  animated && pixel !== 0 
                    ? 'animate-scale-in-bounce transform-gpu' 
                    : ''
                }`}
                style={{
                  width: pixelSize,
                  height: pixelSize,
                  animationDelay: animated ? `${delay}ms` : '0ms',
                  animationFillMode: 'both',
                  transform: animated && pixel !== 0 ? 'scale(0)' : 'scale(1)',
                }}
              />
            );
          })
        )}
      </div>
    </div>
  );
};

export default PixelHeart;