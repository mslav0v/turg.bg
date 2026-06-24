"use client";

import { useState, useEffect } from 'react';

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Проверяваме дали потребителят вече се е съгласил
    const consent = localStorage.getItem('turg_cookie_consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('turg_cookie_consent', 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('turg_cookie_consent', 'declined');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full bg-gray-900 border-t border-gray-800 z-50 px-4 py-6 shadow-2xl">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-white flex-1">
          <h3 className="text-sm font-bold uppercase tracking-wider mb-2">Политика за бисквитки и GDPR съгласие</h3>
          <p className="text-sm text-gray-400 leading-relaxed max-w-4xl">
            Ние използваме бисквитки (cookies), за да осигурим правилното функциониране на платформата за търгове, да анализираме трафика и да защитим вашите данни. 
            Продължавайки да използвате сайта, вие се съгласявате с нашата <a href="/privacy" className="text-white font-bold hover:underline">Политика за поверителност</a> и правилата за обработка на лични данни.
          </p>
        </div>
        <div className="flex gap-4 shrink-0 w-full md:w-auto">
          <button 
            onClick={handleDecline}
            className="flex-1 md:flex-none px-6 py-3 border border-gray-600 text-white font-bold text-sm hover:bg-gray-800 transition"
          >
            Отказвам
          </button>
          <button 
            onClick={handleAccept}
            className="flex-1 md:flex-none px-6 py-3 bg-white text-gray-900 font-bold text-sm hover:bg-gray-200 transition"
          >
            Приемам всички
          </button>
        </div>
      </div>
    </div>
  );
}