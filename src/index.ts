import express, { Express } from 'express';
import cors from 'cors';
import { connectDB } from './utils/database';
import { connectRedis } from './utils/redis';
import config from './config/config';
import userRoutes from './routes/user.routes';
import taskRoutes from './routes/task.routes';
import { requestLogger } from './middleware/logger.middleware';
import { errorHandler, notFound } from './middleware/error.middleware';

// Initialize Express app
const app: Express = express();

// Connect to MongoDB
connectDB();

// Connect to Redis
connectRedis();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger middleware
app.use(requestLogger);

// Routes
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);

// Base route
app.get('/', (req, res) => {
  res.json({
    message: 'Task Management API',
    version: '1.0.0',
    endpoints: {
      users: '/api/users',
      tasks: '/api/tasks',
    },
  });
});

// 404 handler
app.use(notFound);

// Error handler
app.use(errorHandler);

// Start server
const PORT = config.port;
app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
  console.error('Unhandled Promise Rejection:', err);
  // Close server & exit process
  process.exit(1);
});
