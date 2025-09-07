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
  const [selectedField, setSelectedField] = useState("field-1");

  const soilData = {
    location: "North Field (Section A)",
    moisture: 68,
    temperature: 22,
    ph: 6.8,
    nitrogen: 45,
    phosphorus: 32,
    potassium: 58,
    organicMatter: 3.2,
    conductivity: 1.4,
    lastUpdated: "2 hours ago"
  };

  const recommendations = [
    {
      type: "optimal",
      icon: CheckCircle,
      title: "Soil Temperature",
      message: "Temperature is optimal for current crop growth",
      color: "text-green-600"
    },
    {
      type: "warning",
      icon: AlertCircle,
      title: "Nitrogen Levels",
      message: "Consider nitrogen fertilizer application",
      color: "text-yellow-600"
    },
    {
      type: "optimal",
      icon: CheckCircle,
      title: "pH Balance",
      message: "pH levels are within ideal range",
      color: "text-green-600"
    }
  ];

  const fields = [
    { id: "field-1", name: "North Field (Section A)" },
    { id: "field-2", name: "South Field (Section B)" },
    { id: "field-3", name: "East Field (Section C)" }
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
          <h1 className="text-4xl font-bold text-center mb-8 text-white">
            Soil Data Monitoring
          </h1>

          {/* Field Selection */}
          <Card className="mb-8 shadow-floating bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Select Field
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
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
              <div className="mt-4 text-sm text-muted-foreground">
                Last updated: {soilData.lastUpdated}
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
              description="Optimal for growth"
            />
            <DataCard
              title="Temperature"
              value={soilData.temperature}
              unit="°C"
              icon={Thermometer}
              variant="soil"
              description="Good conditions"
            />
            <DataCard
              title="pH Level"
              value={soilData.ph}
              icon={TestTube}
              variant="soil"
              description="Slightly acidic"
            />
            <DataCard
              title="Conductivity"
              value={soilData.conductivity}
              unit="dS/m"
              icon={Zap}
              variant="soil"
              description="Low salinity"
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