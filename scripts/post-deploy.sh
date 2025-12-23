#!/bin/bash

# Post-deployment script for Hostinger
echo "Running post-deployment tasks..."

# Generate Prisma Client
echo "Generating Prisma Client..."
npx prisma generate

# Push database schema
echo "Pushing database schema..."
npx prisma db push --accept-data-loss

echo "Post-deployment completed!"
