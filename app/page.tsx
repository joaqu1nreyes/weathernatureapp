"use client";
import { useEffect } from "react";

// --- BEGIN: Original code commented out for debugging ---
/*
import { useState, useEffect } from "react"
import { useChat } from "ai/react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Cloud,
  Sun,
  CloudRain,
  CloudSnowIcon as Snow,
  Wind,
  Droplets,
  Eye,
  Plus,
  X,
  MessageCircle,
  MapPin,
  Leaf,
  TreePine,
  Flower,
  Bird,
  Sunrise,
  Sunset,
  Moon,
  CloudDrizzle,
  Gauge,
} from "lucide-react"
import { sdk } from "@farcaster/miniapp-sdk"

// Call sdk.actions.ready() in the main page component
useEffect(() => {
  async function readyFarcaster() {
    if (typeof window !== "undefined") {
      const { sdk } = await import("@farcaster/miniapp-sdk");
      sdk.actions.ready();
    }
  }
  readyFarcaster();
}, []);

interface SavedLocation {
  id: string
  name: string
  country: string
  weather: {
    temperature: number
    feelsLike: number
    description: string
    humidity: number
    windSpeed: number
    pressure: number
    icon: string
  }
  seasonalInfo: {
    season: string
    plants: string[]
    animals: string[]
    activities: string[]
  }
  lastUpdated: string
}

export default function NatureWeatherApp() {
  const [savedLocations, setSavedLocations] = useState<SavedLocation[]>([])
  const [newLocation, setNewLocation] = useState("")
  const [isAddingLocation, setIsAddingLocation] = useState(false)
  const [activeTab, setActiveTab] = useState("dashboard")
  const [currentTime, setCurrentTime] = useState(new Date())
  const [farcasterUser, setFarcasterUser] = useState<any>(null)
  const [donationStatus, setDonationStatus] = useState<string>("")

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    maxSteps: 5,
  })

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  // Load saved locations from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("weatherLocations")
    if (saved) {
      setSavedLocations(JSON.parse(saved))
    }
  }, [])

  // Save locations to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("weatherLocations", JSON.stringify(savedLocations))
  }, [savedLocations])

  // Farcaster user detection
  useEffect(() => {
    (async () => {
      try {
        const user = await sdk.user.getCurrentUser()
        setFarcasterUser(user)
      } catch (e) {
        setFarcasterUser(null)
      }
    })()
  }, [])

  // Add to Farcaster handler
  const handleAddToFarcaster = () => {
    sdk.actions.addToHomeScreen()
  }

  // USDC donation handler
  const handleDonateUSDC = async () => {
    setDonationStatus("Processing...")
    try {
      await sdk.wallet.sendToken({
        to: "0xE09470dEFf0Be080Bd6591c124706b6D3419b44f",
        amount: "1",
        token: "USDC"
      })
      setDonationStatus("Thank you for your donation!")
    } catch (e) {
      setDonationStatus("Donation failed. Please try again.")
    }
  }

  const getWeatherGradient = (description: string, temp: number) => {
    const desc = description.toLowerCase()
    const hour = currentTime.getHours()
    const isNight = hour < 6 || hour > 20

    if (desc.includes("rain") || desc.includes("drizzle")) {
      return isNight ? "from-slate-900 via-blue-900 to-indigo-900" : "from-blue-400 via-blue-500 to-blue-600"
    }
    if (desc.includes("snow")) {
      return isNight ? "from-indigo-900 via-blue-900 to-slate-900" : "from-blue-100 via-blue-200 to-slate-300"
    }
    if (desc.includes("cloud")) {
      return isNight ? "from-slate-800 via-gray-800 to-slate-700" : "from-gray-300 via-gray-400 to-slate-500"
    }
    if (temp > 80) {
      return isNight ? "from-orange-800 via-red-800 to-pink-800" : "from-orange-300 via-red-400 to-pink-400"
    }
    if (temp < 40) {
      return isNight ? "from-blue-900 via-indigo-900 to-purple-900" : "from-blue-200 via-indigo-300 to-purple-300"
    }

    // Default pleasant weather - nature inspired
    return isNight ? "from-emerald-900 via-teal-900 to-cyan-900" : "from-emerald-300 via-teal-400 to-cyan-400"
  }

  const getWeatherIcon = (description: string, size = "h-8 w-8") => {
    const desc = description.toLowerCase()
    const hour = currentTime.getHours()
    const isNight = hour < 6 || hour > 20

    if (desc.includes("rain")) return <CloudRain className={`${size} text-white drop-shadow-lg`} />
    if (desc.includes("drizzle")) return <CloudDrizzle className={`${size} text-white drop-shadow-lg`} />
    if (desc.includes("snow")) return <Snow className={`${size} text-white drop-shadow-lg`} />
    if (desc.includes("cloud")) return <Cloud className={`${size} text-white drop-shadow-lg`} />
    if (isNight) return <Moon className={`${size} text-white drop-shadow-lg`} />
    return <Sun className={`${size} text-white drop-shadow-lg`} />
  }

  const getSeasonalInfo = (location: string, month: number) => {
    const seasons = {
      spring: {
        plants: ["Cherry Blossoms", "Tulips", "Daffodils", "Lilacs"],
        animals: ["Robins", "Butterflies", "Bees", "Deer"],
        activities: ["Hiking", "Gardening", "Picnics", "Bird Watching"],
      },
      summer: {
        plants: ["Sunflowers", "Roses", "Lavender", "Wildflowers"],
        animals: ["Hummingbirds", "Dragonflies", "Fireflies", "Squirrels"],
        activities: ["Swimming", "Camping", "Beach visits", "Stargazing"],
      },
      fall: {
        plants: ["Maple Trees", "Pumpkins", "Chrysanthemums", "Oak Trees"],
        animals: ["Migrating Birds", "Squirrels", "Deer", "Foxes"],
        activities: ["Apple Picking", "Hiking", "Photography", "Leaf Peeping"],
      },
      winter: {
        plants: ["Evergreens", "Holly", "Poinsettias", "Pine Trees"],
        animals: ["Cardinals", "Owls", "Foxes", "Rabbits"],
        activities: ["Skiing", "Ice Skating", "Hot Cocoa", "Cozy Reading"],
      },
    }

    const season =
      month >= 3 && month <= 5
        ? "spring"
        : month >= 6 && month <= 8
          ? "summer"
          : month >= 9 && month <= 11
            ? "fall"
            : "winter"

    return { season, ...seasons[season] }
  }

  const addLocation = async () => {
    if (!newLocation.trim()) return

    setIsAddingLocation(true)
    try {
      const response = await fetch("/api/weather", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ location: newLocation }),
      })

      const data = await response.json()

      if (data.error) {
        alert(data.error)
        return
      }

      const currentMonth = new Date().getMonth() + 1
      const seasonalInfo = getSeasonalInfo(newLocation, currentMonth)

      const newSavedLocation: SavedLocation = {
        id: Date.now().toString(),
        name: data.location.split(",")[0],
        country: data.location.split(",")[1]?.trim() || "",
        weather: {
          temperature: data.temperature,
          feelsLike: data.feelsLike,
          description: data.description,
          humidity: data.humidity,
          windSpeed: data.windSpeed,
          pressure: data.pressure,
          icon: data.description,
        },
        seasonalInfo,
        lastUpdated: new Date().toLocaleString(),
      }

      setSavedLocations((prev) => [...prev, newSavedLocation])
      setNewLocation("")
    } catch (error) {
      console.error("Error adding location:", error)
      alert("Failed to add location")
    } finally {
      setIsAddingLocation(false)
    }
  }

  const removeLocation = (id: string) => {
    setSavedLocations((prev) => prev.filter((loc) => loc.id !== id))
  }

  const refreshLocation = async (location: SavedLocation) => {
    try {
      const response = await fetch("/api/weather", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ location: `${location.name}, ${location.country}` }),
      })

      const data = await response.json()

      if (!data.error) {
        setSavedLocations((prev) =>
          prev.map((loc) =>
            loc.id === location.id
              ? {
                  ...loc,
                  weather: {
                    temperature: data.temperature,
                    feelsLike: data.feelsLike,
                    description: data.description,
                    humidity: data.humidity,
                    windSpeed: data.windSpeed,
                    pressure: data.pressure,
                    icon: data.description,
                  },
                  lastUpdated: new Date().toLocaleString(),
                }
              : loc,
          ),
        )
      }
    } catch (error) {
      console.error("Error refreshing location:", error)
    }
  }

  const getTimeOfDayGreeting = () => {
    const hour = currentTime.getHours()
    if (hour < 6) return { text: "Good Night", icon: <Moon className="h-5 w-5" /> }
    if (hour < 12) return { text: "Good Morning", icon: <Sunrise className="h-5 w-5" /> }
    if (hour < 18) return { text: "Good Afternoon", icon: <Sun className="h-5 w-5" /> }
    return { text: "Good Evening", icon: <Sunset className="h-5 w-5" /> }
  }

  const greeting = getTimeOfDayGreeting()

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 relative overflow-hidden">
      {/* Farcaster Features */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 items-end">
        {farcasterUser ? (
          <div className="bg-white/80 rounded-xl px-4 py-2 shadow text-emerald-900 text-sm mb-2">
            Connected as FID: {farcasterUser.fid}
          </div>
        ) : (
          <div className="bg-white/80 rounded-xl px-4 py-2 shadow text-gray-500 text-sm mb-2">
            Not connected to Farcaster
          </div>
        )}
        <Button onClick={handleAddToFarcaster} className="bg-emerald-600 hover:bg-emerald-700 text-white">
          Add to Farcaster
        </Button>
        <Button onClick={handleDonateUSDC} className="bg-yellow-500 hover:bg-yellow-600 text-white">
          Donate 1 USDC
        </Button>
        {donationStatus && <div className="text-xs text-gray-700 mt-1">{donationStatus}</div>}
      </div>
      {/* Subtle nature-inspired background pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-10 left-10 w-32 h-32 bg-emerald-200 rounded-full blur-3xl"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-teal-200 rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-cyan-200 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 right-10 w-28 h-28 bg-emerald-300 rounded-full blur-2xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-6 max-w-6xl">
        {/* Apple-style Header */}
        <header className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg">
                <TreePine className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-light text-gray-900 tracking-tight">Weather</h1>
                <div className="flex items-center gap-2 text-emerald-600 font-medium text-sm">
                  {greeting.icon}
                  <span>{greeting.text}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-light text-gray-900">
                {currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </div>
              <div className="text-sm text-gray-600 font-light">
                {currentTime.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
              </div>
            </div>
          </div>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8 bg-white/60 backdrop-blur-xl border border-white/20 shadow-lg rounded-2xl p-1 h-12">
            <TabsTrigger
              value="dashboard"
              className="flex items-center gap-2 rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all duration-200 font-medium"
            >
              <MapPin className="h-4 w-4" />
              Locations
            </TabsTrigger>
            <TabsTrigger
              value="chat"
              className="flex items-center gap-2 rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all duration-200 font-medium"
            >
              <MessageCircle className="h-4 w-4" />
              Nature Guide
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Add Location - Apple style */}
            <div className="bg-white/60 backdrop-blur-xl border border-white/20 shadow-lg rounded-3xl p-6">
              <div className="flex gap-4 items-center">
                <div className="relative flex-1">
                  <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-emerald-500" />
                  <Input
                    placeholder="Search for a city"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addLocation()}
                    className="pl-12 h-12 border-0 bg-white/80 rounded-2xl shadow-sm focus:ring-2 focus:ring-emerald-400 focus:ring-offset-0 font-light text-lg"
                  />
                </div>
                <Button
                  onClick={addLocation}
                  disabled={isAddingLocation}
                  className="h-12 w-12 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 border-0 rounded-2xl shadow-lg transition-all duration-200 hover:shadow-xl p-0"
                >
                  <Plus className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Weather Cards - Apple Weather Style */}
            <div className="space-y-4">
              {savedLocations.map((location, index) => (
                <Card
                  key={location.id}
                  className={`border-0 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-br ${getWeatherGradient(location.weather.description, location.weather.temperature)} ${
                    index === 0 ? "h-80" : "h-64"
                  }`}
                >
                  <CardContent className="p-0 h-full">
                    <div className="p-6 h-full flex flex-col">
                      {/* Header with location and remove button */}
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-2xl font-light text-white mb-1">{location.name}</h3>
                          <p className="text-white/80 text-sm font-light">{location.country}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeLocation(location.id)}
                          className="text-white/60 hover:text-white hover:bg-white/20 rounded-full h-8 w-8 p-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Main Temperature Display */}
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <div className="text-7xl font-ultralight text-white mb-2 leading-none">
                            {location.weather.temperature}°
                          </div>
                          <div className="text-white/90 text-xl font-light capitalize">
                            {location.weather.description}
                          </div>
                          <div className="text-white/70 text-sm font-light mt-1">
                            Feels like {location.weather.feelsLike}°
                          </div>
                        </div>
                        <div className="text-right">
                          {getWeatherIcon(location.weather.description, index === 0 ? "h-20 w-20" : "h-16 w-16")}
                        </div>
                      </div>

                      {/* Weather Details Grid */}
                      {index === 0 && (
                        <div className="grid grid-cols-4 gap-3 mb-6">
                          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-3 text-center">
                            <Droplets className="h-4 w-4 text-white/80 mx-auto mb-1" />
                            <div className="text-white text-sm font-light">{location.weather.humidity}%</div>
                            <div className="text-white/60 text-xs">Humidity</div>
                          </div>
                          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-3 text-center">
                            <Wind className="h-4 w-4 text-white/80 mx-auto mb-1" />
                            <div className="text-white text-sm font-light">{location.weather.windSpeed}</div>
                            <div className="text-white/60 text-xs">mph</div>
                          </div>
                          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-3 text-center">
                            <Gauge className="h-4 w-4 text-white/80 mx-auto mb-1" />
                            <div className="text-white text-sm font-light">{location.weather.pressure}</div>
                            <div className="text-white/60 text-xs">hPa</div>
                          </div>
                          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-3 text-center">
                            <Eye className="h-4 w-4 text-white/80 mx-auto mb-1" />
                            <div className="text-white text-sm font-light">10</div>
                            <div className="text-white/60 text-xs">km</div>
                          </div>
                        </div>
                      )}

                      {/* Nature Section */}
                      <div className="mt-auto">
                        <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-4">
                          <div className="flex items-center gap-2 mb-3">
                            <Leaf className="h-4 w-4 text-white/90" />
                            <span className="text-white/90 font-medium text-sm capitalize">
                              {location.seasonalInfo.season} Nature
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <Flower className="h-3 w-3 text-white/80" />
                                <span className="text-white/80 text-xs">Blooming</span>
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {location.seasonalInfo.plants.slice(0, 2).map((plant) => (
                                  <Badge
                                    key={plant}
                                    className="bg-white/20 text-white border-0 rounded-full text-xs font-light hover:bg-white/30 transition-colors px-2 py-0"
                                  >
                                    {plant}
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <Bird className="h-3 w-3 text-white/80" />
                                <span className="text-white/80 text-xs">Wildlife</span>
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {location.seasonalInfo.animals.slice(0, 2).map((animal) => (
                                  <Badge
                                    key={animal}
                                    className="bg-white/20 text-white border-0 rounded-full text-xs font-light hover:bg-white/30 transition-colors px-2 py-0"
                                  >
                                    {animal}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Last updated */}
                          <div className="flex justify-between items-center mt-3 pt-3 border-t border-white/20">
                            <span className="text-white/60 text-xs">
                              Updated{" "}
                              {new Date(location.lastUpdated).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => refreshLocation(location)}
                              className="text-white/80 hover:text-white hover:bg-white/20 text-xs rounded-full px-3 py-1 h-auto"
                            >
                              Refresh
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {savedLocations.length === 0 && (
              <div className="bg-white/60 backdrop-blur-xl border border-white/20 shadow-lg rounded-3xl p-12 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <TreePine className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-light text-gray-700 mb-3">Welcome to Nature Weather</h3>
                <p className="text-gray-500 font-light text-lg">
                  Add your first location to discover weather patterns and seasonal nature insights
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="chat" className="space-y-6">
            <div className="bg-white/60 backdrop-blur-xl border border-white/20 shadow-lg rounded-3xl overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-xl">
                    <MessageCircle className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-light text-white">Nature Guide</h2>
                    <p className="text-white/80 text-sm font-light">
                      Ask about weather patterns, seasonal changes, and nature insights
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 h-[500px] flex flex-col">
                <div className="flex-1 overflow-auto mb-4 space-y-4">
                  {messages.map((message) => (
                    <div key={message.id} className="flex flex-col space-y-2">
                      <div
                        className={`p-4 rounded-3xl max-w-[80%] ${
                          message.role === "user"
                            ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white ml-auto shadow-lg"
                            : "bg-white/80 backdrop-blur-sm mr-auto shadow-md border border-white/20"
                        }`}
                      >
                        <div className="font-medium text-sm mb-2 opacity-80">
                          {message.role === "user" ? "You" : "Nature Guide"}
                        </div>
                        <div className="whitespace-pre-wrap font-light">{message.content}</div>
                      </div>
                    </div>
                  ))}

                  {isLoading && (
                    <div className="bg-white/80 backdrop-blur-sm mr-auto max-w-[80%] p-4 rounded-3xl shadow-md border border-white/20">
                      <div className="font-medium text-sm mb-2 opacity-80">Nature Guide</div>
                      <div className="flex items-center space-x-3">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600 font-light">Consulting with nature...</span>
                      </div>
                    </div>
                  )}
                </div>

                <form onSubmit={handleSubmit} className="flex space-x-3">
                  <div className="relative flex-1">
                    <Leaf className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-emerald-500" />
                    <Input
                      className="pl-12 h-12 border-0 bg-white/80 rounded-2xl shadow-sm focus:ring-2 focus:ring-emerald-400 focus:ring-offset-0 font-light"
                      value={input}
                      placeholder="Ask about weather, seasons, or nature..."
                      onChange={handleInputChange}
                      disabled={isLoading}
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="h-12 px-6 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 border-0 rounded-2xl shadow-lg transition-all duration-200 hover:shadow-xl font-medium"
                  >
                    Ask
                  </Button>
                </form>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
*/
// --- END: Original code commented out for debugging ---

export default function Page() {
  useEffect(() => {
    console.log("Hello from useEffect");
  }, []);
  return <div>Hello from Farcaster Mini App!</div>;
}

