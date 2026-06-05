# Controlled Academic Beta Gateway Implementation Plan

Date: 2026-06-05

## Scope

Implement the first static version of the Cytomove app-entry gateway. The gateway sits between the public landing page and the existing web app. It uses the approved Split Choice model:

- `Sign in with email`
- `Continue to demo`

This first implementation does not add a live authentication backend. It prepares the user-facing entry point, copy, routing, and demo/full-access distinction so backend auth can be added cleanly later.

## Files

- `index.html`: update existing `Open Web App` links to point to the gateway.
- `beta-gateway/index.html`: new static gateway page using the existing landing-page visual language.
- `prototype_refactor/index.html` and/or `prototype_refactor/app.js`: optional lightweight demo-mode indicator if `?mode=demo` is present.

## Gateway Behavior

### Sign in with email

The sign-in panel should show two actions:

- `Continue with Google`
- `Email me a magic link`

For the first static implementation, both actions can route to a non-destructive placeholder state on the same page, explaining that full beta access is being prepared and that academic access will be free. This avoids pretending live authentication exists.

### Continue to demo

The demo action routes to:

`../prototype_refactor/?mode=demo`

The demo path should preserve the current local-analysis behavior. Export gating can be implemented later, but the gateway copy should already say full CSV, Excel, PNG, and ZIP exports require registered beta access.

## Visual Requirements

- Carry the existing Cytomove landing-page language: light background, white paper panels, teal accents, ink primary action, restrained scientific tone.
- Use two equal choice panels on desktop.
- Stack panels on mobile.
- Keep trust notes visible but calm:
  - Images stay local in your browser.
  - Academic beta is free.
  - Full export requires registration.
  - Commercial use requires a separate licence.

## Implementation Steps

1. Create `beta-gateway/index.html`.
2. Reuse the landing page logo mark and CSS variables where practical.
3. Add split-choice content and placeholder sign-in state.
4. Update landing page `Open Web App` links from `prototype_refactor/` to `beta-gateway/`.
5. Add optional demo-mode banner to the app if `mode=demo` is detected.
6. Run a local HTTP server and inspect the landing page, gateway page, and demo route.

## Verification

- Landing `Open Web App` opens the gateway.
- Gateway `Continue to demo` opens the existing app.
- Gateway is responsive on desktop and narrow viewport.
- Copy accurately says authentication is not live yet if sign-in buttons are clicked.
- No assay images or outputs are uploaded.

## Out Of Scope For This Step

- Real Google OAuth.
- Real email magic link.
- ORCID account linking.
- Admin review queue.
- Backend database.
- Enforced export gating.
