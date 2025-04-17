// src/pages/statistics.tsx
import Head from 'next/head';
import React from 'react';

export default function Statistics() {
  return (
    <>
      <Head>
        <title>Time to Dry - Statistics</title>
      </Head>
      
      <div className="flex items-center justify-center h-64 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">Statistics</h1>
          <p className="mt-2 text-gray-500">This page will show drying statistics (coming soon)</p>
        </div>
      </div>
    </>
  );
}