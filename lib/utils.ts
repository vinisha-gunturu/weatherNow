import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTemperature(temp: number, unit: 'celsius' | 'fahrenheit' = 'celsius'): string {
  if (unit === 'fahrenheit') {
    return `${Math.round((temp * 9/5) + 32)}°F`
  }
  return `${Math.round(temp)}°C`
}

export function getWeatherTheme(weatherCode: number): string {
  // Based on WMO Weather interpretation codes
  if (weatherCode === 0) return 'sunny'
  if (weatherCode >= 1 && weatherCode <= 3) return 'cloudy'
  if (weatherCode >= 51 && weatherCode <= 67) return 'rainy'
  if (weatherCode >= 71 && weatherCode <= 86) return 'snowy'
  if (weatherCode >= 95 && weatherCode <= 99) return 'stormy'
  return 'cloudy'
}

export function getWeatherIcon(weatherCode: number): string {
  const theme = getWeatherTheme(weatherCode)
  const icons = {
    sunny: '☀️',
    cloudy: '☁️',
    rainy: '🌧️',
    snowy: '❄️',
    stormy: '⛈️'
  }
  return icons[theme as keyof typeof icons] || '☁️'
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}

export function formatTime(timestamp: string): string {
  return new Date(timestamp).toLocaleTimeString('en-US', {
    hour: 'numeric',
    hour12: true
  })
}

export function formatDate(timestamp: string): string {
  return new Date(timestamp).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  })
}
