// Quick debug script to check your Supabase data

To check what's in your database:

1. Go to https://app.supabase.com
2. Select your project
3. Click "Table Editor" in the left sidebar
4. Click on the "products" table
5. Check if there are any rows

## Expected Columns:
- id (uuid)
- created_at (timestamp)  
- titulo (text) - **Product name**
- descripcion (text) - **Product description**
- precio (text) - **Price**
- imagen (text) - **Image URL**
- categoria (text) - **Category (e.g., "Panadería", "Postres")**
- etiqueta (text, optional) - **Label like "Nuevo"**
- boton (text, optional) - **Button text, default "Pedir"**
- orden (serial) - **Order number** ← MISSING, needs db_update.sql
- imagenes (text[]) - **Array of image URLs** ← MISSING, needs db_update.sql

## Add Missing Columns:

Run this in Supabase SQL Editor:

\`\`\`sql
-- Add missing columns
ALTER TABLE products ADD COLUMN IF NOT EXISTS orden serial;
ALTER TABLE products ADD COLUMN IF NOT EXISTS imagenes text[];

-- Migrate existing images
UPDATE products 
SET imagenes = array[imagen] 
WHERE imagen IS NOT NULL AND (imagenes IS NULL OR array_length(imagenes, 1) = 0);
\`\`\`

## Add Sample Products:

If your table is empty, you can add sample data:

\`\`\`sql
INSERT INTO products (titulo, descripcion, precio, imagen, categoria, etiqueta, boton)
VALUES 
(
  'Croissant de Mantequilla',
  'Hojaldre artesanal con mantequilla francesa',
  '1.50€',
  'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500',
  'Panadería',
  'Destacado',
  'Pedir'
),
(
  'Baguette Tradicional',
  'Pan crujiente recién horneado cada mañana',
  '2.00€',
  'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500',
  'Panadería',
  NULL,
  'Pedir'
),
(
  'Tarta de Chocolate',
  'Delicioso pastel de chocolate belga',
  '18.00€',
  'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500',
  'Postres',
  'Nuevo',
  'Encargar'
);
\`\`\`

## Check the Data:

After adding the columns and sample data, refresh your app at http://localhost:3000

The products should now display correctly!
