'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getWeatherIcon, formatTemperature, formatTime } from '@/lib/utils'
import { useSettingsStore } from '@/lib/stores'
import { WeatherData } from '@/lib/api'

interface HourlyForecastProps {
  weatherData: WeatherData
  className?: string
}

export function HourlyForecast({ weatherData, className }: HourlyForecastProps) {
  const { temperatureUnit } = useSettingsStore()
  
  // Get next 24 hours of data
  const hourlyData = weatherData.hourly.time.slice(0, 24).map((time, index) => ({
    time,
    temperature: weatherData.hourly.temperature_2m[index],
    weatherCode: weatherData.hourly.weather_code[index],
    precipitation: weatherData.hourly.precipitation_probability[index],
    humidity: weatherData.hourly.relative_humidity_2m[index],
  }))

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2
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
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
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
          <CardTitle className="text-white text-base sm:text-lg">24-Hour Forecast</CardTitle>
        </CardHeader>
        <CardContent className="px-2 sm:px-4">
          <motion.div
            className="flex overflow-x-auto overflow-y-hidden space-x-2 sm:space-x-3 pb-3 scrollbar-hide -mx-2 px-2 sm:mx-0 sm:px-0"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            {hourlyData.map((hour, index) => (
              <motion.div
                key={hour.time}
                variants={itemVariants}
                whileHover={{ 
                  scale: 1.05,
                  transition: { type: "spring", stiffness: 300 }
                }}
                className="flex-shrink-0 text-center p-3 sm:p-4 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 min-w-[80px] sm:min-w-[100px] touch-manipulation"
              >
                <motion.div
                  className="text-white/80 text-xs sm:text-sm mb-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  {index === 0 ? 'Now' : formatTime(hour.time)}
                </motion.div>
                
                <motion.div
                  className="text-xl sm:text-2xl mb-2"
                  animate={{
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse",
                    delay: index * 0.1
                  }}
                >
                  {getWeatherIcon(hour.weatherCode)}
                </motion.div>
                
                <motion.div
                  className="font-semibold text-white text-sm sm:text-lg"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    delay: index * 0.05
                  }}
                >
                  {formatTemperature(hour.temperature, temperatureUnit)}
                </motion.div>
                
                {hour.precipitation > 0 && (
                  <motion.div
                    className="text-white/60 text-[10px] sm:text-xs mt-1"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 + 0.2 }}
                  >
                    💧 {hour.precipitation}%
                  </motion.div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
