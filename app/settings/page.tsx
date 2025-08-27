'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Thermometer, Palette, MapPin, Zap } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useSettingsStore } from '@/lib/stores'

export default function SettingsPage() {
  const { 
    temperatureUnit, 
    setTemperatureUnit,
    theme,
    setTheme,
    useGeolocation,
    setUseGeolocation
  } = useSettingsStore()

  const pageVariants = {
    initial: { opacity: 0, x: 100 },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: -100 }
  }

  const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.4
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
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

  const ToggleButton = ({ 
    active, 
    onClick, 
    children 
  }: { 
    active: boolean
    onClick: () => void
    children: React.ReactNode 
  }) => (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.02 }}
      className={`px-4 py-2 rounded-lg transition-all duration-200 backdrop-blur-sm ${
        active 
          ? 'bg-white text-blue-600 shadow-lg' 
          : 'bg-white/20 text-white hover:bg-white/30'
      }`}
    >
      {children}
    </motion.button>
  )

  const SwitchToggle = ({ 
    enabled, 
    onChange, 
    label 
  }: { 
    enabled: boolean
    onChange: (enabled: boolean) => void
    label: string 
  }) => (
    <div className="flex items-center justify-between">
      <span className="text-white font-medium drop-shadow-sm">{label}</span>
      <motion.button
        onClick={() => onChange(!enabled)}
        whileTap={{ scale: 0.95 }}
        className={`relative w-12 h-6 rounded-full transition-colors duration-200 backdrop-blur-sm ${
          enabled ? 'bg-blue-500' : 'bg-white/30'
        }`}
      >
        <motion.div
          animate={{ x: enabled ? 24 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-md"
        />
      </motion.button>
    </div>
  )

  return (
    <div className="w-full">
      <motion.div
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
        className="w-full px-4 lg:px-8 xl:px-12 py-6"
      >
        {/* Header */}
        <motion.header 
          className="flex items-center justify-between mb-8"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="flex items-center space-x-4">
            <Link href="/">
              <motion.div whileTap={{ scale: 0.95 }}>
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 backdrop-blur-sm">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </motion.div>
            </Link>
            <h1 className="text-3xl font-bold text-white drop-shadow-lg">Settings</h1>
          </div>
          
          <motion.div
            initial={{ opacity: 0, rotate: 0 }}
            animate={{ opacity: 1, rotate: 360 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <Zap className="h-6 w-6 text-yellow-300 drop-shadow-lg" />
          </motion.div>
        </motion.header>

        {/* Settings Content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-2xl mx-auto space-y-6"
        >
          {/* Temperature Unit */}
          <motion.div variants={cardVariants}>
            <Card className="glass border-0 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-3 drop-shadow-sm">
                  <Thermometer className="h-5 w-5" />
                  <span>Temperature Unit</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-3">
                  <ToggleButton
                    active={temperatureUnit === 'celsius'}
                    onClick={() => setTemperatureUnit('celsius')}
                  >
                    Celsius (°C)
                  </ToggleButton>
                  <ToggleButton
                    active={temperatureUnit === 'fahrenheit'}
                    onClick={() => setTemperatureUnit('fahrenheit')}
                  >
                    Fahrenheit (°F)
                  </ToggleButton>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Theme */}
          <motion.div variants={cardVariants}>
            <Card className="glass border-0 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-3 drop-shadow-sm">
                  <Palette className="h-5 w-5" />
                  <span>Theme</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-3">
                  <ToggleButton
                    active={theme === 'light'}
                    onClick={() => setTheme('light')}
                  >
                    Light
                  </ToggleButton>
                  <ToggleButton
                    active={theme === 'dark'}
                    onClick={() => setTheme('dark')}
                  >
                    Dark
                  </ToggleButton>
                  <ToggleButton
                    active={theme === 'auto'}
                    onClick={() => setTheme('auto')}
                  >
                    Auto
                  </ToggleButton>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Location Settings */}
          <motion.div variants={cardVariants}>
            <Card className="glass border-0 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-3 drop-shadow-sm">
                  <MapPin className="h-5 w-5" />
                  <span>Location</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <SwitchToggle
                  enabled={useGeolocation}
                  onChange={setUseGeolocation}
                  label="Auto-detect current location"
                />
                <p className="text-white/70 text-sm drop-shadow-sm">
                  When enabled, the app will automatically use your current location when you visit the homepage.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* App Info */}
          <motion.div variants={cardVariants}>
            <Card className="glass border-0 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-white drop-shadow-sm">About WeatherNow</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-white/80 space-y-2 drop-shadow-sm">
                  <p><span className="font-medium">Version:</span> 1.0.0</p>
                  <p><span className="font-medium">Data Source:</span> Open-Meteo API</p>
                  <p><span className="font-medium">Features:</span> PWA Support, Offline Mode, Animations</p>
                </div>
                
                <motion.div
                  className="mt-6 text-center"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="text-2xl mb-2 drop-shadow-lg">🌤️</div>
                  <p className="text-white/60 text-sm drop-shadow-sm">
                    Built with modern web technologies for the best weather experience
                  </p>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  )
}
