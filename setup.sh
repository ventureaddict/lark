#!/bin/bash

echo "🐦 Setting up Lark development environment..."

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Setup backend API
echo "🔧 Setting up backend API..."
cd apps/api

# Install backend dependencies
npm install

# Create environment file
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "⚠️  Please edit apps/api/.env with your API keys before continuing"
fi

# For now, we'll use SQLite instead of PostgreSQL for easier setup
echo "🗄️  Setting up SQLite database..."

# Update the .env to use SQLite
sed -i.bak 's|DATABASE_URL="postgresql://.*"|DATABASE_URL="file:./dev.db"|' .env

cd ../..

echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit apps/api/.env and add your API keys:"
echo "   - ANTHROPIC_API_KEY (required for AI chat)"
echo "   - JWT_SECRET (use any random string)"
echo ""
echo "2. Initialize the database:"
echo "   cd apps/api && npm run generate && npm run migrate:dev"
echo ""
echo "3. Start the backend:"
echo "   cd apps/api && npm run dev"
echo ""
echo "4. In another terminal, start the mobile app:"
echo "   cd apps/mobile && npm install && npm start"