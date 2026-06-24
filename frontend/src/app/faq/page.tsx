export default function FAQPage() {
  const faqs = [
    {
      question: "Как мога да участвам в търг?",
      answer: "За да наддавате, трябва да имате регистриран и верифициран профил (KYC) и да внесете гаранционен депозит за конкретния имот (обикновено 10% от началната цена). След потвърждение на депозита, получавате статус 'Одобрен наддавач'."
    },
    {
      question: "Какво представлява гаранционният депозит?",
      answer: "Депозитът е финансова гаранция за сериозността на вашето участие. Той се блокира по защитена сметка или чрез авторизация по банкова карта. Ако не спечелите търга, депозитът се освобождава автоматично в рамките на 24 часа."
    },
    {
      question: "Как работи правилото за удължаване на времето (Anti-sniping)?",
      answer: "За да гарантираме честен търг, всяко ново наддаване, направено в последните 2 минути преди края на търга, автоматично удължава оставащото време с още 2 минути. Това не позволява 'кражба' на търга в последната секунда и дава шанс на всички участници да реагират."
    },
    {
      question: "Какво е Скрита минимална цена (Reserve Price)?",
      answer: "Това е минималната сума, за която продавачът е съгласен да продаде имота. Ако при изтичане на времето най-високата оферта е под тази сума, имотът не се продава, а търгът се обявява за неуспешен. Депозитите на участниците се възстановяват."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Често задавани въпроси</h1>
        <p className="text-gray-600">Всичко, което трябва да знаете за правилата и процеса на наддаване.</p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <details key={index} className="group bg-white border border-gray-200 rounded-xl shadow-sm [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex items-center justify-between p-6 cursor-pointer font-semibold text-gray-900 hover:text-blue-600 transition">
              <span>{faq.question}</span>
              <span className="transition duration-300 group-open:rotate-180 bg-gray-100 text-gray-500 rounded-full p-2 h-8 w-8 flex items-center justify-center">
                ↓
              </span>
            </summary>
            <div className="p-6 pt-0 text-gray-600 leading-relaxed border-t border-gray-100 mt-2">
              {faq.answer}
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}