import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');

test('child profile defaults have no age and age selection accepts only supported ranges', () => {
  const start = html.indexOf('function defaultUserData(name){');
  const end = html.indexOf('const CHILD_AGE_BANDS=', start);
  assert.ok(start >= 0 && end > start);
  const context = vm.createContext({
    currentLanguage: 'he',
  });
  vm.runInContext(html.slice(start, end), context);
  assert.equal(context.defaultUserData('Child').childAgeBand, null);
  const bandsStart=html.indexOf('const CHILD_AGE_BANDS='),bandsEnd=html.indexOf('function withTimeout(',bandsStart);
  vm.runInContext(html.slice(bandsStart,bandsEnd),context);
  const selectStart=html.indexOf('function selectChildAgeBand('),selectEnd=html.indexOf('function setChildProfileForm(',selectStart);
  const buttons=new Map(['6to7','8to9','10to11'].map(id=>[id,{classList:{toggle(name,enabled){this[name]=enabled},remove(){}},setAttribute(name,value){this[name]=value}}]));
  context.$=selector=>buttons.get(selector.replace('#childAge',''));
  vm.runInContext(html.slice(selectStart,selectEnd),context);
  context.selectChildAgeBand('8-9');
  assert.equal(vm.runInContext('selectedChildAgeBand',context),'8-9');
  assert.equal(buttons.get('8to9').classList.on,true);
  assert.equal(buttons.get('8to9')['aria-pressed'],'true');
  assert.throws(()=>context.selectChildAgeBand('7-8'),/Invalid child age range/);
  const navigationStart=html.indexOf('function go(id){'),navigationEnd=html.indexOf('/* ---------- onboarding ---------- */',navigationStart);
  assert.match(html.slice(navigationStart,navigationEnd),/currentAuthUserId&&!currentChildId&&!\['childPicker','childProfile'\]/);
  assert.match(html,/id="childNickname"/);
  assert.match(html,/create_user_child/);
});

test('child age bands map to the matching game difficulty levels', () => {
  const start = html.indexOf('function childDifficultyLevel('), end = html.indexOf('function withTimeout(', start);
  assert.ok(start >= 0 && end > start);
  const context = vm.createContext({});
  vm.runInContext(html.slice(start, end), context);
  for (const [ageBand, level] of [['6-7', 1], ['8-9', 2], ['10-11', 3]]) {
    assert.equal(context.childDifficultyLevel(ageBand), level);
  }
  assert.throws(() => context.childDifficultyLevel('7-8'), /Unknown child age band/);
});

test('the age screen and all three ranges are translated in supported languages', () => {
  for (const language of ['en', 'he', 'ru']) {
    for (const message of ['childProfilesTitle','childProfilesPrompt','addChildProfile','manageChildProfiles','editChildProfile','childNicknameLabel','childAgePrompt','childAge6to7','childAge8to9','childAge10to11']) {
      assert.match(html, new RegExp(`Object\\.assign\\(TEXT\\.${language},\\{[^}]*${message}:`));
    }
  }
});

test('the shared account header precedes every app screen', () => {
  const header = html.indexOf('<header id="top"');
  assert.ok(header >= 0);
  for (const screen of ['childPicker', 'childProfile', 'games']) {
    assert.ok(header < html.indexOf(`<div id="${screen}"`));
  }
});
