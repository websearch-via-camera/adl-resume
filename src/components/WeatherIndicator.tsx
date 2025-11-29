import { useState, useEffect, useRef } from "react"
import { Sun, Moon, Cloud, CloudRain, CloudSnow, CloudSun, CloudMoon, MapPin, CaretDown, Crosshair, Warning } from "@phosphor-icons/react"
import { toast } from "sonner"

interface WeatherData {
  temp: number
  condition: string
  icon: string
  location: string
}

interface CityOption {
  name: string
  lat: number
  lon: number
  label: string
}

const CITIES: CityOption[] = [
  { name: "Boston", lat: 42.3601, lon: -71.0589, label: "Boston, MA" },
  { name: "Austin", lat: 30.2672, lon: -97.7431, label: "Austin, TX" },
  { name: "San Francisco", lat: 37.7749, lon: -122.4194, label: "San Francisco, CA" },
  { name: "New York", lat: 40.7128, lon: -74.0060, label: "New York, NY" },
]

export function WeatherIndicator() {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [selectedCity, setSelectedCity] = useState<CityOption>(CITIES[0])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isUsingUserLocation, setIsUsingUserLocation] = useState(false)
  const [userCoords, setUserCoords] = useState<{ lat: number; lon: number; name: string } | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const parseWeatherCode = (weatherCode: number, isDay: boolean) => {
    let condition = "Clear"
    let icon = isDay ? "sun" : "moon"
    
    if (weatherCode === 0) {
      condition = "Clear"
      icon = isDay ? "sun" : "moon"
    } else if (weatherCode <= 3) {
      condition = "Partly Cloudy"
      icon = isDay ? "cloud-sun" : "cloud-moon"
    } else if (weatherCode <= 48) {
      condition = "Cloudy"
      icon = "cloud"
    } else if (weatherCode <= 67 || (weatherCode >= 80 && weatherCode <= 82)) {
      condition = "Rainy"
      icon = "rain"
    } else if (weatherCode <= 77 || weatherCode >= 85) {
      condition = "Snowy"
      icon = "snow"
    } else if (weatherCode >= 95) {
      condition = "Stormy"
      icon = "rain"
    }
    
    return { condition, icon }
  }

  const fetchWeatherForCoords = async (lat: number, lon: number, location: string): Promise<WeatherData | null> => {
    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,is_day&temperature_unit=fahrenheit&timezone=auto`
      )
      
      if (!response.ok) throw new Error("Weather fetch failed")
      
      const data = await response.json()
      const current = data.current
      const { condition, icon } = parseWeatherCode(current.weather_code, current.is_day === 1)
      
      return {
        temp: Math.round(current.temperature_2m),
        condition,
        icon,
        location
      }
    } catch (error) {
      console.error("Weather fetch error:", error)
      return null
    }
  }

  const handleUserLocation = async () => {
    if (!("geolocation" in navigator)) {
      toast.error("Geolocation is not supported by your browser")
      return
    }

    // Check if we're on HTTPS (required for geolocation in most browsers)
    const isSecureContext = window.isSecureContext
    if (!isSecureContext) {
      toast.error("Location requires a secure connection (HTTPS)", {
        description: "Please select a city from the list instead."
      })
      return
    }

    setIsOpen(false)
    setIsLoading(true)

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        
        // Reverse geocode to get city name
        let cityName = "Your Location"
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`,
            { headers: { 'User-Agent': 'KiarashAdlPortfolio/1.0' } }
          )
          if (response.ok) {
            const data = await response.json()
            cityName = data.address?.city || data.address?.town || data.address?.county || "Your Location"
          }
        } catch {
          // Keep default name
        }

        setUserCoords({ lat: latitude, lon: longitude, name: cityName })
        setIsUsingUserLocation(true)
        
        const weatherData = await fetchWeatherForCoords(latitude, longitude, cityName)
        setWeather(weatherData)
        setIsLoading(false)
        toast.success(`Weather updated for ${cityName}`)
      },
      (error) => {
        console.error("Geolocation error:", error)
        setIsLoading(false)
        
        // Provide helpful error messages based on error code
        let message = "Unable to get your location"
        let description = "Please select a city from the list."
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = "Location access denied"
            description = "You can still select a city from the list."
            break
          case error.POSITION_UNAVAILABLE:
            message = "Location unavailable"
            description = "Your device couldn't determine your location."
            break
          case error.TIMEOUT:
            message = "Location request timed out"
            description = "Please try again or select a city."
            break
        }
        
        toast.error(message, { description })
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 600000 }
    )
  }

  const handleCitySelect = async (city: CityOption) => {
    setSelectedCity(city)
    setIsUsingUserLocation(false)
    setUserCoords(null)
    setIsOpen(false)
    setIsLoading(true)
    
    const weatherData = await fetchWeatherForCoords(city.lat, city.lon, city.name)
    setWeather(weatherData || {
      temp: 50,
      condition: "Clear",
      icon: "sun",
      location: city.name
    })
    setIsLoading(false)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Initial fetch
  useEffect(() => {
    const fetchInitialWeather = async () => {
      const weatherData = await fetchWeatherForCoords(selectedCity.lat, selectedCity.lon, selectedCity.name)
      setWeather(weatherData || {
        temp: 45,
        condition: "Clear",
        icon: "sun",
        location: selectedCity.name
      })
      setIsLoading(false)
    }

    fetchInitialWeather()
    
    // Refresh every 30 minutes
    const interval = setInterval(() => {
      if (isUsingUserLocation && userCoords) {
        fetchWeatherForCoords(userCoords.lat, userCoords.lon, userCoords.name).then(setWeather)
      } else {
        fetchWeatherForCoords(selectedCity.lat, selectedCity.lon, selectedCity.name).then(setWeather)
      }
    }, 30 * 60 * 1000)
    
    return () => clearInterval(interval)
  }, [])

  const getWeatherIcon = (icon: string, size = 14) => {
    const iconProps = { size, weight: "fill" as const }
    
    switch (icon) {
      case "sun":
        return <Sun {...iconProps} className="text-amber-500" />
      case "moon":
        return <Moon {...iconProps} className="text-slate-400" />
      case "cloud-sun":
        return <CloudSun {...iconProps} className="text-amber-400" />
      case "cloud-moon":
        return <CloudMoon {...iconProps} className="text-slate-400" />
      case "cloud":
        return <Cloud {...iconProps} className="text-slate-400" />
      case "rain":
        return <CloudRain {...iconProps} className="text-blue-400" />
      case "snow":
        return <CloudSnow {...iconProps} className="text-sky-300" />
      default:
        return <Sun {...iconProps} className="text-amber-500" />
    }
  }

  if (isLoading && !weather) {
    return (
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground animate-pulse">
        <div className="w-3 h-3 rounded-full bg-muted"></div>
        <span>Loading...</span>
      </div>
    )
  }

  if (!weather) return null

  const currentLocationName = isUsingUserLocation ? userCoords?.name : selectedCity.name

  return (
    <div className="relative z-50" ref={dropdownRef}>
      <button
        onClick={(e) => {
          e.stopPropagation()
          setIsOpen(!isOpen)
        }}
        className="flex items-center gap-1.5 text-xs text-muted-foreground opacity-70 hover:opacity-100 transition-opacity cursor-pointer group pointer-events-auto"
        title={`${currentLocationName}: ${weather.condition}, ${weather.temp}°F – Click to change location`}
      >
        {isLoading ? (
          <div className="w-3 h-3 rounded-full bg-muted animate-pulse"></div>
        ) : (
          getWeatherIcon(weather.icon)
        )}
        <span>{weather.temp}°F</span>
        <span className="hidden sm:inline text-muted-foreground/60 flex items-center gap-0.5">
          {isUsingUserLocation && <MapPin size={10} weight="fill" className="text-primary" />}
          {currentLocationName}
        </span>
        <CaretDown size={10} className="text-muted-foreground/40 group-hover:text-muted-foreground transition-colors" />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 py-1 bg-popover border border-border rounded-lg shadow-lg z-[100] min-w-[160px] animate-in fade-in slide-in-from-top-1 duration-150 pointer-events-auto">
          {/* City options */}
          {CITIES.map((city) => (
            <button
              key={city.name}
              onClick={(e) => {
                e.stopPropagation()
                handleCitySelect(city)
              }}
              className={`w-full px-3 py-1.5 text-left text-xs hover:bg-muted transition-colors flex items-center gap-2 cursor-pointer ${
                !isUsingUserLocation && selectedCity.name === city.name
                  ? "text-primary font-medium"
                  : "text-foreground"
              }`}
            >
              <span className="w-4">{!isUsingUserLocation && selectedCity.name === city.name && "✓"}</span>
              {city.label}
            </button>
          ))}
          
          {/* Divider */}
          <div className="my-1 border-t border-border"></div>
          
          {/* User location option */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleUserLocation()
            }}
            className={`w-full px-3 py-1.5 text-left text-xs hover:bg-muted transition-colors flex items-center gap-2 cursor-pointer ${
              isUsingUserLocation ? "text-primary font-medium" : "text-foreground"
            }`}
          >
            <Crosshair size={12} weight="bold" className={isUsingUserLocation ? "text-primary" : "text-muted-foreground"} />
            <span>Use my location</span>
          </button>
        </div>
      )}
    </div>
  )
}
