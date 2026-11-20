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

function authContext({ language = 'he', signUp, resetPasswordForEmail, updateUser } = {}) {
  const elements = new Map();
  const get = (selector) => {
    if (!elements.has(selector)) elements.set(selector, {
      value: selector === '#aEmail' ? 'parent@example.com' : selector === '#aPassword' ? 'password123' : 'Child',
      textContent: '', disabled: false, hidden: false, required: false, checked: false, style: {}, autocomplete: '',
      attributes: new Set(), focused: false,
      setAttribute(name) { this.attributes.add(name); },
      removeAttribute(name) { this.attributes.delete(name); },
      focus() { this.focused = true; },
    });
    return elements.get(selector);
  };
  const context = vm.createContext({
    $, currentLanguage: language,
    supabaseClient: signUp || resetPasswordForEmail || updateUser ? {
      auth: { signUp, resetPasswordForEmail, updateUser },
    } : null,
    authBusy: false, amode: 'reg', location: { origin: 'https://example.test', protocol: 'https:', hostname: 'example.test' },
    console: { error() {} },
  });
  function $(selector) { return get(selector); }
  vm.runInContext(source('const TEXT=', "let currentLanguage='en';"), context);
  vm.runInContext(source('function tr(', 'function launchFreeDrawFromStudio('), context);
  vm.runInContext(source("let amode='login'", 'async function logout()'), context);
  vm.runInContext("amode='reg'", context);
  return { context, elements };
}

test('duplicate registration response explains that the email is already registered', async () => {
  const { context, elements } = authContext({
    signUp: async () => ({ data: { user: { identities: [] }, session: null }, error: null }),
  });
  context.$('#aConsent').checked = true;
  await context.authGo();
  assert.match(elements.get('#aEmailErr').textContent, /המייל הזה כבר נרשם/);
  assert.equal(elements.get('#aErr').textContent, '');
});

test('legal consent is shown and required only during registration', () => {
  const { context, elements } = authContext();
  context.authForm('reg');
  assert.equal(elements.get('#registrationConsent').hidden, false);
  assert.equal(elements.get('#aConsent').required, true);
  context.authForm('login');
  assert.equal(elements.get('#registrationConsent').hidden, true);
  assert.equal(elements.get('#aConsent').required, false);
});

test('registration is blocked until legal consent is checked', async () => {
  let submitted = false;
  const { context, elements } = authContext({
    signUp: async () => {
      submitted = true;
      return { data: { user: null, session: null }, error: null };
    },
  });
  await context.authGo();
  assert.equal(submitted, false);
  assert.match(elements.get('#aConsentErr').textContent, /יש לאשר את תנאי השימוש/);
  assert.equal(elements.get('#aConsent').attributes.has('aria-invalid'), true);
});

test('registration does not request or submit a child nickname', async () => {
  let request;
  const { context, elements } = authContext({
    signUp: async (...args) => {
      request = args;
      return { data: { user: { identities: [{ id: 'identity-1' }] }, session: null }, error: null };
    },
  });
  context.$('#aConsent').checked = true;
  await context.authGo();
  assert.equal(elements.has('#aName'), false);
  assert.equal(request[0].email, 'parent@example.com');
  assert.equal(request[0].password, 'password123');
  assert.equal(request[0].options.emailRedirectTo, 'https://example.test');
  assert.deepEqual(Object.keys(request[0].options), ['emailRedirectTo']);
  assert.match(elements.get('#aErr').textContent, /בדקו את האימייל ואשרו/);
});

test('auth errors refresh in the currently selected language', () => {
  const { context, elements } = authContext();
  context.setAuthError('email', 'emailInUse');
  context.currentLanguage = 'ru';
  context.renderAuthError();
  assert.match(elements.get('#aEmailErr').textContent, /уже зарегистрирован/);
  assert.equal(elements.get('#aEmail').attributes.has('aria-invalid'), true);
});

test('unavailable account service does not falsely claim the email is registered', async () => {
  const { context, elements } = authContext();
  context.$('#aConsent').checked = true;
  await context.authGo();
  assert.match(elements.get('#aErr').textContent, /לא ניתן לבדוק אם המייל רשום/);
  assert.doesNotMatch(elements.get('#aErr').textContent, /כבר נרשם/);
});

test('password reset request sends an email and shows localized neutral confirmation', async () => {
  let request;
  const { context, elements } = authContext({
    resetPasswordForEmail: async (...args) => { request = args; return { error: null }; },
  });
  await context.requestPasswordReset();
  assert.equal(request[0], 'parent@example.com');
  assert.equal(request[1].redirectTo, 'https://example.test');
  assert.match(elements.get('#aStatus').textContent, /אם קיים חשבון.*נשלח אליו קישור/);
  assert.equal(elements.get('#aStatus').hidden, false);
});

test('password reset uses the published app as redirect from a local preview', async () => {
  let request;
  const { context } = authContext({
    resetPasswordForEmail: async (...args) => { request = args; return { error: null }; },
  });
  context.location = { protocol: 'http:', hostname: '127.0.0.1', origin: 'http://127.0.0.1:5500' };
  await context.requestPasswordReset();
  assert.equal(request[1].redirectTo, 'https://megical-fun.vercel.app/');
});

test('password recovery switches to a new-password form and updates the account', async () => {
  let updated;
  const { context, elements } = authContext({
    updateUser: async (input) => { updated = input; return { data: { user: { id: 'user-1', email: 'parent@example.com' } }, error: null }; },
  });
  context.showPasswordRecovery();
  assert.equal(elements.get('#authEmailGroup').hidden, true);
  assert.equal(elements.get('#passwordRecoveryTitle').hidden, false);
  assert.equal(elements.get('#forgotPasswordButton').hidden, true);
  elements.get('#aPassword').value = 'newPassword123';
  context.enterAccount = async (user) => { context.accountEntered = user.id; };
  await context.authGo();
  assert.equal(updated.password, 'newPassword123');
  assert.equal(context.accountEntered, 'user-1');
});

test('password recovery callback is recognized in query or hash before normal account entry', () => {
  const context = vm.createContext({ URLSearchParams });
  vm.runInContext(source('function isPasswordRecoveryCallback(', 'async function initializeAuth()'), context);
  assert.equal(context.isPasswordRecoveryCallback({ search: '?type=recovery', hash: '' }), true);
  assert.equal(context.isPasswordRecoveryCallback({ search: '', hash: '#access_token=secret&type=recovery' }), true);
  assert.equal(context.isPasswordRecoveryCallback({ search: '?flow=password-reset', hash: '' }), true);
  assert.equal(context.isPasswordRecoveryCallback({ search: '?type=signup', hash: '' }), false);
  const initialize = source('async function initializeAuth()', '/* ---------- coloring items ---------- */');
  assert.ok(initialize.indexOf('if(recoveryCallback){') < initialize.indexOf('if(data.session&&!authChoiceMade)'));
});

test('authentication action buttons share the same full-width sizing', () => {
  assert.match(html, /#auth>button\{width:100%;margin:6px 0\}/);
  assert.match(html, /#auth \.err:empty\{display:none;min-height:0;margin:0\}/);
});
