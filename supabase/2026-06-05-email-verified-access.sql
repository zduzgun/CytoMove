alter table public.beta_profiles
  alter column access_status set default 'email_verified';

alter table public.beta_profiles
  drop constraint if exists beta_profiles_access_status_check;

alter table public.beta_profiles
  add constraint beta_profiles_access_status_check
  check (access_status in ('pending', 'email_verified', 'manual_review', 'academic_verified', 'approved', 'beta_approved', 'commercial_contact', 'rejected'));

drop policy if exists "Users can create their own pending beta profile" on public.beta_profiles;
drop policy if exists "Users can create their own verified beta profile" on public.beta_profiles;

create policy "Users can create their own verified beta profile"
on public.beta_profiles
for insert
to authenticated
with check (auth.uid() = user_id and access_status in ('email_verified', 'pending'));

update public.beta_profiles
set access_status = 'email_verified'
where access_status = 'pending';
