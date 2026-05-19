import { ChatbotWidget } from '@/components/public/layout/ChatbotWidget'
import { Footer } from '@/components/public/layout/Footer'
import { Header } from '@/components/public/layout/Header'
import { CookieConsent } from '@/components/public/shared/CookieConsent'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[calc(100vh-1px)] flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <ChatbotWidget />
      <CookieConsent />
    </div>
  )
}

