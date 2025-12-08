import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  CheckCircle,
  Mountain,
  Waves,
  TreePine,
  Leaf,
  Info
} from "lucide-react";
import { toast } from "sonner";

// Kerala Soil Types Data 2025
const keralaSoilTypes = {
  coastalAlluvium: {
    id: "coastalAlluvium",
    name: "Coastal Alluvium",
    shortName: "Coastal",
    color: "from-amber-400 to-yellow-500",
    icon: Waves,
    description: "Soils of marine origin identified along coastal plains and basin lands as a narrow strip.",
    elevation: "Below 5m MSL",
    texture: "Sand to loamy sand",
    colorDesc: "Greyish brown to reddish brown and yellowish red",
    sandContent: "80%+",
    clayContent: "Up to 15%",
    waterTable: "High (reaches surface in rainy season)",
    waterHoldingCapacity: "Poor (due to sand predominance)",
    majorCrops: ["Coconut", "Cashew", "Fruit trees"],
    characteristics: [
      "Very deep with sandy texture",
      "High water table but poor water holding capacity",
      "Sand content ranges from 80%",
      "Clay content up to 15%"
    ],
    districts: ["Ernakulam", "Thrissur", "Kannur", "Kozhikode"],
    // Soil parameters
    moisture: 65,
    temperature: 28,
    ph: 6.5,
    nitrogen: 35,
    phosphorus: 30,
    potassium: 45,
    organicMatter: 2.1,
    conductivity: 0.9,
    lastUpdated: "2 hours ago"
  },
  mixedAlluvium: {
    id: "mixedAlluvium",
    name: "Mixed Alluvium",
    shortName: "Mixed Alluvium",
    color: "from-emerald-400 to-teal-500",
    icon: Droplets,
    description: "Developed from fluvial sediments of marine, lacustrine and riverine sediments or combinations.",
    elevation: "Below 20m MSL",
    texture: "Sandy clay loam to clay",
    colorDesc: "Light grey to very dark brown",
    location: "Lowland plains, basins, valleys, river banks",
    waterTable: "High (reaches above surface in rainy season)",
    majorCrops: ["Rice", "Banana", "Tapioca", "Vegetables", "Seasonal crops"],
    characteristics: [
      "Frequently flooded and submerged",
      "Subject to occasional flooding and stagnation",
      "Wide variation in texture",
      "Sandy loam soils also present"
    ],
    districts: ["Kuttanad", "Thrissur (Kole lands)", "Coastal areas"],
    moisture: 88,
    temperature: 27,
    ph: 6.2,
    nitrogen: 55,
    phosphorus: 48,
    potassium: 62,
    organicMatter: 4.5,
    conductivity: 1.3,
    lastUpdated: "1.5 hours ago"
  },
  acidSaline: {
    id: "acidSaline",
    name: "Acid Saline Soils",
    shortName: "Acid Saline",
    color: "from-red-400 to-orange-500",
    icon: AlertCircle,
    description: "Present throughout coastal area in patches, comprising low-lying marshes and waterlogged areas.",
    elevation: "At or below sea level",
    texture: "Sandy loam to clay",
    colorDesc: "Dark grey to black",
    location: "Coastal tract, near rivers and streams subject to tidal waves",
    waterTable: "Very high",
    majorCrops: ["Rice (Pokkali)"],
    characteristics: [
      "Sea and backwater tides make soils saline",
      "Salinity partially washed off during monsoon",
      "Ill-drained areas",
      "Subject to tidal waves"
    ],
    limitations: [
      "Extreme salinity from sea water intrusion",
      "Poor drainage conditions",
      "Limited crop options"
    ],
    districts: ["Ernakulam", "Thrissur", "Kannur"],
    moisture: 92,
    temperature: 28,
    ph: 4.2,
    nitrogen: 38,
    phosphorus: 25,
    potassium: 52,
    organicMatter: 5.8,
    conductivity: 4.5,
    lastUpdated: "45 mins ago"
  },
  kariSoils: {
    id: "kariSoils",
    name: "Kari Soils",
    shortName: "Kari",
    color: "from-gray-600 to-slate-700",
    icon: Leaf,
    description: "Found in marshy areas lying below Mean Sea Level with decomposed organic matter.",
    elevation: "Below MSL",
    texture: "Sandy clay to clay (silty clay loam, clay loam)",
    colorDesc: "Dark black",
    location: "Alappuzha & Kottayam districts in marshy areas",
    waterTable: "Very high - waterlogged",
    majorCrops: ["Rice", "Fish farming (Pokkali system)"],
    characteristics: [
      "Poor drainage",
      "High acidity and salinity",
      "Decomposed organic matter at lower layers",
      "Wood debris in subsoil",
      "Sand pockets in solum"
    ],
    limitations: [
      "Impeded drainage",
      "Toxic concentration of soluble salts",
      "Extreme Acidity (pH<4)",
      "Presence of toxic compounds and elements",
      "Low fertility"
    ],
    management: [
      "Avoid disturbance of subsoil to limit acidity generation",
      "Pre-flooding to allow reduction of acidity before planting",
      "Double cropping of rice (or shrimps as in Pokkali lands)",
      "Frequent flushing with good quality water",
      "Intensive shallow drainage with broad raised beds"
    ],
    districts: ["Alappuzha", "Kottayam"],
    moisture: 96,
    temperature: 27,
    ph: 3.8,
    nitrogen: 42,
    phosphorus: 32,
    potassium: 48,
    organicMatter: 9.2,
    conductivity: 3.8,
    lastUpdated: "30 mins ago"
  },
  lateriteSoils: {
    id: "lateriteSoils",
    name: "Laterite Soils",
    shortName: "Laterite",
    color: "from-red-500 to-red-700",
    icon: Mountain,
    description: "Weathering products of rock with removal of bases and substantial loss of silica.",
    elevation: "10 to 100m MSL",
    texture: "Variable with high gravel content",
    colorDesc: "Reddish brown to yellowish red",
    location: "Midlands and part of lowlands as strip between coastal belt and hilly midupland",
    waterTable: "Moderate",
    majorCrops: ["Coconut", "Arecanut", "Banana", "Tapioca", "Vegetables", "Yams", "Pepper", "Pineapple", "Fruit trees"],
    characteristics: [
      "Induration and zonation more pronounced over acidic rocks",
      "Higher iron content leads to greater induration",
      "Comprises mounds and low hills with gentle to steep slopes",
      "Gravel content limits crop choice"
    ],
    limitations: [
      "High gravel percentage",
      "Reduced soil depth in some areas",
      "Only cashew viable in shallow laterite outcrop areas"
    ],
    districts: ["Thiruvananthapuram", "Kollam", "Kannur", "Kasaragod"],
    moisture: 68,
    temperature: 29,
    ph: 5.2,
    nitrogen: 38,
    phosphorus: 28,
    potassium: 42,
    organicMatter: 2.8,
    conductivity: 0.7,
    lastUpdated: "1 hour ago"
  },
  blackCottonSoils: {
    id: "blackCottonSoils",
    name: "Black Cotton Soils",
    shortName: "Black Cotton",
    color: "from-gray-800 to-black",
    icon: Sprout,
    description: "Developed on Khondalite suite of rocks with crystalline limestone and calc-granulites.",
    elevation: "100 to 300m MSL",
    texture: "Clay loam to clay",
    colorDesc: "Black and calcareous",
    location: "Chittur taluk in Palakkad district",
    waterTable: "Moderate to high",
    majorCrops: ["Coconut", "Sugarcane", "Cotton", "Chilly", "Pulses", "Vegetables"],
    characteristics: [
      "Very deep and calcareous",
      "High shrink-swell capacity",
      "Characteristic cracking during dry periods",
      "Identified in alluvial plains and undulating plains"
    ],
    districts: ["Palakkad (Chittur taluk)"],
    moisture: 58,
    temperature: 30,
    ph: 7.4,
    nitrogen: 62,
    phosphorus: 65,
    potassium: 78,
    organicMatter: 3.6,
    conductivity: 1.6,
    lastUpdated: "2 hours ago"
  },
  redSoils: {
    id: "redSoils",
    name: "Red Soils",
    shortName: "Red",
    color: "from-red-600 to-rose-700",
    icon: MapPin,
    description: "Found mostly in southern parts along foot slopes of laterite hills and mounds.",
    elevation: "Undulating plains of lowland",
    texture: "Sandy clay loam to clay loam",
    colorDesc: "Red to dark red",
    location: "Southern Thiruvananthapuram district and foot slopes of laterite hills",
    slope: "3 to 10%",
    majorCrops: ["Coconut", "Arecanut", "Banana", "Yams", "Pineapple", "Vegetables", "Fruit trees"],
    characteristics: [
      "Mostly very deep and homogeneous",
      "Gravels rarely noticed",
      "Suitable for variety of crops under proper management"
    ],
    districts: ["Thiruvananthapuram (southern parts)"],
    moisture: 62,
    temperature: 28,
    ph: 5.8,
    nitrogen: 48,
    phosphorus: 45,
    potassium: 55,
    organicMatter: 3.2,
    conductivity: 0.8,
    lastUpdated: "1.5 hours ago"
  },
  hillSoils: {
    id: "hillSoils",
    name: "Hill Soils",
    shortName: "Hill",
    color: "from-green-600 to-emerald-700",
    icon: Mountain,
    description: "Occur above 80m MSL with highly dissected denudational hills and elongated ridges.",
    elevation: "Above 80m MSL",
    texture: "Loam to clay loam",
    colorDesc: "Reddish brown to yellowish red/strong brown",
    gravelContent: "10 to 50%",
    slope: "Above 10%",
    soilDepth: "60 to 200 cm (varies with topography and erosion)",
    majorCrops: ["Rubber", "Coconut", "Arecanut", "Fruit trees", "Banana", "Pepper", "Pineapple", "Vegetables (foot slopes)"],
    characteristics: [
      "Highly dissected hills with rocky cliffs and narrow valleys",
      "Stones and boulders in subsoil",
      "Clay content increases down the profile",
      "Mostly friable and subject to heavy soil erosion"
    ],
    limitations: [
      "Subject to heavy erosion",
      "Variable soil depth",
      "Steep slopes limit cultivation"
    ],
    districts: ["Wayanad", "Idukki", "Pathanamthitta"],
    moisture: 75,
    temperature: 23,
    ph: 5.6,
    nitrogen: 58,
    phosphorus: 52,
    potassium: 65,
    organicMatter: 5.8,
    conductivity: 0.5,
    lastUpdated: "1 hour ago"
  },
  forestSoils: {
    id: "forestSoils",
    name: "Forest Soils",
    shortName: "Forest",
    color: "from-green-800 to-green-950",
    icon: TreePine,
    description: "Developed from crystalline rocks of Archaean age under forest cover.",
    elevation: "Above 300m MSL",
    texture: "Sandy clay loam to clay",
    colorDesc: "Reddish brown to very dark brown",
    location: "Eastern part of the State",
    majorCrops: ["Forest trees", "Shrubs", "Grasses"],
    characteristics: [
      "Hilly and mountainous with steep slopes",
      "Escarpments and elongated rocky summits",
      "Narrow 'V' shaped valleys",
      "Generally immature due to slow weathering",
      "Rock outcrops and stones on surface",
      "Gneissic boulders under different weathering stages in subsoil"
    ],
    limitations: [
      "Variable soil depth depending on erosion",
      "Immature soil development",
      "Steep terrain limits agriculture"
    ],
    districts: ["Idukki", "Wayanad", "Palakkad (Eastern)"],
    moisture: 82,
    temperature: 20,
    ph: 5.4,
    nitrogen: 72,
    phosphorus: 62,
    potassium: 70,
    organicMatter: 7.5,
    conductivity: 0.4,
    lastUpdated: "3 hours ago"
  }
};

