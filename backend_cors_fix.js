import express from 'express';
import cors from 'cors';

// ... other imports

const app = express();

// =================================================================
// IMPORTANT CORS CONFIGURATION
// =================================================================
// You should apply this configuration BEFORE your routes.

// Define your frontend URL
const frontendURL = process.env.FRONTEND_URL || 'http://localhost:3000';

const corsOptions = {
  // Allow requests from your frontend
  origin: [frontendURL, 'https://juspost.com'], 
  
  // Allow all standard methods including PUT and DELETE
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', 
  
  // Allow credentials (if you use cookies or sessions)
  credentials: true, 
  
  // Allow necessary headers, especially for authentication
  allowedHeaders: 'Content-Type,Authorization', 
  
  // Set a success status for pre-flight OPTIONS requests
  optionsSuccessStatus: 200 
};

// Use CORS middleware for all incoming requests
app.use(cors(corsOptions));

// This handles pre-flight requests for all routes.
// A pre-flight request is an OPTIONS request sent before the actual
// request (e.g., PUT, DELETE) to check if the server will allow it.
app.options('*', cors(corsOptions));


// =================================================================
// Your other middleware and routes go here
// =================================================================

// For example:
// app.use(express.json());
// app.use('/api/users', userRoutes);
// app.use('/api/posts', postRoutes);

// ... rest of your server setup

export default app; 