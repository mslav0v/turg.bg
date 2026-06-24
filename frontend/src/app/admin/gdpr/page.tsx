"use client";

import { useState } from 'react';

export default function GDPRRequestsPage() {
  const [isLegalMenuOpen, setIsLegalMenuOpen] = useState(true);
  const [isClientMenuOpen, setIsClientMenuOpen] = useState(true); // Ново меню за клиенти

  const [filterData, setFilterData] = useState({
    requestId: '', serverIp: '', type: '', clientIp: '',
    email: '', dateStart: '', browser: '', dateEnd: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterData({ ...filterData, [e.target.name]: e.target.value });
  };

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Прилагане на филтър:', filterData);
  };

  return (
    <div className="min-h-screen flex bg-gray-50 font-sans">
      
      {/* ЛЯВА НАВИГАЦИЯ (SIDEBAR) */}
      <aside className="w-64 bg-gray-900 flex flex-col h-screen sticky top-0 border-r border-gray-800">
        <div className="px-6 py-5 border-b border-gray-800">
          <span className="text-white font-bold tracking-wider uppercase text-sm">Администрация</span>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 scrollbar-hide">
          <ul className="space-y-1">
            <li><a href="#" className="block px-6 py-2.5 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition">Табло (Dashboard)</a></li>
            <li><a href="#" className="block px-6 py-2.5 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition">Управление на търгове</a></li>
            
            {/* ПАДАЩО МЕНЮ: Защита на данните (GDPR) */}
            <li>
              <button 
                onClick={() => setIsLegalMenuOpen(!isLegalMenuOpen)}
                className="w-full flex justify-between items-center px-6 py-2.5 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition bg-gray-800"
              >
                <span className="font-bold text-white">Защита на данните</span>
                <span className="text-xs font-mono text-white">{isLegalMenuOpen ? '−' : '+'}</span>
              </button>
              
              {isLegalMenuOpen && (
                <ul className="bg-gray-950 py-2 border-l-2 border-gray-600 ml-6 mr-4 mt-1 mb-2">
                  <li><a href="#" className="block px-4 py-2 text-sm text-white font-bold border-l-2 border-white -ml-[2px] transition">Заявки за изтриване</a></li>
                  <li><a href="#" className="block px-4 py-2 text-sm text-gray-400 hover:text-white transition">Експорт на данни</a></li>
                  <li><a href="#" className="block px-4 py-2 text-sm text-gray-400 hover:text-white transition">Списък съгласия</a></li>
                  <li><a href="#" className="block px-4 py-2 text-sm text-gray-400 hover:text-white transition">Политики и закони</a></li>
                </ul>
              )}
            </li>

            {/* ПАДАЩО МЕНЮ: Комуникация с клиенти */}
            <li>
              <button 
                onClick={() => setIsClientMenuOpen(!isClientMenuOpen)}
                className="w-full flex justify-between items-center px-6 py-2.5 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition"
              >
                <span className="font-bold">Клиентски център</span>
                <span className="text-xs font-mono">{isClientMenuOpen ? '−' : '+'}</span>
              </button>
              
              {isClientMenuOpen && (
                <ul className="bg-gray-950 py-2 border-l-2 border-gray-700 ml-6 mr-4 mt-1 mb-2">
                  <li>
                    <a href="#" className="flex justify-between items-center px-4 py-2 text-sm text-gray-400 hover:text-white transition">
                      Отворени дискусии <span className="bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded-sm font-bold">3</span>
                    </a>
                  </li>
                  <li><a href="#" className="block px-4 py-2 text-sm text-gray-400 hover:text-white transition">GDPR Кореспонденция</a></li>
                  <li><a href="#" className="block px-4 py-2 text-sm text-gray-400 hover:text-white transition">Архив комуникации</a></li>
                </ul>
              )}
            </li>

            <li><a href="#" className="block px-6 py-2.5 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition">KYC Верификации</a></li>
            <li><a href="#" className="block px-6 py-2.5 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition">Фактуриране</a></li>
          </ul>
        </nav>
      </aside>

      {/* ОСНОВНО СЪДЪРЖАНИЕ */}
      <main className="flex-1 flex flex-col min-w-0">
        
        {/* ГОЛЕН ПАНЕЛ (HEADER) */}
        <header className="bg-white border-b border-gray-200 px-8 py-5 flex justify-between items-center shadow-sm z-10">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Регистър: Заявки за изтриване на лични данни</h1>
            <div className="text-xs text-gray-500 mt-2 font-medium">
              Администрация <span className="mx-1">/</span> Защита на данните <span className="mx-1">/</span> <span className="text-gray-900">Заявки за изтриване</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="px-6 py-2 bg-gray-900 text-white font-bold text-sm rounded-lg hover:bg-gray-800 transition shadow-sm">
              Генерирай отчет
            </button>
          </div>
        </header>

        {/* ТАБОВЕ ЗА УПРАВЛЕНИЕ */}
        <div className="bg-white px-8 pt-6 border-b border-gray-200">
          <nav className="flex space-x-8 overflow-x-auto pb-[1px]">
            <a href="#" className="pb-4 text-sm font-bold text-gray-900 border-b-2 border-gray-900 whitespace-nowrap">
              Нови заявки за изтриване 
              <span className="ml-2 bg-red-100 text-red-800 text-[10px] px-2 py-0.5 rounded-sm">4 чакащи</span>
            </a>
            <a href="#" className="pb-4 text-sm font-bold text-gray-500 hover:text-gray-900 border-b-2 border-transparent hover:border-gray-300 whitespace-nowrap transition">
              Активни дискусии (GDPR)
              <span className="ml-2 bg-blue-100 text-blue-800 text-[10px] px-2 py-0.5 rounded-sm">2</span>
            </a>
            <a href="#" className="pb-4 text-sm font-bold text-gray-500 hover:text-gray-900 border-b-2 border-transparent hover:border-gray-300 whitespace-nowrap transition">Обработени (Архив)</a>
            <a href="#" className="pb-4 text-sm font-bold text-gray-500 hover:text-gray-900 border-b-2 border-transparent hover:border-gray-300 whitespace-nowrap transition">Системни логове</a>
          </nav>
        </div>

        {/* ФОРМА ЗА ФИЛТРИРАНЕ И ТЪРСЕНЕ */}
        <div className="p-8 overflow-y-auto flex-1 bg-gray-50">
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8 mb-8">
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-6 border-b border-gray-100 pb-4">Филтриране на комуникация и заявки</h2>
            <form onSubmit={handleFilterSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">ID на заявка / Клиент</label>
                  <input type="text" name="requestId" value={filterData.requestId} onChange={handleInputChange} placeholder="напр. REQ-8932" className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-1 focus:ring-gray-900 outline-none transition text-sm" />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Имейл на субекта</label>
                  <input type="email" name="email" value={filterData.email} onChange={handleInputChange} className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-1 focus:ring-gray-900 outline-none transition text-sm" />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Тип комуникация</label>
                  <select name="type" value={filterData.type} onChange={(e) => setFilterData({...filterData, type: e.target.value})} className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-1 focus:ring-gray-900 outline-none transition text-sm bg-white">
                    <option value="">Всички</option>
                    <option value="delete">Заявка за изтриване (Право да бъдеш забравен)</option>
                    <option value="export">Заявка за експорт на данни</option>
                    <option value="discussion">Отворена дискусия / Въпрос</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Статус</label>
                  <select className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-1 focus:ring-gray-900 outline-none transition text-sm bg-white">
                    <option>Чакащи обработка</option>
                    <option>В процес на комуникация</option>
                    <option>Изпълнени</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Дата - от</label>
                  <input type="date" name="dateStart" value={filterData.dateStart} onChange={handleInputChange} className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-1 focus:ring-gray-900 outline-none transition text-sm text-gray-700" />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Дата - до</label>
                  <input type="date" name="dateEnd" value={filterData.dateEnd} onChange={handleInputChange} className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-1 focus:ring-gray-900 outline-none transition text-sm text-gray-700" />
                </div>
                
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end gap-4">
                <button type="button" onClick={() => setFilterData({requestId: '', serverIp: '', type: '', clientIp: '', email: '', dateStart: '', browser: '', dateEnd: ''})} className="bg-white text-gray-700 border border-gray-300 font-bold py-2.5 px-6 rounded-md hover:bg-gray-50 transition text-sm shadow-sm">
                  Изчисти
                </button>
                <button type="submit" className="bg-gray-900 text-white font-bold py-2.5 px-8 rounded-md hover:bg-gray-800 transition text-sm shadow-sm">
                  Търси в регистъра
                </button>
              </div>
            </form>
          </div>

          {/* ПРАЗНО СЪСТОЯНИЕ (PLACEHOLDER ЗА РЕЗУЛТАТИ) */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center bg-white">
            <h3 className="text-gray-900 font-bold mb-2">Няма намерени записи</h3>
            <p className="text-gray-500 text-sm">Използвайте филтрите по-горе, за да потърсите конкретна GDPR комуникация или заявка.</p>
          </div>

        </div>
      </main>
    </div>
  );
}