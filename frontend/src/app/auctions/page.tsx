import Link from 'next/link';

// Дефинираме типа на данните, които очакваме от бекенда
interface Auction {
  id: string;
  propertyId: string;
  startPrice: string;
  currentPrice: string;
  endTime: string;
  status: string;
  property: {
    title: string;
    location: string;
    description: string;
  };
}

// Функция за изтегляне на реалните данни от бекенда
async function getAuctions(): Promise<Auction[]> {
  try {
    // Използваме cache: 'no-store', за да виждаме винаги най-актуалните цени
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auctions`, { cache: 'no-store' });
    if (!res.ok) {
      throw new Error('Грешка при изтегляне на данните');
    }
    return res.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default async function AuctionsPage() {
  const auctions = await getAuctions();

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex justify-between items-end mb-8 border-b pb-4 border-gray-200">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Активни продажби</h1>
          <p className="text-gray-500 mt-2">Разгледайте текущите търгове и наддавайте в реално време.</p>
        </div>
        <div className="text-sm font-semibold text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
          Намерени: {auctions.length}
        </div>
      </div>

      {auctions.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-200 shadow-sm">
          <p className="text-gray-500 text-lg">В момента няма активни търгове.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {auctions.map((auction) => (
            <div key={auction.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group flex flex-col">
              
              {/* Снимка (Placeholder за сега) */}
              <div className="h-56 bg-gray-200 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                  Липсва снимка
                </div>
                <div className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider animate-pulse shadow-md">
                  Активен Търг
                </div>
              </div>

              {/* Информация за имота */}
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                  {auction.property.title}
                </h3>
                <p className="text-sm text-gray-500 mb-4 flex items-center gap-1">
                  {auction.property.location}
                </p>
                
                <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center">
                  <div>
                    <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">Текуща цена</p>
                    <p className="text-2xl font-black text-gray-900">
                      € {Number(auction.currentPrice).toLocaleString()}
                    </p>
                  </div>
                </div>

                <Link 
                  href={`/live`} 
                  className="mt-6 w-full text-center bg-gray-900 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-xl transition-colors duration-200"
                >
                  Влез в залата
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}