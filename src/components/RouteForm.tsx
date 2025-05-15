
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { RouteResult } from "./RouteResult";
import { routeService } from "../services/api";

const ROUTE_PREFERENCES = [
  { value: "loop", label: "Loop (Start & End at Same Point)" },
  { value: "nature", label: "Nature & Parks" },
  { value: "urban", label: "Urban Exploration" },
  { value: "flat", label: "Flat Terrain" },
  { value: "hills", label: "Hills & Challenges" },
  { value: "scenic", label: "Scenic Views" },
];

export interface RouteFormData {
  location: string;
  distance: string;
  preference: string;
  pace: string;
}

export interface RouteResultData {
  name: string;
  start: string;
  summary: string;
  distance: number;
  time: string;
  tip: string;
}

export const RouteForm = () => {
  const [formData, setFormData] = useState<RouteFormData>({
    location: "",
    distance: "",
    preference: "loop",
    pace: "",
  });
  const [routeResult, setRouteResult] = useState<RouteResultData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field: keyof RouteFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Form validation
    if (!formData.location || !formData.distance || !formData.pace) {
      toast.error("Please fill in all fields");
      return;
    }
    
    const distance = parseFloat(formData.distance);
    const pace = parseFloat(formData.pace);
    
    if (isNaN(distance) || distance <= 0) {
      toast.error("Please enter a valid distance");
      return;
    }
    
    if (isNaN(pace) || pace <= 0) {
      toast.error("Please enter a valid pace");
      return;
    }

    // Call API
    setIsLoading(true);
    toast.info("Generating your perfect route...");
    console.log("Submitting form data:", formData);
    
    try {
      const generatedRoute = await routeService.generateRoute(formData);
      console.log("Generated route:", generatedRoute);
      setRouteResult(generatedRoute);
    } catch (error) {
      console.error("Error generating route:", error);
      toast.error("Failed to generate route. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setRouteResult(null);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {!routeResult ? (
        <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-white rounded-lg shadow-md">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="location">Starting Location</Label>
              <Input
                id="location"
                placeholder="Park, landmark, or street"
                value={formData.location}
                onChange={(e) => handleChange("location", e.target.value)}
                className="w-full"
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="distance">Distance (km)</Label>
                <Input
                  id="distance"
                  type="number"
                  placeholder="5"
                  min="1"
                  step="0.1"
                  value={formData.distance}
                  onChange={(e) => handleChange("distance", e.target.value)}
                  className="w-full"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="pace">Your Pace (min/km)</Label>
                <Input
                  id="pace"
                  type="number"
                  placeholder="6"
                  min="3"
                  step="0.1"
                  value={formData.pace}
                  onChange={(e) => handleChange("pace", e.target.value)}
                  className="w-full"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="preference">Route Preference</Label>
              <Select 
                value={formData.preference} 
                onValueChange={(value) => handleChange("preference", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select preference" />
                </SelectTrigger>
                <SelectContent>
                  {ROUTE_PREFERENCES.map((pref) => (
                    <SelectItem key={pref.value} value={pref.value}>
                      {pref.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="w-full gradient-bg hover:opacity-90 transition-opacity" 
            disabled={isLoading}
          >
            {isLoading ? "Finding Your Route..." : "Generate My Route"}
          </Button>
        </form>
      ) : (
        <RouteResult route={routeResult} onReset={handleReset} />
      )}
    </div>
  );
};
