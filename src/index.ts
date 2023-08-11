import express from 'express';
import bodyParser from 'body-parser';

import cors from 'cors';
import mongoose from 'mongoose';
import swaggerUi from 'swagger-ui-express';

import dotenv from 'dotenv';
import path from 'path';
import userRoutes from './routes/user';
import teamsRoutes from './routes/teams';
import surveyRoutes from './routes/survey';
import adminRoutes from './routes/admin';

// Load environment variables from .env file
dotenv.config();

const app = express();


// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB Connection
const dbConnectionString = process.env.DB_CONNECTION_STRING!;
const dbOptions = {
  
  serverSelectionTimeoutMS: 5000, // Adjust the timeout as needed
} as mongoose.ConnectOptions;
mongoose
  .connect(dbConnectionString, dbOptions
   // Adjust the timeout as needed
  )
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));
mongoose.set('debug', true);

// Routes
app.use('/api/user', userRoutes);
app.use('/api/teams', teamsRoutes);
app.use('/api/survey', surveyRoutes);
app.use('/api/admin', adminRoutes);


// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
