-- Apply after profile_sync.sql. Safe to re-run.
create table if not exists public.user_children (
  child_id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  nickname text not null check (length(btrim(nickname)) between 1 and 16),
  age_band text check (age_band is null or age_band in ('6-7', '8-9', '10-11')),
  created_at timestamptz not null default now()
);

create index if not exists user_children_user_id_created_at_idx
  on public.user_children (user_id, created_at, child_id);

alter table public.user_children enable row level security;
revoke all on public.user_children from public, anon, authenticated;

create table if not exists public.user_child_profiles (
  user_id uuid not null references auth.users (id) on delete cascade,
  child_id uuid not null references public.user_children (child_id) on delete cascade,
  profile jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  primary key (user_id, child_id)
);

alter table public.user_child_profiles enable row level security;
revoke all on public.user_child_profiles from public, anon, authenticated;
grant select (user_id, child_id, profile, updated_at)
  on public.user_child_profiles to authenticated;

drop policy if exists "Users can read their own child profiles" on public.user_child_profiles;
create policy "Users can read their own child profiles"
  on public.user_child_profiles
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

create table if not exists public.user_child_profile_rewards (
  user_id uuid not null references auth.users (id) on delete cascade,
  child_id uuid not null references public.user_children (child_id) on delete cascade,
  reward_id text not null check (length(reward_id) between 1 and 160),
  stars integer not null check (stars between 1 and 100),
  created_at timestamptz not null default now(),
  primary key (child_id, reward_id)
);

alter table public.user_child_profile_rewards enable row level security;
revoke all on public.user_child_profile_rewards from public, anon, authenticated;

create or replace function public.list_user_children()
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_child_id uuid;
  v_old_profile jsonb;
  v_nickname text;
  v_age_band text;
begin
  if v_user_id is null then
    raise exception 'Authentication required';
  end if;

  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(v_user_id::text, 0));
  if not exists (select 1 from public.user_children where user_id = v_user_id) then
    select profile into v_old_profile
      from public.user_profiles
      where user_id = v_user_id
      for update;
    if found then
      v_nickname := left(coalesce(nullif(btrim(v_old_profile->>'name'), ''), 'Child'), 16);
      v_age_band := case when v_old_profile->>'childAgeBand' in ('6-7', '8-9', '10-11')
        then v_old_profile->>'childAgeBand' else null end;
      insert into public.user_children (user_id, nickname, age_band)
        values (v_user_id, v_nickname, v_age_band)
        returning child_id into v_child_id;
      insert into public.user_child_profiles (user_id, child_id, profile)
        values (
          v_user_id,
          v_child_id,
          jsonb_set(coalesce(v_old_profile, '{}'::jsonb), '{name}', to_jsonb(v_nickname), true)
        );
      insert into public.user_child_profile_rewards (user_id, child_id, reward_id, stars, created_at)
        select user_id, v_child_id, reward_id, stars, created_at
          from public.user_profile_rewards
          where user_id = v_user_id
        on conflict (child_id, reward_id) do nothing;
    end if;
  end if;

  return (
    select coalesce(
      jsonb_agg(
        jsonb_build_object(
          'id', child_id,
          'nickname', nickname,
          'ageBand', age_band
        ) order by created_at, child_id
      ),
      '[]'::jsonb
    )
    from public.user_children
    where user_id = v_user_id
  );
end;
$$;

create or replace function public.create_user_child(p_nickname text, p_age_band text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_child_id uuid;
  v_nickname text := btrim(p_nickname);
  v_child_count integer;
begin
  if v_user_id is null then
    raise exception 'Authentication required';
  end if;
  if v_nickname is null or length(v_nickname) not between 1 and 16
     or p_age_band is null or p_age_band not in ('6-7', '8-9', '10-11') then
    raise exception 'Invalid child profile';
  end if;

  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(v_user_id::text, 0));
  select count(*) into v_child_count
    from public.user_children
    where user_id = v_user_id;
  if v_child_count >= 5 then
    raise exception 'Maximum of five child profiles reached';
  end if;

  insert into public.user_children (user_id, nickname, age_band)
    values (v_user_id, v_nickname, p_age_band)
    returning child_id into v_child_id;
  insert into public.user_child_profiles (user_id, child_id, profile)
    values (
      v_user_id,
      v_child_id,
      jsonb_build_object('name', v_nickname, 'childAgeBand', p_age_band)
    );

  return jsonb_build_object('id', v_child_id, 'nickname', v_nickname, 'ageBand', p_age_band);
end;
$$;

create or replace function public.sync_child_profile(
  p_child_id uuid, p_profile jsonb, p_rewards jsonb default '[]'::jsonb
)
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
  v_processed jsonb := '[]'::jsonb;
  v_art jsonb;
  v_custom jsonb;
  v_escape_rooms jsonb;
  v_puzzle_stars jsonb;
  v_last_day text;
  v_streak integer;
  v_usage_date text;
  v_usage_seconds integer;
  v_old_nickname text;
  v_old_age_band text;
  v_nickname text;
  v_age_band text;
