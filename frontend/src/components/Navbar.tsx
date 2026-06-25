"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('turg_token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className="bg-white/95 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* ЛОГО */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" onClick={closeMenu}>
              <img src="/logo.svg" alt="Turg.bg" className="h-10 w-auto" />
            </Link>
          </div>
          
          {/* ДЕСКТОП МЕНЮ */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link href="/live" className="text-sm font-extrabold text-red-600 hover:text-red-700 flex items-center gap-2 transition-colors">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600"></span>
              </span>
              НА ЖИВО
            </Link>
            
            <Link href="/auctions" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">Продажби</Link>
            <Link href="/seller-portal" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">За продавачи</Link>
            <Link href="/buyer-dashboard" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">За купувачи</Link>
            <Link href="/guarantees" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">Гаранции</Link>
            <Link href="/faq" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">ЧЗВ</Link>
            <Link href="/contact" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">Контакти</Link>
          </nav>

          {/* ДЕСКТОП АУТЕНТИКАЦИЯ */}
          <div className="hidden lg:flex items-center space-x-4">
            {isLoggedIn ? (
              <Link href="/profile" className="bg-gray-900 text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-gray-800 transition-all shadow-sm">
                Моят Профил
              </Link>
            ) : (
              <>
                <Link href="/auth" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Вход</Link>
                <Link href="/auth" className="bg-blue-600 text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-all shadow-sm">Регистрация</Link>
              </>
            )}
          </div>

          {/* МОБИЛЕН БУТОН (Само текст, без иконки) */}
          <div className="flex lg:hidden items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-sm font-bold text-gray-900 uppercase tracking-wider focus:outline-none bg-gray-100 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors"
            >
              {isMobileMenuOpen ? 'Затвори' : 'Меню'}
            </button>
          </div>
          
        </div>
      </div>

      {/* МОБИЛНО МЕНЮ (Разгъващо се) */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-xl absolute w-full left-0">
          <div className="px-4 pt-2 pb-6 flex flex-col space-y-2">
            <Link href="/live" onClick={closeMenu} className="text-sm font-extrabold text-red-600 flex items-center gap-2 py-3">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600"></span>
              </span>
              НА ЖИВО
            </Link>
            <Link href="/auctions" onClick={closeMenu} className="text-sm font-medium text-gray-600 py-3 border-b border-gray-50">Продажби</Link>
            <Link href="/seller-portal" onClick={closeMenu} className="text-sm font-medium text-gray-600 py-3 border-b border-gray-50">За продавачи</Link>
            <Link href="/buyer-dashboard" onClick={closeMenu} className="text-sm font-medium text-gray-600 py-3 border-b border-gray-50">За купувачи</Link>
            <Link href="/guarantees" onClick={closeMenu} className="text-sm font-medium text-gray-600 py-3 border-b border-gray-50">Гаранции</Link>
            <Link href="/faq" onClick={closeMenu} className="text-sm font-medium text-gray-600 py-3 border-b border-gray-50">ЧЗВ</Link>
            <Link href="/contact" onClick={closeMenu} className="text-sm font-medium text-gray-600 py-3">Контакти</Link>
            
            <div className="pt-4 flex flex-col space-y-3 border-t border-gray-100 mt-2">
              {isLoggedIn ? (
                <Link href="/profile" onClick={closeMenu} className="bg-gray-900 text-white text-sm font-semibold px-5 py-3 rounded-lg text-center shadow-sm">
                  Моят Профил
                </Link>
              ) : (
                <>
                  <Link href="/auth" onClick={closeMenu} className="text-sm font-medium text-gray-600 text-center py-2 border border-gray-200 rounded-lg">Вход</Link>
                  <Link href="/auth" onClick={closeMenu} className="bg-blue-600 text-white text-sm font-semibold px-5 py-3 rounded-lg text-center shadow-sm">Регистрация</Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}