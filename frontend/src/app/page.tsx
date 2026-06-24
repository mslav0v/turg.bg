import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center w-full">
      <section className="w-full bg-gradient-to-r from-blue-900 to-slate-800 text-white py-20 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6 drop-shadow-md">
          Наддавай сигурно. Спечели своя нов имот.
        </h1>
        <p className="text-xl mb-10 max-w-2xl mx-auto font-light text-blue-100">
          Прозрачна платформа за онлайн търгове на недвижими имоти в реално време, гарантирани със защитен депозит.
        </p>
        <div className="bg-white p-4 rounded-lg shadow-xl max-w-4xl mx-auto flex flex-col md:flex-row gap-4 items-center">
          <input type="text" placeholder="Град или квартал..." className="w-full md:w-1/3 p-3 text-gray-800 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <select className="w-full md:w-1/3 p-3 text-gray-800 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Всички типове имоти</option>
            <option value="apartment">Апартамент</option>
            <option value="house">Къща / Сглобяема конструкция</option>
            <option value="plot">Парцел</option>
          </select>
          <button className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded font-bold transition">Търси</button>
        </div>
      </section>

      <section className="max-w-7xl mx-auto w-full py-16 px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 border-l-4 border-blue-600 pl-4">Търгове днес</h2>
          <Link href="/auctions" className="text-blue-600 hover:underline font-medium">Виж всички &rarr;</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((item) => (
            <div key={item} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition">
              <div className="h-48 bg-gray-200 flex items-center justify-center text-gray-400 text-lg font-medium">🏢 Имот изображение</div>
              <div className="p-5">
                <div className="flex justify-between items-center mb-2">
                  <span className="bg-red-100 text-red-800 text-xs font-bold px-2 py-1 rounded">Изтича скоро</span>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800 line-clamp-1">Премиум обект / Жилищна сграда</h3>
                <p className="text-gray-600 text-sm mb-4">Регион Варна</p>
                <div className="flex justify-between items-center border-t pt-4">
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold">Текуща цена</p>
                    <p className="text-2xl font-bold text-blue-600">€ 145,000</p>
                  </div>
                  <Link href="/auctions" className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-800 transition text-sm font-bold">Преглед</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}