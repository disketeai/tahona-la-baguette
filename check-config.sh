#!/bin/bash

# Tahona La Baguette - Diagnostic Script
# This script checks your environment configuration

echo "🔍 Tahona La Baguette - Configuration Check"
echo "=========================================="
echo ""

# Check if .env.local exists
if [ -f ".env.local" ]; then
    echo "✅ .env.local file exists"
    
    # Check if variables are set (without showing values)
    if grep -q "VITE_SUPABASE_URL=" .env.local; then
        echo "✅ VITE_SUPABASE_URL is defined"
    else
        echo "❌ VITE_SUPABASE_URL is missing"
    fi
    
    if grep -q "VITE_SUPABASE_ANON_KEY=" .env.local; then
        echo "✅ VITE_SUPABASE_ANON_KEY is defined"
    else
        echo "❌ VITE_SUPABASE_ANON_KEY is missing"
    fi
else
    echo "❌ .env.local file not found"
    echo ""
    echo "To fix this:"
    echo "1. Copy .env.local.example to .env.local"
    echo "   cp .env.local.example .env.local"
    echo ""
    echo "2. Edit .env.local with your Supabase credentials"
    echo "   Get them from: https://app.supabase.com/project/_/settings/api"
fi

echo ""
echo "📦 Node Modules Check"
if [ -d "node_modules" ]; then
    echo "✅ node_modules directory exists"
else
    echo "❌ node_modules not found - run 'npm install'"
fi

echo ""
echo "🌐 Port Check"
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    echo "✅ Dev server is running on port 3000"
else
    echo "⚠️  No process listening on port 3000"
    echo "   Run 'npm run dev' to start the server"
fi

echo ""
echo "=========================================="
echo "For more help, see SETUP_GUIDE.md"
