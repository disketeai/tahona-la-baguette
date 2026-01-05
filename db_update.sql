-- Ejecuta esto en el SQL Editor de Supabase para añadir las nuevas funcionalidades

-- 1. Añadir columna para controlar el orden
alter table products add column orden serial;

-- 2. Añadir columna para guardar múltiples fotos
alter table products add column imagenes text[];

-- 3. Migrar las fotos actuales al nuevo formato de lista
update products set imagenes = array[imagen] where imagen is not null;
