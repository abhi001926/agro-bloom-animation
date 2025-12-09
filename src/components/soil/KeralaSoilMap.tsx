import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Leaf, TrendingUp, MapPin } from "lucide-react";

// Soil types with colors and info
const keralaSoilTypes = [
  {
    id: "laterite",
    name: "Laterite Soils",
    color: "#C45C26",
    description: "Most widespread soil in Kerala covering midlands (10-100m elevation). Formed by weathering of crystalline rocks under tropical conditions. Rich in iron and aluminum oxides, giving characteristic red color.",
    characteristics: ["Acidic pH (5.2-5.8)", "Well-drained", "Low fertility", "Red to brown color"],
    districts: ["Thiruvananthapuram", "Kollam", "Malappuram", "Kozhikode", "Kannur", "Kasaragod"],
    crops: [
      { name: "Coconut", efficiency: 94 },
      { name: "Rubber", efficiency: 92 },
      { name: "Cashew", efficiency: 90 },
      { name: "Arecanut", efficiency: 88 },
      { name: "Pepper", efficiency: 85 },
    ]
  },
  {
    id: "forest",
    name: "Forest Soils",
    color: "#2D5A27",
    description: "Found in high altitude regions above 300m, developed under forest cover. Extremely rich in organic matter (6-8%) with excellent water retention. Cool climate zones of Western Ghats.",
    characteristics: ["High organic matter", "Dark brown color", "Cool zones", "Excellent fertility"],
    districts: ["Idukki", "Wayanad"],
    crops: [
      { name: "Coffee", efficiency: 98 },
      { name: "Cardamom", efficiency: 96 },
      { name: "Tea", efficiency: 95 },
      { name: "Pepper", efficiency: 92 },
      { name: "Ginger", efficiency: 90 },
    ]
  },
  {
    id: "hill",
    name: "Hill Soils",
    color: "#8B4513",
    description: "Located at elevations above 80m with loam to clay loam texture. Reddish-brown with 10-50% gravel content. Prone to erosion on steep slopes, requires terracing for cultivation.",
    characteristics: ["Loamy texture", "Gravel content", "Erosion prone", "Good for spices"],
    districts: ["Pathanamthitta", "Kottayam", "Idukki"],
    crops: [
      { name: "Rubber", efficiency: 95 },
      { name: "Pepper", efficiency: 90 },
      { name: "Cardamom", efficiency: 88 },
      { name: "Pineapple", efficiency: 85 },
      { name: "Banana", efficiency: 82 },
    ]
  },
  {
    id: "coastal",
    name: "Coastal Alluvium",
    color: "#D4A574",
    description: "Sandy to sandy loam soils along the coastal belt and backwaters. Formed by marine and riverine deposits. High water table with good drainage. Ideal for coconut cultivation.",
    characteristics: ["Sandy texture", "High water table", "Marine origin", "Near sea level"],
    districts: ["Ernakulam", "Kollam", "Kozhikode", "Kannur", "Kasaragod"],
    crops: [
      { name: "Coconut", efficiency: 92 },
      { name: "Rice", efficiency: 88 },
      { name: "Banana", efficiency: 85 },
      { name: "Vegetables", efficiency: 82 },
      { name: "Nutmeg", efficiency: 78 },
    ]
  },
  {
    id: "kari",
    name: "Kari Soils",
    color: "#1A1A2E",
    description: "Unique peaty marshy soils found in Kuttanad below sea level. Extremely high organic matter (8-10%), very acidic (pH 3.5-4.5). Requires special water management. Famous for Pokkali farming.",
    characteristics: ["Below sea level", "Extremely acidic", "High organic matter", "Marshy"],
    districts: ["Alappuzha", "Kottayam"],
    crops: [
      { name: "Rice (Pokkali)", efficiency: 92 },
      { name: "Fish Farming", efficiency: 90 },
      { name: "Coconut", efficiency: 85 },
      { name: "Banana", efficiency: 75 },
    ]
  },
  {
    id: "alluvium",
    name: "Mixed Alluvium",
    color: "#9B7653",
    description: "River deposits along major rivers and flood plains. Sandy clay loam to clay texture. Includes famous Kole lands of Thrissur - reclaimed wetlands known for bumper rice harvests.",
    characteristics: ["Fertile", "Flood plains", "Clay-rich", "High yield potential"],
    districts: ["Thrissur", "Palakkad", "Ernakulam"],
    crops: [
      { name: "Rice", efficiency: 95 },
      { name: "Vegetables", efficiency: 90 },
      { name: "Banana", efficiency: 88 },
      { name: "Watermelon", efficiency: 85 },
      { name: "Coconut", efficiency: 82 },
    ]
  },
  {
    id: "black",
    name: "Black Cotton Soils",
    color: "#2C2C2C",
    description: "Unique to Chittur taluk of Palakkad - only occurrence in Kerala. Calcareous with neutral pH (7.2-7.5). High shrink-swell capacity. Ideal for rice, sugarcane and cotton cultivation.",
    characteristics: ["Neutral pH", "High clay content", "Cracks when dry", "Very fertile"],
    districts: ["Palakkad"],
    crops: [
      { name: "Rice", efficiency: 96 },
      { name: "Sugarcane", efficiency: 92 },
      { name: "Cotton", efficiency: 88 },
      { name: "Groundnut", efficiency: 85 },
      { name: "Vegetables", efficiency: 82 },
    ]
  },
  {
    id: "acid-saline",
    name: "Acid Saline Soils",
    color: "#5C4033",
    description: "Found in tidal and estuarine areas along backwaters. High salinity and acidity. Requires careful management with proper drainage. Limited agricultural potential without reclamation.",
    characteristics: ["Tidal influence", "High salinity", "Acidic", "Near backwaters"],
    districts: ["Ernakulam", "Thrissur", "Kannur"],
    crops: [
      { name: "Coconut", efficiency: 78 },
      { name: "Rice (salt-tolerant)", efficiency: 75 },
      { name: "Fish Farming", efficiency: 85 },
    ]
  },
  {
    id: "red",
    name: "Red Soils",
    color: "#A52A2A",
    description: "Found in southern Kerala along foot slopes of laterite hills. Derived from granite and gneiss rocks. Well-drained with sandy loam texture. Less acidic than laterite soils.",
    characteristics: ["Sandy loam", "Well-drained", "Less acidic", "Southern Kerala"],
    districts: ["Thiruvananthapuram", "Kollam"],
    crops: [
      { name: "Cashew", efficiency: 90 },
      { name: "Coconut", efficiency: 88 },
      { name: "Rubber", efficiency: 85 },
      { name: "Tapioca", efficiency: 82 },
      { name: "Banana", efficiency: 80 },
    ]
  }
];

