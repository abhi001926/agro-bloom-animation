// Crop Price Service - Fetches real data from data.gov.in via backend

const BACKEND_URL = "http://localhost:5000";

export interface PriceDataPoint {
  key: string;
  period: string;
  avg: number;
  median?: number;
  samples?: number;
}

export interface CropPriceData {
  commodity: string;
  agg: string;
  timeseries: PriceDataPoint[];
}

/**
 * Fetch crop price data from data.gov.in
 * @param commodity - Crop name (e.g., "Wheat", "Rice", "Onion")
 * @param agg - Aggregation type: "daily", "monthly", or "yearly"
 */
export async function fetchCropPrices(
  commodity: string,
  agg: "daily" | "monthly" | "yearly" = "monthly"
): Promise<CropPriceData> {
  try {
    const response = await fetch(
      `${BACKEND_URL}/api/crops/${encodeURIComponent(commodity)}?agg=${agg}`
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch crop prices: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching crop prices:", error);
    throw error;
  }
}

/**
 * Available commodities from AgMark data
 */
export const AVAILABLE_COMMODITIES = [
  "Wheat",
  "Rice",
  "Onion",
  "Potato",
  "Tomato",
  "Maize",
  "Soyabean",
  "Cotton",
  "Groundnut",
  "Turmeric",
  "Pepper",
  "Cardamom",
  "Coconut"
];
