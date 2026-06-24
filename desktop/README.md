# Cytomove Desktop

A Windows-first desktop build generated from the canonical Cytomove `app/`.
Run `npm run sync:renderer` after changing the web app; `npm run check` rejects stale desktop copies.

## Privacy

Images are opened from the user's computer and analyzed locally inside the desktop app window.
The desktop app does not add a backend upload path; only authentication talks to the network.

## Sign-in (required)

Cytomove Desktop is gated behind a verified academic access account. On launch the app shows a
sign-in screen and the workspace stays locked until a verified, approved academic account signs in.
After a successful online check, the same account may use the app offline for up to 72 hours.

- Email/password sign-in works in-app; the email verification link opens in the system browser.
- Google sign-in uses the system browser with a localhost loopback (PKCE) callback on `http://localhost:54545`,
  which must be present in the Supabase project's allowed redirect URLs.
- The Supabase config and auth helper are bundled in `renderer/auth/` (keep `supabase-config.js` in sync
  with the web copy; the anon key is publishable).

## Run locally

```powershell
npm install
npm start
```

## Build for Windows

Build outside a synced folder (e.g. OneDrive/Yandex.Disk) so the sync client does not lock files mid-build:

```powershell
# unsigned local verification build; never publish this artifact
npm run dist:win:preview

# signed production installer / portable build
npm run dist:win
npm run portable:win
```

This produces:

- `Cytomove-Desktop-<version>-setup.exe` (installer, recommended)
- `Cytomove-Desktop-<version>-portable.exe` (single-file, no install)

Production scripts require `CSC_LINK` and `CSC_KEY_PASSWORD`. Publish only code-signed artifacts.

## Distribution

Signed builds can be published to GitHub Releases and offered through the login-gated page at `cytomove.com/download/`,
which shows download links only to signed-in, verified academic accounts.

## Notes

- Recommended updates may be postponed. Setting `updateMode` to `required`, or raising
  `minimumRequiredVersion`, blocks outdated installations after the signed release is available.
- A cached mandatory update remains mandatory offline. Non-mandatory policy checks have a 72-hour grace window.
- NSIS installations update in-app. Portable builds direct the user to the current manual download.
- The desktop app does not upload assay images or analysis results.
