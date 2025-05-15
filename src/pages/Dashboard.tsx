
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { routeService } from "../services/api";
import { Heart, Share } from "lucide-react";
import { Header } from "@/components/Header";
import { Navbar } from "@/components/Navbar";

interface SavedRoute {
  id: string;
  name: string;
  start_location: string;
  summary: string;
  distance: number;
  estimated_time: string;
  route_tip: string | null;
  is_favorite: boolean | null;
  created_at: string;
}

const Dashboard = () => {
  const [routes, setRoutes] = useState<SavedRoute[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      
      if (!data.session) {
        navigate("/auth");
        return;
      }
      
      setUser(data.session.user);
      fetchSavedRoutes(data.session.user.id);
    };
    
    checkAuth();
    
    // Listen for authentication changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_OUT") {
          navigate("/auth");
        } else if (session) {
          setUser(session.user);
          fetchSavedRoutes(session.user.id);
        }
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const fetchSavedRoutes = async (userId: string) => {
    setLoading(true);
    try {
      const savedRoutes = await routeService.getSavedRoutes(userId);
      setRoutes(savedRoutes);
    } catch (error) {
      console.error("Error fetching routes:", error);
      toast.error("Failed to load your saved routes");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async (routeId: string, isFavorite: boolean) => {
    try {
      await routeService.toggleFavoriteRoute(routeId, !isFavorite);
      // Update the local state
      setRoutes(routes.map(route => 
        route.id === routeId 
          ? { ...route, is_favorite: !isFavorite } 
          : route
      ));
      toast.success(isFavorite ? "Removed from favorites" : "Added to favorites");
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast.error("Failed to update favorite status");
    }
  };

  const handleShareRoute = async (routeId: string) => {
    if (!user) return;
    
    try {
      await routeService.shareRoute(routeId, user.id);
      toast.success("Route shared successfully!");
    } catch (error) {
      console.error("Error sharing route:", error);
      toast.error("Failed to share route");
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-roxy-light to-white">
      <Navbar user={user} onSignOut={handleSignOut} />
      
      <div className="container px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">My Saved Routes</h1>
          <Button 
            onClick={() => navigate("/")} 
            variant="outline"
          >
            Create New Route
          </Button>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <p>Loading your routes...</p>
          </div>
        ) : routes.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-2">No saved routes yet</h2>
            <p className="text-gray-600 mb-6">Create your first running route and save it to see it here!</p>
            <Button 
              onClick={() => navigate("/")} 
              className="gradient-bg hover:opacity-90 transition-opacity"
            >
              Create Your First Route
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {routes.map((route) => (
              <Card key={route.id} className="overflow-hidden">
                <CardHeader className="gradient-bg text-white">
                  <CardTitle>{route.name}</CardTitle>
                  <CardDescription className="text-white/80">
                    {route.distance} km · {route.estimated_time}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-2">
                    <div>
                      <h4 className="font-semibold text-sm">Start Location</h4>
                      <p className="text-gray-600">{route.start_location}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">Route Summary</h4>
                      <p className="text-gray-600 line-clamp-3">{route.summary}</p>
                    </div>
                    {route.route_tip && (
                      <div className="bg-accent p-2 rounded-md">
                        <h4 className="font-semibold text-sm">Tip</h4>
                        <p className="text-accent-foreground/80 text-sm line-clamp-2">{route.route_tip}</p>
                      </div>
                    )}
                    <div className="text-xs text-gray-500">
                      Saved on {formatDate(route.created_at)}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between pt-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleFavorite(route.id, !!route.is_favorite)}
                    className={`flex items-center gap-1 ${route.is_favorite ? 'text-red-500' : ''}`}
                  >
                    <Heart size={16} fill={route.is_favorite ? "currentColor" : "none"} />
                    {route.is_favorite ? "Favorited" : "Favorite"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleShareRoute(route.id)}
                    className="flex items-center gap-1"
                  >
                    <Share size={16} />
                    Share
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
