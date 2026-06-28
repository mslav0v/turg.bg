"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SellerPortal() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // НАДГРАЖДАНЕ: Стейтове за конфиденциален статус и списък с имейли
  const [isPrivate, setIsPrivate] = useState(false);
  const [invitedEmailsText, setInvitedEmailsText] = useState('');

  // Проверка дали потребителят е логнат
  useEffect(() => {
    const token = localStorage.getItem('turg_token');
    if (!token) {
      router.push('/auth'); // Ако няма токен, го гоним към страницата за вход
    }
  }, [router]);

  // Основна информация + Тръжни параметри
  const [formData, setFormData] = useState({
    assetType: 'PROPERTY', // Стойност по подразбиране
    title: '',
    location: '',
    description: '',
    startPrice: '',
    reservePrice: '',
    startTime: '',
    endTime: '',
  });

  // Динамични специфични характеристики (JSON обектът в базата)
  const [specifications, setSpecifications] = useState<any>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    
    // Ако сменим типа актив, изчистваме старите специфични данни
    if (e.target.name === 'assetType') {
      setSpecifications({});
    }
  };

  const handleSpecChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSpecifications({ ...specifications, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    const token = localStorage.getItem('turg_token');

    try {
      // Преобразуваме числата от стрингове (защото идват от инпути) към реални числа преди изпращане
      const parsedSpecs = { ...specifications };
      for (const key in parsedSpecs) {
        if (!isNaN(parsedSpecs[key]) && parsedSpecs[key] !== '') {
          parsedSpecs[key] = Number(parsedSpecs[key]);
        }
      }

      // Обработваме въведените имейли от текстовото поле в чист масив от стрингове
      const emailsArray = isPrivate 
        ? invitedEmailsText.split(',').map(email => email.trim()).filter(email => email !== '')
        : [];

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auctions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({
          title: formData.title,
          location: formData.location,
          description: formData.description,
          assetType: formData.assetType,
          startPrice: Number(formData.startPrice),
          reservePrice: Number(formData.reservePrice),
          startTime: new Date(formData.startTime).toISOString(),
          endTime: new Date(formData.endTime).toISOString(),
          specifications: parsedSpecs, // ТУК ИЗПРАЩАМЕ ДИНАМИЧНИЯ JSON ОБЕКТ
          isPrivate: isPrivate, // НАДГРАЖДАНЕ: Изпращаме флага за поверителност
          invitedEmails: emailsArray // НАДГРАЖДАНЕ: Изпращаме масива с поканени адреси
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Грешка при създаване на търга.');
      }

      setSuccess(true);
      
      // Изчистваме формата след успешен запис
      setFormData({
        assetType: 'PROPERTY', title: '', location: '', description: '',
        startPrice: '', reservePrice: '', startTime: '', endTime: '',
      });
      setSpecifications({});
      setIsPrivate(false);
      setInvitedEmailsText('');

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
        <p className="text-gray-500 mt-2">Публикувайте своя актив за онлайн публична продан.</p>
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
            <p className="text-sm text-green-600">Вашият актив е публикуван успешно.</p>
            <Link href="/auctions" className="text-sm text-blue-600 hover:underline mt-2 inline-block">
              Към списъка с продажби
            </Link>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* СЕКЦИЯ 1: ИЗБОР НА КАТЕГОРИЯ (НОВО) */}
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
            <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">1. Какво ще продавате?</label>
            <select 
              name="assetType" 
              value={formData.assetType} 
              onChange={handleChange} 
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white font-medium text-gray-800"
            >
              <option value="PROPERTY">Недвижим имот</option>
              <option value="VEHICLE">Лек / Товарен автомобил</option>
              <option value="CONSTRUCTION_MACHINERY">Строителна техника (Багери, Фадроми)</option>
              <option value="AGRI_MACHINERY">Селскостопанска техника</option>
              <option value="BATTERIES_ENERGY">Indusтриални батерии / Енергетика</option>
              <option value="INDUSTRIAL_EQUIPMENT">Индустриално оборудване / Машини</option>
              <option value="OTHER">Други активи</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* СЕКЦИЯ 2: ОСНОВНИ ДАННИ ЗА АКТИВА */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900 border-b pb-2">2. Основна информация</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Заглавие на обявата</label>
                <input required name="title" value={formData.title} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="напр. Двустаен апартамент / Багер CAT" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Локация (Къде се намира?)</label>
                <input required name="location" value={formData.location} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="гр. Варна, кв. Чайка" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Описание</label>
                <textarea required name="description" value={formData.description} onChange={handleChange} rows={5} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Подробно техническо и визуално описание..."></textarea>
              </div>
            </div>

            {/* СЕКЦИЯ 3: ПАРАМЕТРИ НА ТЪРГА */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900 border-b pb-2">3. Параметри на търга</h3>
              
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

              {/* НАДГРАЖДАНЕ: Опции за сигурност и затворена стая */}
              <div className="pt-4 border-t border-gray-100">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={isPrivate} 
                    onChange={(e) => {
                      setIsPrivate(e.target.checked);
                      if (!e.target.checked) setInvitedEmailsText('');
                    }}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer" 
                  />
                  <span className="text-sm font-bold text-gray-900">Конфиденциален търг (само с покана)</span>
                </label>
              </div>

              {isPrivate && (
                <div className="pt-2 space-y-1 transition-all duration-200">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide">Списък с поканени имейли</label>
                  <input 
                    required={isPrivate} 
                    type="text" 
                    value={invitedEmailsText} 
                    onChange={(e) => setInvitedEmailsText(e.target.value)} 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" 
                    placeholder="напр. investor1@turg.bg, investor2@grosco.bg" 
                  />
                  <p className="text-[11px] text-gray-400 leading-tight">Разделяйте имейлите със запетая. Системата ще генерира индивидуален криптографски ключ за всеки адрес.</p>
                </div>
              )}
            </div>
          </div>

          {/* СЕКЦИЯ 4: СПЕЦИФИЧНИ ХАРАКТЕРИСТИКИ (Рендерират се динамично според категорията) */}
          <div className="bg-blue-50/50 p-6 rounded-xl border border-blue-100">
            <h3 className="text-lg font-bold text-blue-900 border-b border-blue-200 pb-2 mb-4">4. Специфични технически данни</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Полета за ИМОТ */}
              {formData.assetType === 'PROPERTY' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">РЗП (кв.м.)</label>
                    <input type="number" name="totalArea" onChange={handleSpecChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Площ на парцела (кв.м.)</label>
                    <input type="number" name="plotArea" onChange={handleSpecChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Тип строителство</label>
                    <input type="text" name="constructionType" placeholder="напр. Тухла, ЕПК" onChange={handleSpecChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                </>
              )}

              {/* Полета за АВТОМОБИЛИ */}
              {formData.assetType === 'VEHICLE' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">VIN Номер</label>
                    <input type="text" name="vin" maxLength={17} onChange={handleSpecChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none uppercase font-mono" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Пробег (км)</label>
                    <input type="number" name="mileage" onChange={handleSpecChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Година на производство</label>
                    <input type="number" name="yearOfManufacture" min={1900} max={2026} onChange={handleSpecChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                </>
              )}

              {/* Полета за СТРОИТЕЛНА ТЕХНИКА / МАШИНИ */}
              {(formData.assetType === 'CONSTRUCTION_MACHINERY' || formData.assetType === 'AGRI_MACHINERY' || formData.assetType === 'INDUSTRIAL_EQUIPMENT') && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Отработени моточасове</label>
                    <input type="number" name="operatingHours" onChange={handleSpecChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Мощност (kW)</label>
                    <input type="number" name="powerKw" onChange={handleSpecChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Собствено тегло (Тонове)</label>
                    <input type="number" name="weightTons" step="0.1" onChange={handleSpecChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                </>
              )}

              {/* Полета за ИНДУСТРИАЛНИ БАТЕРИИ */}
              {formData.assetType === 'BATTERIES_ENERGY' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Капацитет (Ah)</label>
                    <input type="number" name="capacityAh" onChange={handleSpecChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Напрежение (V)</label>
                    <input type="number" name="voltageV" onChange={handleSpecChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Брой цикли (ако е употребявана)</label>
                    <input type="number" name="cycleCount" onChange={handleSpecChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                </>
              )}
              
              {/* Ако е 'OTHER', не показваме специфични полета или показваме едно общо */}
              {formData.assetType === 'OTHER' && (
                <div className="col-span-1 md:col-span-3">
                  <p className="text-sm text-gray-500 italic">За тази категория не се изискват специфични технически параметри. Моля, опишете всичко важно в главното описание.</p>
                </div>
              )}
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