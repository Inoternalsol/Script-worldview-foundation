'use client'

import { ChatbotWidget } from '@/components/public/layout/ChatbotWidget'
import { Footer } from '@/components/public/layout/Footer'
import { Header } from '@/components/public/layout/Header'
import { CookieConsent } from '@/components/public/shared/CookieConsent'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="flex min-h-[calc(100vh-1px)] flex-col">
      <Header />
      <AnimatePresence mode="wait" initial={false}>
        <motion.main
          key={pathname}
          className="flex-1"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
        >
          {children}
        </motion.main>
      </AnimatePresence>
      <Footer />
      <ChatbotWidget />
      <CookieConsent />
    </div>
  )
}