type SoilTypeKey = keyof typeof keralaSoilTypes;

const SoilDataPage = () => {
  const [selectedSoilType, setSelectedSoilType] = useState<SoilTypeKey>("lateriteSoils");
  const [activeTab, setActiveTab] = useState("overview");

  const soilData = keralaSoilTypes[selectedSoilType];

  const getRecommendationsForSoil = (data: typeof soilData) => {
    const recommendations = [];
    
    if (data.ph < 5.0) {
      recommendations.push({
        type: "warning",
        icon: AlertCircle,
        title: "Extreme Soil Acidity",
        message: `pH ${data.ph} is extremely acidic. Apply agricultural lime (2-4 tonnes/ha) and avoid disturbing subsoil.`,
        color: "text-red-600"
      });
    } else if (data.ph < 5.5) {
      recommendations.push({
        type: "warning",
        icon: AlertCircle,
        title: "Soil Acidity",
        message: `pH ${data.ph} is acidic. Apply lime to improve pH for better crop growth.`,
        color: "text-orange-600"
      });
    } else if (data.ph > 7.5) {
      recommendations.push({
        type: "warning",
        icon: AlertCircle,
        title: "Soil Alkalinity",
        message: `pH ${data.ph} is alkaline. Consider organic matter addition and gypsum application.`,
        color: "text-orange-600"
      });
    } else {
      recommendations.push({
        type: "optimal",
        icon: CheckCircle,
        title: "pH Balance",
        message: "pH levels are suitable for most crops.",
        color: "text-green-600"
      });
    }

    if (data.nitrogen < 40) {
      recommendations.push({
        type: "warning",
        icon: AlertCircle,
        title: "Nitrogen Deficiency",
        message: "Apply organic fertilizers, green manure, or legume cover crops to boost nitrogen.",
        color: "text-red-600"
      });
    } else if (data.nitrogen > 60) {
      recommendations.push({
        type: "optimal",
        icon: CheckCircle,
        title: "Good Nitrogen Levels",
        message: "Nitrogen content is adequate for healthy crop growth.",
        color: "text-green-600"
      });
    } else {
      recommendations.push({
        type: "moderate",
        icon: AlertCircle,
        title: "Moderate Nitrogen",
        message: "Consider supplemental nitrogen application during peak growth periods.",
        color: "text-blue-600"
      });
    }

    if (data.moisture > 90) {
      recommendations.push({
        type: "warning",
        icon: AlertCircle,
        title: "Waterlogging Risk",
        message: "Implement drainage systems. Consider raised bed cultivation or bunding.",
        color: "text-blue-600"
      });
    } else if (data.moisture < 50) {
      recommendations.push({
        type: "warning",
        icon: AlertCircle,
        title: "Low Moisture",
        message: "Increase irrigation frequency. Consider mulching to retain soil moisture.",
        color: "text-red-600"
      });
    } else {
      recommendations.push({
        type: "optimal",
        icon: CheckCircle,
        title: "Optimal Moisture",
        message: "Soil moisture is ideal for current conditions.",
        color: "text-green-600"
      });
    }

    if (data.conductivity > 3.0) {
      recommendations.push({
        type: "warning",
        icon: AlertCircle,
        title: "High Salinity",
        message: "Flush with fresh water regularly. Consider salt-tolerant crop varieties.",
        color: "text-red-600"
      });
    }

    return recommendations;
  };

  const recommendations = getRecommendationsForSoil(soilData);

  const handleSoilTypeChange = (soilType: SoilTypeKey) => {
    setSelectedSoilType(soilType);
    toast.success(`Viewing ${keralaSoilTypes[soilType].name} data`);
  };

  const getNutrientStatus = (value: number) => {
    if (value > 60) return { status: "High", color: "text-green-600", bg: "bg-green-100" };
    if (value > 40) return { status: "Moderate", color: "text-blue-600", bg: "bg-blue-100" };
    return { status: "Low", color: "text-red-600", bg: "bg-red-100" };
  };

  const SoilIcon = soilData.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-green-50 relative overflow-hidden">
      <FloatingIcons />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="animate-slide-up">
          {/* Header Section */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-amber-600 via-green-600 to-emerald-600 bg-clip-text text-transparent drop-shadow-sm">
              Soils of Kerala - 2025
            </h1>
            <p className="text-gray-700 max-w-3xl mx-auto text-lg leading-relaxed">
              The topo-lithosequence of Kerala along with variation in rainfall, temperature and alternate wet and dry conditions 
              from the western coast to high ranges in the east lead to the development of different types of natural vegetation and soil.
            </p>
          </div>

          {/* Soil Type Introduction Card */}
          <Card className="mb-8 shadow-xl bg-white/95 backdrop-blur-sm border-0 ring-1 ring-gray-200/50 overflow-hidden">
            <CardHeader className={`bg-gradient-to-r ${soilData.color} text-white`}>
              <CardTitle className="flex items-center gap-3 text-white text-xl">
                <SoilIcon className="h-6 w-6" />
                Kerala Soil Types Classification
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {/* Soil Type Buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-2 mb-6">
                {Object.values(keralaSoilTypes).map((soil) => {
                  const Icon = soil.icon;
                  return (
                    <Button
                      key={soil.id}
                      variant={selectedSoilType === soil.id ? "default" : "outline"}
                      onClick={() => handleSoilTypeChange(soil.id as SoilTypeKey)}
                      className={`flex flex-col items-center gap-1 h-auto py-3 px-2 text-xs transition-all duration-300 ${
                        selectedSoilType === soil.id 
                          ? `bg-gradient-to-r ${soil.color} text-white shadow-lg border-0 scale-105` 
                          : "bg-white hover:bg-gray-50 border-2 border-gray-200 text-gray-700 hover:border-gray-400"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="text-center leading-tight">{soil.shortName}</span>
                    </Button>
                  );
                })}
              </div>

              {/* Selected Soil Info */}
              <div className={`p-6 rounded-xl bg-gradient-to-r ${soilData.color} bg-opacity-10 border-2 border-opacity-30`}
                   style={{ background: `linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,255,255,0.85))` }}>
                <div className="flex items-start gap-4 mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${soilData.color} shadow-lg`}>
                    <SoilIcon className="h-8 w-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-800">{soilData.name}</h3>
                    <p className="text-gray-600 mt-1">{soilData.description}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white/80 p-4 rounded-lg shadow-sm">
                    <span className="text-xs text-gray-500 uppercase tracking-wide">Elevation</span>
                    <p className="font-semibold text-gray-800">{soilData.elevation}</p>
                  </div>
                  <div className="bg-white/80 p-4 rounded-lg shadow-sm">
                    <span className="text-xs text-gray-500 uppercase tracking-wide">Texture</span>
                    <p className="font-semibold text-gray-800">{soilData.texture}</p>
                  </div>
                  <div className="bg-white/80 p-4 rounded-lg shadow-sm">
                    <span className="text-xs text-gray-500 uppercase tracking-wide">Color</span>
                    <p className="font-semibold text-gray-800">{soilData.colorDesc}</p>
                  </div>
                  <div className="bg-white/80 p-4 rounded-lg shadow-sm">
                    <span className="text-xs text-gray-500 uppercase tracking-wide">Districts</span>
                    <p className="font-semibold text-gray-800 text-sm">{soilData.districts.join(", ")}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs for Different Information */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
            <TabsList className="grid w-full grid-cols-4 mb-6 bg-white shadow-md">
              <TabsTrigger value="overview" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Overview
              </TabsTrigger>
              <TabsTrigger value="parameters" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Soil Parameters
              </TabsTrigger>
              <TabsTrigger value="crops" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Suitable Crops
              </TabsTrigger>
              <TabsTrigger value="management" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Management
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              {/* Characteristics and Limitations */}
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <Card className="shadow-lg bg-white border-0 ring-1 ring-gray-200/50">
                  <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-t-lg">
                    <CardTitle className="flex items-center gap-2 text-white text-lg">
                      <Info className="h-5 w-5" />
                      Key Characteristics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-5">
                    <ul className="space-y-3">
                      {soilData.characteristics.map((char, index) => (
                        <li key={index} className="flex items-start gap-3 text-gray-700">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>{char}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {'limitations' in soilData && soilData.limitations && (
                  <Card className="shadow-lg bg-white border-0 ring-1 ring-gray-200/50">
                    <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-t-lg">
                      <CardTitle className="flex items-center gap-2 text-white text-lg">
                        <AlertCircle className="h-5 w-5" />
                        Soil Limitations
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-5">
                      <ul className="space-y-3">
                        {(soilData.limitations as string[]).map((limit: string, index: number) => (
                          <li key={index} className="flex items-start gap-3 text-gray-700">
                            <AlertCircle className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
                            <span>{limit}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {!('limitations' in soilData) && (
                  <Card className="shadow-lg bg-white border-0 ring-1 ring-gray-200/50">
                    <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-t-lg">
                      <CardTitle className="flex items-center gap-2 text-white text-lg">
                        <MapPin className="h-5 w-5" />
                        Location Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-5">
                      <div className="space-y-4">
                        {'location' in soilData && (
                          <div>
                            <span className="text-sm text-gray-500">Primary Location</span>
                            <p className="font-semibold text-gray-800">{soilData.location as string}</p>
                          </div>
                        )}
                        {'waterTable' in soilData && (
                          <div>
                            <span className="text-sm text-gray-500">Water Table</span>
                            <p className="font-semibold text-gray-800">{soilData.waterTable as string}</p>
                          </div>
                        )}
                        {'slope' in soilData && (
                          <div>
                            <span className="text-sm text-gray-500">Slope</span>
                            <p className="font-semibold text-gray-800">{soilData.slope as string}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="parameters">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
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
                    "Low - Requires irrigation"
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
                    soilData.ph < 4.5 ? "Extremely Acidic - Needs lime" :
                    soilData.ph < 5.5 ? "Acidic - Common in Kerala" :
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
                    soilData.conductivity > 3.0 ? "High salinity - Coastal influence" :
                    soilData.conductivity > 1.5 ? "Moderate salinity" :
                    "Low salinity - Ideal conditions"
                  }
                />
              </div>

              {/* Nutrient Levels */}
              <Card className="shadow-xl bg-white border-0 ring-1 ring-gray-200/50">
                <CardHeader className="bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Sprout className="h-5 w-5" />
                    Nutrient Levels (NPK)
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    {[
                      { name: "Nitrogen (N)", value: soilData.nitrogen, color: "from-blue-500 to-blue-600" },
                      { name: "Phosphorus (P)", value: soilData.phosphorus, color: "from-orange-500 to-red-500" },
                      { name: "Potassium (K)", value: soilData.potassium, color: "from-green-500 to-green-600" }
                    ].map((nutrient, index) => {
                      const status = getNutrientStatus(nutrient.value);
                      return (
                        <div key={nutrient.name} className="animate-slide-up bg-gradient-to-r from-gray-50 to-white p-4 rounded-lg border border-gray-200/50" style={{ animationDelay: `${index * 0.1}s` }}>
                          <div className="flex justify-between items-center mb-3">
                            <span className="font-semibold text-gray-700">{nutrient.name}</span>
                            <span className={`font-bold ${status.color} text-sm px-3 py-1 rounded-full ${status.bg}`}>
                              {nutrient.value}% - {status.status}
                            </span>
                          </div>
                          <div className="relative">
                            <Progress value={nutrient.value} className="h-4" />
                            <div className={`absolute top-0 left-0 h-4 bg-gradient-to-r ${nutrient.color} rounded-full transition-all duration-500`} 
                                 style={{ width: `${nutrient.value}%` }} />
                          </div>
                        </div>
                      );
                    })}
                    
                    {/* Organic Matter */}
                    <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-4 rounded-lg border border-amber-200/50">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-700">Organic Matter</span>
                        <span className="font-bold text-amber-600 text-sm px-3 py-1 rounded-full bg-amber-100">
                          {soilData.organicMatter}%
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        {soilData.organicMatter > 6 ? "Excellent organic content - common in forest/kari soils" :
                         soilData.organicMatter > 3 ? "Good organic matter level" :
                         "Consider adding organic amendments"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="crops">
              <Card className="shadow-xl bg-white border-0 ring-1 ring-gray-200/50">
                <CardHeader className={`bg-gradient-to-r ${soilData.color} text-white rounded-t-lg`}>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Leaf className="h-5 w-5" />
                    Suitable Crops for {soilData.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {soilData.majorCrops.map((crop, index) => (
                      <div 
                        key={crop} 
                        className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl text-center border border-green-200/50 hover:shadow-md transition-all duration-300 animate-slide-up"
                        style={{ animationDelay: `${index * 0.05}s` }}
                      >
                        <Sprout className="h-8 w-8 text-green-600 mx-auto mb-2" />
                        <span className="font-medium text-gray-700 text-sm">{crop}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200/50">
                    <h4 className="font-semibold text-blue-800 mb-2">Cultivation Note</h4>
                    <p className="text-blue-700 text-sm">
                      Crop suitability depends on elevation, slope, and micro-climatic conditions within the district. 
                      Consult local agricultural extension services for specific plot recommendations.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="management">
              {/* Management Measures */}
              {'management' in soilData && soilData.management && (
                <Card className="shadow-xl bg-white border-0 ring-1 ring-gray-200/50 mb-6">
                  <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-t-lg">
                    <CardTitle className="flex items-center gap-2 text-white">
                      <Sprout className="h-5 w-5" />
                      Recommended Management Measures
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <ul className="space-y-4">
                      {(soilData.management as string[]).map((measure: string, index: number) => (
                        <li key={index} className="flex items-start gap-4 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200/50 animate-slide-up"
                            style={{ animationDelay: `${index * 0.1}s` }}>
                          <div className="bg-indigo-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                            {index + 1}
                          </div>
                          <span className="text-gray-700">{measure}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Recommendations */}
              <Card className="shadow-xl bg-white border-0 ring-1 ring-gray-200/50">
                <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-lg">
                  <CardTitle className="text-white">Soil Health Recommendations</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {recommendations.map((rec, index) => {
                      const Icon = rec.icon;
                      return (
                        <div key={index} className="flex items-start gap-4 p-5 rounded-lg bg-gradient-to-r from-white to-gray-50 border border-gray-200/60 animate-slide-up shadow-sm hover:shadow-md transition-all duration-300"
                             style={{ animationDelay: `${index * 0.1}s` }}>
                          <Icon className={`h-6 w-6 mt-0.5 ${rec.color}`} />
                          <div>
                            <div className="font-semibold text-gray-800">{rec.title}</div>
                            <div className="text-sm text-gray-600 mt-1">{rec.message}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Footer Note */}
          <div className="text-center text-sm text-gray-500 mt-8 p-4 bg-white/80 rounded-lg">
            <p>Data source: Kerala State Land Use Board & Kerala Agricultural University (2025)</p>
            <p className="mt-1">Last updated: {soilData.lastUpdated}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SoilDataPage;
