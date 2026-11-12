import test from 'node:test';
import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
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

test('story math uses varied scenarios and keeps bird questions observational', () => {
  const context = vm.createContext({
    currentLanguage: 'en',
    makeChoices: (answer) => [answer, answer + 1, answer - 1, answer + 2],
  });
  vm.runInContext(slice('const STORY_MATH_ITEMS=', 'const PATTERN_THEMES='), context);
  vm.runInContext(slice('function getRussianCountedItem(', 'function getWordQuestion('), context);

  for (let activity = 0; activity < 12; activity++) {
    const prompts = [];
    for (let question = 0; question < 10; question++) {
      const result = vm.runInContext(`getStoryMathQuestion(${activity},${question})`, context);
      const setting = vm.runInContext(`${question % 2 ? 'STORY_MATH_ALT_SETTINGS' : 'STORY_MATH_SETTINGS'}[${activity}]`, context);
      assert.ok(result.question.en);
      assert.ok(result.question.he);
      assert.ok(result.question.ru);
      for (const language of ['en', 'he', 'ru']) {
        const phrase = language === 'ru' ? setting.ru[0].toLocaleUpperCase('ru') + setting.ru.slice(1) : setting[language];
        assert.ok(result.question[language].includes(phrase), `activity ${activity}, question ${question} uses its setting in ${language}`);
      }
      assert.ok(result.options.includes(result.answer));
      assert.doesNotMatch(result.question.he, /[A-Za-zА-Яа-яЁё־—]/u, `activity ${activity}, question ${question}`);
      assert.doesNotMatch(result.question.ru, /(^|[.!?]\s+|:\s+)[а-яё]/u, `Russian sentence must start with a capital: activity ${activity}, question ${question}`);
      prompts.push(result.question.en);
    }
    assert.equal(new Set(prompts).size, 10, `activity ${activity} repeats a story`);
  }

  for (let question = 0; question < 10; question++) {
    const prompt = vm.runInContext(`getStoryMathQuestion(3,${question}).question.en`, context).toLowerCase();
    assert.doesNotMatch(prompt, /basket|used|share|pack|collect/);
  }
  assert.match(vm.runInContext('getStoryMathQuestion(0,1).question.he', context), /היו/);
  assert.doesNotMatch(vm.runInContext('getStoryMathQuestion(0,1).question.he', context), /הוצגו/);
  assert.match(vm.runInContext('getStoryMathQuestion(3,1).question.en', context), /flew away/);
  assert.match(vm.runInContext('getStoryMathQuestion(3,2).question.en', context), /garden areas/);
  assert.match(vm.runInContext('getStoryMathQuestion(3,3).question.en', context), /journal/);
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

test('level labels include the full requested Russian wording', () => {
  assert.match(html, /Приспособление животных/);
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

test('Russian riddle explorer label is exact and does not split awkwardly', () => {
  assert.match(html, /riddles:\[[^\]]*'Исследователь загадок'/);
  assert.match(html, /\.level-choice\.riddle-explorer-level\{[^}]*overflow-wrap:normal;word-break:normal/);
  assert.match(html, /game\.id==='riddles'&&currentLanguage==='ru'&&i===4\?' riddle-explorer-level'/);
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
    assert.equal(dataContext.introVisuals[id].length, 3, `${id} demo scenes`);
    assert.ok(dataContext.introVisuals[id].every((scene) => scene.length >= 4), `${id} demo visuals`);
  }
  for (const [language, copy] of Object.entries(dataContext.introCopy)) {
    assert.match(copy.escapeRoom[1], /key|מפתח|ключ/i, `${language} explains the hidden-key clue`);
    assert.match(copy.escapeRoom[3], /key|מפתח|ключ/i, `${language} explains that riddles reveal key clues`);
    assert.match(copy.escapeRoom[4], /click|לחצו|нажимай/i, `${language} explains clicking room objects`);
    assert.match(copy.puzzle[1], /swap|להחליף|поменять/i, `${language} explains swapping puzzle pieces`);
    assert.match(copy.logicQuest[4], /three clues|שלושת הרמזים|трёх подсказки|все три подсказки/i, `${language} describes the three logic clues`);
    assert.match(copy.words[3], /answer choices|אפשרויות מציגות|варианты ответа/i, `${language} explains the word choices`);
    assert.match(copy.wordSearch[4], /neighboring|סמוכות|соседние/i, `${language} explains selecting neighboring letters`);
  }
  assert.equal(dataContext.introVisuals.puzzle[0].length, 6, 'puzzle demo shows six pieces rather than an empty-space sliding puzzle');
  assert.ok(dataContext.introVisuals.puzzle[1].includes('↔️'), 'puzzle demo shows the actual swap action');
  assert.equal(dataContext.introVisuals.logicQuest[1].filter((token) => token === '➡️').length, 3, 'logic demo shows three ordering clues');
  assert.deepEqual(Array.from(dataContext.introVisuals.words[0].slice(0, 3)), ['T', 'C', 'A'], 'word builder demo starts with scrambled letters');
  assert.ok(dataContext.introVisuals.words[1].includes('CAT'), 'word builder demo shows answer choices');
  assert.ok(dataContext.introVisuals.wordSearch[0].includes('📋') && dataContext.introVisuals.wordSearch[0].includes('CAT'), 'word-search demo shows a word list beside the letter grid');
  assert.ok(dataContext.introVisuals.escapeRoom[1].filter((token) => token === '💡').length >= 5, 'demo shows clues accumulating across five riddles');
  for (const object of ['🕰️', '📚', '🖼️', '🧰', '🗄️', '🏺', '🪴', '🟪']) {
    assert.ok(dataContext.introVisuals.escapeRoom[2].includes(object), `demo room includes ${object}`);
  }
  assert.ok(dataContext.introVisuals.escapeRoom[2].includes('🗝️'), 'demo shows finding the key after searching');
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

test('word search boards mix horizontal, vertical and diagonal words at every level', () => {
  const engineStart = html.indexOf('const WORD_SEARCH_LEVELS=');
  const engineEnd = html.indexOf('function renderWordSearchGame()', engineStart);
  assert.ok(engineStart >= 0 && engineEnd > engineStart);
  let seed = 72419;
  const math = Object.create(Math);
  math.random = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
  const context = vm.createContext({ currentLanguage: 'en', Math: math });
  vm.runInContext(`${html.slice(engineStart, engineEnd)}\nglobalThis.testLevels=WORD_SEARCH_LEVELS;`, context);
  for (const language of ['en', 'he', 'ru']) {
    assert.match(textForLanguage(language).wordSearchPrompt, /horizontal|אופקית|горизонтали/i);
    assert.match(textForLanguage(language).wordSearchPrompt, /diagonally|באלכסון|диагонали/i);
    context.currentLanguage = language;
    for (let activity = 0; activity < 12; activity++) for (let level = 0; level < 6; level++) {
      const puzzle = context.createWordSearchPuzzle(activity, level);
      const directions = new Set(puzzle.words.map(({ cells }) => {
        const first = cells[0], second = cells[1];
        const dx = second % puzzle.size - first % puzzle.size;
        const dy = Math.floor(second / puzzle.size) - Math.floor(first / puzzle.size);
        return dy === 0 ? 'horizontal' : dx === 0 ? 'vertical' : 'diagonal';
      }));
      assert.deepEqual([...directions].sort(), ['diagonal', 'horizontal', 'vertical'], `${language} activity ${activity + 1}, level ${level + 1}`);
    }
  }
  assert.deepEqual(Array.from(context.testLevels, config => config.directions.length), Array(6).fill(8));
});

test('multi-stage games expose resume controls and restore saved activity state', () => {
  const gameSource = slice('const MINI_GAMES=[', 'const ACTIVITY_NAMES=');
  const progressStart = html.indexOf('const miniGameProgress=new Map();');
  const progressEnd = html.indexOf('function gameUnlocked(id){', progressStart);
  assert.ok(progressStart >= 0 && progressEnd > progressStart);
  const captureSource = html.slice(progressStart, progressEnd);
  for (const match of gameSource.matchAll(/id:'([^']+)'/g)) {
    if (match[1] !== 'coloring') assert.ok(captureSource.includes(`'${match[1]}'`), `${match[1]} checkpoint support`);
  }
  assert.match(html, /continueGameProgress:'Continue \{activity\}'/);
  assert.match(html, /continueGameProgress:'המשך ב־\{activity\}'/);
  assert.match(html, /continueGameProgress:'Продолжить: \{activity\}'/);

  const gameContent = { innerHTML: 'Question 4', className: 'quiz' };
  const feedback = { classList: { contains: () => false } };
  const context = vm.createContext({
    $: (selector) => selector === '#gameContent' ? gameContent : feedback,
    closeM() {},
    showGameFeedback() {},
  });
  vm.runInContext(`let selectedMiniGame='math',selectedLevel=3,miniGameScene='play';
    let genericAnswer='12',riddleQuestionIndex=4,questionHintCount=1,gameFeedbackAction=null;
    let selectedPathLevel=0,selectedBoxLevel=2,selectedRailwayLevel=0,selectedWordSearchLevel=0,selectedMagneticStage=0;
    let interactivePuzzle={turns:7,walls:new Set(['2,3'])},puzzleTiles=[],puzzleImage='',puzzleSelected=-1,puzzleImages=[],puzzleImageIndex=0;
    let differenceFound=new Set(),differenceSpots=[],differenceLeft=[],differenceRight=[];
    let traceLetterIndex=0,traceDistance=0,traceHasInk=false,memoryCards=[],memoryOpen=[],memoryMatched=new Set();
    let escapeRoomIndex=0,escapeRoomSolved=false,escapeRoomStarEarned=false,escapeRoomAnswer='',escapeRoomAnswerIndex=-1,escapeRoomExplanation='',escapeRoomPhase='riddles',escapeKeyFound=false,escapeKeyFeedback='';
    let wordSearchPuzzle=null,magneticMaze=null;
    function go(id){globalThis.lastScreen=id}
    ${captureSource}
    globalThis.saveProgress=saveMiniGameProgress;
    globalThis.restoreProgress=restoreMiniGameProgress;
  `, context);
  context.saveProgress();
  vm.runInContext(`riddleQuestionIndex=8;genericAnswer='changed';questionHintCount=0;`, context);
  gameContent.innerHTML = 'Different game';
  assert.equal(context.restoreProgress('math', 3), true);
  assert.equal(vm.runInContext('riddleQuestionIndex', context), 4);
  assert.equal(vm.runInContext('genericAnswer', context), '12');
  assert.equal(vm.runInContext('questionHintCount', context), 1);
  assert.equal(gameContent.innerHTML, 'Question 4');
  assert.equal(context.lastScreen, 'gameStage');

  vm.runInContext(`selectedMiniGame='gridSokoban';selectedLevel=2;miniGameScene='play';interactivePuzzle={turns:9,walls:new Set(['3,4'])};`, context);
  gameContent.innerHTML = 'Sokoban board';
  context.saveProgress();
  vm.runInContext(`interactivePuzzle.turns=0;interactivePuzzle.walls.clear();`, context);
  assert.equal(context.restoreProgress('gridSokoban', 2, 1), false, 'a different stage starts fresh');
  assert.equal(context.restoreProgress('gridSokoban', 2, 2), true);
  assert.equal(vm.runInContext('interactivePuzzle.turns', context), 9);
  assert.deepEqual(Array.from(vm.runInContext('interactivePuzzle.walls', context)), ['3,4']);
});

test('pattern activities use symbols that match each activity theme', () => {
  const context = vm.createContext({ Math });
  const patternSource = slice('const PATTERN_THEMES=', 'function getLogicQuestion(');
  vm.runInContext(`${patternSource}\nglobalThis.patternThemes=PATTERN_THEMES;globalThis.makePatternQuestion=getPatternQuestion;`, context);
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
  for (let activity = 0; activity < themes.length; activity++) for (let question = 0; question < 10; question++) {
    const result = context.makePatternQuestion(activity, question);
    const sequence = result.question.trim().split(/\s+/).slice(0, 8);
    assert.ok(sequence.every(symbol => themes[activity].includes(symbol)), `activity ${activity + 1}, question ${question + 1} sequence`);
    assert.ok(themes[activity].includes(result.answer), `activity ${activity + 1}, question ${question + 1} answer`);
    assert.ok(result.options.every(option => themes[activity].includes(option)), `activity ${activity + 1}, question ${question + 1} options`);
  }
});

test('pastel background is applied across screens and cached for offline use', async () => {
  assert.match(html, /body\{[^}]*background:#fff7e6 url\('\.\/images\/magical-fun-background\.png'\)/);
  assert.match(html, /\.screen:not\(#welcome\)\{background-color:rgba\(255,247,230,\.15\)\}/);
  assert.match(html, /@media\(min-aspect-ratio:1\/1\)\{body\{background-size:100% 100%;background-color:#fff7e6\}\}/);
  assert.match(html, /#welcome\{[^}]*background:radial-gradient\([^}]*#ffffff22/i);
  assert.match(html, /#cv\{[^}]*background:#fff/);
  assert.match(html, /\.interactive-puzzle\{[^}]*background:#fff/);
  assert.match(serviceWorker, /magical-fun-shell-v22/);
  assert.match(serviceWorker, /new URL\('images\/magical-fun-background\.png',APP_ROOT\)\.href/);
  await access(new URL('../images/magical-fun-background.png', import.meta.url));
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
  assert.match(html, /\.paint-canvas-wrap\{[^}]*grid-column:1[^}]*width:min\(100%,400px\)[^}]*aspect-ratio:1/);
  assert.doesNotMatch(html, /\.paint-canvas-wrap\{[^}]*52dvh/);
  assert.match(html, /\.paint-workspace\{display:grid[^}]*grid-template-columns:minmax\(0,1fr\) minmax\(76px,128px\)/);
  assert.match(html, /\.paint-actions button\{margin:0;padding:6px 4px;font-size:12px/);
  assert.match(html, /\.paint-actions\{grid-column:2;grid-row:4\/span 3;flex-direction:column[^}]*gap:3px/);

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

test('coloring picture navigation is below the canvas and translated', () => {
  const paint = slice('<div id="paint" class="screen center">', '<div id="camera"');
  assert.ok(paint.indexOf('id="cvWrap"') < paint.indexOf('id="paintItemNav"'));
  assert.match(html, /\.paint-item-nav\{[^}]*grid-column:1[^}]*flex-wrap:nowrap[^}]*width:min\(100%,400px\)/);
  assert.match(html, /\.paint-item-nav button\{[^}]*flex:1 1 0[^}]*min-width:0[^}]*white-space:nowrap/);
  assert.ok(paint.indexOf('id="paintItemNav"') < paint.indexOf('onclick="zm.by(1.4)"'));
  assert.match(paint, /id="paintPrevItem"[^>]*onclick="navItem\(-1\)"[^>]*data-i18n="previousColoringPicture"/);
  assert.match(paint, /id="paintNextItem"[^>]*onclick="navItem\(1\)"[^>]*data-i18n="nextColoringPicture"/);
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

test('Sokoban, path and code-breaker success feedback is shown in a popup', () => {
  const render = slice('function renderInteractivePuzzle()', 'function showInteractiveHint()');
  assert.match(render, /if\(interactivePuzzle\.won\)\s*\{\s*showGameFeedback/);
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
