import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ShoppingCart, Star, Search, Heart, Share2, Tractor, Sprout, Package, Clock, IndianRupee, Phone, MapPin } from "lucide-react";

interface Product {
  id: string;
  name: string;
  category: string;
  badge: string;
  rating: number;
  reviews: number;
  price: number;
  mrp: number;
  discount: number;
  description: string;
  specs: Record<string, string>;
  image: string;
  seller: string;
  location: string;
}

interface LeaseItem {
  id: string;
  name: string;
  category: string;
  badge: string;
  rating: number;
  reviews: number;
  pricePerDay: number;
  pricePerWeek: number;
  description: string;
  specs: Record<string, string>;
  image: string;
  owner: string;
  location: string;
  available: boolean;
}

const farmingProducts: Product[] = [
  {
    id: "P001", name: "Premium Wheat Seeds (HD-2967) - 40kg Bag", category: "Seeds",
    badge: "Best Seller", rating: 4.8, reviews: 1240, price: 1450, mrp: 1800, discount: 19,
    description: "This high-yield variety is perfect for the current season. Tested for 98% germination rate and treated with premium fungicides for protection.",
    specs: { Brand: "Krishi Premium", Weight: "40 kg", "Germination Rate": "98%", Treatment: "Fungicide Treated", "Suitable Soil": "Alluvial / Loamy" },
    image: "🌾", seller: "Kerala Agro Seeds", location: "Thrissur, Kerala"
  },
  {
    id: "P002", name: "Organic NPK Fertilizer - 50kg", category: "Fertilizers",
    badge: "Organic", rating: 4.6, reviews: 890, price: 1200, mrp: 1500, discount: 20,
    description: "100% organic NPK fertilizer ideal for all crops. Improves soil health and boosts yield naturally without harmful chemicals.",
    specs: { Brand: "GreenGrow", Weight: "50 kg", "NPK Ratio": "10:26:26", Type: "Organic Granular", "Shelf Life": "2 years" },
    image: "🧪", seller: "Organic Farm Solutions", location: "Ernakulam, Kerala"
  },
  {
    id: "P003", name: "Drip Irrigation Kit - 1 Acre", category: "Irrigation",
    badge: "Top Rated", rating: 4.9, reviews: 560, price: 8500, mrp: 12000, discount: 29,
    description: "Complete drip irrigation system for 1 acre. Includes main line, sub-main, laterals, drippers, filters, and all fittings.",
    specs: { Brand: "AquaDrip", Coverage: "1 Acre", "Dripper Type": "Inline 4 LPH", "Pipe Material": "LLDPE", Warranty: "3 years" },
    image: "💧", seller: "IrriTech Kerala", location: "Palakkad, Kerala"
  },
  {
    id: "P004", name: "Neem Oil Pesticide - 5L", category: "Pesticides",
    badge: "Eco-Friendly", rating: 4.5, reviews: 2100, price: 650, mrp: 800, discount: 19,
    description: "Pure cold-pressed neem oil for organic pest control. Effective against aphids, whiteflies, mealybugs and more.",
    specs: { Brand: "NaturGuard", Volume: "5 Litres", Type: "Cold Pressed", Concentration: "3000 PPM", "Suitable For": "All Crops" },
    image: "🌿", seller: "Kerala Bio Agro", location: "Kozhikode, Kerala"
  },
  {
    id: "P005", name: "Coconut Climbing Machine", category: "Tools",
    badge: "New Arrival", rating: 4.7, reviews: 340, price: 3200, mrp: 4500, discount: 29,
    description: "Safe and efficient coconut tree climbing machine. Lightweight design with anti-slip grips, suitable for trees up to 60 feet.",
    specs: { Brand: "KeralaTools", Weight: "4.5 kg", Material: "Stainless Steel", "Max Height": "60 feet", Safety: "Anti-slip grip" },
    image: "🥥", seller: "Farm Tools Kerala", location: "Alappuzha, Kerala"
  },
  {
    id: "P006", name: "Paddy Seeds (Jyothi) - 20kg", category: "Seeds",
    badge: "Kerala Special", rating: 4.6, reviews: 780, price: 980, mrp: 1200, discount: 18,
    description: "High-yielding paddy variety specially developed for Kerala's climate. Resistant to blast disease and suitable for both Virippu and Mundakan seasons.",
    specs: { Brand: "Kerala Agri Dept", Weight: "20 kg", Variety: "Jyothi (PTB-39)", Duration: "120 days", "Yield Potential": "5-6 tonnes/ha" },
    image: "🌾", seller: "State Seed Farm", location: "Kottayam, Kerala"
  },
  {
    id: "P007", name: "Rubber Tapping Kit Complete", category: "Tools",
    badge: "Popular", rating: 4.4, reviews: 1560, price: 1850, mrp: 2200, discount: 16,
    description: "Complete rubber tapping kit with knife, cups, spouts, and collection bucket. Professional grade tools for efficient latex collection.",
    specs: { Brand: "RubberPro", "Kit Contents": "15 pieces", "Knife Type": "Jebong", "Cup Material": "Ceramic", "Spout Type": "Aluminium" },
    image: "🪣", seller: "Rubber Board Store", location: "Kottayam, Kerala"
  },
  {
    id: "P008", name: "Vermicompost - 50kg Bag", category: "Fertilizers",
    badge: "Organic", rating: 4.8, reviews: 2340, price: 450, mrp: 600, discount: 25,
    description: "Premium quality vermicompost rich in nutrients and beneficial microorganisms. Ideal for all crops including vegetables, fruits, and spices.",
    specs: { Brand: "WormGold", Weight: "50 kg", "Organic Carbon": ">15%", Moisture: "25-30%", "pH Range": "6.5-7.5" },
    image: "🪱", seller: "Green Earth Kerala", location: "Wayanad, Kerala"
  },
];

