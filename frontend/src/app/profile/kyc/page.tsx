"use client";

import { useState, useEffect } from 'react';

export default function KycVerificationPage() {
  const [status, setStatus] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  
  // НОВО: Масив, в който натрупваме избраните файлове един по един
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchKycStatus = async () => {
    setLoading(true);
    const token = localStorage.getItem('turg_token');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/kyc/my-status`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (res.ok) {
        const text = await res.text();
        
        // ПРОВЕРКА: Ако отговорът е празен, веднага слагаме статус 'NONE' и не парсваме нищо
        if (!text || text.trim() === "") {
          setStatus('NONE');
          return;
        }

        const data = JSON.parse(text);

        if (data && data.status) {
          setStatus(data.status); // PENDING, APPROVED, REJECTED
          setRejectionReason(data.rejectionReason);
        } else {
          setStatus('NONE');
        }
      }
    } catch (err) {
      console.error('Грешка при зареждане на KYC статус:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKycStatus();
  }, []);

  // Логика за добавяне на файлове към списъка
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setSelectedFiles((prevFiles) => [...prevFiles, ...newFiles]);
    }
    // Изчистваме стойността на полето, за да може браузърът да реагира, 
    // ако потребителят избере същия файл отново
    e.target.value = '';
  };

  // Логика за премахване на файл от списъка преди изпращане
  const removeFile = (indexToRemove: number) => {
    setSelectedFiles((prevFiles) => prevFiles.filter((_, index) => index !== indexToRemove));
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFiles.length === 0) {
      setErrorMsg('Моля, добавете поне един файл преди да продължите.');
      return;
    }

    setUploading(true);
    setErrorMsg('');
    const token = localStorage.getItem('turg_token');
    
    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append('files', file); 
    });

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/kyc/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      if (res.ok) {
        fetchKycStatus();
        setSelectedFiles([]); // Изчистваме списъка при успешен запис
      } else {
        const errorData = await res.json();
        setErrorMsg(errorData.message || 'Възникна грешка при изпращането на документите.');
      }
    } catch (err) {
      setErrorMsg('Мрежова грешка при опит за връзка със сървъра.');
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div className="text-gray-500 font-medium">Зареждане на статуса...</div>;

  return (
    <div className="max-w-3xl mx-auto pb-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">KYC Верификация</h1>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        
        <div className="p-8 border-b border-gray-200 bg-gray-50">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Проверка на самоличността</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            Съгласно изискванията на законодателството за борба с изпирането на пари (AML) и правилата за публична продан, 
            участието в търгове на платформата изисква потвърждаване на вашата самоличност. Вашите данни са криптирани и се съхраняват 
            при най-високи стандарти за сигурност.
          </p>
        </div>

        <div className="p-8">
          {/* СТАТУС: ОДОБРЕН */}
          {status === 'APPROVED' && (
            <div className="bg-green-50 border border-green-200 p-6 rounded-lg text-center">
              <h3 className="text-green-900 font-bold text-lg mb-2">Профилът е успешно верифициран</h3>
              <p className="text-green-800 text-sm">
                Вашата самоличност е потвърдена. Имате пълни права да създавате обяви за имоти и да участвате в наддавания на живо.
              </p>
            </div>
          )}

          {/* СТАТУС: ЧАКАЩ */}
          {status === 'PENDING' && (
            <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg text-center">
              <h3 className="text-blue-900 font-bold text-lg mb-2">Документите се обработват</h3>
              <p className="text-blue-800 text-sm">
                Вашата заявка е получена и в момента се преглежда от наш администратор. Процесът обикновено отнема до 24 работни часа. Ще бъдете уведомени при промяна на статуса.
              </p>
            </div>
          )}

          {/* СТАТУС: НЯМА ЗАЯВКА ИЛИ Е ОТХВЪРЛЕНА */}
          {(status === 'NONE' || status === 'REJECTED') && (
            <form onSubmit={handleUpload} className="space-y-6">
              
              {status === 'REJECTED' && (
                <div className="bg-red-50 border border-red-200 p-6 rounded-lg mb-6">
                  <h3 className="text-red-900 font-bold text-lg mb-2">Верификацията е отхвърлена</h3>
                  <p className="text-red-800 text-sm font-medium mb-1">Причина от администратор:</p>
                  <p className="text-red-700 text-sm bg-red-100 p-3 rounded">{rejectionReason || 'Документът е нечетлив или невалиден.'}</p>
                  <p className="text-red-800 text-sm mt-3">Моля, качете нови, ясни и цветни копия на вашия документ.</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Прикачете Лична карта (Лице и Гръб)</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 bg-gray-50 transition">
                  
                  <input 
                    type="file" 
                    multiple
                    accept="image/jpeg, image/png, application/pdf"
                    onChange={handleFileSelect}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-6 file:border-0 file:text-sm file:font-bold file:bg-gray-200 file:text-gray-700 hover:file:bg-gray-300 cursor-pointer"
                  />
                  
                  <p className="text-xs text-gray-500 mt-4 border-b border-gray-200 pb-4 mb-4">
                    Моля, прикачете снимки и на двете страни на документа. Позволени формати: JPG, PNG или PDF. Максимален размер: 5MB на файл.
                  </p>

                  {/* СПИСЪК С ДОБАВЕНИТЕ ФАЙЛОВЕ */}
                  {selectedFiles.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-bold text-gray-900 mb-3">Подготвени файлове за изпращане:</h4>
                      {selectedFiles.map((file, index) => (
                        <div key={index} className="flex justify-between items-center bg-white border border-gray-200 p-3 rounded-lg shadow-sm">
                          <span className="text-sm font-medium text-gray-700 truncate pr-4">
                            {file.name}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="text-xs font-bold text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded transition whitespace-nowrap"
                          >
                            Премахни
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                </div>
              </div>

              {errorMsg && (
                <div className="text-red-600 font-bold text-sm bg-red-50 p-3 rounded-lg border border-red-100">
                  {errorMsg}
                </div>
              )}

              <div className="pt-4 border-t border-gray-200 flex justify-end">
                <button 
                  type="submit" 
                  disabled={uploading || selectedFiles.length === 0}
                  className="bg-gray-900 text-white font-bold py-3 px-8 rounded-lg hover:bg-gray-800 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {uploading ? 'Изпращане на данните...' : 'Изпрати за верификация'}
                </button>
              </div>

            </form>
          )}

        </div>
      </div>
    </div>
  );
}