"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function ProfileDashboard() {
  const [isVerified, setIsVerified] = useState(false); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsVerified(false); 
      setLoading(false);
    }, 500);
  }, []);

  if (loading) return <div className="text-gray-500">Зареждане на таблото...</div>;

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Добре дошли в профила си</h1>

      {/* KYC ПРЕДУПРЕЖДЕНИЕ */}
      {!isVerified && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 mb-8 flex items-center justify-between shadow-sm">
          <div>
            <h3 className="text-orange-900 font-bold text-lg">
              Внимание: Профилът ви не е верифициран
            </h3>
            <p className="text-orange-800 mt-1 text-sm">
              За да можете да публикувате имоти за продажба или да наддавате в търгове, е необходимо да прикачите документ за самоличност.
            </p>
          </div>
          <Link href="/profile/kyc" className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-6 rounded-lg transition whitespace-nowrap ml-4 shadow-sm">
            Верифицирай сега
          </Link>
        </div>
      )}

      {/* БЪРЗИ ДЕЙСТВИЯ (КВАДРАТИ) */}
      <h2 className="text-xl font-bold text-gray-800 mb-4">Бързи действия</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        <Link href="/profile/properties" className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-md hover:border-blue-300 transition block">
          <h3 className="font-bold text-gray-900 mb-2 text-lg">Създаване на обява</h3>
          <p className="text-gray-500 text-sm">Добавете имот, качете документи и стартирайте своя първи търг в платформата.</p>
        </Link>

        <Link href="/auctions" className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-md hover:border-blue-300 transition block">
          <h3 className="font-bold text-gray-900 mb-2 text-lg">Наддаване за имот</h3>
          <p className="text-gray-500 text-sm">Разгледайте активните търгове, проучете документацията и направете предложение.</p>
        </Link>

        <Link href="/profile/settings" className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-md hover:border-blue-300 transition block">
          <h3 className="font-bold text-gray-900 mb-2 text-lg">Банкова сметка</h3>
          <p className="text-gray-500 text-sm">Въведете своя IBAN профил, за да осигурим безпроблемно възстановяване на депозити.</p>
        </Link>

      </div>

      {/* СЕКЦИЯ: ПОСЛЕДНА АКТИВНОСТ */}
      <h2 className="text-xl font-bold text-gray-800 mb-4">Последна активност</h2>
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
        <p className="text-gray-500">Все още нямате регистрирана активност в системата.</p>
      </div>

    </div>
  );
}