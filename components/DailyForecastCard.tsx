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
        <CardHeader>
          <CardTitle className="text-white">7-Day Forecast</CardTitle>
        </CardHeader>
        <CardContent>
          <motion.div
            className="space-y-3"
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
                className="flex items-center justify-between p-4 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20"
              >
                <motion.div 
                  className="flex items-center space-x-4 flex-1"
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <motion.div 
                    className="text-2xl"
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
                  
                  <div>
                    <motion.div 
                      className="text-white font-medium"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 + 0.1 }}
                    >
                      {index === 0 ? 'Today' : formatDate(day.time)}
                    </motion.div>
                    
                    {day.precipitation > 0 && (
                      <motion.div 
                        className="text-white/60 text-sm"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 + 0.2 }}
                      >
                        💧 {day.precipitation}% • 💨 {Math.round(day.windSpeed)} km/h
                      </motion.div>
                    )}
                  </div>
                </motion.div>

                <motion.div 
                  className="flex items-center space-x-2"
                  initial={{ x: 10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.05 + 0.1 }}
                >
                  <motion.span 
                    className="text-white font-semibold text-lg"
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
                    className="text-white/60"
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
