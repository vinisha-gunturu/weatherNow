'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Trash2, MapPin, Heart } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useFavouritesStore, useWeatherStore } from '@/lib/stores'
import { GeocodingResult } from '@/lib/api'

export default function FavouritesPage() {
  const router = useRouter()
  const { favourites, removeFavourite } = useFavouritesStore()
  const { setCurrentLocation } = useWeatherStore()

  const handleLocationSelect = (location: GeocodingResult) => {
    setCurrentLocation(location)
    router.push('/')
  }

  const handleRemoveFavourite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    removeFavourite(id)
  }

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
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: 0.3
      }
    }
  }

  return (
    <div className="min-h-screen">
      <motion.div
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
        className="container mx-auto px-4 py-8"
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
            <h1 className="text-3xl font-bold text-white drop-shadow-lg">Favourite Locations</h1>
          </div>
          
          <motion.div
            className="flex items-center space-x-2 text-white/80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Heart className="h-5 w-5 fill-red-500 text-red-500 drop-shadow-sm" />
            <span className="drop-shadow-sm">{favourites.length} saved</span>
          </motion.div>
        </motion.header>

        {/* Content */}
        <AnimatePresence mode="wait">
          {favourites.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-20"
            >
              <motion.div
                className="text-6xl mb-6 drop-shadow-lg"
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
                💫
              </motion.div>
              <h2 className="text-2xl font-bold text-white mb-4 drop-shadow-lg">No favourite locations yet</h2>
              <p className="text-white/80 text-lg mb-8 drop-shadow-sm">
                Add locations to your favourites from the main page to see them here
              </p>
              <Link href="/">
                <Button variant="outline" className="text-white border-white hover:bg-white/20 backdrop-blur-sm">
                  Explore Weather
                </Button>
              </Link>
            </motion.div>
          ) : (
            <motion.div
              key="favourites-grid"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto"
            >
              <AnimatePresence>
                {favourites.map((location) => (
                  <motion.div
                    key={location.id}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    layout
                    whileHover={{ 
                      scale: 1.05,
                      transition: { type: "spring", stiffness: 300 }
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card 
                      className="glass border-0 cursor-pointer overflow-hidden group backdrop-blur-md"
                      onClick={() => handleLocationSelect(location)}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <motion.div
                              animate={{ 
                                scale: [1, 1.1, 1],
                              }}
                              transition={{ 
                                duration: 2,
                                repeat: Infinity,
                                repeatType: "reverse"
                              }}
                            >
                              <MapPin className="h-5 w-5 text-blue-300 drop-shadow-sm" />
                            </motion.div>
                            <div>
                              <h3 className="font-semibold text-white text-lg group-hover:text-blue-200 transition-colors drop-shadow-sm">
                                {location.name}
                              </h3>
                              {location.country && (
                                <p className="text-white/60 text-sm drop-shadow-sm">
                                  {location.country}
                                </p>
                              )}
                            </div>
                          </div>
                          
                          <motion.div whileTap={{ scale: 0.9 }}>
                            <Button
                              onClick={(e) => handleRemoveFavourite(location.id, e)}
                              variant="ghost"
                              size="sm"
                              className="text-white/60 hover:text-red-400 hover:bg-red-500/20 backdrop-blur-sm"
                              aria-label={`Remove ${location.name} from favourites`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </motion.div>
                        </div>
                        
                        <motion.div 
                          className="text-white/80 text-sm drop-shadow-sm"
                          initial={{ opacity: 0.6 }}
                          whileHover={{ opacity: 1 }}
                        >
                          <p>Lat: {location.latitude.toFixed(4)}</p>
                          <p>Lng: {location.longitude.toFixed(4)}</p>
                        </motion.div>
                        
                        <motion.div
                          className="mt-4 text-center"
                          initial={{ opacity: 0 }}
                          whileHover={{ opacity: 1 }}
                          transition={{ duration: 0.2 }}
                        >
                          <span className="text-blue-200 text-sm drop-shadow-sm">Click to view weather →</span>
                        </motion.div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
