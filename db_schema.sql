-- Copia y pega esto en el 'SQL Editor' de tu dashboard en Supabase

create table products (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  titulo text not null,
  descripcion text,
  precio text not null,
  etiqueta text,
  categoria text not null,
  imagen text,
  imagenes text[] default '{}',
  orden serial,
  boton text default 'Pedir'
);

-- Habilitar seguridad (Row Level Security)
alter table products enable row level security;

-- Permitir lectura pública (para que todos vean los panes)
create policy "Public read access" on products for select using (true);

-- Permitir escritura total (para el admin panel)
-- IMPORTANTE: En producción real esto debería restringirse a usuarios autenticados.
create policy "Admin insert/update/delete" on products for all using (true);
