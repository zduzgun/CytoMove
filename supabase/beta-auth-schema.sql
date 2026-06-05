create table if not exists public.beta_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  email_domain text,
  full_name text,
  institution text,
  role text,
  intended_use text,
  academic_email_signal boolean not null default false,
  access_status text not null default 'pending'
    check (access_status in ('pending', 'manual_review', 'academic_verified', 'approved', 'beta_approved', 'commercial_contact', 'rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.beta_profiles enable row level security;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists beta_profiles_set_updated_at on public.beta_profiles;
create trigger beta_profiles_set_updated_at
before update on public.beta_profiles
for each row
execute function public.set_updated_at();

drop policy if exists "Users can read their own beta profile" on public.beta_profiles;
create policy "Users can read their own beta profile"
on public.beta_profiles
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can create their own pending beta profile" on public.beta_profiles;
create policy "Users can create their own pending beta profile"
on public.beta_profiles
for insert
to authenticated
with check (auth.uid() = user_id and access_status = 'pending');

drop policy if exists "Users can update editable profile fields" on public.beta_profiles;
create policy "Users can update editable profile fields"
on public.beta_profiles
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

revoke all on table public.beta_profiles from anon;
revoke all on table public.beta_profiles from authenticated;

grant select, insert on table public.beta_profiles to authenticated;
grant update (full_name, institution, role, intended_use, updated_at) on table public.beta_profiles to authenticated;

create index if not exists beta_profiles_access_status_idx
  on public.beta_profiles (access_status);

create index if not exists beta_profiles_email_domain_idx
  on public.beta_profiles (email_domain);
