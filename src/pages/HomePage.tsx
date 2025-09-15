import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Cloud, TrendingUp, MapPin, MessageSquare, Leaf, Droplets, Sun } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-agriculture.jpg";
import FloatingIcons from "@/components/animations/FloatingIcons";

const HomePage = () => {
  const features = [
    {
      title: "Live Weather",
      description: "Real-time weather data and forecasts for your crops",
      icon: Cloud,
      color: "bg-gradient-sky",
      link: "/weather"
    },
    {
      title: "Crop Prices",
      description: "Current market prices and trends for agricultural products",
      icon: TrendingUp,
      color: "bg-gradient-primary",
      link: "/prices"
    },
    {
      title: "Soil Data",
      description: "Monitor soil health, moisture, and nutrient levels",
      icon: MapPin,
      color: "bg-gradient-earth",
      link: "/soil"
    },
    {
      title: "Expert Help",
      description: "Get answers to your agricultural questions from experts",
      icon: MessageSquare,
      color: "bg-gradient-primary",
      link: "/escalation"
    },
  ];

  const stats = [
    { icon: Leaf, value: "1M+", label: "Farmers Helped" },
    { icon: Droplets, value: "500K+", label: "Crops Monitored" },
    { icon: Sun, value: "24/7", label: "Weather Updates" },
  ];

  return (
    <div className="min-h-screen relative">
      <FloatingIcons />
      
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-hero opacity-80" />
        
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4 animate-slide-up">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
            DIGITAL KRISHI
            <span className="block text-3xl md:text-5xl mt-2 text-accent-foreground">
              for Modern Farmers
            </span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-2xl mx-auto">
            Access real-time weather data, crop prices, soil information, and expert guidance all in one place
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/weather">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg transition-spring hover:scale-105">
                Get Started
              </Button>
            </Link>
            <Link to="/escalation">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary px-8 py-6 text-lg transition-spring hover:scale-105">
                Ask Expert
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background relative z-10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-slide-up">
            <h2 className="text-4xl font-bold mb-4 text-foreground">
              Everything You Need for Smart Farming
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Comprehensive tools and data to help you make informed decisions about your crops
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Link key={feature.title} to={feature.link}>
                  <Card className={`${feature.color} border-0 text-white hover:scale-105 transition-spring cursor-pointer h-full animate-slide-up`} 
                        style={{ animationDelay: `${index * 0.1}s` }}>
                    <CardHeader>
                      <Icon size={48} className="mb-4 animate-float" />
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-white/90">
                        {feature.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="animate-slide-up" style={{ animationDelay: `${index * 0.2}s` }}>
                  <Icon size={48} className="mx-auto mb-4 text-primary animate-pulse-glow" />
                  <div className="text-3xl font-bold text-foreground mb-2">{stat.value}</div>
                  <div className="text-muted-foreground">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;