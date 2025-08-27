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

        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>
      </div>
    </WeatherThemeContext.Provider>
  )
}
