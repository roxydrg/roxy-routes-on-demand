
import express from 'express';
import { generateRoute } from '../controllers/routeController';

const router = express.Router();

// Generate route endpoint
router.post('/generate', generateRoute);

export { router as routesRouter };
