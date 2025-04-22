// src/components/notification/NotificationPanel.tsx
import React from 'react';

type Toast = {
  id: number;
  message: string;
  type?: 'info' | 'error' | 'success';
};

interface Props {
  notifications: Toast[];
}

export default function NotificationPanel({ notifications }: Props) {
  return (
    <div className="absolute right-0 mt-10 w-72 bg-white shadow-lg rounded-lg p-4 border border-gray-200 max-h-80 overflow-y-auto">
      {notifications.length === 0 ? (
        <p className="text-sm text-gray-700">🔔 No new notifications</p>
      ) : (
        <ul>
          {notifications.map((n) => (
            <li
              key={n.id}
              className={`flex items-center justify-between mb-2 text-sm last:mb-0
                ${n.type === 'error' ? 'text-red-600' : n.type === 'success' ? 'text-green-600' : 'text-blue-600'}
              `}
            >
              <span>{n.message}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
