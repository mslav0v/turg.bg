export default function BuyerDashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Табло на купувача</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-gray-500 text-sm font-semibold mb-1">Одобрен портфейл (Депозити)</p>
          <p className="text-3xl font-black text-blue-600">€ 15,000</p>
          <p className="text-xs text-green-600 mt-2">✓ Достатъчен за наддаване до €150,000</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-gray-500 text-sm font-semibold mb-1">Активни участия</p>
          <p className="text-3xl font-black text-gray-900">2</p>
          <p className="text-xs text-gray-500 mt-2">Търгове в реално време</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-gray-500 text-sm font-semibold mb-1">KYC Статус</p>
          <p className="text-2xl font-bold text-green-600 mt-1">Одобрен</p>
          <p className="text-xs text-gray-500 mt-2">Самоличността е потвърдена</p>
        </div>
      </div>

      <h2 className="text-xl font-bold text-gray-800 mb-4">История на наддаванията</h2>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="p-4 font-semibold text-gray-600">Имот</th>
              <th className="p-4 font-semibold text-gray-600">Моя оферта</th>
              <th className="p-4 font-semibold text-gray-600">Статус</th>
              <th className="p-4 font-semibold text-gray-600">Дата</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-100">
              <td className="p-4 text-gray-800 font-medium">Екологична къща - с. Рогачево</td>
              <td className="p-4 font-bold text-blue-600">€ 132,000</td>
              <td className="p-4"><span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-bold">Водеща оферта</span></td>
              <td className="p-4 text-sm text-gray-500">Днес, 14:32</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}