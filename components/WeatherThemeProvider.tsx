'use client'

import React, { createContext, useContext, useState } from 'react'
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
        ? 'linear-gradient(135deg, #F97316 0%, #EA580C 50%, #DC2626 100%)'
        : 'linear-gradient(135deg, #1E1B4B 0%, #312E81 50%, #3730A3 100%)',
      cloudy: isDay
        ? 'linear-gradient(135deg, #64748B 0%, #475569 50%, #334155 100%)'
        : 'linear-gradient(135deg, #1E293B 0%, #334155 50%, #475569 100%)',
      rainy: isDay
        ? 'linear-gradient(135deg, #3B82F6 0%, #2563EB 50%, #1D4ED8 100%)'
        : 'linear-gradient(135deg, #1E3A8A 0%, #1E40AF 50%, #1D4ED8 100%)',
      snowy: isDay
        ? 'linear-gradient(135deg, #94A3B8 0%, #64748B 50%, #475569 100%)'
        : 'linear-gradient(135deg, #374151 0%, #4B5563 50%, #6B7280 100%)',
      stormy: isDay
        ? 'linear-gradient(135deg, #7C3AED 0%, #5B21B6 50%, #4C1D95 100%)'
        : 'linear-gradient(135deg, #1E1B4B 0%, #3730A3 50%, #1D4ED8 100%)',
    }
    
    return baseGradients[theme as keyof typeof baseGradients] || baseGradients.cloudy
  }

  return (
    <WeatherThemeContext.Provider 
      value={{ currentTheme, setWeatherCode, isDayTime, setIsDayTime }}
    >
      <div className="relative min-h-screen">
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

        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>
      </div>
    </WeatherThemeContext.Provider>
  )
}
