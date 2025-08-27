import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../styles/globals.css'
import { Providers } from './providers'
import { WeatherThemeProvider } from '@/components/WeatherThemeProvider'

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
          <WeatherThemeProvider>
            {children}
          </WeatherThemeProvider>
        </Providers>
      </body>
    </html>
  )
}
