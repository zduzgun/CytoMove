# Cytomove Controlled Academic Beta Design

Date: 2026-06-04

## Objective

Cytomove will enter a Controlled Academic Beta using a loginless demo plus registered full-use model. The beta should let visitors evaluate the product with minimal friction while keeping full use accountable and aligned with the source-available non-commercial licensing strategy.

## Product Position

The beta is free for academic and non-commercial research use. It is not an open commercial release. Commercial use remains unavailable under the public non-commercial licence and requires separate written permission or a commercial licence.

The privacy claim remains central: scratch assay images should stay local to the user's browser or desktop app. Account infrastructure may store user identity, approval state, institution, and feedback, but it must not upload assay images or analysis outputs unless a future explicit opt-in workflow is designed.

## Access Model

### Gateway Screen

The app entry gateway should use a Split Choice layout. The public landing page remains separate; users see this gateway only when they choose to launch/open Cytomove.

Visual direction:

- Use a calm branded screen that carries the existing Cytomove landing-page language rather than a generic clinical white login screen.
- Keep the tone scientific, restrained, and trustworthy; avoid a sales-heavy SaaS hero.
- Preserve the current local-first/research-tool identity through concise copy, quiet typography, and subtle references to segmentation review/overlay workflow.
- Use two balanced choice panels for the main decision, with `Sign in with email` and `Continue to demo` given equal visual dignity.
- Keep privacy and access constraints visible below the choices without turning them into a warning block.

Public gateway headline:

- `Cytomove Academic Beta`
- Supporting line: `Reviewable scratch wound healing analysis in your browser.`

Primary choices:

- `Sign in with email`
  - Use Google or a magic link to request or enter full beta access.
  - Academic use is free during beta.
  - Full export and full workflow are available only after approved beta access.
- `Continue to demo`
  - Try Cytomove without signing in.
  - Load a local image, inspect the segmentation overlay, and view core measurements.
  - Full CSV, Excel, PNG, and ZIP exports require registered beta access.

Trust strip:

- Images stay local in your browser.
- Full export requires registered beta access.
- Academic beta is free.
- Commercial use requires a separate licence.

Gateway Wireframe V1:

- Header:
  - Left: Cytomove logo/wordmark.
  - Right: `Privacy` and `Beta terms` links.
- Center headline:
  - `Cytomove Academic Beta`
  - `Reviewable scratch wound healing analysis in your browser.`
- Split choice panels:
  - Left panel, `Sign in with email`:
    - Copy: `Use Google or a magic link to request or enter full beta access.`
    - Actions: `Continue with Google`; `Email me a magic link`.
    - Note: `Academic use is free during beta. General email addresses may require manual approval.`
  - Right panel, `Continue to demo`:
    - Copy: `Try Cytomove without signing in. Load a local image, inspect the overlay, and view core measurements.`
    - Action: `Open demo`.
    - Note: `Full CSV, Excel, PNG, and ZIP exports require registered beta access.`
- Bottom trust row:
  - `Images stay local in your browser`
  - `Academic beta is free`
  - `Full export requires registration`
  - `Commercial use requires a separate licence`
- Responsive behavior:
  - Desktop: two equal panels.
  - Mobile: panels stack vertically, with `Sign in with email` first and `Continue to demo` second.

### Loginless Demo

Public visitors can try Cytomove without signing in. Demo mode should be useful enough to understand the workflow but limited enough that serious work moves to registered beta access.

Initial demo constraints:

- Allow sample/demo images.
- Allow local image loading so users can judge Cytomove against their own microscopy images without signing in.
- Show segmentation overlays and core measurements.
- Keep full CSV, Excel, PNG, and ZIP export behind registered full beta access.
- If lightweight demo export is offered later, mark it clearly as demo output and avoid presenting it as publication-ready.
- Show a clear call to register for full academic beta access.

### Registered Full Use

Full beta use requires registration and email verification. Registered users can use the full analysis workflow and exports, subject to the non-commercial beta terms.

Academic institutional email users should receive free academic beta access after verification. General email users enter manual review before full access. Commercial-looking domains should be routed to commercial contact rather than automatic free access.

The beta entry screen should expose two primary choices:

1. Sign in with email.
2. Continue to loginless demo.

The email sign-in route can support Google sign-in and email magic link. ORCID should be offered after sign-in as optional account linking, used as the strongest research-identity signal rather than as a primary login button.

ORCID should not be treated as automatic proof of academic eligibility by itself, because ORCID iDs can be created by many types of users. The access decision should combine ORCID linkage, verified email domain, institution, role, and intended use.

