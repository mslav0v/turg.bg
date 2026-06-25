"use client";

import { useState, useEffect } from 'react';

export default function ProfileSettingsPage() {
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    companyName: '',
    iban: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Зареждане на данните при отваряне на страницата
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('turg_token');
      if (!token) return;
      
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/profile`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setFormData({
            email: data.email || '',
            fullName: data.fullName || '',
            companyName: data.companyName || '',
            iban: data.iban || ''
          });
        }
      } catch (error) {
        console.error('Грешка при зареждане на профила:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // Управление на промените в полетата
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Изпращане на данните към бекенда
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });
    const token = localStorage.getItem('turg_token');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/profile`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          companyName: formData.companyName,
          iban: formData.iban
        })
      });

      if (!res.ok) throw new Error('Грешка при запазване');
      
      // Обновяваме името в менюто (ако е променено)
      localStorage.setItem('turg_user_name', formData.fullName);
      window.dispatchEvent(new Event('storage')); // Индикираме на другите компоненти да се обновят

      setMessage({ type: 'success', text: 'Промените са запазени успешно.' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Възникна грешка при запазването на данните.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-gray-500 font-medium">Зареждане на данните...</div>;

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Лични данни и Банка</h1>
      
      <div className="bg-white rounded-lg border border-gray-200 p-8 shadow-sm">
        <form onSubmit={handleSave} className="space-y-6">
          
          {/* ИМЕЙЛ (Само за четене) */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Имейл адрес (потребителско име)</label>
            <input 
              type="email" 
              value={formData.email} 
              disabled 
              className="w-full border border-gray-300 bg-gray-50 rounded-lg p-3 text-gray-500 cursor-not-allowed outline-none"
            />
            <p className="text-xs text-gray-500 mt-2">Имейл адресът е основен идентификатор и не може да бъде променян.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* ИМЕНА */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Пълни имена</label>
              <input 
                type="text" 
                name="fullName"
                value={formData.fullName} 
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none transition"
              />
            </div>

            {/* ФИРМА */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Име на фирма (опционално)</label>
              <input 
                type="text" 
                name="companyName"
                value={formData.companyName} 
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none transition"
              />
            </div>
          </div>

          <hr className="border-gray-200 my-8" />

          {/* БАНКОВА СМЕТКА (IBAN) */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Банкова сметка (IBAN)</label>
            <input 
              type="text" 
              name="iban"
              value={formData.iban} 
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none transition font-mono uppercase tracking-wider text-lg"
              placeholder="BG00 BANK 0000 0000 0000 00"
            />
            <p className="text-xs text-gray-500 mt-2 leading-relaxed">
              Тази сметка ще бъде използвана за автоматично възстановяване на вашите депозити при неуспешно наддаване. 
              Моля, уверете се, че сметката е на ваше име (или на името на вашата фирма, ако сте въвели такава).
            </p>
          </div>

          {/* СЪОБЩЕНИЯ ЗА ГРЕШКА/УСПЕХ */}
          {message.text && (
            <div className={`p-4 rounded-lg font-medium text-sm ${message.type === 'success' ? 'bg-green-50 text-green-900 border border-green-200' : 'bg-red-50 text-red-900 border border-red-200'}`}>
              {message.text}
            </div>
          )}

          {/* БУТОН ЗА ЗАПАЗВАНЕ */}
          <div className="pt-4">
            <button 
              type="submit" 
              disabled={saving}
              className="bg-gray-900 text-white font-bold py-3 px-8 rounded-lg hover:bg-gray-800 transition disabled:bg-gray-400"
            >
              {saving ? 'Запазване...' : 'Запази промените'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}