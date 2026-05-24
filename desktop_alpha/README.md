# Cytomove Desktop Alpha

This is a Windows-first desktop wrapper for the working Cytomove prototype.
It does not replace the web version and does not change `prototype_refactor/`.

## Privacy

Images are opened from the user's computer and analyzed locally inside the desktop app window.
This alpha does not add a backend upload path.

## Run Locally

From this folder:

```powershell
npm install
npm start
```

## Package For Windows

```powershell
npm run pack:win
```

This creates `desktop_alpha/release/win-unpacked/Cytomove Desktop Alpha.exe`.

Installer builds can be revisited later with:

```powershell
npm run dist:win
```

On some Windows machines, installer packaging may require developer-mode symlink privileges or administrator setup for electron-builder's signing helper. The alpha path uses `pack:win` because it avoids signing and produces a runnable app folder.

## Notes

- The renderer is a copied snapshot of the current `prototype_refactor/` app.
- The first alpha intentionally keeps all current prototype controls and exports.
- Electron dependencies are not vendored in this repository; run `npm install` before starting or packaging.
- Alpha 0.1 is intentionally full free with no mandatory login.
- Email/account capture should stay optional until private beta. The intended path is: optional feedback/update signup first, then 10-day trial or mail activation later for private beta or paid modules.
- The web manifest/update panel is not a license system and does not upload assay images or analysis results.
