import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import Image from 'next/image';

interface NavItem {
  href: string;
  label: string;
  icon: string;
}

const navItems: NavItem[] = [
  { href: '/', label: 'Home', icon: 'bi bi-house-door' },
  { href: '/statistics', label: 'Statistics', icon: 'bi bi-graph-up' },
  { href: '/dryingTable', label: 'Drying Table', icon: 'bi bi-table' },
];

export default function Sidebar({ pathname }: { pathname?: string }) {
  const router = useRouter();
  const currentPath = pathname ?? router.pathname;

  return (
    <div className="h-full flex flex-col">
      {/* Logo Section */}
      <div className="flex items-center justify-center border-b border-gray-200">
      <Link href="/">
        <Image
          src="/icon.png"
          alt="Time to Dry Logo"
          width={220}
          height={120}
          className="object-contain"
        />
        </Link>
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
            <i className={`${item.icon} mr-3`}></i>
            {item.label}
          </Link>          
          ))}
        </nav>
      </div>
    </div>
  );
}
