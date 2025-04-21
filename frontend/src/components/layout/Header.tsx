// src/components/layout/Header.tsx
import React, { useState } from 'react';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Header() {
  const { data: statusData } = useSWR('http://localhost:8080/api/test/status', fetcher);
  const [showNotification, setShowNotification] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white shadow p-4 flex items-center justify-between border-b border-gray-200">
      {/* Left - Title & Description */}
      <div>
        <h1 className="text-2xl font-bold text-blue-600">Time To Dry</h1>
        <p className="text-gray-500 text-sm">Your smart cloth drying assistant</p>
      </div>

      {/* Right - Status and Notification */}
      <div className="flex items-center gap-4 relative">
        {/* Bell Icon */}
        <button onClick={() => setShowNotification(!showNotification)} className="relative">
          <i className="bi bi-bell text-xl"></i>
        </button>

        {/* Notification Window */}
        {showNotification && (
          <div className="absolute right-0 mt-10 w-64 bg-white shadow-lg rounded-lg p-4 border border-gray-200">
            <p className="text-sm text-gray-700">🔔 No new notifications</p>
          </div>
        )}

        {/* Status Badge */}
        <span
          className={`flex items-center gap-2 px-4 py-1 rounded-full font-medium text-sm ${statusData?.is_working ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}
        >
          <i
            className="bi bi-circle-fill"
            style={{ color: statusData?.is_working ? 'green' : 'red', fontSize: '0.75rem' }}
          ></i>
          {statusData?.is_working ? 'Online' : 'Offline'}
        </span>
      </div>
    </header>
  );
}
