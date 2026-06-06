# Cytomove

> A privacy-first, browser-based wound healing (scratch assay) analysis tool for cell biologists.

Cytomove turns scratch assay / wound healing measurement into a reviewable, reproducible, and exportable research workflow that runs entirely in the browser. It aims to be a faster, citation-ready alternative to manual ImageJ-based wound area measurement — images are processed locally, segmentation is reviewable, and exports come with reproducible methods text and a versioned citation block.

## Current Status

_As of June 2026 — soft-deployed and in a controlled academic beta._

- Live site: [cytomove.com](https://cytomove.com)
- **Working web app** is live (no installation): local image analysis with single-image and group review.
- **Controlled Academic Beta:** a loginless demo plus registered full access. Academic use is free during the beta.
- **Desktop app (Alpha):** an Electron build for faster local group analysis and heavier exports.
- **Manuscript in preparation:** an Original Software Publication describing Cytomove and its validation against manual ImageJ measurement.

## What It Does

The web app (and the desktop app) currently support:

- Local image input — images never leave your computer
- Automatic wound area segmentation with adjustable controls
- Single-image and local multi-image **group review**
- Area and width metrics, mask/contour review, and quality-control guidance
- **Manual correction** of the segmentation result
- Time-course plots
- Export to PNG, CSV, Excel, and ZIP

The core validation goal is that Cytomove measurements correlate highly with manual ImageJ measurements.

## Access

- **Demo (no sign-in):** try the analysis in your browser; full exports require an account.
- **Registered full access:** sign in with email/password or Google. Email verification activates academic beta access.
- **Desktop app:** requires a verified account to sign in; download links for the installer and portable build are available to signed-in beta users on the download page.
- Academic use is free during the beta. Commercial use requires a separate license.

## Why It Exists

In cell biology labs, wound healing analysis is still often manual, hard to reproduce, and tedious to turn into publication output. Cytomove improves this in three ways:

- **In-browser analysis:** assay images are processed without ever leaving your computer.
- **Figure-ready output:** PNG figures, CSV/Excel data, and methods text.
- **Reproducibility:** the analysis version and settings are reported together with a citation block.

## For Researchers

Try the web app or join the beta at [cytomove.com](https://cytomove.com). For feedback, dataset suggestions, or academic collaboration ideas, use GitHub Issues or email.

## Founder

[Dr. Zekeriya Düzgün](https://github.com/zduzgun)
Department of Medical Biology, Faculty of Medicine, Giresun University.

## License

The documentation, roadmap, and decision records in this repository are licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).

Cytomove product code is source-available for non-commercial academic, educational, and research use, following the PolyForm Noncommercial License 1.0.0 model. Commercial use is not permitted under the public license and requires a separate written commercial license. See [LICENSE](./LICENSE) and [LICENSING_STRATEGY.md](./LICENSING_STRATEGY.md) for details.

---

*Cytomove is built in the open, because researcher feedback matters as much as the product's accuracy.*
