'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getWeatherIcon, formatTemperature, formatDate } from '@/lib/utils'
import { useSettingsStore } from '@/lib/stores'
import { WeatherData } from '@/lib/api'

interface DailyForecastCardProps {
  weatherData: WeatherData
  className?: string
}

export function DailyForecastCard({ weatherData, className }: DailyForecastCardProps) {
  const { temperatureUnit } = useSettingsStore()
  
  const dailyData = weatherData.daily.time.map((time, index) => ({
    time,
    weatherCode: weatherData.daily.weather_code[index],
    maxTemp: weatherData.daily.temperature_2m_max[index],
    minTemp: weatherData.daily.temperature_2m_min[index],
    precipitation: weatherData.daily.precipitation_probability_max[index],
    windSpeed: weatherData.daily.wind_speed_10m_max[index],
  }))

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  }

  return (
    <motion.div
      className={className}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
    >
      <Card className="glass border-0">
        <CardHeader className="pb-2 sm:pb-3">
          <CardTitle className="text-white text-base sm:text-lg">7-Day Forecast</CardTitle>
        </CardHeader>
        <CardContent className="px-2 sm:px-4">
          <motion.div
            className="space-y-1 sm:space-y-2"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {dailyData.map((day, index) => (
              <motion.div
                key={day.time}
                variants={itemVariants}
                whileHover={{ 
                  scale: 1.02,
                  backgroundColor: "rgba(255, 255, 255, 0.15)",
                  transition: { type: "spring", stiffness: 300 }
                }}
                className="flex items-center justify-between p-2 sm:p-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 touch-manipulation"
              >
                <motion.div
                  className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0"
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <motion.div
                    className="text-xl sm:text-2xl flex-shrink-0"
                    animate={{
                      rotate: [0, 5, -5, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      repeatType: "reverse",
                      delay: index * 0.2
                    }}
                  >
                    {getWeatherIcon(day.weatherCode)}
                  </motion.div>
                  
                  <div className="min-w-0 flex-1">
                    <motion.div
                      className="text-white font-medium text-sm sm:text-base truncate"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 + 0.1 }}
                    >
                      {index === 0 ? 'Today' : formatDate(day.time)}
                    </motion.div>
                    
                    {day.precipitation > 0 && (
                      <motion.div
                        className="text-white/60 text-xs sm:text-sm truncate"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 + 0.2 }}
                      >
                        <span className="inline-block">💧 {day.precipitation}%</span>
                        <span className="hidden sm:inline"> • </span>
                        <span className="inline-block sm:inline">💨 {Math.round(day.windSpeed)} km/h</span>
                      </motion.div>
                    )}
                  </div>
                </motion.div>

                <motion.div
                  className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0"
                  initial={{ x: 10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.05 + 0.1 }}
                >
                  <motion.span
                    className="text-white font-semibold text-sm sm:text-lg"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 200,
                      delay: index * 0.05 + 0.2
                    }}
                  >
                    {formatTemperature(day.maxTemp, temperatureUnit)}
                  </motion.span>
                  
                  <motion.span
                    className="text-white/60 text-sm sm:text-base"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 200,
                      delay: index * 0.05 + 0.25
                    }}
                  >
                    {formatTemperature(day.minTemp, temperatureUnit)}
                  </motion.span>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
