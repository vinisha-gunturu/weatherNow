'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Area,
  AreaChart
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatTime, formatTemperature } from '@/lib/utils'
import { useSettingsStore } from '@/lib/stores'
import { WeatherData } from '@/lib/api'

interface TemperatureChartProps {
  weatherData: WeatherData
  className?: string
}

export function TemperatureChart({ weatherData, className }: TemperatureChartProps) {
  const { temperatureUnit } = useSettingsStore()
  const [animationProgress, setAnimationProgress] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)

  // Check screen size for responsive behavior
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768)
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024)
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  // Prepare chart data for next 24 hours with responsive data points
  const chartData = weatherData.hourly.time.slice(0, isMobile ? 12 : 24).map((time, index) => ({
    time: formatTime(time),
    temperature: Math.round(weatherData.hourly.temperature_2m[index]),
    precipitation: weatherData.hourly.precipitation_probability[index],
    hour: new Date(time).getHours(),
  }))

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationProgress(100)
    }, 300)
    return () => clearTimeout(timer)
  }, [])

  const CustomTooltip = useCallback(({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-black/90 backdrop-blur-sm text-white p-2 sm:p-3 rounded-lg border border-white/20 text-xs sm:text-sm max-w-xs"
          style={{ zIndex: 1000 }}
        >
          <p className="font-medium text-xs sm:text-sm truncate">{label}</p>
          <p className="text-blue-300 text-xs sm:text-sm">
            {formatTemperature(payload[0].value, temperatureUnit)}
          </p>
          {payload[1] && (
            <p className="text-blue-200 text-xs sm:text-sm">
              Rain: {payload[1].value}%
            </p>
          )}
        </motion.div>
      )
    }
    return null
  }, [temperatureUnit])

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  }

  return (
    <motion.div
      className={`w-full max-w-full transition-all duration-300 ease-in-out ${className || ''}`}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
    >
      <Card className="glass border-0 w-full max-w-full overflow-hidden">
        <CardHeader className="pb-2 sm:pb-3 px-3 sm:px-4">
          <CardTitle className="text-white text-sm sm:text-base lg:text-lg truncate">
            {isMobile ? '12-Hour Trend' : '24-Hour Temperature Trend'}
          </CardTitle>
        </CardHeader>
        <CardContent className="px-2 sm:px-4 w-full">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className={`w-full chart-container ${
              isMobile ? 'h-48' : isTablet ? 'h-52' : 'h-56'
            }`}
          >
            <ResponsiveContainer width="100%" height="100%" maxHeight={400}>
              <AreaChart
                data={chartData}
                margin={{
                  top: 10,
                  right: isMobile ? 5 : 10,
                  left: isMobile ? 5 : 10,
                  bottom: isMobile ? 50 : 30
                }}
              >
                <defs>
                  <linearGradient id="temperatureGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>

                <XAxis
                  dataKey="time"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: 'white',
                    fontSize: isMobile ? 9 : isTablet ? 10 : 11,
                    textAnchor: isMobile ? 'end' : 'middle'
                  }}
                  interval={isMobile ? 1 : isTablet ? 'preserveEnd' : 'preserveStartEnd'}
                  angle={isMobile ? -45 : 0}
                  height={isMobile ? 50 : 30}
                  minTickGap={isMobile ? 20 : 30}
                />

                <YAxis
                  hide
                  domain={['dataMin - 2', 'dataMax + 2']}
                />

                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ stroke: '#3B82F6', strokeWidth: 1, strokeOpacity: 0.5 }}
                />

                <Area
                  type="monotone"
                  dataKey="temperature"
                  stroke="#3B82F6"
                  strokeWidth={isMobile ? 2 : 3}
                  fill="url(#temperatureGradient)"
                  strokeDasharray={`${animationProgress}% 100%`}
                  strokeDashoffset={0}
                  dot={{
                    fill: '#3B82F6',
                    strokeWidth: 1,
                    r: isMobile ? 2 : 3,
                    display: isMobile ? 'none' : 'block'
                  }}
                  activeDot={{
                    r: isMobile ? 4 : 6,
                    fill: '#3B82F6',
                    strokeWidth: 2,
                    stroke: 'white'
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
