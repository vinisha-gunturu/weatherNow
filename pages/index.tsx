import { useState, useEffect } from 'react'
import Head from 'next/head'

interface WeatherData {
  location: string
  temperature: number
  description: string
  humidity: number
  windSpeed: number
}

export default function Home() {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(false)
  const [city, setCity] = useState('')

  const mockWeatherData: WeatherData = {
    location: 'San Francisco, CA',
    temperature: 22,
    description: 'Partly cloudy',
    humidity: 65,
    windSpeed: 8
  }

  const handleGetWeather = () => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setWeather({ ...mockWeatherData, location: city || mockWeatherData.location })
      setLoading(false)
    }, 1000)
  }

  return (
    <div className="container">
      <Head>
        <title>WeatherNow - Current Weather</title>
        <meta name="description" content="Get current weather information" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="main">
        <h1 className="title">
          Weather<span className="accent">Now</span>
        </h1>

        <div className="search-container">
          <input
            type="text"
            placeholder="Enter city name..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="search-input"
          />
          <button 
            onClick={handleGetWeather}
            disabled={loading}
            className="search-button"
          >
            {loading ? 'Loading...' : 'Get Weather'}
          </button>
        </div>

        {weather && (
          <div className="weather-card">
            <h2 className="location">{weather.location}</h2>
            <div className="temperature">{weather.temperature}°C</div>
            <div className="description">{weather.description}</div>
            <div className="details">
              <div className="detail-item">
                <span className="label">Humidity:</span>
                <span className="value">{weather.humidity}%</span>
              </div>
              <div className="detail-item">
                <span className="label">Wind Speed:</span>
                <span className="value">{weather.windSpeed} km/h</span>
              </div>
            </div>
          </div>
        )}
      </main>

      <style jsx>{`
        .container {
          min-height: 100vh;
          padding: 0 0.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          background: linear-gradient(135deg, #74b9ff 0%, #0984e3 100%);
        }

        .main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          max-width: 600px;
          width: 100%;
        }

        .title {
          margin: 0 0 2rem;
          line-height: 1.15;
          font-size: 4rem;
          text-align: center;
          color: white;
          font-weight: 300;
          text-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .accent {
          color: #fdcb6e;
          font-weight: 600;
        }

        .search-container {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
          width: 100%;
          max-width: 400px;
        }

        .search-input {
          flex: 1;
          padding: 1rem;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .search-button {
          padding: 1rem 2rem;
          background: #fdcb6e;
          border: none;
          border-radius: 8px;
          color: white;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .search-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        }

        .search-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .weather-card {
          background: white;
          border-radius: 16px;
          padding: 2rem;
          box-shadow: 0 8px 32px rgba(0,0,0,0.1);
          text-align: center;
          width: 100%;
          max-width: 400px;
        }

        .location {
          margin: 0 0 1rem;
          color: #2d3436;
          font-size: 1.5rem;
          font-weight: 500;
        }

        .temperature {
          font-size: 4rem;
          font-weight: 300;
          color: #0984e3;
          margin: 1rem 0;
        }

        .description {
          color: #636e72;
          font-size: 1.2rem;
          margin-bottom: 2rem;
          text-transform: capitalize;
        }

        .details {
          display: flex;
          justify-content: space-between;
          gap: 1rem;
        }

        .detail-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }

        .label {
          color: #636e72;
          font-size: 0.9rem;
        }

        .value {
          color: #2d3436;
          font-weight: 600;
          font-size: 1.1rem;
        }

        @media (max-width: 600px) {
          .title {
            font-size: 2.5rem;
          }
          
          .search-container {
            flex-direction: column;
          }
          
          .details {
            flex-direction: column;
            gap: 1.5rem;
          }
        }
      `}</style>
    </div>
  )
}
