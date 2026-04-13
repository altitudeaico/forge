#!/bin/bash

# Forge Setup Script
# Run this after cloning the repo

echo "🔧 Setting up Forge..."

# Check Node version
NODE_VERSION=$(node -v 2>/dev/null | cut -d'v' -f2 | cut -d'.' -f1)
if [ -z "$NODE_VERSION" ] || [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js 18+ required. Please install from https://nodejs.org"
    exit 1
fi
echo "✅ Node.js version OK"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check for .env.local
if [ ! -f ".env.local" ]; then
    echo ""
    echo "⚠️  No .env.local found!"
    echo ""
    echo "Create .env.local with your Supabase credentials:"
    echo ""
    echo "  NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co"
    echo "  NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key"
    echo ""
    echo "Get these from: Supabase Dashboard > Settings > API"
    echo ""
    cp .env.example .env.local
    echo "📝 Created .env.local from .env.example - please fill in your values"
else
    echo "✅ .env.local exists"
fi

echo ""
echo "🚀 Setup complete!"
echo ""
echo "Next steps:"
echo "  1. Add Supabase credentials to .env.local"
echo "  2. Run migrations in Supabase SQL Editor"
echo "  3. npm run dev"
echo ""
