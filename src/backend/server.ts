
import express from 'express';
import cors from 'cors';
import { routesRouter } from './routes/routes';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/routes', routesRouter);

// Base route for testing
app.get('/api', (req, res) => {
  res.json({ message: 'Welcome to Roxy Runs Her Route API' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
