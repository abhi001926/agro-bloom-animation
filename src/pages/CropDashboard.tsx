import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CropDashboard() {
  const [crops, setCrops] = useState([]);
  const [state, setState] = useState("Kerala");

  useEffect(() => {
    fetchCrops(state);
  }, [state]);

  async function fetchCrops(selectedState) {
    try {
      const res = await fetch(`http://localhost:5000/api/crop/prices?commodity=Pepper`);

      const data = await res.json();
      if (!data.error) {
        setCrops(data);
      } else {
        setCrops([]);
      }
    } catch (err) {
      console.error("❌ Frontend Error:", err);
      setCrops([]);
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">🌾 Live Crop Prices</h1>

      {/* State Selector */}
      <select
        value={state}
        onChange={(e) => setState(e.target.value)}
        className="border p-2 rounded mb-6"
      >
        <option value="Kerala">Kerala</option>
        <option value="Punjab">Punjab</option>
        <option value="Haryana">Haryana</option>
        <option value="Maharashtra">Maharashtra</option>
        <option value="West Bengal">West Bengal</option>
      </select>

      {/* Crops List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {crops.length > 0 ? (
          crops.map((crop, idx) => (
            <Card key={idx} className="shadow-md hover:shadow-lg transition">
              <CardHeader>
                <CardTitle>{crop.commodity}</CardTitle>
              </CardHeader>
              <CardContent>
                <p><strong>State:</strong> {crop.state}</p>
                <p><strong>District:</strong> {crop.district}</p>
                <p><strong>Market:</strong> {crop.market}</p>
                <p><strong>Price:</strong> ₹{crop.modal_price} / Quintal</p>
                <p className="text-sm text-gray-500">Date: {crop.arrival_date}</p>
              </CardContent>
            </Card>
          ))
        ) : (
          <p>⚠️ No data found for {state}</p>
        )}
      </div>
    </div>
  );
}
