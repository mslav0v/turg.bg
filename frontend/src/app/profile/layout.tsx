"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const name = localStorage.getItem('turg_user_name') || 'Клиент';
    setUserName(name);
  }, []);

  const menuItems = [
    { name: 'Моето Табло', path: '/profile' },
    { name: 'Лични данни и Банка', path: '/profile/settings' },
    { name: 'KYC Верификация', path: '/profile/kyc' },
    { name: 'Моите Имоти (Продажби)', path: '/profile/properties' },
    { name: 'Моите Наддавания', path: '/profile/bids' },
    { name: 'Наблюдавани Търгове', path: '/profile/watchlist' },
    { name: 'Депозити и Плащания', path: '/profile/deposits' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* СТРАНИЧНО МЕНЮ */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">Клиентски Панел</h2>
          <p className="text-sm text-gray-500 mt-1">{userName}</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link 
                key={item.path} 
                href={item.path}
                className={`block px-4 py-3 rounded-lg transition-colors font-medium text-sm ${
                  isActive 
                    ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-l-4 border-transparent'
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button 
            onClick={() => { localStorage.clear(); window.location.href = '/login'; }}
            className="w-full block text-center text-gray-600 font-bold bg-gray-50 border border-gray-200 py-3 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition"
          >
            Изход от профила
          </button>
        </div>
      </aside>

      {/* ГЛАВНО СЪДЪРЖАНИЕ */}
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}