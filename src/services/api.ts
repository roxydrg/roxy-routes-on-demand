
import axios from 'axios';
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
  }
};
