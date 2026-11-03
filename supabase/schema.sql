create table if not exists public.user_entitlements (
  user_id uuid primary key references auth.users (id) on delete cascade,
  vip boolean not null default false,
  all_games boolean not null default false,
  unlocked_games text[] not null default '{}',
  updated_at timestamptz not null default now()
);

alter table public.user_entitlements enable row level security;

revoke all on public.user_entitlements from anon, authenticated;
grant select (user_id, vip, all_games, unlocked_games)
  on public.user_entitlements to authenticated;

drop policy if exists "Users can read their own entitlements" on public.user_entitlements;
create policy "Users can read their own entitlements"
  on public.user_entitlements
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

create or replace function public.create_user_entitlements()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.user_entitlements (user_id)
  values (new.id)
  on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists create_user_entitlements_after_signup on auth.users;
create trigger create_user_entitlements_after_signup
  after insert on auth.users
  for each row execute function public.create_user_entitlements();

insert into public.user_entitlements (user_id)
select id from auth.users
on conflict (user_id) do nothing;
