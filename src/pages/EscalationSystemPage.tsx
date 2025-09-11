import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import FloatingIcons from "@/components/animations/FloatingIcons";
import { 
  AlertTriangle, 
  ArrowUp, 
  Clock, 
  CheckCircle, 
  Users,
  Zap,
  Shield,
  Phone,
  Mail
} from "lucide-react";
import { toast } from "sonner";

const EscalationSystemPage = () => {
  const [issueDescription, setIssueDescription] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);

  const escalationLevels = [
    {
      level: 1,
      title: "Standard Support",
      description: "General agricultural questions and guidance",
      responseTime: "24-48 hours",
      icon: Users,
      color: "bg-green-500",
      examples: ["Crop rotation advice", "Basic pest identification", "Fertilizer recommendations"]
    },
    {
      level: 2,
      title: "Priority Support", 
      description: "Urgent agricultural issues affecting productivity",
      responseTime: "4-8 hours",
      icon: Zap,
      color: "bg-yellow-500",
      examples: ["Disease outbreak", "Equipment malfunction", "Weather damage assessment"]
    },
    {
      level: 3,
      title: "Critical Emergency",
      description: "Immediate threats to crops, livestock, or safety",
      responseTime: "< 2 hours",
      icon: AlertTriangle,
      color: "bg-red-500",
      examples: ["Livestock emergency", "Chemical spill", "Severe weather warning"]
    }
  ];

  const recentEscalations = [
    {
      id: "ESC-001",
      title: "Pest infestation in wheat fields",
      level: 2,
      status: "In Progress",
      timeAgo: "2 hours ago",
      progress: 75
    },
    {
      id: "ESC-002", 
      title: "Irrigation system failure",
      level: 3,
      status: "Resolved",
      timeAgo: "1 day ago",
      progress: 100
    },
    {
      id: "ESC-003",
      title: "Soil pH concerns",
      level: 1,
      status: "Assigned",
      timeAgo: "3 days ago", 
      progress: 25
    }
  ];

  const handleSubmitEscalation = () => {
    if (!issueDescription.trim()) {
      toast.error("Please describe the issue");
      return;
    }
    if (!contactInfo.trim()) {
      toast.error("Please provide contact information");
      return;
    }
    if (selectedLevel === null) {
      toast.error("Please select an escalation level");
      return;
    }
    
    toast.success("Escalation submitted successfully! You will be contacted soon.");
    setIssueDescription("");
    setContactInfo("");
    setSelectedLevel(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Resolved": return "bg-green-500";
      case "In Progress": return "bg-yellow-500";
      case "Assigned": return "bg-blue-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-primary relative">
      <FloatingIcons />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="animate-slide-up">
          <h1 className="text-4xl font-bold text-center mb-8 text-white">
            Agricultural Issue Escalation System
          </h1>

          {/* Escalation Levels */}
          <Card className="mb-8 shadow-floating bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowUp className="h-5 w-5 text-primary" />
                Select Escalation Level
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {escalationLevels.map((level, index) => {
                  const Icon = level.icon;
                  const isSelected = selectedLevel === level.level;
                  return (
                    <div 
                      key={level.level}
                      onClick={() => setSelectedLevel(level.level)}
                      className={`p-6 rounded-lg border-2 cursor-pointer transition-all animate-slide-up ${
                        isSelected ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                      }`}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`p-2 rounded-full ${level.color} text-white`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-bold">Level {level.level}</h3>
                          <p className="text-sm text-muted-foreground">{level.title}</p>
                        </div>
                      </div>
                      <p className="text-sm mb-3">{level.description}</p>
                      <Badge variant="outline" className="mb-3">
                        <Clock className="h-3 w-3 mr-1" />
                        {level.responseTime}
                      </Badge>
                      <div className="text-xs text-muted-foreground">
                        <p className="font-medium mb-1">Examples:</p>
                        <ul className="list-disc list-inside space-y-1">
                          {level.examples.map((example, i) => (
                            <li key={i}>{example}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Issue Submission Form */}
          <Card className="mb-8 shadow-floating bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Submit Issue for Escalation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Contact Information</label>
                <Input
                  placeholder="Phone number or email address..."
                  value={contactInfo}
                  onChange={(e) => setContactInfo(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Issue Description</label>
                <Textarea
                  placeholder="Describe the agricultural issue in detail, including location, severity, and any immediate concerns..."
                  value={issueDescription}
                  onChange={(e) => setIssueDescription(e.target.value)}
                  rows={4}
                />
              </div>
              {selectedLevel && (
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm">
                    <strong>Selected Level:</strong> {escalationLevels[selectedLevel - 1].title}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Expected response time: {escalationLevels[selectedLevel - 1].responseTime}
                  </p>
                </div>
              )}
              <Button 
                onClick={handleSubmitEscalation}
                className="w-full bg-primary hover:bg-primary/90 transition-smooth"
              >
                <ArrowUp className="h-4 w-4 mr-2" />
                Submit Escalation
              </Button>
            </CardContent>
          </Card>

          {/* Recent Escalations */}
          <Card className="mb-8 shadow-floating bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Recent Escalations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentEscalations.map((escalation, index) => (
                  <div 
                    key={escalation.id}
                    className="p-4 rounded-lg bg-muted/50 animate-slide-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium">{escalation.title}</h3>
                          <Badge variant="outline">Level {escalation.level}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">ID: {escalation.id}</p>
                      </div>
                      <div className="text-right">
                        <Badge 
                          variant="secondary" 
                          className={`${getStatusColor(escalation.status)} text-white`}
                        >
                          {escalation.status}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">{escalation.timeAgo}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Progress</span>
                        <span>{escalation.progress}%</span>
                      </div>
                      <Progress value={escalation.progress} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Emergency Contacts */}
          <Card className="shadow-floating bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-primary" />
                Emergency Contacts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-red-50 border border-red-200">
                  <h3 className="font-bold text-red-800 mb-2">Critical Emergency</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-red-600" />
                      <span>Emergency Hotline: 1-800-AGRI-911</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-red-600" />
                      <span>emergency@agritech.com</span>
                    </div>
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                  <h3 className="font-bold text-blue-800 mb-2">General Support</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-blue-600" />
                      <span>Support Line: 1-800-AGRI-HELP</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-blue-600" />
                      <span>support@agritech.com</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EscalationSystemPage;