const leaseItems: LeaseItem[] = [
  {
    id: "L001", name: "John Deere Tractor 5050D - 50HP", category: "Tractors",
    badge: "Most Rented", rating: 4.9, reviews: 320, pricePerDay: 2500, pricePerWeek: 15000,
    description: "Powerful 50HP tractor ideal for ploughing, tilling, and transportation. Comes with operator. Diesel included for first 8 hours.",
    specs: { Brand: "John Deere", Power: "50 HP", "Fuel Type": "Diesel", "PTO HP": "42.5", Condition: "Excellent" },
    image: "🚜", owner: "Vijay Farm Services", location: "Palakkad, Kerala", available: true
  },
  {
    id: "L002", name: "Power Tiller - 12HP", category: "Tillers",
    badge: "Available Now", rating: 4.6, reviews: 450, pricePerDay: 1200, pricePerWeek: 7000,
    description: "Compact power tiller perfect for small and medium paddy fields. Easy to operate with low fuel consumption.",
    specs: { Brand: "VST Shakti", Power: "12 HP", Type: "Rotary", "Fuel Consumption": "1.5L/hr", "Working Width": "600mm" },
    image: "⚙️", owner: "Agri Mechanization Center", location: "Thrissur, Kerala", available: true
  },
  {
    id: "L003", name: "Paddy Harvester - Combined", category: "Harvesters",
    badge: "Seasonal", rating: 4.7, reviews: 180, pricePerDay: 5000, pricePerWeek: 28000,
    description: "Full-sized combined harvester for paddy. Includes operator and basic maintenance. Minimum booking 2 days.",
    specs: { Brand: "Kubota", Type: "Combined Harvester", "Cutting Width": "2m", "Tank Capacity": "1400L", "Min Booking": "2 days" },
    image: "🌾", owner: "Kerala Harvest Co-op", location: "Alappuzha, Kerala", available: true
  },
  {
    id: "L004", name: "Sprayer Drone - 10L Capacity", category: "Drones",
    badge: "High Tech", rating: 4.8, reviews: 95, pricePerDay: 3500, pricePerWeek: 20000,
    description: "Agricultural drone for precision spraying. Covers 10 acres per hour. Comes with trained pilot and pesticide mixing guidance.",
    specs: { Brand: "DJI Agras", Capacity: "10 Litres", "Flight Time": "15 min/load", Coverage: "10 acres/hr", "Spray Width": "6.5m" },
    image: "🛸", owner: "AgroDrone Kerala", location: "Ernakulam, Kerala", available: true
  },
  {
    id: "L005", name: "Excavator - Mini (3 Ton)", category: "Earth Movers",
    badge: "Farm Use", rating: 4.5, reviews: 210, pricePerDay: 4500, pricePerWeek: 25000,
    description: "Mini excavator for farm land leveling, pond digging, and drainage work. Includes operator. Diesel extra after 6 hours.",
    specs: { Brand: "JCB", Weight: "3 Tonnes", "Bucket Size": "0.1 m³", "Dig Depth": "2.6m", Condition: "Good" },
    image: "🏗️", owner: "Farm Earth Movers", location: "Idukki, Kerala", available: false
  },
  {
    id: "L006", name: "Water Pump Set - 5HP Diesel", category: "Pumps",
    badge: "Essential", rating: 4.4, reviews: 670, pricePerDay: 500, pricePerWeek: 2800,
    description: "Heavy duty diesel water pump for irrigation. Self-priming with 3-inch outlet. Ideal for paddy field flooding and drainage.",
    specs: { Brand: "Honda", Power: "5 HP", "Discharge": "1000 LPM", "Suction Head": "8m", "Pipe Size": "3 inch" },
    image: "🔧", owner: "Water Solutions Agri", location: "Kollam, Kerala", available: true
  },
];

