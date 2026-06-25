"use client";

import { useState, useEffect } from 'react';

// Дефинираме какво очакваме от бекенда
interface DashboardStats {
  users: number;
  auctions: number;
  lockedDeposits: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem('turg_token');
      if (!token) return; // Ако няма токен, layout.tsx вече се е погрижил да ни изгони

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/dashboard-stats`, {
          headers: {
            'Authorization': `Bearer ${token}` // Изпращаме VIP пропуска
          }
        });

        if (!res.ok) {
          throw new Error('Грешка при зареждане на статистиките. Проверете конзолата.');
        }

        const data = await res.json();
        setStats(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="animate-pulse text-xl font-bold text-gray-400">Зареждане на Таблото...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
        <p className="text-red-700 font-bold">Грешка при комуникация със сървъра:</p>
        <p className="text-red-600 text-sm mt-1">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Табло за управление</h1>
      
      {/* Статистики (Widget Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        {/* Клиенти */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 border-l-4 border-l-blue-500 transition-transform hover:scale-105">
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Регистрирани клиенти</p>
          <p className="text-4xl font-black text-gray-800 mt-2">{stats?.users}</p>
        </div>
        
        {/* Търгове */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 border-l-4 border-l-green-500 transition-transform hover:scale-105">
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Активни Търгове</p>
          <p className="text-4xl font-black text-gray-800 mt-2">{stats?.auctions}</p>
        </div>
        
        {/* Капитал */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 border-l-4 border-l-purple-500 transition-transform hover:scale-105">
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Блокирани Депозити</p>
          <p className="text-4xl font-black text-gray-800 mt-2 flex items-baseline gap-1">
            <span className="text-2xl text-purple-600">€</span> 
            {stats?.lockedDeposits.toLocaleString()}
          </p>
        </div>

      </div>
      
      {/* Информационен панел */}
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          Добре дошли в Системата
        </h2>
        <p className="text-gray-600 leading-relaxed mb-4">
          Това е вашият централен административен хъб. От лявото навигационно меню имате пълен достъп до:
        </p>
        <ul className="list-disc list-inside text-gray-600 space-y-2 ml-2">
          <li>Управление на обектите и недвижимите имоти (Каталог).</li>
          <li>Контрол върху всички активни и приключили търгове в реално време (Продажби).</li>
          <li>Модерация на клиенти и ръчно одобряване на KYC документи.</li>
          <li>Преглед на нормативната база и заявките за поверителност.</li>
        </ul>
      </div>
      
    </div>
  );
}