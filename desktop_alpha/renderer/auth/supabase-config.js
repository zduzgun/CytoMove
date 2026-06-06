// Desktop copy of the Supabase config. Bundled with the Electron renderer.
// NOTE: keep the url/anonKey in sync with ../../../auth/supabase-config.js.
// redirectTo is hardcoded to the public web gateway because the desktop
// renderer runs from a file:// origin (window.location.origin is not usable
// for email verification links). Google OAuth overrides redirectTo at call
// time with the cytomove:// deep link.
window.CYTOMOVE_SUPABASE_CONFIG = {
  url: "https://pvxfjaqathfonophaakg.supabase.co",
  anonKey: "sb_publishable_j5VxjpFZCMZyTl7SWBjChw_EH0vxD_y",
  redirectTo: "https://cytomove.com/beta-gateway/",
  approvedStatuses: ["email_verified", "academic_verified", "approved", "beta_approved"]
};
