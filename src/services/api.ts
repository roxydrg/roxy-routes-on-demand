import axios from 'axios';
import { supabase } from '../integrations/supabase/client';
import { RouteFormData, RouteResultData } from '../components/RouteForm';

// Database mock - in a real app, this would come from a proper backend
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

// Helper function to calculate running time
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

export const routeService = {
  generateRoute: async (routeData: RouteFormData): Promise<RouteResultData> => {
    // Simulating API call with a small delay
    return new Promise((resolve) => {
      setTimeout(() => {
        // Validation
        const distance = parseFloat(routeData.distance);
        const pace = parseFloat(routeData.pace);
        
        if (isNaN(distance) || distance <= 0 || isNaN(pace) || pace <= 0) {
          throw new Error('Invalid distance or pace');
        }
        
        // Generate a route based on preferences
        const baseRoute = EXAMPLE_ROUTES[Math.floor(Math.random() * EXAMPLE_ROUTES.length)];
        
        const generatedRoute: RouteResultData = {
          ...baseRoute,
          distance: distance,
          start: routeData.location,
          time: calculateTime(distance, pace)
        };

        // Adapt route summary based on preferences when possible
        if (routeData.preference === 'nature') {
          generatedRoute.summary = generatedRoute.summary.replace(
            /path|route/i, 
            'trail through lush greenery'
          );
          generatedRoute.tip = 'Look out for local wildlife - bring a camera!';
        }
        
        if (routeData.preference === 'urban') {
          generatedRoute.summary = generatedRoute.summary.replace(
            /park|garden|forest/i, 
            'vibrant city streets'
          );
          generatedRoute.tip = 'Early mornings are best to avoid pedestrian traffic in urban areas.';
        }

        resolve(generatedRoute);
      }, 800); // Simulate network delay
    });
  },
  
  saveRoute: async (routeData: RouteResultData, userId: string, name: string) => {
    try {
      const { data, error } = await supabase
        .from('saved_routes')
        .insert([{
          name,
          user_id: userId,
          start_location: routeData.start,
          summary: routeData.summary,
          distance: routeData.distance,
          estimated_time: routeData.time,
          route_tip: routeData.tip || null,
          preference: null, // This can be updated based on the form data if needed
        }]);
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error saving route:', error);
      throw new Error('Failed to save route');
    }
  },
  
  getSavedRoutes: async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('saved_routes')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching saved routes:', error);
      throw new Error('Failed to fetch saved routes');
    }
  },
  
  toggleFavoriteRoute: async (routeId: string, isFavorite: boolean) => {
    try {
      const { data, error } = await supabase
        .from('saved_routes')
        .update({ is_favorite: isFavorite })
        .eq('id', routeId);
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating favorite status:', error);
      throw new Error('Failed to update favorite status');
    }
  },
  
  shareRoute: async (routeId: string, userId: string, isPublic: boolean = true) => {
    try {
      const { data, error } = await supabase
        .from('shared_routes')
        .insert([{
          route_id: routeId,
          shared_by: userId,
          is_public: isPublic
        }]);
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error sharing route:', error);
      throw new Error('Failed to share route');
    }
  },
  
  getSharedRoutes: async () => {
    try {
      const { data, error } = await supabase
        .from('shared_routes')
        .select(`
          *,
          saved_routes(*)
        `)
        .eq('is_public', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching shared routes:', error);
      throw new Error('Failed to fetch shared routes');
    }
  }
};
