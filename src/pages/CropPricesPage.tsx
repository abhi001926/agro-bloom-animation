import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, TrendingDown, BarChart3, MapPin, RefreshCw, Download, Calendar, IndianRupee, Activity, AlertTriangle } from "lucide-react";
import keralaCommoditiesChart from "@/assets/kerala-commodities-chart.jpg";
import statewisePricesHeatmap from "@/assets/statewise-prices-heatmap.jpg";
import averagePricesByState from "@/assets/average-prices-by-state.jpg";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell } from "recharts";

export default function CropPricesPage() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("7d");
  const [selectedCommodity, setSelectedCommodity] = useState("all");

  // Mock data for advanced analytics
  const priceData = [
    { date: "2025-09-07", wheat: 2800, rice: 3200, maize: 2400, soybean: 4200 },
    { date: "2025-09-08", wheat: 2850, rice: 3180, maize: 2450, soybean: 4250 },
    { date: "2025-09-09", wheat: 2820, rice: 3220, maize: 2420, soybean: 4180 },
    { date: "2025-09-10", wheat: 2880, rice: 3250, maize: 2480, soybean: 4300 },
    { date: "2025-09-11", wheat: 2860, rice: 3190, maize: 2460, soybean: 4220 },
    { date: "2025-09-12", wheat: 2900, rice: 3280, maize: 2500, soybean: 4380 },
    { date: "2025-09-13", wheat: 2920, rice: 3300, maize: 2520, soybean: 4400 },
  ];

  const marketMetrics = [
    { name: "Wheat", current: 2920, change: +4.28, volume: "12.5K MT", trend: "up", color: "#10b981" },
    { name: "Rice", current: 3300, change: +3.12, volume: "8.2K MT", trend: "up", color: "#3b82f6" },
    { name: "Maize", current: 2520, change: +5.00, volume: "15.8K MT", trend: "up", color: "#f59e0b" },
    { name: "Soybean", current: 4400, change: +4.76, volume: "6.1K MT", trend: "up", color: "#8b5cf6" },
  ];

  const topPerformers = [
    { crop: "Pepper", price: 62000, change: +12.5, state: "Kerala" },
    { crop: "Coconut Oil", price: 48000, change: +8.3, state: "Kerala" },
    { crop: "Coffee", price: 22000, change: +6.7, state: "Karnataka" },
    { crop: "Cardamom", price: 35000, change: +15.2, state: "Kerala" },
  ];

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-6">
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Crop Market Analytics
            </h1>
            <p className="text-muted-foreground mt-2">Real-time insights and advanced market analysis</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="hover:scale-105 transition-transform">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" size="sm" className="hover:scale-105 transition-transform">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Market Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {marketMetrics.map((metric, index) => (
          <Card key={metric.name} className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50 hover:scale-105 transition-all duration-300 animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-sm text-muted-foreground">{metric.name}</h3>
                <Badge variant={metric.trend === "up" ? "default" : "secondary"} className="animate-pulse-glow">
                  {metric.trend === "up" ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <IndianRupee className="h-5 w-5 text-primary" />
                  <span className="text-2xl font-bold">{metric.current.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className={`flex items-center gap-1 ${metric.change > 0 ? "text-green-600" : "text-red-600"}`}>
                    {metric.change > 0 ? "+" : ""}{metric.change}%
                  </span>
                  <span className="text-muted-foreground">{metric.volume}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-muted/50">
          <TabsTrigger value="overview" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Overview</TabsTrigger>
          <TabsTrigger value="trends" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Price Trends</TabsTrigger>
          <TabsTrigger value="analysis" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Kerala Analysis</TabsTrigger>
          <TabsTrigger value="insights" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Market Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  Price Movement (7 Days)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <AreaChart data={priceData}>
                    <defs>
                      <linearGradient id="wheatGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: 'none', 
                        borderRadius: '8px', 
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
                      }}
                      formatter={(value: any) => [`₹${value}`, 'Price']}
                    />
                    <Area type="monotone" dataKey="wheat" stroke="#10b981" fillOpacity={1} fill="url(#wheatGradient)" strokeWidth={3} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Top Performers
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {topPerformers.map((item, index) => (
                  <div key={item.crop} className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-primary/5 to-transparent hover:from-primary/10 transition-colors">
                    <div>
                      <p className="font-semibold">{item.crop}</p>
                      <p className="text-sm text-muted-foreground">{item.state}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">₹{item.price.toLocaleString()}</p>
                      <p className="text-sm text-green-600">+{item.change}%</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <div className="grid gap-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    Multi-Commodity Price Comparison
                  </CardTitle>
                  <div className="flex gap-2">
                    <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7d">7 Days</SelectItem>
                        <SelectItem value="30d">30 Days</SelectItem>
                        <SelectItem value="90d">90 Days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={priceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: 'none', 
                        borderRadius: '8px', 
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
                      }}
                      formatter={(value: any) => [`₹${value}`, 'Price']}
                    />
                    <Line type="monotone" dataKey="wheat" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', strokeWidth: 2 }} />
                    <Line type="monotone" dataKey="rice" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', strokeWidth: 2 }} />
                    <Line type="monotone" dataKey="maize" stroke="#f59e0b" strokeWidth={3} dot={{ fill: '#f59e0b', strokeWidth: 2 }} />
                    <Line type="monotone" dataKey="soybean" stroke="#8b5cf6" strokeWidth={3} dot={{ fill: '#8b5cf6', strokeWidth: 2 }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
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
