"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  
  // State за падащите менюта (Accordion)
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({
    catalog: false,
    legal: false,
    sales: false,
    customers: false,
  });

  const toggleMenu = (menu: string) => {
    setOpenMenus(prev => ({ ...prev, [menu]: !prev[menu] }));
  };

  useEffect(() => {
    // Бърза клиентска проверка
    const userStr = localStorage.getItem('turg_user');
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user.role === 'ADMIN') {
        setIsAdmin(true);
      } else {
        router.push('/');
      }
    } else {
      router.push('/auth');
    }
  }, [router]);

  if (!isAdmin) return null; // Скриваме екрана, докато проверяваме

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      
      {/* ⬛ Тъмен Sidebar (Лента за навигация) */}
      <aside className="w-64 bg-[#232f3e] text-gray-300 flex flex-col overflow-y-auto overflow-x-hidden border-r border-[#1a232e]">
        
        {/* Лого */}
        <div className="h-16 flex items-center px-6 bg-[#1a232e] text-white font-bold text-xl tracking-wider">
          turg.bg <span className="text-blue-500 ml-1">ADMIN</span>
        </div>

        {/* Менюта */}
        <nav className="flex-1 py-4 text-sm">
          <Link href="/admin" className="block px-6 py-3 hover:bg-[#2c3b4d] hover:text-white transition-colors">
            🏠 Табло
          </Link>

          {/* КАТАЛОГ */}
          <div>
            <button onClick={() => toggleMenu('catalog')} className="w-full flex justify-between items-center px-6 py-3 hover:bg-[#2c3b4d] hover:text-white focus:outline-none">
              <span>🏷️ Каталог</span>
              <span>{openMenus.catalog ? '▼' : '▶'}</span>
            </button>
            {openMenus.catalog && (
              <div className="bg-[#1f2937] py-2">
                <Link href="/admin/categories" className="block px-10 py-2 hover:text-white">» Категории</Link>
                <Link href="/admin/properties" className="block px-10 py-2 hover:text-white">» Имоти (Продукти)</Link>
                <Link href="/admin/filters" className="block px-10 py-2 hover:text-white">» Филтри и Опции</Link>
                <Link href="/admin/attributes" className="block px-10 py-2 hover:text-white">» Атрибути</Link>
              </div>
            )}
          </div>

          {/* НОРМАТИВНА УРЕДБА */}
          <div>
            <button onClick={() => toggleMenu('legal')} className="w-full flex justify-between items-center px-6 py-3 hover:bg-[#2c3b4d] hover:text-white focus:outline-none">
              <span>⚖️ Нормативна уредба</span>
              <span>{openMenus.legal ? '▼' : '▶'}</span>
            </button>
            {openMenus.legal && (
              <div className="bg-[#1f2937] py-2">
                <Link href="/admin/laws" className="block px-10 py-2 hover:text-white">» Закони</Link>
                <Link href="/admin/policies" className="block px-10 py-2 hover:text-white">» Политики (Terms)</Link>
              </div>
            )}
          </div>

          <Link href="/admin/gdpr" className="block px-6 py-3 hover:bg-[#2c3b4d] hover:text-white transition-colors">
            🗄️ GDPR Requests
          </Link>

          {/* ПРОДАЖБИ (Търгове) */}
          <div>
            <button onClick={() => toggleMenu('sales')} className="w-full flex justify-between items-center px-6 py-3 hover:bg-[#2c3b4d] hover:text-white focus:outline-none">
              <span>🛒 Продажби (Търгове)</span>
              <span>{openMenus.sales ? '▼' : '▶'}</span>
            </button>
            {openMenus.sales && (
              <div className="bg-[#1f2937] py-2">
                <Link href="/admin/auctions" className="block px-10 py-2 hover:text-white">» Активни търгове</Link>
                <Link href="/admin/bids" className="block px-10 py-2 hover:text-white">» Наддавания (Bids)</Link>
                <Link href="/admin/deposits" className="block px-10 py-2 hover:text-white">» Гаранционни депозити</Link>
              </div>
            )}
          </div>

          {/* КЛИЕНТИ */}
          <div>
            <button onClick={() => toggleMenu('customers')} className="w-full flex justify-between items-center px-6 py-3 hover:bg-[#2c3b4d] hover:text-white focus:outline-none">
              <span>👤 Клиенти</span>
              <span>{openMenus.customers ? '▼' : '▶'}</span>
            </button>
            {openMenus.customers && (
              <div className="bg-[#1f2937] py-2">
                <Link href="/admin/users" className="block px-10 py-2 hover:text-white">» Всички клиенти</Link>
                <Link href="/admin/kyc" className="block px-10 py-2 hover:text-white text-yellow-400">» KYC Верификации</Link>
                <Link href="/admin/user-groups" className="block px-10 py-2 hover:text-white">» Групи клиенти</Link>
              </div>
            )}
          </div>

          {/* ОСТАНАЛИ */}
          <Link href="/admin/marketing" className="block px-6 py-3 hover:bg-[#2c3b4d] hover:text-white transition-colors">📢 Маркетинг</Link>
          <Link href="/admin/design" className="block px-6 py-3 hover:bg-[#2c3b4d] hover:text-white transition-colors">🖥️ Дизайн</Link>
          <Link href="/admin/seo" className="block px-6 py-3 hover:bg-[#2c3b4d] hover:text-white transition-colors">🔍 SEO Extensions</Link>
          <Link href="/admin/settings" className="block px-6 py-3 hover:bg-[#2c3b4d] hover:text-white transition-colors mt-8">⚙️ Система</Link>

        </nav>
      </aside>

      {/* ⬜ Основно съдържание (Main Area) */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Горен панел */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shadow-sm">
          <div className="text-gray-500 font-medium">Административен панел v1.0</div>
          <div className="flex items-center gap-4">
            <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full uppercase">Superadmin</span>
            <button onClick={() => { localStorage.clear(); router.push('/auth'); }} className="text-sm text-gray-500 hover:text-red-600">
              Изход
            </button>
          </div>
        </header>

        {/* Тук ще се зареждат конкретните страници (Dashboard, Users, Auctions) */}
        <div className="flex-1 overflow-auto p-8 bg-[#f4f6f8]">
          {children}
        </div>
      </main>

    </div>
  );
}