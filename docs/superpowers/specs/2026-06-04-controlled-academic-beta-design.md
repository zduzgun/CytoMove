# Cytomove Controlled Academic Beta Design

Date: 2026-06-04

## Objective

Cytomove will enter a Controlled Academic Beta using a loginless demo plus registered full-use model. The beta should let visitors evaluate the product with minimal friction while keeping full use accountable and aligned with the source-available non-commercial licensing strategy.

## Product Position

The beta is free for academic and non-commercial research use. It is not an open commercial release. Commercial use remains unavailable under the public non-commercial licence and requires separate written permission or a commercial licence.

The privacy claim remains central: scratch assay images should stay local to the user's browser or desktop app. Account infrastructure may store user identity, approval state, institution, and feedback, but it must not upload assay images or analysis outputs unless a future explicit opt-in workflow is designed.

## Access Model

### Loginless Demo

Public visitors can try Cytomove without signing in. Demo mode should be useful enough to understand the workflow but limited enough that serious work moves to registered beta access.

Initial demo constraints:

- Allow sample/demo images.
- Allow local image loading if technically simple, because it helps users judge real fit.
- Show segmentation overlays and core measurements.
- Limit or watermark export.
- Show a clear call to register for full academic beta access.

### Registered Full Use

Full beta use requires registration and email verification. Registered users can use the full analysis workflow and exports, subject to the non-commercial beta terms.

Academic institutional email users should receive free academic beta access after verification. General email users enter manual review before full access. Commercial-looking domains should be routed to commercial contact rather than automatic free access.

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
2. User enters email, name, institution, country, role, and intended use.
3. System classifies the email domain:
   - Academic domain: send verification email, then grant `academic_verified`.
   - General consumer email: send verification email, then set `manual_review`.
   - Commercial-looking domain: send verification email, then set `commercial_contact` or manual review depending on wording.
4. User accepts beta terms before full access.
5. Full access opens only after the user reaches `academic_verified` or `approved_noncommercial`.

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

Public wording should avoid "open source" and use "source-available non-commercial" when discussing code. The web UI can say "Free Controlled Academic Beta" and "Commercial use requires a separate licence."

## Technical Architecture

Recommended backend direction: use a managed auth/database provider for the beta rather than building identity from scratch.

Minimum data model:

- users/auth identity;
- beta profile: email, name, institution, role, country, intended use;
- access status;
- domain classification;
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
- Add email verification.
- Add domain classification.
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
- Whether consumer-email users can upload institutional proof during manual review.
- Whether desktop alpha should share the same account state or remain separate initially.

## Recommendation

Start with loginless demo plus registered full use. Use manual review generously at first rather than over-automating domain decisions. Keep payment out of the first beta implementation; the goal is controlled academic adoption, not monetization.
