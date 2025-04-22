// src/components/notification/NotificationBell.tsx
import React, { useState } from 'react';
import NotificationPanel from './NotificationPanel';
import { getToastHistory } from '../ToastManager';

export default function NotificationBell() {
  const [show, setShow] = useState(false);
  // Force rerender bell count when new notifications appear
  const [_, force] = useState(0);

  // Show a dot or count if there are recent notifications
  const notifications = getToastHistory();

  return (
    <div className="relative">
      <button
        className="relative"
        onClick={() => {
          setShow(!show);
          force((f) => f + 1); // force update on open
        }}
      >
        <i className="bi bi-bell text-xl"></i>
        {notifications.length > 0 && (
          <span className="absolute top-0 right-0 inline-block w-3 h-3 bg-red-500 rounded-full"></span>
        )}
      </button>
      {show && <NotificationPanel notifications={notifications} />}
    </div>
  );
}
