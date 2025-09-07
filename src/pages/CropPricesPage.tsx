import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DataCard from "@/components/ui/data-card";
import FloatingIcons from "@/components/animations/FloatingIcons";
import { TrendingUp, TrendingDown, Wheat, Apple, Grape, Sprout, DollarSign } from "lucide-react";
import { toast } from "sonner";

const CropPricesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const cropData = [
    {
      name: "Wheat",
      price: 285.50,
      change: +12.30,
      changePercent: +4.5,
      icon: Wheat,
      unit: "$/ton",
      trend: "up" as const,
      volume: "15,000 tons",
      high: 290.00,
      low: 275.00
    },
    {
      name: "Corn",
      price: 195.25,
      change: -5.75,
      changePercent: -2.9,
      icon: Sprout,
      unit: "$/ton", 
      trend: "down" as const,
      volume: "22,000 tons",
      high: 201.00,
      low: 189.50
    },
    {
      name: "Apples",
      price: 1450.00,
      change: +25.50,
      changePercent: +1.8,
      icon: Apple,
      unit: "$/ton",
      trend: "up" as const,
      volume: "8,500 tons",
      high: 1465.00,
      low: 1420.00
    },
    {
      name: "Grapes",
      price: 2200.00,
      change: +45.00,
      changePercent: +2.1,
      icon: Grape,
      unit: "$/ton",
      trend: "up" as const,
      volume: "5,200 tons",
      high: 2220.00,
      low: 2180.00
    }
  ];

  const categories = [
    { id: "all", name: "All Crops" },
    { id: "grains", name: "Grains" },
    { id: "fruits", name: "Fruits" },
    { id: "vegetables", name: "Vegetables" }
  ];

  const handleRefresh = () => {
    toast.success("Price data refreshed successfully!");
  };

  return (
    <div className="min-h-screen bg-gradient-primary relative">
      <FloatingIcons />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="animate-slide-up">
          <h1 className="text-4xl font-bold text-center mb-8 text-white">
            Live Crop Prices
          </h1>

          {/* Market Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <DataCard
              title="Market Status"
              value="OPEN"
              icon={DollarSign}
              variant="price"
              description="Trading active"
            />
            <DataCard
              title="Total Volume"
              value="50.7K"
              unit="tons"
              icon={TrendingUp}
              variant="price"
              description="+8.2% from yesterday"
            />
            <DataCard
              title="Average Change"
              value="+1.9"
              unit="%"
              icon={TrendingUp}
              variant="price"
              description="Across all commodities"
            />
          </div>

          {/* Category Filter */}
          <Card className="mb-8 shadow-floating bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Filter by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    onClick={() => setSelectedCategory(category.id)}
                    className="transition-smooth"
                  >
                    {category.name}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  onClick={handleRefresh}
                  className="ml-auto transition-smooth hover:scale-105"
                >
                  Refresh Prices
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Price Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {cropData.map((crop, index) => {
              const Icon = crop.icon;
              const TrendIcon = crop.trend === "up" ? TrendingUp : TrendingDown;
              
              return (
                <Card key={crop.name} className="shadow-floating bg-white/90 backdrop-blur-sm hover:scale-105 transition-spring animate-slide-up"
                      style={{ animationDelay: `${index * 0.1}s` }}>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Icon size={32} className="text-primary animate-pulse-glow" />
                      <div>
                        <CardTitle className="text-xl">{crop.name}</CardTitle>
                        <div className="text-sm text-muted-foreground">Volume: {crop.volume}</div>
                      </div>
                    </div>
                    <TrendIcon 
                      size={24} 
                      className={crop.trend === "up" ? "text-green-600" : "text-red-600"} 
                    />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-foreground">
                          ${crop.price.toFixed(2)}
                          <span className="text-sm text-muted-foreground ml-1">/ton</span>
                        </div>
                        <div className={`text-sm font-medium ${
                          crop.trend === "up" ? "text-green-600" : "text-red-600"
                        }`}>
                          {crop.change > 0 ? "+" : ""}{crop.change.toFixed(2)} ({crop.changePercent > 0 ? "+" : ""}{crop.changePercent}%)
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-muted-foreground">Daily High</div>
                          <div className="font-medium">${crop.high.toFixed(2)}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Daily Low</div>
                          <div className="font-medium">${crop.low.toFixed(2)}</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CropPricesPage;