-- Add missing columns to assessments table if they don't exist
do $$
begin
  if not exists (select 1 from information_schema.columns where table_name = 'assessments' and column_name = 'age') then
    alter table public.assessments add column age integer;
  end if;
  
  if not exists (select 1 from information_schema.columns where table_name = 'assessments' and column_name = 'menstrual_score') then
    alter table public.assessments add column menstrual_score float;
  end if;
  
  if not exists (select 1 from information_schema.columns where table_name = 'assessments' and column_name = 'breast_risk_score') then
    alter table public.assessments add column breast_risk_score float;
  end if;
  
  if not exists (select 1 from information_schema.columns where table_name = 'assessments' and column_name = 'ovarian_risk_score') then
    alter table public.assessments add column ovarian_risk_score float;
  end if;
  
  if not exists (select 1 from information_schema.columns where table_name = 'assessments' and column_name = 'endometrial_risk_score') then
    alter table public.assessments add column endometrial_risk_score float;
  end if;

  if not exists (select 1 from information_schema.columns where table_name = 'assessments' and column_name = 'user_id') then
    alter table public.assessments add column user_id uuid references auth.users(id) on delete cascade;
  end if;
end $$;
