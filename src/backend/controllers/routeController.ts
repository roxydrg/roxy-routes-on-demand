
import { Request, Response } from 'express';
import { RouteFormData, RouteResultData } from '../../components/RouteForm';

// Database mock - in a real app, this would be a proper database
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

export const generateRoute = (req: Request, res: Response): void => {
  try {
    const routeData = req.body as RouteFormData;
    
    // Validation
    if (!routeData.location || !routeData.distance || !routeData.pace) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }
    
    const distance = parseFloat(routeData.distance);
    const pace = parseFloat(routeData.pace);
    
    if (isNaN(distance) || distance <= 0) {
      res.status(400).json({ error: 'Invalid distance' });
      return;
    }
    
    if (isNaN(pace) || pace <= 0) {
      res.status(400).json({ error: 'Invalid pace' });
      return;
    }
    
    // Generate a route based on preferences
    // In a real app, this would use algorithms and possibly mapping APIs
    // For now, we'll just adapt an example route
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

    // Success response
    res.status(200).json(generatedRoute);
  } catch (error) {
    console.error('Error generating route:', error);
    res.status(500).json({ error: 'Failed to generate route' });
  }
};
