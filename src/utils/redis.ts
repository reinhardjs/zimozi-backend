import { createClient } from 'redis';
import config from '../config/config';

// Create Redis client
const redisClient = createClient({
  url: config.redisUrl,
});

// Connect to Redis
export const connectRedis = async (): Promise<void> => {
  try {
    await redisClient.connect();
    console.log('Redis connected successfully');
  } catch (error) {
    console.error('Redis connection error:', error);
  }
};

// Set data in Redis cache with expiration time
export const setCache = async (
  key: string,
  value: any,
  expirationInSeconds = 60
): Promise<void> => {
  try {
    await redisClient.set(key, JSON.stringify(value), {
      EX: expirationInSeconds,
    });
  } catch (error) {
    console.error('Redis set error:', error);
  }
};

// Get data from Redis cache
export const getCache = async (key: string): Promise<any | null> => {
  try {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Redis get error:', error);
    return null;
  }
};

// Delete data from Redis cache
export const deleteCache = async (key: string): Promise<void> => {
  try {
    await redisClient.del(key);
  } catch (error) {
    console.error('Redis delete error:', error);
  }
};

// Delete multiple keys with a pattern
export const deleteCachePattern = async (pattern: string): Promise<void> => {
  try {
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) {
      await redisClient.del(keys);
    }
  } catch (error) {
    console.error('Redis delete pattern error:', error);
  }
};

export default redisClient;
