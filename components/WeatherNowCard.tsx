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

  const getWeatherDescription = (code: number): string => {
    // Based on WMO Weather interpretation codes
    const descriptions: { [key: number]: string } = {
      0: 'Clear sky',
      1: 'Mainly clear',
      2: 'Partly cloudy',
      3: 'Overcast',
      45: 'Fog',
      48: 'Depositing rime fog',
      51: 'Light drizzle',
      53: 'Moderate drizzle',
      55: 'Dense drizzle',
      61: 'Slight rain',
      63: 'Moderate rain',
      65: 'Heavy rain',
      71: 'Slight snow fall',
      73: 'Moderate snow fall',
      75: 'Heavy snow fall',
      95: 'Thunderstorm',
      96: 'Thunderstorm with slight hail',
      99: 'Thunderstorm with heavy hail'
    }
    return descriptions[code] || 'Unknown conditions'
  }

  return (
    <motion.div
      className={className}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
    >
      <Card 
        className={`glass border-0 overflow-hidden weather-${weatherTheme}`}
        role="region"
        aria-label={`Current weather for ${locationName}`}
      >
        <CardContent className="p-8">
          <motion.div variants={itemVariants} className="text-center mb-6">
            <h2 
              className="text-2xl font-bold text-white mb-1"
              id="location-name"
            >
              {locationName}
            </h2>
            <p className="text-white/80 text-sm">
              <time dateTime={current.time}>
                {new Date(current.time).toLocaleString('en-US', {
                  weekday: 'long',
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true
                })}
              </time>
            </p>
          </motion.div>

          <motion.div 
            variants={itemVariants} 
            className="flex items-center justify-center mb-6"
            role="img"
            aria-label={`Weather condition: ${getWeatherDescription(current.weather_code)}`}
          >
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
              aria-hidden="true"
            >
              {weatherIcon}
            </motion.div>
            <motion.div variants={temperatureVariants}>
              <div 
                className="text-6xl font-light text-white"
                aria-label={`Temperature ${formatTemperature(current.temperature_2m, temperatureUnit)}`}
              >
                {formatTemperature(current.temperature_2m, temperatureUnit)}
              </div>
              <div 
                className="text-white/80 text-sm"
                aria-label={`Feels like ${formatTemperature(current.apparent_temperature, temperatureUnit)}`}
              >
                Feels like {formatTemperature(current.apparent_temperature, temperatureUnit)}
              </div>
            </motion.div>
          </motion.div>

          <motion.div 
            variants={itemVariants}
            className="grid grid-cols-2 gap-4 mt-8"
            role="list"
            aria-label="Weather details"
          >
            <motion.div 
              className="text-center p-4 rounded-lg bg-white/10"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
              role="listitem"
              tabIndex={0}
              aria-label={`Humidity: ${current.relative_humidity_2m} percent`}
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
              role="listitem"
              tabIndex={0}
              aria-label={`Wind speed: ${Math.round(current.wind_speed_10m)} kilometers per hour`}
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
              role="complementary"
              aria-label="Sunrise and sunset times"
            >
              <div className="flex justify-between text-white/80 text-sm">
                <span>
                  <span className="sr-only">Sunrise at </span>
                  Sunrise: {new Date(weatherData.daily.sunrise[0]).toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                  })}
                </span>
                <span>
                  <span className="sr-only">Sunset at </span>
                  Sunset: {new Date(weatherData.daily.sunset[0]).toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                  })}
                </span>
              </div>
            </motion.div>
          )}

          {/* Hidden description for screen readers */}
          <div className="sr-only">
            Current weather conditions for {locationName}: {getWeatherDescription(current.weather_code)}. 
            Temperature is {formatTemperature(current.temperature_2m, temperatureUnit)}, 
            feels like {formatTemperature(current.apparent_temperature, temperatureUnit)}. 
            Humidity at {current.relative_humidity_2m} percent, 
            wind speed {Math.round(current.wind_speed_10m)} kilometers per hour.
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
