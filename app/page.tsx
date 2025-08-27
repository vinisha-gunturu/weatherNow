'use client'

import React from 'react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500">
      <div className="container mx-auto px-4 py-8">
        <header className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-white drop-shadow-lg">
            Weather<span className="text-yellow-300">Now</span>
          </h1>
        </header>

        <div className="max-w-2xl mx-auto mb-8">
          <div className="flex gap-2">
            <input
              placeholder="Search for a city..."
              className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm"
            />
            <button className="h-10 w-10 rounded-md bg-primary text-primary-foreground">
              📍
            </button>
          </div>
        </div>

        <div className="text-center py-20">
          <div className="text-6xl mb-6">🌤️</div>
          <h2 className="text-3xl font-bold text-white mb-4 drop-shadow-lg">
            Welcome to WeatherNow
          </h2>
          <p className="text-white/90 text-lg drop-shadow-sm">
            Search for a city or use your current location to get started
          </p>
        </div>
      </div>
    </div>
  )
}
