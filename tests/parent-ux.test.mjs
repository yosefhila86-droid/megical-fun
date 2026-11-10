import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
function source(start, end) {
  const first = html.indexOf(start), last = html.indexOf(end, first);
  assert.ok(first >= 0 && last > first);
  return html.slice(first, last);
}
const translations = vm.createContext({});
vm.runInContext(source('const TEXT=', "let currentLanguage='en';") + '\nglobalThis.TEXT=TEXT;', translations);
const text = translations.TEXT;

test('translation keys and interpolation placeholders are consistent across languages', () => {
  const placeholders = (value) => [...new Set(value.match(/\{\w+\}/g) || [])].sort().join();
  for (const language of ['he', 'ru']) {
    for (const [key, value] of Object.entries(text.en)) {
      assert.ok(Object.hasOwn(text[language], key), `${language} missing ${key}`);
      if (typeof value === 'string') {
        assert.ok(typeof text[language][key] === 'string' && text[language][key].trim(), `${language} empty ${key}`);
        assert.equal(placeholders(text[language][key]), placeholders(value), `${language} placeholders for ${key}`);
      } else if (Array.isArray(value)) {
        assert.ok(Array.isArray(text[language][key]), `${language} array for ${key}`);
        assert.equal(text[language][key].length, value.length, `${language} array length for ${key}`);
        assert.ok(text[language][key].every((item) => typeof item !== 'string' || item.trim()), `${language} empty array item for ${key}`);
      }
    }
  }
});

function dashboard({ vip = false, unlocked = [] } = {}) {
  const elements = new Map();
  const get = (selector) => {
    if (!elements.has(selector)) elements.set(selector, { textContent: '', innerHTML: '', hidden: false, value: '' });
    return elements.get(selector);
  };
  const S = { vip, allGamesUnlocked: false, unlockedGames: unlocked, dailyUsageSeconds: 0, dailyLimitMinutes: 0 };
  const MINI_GAMES = [{ id: 'one', name: 'one', icon: '1' }, { id: 'two', name: 'two', icon: '2' }];
  const context = vm.createContext({
    $, S, MINI_GAMES, BILLING_ENABLED: false,
    ensureDailyUsage() {}, billingText: (key) => key,
    tr: (key, values = {}) => (text.he[key] || key).replace(/\{(\w+)\}/g, (_, name) => values[name] ?? ''),
    gameUnlocked: (id) => S.vip || S.allGamesUnlocked || S.unlockedGames.includes(id),
  });
  function $(selector) { return get(selector); }
  vm.runInContext(source('function renderParentDashboard()', 'function openParentDashboard()'), context);
  vm.runInContext(source('function renderParentPurchaseOptions()', 'function selectParentPurchaseGame('), context);
  return { context, elements, S };
}

test('VIP explains active access and omits all unlocked games from purchase options', () => {
  const { context, elements } = dashboard({ vip: true });
  context.renderParentDashboard();
  context.renderParentPurchaseOptions();
  assert.equal(elements.get('#parentAccessNotice').hidden, false);
  assert.match(elements.get('#parentAccessNotice').textContent, /VIP.*פעיל/);
  assert.match(elements.get('#parentAccessNotice').textContent, /Google Play/);
  assert.match(elements.get('#purchaseOptionsNotice').textContent, /VIP.*פעיל/);
  assert.equal(elements.get('#purchaseGameList').innerHTML, '');
});

test('purchase options list only locked games and explains when all are already unlocked', () => {
  const { context, elements, S } = dashboard({ unlocked: ['one'] });
  context.renderParentDashboard();
  context.renderParentPurchaseOptions();
  assert.equal(elements.get('#parentAccessNotice').hidden, true);
  assert.match(elements.get('#purchaseGameList').innerHTML, />2 two<\/button>/);
  assert.doesNotMatch(elements.get('#purchaseGameList').innerHTML, /one|disabled|כבר פתוח/);
  S.unlockedGames.push('two');
  context.renderParentDashboard();
  context.renderParentPurchaseOptions();
  assert.equal(elements.get('#parentAccessNotice').hidden, false);
  assert.match(elements.get('#purchaseOptionsNotice').textContent, /כל המשחקים כבר פתוחים/);
  assert.equal(elements.get('#purchaseGameList').innerHTML, '');
});

test('code-breaker rules and animated preview appear once before activity selection in all languages', () => {
  for (const language of ['en', 'he', 'ru']) {
    for (const key of ['codeDemoTitle', 'codeDemoVideoLabel', 'codeDemoRuleCode', 'codeDemoRuleGuesses', 'codeDemoRuleClues', 'codeDemoGotIt']) {
      assert.ok(text[language][key]);
    }
  }
  const selection = source('function selectMiniGame(', 'function renderGameLevels()');
  assert.match(selection, /id==='codeBreaker'\)\{miniGameScene='codeIntro';renderCodeBreakerIntro\(\);go\('gameStage'\);return\}/);
  assert.match(selection, /function continueCodeBreakerIntro\(\)\{[\s\S]*?renderGameLevels\(\)/);
  assert.doesNotMatch(source('function renderGameLevels()', 'const WORD_SEARCH_LEVELS='), /codeDemo/);
  assert.doesNotMatch(source('function interactiveGamePrompt(', 'function renderInteractivePuzzle('), /codeDemo|codeActivityIntro/);
  assert.doesNotMatch(html, /codeTutorialM|openCodeTutorial|codeHowTo/);
});

test('all twelve code-breaker activities have distinct, replayable sequences', () => {
  const context = vm.createContext({ interactivePuzzle: {}, selectedLevel: 0 });
  vm.runInContext(source('function setupCodeBreaker()', 'function interactiveGamePrompt('), context);
  const secrets = [];
  for (let level = 0; level < 12; level++) {
    context.selectedLevel = level;
    context.setupCodeBreaker();
    const secret = Array.from(context.interactivePuzzle.secret);
    assert.equal(secret.length, 4);
    assert.equal(new Set(secret).size, 4);
    assert.ok(secret.every((color) => Number.isInteger(color) && color >= 0 && color < 6));
    context.setupCodeBreaker();
    assert.deepEqual(Array.from(context.interactivePuzzle.secret), secret);
    secrets.push(secret.join(','));
  }
  assert.equal(new Set(secrets).size, 12);
  assert.deepEqual(secrets.slice(0, 6), ['0,2,5,1', '1,3,0,2', '2,4,1,3', '3,5,2,4', '4,0,3,5', '5,1,4,0']);
});
