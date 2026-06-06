# Zenodo Submission — Cytomove

Two Zenodo records are recommended. Record A (validation artifacts) is ready to upload now;
Record B (software) is optional and is best produced via the GitHub integration.

---

## Record A — Validation data & figures (ready now)

**Upload file after rebuild:** `docs/Cytomove_zenodo_deposit_enriched_doi.zip` (or upload its contents individually).
Do not use the older `docs/Cytomove_zenodo_deposit.zip` or `docs/Cytomove_zenodo_deposit_enriched.zip`; they lack the final DOI-synchronized package state.
**Metadata:** pre-filled in `docs/zenodo_deposit/.zenodo.json`.

Steps:

1. Sign in at https://zenodo.org (use your ORCID 0000-0001-6420-6292 if linked).
2. Click **New upload**.
3. Regenerate the manuscript PDF, refresh `docs/zenodo_deposit/Cytomove_manuscript_submission.pdf`, rebuild `Cytomove_zenodo_deposit_enriched_doi.zip`, then drag in the rebuilt ZIP (or unzip and add the files).
4. Fill the form from `.zenodo.json`:
   - **Resource type:** Dataset
   - **Title:** Cytomove: validation data, figures, and analysis artifacts for a browser-local scratch wound healing assay quantification workflow
   - **Creator:** Düzgün, Zekeriya — Giresun University — ORCID 0000-0001-6420-6292
   - **License:** Creative Commons Attribution 4.0 International (CC BY 4.0)
   - **Description:** paste from `.zenodo.json` (`description` field)
   - **Keywords:** scratch assay; wound healing assay; cell migration; image analysis; browser-based analysis; segmentation; reproducibility; Cytomove; ImageJ; WHST
   - **Related/alternate identifiers:**
     - references → 10.5281/zenodo.12806149 (WHAD/CAMAD dataset)
     - references → 10.1109/ACCESS.2025.3561607 (CSMA paper)
     - is supplement to → https://github.com/zduzgun/CytoMove
5. **Save** (draft). The manuscript currently uses reserved DOI `10.5281/zenodo.20486820`.
6. **Publish** when ready. Publishing is permanent and makes the DOI resolve publicly.
7. After publication, update the manuscript **Data and Code Availability** sentence from
   reserved/prepared wording to "available on Zenodo", then update `README.md` / the website.

> Note: this deposit redistributes only author-generated derived measurements and figures.
> The raw WHAD/CAMAD and CSMA image archives are NOT included — they stay at their original sources.

---

## Record B — Software archive (optional, for a citable software DOI)

The cleanest way to get a versioned software DOI is the GitHub–Zenodo integration:

1. Sign in to Zenodo → **Account → GitHub** → toggle ON the `zduzgun/CytoMove` repository.
2. On GitHub, create a release/tag (e.g. `v1.0.0`).
3. Zenodo automatically archives that release and mints a DOI.
4. Add that DOI to the manuscript Data/Code Availability as the software citation.

If the production code is private, archive instead whatever is public (prototype + roadmap),
or skip Record B and cite only the GitHub URL plus Record A.

---

## Can the agent submit this for me?

Uploading requires your authenticated Zenodo account (login + possibly 2FA), so it cannot be
done from here without your active session. If you open Zenodo and log in, Codex can walk you
through the form step by step (or drive it via the in-browser assistant). Otherwise the steps
above take ~10 minutes manually.
