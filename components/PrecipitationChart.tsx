'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Cell
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatTime } from '@/lib/utils'
import { WeatherData } from '@/lib/api'

interface PrecipitationChartProps {
  weatherData: WeatherData
  className?: string
}

export function PrecipitationChart({ weatherData, className }: PrecipitationChartProps) {
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
    precipitation: weatherData.hourly.precipitation_probability[index],
    hour: new Date(time).getHours(),
  })).filter(item => item.precipitation > 0) // Only show hours with precipitation

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationProgress(100)
    }, 500)
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
          <p className="text-cyan-300 text-xs sm:text-sm">
            Rain: {payload[0].value}%
          </p>
        </motion.div>
      )
    }
    return null
  }, [])

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

  const getBarColor = (value: number) => {
    if (value < 30) return '#06B6D4' // Light blue
    if (value < 60) return '#0EA5E9' // Medium blue
    return '#0284C7' // Dark blue
  }

  if (chartData.length === 0) {
    return (
      <motion.div
        className={`w-full max-w-full transition-all duration-300 ease-in-out ${className || ''}`}
        variants={cardVariants}
        initial="hidden"
        animate="visible"
      >
        <Card className="glass border-0 w-full max-w-full overflow-hidden">
          <CardHeader className="pb-2 sm:pb-3 px-3 sm:px-4">
            <CardTitle className="text-white text-sm sm:text-base lg:text-lg truncate">Precipitation Forecast</CardTitle>
          </CardHeader>
          <CardContent className="px-2 sm:px-4 w-full">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className={`text-center ${
                isMobile ? 'py-6' : isTablet ? 'py-7' : 'py-8'
              }`}
            >
              <motion.div
                className={`mb-4 ${
                  isMobile ? 'text-3xl' : isTablet ? 'text-4xl' : 'text-4xl'
                }`}
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                ☀️
              </motion.div>
              <p className="text-white/80 text-sm sm:text-base px-2">
                No precipitation expected in the next {isMobile ? '12' : '24'} hours
              </p>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    )
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
          <CardTitle className="text-white text-sm sm:text-base lg:text-lg truncate">Precipitation Forecast</CardTitle>
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
              <BarChart
                data={chartData}
                margin={{
                  top: 10,
                  right: isMobile ? 5 : 10,
                  left: isMobile ? 5 : 10,
                  bottom: isMobile ? 50 : 30
                }}
              >
                <XAxis
                  dataKey="time"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: 'white',
                    fontSize: isMobile ? 9 : isTablet ? 10 : 11,
                    textAnchor: isMobile ? 'end' : 'middle'
                  }}
                  angle={isMobile ? -45 : 0}
                  height={isMobile ? 50 : 30}
                  minTickGap={isMobile ? 15 : 20}
                />

                <YAxis
                  hide
                  domain={[0, 100]}
                />

                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }}
                />

                <Bar
                  dataKey="precipitation"
                  radius={[isMobile ? 2 : 4, isMobile ? 2 : 4, 0, 0]}
                  animationDuration={800}
                  animationBegin={200}
                  maxBarSize={isMobile ? 30 : 50}
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={getBarColor(entry.precipitation)}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
