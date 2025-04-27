#!/usr/bin/env bash
set -euo pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

kubectl apply -f "$DIR/secret.yaml"
kubectl apply -f "$DIR/mongodb-deployment.yaml"
kubectl apply -f "$DIR/mongodb-service.yaml"
kubectl apply -f "$DIR/redis-deployment.yaml"
kubectl apply -f "$DIR/redis-service.yaml"
kubectl apply -f "$DIR/app-deployment.yaml"
kubectl apply -f "$DIR/app-service.yaml"
kubectl apply -f "$DIR/app-ingress.yaml"

echo "✅ All resources created in the 'zimozi' namespace."
