// src/pages/dashboard.tsx
import React, { useState, useEffect } from 'react';
import { FaSun, FaThermometerHalf, FaTint } from 'react-icons/fa';
import { ClothingModel } from '@/components/dashboard/ClothingModel';
import { MetricCircle } from '@/components/dashboard/MetricCircle';
import { ProgressBar } from '@/components/dashboard/ProgressBar';

// Mock data - replace with actual API call or data source
const mockTests = [
  { id: 1, test_id: "TEST-001" },
  { id: 2, test_id: "TEST-002" },
  { id: 3, test_id: "TEST-003" },
];

const mockData = {
  timestamp: "2025-04-21T14:30:00",
  light: 85,
  temp_in: 26.5,
  temp_out: 28.2,
  hum_in: 78,
  hum_out: 45,
  diff_temp: 1.7,
  diff_hum: -33,
  test_id: "TEST-001",
  status: "in_process",
  startTime: "2025-04-21T12:00:00"
};

export default function Dashboard() {
  const [selectedTest, setSelectedTest] = useState(mockTests[0].test_id);
  const [data, setData] = useState(mockData);
  const [duration, setDuration] = useState("02:30:00");
  
  // Calculate completion percentage - this is just an example logic
  // You might want to adjust based on your specific requirements
  const completionPercentage = 100 - Math.min(100, Math.max(0, data.hum_in));
  
  // Update duration timer
  useEffect(() => {
    const interval = setInterval(() => {
      const start = new Date(data.startTime);
      const now = new Date();
      const diff = now.getTime() - start.getTime();
      
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setDuration(
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      );
    }, 1000);
    
    return () => clearInterval(interval);
  }, [data.startTime]);
  
  // In a real app, you'd fetch data based on selected test
  useEffect(() => {
    // Mock API call
    // Example: fetchData(selectedTest).then(data => setData(data));
    // For now, just update the test_id
    setData({...data, test_id: selectedTest});
  }, [selectedTest]);

  return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Drying Dashboard</h1>
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Side */}
          <div className="w-full md:w-1/2 bg-white rounded-lg shadow-md p-6">
            {/* Top Circles */}
            <div className="flex justify-between mb-8">
              <MetricCircle 
                icon={<FaSun className="text-yellow-400" />} 
                value={data.light} 
                label="Light" 
                unit="%" 
              />
              <MetricCircle 
                icon={<FaThermometerHalf className="text-red-500" />} 
                value={data.temp_in} 
                label="Temperature" 
                unit="°C" 
              />
              <MetricCircle 
                icon={<FaTint className="text-blue-500" />} 
                value={data.hum_in} 
                label="Humidity" 
                unit="%" 
              />
            </div>
            
            {/* Shirt Model */}
            <div className="flex flex-col items-center">
              <ClothingModel humidityLevel={data.hum_in} />
              
              <div className="w-full mt-6">
                <p className="text-center mb-2">Drying Progress</p>
                <ProgressBar percentage={completionPercentage} />
                <p className="text-center mt-2 text-lg font-semibold">
                  {completionPercentage.toFixed(1)}% Complete
                </p>
              </div>
            </div>
          </div>
          
          {/* Right Side */}
          <div className="w-full md:w-1/2 bg-white rounded-lg shadow-md p-6">
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Test</label>
              <select 
                className="w-full border border-gray-300 rounded-md py-2 px-3"
                value={selectedTest}
                onChange={(e) => setSelectedTest(e.target.value)}
              >
                {mockTests.map(test => (
                  <option key={test.id} value={test.test_id}>{test.test_id}</option>
                ))}
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="border rounded-md p-4">
                <h3 className="text-sm text-gray-500">Test ID</h3>
                <p className="text-xl font-semibold">{data.test_id}</p>
              </div>
              
              <div className="border rounded-md p-4">
                <h3 className="text-sm text-gray-500">Duration</h3>
                <p className="text-xl font-semibold">{duration}</p>
              </div>
              
              <div className="border rounded-md p-4">
                <h3 className="text-sm text-gray-500">Status</h3>
                <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  data.status === 'in_process' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                }`}>
                  {data.status === 'in_process' ? 'In Process' : 'Complete'}
                </div>
              </div>
              
              <div className="border rounded-md p-4">
                <h3 className="text-sm text-gray-500">Last Update</h3>
                <p className="text-xl font-semibold">
                  {new Date(data.timestamp).toLocaleTimeString()}
                </p>
              </div>
              
              <div className="border rounded-md p-4">
                <h3 className="text-sm text-gray-500">Temp Difference</h3>
                <p className="text-xl font-semibold">
                  {data.diff_temp > 0 ? '+' : ''}{data.diff_temp}°C
                </p>
              </div>
              
              <div className="border rounded-md p-4">
                <h3 className="text-sm text-gray-500">Humidity Difference</h3>
                <p className="text-xl font-semibold">
                  {data.diff_hum > 0 ? '+' : ''}{data.diff_hum}%
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}