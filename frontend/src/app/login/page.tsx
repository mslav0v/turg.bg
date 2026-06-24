"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('http://localhost:4000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('turg_token', data.access_token);
        router.push('/profile/properties');
      } else {
        setError('Невалиден имейл или парола.');
      }
    } catch (err) {
      setError('Възникна грешка при връзката със сървъра.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg border border-gray-200 shadow-sm">
        
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Вход в системата</h1>
          <p className="text-sm text-gray-500 mt-2">Моля, въведете вашите данни, за да продължите.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Имейл адрес</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none transition"
              placeholder="name@company.com"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Парола</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none transition"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-sm font-bold text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">
              {error}
            </p>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-gray-900 text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-800 transition disabled:bg-gray-400"
          >
            {loading ? 'Обработка...' : 'Влез в профила'}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-gray-100 pt-6">
          <p className="text-sm text-gray-600">
            Нямате регистрация? <a href="/register" className="font-bold text-gray-900 hover:underline">Регистрирайте се тук</a>
          </p>
        </div>
      </div>
    </div>
  );
}