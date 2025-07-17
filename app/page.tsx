"use client";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Cloud,
  Sun,
  CloudRain,
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
  Gauge,
} from "lucide-react";

interface SavedLocation {
  id: string;
  name: string;
  country: string;
  weather: {
    temperature: number;
    feelsLike: number;
    description: string;
    humidity: number;
    windSpeed: number;
    pressure: number;
  };
  seasonalInfo: {
    season: string;
    plants: string[];
    animals: string[];
  };
  lastUpdated: string;
}

export default function Page() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [newLocation, setNewLocation] = useState("");
  const [savedLocations, setSavedLocations] = useState<SavedLocation[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [farcasterUser, setFarcasterUser] = useState<any>(null);
  const [donationStatus, setDonationStatus] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      import("@farcaster/miniapp-sdk").then(({ sdk }) => {
        sdk.actions.ready();
      });
    }
  }, []);

  // Farcaster user detection
  useEffect(() => {
    (async () => {
      try {
        const { sdk } = await import("@farcaster/miniapp-sdk");
        // Try to get user info - this may not be available in all contexts
        const user = await (sdk as any).user?.getCurrentUser?.();
        setFarcasterUser(user);
      } catch (e) {
        console.log("Not connected to Farcaster or user not found");
        setFarcasterUser(null);
      }
    })();
  }, []);

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Load saved locations from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("weatherLocations");
    if (saved) {
      try {
        setSavedLocations(JSON.parse(saved));
      } catch (error) {
        console.error("Error loading saved locations:", error);
      }
    }
  }, []);

  // Save locations to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("weatherLocations", JSON.stringify(savedLocations));
  }, [savedLocations]);

  // Add to Farcaster handler
  const handleAddToFarcaster = async () => {
    try {
      const { sdk } = await import("@farcaster/miniapp-sdk");
      await (sdk as any).actions?.addToHomeScreen?.();
    } catch (e) {
      console.error("Failed to add to Farcaster:", e);
    }
  };

  // USDC donation handler
  const handleDonateUSDC = async () => {
    setDonationStatus("Processing...");
    try {
      const { sdk } = await import("@farcaster/miniapp-sdk");
      await (sdk as any).wallet?.sendToken?.({
        to: "0xE09470dEFf0Be080Bd6591c124706b6D3419b44f",
        amount: "1",
        token: "USDC"
      });
      setDonationStatus("Thank you for your donation!");
    } catch (e) {
      console.error("Donation failed:", e);
      setDonationStatus("Donation failed. Please try again.");
    }
  };

  // Sample data for new locations
  const getSampleWeatherData = (locationName: string) => {
    const samples = {
      "san francisco": {
        temperature: 68,
        feelsLike: 67,
        description: "Partly Cloudy",
        humidity: 60,
        windSpeed: 10,
        pressure: 1012,
        seasonalInfo: {
          season: "spring",
          plants: ["Cherry Blossoms", "Tulips"],
          animals: ["Robins", "Butterflies"],
        },
      },
      "new york": {
        temperature: 72,
        feelsLike: 74,
        description: "Sunny",
        humidity: 45,
        windSpeed: 8,
        pressure: 1015,
        seasonalInfo: {
          season: "spring",
          plants: ["Daffodils", "Magnolias"],
          animals: ["Pigeons", "Sparrows"],
        },
      },
      "london": {
        temperature: 55,
        feelsLike: 52,
        description: "Light Rain",
        humidity: 80,
        windSpeed: 15,
        pressure: 1008,
        seasonalInfo: {
          season: "spring",
          plants: ["Bluebells", "Primroses"],
          animals: ["Robins", "Blackbirds"],
        },
      },
    };

    const key = locationName.toLowerCase();
    return samples[key as keyof typeof samples] || {
      temperature: 70,
      feelsLike: 69,
      description: "Clear",
      humidity: 50,
      windSpeed: 5,
      pressure: 1013,
      seasonalInfo: {
        season: "spring",
        plants: ["Wildflowers", "Grass"],
        animals: ["Birds", "Insects"],
      },
    };
  };

  const handleAddLocation = () => {
    if (!newLocation.trim()) return;

    const weatherData = getSampleWeatherData(newLocation);
    const newSavedLocation: SavedLocation = {
      id: Date.now().toString(),
      name: newLocation.split(",")[0].trim(),
      country: newLocation.split(",")[1]?.trim() || "Unknown",
      weather: weatherData,
      seasonalInfo: weatherData.seasonalInfo,
      lastUpdated: new Date().toLocaleString(),
    };

    setSavedLocations((prev) => [...prev, newSavedLocation]);
    setNewLocation("");
  };

  const handleRemoveLocation = (id: string) => {
    setSavedLocations((prev) => prev.filter((loc) => loc.id !== id));
  };

  const handleRefreshLocation = (id: string) => {
    setSavedLocations((prev) =>
      prev.map((loc) =>
        loc.id === id
          ? {
              ...loc,
              lastUpdated: new Date().toLocaleString(),
            }
          : loc
      )
    );
  };

  const getTimeOfDayGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 6) return { text: "Good Night", icon: <Moon className="h-5 w-5" /> };
    if (hour < 12) return { text: "Good Morning", icon: <Sunrise className="h-5 w-5" /> };
    if (hour < 18) return { text: "Good Afternoon", icon: <Sun className="h-5 w-5" /> };
    return { text: "Good Evening", icon: <Sunset className="h-5 w-5" /> };
  };

  const greeting = getTimeOfDayGreeting();

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 relative overflow-hidden">
      {/* Farcaster Features */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 items-end">
        {farcasterUser ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg text-emerald-900 text-sm mb-2 border border-white/20">
            Connected as FID: {farcasterUser.fid}
          </div>
        ) : (
          <div className="bg-white/80 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg text-gray-500 text-sm mb-2 border border-white/20">
            Not connected to Farcaster
          </div>
        )}
        <Button 
          onClick={handleAddToFarcaster} 
          className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg border-0"
        >
          Add to Farcaster
        </Button>
        <Button 
          onClick={handleDonateUSDC} 
          className="bg-yellow-500 hover:bg-yellow-600 text-white shadow-lg border-0"
        >
          Donate 1 USDC
        </Button>
        {donationStatus && (
          <div className="text-xs text-gray-700 mt-1 bg-white/80 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg border border-white/20">
            {donationStatus}
          </div>
        )}
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
            <TabsTrigger value="dashboard" className="flex items-center gap-2 rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all duration-200 font-medium">
              <MapPin className="h-4 w-4" />
              Locations
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center gap-2 rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all duration-200 font-medium">
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
                    placeholder="Search for a city (e.g., San Francisco, New York, London)"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleAddLocation()}
                    className="pl-12 h-12 border-0 bg-white/80 rounded-2xl shadow-sm focus:ring-2 focus:ring-emerald-400 focus:ring-offset-0 font-light text-lg"
                  />
                </div>
                <Button 
                  onClick={handleAddLocation}
                  className="h-12 w-12 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 border-0 rounded-2xl shadow-lg transition-all duration-200 hover:shadow-xl p-0"
                >
                  <Plus className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Weather Cards - Apple Weather Style */}
            <div className="space-y-4">
              {savedLocations.length === 0 ? (
                <div className="bg-white/60 backdrop-blur-xl border border-white/20 shadow-lg rounded-3xl p-12 text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <TreePine className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-light text-gray-700 mb-3">Welcome to Nature Weather</h3>
                  <p className="text-gray-500 font-light text-lg">
                    Add your first location to discover weather patterns and seasonal nature insights
                  </p>
                </div>
              ) : (
                savedLocations.map((location, index) => (
                  <Card key={location.id} className={`border-0 rounded-3xl overflow-hidden shadow-xl bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 ${index === 0 ? "h-80" : "h-64"}`}>
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
                            onClick={() => handleRemoveLocation(location.id)}
                            className="text-white/60 hover:text-white hover:bg-white/20 rounded-full h-8 w-8 p-0"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* Main Temperature Display */}
                        <div className="flex items-center justify-between mb-6">
                          <div>
                            <div className="text-7xl font-ultralight text-white mb-2 leading-none">{location.weather.temperature}°</div>
                            <div className="text-white/90 text-xl font-light capitalize">{location.weather.description}</div>
                            <div className="text-white/70 text-sm font-light mt-1">Feels like {location.weather.feelsLike}°</div>
                          </div>
                          <div className="text-right">
                            <Cloud className={`${index === 0 ? "h-20 w-20" : "h-16 w-16"} text-white drop-shadow-lg`} />
                          </div>
                        </div>

                        {/* Weather Details Grid - only show for first card */}
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
                              <span className="text-white/90 font-medium text-sm capitalize">{location.seasonalInfo.season} Nature</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <div className="flex items-center gap-2 mb-2">
                                  <Flower className="h-3 w-3 text-white/80" />
                                  <span className="text-white/80 text-xs">Blooming</span>
                                </div>
                                <div className="flex flex-wrap gap-1">
                                  {location.seasonalInfo.plants.map((plant) => (
                                    <Badge key={plant} className="bg-white/20 text-white border-0 rounded-full text-xs font-light hover:bg-white/30 transition-colors px-2 py-0">{plant}</Badge>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <div className="flex items-center gap-2 mb-2">
                                  <Bird className="h-3 w-3 text-white/80" />
                                  <span className="text-white/80 text-xs">Wildlife</span>
                                </div>
                                <div className="flex flex-wrap gap-1">
                                  {location.seasonalInfo.animals.map((animal) => (
                                    <Badge key={animal} className="bg-white/20 text-white border-0 rounded-full text-xs font-light hover:bg-white/30 transition-colors px-2 py-0">{animal}</Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                            {/* Last updated */}
                            <div className="flex justify-between items-center mt-3 pt-3 border-t border-white/20">
                              <span className="text-white/60 text-xs">
                                Updated {new Date(location.lastUpdated).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                              </span>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleRefreshLocation(location.id)}
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
                ))
              )}
            </div>
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
                    <p className="text-white/80 text-sm font-light">Ask about weather patterns, seasonal changes, and nature insights</p>
                  </div>
                </div>
              </div>
              <div className="p-6 h-[300px] flex flex-col items-center justify-center text-gray-500 font-light">
                <p>Chat feature coming soon...</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

