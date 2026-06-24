# Cytomove visual tabbed guide design

Date: 2026-06-24  
Status: proposed for user review  
Scope: public Cytomove guide and tutorial surfaces

## Goal

Create a visual, tabbed Cytomove guide that explains the full 1.0 workflow in a way a first-time scratch-assay user can understand before or during use of the guided tutorials. The guide should make the workflow feel concrete: load images, review Image QC, run Analysis, correct masks when needed, build publication figures, and export publication-ready assets.

The guide is educational, not a replacement for the in-app guided tutorial. The tutorial tells the user where to click; the guide explains why each step matters, what good output looks like, and what to do when results look wrong.

## Existing context

- The active public guide route is `wound-healing-scratch-assay-analysis/index.html`.
- The tutorial landing route is `tutorial/index.html`.
- The tutorial page already uses Cytomove visual language and links to:
  - full HUVEC validation tutorial,
  - manual correction tutorial,
  - publication quality figure tutorial.
- Visual assets already exist under:
  - `assets/validation/`
  - `assets/tutorial/`
  - `validation_sets/full_thread_control/`
- The HUVEC validation tutorial uses 18 bundled images from 3 Control and 3 FDI replicate groups at 0h, 24h, and 48h.

## Recommended approach

Use a single public guide page with a tabbed handbook section, plus light cross-links from the tutorial page. This keeps the documentation easy to maintain and avoids creating a separate documentation system too early.

The public guide should remain at `wound-healing-scratch-assay-analysis/` for search visibility and backwards compatibility. The tutorial page should continue to focus on launching guided demos, but it should point users to the richer visual guide for explanation.

## Guide information architecture

The visual handbook should use tabs. Each tab should have:

- a short explanation in plain scientific language,
- one or more screenshots or microscopy/example images,
- a compact checklist,
- a "common mistake" or "watch for this" card,
- a button that opens the relevant Cytomove guided tutorial or app route.

### Tabs

1. **Overview**
   - Explain the Cytomove 1.0 workflow: Image QC -> Analysis -> Publication Figure Builder -> Export.
   - Show the workflow as a horizontal strip or card sequence.
   - Clarify that images stay local in the browser/desktop workflow.

2. **Load images**
   - Explain single image, local group, and time-series group loading.
   - Show examples of 0h, 24h, and 48h images.
   - Explain why group naming matters before analysis and figure building.
   - CTA: open Cytomove app or full HUVEC tutorial.

3. **Image QC**
   - Explain crop rectangle, orientation, rotation, exclusion, and why QC is upstream of analysis.
   - Show a good crop rectangle and a poor crop rectangle.
   - Make clear that saved crop/orientation should carry into Analysis and Publication Figure Builder.
   - CTA: start full HUVEC tutorial.

4. **Analysis**
   - Explain brightfield preset, Apply, variance radius, contour overlay, and group-level review.
   - Show calculated contours on representative images.
   - Explain that users should inspect contours visually, not trust only numbers.
   - CTA: start full HUVEC tutorial.

5. **Manual correction**
   - Explain when automatic segmentation needs local correction.
   - Show mask review, ignore tiny islands, fill, erase, undo, and reset.
   - Emphasize reversible edits and scientific review.
   - CTA: start manual correction tutorial.

6. **Publication figures**
   - Explain single-group figure mode, Control vs Treatment mode, and multi-treatment mode.
   - Show Panel A images with contour overlays, Panel B closure plot, and Panel C normalized area/width.
   - Explain panel dragging, title editing, font controls, contour display, and representative group choices.
   - CTA: start publication quality figure tutorial.

7. **Export**
   - Explain 600 DPI PNG, TIFF, PDF, PPTX, CSV/figure data, and Builder ZIP.
   - Clarify that export packages should include full-size original images and full-size contour-overlay images for manual figure assembly.
   - CTA: open publication quality figure tutorial.

