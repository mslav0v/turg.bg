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
    assetType: 'PROPERTY',
    title: '', description: '', location: '',
    plotArea: '', builtUpArea: '', totalArea: '',
    startPrice: '', reservePrice: ''
  });

  // Нова част за динамични характеристики
  const [specifications, setSpecifications] = useState<any>({});
  
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
    if (e.target.name === 'assetType') {
      setSpecifications({});
    }
  };

  const handleSpecChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSpecifications({ ...specifications, [e.target.name]: e.target.value });
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
    Object.entries(formData).forEach(([key, value]) => {
      if (value) data.append(key, value as string);
    });

    // Добавяме JSON спецификациите като стринг, за да се обработи правилно от бекенда
    data.append('specifications', JSON.stringify(specifications));
    
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
        setFormData({ assetType: 'PROPERTY', title: '', description: '', location: '', startPrice: '', reservePrice: '' });
        setSpecifications({});
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
            
            {/* НОВ СЕЛЕКТОР ЗА ТИП АКТИВ */}
            <div className="space-y-6">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-b border-gray-200 pb-2">0. Тип на актива</h3>
              <select name="assetType" value={formData.assetType} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-3">
                 <option value="PROPERTY">Недвижим имот</option>
                 <option value="VEHICLE">Автомобил / МПС</option>
                 <option value="CONSTRUCTION_MACHINERY">Строителна техника</option>
                 <option value="OTHER">Други</option>
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

            {/* БЛОК 2: ДИНАМИЧНИ ТЕХНИЧЕСКИ ХАРАКТЕРИСТИКИ */}
            <div className="space-y-6">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-b border-gray-200 pb-2">2. Технически характеристики</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {formData.assetType === 'PROPERTY' && (
                  <>
                    <input type="number" name="totalArea" placeholder="РЗП (кв.м.)" onChange={handleSpecChange} className="border p-3 rounded" />
                    <input type="text" name="constructionType" placeholder="Тип строителство" onChange={handleSpecChange} className="border p-3 rounded" />
                  </>
                 )}
                 {formData.assetType === 'VEHICLE' && (
                    <input type="text" name="vin" placeholder="VIN номер" onChange={handleSpecChange} className="border p-3 rounded" />
                 )}
                 {formData.assetType === 'CONSTRUCTION_MACHINERY' && (
                    <input type="number" name="operatingHours" placeholder="Моточасове" onChange={handleSpecChange} className="border p-3 rounded" />
                 )}
              </div>
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
                <label className="block text-sm font-bold text-gray-700 mb-2">Текстови адрес</label>
                <input type="text" name="location" value={formData.location} onChange={handleChange} required placeholder="напр. ул. Никола Гюзелев 43..." className="w-full border border-gray-300 rounded-lg p-3 focus:ring-1 focus:ring-gray-900 outline-none transition" />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Намерете на картата (или кликнете за маркер)</label>
                <div className="border border-gray-300 rounded-lg overflow-hidden bg-gray-100 flex flex-col">
                   {isLoaded ? (
                     <>
                        <StandaloneSearchBox onLoad={onSearchBoxLoad} onPlacesChanged={onPlacesChanged}>
                          <input type="text" placeholder="Търсене на локация..." className="w-full p-3 outline-none" />
                        </StandaloneSearchBox>
                        <GoogleMap mapContainerStyle={mapContainerStyle} center={coordinates || defaultCenter} zoom={6} onClick={handleMapClick}>
                           {coordinates && <Marker position={coordinates} />}
                        </GoogleMap>
                     </>
                   ) : (
                      <div className="h-[450px] flex items-center justify-center text-gray-500 font-medium">Зареждане на картата...</div>
                   )}
                </div>
              </div>
            </div>

            {/* БЛОК 5: ГАЛЕРИЯ */}
            <div className="space-y-6">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-b border-gray-200 pb-2">5. Галерия</h3>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Снимки на актива (до 10 файла)</label>
                <input 
                  type="file" 
                  multiple 
                  accept="image/*"
                  onChange={(e) => setFiles(e.target.files)}
                  className="block w-full text-sm text-gray-500 border border-gray-300 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            <div className="flex gap-4 pt-8 border-t border-gray-200">
              <button type="submit" disabled={saving} className="bg-gray-900 text-white font-bold py-3 px-8 rounded-lg hover:bg-gray-800 transition disabled:bg-gray-400">
                {saving ? 'Запазване и качване...' : 'Запази обявата'}
              </button>
              <button type="button" onClick={() => setIsCreating(false)} className="bg-white text-gray-700 border border-gray-300 font-bold py-3 px-8 rounded-lg hover:bg-gray-50 transition">
                Отказ
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* СПИСЪК С АКТИВИ */
        <div>
           {properties.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <p className="text-gray-500 font-medium mb-4">Нямате добавени активи до момента.</p>
            </div>
           ) : (
             <div className="grid grid-cols-1 gap-6">
               {properties.map((asset) => (
                 <div key={asset.id} className="bg-white border border-gray-200 rounded-lg p-6 flex flex-col md:flex-row justify-between gap-6">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{asset.title}</h3>
                      <p className="text-sm font-medium text-gray-500 mb-3">{asset.location}</p>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded uppercase tracking-wider font-bold">{asset.assetType}</span>
                    </div>
                    <div className="flex-shrink-0 text-right">
                       <span className="block font-bold text-gray-900">€{asset.startPrice}</span>
                       {asset.auction ? <span className="text-blue-600 font-bold text-sm">Активен търг</span> : <span className="text-gray-400 text-sm">Подготовка</span>}
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