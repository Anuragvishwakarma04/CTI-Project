#!/bin/bash

# Remove duplicate route directories if they exist
rm -rf app/cars
rm -rf app/dealers
rm -rf app/login
rm -rf app/services
rm -rf app/warranty

# Clear Next.js cache
rm -rf .next
rm -rf node_modules/.cache

echo "Duplicate routes removed and cache cleared"
echo "Now run: npm run build"
