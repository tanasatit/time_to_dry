
// src/components/dashboard/WeatherCard.tsx
import React from 'react';

interface WeatherCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: string;
}

export default function WeatherCard({ title, value, unit, icon }: WeatherCardProps) {
  return (
    <div className="card bg-base-100 shadow-lg">
      <div className="card-body p-4 text-center">
        <div className="text-4xl mb-2">{icon}</div>
        <h3 className="card-title justify-center text-base-content/80">{title}</h3>
        <p className="text-2xl font-bold">
          {value}{unit && <span className="text-lg ml-1">{unit}</span>}
        </p>
      </div>
    </div>
  );
}