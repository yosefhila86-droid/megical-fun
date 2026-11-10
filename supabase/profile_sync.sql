-- Apply in Supabase after schema.sql; the migration is safe to re-run.
create table if not exists public.user_profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  profile jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.user_profiles enable row level security;
revoke all on public.user_profiles from anon, authenticated;
grant select (user_id, profile, updated_at) on public.user_profiles to authenticated;

drop policy if exists "Users can read their own profile" on public.user_profiles;
create policy "Users can read their own profile"
  on public.user_profiles
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

create table if not exists public.user_app_devices (
  user_id uuid not null references auth.users (id) on delete cascade,
  device_id uuid not null,
  device_label text not null check (device_label in ('Android app', 'Web browser')),
  first_seen_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  active boolean not null default true,
  primary key (user_id, device_id)
);

alter table public.user_app_devices enable row level security;
revoke all on public.user_app_devices from anon, authenticated;

create table if not exists public.user_profile_rewards (
  user_id uuid not null references auth.users (id) on delete cascade,
  reward_id text not null check (length(reward_id) between 1 and 160),
  stars integer not null check (stars between 1 and 100),
  created_at timestamptz not null default now(),
  primary key (user_id, reward_id)
);

alter table public.user_profile_rewards enable row level security;
revoke all on public.user_profile_rewards from anon, authenticated;

create or replace function public.register_app_device(p_device_id uuid, p_device_label text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_active_count integer;
begin
  if v_user_id is null then
    raise exception 'Authentication required';
  end if;
  if p_device_id is null or p_device_label not in ('Android app', 'Web browser') then
    raise exception 'Invalid device registration';
  end if;

  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(v_user_id::text, 0));
  update public.user_app_devices
    set active = false
    where user_id = v_user_id
      and active
      and last_seen_at < now() - interval '5 minutes';

  if exists (
    select 1 from public.user_app_devices
    where user_id = v_user_id and device_id = p_device_id
  ) then
    update public.user_app_devices
      set active = true, last_seen_at = now(), device_label = p_device_label
      where user_id = v_user_id and device_id = p_device_id;
  else
    select count(*) into v_active_count
      from public.user_app_devices
      where user_id = v_user_id and active;
    if v_active_count >= 5 then
      return jsonb_build_object('allowed', false, 'active_count', v_active_count);
    end if;
    insert into public.user_app_devices (user_id, device_id, device_label)
      values (v_user_id, p_device_id, p_device_label);
  end if;

  select count(*) into v_active_count
    from public.user_app_devices
    where user_id = v_user_id and active;
  return jsonb_build_object('allowed', true, 'active_count', v_active_count);
end;
$$;

