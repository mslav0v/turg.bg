"use client";

import { useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  fullName: string;
  companyName: string | null;
  role: string;
  kycVerified: boolean;
  createdAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // State за модалния прозорец
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    email: '', fullName: '', companyName: '', role: '', kycVerified: false, password: ''
  });
  const [modalStatus, setModalStatus] = useState({ type: '', message: '' });

  const fetchUsers = async () => {
    const token = localStorage.getItem('turg_token');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/users`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Грешка при зареждане.');
      const data = await res.json();
      setUsers(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Отваряне на модала
  const openEditModal = (user: User) => {
    setEditingUser(user);
    setFormData({
      email: user.email,
      fullName: user.fullName || '',
      companyName: user.companyName || '',
      role: user.role,
      kycVerified: user.kycVerified,
      password: '' // Паролата винаги е празна, освен ако админът не иска да я смени принудително
    });
    setModalStatus({ type: '', message: '' });
  };

  // Затваряне
  const closeModal = () => {
    setEditingUser(null);
  };

  // Изпращане на обновените данни към бекенда
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalStatus({ type: 'loading', message: 'Запазване...' });
    const token = localStorage.getItem('turg_token');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/users/${editingUser?.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!res.ok) throw new Error('Грешка при запазване.');

      setModalStatus({ type: 'success', message: 'Профилът е обновен успешно!' });
      fetchUsers(); // Презареждаме таблицата с новите данни
      setTimeout(closeModal, 1500); // Затваряме модала след 1.5 секунди
    } catch (err: any) {
      setModalStatus({ type: 'error', message: err.message });
    }
  };

  // Симулиране на изпращане на имейл за парола
  const handleSendResetEmail = async () => {
    if (!confirm('Сигурни ли сте, че искате да изпратите имейл за възстановяване на паролата на този клиент?')) return;
    
    setModalStatus({ type: 'loading', message: 'Изпращане на имейл...' });
    const token = localStorage.getItem('turg_token');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/users/${editingUser?.id}/reset-password`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setModalStatus({ type: 'success', message: data.message });
    } catch (err: any) {
      setModalStatus({ type: 'error', message: 'Грешка при изпращане.' });
    }
  };

  if (loading) return <div className="p-8 text-center animate-pulse">Зареждане...</div>;

  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Всички клиенти</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b">
              <th className="p-4">Потребител</th>
              <th className="p-4">Имейл</th>
              <th className="p-4">Роля</th>
              <th className="p-4">KYC</th>
              <th className="p-4 text-right">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="p-4 font-medium text-gray-900">{user.fullName || 'Без име'}</td>
                <td className="p-4 text-sm text-gray-600">{user.email}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 text-xs font-bold rounded-full ${user.role === 'ADMIN' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                    {user.role}
                  </span>
                </td>
                <td className="p-4 text-xs font-bold">
                  {user.kycVerified ? <span className="text-green-600">Да</span> : <span className="text-yellow-600">Не</span>}
                </td>
                <td className="p-4 text-right">
                  {/* БУТОНЪТ ВЕЧЕ АКТИВИРА МОДАЛА */}
                  <button onClick={() => openEditModal(user)} className="text-blue-600 hover:underline text-sm font-medium">Редакция</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* МОДАЛЕН ПРОЗОРЕЦ (Overlay) */}
      {editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
            
            {/* Хедър на модала */}
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">Редакция на профил</h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-red-500 text-2xl leading-none">&times;</button>
            </div>

            <form onSubmit={handleUpdate} className="p-6 space-y-6">
              
              {/* Системни съобщения */}
              {modalStatus.message && (
                <div className={`p-3 rounded text-sm font-bold ${modalStatus.type === 'error' ? 'bg-red-100 text-red-700' : modalStatus.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                  {modalStatus.message}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Имена</label>
                  <input type="text" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Имейл</label>
                  <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Фирма</label>
                  <input type="text" value={formData.companyName} onChange={e => setFormData({...formData, companyName: e.target.value})} className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Незадължително" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Системна Роля</label>
                  <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                    <option value="BUYER">Купувач (BUYER)</option>
                    <option value="SELLER">Продавач (SELLER)</option>
                    <option value="ADMIN">Администратор (ADMIN)</option>
                  </select>
                </div>
              </div>

              <div className="border-t pt-4 grid grid-cols-2 gap-4 items-center">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={formData.kycVerified} onChange={e => setFormData({...formData, kycVerified: e.target.checked})} className="w-5 h-5 text-blue-600 rounded border-gray-300" />
                  <span className="text-sm font-bold text-gray-700">Профилът е KYC верифициран</span>
                </label>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Принудителна смяна на парола</label>
                  <input type="text" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full border rounded p-2 focus:ring-2 focus:ring-red-500 outline-none text-sm placeholder-gray-400" placeholder="Оставете празно, ако не променяте" />
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg flex justify-between items-center mt-4">
                <div>
                  <p className="text-sm font-bold text-blue-900">Забравена парола?</p>
                  <p className="text-xs text-blue-700">Изпратете автоматичен линк за възстановяване на имейла на клиента.</p>
                </div>
                <button type="button" onClick={handleSendResetEmail} className="bg-white border border-blue-200 text-blue-700 hover:bg-blue-100 px-4 py-2 rounded text-sm font-bold shadow-sm transition-colors">
                  Изпрати Имейл
                </button>
              </div>

              {/* Футър с бутони за запис */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button type="button" onClick={closeModal} className="px-5 py-2 rounded text-gray-600 hover:bg-gray-100 font-medium">Отказ</button>
                <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded shadow hover:bg-blue-700 font-bold">Запази промените</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}