import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { TrendingUp, BarChart3, MapPin } from "lucide-react";
import keralaCommoditiesChart from "@/assets/kerala-commodities-chart.jpg";
import statewisePricesHeatmap from "@/assets/statewise-prices-heatmap.jpg";
import averagePricesByState from "@/assets/average-prices-by-state.jpg";
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
            
            {/* Data Visualization Charts */}
            <div className="grid gap-4 mt-6">
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Kerala Commodity Prices (Sept 2025)</h4>
                <img 
                  src={keralaCommoditiesChart} 
                  alt="Kerala Commodities by Modal Price showing pepper and coconut oil as highest priced crops"
                  className="w-full rounded-lg border animate-fade-in"
                />
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">State-wise Price Heatmap</h4>
                  <img 
                    src={statewisePricesHeatmap} 
                    alt="Heatmap showing statewise modal prices across different commodities"
                    className="w-full rounded-lg border animate-fade-in"
                  />
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Average Prices by State</h4>
                  <img 
                    src={averagePricesByState} 
                    alt="Bar chart showing Kerala leading in average modal prices across states"
                    className="w-full rounded-lg border animate-fade-in"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
