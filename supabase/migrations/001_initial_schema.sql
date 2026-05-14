-- =============================================
-- Electrolineras Valle de Aburrá — Schema v1
-- =============================================

create extension if not exists "pgcrypto";

-- Tabla principal
create table public.electrolineras (
  id              uuid primary key default gen_random_uuid(),
  nombre          text not null,
  empresa         text not null,
  direccion       text,
  latitud         decimal(10, 8) not null,
  longitud        decimal(11, 8) not null,
  estado          text not null default 'en_servicio'
                    check (estado in ('en_servicio', 'fuera_de_servicio')),
  costo_kwh       decimal(12, 2),
  total_cargadores integer not null default 1,
  horario_247     boolean not null default true,
  hora_apertura   time,
  hora_cierre     time,
  notas           text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- Tipos de conector por electrolinera
create table public.conectores (
  id                uuid primary key default gen_random_uuid(),
  electrolinera_id  uuid not null references public.electrolineras(id) on delete cascade,
  tipo              text not null
                      check (tipo in ('tipo1','tipo2','ccs1','ccs2','chademo','gbt','tesla_nacs')),
  cantidad          integer not null default 1,
  potencia_kw       decimal(6, 2)
);

-- Servicios adicionales
create table public.servicios_adicionales (
  id                uuid primary key default gen_random_uuid(),
  electrolinera_id  uuid not null references public.electrolineras(id) on delete cascade,
  servicio          text not null
                      check (servicio in (
                        'wifi','lavadero','tienda','cafe',
                        'restaurante','bano','estacionamiento_techado',
                        'hotel','gimnasio'
                      ))
);

-- Fotos
create table public.fotos (
  id                uuid primary key default gen_random_uuid(),
  electrolinera_id  uuid not null references public.electrolineras(id) on delete cascade,
  url               text not null,
  created_at        timestamptz not null default now()
);

-- Índices
create index on public.conectores (electrolinera_id);
create index on public.servicios_adicionales (electrolinera_id);
create index on public.fotos (electrolinera_id);
create index on public.electrolineras (estado);

-- Auto-actualizar updated_at
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger electrolineras_updated_at
  before update on public.electrolineras
  for each row execute function public.set_updated_at();

-- Storage bucket para fotos
insert into storage.buckets (id, name, public)
values ('electrolineras-fotos', 'electrolineras-fotos', true)
on conflict do nothing;

-- RLS: deshabilitado inicialmente (app de uso personal)
-- Habilitar cuando se agregue autenticación multi-usuario:
-- alter table public.electrolineras enable row level security;
