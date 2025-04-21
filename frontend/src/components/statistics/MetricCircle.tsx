import React from 'react';

interface MetricCircleProps {
  icon: React.ReactNode;
  value: number;
  label: string;
  unit: string;
  bgColor?: string; 
}

export const MetricCircle: React.FC<MetricCircleProps> = ({ icon, value, label, unit, bgColor = 'bg-gray-100' }) => {
  return (
    <div className="flex flex-col items-center">
      <div className={`w-24 h-24 rounded-full ${bgColor} flex flex-col items-center justify-center shadow-inner`}>
        <div className="text-2xl mb-1">{icon}</div>
        <div className="text-lg font-bold">{value}{unit}</div>
      </div>
      <p className="mt-2 text-gray-700 text-sm">{label}</p>
    </div>
  );
};
