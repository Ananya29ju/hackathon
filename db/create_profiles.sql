-- Create a simple `profiles` table to store user metadata
-- Designed for Supabase: `id` references `auth.users(id)`

create extension if not exists "pgcrypto";

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  phone text,
  name text,
  role text,
  updated_at timestamptz default now()
);

-- Optional: index on role for faster queries by role
create index if not exists profiles_role_idx on profiles(role);
