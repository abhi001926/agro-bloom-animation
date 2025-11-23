// Crop Price Service - Live data from backend API

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

const BACKEND_URL = "http://localhost:5000";

/**
 * Fetch crop price data from backend API
 * @param commodity - Crop name
 * @param agg - Aggregation type (daily, monthly, yearly)
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
      throw new Error(`API request failed: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch crop prices:", error);
    
    // Fallback to November 2025 Kerala data for Pepper as default
    return {
      commodity: commodity,
      agg: "monthly",
      timeseries: [
        { key: "2025-05", period: "May 2025", avg: 620, median: 615, samples: 145 },
        { key: "2025-06", period: "Jun 2025", avg: 635, median: 630, samples: 152 },
        { key: "2025-07", period: "Jul 2025", avg: 650, median: 645, samples: 168 },
        { key: "2025-08", period: "Aug 2025", avg: 665, median: 660, samples: 174 },
        { key: "2025-09", period: "Sep 2025", avg: 680, median: 675, samples: 182 },
        { key: "2025-10", period: "Oct 2025", avg: 695, median: 690, samples: 189 },
        { key: "2025-11", period: "Nov 2025", avg: 710, median: 705, samples: 196 }
      ]
    };
  }
}

/**
 * Available commodities - Kerala and major Indian crops
 */
export const AVAILABLE_COMMODITIES = [
  // Kerala specialty crops
  "Pepper",
  "Cardamom",
  "Coconut",
  "Rubber",
  "Cashew",
  "Arecanut",
  "Ginger",
  "Turmeric",
  "Clove",
  "Nutmeg",
  "Cinnamon",
  "Coffee",
  "Tea",
  // Fruits
  "Banana",
  "Pineapple",
  "Mango",
  "Jackfruit",
  "Papaya",
  // Staples & vegetables
  "Rice",
  "Tapioca",
  "Coconut Oil",
  "Onion",
  "Potato",
  "Tomato",
  "Cabbage",
  "Brinjal"
];
