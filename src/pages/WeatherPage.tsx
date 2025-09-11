import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DataCard from "@/components/ui/data-card";
import FloatingIcons from "@/components/animations/FloatingIcons";
import {
  Cloud,
  Sun,
  Droplets,
  Wind,
  Eye,
  MapPin,
  Search,
} from "lucide-react";
import { toast } from "sonner";

const API_KEY = "R42pcChSst2JGmdQY94ng5ZV4aR8wLwV"; // 🔑 replace with your key
const DEFAULT_LOCATION = "Delhi"; // 🌍 default city

// 🔹 Map Tomorrow.io weather codes → readable text + icon
const getConditionAndIcon = (code: number) => {
  if ([1000].includes(code)) return { condition: "Clear", icon: Sun };
  if ([1001].includes(code)) return { condition: "Cloudy", icon: Cloud };
  if ([1100, 1101].includes(code)) return { condition: "Partly Cloudy", icon: Cloud };
  if ([1102].includes(code)) return { condition: "Mostly Cloudy", icon: Cloud };
  if ([4000, 4200].includes(code)) return { condition: "Light Rain", icon: Droplets };
  if ([4001, 4201].includes(code)) return { condition: "Rain", icon: Droplets };
  if ([5000, 5100].includes(code)) return { condition: "Snow", icon: Cloud };
  return { condition: "Unknown", icon: Cloud };
};

const WeatherPage = () => {
  const [location, setLocation] = useState(DEFAULT_LOCATION);
  const [loading, setLoading] = useState(false);
  const [weatherData, setWeatherData] = useState<any>(null);
  const [hourlyData, setHourlyData] = useState<any[]>([]);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  // 🔹 Fetch weather data (daily + hourly)
  const fetchWeather = async (loc: string) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.tomorrow.io/v4/weather/forecast?location=${loc}&apikey=${API_KEY}`
      );
      const data = await response.json();

      if (data?.timelines?.daily && data?.timelines?.hourly) {
        const today = data.timelines.daily[0].values;
        const todayCondition = getConditionAndIcon(
          data.timelines.daily[0].values.weatherCodeMax
        );

        setWeatherData({
          location: loc,
          temperature: Math.round(today.temperatureAvg),
          condition: todayCondition.condition,
          humidity: Math.round(today.humidityAvg),
          windSpeed: Math.round(today.windSpeedAvg),
          visibility: Math.round(today.visibilityAvg),
          uvIndex: today.uvIndexMax,
          forecast: data.timelines.daily.slice(0, 5).map((day: any, i: number) => {
            const mapped = getConditionAndIcon(day.values.weatherCodeMax);
            return {
              day: i === 0 ? "Today" : new Date(day.time).toLocaleDateString("en-US", { weekday: "long" }),
              date: day.time,
              temp: `${Math.round(day.values.temperatureAvg)}°C`,
              condition: mapped.condition,
              icon: mapped.icon,
            };
          }),
        });

        // Store all hourly data for reference
        setHourlyData(data.timelines.hourly);
        toast.success(`Weather updated for ${loc}`);
      } else {
        toast.error("No weather data found!");
      }
    } catch (err) {
      toast.error("Failed to fetch weather");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Auto fetch for default location on load
  useEffect(() => {
    fetchWeather(DEFAULT_LOCATION);
  }, []);

  // 🔹 Get hourly breakdown for selected day
  const getHourlyForDay = (date: string) => {
    return hourlyData.filter((h: any) => h.time.startsWith(date.split("T")[0]));
  };

  return (
    <div className="min-h-screen bg-gradient-sky relative">
      <FloatingIcons />
      <div className="relative z-10 container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-white">
          Live Weather Information
        </h1>

        {/* 🔎 Search Bar */}
        <Card className="mb-8 shadow-floating">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Weather Location
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                placeholder="Enter city name..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="flex-1"
              />
              <Button
                onClick={() => fetchWeather(location)}
                disabled={loading}
                className="bg-primary hover:bg-primary/90"
              >
                <Search className="h-4 w-4 mr-2" />
                {loading ? "Loading..." : "Search"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 🌡 Current Weather */}
        {weatherData && (
          <>
            <Card className="mb-8 shadow-floating bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl text-center">
                  {weatherData.location}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-6xl font-bold text-primary mb-2">
                  {weatherData.temperature}°C
                </div>
                <div className="text-xl text-muted-foreground mb-6">
                  {weatherData.condition}
                </div>
                <Cloud size={80} className="mx-auto text-primary animate-float" />
              </CardContent>
            </Card>

            {/* 📊 Weather Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <DataCard title="Humidity" value={weatherData.humidity} unit="%" icon={Droplets} variant="weather" description="Moisture in air" />
              <DataCard title="Wind Speed" value={weatherData.windSpeed} unit="km/h" icon={Wind} variant="weather" description="Wind conditions" />
              <DataCard title="Visibility" value={weatherData.visibility} unit="km" icon={Eye} variant="weather" description="Clarity of sky" />
              <DataCard title="UV Index" value={weatherData.uvIndex} icon={Sun} variant="weather" description="Sun exposure" />
            </div>

            {/* 📅 5-Day Forecast */}
            <Card className="shadow-floating bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>5-Day Forecast</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {weatherData.forecast.map((day: any, index: number) => {
                    const Icon = day.icon;
                    return (
                      <div
                        key={day.day}
                        className="text-center p-4 rounded-lg bg-muted/50 hover:bg-muted cursor-pointer transition-smooth animate-slide-up"
                        style={{ animationDelay: `${index * 0.1}s` }}
                        onClick={() => setSelectedDay(day.date)}
                      >
                        <div className="font-medium mb-2">{day.day}</div>
                        <Icon size={32} className="mx-auto mb-2 text-primary animate-float" />
                        <div className="text-lg font-bold">{day.temp}</div>
                        <div className="text-sm text-muted-foreground">{day.condition}</div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* ⏰ Hourly Forecast (on click) */}
            {selectedDay && (
              <Card className="mt-8 shadow-floating bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>
                    Hourly Forecast –{" "}
                    {new Date(selectedDay).toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "short",
                      day: "numeric",
                    })}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {getHourlyForDay(selectedDay).slice(0, 12).map((hour: any, i: number) => {
                      const mapped = getConditionAndIcon(hour.values.weatherCode);
                      const Icon = mapped.icon;
                      return (
                        <div key={i} className="text-center p-3 rounded-lg bg-muted/50">
                          <div className="font-medium">
                            {new Date(hour.time).toLocaleTimeString("en-US", { hour: "numeric" })}
                          </div>
                          <Icon size={28} className="mx-auto text-primary my-2" />
                          <div className="font-bold">{Math.round(hour.values.temperature)}°C</div>
                          <div className="text-xs text-muted-foreground">{mapped.condition}</div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default WeatherPage;
