'use client'

import React from 'react'

export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 bg-blue-600 text-white px-4 py-2 rounded-md shadow-lg transition-all duration-200 focus:ring-2 focus:ring-blue-300 focus:outline-none"
      onFocus={(e) => {
        e.target.style.position = 'absolute'
        e.target.style.top = '1rem'
        e.target.style.left = '1rem'
        e.target.style.zIndex = '50'
      }}
      onBlur={(e) => {
        e.target.style.position = ''
        e.target.style.top = ''
        e.target.style.left = ''
        e.target.style.zIndex = ''
      }}
    >
      Skip to main content
    </a>
  )
}
