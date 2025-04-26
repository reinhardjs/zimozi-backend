import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const config = {
  port: process.env.PORT || 3000,
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/task-management',
  jwtSecret: process.env.JWT_SECRET || 'default_jwt_secret',
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
};

export default config;