create or replace function public.release_app_device(p_device_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null or p_device_id is null then
    raise exception 'Authentication required';
  end if;
  update public.user_app_devices
    set active = false, last_seen_at = now()
    where user_id = auth.uid() and device_id = p_device_id;
end;
$$;

create or replace function public.sync_user_profile(p_profile jsonb, p_rewards jsonb default '[]'::jsonb)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_old jsonb;
  v_profile jsonb;
  v_stars integer;
  v_baseline integer;
  v_reward_sum integer := 0;
  v_reward record;
  v_inserted_stars integer;
  v_processed jsonb := '[]'::jsonb;
  v_art jsonb;
  v_custom jsonb;
  v_escape_rooms jsonb;
  v_puzzle_stars jsonb;
  v_last_day text;
  v_streak integer;
  v_usage_date text;
  v_usage_seconds integer;
begin
  if v_user_id is null then
    raise exception 'Authentication required';
  end if;
  if jsonb_typeof(p_profile) is distinct from 'object'
     or jsonb_typeof(p_rewards) is distinct from 'array'
     or jsonb_array_length(p_rewards) > 100 then
    raise exception 'Invalid profile synchronization payload';
  end if;
  if coalesce(p_profile->>'stars', '0') !~ '^\d{1,9}$' then
    raise exception 'Invalid star count';
  end if;
  if jsonb_typeof(coalesce(p_profile->'art', '[]'::jsonb)) <> 'array'
     or jsonb_typeof(coalesce(p_profile->'custom', '[]'::jsonb)) <> 'array'
     or jsonb_typeof(coalesce(p_profile->'completedEscapeRooms', '[]'::jsonb)) <> 'array'
     or jsonb_typeof(coalesce(p_profile->'completedPuzzleStars', '[]'::jsonb)) <> 'array' then
    raise exception 'Invalid profile collections';
  end if;

  for v_reward in
    select item->>'id' as reward_id, (item->>'stars')::integer as stars
    from jsonb_array_elements(p_rewards) as rewards(item)
  loop
    if v_reward.reward_id is null or length(v_reward.reward_id) not between 1 and 160
       or v_reward.stars is null or v_reward.stars not between 1 and 100 then
      raise exception 'Invalid star reward';
    end if;
    v_reward_sum := v_reward_sum + v_reward.stars;
  end loop;

  insert into public.user_profiles (user_id, profile)
    values (v_user_id, '{}'::jsonb)
    on conflict (user_id) do nothing;
  select profile into v_old
    from public.user_profiles
    where user_id = v_user_id
    for update;

  v_baseline := greatest(0, (p_profile->>'stars')::integer - v_reward_sum);
  v_stars := greatest(coalesce((v_old->>'stars')::integer, 0), v_baseline);

  for v_reward in
    select item->>'id' as reward_id, (item->>'stars')::integer as stars
    from jsonb_array_elements(p_rewards) as rewards(item)
  loop
    insert into public.user_profile_rewards (user_id, reward_id, stars)
      values (v_user_id, v_reward.reward_id, v_reward.stars)
      on conflict (user_id, reward_id) do nothing;
    if found then
      v_stars := v_stars + v_reward.stars;
    end if;
    v_processed := v_processed || jsonb_build_array(v_reward.reward_id);
  end loop;

  select coalesce(jsonb_agg(item order by first_order), '[]'::jsonb) into v_art
  from (
    select item, min(item_order) as first_order
    from (
      select value as item, ordinality as item_order
        from jsonb_array_elements(coalesce(p_profile->'art', '[]'::jsonb)) with ordinality
      union all
      select value as item, ordinality + 100000 as item_order
        from jsonb_array_elements(coalesce(v_old->'art', '[]'::jsonb)) with ordinality
    ) as art_items
    group by item
    order by first_order
    limit 20
  ) as merged_art;

  select coalesce(jsonb_agg(item order by first_order), '[]'::jsonb) into v_custom
  from (
    select item, min(item_order) as first_order
    from (
      select value as item, ordinality as item_order
        from jsonb_array_elements(coalesce(p_profile->'custom', '[]'::jsonb)) with ordinality
      union all
      select value as item, ordinality + 100000 as item_order
        from jsonb_array_elements(coalesce(v_old->'custom', '[]'::jsonb)) with ordinality
    ) as custom_items
    group by item
    order by first_order
    limit 100
  ) as merged_custom;

  select coalesce(jsonb_agg(item order by item), '[]'::jsonb) into v_escape_rooms
    from (
      select distinct value as item
      from jsonb_array_elements(coalesce(v_old->'completedEscapeRooms', '[]'::jsonb)
        || coalesce(p_profile->'completedEscapeRooms', '[]'::jsonb))
    ) as completed;
  select coalesce(jsonb_agg(item order by item), '[]'::jsonb) into v_puzzle_stars
    from (
      select distinct value as item
      from jsonb_array_elements(coalesce(v_old->'completedPuzzleStars', '[]'::jsonb)
        || coalesce(p_profile->'completedPuzzleStars', '[]'::jsonb))
    ) as completed;

  if coalesce(p_profile->>'lastDay', '') >= coalesce(v_old->>'lastDay', '') then
    v_last_day := p_profile->>'lastDay';
    v_streak := coalesce((p_profile->>'streak')::integer, 0);
  else
    v_last_day := v_old->>'lastDay';
    v_streak := coalesce((v_old->>'streak')::integer, 0);
  end if;

  if coalesce(p_profile->>'dailyUsageDate', '') >= coalesce(v_old->>'dailyUsageDate', '') then
    v_usage_date := p_profile->>'dailyUsageDate';
    if coalesce(v_usage_date, '') = coalesce(v_old->>'dailyUsageDate', '') then
      v_usage_seconds := greatest(coalesce((p_profile->>'dailyUsageSeconds')::integer, 0),
                                  coalesce((v_old->>'dailyUsageSeconds')::integer, 0));
    else
      v_usage_seconds := coalesce((p_profile->>'dailyUsageSeconds')::integer, 0);
    end if;
  else
    v_usage_date := v_old->>'dailyUsageDate';
    v_usage_seconds := coalesce((v_old->>'dailyUsageSeconds')::integer, 0);
  end if;

  v_profile := jsonb_build_object(
    'name', coalesce(p_profile->'name', v_old->'name', '"Guest"'::jsonb),
    'av', coalesce(p_profile->'av', v_old->'av', '"🐶"'::jsonb),
    'stars', v_stars,
    'art', v_art,
    'custom', v_custom,
    'music', coalesce(p_profile->'music', v_old->'music', 'true'::jsonb),
    'track', coalesce(p_profile->'track', v_old->'track', '"auto"'::jsonb),
    'vol', coalesce(p_profile->'vol', v_old->'vol', '0.6'::jsonb),
    'language', coalesce(p_profile->'language', v_old->'language', '"en"'::jsonb),
    'completedEscapeRooms', v_escape_rooms,
    'completedPuzzleStars', v_puzzle_stars,
    'streak', v_streak,
    'lastDay', v_last_day,
    'dailyUsageDate', v_usage_date,
    'dailyUsageSeconds', v_usage_seconds,
    'dailyLimitMinutes', coalesce(p_profile->'dailyLimitMinutes', v_old->'dailyLimitMinutes', '0'::jsonb)
  );

  update public.user_profiles
    set profile = v_profile, updated_at = now()
    where user_id = v_user_id;

  return jsonb_build_object('profile', v_profile, 'processed_reward_ids', v_processed);
end;
$$;

revoke all on function public.register_app_device(uuid, text) from public, anon;
revoke all on function public.release_app_device(uuid) from public, anon;
revoke all on function public.sync_user_profile(jsonb, jsonb) from public, anon;
grant execute on function public.register_app_device(uuid, text) to authenticated;
grant execute on function public.release_app_device(uuid) to authenticated;
grant execute on function public.sync_user_profile(jsonb, jsonb) to authenticated;

do $$
begin
  if not exists (
    select 1 from pg_catalog.pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'user_profiles'
  ) then
    alter publication supabase_realtime add table public.user_profiles;
  end if;
end;
$$;
