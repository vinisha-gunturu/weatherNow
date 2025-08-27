import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Location {
  id: string
  name: string
  latitude: number
  longitude: number
  country: string
}

interface SettingsStore {
  temperatureUnit: 'celsius' | 'fahrenheit'
  theme: 'light' | 'dark' | 'auto'
  useGeolocation: boolean
  setTemperatureUnit: (unit: 'celsius' | 'fahrenheit') => void
  setTheme: (theme: 'light' | 'dark' | 'auto') => void
  setUseGeolocation: (use: boolean) => void
}

interface FavouritesStore {
  favourites: Location[]
  addFavourite: (location: Location) => void
  removeFavourite: (id: string) => void
  isFavourite: (id: string) => boolean
}

interface WeatherStore {
  currentLocation: Location | null
  weatherData: any
  isLoading: boolean
  error: string | null
  setCurrentLocation: (location: Location | null) => void
  setWeatherData: (data: any) => void
  setIsLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      temperatureUnit: 'celsius',
      theme: 'auto',
      useGeolocation: true,
      setTemperatureUnit: (unit) => set({ temperatureUnit: unit }),
      setTheme: (theme) => set({ theme }),
      setUseGeolocation: (use) => set({ useGeolocation: use }),
    }),
    {
      name: 'weather-settings',
    }
  )
)

export const useFavouritesStore = create<FavouritesStore>()(
  persist(
    (set, get) => ({
      favourites: [],
      addFavourite: (location) => 
        set((state) => ({
          favourites: [...state.favourites, location]
        })),
      removeFavourite: (id) =>
        set((state) => ({
          favourites: state.favourites.filter((fav) => fav.id !== id)
        })),
      isFavourite: (id) => 
        get().favourites.some((fav) => fav.id === id),
    }),
    {
      name: 'weather-favourites',
    }
  )
)

export const useWeatherStore = create<WeatherStore>((set) => ({
  currentLocation: null,
  weatherData: null,
  isLoading: false,
  error: null,
  setCurrentLocation: (location) => set({ currentLocation: location }),
  setWeatherData: (data) => set({ weatherData: data }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
}))
