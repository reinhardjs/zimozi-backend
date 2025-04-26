import mongoose from 'mongoose';
import User, { UserRole } from '../../models/User';

// Mock the mongoose connection
beforeAll(async () => {
  await mongoose.connect('mongodb://localhost:27017/test-db');
});

// Clean up after tests
afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

// Clean up after each test
afterEach(async () => {
  await User.deleteMany({});
});

describe('User Model', () => {
  it('should create a new user successfully', async () => {
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      role: UserRole.USER,
    };

    const user = await User.create(userData);

    expect(user).toBeDefined();
    expect(user.name).toBe(userData.name);
    expect(user.email).toBe(userData.email);
    expect(user.role).toBe(userData.role);
    // Password should be hashed, not plain text
    expect(user.password).not.toBe(userData.password);
  });

  it('should fail validation when email is invalid', async () => {
    const userData = {
      name: 'Test User',
      email: 'invalid-email',
      password: 'password123',
      role: UserRole.USER,
    };

    await expect(User.create(userData)).rejects.toThrow();
  });

  it('should compare password correctly', async () => {
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      role: UserRole.USER,
    };

    const user = await User.create(userData);
    
    // Valid password should return true
    const isValidPassword = await user.comparePassword('password123');
    expect(isValidPassword).toBe(true);
    
    // Invalid password should return false
    const isInvalidPassword = await user.comparePassword('wrongpassword');
    expect(isInvalidPassword).toBe(false);
  });
});