const getEfficiencyColor = (efficiency: number) => {
  if (efficiency >= 90) return "bg-green-500";
  if (efficiency >= 80) return "bg-emerald-500";
  if (efficiency >= 70) return "bg-yellow-500";
  return "bg-orange-500";
};

const KeralaSoilMap = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      
      const container = containerRef.current;
      const scrollTop = container.scrollTop;
      const sectionHeight = container.clientHeight * 0.8;
      
      const newIndex = Math.min(
        Math.floor(scrollTop / sectionHeight),
        keralaSoilTypes.length - 1
      );
      
      if (newIndex !== activeIndex && newIndex >= 0) {
        setActiveIndex(newIndex);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [activeIndex]);

  const scrollToSection = (index: number) => {
    if (containerRef.current) {
      const sectionHeight = containerRef.current.clientHeight * 0.8;
      containerRef.current.scrollTo({
        top: index * sectionHeight,
        behavior: "smooth"
      });
    }
  };

  const activeSoil = keralaSoilTypes[activeIndex];

  return (
    <div className="flex gap-6 h-[calc(100vh-200px)] min-h-[600px]">
      {/* Left Side - Kerala Map with Soil Overlay */}
      <div className="flex-1 relative">
        <Card className="h-full bg-gradient-to-br from-green-50 to-emerald-50 border-0 shadow-lg overflow-hidden">
          <CardContent className="p-0 h-full relative">
            {/* Stylized Kerala Map */}
            <div className="absolute inset-0 flex items-center justify-center">
              <svg 
                viewBox="0 0 200 500" 
                className="h-full w-auto max-w-full p-8"
                style={{ filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.1))" }}
              >
                {/* Kerala outline - simplified shape */}
                <path
                  d="M100,20 
                     C120,40 130,60 125,100
                     C135,120 140,150 130,180
                     C140,200 145,230 135,260
                     C145,290 140,320 130,350
                     C140,380 135,410 120,440
                     C115,460 105,480 90,490
                     C75,485 65,460 60,430
                     C50,400 55,370 65,340
                     C55,310 50,280 60,250
                     C50,220 55,190 70,160
                     C60,130 65,100 80,70
                     C75,50 85,30 100,20Z"
                  fill={activeSoil.color}
                  stroke="#2D5A27"
                  strokeWidth="2"
                  className="transition-all duration-500"
                />
                {/* District markers */}
                {activeSoil.districts.slice(0, 4).map((district, i) => {
                  const positions = [
                    { x: 95, y: 100 },
                    { x: 100, y: 200 },
                    { x: 90, y: 300 },
                    { x: 85, y: 400 },
                  ];
                  return (
                    <g key={district}>
                      <circle
                        cx={positions[i].x}
                        cy={positions[i].y}
                        r="8"
                        fill="white"
                        stroke={activeSoil.color}
                        strokeWidth="2"
                        className="animate-pulse"
                      />
                      <text
                        x={positions[i].x + 15}
                        y={positions[i].y + 5}
                        fill="#1a1a1a"
                        fontSize="10"
                        fontWeight="bold"
                      >
                        {district}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Soil Type Legend */}
            <div className="absolute bottom-4 left-4 right-4">
              <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                <div className="flex items-center gap-2 mb-3">
                  <div 
                    className="w-6 h-6 rounded-full border-2 border-white shadow"
                    style={{ backgroundColor: activeSoil.color }}
                  />
                  <span className="font-bold text-gray-800">{activeSoil.name}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {activeSoil.characteristics.map((char) => (
                    <Badge key={char} variant="secondary" className="text-xs bg-gray-100">
                      {char}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Map Legend - Soil Types */}
            <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-xl p-3 shadow-lg max-w-[160px]">
              <p className="text-xs font-semibold text-gray-600 mb-2">Soil Types</p>
              <div className="space-y-1">
                {keralaSoilTypes.map((soil, index) => (
                  <button
                    key={soil.id}
                    onClick={() => scrollToSection(index)}
                    className={`flex items-center gap-2 w-full text-left p-1 rounded transition-all hover:bg-gray-100 ${
                      index === activeIndex ? "bg-gray-100" : ""
                    }`}
                  >
                    <div 
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: soil.color }}
                    />
                    <span className={`text-xs truncate ${index === activeIndex ? "font-bold" : ""}`}>
                      {soil.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Side - Scrolling Soil Info */}
      <div 
        ref={containerRef}
        className="w-[400px] overflow-y-auto scroll-smooth hide-scrollbar"
        style={{ scrollSnapType: "y mandatory" }}
      >
        {keralaSoilTypes.map((soil, index) => (
          <div
            key={soil.id}
            ref={(el) => (sectionRefs.current[index] = el)}
            className="min-h-[80vh] py-4"
            style={{ scrollSnapAlign: "start" }}
          >
            <Card 
              className={`h-full border-0 shadow-lg transition-all duration-300 ${
                index === activeIndex ? "ring-2 ring-green-500 ring-offset-2" : "opacity-60"
              }`}
              style={{ borderLeft: `4px solid ${soil.color}` }}
            >
              <CardContent className="p-6 h-full flex flex-col">
                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"
                    style={{ backgroundColor: soil.color }}
                  >
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-800">{soil.name}</h3>
                    <p className="text-xs text-gray-500">{soil.districts.length} districts</p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                  {soil.description}
                </p>

                {/* Districts */}
                <div className="mb-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    Found in Districts
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {soil.districts.map((district) => (
                      <Badge 
                        key={district} 
                        className="text-xs text-white"
                        style={{ backgroundColor: soil.color }}
                      >
                        {district}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Suitable Crops */}
                <div className="flex-1">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                    <Leaf className="h-3 w-3 inline mr-1" />
                    Suitable Crops & Efficiency
                  </p>
                  <div className="space-y-2">
                    {soil.crops.map((crop) => (
                      <div 
                        key={crop.name}
                        className="flex items-center justify-between p-2 rounded-lg bg-gray-50"
                      >
                        <span className="text-sm font-medium text-gray-700">{crop.name}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${getEfficiencyColor(crop.efficiency)}`}
                              style={{ width: `${crop.efficiency}%` }}
                            />
                          </div>
                          <span className="text-xs font-bold text-gray-600 w-10 text-right">
                            {crop.efficiency}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Scroll indicator */}
                {index < keralaSoilTypes.length - 1 && (
                  <div className="text-center mt-4 text-gray-400 animate-bounce">
                    <span className="text-xs">↓ Scroll for more</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default KeralaSoilMap;
