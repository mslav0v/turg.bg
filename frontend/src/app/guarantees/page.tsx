"use client";

export default function GuaranteesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-20 bg-gray-50/30">
      
      {/* КОНЦЕПТУАЛНО ЗАГЛАВИЕ И ВЪВЕДЕНИЕ */}
      <div className="text-center mb-24 border-b border-gray-200 pb-12">
        <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-6">
          Регламент на работа и гаранции
        </h1>
        <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
          Иновативния алгоритъм на turg.bg съчетава стриктната нормативна рамка на класическите публични продажби с модерни софтуерни протоколи за финансова защита и транзакционна сигурност. Принципите на работа осигуряват пълна равнопоставеност и нулев риск от пазарни манипулации.
        </p>
      </div>

      {/* ГЛАВНА СТРУКТУРА: СТЪЛБОВЕ НА СИГУРНОСТТА */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24">
        
        {/* Първи стълб: Финансово обезпечение */}
        <div className="bg-white p-10 rounded-3xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="text-xs font-bold text-blue-600 tracking-widest uppercase mb-4">
              Депозитна архитектура
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Гарантиране на платежоспособността
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              С цел недопускане на фиктивни наддавателни предложения и злоумишлени действия от нереални профили, участието в рамките на всеки индивидуален търг изисква предварително внасяне на гаранционен депозит. Размерът на обезпечението възлиза на точно десет процента от обявената начална цена на съответния актив.
            </p>
            <p className="text-gray-600 leading-relaxed mb-6">
              Капиталът се блокира чрез защитен ескроу банков протокол или специализиран картов механизъм за авторизация с криптиране от най-високо банково ниво. Това гарантира пълна недосегаемост на средствата по време на процедурата.
            </p>
          </div>
          <div className="border-t border-gray-100 pt-6">
            <div className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2">
              Оперативни правила за разплащане
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              Средствата на спечелилия участник се задържат като депозит до окончателното изповядване на сделката. При всички останали участници депозитите се освобождават автоматично веднага след официалното приключване на търга.
            </p>
          </div>
        </div>

        {/* Втори стълб: Технологичен интегритет */}
        <div className="bg-white p-10 rounded-3xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="text-xs font-bold text-emerald-600 tracking-widest uppercase mb-4">
              Транзакционен контрол
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Синхронизация и защита в реално време
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              Информационната система обработва постъпващите наддавателни стъпки чрез директни комуникационни канали без каквото и да е забавяне или необходимост от обновяване на клиентския интерфейс. Ядрото на базата данни работи под строг песимистичен контрол на достъпа.
            </p>
            <p className="text-gray-600 leading-relaxed mb-6">
              Този софтуерен алгоритъм блокира таблицата за наддаване за частици от секундата по време на запис, като елиминира напълно теоретичния шанс за застъпване, припокриване или изгубване на оферти, изпратени в рамките на една и съща милисекунда от различни точки на страната.
            </p>
          </div>
          <div className="border-t border-gray-100 pt-6">
            <div className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2">
              Технологични показатели
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              Пълна сигурност на транзакциите, незабавно актуализиране на текущата цена за всички активни потребители на екрана и непрекъсваемост на софтуерната сесия.
            </p>
          </div>
        </div>

        {/* Трети стълб: Правна рамка и равнопоставеност */}
        <div className="bg-white p-10 rounded-3xl border border-gray-200 shadow-sm lg:col-span-2">
          <div className="text-xs font-bold text-amber-600 tracking-widest uppercase mb-4">
            Правна легитимност
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Защита на интересите на страните по сделката
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <p className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-2">
                Обезпечение за продавачите
              </p>
              <p className="text-gray-600 text-sm leading-relaxed">
                Всеки собственик на актив разполага с функционалност за залагане на скрита минимална цена, известна като резервна стойност. Ако финалните наддавателни стъпки не достигнат този пазарен минимум, търгът се обявява за неуспешен и активът не може да бъде принудително продаден под лимита, определен от продавача.
              </p>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-2">
                Обезпечение за купувачите
              </p>
              <p className="text-gray-600 text-sm leading-relaxed">
                Системата прилага международното правило против изкуствено изтичане на времето, наречено анти-снайпинг. Всяко наддавателно предложение, изпратено в последните две минути преди официалния край, автоматично удължава времетраенето на търга с нови две минути. Това дава възможност за легитимна реакция от всички страни и елиминира нелоялни тактики в последната секунда.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* ХРОНОЛОГИЯ НА ПРОЦЕСА - НОВА СЕКЦИЯ ЗА УВЕЛИЧАВАНЕ НА ОБЕМА И ДОБРИЯ ОБЛИК */}
      <div className="bg-white rounded-3xl border border-gray-200 p-12 shadow-sm mb-16">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Етапи на провеждане на публичните търгове
          </h2>
          <p className="text-gray-500 text-sm">
            Пътна карта за преминаване през процедурата съгласно установения софтуерен и юридически регламент.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="border-l-2 border-gray-200 pl-6 space-y-3">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Етап 01</div>
            <div className="text-lg font-bold text-gray-900">Идентификация</div>
            <p className="text-gray-600 text-xs leading-relaxed">
              Всеки потребител преминава през задължителна верификация на самоличността и проверка на личните или фирмените документи преди получаване на достъп.
            </p>
          </div>

          <div className="border-l-2 border-gray-200 pl-6 space-y-3">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Етап 02</div>
            <div className="text-lg font-bold text-gray-900">Депозиране</div>
            <p className="text-gray-600 text-xs leading-relaxed">
              Инициира се превод на десетпроцентното обезпечение по сметката на търга за заявяване на сериозно наддавателно намерение за конкретния актив.
            </p>
          </div>

          <div className="border-l-2 border-gray-200 pl-6 space-y-3">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Етап 03</div>
            <div className="text-lg font-bold text-gray-900">Наддаване</div>
            <p className="text-gray-600 text-xs leading-relaxed">
              Открита и прозрачна сесия в реално време, контролирана от автоматизираните софтуерни алгоритми за валидация и удължаване на времето.
            </p>
          </div>

          <div className="border-l-2 border-gray-200 pl-6 space-y-3">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Етап 04</div>
            <div className="text-lg font-bold text-gray-900">Финализиране</div>
            <p className="text-gray-600 text-xs leading-relaxed">
              Автоматично генериране на търговски протокол, сключване на договор и незабавно освобождаване на блокираните суми към непечелившите участници.
            </p>
          </div>

        </div>
      </div>

      {/* ОФИЦИАЛНА КЛАУЗА И ДЕКЛАРАЦИЯ ЗА ДОВЕРИЕ */}
      <div className="bg-gray-900 text-white rounded-3xl p-12 text-center shadow-lg">
        <h3 className="text-2xl font-bold mb-4">
          Институционална ангажираност към пазара
        </h3>
        <p className="text-gray-400 text-sm max-w-3xl mx-auto leading-relaxed">
          Turg.bg не е посредник, а софтуерен и правен гарант на транзакциите. Нашата мисия е да осигурим чиста среда за търговия с недвижими имоти, превозни средства, строителна техника и индустриално оборудване, елиминирайки изцяло субективния фактор и възможностите за манипулация на ценовите нива.
        </p>
      </div>

    </div>
  );
}