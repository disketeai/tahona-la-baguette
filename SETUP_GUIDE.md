# Tahona La Baguette - Setup Guide

## 🔍 Current Issues & Solutions

### 1. ✅ FIXED: Missing index.css
- **Issue**: 404 error for `/index.css`
- **Solution**: Created `index.css` file with base styles

### 2. ✅ FIXED: Duplicate Script Tags
- **Issue**: Module loading twice causing multiple Supabase client instances
- **Solution**: Removed duplicate `<script>` tag from `index.html`

### 3. ⚠️ Supabase Connection Issues (400 Errors)

The application is showing "Error conectando con la base de datos. Mostrando modo offline" because Supabase credentials are not properly configured.

#### How to Fix:

**Option A: Configure Supabase (Recommended for Production)**

1. Create or update `.env.local` file in the project root:
   ```bash
   cp .env.local.example .env.local
   ```

2. Get your Supabase credentials from: https://app.supabase.com/project/_/settings/api

3. Update `.env.local` with your actual values:
   ```
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

4. Restart the dev server:
   ```bash
   npm run dev
   ```

**Option B: Use Offline Mode (For Testing)**

The app already has offline fallback functionality. If Supabase is not configured, it will:
1. Try to load data from `localStorage`
2. Fall back to mock data if nothing is saved

This is useful for development/testing without a database.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 📝 Features

- ✅ Product catalog with categories
- ✅ WhatsApp integration
- ✅ Admin panel for product management
- ✅ Image gallery support (multiple images per product)
- ✅ Offline functionality with localStorage
- ✅ Supabase integration (optional)
- ✅ AI Assistant (requires Google AI API key)

## 🗄️ Database Schema

If using Supabase, run the SQL files in your Supabase SQL editor:

1. First: `db_schema.sql` (creates tables)
2. Then: `db_update.sql` (updates/migrations)

## 📱 Environment Variables

Required for full functionality:
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key

Optional:
- `VITE_GOOGLE_AI_API_KEY` - For AI assistant features

## 🔧 Troubleshooting

### "Error conectando con la base de datos"
- Check that `.env.local` exists and has correct Supabase credentials
- Verify your Supabase project is active
- Check the browser console for specific error messages

### "Multiple GoTrueClient instances detected"
- ✅ Fixed by removing duplicate script tags
- If still occurring, clear browser cache and reload

### 400 Errors in Console
- These are likely from Supabase trying to connect with invalid/missing credentials
- Configure `.env.local` as described above

## 📂 Project Structure

```
tahona-la-baguette/
├── components/          # React components
│   ├── ProductCard.tsx  # Product display with image gallery
│   ├── AdminPanel.tsx   # Product management
│   └── ...
├── lib/
│   └── supabase.ts     # Supabase client configuration
├── services/           # Data services (CSV parser, etc.)
├── App.tsx             # Main application
├── index.html          # HTML entry point
└── index.tsx           # React entry point
```

## 🎨 Customization

- Edit colors in `index.html` TailwindCSS config
- Modify business info in `constants.tsx`
- Update product categories in `App.tsx`

---

**Made with ❤️ for Tahona La Baguette**
