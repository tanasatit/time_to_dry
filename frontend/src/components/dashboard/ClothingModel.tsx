import React from 'react';

interface ClothingModelProps {
  humidityLevel: number;
}

export const ClothingModel: React.FC<ClothingModelProps> = ({ humidityLevel }) => {
  // Calculate water level height as inverse of dryness
  // 100% humidity = full water, 0% humidity = empty
  const waterHeight = `${humidityLevel}%`;
  
  return (
    <div className="relative w-64 h-80">
      {/* Shirt outline */}
      <svg viewBox="0 0 200 250" className="w-full h-full">
        <path 
          d="M50,50 L50,200 L150,200 L150,50 L120,30 C100,20 100,20 80,30 L50,50 Z" 
          fill="none" 
          stroke="black" 
          strokeWidth="2"
        />
        <path 
          d="M80,30 L80,70 L120,70 L120,30" 
          fill="none" 
          stroke="black" 
          strokeWidth="2"
        />
        {/* Sleeves */}
        <path 
          d="M50,50 L20,80 L30,100 L50,80" 
          fill="none" 
          stroke="black" 
          strokeWidth="2"
        />
        <path 
          d="M150,50 L180,80 L170,100 L150,80" 
          fill="none" 
          stroke="black" 
          strokeWidth="2"
        />
        
        {/* Water visualization area - clipped to shirt body */}
        <defs>
          <clipPath id="shirtClip">
            <path d="M51,51 L51,199 L149,199 L149,51 L120,31 C100,21 100,21 80,31 L51,51 Z" />
          </clipPath>
        </defs>
        
        {/* Water level - adjust height based on humidity */}
        <rect 
          x="51" 
          y={`${200 - (humidityLevel * 1.5)}`} 
          width="98" 
          height="200" 
          fill="rgba(0, 150, 255, 0.5)" 
          clipPath="url(#shirtClip)" 
        />
      </svg>
    </div>
  );
};