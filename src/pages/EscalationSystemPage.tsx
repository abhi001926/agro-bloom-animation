import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertTriangle, CheckCircle, Clock, MessageSquare, User, Calendar, Filter, Search, Phone, Mail, Send, BarChart3, TrendingUp, Users, AlertCircle, Video, Headphones } from "lucide-react";

const EscalationSystemPage = () => {
  const [selectedQuery, setSelectedQuery] = useState<any>(null);
  const [responseText, setResponseText] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [responseMethod, setResponseMethod] = useState("message");

  // Mock data for queries from chatbot
  const queries = [
    {
      id: "Q001",
      farmerName: "Rajesh Kumar",
      location: "Punjab",
      query: "My wheat crop is showing yellow leaves and stunted growth. The AI suggested nitrogen deficiency but I've already applied fertilizer twice this season. The problem is persisting and I'm worried about the entire crop.",
      chatbotResponse: "It appears to be nitrogen deficiency. Try applying urea fertilizer.",
      timestamp: "2025-09-14T10:30:00",
      status: "pending",
      priority: "high",
      category: "crop-disease",
      phone: "+91 98765 43210",
      email: "rajesh.farmer@gmail.com",
      farmSize: "5 acres",
      cropType: "Wheat",
      satisfactionRating: 2,
      urgencyLevel: "High"
    },
    {
      id: "Q002", 
      farmerName: "Priya Sharma",
      location: "Maharashtra",
      query: "Cotton plants are wilting despite regular watering. AI said it's overwatering but soil feels dry. Please help urgently as crop is ready for harvest and I'm losing money every day.",
      chatbotResponse: "Reduce watering frequency to prevent root rot.",
      timestamp: "2025-09-14T09:15:00",
      status: "in-progress",
      priority: "urgent",
      category: "irrigation",
      phone: "+91 87654 32109", 
      email: "priya.cotton@yahoo.com",
      farmSize: "8 acres",
      cropType: "Cotton",
      satisfactionRating: 1,
      urgencyLevel: "Critical"
    },
    {
      id: "Q003",
      farmerName: "Mohammad Ali",
      location: "Uttar Pradesh",
      query: "Sugarcane yield is very low this year. AI suggested changing variety but I need specific recommendations for my soil type and climate conditions in this region.",
      chatbotResponse: "Consider switching to high-yield varieties like Co-238.",
      timestamp: "2025-09-14T08:45:00",
      status: "resolved",
      priority: "medium",
      category: "crop-variety",
      phone: "+91 76543 21098",
      email: "ali.sugarcane@gmail.com",
      farmSize: "12 acres",
      cropType: "Sugarcane",
      satisfactionRating: 3,
      urgencyLevel: "Medium"
    },
    {
      id: "Q004",
      farmerName: "Sunita Devi",
      location: "Bihar",
      query: "Rice paddy showing brown spots on leaves. AI said bacterial blight but treatment suggested isn't working. Need immediate expert advice as the disease is spreading rapidly.",
      chatbotResponse: "Apply copper-based fungicide for bacterial blight treatment.",
      timestamp: "2025-09-14T07:20:00",
      status: "pending",
      priority: "urgent",
      category: "pest-disease",
      phone: "+91 65432 10987",
      email: "sunita.rice@rediffmail.com",
      farmSize: "3 acres",
      cropType: "Rice",
      satisfactionRating: 2,
      urgencyLevel: "High"
    },
    {
      id: "Q005",
      farmerName: "Kiran Patel",
      location: "Gujarat",
      query: "Groundnut crop facing pest attack. AI recommended pesticide but it's not available in my area. Need alternative solutions that are locally available and cost-effective.",
      chatbotResponse: "Use cypermethrin-based pesticide for groundnut pest control.",
      timestamp: "2025-09-14T06:10:00",
      status: "pending",
      priority: "medium",
      category: "pest-control",
      phone: "+91 54321 09876",
      email: "kiran.groundnut@gmail.com",
      farmSize: "6 acres",
      cropType: "Groundnut",
      satisfactionRating: 2,
      urgencyLevel: "Medium"
    }
  ];

  const dashboardStats = [
    { title: "Total Queries", value: queries.length, icon: MessageSquare, color: "bg-blue-500" },
    { title: "Pending", value: queries.filter(q => q.status === "pending").length, icon: Clock, color: "bg-yellow-500" },
    { title: "In Progress", value: queries.filter(q => q.status === "in-progress").length, icon: AlertCircle, color: "bg-orange-500" },
    { title: "Resolved", value: queries.filter(q => q.status === "resolved").length, icon: CheckCircle, color: "bg-green-500" },
  ];

  const filteredQueries = queries.filter(query => {
    const matchesSearch = query.farmerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         query.query.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         query.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         query.cropType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || query.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "urgent": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 border-red-200";
      case "high": return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 border-orange-200";
      case "medium": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 border-yellow-200";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 border-gray-200";
    }
  };

  const getQueryStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 border-yellow-200";
      case "in-progress": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border-blue-200";
      case "resolved": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-green-200";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 border-gray-200";
    }
  };

  const handleResponse = (method: string) => {
    if (method === "call") {
      // Mock call initiation
      alert(`Initiating call to ${selectedQuery?.farmerName} at ${selectedQuery?.phone}`);
    } else if (method === "video") {
      // Mock video call initiation
      alert(`Starting video consultation with ${selectedQuery?.farmerName}`);
    } else {
      // Send message response
      alert(`Message sent to ${selectedQuery?.farmerName}: ${responseText}`);
      setResponseText("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-6">
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-2">
          Admin Escalation Dashboard
        </h1>
        <p className="text-muted-foreground text-lg">Manage farmer queries escalated from AI chatbot with advanced response options</p>
      </div>

      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {dashboardStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="border-0 shadow-lg hover:scale-105 transition-all duration-300 animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`${stat.color} p-3 rounded-full`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Search and Filter */}
      <Card className="mb-6 border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search queries, farmers, locations, or crop types..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-11"
              />
            </div>
            <div className="flex gap-2">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" className="flex items-center gap-2 hover:scale-105 transition-transform">
                <Filter className="h-4 w-4" />
                Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Query List */}
        <div className="xl:col-span-2 space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">Escalated Queries ({filteredQueries.length})</h2>
            <Badge variant="outline" className="px-3 py-1">
              {queries.filter(q => q.status === "pending").length} Pending Review
            </Badge>
          </div>
          
          {filteredQueries.map((query, index) => (
            <Card
              key={query.id}
              className={`cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.02] border-l-4 animate-slide-up ${
                selectedQuery?.id === query.id 
                  ? "ring-2 ring-primary shadow-lg border-l-primary" 
                  : query.priority === "urgent" 
                    ? "border-l-red-500" 
                    : query.priority === "high" 
                      ? "border-l-orange-500" 
                      : "border-l-blue-500"
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => setSelectedQuery(query)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        {query.farmerName}
                        {query.urgencyLevel === "Critical" && (
                          <AlertTriangle className="h-4 w-4 text-red-500 animate-pulse" />
                        )}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2 text-sm">
                        <span>{query.location}</span>
                        <span>•</span>
                        <span>{query.cropType}</span>
                        <span>•</span>
                        <span className="font-mono">{query.id}</span>
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge className={`${getStatusColor(query.priority)} px-3 py-1`}>
                      {query.urgencyLevel}
                    </Badge>
                    <Badge className={`${getQueryStatusColor(query.status)} px-3 py-1`}>
                      {query.status.replace("-", " ")}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                  {query.query}
                </p>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(query.timestamp).toLocaleString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <BarChart3 className="h-3 w-3" />
                      {query.farmSize}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {query.category}
                    </Badge>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className={`h-2 w-2 rounded-full ${
                            i < query.satisfactionRating ? "bg-yellow-400" : "bg-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {filteredQueries.length === 0 && (
            <Card className="border-dashed border-2">
              <CardContent className="p-12 text-center">
                <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="font-semibold mb-2">No queries found</h3>
                <p className="text-sm text-muted-foreground">
                  Try adjusting your search criteria or filters
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Query Details and Response Panel */}
        <div className="space-y-6">
          {selectedQuery ? (
            <>
              {/* Farmer Profile Card */}
              <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Farmer Profile
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                      <User className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{selectedQuery.farmerName}</h3>
                      <p className="text-muted-foreground">{selectedQuery.location}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide">Phone</p>
                        <p className="font-medium">{selectedQuery.phone}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide">Farm Size</p>
                        <p className="font-medium">{selectedQuery.farmSize}</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide">Crop Type</p>
                        <p className="font-medium">{selectedQuery.cropType}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide">Satisfaction</p>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <div
                              key={i}
                              className={`h-3 w-3 rounded-full ${
                                i < selectedQuery.satisfactionRating ? "bg-yellow-400" : "bg-gray-200"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Query Details Card */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-primary" />
                    Query Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-orange-500" />
                      Farmer's Concern
                    </h4>
                    <div className="p-4 bg-muted/50 rounded-lg border-l-4 border-l-orange-500">
                      <p className="text-sm leading-relaxed">{selectedQuery.query}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <BarChart3 className="h-4 w-4 text-blue-500" />
                      AI Bot Response
                    </h4>
                    <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border-l-4 border-l-blue-500">
                      <p className="text-sm">{selectedQuery.chatbotResponse}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2">
                    <Badge className={`${getStatusColor(selectedQuery.priority)} px-3 py-1`}>
                      {selectedQuery.urgencyLevel} Priority
                    </Badge>
                    <Badge variant="outline" className="px-3 py-1">
                      {selectedQuery.category}
                    </Badge>
                    <Badge variant="outline" className="px-3 py-1">
                      {selectedQuery.id}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Response Actions Card */}
              <Card className="border-0 shadow-lg bg-gradient-to-br from-primary/5 to-transparent">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Send className="h-5 w-5 text-primary" />
                    Expert Response Options
                  </CardTitle>
                  <CardDescription>
                    Choose the best method to address the farmer's concern
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Tabs value={responseMethod} onValueChange={setResponseMethod} className="w-full">
                    <TabsList className="grid w-full grid-cols-3 bg-muted/50">
                      <TabsTrigger value="message" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800">
                        <Mail className="h-4 w-4 mr-2" />
                        Message
                      </TabsTrigger>
                      <TabsTrigger value="call" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800">
                        <Phone className="h-4 w-4 mr-2" />
                        Call
                      </TabsTrigger>
                      <TabsTrigger value="video" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800">
                        <Video className="h-4 w-4 mr-2" />
                        Video
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="message" className="space-y-4 mt-6">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Expert Response</label>
                        <Textarea
                          placeholder="Provide detailed, expert guidance addressing the farmer's specific concern..."
                          value={responseText}
                          onChange={(e) => setResponseText(e.target.value)}
                          className="min-h-[140px] resize-none"
                        />
                      </div>
                      <Button 
                        onClick={() => handleResponse("message")} 
                        className="w-full h-12 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                        disabled={!responseText.trim()}
                      >
                        <Mail className="h-4 w-4 mr-2" />
                        Send Expert Response
                      </Button>
                    </TabsContent>
                    
                    <TabsContent value="call" className="space-y-4 mt-6">
                      <div className="text-center p-8 border-2 border-dashed border-muted rounded-xl bg-gradient-to-br from-green-50 to-transparent dark:from-green-950/20">
                        <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                          <Phone className="h-8 w-8 text-green-600" />
                        </div>
                        <h3 className="font-semibold mb-2 text-lg">Voice Consultation</h3>
                        <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                          Initiate a direct voice call for immediate discussion and real-time guidance
                        </p>
                        <Button 
                          onClick={() => handleResponse("call")}
                          className="w-full h-12 bg-green-600 hover:bg-green-700"
                        >
                          <Phone className="h-4 w-4 mr-2" />
                          Call {selectedQuery.farmerName}
                        </Button>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="video" className="space-y-4 mt-6">
                      <div className="text-center p-8 border-2 border-dashed border-muted rounded-xl bg-gradient-to-br from-blue-50 to-transparent dark:from-blue-950/20">
                        <div className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                          <Video className="h-8 w-8 text-blue-600" />
                        </div>
                        <h3 className="font-semibold mb-2 text-lg">Video Consultation</h3>
                        <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                          Start a video call for visual crop inspection and detailed guidance with screen sharing
                        </p>
                        <Button 
                          onClick={() => handleResponse("video")}
                          className="w-full h-12 bg-blue-600 hover:bg-blue-700"
                        >
                          <Video className="h-4 w-4 mr-2" />
                          Start Video Consultation
                        </Button>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="border-0 shadow-lg">
              <CardContent className="p-12 text-center">
                <div className="bg-primary/10 p-6 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                  <MessageSquare className="h-10 w-10 text-primary" />
                </div>
                <h3 className="font-semibold mb-2 text-xl">Select a Query to Begin</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Choose a query from the list to view detailed information and provide expert assistance to the farmer
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default EscalationSystemPage;