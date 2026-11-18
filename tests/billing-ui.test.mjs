import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import { SUBSCRIPTION_PRODUCTS } from '../supabase/functions/_shared/subscription-state.mjs';

const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
const start = html.indexOf('const BILLING_PRODUCTS=');
const end = html.indexOf('function gateOk(){', start);
assert.ok(start !== -1 && end > start);
const source = html.slice(start, end);

function createContext({ response, owned = [], price = '₪6.10', invoke } = {}) {
  const elements = new Map();
  const element = (selector) => {
    if (!elements.has(selector)) elements.set(selector, {
      classList: { contains: () => selector === '#vipM' },
      disabled: false, textContent: '',
    });
    return elements.get(selector);
  };
  const logs = [];
  const plugins = {
    BillingCatalog: {
      queryOwnedSubscriptions: async () => ({ subscriptions: owned }),
      querySubscriptions: async ({ productIds }) => ({
        products: productIds.map((productId) => ({
          productId,
          offers: [{ basePlanId: 'monthly', pricingPhases: [{
            billingPeriod: 'P1M', recurrenceMode: 1, formattedPrice: price,
            currencyCode: 'ILS', priceAmountMicros: 6100000,
          }] }],
        })),
      }),
    },
    BillingPurchase: {},
  };
  const context = vm.createContext({
    window: { Capacitor: { getPlatform: () => 'android', Plugins: plugins } },
    console: { error: (...args) => logs.push(args) },
    setTimeout: () => 1, clearTimeout: () => {},
    $: element, toast: (message) => logs.push(message),
    renderParentDashboard: () => {}, renderGameLevels: () => {}, closeM: () => {},
    MINI_GAMES: [{ id: 'coloring', name: 'coloring' }], tr: (key) => key,
    S: { vip: false, allGamesUnlocked: false },
    document: { visibilityState: 'visible' },
    Date, Set,
  });
  vm.runInContext(`
    const BILLING_ENABLED=true;
    let currentLanguage='he',currentAuthUserId='user-id',billingAccess=[],billingVerifiedAt=0,
      billingRefreshTimer=null,billingBusy=false,billingPrices={},pendingPurchaseGame='coloring',
      miniGameScene='menu';
    const supabaseClient={functions:{invoke: globalThis.invoke}};
  `, Object.assign(context, {
    invoke: invoke || (async (_name, { body }) => ({
      data: body.action === 'sync' ? (response || { subscriptions: [] }) : { items: [] },
      error: null,
    })),
  }));
  vm.runInContext(source, context);
  return { context, elements, logs, plugins };
}

test('browser product map exactly matches server products', () => {
  const { context } = createContext();
  const products = vm.runInContext('JSON.stringify(BILLING_PRODUCTS)', context);
  const map = JSON.parse(products);
  assert.equal(Object.keys(map).length, 19);
  for (const [game, product] of Object.entries(map)) assert.equal(SUBSCRIPTION_PRODUCTS[product], game);
});

test('billing only activates when the Android build explicitly enables it', async () => {
  const { context, plugins } = createContext();
  vm.runInContext('let BILLING_TEST_STATE=false;', context);
  const initSource = source.slice(source.indexOf('async function initializeBilling()'), source.indexOf('function clearBillingAccess()'));
  vm.runInContext(initSource.replaceAll('BILLING_ENABLED', 'BILLING_TEST_STATE'), context);
  vm.runInContext('currentAuthUserId=null', context);
  plugins.BillingPurchase.getAvailability = async () => ({ enabled: false });
  await vm.runInContext('initializeBilling()', context);
  assert.equal(vm.runInContext('BILLING_TEST_STATE', context), false);
  plugins.BillingPurchase.getAvailability = async () => ({ enabled: true });
  await vm.runInContext('initializeBilling()', context);
  assert.equal(vm.runInContext('BILLING_TEST_STATE', context), true);
});

test('billing stays disabled if native availability fails', async () => {
  const { context, plugins, logs } = createContext();
  vm.runInContext('let BILLING_TEST_STATE=false;', context);
  const initSource = source.slice(source.indexOf('async function initializeBilling()'), source.indexOf('function clearBillingAccess()'));
  vm.runInContext(initSource.replaceAll('BILLING_ENABLED', 'BILLING_TEST_STATE'), context);
  plugins.BillingPurchase.getAvailability = async () => { throw new Error('plugin unavailable'); };
  await vm.runInContext('initializeBilling()', context);
  assert.equal(vm.runInContext('BILLING_TEST_STATE', context), false);
  assert.ok(logs.some((entry) => Array.isArray(entry) && entry[0].includes('purchases are available')));
});

