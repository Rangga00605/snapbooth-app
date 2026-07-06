-- Database schema SnapBooth Photobooth
-- Jalankan di Supabase SQL Editor atau database PostgreSQL.
-- Untuk MVP, tabel ini opsional. Aplikasi tetap bisa capture, download, dan print tanpa database.

create extension if not exists "pgcrypto";

create table if not exists templates (
  id uuid primary key default gen_random_uuid(),
  nama_template varchar(100) not null,
  slug varchar(120) unique not null,
  jumlah_foto int not null default 4,
  layout jsonb,
  file_frame text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists sessions (
  id uuid primary key default gen_random_uuid(),
  template_id uuid references templates(id) on delete set null,
  status varchar(30) not null default 'diproses',
  started_at timestamptz not null default now(),
  finished_at timestamptz
);

create table if not exists photos (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references sessions(id) on delete cascade,
  file_photo text not null,
  urutan int not null,
  created_at timestamptz not null default now()
);

create table if not exists final_results (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references sessions(id) on delete cascade,
  file_result text not null,
  output_type varchar(30) default 'download',
  created_at timestamptz not null default now()
);

create table if not exists email_logs (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references sessions(id) on delete cascade,
  email_tujuan varchar(255) not null,
  file_result text,
  status varchar(30) not null default 'diproses',
  sent_at timestamptz,
  error_message text,
  created_at timestamptz not null default now()
);

insert into templates (nama_template, slug, jumlah_foto, layout)
values
  ('Classic 4 Pose', 'classic-4-pose', 4, '{"type":"grid-2x2"}'),
  ('Minimal Strip', 'minimal-strip', 4, '{"type":"vertical-strip"}'),
  ('Birthday Frame', 'birthday-frame', 4, '{"type":"grid-2x2"}'),
  ('Wedding Frame', 'wedding-frame', 2, '{"type":"two-stack"}')
on conflict (slug) do nothing;
