# Cytomove Desktop

A Windows-first desktop wrapper for the working Cytomove prototype.
It does not replace the web version and does not change `prototype_refactor/`.

## Privacy

Images are opened from the user's computer and analyzed locally inside the desktop app window.
The desktop app does not add a backend upload path; only authentication talks to the network.

## Sign-in (required)

Cytomove Desktop is gated behind a verified academic access account. On launch the app shows a
sign-in screen and the workspace stays locked until a verified account signs in.

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
# installer (NSIS) + portable, both .exe
npx electron-builder --win "-c.directories.output=C:\Users\<you>\cytomove-release"

# portable only
npm run portable:win
```

This produces:

- `Cytomove-Desktop-<version>-setup.exe` (installer, recommended)
- `Cytomove-Desktop-<version>-portable.exe` (single-file, no install)

If electron-builder's signing helper fails to extract symlinks, enable Windows Developer Mode (or run the
build from an elevated PowerShell) and clear `%LOCALAPPDATA%\electron-builder\Cache\winCodeSign`, then retry.

## Distribution

Builds are published to GitHub Releases and offered through the login-gated page at `cytomove.com/download/`,
which shows download links only to signed-in, verified academic accounts.

## Notes

- The renderer is a copied snapshot of the current `prototype_refactor/` app plus the sign-in gate (`auth-ui.js`).
- Electron dependencies are not vendored in this repository; run `npm install` before starting or packaging.
- The web manifest/update panel is not a license system and does not upload assay images or analysis results.
