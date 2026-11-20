import test from 'node:test';
import assert from 'node:assert/strict';
import { access, readFile, readdir } from 'node:fs/promises';
import vm from 'node:vm';

const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
const serviceWorker = await readFile(new URL('../sw.js', import.meta.url), 'utf8');
const translations = vm.createContext({});
const translationStart = html.indexOf('const TEXT='), translationEnd = html.indexOf("let currentLanguage='en';", translationStart);
vm.runInContext(`${html.slice(translationStart, translationEnd)}\nglobalThis.TEXT=TEXT;`, translations);
const textForLanguage = (language) => translations.TEXT[language];
const slice = (start, end) => {
  const first = html.indexOf(start), last = html.indexOf(end, first);
  assert.ok(first >= 0 && last > first);
  return html.slice(first, last);
};
function languageChangeContext(selectedMiniGame, miniGameScene = 'play', additions = {}) {
  const nodes = new Map();
  const context = vm.createContext({
    TEXT: translations.TEXT,
    currentLanguage: 'en',
    selectedMiniGame,
    selectedLevel: 0,
    miniGameScene,
    S: {},
    authErrorState: false,
    authStatusState: false,
    localStorage: { setItem() {} },
    document: { documentElement: {}, querySelectorAll: () => [] },
    $: selector => {
      if (selector === '#drawIdea') return null;
      if (!nodes.has(selector)) nodes.set(selector, {
        value: '', href: '', textContent: '', style: { display: 'none' },
        classList: { contains: name => selector === '#gameStage' && name === 'on' },
      });
      return nodes.get(selector);
    },
    sv() {},
    tr: key => key,
    ...additions,
  });
  vm.runInContext(slice('function setLanguage(language){', 'let currentUserId ='), context);
  return context;
}
const tracing = vm.createContext({});
vm.runInContext(slice('function traceDistances(', 'function traceMatchesLetter('), tracing);

function mask(width, height, paint) {
  const data = new Uint8ClampedArray(width * height * 4);
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
    if (paint(x, y)) data[(y * width + x) * 4 + 3] = 255;
  }
  return data;
}

test('tracing requires near-complete coverage and rejects unrelated ink', () => {
  const width = 100, height = 100;
  const target = mask(width, height, (x, y) => x >= 20 && x < 30 && y >= 10 && y < 90);
  const complete = mask(width, height, (x, y) => x >= 21 && x < 29 && y >= 10 && y < 90);
  const partial = mask(width, height, (x, y) => x >= 21 && x < 29 && y >= 10 && y < 35);
  const scribble = mask(width, height, (x, y) => (x >= 21 && x < 29 && y >= 10 && y < 90) || (x >= 50 && x < 90 && y >= 10 && y < 90));
  assert.equal(tracing.traceMasksMatch(target, complete, width, height), true);
  assert.equal(tracing.traceMasksMatch(target, partial, width, height), false);
  assert.equal(tracing.traceMasksMatch(target, scribble, width, height), false);
  assert.equal(tracing.traceMasksMatch(target, mask(width, height, () => false), width, height), false);
});

test('letter tracing keeps its guide without incorrect direction arrows', () => {
  const tracingUi = slice('let traceLetterIndex=0', 'function clearTrace()');
  assert.match(tracingUi, /id="traceGuide" class="trace-guide"/);
  assert.match(tracingUi, /guide\.fillText\(letter,160,160\)/);
  assert.doesNotMatch(tracingUi, /traceDirections|drawTraceDirections/);
  assert.doesNotMatch(html, /\.trace-directions/);
});

test('Hebrew cursive tracing uses a bundled handwriting font', () => {
  const fontPattern = /@font-face\{[^}]*font-family:'Gveret Levin'[^}]*src:url\('\.\/fonts\/GveretLevin-Regular\.ttf'\)/;
  assert.match(html, fontPattern);
  const trace = slice('function renderLetterStyleSelection(level){', 'function clearTrace()');
  assert.match(trace, /hebrew-cursive-preview/);
  assert.match(trace, /document\.fonts\.load\('220px "Gveret Levin"'/);
  assert.match(trace, /guide\.font=.*"Gveret Levin",cursive/);
});

test('game feedback stays open until its action is selected and excludes coloring', () => {
  const modal = { classList: { add(value) { this.added = value; }, remove(value) { this.removed = value; } } };
  const title = { textContent: '' }, message = { textContent: '' }, icon = { textContent: '' };
  const button = { textContent: '', onclick: null, focus() { this.focused = true; } };
  const elements = new Map([
    ['#gameFeedbackM', modal], ['#gameFeedbackTitle', title], ['#gameFeedbackMessage', message],
    ['#gameFeedbackIcon', icon], ['#gameFeedbackAction', button],
  ]);
  let actionCalls = 0;
  const context = vm.createContext({
    selectedMiniGame: 'math',
    tr: key => key,
    $: selector => elements.get(selector),
  });
  vm.runInContext(slice('function toast(t)', '/* ---------- background music'), context);
  context.showGameFeedback('Correct answer', 'Next level', () => actionCalls++, true);
  assert.equal(modal.classList.added, 'on');
  assert.equal(title.textContent, 'done');
  assert.equal(message.textContent, 'Correct answer');
  assert.equal(button.textContent, 'Next level');
  assert.equal(button.focused, true);
  assert.equal(actionCalls, 0);
  button.onclick();
  assert.equal(modal.classList.removed, 'on');
  assert.equal(actionCalls, 1);

  context.selectedMiniGame = 'coloring';
  context.showGameFeedback('Saved', 'Close', () => actionCalls++);
  assert.equal(actionCalls, 1);
});

test('Russian counted story items use singular, few and many forms', () => {
  const context = vm.createContext({});
  vm.runInContext(slice('const STORY_MATH_ITEMS=', 'const PATTERN_THEMES='), context);
  vm.runInContext(slice('function getRussianCountedItem(', 'function getMathQuestion('), context);
  for (const [count, expected] of [[1,'билет'],[2,'билета'],[5,'билетов'],[11,'билетов'],[21,'билет'],[23,'билета'],[111,'билетов']]) {
    assert.equal(vm.runInContext(`getRussianCountedItem(STORY_MATH_ITEMS[11],${count})`, context), expected);
  }
});

test('all 120 story-math questions use the supplied multilingual stories and exact answers', () => {
  const context = vm.createContext({
    makeChoices: (answer) => [answer, answer + 1, answer + 2, answer + 3],
  });
  vm.runInContext(slice('const STORY_MATH_ITEMS=', 'const PATTERN_THEMES='), context);
  vm.runInContext(slice('function getRussianCountedItem(', 'function getWordQuestion('), context);

  const answers = [
    ['9','8','10','12','15','12','12','9','3.75','15'],
    ['8','12','9','15','8','15','13','8','13','7'],
    ['15','9','20','5','11','14','30','5','9','20'],
    ['13','8','12','10','13','18','13','7','20','24'],
    ['18','18','20','6','16','24','21','16','9','27'],
    ['15','19','21','15','19','24','13','7','23','10'],
    ['16','12','20','6','16','21','15','4','23','21'],
    ['20','13','24','6','12','30','11','4','20','10'],
    ['16','17','24','6','8','11','24','4','26','35'],
    ['15','6','20','15','15','14','24','36','21','10'],
    ['15','14','20','6','15','21','15','4','23','21'],
    ['16','17','24','6','16','16','10','9','20','21'],
  ];
  for (let activity = 0; activity < 12; activity++) {
    const prompts = [];
    for (let question = 0; question < 10; question++) {
      const result = vm.runInContext(`getStoryMathQuestion(${activity},${question})`, context);
      assert.equal(result.answer, answers[activity][question], `activity ${activity}, question ${question}`);
      for (const language of ['he', 'en', 'ru']) assert.ok(result.question[language], `${language} missing`);
      assert.equal(result.options.length, 4);
      assert.equal(new Set(result.options).size, 4);
      assert.ok(result.options.includes(result.answer));
      prompts.push(result.question.he);
    }
    assert.equal(new Set(prompts).size, 10, `activity ${activity} repeats a Hebrew story`);
  }

  assert.equal(vm.runInContext('getStoryMathQuestion(0,0).question.he', context),
    'לדניאל יש בקלמר 6 עפרונות שחורים ו-3 עפרונות צבעוניים. כמה עפרונות יש לדניאל בסך הכל בקלמר?');
  assert.match(vm.runInContext('getStoryMathQuestion(3,2).question.he', context), /4 שורות של שיחים.*3 ציפורי שיר/);
  assert.match(vm.runInContext('getStoryMathQuestion(6,9).question.he', context), /28 הזמנות.*7 הזמנות/);
  assert.equal(vm.runInContext('getStoryMathQuestion(6,9).answer', context), '21');
  assert.match(vm.runInContext('getStoryMathQuestion(11,6).question.he', context), /15 בלונים אדומים ו-15 בלונים כחולים.*שליש/);
});

test('ten-question games offer previous-question navigation and do not repeat rewards', () => {
  const element = { innerHTML: '' };
  let renders = 0, rewards = 0;
  const buttons = [];
  const context = vm.createContext({
    selectedMiniGame: 'math',
    selectedLevel: 0,
    riddleQuestionIndex: 1,
    learningAnsweredQuestions: new Set(),
    learningGameHasTenQuestions: () => true,
    getLearningQuestionLabel: () => 'Question 2 of 10',
    createLearningQuestion: () => ({ answer: '2', question: '1 + 1', options: ['1','2','3','4'], promptKey: 'mathPrompt' }),
    MINI_GAMES: [{ id: 'math', name: 'math', icon: '+' }],
    currentLanguage: 'he',
    tr: key => key === 'previousQuestion' ? '→ שאלה קודמת' : key,
    playLearningGame: () => { renders++; },
    clearLearningHint() {},
    document: { querySelectorAll: () => buttons },
    queueProfileStarReward: () => { rewards++; },
    newProfileRewardId: () => 'id',
    showGameFeedback() {},
    nextRiddleQuestion() {},
    genericAnswer: '2',
    $: () => element,
  });
  vm.runInContext(slice('function playLearningGame(id,level){', 'function revealLearningHint(){'), context);
  context.playLearningGame('math', 0);
  assert.match(element.innerHTML, /onclick="previousLearningQuestion\(\)"/);
  vm.runInContext(slice('function previousLearningQuestion(){', 'function retryLearningAnswer(){'), context);
  vm.runInContext(slice('function answerLearningGame(button){', 'function nextRiddleQuestion(){'), context);
  context.previousLearningQuestion();
  assert.equal(vm.runInContext('riddleQuestionIndex', context), 0);
  context.answerLearningGame({ dataset: { answer: '2' } });
  context.answerLearningGame({ dataset: { answer: '2' } });
  assert.equal(rewards, 1);
});

test('Sokoban shows retry feedback when a push makes the box unsolvable', () => {
  const puzzle = {
    finished: false,
    player: { x: 1, y: 3 },
    box: { x: 2, y: 3 },
    goal: { x: 1, y: 1 },
    walls: new Set(['4,3', '3,4']),
    size: 6,
    pushes: 0,
    turns: 0,
  };
  let renders = 0;
  const context = vm.createContext({
    interactivePuzzle: puzzle,
    tr: key => key,
    renderInteractivePuzzle: () => renders++,
  });
  vm.runInContext(slice('function sokobanHasSolution(', 'function setupCodeBreaker()'), context);
  vm.runInContext(slice('function moveSokoban(', 'function selectCodePeg('), context);
  context.moveSokoban(1, 0);
  assert.equal(puzzle.finished, true);
  assert.equal(puzzle.feedback, 'sokobanDeadEnd');
  assert.equal(puzzle.box.x, 3);
  assert.equal(puzzle.box.y, 3);
  assert.equal(renders, 1);
});

test('Sokoban hides move and push counts from the selector and active board', () => {
  const gameContent = { innerHTML: '', classList: { toggle() {} } };
  const context = vm.createContext({
    S: { completedPuzzleStars: [] },
    AGE_ADAPTED_STAGE_COUNT: 5,
    selectedLevel: 0,
    currentLanguage: 'en',
    interactivePuzzle: {
      id: 'gridSokoban', size: 4, walls: new Set(),
      player: { x: 1, y: 1 }, box: { x: 2, y: 1 }, goal: { x: 2, y: 2 },
      finished: false, won: false, feedback: '', hint: '',
    },
    MINI_GAMES: [{ id: 'gridSokoban', name: 'gridSokoban' }],
    activityNames: () => ['Activity'],
    sokobanLevelIsUnlocked: () => true,
    sokobanLevelStarKey: (_, level) => `box-${level}`,
    childDifficultyLevel: () => 1,
    isAgeAdaptedStageGame: () => false,
    miniGameStageContinueLabel: () => 'Continue',
    gameActivityAdvanceLabel: () => 'Continue',
    interactiveGamePrompt: () => 'Push the box to the goal.',
    renderAgeAdaptedStageBanner: () => '',
    tr: (key, values = {}) => key === 'boxLevelLabel' ? `Level ${values.n} · ${values.board}` : key,
    $: selector => selector === '#gameContent' ? gameContent : selector === '#gameStage' ? { scrollTop: 0 } : null,
  });
  vm.runInContext(slice('function renderSokobanLevels(){', 'const RAILWAY_COLOR_VALUES='), context);
  context.renderSokobanLevels();
  assert.doesNotMatch(gameContent.innerHTML, /Moves:|Box pushes:|boxMoves|boxPushes/i);

  vm.runInContext(slice('function renderInteractivePuzzle(){', 'function showInteractiveHint(){'), context);
  context.renderInteractivePuzzle();
  assert.doesNotMatch(gameContent.innerHTML, /Moves:|Box pushes:|boxMoves|boxPushes/i);
});

