
import axios from 'axios';
import { supabase } from '../integrations/supabase/client';
import { RouteFormData, RouteResultData } from '../components/RouteForm';

const API_URL = 'http://localhost:3001/api';

export const routeService = {
  generateRoute: async (routeData: RouteFormData): Promise<RouteResultData> => {
    try {
      const response = await axios.post(`${API_URL}/routes/generate`, routeData);
      return response.data;
    } catch (error) {
      console.error('Error generating route:', error);
      throw new Error('Failed to generate route');
    }
  },
  
  saveRoute: async (routeData: RouteResultData, userId: string, name: string) => {
    try {
      const { data, error } = await supabase
        .from('saved_routes')
        .insert([{
          name,
          user_id: userId,
          start_location: routeData.startLocation,
          summary: routeData.summary,
          distance: routeData.distance,
          estimated_time: routeData.estimatedTime,
          route_tip: routeData.routeTip || null,
          preference: routeData.preference || null,
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
