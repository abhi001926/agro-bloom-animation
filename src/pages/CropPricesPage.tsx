import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { TrendingUp, BarChart3, MapPin } from "lucide-react";
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

      {/* Market Insights Section */}
      <div className="grid gap-6 mt-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Kerala Market Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <BarChart3 className="h-4 w-4" />
              <AlertDescription>
                <strong>High-Value Crops:</strong> Kerala's latest prices are highest for perennial/plantation and processed crops (pepper, coconut oil, coffee), which generally signals strong demand/value density.
              </AlertDescription>
            </Alert>
            
            <Alert>
              <MapPin className="h-4 w-4" />
              <AlertDescription>
                <strong>Regional Variations:</strong> The heatmap shows substantial cross-state variation for many fruits/vegetables; plantation crops stand out where they're grown (e.g., Kerala for pepper/coconut derivatives).
              </AlertDescription>
            </Alert>
            
            <Alert>
              <TrendingUp className="h-4 w-4" />
              <AlertDescription>
                <strong>Market Position:</strong> Kerala's overall average modal price (latest per commodity) is currently among the highest across the listed states, hinting at tight supply or higher quality mix.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
