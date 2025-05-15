
# Roxy Runs Her Route

A personalized running route generator app.

## Project Structure

- `src/` - Frontend React application
- `src/backend/` - Backend Express server

## Running the Application

### Backend Server

1. Install backend dependencies:
   ```
   npm install express cors axios
   ```

2. Install TypeScript dependencies:
   ```
   npm install -D typescript @types/express @types/cors
   ```

3. Run the backend server:
   ```
   npx ts-node src/backend/server.ts
   ```
   The server will run on port 3001 by default.

### Frontend Application

1. Start the frontend development server:
   ```
   npm run dev
   ```
   The frontend will run on port 8080 by default.

## API Endpoints

- `GET /api` - Test endpoint
- `POST /api/routes/generate` - Generate a running route based on user preferences

## Technologies Used

- Frontend: React, TypeScript, Tailwind CSS, Shadcn UI
- Backend: Express.js, Node.js
