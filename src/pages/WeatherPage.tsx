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
  Thermometer, 
  Eye, 
  MapPin,
  Search
} from "lucide-react";
import { toast } from "sonner";

const WeatherPage = () => {
  const [location, setLocation] = useState("New York");
  const [loading, setLoading] = useState(false);
  
  // Mock weather data
  const [weatherData, setWeatherData] = useState({
    location: "New York, NY",
    temperature: 24,
    condition: "Partly Cloudy",
    humidity: 65,
    windSpeed: 12,
    visibility: 10,
    uvIndex: 6,
    forecast: [
      { day: "Today", temp: "24°C", condition: "Partly Cloudy", icon: Cloud },
      { day: "Tomorrow", temp: "26°C", condition: "Sunny", icon: Sun },
      { day: "Wednesday", temp: "22°C", condition: "Rainy", icon: Droplets },
      { day: "Thursday", temp: "25°C", condition: "Sunny", icon: Sun },
      { day: "Friday", temp: "23°C", condition: "Cloudy", icon: Cloud },
    ]
  });

  const handleLocationSearch = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setWeatherData(prev => ({ ...prev, location: location }));
      toast.success(`Weather data updated for ${location}`);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-sky relative">
      <FloatingIcons />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="animate-slide-up">
          <h1 className="text-4xl font-bold text-center mb-8 text-white">
            Live Weather Information
          </h1>
          
          {/* Location Search */}
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
                <Button onClick={handleLocationSearch} disabled={loading} className="bg-primary hover:bg-primary/90">
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Current Weather */}
          <Card className="mb-8 shadow-floating bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl text-center">{weatherData.location}</CardTitle>
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

          {/* Weather Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <DataCard
              title="Humidity"
              value={weatherData.humidity}
              unit="%"
              icon={Droplets}
              variant="weather"
              description="Good for crops"
            />
            <DataCard
              title="Wind Speed"
              value={weatherData.windSpeed}
              unit="km/h"
              icon={Wind}
              variant="weather"
              description="Light breeze"
            />
            <DataCard
              title="Visibility"
              value={weatherData.visibility}
              unit="km"
              icon={Eye}
              variant="weather"
              description="Clear visibility"
            />
            <DataCard
              title="UV Index"
              value={weatherData.uvIndex}
              icon={Sun}
              variant="weather"
              description="Moderate exposure"
            />
          </div>

          {/* 5-Day Forecast */}
          <Card className="shadow-floating bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>5-Day Forecast</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {weatherData.forecast.map((day, index) => {
                  const Icon = day.icon;
                  return (
                    <div key={day.day} className="text-center p-4 rounded-lg bg-muted/50 hover:bg-muted transition-smooth animate-slide-up"
                         style={{ animationDelay: `${index * 0.1}s` }}>
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
        </div>
      </div>
    </div>
  );
};

export default WeatherPage;