'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Wifi, WifiOff, Clock } from 'lucide-react'

export function OfflineBanner() {
  const [isOnline, setIsOnline] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  useEffect(() => {
    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine)
      if (navigator.onLine) {
        setLastUpdated(new Date())
      }
    }

    // Check initial status
    updateOnlineStatus()

    // Listen for online/offline events
    window.addEventListener('online', updateOnlineStatus)
    window.addEventListener('offline', updateOnlineStatus)

    return () => {
      window.removeEventListener('online', updateOnlineStatus)
      window.removeEventListener('offline', updateOnlineStatus)
    }
  }, [])

  const bannerVariants = {
    hidden: { 
      y: -100, 
      opacity: 0,
      scale: 0.95
    },
    visible: { 
      y: 0, 
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
        duration: 0.6
      }
    },
    exit: {
      y: -100,
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: 0.4,
        ease: "easeInOut"
      }
    }
  }

  const iconVariants = {
    online: {
      scale: [1, 1.2, 1],
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse" as const
      }
    },
    offline: {
      scale: [1, 1.1, 1],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        repeatType: "reverse" as const
      }
    }
  }

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          variants={bannerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed top-0 left-0 right-0 z-50 bg-red-500/90 backdrop-blur-sm text-white px-4 py-3 shadow-lg border-b border-red-400/50"
        >
          <div className="container mx-auto flex items-center justify-center space-x-3">
            <motion.div
              variants={iconVariants}
              animate="offline"
            >
              <WifiOff className="h-5 w-5" />
            </motion.div>
            <span className="font-medium">You're offline</span>
            <span className="text-red-100">•</span>
            <span className="text-red-100 text-sm">
              Showing cached data
            </span>
            {lastUpdated && (
              <>
                <Clock className="h-4 w-4 text-red-200" />
                <span className="text-red-200 text-sm">
                  Last updated: {lastUpdated.toLocaleTimeString()}
                </span>
              </>
            )}
          </div>
        </motion.div>
      )}
      
      {isOnline && lastUpdated && (
        <motion.div
          variants={bannerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed top-0 left-0 right-0 z-50 bg-green-500/90 backdrop-blur-sm text-white px-4 py-2 shadow-lg border-b border-green-400/50"
        >
          <div className="container mx-auto flex items-center justify-center space-x-3">
            <motion.div
              variants={iconVariants}
              animate="online"
            >
              <Wifi className="h-4 w-4" />
            </motion.div>
            <span className="text-sm">Back online</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
