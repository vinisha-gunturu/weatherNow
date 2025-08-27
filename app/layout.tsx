import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../styles/globals.css'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'WeatherNow - Modern Weather App',
  description: 'A production-quality weather application with beautiful animations and real-time data',
  keywords: ['weather', 'forecast', 'temperature', 'climate'],
  authors: [{ name: 'WeatherNow Team' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#3B82F6',
  manifest: '/manifest.json',
  icons: {
    icon: '/icon-192x192.png',
    apple: '/icon-192x192.png',
  },
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
          <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  )
}
