import React from 'react';

interface MetricCircleProps {
  icon: React.ReactNode;
  value: number;
  label: string;
  unit: string;
}

export const MetricCircle: React.FC<MetricCircleProps> = ({ icon, value, label, unit }) => {
  return (
    <div className="flex flex-col items-center">
      <div className="w-20 h-20 rounded-full border-4 border-gray-200 flex items-center justify-center relative">
        <div className="absolute">
          {icon}
        </div>
        <div className="text-lg font-bold mt-6">
          {value}{unit}
        </div>
      </div>
      <p className="mt-2 text-gray-700">{label}</p>
    </div>
  );
};