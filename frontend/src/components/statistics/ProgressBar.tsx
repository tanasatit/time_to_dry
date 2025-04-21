import React from 'react';

interface ProgressBarProps {
  percentage: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ percentage }) => {
  return (
    <div className="w-full bg-gray-200 rounded-full h-4">
      <div 
        className="bg-green-500 h-4 rounded-full"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};