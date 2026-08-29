-- AI Business Automation Hub
-- Initial production schema for lead capture and AI qualification.

create extension if not exists pgcrypto;

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) between 1 and 200),
  email text not null check (email ~* '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$'),
  company text,
  message text not null check (char_length(trim(message)) between 1 and 10000),
  source text not null default 'api',
  status text not null default 'new' check (status in ('new','qualified','contacted','converted','closed')),
  ai_summary text,
  ai_category text,
  ai_temperature text check (ai_temperature in ('Hot','Warm','Cold','Spam')),
  ai_score integer check (ai_score between 0 and 100),
  ai_recommended_action text,
  ai_suggested_reply text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_status_idx on public.leads (status);
create index if not exists leads_temperature_idx on public.leads (ai_temperature);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists leads_set_updated_at on public.leads;
create trigger leads_set_updated_at
before update on public.leads
for each row execute function public.set_updated_at();

alter table public.leads enable row level security;

-- Server-side service-role access is intended for the initial API.
-- No anonymous client policy is created here, preventing public writes/reads by default.
