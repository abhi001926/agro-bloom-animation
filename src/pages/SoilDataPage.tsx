import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import FloatingIcons from "@/components/animations/FloatingIcons";
import { 
  MapPin, 
  Sprout,
  Leaf,
  TrendingUp,
  Info,
  ChevronRight
} from "lucide-react";

// Kerala Districts with Soil Data 2025
const keralaDistrictSoils = [
  {
    id: "thiruvananthapuram",
    district: "Thiruvananthapuram",
    soilTypes: ["Laterite Soils", "Red Soils"],
    primarySoil: "Laterite Soils",
    soilInfo: "Laterite soils occur in midlands at 10-100m elevation. Red soils found in southern parts along foot slopes of laterite hills. Both are well-drained with acidic pH (5.2-5.8).",
    crops: [
      { name: "Coconut", efficiency: 95, season: "Year-round" },
      { name: "Rubber", efficiency: 90, season: "Year-round" },
      { name: "Cashew", efficiency: 88, season: "Year-round" },
      { name: "Banana", efficiency: 85, season: "Year-round" },
      { name: "Pepper", efficiency: 82, season: "June-March" },
      { name: "Tapioca", efficiency: 80, season: "Apr-May" },
    ]
  },
  {
    id: "kollam",
    district: "Kollam",
    soilTypes: ["Laterite Soils", "Coastal Alluvium"],
    primarySoil: "Laterite Soils",
    soilInfo: "Predominantly laterite in midlands with coastal alluvium along the coast. Sandy texture near coast, clay-rich laterite inland. Good for plantation crops.",
    crops: [
      { name: "Coconut", efficiency: 94, season: "Year-round" },
      { name: "Cashew", efficiency: 92, season: "Year-round" },
      { name: "Rubber", efficiency: 88, season: "Year-round" },
      { name: "Banana", efficiency: 85, season: "Year-round" },
      { name: "Pepper", efficiency: 80, season: "June-March" },
    ]
  },
  {
    id: "pathanamthitta",
    district: "Pathanamthitta",
    soilTypes: ["Hill Soils", "Laterite Soils"],
    primarySoil: "Hill Soils",
    soilInfo: "Hill soils above 80m elevation with loam to clay loam texture. Reddish brown color with 10-50% gravel. Subject to erosion on steep slopes.",
    crops: [
      { name: "Rubber", efficiency: 95, season: "Year-round" },
      { name: "Pepper", efficiency: 90, season: "June-March" },
      { name: "Cardamom", efficiency: 85, season: "Aug-Feb" },
      { name: "Coconut", efficiency: 82, season: "Year-round" },
      { name: "Pineapple", efficiency: 80, season: "Year-round" },
    ]
  },
  {
    id: "alappuzha",
    district: "Alappuzha",
    soilTypes: ["Kari Soils", "Coastal Alluvium"],
    primarySoil: "Kari Soils",
    soilInfo: "Unique Kari soils in marshy areas below sea level. High organic matter (8-10%), extremely acidic (pH 3.5-4.5). Requires special management. Ideal for Pokkali farming.",
    crops: [
      { name: "Rice (Pokkali)", efficiency: 92, season: "Jun-Nov" },
      { name: "Coconut", efficiency: 85, season: "Year-round" },
      { name: "Fish Farming", efficiency: 90, season: "Dec-May" },
      { name: "Banana", efficiency: 75, season: "Year-round" },
    ]
  },
  {
    id: "kottayam",
    district: "Kottayam",
    soilTypes: ["Kari Soils", "Laterite Soils", "Hill Soils"],
    primarySoil: "Laterite Soils",
    soilInfo: "Mixed soil types - Kari soils in lowlands, laterite in midlands, hill soils in eastern highlands. Rubber belt of Kerala with ideal conditions.",
    crops: [
      { name: "Rubber", efficiency: 96, season: "Year-round" },
      { name: "Coconut", efficiency: 88, season: "Year-round" },
      { name: "Pepper", efficiency: 85, season: "June-March" },
      { name: "Banana", efficiency: 82, season: "Year-round" },
      { name: "Rice", efficiency: 78, season: "Jun-Sep" },
    ]
  },
  {
    id: "idukki",
    district: "Idukki",
    soilTypes: ["Forest Soils", "Hill Soils"],
    primarySoil: "Forest Soils",
    soilInfo: "Forest soils above 300m elevation with high organic matter (6-8%). Developed under forest cover on crystalline rocks. Cool climate ideal for spices and tea.",
    crops: [
      { name: "Cardamom", efficiency: 98, season: "Aug-Feb" },
      { name: "Tea", efficiency: 95, season: "Year-round" },
      { name: "Coffee", efficiency: 92, season: "Nov-Feb" },
      { name: "Pepper", efficiency: 90, season: "June-March" },
      { name: "Vegetables", efficiency: 88, season: "Year-round" },
    ]
  },
  {
    id: "ernakulam",
    district: "Ernakulam",
    soilTypes: ["Coastal Alluvium", "Acid Saline Soils", "Laterite Soils"],
    primarySoil: "Coastal Alluvium",
    soilInfo: "Coastal alluvium along backwaters with sandy texture. Acid saline soils in tidal areas. High water table. Suitable for coconut and rice.",
    crops: [
      { name: "Coconut", efficiency: 92, season: "Year-round" },
      { name: "Rice", efficiency: 88, season: "Jun-Sep, Oct-Jan" },
      { name: "Banana", efficiency: 85, season: "Year-round" },
      { name: "Vegetables", efficiency: 82, season: "Oct-Mar" },
      { name: "Nutmeg", efficiency: 78, season: "Year-round" },
    ]
  },
  {
    id: "thrissur",
    district: "Thrissur",
    soilTypes: ["Mixed Alluvium", "Laterite Soils", "Acid Saline Soils"],
    primarySoil: "Mixed Alluvium",
    soilInfo: "Kole lands with mixed alluvium - frequently flooded. Sandy clay loam to clay texture. Famous for rice cultivation in reclaimed wetlands.",
    crops: [
      { name: "Rice (Kole)", efficiency: 95, season: "Sep-Mar" },
      { name: "Coconut", efficiency: 90, season: "Year-round" },
      { name: "Banana", efficiency: 85, season: "Year-round" },
      { name: "Vegetables", efficiency: 88, season: "Mar-May" },
      { name: "Watermelon", efficiency: 82, season: "Jan-Apr" },
    ]
  },
  {
    id: "palakkad",
    district: "Palakkad",
    soilTypes: ["Black Cotton Soils", "Laterite Soils", "Mixed Alluvium"],
    primarySoil: "Black Cotton Soils",
    soilInfo: "Unique black cotton soils in Chittur taluk - calcareous, pH 7.2-7.5. High shrink-swell capacity. Rice bowl of Kerala with fertile alluvial plains.",
    crops: [
      { name: "Rice", efficiency: 96, season: "Jun-Sep, Oct-Feb" },
      { name: "Sugarcane", efficiency: 90, season: "Jan-Dec" },
      { name: "Cotton", efficiency: 85, season: "Jun-Nov" },
      { name: "Groundnut", efficiency: 88, season: "Jun-Sep" },
      { name: "Vegetables", efficiency: 85, season: "Oct-Mar" },
    ]
  },
  {
    id: "malappuram",
    district: "Malappuram",
    soilTypes: ["Laterite Soils", "Hill Soils"],
    primarySoil: "Laterite Soils",
    soilInfo: "Laterite soils in midlands with good drainage. Hill soils in Nilambur region. Suitable for rubber and spice cultivation.",
    crops: [
      { name: "Rubber", efficiency: 92, season: "Year-round" },
      { name: "Coconut", efficiency: 90, season: "Year-round" },
      { name: "Arecanut", efficiency: 88, season: "Year-round" },
      { name: "Pepper", efficiency: 85, season: "June-March" },
      { name: "Banana", efficiency: 82, season: "Year-round" },
    ]
  },
  {
    id: "kozhikode",
    district: "Kozhikode",
    soilTypes: ["Laterite Soils", "Coastal Alluvium"],
    primarySoil: "Laterite Soils",
    soilInfo: "Laterite dominant with coastal alluvium along beaches. Well-drained acidic soils ideal for coconut gardens and spice cultivation.",
    crops: [
      { name: "Coconut", efficiency: 94, season: "Year-round" },
      { name: "Arecanut", efficiency: 90, season: "Year-round" },
      { name: "Pepper", efficiency: 88, season: "June-March" },
      { name: "Banana", efficiency: 85, season: "Year-round" },
      { name: "Rubber", efficiency: 80, season: "Year-round" },
    ]
  },
  {
    id: "wayanad",
    district: "Wayanad",
    soilTypes: ["Forest Soils", "Hill Soils"],
    primarySoil: "Forest Soils",
    soilInfo: "High altitude forest soils (700-2100m) with excellent organic matter. Cool climate with high rainfall. Premier coffee and spice growing region.",
    crops: [
      { name: "Coffee", efficiency: 98, season: "Nov-Feb" },
      { name: "Pepper", efficiency: 95, season: "June-March" },
      { name: "Cardamom", efficiency: 92, season: "Aug-Feb" },
      { name: "Ginger", efficiency: 90, season: "Mar-Dec" },
      { name: "Banana", efficiency: 85, season: "Year-round" },
    ]
  },
  {
    id: "kannur",
    district: "Kannur",
    soilTypes: ["Laterite Soils", "Coastal Alluvium", "Acid Saline Soils"],
    primarySoil: "Laterite Soils",
    soilInfo: "Laterite soils with characteristic red color. Coastal alluvium near beaches. Known for cashew and coconut plantations.",
    crops: [
      { name: "Coconut", efficiency: 94, season: "Year-round" },
      { name: "Cashew", efficiency: 92, season: "Year-round" },
      { name: "Arecanut", efficiency: 88, season: "Year-round" },
      { name: "Pepper", efficiency: 85, season: "June-March" },
      { name: "Rubber", efficiency: 82, season: "Year-round" },
    ]
  },
  {
    id: "kasaragod",
    district: "Kasaragod",
    soilTypes: ["Laterite Soils", "Coastal Alluvium"],
    primarySoil: "Laterite Soils",
    soilInfo: "Laterite dominant district with coastal patches. Well-suited for coconut and arecanut. Known as 'Land of Gods' with traditional farming systems.",
    crops: [
      { name: "Coconut", efficiency: 96, season: "Year-round" },
      { name: "Arecanut", efficiency: 94, season: "Year-round" },
      { name: "Cashew", efficiency: 88, season: "Year-round" },
      { name: "Pepper", efficiency: 85, season: "June-March" },
      { name: "Rubber", efficiency: 80, season: "Year-round" },
    ]
  }
];

