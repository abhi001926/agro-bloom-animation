import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Leaf, Cloud, TrendingUp, MapPin, ArrowUp, Menu } from "lucide-react";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: "Home", path: "/", icon: Leaf },
    { name: "Weather", path: "/weather", icon: Cloud },
    { name: "Crop Prices", path: "/prices", icon: TrendingUp },
    { name: "Soil Data", path: "/soil", icon: MapPin },
    { name: "Escalation", path: "/escalation", icon: ArrowUp },
  ];

  const NavLinks = ({ mobile = false }) => (
    <>
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.name}
            to={item.path}
            onClick={() => mobile && setIsOpen(false)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-smooth hover:bg-accent/50 ${
              isActive ? "bg-primary text-primary-foreground shadow-glow" : "text-foreground hover:text-primary"
            } ${mobile ? "w-full justify-start" : ""}`}
          >
            <Icon size={18} />
            <span className={mobile ? "text-base" : "text-sm font-medium"}>{item.name}</span>
          </Link>
        );
      })}
    </>
  );

  return (
    <nav className="bg-background/80 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-primary">
            <Leaf size={28} className="animate-pulse-glow" />
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              AgriTech
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <NavLinks />
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="outline" size="icon">
                <Menu size={20} />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <div className="flex flex-col gap-4 mt-8">
                <NavLinks mobile />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;