"use client";

import { useState, useEffect, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker, StandaloneSearchBox } from '@react-google-maps/api';

const mapContainerStyle = { width: '100%', height: '450px' }; // Премахнат радиус тук, за да пасне с горния блок
// Център по подразбиране - променя се при клик или търсене
const defaultCenter = { lat: 43.2141, lng: 27.9147 };

// Задължително дефинираме библиотеката извън компонента, за да не се презарежда безкрайно
const LIBRARIES: ("places")[] = ["places"];

export default function MyPropertiesPage() {
  const [properties, setProperties] = useState<any[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    assetType: 'PROPERTY', // Нова стойност по подразбиране за типа актив
    title: '', description: '', location: '',
    plotArea: '', builtUpArea: '', totalArea: '',
    startPrice: '', reservePrice: '',
    vin: '', operatingHours: '' // Добавени допълнителни полета за новите категории
  });
  
  const [coordinates, setCoordinates] = useState<{lat: number, lng: number} | null>(null);
  const [files, setFiles] = useState<FileList | null>(null);

  // Референция към полето за търсене на Google Maps
  const [searchBox, setSearchBox] = useState<google.maps.places.SearchBox | null>(null);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries: LIBRARIES
  });

  const fetchProperties = async () => {
    setLoading(true);
    const token = localStorage.getItem('turg_token');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/properties`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setProperties(Array.isArray(data) ? data : []);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProperties(); }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      setCoordinates({ lat: e.latLng.lat(), lng: e.latLng.lng() });
    }
  }, []);

  // Логика при намиране на адрес от търсачката
  const onSearchBoxLoad = (ref: google.maps.places.SearchBox) => setSearchBox(ref);
  const onPlacesChanged = () => {
    if (searchBox) {
      const places = searchBox.getPlaces();
      if (places && places.length > 0) {
        const place = places[0];
        if (place.geometry?.location) {
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();
          
          setCoordinates({ lat, lng });
          
          // Автоматично попълваме текстовия адрес с намерения
          if (place.formatted_address) {
            setFormData(prev => ({ ...prev, location: place.formatted_address! }));
          }
        }
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const token = localStorage.getItem('turg_token');
    
    const data = new FormData();
    
    // Динамично пакетиране на техническите характеристики според избрания тип актив
    const specs: any = {};
    if (formData.assetType === 'PROPERTY') {
      if (formData.plotArea) specs.plotArea = Number(formData.plotArea);
      if (formData.builtUpArea) specs.builtUpArea = Number(formData.builtUpArea);
      if (formData.totalArea) specs.totalArea = Number(formData.totalArea);
    } else if (formData.assetType === 'VEHICLE') {
      if (formData.vin) specs.vin = formData.vin;
    } else if (formData.assetType === 'CONSTRUCTION_MACHINERY') {
      if (formData.operatingHours) specs.operatingHours = Number(formData.operatingHours);
    }

    // Прикачваме основните данни, филтрирайки специфичните от FormData
    Object.entries(formData).forEach(([key, value]) => {
      if (value && !['plotArea', 'builtUpArea', 'totalArea', 'vin', 'operatingHours'].includes(key)) {
        data.append(key, value as string);
      }
    });

    // Записваме структурирания JSON като текст за бекенда
    data.append('specifications', JSON.stringify(specs));
    
    if (coordinates) {
      data.append('latitude', coordinates.lat.toString());
      data.append('longitude', coordinates.lng.toString());
    }

    if (files) {
      Array.from(files).forEach((file) => data.append('images', file));
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/properties`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: data
      });

      if (res.ok) {
        setIsCreating(false);
        setFormData({ 
          assetType: 'PROPERTY', title: '', description: '', location: '', 
          plotArea: '', builtUpArea: '', totalArea: '', startPrice: '', reservePrice: '',
          vin: '', operatingHours: ''
        });
        setCoordinates(null);
        setFiles(null);
        fetchProperties();
      } else {
        alert('Грешка при създаването на обявата.');
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-gray-500 font-medium">Зареждане на обектите...</div>;

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Моите Активи</h1>
        {!isCreating && (
          <button onClick={() => setIsCreating(true)} className="bg-gray-900 text-white font-bold py-2 px-6 rounded-lg hover:bg-gray-800 transition">
            Създаване на обява
          </button>
        )}
      </div>

      {isCreating ? (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-8 border-b border-gray-200 bg-gray-50 rounded-t-lg">
            <h2 className="text-xl font-bold text-gray-800">Детайли на актива</h2>
            <p className="text-sm text-gray-500 mt-1">Моля, попълнете максимално точно данните, за да генерираме коректен профил за търга.</p>
          </div>
          
          <form onSubmit={handleSubmit} className="p-8 space-y-10">
            
            {/* СЕЛЕКТОР ЗА ТИП АКТИВ */}
            <div className="space-y-6 bg-gray-50 p-4 rounded-xl border border-gray-200">
              <label className="block text-sm font-bold text-gray-700">Изберете тип на актива</label>
              <select name="assetType" value={formData.assetType} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-3 bg-white outline-none focus:ring-1 focus:ring-gray-900">
                <option value="PROPERTY">Недвижим имот</option>
                <option value="VEHICLE">Лек / Товарен автомобил (МПС)</option>
                <option value="CONSTRUCTION_MACHINERY">Строителна техника</option>
                <option value="OTHER">Други движими вещи</option>
              </select>
            </div>

            {/* БЛОК 1: ОСНОВНА ИНФОРМАЦИЯ */}
            <div className="space-y-6">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-b border-gray-200 pb-2">1. Основна информация</h3>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Заглавие на обявата</label>
                <input type="text" name="title" value={formData.title} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg p-3 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none transition" />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Пълно описание</label>
                <textarea name="description" value={formData.description} onChange={handleChange} required rows={4} className="w-full border border-gray-300 rounded-lg p-3 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none transition resize-none" />
              </div>
            </div>

            {/* БЛОК 2: ПЛОЩИ И ХАРАКТЕРИСТИКИ */}
            <div className="space-y-6">
              {formData.assetType === 'PROPERTY' ? (
                <>
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-b border-gray-200 pb-2">2. Квадратури (кв.м.)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Площ на парцела</label>
                      <input type="number" name="plotArea" value={formData.plotArea} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-3 focus:ring-1 focus:ring-gray-900 outline-none transition" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Застроена площ (ЗП)</label>
                      <input type="number" name="builtUpArea" value={formData.builtUpArea} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-3 focus:ring-1 focus:ring-gray-900 outline-none transition" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Разгъната застр. площ (РЗП)</label>
                      <input type="number" name="totalArea" value={formData.totalArea} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-3 focus:ring-1 focus:ring-gray-900 outline-none transition" />
                    </div>
                  </div>
                </>
              ) : formData.assetType === 'VEHICLE' ? (
                <>
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-b border-gray-200 pb-2">2. Спецификации на превозното средство</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">VIN номер (Рама)</label>
                      <input type="text" name="vin" value={formData.vin} onChange={handleChange} placeholder="17-символен код" className="w-full border border-gray-300 rounded-lg p-3 focus:ring-1 focus:ring-gray-900 outline-none transition uppercase" />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-b border-gray-200 pb-2">2. Технически параметри</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Работни моточасове</label>
                      <input type="number" name="operatingHours" value={formData.operatingHours} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-3 focus:ring-1 focus:ring-gray-900 outline-none transition" />
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* БЛОК 3: ФИНАНСОВИ ПАРАМЕТРИ */}
            <div className="space-y-6">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-b border-gray-200 pb-2">3. Финансови параметри (Евро)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Стартова цена за търга</label>
                  <input type="number" name="startPrice" value={formData.startPrice} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg p-3 focus:ring-1 focus:ring-gray-900 outline-none transition" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Минимална цена за продажба (Резерв)</label>
                  <input type="number" name="reservePrice" value={formData.reservePrice} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg p-3 focus:ring-1 focus:ring-gray-900 outline-none transition" />
                  <p className="text-xs text-gray-500 mt-2">Тази цена остава скрита за купувачите.</p>
                </div>
              </div>
            </div>

            {/* БЛОК 4: ЛОКАЦИЯ И КАРТА */}
            <div className="space-y-6">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-b border-gray-200 pb-2">4. Локация</h3>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Текстови адрес (Попълва се автоматично при избор от картата)</label>
                <input type="text" name="location" value={formData.location} onChange={handleChange} required placeholder="напр. бул. Васил Левски 201..." className="w-full border border-gray-300 rounded-lg p-3 focus:ring-1 focus:ring-gray-900 outline-none transition" />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Намерете на картата (или кликнете за маркер)</label>
                <div className="border border-gray-300 rounded-lg overflow-hidden bg-gray-100 flex flex-col">
                  
                  {!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ? (
                    <div className="h-[400px] flex flex-col items-center justify-center text-gray-500 p-6 text-center">
                      <span className="font-bold text-gray-700 mb-2">Интерактивната карта е деактивирана</span>
                      <span className="text-sm">Системен администратор трябва да добави Google Maps API ключ в конфигурацията.</span>
                    </div>
                  ) : isLoaded ? (
                    <>
                      {/* НОВ ИЗГЛЕД НА ТЪРСАЧКАТА - СОЛИДЕН БЛОК НАД КАРТАТА */}
                      <div className="bg-gray-50 p-5 border-b border-gray-300">
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Бързо търсене на локация</label>
                        <StandaloneSearchBox onLoad={onSearchBoxLoad} onPlacesChanged={onPlacesChanged}>
                          <input 
                            type="text" 
                            placeholder="Въведете град, квартал или точен адрес..." 
                            className="w-full border-2 border-gray-300 rounded-lg p-3 text-gray-900 font-bold focus:border-gray-900 focus:ring-0 outline-none bg-white shadow-sm transition"
                          />
                        </StandaloneSearchBox>
                      </div>

                      <GoogleMap mapContainerStyle={mapContainerStyle} center={coordinates || defaultCenter} zoom={6} onClick={handleMapClick}>
                        {coordinates && <Marker position={coordinates} />}
                      </GoogleMap>
                    </>
                  ) : (
                    <div className="h-[450px] flex items-center justify-center text-gray-500 font-medium">Зареждане на картата...</div>
                  )}
                </div>
                {coordinates && <p className="text-xs text-gray-900 mt-3 font-bold">Координатите са записани успешно.</p>}
              </div>
            </div>

            {/* БЛОК 5: ГАЛЕРИЯ */}
            <div className="space-y-6">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-b border-gray-200 pb-2">5. Галерия</h3>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Снимки на имота (до 10 файла)</label>
                <input 
                  type="file" 
                  multiple 
                  accept="image/*"
                  onChange={(e) => setFiles(e.target.files)}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-6 file:border-0 file:text-sm file:font-bold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 cursor-pointer border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            <div className="flex gap-4 pt-8 border-t border-gray-200">
              <button type="submit" disabled={saving} className="bg-gray-900 text-white font-bold py-3 px-8 rounded-lg hover:bg-gray-800 transition disabled:bg-gray-400">
                {saving ? 'Запазване и качване...' : 'Запази обявата'}
              </button>
              <button type="button" onClick={() => setIsCreating(false)} className="bg-white text-gray-700 border border-gray-300 font-bold py-3 px-8 rounded-lg hover:bg-gray-50 transition">
                Oтказ
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* СПИСЪК С ИМОТИ */
        <div>
          {properties.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <p className="text-gray-500 font-medium mb-4">Нямате добавени обекти до момента.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {properties.map((property) => (
                <div key={property.id} className="bg-white border border-gray-200 rounded-lg p-6 flex flex-col md:flex-row justify-between gap-6 hover:border-gray-300 transition">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{property.title}</h3>
                    <p className="text-sm font-medium text-gray-500 mb-3">{property.location}</p>
                    <div className="flex flex-wrap gap-4 text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                      <span className="bg-gray-100 px-2 py-1 rounded text-gray-700">{property.assetType || 'PROPERTY'}</span>
                      <span>Старт: €{property.startPrice || '---'}</span>
                      <span>Резерв: €{property.reservePrice || '---'}</span>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">{property.description}</p>
                  </div>
                  
                  <div className="flex-shrink-0 flex flex-col items-end gap-2 border-l border-gray-100 pl-6">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Статус</span>
                    {property.auction ? (
                      <span className="bg-blue-50 text-blue-700 border border-blue-200 px-4 py-1.5 rounded-sm text-sm font-bold">Активен търг</span>
                    ) : (
                      <span className="bg-gray-100 text-gray-700 border border-gray-200 px-4 py-1.5 rounded-sm text-sm font-bold">Подготовка</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}