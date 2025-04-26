# Cloud Deployment

This document describes how to deploy Zimozi-Backend on a k3s Kubernetes cluster.

## Prerequisites

- k3s cluster up & running  
- `kubectl` context pointing at k3s  
- `.env` with:  
  - `MONGODB_URI`  
  - `REDIS_URL`  
  - `JWT_SECRET`

## Steps

1. Build Docker image on k3s server node  
   ```bash
   # (on k3s node)
   docker build -t reinhardjs/zimozi-app:latest .
   ```
2. Run k3s deployment script  
   ```bash
   chmod +x k3s/deploy.sh
   ./k3s/deploy.sh
   ```
