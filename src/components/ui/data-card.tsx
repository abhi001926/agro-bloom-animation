import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface DataCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "neutral";
  description?: string;
  variant?: "default" | "weather" | "price" | "soil";
  children?: ReactNode;
}

const DataCard = ({ 
  title, 
  value, 
  unit, 
  icon: Icon, 
  trend, 
  description, 
  variant = "default",
  children 
}: DataCardProps) => {
  const getVariantClasses = () => {
    switch (variant) {
      case "weather":
        return "bg-gradient-sky border-accent/20 hover:shadow-glow";
      case "price":
        return "bg-gradient-primary border-primary/20 hover:shadow-glow";
      case "soil":
        return "bg-gradient-earth border-secondary/20 hover:shadow-glow";
      default:
        return "bg-card hover:shadow-card";
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case "up":
        return "text-green-600";
      case "down":
        return "text-red-600";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <Card className={`transition-smooth hover:scale-105 ${getVariantClasses()}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-foreground/80">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-primary animate-pulse-glow" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground flex items-baseline gap-1">
          {value}
          {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
        </div>
        {description && (
          <p className={`text-xs mt-1 ${getTrendColor()}`}>
            {description}
          </p>
        )}
        {children}
      </CardContent>
    </Card>
  );
};

export default DataCard;