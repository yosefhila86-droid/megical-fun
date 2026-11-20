import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
const sql = await readFile(new URL('../supabase/profile_sync.sql', import.meta.url), 'utf8');
const childSql = await readFile(new URL('../supabase/child_profiles.sql', import.meta.url), 'utf8');

function syncContext(rpc) {
  const values = new Map();
  const elements = new Map([
    ['#hStars', { textContent: '' }],
    ['#profile', { classList: { contains: () => false } }],
  ]);
  const context = vm.createContext({
    currentLanguage: 'en',
    TEXT: { en: {} },
    localStorage: {
      getItem: (key) => values.get(key) ?? null,
      setItem: (key, value) => values.set(key, value),
    },
    crypto: { randomUUID: () => 'reward-id' },
    window: {},
    document: { hidden: false },
    console: { error() {} },
    setTimeout: () => 1,
    clearTimeout() {},
    setInterval: () => 1,
    clearInterval() {},
    $: (selector) => elements.get(selector),
    toast() {},
    renderProfile() {},
    setLanguage() {},
    testRpc: rpc,
  });
  const start = html.indexOf('let currentUserId =');
  const end = html.indexOf('const AVATARS_LIST', start);
  assert.ok(start >= 0 && end > start);
  vm.runInContext(html.slice(start, end), context);
  vm.runInContext('supabaseClient = { rpc: testRpc }', context);
  vm.runInContext(`
    currentUserId = 'account:user-id';
    currentAuthUserId = 'user-id';
    currentChildId = 'child-id';
    profileSyncReady = true;
    S = {name:'Child',av:'🐶',stars:0,art:[],custom:[],music:true,track:'auto',vol:0.6,
      language:'en',completedEscapeRooms:[],completedPuzzleStars:[],dailyUsageDate:'',
      dailyUsageSeconds:0,dailyLimitMinutes:0};
  `, context);
  return { context, values, elements };
}

test('star rewards persist locally until the server confirms their idempotent IDs', async () => {
  let request, rpcName;
  const { context, values, elements } = syncContext(async (name, args) => {
    rpcName = name;request = args;
    return {
      data: {
        profile: { ...args.p_profile, stars: 12, art: ['cloud-art'] },
        processed_reward_ids: args.p_rewards.map((reward) => reward.id),
      },
      error: null,
    };
  });

  context.queueProfileStarReward(1, 'achievement:physicsPaths:0:path-0');
  assert.equal(vm.runInContext('S.stars', context), 1);
  assert.equal(JSON.parse(values.get('megical_profile_rewards_user-id_child-id')).length, 1);

  await context.syncProfileNow();
  assert.equal(rpcName, 'sync_child_profile');
  assert.equal(request.p_child_id, 'child-id');
  assert.equal(request.p_rewards[0].id, 'achievement:physicsPaths:0:path-0');
  assert.equal(vm.runInContext('S.stars', context), 12);
  assert.deepEqual(JSON.parse(values.get('megical_profile_rewards_user-id_child-id')), []);
  assert.equal(vm.runInContext('S.art.includes("cloud-art")', context), true);
  assert.equal(elements.get('#hStars').textContent, '⭐ 12');
});

test('duplicate pending reward IDs cannot add stars a second time', () => {
  const { context, values } = syncContext(async () => ({ data: {}, error: null }));
  context.queueProfileStarReward(2, 'daily:2026-11-12');
  context.queueProfileStarReward(2, 'daily:2026-11-12');
  assert.equal(vm.runInContext('S.stars', context), 2);
  assert.equal(JSON.parse(values.get('megical_profile_rewards_user-id_child-id')).length, 1);
});

test('identical reward IDs are independent across child profiles', () => {
  const { context, values } = syncContext(async () => ({ data: {}, error: null }));
  context.queueProfileStarReward(1, 'daily:2026-11-12');
  vm.runInContext("currentChildId='other-child';S.stars=0", context);
  context.queueProfileStarReward(1, 'daily:2026-11-12');
  assert.equal(JSON.parse(values.get('megical_profile_rewards_user-id_child-id')).length, 1);
  assert.equal(JSON.parse(values.get('megical_profile_rewards_user-id_other-child')).length, 1);
  assert.equal(vm.runInContext('S.stars', context), 1);
});

test('daily login bonus is awarded only once per local calendar day', () => {
  const today = new Date(2026, 10, 12, 12);
  class FixedDate extends Date {
    constructor(...args) { super(...(args.length ? args : [today])); }
  }
  let rewards = 0, popups = 0;
  const elements = new Map([
    ['#dailyT', { textContent: '' }], ['#dailyD', { textContent: '' }],
    ['#dailyG', { textContent: '' }], ['#dailyB', { textContent: '' }],
    ['#dailyM', { classList: { add() { popups++; } } }],
  ]);
  const context = vm.createContext({
    Date: FixedDate,
    S: { lastDay: '', streak: 0 },
    tr: (key) => key,
    queueProfileStarReward: () => { rewards++; },
    renderProfile() {},
    $: selector => elements.get(selector),
    celebrate() {},
  });
  const start = html.indexOf('let dailyFor=null;');
  const end = html.indexOf('const _go=go;', start);
  assert.ok(start >= 0 && end > start);
  vm.runInContext(html.slice(start, end), context);
  context.dailyBonus();
  context.dailyBonus();
  assert.equal(rewards, 1);
  assert.equal(popups, 1);
  assert.equal(vm.runInContext('S.lastDay', context), '2026-11-12');
});