test('catalog accepts Google Play base offers even if optional offerId is absent', async () => {
  const { context, elements } = createContext();
  await vm.runInContext('loadBillingPrices()', context);
  assert.equal(elements.get('#purchaseGameButton').disabled, false);
  assert.equal(elements.get('#purchaseAllButton').disabled, false);
  assert.match(elements.get('#purchaseGameButton').textContent, /₪6\.10/);
});

test('restore only grants verified, unexpired, known products and never returns tokens', async () => {
  const owned = [{ purchaseToken: 'secret-token', productIds: ['game_coloring_monthly'] }];
  const response = { subscriptions: [{ items: [
    { productId: 'game_coloring_monthly', gameId: 'coloring', grantsAccess: true, expiresAt: Date.now() + 60000 },
    { productId: 'game_puzzle_monthly', gameId: 'puzzle', grantsAccess: true, expiresAt: Date.now() - 1 },
    { productId: 'game_unknown_monthly', gameId: 'unknown', grantsAccess: true, expiresAt: Date.now() + 60000 },
    { productId: 'all_games_monthly', gameId: null, grantsAccess: false, expiresAt: Date.now() + 60000 },
  ] }] };
  const { context } = createContext({ owned, response });
  assert.equal(await vm.runInContext('restorePurchases(true)', context), true);
  assert.deepEqual(JSON.parse(vm.runInContext('JSON.stringify(billingAccess.map(item=>item.gameId))', context)), ['coloring']);
});

test('verification failure preserves previously verified access', async () => {
  const { context } = createContext({
    invoke: async () => ({ data: null, error: new Error('offline') }),
  });
  vm.runInContext('billingAccess=[{gameId:null,expiresAt:Date.now()+10000}];billingVerifiedAt=Date.now()', context);
  assert.equal(await vm.runInContext('restorePurchases(true)', context), false);
  assert.equal(vm.runInContext('billingAccess.length', context), 1);
  assert.ok(vm.runInContext('billingVerifiedAt', context) > 0);
});

test('manual VIP skips Google Play verification and quiet failure does not toast', async () => {
  let catalogCalls = 0;
  const { context, plugins, logs } = createContext();
  plugins.BillingCatalog.queryOwnedSubscriptions = async () => { catalogCalls++; throw new Error('offline'); };
  vm.runInContext('S.vip=true;S.allGamesUnlocked=false', context);
  assert.equal(await vm.runInContext('restorePurchases(true)', context), true);
  assert.equal(catalogCalls, 0);
  vm.runInContext('S.vip=false;S.allGamesUnlocked=false', context);
  assert.equal(await vm.runInContext('restorePurchases(true)', context), false);
  assert.equal(catalogCalls, 1);
  assert.equal(logs.some(entry=>typeof entry==='string'&&entry==='error'), false);
});

test('ignores a verification response after the application account changes', async () => {
  let release;
  const gate = new Promise((resolve) => { release = resolve; });
  const { context } = createContext({
    invoke: async () => { await gate; return { data: { subscriptions: [] }, error: null }; },
  });
  const result = vm.runInContext('restorePurchases(true)', context);
  vm.runInContext("currentAuthUserId='other-user'", context);
  release();
  assert.equal(await result, false);
  assert.equal(vm.runInContext('billingAccess.length', context), 0);
});

test('purchase passes the displayed amount and currency to native Play and verifies token', async () => {
  const calls = [];
  const { context, plugins } = createContext({
    invoke: async (_name, { body }) => {
      calls.push(body);
      return { data: body.action === 'sync' ? { subscriptions: [] } : { items: [] }, error: null };
    },
  });
  plugins.BillingPurchase.purchase = async (input) => {
    calls.push(input);
    return { purchaseToken: 'new-token', purchaseState: 1 };
  };
  await vm.runInContext('loadBillingPrices()', context);
  await vm.runInContext("startSubscription('coloring')", context);
  const nativeCall = calls.find((call) => call.productId);
  assert.equal(nativeCall.productId, 'game_coloring_monthly');
  assert.equal(nativeCall.expectedPrice, '₪6.10');
  assert.equal(nativeCall.expectedCurrency, 'ILS');
  assert.equal(nativeCall.expectedMicros, 6100000);
  assert.ok(calls.some((call) => call.purchaseToken === 'new-token'));
});

test('does not open a purchase if existing access is missing from this Play account', async () => {
  const response = { subscriptions: [{ items: [{
    productId: 'game_puzzle_monthly', gameId: 'puzzle', grantsAccess: true, expiresAt: Date.now() + 60000,
  }] }] };
  const { context, plugins, logs } = createContext({ response });
  plugins.BillingPurchase.purchase = async () => assert.fail('must not launch purchase');
  await vm.runInContext('loadBillingPrices()', context);
  await vm.runInContext('startSubscription(null)', context);
  assert.ok(logs.some((value) => typeof value === 'string' && value.includes('Google Play')));
});