const getEfficiencyColor = (efficiency: number) => {
  if (efficiency >= 90) return "bg-green-500";
  if (efficiency >= 80) return "bg-emerald-500";
  if (efficiency >= 70) return "bg-yellow-500";
  return "bg-orange-500";
};

const getEfficiencyLabel = (efficiency: number) => {
  if (efficiency >= 90) return "Excellent";
  if (efficiency >= 80) return "Very Good";
  if (efficiency >= 70) return "Good";
  return "Moderate";
};

const SoilDataPage = () => {
  const [selectedDistrict, setSelectedDistrict] = useState(keralaDistrictSoils[0]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-green-50 relative overflow-hidden">
      <FloatingIcons />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="animate-slide-up">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-amber-600 via-green-600 to-emerald-600 bg-clip-text text-transparent">
              Kerala Soils & Crop Guide 2025
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Select a district to view soil types and recommended crops with efficiency ratings
            </p>
          </div>

          {/* District Selection */}
          <Card className="mb-6 shadow-lg bg-white/95 border-0">
            <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg py-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <MapPin className="h-5 w-5" />
                Select District
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-2">
                {keralaDistrictSoils.map((district) => (
                  <Button
                    key={district.id}
                    variant={selectedDistrict.id === district.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedDistrict(district)}
                    className={`text-xs h-auto py-2 transition-all ${
                      selectedDistrict.id === district.id 
                        ? "bg-green-600 hover:bg-green-700 text-white shadow-md" 
                        : "hover:bg-green-50 hover:border-green-400"
                    }`}
                  >
                    {district.district}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Selected District Info */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Soil Information */}
            <Card className="lg:col-span-1 shadow-lg bg-white border-0">
              <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Info className="h-5 w-5" />
                  {selectedDistrict.district} Soil Info
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-4">
                {/* Primary Soil */}
                <div>
                  <span className="text-xs text-gray-500 uppercase tracking-wide">Primary Soil Type</span>
                  <p className="font-bold text-lg text-amber-700">{selectedDistrict.primarySoil}</p>
                </div>

                {/* All Soil Types */}
                <div>
                  <span className="text-xs text-gray-500 uppercase tracking-wide">All Soil Types</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {selectedDistrict.soilTypes.map((soil) => (
                      <Badge key={soil} variant="secondary" className="bg-amber-100 text-amber-800 text-xs">
                        {soil}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Soil Description */}
                <div>
                  <span className="text-xs text-gray-500 uppercase tracking-wide">About the Soil</span>
                  <p className="text-gray-700 text-sm mt-1 leading-relaxed">{selectedDistrict.soilInfo}</p>
                </div>
              </CardContent>
            </Card>

            {/* Crop Recommendations */}
            <Card className="lg:col-span-2 shadow-lg bg-white border-0">
              <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Sprout className="h-5 w-5" />
                  Recommended Crops for {selectedDistrict.district}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  {selectedDistrict.crops.map((crop, index) => (
                    <div 
                      key={crop.name}
                      className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200/50 hover:shadow-md transition-all animate-slide-up"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <div className="bg-green-100 p-3 rounded-full">
                        <Leaf className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-gray-800">{crop.name}</span>
                          <div className="flex items-center gap-1">
                            <TrendingUp className="h-4 w-4 text-green-600" />
                            <span className={`text-sm font-bold ${crop.efficiency >= 90 ? 'text-green-600' : crop.efficiency >= 80 ? 'text-emerald-600' : 'text-yellow-600'}`}>
                              {crop.efficiency}%
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-500">{crop.season}</span>
                          <Badge 
                            className={`${getEfficiencyColor(crop.efficiency)} text-white text-xs`}
                          >
                            {getEfficiencyLabel(crop.efficiency)}
                          </Badge>
                        </div>
                        {/* Efficiency Bar */}
                        <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${getEfficiencyColor(crop.efficiency)} transition-all duration-500`}
                            style={{ width: `${crop.efficiency}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Reference */}
          <Card className="mt-6 shadow-lg bg-white border-0">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-t-lg py-3">
              <CardTitle className="text-lg">Efficiency Rating Guide</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-4 justify-center">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-green-500" />
                  <span className="text-sm text-gray-700">90-100%: Excellent</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-emerald-500" />
                  <span className="text-sm text-gray-700">80-89%: Very Good</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-yellow-500" />
                  <span className="text-sm text-gray-700">70-79%: Good</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-orange-500" />
                  <span className="text-sm text-gray-700">Below 70%: Moderate</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Source */}
          <p className="text-center text-sm text-gray-500 mt-6">
            Data: Kerala State Land Use Board & Kerala Agricultural University (2025)
          </p>
        </div>
      </div>
    </div>
  );
};

export default SoilDataPage;
