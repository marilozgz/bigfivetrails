Proyecto Next.js con integración de Supabase para catálogo de safaris y zona admin.

## Getting Started

Configura variables de entorno en un archivo `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=tu_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
# Opcional para acciones de servidor
SUPABASE_URL=tu_url
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key
```

Luego, ejecuta el servidor de desarrollo:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

Rutas clave:

- `/[locale]/safaris`: lista de safaris desde Supabase.
- `/[locale]/admin/login`: acceso admin con email/contraseña.
- `/[locale]/admin`: panel admin para crear safaris (mínimo viable).
  - Búsqueda por título (`q`), paginación (`page`), edición y borrado.

Base de datos supuesta (tabla `safaris`):

```sql
create table if not exists public.safaris (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  title_en text,
  title_es text,
  description_en text,
  description_es text,
  overview_en text,
  overview_es text,
  location text,
  duration_days int,
  price_from int,
  experience_types jsonb default '[]'::jsonb,
  highlights jsonb default '[]'::jsonb,
  route jsonb default '[]'::jsonb,
  thumbnail text,
  thumbnail_thumb text,
  images jsonb default '[]'::jsonb,
  itinerary jsonb default '[]'::jsonb,
  max_group_size int,
  accommodation text,
  transportation text,
  best_time text,
  difficulty text,
  popular boolean default false
);
-- RLS opcional
alter table public.safaris enable row level security;
create policy "safaris_read_all" on public.safaris for select using (true);
create policy "safaris_insert_authenticated" on public.safaris for insert to authenticated with check (true);
```

Para proteger el panel, crea usuarios en Supabase Auth y usa email/contraseña.

## Más info

- Next.js App Router
- Supabase Auth y Database

### Storage (imágenes)

1. Crea un bucket público `safaris` en Supabase Storage.
2. Políticas RLS de ejemplo para Storage (solo lectura pública, subida autenticada):

```sql
-- Reglas para Storage (usando la bucket policy interface)
-- Lectura pública
create policy "public read" on storage.objects for select to public using ( bucket_id = 'safaris' );
-- Subida/insert solo usuarios autenticados
create policy "authenticated upload" on storage.objects for insert to authenticated with check ( bucket_id = 'safaris' );
-- Borrado/actualización solo autenticados (opcional)
create policy "authenticated update" on storage.objects for update to authenticated using ( bucket_id = 'safaris' );
create policy "authenticated delete" on storage.objects for delete to authenticated using ( bucket_id = 'safaris' );
```

3. En el panel, el componente de subida genera URLs públicas que se guardan en `thumbnail` e `images`.

Optimización en cliente (opcional):

- Dependencia usada: `browser-image-compression` para comprimir/redimensionar antes de subir.
- Genera también una miniatura (`.thumb.ext`) además de la imagen optimizada.

### Roles y acceso al panel

- Define el rol en `user_metadata.role = 'admin'` (o `app_metadata`).
- El panel solo permite acceso si el usuario tiene rol `admin`.

Políticas opcionales por rol (si usas RLS por rol, ajusta según tus necesidades):

```sql
-- Ejemplo: permitir INSERT/UPDATE/DELETE solo a usuarios con rol 'admin'
create policy "admin write" on public.safaris
for all to authenticated
using (
  coalesce(auth.jwt()->'user_metadata'->>'role', auth.jwt()->'app_metadata'->>'role') = 'admin'
) with check (
  coalesce(auth.jwt()->'user_metadata'->>'role', auth.jwt()->'app_metadata'->>'role') = 'admin'
);
```

## Deploy

Configura las variables de entorno en Vercel/hosting. Asegura reglas RLS si las activas.

### Contenidos dinámicos: travel_tips (profesional)

Tabla sugerida:

```sql
create table if not exists public.travel_tips (
  id uuid primary key default gen_random_uuid(),
  country text not null check (country in ('tanzania','kenya')),
  section text not null check (section in ('visas','health','money','luggage','tipping')),
  title_es text, title_en text, title_fr text, title_it text, title_de text,
  intro_es text, intro_en text, intro_fr text, intro_it text, intro_de text,
  items_es jsonb default '[]'::jsonb,
  items_en jsonb default '[]'::jsonb,
  items_fr jsonb default '[]'::jsonb,
  items_it jsonb default '[]'::jsonb,
  items_de jsonb default '[]'::jsonb,
  cta_label_es text, cta_label_en text, cta_label_fr text, cta_label_it text, cta_label_de text,
  cta_href text,
  unique (country, section)
);

alter table public.travel_tips enable row level security;
create policy "tips_read_all" on public.travel_tips for select using (true);
create policy "tips_write_admin" on public.travel_tips
for all to authenticated
using (
  coalesce(auth.jwt()->'user_metadata'->>'role', auth.jwt()->'app_metadata'->>'role') = 'admin'
) with check (
  coalesce(auth.jwt()->'user_metadata'->>'role', auth.jwt()->'app_metadata'->>'role') = 'admin'
);
```
