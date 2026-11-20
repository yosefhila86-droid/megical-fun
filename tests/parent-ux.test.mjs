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

test('coloring studio keeps its category cards and navigation actions in a scrollable layout', () => {
  const content = { innerHTML: '', classList: { remove() {} } };
  const context = vm.createContext({
    selectedMiniGame: 'coloring',
    currentLanguage: 'ru',
    CATS: [{ id: 'nature', icon: '🌿', vip: false }, { id: 'animals', icon: '🐾', vip: false }],
    MINI_GAMES: [{ id: 'coloring', icon: '🎨', name: 'coloring' }],
    miniGameScene: '',
    tr: key => key,
    categoryName: id => id,
    gameUnlocked: () => true,
    launchFreeDrawFromStudio() {},
    go() {},
    openCat() {},
    $: () => content,
  });
  vm.runInContext(source('function renderGameLevels(){', 'const WORD_SEARCH_LEVELS='), context);
  context.renderGameLevels();
  assert.match(content.innerHTML, /class="grid coloring-category-grid"/);
  assert.match(content.innerHTML, /class="coloring-level-actions"/);
  assert.ok(content.innerHTML.indexOf('coloring-category-grid') < content.innerHTML.indexOf('coloring-level-actions'));
  assert.equal((content.innerHTML.match(/<button/g) || []).length, 5);
  assert.match(html, /\.screen\{[^}]*min-height:0;[^}]*overflow-y:auto/);
  assert.match(html, /#gameStage\.screen\.on\{[^}]*overflow-y:auto;[^}]*padding-bottom:calc\(24px \+ env\(safe-area-inset-bottom\)\)/);
  assert.match(html, /\.coloring-level-actions\{display:grid;grid-template-columns:repeat\(auto-fit,minmax\(min\(100%,180px\),1fr\)\)/);
});

test('age-specific Escape Room banks have localized stations and usable code parts', async () => {
  const context = vm.createContext({});
  for (const file of ['escape-room-6-7.js', 'escape-room-8-9.js', 'escape-room-10-11.js']) {
    vm.runInContext(await readFile(new URL(`../question-banks/${file}`, import.meta.url), 'utf8'), context);
  }
  const banks = context.ESCAPE_ROOM_AGE_BANKS;
  assert.deepEqual(Object.keys(banks).sort(), ['10-11', '6-7', '8-9']);
  const colors = new Set(['yellow', 'green', 'red', 'gray', 'blue', 'orange', 'purple', 'pink', 'white', 'brown', 'black', 'gold']);
  for (const [ageBand, stationCount] of [['6-7', 3], ['8-9', 4], ['10-11', 4]]) {
    const activities = banks[ageBand].activities;
    assert.equal(activities.length, 12, `${ageBand} activities`);
    for (const [activityIndex, activity] of activities.entries()) {
      for (const language of ['he', 'en', 'ru']) {
        assert.ok(activity.title[language], `${ageBand} activity ${activityIndex+1} ${language} title`);
        assert.equal(activity.stations.length, stationCount);
        for (const [stationIndex, station] of activity.stations.entries()) {
          assert.ok(station.prompt[language], `${ageBand} activity ${activityIndex+1} station ${stationIndex+1} ${language} prompt`);
          assert.ok(station.answer[language], `${ageBand} activity ${activityIndex+1} station ${stationIndex+1} ${language} answer`);
          assert.ok(station.explanation[language], `${ageBand} activity ${activityIndex+1} station ${stationIndex+1} ${language} explanation`);
          if (ageBand === '6-7' && stationIndex === 0) assert.ok(colors.has(station.codeValue));
          else assert.match(station.codeValue, /^\d$/);
        }
      }
    }
    for (let stationIndex = 0; stationIndex < stationCount; stationIndex++) {
      for (const language of ['he', 'en', 'ru']) {
        const distinctAnswers = new Set(activities.map(activity => activity.stations[stationIndex].answer[language]));
        assert.ok(distinctAnswers.size >= 4, `${ageBand} station ${stationIndex+1} has four ${language} answer choices`);
      }
    }
  }
  const expectedCodes = {
    '6-7':[
      ['yellow','2','2'],['green','3','4'],['red','3','2'],['gray','3','1'],
      ['blue','4','3'],['orange','2','5'],['purple','3','2'],['pink','7','2'],
      ['white','6','1'],['brown','6','5'],['black','4','2'],['gold','8','2'],
    ],
    '8-9':['8361','4594','5266','3104','7486','2415','3484','3752','9633','6973','4255','4155'].map(code => [...code]),
    '10-11':['2246','0501','6312','9622','4943','9723','2611','1580','4748','9088','6522','0226'].map(code => [...code]),
  };
  for (const [ageBand, sequences] of Object.entries(expectedCodes)) {
    const actual = JSON.parse(JSON.stringify(banks[ageBand].activities.map(activity => activity.stations.map(station => station.codeValue))));
    assert.deepEqual(actual, sequences, `${ageBand} documented code sequences`);
  }
  const namesContext = vm.createContext({
    S: { childAgeBand: '6-7' },
    ACTIVITY_NAMES: { en: { escapeRoom: Array(12).fill('Fallback') } },
    ESCAPE_ROOM_AGE_BANKS: banks,
  });
  vm.runInContext(`${source('function activityNames(id,language){', 'function activityCount(')}\nglobalThis.testActivityNames=activityNames;`, namesContext);
  for (const ageBand of ['6-7', '8-9', '10-11']) {
    namesContext.S.childAgeBand = ageBand;
    const expectedNames = JSON.parse(JSON.stringify(banks[ageBand].activities.map(activity => activity.title.en)));
    assert.deepEqual(Array.from(namesContext.testActivityNames('escapeRoom', 'en')), expectedNames, `${ageBand} activity labels follow the bank`);
  }
});

test('Escape Room unlocks only after entering the correct age-based station code', async () => {
  const bankContext = vm.createContext({});
  for (const file of ['escape-room-6-7.js', 'escape-room-8-9.js', 'escape-room-10-11.js']) {
    vm.runInContext(await readFile(new URL(`../question-banks/${file}`, import.meta.url), 'utf8'), bankContext);
  }
  for (const [ageBand, expectedStationCount] of [['6-7', 3], ['8-9', 4], ['10-11', 4]]) {
    const content = { innerHTML: '' },hint = { textContent: '' };
    const answerButtons = Array.from({ length: 4 }, () => ({ disabled: false }));
    const context = vm.createContext({
      ESCAPE_ROOM_AGE_BANKS: bankContext.ESCAPE_ROOM_AGE_BANKS,
      S: { childAgeBand: ageBand, completedEscapeRooms: [] },
      currentLanguage: 'en',
      selectedLevel: 0,
      activityNames: (id, language) => bankContext.ESCAPE_ROOM_AGE_BANKS[ageBand].activities.map(activity => activity.title[language]),
      $: selector => selector === '#learningHint' ? hint : content,
      document: { querySelectorAll: () => answerButtons },
      tr: (key, values = {}) => {
        const phrase = text.en[key] ?? key;
        return typeof phrase === 'string' ? phrase.replace(/\{(\w+)\}/g, (_, name) => values[name] ?? `{${name}}`) : phrase;
      },
      go() {},
      revealLearningHint() {},
      queueProfileStarReward() {},
      showGameFeedback() {},
      gameActivityAdvanceLabel: () => 'Continue',
    });
    vm.runInContext(source('let escapeRoomIndex=0', 'const GAME_WORDS='), context);
    const read = expression => vm.runInContext(expression, context);
    context.startEscapeRoom();
    assert.equal((content.innerHTML.match(/data-answer-index=/g) || []).length, 4);
    for (let stationIndex = 0; stationIndex < expectedStationCount; stationIndex++) {
      const puzzle = context.getEscapeRoomPuzzle();
      assert.equal(puzzle.options.length, 4);
      assert.equal(new Set(puzzle.options).size, 4);
      context.answerEscapeRoom({ dataset: { answerIndex: String(puzzle.answerIndex) } });
      assert.equal(read(`escapeRoomCodeParts[${stationIndex}]`), bankContext.ESCAPE_ROOM_AGE_BANKS[ageBand].activities[0].stations[stationIndex].codeValue);
      if (stationIndex < expectedStationCount - 1) context.nextEscapeRoom();
    }
    context.enterEscapeCode();
    assert.equal(read('escapeRoomPhase'), 'code');
    const correctCode = Array.from(read('escapeRoomCodeParts'));
    const wrongCode = correctCode.map((value, index) => ageBand === '6-7' && index === 0
      ? (value === 'yellow' ? 'green' : 'yellow')
      : String((Number(value) + 1) % 10));
    wrongCode.forEach((value, index) => {
      context.selectEscapeCodePart(index);
      context.chooseEscapeCodePart(value);
    });
    context.checkEscapeCode();
    assert.equal(read('escapeRoomPhase'), 'code', `${ageBand} wrong code cannot open the exit`);
    assert.equal(read('escapeCodeFeedback'), text.en.escapeCodeWrong);
    context.clearEscapeCode();
    correctCode.forEach((value, index) => {
      context.selectEscapeCodePart(index);
      context.chooseEscapeCodePart(value);
    });
    context.checkEscapeCode();
    assert.equal(read('escapeRoomPhase'), 'complete', `${ageBand} correct code opens the exit`);
    assert.ok(content.innerHTML.includes(text.en.escapeComplete));
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

test('all twelve code-breaker activities scale by age and keep distinct replayable codes', () => {
  const context = vm.createContext({
    S: { childAgeBand: '6-7' },
    childDifficultyLevel: ageBand => ({ '6-7': 1, '8-9': 2, '10-11': 3 })[ageBand],
  });
  vm.runInContext(`${source('const INTERACTIVE_CODE_COLORS=', 'function interactiveGamePrompt(')}
    globalThis.testSetLevel=level=>selectedLevel=level;
    globalThis.testSetupCodeBreaker=()=>{interactivePuzzle={};setupCodeBreaker()};
    globalThis.testPuzzle=()=>interactivePuzzle;`, context);
  const settings = {
    '6-7': { pegs: 3, colors: [0, 2, 3, 4], attempts: 8 },
    '8-9': { pegs: 4, colors: [0, 1, 2, 3, 4, 5], attempts: 8 },
    '10-11': { pegs: 5, colors: [0, 1, 2, 3, 4, 5], attempts: 9 },
  };
  for (const [ageBand, expected] of Object.entries(settings)) {
    context.S.childAgeBand = ageBand;
    const secrets = [];
    for (let level = 0; level < 12; level++) {
      context.testSetLevel(level);
      context.testSetupCodeBreaker();
      const puzzle = context.testPuzzle();
      const secret = Array.from(puzzle.secret);
      assert.equal(secret.length, expected.pegs);
      assert.equal(new Set(secret).size, expected.pegs);
      assert.ok(secret.every(color => expected.colors.includes(color)));
      assert.equal(puzzle.guess.length, expected.pegs);
      assert.equal(puzzle.maxGuesses, expected.attempts);
      context.testSetupCodeBreaker();
      assert.deepEqual(Array.from(context.testPuzzle().secret), secret);
      secrets.push(secret.join(','));
    }
    assert.equal(new Set(secrets).size, 12);
  }
  context.S.childAgeBand = '8-9';
  const currentAgeSecrets = [];
  for (let level = 0; level < 6; level++) {
    context.testSetLevel(level);
    context.testSetupCodeBreaker();
    currentAgeSecrets.push(Array.from(context.testPuzzle().secret).join(','));
  }
  assert.deepEqual(currentAgeSecrets, ['0,2,5,1', '1,3,0,2', '2,4,1,3', '3,5,2,4', '4,0,3,5', '5,1,4,0']);
});

test('code-breaker scoring and tutorial use the selected age difficulty', () => {
  const content = { innerHTML: '', classList: { remove() {} } };
  const context = vm.createContext({
    S: { childAgeBand: '6-7' },
    childDifficultyLevel: ageBand => ({ '6-7': 1, '8-9': 2, '10-11': 3 })[ageBand],
    currentLanguage: 'en',
    tr(key, values = {}) {
      let value = text.en[key] || key;
      for (const [name, replacement] of Object.entries(values)) value = value.replace(`{${name}}`, replacement);
      return value;
    },
    $: () => content,
    renderInteractivePuzzle() {},
    completeInteractivePuzzle(key) { context.completedCodeBreaker = key; },
  });
  vm.runInContext(`${source('const INTERACTIVE_CODE_COLORS=', 'let interactivePuzzle=null;')}
    let interactivePuzzle=null,selectedLevel=0;
    ${source('function renderCodeBreakerIntro(){', 'function continueCodeBreakerIntro(){')}
    ${source('function setupCodeBreaker(){', 'function interactiveGamePrompt(')}
    ${source('function selectCodePeg(', 'const ESCAPE_KEY_ROOMS=')}
    globalThis.testSetup=()=>{interactivePuzzle={};setupCodeBreaker()};
    globalThis.testPuzzle=()=>interactivePuzzle;
    globalThis.testSetLevel=level=>selectedLevel=level;`, context);
  const cases = [['6-7', 3, 8], ['8-9', 4, 8], ['10-11', 5, 9]];
  for (const [ageBand, pegs, attempts] of cases) {
    context.S.childAgeBand = ageBand;
    context.testSetLevel(0);
    context.testSetup();
    const puzzle = context.testPuzzle();
    assert.equal(puzzle.secret.length, pegs);
    assert.equal(puzzle.maxGuesses, attempts);
    const wrongGuess = puzzle.secret.slice(1).concat(puzzle.secret[0]);
    wrongGuess.forEach(color => context.setCodeColor(color));
    context.submitCodeGuess();
    assert.equal(puzzle.guesses[0].exact, 0);
    assert.equal(puzzle.guesses[0].present, pegs);
    assert.equal(puzzle.guess.length, pegs);
    puzzle.secret.forEach(color => context.setCodeColor(color));
    context.submitCodeGuess();
    assert.equal(context.completedCodeBreaker, 'codeWin');

    content.innerHTML = '';
    context.renderCodeBreakerIntro();
    assert.match(content.innerHTML, new RegExp(`sequence of ${pegs} different colors`));
    assert.match(content.innerHTML, new RegExp(`up to ${attempts} guesses`));
    const demoRows = content.innerHTML.split('<div class="code-demo-secret">').slice(1).map(row => row.split('</div>')[0]);
    assert.equal(demoRows.length, 3);
    for (const row of demoRows) assert.equal((row.match(/code-demo-slot locked/g) || []).length, pegs);
  }
});
