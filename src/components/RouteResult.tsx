
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save } from "lucide-react";
import { RouteResultData } from "./RouteForm";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { routeService } from "@/services/api";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface RouteResultProps {
  route: RouteResultData;
  onReset: () => void;
}

export const RouteResult = ({ route, onReset }: RouteResultProps) => {
  const [routeName, setRouteName] = useState(route.name);
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  const handleSaveRoute = async () => {
    const { data: session } = await supabase.auth.getSession();
    
    if (!session.session) {
      toast.error("Please sign in to save routes");
      navigate("/auth");
      return;
    }
    
    setIsSaving(true);
    
    try {
      await routeService.saveRoute(route, session.session.user.id, routeName);
      toast.success("Route saved successfully!");
      
      // Ask if they want to view their routes
      setTimeout(() => {
        const goToDashboard = window.confirm("Route saved! Would you like to view your saved routes?");
        if (goToDashboard) {
          navigate("/dashboard");
        }
      }, 500);
    } catch (error) {
      console.error("Error saving route:", error);
      toast.error("Failed to save route");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="gradient-bg px-6 py-8 text-white">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl md:text-3xl font-bold">{route.name}</h2>
          <Button 
            variant="secondary" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={handleSaveRoute}
            disabled={isSaving}
          >
            <Save size={16} />
            {isSaving ? "Saving..." : "Save Route"}
          </Button>
        </div>
        <p className="text-white/80 mt-2">Here's your personalized running route!</p>
      </div>
      
      {/* Save form (when saving) */}
      <div className="px-6 pt-4">
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            Route Name:
          </label>
          <Input
            value={routeName}
            onChange={(e) => setRouteName(e.target.value)}
            placeholder="Enter a name for this route"
            className="w-full"
          />
        </div>
      </div>
      
      {/* Route details */}
      <div className="p-6 space-y-6">
        {/* Start location */}
        <div className="flex items-start gap-4">
          <div className="mt-1 flex-shrink-0 h-8 w-8 rounded-full bg-accent flex items-center justify-center">
            <span className="text-xl">📍</span>
          </div>
          <div>
            <h3 className="font-semibold text-lg text-gray-800">Start</h3>
            <p className="text-gray-600">{route.start}</p>
          </div>
        </div>
        
        {/* Route summary */}
        <div className="flex items-start gap-4">
          <div className="mt-1 flex-shrink-0 h-8 w-8 rounded-full bg-accent flex items-center justify-center">
            <span className="text-xl">🗺️</span>
          </div>
          <div>
            <h3 className="font-semibold text-lg text-gray-800">Route Summary</h3>
            <p className="text-gray-600">{route.summary}</p>
          </div>
        </div>
        
        {/* Distance and time */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-start gap-4">
            <div className="mt-1 flex-shrink-0 h-8 w-8 rounded-full bg-accent flex items-center justify-center">
              <span className="text-xl">📏</span>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-800">Distance</h3>
              <p className="text-gray-600">{route.distance} km</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="mt-1 flex-shrink-0 h-8 w-8 rounded-full bg-accent flex items-center justify-center">
              <span className="text-xl">⏱️</span>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-800">Estimated Time</h3>
              <p className="text-gray-600">{route.time}</p>
            </div>
          </div>
        </div>
        
        {/* Running tip */}
        <div className={cn(
          "bg-accent p-4 rounded-lg",
          "border-l-4 border-roxy-teal",
          "flex items-start gap-4"
        )}>
          <div className="flex-shrink-0">
            <span className="text-xl">✨</span>
          </div>
          <div>
            <h3 className="font-semibold text-accent-foreground">Tip</h3>
            <p className="text-accent-foreground/80">{route.tip}</p>
          </div>
        </div>
        
        {/* Back button */}
        <Button 
          variant="outline" 
          onClick={onReset} 
          className="mt-6 flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          Generate Another Route
        </Button>
      </div>
    </div>
  );
};
