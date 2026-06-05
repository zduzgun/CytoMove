# Supabase Auth Implementation

## Current Scope

The Cytomove Academic Beta gateway now supports a permanent Supabase Auth path:

- Email and password sign-up/sign-in.
- Google sign-in as a secondary OAuth option while branding is being cleaned up.
- A `beta_profiles` access profile table.
- Loginless demo remains available.
- Full export is UI-gated unless the signed-in account has completed email verification.

This is still a static frontend integration. It should be treated as beta access control, not as hard anti-circumvention security for a public source-available client.

## Files

- `auth/supabase-config.js`: runtime config used by the static pages.
- `auth/supabase-config.example.js`: template for the public Supabase URL and anon key.
- `auth/cytomove-auth.js`: shared frontend auth helper.
- `beta-gateway/index.html`: Google and magic-link entry UI.
- `prototype_refactor/index.html`: export gate based on demo mode or verified signed-in access.
- `supabase/beta-auth-schema.sql`: SQL schema, row-level security, and grants.

## Supabase Setup

1. Create a Supabase project.
2. Run `supabase/beta-auth-schema.sql` in the Supabase SQL editor.
3. In Supabase Auth settings, keep email sign-up and email confirmation enabled.
4. In Supabase Auth providers, enable Google.
5. Add the gateway URL to allowed redirect URLs:
   - local: `http://localhost:8765/beta-gateway/`
   - production: `https://cytomove.com/beta-gateway/`
6. Copy the project URL and anon public key into `auth/supabase-config.js`.

Never put the Supabase service-role key in frontend files.

## Access Status

Frontend full-export access is granted after email verification. The frontend also treats these `beta_profiles.access_status` values as approved:

- `email_verified`
- `academic_verified`
- `approved`
- `beta_approved`

New users are allowed after email verification and are created as `email_verified`. Manual review is not required for the initial Academic Beta model. Optional future routing:

- academic institutional email: `academic_verified`
- general email: `email_verified`
- commercial-looking use: `commercial_contact`
- rejected or abusive use: `rejected`

## Notes

The `academic_email_signal` field is a weak convenience signal based on the email domain. It is not proof of academic eligibility. The final access decision should combine email domain, institution, role, intended use, and optional ORCID linking later.
