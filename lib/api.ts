export interface WeatherData {
  current: {
    time: string
    temperature_2m: number
    relative_humidity_2m: number
    apparent_temperature: number
    is_day: number
    weather_code: number
    wind_speed_10m: number
    wind_direction_10m: number
  }
  hourly: {
    time: string[]
    temperature_2m: number[]
    relative_humidity_2m: number[]
    weather_code: number[]
    wind_speed_10m: number[]
    precipitation_probability: number[]
  }
  daily: {
    time: string[]
    weather_code: number[]
    temperature_2m_max: number[]
    temperature_2m_min: number[]
    precipitation_probability_max: number[]
    wind_speed_10m_max: number[]
    sunrise: string[]
    sunset: string[]
  }
}

export interface GeocodingResult {
  id: number
  name: string
  latitude: number
  longitude: number
  country: string
  admin1?: string
  admin2?: string
}

export class WeatherAPI {
  private static readonly BASE_URL = 'https://api.open-meteo.com/v1'
  private static readonly GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1'

  static async getWeatherData(latitude: number, longitude: number): Promise<WeatherData> {
    const params = new URLSearchParams({
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      current: [
        'temperature_2m',
        'relative_humidity_2m',
        'apparent_temperature',
        'is_day',
        'weather_code',
        'wind_speed_10m',
        'wind_direction_10m'
      ].join(','),
      hourly: [
        'temperature_2m',
        'relative_humidity_2m',
        'weather_code',
        'wind_speed_10m',
        'precipitation_probability'
      ].join(','),
      daily: [
        'weather_code',
        'temperature_2m_max',
        'temperature_2m_min',
        'precipitation_probability_max',
        'wind_speed_10m_max',
        'sunrise',
        'sunset'
      ].join(','),
      timezone: 'auto',
      forecast_days: '7'
    })

    const response = await fetch(`${this.BASE_URL}/forecast?${params}`)
    
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`)
    }

    return response.json()
  }

  static async searchLocations(query: string): Promise<GeocodingResult[]> {
    if (query.length < 2) return []

    const params = new URLSearchParams({
      name: query,
      count: '10',
      language: 'en',
      format: 'json'
    })

    const response = await fetch(`${this.GEOCODING_URL}/search?${params}`)
    
    if (!response.ok) {
      throw new Error(`Geocoding API error: ${response.status}`)
    }

    const data = await response.json()
    return data.results || []
  }

  static async getCurrentLocation(): Promise<{ latitude: number; longitude: number }> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'))
        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          })
        },
        (error) => {
          reject(new Error(`Geolocation error: ${error.message}`))
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      )
    })
  }
}
