import { fetchAndAggregate } from "../services/agmarkService.js";

// Controller to fetch crop price data
export const getCropPrices = async (req, res) => {
  const { commodity } = req.params;
  const { from, to, agg = "monthly", force } = req.query;

  try {
    console.log(`🌾 Fetching ${commodity} prices (${agg} aggregation)`);
    
    const result = await fetchAndAggregate({
      commodity,
      from: from || null,
      to: to || null,
      agg,
      force: force === "true"
    });

    // Transform to match frontend expectations
    const response = {
      commodity: result.commodity,
      agg: result.agg,
      timeseries: result.timeseries.map(item => ({
        key: item.key,
        period: item.key,
        avg: item.avg,
        median: item.median,
        samples: item.samples
      }))
    };

    console.log(`✅ Returning ${response.timeseries.length} data points for ${commodity}`);
    res.json(response);
  } catch (error) {
    console.error("❌ Failed to fetch crop price data:", error.message);
    res.status(500).json({ 
      error: "Failed to fetch crop prices",
      message: error.message,
      commodity,
      timeseries: []
    });
  }
};