begin
  if v_user_id is null then
    raise exception 'Authentication required';
  end if;
  if p_child_id is null then
    raise exception 'Child profile is required';
  end if;
  select nickname, age_band into v_old_nickname, v_old_age_band
    from public.user_children
    where user_id = v_user_id and child_id = p_child_id
    for update;
  if not found then
    raise exception 'Child profile not found';
  end if;
  if jsonb_typeof(p_profile) is distinct from 'object'
     or jsonb_typeof(p_rewards) is distinct from 'array'
     or jsonb_array_length(p_rewards) > 100 then
    raise exception 'Invalid profile synchronization payload';
  end if;
  v_nickname := left(coalesce(nullif(btrim(p_profile->>'name'), ''), v_old_nickname), 16);
  v_age_band := case when p_profile->>'childAgeBand' in ('6-7', '8-9', '10-11')
    then p_profile->>'childAgeBand' else v_old_age_band end;
  if p_profile ? 'childAgeBand'
     and p_profile->'childAgeBand' <> 'null'::jsonb
     and p_profile->>'childAgeBand' not in ('6-7', '8-9', '10-11') then
    raise exception 'Invalid child age range';
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

  insert into public.user_child_profiles (user_id, child_id, profile)
    values (v_user_id, p_child_id, '{}'::jsonb)
    on conflict (user_id, child_id) do nothing;
  select profile into v_old
    from public.user_child_profiles
    where user_id = v_user_id and child_id = p_child_id
    for update;

  v_baseline := greatest(0, (p_profile->>'stars')::integer - v_reward_sum);
  v_stars := greatest(coalesce((v_old->>'stars')::integer, 0), v_baseline);

  for v_reward in
    select item->>'id' as reward_id, (item->>'stars')::integer as stars
      from jsonb_array_elements(p_rewards) as rewards(item)
  loop
    insert into public.user_child_profile_rewards (user_id, child_id, reward_id, stars)
      values (v_user_id, p_child_id, v_reward.reward_id, v_reward.stars)
      on conflict (child_id, reward_id) do nothing;
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
    'name', v_nickname,
    'av', coalesce(p_profile->'av', v_old->'av', '"🐶"'::jsonb),
    'stars', v_stars,
    'art', v_art,
    'custom', v_custom,
    'music', coalesce(p_profile->'music', v_old->'music', 'true'::jsonb),
    'track', coalesce(p_profile->'track', v_old->'track', '"auto"'::jsonb),
    'vol', coalesce(p_profile->'vol', v_old->'vol', '0.6'::jsonb),
    'language', coalesce(p_profile->'language', v_old->'language', '"en"'::jsonb),
    'childAgeBand', coalesce(to_jsonb(v_age_band), 'null'::jsonb),
    'completedEscapeRooms', v_escape_rooms,
    'completedPuzzleStars', v_puzzle_stars,
    'streak', v_streak,
    'lastDay', v_last_day,
    'dailyUsageDate', v_usage_date,
    'dailyUsageSeconds', v_usage_seconds,
    'accessibility', coalesce(p_profile->'accessibility', v_old->'accessibility',
      '{"largeText":false,"contrast":false,"reducedMotion":false}'::jsonb),
    'dailyLimitMinutes', coalesce(p_profile->'dailyLimitMinutes', v_old->'dailyLimitMinutes', '0'::jsonb)
  );

  update public.user_children
    set nickname = v_nickname, age_band = v_age_band
    where user_id = v_user_id and child_id = p_child_id;
  update public.user_child_profiles
    set profile = v_profile, updated_at = now()
    where user_id = v_user_id and child_id = p_child_id;
  insert into public.user_profiles (user_id, profile)
    values (v_user_id, v_profile)
    on conflict (user_id) do update
      set profile = excluded.profile, updated_at = now();

  return jsonb_build_object('profile', v_profile, 'processed_reward_ids', v_processed);
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
  v_child_id uuid;
  v_old_profile jsonb;
  v_nickname text;
  v_age_band text;
begin
  if v_user_id is null then
    raise exception 'Authentication required';
  end if;
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(v_user_id::text, 0));
  select child_id into v_child_id
    from public.user_children
    where user_id = v_user_id
    order by created_at, child_id
    limit 1
    for update;
  if not found then
    select profile into v_old_profile
      from public.user_profiles
      where user_id = v_user_id
      for update;
    v_nickname := left(coalesce(nullif(btrim(coalesce(p_profile->>'name', v_old_profile->>'name')), ''), 'Child'), 16);
    v_age_band := case when coalesce(p_profile->>'childAgeBand', v_old_profile->>'childAgeBand') in ('6-7', '8-9', '10-11')
      then coalesce(p_profile->>'childAgeBand', v_old_profile->>'childAgeBand') else null end;
    insert into public.user_children (user_id, nickname, age_band)
      values (v_user_id, v_nickname, v_age_band)
      returning child_id into v_child_id;
    insert into public.user_child_profiles (user_id, child_id, profile)
      values (
        v_user_id,
        v_child_id,
        jsonb_set(coalesce(v_old_profile, '{}'::jsonb), '{name}', to_jsonb(v_nickname), true)
      );
    insert into public.user_child_profile_rewards (user_id, child_id, reward_id, stars, created_at)
      select user_id, v_child_id, reward_id, stars, created_at
        from public.user_profile_rewards
        where user_id = v_user_id
      on conflict (child_id, reward_id) do nothing;
  end if;

  return public.sync_child_profile(v_child_id, p_profile, p_rewards);
end;
$$;

revoke all on function public.list_user_children() from public, anon;
revoke all on function public.create_user_child(text, text) from public, anon;
revoke all on function public.sync_child_profile(uuid, jsonb, jsonb) from public, anon;
revoke all on function public.sync_user_profile(jsonb, jsonb) from public, anon;
grant execute on function public.list_user_children() to authenticated;
grant execute on function public.create_user_child(text, text) to authenticated;
grant execute on function public.sync_child_profile(uuid, jsonb, jsonb) to authenticated;
grant execute on function public.sync_user_profile(jsonb, jsonb) to authenticated;

do $$
begin
  if not exists (
    select 1 from pg_catalog.pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'user_child_profiles'
  ) then
    alter publication supabase_realtime add table public.user_child_profiles;
  end if;
end;
$$;
