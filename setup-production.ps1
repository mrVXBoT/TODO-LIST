# PowerShell Script for Windows Production Setup
Write-Host "🚀 Setup TODO List App for Production (Windows)" -ForegroundColor Green
Write-Host "===============================================" -ForegroundColor Green

# Create logs directory
if (!(Test-Path "logs")) {
    New-Item -ItemType Directory -Path "logs"
    Write-Host "📁 Created logs directory" -ForegroundColor Yellow
}

# Backend setup
Write-Host "📦 Setting up Backend..." -ForegroundColor Cyan
Set-Location "BACKEND"

# Copy environment file
if (!(Test-Path ".env")) {
    Write-Host "⚙️ Creating .env file..." -ForegroundColor Yellow
    Copy-Item "env.production.example" ".env"
    Write-Host "⚠️  IMPORTANT: Edit BACKEND\.env with your production values!" -ForegroundColor Red
}

# Install dependencies
Write-Host "📥 Installing backend dependencies..." -ForegroundColor Cyan
npm install --production

# Generate Prisma client
Write-Host "🔧 Generating Prisma client..." -ForegroundColor Cyan
npx prisma generate

# Push database schema
Write-Host "🗄️ Setting up database..." -ForegroundColor Cyan
npx prisma db push

# Build TypeScript
Write-Host "🔨 Building backend..." -ForegroundColor Cyan
npm run build

Set-Location ".."

# Frontend setup
Write-Host "🌐 Setting up Frontend..." -ForegroundColor Cyan
Set-Location "FRONT"

# Copy environment file
if (!(Test-Path ".env.local")) {
    Write-Host "⚙️ Creating .env.local file..." -ForegroundColor Yellow
    Copy-Item "env.production.example" ".env.local"
    Write-Host "⚠️  IMPORTANT: Edit FRONT\.env.local with your production values!" -ForegroundColor Red
}

# Install dependencies
Write-Host "📥 Installing frontend dependencies..." -ForegroundColor Cyan
npm install --production

# Build Next.js
Write-Host "🔨 Building frontend..." -ForegroundColor Cyan
npm run build

Set-Location ".."

Write-Host ""
Write-Host "✅ Setup completed!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Yellow
Write-Host "1. Edit BACKEND\.env with your production values" -ForegroundColor White
Write-Host "2. Edit FRONT\.env.local with your production values" -ForegroundColor White
Write-Host "3. Install PM2: npm install -g pm2" -ForegroundColor White
Write-Host "4. Start services: pm2 start ecosystem.config.js" -ForegroundColor White
Write-Host "5. Save PM2 configuration: pm2 save && pm2 startup" -ForegroundColor White
Write-Host ""
Write-Host "🎉 Your TODO List app is ready for production!" -ForegroundColor Green