test('riddle answers render without letter or number prefixes', () => {
  const element = { innerHTML: '' };
  const context = vm.createContext({
    currentLanguage: 'he',
    riddleQuestionIndex: 0,
    selectedLevel: 0,
    MINI_GAMES: [{ id: 'riddles', name: 'riddles', icon: '❓' }],
    createLearningQuestion: () => ({ answer: 'תשובה א', question: 'חידה', options: ['תשובה א', 'תשובה ב', 'תשובה ג', 'תשובה ד'], promptKey: 'riddlePrompt' }),
    learningGameHasTenQuestions: () => true,
    getLearningQuestionLabel: () => 'שאלה 1',
    tr: key => key,
    $: () => element,
  });
  vm.runInContext(slice('function playLearningGame(id,level){', 'function revealLearningHint(){'), context);
  context.playLearningGame('riddles', 0);
  assert.match(element.innerHTML, />תשובה א<\/button>/);
  assert.doesNotMatch(element.innerHTML, /[א-ד]\)\s|[A-D]\)\s|[А-Г]\)\s/);
});

test('coloring palette includes black and refreshes translated labels when language changes', () => {
  const colors = vm.createContext({});
  vm.runInContext(slice('const COLORS=', 'const SIZES='), colors);
  assert.equal(vm.runInContext("COLORS.includes('#000000')", colors), true);

  const nodes = new Map();
  for (const selector of ['#language', '#welcomeLanguage', '#profileLanguage', '#privacyLink', '#parentPrivacyLink', '#deleteAccountLink', '#parentDeleteAccountLink', '#auth', '#aSubmit', '#drawIdea', '#paint', '#items', '#games', '#profile', '#parentM', '#gamePurchaseM', '#vipM', '#gameStage']) {
    nodes.set(selector, { value: '', href: '', textContent: '', style: { display: 'none' }, classList: { contains: name => selector === '#paint' && name === 'on' } });
  }
  let palettesRendered = 0, toolsRefreshed = 0;
  const context = vm.createContext({
    TEXT: { en: {}, he: {}, ru: {} },
    currentLanguage: 'en',
    miniGameScene: 'levels',
    S: {},
    authErrorState: false,
    authStatusState: false,
    localStorage: { setItem() {} },
    document: { documentElement: {}, querySelectorAll: () => [] },
    $: selector => nodes.get(selector) || null,
    sv() {},
    tr: key => key,
    renderPalette: () => palettesRendered++,
    refreshTools: () => toolsRefreshed++,
  });
  vm.runInContext(slice('function setLanguage(language){', '/* ---------- User Isolation & Storage'), context);
  context.setLanguage('ru');
  assert.equal(palettesRendered, 1);
  assert.equal(toolsRefreshed, 1);
});

test('language changes refresh specialized game scenes and preserve their state', () => {
  let wordSearchContext, wordSearchRendered;
  const wordSearchContextRef = languageChangeContext('wordSearch', 'play', {
    createWordSearchPuzzle(activity, level) {
      return { activity, level, language: wordSearchContext.currentLanguage };
    },
    renderWordSearchGame() {
      wordSearchRendered = vm.runInContext('wordSearchPuzzle', wordSearchContext);
    },
  });
  wordSearchContext = wordSearchContextRef;
  wordSearchContext.selectedLevel = 4;
  vm.runInContext('let selectedWordSearchLevel=2;let wordSearchPuzzle={language:"en"};', wordSearchContext);
  wordSearchContext.setLanguage('ru');
  assert.deepEqual(wordSearchRendered, { activity: 4, level: 2, language: 'ru' });

  let magneticRenderCount = 0;
  const magneticContext = languageChangeContext('magneticMaze', 'play', {
    renderMagneticMaze() { magneticRenderCount++; },
  });
  vm.runInContext('let magneticMaze={ball:7,status:"blocked",finished:false};', magneticContext);
  magneticContext.setLanguage('he');
  assert.equal(magneticRenderCount, 1);
  assert.equal(vm.runInContext('magneticMaze.ball', magneticContext), 7);
  assert.equal(vm.runInContext('magneticMaze.status', magneticContext), '');

  let differenceRenderCount = 0, memoryRenderCount = 0, letterRender;
  const differencesContext = languageChangeContext('differences', 'play', {
    renderDifferences() { differenceRenderCount++; },
  });
  vm.runInContext('let differenceFound=new Set([1,4]);', differencesContext);
  differencesContext.setLanguage('ru');
  assert.equal(differenceRenderCount, 1);
  assert.deepEqual(Array.from(vm.runInContext('differenceFound', differencesContext)), [1, 4]);

  const memoryContext = languageChangeContext('memory', 'play', {
    renderMemory() { memoryRenderCount++; },
  });
  vm.runInContext('let memoryCards=["A","A"];let memoryMatched=new Set([0]);', memoryContext);
  memoryContext.setLanguage('ru');
  assert.equal(memoryRenderCount, 0);
  assert.deepEqual(Array.from(vm.runInContext('memoryMatched', memoryContext)), [0]);

  let letterContext;
  letterContext = languageChangeContext('letters', 'play', {
    traceLetterGroups: () => Array.from({ length: 12 }, () => ['A', 'B']),
    renderLetterTrace(level) {
      letterRender = { level, index: vm.runInContext('traceLetterIndex', letterContext) };
    },
  });
  letterContext.selectedLevel = 2;
  vm.runInContext('let traceLetterIndex=5;let traceLetterStyle="secondary";', letterContext);
  letterContext.setLanguage('he');
  assert.deepEqual(letterRender, { level: 2, index: 1 });
  assert.equal(vm.runInContext('traceLetterStyle', letterContext), 'secondary');

  let freeDrawLaunches = 0;
  const freeDrawContext = languageChangeContext('coloring', 'play', {
    launchMiniGame() { freeDrawLaunches++; },
  });
  freeDrawContext.setLanguage('ru');
  assert.equal(freeDrawLaunches, 0);
});

test('language changes refresh word-search, magnetic-stage, and letter-style selection screens', () => {
  const cases = [
    ['wordSearch', 'wordSearchLevels', 'renderWordSearchLevels'],
    ['magneticMaze', 'magneticStages', 'renderMagneticMazeStages'],
    ['letters', 'letterStyle', 'renderLetterStyleSelection'],
  ];
  for (const [game, scene, renderer] of cases) {
    let renders = 0;
    const context = languageChangeContext(game, scene, {
      [renderer]() { renders++; },
    });
    context.setLanguage('ru');
    assert.equal(renders, 1, `${game} ${scene} screen refreshes`);
  }
});

test('math exercises render left to right in Hebrew', () => {
  const element = { innerHTML: '' };
  const context = vm.createContext({
    currentLanguage: 'he',
    riddleQuestionIndex: 0,
    selectedLevel: 0,
    MINI_GAMES: [{ id: 'math', name: 'math', icon: '🔢' }],
    createLearningQuestion: () => ({ answer: '12', question: '? + 5 = 12', options: ['12', '7', '17', '5'], promptKey: 'mathPrompt' }),
    learningGameHasTenQuestions: () => false,
    tr: (key) => key,
    $: () => element,
  });
  vm.runInContext(slice('function playLearningGame(id,level){', 'function revealLearningHint(){'), context);
  context.playLearningGame('math', 0);
  assert.match(element.innerHTML, /id="learningQuestion" class="quiz-swatch" dir="ltr"/);
  assert.match(element.innerHTML, />\? \+ 5 = 12<\/div>/);
});

