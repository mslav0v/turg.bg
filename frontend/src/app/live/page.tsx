"use client";

import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export default function LiveAuctionRoom() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [auctionData, setAuctionData] = useState<any>(null);
  const [buyerData, setBuyerData] = useState<any>(null);
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [bidHistory, setBidHistory] = useState<string[]>([]);

  useEffect(() => {
    // 1. Взимаме реалните данни от бекенда (REST API)
    fetch('http://localhost:4000/api/active-auction')
      .then((res) => {
        // Подсигуряваме се, че отговорът е валиден
        if (!res.ok) {
          throw new Error('Няма активни търгове или връзката е прекъсната.');
        }
        return res.json();
      })
      .then((data) => {
        // ЗАЩИТА: Ако бекендът не върне търг, спираме изпълнението тук
        if (!data || !data.auction) {
          setAuctionData(null);
          setLoading(false);
          return;
        }

        setAuctionData(data.auction);
        setBuyerData(data.buyer);
        setCurrentPrice(Number(data.auction.currentPrice));
        setLoading(false);

        // 2. Свързваме се с WebSocket сървъра на бекенда
        const newSocket = io('http://localhost:4000');
        setSocket(newSocket);

        newSocket.on('connect', () => {
          console.log('🔗 Връзката със сървъра е успешна!');
          // Влизаме в дигиталната стая за този конкретен търг
          newSocket.emit('joinAuction', data.auction.id);
        });

        // 3. Слушаме за нови цени (Ако някой друг наддаде)
        newSocket.on('bidUpdated', (eventData) => {
          setCurrentPrice(eventData.newHighestBid);
          setBidHistory((prev) => [
            `Нова оферта приета: €${eventData.newHighestBid.toLocaleString()}`,
            ...prev
          ]);
        });
      })
      .catch((err) => {
        console.error('Грешка при зареждане на търга:', err);
        setLoading(false);
      });

    // Почистваме връзката, когато потребителят затвори страницата
    return () => {
      if (socket) socket.disconnect();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const placeBid = () => {
    if (socket && auctionData && buyerData) {
      // Правим стъпка от 1000 евро над текущата цена
      const newBidAmount = currentPrice + 1000; 
      socket.emit('placeBid', {
        auctionId: auctionData.id,
        amount: newBidAmount,
        userId: buyerData.id,
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-pulse text-xl font-bold text-blue-600">Свързване с аукционната зала...</div>
      </div>
    );
  }

  // ЗАЩИТА НА ИНТЕРФЕЙСА: Ако няма данни за търг, показваме празна зала
  if (!auctionData) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-16 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Аукционната зала е затворена</h2>
          <p className="text-gray-500 text-lg">В момента няма активни търгове на живо. Моля, проверете графика за предстоящи събития.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden flex flex-col md:flex-row">
        
        {/* Информация за имота */}
        <div className="md:w-1/2 p-8 bg-gray-50 border-r border-gray-200">
          <span className="bg-red-100 text-red-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4 inline-block animate-pulse">
            🔴 Търг на живо
          </span>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{auctionData?.property?.title}</h1>
          <p className="text-gray-500 mb-6">📍 {auctionData?.property?.location}</p>
          <p className="text-gray-700 leading-relaxed mb-8">{auctionData?.property?.description}</p>
          
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-500 font-semibold mb-1">Вашият профил:</p>
            <p className="text-gray-900 font-bold">{buyerData?.fullName}</p>
            <p className="text-xs text-green-600 font-bold mt-1">✓ Депозитът е потвърден</p>
          </div>
        </div>

        {/* Контролен панел за наддаване */}
        <div className="md:w-1/2 p-8 flex flex-col justify-center">
          <div className="text-center mb-8">
            <p className="text-gray-500 font-semibold mb-2 uppercase tracking-wide">Текуща водеща цена</p>
            <p className="text-6xl font-black text-blue-600 transition-all duration-300">
              € {currentPrice.toLocaleString()}
            </p>
          </div>

          <button 
            onClick={placeBid}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-2xl py-6 rounded-xl shadow-md transition-transform transform hover:scale-[1.02] active:scale-95"
          >
            НАДДАВАЙ (+ €1,000)
          </button>

          {/* История на наддаванията */}
          <div className="mt-8">
            <p className="text-sm font-bold text-gray-800 mb-3 border-b pb-2">Активност в залата</p>
            <div className="space-y-2 h-32 overflow-y-auto">
              {bidHistory.length === 0 ? (
                <p className="text-sm text-gray-400 italic">Чакане на първа оферта...</p>
              ) : (
                bidHistory.map((log, idx) => (
                  <p key={idx} className="text-sm text-gray-600 bg-gray-50 p-2 rounded border border-gray-100 slide-in">
                    ⏱️ {log}
                  </p>
                ))
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}