import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { connectDB, closeDB } from './database';
import User from '../models/User';
import Task from '../models/Task';
import config from '../config/config';

// Function to seed the database with sample data
const seedDatabase = async (): Promise<void> => {
  try {
    // Connect to MongoDB
    await connectDB();
    
    console.log('Clearing existing data...');
    
    // Clear existing data
    await User.deleteMany({});
    await Task.deleteMany({});
    
    // Read sample data
    const sampleData = JSON.parse(
      fs.readFileSync(
        path.resolve(__dirname, '../data/sample-data.json'),
        'utf-8'
      )
    );
    
    console.log('Creating users...');
    
    // Create users
    const users = await User.create(sampleData.users);
    
    console.log('Creating tasks...');
    
    // Map user IDs to tasks
    const tasks = sampleData.tasks.map((task: any, index: number) => {
      const userIndex = index % users.length;
      return {
        ...task,
        assignedTo: users[userIndex]._id,
      };
    });
    
    // Create tasks
    await Task.create(tasks);
    
    console.log('Database seeded successfully!');
    
    // Close database connection
    await closeDB();
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase();
