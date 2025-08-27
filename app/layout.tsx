import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../styles/globals.css'
import { Providers } from './providers'
import { WeatherThemeProvider } from '@/components/WeatherThemeProvider'
import { OfflineBanner } from '@/components/OfflineBanner'
import { SkipLink } from '@/components/SkipLink'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'WeatherNow - Modern Weather App',
  description: 'A production-quality weather application with beautiful animations and real-time data',
  keywords: ['weather', 'forecast', 'temperature', 'climate', 'PWA'],
  authors: [{ name: 'WeatherNow Team' }],
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  themeColor: '#3B82F6',
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
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'WeatherNow',
  },
  openGraph: {
    type: 'website',
    siteName: 'WeatherNow',
    title: 'WeatherNow - Modern Weather App',
    description: 'Get real-time weather updates with beautiful animations',
    images: ['/icon-512x512.png'],
  },
  twitter: {
    card: 'summary',
    title: 'WeatherNow - Modern Weather App',
    description: 'Get real-time weather updates with beautiful animations',
    images: ['/icon-512x512.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://api.open-meteo.com" />
        <link rel="preconnect" href="https://geocoding-api.open-meteo.com" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="WeatherNow" />
        <meta name="application-name" content="WeatherNow" />
        <meta name="msapplication-TileColor" content="#3B82F6" />
        <meta name="msapplication-tap-highlight" content="no" />
      </head>
      <body className={inter.className}>
        <SkipLink />
        <Providers>
          <WeatherThemeProvider>
            <OfflineBanner />
            <main id="main-content" role="main">
              {children}
            </main>
          </WeatherThemeProvider>
        </Providers>
      </body>
    </html>
  )
}