8. **Troubleshooting**
   - Explain common user-facing states:
     - no images loaded,
     - crop rectangle not visible,
     - horizontal/vertical warning confusion,
     - contour looks wrong,
     - Analyze missing groups,
     - validation images not loading due stale cache,
     - export button disabled.
   - Keep solutions short and practical.

## Visual content plan

Use repository-owned or user-owned Cytomove assets only.

Preferred sources:

- `assets/validation/figure3-whst-cytomove-agreement.jpg`
- `assets/validation/figure6-ab-phase-timecourse.jpg`
- `assets/tutorial/manual/*.png`
- `assets/tutorial/manual-hard/*.png`
- `assets/tutorial/m8f/*.png`
- selected `validation_sets/full_thread_control` images for HUVEC examples

If screenshots of the current UI are needed, generate them locally from the current app rather than using older user clipboard screenshots. Screenshots should be stored under a small dedicated folder such as `assets/guide/`, optimized for web display, and kept lightweight.

## UI design

The guide should preserve the current Cytomove public-site style:

- off-white background,
- teal accents,
- rounded white cards,
- restrained scientific tone,
- no sales-heavy layout.

The tabbed section should work without a framework. Use semantic HTML, CSS, and a small inline script if needed:

- horizontal tabs on desktop,
- scrollable tab row or stacked accordion-like tabs on mobile,
- accessible button roles and `aria-selected`,
- each tab panel hidden/shown without route reload.

The content should be visually rich but not bloated. Prefer a few well-chosen images, annotated cards, and short captions over long paragraphs.

## Copy tone

The tone should be practical and academic:

- avoid marketing claims,
- say "review" and "inspect" rather than "automatic perfect result",
- frame contours and masks as reviewable scientific outputs,
- avoid implying medical diagnosis or clinical validation,
- keep wording compatible with the current local-first/privacy-first positioning.

## Data and behavior

The guide should not require login and should not mutate app state. All CTAs should be normal links:

- `../app/?tutorial=huvec-full`
- `../app/?tutorial=manual`
- `../app/?tutorial=publication-quality`
- `../app/`
- `../download/`

The guide should not auto-load validation data itself. Validation loading remains inside the app/tutorial routes.

## Testing and verification

Add or extend static tests so the guide cannot regress silently.

Minimum checks:

- guide page includes tab buttons for the eight guide sections,
- guide page links to the full HUVEC tutorial, manual correction tutorial, and publication figure tutorial,
- guide references Image QC, Analysis, Publication Figure Builder, and Export in that order,
- guide references single-group figure, Control vs Treatment, and multi-treatment figure modes,
- guide references full-size original and contour-overlay export assets,
- tutorial page links back to the visual guide,
- no broken local asset references for guide images.

Manual verification:

- open guide locally in browser,
- switch through every tab,
- check desktop width and mobile/narrow width,
- click tutorial CTAs,
- verify console has no errors.

## Implementation boundaries

This change should focus on public guide/tutorial documentation only. It should not change segmentation logic, image loading, authentication, desktop packaging, or publication export behavior.

Web and desktop renderer sync is not required unless app renderer files change. If only public guide/tutorial pages change, keep the app renderer untouched.

## Rollout plan

1. Update `wound-healing-scratch-assay-analysis/index.html` with the tabbed visual handbook.
2. Add lightweight guide images under `assets/guide/` only if existing assets are insufficient.
3. Add or update static tests for guide tabs and links.
4. Update `tutorial/index.html` only enough to connect guided tutorials with the new visual guide.
5. Run the relevant static tests and a local visual pass.
6. Push after user approval of the final guide state.

## Non-goals

- No separate documentation framework.
- No search system.
- No multi-page docs tree.
- No app feature changes.
- No new validation dataset.
- No use of externally sourced images.

## Open decision for review

The main design decision is whether the guide tabs should live entirely on the current SEO guide route (`wound-healing-scratch-assay-analysis/`) or whether `tutorial/` should become the primary visual handbook. The recommended choice is to keep the handbook on the SEO guide route and let `tutorial/` remain the launch page for guided demos.
