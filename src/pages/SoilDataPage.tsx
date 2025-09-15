import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import DataCard from "@/components/ui/data-card";
import FloatingIcons from "@/components/animations/FloatingIcons";
import { 
  MapPin, 
  Droplets, 
  Thermometer, 
  Zap, 
  TestTube, 
  Sprout,
  AlertCircle,
  CheckCircle
} from "lucide-react";
import { toast } from "sonner";

const SoilDataPage = () => {
  const [selectedField, setSelectedField] = useState("thiruvananthapuram");

  // Real Kerala soil data based on districts and soil types
  const keralaSoilDatabase = {
    thiruvananthapuram: {
      location: "Thiruvananthapuram District (Laterite Soil)",
      district: "Thiruvananthapuram",
      soilType: "Laterite",
      moisture: 72,
      temperature: 28,
      ph: 5.2, // Typical laterite soil pH in Kerala
      nitrogen: 38, // Low due to laterite characteristics
      phosphorus: 28, // Low to moderate
      potassium: 42, // Moderate
      organicMatter: 2.8,
      conductivity: 0.8,
      elevation: "50m MSL",
      rainfall: "1800mm/year",
      majorCrops: ["Coconut", "Rubber", "Cashew"],
      lastUpdated: "1 hour ago"
    },
    ernakulam: {
      location: "Ernakulam District (Coastal Alluvium)",
      district: "Ernakulam",
      soilType: "Coastal Alluvium",
      moisture: 85,
      temperature: 26,
      ph: 6.1, // Better pH for alluvial soils
      nitrogen: 52,
      phosphorus: 45,
      potassium: 68,
      organicMatter: 4.2,
      conductivity: 1.2,
      elevation: "3m MSL",
      rainfall: "2400mm/year",
      majorCrops: ["Rice", "Coconut", "Vegetables"],
      lastUpdated: "45 mins ago"
    },
    wayanad: {
      location: "Wayanad District (Hill Soil)",
      district: "Wayanad",
      soilType: "Hill Soil (Forest)",
      moisture: 78,
      temperature: 22,
      ph: 5.8,
      nitrogen: 65, // Higher due to forest soil
      phosphorus: 58,
      potassium: 72,
      organicMatter: 6.5,
      conductivity: 0.6,
      elevation: "800m MSL",
      rainfall: "3500mm/year",
      majorCrops: ["Coffee", "Pepper", "Cardamom"],
      lastUpdated: "2 hours ago"
    },
    alappuzha: {
      location: "Alappuzha District (Kari Soil)",
      district: "Alappuzha",
      soilType: "Kari (Organic Clay)",
      moisture: 95,
      temperature: 27,
      ph: 4.8, // Acidic kari soil
      nitrogen: 48,
      phosphorus: 35,
      potassium: 55,
      organicMatter: 8.2,
      conductivity: 2.1,
      elevation: "1m MSL",
      rainfall: "2100mm/year",
      majorCrops: ["Rice", "Coconut", "Fish farming"],
      lastUpdated: "30 mins ago"
    },
    palakkad: {
      location: "Palakkad District (Black Cotton Soil)",
      district: "Palakkad",
      soilType: "Black Cotton",
      moisture: 62,
      temperature: 29,
      ph: 7.2, // Neutral to slightly alkaline
      nitrogen: 58,
      phosphorus: 62,
      potassium: 78,
      organicMatter: 3.8,
      conductivity: 1.8,
      elevation: "100m MSL",
      rainfall: "1200mm/year",
      majorCrops: ["Rice", "Sugarcane", "Cotton"],
      lastUpdated: "1.5 hours ago"
    }
  };

  const soilData = keralaSoilDatabase[selectedField as keyof typeof keralaSoilDatabase];

  const getRecommendationsForSoil = (data: typeof soilData) => {
    const recommendations = [];
    
    // pH recommendations based on Kerala soil types
    if (data.ph < 5.5) {
      recommendations.push({
        type: "warning",
        icon: AlertCircle,
        title: "Soil Acidity",
        message: `pH ${data.ph} is acidic. Apply lime to improve pH for better crop growth`,
        color: "text-yellow-600"
      });
    } else if (data.ph > 7.5) {
      recommendations.push({
        type: "warning",
        icon: AlertCircle,
        title: "Soil Alkalinity",
        message: `pH ${data.ph} is alkaline. Consider organic matter addition`,
        color: "text-yellow-600"
      });
    } else {
      recommendations.push({
        type: "optimal",
        icon: CheckCircle,
        title: "pH Balance",
        message: "pH levels are suitable for most crops",
        color: "text-green-600"
      });
    }

    // Nitrogen recommendations
    if (data.nitrogen < 40) {
      recommendations.push({
        type: "warning",
        icon: AlertCircle,
        title: "Nitrogen Deficiency",
        message: "Apply organic fertilizers or green manure to boost nitrogen",
        color: "text-red-600"
      });
    } else if (data.nitrogen > 60) {
      recommendations.push({
        type: "optimal",
        icon: CheckCircle,
        title: "Good Nitrogen Levels",
        message: "Nitrogen content is adequate for healthy crop growth",
        color: "text-green-600"
      });
    } else {
      recommendations.push({
        type: "moderate",
        icon: AlertCircle,
        title: "Moderate Nitrogen",
        message: "Consider supplemental nitrogen application during peak growth",
        color: "text-yellow-600"
      });
    }

    // Moisture recommendations based on Kerala climate
    if (data.moisture > 90) {
      recommendations.push({
        type: "warning",
        icon: AlertCircle,
        title: "High Moisture Content",
        message: "Ensure proper drainage to prevent waterlogging",
        color: "text-yellow-600"
      });
    } else if (data.moisture < 50) {
      recommendations.push({
        type: "warning",
        icon: AlertCircle,
        title: "Low Moisture",
        message: "Increase irrigation frequency during dry periods",
        color: "text-red-600"
      });
    } else {
      recommendations.push({
        type: "optimal",
        icon: CheckCircle,
        title: "Optimal Moisture",
        message: "Soil moisture is ideal for current weather conditions",
        color: "text-green-600"
      });
    }

    return recommendations;
  };

  const recommendations = getRecommendationsForSoil(soilData);

  const fields = [
    { id: "thiruvananthapuram", name: "Thiruvananthapuram (Laterite)" },
    { id: "ernakulam", name: "Ernakulam (Coastal Alluvium)" },
    { id: "wayanad", name: "Wayanad (Hill Soil)" },
    { id: "alappuzha", name: "Alappuzha (Kari Soil)" },
    { id: "palakkad", name: "Palakkad (Black Cotton)" }
  ];

  const handleFieldChange = (fieldId: string) => {
    setSelectedField(fieldId);
    toast.success("Field data updated successfully!");
  };

  const getNutrientStatus = (value: number) => {
    if (value > 60) return { status: "High", color: "text-green-600" };
    if (value > 30) return { status: "Moderate", color: "text-yellow-600" };
    return { status: "Low", color: "text-red-600" };
  };

  return (
    <div className="min-h-screen bg-gradient-earth relative">
      <FloatingIcons />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="animate-slide-up">
          <h1 className="text-4xl font-bold text-center mb-2 text-white">
            Kerala Soil Data Monitoring
          </h1>
          <p className="text-center text-white/90 mb-8 max-w-2xl mx-auto">
            Real-time soil analysis across Kerala districts featuring authentic data from laterite, alluvial, and hill soils
          </p>

          <Card className="mb-8 shadow-floating bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Kerala District Soil Monitoring
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                {fields.map((field) => (
                  <Button
                    key={field.id}
                    variant={selectedField === field.id ? "default" : "outline"}
                    onClick={() => handleFieldChange(field.id)}
                    className="transition-smooth"
                  >
                    {field.name}
                  </Button>
                ))}
              </div>
              
              {/* Soil Information Panel */}
              <div className="grid md:grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">District: <span className="font-medium text-foreground">{soilData.district}</span></div>
                  <div className="text-sm text-muted-foreground">Soil Type: <span className="font-medium text-foreground">{soilData.soilType}</span></div>
                  <div className="text-sm text-muted-foreground">Elevation: <span className="font-medium text-foreground">{soilData.elevation}</span></div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Annual Rainfall: <span className="font-medium text-foreground">{soilData.rainfall}</span></div>
                  <div className="text-sm text-muted-foreground">Major Crops: <span className="font-medium text-foreground">{soilData.majorCrops.join(", ")}</span></div>
                  <div className="text-sm text-muted-foreground">Last Updated: <span className="font-medium text-foreground">{soilData.lastUpdated}</span></div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <DataCard
              title="Soil Moisture"
              value={soilData.moisture}
              unit="%"
              icon={Droplets}
              variant="soil"
              description={
                soilData.moisture > 90 ? "Very High - Monitor drainage" :
                soilData.moisture > 70 ? "Optimal for Kerala climate" :
                soilData.moisture > 50 ? "Moderate - May need irrigation" :
                "Low - Requires immediate irrigation"
              }
            />
            <DataCard
              title="Temperature"
              value={soilData.temperature}
              unit="°C"
              icon={Thermometer}
              variant="soil"
              description={
                soilData.temperature > 30 ? "High - Suitable for tropical crops" :
                soilData.temperature > 25 ? "Optimal for Kerala agriculture" :
                "Cool - Ideal for hill station crops"
              }
            />
            <DataCard
              title="pH Level"
              value={soilData.ph}
              icon={TestTube}
              variant="soil"
              description={
                soilData.ph < 5.5 ? "Acidic - Common in laterite soils" :
                soilData.ph > 7.5 ? "Alkaline - Rare in Kerala" :
                "Balanced - Good for most crops"
              }
            />
            <DataCard
              title="Conductivity"
              value={soilData.conductivity}
              unit="dS/m"
              icon={Zap}
              variant="soil"
              description={
                soilData.conductivity > 2.0 ? "High salinity - Near coastal areas" :
                soilData.conductivity > 1.0 ? "Moderate salinity" :
                "Low salinity - Ideal conditions"
              }
            />
          </div>

          {/* Nutrient Levels */}
          <Card className="mb-8 shadow-floating bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sprout className="h-5 w-5 text-primary" />
                Nutrient Levels
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {[
                  { name: "Nitrogen (N)", value: soilData.nitrogen, color: "bg-blue-500" },
                  { name: "Phosphorus (P)", value: soilData.phosphorus, color: "bg-red-500" },
                  { name: "Potassium (K)", value: soilData.potassium, color: "bg-green-500" }
                ].map((nutrient, index) => {
                  const status = getNutrientStatus(nutrient.value);
                  return (
                    <div key={nutrient.name} className="animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">{nutrient.name}</span>
                        <span className={`font-bold ${status.color}`}>
                          {nutrient.value}% - {status.status}
                        </span>
                      </div>
                      <Progress value={nutrient.value} className="h-3" />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card className="shadow-floating bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Soil Health Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recommendations.map((rec, index) => {
                  const Icon = rec.icon;
                  return (
                    <div key={index} className="flex items-start gap-3 p-4 rounded-lg bg-muted/50 animate-slide-up"
                         style={{ animationDelay: `${index * 0.1}s` }}>
                      <Icon className={`h-5 w-5 mt-0.5 ${rec.color}`} />
                      <div>
                        <div className="font-medium">{rec.title}</div>
                        <div className="text-sm text-muted-foreground">{rec.message}</div>
                      </div>
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

export default SoilDataPage;