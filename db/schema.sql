-- Create extension for UUIDs
create extension if not exists "pgcrypto";

-- Profiles table
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  phone text,
  name text,
  role text default 'user',
  updated_at timestamptz default now()
);

-- Enable RLS on profiles
alter table public.profiles enable row level security;

-- Profiles policies
drop policy if exists "Public profiles are viewable by everyone." on public.profiles;
create policy "Public profiles are viewable by everyone." on public.profiles
  for select using (true);

drop policy if exists "Users can insert their own profile." on public.profiles;
create policy "Users can insert their own profile." on public.profiles
  for insert with check (auth.uid() = id);

drop policy if exists "Users can update own profile." on public.profiles;
create policy "Users can update own profile." on public.profiles
  for update using (auth.uid() = id);

-- Assessments table
create table if not exists public.assessments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  
  -- Patient Info
  patient_name text,
  patient_phone text,

  -- Input Data
  age integer,
  
  -- Results
  menstrual_score float,
  breast_risk_score float,
  ovarian_risk_score float,
  endometrial_risk_score float,
  primary_risk text,
  
  -- Raw Data
  symptoms jsonb,

  -- Geographic Data
  latitude float,
  longitude float,
  
  created_at timestamptz default now()
);

-- Enable RLS on assessments
alter table public.assessments enable row level security;

-- Assessments policies
drop policy if exists "Users can insert own assessments." on public.assessments;
create policy "Users can insert own assessments." on public.assessments
  for insert with check (auth.uid() = user_id);

drop policy if exists "Public can view heatmap data." on public.assessments;
create policy "Public can view heatmap data." on public.assessments
  for select using (true);

-- Regional Cancer Prevalence (Heatmap data)
create table if not exists public.regional_stats (
  id uuid primary key default gen_random_uuid(),
  state text not null,
  district text,
  breast_cancer_count integer default 0,
  ovarian_cancer_count integer default 0,
  endometrial_cancer_count integer default 0,
  updated_at timestamptz default now()
);

-- Enable RLS on regional_stats
alter table public.regional_stats enable row level security;

-- Regional Stats policies
drop policy if exists "Public can view regional stats." on public.regional_stats;
create policy "Public can view regional stats." on public.regional_stats
  for select using (true);
