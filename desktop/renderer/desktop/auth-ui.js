(function () {
  'use strict';
  var gate = document.getElementById('desktopAuthGate');
  var form = document.getElementById('desktopAuthForm');
  var message = document.getElementById('desktopAccessMessage');
  var status = document.getElementById('authStatus');
  var email = document.getElementById('authEmail');
  var password = document.getElementById('authPassword');
  var confirmField = document.getElementById('confirmField');
  var confirmPassword = document.getElementById('authPasswordConfirm');
  var submit = document.getElementById('authSubmit');
  var google = document.getElementById('googleSignIn');
  var tabSignin = document.getElementById('tabSignin');
  var tabSignup = document.getElementById('tabSignup');
  var appShell = document.querySelector('main.app');
  var mode = 'signin';
  if (!gate || !window.CytomoveAuth || !window.cytomoveDesktop) return;

  function setStatus(text, error) {
    status.hidden = !text;
    status.textContent = text || '';
    status.classList.toggle('error', Boolean(error));
  }
  function authErrorMessage(error) {
    var text = error && error.message || String(error);
    if (/timed out/i.test(text)) {
      return 'Access check timed out. Check your internet connection and try again.';
    }
    if (/did not return to Cytomove|did not return a code|authorization code/i.test(text)) {
      return 'Google sign-in did not return to Cytomove. Make sure Supabase Redirect URLs include http://localhost:54545, then try again.';
    }
    if (/helper could not start|EADDRINUSE|already running/i.test(text)) {
      return 'Google sign-in helper could not start on localhost:54545. Fully close Cytomove, reopen it, and try Continue with Google again.';
    }
    if (/invalid login credentials/i.test(text)) {
      return 'Email or password is incorrect. If this account was created with Google, use Continue with Google.';
    }
    return text;
  }
  function setLocked(locked) {
    gate.hidden = !locked;
    appShell?.classList.toggle('desktop-auth-locked', locked);
  }
  function setMode(next) {
    mode = next;
    var signup = mode === 'signup';
    tabSignin.classList.toggle('active', !signup);
    tabSignup.classList.toggle('active', signup);
    confirmField.hidden = !signup;
    submit.textContent = signup ? 'Create account' : 'Sign in';
    password.autocomplete = signup ? 'new-password' : 'current-password';
    setStatus('');
  }
  function payloadFromSession(session) {
    return {
      accessToken: session && session.access_token || '',
      userId: session && session.user && session.user.id || '',
      email: session && session.user && session.user.email || ''
    };
  }
  function notifyAuthState(session, decision) {
    window.dispatchEvent(new CustomEvent('cytomove:auth-state-changed', {
      detail: {
        signedIn: Boolean(session && session.user),
        approved: Boolean(decision && decision.allowed),
        email: session && session.user && session.user.email || '',
        label: decision && decision.allowed ? 'Academic access' : 'Sign in required'
      }
    }));
  }
  function renderDecision(decision) {
    if (decision.allowed) {
      setLocked(false);
      if (decision.source === 'offline-grace') {
        var hours = Math.max(1, Math.ceil((decision.remainingMs || 0) / 3600000));
        message.textContent = 'Offline academic access: ' + hours + ' hour(s) remaining.';
      } else message.textContent = 'Approved academic access.';
      return true;
    }
    setLocked(true);
    if (decision.reason === 'grace-expired') {
      message.textContent = 'The 72-hour offline access window has expired. Connect to the internet and sign in again.';
    } else if (decision.reason === 'academic-not-approved') {
      message.textContent = 'Your sign-in succeeded, but this account is still waiting for academic approval.';
    } else if (decision.reason === 'missing-session') {
      message.textContent = 'Sign in to continue with an approved academic account.';
    } else {
      message.textContent = 'A verified and approved academic account is required.';
    }
    if (decision.error) setStatus(decision.error, true);
    return false;
  }
  async function validateCurrentSession() {
    var session = await window.CytomoveAuth.getSession();
    var decision = await window.cytomoveDesktop.validateAcademicAccess(payloadFromSession(session));
    renderDecision(decision);
    notifyAuthState(session, decision);
    return decision;
  }
  async function submitAuth() {
    submit.disabled = true;
    setStatus('Checking access...');
    try {
      if (mode === 'signup') {
        if (password.value !== confirmPassword.value) throw new Error('Passwords do not match.');
        var signup = await window.CytomoveAuth.signUpWithPassword(email.value.trim(), password.value);
        if (signup.error) throw signup.error;
        setMode('signin');
        setStatus('Account created. Verify your email, then sign in.');
      } else {
        var signin = await window.CytomoveAuth.signInWithPassword(email.value.trim(), password.value);
        if (signin.error) throw signin.error;
        await validateCurrentSession();
      }
    } catch (error) {
      setStatus(authErrorMessage(error), true);
    } finally {
      submit.disabled = false;
    }
  }
  function delay(ms) {
    return new Promise(function (resolve) { setTimeout(resolve, ms); });
  }
  async function waitForGoogleLoopbackReady() {
    var lastError = null;
    for (var attempt = 0; attempt < 20; attempt += 1) {
      try {
        await fetch('http://localhost:54545', { method: 'GET', mode: 'no-cors', cache: 'no-store' });
        return true;
      } catch (error) {
        lastError = error;
        await delay(50);
      }
    }
    throw new Error('Google sign-in helper could not start on localhost:54545' + (lastError ? ': ' + lastError.message : '.'));
  }
  async function googleSignIn() {
    google.disabled = true;
    try {
      setStatus('Preparing Google sign-in...');
      var client = await window.CytomoveAuth.getClient();
      var response = await client.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: 'http://localhost:54545',
          skipBrowserRedirect: true,
          queryParams: { prompt: 'select_account' }
        }
      });
      if (response.error) throw response.error;
      var callbackPromise = window.cytomoveDesktop.awaitGoogleCallback();
      await waitForGoogleLoopbackReady();
      await window.cytomoveDesktop.openExternal(response.data.url);
      setStatus('Opened Google in your browser. Waiting for sign-in to return to Cytomove...');
      var callback = new URL(await callbackPromise);
      var code = callback.searchParams.get('code');
      if (!code) throw new Error(callback.searchParams.get('error_description') || 'Google sign-in did not return a code.');
      var exchange = await client.auth.exchangeCodeForSession(code);
      if (exchange.error) throw exchange.error;
      await validateCurrentSession();
    } catch (error) {
      setStatus(authErrorMessage(error), true);
    } finally {
      google.disabled = false;
    }
  }
  tabSignin.addEventListener('click', function () { setMode('signin'); });
  tabSignup.addEventListener('click', function () { setMode('signup'); });
  submit.addEventListener('click', submitAuth);
  google.addEventListener('click', googleSignIn);
  window.addEventListener('cytomove:desktop-signout', async function () {
    try { await window.CytomoveAuth.signOut(); } catch (_) {}
    try { window.CytomoveAuth.clearLocalAuthStorage(); } catch (_) {}
    await window.cytomoveDesktop.clearAcademicAccess();
    window.dispatchEvent(new CustomEvent('cytomove:auth-state-changed', {
      detail: { signedIn: false, approved: false, email: '', label: 'Not signed in' }
    }));
    setLocked(true);
  });
  setMode('signin');
  setLocked(true);
  validateCurrentSession().catch(function (error) { setStatus(error.message || String(error), true); });
}());
