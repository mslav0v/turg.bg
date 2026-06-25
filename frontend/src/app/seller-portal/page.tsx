"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SellerPortal() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Проверка дали потребителят е логнат
  useEffect(() => {
    const token = localStorage.getItem('turg_token');
    if (!token) {
      router.push('/auth'); // Ако няма токен, го гоним към страницата за вход
    }
  }, [router]);

  const [formData, setFormData] = useState({
    title: '',
    location: '',
    description: '',
    startPrice: '',
    reservePrice: '',
    startTime: '',
    endTime: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    const token = localStorage.getItem('turg_token');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auctions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // ТУК Е МАГИЯТА: Изпращаме тайния ключ!
        },
        body: JSON.stringify({
          title: formData.title,
          location: formData.location,
          description: formData.description,
          startPrice: Number(formData.startPrice),
          reservePrice: Number(formData.reservePrice),
          // Превръщаме датите в стандартен ISO формат за базата данни
          startTime: new Date(formData.startTime).toISOString(),
          endTime: new Date(formData.endTime).toISOString(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Грешка при създаване на търга.');
      }

      setSuccess(true);
      // Изчистваме формата след успешен запис
      setFormData({
        title: '', location: '', description: '',
        startPrice: '', reservePrice: '', startTime: '', endTime: '',
      });

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Портал за продавачи</h1>
        <p className="text-gray-500 mt-2">Публикувайте своя имот за онлайн публична продан.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded">
            <p className="text-sm text-green-700 font-bold mb-1">Успех!</p>
            <p className="text-sm text-green-600">Вашият имот е публикуван успешно.</p>
            <Link href="/auctions" className="text-sm text-blue-600 hover:underline mt-2 inline-block">
              Към списъка с продажби
            </Link>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Секция: Имот */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Данни за имота</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Заглавие</label>
                <input required name="title" value={formData.title} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="напр. Двустаен апартамент" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Локация</label>
                <input required name="location" value={formData.location} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="гр. Варна, кв. Чайка" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Описание</label>
                <textarea required name="description" value={formData.description} onChange={handleChange} rows={4} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Подробно описание..."></textarea>
              </div>
            </div>

            {/* Секция: Търг */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Параметри на търга</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Начална цена (€)</label>
                  <input required type="number" name="startPrice" value={formData.startPrice} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Скрита мин. цена (€)</label>
                  <input required type="number" name="reservePrice" value={formData.reservePrice} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Начало на търга</label>
                <input required type="datetime-local" name="startTime" value={formData.startTime} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Край на търга</label>
                <input required type="datetime-local" name="endTime" value={formData.endTime} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </div>

          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-md disabled:bg-gray-400"
          >
            {loading ? 'Публикуване...' : 'Създай търг и публикувай'}
          </button>
        </form>
      </div>
    </div>
  );
}