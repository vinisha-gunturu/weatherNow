'use client'

import React, { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, MapPin, Loader2 } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { WeatherAPI, GeocodingResult } from '@/lib/api'
import { debounce } from '@/lib/utils'
import { useWeatherStore } from '@/lib/stores'

interface SearchBarProps {
  onLocationSelect: (location: GeocodingResult) => void
  className?: string
}

export function SearchBar({ onLocationSelect, className }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [showResults, setShowResults] = useState(false)
  const [isGettingLocation, setIsGettingLocation] = useState(false)
  const { error, setError } = useWeatherStore()

  const { data: searchResults = [], isLoading } = useQuery({
    queryKey: ['locations', query],
    queryFn: () => WeatherAPI.searchLocations(query),
    enabled: query.length >= 2,
    staleTime: 300000, // 5 minutes
  })

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setQuery(value)
      setShowResults(value.length >= 2)
    }, 300),
    []
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    debouncedSearch(value)
    setError(null)
  }

  const handleLocationSelect = (location: GeocodingResult) => {
    setQuery('')
    setShowResults(false)
    onLocationSelect(location)
  }

  const getCurrentLocation = async () => {
    setIsGettingLocation(true)
    setError(null)
    
    try {
      const coords = await WeatherAPI.getCurrentLocation()
      onLocationSelect({
        id: 0,
        name: 'Current Location',
        latitude: coords.latitude,
        longitude: coords.longitude,
        country: '',
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get location')
    } finally {
      setIsGettingLocation(false)
    }
  }

  return (
    <div className={className}>
      <div className="relative">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search for a city..."
              onChange={handleInputChange}
              className="pl-10 pr-4"
              aria-label="Search for a city"
              aria-expanded={showResults}
              aria-autocomplete="list"
              role="combobox"
            />
          </div>
          
          <motion.div whileTap={{ scale: 0.95 }}>
            <Button
              onClick={getCurrentLocation}
              disabled={isGettingLocation}
              variant="outline"
              size="icon"
              aria-label="Use current location"
            >
              {isGettingLocation ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <MapPin className="h-4 w-4" />
              )}
            </Button>
          </motion.div>
        </div>

        <AnimatePresence>
          {showResults && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 right-0 z-50 mt-2 rounded-lg border bg-popover shadow-md"
            >
              {isLoading ? (
                <div className="flex items-center justify-center p-4">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="ml-2 text-sm text-muted-foreground">Searching...</span>
                </div>
              ) : searchResults.length > 0 ? (
                <div className="max-h-60 overflow-y-auto">
                  {searchResults.map((result, index) => (
                    <motion.button
                      key={result.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => handleLocationSelect(result)}
                      className="w-full px-4 py-3 text-left hover:bg-accent transition-colors focus:bg-accent focus:outline-none border-b border-border last:border-b-0"
                    >
                      <div className="font-medium">{result.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {result.admin1 && `${result.admin1}, `}{result.country}
                      </div>
                    </motion.button>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  No results found
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ 
              opacity: 1, 
              x: 0,
              transition: { type: "spring", stiffness: 500, damping: 30 }
            }}
            exit={{ opacity: 0, x: -10 }}
            className="mt-2 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md p-2"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
