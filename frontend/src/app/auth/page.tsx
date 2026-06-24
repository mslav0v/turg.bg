"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Форм стейт
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    
    try {
      const res = await fetch(`http://localhost:4000${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          // Изпращаме fullName само при регистрация
          ...( !isLogin && { fullName: formData.fullName } )
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Възникна грешка при свързване със сървъра.');
      }

      // УСПЕХ! Запазваме токена и данните на потребителя в браузъра
      localStorage.setItem('turg_token', data.access_token);
      localStorage.setItem('turg_user', JSON.stringify(data.user));

      // Пренасочваме го към Заглавната страница
      router.push('/');
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-xl border border-gray-100">
        
        {/* Хедър на формата */}
        <div className="text-center">
          <Link href="/" className="text-3xl font-extrabold tracking-tight text-gray-900 block mb-6">
            turg<span className="text-blue-600">.bg</span>
          </Link>
          <h2 className="text-2xl font-bold text-gray-900">
            {isLogin ? 'Влезте в профила си' : 'Създайте нов профил'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {isLogin ? 'Нямате профил? ' : 'Вече имате профил? '}
            <button 
              onClick={() => { setIsLogin(!isLogin); setError(''); }}
              className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
            >
              {isLogin ? 'Регистрирайте се тук' : 'Влезте от тук'}
            </button>
          </p>
        </div>

        {/* Съобщение за грешка */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
            <p className="text-sm text-red-700 font-medium">{error}</p>
          </div>
        )}

        {/* Форма */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            
            {/* Поле: Име (само при регистрация) */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Пълно име / Фирма</label>
                <input
                  name="fullName"
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Иван Иванов"
                />
              </div>
            )}

            {/* Поле: Имейл */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Имейл адрес</label>
              <input
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="you@example.com"
              />
            </div>

            {/* Поле: Парола */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Парола</label>
              <input
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleInputChange}
                className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Бутон за изпращане */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed transition-all"
            >
              {loading 
                ? 'Моля изчакайте...' 
                : isLogin ? 'Вход в системата' : 'Създай профил'
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}