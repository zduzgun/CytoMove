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
    if (approvedStatuses().indexOf(status) !== -1) return "Approved beta access";
    if (status === "manual_review") return "Manual review";
    if (status === "commercial_contact") return "Commercial licence review";
    return "Pending review";
  }

  async function getClient() {
    if (!isConfigured()) {
      throw new Error("Supabase is not configured yet.");
    }
    if (!clientPromise) {
      clientPromise = import("https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm")
        .then(function (mod) {
          return mod.createClient(config().url, config().anonKey, {
            auth: {
              persistSession: true,
              autoRefreshToken: true,
              detectSessionInUrl: true
            }
          });
        });
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
      options: { redirectTo: redirectTo() }
    });
  }

  async function signInWithMagicLink(email) {
    if (!email) throw new Error("Email is required for magic-link sign-in.");
    var client = await getClient();
    return client.auth.signInWithOtp({
      email: email,
      options: {
        emailRedirectTo: redirectTo(),
        shouldCreateUser: true
      }
    });
  }

  async function signOut() {
    var client = await getClient();
    var result = await client.auth.signOut();
    if (result.error) throw result.error;
    cachedSnapshot = null;
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

    var profile = await ensureProfile(session);
    var accessStatus = profile && profile.access_status;
    cachedSnapshot = {
      configured: true,
      signedIn: true,
      approved: approvedStatuses().indexOf(accessStatus) !== -1,
      status: accessStatus || "pending",
      label: statusLabel(accessStatus || "pending"),
      session: session,
      profile: profile
    };
    return cachedSnapshot;
  }

  window.CytomoveAuth = {
    isConfigured: isConfigured,
    getClient: getClient,
    getSession: getSession,
    getAccessSnapshot: getAccessSnapshot,
    signInWithGoogle: signInWithGoogle,
    signInWithMagicLink: signInWithMagicLink,
    signOut: signOut,
    normalizeEmailDomain: normalizeEmailDomain,
    academicSignalFromEmail: academicSignalFromEmail
  };
}());
