'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { getWeatherIcon, getWeatherTheme, formatTemperature } from '@/lib/utils'
import { useSettingsStore } from '@/lib/stores'
import { WeatherData } from '@/lib/api'

interface WeatherNowCardProps {
  weatherData: WeatherData
  locationName: string
  className?: string
}

export function WeatherNowCard({ weatherData, locationName, className }: WeatherNowCardProps) {
  const { temperatureUnit } = useSettingsStore()
  
  const { current } = weatherData
  const weatherTheme = getWeatherTheme(current.weather_code)
  const weatherIcon = getWeatherIcon(current.weather_code)

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  }

  const temperatureVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { 
        duration: 0.5, 
        ease: "anticipate",
        delay: 0.2
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
      <Card className={`glass border-0 overflow-hidden weather-${weatherTheme}`}>
        <CardContent className="p-8">
          <motion.div variants={itemVariants} className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white mb-1">{locationName}</h2>
            <p className="text-white/80 text-sm">
              {new Date(current.time).toLocaleString('en-US', {
                weekday: 'long',
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
              })}
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="flex items-center justify-center mb-6">
            <motion.div 
              className="text-6xl mr-4"
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
              }}
            >
              {weatherIcon}
            </motion.div>
            <motion.div variants={temperatureVariants}>
              <div className="text-6xl font-light text-white">
                {formatTemperature(current.temperature_2m, temperatureUnit)}
              </div>
              <div className="text-white/80 text-sm">
                Feels like {formatTemperature(current.apparent_temperature, temperatureUnit)}
              </div>
            </motion.div>
          </motion.div>

          <motion.div 
            variants={itemVariants}
            className="grid grid-cols-2 gap-4 mt-8"
          >
            <motion.div 
              className="text-center p-4 rounded-lg bg-white/10"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="text-white/80 text-sm mb-1">Humidity</div>
              <div className="text-xl font-semibold text-white">
                {current.relative_humidity_2m}%
              </div>
            </motion.div>

            <motion.div 
              className="text-center p-4 rounded-lg bg-white/10"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="text-white/80 text-sm mb-1">Wind Speed</div>
              <div className="text-xl font-semibold text-white">
                {Math.round(current.wind_speed_10m)} km/h
              </div>
            </motion.div>
          </motion.div>

          {weatherData.daily && (
            <motion.div 
              variants={itemVariants}
              className="mt-6 text-center"
            >
              <div className="flex justify-between text-white/80 text-sm">
                <span>
                  Sunrise: {new Date(weatherData.daily.sunrise[0]).toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                  })}
                </span>
                <span>
                  Sunset: {new Date(weatherData.daily.sunset[0]).toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                  })}
                </span>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
