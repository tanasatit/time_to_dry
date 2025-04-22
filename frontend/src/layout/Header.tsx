import React from 'react';
import { useDryingStatus } from '../components/notification/useDryingStatus';
import NotificationBell from '../components/notification/NotificationBell';
import { addToast } from '../components/ToastManager'; 

export default function Header() {
  const { isWorking } = useDryingStatus();

  return (
    <header className="sticky top-0 z-50 bg-white shadow p-4 flex items-center justify-between border-b border-gray-200">
      <div>
        <h1 className="text-2xl font-bold text-blue-600">Time To Dry</h1>
        <p className="text-gray-500 text-sm">Your smart cloth drying assistant</p>
      </div>

      <div className="flex items-center gap-4 relative">
        <NotificationBell />
        
        <span
          className={`flex items-center gap-2 px-4 py-1 rounded-full font-medium text-sm ${
            isWorking ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
          }`}
        >
          <i
            className="bi bi-circle-fill"
            style={{ fontSize: '0.75rem', color: isWorking ? 'green' : 'red' }}
          ></i>
          {isWorking ? 'Online' : 'Offline'}
        </span>
      </div>
    </header>
  );
}