test('cloud profile synchronization does not replace a newer local daily claim date', () => {
  const { context } = syncContext(async () => ({ data: {}, error: null }));
  vm.runInContext("S.lastDay='2026-11-12';S.streak=4", context);
  context.applyCloudProfile({ stars: 0, lastDay: '2026-11-11', streak: 3 });
  assert.equal(vm.runInContext('S.lastDay', context), '2026-11-12');
  assert.equal(vm.runInContext('S.streak', context), 4);
});

test('child age range is synchronized and local changes during sync are preserved', async () => {
  let completeRequest;
  const { context } = syncContext(() => new Promise((resolve) => { completeRequest = resolve; }));
  vm.runInContext("S.childAgeBand='8-9'", context);
  const syncing = context.syncProfileNow();
  vm.runInContext("S.childAgeBand='10-11';sv()", context);
  completeRequest({
    data: {
      profile: vm.runInContext('({...S, childAgeBand:"8-9"})', context),
      processed_reward_ids: [],
    },
  });
  await syncing;
  assert.equal(vm.runInContext('S.childAgeBand', context), '10-11');
  assert.match(sql, /'childAgeBand',\s*coalesce\(nullif\(p_profile->'childAgeBand'/i);
  assert.match(sql, /Invalid child age range/);
});

test('a cloud-synced age range exits the required age screen', () => {
  const { context } = syncContext(async () => ({ data: {}, error: null }));
  let destination = '';
  context.curScreen = 'childProfile';
  context.go = (screen) => { destination = screen; };
  context.applyCloudProfile({ stars: 0, childAgeBand: '8-9' });
  assert.equal(vm.runInContext('S.childAgeBand', context), '8-9');
  assert.equal(destination, 'games');
});

test('local edits made during an in-flight sync are not overwritten by its older response', async () => {
  let completeRequest;
  const { context } = syncContext(() => new Promise((resolve) => { completeRequest = resolve; }));
  vm.runInContext("S.name = 'Before sync'", context);
  const syncing = context.syncProfileNow();
  vm.runInContext("S.name = 'Edited on this device'; sv()", context);
  completeRequest({
    data: {
      profile: vm.runInContext('({...S, name:"Before sync", stars:4})', context),
      processed_reward_ids: [],
    },
    error: null,
  });
  await syncing;
  assert.equal(vm.runInContext('S.name', context), 'Edited on this device');
  assert.equal(vm.runInContext('S.stars', context), 4);
});

test('server migration limits active devices and keeps rewards private and idempotent', () => {
  assert.match(sql, /v_active_count\s*>=\s*5/);
  assert.match(sql, /last_seen_at\s*<\s*now\(\)\s*-\s*interval '5 minutes'/);
  assert.match(sql, /primary key \(user_id, reward_id\)/);
  assert.match(sql, /on conflict \(user_id, reward_id\) do nothing/i);
  assert.match(sql, /auth\.uid\(\)/);
  assert.match(sql, /revoke all on public\.user_profile_rewards from anon, authenticated/i);
  assert.match(sql, /'stars', v_stars/);
  assert.doesNotMatch(sql, /'vip'|'allGamesUnlocked'|'unlockedGames'/);
  assert.match(childSql, /count\(\*\)[\s\S]*v_child_count >= 5/);
  assert.match(childSql, /public\.sync_child_profile/);
  assert.match(childSql, /primary key \(child_id, reward_id\)/);
  assert.match(childSql, /insert into public\.user_child_profiles[\s\S]*from public\.user_profiles/);
  assert.match(childSql, /create_user_child\(text, text\)/);
  assert.match(childSql, /auth\.uid\(\)/);
});

test('device limit and sync failures have translations in all supported languages', () => {
  const messages = ['deviceLimitReached', 'progressSyncFailed', 'profileSyncUnavailable'];
  for (const language of ['en', 'he', 'ru']) {
    for (const message of messages) {
      assert.match(html, new RegExp(`Object\\.assign\\(TEXT\\.${language},\\{[^}]*${message}:`));
    }
  }
});

test('all star awards use the shared reward queue instead of direct increments', () => {
  const queueStart = html.indexOf('function queueProfileStarReward(');
  const queueEnd = html.indexOf('function newProfileRewardId()', queueStart);
  const queue = html.slice(queueStart, queueEnd);
  assert.match(queue, /S\.stars\+=stars/);
  assert.doesNotMatch(html.replace(queue, ''), /S\.stars\s*(?:\+\+|\+=)/);
  assert.match(html, /queueProfileStarReward\(gain,`daily:\$\{today\}`\)/);
  assert.match(html, /queueProfileStarReward\(1,`achievement:\$\{key\}`\)/);
});
