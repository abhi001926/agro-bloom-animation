import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, TrendingDown, BarChart3, MapPin, RefreshCw, Calendar, IndianRupee, Activity, AlertTriangle, Loader2, ShoppingCart } from "lucide-react";
import keralaCommoditiesChart from "@/assets/kerala-commodities-chart.jpg";
import statewisePricesHeatmap from "@/assets/statewise-prices-heatmap.jpg";
import averagePricesByState from "@/assets/average-prices-by-state.jpg";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from "recharts";
import { fetchCropPrices, AVAILABLE_COMMODITIES, type CropPriceData } from "@/services/cropPriceService";
import { toast } from "sonner";

const API_KEY = "579b464db66ec23bdd000001fb1a14d5903f45f542eaea0b8525b155";
const RESOURCE_ID = "9ef84268-d588-465a-a308-a864a43d0070";

interface CropRecord {
  commodity: string;
  market: string;
  modal_price: string;
  state: string;
  district?: string;
  variety?: string;
}

export default function CropPricesPage() {
  // Live prices state
  const [records, setRecords] = useState<CropRecord[]>([]);
  const [states, setStates] = useState<string[]>([]);
  const [crops, setCrops] = useState<string[]>([]);
  const [selectedState, setSelectedState] = useState("Kerala");
  const [selectedCrop, setSelectedCrop] = useState("");
  const [liveLoading, setLiveLoading] = useState(false);
  const [liveError, setLiveError] = useState("");

  // Analysis state
  const [selectedCommodity, setSelectedCommodity] = useState("Pepper");
  const [selectedAgg, setSelectedAgg] = useState<"daily" | "monthly" | "yearly">("monthly");
  const [cropData, setCropData] = useState<CropPriceData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const KERALA_COMMODITIES = ["Pepper", "Coconut", "Cardamom", "Rice", "Onion", "Potato", "Tomato"];

  // Load filters for live prices
  useEffect(() => {
    async function loadFilters() {
      const url = `https://api.data.gov.in/resource/${RESOURCE_ID}?api-key=${API_KEY}&format=json&limit=2000`;

      try {
        const res = await fetch(url, { mode: "cors", cache: "no-store" });
        const json = await res.json();

        if (!json.records) return;

        const uniqueStates = [...new Set(json.records.map((r: any) => r.state))] as string[];
        const uniqueCrops = [...new Set(json.records.map((r: any) => r.commodity))] as string[];

        setStates(uniqueStates.sort());
        setCrops(uniqueCrops.sort());
      } catch (err) {
        console.log("Filter load error:", err);
      }
    }

    loadFilters();
  }, []);

  // Fetch live crop prices
  async function fetchLiveData() {
    setLiveLoading(true);
    setLiveError("");
    setRecords([]);

    try {
      let url = `https://api.data.gov.in/resource/${RESOURCE_ID}?api-key=${API_KEY}&format=json&limit=50&filters[state]=${selectedState}`;

      if (selectedCrop.trim() !== "") {
        url += `&filters[commodity]=${selectedCrop}`;
      }

      const res = await fetch(url);
      const json = await res.json();

      if (!json.records) throw new Error("No crop records found");

      setRecords(json.records);
    } catch (err: any) {
      setLiveError(err.message);
    } finally {
      setLiveLoading(false);
    }
  }

  useEffect(() => {
    if (selectedState) fetchLiveData();
  }, [selectedState, selectedCrop]);

  // Load analysis data
  const loadCropData = async (commodity: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchCropPrices(commodity, selectedAgg);
      setCropData(data);
      toast.success(`Loaded data for ${commodity}`);
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
    fetchLiveData();
    loadCropData(selectedCommodity);
  };

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
          <Button 
            variant="outline" 
            size="sm" 
            className="hover:scale-105 transition-transform"
            onClick={handleRefresh}
            disabled={liveLoading || loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${(liveLoading || loading) ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      <Tabs defaultValue="live" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-muted/50">
          <TabsTrigger value="live" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <ShoppingCart className="h-4 w-4 mr-2" />
            Live Prices
          </TabsTrigger>
          <TabsTrigger value="trends" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <BarChart3 className="h-4 w-4 mr-2" />
            Price Trends
          </TabsTrigger>
          <TabsTrigger value="analysis" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <TrendingUp className="h-4 w-4 mr-2" />
            Kerala Analysis
          </TabsTrigger>
          <TabsTrigger value="insights" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Activity className="h-4 w-4 mr-2" />
            Market Insights
          </TabsTrigger>
        </TabsList>

        {/* Live Prices Tab */}
        <TabsContent value="live" className="space-y-6">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <Select value={selectedState} onValueChange={setSelectedState}>
              <SelectTrigger className="w-full md:w-64">
                <SelectValue placeholder="Select State" />
              </SelectTrigger>
              <SelectContent>
                {states.map((st) => (
                  <SelectItem key={st} value={st}>{st}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedCrop} onValueChange={setSelectedCrop}>
              <SelectTrigger className="w-full md:w-64">
                <SelectValue placeholder="All Crops" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Crops</SelectItem>
                {crops.map((cp) => (
                  <SelectItem key={cp} value={cp}>{cp}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Loading */}
          {liveLoading && (
            <Card className="border-0 shadow-lg">
              <CardContent className="p-12 flex flex-col items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                <p className="text-lg text-muted-foreground">Loading crop prices...</p>
              </CardContent>
            </Card>
          )}

          {/* Error */}
          {liveError && (
            <Alert className="border-l-4 border-l-destructive bg-destructive/10">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{liveError}</AlertDescription>
            </Alert>
          )}

          {/* Price Cards */}
          {!liveLoading && !liveError && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {records.map((item, i) => (
                <Card
                  key={i}
                  className="shadow-lg bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border border-green-200 dark:border-green-800 hover:scale-105 transition-all duration-300"
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl font-bold text-green-900 dark:text-green-100">
                      {item.commodity}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-3 text-green-800 dark:text-green-200">
                    <p className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span className="font-medium">Market:</span>
                      <span>{item.market}</span>
                    </p>

                    <p className="flex items-center gap-2">
                      <IndianRupee className="h-4 w-4" />
                      <span className="font-medium">Price:</span>
                      <span className="text-lg font-bold">₹{item.modal_price}/quintal</span>
                    </p>

                    <p className="flex items-center gap-2">
                      <Activity className="h-4 w-4" />
                      <span className="font-medium">State:</span>
                      <span>{item.state}</span>
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {records.length === 0 && !liveLoading && !liveError && (
            <Alert>
              <AlertDescription>No crop records found for this filter.</AlertDescription>
            </Alert>
          )}
        </TabsContent>

        {/* Price Trends Tab */}
        <TabsContent value="trends" className="space-y-6">
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <Select value={selectedCommodity} onValueChange={setSelectedCommodity}>
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

          {/* Metrics Cards */}
          {metrics && !loading && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-muted/50 hover:scale-105 transition-all duration-300">
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

              <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-muted/50 hover:scale-105 transition-all duration-300">
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

              <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-muted/50 hover:scale-105 transition-all duration-300">
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

          {loading && (
            <Card className="border-0 shadow-lg">
              <CardContent className="p-12 flex flex-col items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                <p className="text-lg text-muted-foreground">Loading trend data...</p>
              </CardContent>
            </Card>
          )}

          {cropData && cropData.timeseries.length > 0 && !loading && (
            <>
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" />
                    {selectedCommodity} Price Trend
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
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
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
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))', 
                          borderRadius: '8px', 
                        }}
                        formatter={(value: any) => [`₹${value}/Quintal`, 'Price']}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="price" 
                        stroke="hsl(var(--primary))" 
                        fillOpacity={1} 
                        fill="url(#priceGradient)" 
                        strokeWidth={3}
                        name="Average Price"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    {selectedCommodity} Price Comparison
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={cropData.timeseries.map(d => ({
                      period: d.key,
                      average: d.avg,
                      median: d.median,
                    }))}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
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
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))', 
                          borderRadius: '8px', 
                        }}
                        formatter={(value: any, name: string) => {
                          return [`₹${value}/Quintal`, name === 'average' ? 'Average' : 'Median'];
                        }}
                      />
                      <Bar dataKey="average" fill="hsl(var(--primary))" name="Average" />
                      <Bar dataKey="median" fill="hsl(142 76% 36%)" name="Median" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        {/* Kerala Analysis Tab */}
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
                
                <div className="space-y-3">
                  <h4 className="font-semibold text-lg flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    State-wise Price Heatmap
                  </h4>
                  <div className="rounded-lg overflow-hidden shadow-lg border hover:shadow-xl transition-shadow">
                    <img 
                      src={statewisePricesHeatmap} 
                      alt="State-wise crop prices heatmap showing regional price variations across India"
                      className="w-full animate-fade-in hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold text-lg flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" />
                    Average Prices by State
                  </h4>
                  <div className="rounded-lg overflow-hidden shadow-lg border hover:shadow-xl transition-shadow">
                    <img 
                      src={averagePricesByState} 
                      alt="Bar chart showing average crop prices comparison across Indian states"
                      className="w-full animate-fade-in hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Market Insights Tab */}
        <TabsContent value="insights" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-primary" />
                Market Alerts & Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert className="border-l-4 border-l-yellow-500 bg-yellow-50 dark:bg-yellow-950/20">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <AlertDescription>
                  <strong>Price Alert:</strong> Pepper prices showing volatility. Monitor market closely before making large purchases or sales.
                </AlertDescription>
              </Alert>

              <Alert className="border-l-4 border-l-green-500 bg-green-50 dark:bg-green-950/20">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <AlertDescription>
                  <strong>Opportunity:</strong> Coconut derivatives showing steady upward trend. Consider increasing production if suitable for your farm.
                </AlertDescription>
              </Alert>

              <Alert className="border-l-4 border-l-blue-500 bg-blue-50 dark:bg-blue-950/20">
                <Calendar className="h-4 w-4 text-blue-600" />
                <AlertDescription>
                  <strong>Seasonal Tip:</strong> Best time to sell cardamom is approaching. Prices typically peak during festival seasons.
                </AlertDescription>
              </Alert>

              <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                <h4 className="font-semibold mb-2">Key Recommendations for Kerala Farmers:</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Focus on high-value plantation crops like pepper and cardamom for better margins</li>
                  <li>• Diversify with coconut-based products to reduce market risk</li>
                  <li>• Consider cooperative selling for better price negotiation</li>
                  <li>• Monitor weather patterns for optimal harvest timing</li>
                  <li>• Use government MSP schemes when available</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
