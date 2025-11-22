// Soil Data Service - Structure for data.gov.in integration
// NOTE: data.gov.in does not currently have a public soil data API
// This is a template structure - replace with actual API when available

const BACKEND_URL = "http://localhost:5000";

export interface SoilData {
  location: string;
  district: string;
  soilType: string;
  moisture: number;
  temperature: number;
  ph: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  organicMatter: number;
  conductivity: number;
  elevation: string;
  rainfall: string;
  majorCrops: string[];
  lastUpdated: string;
}

/**
 * Fetch soil data for a specific district
 * 
 * ⚠️ IMPORTANT: data.gov.in does not have a public soil data API yet
 * 
 * To integrate when API becomes available:
 * 1. Get API key from https://data.gov.in/
 * 2. Add SOIL_API_KEY to backend/.env
 * 3. Find the Resource ID for soil data
 * 4. Update this function to call: /api/soil/:district
 * 5. Create backend endpoint similar to crops endpoint
 */
export async function fetchSoilData(district: string): Promise<SoilData> {
  try {
    // TODO: Replace with actual API call when available
    // const response = await fetch(`${BACKEND_URL}/api/soil/${district}`);
    
    throw new Error(
      "Soil data API not available. data.gov.in does not currently provide " +
      "a public REST API for soil health data. Visit soilhealth.dac.gov.in " +
      "for manual data access."
    );
  } catch (error) {
    console.error("Soil data API not available:", error);
    throw error;
  }
}

/**
 * Mock data structure for Kerala districts
 * Use this until real API is available
 */
export const KERALA_SOIL_DATA: Record<string, SoilData> = {
  thiruvananthapuram: {
    location: "Thiruvananthapuram District (Laterite Soil)",
    district: "Thiruvananthapuram",
    soilType: "Laterite",
    moisture: 72,
    temperature: 28,
    ph: 5.2,
    nitrogen: 38,
    phosphorus: 28,
    potassium: 42,
    organicMatter: 2.8,
    conductivity: 0.8,
    elevation: "50m MSL",
    rainfall: "1800mm/year",
    majorCrops: ["Coconut", "Rubber", "Cashew"],
    lastUpdated: "Mock Data"
  },
  ernakulam: {
    location: "Ernakulam District (Coastal Alluvium)",
    district: "Ernakulam",
    soilType: "Coastal Alluvium",
    moisture: 85,
    temperature: 26,
    ph: 6.1,
    nitrogen: 52,
    phosphorus: 45,
    potassium: 68,
    organicMatter: 4.2,
    conductivity: 1.2,
    elevation: "3m MSL",
    rainfall: "2400mm/year",
    majorCrops: ["Rice", "Coconut", "Vegetables"],
    lastUpdated: "Mock Data"
  },
  wayanad: {
    location: "Wayanad District (Hill Soil)",
    district: "Wayanad",
    soilType: "Hill Soil (Forest)",
    moisture: 78,
    temperature: 22,
    ph: 5.8,
    nitrogen: 65,
    phosphorus: 58,
    potassium: 72,
    organicMatter: 6.5,
    conductivity: 0.6,
    elevation: "800m MSL",
    rainfall: "3500mm/year",
    majorCrops: ["Coffee", "Pepper", "Cardamom"],
    lastUpdated: "Mock Data"
  },
  alappuzha: {
    location: "Alappuzha District (Kari Soil)",
    district: "Alappuzha",
    soilType: "Kari (Organic Clay)",
    moisture: 95,
    temperature: 27,
    ph: 4.8,
    nitrogen: 48,
    phosphorus: 35,
    potassium: 55,
    organicMatter: 8.2,
    conductivity: 2.1,
    elevation: "1m MSL",
    rainfall: "2100mm/year",
    majorCrops: ["Rice", "Coconut", "Fish farming"],
    lastUpdated: "Mock Data"
  },
  palakkad: {
    location: "Palakkad District (Black Cotton Soil)",
    district: "Palakkad",
    soilType: "Black Cotton",
    moisture: 62,
    temperature: 29,
    ph: 7.2,
    nitrogen: 58,
    phosphorus: 62,
    potassium: 78,
    organicMatter: 3.8,
    conductivity: 1.8,
    elevation: "100m MSL",
    rainfall: "1200mm/year",
    majorCrops: ["Rice", "Sugarcane", "Cotton"],
    lastUpdated: "Mock Data"
  }
};
