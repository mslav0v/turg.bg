import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Link from 'next/link'
import Navbar from '@/components/Navbar' // Внасяме новия компонент

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'turg.bg | Платформа за онлайн търгове на имоти',
  description: 'Сигурни онлайн търгове на недвижими имоти в реално време, гарантирани със защитен депозит.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="bg">
      <body className={`${inter.className} bg-gray-50 text-gray-900 flex flex-col min-h-screen antialiased`}>
        
        {/* Модерната навигация е изнесена в отделен компонент */}
        <Navbar />

        {/* Съдържание на страниците */}
        <main className="flex-grow">
          {children}
        </main>

        {/* Структуриран корпоративен Footer */}
        <footer className="bg-gray-950 text-gray-400 py-16 border-t border-gray-800 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
              
              {/* Колона 1: Бранд и описание */}
              <div>
                <Link href="/" className="text-2xl font-extrabold tracking-tight text-white mb-4 block">
                  turg<span className="text-blue-500">.bg</span>
                </Link>
                <p className="text-sm leading-relaxed mb-6">
                  Иновативна платформа за провеждане на онлайн търгове на недвижими имоти. Гарантирана прозрачност, защитени депозити и изпълнение в реално време по стандартите на публичната продан.
                </p>
              </div>

              {/* Колона 2: Бързи връзки */}
              <div>
                <h3 className="text-white font-semibold mb-4 uppercase text-xs tracking-wider">Платформа</h3>
                <ul className="space-y-3 text-sm">
                  <li><Link href="/live" className="hover:text-white transition-colors flex items-center gap-2"><span className="h-1.5 w-1.5 bg-red-500 rounded-full"></span>Търгове на живо</Link></li>
                  <li><Link href="/auctions" className="hover:text-white transition-colors">Всички продажби</Link></li>
                  <li><Link href="/seller-portal" className="hover:text-white transition-colors">Портал за продавачи</Link></li>
                  <li><Link href="/buyer-dashboard" className="hover:text-white transition-colors">Табло на купувача</Link></li>
                </ul>
              </div>

              {/* Колона 3: Информация */}
              <div>
                <h3 className="text-white font-semibold mb-4 uppercase text-xs tracking-wider">Помощ и Сигурност</h3>
                <ul className="space-y-3 text-sm">
                  <li><Link href="/guarantees" className="hover:text-white transition-colors">Гаранции и депозити</Link></li>
                  <li><Link href="/faq" className="hover:text-white transition-colors">Често задавани въпроси</Link></li>
                  <li><Link href="/contact" className="hover:text-white transition-colors">Контакти</Link></li>
                </ul>
              </div>

              {/* Колона 4: Контакти */}
              <div>
                <h3 className="text-white font-semibold mb-4 uppercase text-xs tracking-wider">Връзка с нас</h3>
                <ul className="space-y-3 text-sm">
                  <li>support@turg.bg</li>
                  <li>+359 88 000 0000</li>
                  <li>гр. Варна, България</li>
                </ul>
              </div>
              
            </div>

            {/* Долна лента с права и легална информация */}
            <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center text-xs">
              <p>&copy; {new Date().getFullYear()} turg.bg. Всички права запазени.</p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <Link href="#" className="hover:text-white transition-colors">Общи условия</Link>
                <Link href="#" className="hover:text-white transition-colors">Политика за поверителност</Link>
                <Link href="#" className="hover:text-white transition-colors">KYC Политика</Link>
              </div>
            </div>
          </div>
        </footer>

      </body>
    </html>
  )
}