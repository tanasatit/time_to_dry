// src/components/dashboard/RecentDrying.tsx
import React from 'react';

export default function RecentDrying() {
  // This is a placeholder component that will be updated later
  return (
    <div className="card bg-base-100 shadow-lg">
      <div className="card-body">
        <h2 className="card-title">Recent Drying Cloth</h2>
        <div className="my-4 flex justify-center">
          <div className="text-6xl">🧺</div>
        </div>
        <div className="stats shadow">
          <div className="stat">
            <div className="stat-title">Status</div>
            <div className="stat-value text-success">Online</div>
            <div className="stat-desc">Drying in progress</div>
          </div>
        </div>
        <div className="card-actions justify-end mt-4">
          <button className="btn btn-primary">View Details</button>
        </div>
      </div>
    </div>
  );
}