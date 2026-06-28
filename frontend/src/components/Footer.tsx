export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 pt-16 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          <div className="col-span-1 md:col-span-1">
            <h2 className="text-xl font-black text-gray-900 tracking-tight mb-4">Grosco Auctions</h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              Платформа за сигурни и прозрачни търгове на недвижими имоти. Всички права запазени.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4">Платформа</h3>
            <ul className="space-y-3">
              <li><a href="/live" className="text-sm text-gray-500 hover:text-gray-900 font-medium transition">Търгове на живо</a></li>
              <li><a href="/profile/properties" className="text-sm text-gray-500 hover:text-gray-900 font-medium transition">Продай имот</a></li>
              <li><a href="/login" className="text-sm text-gray-500 hover:text-gray-900 font-medium transition">Вход за клиенти</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4">Защита на данните (GDPR)</h3>
            <ul className="space-y-3">
              <li><a href="/privacy" className="text-sm text-gray-500 hover:text-gray-900 font-medium transition">Политика за поверителност</a></li>
              <li><a href="/cookies" className="text-sm text-gray-500 hover:text-gray-900 font-medium transition">Управление на бисквитки</a></li>
              <li><a href="/gdpr-request" className="text-sm text-gray-500 hover:text-gray-900 font-medium transition border-b border-gray-300 pb-1">Заявка за изтриване на данни</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4">Контакти</h3>
            <ul className="space-y-3">
              <li className="text-sm text-gray-500 font-medium">гр. Варна, бул. Васил Левски 201</li>
              <li className="text-sm text-gray-500 font-medium">office@google.com</li>
            </ul>
          </div>

        </div>
        
        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-400 font-medium">
            &copy; {new Date().getFullYear()} Grosco EOOD. Всички права запазени.
          </p>
          <div className="flex gap-6">
            <a href="/terms" className="text-xs text-gray-400 hover:text-gray-900 font-medium transition">Общи условия</a>
            <a href="/legal" className="text-xs text-gray-400 hover:text-gray-900 font-medium transition">Правна информация</a>
          </div>
        </div>
      </div>
    </footer>
  );
}