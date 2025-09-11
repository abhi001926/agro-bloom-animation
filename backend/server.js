import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = 5000;

app.use(cors());

app.get("/", (req, res) => {
  res.send("✅ Agro backend is running");
});

// 🔹 Crops Price API
app.get("/api/crops/:commodity", async (req, res) => {
  try {
    const { commodity } = req.params;
    const { agg = "monthly" } = req.query;

    const BASE_URL = `https://api.data.gov.in/resource/${process.env.RESOURCE_ID}`;

    let offset = 0;
    const limit = 1000;
    let allRecords = [];

    // 🔄 Loop through API pagination
    while (true) {
      const { data } = await axios.get(BASE_URL, {
        params: {
          "api-key": process.env.AGMARK_API_KEY,
          format: "json",
          limit,
          offset,
          "filters[commodity]": commodity,
        },
      });

      const records = data.records;
      if (!records || records.length === 0) break;

      allRecords = allRecords.concat(records);
      if (records.length < limit) break;
      offset += limit;
    }

    if (!allRecords.length) {
      return res.json({ commodity, timeseries: [] });
    }

    // 🔹 Aggregate monthly average prices
    const buckets = {};
    allRecords.forEach((r) => {
      const dt = new Date(r.arrival_date);
      const ym = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}`;
      const price = Number(r.modal_price);
      if (!isNaN(price)) {
        buckets[ym] = buckets[ym] || [];
        buckets[ym].push(price);
      }
    });

    const timeseries = Object.entries(buckets)
      .sort(([a], [b]) => (a > b ? 1 : -1))
      .map(([ym, arr]) => ({
        period: ym,
        avg: Math.round(arr.reduce((s, v) => s + v, 0) / arr.length),
      }));

    res.json({ commodity, agg, timeseries });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch crop price data" });
  }
});

app.listen(PORT, () => {
  console.log(`🌾 Agro backend running at http://localhost:${PORT}`);
});
