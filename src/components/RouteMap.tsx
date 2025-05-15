
import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { RouteResultData } from "./RouteForm";

interface RouteMapProps {
  route: RouteResultData;
}

export const RouteMap = ({ route }: RouteMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Create map if it doesn't exist
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current).setView([51.505, -0.09], 13);
      
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(mapInstanceRef.current);
    }
    
    // Geocode the starting location to get coordinates
    geocodeLocation(route.start)
      .then((coords) => {
        if (!mapInstanceRef.current) return;
        
        // Update map view to the starting location
        mapInstanceRef.current.setView(coords, 15);
        
        // Add marker for starting point
        const startMarker = L.marker(coords, {
          icon: L.divIcon({
            className: "start-marker",
            html: "🏁",
            iconSize: [30, 30],
            iconAnchor: [15, 15],
          }),
        }).addTo(mapInstanceRef.current);
        
        // Create a mock route path (circular route)
        const pathCoords = createCircularRoute(coords, route.distance);
        
        // Add path to map
        L.polyline(pathCoords, { color: "#ff69b4", weight: 5 }).addTo(mapInstanceRef.current);
        
        // Add distance markers
        addDistanceMarkers(pathCoords, mapInstanceRef.current);
      })
      .catch((error) => {
        console.error("Error geocoding location:", error);
      });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [route]);

  // Simple geocoder that converts address to lat/lng
  // In a real app, you'd use a proper geocoding service
  const geocodeLocation = async (location: string): Promise<[number, number]> => {
    // For demo purposes, we'll use rough estimates for locations
    // In a real app, you would use a geocoding API
    
    // London postcodes (for testing with E14 3BE)
    if (location.toUpperCase().includes("E14")) {
      return [51.5074, -0.0275]; // Canary Wharf area
    }
    
    // Simple mapping for common locations
    if (location.toLowerCase().includes("central park")) {
      return [40.785091, -73.968285];
    }
    
    if (location.toLowerCase().includes("harbor bridge")) {
      return [33.852169, 151.210967];
    }
    
    if (location.toLowerCase().includes("mountain view")) {
      return [37.386051, -122.083855];
    }
    
    // Default to central London if we can't recognize the location
    return [51.5074, -0.1278];
  };

  // Create a circular route of approximate distance
  const createCircularRoute = (center: [number, number], distanceKm: number): [number, number][] => {
    const points: [number, number][] = [];
    const steps = 20;
    const radius = distanceKm / (2 * Math.PI) * 0.008; // Rough conversion to degrees
    
    for (let i = 0; i <= steps; i++) {
      const angle = (i / steps) * 2 * Math.PI;
      const lat = center[0] + radius * Math.cos(angle);
      const lng = center[1] + radius * Math.sin(angle);
      points.push([lat, lng]);
    }
    
    return points;
  };

  // Add markers at each kilometer
  const addDistanceMarkers = (path: [number, number][], map: L.Map) => {
    const totalPoints = path.length;
    const interval = Math.floor(totalPoints / 5); // 5 markers along the route
    
    for (let i = 1; i < 5; i++) {
      const position = path[i * interval];
      const distance = (i * interval / totalPoints * 100).toFixed(0);
      
      L.marker(position, {
        icon: L.divIcon({
          className: "distance-marker",
          html: `${i}km`,
          iconSize: [30, 20],
          iconAnchor: [15, 10],
        }),
      }).addTo(map);
    }
  };

  return (
    <div className="mt-4 rounded-lg overflow-hidden border border-gray-200 shadow-md">
      <div ref={mapRef} className="h-[400px] w-full" />
      <style>
        {`
          .start-marker {
            font-size: 25px;
            text-align: center;
          }
          .distance-marker {
            background-color: rgba(255, 255, 255, 0.8);
            border-radius: 4px;
            padding: 2px;
            font-size: 12px;
            font-weight: bold;
            text-align: center;
            border: 2px solid #ff69b4;
          }
        `}
      </style>
    </div>
  );
};
