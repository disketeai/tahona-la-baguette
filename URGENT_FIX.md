# 🚨 URGENT FIX NEEDED

## The Problem
Your application is failing to connect to Supabase because the database schema is **incomplete**.

**Error**: `column products.orden does not exist`

## The Solution

### Step 1: Log in to Supabase
Go to: https://app.supabase.com

### Step 2: Open SQL Editor
1. Select your project (the one matching your .env.local URL)
2. Click on "SQL Editor" in the left sidebar
3. Click "New query"

### Step 3: Run the Migration
Copy and paste this SQL code and click "Run":

```sql
-- 1. Add column to control product order
ALTER TABLE products ADD COLUMN IF NOT EXISTS orden serial;

-- 2. Add column for multiple images
ALTER TABLE products ADD COLUMN IF NOT EXISTS imagenes text[];

-- 3. Migrate current images to new array format
UPDATE products 
SET imagenes = array[imagen] 
WHERE imagen IS NOT NULL AND (imagenes IS NULL OR array_length(imagenes, 1) = 0);
```

### Step 4: Verify
After running the SQL, refresh your app at http://localhost:3000

The errors should disappear and products should load from Supabase!

---

## Alternative: Use Offline Mode
If you don't want to use Supabase right now, you can work in offline mode:
1. The app will use localStorage
2. Use the "Gestionar Catálogo" button to add products
3. Data will persist in your browser

---

**Current Status:**
- ✅ Dev server running
- ✅ Supabase credentials configured
- ❌ Database schema incomplete (missing `orden` and `imagenes` columns)

**What's needed:**
- Run the SQL migration above in your Supabase dashboard
