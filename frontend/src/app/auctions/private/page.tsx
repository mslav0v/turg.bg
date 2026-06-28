"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PrivateAuctionLogin() {
  const router = useRouter();
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!token.trim()) {
      setError('Моля, въведете валиден дигитален ключ.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auctions/private/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: token.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Предоставеният ключ е невалиден, блокиран или неговата валидност е изтекла.');
      }

      // При успешен достъп записваме токена и детайлите в локалната памет на браузъра, 
      // за да може стаята за наддаване на живо (/live) да разпознае и зареди този частен търг.
      localStorage.setItem('turg_private_token', token.trim());
      localStorage.setItem('turg_private_auction_id', data.auction.id);

      // Пренасочваме купувача директно в залата за наддаване
      router.push('/live');

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center px-4 bg-gray-50/50">
      <div className="max-w-md w-full bg-white rounded-3xl border border-gray-200 shadow-xl p-10 space-y-8">
        
        {/* ИНСТИТУЦИОНАЛЕН ХЕДЪР НА СЕЙФА */}
        <div className="text-center space-y-3">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Система за сигурност
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">
            Конфиденциален вход
          </h1>
          <p className="text-sm text-gray-500 leading-relaxed">
            Достъпът до затворени наддавателни зали е ограничен. Моля, въведете вашия индивидуален дигитален ключ за авторизация.
          </p>
        </div>

        {/* СЕКЦИЯ ЗА СЪОБЩЕНИЯ ЗА ГРЕШКА */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded-xl">
            <div className="text-xs font-bold text-red-800 uppercase tracking-wide mb-1">
              Грешка при авторизация
            </div>
            <p className="text-xs text-red-700 leading-relaxed">{error}</p>
          </div>
        )}

        {/* ФОРМА ЗА ВЪВЕЖДАНЕ НА КЛЮЧ */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
              Криптографски токен за достъп
            </label>
            <input 
              type="text" 
              value={token}
              onChange={(e) => setToken(e.target.value)}
              disabled={loading}
              placeholder="turg_sec_..." 
              className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-gray-900 focus:ring-0 outline-none text-center font-mono text-gray-800 font-bold bg-gray-50/50 focus:bg-white transition duration-200 placeholder:text-gray-300"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-4 rounded-xl transition-all duration-200 shadow-md disabled:bg-gray-400 tracking-wide uppercase text-xs"
          >
            {loading ? 'Валидиране на ключа...' : 'Отключи наддавателната зала'}
          </button>
        </form>

        {/* ПРАВНО ПРЕДУПРЕЖДЕНИЕ НА ДЪНОТО */}
        <div className="border-t border-gray-100 pt-6 text-center">
          <p className="text-[11px] text-gray-400 leading-relaxed">
            Всички опити за неоторизиран достъп или софтуерни манипулации на криптографските токени се записват автоматично по IP адрес в системния журнал на платформата.
          </p>
        </div>

      </div>
    </div>
  );
}