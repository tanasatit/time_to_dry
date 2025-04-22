import React, { useRef, useEffect, useState } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

interface ClothingModelProps {
  humidityLevel: number;
}

export const ClothingModel: React.FC<ClothingModelProps> = ({ humidityLevel }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const waterTopOffset = Math.max(50, 200 - humidityLevel * 1.5);

  // Update container dimensions for responsive layout
  useEffect(() => {
    if (containerRef.current) {
      setContainerSize({
        width: containerRef.current.offsetWidth,
        height: containerRef.current.offsetHeight,
      });
    }
  }, []);

  // Convert humidity to percentage height (higher humidity = higher water)
  const clampedHumidity = Math.min(90, Math.max(10, humidityLevel));

  const waterHeightPercent = clampedHumidity;
  const waveTop = 100 - waterHeightPercent;

  return (
    <div ref={containerRef} className="relative w-64 h-80 overflow-hidden">
      {/* Wave animation (Lottie) */}
      <div
        className="absolute z-10 overflow-hidden"
        style={{
          top: `${(containerSize.height * waveTop) / 100 + 10}px`,
          height: `${(containerSize.height * waterHeightPercent) / 100 - 50}px`,
          clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)',
        }}
      >
        <DotLottieReact
          src="/animations/wave.lottie"
          loop
          autoplay
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
      <img
        src="/drying_with_white_bg.svg"
        alt="Shirt outline"
        className="absolute top-0 left-0 w-full h-full z-20 pointer-events-none"
        style={{
          imageRendering: 'pixelated',
          display: 'block',
        }}
      />
    </div>

  );
};
