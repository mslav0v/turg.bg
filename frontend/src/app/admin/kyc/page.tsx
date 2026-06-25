"use client";

import { useState, useEffect } from 'react';

interface KycRequest {
  id: string;
  userId: string;
  documentType: string;
  documentUrl: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  rejectionReason: string | null;
  createdAt: string;
  user: { fullName: string; email: string; companyName: string | null; };
}

export default function AdminKycPage() {
  const [requests, setRequests] = useState<KycRequest[]>([]);
  const [activeTab, setActiveTab] = useState<'PENDING' | 'APPROVED' | 'REJECTED'>('PENDING');
  const [inspectingReq, setInspectingReq] = useState<KycRequest | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchKyc = async () => {
    setLoading(true);
    const token = localStorage.getItem('turg_token');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/kyc`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      // Защита: гарантираме, че задаваме масив
      setRequests(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchKyc(); }, []);

  const handleApprove = async (id: string) => {
    if (!confirm('Сигурни ли сте, че одобрявате тези документи?')) return;
    const token = localStorage.getItem('turg_token');
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/kyc/${id}/approve`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    setInspectingReq(null);
    fetchKyc();
  };

  const handleReject = async (id: string) => {
    if (!rejectReason) return alert('Моля, изберете причина за отхвърляне.');
    const token = localStorage.getItem('turg_token');
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/kyc/${id}/reject`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ reason: rejectReason })
    });
    setInspectingReq(null);
    fetchKyc();
  };

  // Защита: гарантираме, че филтрираме само ако requests е масив
  const filteredRequests = (Array.isArray(requests) ? requests : []).filter(req => req.status === activeTab);

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">KYC Верификации</h1>
      </div>

      {/* ТАБОВЕ */}
      <div className="flex gap-4 mb-6 border-b border-gray-200 pb-2">
        {(['PENDING', 'APPROVED', 'REJECTED'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 px-4 font-bold text-sm transition-all ${
              activeTab === tab 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab === 'PENDING' && `Чакащи преглед (${Array.isArray(requests) ? requests.filter(r => r.status === 'PENDING').length : 0})`}
            {tab === 'APPROVED' && 'Одобрени'}
            {tab === 'REJECTED' && 'Отхвърлени'}
          </button>
        ))}
      </div>

      {/* ТАБЛИЦА */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex-1 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Зареждане на заявки...</div>
        ) : filteredRequests.length === 0 ? (
          <div className="p-12 text-center text-gray-400 font-medium">Няма заявки в тази категория.</div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase border-b">
                <th className="p-4">Дата</th>
                <th className="p-4">Клиент</th>
                <th className="p-4">Тип Документ</th>
                <th className="p-4 text-right">Действие</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredRequests.map(req => (
                <tr key={req.id} className="hover:bg-gray-50">
                  <td className="p-4 text-sm text-gray-500">{new Date(req.createdAt).toLocaleString('bg-BG')}</td>
                  <td className="p-4 font-medium text-gray-900">
                    {req.user.fullName} <span className="text-xs text-gray-500 block">{req.user.email}</span>
                  </td>
                  <td className="p-4 text-sm font-bold text-gray-700">{req.documentType}</td>
                  <td className="p-4 text-right">
                    <button onClick={() => setInspectingReq(req)} className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-100 transition">
                      {req.status === 'PENDING' ? 'Провери' : 'Преглед'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* SPLIT-SCREEN INSPECTOR (Модал) */}
      {inspectingReq && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl w-full max-w-6xl h-[85vh] overflow-hidden flex shadow-2xl">
            
            {/* ЛЯВА ЧАСТ: Документ */}
            <div className="w-2/3 bg-gray-900 flex flex-col relative">
              <div className="absolute top-0 w-full p-4 flex justify-between bg-gradient-to-b from-black/60 to-transparent z-10">
                <span className="text-white font-bold bg-black/50 px-3 py-1 rounded">Снимка на документ</span>
                <button onClick={() => setInspectingReq(null)} className="text-white font-bold bg-red-600 hover:bg-red-700 px-4 py-1 rounded-full text-sm shadow">Затвори</button>
              </div>
              <div className="flex-1 flex items-center justify-center p-8">
                {/* Симулираме визуализация на документа, тъй като в момента нямаме качен реален файл */}
                <div className="bg-gray-800 text-gray-400 border-2 border-dashed border-gray-600 rounded-xl w-full h-full flex items-center justify-center flex-col">
                  <span className="text-4xl mb-2"></span>
                  <p>Симулация на качен документ</p>
                  <p className="text-xs mt-2 text-blue-400 break-all px-8 text-center">{inspectingReq.documentUrl}</p>
                </div>
              </div>
            </div>

            {/* ДЯСНА ЧАСТ: Данни и Резолюция */}
            <div className="w-1/3 bg-white p-6 flex flex-col border-l border-gray-200 overflow-y-auto">
              <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-2">Инспекция на данни</h2>
              
              <div className="space-y-4 mb-8 flex-1">
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase">Имена по профил</p>
                  <p className="font-medium text-gray-900 text-lg">{inspectingReq.user.fullName}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase">Имейл</p>
                  <p className="font-medium text-gray-900">{inspectingReq.user.email}</p>
                </div>
                {inspectingReq.user.companyName && (
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase">Фирма</p>
                    <p className="font-medium text-gray-900">{inspectingReq.user.companyName}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase">Текущ статус</p>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold inline-block mt-1 
                    ${inspectingReq.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 
                      inspectingReq.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {inspectingReq.status}
                  </span>
                </div>
                
                {inspectingReq.rejectionReason && (
                   <div className="bg-red-50 p-3 rounded border border-red-100">
                     <p className="text-xs text-red-500 font-bold uppercase mb-1">Причина за отхвърляне</p>
                     <p className="text-sm text-red-700">{inspectingReq.rejectionReason}</p>
                   </div>
                )}
              </div>

              {/* БУТОНИ ЗА ДЕЙСТВИЕ (Само при PENDING) */}
              {inspectingReq.status === 'PENDING' && (
                <div className="space-y-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <h3 className="text-sm font-bold text-gray-700 uppercase">Вземи решение</h3>
                  <button onClick={() => handleApprove(inspectingReq.id)} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg shadow transition">
                    Одобри документа
                  </button>
                  
                  <div className="pt-4 border-t border-gray-300">
                    <select 
                      value={rejectReason} 
                      onChange={(e) => setRejectReason(e.target.value)}
                      className="w-full border border-gray-300 rounded p-2 text-sm mb-2 focus:ring-red-500 outline-none"
                    >
                      <option value="">-- Избери причина за отказ --</option>
                      <option value="Размазана или нечетима снимка">Размазана или нечетима снимка</option>
                      <option value="Изтекъл срок на валидност">Изтекъл срок на валидност</option>
                      <option value="Имената в профила не съвпадат с документа">Имената в профила не съвпадат</option>
                      <option value="Съмнение за фалшификация (Измама)">Съмнение за фалшификация (Измама)</option>
                    </select>
                    <button onClick={() => handleReject(inspectingReq.id)} className="w-full bg-white border-2 border-red-500 text-red-600 hover:bg-red-50 font-bold py-2 rounded-lg transition">
                      Отхвърли заявката
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

    </div>
  );
}