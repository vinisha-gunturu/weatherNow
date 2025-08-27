'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getWeatherTheme } from '@/lib/utils'

interface WeatherThemeContextType {
  currentTheme: string
  setWeatherCode: (code: number) => void
  isDayTime: boolean
  setIsDayTime: (isDay: boolean) => void
}

const WeatherThemeContext = createContext<WeatherThemeContextType | undefined>(undefined)

export function useWeatherTheme() {
  const context = useContext(WeatherThemeContext)
  if (!context) {
    throw new Error('useWeatherTheme must be used within WeatherThemeProvider')
  }
  return context
}

interface WeatherThemeProviderProps {
  children: React.ReactNode
}

export function WeatherThemeProvider({ children }: WeatherThemeProviderProps) {
  const [currentTheme, setCurrentTheme] = useState('cloudy')
  const [isDayTime, setIsDayTime] = useState(true)
  const [backgroundKey, setBackgroundKey] = useState(0)
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })

  // Handle window size for particle positioning
  useEffect(() => {
    const updateSize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }

    if (typeof window !== 'undefined') {
      updateSize()
      window.addEventListener('resize', updateSize)
      return () => window.removeEventListener('resize', updateSize)
    }
  }, [])

  const setWeatherCode = (code: number) => {
    const newTheme = getWeatherTheme(code)
    if (newTheme !== currentTheme) {
      setCurrentTheme(newTheme)
      setBackgroundKey(prev => prev + 1)
    }
  }

  const getBackgroundGradient = (theme: string, isDay: boolean) => {
    const baseGradients = {
      sunny: isDay 
        ? 'linear-gradient(135deg, #FEF3C7 0%, #F59E0B 50%, #F97316 100%)'
        : 'linear-gradient(135deg, #1E1B4B 0%, #312E81 50%, #3730A3 100%)',
      cloudy: isDay
        ? 'linear-gradient(135deg, #F3F4F6 0%, #9CA3AF 50%, #6B7280 100%)'
        : 'linear-gradient(135deg, #1F2937 0%, #374151 50%, #4B5563 100%)',
      rainy: isDay
        ? 'linear-gradient(135deg, #DBEAFE 0%, #3B82F6 50%, #1D4ED8 100%)'
        : 'linear-gradient(135deg, #1E3A8A 0%, #1E40AF 50%, #1D4ED8 100%)',
      snowy: isDay
        ? 'linear-gradient(135deg, #F9FAFB 0%, #E5E7EB 50%, #D1D5DB 100%)'
        : 'linear-gradient(135deg, #374151 0%, #4B5563 50%, #6B7280 100%)',
      stormy: isDay
        ? 'linear-gradient(135deg, #EDE9FE 0%, #7C3AED 50%, #4C1D95 100%)'
        : 'linear-gradient(135deg, #1E1B4B 0%, #3730A3 50%, #1D4ED8 100%)',
    }
    
    return baseGradients[theme as keyof typeof baseGradients] || baseGradients.cloudy
  }

  const getParticles = (theme: string) => {
    if (windowSize.width === 0) return [] // Don't render particles until window size is known
    
    switch (theme) {
      case 'rainy':
        return Array.from({ length: Math.min(30, Math.floor(windowSize.width / 40)) }, (_, i) => ({
          id: i,
          emoji: '💧',
          size: Math.random() * 0.5 + 0.5,
          duration: Math.random() * 2 + 3,
          delay: Math.random() * 5,
          x: Math.random() * windowSize.width,
        }))
      case 'snowy':
        return Array.from({ length: Math.min(20, Math.floor(windowSize.width / 60)) }, (_, i) => ({
          id: i,
          emoji: '❄️',
          size: Math.random() * 0.8 + 0.4,
          duration: Math.random() * 3 + 4,
          delay: Math.random() * 5,
          x: Math.random() * windowSize.width,
        }))
      case 'stormy':
        return Array.from({ length: Math.min(15, Math.floor(windowSize.width / 80)) }, (_, i) => ({
          id: i,
          emoji: i % 3 === 0 ? '⚡' : '☁️',
          size: Math.random() * 0.6 + 0.6,
          duration: Math.random() * 1.5 + 2,
          delay: Math.random() * 3,
          x: Math.random() * windowSize.width,
        }))
      default:
        return []
    }
  }

  const particles = getParticles(currentTheme)

  return (
    <WeatherThemeContext.Provider 
      value={{ currentTheme, setWeatherCode, isDayTime, setIsDayTime }}
    >
      <div className="relative min-h-screen overflow-hidden">
        {/* Animated Background */}
        <AnimatePresence mode="wait">
          <motion.div
            key={backgroundKey}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="fixed inset-0 -z-10"
            style={{
              background: getBackgroundGradient(currentTheme, isDayTime)
            }}
          />
        </AnimatePresence>

        {/* Weather Particles */}
        {windowSize.width > 0 && (
          <AnimatePresence>
            {particles.map((particle) => (
              <motion.div
                key={`${currentTheme}-${particle.id}`}
                initial={{ 
                  opacity: 0, 
                  y: -50, 
                  x: particle.x,
                  scale: 0
                }}
                animate={{ 
                  opacity: 1, 
                  y: windowSize.height + 50,
                  scale: particle.size,
                  rotate: [0, 360]
                }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{
                  duration: particle.duration,
                  delay: particle.delay,
                  repeat: Infinity,
                  ease: "linear",
                  rotate: {
                    duration: particle.duration * 0.5,
                    repeat: Infinity,
                    ease: "linear"
                  }
                }}
                className="fixed pointer-events-none text-lg z-0 will-change-transform"
                style={{
                  fontSize: `${particle.size}rem`,
                  filter: `opacity(${0.3 + particle.size * 0.3})`,
                }}
              >
                {particle.emoji}
              </motion.div>
            ))}
          </AnimatePresence>
        )}

        {/* Ambient Light Effects */}
        <AnimatePresence>
          {currentTheme === 'sunny' && isDayTime && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: [0.1, 0.3, 0.1],
                scale: [1, 1.2, 1],
              }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="fixed top-20 right-20 w-96 h-96 bg-yellow-300/20 rounded-full blur-3xl pointer-events-none z-0 will-change-opacity"
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {currentTheme === 'stormy' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: [0, 0.8, 0],
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.2,
                repeat: Infinity,
                repeatDelay: Math.random() * 5 + 2,
                ease: "easeInOut"
              }}
              className="fixed inset-0 bg-white/20 pointer-events-none z-0 will-change-opacity"
            />
          )}
        </AnimatePresence>

        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>
      </div>
    </WeatherThemeContext.Provider>
  )
}
