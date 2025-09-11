import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navigation from "./components/layout/Navigation";
import HomePage from "./pages/HomePage";
import WeatherPage from "./pages/WeatherPage";
import CropPricesPage from "./pages/CropPricesPage";
import SoilDataPage from "./pages/SoilDataPage";
import EscalationSystemPage from "./pages/EscalationSystemPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen">
          <Navigation />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/weather" element={<WeatherPage />} />
            <Route path="/prices" element={<CropPricesPage />} />
            <Route path="/soil" element={<SoilDataPage />} />
            <Route path="/escalation" element={<EscalationSystemPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