## User States

- `demo`: no account; limited trial experience.
- `pending_email_verification`: registered but email not verified.
- `academic_verified`: academic institutional email verified; free full beta.
- `manual_review`: general email or ambiguous institution; waiting for admin approval.
- `approved_noncommercial`: manually approved free non-commercial beta user.
- `commercial_contact`: commercial-looking user routed to licensing discussion.
- `rejected_or_blocked`: not allowed to access full beta.

## Registration Flow

1. User clicks "Apply for full beta access".
2. User chooses the email sign-in route: Google sign-in or email magic link.
3. User enters or confirms email, name, institution, country, role, and intended use.
4. The interface offers optional ORCID linking to strengthen the academic profile.
5. System classifies the email domain and academic signals:
   - Academic domain: send verification email, then grant `academic_verified`.
   - Academic domain plus ORCID: send verification email, then grant `academic_verified` with high confidence.
   - General consumer email: send verification email, then set `manual_review`.
   - ORCID plus general consumer email: send verification email, then set `manual_review` unless the stated institution and intended use are clearly non-commercial.
   - Commercial-looking domain: send verification email, then set `commercial_contact` or manual review depending on wording.
6. User accepts beta terms before full access.
7. Full access opens only after the user reaches `academic_verified` or `approved_noncommercial`.

## Admin Workflow

An admin view should list pending users with email, institution, role, intended use, domain classification, created date, and status. Admin actions:

- approve as non-commercial beta user;
- mark as commercial contact;
- reject or block;
- add internal notes.

For the first implementation, this can be a simple protected admin page or a database table managed through the backend provider dashboard. A polished admin UI can come later.

## Beta Terms And Messaging

The beta terms should be short and explicit:

- free academic/non-commercial research beta;
- no commercial use without separate written licence;
- preliminary research software, use with review of overlays and exported metadata;
- assay images remain local unless the user explicitly sends feedback or files;
- user feedback may be used to improve Cytomove.

Public wording should avoid "open source" and use "source-available non-commercial" when discussing code. The web UI should prefer the simpler public label "Academic Beta"; "controlled" can remain an internal access-model term. It can also say "Academic beta is free" and "Commercial use requires a separate licence."

## Technical Architecture

Recommended backend direction: use a managed auth/database provider for the beta rather than building identity from scratch.

Preferred auth provider direction:

- Use a managed auth provider that supports Google sign-in and email magic links out of the box.
- Add ORCID account linking through a custom OAuth/OIDC provider if the chosen backend supports it cleanly.
- Store the ORCID iD as linked identity metadata, not as the sole authorization rule.
- Keep authorization in Cytomove's own beta profile table so access can be manually overridden.

Minimum data model:

- users/auth identity;
- beta profile: email, name, institution, role, country, intended use;
- linked identity providers: ORCID, Google, email;
- ORCID iD when available;
- access status;
- domain classification;
- academic signal score or classification notes;
- accepted terms version and timestamp;
- admin notes.

The analysis engine should remain client-side. Authentication should gate access to full UI/export features, not move image analysis to the server.

## Milestones

### Milestone 1: Beta Policy And UI Copy

- Add beta access policy text.
- Add privacy/data-handling copy.
- Add demo/full-use distinction on the website.
- Define demo export limits.

### Milestone 2: Demo Mode

- Make demo entry visible.
- Ensure demo cannot be confused with full beta access.
- Add upgrade/register prompts at export or advanced workflow points.

### Milestone 3: Registration And Classification

- Add registration form.
- Add Google and email magic-link sign-in options under the email sign-in route.
- Add email verification.
- Add optional ORCID linking prompt for Google/email users.
- Add domain classification.
- Store ORCID iD and linked-provider metadata when available.
- Store beta profile and terms acceptance.

### Milestone 4: Manual Review

- Add pending-user queue.
- Add approve/reject/commercial-contact actions.
- Notify users of approval status.

### Milestone 5: Full Beta Gate

- Gate full export and full workflow behind approved access.
- Keep demo available without login.
- Add basic audit logs for access-state changes.

## Open Product Decisions

- Whether demo users can export a small watermarked CSV/PNG or no export at all.
- Which academic-domain list/provider to use for automatic approval.
- Which backend provider should handle ORCID account linking most cleanly.
- Whether consumer-email users can upload institutional proof during manual review.
- Whether desktop alpha should share the same account state or remain separate initially.

## Recommendation

Start with loginless demo plus registered full use. Use manual review generously at first rather than over-automating domain decisions. Keep payment out of the first beta implementation; the goal is controlled academic adoption, not monetization.
