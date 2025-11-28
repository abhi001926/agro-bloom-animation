import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function CropPrice() {
  const [records, setRecords] = useState([]);
  const [states, setStates] = useState([]);
  const [crops, setCrops] = useState([]);

  const [state, setState] = useState("Kerala"); // default Kerala
  const [crop, setCrop] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_KEY = "579b464db66ec23bdd000001562b571ba6034b325dc0fd19701d8e7a";
  const RESOURCE_ID = "9ef84268-d588-465a-a308-a864a43d0070";

  // 🔥 1) Fetch all states & crops dynamically from API
  useEffect(() => {
    async function loadFilters() {
      const url = `https://api.data.gov.in/resource/${RESOURCE_ID}?api-key=${API_KEY}&format=json&limit=5000`;

      try {
        const res = await fetch(url);
        const json = await res.json();

        if (!json.records) return;

        const uniqueStates = [...new Set(json.records.map((r) => r.state))];
        const uniqueCrops = [...new Set(json.records.map((r) => r.commodity))];

        setStates(uniqueStates.sort());
        setCrops(uniqueCrops.sort());
      } catch (err) {
        console.log("Filter load error:", err);
      }
    }

    loadFilters();
  }, []);

  // 🔥 2) Fetch crop price records according to filters
  async function fetchData() {
    setLoading(true);
    setError("");
    setRecords([]);

    try {
      let url = `https://api.data.gov.in/resource/${RESOURCE_ID}?api-key=${API_KEY}&format=json&limit=50&filters[state]=${state}`;

      if (crop.trim() !== "") {
        url += `&filters[commodity]=${crop}`;
      }

      const res = await fetch(url);
      const json = await res.json();

      if (!json.records) throw new Error("No crop records found");

      setRecords(json.records);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (state) fetchData();
  }, [state, crop]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Crop Prices</h2>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">

        {/* State Filter */}
        <select
          value={state}
          onChange={(e) => setState(e.target.value)}
          className="border p-2 rounded-md"
        >
          {states.map((st, i) => (
            <option key={i} value={st}>{st}</option>
          ))}
        </select>

        {/* Crop Filter */}
        <select
          value={crop}
          onChange={(e) => setCrop(e.target.value)}
          className="border p-2 rounded-md"
        >
          <option value="">All Crops</option>
          {crops.map((cp, i) => (
            <option key={i} value={cp}>{cp}</option>
          ))}
        </select>
      </div>

      {/* Loading */}
      {loading && <p className="text-gray-600">Loading crop prices...</p>}

      {/* Error */}
      {error && <p className="text-red-500">{error}</p>}

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {!loading &&
          !error &&
          records.map((item, i) => (
            <Card key={i} className="shadow-md">
              <CardHeader>
                <CardTitle className="text-lg">{item.commodity}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 text-sm">
                <p>
                  <span className="font-semibold">Market:</span> {item.market}
                </p>
                <p>
                  <span className="font-semibold">Price:</span> ₹{item.modal_price} / quintal
                </p>

                {/* 👇 DATE REMOVED AS YOU REQUESTED */}

                <p>
                  <span className="font-semibold">State:</span> {item.state}
                </p>
              </CardContent>
            </Card>
          ))}
      </div>

      {records.length === 0 && !loading && !error && (
        <p>No crop records found for this filter.</p>
      )}
    </div>
  );
}