test('memory and differences activities use images that match their titles', async () => {
  const context = vm.createContext({});
  vm.runInContext(slice('const ACTIVITY_NAMES=', 'let selectedMiniGame='), context);
  vm.runInContext(slice('const CATS=', 'const COLORS='), context);
  vm.runInContext(slice('const DIFFERENCE_SCENES=', 'function startDifferences()'), context);
  vm.runInContext(slice('const MEMORY_ICON_SETS=', 'function renderMemory()'), context);
  vm.runInContext('globalThis.testData={ACTIVITY_NAMES,CATS,DIFFERENCE_SCENES,MEMORY_ICON_SETS}', context);

  const { ACTIVITY_NAMES, CATS, DIFFERENCE_SCENES, MEMORY_ICON_SETS } = context.testData;
  const memorySets = MEMORY_ICON_SETS;
  assert.equal(memorySets.length, ACTIVITY_NAMES.en.memory.length);
  assert.deepEqual(Array.from(memorySets, set => set.length), Array(12).fill(6));
  assert.deepEqual(Array.from(memorySets[0]), ['🐶', '🐕', '🐩', '🦮', '🐕‍🦺', '🐾']);
  assert.deepEqual(Array.from(memorySets[1]), ['🦊', '🐻', '🐿️', '🦉', '🦔', '🦝']);
  assert.deepEqual(Array.from(memorySets[2]), ['🐮', '🐷', '🐔', '🐑', '🐐', '🐴']);

  const expectedScenes = ['nature', 'animals', 'food', 'ocean', 'space', 'animals', 'vehicles', 'dino', 'fairy', 'sport', 'nature', 'dragon'];
  assert.deepEqual(Array.from(DIFFERENCE_SCENES), expectedScenes);
  for (const language of ['en', 'he', 'ru']) {
    assert.equal(ACTIVITY_NAMES[language].differences.length, expectedScenes.length);
    assert.match(ACTIVITY_NAMES[language].differences[2], /food|אוכל|едой/i);
  }
  for (const [level, scene] of expectedScenes.entries()) {
    const category = CATS.find(item => item.id === scene);
    assert.ok(category, `missing image category for differences activity ${level + 1}`);
    assert.ok(category.items.length >= 6, `not enough images for differences activity ${level + 1}`);
    for (const imagePath of category.items) {
      assert.match(imagePath, /^images\//);
      await access(new URL(`../${imagePath}`, import.meta.url));
    }
  }
});

test('differences and memory use age-matched counts', () => {
  const difficultySource = slice('const CHILD_AGE_BANDS=', 'function withTimeout(');
  const ageCases = [['6-7', 2, 3], ['8-9', 3, 4], ['10-11', 4, 6]];
  const differenceContext = vm.createContext({
    S: { childAgeBand: '6-7' }, Math, currentLanguage: 'en', selectedLevel: 0,
    $: () => differenceContent, go() {}, tr: key => key, activityNames: () => Array(12).fill('activity'),
    showGameFeedback() {}, launchMiniGame() {}, renderGameLevels() {},
  });
  const differenceContent = { innerHTML: '' };
  vm.runInContext(`${difficultySource}\n${slice('const CATS=', 'const COLORS=')}\n${slice('let differenceFound=', 'const MEMORY_ICON_SETS=')}\nglobalThis.differenceState=()=>({goal:differenceGoal,spots:differenceSpots.length,html:$('#gameContent').innerHTML});`, differenceContext);

  const memoryContext = vm.createContext({
    S: { childAgeBand: '6-7' }, Math, selectedLevel: 0, miniGameScene: 'menu',
    memoryMismatchTimer: null, memoryCards: [], memoryOpen: [], memoryMatched: new Set(),
    $: () => memoryContent, go() {}, tr: key => key, clearTimeout() {},
  });
  const memoryContent = { innerHTML: '' };
  vm.runInContext(`${difficultySource}\n${slice('const MEMORY_ICON_SETS=', 'function flipMemoryCard(')}\nglobalThis.memoryCardCount=()=>memoryCards.length;`, memoryContext);

  for (const [ageBand, differences, pairs] of ageCases) {
    differenceContext.S.childAgeBand = ageBand;
    differenceContext.startDifferences();
    const differenceState = differenceContext.differenceState();
    assert.equal(differenceState.goal, differences);
    assert.equal(differenceState.spots, differences);
    assert.match(differenceState.html, new RegExp(`0 / ${differences}`));

    memoryContext.S.childAgeBand = ageBand;
    memoryContext.renderMemory();
    assert.equal(memoryContext.memoryCardCount(), pairs * 2);
    assert.equal((memoryContent.innerHTML.match(/id="memory\d+"/g) || []).length, pairs * 2);
  }
});

test('word builder letter hints match the age difficulty', () => {
  const context = vm.createContext({ S: { childAgeBand: '6-7' }, currentLanguage: 'en', Math });
  vm.runInContext(`function childDifficultyLevel(ageBand){return {'6-7':1,'8-9':2,'10-11':3}[ageBand]}\n${slice('const WORD_QUESTION_DATA=', 'function getPatternQuestion(')}\nglobalThis.makeWordQuestion=getWordQuestion;`, context);
  for (const [ageBand, difficulty, revealedIndices] of [['6-7', 1, [0, -1]], ['8-9', 2, [0]], ['10-11', 3, []]]) {
    context.S.childAgeBand = ageBand;
    const question = context.makeWordQuestion(0, 0);
    const letters = Array.from(question.answer);
    const expectedHint = letters.map((letter, index) => revealedIndices.includes(index) || revealedIndices.includes(-1) && index === letters.length - 1 ? letter : '_').join(' ');
    assert.equal(question.difficultyLevel, difficulty);
    if (difficulty < 3) assert.equal(question.question.match(/<small>(.*?)<\/small>/)?.[1], expectedHint);
    else assert.doesNotMatch(question.question, /<small>/);
  }
});

test('age-adapted multi-stage games start at stage one for every age band', () => {
  const difficultySource = slice('const CHILD_AGE_BANDS=', 'function withTimeout(');
  const launchSource = slice('function launchMiniGame(id,level){', 'function backFromGame(){');
  const startWordSearchSource = slice('function startWordSearchActivity(', 'function wordSearchStarKey(');
  const ids = ['physicsPaths', 'gridSokoban', 'railwayControl', 'magneticMaze', 'wordSearch'];
  const content = { classList: { remove() {} } };
  const context = vm.createContext({
    S: { childAgeBand: '6-7', allGamesUnlocked: false, vip: false, unlockedGames: [] },
    currentLanguage: 'en', MINI_GAMES: ids.map(id => ({ id })), $: () => content,
    activityNames: () => Array(12).fill('activity'), learningGameHasTenQuestions: () => false,
    restoreMiniGameProgress: (_id, _level, stage) => { context.restoredStage = stage; return false; },
    startInteractivePuzzle: id => { context.startedInteractiveId = id; },
    startMagneticMaze: (...args) => { context.startedMagneticMaze = args; },
    launchWordSearchLevel: (...args) => { context.startedWordSearchStage = args; },
    go() {}, playLearningGame() {},
  });
  vm.runInContext(`${difficultySource}
    let selectedMiniGame=null,selectedLevel=0,miniGameScene='menu',selectedPathLevel=0,selectedBoxLevel=0,selectedRailwayLevel=0,selectedMagneticStage=0,selectedWordSearchLevel=0;
    let learningAnsweredQuestions=new Set();
    function gameUnlocked(){return false}
    ${startWordSearchSource}
    ${launchSource}`, context);

  for (const ageBand of ['6-7', '8-9', '10-11']) {
    context.S.childAgeBand = ageBand;
    ids.forEach(id => {
      context.launchMiniGame(id, 0);
      if (id === 'magneticMaze') assert.deepEqual(Array.from(context.startedMagneticMaze), [0, 0, false]);
      else if (id === 'wordSearch') assert.deepEqual(Array.from(context.startedWordSearchStage), [0, false]);
      else {
        assert.equal(context.restoredStage, undefined);
        assert.equal(context.startedInteractiveId, id);
      }
    });
  }
  assert.doesNotMatch(launchSource, /renderPathLevels|renderSokobanLevels|renderRailwayLevels|renderMagneticMazeStages|renderWordSearchLevels/);
});

test('age-adapted activities advance through five stages before the next activity', () => {
  const stageSource = slice('const AGE_ADAPTED_STAGE_GAMES=', 'function withTimeout(');
  const actions = [];
  const context = vm.createContext({
    tr: (key, values = {}) => key === 'activityStageProgress'
      ? `Stage ${values.n} of ${values.total} complete.`
      : key === 'nextActivityStage' ? 'Next stage' : key,
    gameActivityAdvanceLabel: id => `Next ${id}`,
    advanceGameActivity: id => actions.push(`activity:${id}`),
    startInteractivePuzzle: id => actions.push(`puzzle:${id}`),
    startMagneticMaze: (...args) => actions.push(`magnetic:${args.join(':')}`),
    launchWordSearchLevel: (...args) => actions.push(`wordSearch:${args.join(':')}`),
  });
  vm.runInContext(`${stageSource}
    let selectedPathLevel=0,selectedBoxLevel=0,selectedRailwayLevel=0,selectedMagneticStage=0,selectedWordSearchLevel=0,selectedLevel=2;`, context);
  const ids = ['physicsPaths', 'gridSokoban', 'railwayControl', 'magneticMaze', 'wordSearch'];
  for (const id of ids) {
    actions.length = 0;
    context.setMiniGameStageIndex(id, 0);
    for (let stage = 0; stage < 5; stage++) {
      assert.equal(context.miniGameStageProgress(id), `Stage ${stage + 1} of 5 complete.`);
      context.advanceAgeAdaptedStage(id);
      if (stage < 4) {
        assert.equal(context.miniGameStageIndex(id), stage + 1);
        assert.notEqual(actions.at(-1), `activity:${id}`);
      } else {
        assert.equal(actions.at(-1), `activity:${id}`);
      }
    }
  }
});

test('Paths gives ages 6-7 ten extra turns while keeping five stages at one difficulty', () => {
  const constants = slice('const PATH_LEVEL_CELL_COUNTS=', 'function codeBreakerSettings()');
  const setup = slice('function setupPathPuzzle(){', 'function buildProgressivePath(');
  const builder = slice('function buildProgressivePath(', 'function pathLevelStarKey(');
  const context = vm.createContext({
    S: { childAgeBand: '6-7' }, selectedLevel: 0, selectedPathLevel: 0, interactivePuzzle: {},
    childDifficultyLevel: ageBand => ({ '6-7': 1, '8-9': 2, '10-11': 3 })[ageBand],
  });
  vm.runInContext(`${constants}\n${setup}\n${builder}`, context);
  for (const [ageBand, difficulty, size] of [['6-7', 1, 4], ['8-9', 2, 6], ['10-11', 3, 8]]) {
    context.S.childAgeBand = ageBand;
    const routes = new Set(), routeLengths = new Set();
    for (let stage = 0; stage < 5; stage++) {
      context.selectedPathLevel = stage;
      context.interactivePuzzle = {};
      context.setupPathPuzzle();
      const puzzle = context.interactivePuzzle;
      const baselineTurns = puzzle.rotations.reduce((sum, turns) => sum + (4 - turns) % 4, 0)
        + Math.max(2, Math.ceil(puzzle.route.length * 0.12));
      assert.equal(puzzle.difficultyLevel, difficulty);
      assert.equal(puzzle.size, size);
      assert.equal(puzzle.maxTurns, baselineTurns + (difficulty === 1 ? 10 : 0));
      routes.add(JSON.stringify([Array.from(puzzle.route), Array.from(puzzle.rotations)]));
      routeLengths.add(puzzle.route.length);
    }
    assert.equal(routeLengths.size, 1);
      assert.equal(routes.size, 5);
  }
});

test('Sokoban, Railway, and Magnetic Maze use age difficulty for all five stages', () => {
  const sokobanSource = slice('function setupSokobanPuzzle(){', 'function setupCodeBreaker(){');
  const railwaySource = slice('const RAILWAY_COLOR_VALUES=', 'function toggleRailwaySwitch(');
  const mazeSource = slice('function startMagneticMaze(', 'function magneticMazeMagnet(');
  const context = vm.createContext({
    S: { childAgeBand: '6-7', completedPuzzleStars: [] },
    AGE_ADAPTED_STAGE_COUNT: 5,
    selectedLevel: 0, selectedBoxLevel: 0, selectedRailwayLevel: 0, selectedMagneticStage: 0,
    selectedMiniGame: '', miniGameScene: '', interactivePuzzle: {}, magneticMaze: null,
    childDifficultyLevel: ageBand => ({ '6-7': 1, '8-9': 2, '10-11': 3 })[ageBand],
    restoreMiniGameProgress: () => false, renderMagneticMaze() {}, go() {},
  });
  vm.runInContext(`${sokobanSource}\n${railwaySource}\n${mazeSource}`, context);
  for (const [ageBand, difficulty, boxSize, mazeSize, trainCount] of [
    ['6-7', 1, 6, 5, 1], ['8-9', 2, 8, 7, 3], ['10-11', 3, 10, 9, 5],
  ]) {
    context.S.childAgeBand = ageBand;
    const simpleRailRoutes = new Set(), mazeHoleCounts = new Set();
    for (let stage = 0; stage < 5; stage++) {
      context.selectedBoxLevel = stage;
      context.interactivePuzzle = {};
      context.setupSokobanPuzzle();
      assert.equal(context.interactivePuzzle.difficultyLevel, difficulty);
      assert.equal(context.interactivePuzzle.size, boxSize);

      context.selectedRailwayLevel = stage;
      context.interactivePuzzle = {};
      context.setupRailwayPuzzle();
      assert.equal(context.interactivePuzzle.difficultyLevel, difficulty);
      assert.equal(context.interactivePuzzle.trainCount, trainCount);
      if (trainCount === 1) simpleRailRoutes.add(JSON.stringify(context.interactivePuzzle.routes[0].path));

      context.startMagneticMaze(0, stage, false);
      assert.equal(context.magneticMaze.difficultyLevel, difficulty);
      assert.equal(context.magneticMaze.size, mazeSize);
      mazeHoleCounts.add(context.magneticMaze.holes.size);
    }
    if (trainCount === 1) assert.equal(simpleRailRoutes.size, 5);
    assert.equal(mazeHoleCounts.size, 1);
  }
});

test('saved stage progress resumes only at a valid stage matching the child age', () => {
  const stageSource = slice('const AGE_ADAPTED_STAGE_GAMES=', 'function withTimeout(');
  const progressSource = slice('function miniGameProgressStage(', 'function captureMiniGameState(');
  const context = vm.createContext({
    S: { childAgeBand: '6-7' },
    childDifficultyLevel: ageBand => ({ '6-7': 1, '8-9': 2, '10-11': 3 })[ageBand],
  });
  vm.runInContext(`${stageSource}\n${progressSource}`, context);
  const savedPath = { selectedPathLevel: 4, interactivePuzzle: { difficultyLevel: 1 } };
  assert.equal(context.miniGameProgressMatchesAge('physicsPaths', savedPath), true);
  context.S.childAgeBand = '8-9';
  assert.equal(context.miniGameProgressMatchesAge('physicsPaths', savedPath), false);
  assert.equal(context.miniGameProgressMatchesAge('physicsPaths', {
    selectedPathLevel: 5, interactivePuzzle: { difficultyLevel: 2 },
  }), false);
});

test('magnetic maze play screen omits the stage and difficulty label', () => {
  const content = { innerHTML: '' };
  const context = vm.createContext({
    magneticMaze: { size: 5, ball: 0, goal: 24, holes: new Set(), walls: new Set(), finished: false, won: false, status: '', magnetSide: 'east', magnetSlot: 0 },
    currentLanguage: 'en',
    selectedLevel: 0,
    activityNames: () => ['Activity'],
    magneticMazeMovePreview: () => '→',
    renderAgeAdaptedStageBanner: () => '',
    $: () => content,
    tr: key => key,
  });
  vm.runInContext(slice('function renderMagneticMaze(){', 'const PATH_LEVEL_CELL_COUNTS='), context);
  context.renderMagneticMaze();
  assert.match(content.innerHTML, /<h2>magneticMaze - Activity<\/h2>/);
  assert.match(content.innerHTML, /class="magnet-maze"/);
  assert.doesNotMatch(content.innerHTML, /magneticStageLabel|magneticDifficulty|<h3>/);
});

test('magnetic maze stage choices keep labels hidden and expose five accessible stages', () => {
  const content = { innerHTML: '' };
  const context = vm.createContext({
    currentLanguage: 'en',
    selectedLevel: 0,
    AGE_ADAPTED_STAGE_COUNT: 5,
    S: { completedPuzzleStars: [] },
    activityNames: () => ['Activity'],
    magneticMazeStageIsUnlocked: stage => stage === 0,
    magneticMazeStarKey: (_, stage) => `stage-${stage}`,
    $: () => content,
    tr: (key, values = {}) => key === 'activityStageLabel' ? `Stage ${values.n} of ${values.total}` : key,
  });
  vm.runInContext(slice('function renderMagneticMazeStages(){', 'function startMagneticMaze('), context);
  context.renderMagneticMazeStages();
  const buttons = Array.from(content.innerHTML.matchAll(/<button class="level-choice[^"]*"[^>]*>([\s\S]*?)<\/button>/g), match => match[1]);
  assert.equal(buttons.length, 5);
  for (const buttonText of buttons) assert.doesNotMatch(buttonText, /Stage \d|Easy|Medium|Hard|Expert/);
  assert.match(content.innerHTML, /aria-label="Stage 1 of 5"/);
});

test('welcome screen exposes an accessible music toggle that tracks mute state', () => {
  const welcome = slice('<div id="welcome"', '<header id="top"');
  assert.match(html, /\.welcome-controls\{[^}]*align-self:center/);
  assert.match(welcome, /id="welcomeSndBtn"[^>]*onclick="toggleMusic\(\)"/);
  assert.match(welcome, /id="welcomeSndBtn"[^>]*aria-pressed="true"[^>]*data-i18n-aria="musicToggle"/);

  const buttons = new Map([
    ['#sndBtn', { setAttribute(name, value) { this[name] = value; } }],
    ['#welcomeSndBtn', { setAttribute(name, value) { this[name] = value; } }],
  ]);
  const context = vm.createContext({ S: { music: false }, $: (selector) => buttons.get(selector) });
  vm.runInContext(slice('function musicOn()', 'function applyMusic()'), context);
  context.updateMusicButtons();
  for (const button of buttons.values()) {
    assert.equal(button.textContent, '🔇');
    assert.equal(button['aria-pressed'], false);
  }
});

test('each Surprise me selection changes the track and automatic screen tracks still work', () => {
  const context = vm.createContext({
    S: { music: true, track: 'auto' },
    $: () => null,
    sv: () => {},
    toast: () => {},
    tr: key => key,
    Snd: { unlocked: false, play(track) { context.playedTrack = track; }, stop() {} },
  });
  vm.runInContext(slice('const SOUND_OPTS=', 'const Snd=(()=>{'), context);
  vm.runInContext(slice('function musicOn()', 'function updateMusicButtons()'), context);
  vm.runInContext(slice('function pickSound(', 'function setVol('), context);
  context.renderSound = () => {};
  context.applyMusic = () => { context.playedTrack = context.trackFor(); };
  vm.runInContext("curScreen='profile'", context);
  assert.equal(context.trackFor(), 'lullaby');

  const selectedTracks = [];
  for (let click = 0; click < 5; click++) {
    const previousTrack = context.trackFor();
    context.pickSound('auto');
    const nextTrack = context.trackFor();
    assert.notEqual(nextTrack, previousTrack);
    assert.ok(['groove', 'lullaby', 'jungle', 'space', 'chip'].includes(nextTrack));
    selectedTracks.push(nextTrack);
  }
  assert.ok(selectedTracks.every(track => track !== 'auto' && track !== 'off'));

  vm.runInContext("curScreen='games'", context);
  assert.equal(context.trackFor(), 'chip');
});

test('level labels include the full requested Russian wording', async () => {
  const context = vm.createContext({});
  vm.runInContext(await readFile(new URL('../question-banks/science.js', import.meta.url), 'utf8'), context);
  assert.ok(context.AGE_QUESTION_BANKS.scienceQuest.titles.ru['6-7'].includes('Животные и их среда обитания'));
  assert.match(html, /Школьные принадлежности/);
  assert.match(html, /Музыкальные инструменты/);
  assert.match(html, /\.level-choice\{[^}]*overflow-wrap:anywhere/);
  assert.match(html, /\.play-status:empty\{display:none\}/);
});

test('Russian science activity label and first garden question use the requested text', () => {
  assert.match(html, /name\.replace\('Приспособление','Приспособле<wbr>ние'\)/);
  assert.match(html, /aria-label="\$\{paid\?'🔒 ':''\}\$\{name\}"/);
  assert.match(html, /Какое насекомое в саду питается тлей\?/);
  assert.doesNotMatch(html, /Какое маленькое садовое животное может поедать тлю с листьев\?/);
});

test('Russian riddle title is exact and does not split awkwardly', async () => {
  const context = vm.createContext({});
  for (const file of ['riddles-6-7.js', 'riddles-8-9.js', 'riddles-10-11.js']) {
    vm.runInContext(await readFile(new URL(`../question-banks/${file}`, import.meta.url), 'utf8'), context);
  }
  assert.equal(context.AGE_QUESTION_BANKS.riddles.titles.ru['8-9'][4], 'Транспорт');
  assert.match(html, /\.level-choice\.riddle-explorer-level\{[^}]*overflow-wrap:normal;word-break:normal/);
  assert.match(html, /game\.id==='riddles'&&currentLanguage==='ru'&&i===4\?' riddle-explorer-level'/);
});

test('legacy activity names remain paired with their built-in fallback questions', () => {
  const context = vm.createContext({});
  vm.runInContext(`${slice('const ACTIVITY_NAMES=', 'let selectedMiniGame=')}\nglobalThis.names=ACTIVITY_NAMES;`, context);
  const firstAndLast = {
    en: { math:['Two-Digit Addition','Multiply and Add'],storyMath:['Pencil Box','Picnic Balloons'],riddles:['Riddle Trail','Riddle Master'],scienceQuest:['Plant Clues','Sound Detective'] },
    he: { math:['חיבור דו-ספרתי','כפל וחיבור'],storyMath:['קלמר העפרונות','בלונים לפיקניק'],riddles:['שביל החידות','אלופי החידות'],scienceQuest:['רמזי הצמח','בלשי הצלילים'] },
    ru: { math:['Двузначное сложение','Умножение и сложение'],storyMath:['Карандаши в пенале','Шары для пикника'],riddles:['Тропа загадок','Мастер загадок'],scienceQuest:['Подсказки о растении','Детектив звуков'] },
  };
  for (const language of ['en', 'he', 'ru']) for (const [game, expected] of Object.entries(firstAndLast[language])) {
    const actual = Array.from(context.names[language][game]);
    assert.equal(actual.length, 12, `${language} ${game} retains 12 legacy activities`);
    assert.deepEqual([actual[0], actual.at(-1)], expected, `${language} ${game} keeps its fallback labels`);
  }
});

test('DOCX question banks cover each age with localized prompts and valid answers', async () => {
  const context = vm.createContext({
    S: { childAgeBand: '6-7' },
    currentLanguage: 'he',
    Math,
    makeChoices(answer, min, max) {
      const choices = [answer];
      for (let value = min; choices.length < 4 && value <= max; value++) {
        if (value !== answer) choices.push(value);
      }
      return choices;
    },
  });
  const bankFiles = ['math.js', 'story-math.js', 'riddles-6-7.js', 'riddles-8-9.js', 'riddles-10-11.js', 'escape-room-6-7.js', 'escape-room-8-9.js', 'escape-room-10-11.js', 'science.js'];
  for (const file of bankFiles) {
    vm.runInContext(await readFile(new URL(`../question-banks/${file}`, import.meta.url), 'utf8'), context);
  }
  const banks = context.AGE_QUESTION_BANKS;
  assert.ok(banks);
  assert.equal(Object.keys(banks).length, 4);
  const approvedSubtractionQuestions = {
    '6-7':[
      ['12 − 5 = ___','7'],['13 − 6 = ___','7'],['14 − 8 = ___','6'],['15 − 7 = ___','8'],['16 − 9 = ___','7'],
      ['13 − 5 = ___','8'],['11 − 6 = ___','5'],['17 − 8 = ___','9'],['12 − 7 = ___','5'],['18 − 9 = ___','9'],
    ],
    '8-9':[
      ['31 − 16 = ___','15'],['43 − 27 = ___','16'],['62 − 38 = ___','24'],['75 − 49 = ___','26'],['54 − 28 = ___','26'],
      ['86 − 57 = ___','29'],['90 − 46 = ___','44'],['70 − 34 = ___','36'],['65 − 29 = ___','36'],['82 − 47 = ___','35'],
    ],
    '10-11':[
      ['324 − 158 = ___','166'],['502 − 267 = ___','235'],['731 − 486 = ___','245'],['640 − 275 = ___','365'],['903 − 478 = ___','425'],
      ['815 − 397 = ___','418'],['700 − 386 = ___','314'],['562 − 278 = ___','284'],['1000 − 648 = ___','352'],['804 − 569 = ___','235'],
    ],
  };
  for (const [age, expected] of Object.entries(approvedSubtractionQuestions)) {
    const actual = banks.math.levels[age][5].map(row => [row.q.he, row.a.he]);
    assert.deepEqual(JSON.parse(JSON.stringify(actual)), expected, `approved subtraction questions for age ${age}`);
  }
  const namesContext = vm.createContext({ S: { childAgeBand: '6-7' }, AGE_QUESTION_BANKS: banks });

  vm.runInContext(slice('function getRussianCountedItem(', 'function getWordQuestion('), context);
  vm.runInContext(slice('const SCIENCE_QUESTION_DATA=', 'function getScienceQuestion('), context);
  vm.runInContext(slice('function getScienceQuestion(', 'const LEGACY_SCIENCE_QUESTIONS='), context);
  vm.runInContext(`${slice('const RIDDLE_QUESTION_DATA=', 'function getRiddleQuestion(')}\nglobalThis.legacyRiddleData=RIDDLE_QUESTION_DATA;`, context);
  vm.runInContext(slice('function getRiddleQuestion(', 'const DRAWING_IDEAS='), context);
  const activityNamesStart = html.indexOf('const ACTIVITY_NAMES=');
  const activityNamesEnd = html.indexOf('\n};', activityNamesStart) + 3;
  assert.ok(activityNamesStart >= 0 && activityNamesEnd > activityNamesStart);
  vm.runInContext(html.slice(activityNamesStart, activityNamesEnd), namesContext);
  vm.runInContext(`${slice('function activityNames(id,language){', 'function activityCount(')}\nglobalThis.activityNames=activityNames;`, namesContext);

  const games = {
    math: { count: 12, get: 'getMathQuestion', question: result => result.question },
    storyMath: { count: 12, get: 'getStoryMathQuestion', question: (result, language) => result.question[language] },
    riddles: { count: 12, get: 'getRiddleQuestion', question: (result, language) => result.clue[language] },
    scienceQuest: { count: 12, get: 'getScienceQuestion', question: (result, language) => result.question[language] },
  };
  for (const age of ['6-7', '8-9', '10-11']) {
    context.S.childAgeBand = age;
    namesContext.S.childAgeBand = age;
    for (const [id, spec] of Object.entries(games)) {
      const bank = banks[id], topics = bank.levels[age];
      assert.equal(topics.length, 12, `${id} activity indices for age ${age}`);
      const nameCount = spec.count;
      assert.equal(bank.titles.he[age].length, nameCount, `${id} Hebrew titles for age ${age}`);
      assert.equal(bank.titles.en[age].length, nameCount, `${id} English titles for age ${age}`);
      assert.equal(bank.titles.ru[age].length, nameCount, `${id} Russian titles for age ${age}`);
      for (let bankActivity = 0; bankActivity < topics.length; bankActivity++) {
        const topic = topics[bankActivity];
        if (topic === null) {
          assert.equal(id, 'riddles');
          assert.equal(age, '10-11');
          assert.equal(bankActivity, 8);
          continue;
        }
        assert.equal(topic.length, 10, `${id} activity ${bankActivity}, age ${age}`);
        const activity = bankActivity;
        for (let question = 0; question < topic.length; question++) {
          const row = topic[question];
          if (row === null) {
            assert.equal(id, 'riddles');
            assert.equal(age, '6-7');
            continue;
          }
          for (const language of ['he', 'en', 'ru']) {
            assert.ok(row.q[language].trim(), `${id} prompt ${age}/${activity}/${question}/${language}`);
            assert.ok(row.a[language].trim(), `${id} answer ${age}/${activity}/${question}/${language}`);
            context.currentLanguage = language;
            const result = context[spec.get](activity, question);
            const numericAnswer = id === 'math' || id === 'storyMath';
            const answer = numericAnswer ? String(Number(row.a.en)) : row.a[language];
            const resultAnswer = numericAnswer ? result.answer : result.answer[language];
            const options = id === 'riddles' || id === 'scienceQuest' ? result.choices[language] : result.options;
            assert.equal(spec.question(result, language), row.q[language], `${id} prompt selected for age ${age}/${language}`);
            assert.equal(String(resultAnswer), answer, `${id} answer selected for age ${age}/${language}`);
            assert.equal(options.length, 4);
            assert.equal(new Set(options).size, 4);
            assert.ok(options.includes(answer));
          }
        }
      }
      for (const language of ['he', 'en', 'ru']) {
        const names = namesContext.activityNames(id, language);
        assert.equal(names.length, 12);
        bank.titles[language][age].forEach((title, index) => {
          const activity = index;
          if (id === 'math') assert.doesNotMatch(title, /[()]/, `concise math title ${age}/${language}/${index}`);
          if (typeof title === 'string') assert.equal(names[activity], title, `${id} activity title ${age}/${language}/${index}`);
        });
      }
      if (id === 'math') assert.equal(namesContext.activityNames(id, 'he')[5], 'חיסור מעבר לעשר');
    }
  }
  assert.equal(banks.riddles.levels['10-11'][8], null);
  assert.match(banks.riddles.levels['10-11'][9][9].q.he, /שלושה מתגים/);
  context.S.childAgeBand = '10-11';
  context.currentLanguage = 'he';
  namesContext.S.childAgeBand = '10-11';
  assert.equal(namesContext.activityNames('riddles', 'he')[8], 'אתגר הרמזים');
  assert.equal(context.getRiddleQuestion(8, 0).clue.he, context.legacyRiddleData[8][0][1]);
  context.currentLanguage = 'en';
  assert.match(context.getMathQuestion(5, 0).question, /\d+ − \d+/);
});

test('level-three switch riddle has localized, distinct correct choices in all languages', () => {
  const context = vm.createContext({ S: { childAgeBand: '10-11' }, currentLanguage: 'en', Math });
  vm.runInContext(slice('function getRussianCountedItem(', 'function getMathQuestion('), context);
  vm.runInContext(`${slice('const RIDDLE_QUESTION_DATA=', 'const DRAWING_IDEAS=')}\nglobalThis.getRiddleQuestion=getRiddleQuestion;`, context);
  for (const language of ['en', 'he', 'ru']) {
    context.currentLanguage = language;
    const result = context.getRiddleQuestion(9, 9);
    assert.match(result.clue, language === 'he' ? /שלושה מתגים/ : language === 'ru' ? /три выключателя/ : /three switches/i);
    assert.equal(result.choices.length, 4);
    assert.equal(new Set(result.choices).size, 4);
    assert.ok(result.choices.includes(result.answer));
    assert.match(result.answer, language === 'he' ? /חמה/ : language === 'ru' ? /тёплая/ : /warm/i);
  }
});

test('bee-pollen question is clear in all languages and keeps the correct answer', () => {
  const scienceQuestions = slice('const SCIENCE_QUESTION_DATA=', 'const SCIENCE_ACTIVITY_DATA=');
  assert.match(scienceQuestions, /\['What do bees carry from one flower to another\?','מה דבורים מעבירות מפרח אחד לפרח אחר\?','Что пчёлы переносят с одного цветка на другой\?'[\s\S]*?'Pollen','אבקה','Пыльца'\]/);
});

test('code-breaker opens one animated rules screen before activity selection in every language', () => {
  const intro = slice('function selectMiniGame(', 'function renderGameLevels(){');
  assert.match(intro, /code-demo-video/);
  assert.match(intro, /codeDemoGuessOne/);
  assert.match(intro, /codeDemoGuessTwo/);
  assert.match(intro, /codeDemoGuessThree/);
  assert.match(intro, /codeDemoRulesTitle/);
  assert.match(intro, /codeDemoRuleCode/);
  assert.match(intro, /codeDemoRuleGuesses/);
  assert.match(intro, /codeDemoRuleClues/);
  assert.match(intro, /onclick="continueCodeBreakerIntro\(\)"/);
  assert.match(html, /@keyframes code-demo-scene/);
  assert.match(html, /@keyframes code-demo-progress/);
  assert.doesNotMatch(html, /codeTutorialM|openCodeTutorial|codeHowTo/);
  for (const language of ['en', 'he', 'ru']) {
    const translation = textForLanguage(language);
    for (const key of ['codeDemoTitle', 'codeDemoVideoLabel', 'codeDemoRulesTitle', 'codeDemoRuleCode', 'codeDemoRuleGuesses', 'codeDemoRuleClues', 'codeDemoGotIt']) {
      assert.ok(translation[key], `${language} missing ${key}`);
    }
  }
  assert.equal(textForLanguage('he').codeDemoReadClues, 'בדקו את הרמזים: צבע במקום הנכון, צבע נכון במקום אחר, או צבע לא נכון.');
  assert.match(textForLanguage('en').codeDemoReadClues, /incorrect color/);
  assert.match(textForLanguage('ru').codeDemoReadClues, /неверный цвет/);

  const displayed = [];
  const context = vm.createContext({
    MINI_GAMES: [{ id: 'codeBreaker' }, { id: 'memory' }],
    $: () => ({ classList: { remove() {} }, innerHTML: '' }),
    tr: (key) => key,
    codeBreakerSettings: () => ({ pegs: 4, colors: [0, 1, 2, 3, 4, 5], attempts: 8 }),
    INTERACTIVE_CODE_COLORS: ['🔴', '🟠', '🟡', '🟢', '🔵', '🟣'],
    go() {},
    renderGameLevels: () => displayed.push('activities'),
  });
  vm.runInContext(`let selectedMiniGame='',miniGameScene='';
    ${intro}`, context);
  context.selectMiniGame('codeBreaker');
  assert.equal(vm.runInContext('miniGameScene', context), 'codeIntro');
  assert.equal(displayed.length, 0);
  context.continueCodeBreakerIntro();
  assert.equal(vm.runInContext('miniGameScene', context), 'levels');
  assert.deepEqual(displayed, ['activities']);
});

test('interactive puzzle results use a blocking popup with a game-specific action', () => {
  const renderer = slice('function renderInteractivePuzzle(){', 'function showInteractiveHint(){');
  assert.match(renderer, /showGameFeedback\(`\$\{tr\('correct'\)\}/);
  assert.match(renderer, /continueLabel,continueInteractivePuzzle,true/);
  assert.match(renderer, /showGameFeedback\(interactivePuzzle\.feedback,tr\('puzzleRetry'\)/);
  assert.match(html, /id="gameFeedbackM" role="dialog" aria-modal="true"/);
});

test('age-adapted puzzle completion reports the current stage out of five', () => {
  const gameContent = { innerHTML: '', classList: { toggle() {} } };
  const feedback = [];
  const context = vm.createContext({
    interactivePuzzle: {
      id: 'railwayControl', rows: 1, columns: 1, routes: [], trains: [], switches: [], trackTiles: [],
      trainCount: 1, feedback: '', hint: '', finished: true, moving: false,
      won: true, newStar: true, successKey: 'railwayWin',
    },
    MINI_GAMES: [{ id: 'railwayControl', name: 'railwayControl' }],
    S: { childAgeBand: '6-7' },
    isAgeAdaptedStageGame: id => id === 'railwayControl',
    miniGameStageProgress: () => 'Stage 3 of 5 complete.',
    miniGameStageContinueLabel: () => 'Next stage',
    renderAgeAdaptedStageBanner: () => '',
    interactiveGamePrompt: () => 'instruction',
    gameActivityAdvanceLabel: () => 'Next activity',
    continueInteractivePuzzle() {},
    showGameFeedback: message => feedback.push(message),
    tr: key => key === 'railwayProgress' ? 'השלמתם את שלב 1 מתוך 5.' : key,
    $: selector => selector === '#gameContent' ? gameContent : selector === '#gameStage' ? { scrollTop: 0 } : null,
  });
  vm.runInContext(slice('function renderInteractivePuzzle(){', 'function showInteractiveHint(){'), context);
  context.renderInteractivePuzzle();
  assert.equal(feedback.length, 1);
  assert.match(feedback[0], /railwayWin/);
  assert.match(feedback[0], /Stage 3 of 5 complete/);
});

test('stage banner enables completed and saved stages while locking future stages', () => {
  const stageSource = slice('const AGE_ADAPTED_STAGE_GAMES=', 'function withTimeout(');
  const miniGameProgress = new Map([['physicsPaths:0:stage-1', { savedAt: 1 }]]);
  const started = [];
  const context = vm.createContext({
    selectedPathLevel: 2, selectedBoxLevel: 0, selectedRailwayLevel: 0,
    selectedMagneticStage: 0, selectedWordSearchLevel: 0, selectedLevel: 0,
    S: { completedPuzzleStars: ['physicsPaths:0:path-0'] },
    miniGameProgress,
    miniGameProgressKey: (id, activity, stage) => `${id}:${activity}:stage-${stage}`,
    saveMiniGameProgress() {
      miniGameProgress.set(`physicsPaths:0:stage-${context.selectedPathLevel}`, { savedAt: 2 });
    },
    restoreMiniGameProgress(id, level, stage) {
      if (stage !== 1) return false;
      context.selectedPathLevel = stage;
      return true;
    },
    startInteractivePuzzle: id => started.push([id, context.selectedPathLevel]),
    tr: (key, values = {}) => ({
      activityStagesProgress: `Completed ${values.completed} of ${values.total}`,
      activityStageLabel: `Stage ${values.n} of ${values.total}`,
      activityStageDone: 'completed',
      activityStageCurrent: 'current',
      activityStageSaved: 'saved',
      activityStageLocked: 'locked',
    })[key],
  });
  vm.runInContext(stageSource, context);

  const initialBanner = context.renderAgeAdaptedStageBanner('physicsPaths');
  const initialButtons = Array.from(initialBanner.matchAll(/<button\b[^>]*>/g), match => match[0]);
  assert.equal(initialButtons.length, 5);
  assert.match(initialButtons[0], /completed/);
  assert.match(initialButtons[0], /openAgeAdaptedStage\('physicsPaths',0\)/);
  assert.match(initialButtons[1], /saved/);
  assert.match(initialButtons[1], /openAgeAdaptedStage\('physicsPaths',1\)/);
  assert.match(initialButtons[2], /aria-current="step"/);
  assert.match(initialButtons[2], /disabled/);
  assert.match(initialButtons[3], /locked/);
  assert.match(initialButtons[3], /disabled/);

  context.openAgeAdaptedStage('physicsPaths', 0);
  assert.equal(context.selectedPathLevel, 0);
  assert.equal(miniGameProgress.has('physicsPaths:0:stage-2'), true);
  assert.deepEqual(started, [['physicsPaths', 0]]);
  context.openAgeAdaptedStage('physicsPaths', 1);
  assert.equal(context.selectedPathLevel, 1);
  assert.deepEqual(started, [['physicsPaths', 0]]);
  context.openAgeAdaptedStage('physicsPaths', 4);
  assert.equal(context.selectedPathLevel, 1);
});

test('railway movement keeps the displayed track while following the connected path', () => {
  const originalPath = [
    { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 },
  ];
  const connectedPath = [
    { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 2, y: 0 },
  ];
  const puzzle = {
    finished: false,
    moving: false,
    trackTiles: [{ rotation: 1 }],
    routes: [{ path: originalPath, source: originalPath[0], target: originalPath[3] }],
    trains: [{ status: 'queued', step: 0, position: originalPath[0], target: originalPath[3], direction: 'down' }],
    trainCount: 1,
  };
  let tick;
  const context = vm.createContext({
    interactivePuzzle: puzzle,
    tr: key => key,
    renderInteractivePuzzle() {},
    findConnectedRailwayPath: () => connectedPath,
    setInterval(callback) { tick = callback; return 1; },
    clearInterval() {},
  });
  vm.runInContext(slice('function advanceRailwayTrains(){', 'function findConnectedRailwayPath('), context);
  vm.runInContext(slice('function railwayPositionFor(', 'function rotateConnectorMask('), context);

  context.advanceRailwayTrains();

  assert.deepEqual(JSON.parse(JSON.stringify(puzzle.routes[0].path)), originalPath);
  assert.deepEqual(JSON.parse(JSON.stringify(puzzle.trains[0].path)), [
    originalPath[0], ...connectedPath, originalPath[3],
  ]);
  assert.equal(puzzle.trackTiles[0].rotation, 1);
  tick();
  tick();
  assert.deepEqual(JSON.parse(JSON.stringify(puzzle.trains[0].position)), { x: 1, y: 1 });
});

test('all other mini games have localized animated demos and continue to activity selection', () => {
  const dataStart = html.indexOf('const MINI_GAME_INTRO_COPY=');
  const dataEnd = html.indexOf("let currentLanguage='en';", dataStart);
  assert.ok(dataStart >= 0 && dataEnd > dataStart);
  const dataContext = vm.createContext({});
  vm.runInContext(`${html.slice(dataStart, dataEnd)}
    globalThis.introCopy=MINI_GAME_INTRO_COPY;
    globalThis.introVisuals=MINI_GAME_INTRO_VISUALS;`, dataContext);
  const ids = Object.keys(dataContext.introCopy.en);
  assert.equal(ids.length, 17);
  for (const language of ['en', 'he', 'ru']) {
    assert.deepEqual(Object.keys(dataContext.introCopy[language]).sort(), ids.slice().sort(), `${language} game demos`);
    for (const id of ids) {
      assert.equal(dataContext.introCopy[language][id].length, 5, `${language}:${id} copy`);
      assert.ok(dataContext.introCopy[language][id].every(Boolean), `${language}:${id} empty copy`);
    }
  }
  for (const id of ids) {
    if (id === 'logicQuest') continue;
    assert.equal(dataContext.introVisuals[id].length, 3, `${id} demo scenes`);
    assert.ok(dataContext.introVisuals[id].every((scene) => scene.length >= 4), `${id} demo visuals`);
  }
  for (const [language, copy] of Object.entries(dataContext.introCopy)) {
    assert.match(copy.escapeRoom[1], /code|קוד|код/i, `${language} explains collecting a code part`);
    assert.match(copy.escapeRoom[3], /code|קוד|код/i, `${language} explains that stations reveal code parts`);
    assert.match(copy.escapeRoom[4], /3|4/, `${language} explains entering the age-based number of code parts`);
    assert.match(copy.puzzle[1], /swap|להחליף|поменять/i, `${language} explains swapping puzzle pieces`);
    assert.doesNotMatch(copy.logicQuest[4], /three|שלוש|три/i, `${language} describes a variable number of logic clues`);
    assert.match(copy.words[3], /answer choices|אפשרויות מציגות|варианты ответа/i, `${language} explains the word choices`);
    assert.match(copy.wordSearch[4], /neighboring|סמוכות|соседние/i, `${language} explains selecting neighboring letters`);
  }
  assert.equal(dataContext.introVisuals.puzzle[0].length, 6, 'puzzle demo shows six pieces rather than an empty-space sliding puzzle');
  assert.ok(dataContext.introVisuals.puzzle[1].includes('↔️'), 'puzzle demo shows the actual swap action');
  assert.deepEqual(Array.from(dataContext.introVisuals.words[0].slice(0, 3)), ['T', 'C', 'A'], 'word builder demo starts with scrambled letters');
  assert.ok(dataContext.introVisuals.words[1].includes('CAT'), 'word builder demo shows answer choices');
  assert.ok(dataContext.introVisuals.wordSearch[0].includes('📋') && dataContext.introVisuals.wordSearch[0].includes('CAT'), 'word-search demo shows a word list beside the letter grid');
  assert.ok(dataContext.introVisuals.escapeRoom[1].includes('🔢'), 'demo shows the collected code parts');
  assert.ok(dataContext.introVisuals.escapeRoom[2].includes('🔐'), 'demo shows the exit lock');
  assert.ok(dataContext.introVisuals.escapeRoom[2].includes('🚪'), 'demo shows the exit opening');
  assert.match(html, /\.game-demo-frame\.escape-room-final \.game-demo-board\{width:min\(100%,160px\)/);
  assert.match(html, /game\.id==='escapeRoom'&&index===2\?' escape-room-final':''/);
  assert.match(html, /@keyframes game-demo-scene-one\{0%,30%\{opacity:1/);
  assert.match(html, /@keyframes game-demo-scene-two\{0%,32%\{opacity:0/);
  assert.match(html, /@keyframes game-demo-scene-three\{0%,66%\{opacity:0/);
  assert.match(html, /\.game-demo-frame\{[^}]*animation:game-demo-scene-one 9s linear infinite both/);
  assert.match(html, /\.game-demo-video:after\{[^}]*animation:code-demo-progress 9s linear infinite/);
  assert.doesNotMatch(html, /\.game-demo-frame:nth-child\(2\)\{animation-delay|\.game-demo-frame:nth-child\(3\)\{animation-delay/);
  assert.match(html, /@keyframes code-demo-scene/);
  assert.match(html, /@keyframes demo-token-pop/);

  const container = { innerHTML: '', classList: { remove() {} } };
  const selected = [];
  const miniGames = [...ids, 'coloring'].map((id) => ({ id, icon: '🎮', name: id }));
  const context = vm.createContext({
    MINI_GAMES: miniGames,
    MINI_GAME_INTRO_COPY: dataContext.introCopy,
    MINI_GAME_INTRO_VISUALS: dataContext.introVisuals,
    logicQuestIntroVisuals: () => [['🌱', '🌷', '🐝'], ['🌱', '➡️', '🌷', '🐝', '➡️', '🌞'], ['🌱', '🌷', '🐝', '✅']],
    currentLanguage: 'en',
    $: () => container,
    tr: (key) => key,
    go() {},
    renderGameLevels: () => selected.push('levels'),
  });
  const selectionSource = slice('function selectMiniGame(', 'function renderGameLevels(){');
  vm.runInContext(`let selectedMiniGame='',miniGameScene='';
    ${selectionSource}`, context);
  context.selectMiniGame('coloring');
  assert.equal(vm.runInContext('miniGameScene', context), 'levels', 'coloring opens directly to category selection');
  assert.equal(selected.length, 1, 'coloring renders its category selection');
  for (const id of ids) {
    context.selectMiniGame(id);
    assert.equal(vm.runInContext('miniGameScene', context), 'gameIntro', `${id} intro scene`);
    assert.match(container.innerHTML, new RegExp(`onclick="continueMiniGameIntro\\(\\)"`), `${id} continue button`);
    assert.match(container.innerHTML, new RegExp(dataContext.introCopy.en[id][3]));
    context.continueMiniGameIntro();
  }
  assert.equal(selected.length, ids.length + 1);
});

test('word search size, word count, and directions match each age band', () => {
  const engineStart = html.indexOf('const WORD_SEARCH_LEVELS=');
  const engineEnd = html.indexOf('function renderWordSearchGame()', engineStart);
  assert.ok(engineStart >= 0 && engineEnd > engineStart);
  let seed = 72419;
  const math = Object.create(Math);
  math.random = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
  const context = vm.createContext({ currentLanguage: 'en', Math: math, S: { childAgeBand: '6-7' }, AGE_ADAPTED_STAGE_COUNT: 5 });
  vm.runInContext(`function childDifficultyLevel(ageBand){return {'6-7':1,'8-9':2,'10-11':3}[ageBand]}\n${html.slice(engineStart, engineEnd)}\nglobalThis.testLevels=WORD_SEARCH_LEVELS;`, context);
  const ageCases = [
    { ageBand: '6-7', size: 6, words: 3, directions: ['horizontal'] },
    { ageBand: '8-9', size: 7, words: 3, directions: ['horizontal', 'vertical'] },
    { ageBand: '10-11', size: 9, words: 4, directions: ['diagonal', 'horizontal', 'vertical'] },
  ];
  for (const language of ['en', 'he', 'ru']) {
    assert.ok(textForLanguage(language).wordSearchPromptSimple);
    assert.ok(textForLanguage(language).wordSearchPromptMedium);
    assert.ok(textForLanguage(language).wordSearchPromptComplex);
    context.currentLanguage = language;
    for (const { ageBand, size, words, directions: allowedDirections } of ageCases) {
      context.S.childAgeBand = ageBand;
      for (let activity = 0; activity < 12; activity++) for (const stage of context.testLevels) {
        const puzzle = context.createWordSearchPuzzle(activity, stage);
        assert.equal(puzzle.difficultyLevel, { '6-7': 1, '8-9': 2, '10-11': 3 }[ageBand]);
        assert.equal(puzzle.size, size, `${language} ${ageBand} activity ${activity + 1} stage ${stage + 1} board size`);
        assert.equal(puzzle.words.length, words, `${language} ${ageBand} activity ${activity + 1} stage ${stage + 1} word count`);
        for (const { cells } of puzzle.words) {
          const first = cells[0], second = cells[1];
          const dx = second % puzzle.size - first % puzzle.size;
          const dy = Math.floor(second / puzzle.size) - Math.floor(first / puzzle.size);
          const direction = dy === 0 ? 'horizontal' : dx === 0 ? 'vertical' : 'diagonal';
          assert.ok(allowedDirections.includes(direction), `${language} ${ageBand} activity ${activity + 1} stage ${stage + 1} used ${direction}`);
        }
      }
    }
  }
  assert.equal(context.testLevels.length, 5);
});

test('word search fruit category is named fruits and vegetables in every language', () => {
  const start = html.indexOf('const ACTIVITY_NAMES={');
  const end = html.indexOf('\nlet selectedMiniGame=', start);
  assert.ok(start >= 0 && end > start);
  const context = vm.createContext({});
  vm.runInContext(`${html.slice(start, end)}\nglobalThis.testNames=ACTIVITY_NAMES;`, context);
  assert.equal(context.testNames.en.wordSearch[1], 'Fruits & Vegetables');
  assert.equal(context.testNames.he.wordSearch[1], 'פירות וירקות');
  assert.equal(context.testNames.ru.wordSearch[1], 'Фрукты и овощи');
});

test('word search omits level labels from both the selector and active game', () => {
  const gameContent = { innerHTML: '' };
  const context = vm.createContext({
    currentLanguage: 'en',
    selectedLevel: 0,
    S: { completedPuzzleStars: [] },
    AGE_ADAPTED_STAGE_COUNT: 5,
    WORD_SEARCH_LEVELS: Array.from({ length: 5 }, (_, index) => index),
    wordSearchConfigForAge: () => ({ size: 6, words: 3 }),
    wordSearchLevelIsUnlocked: level => level === 0,
    wordSearchStarKey: (_, level) => `level-${level}`,
    wordSearchPuzzle: {
      size: 3,
      difficultyLevel: 1,
      grid: [['C', 'A', 'T'], ['A', 'R', 'E'], ['T', 'E', 'N']],
      words: [{ word: 'CAT', cells: [0, 1, 2] }],
      selected: [],
      found: new Set(),
      status: '',
    },
    activityNames: () => ['Activity'],
    gameActivityAdvanceLabel: () => 'Continue',
    renderAgeAdaptedStageBanner: () => '',
    showGameFeedback() {},
    tr: (key, values = {}) => key === 'wordSearchGrid'
      ? `${values.size} × ${values.cols} grid · ${values.words} words`
      : key,
    $: () => gameContent,
  });
  vm.runInContext(slice('function renderWordSearchLevels(){', 'function launchWordSearchLevel('), context);
  context.renderWordSearchLevels();
  assert.equal(Array.from(gameContent.innerHTML.matchAll(/<button\b/g)).length, 6);
  assert.doesNotMatch(gameContent.innerHTML, /wordSearchLevel|>Level \d|>שלב \d|>Уровень \d/);

  vm.runInContext(slice('function renderWordSearchGame(){', 'function selectWordSearchCell('), context);
  context.renderWordSearchGame();
  assert.doesNotMatch(gameContent.innerHTML, /wordSearchLevel|>Level \d|>שלב \d|>Уровень \d/);
});

test('multi-stage games expose resume controls and restore saved activity state', () => {
  const gameSource = slice('const MINI_GAMES=[', 'const ACTIVITY_NAMES=');
  const stageStart = html.indexOf('const AGE_ADAPTED_STAGE_GAMES=');
  const stageEnd = html.indexOf('function withTimeout(', stageStart);
  const progressStart = html.indexOf('const miniGameProgress=new Map();');
  const progressEnd = html.indexOf('function gameUnlocked(id){', progressStart);
  assert.ok(stageStart >= 0 && stageEnd > stageStart && progressStart >= 0 && progressEnd > progressStart);
  const stageSource = html.slice(stageStart, stageEnd);
  const captureSource = html.slice(progressStart, progressEnd);
  for (const match of gameSource.matchAll(/id:'([^']+)'/g)) {
    if (match[1] !== 'coloring') assert.ok(captureSource.includes(`'${match[1]}'`), `${match[1]} checkpoint support`);
  }
  assert.match(html, /continueGameProgress:'Continue \{activity\}'/);
  assert.match(html, /continueGameProgress:'המשך ב-\{activity\}'/);
  assert.match(html, /continueGameProgress:'Продолжить: \{activity\}'/);

  const gameContent = { innerHTML: 'Question 4', className: 'quiz' };
  const feedback = {
    active: false,
    classList: { contains: () => feedback.active },
    message: { textContent: 'Correct!' },
    action: { textContent: 'Next' },
    icon: { textContent: '🎉' },
  };
  const storage = new Map();
  const setupContext = () => {
    const restoredContent = { innerHTML: gameContent.innerHTML, className: gameContent.className };
    const context = vm.createContext({
      $: (selector) => ({
        '#gameContent': restoredContent,
        '#gameFeedbackM': feedback,
        '#gameFeedbackMessage': feedback.message,
        '#gameFeedbackAction': feedback.action,
        '#gameFeedbackIcon': feedback.icon,
      })[selector] || null,
      localStorage: { getItem: key => storage.get(key) || null, setItem: (key, value) => storage.set(key, value) },
      btoa, atob, MINI_GAMES: [{ id: 'math' }, { id: 'gridSokoban' }],
      S: { childAgeBand: '6-7' },
      activityNames: () => Array(12).fill('activity'),
      closeM() {},
      showGameFeedback: (message, label, action) => { context.restoredAction = action },
    });
    vm.runInContext(`let currentUserId='account:test',currentLanguage='en';
    let selectedMiniGame='math',selectedLevel=3,miniGameScene='play';
    let genericAnswer='12',riddleQuestionIndex=4,questionHintCount=1,gameFeedbackAction=null;
    let selectedPathLevel=0,selectedBoxLevel=2,selectedRailwayLevel=0,selectedWordSearchLevel=0,selectedMagneticStage=0;
    function childDifficultyLevel(ageBand){return {'6-7':1,'8-9':2,'10-11':3}[ageBand]}
    let interactivePuzzle={turns:7,walls:new Set(['2,3']),difficultyLevel:1},puzzleTiles=[],puzzleImage='',puzzleSelected=-1,puzzleImages=[],puzzleImageIndex=0;
    let differenceFound=new Set(),differenceSpots=[],differenceLeft=[],differenceRight=[];
    let traceLetterIndex=0,traceDistance=0,traceHasInk=false,memoryCards=[],memoryOpen=[],memoryMatched=new Set();
    let escapeRoomIndex=0,escapeRoomSolved=false,escapeRoomStarEarned=false,escapeRoomAnswer='',escapeRoomAnswerIndex=-1,escapeRoomExplanation='',escapeRoomPhase='stations',escapeRoomCodeParts=[],escapeCodeInput=[],escapeCodeActiveIndex=0,escapeCodeFeedback='';
    let wordSearchPuzzle=null,magneticMaze=null;
    function learningGameHasTenQuestions(){return true}
    function traceLetterGroups(){return Array.from({length:12},()=>Array(10).fill('A'))}
    function retryLearningAnswer(){} function nextRiddleQuestion(){riddleQuestionIndex++} function advanceGameActivity(){}
    function nextPuzzlePicture(){} function nextPuzzleActivity(){} function clearTrace(){} function nextTraceLetter(){}
    function nextEscapeRoom(){} function enterEscapeCode(){} function continueInteractivePuzzle(){}
    function startInteractivePuzzle(){} function clearWordSearchSelection(){} function renderWordSearchLevels(){}
    function startMagneticMaze(){} function renderMagneticMazeStages(){}
    function go(id){globalThis.lastScreen=id}
    ${stageSource}
    ${captureSource}
    globalThis.saveProgress=saveMiniGameProgress;
    globalThis.restoreProgress=restoreMiniGameProgress;
    globalThis.encodeProgress=encodeMiniGameProgressValue;
    globalThis.decodeProgress=decodeMiniGameProgressValue;
    `, context);
    context.content = restoredContent;
    return context;
  };
  const context = setupContext();
  feedback.active = true;
  context.saveProgress();
  feedback.active = false;
  vm.runInContext(`selectedMiniGame='gridSokoban';selectedLevel=3;selectedBoxLevel=2;
    interactivePuzzle={turns:9,walls:new Set(['2,3']),difficultyLevel:1};`, context);
  context.saveProgress();
  vm.runInContext(`selectedBoxLevel=1;interactivePuzzle={turns:4,walls:new Set(['1,1']),difficultyLevel:1};`, context);
  context.saveProgress();
  vm.runInContext(`riddleQuestionIndex=8;genericAnswer='changed';questionHintCount=0;`, context);
  context.content.innerHTML = 'Different game';
  const reloadedContext = setupContext();
  vm.runInContext(`loadMiniGameProgress();`, reloadedContext);
  vm.runInContext(`currentUserId='account:other';loadMiniGameProgress();`, reloadedContext);
  assert.equal(reloadedContext.restoreProgress('math', 3), false, 'progress is isolated by account');
  vm.runInContext(`currentUserId='account:test';loadMiniGameProgress();`, reloadedContext);
  assert.equal(reloadedContext.restoreProgress('math', 3), true);
  assert.equal(vm.runInContext('riddleQuestionIndex', reloadedContext), 4);
  assert.equal(vm.runInContext('genericAnswer', reloadedContext), '12');
  assert.equal(vm.runInContext('questionHintCount', reloadedContext), 1);
  assert.equal(reloadedContext.content.innerHTML, 'Question 4');
  assert.equal(reloadedContext.lastScreen, 'gameStage');
  assert.equal(reloadedContext.restoreProgress('gridSokoban', 3, 1), true);
  assert.equal(vm.runInContext('selectedBoxLevel', reloadedContext), 1);
  assert.equal(vm.runInContext('interactivePuzzle.turns', reloadedContext), 4);
  assert.equal(reloadedContext.restoreProgress('gridSokoban', 3, 2), true);
  assert.equal(vm.runInContext('selectedBoxLevel', reloadedContext), 2);
  assert.equal(vm.runInContext('interactivePuzzle.turns', reloadedContext), 9);
  assert.equal(typeof reloadedContext.restoredAction, 'function');
  reloadedContext.restoredAction();
  assert.equal(vm.runInContext('riddleQuestionIndex', reloadedContext), 5, 'feedback action survives reload');
  const encoded = reloadedContext.encodeProgress(vm.runInContext('new Uint8ClampedArray([0,128,255])', reloadedContext));
  assert.deepEqual(Array.from(reloadedContext.decodeProgress(encoded)), [0, 128, 255]);

  vm.runInContext(`selectedMiniGame='gridSokoban';selectedLevel=2;miniGameScene='play';interactivePuzzle={turns:9,walls:new Set(['3,4']),difficultyLevel:1};`, reloadedContext);
  reloadedContext.content.innerHTML = 'Sokoban board';
  reloadedContext.saveProgress();
  const stageReloadedContext = setupContext();
  vm.runInContext(`loadMiniGameProgress();`, stageReloadedContext);
  assert.equal(stageReloadedContext.restoreProgress('gridSokoban', 2, 1), false, 'a different stage starts fresh');
  assert.equal(stageReloadedContext.restoreProgress('gridSokoban', 2, 2), true);
  assert.equal(vm.runInContext('interactivePuzzle.turns', stageReloadedContext), 9);
  assert.deepEqual(Array.from(vm.runInContext('interactivePuzzle.walls', stageReloadedContext)), ['3,4']);
});

test('saved game progress is rejected when it belongs to a different age difficulty', () => {
  const context = vm.createContext({ S: { childAgeBand: '6-7' } });
  const stageStart = html.indexOf('const AGE_ADAPTED_STAGE_GAMES=');
  const stageEnd = html.indexOf('function withTimeout(', stageStart);
  const progressStart = html.indexOf('function miniGameProgressStage(');
  const progressEnd = html.indexOf('function captureMiniGameState(', progressStart);
  assert.ok(stageStart >= 0 && stageEnd > stageStart && progressStart >= 0 && progressEnd > progressStart);
  vm.runInContext(`function childDifficultyLevel(ageBand){return {'6-7':1,'8-9':2,'10-11':3}[ageBand]}
    function memoryPairCountForAge(){return [0,3,4,6][childDifficultyLevel(S.childAgeBand)]}
    ${html.slice(stageStart, stageEnd)}
    ${html.slice(progressStart, progressEnd)}
    globalThis.matchesAge=miniGameProgressMatchesAge;`, context);
  const states = {
    differences: { differenceGoal: 2 },
    memory: { memoryPairCount: 3 },
    logicQuest: { difficultyLevel: 1 },
    words: { difficultyLevel: 1 },
    patterns: { difficultyLevel: 1 },
    wordSearch: { selectedWordSearchLevel: 0, wordSearchPuzzle: { difficultyLevel: 1 } },
    physicsPaths: { selectedPathLevel: 0, interactivePuzzle: { difficultyLevel: 1 } },
    magneticMaze: { selectedMagneticStage: 0, magneticMaze: { difficultyLevel: 1 } },
    codeBreaker: { interactivePuzzle: { difficultyLevel: 1 } },
    escapeRoom: { difficultyLevel: 1 },
  };
  for (const [id, state] of Object.entries(states)) assert.equal(context.matchesAge(id, state), true, `${id} resumes at its original age`);
  context.S.childAgeBand = '8-9';
  for (const [id, state] of Object.entries(states)) assert.equal(context.matchesAge(id, state), false, `${id} does not restore an easier-age save`);
});

test('logic quest scales items and clues to the child age without repeating questions', () => {
  for (const language of ['en', 'he', 'ru']) {
    assert.doesNotMatch(translations.TEXT[language].logicPrompt, /three|שלוש|три/i, `${language} prompt allows a variable clue count`);
  }
  const context = vm.createContext({
    S: { childAgeBand: '6-7' },
    Math,
    tr: (_key, values) => `${values.a} before ${values.b}`,
  });
  const difficultyStart = html.indexOf('function childDifficultyLevel(');
  const difficultyEnd = html.indexOf('function withTimeout(', difficultyStart);
  const iconStart = html.indexOf('const LOGIC_ICON_SETS=');
  const iconEnd = html.indexOf('function getLearningQuestionLabel(', iconStart);
  const questionStart = html.indexOf('function logicQuestPermutations(');
  const questionEnd = html.indexOf('const LOGIC_QUESTS=', questionStart);
  assert.ok(difficultyStart >= 0 && difficultyEnd > difficultyStart);
  assert.ok(iconStart >= 0 && iconEnd > iconStart);
  assert.ok(questionStart >= 0 && questionEnd > questionStart);
  vm.runInContext([
    html.slice(difficultyStart, difficultyEnd),
    html.slice(iconStart, iconEnd),
    html.slice(questionStart, questionEnd),
  ].join('\n'), context);

  for (const [ageBand, itemCount] of [['6-7', 3], ['8-9', 4], ['10-11', 5]]) {
    context.S.childAgeBand = ageBand;
    const clueCount = itemCount - 1;
    const visuals = context.logicQuestIntroVisuals();
    assert.equal(visuals[0].length, itemCount);
    assert.equal(visuals[1].filter(token => token === '➡️').length, clueCount);
    for (let activity = 0; activity < 12; activity++) {
      const answers = new Set();
      for (let questionIndex = 0; questionIndex < 10; questionIndex++) {
        const question = context.getLogicQuestion(activity, questionIndex);
        assert.equal((question.question.match(/<div>/g) || []).length, clueCount);
        const items = question.answer.split(' ');
        assert.equal(items.length, itemCount);
        assert.equal(new Set(items).size, itemCount);
        assert.equal(question.options.length, 4);
        assert.equal(new Set(question.options).size, 4);
        assert.ok(question.options.includes(question.answer));
        answers.add(question.answer);
      }
      assert.equal(answers.size, 10, `activity ${activity + 1} has ten distinct questions for age ${ageBand}`);
    }
  }
});

test('pattern activities use symbols that match each activity theme', () => {
  const context = vm.createContext({ Math, S: { childAgeBand: '6-7' } });
  const patternSource = slice('const PATTERN_THEMES=', 'function getLogicQuestion(');
  vm.runInContext(`function childDifficultyLevel(ageBand){return {'6-7':1,'8-9':2,'10-11':3}[ageBand]}\n${patternSource}\nglobalThis.patternThemes=PATTERN_THEMES;globalThis.makePatternQuestion=getPatternQuestion;`, context);
  const themes = Array.from(context.patternThemes, theme => Array.from(theme));
  assert.deepEqual(themes, [
    ['🔴','🔵','🟡','🟢'],
    ['⭐','🌙','☀️','☁️'],
    ['🐱','🐶','🐰','🦊'],
    ['🍎','🍐','🍊','🍇'],
    ['🌼','🌻','🌷','🌸'],
    ['🔺','🟦','⚪','🔶'],
    ['🚗','🚌','🚲','🚂'],
    ['🐟','🐙','🦀','🐬'],
    ['🦖','🥚','🦕','🦴'],
    ['🥁','🎸','🎺','🎹'],
    ['🪐','🚀','🌌','☄️'],
    ['❄️','☃️','🧤','🧣'],
  ]);
  for (const [ageBand, difficulty, sequenceLength] of [['6-7', 1, 4], ['8-9', 2, 6], ['10-11', 3, 8]]) {
    context.S.childAgeBand = ageBand;
    for (let activity = 0; activity < themes.length; activity++) for (let question = 0; question < 10; question++) {
      const result = context.makePatternQuestion(activity, question);
      const sequence = result.question.trim().split(/\s+/).slice(0, sequenceLength);
      assert.equal(result.difficultyLevel, difficulty);
      assert.equal(sequence.length, sequenceLength, `${ageBand} question sequence length`);
      assert.ok(sequence.every(symbol => themes[activity].includes(symbol)), `activity ${activity + 1}, question ${question + 1} sequence`);
      assert.ok(themes[activity].includes(result.answer), `activity ${activity + 1}, question ${question + 1} answer`);
      assert.ok(result.options.every(option => themes[activity].includes(option)), `activity ${activity + 1}, question ${question + 1} options`);
      if (difficulty === 1) {
        assert.notEqual(sequence[0], sequence[1]);
        assert.equal(sequence[2], sequence[0]);
        assert.equal(result.answer, sequence[0]);
      }
    }
  }
});

test('pastel background is applied across screens and cached for offline use', async () => {
  assert.match(html, /body\{[^}]*background:#fff7e6 url\('\.\/images\/magical-fun-background\.png'\)/);
  assert.match(html, /\.screen:not\(#welcome\)\{background-color:rgba\(255,247,230,\.15\)\}/);
  assert.match(html, /@media\(min-aspect-ratio:1\/1\)\{body\{background-size:100% 100%;background-color:#fff7e6\}\}/);
  assert.match(html, /#welcome\{[^}]*background:radial-gradient\([^}]*#ffffff22/i);
  assert.match(html, /#cv\{[^}]*background:#fff/);
  assert.match(html, /\.interactive-puzzle\{[^}]*background:#fff/);
  assert.match(serviceWorker, /magical-fun-shell-v49-stage-navigation-remember-me/);
  for (const file of ['math.js', 'story-math.js', 'riddles-6-7.js', 'riddles-8-9.js', 'riddles-10-11.js', 'escape-room-6-7.js', 'escape-room-8-9.js', 'escape-room-10-11.js', 'science.js']) {
    assert.ok(html.includes(`<script src="./question-banks/${file}"></script>`));
    assert.ok(serviceWorker.includes(`new URL('question-banks/${file}',APP_ROOT).href`));
  }
  assert.match(serviceWorker, /new URL\('images\/magical-fun-background\.png',APP_ROOT\)\.href/);
  await access(new URL('../images/magical-fun-background.png', import.meta.url));
});

test('terms explain age-based game adaptations in all supported languages', async () => {
  const terms = await readFile(new URL('../terms.html', import.meta.url), 'utf8');
  assert.match(terms, /עודכן לאחרונה: 20 בנובמבר 2026/);
  assert.match(terms, /Last updated: November 20, 2026/);
  assert.match(terms, /Последнее обновление: 20 ноября 2026 г\./);
  assert.match(terms, /טווח הגיל שנבחר בפרופיל הילד\/ה משמש להתאמת רמת הקושי וסוגי הפעילויות/);
  assert.match(terms, /The age range selected for a child profile is used to adapt game difficulty and activities/);
  assert.match(terms, /Возрастная группа, выбранная в профиле ребёнка, используется для настройки сложности игр и подбора заданий/);
});

test('application, legal, and question-bank copy use en dashes and hyphen-minus consistently', async () => {
  const files = [
    new URL('../index.html', import.meta.url),
    new URL('../terms.html', import.meta.url),
    new URL('../privacy.html', import.meta.url),
    new URL('../delete-account.html', import.meta.url),
    new URL('../promo-maker.html', import.meta.url),
  ];
  const questionBankDirectory = new URL('../question-banks/', import.meta.url);
  for (const file of await readdir(questionBankDirectory)) {
    if (file.endsWith('.js')) files.push(new URL(file, questionBankDirectory));
  }
  for (const file of files) {
    const text = await readFile(file, 'utf8');
    assert.doesNotMatch(text, /—/, file.pathname);
    assert.doesNotMatch(text, /\u05BE/, file.pathname);
  }
});

test('drawing screens use one download icon and route saves through the device saver', async () => {
  const drawing = html.slice(html.indexOf('function startFreeDraw()'), html.indexOf('/* ---------- Mini games'));
  const coloring = html.slice(html.indexOf('<div id="paint"'), html.indexOf('<div id="camera"'));
  assert.match(drawing, /onclick="downloadFreeDraw\(\)" data-i18n="download"/);
  assert.doesNotMatch(drawing, /onclick="downloadFreeDraw\(\)">💾/);
  assert.match(coloring, /onclick="downloadArt\(\)" data-i18n="download">⬇️/);
  assert.match(html, /download:'⬇️ שמירה למכשיר'/);
  assert.match(html, /window\.Capacitor\.Plugins\.ArtworkSave/);

  const calls = [];
  const messages = [];
  const nativeContext = vm.createContext({
    window: { Capacitor: { getPlatform: () => 'android', Plugins: { ArtworkSave: {
      saveImage: async (options) => calls.push(options),
    } } } },
    URL,
    document: {},
    console: { error: (...args) => { throw new Error(args.join(' ')); } },
    toast: message => messages.push(message),
    tr: key => key,
  });
  vm.runInContext(slice('async function saveCanvasToDevice(', 'function downloadArt()'), nativeContext);
  await nativeContext.saveCanvasToDevice({ toDataURL: () => 'data:image/png;base64,cG5n' }, 'test.png');
  assert.equal(calls.length, 1);
  assert.equal(calls[0].fileName, 'test.png');
  assert.equal(calls[0].data, 'cG5n');
  assert.deepEqual(messages, ['deviceSaveSuccess']);

  const browserMessages = [];
  const links = [];
  const browserContext = vm.createContext({
    window: { Capacitor: { getPlatform: () => 'web' } },
    URL: { createObjectURL: () => 'blob:drawing', revokeObjectURL: () => {} },
    document: {
      body: { append: link => links.push(link) },
      createElement: () => ({ style: {}, click() { this.clicked = true; }, remove() {} }),
    },
    setTimeout: () => {},
    console: { error: (...args) => { throw new Error(args.join(' ')); } },
    toast: message => browserMessages.push(message),
    tr: key => key,
  });
  vm.runInContext(slice('async function saveCanvasToDevice(', 'function downloadArt()'), browserContext);
  await browserContext.saveCanvasToDevice({ toBlob: callback => callback({ type: 'image/png' }) }, 'test.png');
  assert.equal(links[0].download, 'test.png');
  assert.equal(links[0].href, 'blob:drawing');
  assert.equal(links[0].clicked, true);
  assert.deepEqual(browserMessages, ['deviceSaveStarted']);
});

test('coloring palette stays docked above navigation and scrolls horizontally', () => {
  const paint = html.slice(html.indexOf('<div id="paint"'), html.indexOf('<div id="camera"'));
  assert.ok(paint.indexOf('class="paint-workspace"') < paint.indexOf('id="cvWrap"'));
  assert.ok(paint.indexOf('id="cvWrap"') < paint.indexOf('id="pal"'));
  assert.match(paint, /id="pal"[^>]*role="group"[^>]*data-i18n-aria="colorPalette"/);
  assert.doesNotMatch(html, /paintPaletteM|paintPaletteOpen/);
  assert.match(html, /#paint\.screen\.on\{[^}]*display:flex[^}]*width:100%[^}]*max-width:none[^}]*overflow:hidden/);
  assert.match(html, /\.paint-workspace\{[^}]*overflow-y:auto/);
  assert.match(html, /#paint>\.paint-palette\{[^}]*flex-direction:column[^}]*overflow-y:auto/);
  assert.match(html, /\.paint-color-swatches\{[^}]*flex-wrap:nowrap[^}]*justify-content:safe center[^}]*overflow-x:auto/);
  assert.match(html, /\.paint-workspace\{display:grid[^}]*grid-template-rows:repeat\(5,max-content\)/);
  assert.match(html, /@media\(max-width:600px\)\{[\s\S]*?\.paint-workspace\{grid-template-columns:minmax\(0,1fr\);grid-template-rows:repeat\(6,max-content\)/);
  assert.match(html, /\.paint-canvas-stage\{[^}]*grid-column:1;grid-row:4;grid-template-columns:44px minmax\(0,1fr\) 44px/);
  assert.match(html, /\.paint-canvas-wrap\{[^}]*grid-column:2;grid-row:1[^}]*width:min\(100%,400px\)[^}]*aspect-ratio:1/);
  assert.match(html, /@media\(max-width:600px\)\{[\s\S]*?\.paint-canvas-stage\{grid-column:1;grid-row:4;grid-template-columns:minmax\(0,1fr\) 53% minmax\(0,1fr\)/);
  assert.doesNotMatch(html, /\.paint-canvas-wrap\{[^}]*52dvh/);
  assert.match(html, /\.paint-workspace\{display:grid[^}]*grid-template-columns:minmax\(0,1fr\) minmax\(76px,128px\)/);
  assert.match(html, /\.paint-actions button\{margin:0;padding:6px 4px;font-size:12px/);
  assert.match(html, /\.paint-actions\{grid-column:2;grid-row:4\/span 2;flex-direction:column[^}]*gap:3px/);
  assert.match(html, /@media\(max-width:600px\)\{[\s\S]*?\.paint-actions\{grid-column:1;grid-row:5;flex-direction:row/);
  assert.match(html, /\.paint-item-nav\{display:flex;grid-column:1\/-1;grid-row:1/);
  assert.match(html, /@media\(max-width:600px\)\{[\s\S]*?\.paint-actions button\{width:auto;flex:1 1 30%;min-width:0\}/);
  assert.match(html, /@media\(max-height:700px\) and \(min-width:601px\)\{[\s\S]*?grid-template-rows:max-content max-content max-content minmax\(0,1fr\) max-content/);
  assert.match(html, /@media\(max-height:700px\) and \(min-width:601px\)\{[\s\S]*?\.paint-canvas-stage\{grid-column:1;grid-row:4;height:100%\}/);
  assert.match(html, /@media\(max-height:700px\) and \(min-width:601px\)\{[\s\S]*?\.paint-canvas-wrap\{grid-column:2;grid-row:1;width:auto;height:100%;max-width:100%;max-height:100%;justify-self:center;margin:0\}/);
  assert.match(html, /@media\(max-height:700px\) and \(min-width:601px\)\{[\s\S]*?\.paint-actions\{grid-column:2;grid-row:4\/span 2;flex-direction:column/);
  assert.match(html, /@media\(max-height:700px\) and \(min-width:601px\)\{[\s\S]*?#paint>\.paint-palette\{max-height:90px\}/);

  const palette = { innerHTML: '' };
  const context = vm.createContext({
    COLORS: ['#ff0000', '#00ff00'], S: { custom: ['#0000ff'] }, cur: '#ff0000',
    tr: key => key,
    $: selector => selector === '#pal' ? palette : null,
  });
  vm.runInContext(slice('function renderPalette()', 'function hsv2rgb('), context);
  context.renderPalette();
  assert.match(palette.innerHTML, /onclick="pickC\('#00ff00'\)"/);
  assert.match(palette.innerHTML, /basicColors/);
  assert.match(palette.innerHTML, /createdColors/);
  context.S.custom = [];
  context.renderPalette();
  assert.match(palette.innerHTML, /noCreatedColors/);
  context.S.custom = ['#0000ff'];
  context.pickC('#00ff00');
  assert.equal(context.cur, '#00ff00');
  assert.match(palette.innerHTML, /class="sw on" style="background:#00ff00"/);
  assert.match(palette.innerHTML, /onclick="pickC\('#0000ff'\)"/);
});

test('created coloring colors have no count limit', () => {
  const context = vm.createContext({
    COLORS: ['#ff0000'],
    S: { custom: Array.from({ length: 19 }, (_, index) => `#${(index + 1).toString(16).padStart(6, '0')}`) },
    mixHex: '#abcdef',
    hexRgb: () => [0, 0, 0],
    rgb2hsv: () => [0, 0, 0],
    hsv2rgb: () => [0, 0, 0],
    toHex: () => '#000000',
    updMix() {},
    renderPalette() {},
    renderDrawTools() {},
    closeM() {},
    toast() {},
    sv() {},
  });
  vm.runInContext(slice('function addMix(){', '/* ---------- Magic Camera ---------- */'), context);
  context.addMix();
  assert.equal(context.S.custom.length, 20);
  assert.equal(context.S.custom.at(-1), '#abcdef');
});

test('coloring progress is saved per user and restored for the same picture', async () => {
  const stored = new Map();
  const pixelData = new Uint8ClampedArray(512 * 512 * 4);
  let restored = false;
  const context = vm.createContext({
    N: 512, P: 512 * 512, currentUserId: 'parent@example.com', curScreen: 'paint',
    paintDraftKey: 'animals:0', paintDraftReady: true, paintDraftSaveTimer: null,
    img: { data: new Uint8ClampedArray(512 * 512 * 4) },
    baseImg: new Uint8ClampedArray(512 * 512 * 4), savedImg: null,
    cv: { toDataURL: () => 'data:image/png;base64,progress' },
    ctx: {
      drawImage() { restored = true; },
      getImageData: () => ({ data: pixelData }),
    },
    localStorage: {
      getItem: key => stored.get(key) || null,
      setItem: (key, value) => stored.set(key, value),
      removeItem: key => stored.delete(key),
    },
    document: {
      createElement: () => ({ width: 0, height: 0, getContext: () => ({
        createImageData: () => ({ data: new Uint8ClampedArray(512 * 512 * 4) }),
        putImageData() {},
        drawImage() {},
        getImageData: () => ({ data: new Uint8ClampedArray(512 * 512 * 4) }),
      }) }),
    },
    window: { addEventListener() {} },
    clearTimeout() {},
    flush() {},
    loadPhotoSource: async source => ({ source }),
    toast() {},
    tr: key => key,
    console: { error: (...args) => { throw new Error(args.join(' ')); } },
  });
  context.img.data[0] = 255;
  vm.runInContext(slice('function changedPixels(', 'function coloringDraftStorageKey()'), context);
  vm.runInContext(slice('function coloringDraftStorageKey()', 'function saveArt(){'), context);

  context.savePaintDraft();
  assert.ok(stored.has('megical_coloring_drafts_parent@example.com'));
  const draft = JSON.parse(stored.get('megical_coloring_drafts_parent@example.com'));
  assert.equal(draft['animals:0'].image, 'data:image/png;base64,progress');

  pixelData[0] = 255;
  await context.restorePaintDraft();
  assert.equal(restored, true);
  assert.equal(context.img.data[0], 255);
});

test('coloring picture navigation uses side arrows with localized accessible labels', () => {
  const paint = slice('<div id="paint" class="screen center">', '<div id="camera"');
  assert.match(paint, /<div class="paint-canvas-stage">[\s\S]*?<div id="cvWrap"[\s\S]*?<div id="paintItemNav" class="paint-item-nav">/);
  assert.ok(paint.indexOf('id="cvWrap"') < paint.indexOf('id="paintItemNav"'));
  assert.match(html, /\.paint-item-nav\{display:flex;grid-column:1\/-1;grid-row:1[^}]*justify-content:space-between[^}]*direction:ltr/);
  assert.match(html, /\.paint-item-nav button\{display:grid;place-items:center;flex:0 0 44px;width:44px;height:44px/);
  assert.ok(paint.indexOf('id="paintItemNav"') < paint.indexOf('onclick="zm.by(1.4)"'));
  assert.match(paint, /id="paintPrevItem"[^>]*onclick="navItem\(-1\)"[^>]*data-i18n-aria="previousColoringPicture"><span aria-hidden="true">←<\/span>/);
  assert.match(paint, /id="paintNextItem"[^>]*onclick="navItem\(1\)"[^>]*data-i18n-aria="nextColoringPicture"><span aria-hidden="true">→<\/span>/);
  const translations = vm.createContext({});
  vm.runInContext(slice('const TEXT=', "let currentLanguage='en';") + '\nglobalThis.TEXT=TEXT;', translations);
  for (const language of ['en', 'he', 'ru']) {
    for (const key of ['previousColoringPicture', 'nextColoringPicture']) {
      assert.ok(translations.TEXT[language][key]);
    }
    for (const key of ['basicColors', 'createdColors', 'noCreatedColors']) {
      assert.ok(translations.TEXT[language][key]);
    }
  }
});

test('picture puzzle uses a grid size matched to the active child age band', () => {
  const board = {
    innerHTML: '',
    style: { setProperty(name, value) { this[name] = value; } },
  };
  const context = vm.createContext({
    S: { childAgeBand: '6-7' },
    $: selector => selector === '#puzzleBoard' ? board : null,
  });
  const difficultyStart = html.indexOf('function childDifficultyLevel(');
  const difficultyEnd = html.indexOf('function withTimeout(', difficultyStart);
  vm.runInContext(`${html.slice(difficultyStart, difficultyEnd)}\n${slice('const PUZZLE_CATEGORIES=', 'function movePuzzlePiece(')}`, context);

  for (const [ageBand, gridSize] of [['6-7', 3], ['8-9', 4], ['10-11', 6]]) {
    context.S.childAgeBand = ageBand;
    context.shufflePuzzleTiles();
    assert.equal(vm.runInContext('puzzleTiles.length', context), gridSize * gridSize);
    assert.equal(vm.runInContext('puzzleTiles.every((tile,index)=>tile===index)', context), false);
    vm.runInContext(`puzzleTiles=Array.from({length:${gridSize * gridSize}},(_,index)=>index);puzzleImage='images/one.png';puzzleSelected=-1;drawPuzzle()`, context);
    assert.equal(board.style['--puzzle-grid-size'], gridSize);
    assert.equal(board.style['--puzzle-image-size'], `${gridSize * 100}%`);
    assert.equal((board.innerHTML.match(/class="puzzle-piece/g) || []).length, gridSize * gridSize);
    assert.match(board.innerHTML, /--puzzle-position:100% 100%/);
  }
  assert.match(html, /\.game-board\{[^}]*grid-template-columns:repeat\(var\(--puzzle-grid-size,3\)/);
  assert.match(html, /background-size:var\(--puzzle-image-size,300%\) var\(--puzzle-image-size,300%\)/);
});

test('picture puzzle success stays on screen and offers next and replay actions', () => {
  const gameContent = { innerHTML: '' };
  const board = { innerHTML: '', style: { setProperty(name, value) { this[name] = value; } } };
  const status = { textContent: '' };
  const actions = { innerHTML: '' };
  const elements = new Map([
    ['#gameContent', gameContent], ['#puzzleBoard', board], ['#puzzleStatus', status], ['#puzzleActions', actions],
  ]);
  let successPopups = 0;
  const context = vm.createContext({
    selectedLevel: 0,
    currentLanguage: 'he',
    S: { childAgeBand: '6-7' },
    CATS: [],
    activityNames: () => Array(12).fill('Activity'),
    tr: key => translations.TEXT.he[key] || key,
    $: selector => elements.get(selector),
    showGameFeedback: () => successPopups++,
  });
  const difficultyStart = html.indexOf('function childDifficultyLevel(');
  const difficultyEnd = html.indexOf('function withTimeout(', difficultyStart);
  vm.runInContext(`${html.slice(difficultyStart, difficultyEnd)}
    let puzzleTiles=[1,0,2,3,4,5,6,7,8],puzzleImage='images/one.png',puzzleSelected=-1,
    puzzleImages=['images/one.png','images/two.png'],puzzleImageIndex=0;
    ${slice('const PUZZLE_CATEGORIES=', 'let differenceFound=')}`, context);

  context.renderPuzzlePicture();
  context.movePuzzlePiece(0);
  context.movePuzzlePiece(1);

  assert.equal(status.textContent, translations.TEXT.he.puzzleComplete);
  assert.match(actions.innerHTML, /nextPuzzlePicture\(\)/);
  assert.match(actions.innerHTML, /replayPuzzlePicture\(\)/);
  assert.match(actions.innerHTML, new RegExp(translations.TEXT.he.puzzleReplay));
  assert.equal(successPopups, 0);
  assert.match(board.innerHTML, /disabled/);

  context.replayPuzzlePicture();
  assert.equal(vm.runInContext('puzzleImageIndex', context), 0);
  assert.equal(vm.runInContext('puzzleImage', context), 'images/one.png');
  assert.equal(vm.runInContext('puzzleTiles.every((tile,index)=>tile===index)', context), false);
  for (const language of ['en', 'he', 'ru']) {
    assert.ok(translations.TEXT[language].puzzleComplete);
    assert.ok(translations.TEXT[language].puzzleReplay);
  }
});

test('Sokoban, path and code-breaker success feedback is shown in a popup', () => {
  const render = slice('function renderInteractivePuzzle()', 'function showInteractiveHint()');
  assert.match(render, /if\(interactivePuzzle\.won\)\s*\{\s*const stageProgress=/);
  assert.match(render, /showGameFeedback\(`\$\{tr\('correct'\)\}/);
  assert.match(render, /showGameFeedback\(interactivePuzzle\.feedback,tr\('puzzleRetry'\)/);
  assert.match(html, /#gameFeedbackM\{z-index:30\}/);
});

test('coloring navigation wraps within the category and stays hidden for photos', () => {
  const calls = [];
  const elements = new Map([
    ['#paintItemNav', { hidden: false }],
    ['#downloadPaint', { style: { display: '' } }],
  ]);
  const context = vm.createContext({
    CATS: [{ items: ['one', 'two', 'three'] }], curCat: 0, curItem: 0,
    openItem: (category, item) => calls.push([category, item]),
    $: (selector) => elements.get(selector),
  });
  vm.runInContext(slice('function navItem(dir)', '/* ---------- mini games ---------- */'), context);
  vm.runInContext(slice('function setPhotoPaintControls(', 'async function startPaint('), context);
  context.navItem(-1);
  context.curItem = 2;
  context.navItem(1);
  assert.deepEqual(calls, [[0, 2], [0, 0]]);
  context.setPhotoPaintControls(true);
  assert.equal(elements.get('#paintItemNav').hidden, true);
  assert.equal(elements.get('#downloadPaint').style.display, 'none');
  context.setPhotoPaintControls(false);
  assert.equal(elements.get('#paintItemNav').hidden, false);
  assert.equal(elements.get('#downloadPaint').style.display, '');
});

