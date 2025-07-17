import { openai } from "@ai-sdk/openai"
import { streamText, tool } from "ai"
import { z } from "zod"

export const maxDuration = 30

export async function POST(req: Request) {
  const { messages } = await req.json()

  const result = streamText({
    model: openai("gpt-4o"),
    system: `You are a nature-focused weather assistant. When discussing weather, always include relevant information about:
    - How the weather affects local plants and wildlife
    - Seasonal changes and what to expect in nature
    - Best outdoor activities for the current conditions
    - Environmental impacts and natural phenomena
    - Tips for connecting with nature in different weather conditions
    
    Use a warm, knowledgeable tone as if you're a nature guide who deeply understands both weather patterns and the natural world.`,
    messages,
    tools: {
      weather: tool({
        description: "Get the current weather in a location with nature-focused insights",
        parameters: z.object({
          location: z
            .string()
            .describe('The city and country/state to get weather for (e.g., "London, UK" or "New York, NY")'),
        }),
        execute: async ({ location }) => {
          try {
            const apiKey = process.env.OPENWEATHER_API_KEY
            if (!apiKey) {
              throw new Error("OpenWeather API key not configured")
            }

            // Get coordinates for the location
            const geoResponse = await fetch(
              `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(location)}&limit=1&appid=${apiKey}`,
            )

            if (!geoResponse.ok) {
              throw new Error("Failed to fetch location data")
            }

            const geoData = await geoResponse.json()

            if (geoData.length === 0) {
              return {
                location,
                error: "Location not found. Please try a different city name.",
              }
            }

            const { lat, lon, name, country } = geoData[0]

            // Get weather data
            const weatherResponse = await fetch(
              `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`,
            )

            if (!weatherResponse.ok) {
              throw new Error("Failed to fetch weather data")
            }

            const weatherData = await weatherResponse.json()

            // Add nature context based on weather and season
            const month = new Date().getMonth() + 1
            const season =
              month >= 3 && month <= 5
                ? "spring"
                : month >= 6 && month <= 8
                  ? "summer"
                  : month >= 9 && month <= 11
                    ? "fall"
                    : "winter"

            const natureContext = {
              season,
              weatherImpact: weatherData.weather[0].description,
              temperature: Math.round(weatherData.main.temp),
              suggestions: {
                plants:
                  season === "spring"
                    ? ["Cherry blossoms blooming", "Tulips emerging"]
                    : season === "summer"
                      ? ["Sunflowers in full bloom", "Wildflowers abundant"]
                      : season === "fall"
                        ? ["Leaves changing colors", "Harvest season"]
                        : ["Evergreens prominent", "Winter dormancy"],
                wildlife:
                  season === "spring"
                    ? ["Birds returning from migration", "Butterflies active"]
                    : season === "summer"
                      ? ["Hummingbirds feeding", "Fireflies at dusk"]
                      : season === "fall"
                        ? ["Animals preparing for winter", "Migration patterns"]
                        : ["Winter birds at feeders", "Tracks in snow"],
                activities:
                  weatherData.main.temp > 70
                    ? ["Nature walks", "Outdoor photography"]
                    : weatherData.main.temp > 40
                      ? ["Hiking with layers", "Bird watching"]
                      : ["Winter nature observation", "Indoor plant care"],
              },
            }

            return {
              location: `${name}, ${country}`,
              temperature: Math.round(weatherData.main.temp),
              feelsLike: Math.round(weatherData.main.feels_like),
              humidity: weatherData.main.humidity,
              description: weatherData.weather[0].description,
              windSpeed: Math.round(weatherData.wind.speed),
              pressure: weatherData.main.pressure,
              natureContext,
            }
          } catch (error) {
            console.error("Weather API error:", error)
            return {
              location,
              error: "Unable to fetch weather data. Please try again later.",
            }
          }
        },
      }),
      getSeasonalNatureInfo: tool({
        description:
          "Get detailed information about plants, animals, and activities for a specific season and location",
        parameters: z.object({
          location: z.string().describe("The location to get seasonal nature information for"),
          season: z.enum(["spring", "summer", "fall", "winter"]).describe("The season to get information for"),
        }),
        execute: async ({ location, season }) => {
          const seasonalData = {
            spring: {
              plants: ["Cherry Blossoms", "Tulips", "Daffodils", "Lilacs", "Dogwood", "Azaleas"],
              animals: ["Robins", "Butterflies", "Bees", "Deer", "Rabbits", "Songbirds"],
              activities: ["Hiking", "Gardening", "Picnics", "Bird Watching", "Nature Photography", "Flower Festivals"],
              phenomena: ["Tree budding", "Longer daylight", "Animal mating seasons", "Spring migration"],
            },
            summer: {
              plants: ["Sunflowers", "Roses", "Lavender", "Wildflowers", "Corn", "Tomatoes"],
              animals: ["Hummingbirds", "Dragonflies", "Fireflies", "Squirrels", "Cicadas", "Butterflies"],
              activities: ["Swimming", "Camping", "Beach visits", "Stargazing", "Outdoor concerts", "Farmers markets"],
              phenomena: ["Peak growing season", "Longest days", "Thunderstorms", "Drought patterns"],
            },
            fall: {
              plants: ["Maple Trees", "Pumpkins", "Chrysanthemums", "Oak Trees", "Apple Trees", "Gourds"],
              animals: ["Migrating Birds", "Squirrels", "Deer", "Foxes", "Bears preparing for winter", "Geese"],
              activities: ["Apple Picking", "Hiking", "Photography", "Leaf Peeping", "Harvest festivals", "Camping"],
              phenomena: ["Leaf color change", "Animal preparation for winter", "Harvest time", "Shorter days"],
            },
            winter: {
              plants: ["Evergreens", "Holly", "Poinsettias", "Pine Trees", "Winter berries", "Bare deciduous trees"],
              animals: ["Cardinals", "Owls", "Foxes", "Rabbits", "Winter birds", "Hibernating animals"],
              activities: [
                "Skiing",
                "Ice Skating",
                "Hot Cocoa",
                "Cozy Reading",
                "Winter photography",
                "Indoor gardening",
              ],
              phenomena: ["Snow and ice formation", "Animal hibernation", "Shortest days", "Winter storms"],
            },
          }

          return {
            location,
            season,
            ...seasonalData[season],
            tips: `In ${season}, nature in ${location} offers unique opportunities to observe seasonal changes and connect with the natural world.`,
          }
        },
      }),
      getWeatherForecast: tool({
        description: "Get a 5-day weather forecast with nature insights",
        parameters: z.object({
          location: z.string().describe("The city and country/state to get forecast for"),
        }),
        execute: async ({ location }) => {
          try {
            const apiKey = process.env.OPENWEATHER_API_KEY
            if (!apiKey) {
              throw new Error("OpenWeather API key not configured")
            }

            // Get coordinates for the location
            const geoResponse = await fetch(
              `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(location)}&limit=1&appid=${apiKey}`,
            )

            const geoData = await geoResponse.json()

            if (geoData.length === 0) {
              return {
                location,
                error: "Location not found for forecast.",
              }
            }

            const { lat, lon, name, country } = geoData[0]

            // Get 5-day forecast
            const forecastResponse = await fetch(
              `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`,
            )

            const forecastData = await forecastResponse.json()

            // Process forecast data (get daily forecasts)
            const dailyForecasts = []
            const processedDates = new Set()

            for (const item of forecastData.list) {
              const date = new Date(item.dt * 1000).toDateString()

              if (!processedDates.has(date) && dailyForecasts.length < 5) {
                dailyForecasts.push({
                  date,
                  temperature: Math.round(item.main.temp),
                  description: item.weather[0].description,
                  humidity: item.main.humidity,
                  natureNote:
                    item.main.temp > 70
                      ? "Great for outdoor nature activities"
                      : item.main.temp > 40
                        ? "Good for hiking with proper clothing"
                        : "Perfect for observing winter nature patterns",
                })
                processedDates.add(date)
              }
            }

            return {
              location: `${name}, ${country}`,
              forecast: dailyForecasts,
              natureAdvice:
                "Use this forecast to plan your nature activities and observe how weather patterns affect local wildlife and plants.",
            }
          } catch (error) {
            console.error("Forecast API error:", error)
            return {
              location,
              error: "Unable to fetch forecast data.",
            }
          }
        },
      }),
      convertFahrenheitToCelsius: tool({
        description: "Convert a temperature in fahrenheit to celsius",
        parameters: z.object({
          temperature: z.number().describe("The temperature in fahrenheit to convert"),
        }),
        execute: async ({ temperature }) => {
          const celsius = Math.round((temperature - 32) * (5 / 9))
          return {
            fahrenheit: temperature,
            celsius,
          }
        },
      }),
    },
  })

  return result.toDataStreamResponse()
}
