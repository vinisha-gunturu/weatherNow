'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { Heart, Settings, Star, Loader2 } from 'lucide-react'
import Link from 'next/link'

import { SearchBar } from '@/components/SearchBar'
import { WeatherNowCard } from '@/components/WeatherNowCard'
import { HourlyForecast } from '@/components/HourlyForecast'
import { DailyForecastCard } from '@/components/DailyForecastCard'
import { TemperatureChart } from '@/components/TemperatureChart'
import { PrecipitationChart } from '@/components/PrecipitationChart'
import { useWeatherTheme } from '@/components/WeatherThemeProvider'
import { Button } from '@/components/ui/button'
import { WeatherAPI, GeocodingResult } from '@/lib/api'
import { useWeatherStore, useFavouritesStore, useSettingsStore } from '@/lib/stores'

export default function HomePage() {
  const [selectedLocation, setSelectedLocation] = useState<GeocodingResult | null>(null)
  const { currentLocation, setCurrentLocation } = useWeatherStore()
  const { isFavourite, addFavourite, removeFavourite } = useFavouritesStore()
  const { useGeolocation } = useSettingsStore()
  const { setWeatherCode, setIsDayTime } = useWeatherTheme()

  // Weather data query
  const { data: weatherData, isLoading, error, refetch } = useQuery({
    queryKey: ['weather', selectedLocation?.latitude, selectedLocation?.longitude],
    queryFn: () => {
      if (!selectedLocation) return null
      return WeatherAPI.getWeatherData(selectedLocation.latitude, selectedLocation.longitude)
    },
    enabled: !!selectedLocation,
    staleTime: 300000, // 5 minutes
    refetchInterval: 600000, // 10 minutes
  })

  // Update weather theme when data changes
  useEffect(() => {
    if (weatherData) {
      setWeatherCode(weatherData.current.weather_code)
      setIsDayTime(weatherData.current.is_day === 1)
    }
  }, [weatherData, setWeatherCode, setIsDayTime])

  // Auto-get current location on mount if enabled
  useEffect(() => {
    if (useGeolocation && !selectedLocation) {
      WeatherAPI.getCurrentLocation()
        .then(coords => {
          const location: GeocodingResult = {
            id: 0,
            name: 'Current Location',
            latitude: coords.latitude,
            longitude: coords.longitude,
            country: '',
          }
          setSelectedLocation(location)
          setCurrentLocation(location)
        })
        .catch(console.warn)
    }
  }, [useGeolocation, selectedLocation, setCurrentLocation])

  const handleLocationSelect = (location: GeocodingResult) => {
    setSelectedLocation(location)
    setCurrentLocation(location)
  }

  const toggleFavourite = () => {
    if (!selectedLocation) return
    
    const locationId = `${selectedLocation.latitude}-${selectedLocation.longitude}`
    const favouriteLocation = {
      ...selectedLocation,
      id: locationId,
    }

    if (isFavourite(locationId)) {
      removeFavourite(locationId)
    } else {
      addFavourite(favouriteLocation)
    }
  }

  const pageVariants = {
    initial: { opacity: 0 },
    in: { opacity: 1 },
    out: { opacity: 0 }
  }

  const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.5
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  }

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className="min-h-screen w-full overflow-x-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900"
    >
      {/* Fixed Header */}
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-md border-b border-white/10"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex flex-col space-y-3 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
            {/* Logo and Navigation */}
            <div className="flex items-center justify-between">
              <motion.h1
                className="text-xl sm:text-2xl lg:text-3xl font-bold text-white drop-shadow-lg"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                Weather<span className="text-yellow-300">Now</span>
              </motion.h1>

              <div className="flex items-center space-x-2 lg:hidden">
                {selectedLocation && (
                  <motion.div whileTap={{ scale: 0.95 }}>
                    <Button
                      onClick={toggleFavourite}
                      variant="ghost"
                      size="icon"
                      className="text-white hover:bg-white/20 backdrop-blur-sm touch-manipulation"
                      aria-label={isFavourite(`${selectedLocation.latitude}-${selectedLocation.longitude}`) ? 'Remove from favourites' : 'Add to favourites'}
                    >
                      <motion.div
                        animate={isFavourite(`${selectedLocation.latitude}-${selectedLocation.longitude}`) ? {
                          scale: [1, 1.2, 1],
                          rotate: [0, 10, -10, 0]
                        } : {}}
                        transition={{ duration: 0.3 }}
                      >
                        <Heart
                          className={`h-4 w-4 drop-shadow-sm ${
                            isFavourite(`${selectedLocation.latitude}-${selectedLocation.longitude}`)
                              ? 'fill-red-500 text-red-500'
                              : 'text-white'
                          }`}
                        />
                      </motion.div>
                    </Button>
                  </motion.div>
                )}

                <Link href="/favourites">
                  <motion.div whileTap={{ scale: 0.95 }}>
                    <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 backdrop-blur-sm touch-manipulation">
                      <Star className="h-4 w-4 drop-shadow-sm" />
                    </Button>
                  </motion.div>
                </Link>

                <Link href="/settings">
                  <motion.div whileTap={{ scale: 0.95 }}>
                    <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 backdrop-blur-sm touch-manipulation">
                      <Settings className="h-4 w-4 drop-shadow-sm" />
                    </Button>
                  </motion.div>
                </Link>
              </div>
            </div>

            {/* Search Bar */}
            <div className="lg:flex-1 lg:max-w-2xl lg:mx-8">
              <SearchBar
                onLocationSelect={handleLocationSelect}
                className="w-full"
              />
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-2">
              {selectedLocation && (
                <motion.div whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={toggleFavourite}
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/20 backdrop-blur-sm touch-manipulation"
                    aria-label={isFavourite(`${selectedLocation.latitude}-${selectedLocation.longitude}`) ? 'Remove from favourites' : 'Add to favourites'}
                  >
                    <motion.div
                      animate={isFavourite(`${selectedLocation.latitude}-${selectedLocation.longitude}`) ? {
                        scale: [1, 1.2, 1],
                        rotate: [0, 10, -10, 0]
                      } : {}}
                      transition={{ duration: 0.3 }}
                    >
                      <Heart
                        className={`h-5 w-5 drop-shadow-sm ${
                          isFavourite(`${selectedLocation.latitude}-${selectedLocation.longitude}`)
                            ? 'fill-red-500 text-red-500'
                            : 'text-white'
                        }`}
                      />
                    </motion.div>
                  </Button>
                </motion.div>
              )}

              <Link href="/favourites">
                <motion.div whileTap={{ scale: 0.95 }}>
                  <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 backdrop-blur-sm touch-manipulation">
                    <Star className="h-5 w-5 drop-shadow-sm" />
                  </Button>
                </motion.div>
              </Link>

              <Link href="/settings">
                <motion.div whileTap={{ scale: 0.95 }}>
                  <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 backdrop-blur-sm touch-manipulation">
                    <Settings className="h-5 w-5 drop-shadow-sm" />
                  </Button>
                </motion.div>
              </Link>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="pt-24 lg:pt-28 pb-6 min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl transition-all duration-300 ease-in-out">


        {/* Content */}
        <AnimatePresence mode="wait">
          {isLoading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center py-12 sm:py-16"
            >
              <Loader2 className="h-8 w-8 animate-spin text-white mr-3 drop-shadow-sm" />
              <span className="text-white text-lg drop-shadow-sm">Loading weather data...</span>
            </motion.div>
          )}

          {error && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-12 sm:py-16"
            >
              <div className="text-white text-lg mb-4 drop-shadow-sm">Failed to load weather data</div>
              <Button onClick={() => refetch()} variant="outline" className="text-white border-white hover:bg-white/20 backdrop-blur-sm">
                Try Again
              </Button>
            </motion.div>
          )}

          {weatherData && selectedLocation && (
            <motion.div
              key="weather-content"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="w-full max-w-none transition-all duration-300 ease-in-out"
            >
              {/* Mobile: Single Column Layout */}
              <div className="block md:hidden space-y-4">
                {/* Current Weather - Full Width */}
                <WeatherNowCard
                  weatherData={weatherData}
                  locationName={selectedLocation.name}
                  className="w-full"
                />

                {/* Charts - Stacked */}
                <div className="space-y-4">
                  <TemperatureChart weatherData={weatherData} className="w-full" />
                  <PrecipitationChart weatherData={weatherData} className="w-full" />
                </div>

                {/* Hourly Forecast - Horizontal Scroll */}
                <HourlyForecast
                  weatherData={weatherData}
                  className="w-full"
                />

                {/* Daily Forecast */}
                <DailyForecastCard
                  weatherData={weatherData}
                  className="w-full"
                />
              </div>

              {/* Tablet: Two Column Layout (768px - 1023px) */}
              <div className="hidden md:block lg:hidden">
                <div className="grid grid-cols-1 gap-4 mb-4">
                  {/* Current Weather - Full Width */}
                  <WeatherNowCard
                    weatherData={weatherData}
                    locationName={selectedLocation.name}
                    className="col-span-1"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  {/* Charts Side by Side */}
                  <TemperatureChart weatherData={weatherData} className="col-span-1" />
                  <PrecipitationChart weatherData={weatherData} className="col-span-1" />
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {/* Hourly and Daily Forecasts */}
                  <HourlyForecast
                    weatherData={weatherData}
                    className="col-span-1"
                  />
                  <DailyForecastCard
                    weatherData={weatherData}
                    className="col-span-1"
                  />
                </div>
              </div>

              {/* Desktop: Multi-Column Layout (≥1024px) */}
              <div className="hidden lg:block">
                <div className="grid grid-cols-12 gap-6">
                  {/* Current Weather - Spans full width */}
                  <div className="col-span-12">
                    <WeatherNowCard
                      weatherData={weatherData}
                      locationName={selectedLocation.name}
                      className="w-full"
                    />
                  </div>

                  {/* Charts Row - Side by Side */}
                  <div className="col-span-6">
                    <TemperatureChart weatherData={weatherData} className="w-full h-full" />
                  </div>
                  <div className="col-span-6">
                    <PrecipitationChart weatherData={weatherData} className="w-full h-full" />
                  </div>

                  {/* Forecasts Row */}
                  <div className="col-span-7">
                    <HourlyForecast
                      weatherData={weatherData}
                      className="w-full h-full"
                    />
                  </div>
                  <div className="col-span-5">
                    <DailyForecastCard
                      weatherData={weatherData}
                      className="w-full h-full"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {!selectedLocation && !isLoading && !error && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-12 sm:py-16"
            >
              <motion.div
                className="text-4xl sm:text-5xl lg:text-6xl mb-4 sm:mb-6 drop-shadow-lg"
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                🌤️
              </motion.div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 drop-shadow-lg">Welcome to WeatherNow</h2>
              <p className="text-white/90 text-base sm:text-lg drop-shadow-sm px-4 sm:px-0">Search for a city or use your current location to get started</p>
            </motion.div>
          )}
        </AnimatePresence>
        </div>
      </main>
    </motion.div>
  )
}
