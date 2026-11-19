create table if not exists public.profiles (
  id text primary key,
  name text not null,
  email text not null unique,
  address text,
  seal_color text not null default '#743D45',
  seal_emblem text not null default 'P',
  password_hash text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.letters (
  id uuid primary key default gen_random_uuid(),
  recipient_email text not null,
  data jsonb not null,
  created_at timestamptz not null default now()
);

create index if not exists letters_recipient_email_created_at_idx
  on public.letters (recipient_email, created_at desc);

alter table public.profiles enable row level security;
alter table public.letters enable row level security;
