// Desktop auth: MANDATORY sign-in gate. The app is blocked until a verified
// academic account is signed in. Email/password works in-app; Google uses the
// system browser + a localhost loopback (PKCE) captured by the main process.
(function () {
  'use strict';

  var isDesktop = !!(window.cytomoveDesktop && typeof window.cytomoveDesktop.openExternal === 'function');
  var LOOPBACK_REDIRECT = 'http://localhost:54545';

  // Topbar account menu
  var signInPill = document.getElementById('signInPill');
  var accountMenu = document.getElementById('accountMenu');
  var accountBtn = document.getElementById('accountBtn');
  var accountDropdown = document.getElementById('accountDropdown');
  var accountAvatar = document.getElementById('accountAvatar');
  var accountBtnEmail = document.getElementById('accountBtnEmail');
  var ddEmail = document.getElementById('ddEmail');
  var ddStatus = document.getElementById('ddStatus');
  var manageWebBtn = document.getElementById('manageWebBtn');
  var signOutBtn = document.getElementById('signOutBtn');

  // Gate / modal
  var backdrop = document.getElementById('authModalBackdrop');
  var authForm = document.getElementById('authForm');
  var authPending = document.getElementById('authPending');
  var pendingEmail = document.getElementById('pendingEmail');
  var recheckBtn = document.getElementById('recheckBtn');
  var pendingSignOut = document.getElementById('pendingSignOut');
  var tabSignup = document.getElementById('tabSignup');
  var tabSignin = document.getElementById('tabSignin');
  var confirmField = document.getElementById('confirmField');
  var authEmail = document.getElementById('authEmail');
  var authPassword = document.getElementById('authPassword');
  var authPasswordConfirm = document.getElementById('authPasswordConfirm');
  var passwordHint = document.getElementById('passwordHint');
  var passwordMatch = document.getElementById('passwordMatch');
  var strengthFill = document.getElementById('passwordStrengthFill');
  var strengthLabel = document.getElementById('passwordStrengthLabel');
  var authSubmit = document.getElementById('authSubmit');
  var googleSignIn = document.getElementById('googleSignIn');
  var authStatus = document.getElementById('authStatus');
  var appShell = document.querySelector('main.app');

  if (!backdrop || !window.CytomoveAuth) return;

  var mode = 'signup';

  function setStatus(message, isError) {
    authStatus.hidden = false;
    authStatus.textContent = message;
    authStatus.classList.toggle('error', !!isError);
  }
  function clearStatus() {
    authStatus.hidden = true;
    authStatus.textContent = '';
    authStatus.classList.remove('error');
  }

  // ----- password helpers -----
  function evaluatePassword() {
    var value = authPassword.value || '';
    var rules = { length: value.length >= 8, letter: /[a-zA-Z]/.test(value), number: /[0-9]/.test(value) };
    var met = 0;
    Object.keys(rules).forEach(function (key) {
      var elx = passwordHint.querySelector('[data-rule="' + key + '"]');
      if (!elx) return;
      if (rules[key]) { elx.classList.add('met'); met += 1; }
      else { elx.classList.remove('met'); }
    });
    var score = met + (value.length >= 12 ? 1 : 0);
    var label = 'Weak', color = 'var(--rose)', width = '33%';
    if (value.length === 0) { label = 'Weak'; width = '0'; }
    else if (score >= 4) { label = 'Strong'; color = 'var(--teal)'; width = '100%'; }
    else if (score === 3) { label = 'Good'; color = '#e0a800'; width = '66%'; }
    strengthFill.style.width = width;
    strengthFill.style.background = color;
    strengthLabel.textContent = label;
  }
  function checkMatch() {
    var confirm = authPasswordConfirm.value || '';
    if (!confirm) { passwordMatch.hidden = true; return false; }
    var ok = confirm === (authPassword.value || '');
    passwordMatch.hidden = false;
    passwordMatch.textContent = ok ? 'Passwords match' : 'Passwords do not match';
    passwordMatch.classList.toggle('ok', ok);
    passwordMatch.classList.toggle('bad', !ok);
    return ok;
  }

  authPassword.addEventListener('focus', function () {
    if (mode !== 'signup') return;
    passwordHint.hidden = false;
    evaluatePassword();
  });
  authPassword.addEventListener('input', function () {
    if (mode === 'signup') evaluatePassword();
    checkMatch();
  });
  authPassword.addEventListener('blur', function () { passwordHint.hidden = true; });
  authPasswordConfirm.addEventListener('input', checkMatch);

  // ----- mode -----
  function setMode(next) {
    mode = next;
    var signup = mode === 'signup';
    tabSignup.classList.toggle('active', signup);
    tabSignin.classList.toggle('active', !signup);
    tabSignup.setAttribute('aria-selected', signup ? 'true' : 'false');
    tabSignin.setAttribute('aria-selected', signup ? 'false' : 'true');
    confirmField.hidden = !signup;
    authSubmit.textContent = signup ? 'Create account' : 'Sign in';
    authPassword.setAttribute('autocomplete', signup ? 'new-password' : 'current-password');
    if (!signup) passwordHint.hidden = true;
    clearStatus();
  }
  tabSignup.addEventListener('click', function () { setMode('signup'); });
  tabSignin.addEventListener('click', function () { setMode('signin'); });

  // ----- gate visibility -----
  function lockApp() {
    backdrop.hidden = false;
    if (appShell) appShell.classList.add('auth-locked');
    if (accountMenu) accountMenu.hidden = true;
    if (signInPill) signInPill.hidden = true;
  }
  function unlockApp() {
    backdrop.hidden = true;
    if (appShell) appShell.classList.remove('auth-locked');
  }
  function showFormState() {
    authForm.hidden = false;
    authPending.hidden = true;
  }
  function showPendingState(email) {
    authForm.hidden = true;
    authPending.hidden = false;
    if (pendingEmail) pendingEmail.textContent = email || '';
  }

  function emailFromSnapshot(s) {
    return (s.profile && s.profile.email)
      || (s.session && s.session.user && s.session.user.email)
      || '';
  }

  function showAccountMenu(snapshot) {
    var email = emailFromSnapshot(snapshot);
    accountMenu.hidden = false;
    accountAvatar.textContent = email ? email.charAt(0) : '?';
    accountBtnEmail.textContent = email;
    ddEmail.textContent = email;
    ddStatus.textContent = 'Status: ' + (snapshot.label || 'Verified');
  }

  // The single source of truth: check access and gate accordingly.
  async function refreshAndGate() {
    try {
      if (!window.CytomoveAuth.isConfigured()) {
        lockApp(); showFormState();
        setStatus('Sign-in is not configured in this build.', true);
        return;
      }
      var snapshot = await window.CytomoveAuth.getAccessSnapshot();
      if (snapshot.approved) {
        unlockApp();
        showAccountMenu(snapshot);
        return;
      }
      lockApp();
      if (snapshot.signedIn) {
        showPendingState(emailFromSnapshot(snapshot));
      } else {
        showFormState();
      }
    } catch (error) {
      lockApp(); showFormState();
      setStatus((error && error.message) || String(error), true);
    }
  }

  // ----- email / password -----
  async function handleSignUp() {
    if ((authPassword.value || '').length < 8) {
      setStatus('Use a password with at least 8 characters.', true);
      authPassword.focus();
      return;
    }
    if (authPassword.value !== authPasswordConfirm.value) {
      setStatus('Passwords do not match. Please re-enter the same password in both fields.', true);
      authPasswordConfirm.focus();
      return;
    }
    var result = await window.CytomoveAuth.signUpWithPassword(authEmail.value.trim(), authPassword.value);
    if (result.error) throw result.error;
    setStatus('Account created. Open the verification link in your browser, then return and sign in.', false);
    setMode('signin');
  }
  async function handleSignIn() {
    var result = await window.CytomoveAuth.signInWithPassword(authEmail.value.trim(), authPassword.value);
    if (result.error) throw result.error;
    setStatus('Signed in. Checking access…', false);
    await refreshAndGate();
  }

  authSubmit.addEventListener('click', async function () {
    try {
      if (!window.CytomoveAuth.isConfigured()) { setStatus('Sign-in is not configured in this build.', true); return; }
      authSubmit.disabled = true;
      if (mode === 'signup') await handleSignUp();
      else await handleSignIn();
    } catch (error) {
      setStatus((error && error.message) || String(error), true);
    } finally {
      authSubmit.disabled = false;
    }
  });

  // ----- Google via localhost loopback (PKCE) -----
  googleSignIn.addEventListener('click', async function () {
    try {
      if (!window.CytomoveAuth.isConfigured()) { setStatus('Sign-in is not configured in this build.', true); return; }
      var client = await window.CytomoveAuth.getClient();

      if (isDesktop) {
        if (typeof window.cytomoveDesktop.awaitGoogleCallback !== 'function') {
          setStatus('Sign-in helper not loaded. Fully close the app (and end any leftover process in Task Manager), then run npm start again.', true);
          return;
        }
        googleSignIn.disabled = true;
        var res = await client.auth.signInWithOAuth({
          provider: 'google',
          options: { redirectTo: LOOPBACK_REDIRECT, skipBrowserRedirect: true }
        });
        if (res.error) throw res.error;
        var waitPromise = window.cytomoveDesktop.awaitGoogleCallback();
        await window.cytomoveDesktop.openExternal(res.data.url);
        setStatus('Opened Google in your browser. Waiting for sign-in to complete…', false);
        var cbUrl = await waitPromise;
        var u = new URL(cbUrl);
        var errDesc = u.searchParams.get('error_description');
        if (errDesc) throw new Error(errDesc);
        var code = u.searchParams.get('code');
        if (!code) throw new Error('Google did not return an authorization code.');
        var ex = await client.auth.exchangeCodeForSession(code);
        if (ex.error) throw ex.error;
        await refreshAndGate();
      } else {
        var r = await client.auth.signInWithOAuth({
          provider: 'google',
          options: { redirectTo: (window.CYTOMOVE_SUPABASE_CONFIG || {}).redirectTo }
        });
        if (r.error) throw r.error;
      }
    } catch (error) {
      setStatus((error && error.message) || String(error), true);
    } finally {
      googleSignIn.disabled = false;
    }
  });

  // ----- pending panel actions -----
  if (recheckBtn) {
    recheckBtn.addEventListener('click', async function () {
      recheckBtn.disabled = true;
      try { await refreshAndGate(); } finally { recheckBtn.disabled = false; }
    });
  }
  if (pendingSignOut) {
    pendingSignOut.addEventListener('click', async function () {
      pendingSignOut.disabled = true;
      try { await window.CytomoveAuth.signOut(); } catch (_e) {}
      await refreshAndGate();
      pendingSignOut.disabled = false;
    });
  }

  // ----- account menu (signed-in + approved) -----
  function closeDropdown() {
    accountDropdown.hidden = true;
    accountBtn.setAttribute('aria-expanded', 'false');
  }
  accountBtn.addEventListener('click', function (event) {
    event.stopPropagation();
    var willOpen = accountDropdown.hidden;
    accountDropdown.hidden = !willOpen;
    accountBtn.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
  });
  document.addEventListener('click', function (event) {
    if (accountMenu && !accountMenu.contains(event.target)) closeDropdown();
  });
  if (manageWebBtn) {
    manageWebBtn.addEventListener('click', function () {
      if (isDesktop) window.cytomoveDesktop.openExternal('https://cytomove.com/beta-gateway/?stay=1');
      closeDropdown();
    });
  }
  signOutBtn.addEventListener('click', async function () {
    signOutBtn.disabled = true;
    try { await window.CytomoveAuth.signOut(); } catch (_e) {}
    closeDropdown();
    await refreshAndGate();
    signOutBtn.disabled = false;
  });

  // Start locked to avoid any flash of the app before the check resolves.
  lockApp();
  showFormState();
  setMode('signup');
  refreshAndGate();
}());
