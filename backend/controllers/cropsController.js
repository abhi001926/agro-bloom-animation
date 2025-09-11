import fetch from "node-fetch";

// Controller to fetch crop price data
export const getCropPrices = async (req, res) => {
  const { commodity } = req.params;
  const { from, to, agg = "monthly" } = req.query;

  try {
    const API_KEY = process.env.CROP_API_KEY;
    if (!API_KEY) {
      console.error("❌ Missing API key! Did you set CROP_API_KEY in .env?");
      return res.status(500).json({ error: "API key missing" });
    }

    // Agmarknet Daily Prices dataset on data.gov.in
    const resourceId = "9ef84268-d588-465a-a308-a864a43d0070";

    let url = `https://api.data.gov.in/resource/${resourceId}?format=json&api-key=${API_KEY}&filters[commodity]=${commodity}`;

    // Optional date filters
    if (from) url += `&filters[arrival_date]=${from}`;
    if (to) url += `&filters[arrival_date]=${to}`;

    console.log("🌾 Fetching crop prices from URL:", url);

    const response = await fetch(url);
    const data = await response.json();

    if (!data.records || data.records.length === 0) {
      console.log("⚠️ No records found for", commodity);
      return res.status(404).json({ error: "No crop price data found" });
    }

    // Example: aggregate monthly/yearly prices
    let processedData = data.records;

    if (agg === "monthly") {
      processedData = groupBy(processedData, "month");
    } else if (agg === "yearly") {
      processedData = groupBy(processedData, "year");
    }

    res.json({
      commodity,
      total: data.total,
      count: processedData.length,
      records: processedData,
    });
  } catch (error) {
    console.error("❌ Failed crop price data:", error.message);
    res.status(500).json({ error: "Failed to fetch crop prices" });
  }
};

// Simple grouping helper
function groupBy(data, type) {
  const grouped = {};

  data.forEach((record) => {
    const date = new Date(record.arrival_date);
    let key;

    if (type === "month") {
      key = `${date.getFullYear()}-${date.getMonth() + 1}`;
    } else if (type === "year") {
      key = `${date.getFullYear()}`;
    }

    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(record);
  });

  // Example: average modal_price for each group
  return Object.entries(grouped).map(([key, records]) => {
    const avgPrice =
      records.reduce((sum, r) => sum + Number(r.modal_price || 0), 0) /
      records.length;

    return {
      period: key,
      averagePrice: avgPrice.toFixed(2),
      records,
    };
  });
}
