#!/bin/bash

echo "🚀 Setup TODO List App for Production"
echo "====================================="

# Create logs directory
mkdir -p logs

# Backend setup
echo "📦 Setting up Backend..."
cd BACKEND

# Copy environment file
if [ ! -f .env ]; then
    echo "⚙️ Creating .env file..."
    cp env.production.example .env
    echo "⚠️  IMPORTANT: Edit BACKEND/.env with your production values!"
fi

# Install dependencies
echo "📥 Installing backend dependencies..."
npm install --production

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

# Push database schema
echo "🗄️ Setting up database..."
npx prisma db push

# Build TypeScript
echo "🔨 Building backend..."
npm run build

cd ..

# Frontend setup
echo "🌐 Setting up Frontend..."
cd FRONT

# Copy environment file
if [ ! -f .env.local ]; then
    echo "⚙️ Creating .env.local file..."
    cp env.production.example .env.local
    echo "⚠️  IMPORTANT: Edit FRONT/.env.local with your production values!"
fi

# Install dependencies
echo "📥 Installing frontend dependencies..."
npm install --production

# Build Next.js
echo "🔨 Building frontend..."
npm run build

cd ..

echo ""
echo "✅ Setup completed!"
echo ""
echo "📋 Next Steps:"
echo "1. Edit BACKEND/.env with your production values"
echo "2. Edit FRONT/.env.local with your production values"
echo "3. Copy nginx.conf.example to /etc/nginx/sites-available/"
echo "4. Install PM2: npm install -g pm2"
echo "5. Start services: pm2 start ecosystem.config.js"
echo "6. Save PM2 configuration: pm2 save && pm2 startup"
echo ""
echo "🎉 Your TODO List app is ready for production!"
