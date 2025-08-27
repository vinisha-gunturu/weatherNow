# WeatherNow 🌤️

A modern, production-quality weather web application built with Next.js 14+ and featuring beautiful animations, PWA support, and an intuitive user experience.

## ✨ Features

### 🌡️ Core Weather Features
- **Real-time Weather Data**: Current weather conditions powered by Open-Meteo API
- **24-Hour Forecast**: Detailed hourly weather predictions
- **7-Day Forecast**: Extended weekly weather outlook
- **Location Search**: Search for any city worldwide with autocomplete
- **Geolocation Support**: Automatic location detection with user permission
- **Weather Charts**: Interactive temperature and precipitation visualizations using Recharts

### 🎨 User Experience
- **Modern UI**: Clean, responsive design with Tailwind CSS and shadcn/ui components
- **Smooth Animations**: Micro-interactions and page transitions with Framer Motion
- **Dynamic Theming**: Weather-driven background themes that adapt to current conditions
- **Accessibility**: Full ARIA support, keyboard navigation, and screen reader compatibility
- **Reduced Motion Support**: Respects user's motion preferences

### 📱 Progressive Web App (PWA)
- **Offline Support**: Service worker caching for offline functionality
- **Installable**: Can be installed as a native app on mobile and desktop
- **Fast Loading**: Optimized performance with efficient caching strategies

### 💾 Data Management
- **Favourites**: Save and manage your favorite locations
- **Settings**: Customize app behavior (geolocation, units, animations)
- **Smart Caching**: Efficient data caching with React Query
- **State Management**: Zustand for lightweight, performant state management

## 🛠️ Technology Stack

### Frontend Framework
- **Next.js 14+** - React framework with App Router
- **React 18** - Latest React with concurrent features
- **TypeScript** - Type-safe development

### Styling & UI
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality, accessible React components
- **Framer Motion** - Production-ready motion library
- **Lucide React** - Beautiful, customizable icons

### Data & State Management
- **React Query (@tanstack/react-query)** - Data fetching and caching
- **Zustand** - Lightweight state management
- **Open-Meteo API** - Free weather API service

### Charts & Visualization
- **Recharts** - Composable charting library for React

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript** - Static type checking

### PWA & Performance
- **next-pwa** - PWA plugin for Next.js
- **Service Worker** - Offline caching and background sync

## 📋 Prerequisites

Before running this project, make sure you have:

- **Node.js** (version 18.0 or higher)
- **npm**, **yarn**, or **pnpm** package manager
- Modern web browser with JavaScript enabled

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd weather-now
```

### 2. Install Dependencies

Using npm:
```bash
npm install
```

Using yarn:
```bash
yarn install
```

Using pnpm:
```bash
pnpm install
```

### 3. Start Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

### 4. Open in Browser

Visit [http://localhost:3000](http://localhost:3000) to view the application.

## 📖 Usage Guide

### Basic Usage

1. **Search for a Location**: Use the search bar to find any city worldwide
2. **Use Current Location**: Click the location pin icon to use your current location (requires permission)
3. **View Weather Data**: See current conditions, hourly forecasts, and 7-day predictions
4. **Add to Favourites**: Click the heart icon to save locations for quick access

### Navigation

- **Home** (`/`): Main weather dashboard
- **Favourites** (`/favourites`): Manage your saved locations
- **Settings** (`/settings`): Customize app preferences

### Keyboard Navigation

- Use **Tab** to navigate between interactive elements
- Use **Enter** or **Space** to activate buttons
- Use **Arrow keys** to navigate through forecast items

## 📁 Project Structure

```
weather-now/
├── app/                          # Next.js App Router pages
│   ├── favourites/              # Favourites page
│   ├── settings/                # Settings page
│   ├── layout.tsx               # Root layout with providers
│   ├── page.tsx                 # Home page
│   └── providers.tsx            # React Query and other providers
├── components/                   # Reusable React components
│   ├── ui/                      # shadcn/ui base components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── input.tsx
│   ├── DailyForecastCard.tsx    # 7-day forecast component
│   ├── HourlyForecast.tsx       # 24-hour forecast component
│   ├── PrecipitationChart.tsx   # Precipitation visualization
│   ├── SearchBar.tsx            # Location search component
│   ├── TemperatureChart.tsx     # Temperature trend chart
│   └── WeatherNowCard.tsx       # Current weather display
├── lib/                         # Utilities and core logic
│   ├── api.ts                   # Weather API integration
│   ├── stores.ts                # Zustand state management
│   └── utils.ts                 # Helper functions
├── public/                      # Static assets
│   ├── manifest.json            # PWA manifest
│   └── sw.js                    # Service worker
├── styles/                      # Global styles
│   └── globals.css              # Tailwind CSS and custom styles
├── next.config.js               # Next.js configuration
├── tailwind.config.js           # Tailwind CSS configuration
└── package.json                 # Dependencies and scripts
```

## 🔧 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build production bundle |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix ESLint errors automatically |

## 🌐 API Integration

This project uses the **Open-Meteo API** for weather data:

- **Weather Data**: Current conditions and forecasts
- **Geocoding**: Location search and coordinates
- **Free Tier**: No API key required
- **Rate Limits**: Reasonable limits for personal use

API endpoints used:
- `https://api.open-meteo.com/v1/forecast` - Weather data
- `https://geocoding-api.open-meteo.com/v1/search` - Location search

## 🎯 Performance Optimizations

- **Code Splitting**: Automatic route-based code splitting
- **Image Optimization**: Next.js automatic image optimization
- **Caching Strategy**: Smart caching with React Query
- **Bundle Analysis**: Optimized bundle size
- **Tree Shaking**: Unused code elimination
- **Service Worker**: Efficient offline caching

## 📱 PWA Features

The app includes full Progressive Web App support:

- **Installable**: Add to home screen on mobile/desktop
- **Offline Mode**: Cached weather data when offline
- **Background Sync**: Updates when connection is restored
- **App-like Experience**: Native app feel and performance

## ♿ Accessibility

WeatherNow is built with accessibility in mind:

- **ARIA Labels**: Comprehensive screen reader support
- **Keyboard Navigation**: Full keyboard accessibility
- **Focus Management**: Proper focus indicators and flow
- **Color Contrast**: WCAG AA compliant color schemes
- **Reduced Motion**: Respects `prefers-reduced-motion` setting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style and conventions
- Write meaningful commit messages
- Add appropriate TypeScript types
- Test your changes thoroughly
- Ensure accessibility standards are maintained

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Open-Meteo](https://open-meteo.com/) for providing free weather API
- [shadcn/ui](https://ui.shadcn.com/) for beautiful UI components
- [Lucide](https://lucide.dev/) for the icon library
- [Framer Motion](https://www.framer.com/motion/) for smooth animations
- [Recharts](https://recharts.org/) for data visualization

---

**Built with ❤️ using modern web technologies**

