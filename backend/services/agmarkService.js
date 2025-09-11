import axios from "axios";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

const RESOURCE_ID = process.env.RESOURCE_ID || "9ef84268-d588-465a-a308-a864a43d0070";
const API_KEY = process.env.AGMARK_API_KEY;
const BASE_URL = `https://api.data.gov.in/resource/${RESOURCE_ID}`;
const PAGE_SIZE = 1000;
const CACHE_DIR = path.resolve(process.cwd(), "cache");
const CACHE_TTL_HOURS = Number(process.env.CACHE_TTL_HOURS || 24);

if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR, { recursive: true });

/**
 * Build cache file path
 */
const cachePath = (commodity, from, to, agg) => {
  const name = `${commodity.replace(/\s+/g, "_")}_${from || "all"}_${to || "all"}_${agg}.json`;
  return path.join(CACHE_DIR, name);
};

/**
 * Is cache fresh
 */
const isFresh = (filePath) => {
  if (!fs.existsSync(filePath)) return false;
  const stat = fs.statSync(filePath);
  const ageMs = Date.now() - stat.mtimeMs;
  return ageMs < CACHE_TTL_HOURS * 3600 * 1000;
};

/**
 * Fetch pages from data.gov.in resource
 */
async function fetchPages(commodity) {
  let offset = 0;
  let all = [];
  while (true) {
    const params = {
      "api-key": API_KEY,
      format: "json",
      limit: PAGE_SIZE,
      offset
    };
    // filter commodity in API
    params["filters[commodity]"] = commodity;
    const resp = await axios.get(BASE_URL, { params, timeout: 20000 });
    const records = resp.data.records || [];
    if (records.length === 0) break;
    all = all.concat(records);
    if (records.length < PAGE_SIZE) break;
    offset += PAGE_SIZE;
    // polite delay
    await new Promise((r) => setTimeout(r, 200));
  }
  return all;
}

/**
 * Aggregate rows into timeseries (daily/monthly/yearly)
 */
function aggregate(rows, agg, from, to) {
  // normalize and filter by date range
  const filtered = rows
    .map((r) => {
      const date = r.arrival_date || r.date || r.date_of_arrival || null;
      const modal = Number(r.modal_price || r.modalprice || r.modal_price_with_unit || 0);
      return { date, modal, market: r.market, state: r.state };
    })
    .filter((r) => r.date && !isNaN(r.modal) && r.modal > 0);

  let byKey = {}; // key -> [modal prices]
  for (const r of filtered) {
    // date normalization YYYY-MM-DD
    const d = r.date.split("T")[0];
    if (from && new Date(d) < new Date(from)) continue;
    if (to && new Date(d) > new Date(to)) continue;

    let key;
    if (agg === "daily") {
      key = d;
    } else if (agg === "monthly") {
      const dt = new Date(d);
      key = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}`;
    } else if (agg === "yearly") {
      key = new Date(d).getFullYear().toString();
    } else {
      key = d;
    }
    if (!byKey[key]) byKey[key] = [];
    byKey[key].push(r.modal);
  }

  const keys = Object.keys(byKey).sort();
  const timeseries = keys.map((k) => {
    const vals = byKey[k];
    const avg = Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
    const median = (() => {
      const s = vals.slice().sort((a,b)=>a-b);
      const m = Math.floor(s.length/2);
      return s.length % 2 ? s[m] : Math.round((s[m-1]+s[m])/2);
    })();
    return { key: k, avg, median, samples: vals.length };
  });

  return timeseries;
}

/**
 * Main function: fetch or return cache, aggregate and return
 */
export async function fetchAndAggregate({ commodity, from=null, to=null, agg="monthly", force=false }) {
  if (!API_KEY) throw new Error("No AGMARK API key set in env");

  const file = cachePath(commodity, from, to, agg);

  if (!force && isFresh(file)) {
    // return cached
    const raw = fs.readFileSync(file, "utf8");
    return JSON.parse(raw);
  }

  // fetch pages (this may be slow for wide commodity)
  const rows = await fetchPages(commodity);

  const timeseries = aggregate(rows, agg, from, to);

  const out = {
    commodity,
    agg,
    from,
    to,
    generatedAt: new Date().toISOString(),
    timeseries
  };

  fs.writeFileSync(file, JSON.stringify(out, null, 2), "utf8");
  return out;
}
