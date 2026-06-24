export default function GuaranteesPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Безкомпромисна сигурност и Гаранции</h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto">
          Платформата комбинира правната рамка на публичната продан с най-високите технологични стандарти за защита на транзакциите.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Блок 1: Депозити */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 hover:border-blue-300 transition duration-300">
          <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center text-2xl mb-6">
            🔒
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Защита на депозитите (10%)</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            За да се елиминират фалшиви профили, системата изисква 10% гаранционен депозит за участие. Средствата се блокират по специализирана ескроу (escrow) сметка или чрез 3D-Secure авторизация на карта.
          </p>
          <ul className="space-y-2 text-sm text-gray-600 font-medium">
            <li className="flex items-center">✓ <span className="ml-2">Банково ниво на криптиране (AES-256)</span></li>
            <li className="flex items-center">✓ <span className="ml-2">Автоматично освобождаване при неуспех</span></li>
          </ul>
        </div>

        {/* Блок 2: Технология */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 hover:border-blue-300 transition duration-300">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center text-2xl mb-6">
            ⚡
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">ACID Транзакции в реално време</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Всички наддавания се обработват чрез WebSockets връзка без презареждане на страницата. Базата данни използва Pessimistic Locking, което гарантира, че две оферти не могат да се застъпят в една и съща милисекунда.
          </p>
          <ul className="space-y-2 text-sm text-gray-600 font-medium">
            <li className="flex items-center">✓ <span className="ml-2">0% шанс за "изгубен" бит</span></li>
            <li className="flex items-center">✓ <span className="ml-2">Мигновено обновяване за всички участници</span></li>
          </ul>
        </div>

        {/* Блок 3: Правен модел */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 hover:border-blue-300 transition duration-300 md:col-span-2">
          <div className="w-14 h-14 bg-amber-100 text-amber-700 rounded-xl flex items-center justify-center text-2xl mb-6">
            ⚖️
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Правна легитимност (Аналог на ЧСИ)</h2>
          <p className="text-gray-600 leading-relaxed">
            Бизнес логиката ни е педантично копие на модела на публичната продан в България. Продавачът е защитен чрез "Скрита минимална цена", която предотвратява продажба под пазарния минимум. Купувачите са защитени от нелоялна конкуренция чрез "Anti-sniping" правилото за удължаване на търга с 2 минути, даващо пълна прозрачност и равнопоставеност до самия край на търга.
          </p>
        </div>
      </div>
    </div>
  );
}