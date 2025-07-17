"use client";
import { useEffect } from "react";
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

export default function Page() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      import("@farcaster/miniapp-sdk").then(({ sdk }) => {
        sdk.actions.ready();
      });
    }
  }, []);

  // Static data for demonstration
  const sampleLocation = {
    name: "San Francisco",
    country: "USA",
    weather: {
      temperature: 68,
      feelsLike: 67,
      description: "Partly Cloudy",
      humidity: 60,
      windSpeed: 10,
      pressure: 1012,
    },
    seasonalInfo: {
      season: "spring",
      plants: ["Cherry Blossoms", "Tulips"],
      animals: ["Robins", "Butterflies"],
    },
    lastUpdated: new Date().toLocaleString(),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 relative overflow-hidden">
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
                  <Sunrise className="h-5 w-5" />
                  <span>Good Morning</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-light text-gray-900">08:00</div>
              <div className="text-sm text-gray-600 font-light">Monday, Apr 8</div>
            </div>
          </div>
        </header>

        <Tabs defaultValue="dashboard" className="w-full">
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
                    placeholder="Search for a city"
                    value=""
                    onChange={() => {}}
                    className="pl-12 h-12 border-0 bg-white/80 rounded-2xl shadow-sm focus:ring-2 focus:ring-emerald-400 focus:ring-offset-0 font-light text-lg"
                  />
                </div>
                <Button className="h-12 w-12 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 border-0 rounded-2xl shadow-lg transition-all duration-200 hover:shadow-xl p-0">
                  <Plus className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Weather Cards - Apple Weather Style */}
            <div className="space-y-4">
              <Card className="border-0 rounded-3xl overflow-hidden shadow-xl bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 h-80">
                <CardContent className="p-0 h-full">
                  <div className="p-6 h-full flex flex-col">
                    {/* Header with location and remove button */}
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-2xl font-light text-white mb-1">{sampleLocation.name}</h3>
                        <p className="text-white/80 text-sm font-light">{sampleLocation.country}</p>
                      </div>
                      <Button variant="ghost" size="sm" className="text-white/60 hover:text-white hover:bg-white/20 rounded-full h-8 w-8 p-0">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Main Temperature Display */}
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <div className="text-7xl font-ultralight text-white mb-2 leading-none">{sampleLocation.weather.temperature}°</div>
                        <div className="text-white/90 text-xl font-light capitalize">{sampleLocation.weather.description}</div>
                        <div className="text-white/70 text-sm font-light mt-1">Feels like {sampleLocation.weather.feelsLike}°</div>
                      </div>
                      <div className="text-right">
                        <Cloud className="h-20 w-20 text-white drop-shadow-lg" />
                      </div>
                    </div>

                    {/* Weather Details Grid */}
                    <div className="grid grid-cols-4 gap-3 mb-6">
                      <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-3 text-center">
                        <Droplets className="h-4 w-4 text-white/80 mx-auto mb-1" />
                        <div className="text-white text-sm font-light">{sampleLocation.weather.humidity}%</div>
                        <div className="text-white/60 text-xs">Humidity</div>
                      </div>
                      <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-3 text-center">
                        <Wind className="h-4 w-4 text-white/80 mx-auto mb-1" />
                        <div className="text-white text-sm font-light">{sampleLocation.weather.windSpeed}</div>
                        <div className="text-white/60 text-xs">mph</div>
                      </div>
                      <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-3 text-center">
                        <Gauge className="h-4 w-4 text-white/80 mx-auto mb-1" />
                        <div className="text-white text-sm font-light">{sampleLocation.weather.pressure}</div>
                        <div className="text-white/60 text-xs">hPa</div>
                      </div>
                      <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-3 text-center">
                        <Eye className="h-4 w-4 text-white/80 mx-auto mb-1" />
                        <div className="text-white text-sm font-light">10</div>
                        <div className="text-white/60 text-xs">km</div>
                      </div>
                    </div>

                    {/* Nature Section */}
                    <div className="mt-auto">
                      <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Leaf className="h-4 w-4 text-white/90" />
                          <span className="text-white/90 font-medium text-sm capitalize">{sampleLocation.seasonalInfo.season} Nature</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Flower className="h-3 w-3 text-white/80" />
                              <span className="text-white/80 text-xs">Blooming</span>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {sampleLocation.seasonalInfo.plants.map((plant) => (
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
                              {sampleLocation.seasonalInfo.animals.map((animal) => (
                                <Badge key={animal} className="bg-white/20 text-white border-0 rounded-full text-xs font-light hover:bg-white/30 transition-colors px-2 py-0">{animal}</Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                        {/* Last updated */}
                        <div className="flex justify-between items-center mt-3 pt-3 border-t border-white/20">
                          <span className="text-white/60 text-xs">Updated 08:00</span>
                          <Button variant="ghost" size="sm" className="text-white/80 hover:text-white hover:bg-white/20 text-xs rounded-full px-3 py-1 h-auto">Refresh</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
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