const ProductCard = ({ product }: { product: Product }) => {
  const [liked, setLiked] = useState(false);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-lg border-border bg-card">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">{product.badge}</Badge>
              <div className="flex gap-2">
                <button onClick={(e) => { e.stopPropagation(); setLiked(!liked); }}>
                  <Heart size={18} className={liked ? "fill-red-500 text-red-500" : "text-muted-foreground"} />
                </button>
                <Share2 size={18} className="text-muted-foreground" />
              </div>
            </div>
            <div className="text-5xl text-center py-4">{product.image}</div>
            <CardTitle className="text-base font-bold text-foreground leading-tight">{product.name}</CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <Badge className="bg-primary text-primary-foreground text-xs">{product.rating} ★</Badge>
              <span className="text-xs text-muted-foreground">{product.reviews} Ratings</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-primary font-bold text-sm">-{product.discount}%</span>
              <span className="text-xl font-bold text-foreground">₹{product.price}</span>
            </div>
            <p className="text-xs text-muted-foreground line-through">M.R.P: ₹{product.mrp}</p>
            <div className="flex gap-2 mt-3">
              <Button variant="outline" size="sm" className="flex-1 text-xs border-primary text-primary hover:bg-primary/10">
                <ShoppingCart size={14} className="mr-1" /> Add to Cart
              </Button>
              <Button size="sm" className="flex-1 text-xs bg-primary text-primary-foreground hover:bg-primary/90">
                Buy Now
              </Button>
            </div>
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-between items-start">
            <Badge className="bg-primary/10 text-primary border-primary/20">{product.badge}</Badge>
          </div>
          <DialogTitle className="text-xl font-bold text-foreground mt-2">{product.name}</DialogTitle>
          <div className="flex items-center gap-2">
            <Badge className="bg-primary text-primary-foreground">{product.rating} ★</Badge>
            <span className="text-sm text-muted-foreground">{product.reviews} Ratings</span>
          </div>
        </DialogHeader>
        <div className="text-7xl text-center py-4">{product.image}</div>
        <div className="border-t border-border pt-3">
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-primary font-bold">-{product.discount}%</span>
            <span className="text-2xl font-bold text-foreground">₹{product.price}</span>
          </div>
          <p className="text-sm text-muted-foreground line-through">M.R.P: ₹{product.mrp}</p>
        </div>
        <div className="mt-4">
          <h3 className="font-bold text-foreground mb-2">Product Description</h3>
          <p className="text-sm text-muted-foreground">{product.description}</p>
        </div>
        <div className="mt-4">
          <h3 className="font-bold text-foreground mb-2">Specifications</h3>
          <div className="border border-border rounded-lg overflow-hidden">
            {Object.entries(product.specs).map(([key, value], i) => (
              <div key={key} className={`flex ${i % 2 === 0 ? "bg-muted/30" : "bg-card"}`}>
                <span className="text-sm text-muted-foreground py-2.5 px-3 w-2/5 border-r border-border">{key}</span>
                <span className="text-sm font-medium text-foreground py-2.5 px-3 w-3/5">{value}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin size={14} /> <span>{product.seller} • {product.location}</span>
        </div>
        <div className="flex gap-2 mt-4">
          <Button variant="outline" className="flex-1 border-primary text-primary hover:bg-primary/10">
            <ShoppingCart size={16} className="mr-2" /> Add to Cart
          </Button>
          <Button className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
            Buy Now
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const LeaseCard = ({ item }: { item: LeaseItem }) => (
  <Dialog>
    <DialogTrigger asChild>
      <Card className={`cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-lg border-border bg-card ${!item.available ? "opacity-60" : ""}`}>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <Badge className={`text-xs ${item.available ? "bg-primary/10 text-primary border-primary/20" : "bg-destructive/10 text-destructive border-destructive/20"}`}>
              {item.available ? item.badge : "Unavailable"}
            </Badge>
            {item.available && <span className="text-xs text-primary font-medium flex items-center gap-1"><Clock size={12} /> Available</span>}
          </div>
          <div className="text-5xl text-center py-4">{item.image}</div>
          <CardTitle className="text-base font-bold text-foreground leading-tight">{item.name}</CardTitle>
          <div className="flex items-center gap-2 mt-1">
            <Badge className="bg-primary text-primary-foreground text-xs">{item.rating} ★</Badge>
            <span className="text-xs text-muted-foreground">{item.reviews} Reviews</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-3 mb-1">
            <div className="flex items-center gap-1">
              <IndianRupee size={14} className="text-primary" />
              <span className="text-lg font-bold text-foreground">{item.pricePerDay}</span>
              <span className="text-xs text-muted-foreground">/day</span>
            </div>
            <div className="text-xs text-muted-foreground">₹{item.pricePerWeek}/week</div>
          </div>
          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1"><MapPin size={12} />{item.location}</p>
          <div className="flex gap-2 mt-3">
            <Button variant="outline" size="sm" className="flex-1 text-xs border-primary text-primary hover:bg-primary/10" disabled={!item.available}>
              <Phone size={14} className="mr-1" /> Contact
            </Button>
            <Button size="sm" className="flex-1 text-xs bg-primary text-primary-foreground hover:bg-primary/90" disabled={!item.available}>
              Book Now
            </Button>
          </div>
        </CardContent>
      </Card>
    </DialogTrigger>
    <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <Badge className={`w-fit ${item.available ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"}`}>
          {item.available ? "Available for Hire" : "Currently Unavailable"}
        </Badge>
        <DialogTitle className="text-xl font-bold text-foreground mt-2">{item.name}</DialogTitle>
        <div className="flex items-center gap-2">
          <Badge className="bg-primary text-primary-foreground">{item.rating} ★</Badge>
          <span className="text-sm text-muted-foreground">{item.reviews} Reviews</span>
        </div>
      </DialogHeader>
      <div className="text-7xl text-center py-4">{item.image}</div>
      <div className="border-t border-border pt-3">
        <div className="flex items-center gap-4">
          <div>
            <span className="text-2xl font-bold text-foreground">₹{item.pricePerDay}</span>
            <span className="text-sm text-muted-foreground"> /day</span>
          </div>
          <div className="text-sm text-muted-foreground">₹{item.pricePerWeek} /week</div>
        </div>
      </div>
      <div className="mt-4">
        <h3 className="font-bold text-foreground mb-2">Description</h3>
        <p className="text-sm text-muted-foreground">{item.description}</p>
      </div>
      <div className="mt-4">
        <h3 className="font-bold text-foreground mb-2">Specifications</h3>
        <div className="border border-border rounded-lg overflow-hidden">
          {Object.entries(item.specs).map(([key, value], i) => (
            <div key={key} className={`flex ${i % 2 === 0 ? "bg-muted/30" : "bg-card"}`}>
              <span className="text-sm text-muted-foreground py-2.5 px-3 w-2/5 border-r border-border">{key}</span>
              <span className="text-sm font-medium text-foreground py-2.5 px-3 w-3/5">{value}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
        <MapPin size={14} /> <span>{item.owner} • {item.location}</span>
      </div>
      <div className="flex gap-2 mt-4">
        <Button variant="outline" className="flex-1 border-primary text-primary hover:bg-primary/10" disabled={!item.available}>
          <Phone size={16} className="mr-2" /> Contact Owner
        </Button>
        <Button className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90" disabled={!item.available}>
          Book Now
        </Button>
      </div>
    </DialogContent>
  </Dialog>
);

const ProductsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const productCategories = ["all", ...new Set(farmingProducts.map(p => p.category))];
  const leaseCategories = ["all", ...new Set(leaseItems.map(l => l.category))];

  const filteredProducts = farmingProducts.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = selectedCategory === "all" || p.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  const filteredLease = leaseItems.filter(l => {
    const matchSearch = l.name.toLowerCase().includes(searchTerm.toLowerCase()) || l.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = selectedCategory === "all" || l.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2 flex items-center justify-center gap-3">
            <Package className="text-primary" size={36} />
            Krishi Marketplace
          </h1>
          <p className="text-muted-foreground">Buy farming products or hire equipment for your farm</p>
        </div>

        <Tabs defaultValue="sell" onValueChange={() => { setSearchTerm(""); setSelectedCategory("all"); }}>
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-6">
            <TabsTrigger value="sell" className="flex items-center gap-2">
              <Sprout size={16} /> Buy Products
            </TabsTrigger>
            <TabsTrigger value="lease" className="flex items-center gap-2">
              <Tractor size={16} /> Lease & Hire
            </TabsTrigger>
          </TabsList>

          {/* Search */}
          <div className="relative max-w-md mx-auto mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <Input
              placeholder="Search products or equipment..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <TabsContent value="sell">
            {/* Category filters */}
            <div className="flex flex-wrap gap-2 justify-center mb-6">
              {productCategories.map(cat => (
                <Button
                  key={cat}
                  variant={selectedCategory === cat ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(cat)}
                  className="text-xs capitalize"
                >
                  {cat === "all" ? "All Products" : cat}
                </Button>
              ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            {filteredProducts.length === 0 && (
              <p className="text-center text-muted-foreground py-12">No products found for this filter.</p>
            )}
          </TabsContent>

          <TabsContent value="lease">
            <div className="flex flex-wrap gap-2 justify-center mb-6">
              {leaseCategories.map(cat => (
                <Button
                  key={cat}
                  variant={selectedCategory === cat ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(cat)}
                  className="text-xs capitalize"
                >
                  {cat === "all" ? "All Equipment" : cat}
                </Button>
              ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredLease.map(item => (
                <LeaseCard key={item.id} item={item} />
              ))}
            </div>
            {filteredLease.length === 0 && (
              <p className="text-center text-muted-foreground py-12">No equipment found for this filter.</p>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProductsPage;
