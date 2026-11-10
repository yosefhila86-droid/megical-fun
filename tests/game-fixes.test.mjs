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

test('every traced English, Hebrew, and Russian letter has writing-direction strokes', () => {
  const directions = vm.createContext({});
  vm.runInContext(slice('const TRACE_STROKES=', 'let traceLetterIndex=0,traceDistance=0;'), directions);
  vm.runInContext(slice('const TRACE_LETTERS=', 'function activityNames('), directions);
  const missing = [];
  const drawing = { arrows: 0 };
  const canvas = { getContext: () => ({
    clearRect() {}, beginPath() {}, moveTo() {}, lineTo() {}, stroke() {},
    closePath() {}, fill() { drawing.arrows++; },
  }) };
  vm.runInContext('globalThis.drawAllTraceDirections=(canvas,letter)=>drawTraceDirections(canvas,letter)', directions);
  for (const language of ['en', 'he', 'ru']) {
    for (const letter of vm.runInContext(`traceLetterGroups('${language}').flat()`, directions)) {
      const hasStrokes = vm.runInContext(`Boolean(TRACE_STROKES[${JSON.stringify(letter)}])`, directions);
      if (!hasStrokes) missing.push(`${language}:${letter}`);
      else {
        const before = drawing.arrows;
        directions.drawAllTraceDirections(canvas, letter);
        if (drawing.arrows === before) missing.push(`${language}:${letter} (no arrow)`);
      }
    }
  }
  assert.deepEqual(missing, []);
  assert.match(html, /id="traceDirections" class="trace-directions"/);
  assert.match(slice('let traceLetterIndex=0', 'function clearTrace()'), /drawTraceDirections\(\$\('#traceDirections'\),letter\)/);
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
      assert.ok(result.question.en);
      assert.ok(result.question.he);
      assert.ok(result.question.ru);
      assert.ok(result.options.includes(result.answer));
      assert.doesNotMatch(result.question.he, /[A-Za-zА-Яа-яЁё־—]/u, `activity ${activity}, question ${question}`);
      prompts.push(result.question.en);
    }
    assert.equal(new Set(prompts).size, 10, `activity ${activity} repeats a story`);
  }

  for (let question = 0; question < 10; question++) {
    const prompt = vm.runInContext(`getStoryMathQuestion(3,${question}).question.en`, context).toLowerCase();
    assert.doesNotMatch(prompt, /basket|used|share|pack|collect/);
  }
  assert.match(vm.runInContext('getStoryMathQuestion(3,1).question.en', context), /flew away/);
  assert.match(vm.runInContext('getStoryMathQuestion(3,2).question.en', context), /garden areas/);
  assert.match(vm.runInContext('getStoryMathQuestion(3,3).question.en', context), /journal/);
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

test('code-breaker success feedback is rendered above the board and scrolls into view', () => {
  const renderer = slice('function renderInteractivePuzzle(){', 'function showInteractiveHint(){');
  assert.match(renderer, /const topSuccess=\['physicsPaths','gridSokoban','codeBreaker'\]\.includes\(id\)/);
  assert.match(renderer, /<h2>[\s\S]*?\$\{interactiveGamePrompt\(id\)\}<\/p>\$\{topSuccess\?success:''\}<section/);
  assert.match(renderer, /if\(topSuccess&&interactivePuzzle\.won\)\$\('#gameStage'\)\.scrollTop=0/);
});

test('pastel background is applied across screens and cached for offline use', async () => {
  assert.match(html, /body\{[^}]*background:#fff7e6 url\('\.\/images\/magical-fun-background\.png'\)/);
  assert.match(html, /\.screen:not\(#welcome\)\{background-color:rgba\(255,247,230,\.15\)\}/);
  assert.match(html, /@media\(min-aspect-ratio:1\/1\)\{body\{background-size:auto 100%/);
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
  assert.match(html, /\.paint-canvas-wrap\{[^}]*width:min\(92vw,400px\)[^}]*height:min\(92vw,400px\)/);
  assert.doesNotMatch(html, /\.paint-canvas-wrap\{[^}]*52dvh/);
  assert.match(html, /@media\(min-width:760px\)\{[\s\S]*grid-template-columns:minmax\(0,400px\) minmax\(150px,180px\)[\s\S]*\.paint-actions\{grid-column:2;grid-row:4\/span 3;flex-direction:column/);

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
  assert.match(html, /\.paint-item-nav\{[^}]*flex-wrap:nowrap[^}]*width:min\(92vw,400px\)/);
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

test('Sokoban, path and code-breaker success feedback is shown above the board and resets scroll', () => {
  const render = slice('function renderInteractivePuzzle()', 'function showInteractiveHint()');
  assert.ok(render.indexOf("${topSuccess?success:''}") < render.indexOf('<section class="interactive-puzzle'));
  assert.match(render, /const topSuccess=\['physicsPaths','gridSokoban','codeBreaker'\]\.includes\(id\)/);
  assert.match(render, /\$\{topSuccess\?'':success\}/);
  assert.match(render, /if\(topSuccess&&interactivePuzzle\.won\)\$\('#gameStage'\)\.scrollTop=0/);
  assert.match(html, /\.sokoban-success\{[^}]*background:#d8fff2[^}]*text-align:center/);
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
