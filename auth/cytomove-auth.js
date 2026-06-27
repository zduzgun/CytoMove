(function () {
  var DEFAULT_APPROVED = ["academic_verified", "approved", "beta_approved"];
  var clientPromise = null;
  var cachedSnapshot = null;

  function config() {
    return window.CYTOMOVE_SUPABASE_CONFIG || {};
  }

  function isConfigured() {
    var cfg = config();
    return Boolean(cfg.url && cfg.anonKey && !/YOUR_/.test(cfg.url + cfg.anonKey));
  }

  function redirectTo() {
    return config().redirectTo || (window.location.origin + window.location.pathname);
  }

  function approvedStatuses() {
    return config().approvedStatuses || DEFAULT_APPROVED;
  }

  function normalizeEmailDomain(email) {
    var parts = String(email || "").toLowerCase().split("@");
    return parts.length === 2 ? parts[1] : "";
  }

  function academicSignalFromEmail(email) {
    var domain = normalizeEmailDomain(email);
    return (
      domain.endsWith(".edu") ||
      domain.indexOf(".edu.") !== -1 ||
      domain.indexOf(".ac.") !== -1 ||
      domain.endsWith(".ac.uk") ||
      domain.endsWith(".edu.tr") ||
      domain.endsWith(".edu.au")
    );
  }

  function statusLabel(status) {
    if (!status) return "Not registered";
    if (status === "email_verified") return "Academic access";
    if (approvedStatuses().indexOf(status) !== -1) return "Approved academic access";
    if (status === "manual_review") return "Manual review";
    if (status === "commercial_contact") return "Commercial licence review";
    return "Email verification required";
  }

  async function getClient() {
    if (!isConfigured()) {
      throw new Error("Supabase is not configured yet.");
    }
    if (!clientPromise) {
      if (window.supabase && typeof window.supabase.createClient === "function") {
        clientPromise = Promise.resolve(window.supabase.createClient(config().url, config().anonKey, {
          auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true,
            flowType: "pkce"
          }
        }));
      } else {
        clientPromise = import("https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm")
          .then(function (mod) {
            return mod.createClient(config().url, config().anonKey, {
            auth: {
              persistSession: true,
              autoRefreshToken: true,
              detectSessionInUrl: true,
              flowType: "pkce"
            }
          });
        });
      }
    }
    return clientPromise;
  }

  async function getSession() {
    var client = await getClient();
    var result = await client.auth.getSession();
    if (result.error) throw result.error;
    return result.data.session || null;
  }

  async function signInWithGoogle() {
    var client = await getClient();
    return client.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: redirectTo(), queryParams: { prompt: "select_account" } }
    });
  }

  async function signUpWithPassword(email, password) {
    if (!email) throw new Error("Email is required.");
    if (!password || password.length < 8) throw new Error("Use a password with at least 8 characters.");
    var client = await getClient();
    return client.auth.signUp({
      email: email,
      password: password,
      options: { emailRedirectTo: redirectTo() }
    });
  }

  async function signInWithPassword(email, password) {
    if (!email) throw new Error("Email is required.");
    if (!password) throw new Error("Password is required.");
    var client = await getClient();
    return client.auth.signInWithPassword({
      email: email,
      password: password
    });
  }

  function clearLocalAuthStorage() {
    try {
      var stores = [window.localStorage, window.sessionStorage].filter(Boolean);
      stores.forEach(function (store) {
        for (var i = store.length - 1; i >= 0; i -= 1) {
          var key = store.key(i) || "";
          if (
            key.indexOf("supabase") !== -1 ||
            key.indexOf("gotrue") !== -1 ||
            /^sb-[^-]+-auth-token$/.test(key) ||
            /^sb-[^-]+-code-verifier$/.test(key)
          ) {
            store.removeItem(key);
          }
        }
      });
    } catch (_error) {}
    cachedSnapshot = null;
  }

  async function signOut() {
    var client = await getClient();
    try {
      var result = await client.auth.signOut({ scope: "local" });
      if (result.error) throw result.error;
    } finally {
      clearLocalAuthStorage();
    }
    return true;
  }

  async function ensureProfile(session) {
    var client = await getClient();
    var user = session && session.user;
    if (!user) return null;

    var existing = await client
      .from("beta_profiles")
      .select("user_id,email,full_name,institution,role,intended_use,access_status,created_at,updated_at")
      .eq("user_id", user.id)
      .maybeSingle();

    if (existing.error) throw existing.error;
    if (existing.data) return existing.data;

    var meta = user.user_metadata || {};
    var email = user.email || "";
    var created = await client
      .from("beta_profiles")
      .insert({
        user_id: user.id,
        email: email,
        email_domain: normalizeEmailDomain(email),
        full_name: meta.full_name || meta.name || "",
        academic_email_signal: academicSignalFromEmail(email)
      })
      .select("user_id,email,full_name,institution,role,intended_use,access_status,created_at,updated_at")
      .single();

    if (created.error) throw created.error;
    return created.data;
  }

  async function getAccessSnapshot() {
    if (!isConfigured()) {
      cachedSnapshot = {
        configured: false,
        signedIn: false,
        approved: false,
        status: "unconfigured",
        label: "Supabase config needed"
      };
      return cachedSnapshot;
    }

    var session = await getSession();
    if (!session) {
      cachedSnapshot = {
        configured: true,
        signedIn: false,
        approved: false,
        status: "signed_out",
        label: "Not signed in"
      };
      return cachedSnapshot;
    }

    var emailConfirmed = Boolean(session.user && session.user.email_confirmed_at);
    if (emailConfirmed) {
      cachedSnapshot = {
        configured: true,
        signedIn: true,
        approved: true,
        emailConfirmed: true,
        status: "email_verified",
        label: "Academic access",
        session: session,
        profile: null
      };
      return cachedSnapshot;
    }
    var profile = null;
    var accessStatus = "pending";
    cachedSnapshot = {
      configured: true,
      signedIn: true,
      approved: false,
      emailConfirmed: emailConfirmed,
      status: accessStatus,
      label: statusLabel(accessStatus),
      session: session,
      profile: profile
    };
    return cachedSnapshot;
  }

  function accessValidationPayload(snapshot) {
    var user = snapshot && snapshot.session && snapshot.session.user;
    return {
      accessToken: snapshot && snapshot.session && snapshot.session.access_token || "",
      userId: user && user.id || "",
      email: user && user.email || ""
    };
  }

  window.CytomoveAuth = {
    isConfigured: isConfigured,
    getClient: getClient,
    getSession: getSession,
    getAccessSnapshot: getAccessSnapshot,
    accessValidationPayload: accessValidationPayload,
    signInWithGoogle: signInWithGoogle,
    signUpWithPassword: signUpWithPassword,
    signInWithPassword: signInWithPassword,
    signOut: signOut,
    clearLocalAuthStorage: clearLocalAuthStorage,
    normalizeEmailDomain: normalizeEmailDomain,
    academicSignalFromEmail: academicSignalFromEmail
  };
}());
