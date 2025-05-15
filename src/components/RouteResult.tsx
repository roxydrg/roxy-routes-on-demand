
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { RouteResultData } from "./RouteForm";
import { cn } from "@/lib/utils";

interface RouteResultProps {
  route: RouteResultData;
  onReset: () => void;
}

export const RouteResult = ({ route, onReset }: RouteResultProps) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="gradient-bg px-6 py-8 text-white">
        <h2 className="text-2xl md:text-3xl font-bold">{route.name}</h2>
        <p className="text-white/80 mt-2">Here's your personalized running route!</p>
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
