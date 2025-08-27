'use client'

import React, { useState, useEffect } from 'react'
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

  // Prepare chart data for next 24 hours
  const chartData = weatherData.hourly.time.slice(0, 24).map((time, index) => ({
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

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-black/80 backdrop-blur-sm text-white p-3 rounded-lg border border-white/20"
        >
          <p className="font-medium">{label}</p>
          <p className="text-blue-300">
            Temperature: {formatTemperature(payload[0].value, temperatureUnit)}
          </p>
          {payload[1] && (
            <p className="text-blue-200">
              Precipitation: {payload[1].value}%
            </p>
          )}
        </motion.div>
      )
    }
    return null
  }

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
      className={className}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
    >
      <Card className="glass border-0">
        <CardHeader>
          <CardTitle className="text-white">24-Hour Temperature Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="h-64"
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="temperatureGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="precipitationGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.6}/>
                    <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                
                <XAxis 
                  dataKey="time" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'white', fontSize: 12 }}
                  interval="preserveStartEnd"
                />
                
                <YAxis 
                  hide 
                  domain={['dataMin - 2', 'dataMax + 2']}
                />
                
                <Tooltip content={<CustomTooltip />} />
                
                <Area
                  type="monotone"
                  dataKey="temperature"
                  stroke="#3B82F6"
                  strokeWidth={3}
                  fill="url(#temperatureGradient)"
                  strokeDasharray={`${animationProgress}% 100%`}
                  strokeDashoffset={0}
                  dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                  activeDot={{ 
                    r: 6, 
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
