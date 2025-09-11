import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function CropPricesPage() {
  const [data, setData] = useState<any[]>([]);
  const [commodity, setCommodity] = useState("Wheat");

  useEffect(() => {
    fetch(`http://localhost:5000/api/crops/${commodity}?agg=monthly`)
      .then((res) => res.json())
      .then((json) => setData(json.timeseries || []))
      .catch(console.error);
  }, [commodity]);

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>{commodity} Prices (Avg Monthly)</CardTitle>
        </CardHeader>
        <CardContent>
          <select
            value={commodity}
            onChange={(e) => setCommodity(e.target.value)}
            className="p-2 border rounded mb-4"
          >
            <option>Wheat</option>
            <option>Rice</option>
            <option>Maize</option>
            <option>Soybean</option>
          </select>

          {data.length ? (
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip formatter={(val: any) => `₹${val}`} />
                <Line type="monotone" dataKey="avg" stroke="#82ca9d" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p>No data available.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
