
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { RouteResult } from "./RouteResult";

const ROUTE_PREFERENCES = [
  { value: "loop", label: "Loop (Start & End at Same Point)" },
  { value: "nature", label: "Nature & Parks" },
  { value: "urban", label: "Urban Exploration" },
  { value: "flat", label: "Flat Terrain" },
  { value: "hills", label: "Hills & Challenges" },
  { value: "scenic", label: "Scenic Views" },
];

const EXAMPLE_ROUTES = [
  {
    name: "Sunrise Park Loop",
    start: "Central Park Entrance",
    summary: "Begin at the Central Park South entrance and follow the main path counterclockwise. Pass by the picturesque lake, continue through the tree-lined Mall, and circle back via Bethesda Terrace. This route offers a perfect balance of shade and sun with minimal elevation changes.",
    distance: 5.2,
    time: "31 minutes",
    tip: "Morning runs here are magical - try to catch the sunrise for extra inspiration!",
  },
  {
    name: "Riverside Explorer",
    start: "Harbor Bridge Lookout",
    summary: "Start at Harbor Bridge and follow the river path eastward. You'll pass the Maritime Museum, continue through Riverside Gardens with its beautiful flower displays, and loop back via the pedestrian boardwalk. The route is mostly flat with excellent views of the water.",
    distance: 8.1,
    time: "49 minutes",
    tip: "Bring a water bottle - the drinking fountains along this route are limited!",
  },
  {
    name: "Hill Conqueror Challenge",
    start: "Mountain View Park",
    summary: "Begin at Mountain View Park entrance and take the Summit Trail uphill. The first 2km are challenging with steep inclines, but you'll be rewarded with panoramic city views at the top. The return route follows a gentler gradient through the forest section.",
    distance: 6.4,
    time: "38 minutes",
    tip: "Take shorter strides on the uphill sections to conserve energy.",
  },
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

  const calculateTime = (distance: number, pace: number): string => {
    const totalMinutes = distance * pace;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.round(totalMinutes % 60);
    
    if (hours > 0) {
      return `${hours} hr ${minutes} min`;
    } else {
      return `${minutes} min`;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
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

    // Simulate loading
    setIsLoading(true);
    toast.info("Generating your perfect route...");
    
    // Simulate API call - In a real app, this would be an actual API call
    setTimeout(() => {
      // Pick a random example route and adapt it
      const baseRoute = EXAMPLE_ROUTES[Math.floor(Math.random() * EXAMPLE_ROUTES.length)];
      
      // Adapt route to user inputs
      const adjustedRoute: RouteResultData = {
        ...baseRoute,
        distance: parseFloat(formData.distance),
        start: formData.location,
        time: calculateTime(distance, pace)
      };
      
      setRouteResult(adjustedRoute);
      setIsLoading(false);
    }, 2000);
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
