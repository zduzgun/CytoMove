# Supabase Auth Implementation

## Current Scope

The Cytomove Academic Beta gateway now supports a permanent Supabase Auth path:

- Google sign-in.
- Email magic-link sign-in.
- A `beta_profiles` access profile table.
- Loginless demo remains available.
- Full export is UI-gated unless the signed-in profile has an approved access status.

This is still a static frontend integration. It should be treated as beta access control, not as hard anti-circumvention security for a public source-available client.

## Files

- `auth/supabase-config.js`: runtime config used by the static pages.
- `auth/supabase-config.example.js`: template for the public Supabase URL and anon key.
- `auth/cytomove-auth.js`: shared frontend auth helper.
- `beta-gateway/index.html`: Google and magic-link entry UI.
- `prototype_refactor/index.html`: export gate based on demo mode or approved signed-in access.
- `supabase/beta-auth-schema.sql`: SQL schema, row-level security, and grants.

## Supabase Setup

1. Create a Supabase project.
2. Run `supabase/beta-auth-schema.sql` in the Supabase SQL editor.
3. In Supabase Auth settings, enable email magic links.
4. In Supabase Auth providers, enable Google.
5. Add the gateway URL to allowed redirect URLs:
   - local: `http://localhost:8765/beta-gateway/`
   - production: `https://cytomove.com/beta-gateway/`
6. Copy the project URL and anon public key into `auth/supabase-config.js`.

Never put the Supabase service-role key in frontend files.

## Access Status

Frontend full-export access is granted when `beta_profiles.access_status` is one of:

- `academic_verified`
- `approved`
- `beta_approved`

New users are created as `pending`. Admin review can update `access_status` in the Supabase table. Suggested routing:

- academic institutional email: `academic_verified`
- general email but plausible academic use: `manual_review`, then `approved`
- commercial-looking use: `commercial_contact`
- rejected or abusive use: `rejected`

## Notes

The `academic_email_signal` field is a weak convenience signal based on the email domain. It is not proof of academic eligibility. The final access decision should combine email domain, institution, role, intended use, and optional ORCID linking later.
