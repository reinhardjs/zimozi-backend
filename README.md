# Task Management API

A RESTful API for task management built with Node.js, Express, TypeScript, MongoDB, JWT authentication, and Redis caching.

## Features

- User authentication with JWT
- Role-based access control (user/admin)
- CRUD operations for tasks
- MongoDB integration with Mongoose
- Request validation with express-validator
- Redis caching for improved performance
- Dockerized application for easy deployment
- Unit tests with Jest

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or remote)
- Redis (local or remote)
- Docker and Docker Compose (optional, for containerization)

## Getting Started

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd task-management-api
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Update the `.env` file with your configuration.

### Running the Application

#### Development Mode

```bash
npm run dev
```

#### Production Mode

```bash
npm run build
npm start
```

### Using Docker

```bash
docker-compose up
```

## API Endpoints

### Authentication

- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login and get JWT token
- `GET /api/users/profile` - Get user profile (protected)

### Tasks

- `POST /api/tasks` - Create a new task (protected)
- `GET /api/tasks/:id` - Get task by ID (protected)
- `GET /api/tasks` - Get all tasks with optional filters (protected)
- `PUT /api/tasks/:id` - Update task (protected)
- `DELETE /api/tasks/:id` - Delete task (admin only)

## Sample Data

To seed the database with sample data:

```bash
npx ts-node src/utils/seed.ts
```

## Testing

```bash
npm test
```

## Deployment

### Building the Docker Image

```bash
docker build -t task-management-api .
```

### Deploying to a Cloud Provider

The application can be deployed to cloud providers like Render, Railway, or fly.io using the provided Dockerfile.

## Kubernetes Deployment

Make sure your `kubectl` context is set to your k3s cluster, then execute:

```bash
chmod +x k3s/deploy.sh
./k3s/deploy.sh
```

## Project Structure

```
task-management-api/
├── src/
│   ├── config/         # Configuration files
│   ├── controllers/    # Route controllers
│   ├── data/           # Sample data
│   ├── middleware/     # Custom middleware
│   ├── models/         # Mongoose models
│   ├── routes/         # API routes
│   ├── utils/          # Utility functions
│   ├── __tests__/      # Test files
│   └── index.ts        # Application entry point
├── .env                # Environment variables
├── .env.example        # Example environment variables
├── .gitignore          # Git ignore file
├── docker-compose.yml  # Docker Compose configuration
├── Dockerfile          # Docker configuration
├── jest.config.js      # Jest configuration
├── package.json        # Project dependencies
├── tsconfig.json       # TypeScript configuration
└── README.md           # Project documentation
```

## License

ISC
