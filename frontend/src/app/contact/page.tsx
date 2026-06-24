export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-center mb-12 text-gray-900">Свържете се с нас</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-xl font-bold mb-4 text-gray-800">Централен офис</h2>
          <p className="text-gray-600 mb-2">📍 гр. Варна, България</p>
          <p className="text-gray-600 mb-2">📧 support@auctioestate.bg</p>
          <p className="text-gray-600 mb-8">📞 +359 88 000 0000</p>
          
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
            <h3 className="font-bold text-blue-900 mb-2">Техническа поддръжка</h3>
            <p className="text-sm text-blue-800">Ако имате проблем с депозирането на средства или свързването с WebSocket сървъра по време на търг, моля използвайте формата за спешна връзка.</p>
          </div>
        </div>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Име</label>
            <input type="text" className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Имейл</label>
            <input type="email" className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Съобщение</label>
            <textarea rows={4} className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 outline-none"></textarea>
          </div>
          <button className="w-full bg-gray-900 text-white font-bold py-3 rounded-md hover:bg-gray-800 transition">
            Изпрати запитване
          </button>
        </form>
      </div>
    </div>
  );
}