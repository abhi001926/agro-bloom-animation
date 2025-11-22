import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, TrendingDown, BarChart3, MapPin, RefreshCw, Download, Calendar, IndianRupee, Activity, AlertTriangle, Loader2 } from "lucide-react";
import keralaCommoditiesChart from "@/assets/kerala-commodities-chart.jpg";
import statewisePricesHeatmap from "@/assets/statewise-prices-heatmap.jpg";
import averagePricesByState from "@/assets/average-prices-by-state.jpg";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { fetchCropPrices, AVAILABLE_COMMODITIES, type CropPriceData } from "@/services/cropPriceService";
import { toast } from "sonner";

// Kerala-focused commodities available in data.gov.in
const KERALA_COMMODITIES = ["Pepper", "Coconut", "Cardamom", "Rice", "Onion", "Potato", "Tomato"];

export default function CropPricesPage() {
  const [selectedCommodity, setSelectedCommodity] = useState("Pepper");
  const [selectedAgg, setSelectedAgg] = useState<"daily" | "monthly" | "yearly">("monthly");
  const [cropData, setCropData] = useState<CropPriceData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCropData = async (commodity: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchCropPrices(commodity, selectedAgg);
      setCropData(data);
      toast.success(`Loaded live data for ${commodity}`);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to load data";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCropData(selectedCommodity);
  }, [selectedCommodity, selectedAgg]);

  const handleRefresh = () => {
    loadCropData(selectedCommodity);
  };

  const handleCommodityChange = (value: string) => {
    setSelectedCommodity(value);
  };

  // Calculate metrics from real data
  const calculateMetrics = () => {
    if (!cropData || cropData.timeseries.length === 0) return null;

    const data = cropData.timeseries;
    const latest = data[data.length - 1];
    const previous = data[data.length - 2];
    
    const currentPrice = latest?.avg || 0;
    const previousPrice = previous?.avg || currentPrice;
    const change = previousPrice > 0 
      ? ((currentPrice - previousPrice) / previousPrice) * 100 
      : 0;

    return {
      current: currentPrice,
      change: Number(change.toFixed(2)),
      trend: change >= 0 ? "up" : "down",
      samples: latest?.samples || 0,
      period: latest?.key || ""
    };
  };

  const metrics = calculateMetrics();
  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-6">
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Kerala Crop Market - Live Prices
            </h1>
            <p className="text-muted-foreground mt-2">Real-time data from data.gov.in AgMark API</p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="hover:scale-105 transition-transform"
              onClick={handleRefresh}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Commodity Selector */}
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <label className="text-sm font-medium">Select Commodity:</label>
          <Select value={selectedCommodity} onValueChange={handleCommodityChange}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {KERALA_COMMODITIES.map(commodity => (
                <SelectItem key={commodity} value={commodity}>
                  {commodity}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedAgg} onValueChange={(v: any) => setSelectedAgg(v)}>
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>

          {cropData && (
            <Badge variant="outline" className="text-sm">
              {cropData.timeseries.length} data points
            </Badge>
          )}
        </div>
      </div>

      {/* Loading & Error States */}
      {loading && (
        <Card className="mb-8 border-0 shadow-lg">
          <CardContent className="p-12 flex flex-col items-center justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-lg text-muted-foreground">Loading live market data...</p>
          </CardContent>
        </Card>
      )}

      {error && (
        <Alert className="mb-8 border-l-4 border-l-red-500 bg-red-50 dark:bg-red-950/20">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription>
            <strong>Error:</strong> {error}
            <br />
            <span className="text-sm">Make sure backend is running with valid API key.</span>
          </AlertDescription>
        </Alert>
      )}

      {/* Market Overview Card */}
      {metrics && !loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50 hover:scale-105 transition-all duration-300 animate-slide-up">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-sm text-muted-foreground">{selectedCommodity}</h3>
                <Badge variant={metrics.trend === "up" ? "default" : "secondary"}>
                  {metrics.trend === "up" ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <IndianRupee className="h-5 w-5 text-primary" />
                  <span className="text-2xl font-bold">₹{metrics.current.toLocaleString()}/Quintal</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className={`flex items-center gap-1 ${metrics.change > 0 ? "text-green-600" : "text-red-600"}`}>
                    {metrics.change > 0 ? "+" : ""}{metrics.change}%
                  </span>
                  <span className="text-muted-foreground">Latest Price</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50 hover:scale-105 transition-all duration-300 animate-slide-up">
            <CardContent className="p-6">
              <h3 className="font-semibold text-sm text-muted-foreground mb-4">Data Period</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  <span className="text-2xl font-bold">{metrics.period}</span>
                </div>
                <p className="text-sm text-muted-foreground capitalize">{selectedAgg} Aggregation</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50 hover:scale-105 transition-all duration-300 animate-slide-up">
            <CardContent className="p-6">
              <h3 className="font-semibold text-sm text-muted-foreground mb-4">Market Samples</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  <span className="text-2xl font-bold">{metrics.samples}</span>
                </div>
                <p className="text-sm text-muted-foreground">Market Records</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-muted/50">
          <TabsTrigger value="overview" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Overview</TabsTrigger>
          <TabsTrigger value="trends" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Price Trends</TabsTrigger>
          <TabsTrigger value="analysis" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Kerala Analysis</TabsTrigger>
          <TabsTrigger value="insights" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Market Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {cropData && cropData.timeseries.length > 0 ? (
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  {selectedCommodity} Price Trend - Live Data
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={cropData.timeseries.map(d => ({
                    period: d.key,
                    price: d.avg,
                    median: d.median
                  }))}>
                    <defs>
                      <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="period" 
                      tick={{ fontSize: 12 }} 
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: 'none', 
                        borderRadius: '8px', 
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
                      }}
                      formatter={(value: any) => [`₹${value}/Quintal`, 'Price']}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="price" 
                      stroke="#10b981" 
                      fillOpacity={1} 
                      fill="url(#priceGradient)" 
                      strokeWidth={3}
                      name="Average Price"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          ) : (
            <Alert>
              <AlertDescription>No data available. Select a commodity to view prices.</AlertDescription>
            </Alert>
          )}
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          {cropData && cropData.timeseries.length > 0 ? (
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  {selectedCommodity} Detailed Price Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={cropData.timeseries.map(d => ({
                    period: d.key,
                    average: d.avg,
                    median: d.median,
                    samples: d.samples
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="period" 
                      tick={{ fontSize: 12 }}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: 'none', 
                        borderRadius: '8px', 
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
                      }}
                      formatter={(value: any, name: string) => {
                        if (name === 'samples') return [value, 'Market Samples'];
                        return [`₹${value}/Quintal`, name === 'average' ? 'Average Price' : 'Median Price'];
                      }}
                    />
                    <Bar dataKey="average" fill="#10b981" name="Average" />
                    <Bar dataKey="median" fill="#3b82f6" name="Median" />
                  </BarChart>
                </ResponsiveContainer>
                
                <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <strong>Data Source:</strong> data.gov.in AgMark API | 
                    <strong> Aggregation:</strong> {selectedAgg.charAt(0).toUpperCase() + selectedAgg.slice(1)} | 
                    <strong> Total Records:</strong> {cropData.timeseries.reduce((sum, d) => sum + (d.samples || 0), 0)}
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Alert>
              <AlertDescription>No trend data available.</AlertDescription>
            </Alert>
          )}
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6">
        <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Kerala Market Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert className="border-l-4 border-l-green-500 bg-green-50 dark:bg-green-950/20">
                <BarChart3 className="h-4 w-4 text-green-600" />
                <AlertDescription>
                  <strong>High-Value Crops:</strong> Kerala's latest prices are highest for perennial/plantation and processed crops (pepper, coconut oil, coffee), which generally signals strong demand/value density.
                </AlertDescription>
              </Alert>
              
              <Alert className="border-l-4 border-l-blue-500 bg-blue-50 dark:bg-blue-950/20">
                <MapPin className="h-4 w-4 text-blue-600" />
                <AlertDescription>
                  <strong>Regional Variations:</strong> The heatmap shows substantial cross-state variation for many fruits/vegetables; plantation crops stand out where they're grown (e.g., Kerala for pepper/coconut derivatives).
                </AlertDescription>
              </Alert>
              
              <Alert className="border-l-4 border-l-purple-500 bg-purple-50 dark:bg-purple-950/20">
                <TrendingUp className="h-4 w-4 text-purple-600" />
                <AlertDescription>
                  <strong>Market Position:</strong> Kerala's overall average modal price (latest per commodity) is currently among the highest across the listed states, hinting at tight supply or higher quality mix.
                </AlertDescription>
              </Alert>
              
              {/* Data Visualization Charts */}
              <div className="grid gap-6 mt-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-lg flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    Kerala Commodity Prices (Sept 2025)
                  </h4>
                  <div className="rounded-lg overflow-hidden shadow-lg border hover:shadow-xl transition-shadow">
                    <img 
                      src={keralaCommoditiesChart} 
                      alt="Kerala Commodities by Modal Price showing pepper and coconut oil as highest priced crops"
                      className="w-full animate-fade-in hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-semibold flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-primary" />
                      State-wise Price Heatmap
                    </h4>
                    <div className="rounded-lg overflow-hidden shadow-lg border hover:shadow-xl transition-shadow">
                      <img 
                        src={statewisePricesHeatmap} 
                        alt="Heatmap showing statewise modal prices across different commodities"
                        className="w-full animate-fade-in hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-semibold flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-primary" />
                      Average Prices by State
                    </h4>
                    <div className="rounded-lg overflow-hidden shadow-lg border hover:shadow-xl transition-shadow">
                      <img 
                        src={averagePricesByState} 
                        alt="Bar chart showing Kerala leading in average modal prices across states"
                        className="w-full animate-fade-in hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid gap-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-primary" />
                  Market Alerts & Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert className="border-l-4 border-l-amber-500 bg-amber-50 dark:bg-amber-950/20">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  <AlertDescription>
                    <strong>Price Surge Alert:</strong> Pepper prices in Kerala have increased by 12.5% in the last week due to reduced supply and export demand.
                  </AlertDescription>
                </Alert>
                
                <Alert className="border-l-4 border-l-green-500 bg-green-50 dark:bg-green-950/20">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <AlertDescription>
                    <strong>Investment Opportunity:</strong> Coffee prices show consistent upward trend. Consider strategic purchasing for the next quarter.
                  </AlertDescription>
                </Alert>
                
                <Alert className="border-l-4 border-l-blue-500 bg-blue-50 dark:bg-blue-950/20">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <AlertDescription>
                    <strong>Seasonal Forecast:</strong> Monsoon season ending may affect supply chains. Monitor rice and wheat prices closely.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
