// src/pages/table.tsx
import Head from 'next/head';
import React from 'react';

export default function Table() {
  return (
    <>
      <Head>
        <title>Time to Dry - Drying Table</title>
      </Head>
      
      <div className="flex items-center justify-center h-64 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">Drying Table</h1>
          <p className="mt-2 text-gray-500">This page will show the drying table (coming soon)</p>
        </div>
      </div>
    </>
  );
}