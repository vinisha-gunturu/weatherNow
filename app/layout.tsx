import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import '../styles/globals.css'
import { Providers } from './providers'
import { WeatherThemeProvider } from '@/components/WeatherThemeProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'WeatherNow - Modern Weather App',
  description: 'A production-quality weather application with beautiful animations and real-time data',
  keywords: ['weather', 'forecast', 'temperature', 'climate', 'PWA'],
  authors: [{ name: 'WeatherNow Team' }],
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
    ],
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#3B82F6',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <WeatherThemeProvider>
            <main id="main-content" role="main">
              {children}
            </main>
          </WeatherThemeProvider>
        </Providers>
      </body>
    </html>
  )
}
