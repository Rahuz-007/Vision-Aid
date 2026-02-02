#!/usr/bin/env bash

# VisionAid Production Build Script
# This script builds both frontend and backend for production

set -e

echo "🚀 Starting VisionAid Production Build..."
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check Node.js version
echo "📋 Checking prerequisites..."
NODE_VERSION=$(node -v)
echo "✓ Node.js version: $NODE_VERSION"

if ! command -v npm &> /dev/null; then
    echo -e "${RED}✗ npm not found. Please install Node.js and npm.${NC}"
    exit 1
fi

echo ""
echo "📦 Building Frontend..."
cd "front -end/vision-aid-ui"

# Clean previous build
if [ -d "build" ]; then
    rm -rf build
    echo "✓ Cleaned previous build"
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📥 Installing dependencies..."
    npm install
fi

# Build frontend
echo "🔨 Building React app..."
npm run build

if [ ! -d "build" ]; then
    echo -e "${RED}✗ Frontend build failed!${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Frontend built successfully${NC}"

# Get build size
BUILD_SIZE=$(du -sh build | cut -f1)
echo "📊 Build size: $BUILD_SIZE"

cd "../.."
echo ""
echo "📦 Verifying Backend..."
cd "Back-end"

if [ ! -d "node_modules" ]; then
    echo "📥 Installing backend dependencies..."
    npm install
fi

# Check required environment variables
echo ""
echo "⚙️  Checking environment variables..."
if [ ! -f ".env.production" ]; then
    echo -e "${YELLOW}⚠️  Warning: .env.production not found!${NC}"
    echo "   Create .env.production with your production secrets"
    echo "   Template available at .env.production"
else
    echo "✓ .env.production found"
fi

cd ".."
echo ""
echo -e "${GREEN}✅ Build process completed successfully!${NC}"
echo ""
echo "📋 Next steps:"
echo "1. Update Back-end/.env.production with your production settings"
echo "2. Update front-end/vision-aid-ui/.env.production with your production settings"
echo "3. Test the build locally:"
echo "   cd front-end/vision-aid-ui"
echo "   npm start (for testing before deployment)"
echo "4. Deploy using your chosen platform (Heroku, AWS, Docker, etc.)"
echo "5. See PRODUCTION_DEPLOYMENT_GUIDE.md for detailed instructions"
echo ""
