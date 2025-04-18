import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

interface NavItem {
  href: string;
  label: string;
  icon: string;
}

const navItems: NavItem[] = [
  { href: '/', label: 'Home', icon: '🏠' },
  { href: '/statistics', label: 'Statistics', icon: '📊' },
  { href: '/table', label: 'Drying Table', icon: '🧺' },
];

export default function Sidebar({ pathname }: { pathname?: string }) {
  const router = useRouter();
  const currentPath = pathname ?? router.pathname;

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-center h-16">
        <h2 className="text-xl font-bold text-blue-600">Time to Dry</h2>
      </div>
      <div className="mt-5 flex-1 flex flex-col">
        <nav className="flex-1 px-2 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`
                group flex items-center px-2 py-2 text-base font-medium rounded-md
                ${currentPath === item.href
                  ? 'bg-blue-100 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
              `}
            >
              <span className="mr-3">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
