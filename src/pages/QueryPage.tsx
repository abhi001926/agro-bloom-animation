import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import FloatingIcons from "@/components/animations/FloatingIcons";
import { 
  MessageSquare, 
  Send, 
  User, 
  Clock, 
  CheckCircle, 
  Leaf,
  Users,
  BookOpen
} from "lucide-react";
import { toast } from "sonner";

const QueryPage = () => {
  const [query, setQuery] = useState("");
  const [email, setEmail] = useState("");

  const faqs = [
    {
      question: "What's the best time to plant corn?",
      answer: "Plant corn when soil temperature reaches 60°F (15°C) and after the last frost date in your area.",
      category: "Planting"
    },
    {
      question: "How often should I water my crops?",
      answer: "Water requirements vary by crop and weather. Generally, 1-2 inches per week including rainfall.",
      category: "Irrigation"
    },
    {
      question: "What causes yellowing leaves?",
      answer: "Yellow leaves can indicate nitrogen deficiency, overwatering, diseases, or natural aging.",
      category: "Plant Health"
    },
    {
      question: "When should I harvest wheat?",
      answer: "Harvest wheat when moisture content is 13-14% and grains are hard and golden.",
      category: "Harvesting"
    }
  ];

  const experts = [
    {
      name: "Dr. Sarah Johnson",
      specialty: "Crop Science",
      experience: "15 years",
      rating: 4.9,
      responseTime: "< 2 hours"
    },
    {
      name: "Prof. Michael Chen",
      specialty: "Soil Health",
      experience: "20 years", 
      rating: 4.8,
      responseTime: "< 4 hours"
    },
    {
      name: "Dr. Emily Rodriguez",
      specialty: "Plant Pathology",
      experience: "12 years",
      rating: 4.9,
      responseTime: "< 3 hours"
    }
  ];

  const handleSubmitQuery = () => {
    if (!query.trim()) {
      toast.error("Please enter your question");
      return;
    }
    if (!email.trim()) {
      toast.error("Please enter your email");
      return;
    }
    
    toast.success("Your question has been submitted! An expert will respond soon.");
    setQuery("");
    setEmail("");
  };

  return (
    <div className="min-h-screen bg-gradient-primary relative">
      <FloatingIcons />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="animate-slide-up">
          <h1 className="text-4xl font-bold text-center mb-8 text-white">
            Ask Agricultural Experts
          </h1>

          {/* Query Form */}
          <Card className="mb-8 shadow-floating bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                Submit Your Question
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Your Email</label>
                <Input
                  placeholder="Enter your email for response..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Your Question</label>
                <Textarea
                  placeholder="Describe your agricultural question or problem in detail..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  rows={4}
                />
              </div>
              <Button 
                onClick={handleSubmitQuery}
                className="w-full bg-primary hover:bg-primary/90 transition-smooth"
              >
                <Send className="h-4 w-4 mr-2" />
                Submit Question
              </Button>
            </CardContent>
          </Card>

          {/* Expert Profiles */}
          <Card className="mb-8 shadow-floating bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Our Agricultural Experts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {experts.map((expert, index) => (
                  <div key={expert.name} className="text-center p-4 rounded-lg bg-muted/50 animate-slide-up"
                       style={{ animationDelay: `${index * 0.1}s` }}>
                    <Avatar className="mx-auto mb-4 h-16 w-16">
                      <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                        {expert.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="font-bold text-lg">{expert.name}</h3>
                    <p className="text-primary font-medium">{expert.specialty}</p>
                    <p className="text-sm text-muted-foreground mb-2">{expert.experience} experience</p>
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <span className="text-yellow-500">★</span>
                      <span className="font-medium">{expert.rating}</span>
                    </div>
                    <Badge variant="outline">
                      <Clock className="h-3 w-3 mr-1" />
                      {expert.responseTime}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* FAQ Section */}
          <Card className="shadow-floating bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Frequently Asked Questions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div key={index} className="p-4 rounded-lg bg-muted/50 animate-slide-up"
                       style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className="flex items-start gap-3 mb-2">
                      <Leaf className="h-5 w-5 text-primary mt-0.5 animate-pulse-glow" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium">{faq.question}</h3>
                          <Badge variant="secondary" className="text-xs">
                            {faq.category}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{faq.answer}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default QueryPage;