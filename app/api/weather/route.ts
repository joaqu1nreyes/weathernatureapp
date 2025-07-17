import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { location } = await request.json()

    const apiKey = process.env.OPENWEATHER_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: "OpenWeather API key not configured" }, { status: 500 })
    }

    // Get coordinates for the location
    const geoResponse = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(location)}&limit=1&appid=${apiKey}`,
    )

    if (!geoResponse.ok) {
      return NextResponse.json({ error: "Failed to fetch location data" }, { status: 500 })
    }

    const geoData = await geoResponse.json()

    if (geoData.length === 0) {
      return NextResponse.json({ error: "Location not found. Please try a different city name." }, { status: 404 })
    }

    const { lat, lon, name, country } = geoData[0]

    // Get weather data
    const weatherResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`,
    )

    if (!weatherResponse.ok) {
      return NextResponse.json({ error: "Failed to fetch weather data" }, { status: 500 })
    }

    const weatherData = await weatherResponse.json()

    return NextResponse.json({
      location: `${name}, ${country}`,
      temperature: Math.round(weatherData.main.temp),
      feelsLike: Math.round(weatherData.main.feels_like),
      humidity: weatherData.main.humidity,
      description: weatherData.weather[0].description,
      windSpeed: Math.round(weatherData.wind.speed),
      pressure: weatherData.main.pressure,
    })
  } catch (error) {
    console.error("Weather API error:", error)
    return NextResponse.json({ error: "Unable to fetch weather data. Please try again later." }, { status: 500 })
  }
}
