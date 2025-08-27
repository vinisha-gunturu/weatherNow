'use client'

import React, { useState, useEffect } from 'react'
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

  // Prepare chart data for next 24 hours
  const chartData = weatherData.hourly.time.slice(0, 24).map((time, index) => ({
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

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-black/80 backdrop-blur-sm text-white p-3 rounded-lg border border-white/20"
        >
          <p className="font-medium">{label}</p>
          <p className="text-cyan-300">
            Precipitation: {payload[0].value}%
          </p>
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

  const getBarColor = (value: number) => {
    if (value < 30) return '#06B6D4' // Light blue
    if (value < 60) return '#0EA5E9' // Medium blue
    return '#0284C7' // Dark blue
  }

  if (chartData.length === 0) {
    return (
      <motion.div
        className={className}
        variants={cardVariants}
        initial="hidden"
        animate="visible"
      >
        <Card className="glass border-0">
          <CardHeader>
            <CardTitle className="text-white">Precipitation Forecast</CardTitle>
          </CardHeader>
          <CardContent>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-center py-8"
            >
              <motion.div
                className="text-4xl mb-4"
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
              <p className="text-white/80">No precipitation expected in the next 24 hours</p>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    )
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
          <CardTitle className="text-white">Precipitation Forecast</CardTitle>
        </CardHeader>
        <CardContent>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="h-64"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis 
                  dataKey="time" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'white', fontSize: 12 }}
                />
                
                <YAxis 
                  hide 
                  domain={[0, 100]}
                />
                
                <Tooltip content={<CustomTooltip />} />
                
                <Bar 
                  dataKey="precipitation" 
                  radius={[4, 4, 0, 0]}
                  animationDuration={800}
                  animationBegin={200}
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
