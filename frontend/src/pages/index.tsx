// src/pages/index.tsx
import Head from 'next/head';
import React from 'react';

export default function Home() {
  // Mock data - replace with actual data fetching later
  const weatherData = {
    temperature: 28,
    humidity: 65,
    rainfall: 0,
    rating: 4,
  };

  return (
    <>
      <Head>
        <title>Time to Dry - Home</title>
        <meta name="description" content="Smart cloth drying assistant" />
      </Head>

      <div className="flex flex-col gap-8">
        {/* Page Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-blue-600">Time to Dry</h1>
          <p className="text-gray-500">Your smart cloth drying assistant</p>
        </div>

        {/* Weather Section */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Weather</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Temperature Card */}
            <div className="bg-white p-4 rounded-lg shadow-md text-center">
              <div className="text-4xl mb-2">🌡️</div>
              <h3 className="text-gray-600 font-medium">Temperature</h3>
              <p className="text-2xl font-bold">{weatherData.temperature}<span className="text-lg ml-1">°C</span></p>
            </div>

            {/* Humidity Card */}
            <div className="bg-white p-4 rounded-lg shadow-md text-center">
              <div className="text-4xl mb-2">💧</div>
              <h3 className="text-gray-600 font-medium">Humidity</h3>
              <p className="text-2xl font-bold">{weatherData.humidity}<span className="text-lg ml-1">%</span></p>
            </div>

            {/* Rainfall Card */}
            <div className="bg-white p-4 rounded-lg shadow-md text-center">
              <div className="text-4xl mb-2">☔</div>
              <h3 className="text-gray-600 font-medium">Rainfall</h3>
              <p className="text-2xl font-bold">{weatherData.rainfall}<span className="text-lg ml-1">mm</span></p>
            </div>

            {/* Rating Card */}
            <div className="bg-white p-4 rounded-lg shadow-md text-center">
              <div className="text-4xl mb-2">👕</div>
              <h3 className="text-gray-600 font-medium">Drying Rating</h3>
              <p className="text-2xl font-bold">{"⭐".repeat(weatherData.rating)}</p>
            </div>
          </div>
        </div>

        {/* Recent Drying Section */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Recent Drying Cloth</h2>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold mb-4">Drying Status</h3>
            <div className="flex justify-center my-6">
              <div className="text-6xl">🧺</div>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg">
              <div className="text-center">
                <div className="font-semibold text-gray-600">Status</div>
                <div className="text-2xl font-bold text-green-500">Online</div>
                <div className="text-sm text-gray-500">Drying in progress</div>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                View Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}