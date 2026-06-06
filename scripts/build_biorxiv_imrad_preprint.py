from __future__ import annotations

import re
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "PUBLICATION" / "0-preprint-bioRxiv" / "manuscript" / "cytomove-preprint-biorxiv.md"
OUT = ROOT / "PUBLICATION" / "0-preprint-bioRxiv" / "manuscript" / "cytomove-preprint-biorxiv-imrad.md"


def sections(text: str) -> dict[str, str]:
    matches = list(re.finditer(r"^## .+$", text, flags=re.MULTILINE))
    result: dict[str, str] = {}
    for index, match in enumerate(matches):
        title = match.group(0).strip()
        start = match.end()
        end = matches[index + 1].start() if index + 1 < len(matches) else len(text)
        result[title] = text[start:end].strip()
    return result


def strip_subheading_numbers(text: str) -> str:
    text = re.sub(r"^### 2\.1 ", "### ", text, flags=re.MULTILINE)
    text = re.sub(r"^### 2\.2 ", "### ", text, flags=re.MULTILINE)
    return text


def bold_in_text_citations(text: str) -> str:
    """Bold author-year citations in the article body, leaving the reference list unchanged."""
    if "\n## References\n" not in text:
        body, tail = text, ""
    else:
        body, tail = text.split("\n## References\n", 1)
        tail = "\n## References\n" + tail

    def bold_parenthetical(match: re.Match[str]) -> str:
        inner = match.group(1)
        if "**" in inner:
            return match.group(0)
        return f"(**{inner}**)"

    # Narrative citations used in prose.
    body = re.sub(
        r"\b([A-ZÇĞİÖŞÜ][A-Za-zÀ-ÖØ-öø-ÿÇĞİÖŞÜçğıöşü'’.-]+(?:\s+and\s+[A-ZÇĞİÖŞÜ][A-Za-zÀ-ÖØ-öø-ÿÇĞİÖŞÜçğıöşü'’.-]+|\s+et al\.),\s+(?:19|20)\d{2})\b",
        r"**\1**",
        body,
    )

    # Parenthetical author-date citations, including multi-citation groups.
    body = re.sub(
        r"\(((?=[^)]*\b(?:19|20)\d{2}\b)(?=[^)]*,)[^)]{0,240})\)",
        bold_parenthetical,
        body,
    )

    return body + tail


def split_illustrative_examples(text: str) -> tuple[str, str]:
    markers = [
        "**Clean comparator images.**",
        "**Phase-contrast time course.**",
        "**Real-world stress cases.**",
    ]
    first = min(text.index(marker) for marker in markers if marker in text)
    return text[:first].strip(), text[first:].strip()


def as_result_prose(text: str) -> str:
    replacements = {
        "**Clean comparator images.**": "In the clean comparator sequence,",
        "**Phase-contrast time course.**": "In the phase-contrast WHAD-MCF7 time course,",
        "**Real-world stress cases.**": "In the smartphone-through-eyepiece stress sets,",
    }
    for old, new in replacements.items():
        text = text.replace(old, new)
    text = text.replace("sequence, The `csma", "sequence, the `csma")
    text = text.replace("course, The `whad", "course, the `whad")
    text = text.replace("sets, Three smartphone", "sets, three smartphone")
    text = text.replace(
        "A pooled Bland",
        "Taken together, a pooled Bland",
    )
    return text


def main() -> None:
    text = SOURCE.read_text(encoding="utf-8")
    preamble = text.split("## Abstract", 1)[0].strip()
    sec = sections(text)

    abstract = sec["## Abstract"]
    keywords = sec["## Keywords"]
    code_meta = sec["## Software and code metadata"]
    intro = sec["## 1. Motivation and significance"]
    software = strip_subheading_numbers(sec["## 2. Software description"])
    methods_intro, results = split_illustrative_examples(sec["## 3. Illustrative examples"])
    impact = sec["## 4. Impact"]
    conclusions = sec["## 5. Conclusions"]
    ethics = sec["## Ethics statement"]
    funding = sec["## Funding"]
    competing = sec["## Declaration of competing interest"]
    credit = sec["## CRediT author statement"]
    availability = sec["## Data and software availability"]
    references = sec["## References"]
    figures = sec["## Figures"]
    tables = sec["## Tables"]

    intro += (
        "\n\nThe field is also moving beyond simple endpoint closure measurements. "
        "Recent work has addressed the reproducibility of scratch creation itself through "
        "low-cost robotic scratching platforms (Lin et al., 2024), and spatially resolved "
        "analysis frameworks now combine wound-edge detection with local cell-trajectory "
        "or sector-based measurements to connect global closure with regional migration "
        "behaviour (Vašinková et al., 2025). These developments reinforce the same practical "
        "requirement: scratch-assay software should not only output a number, but should also "
        "make the image evidence, segmentation assumptions, and analysis context visible."
    )

    results = as_result_prose(results)

    results_intro = (
        "The validation was designed to ask a practical question: whether a browser-local, "
        "reviewable implementation can reproduce the wound-area behaviour of an established "
        "ImageJ/Fiji comparator while making difficult frames visible to the user. The five "
        "sets therefore combine a clean public comparator sequence, a public phase-contrast "
        "time course that approaches closure, and three author-acquired phone-capture sets "
        "used as external support or stress material rather than as definitive accuracy "
        "claims. The numerical summary is reported in Table 3, and each main result is paired "
        "with visual overlays or audit panels in Figures 2-6."
    )

    results_followup = (
        "The application-level figure establishes the workflow context for these comparisons. "
        "Figure 1 shows that Cytomove presents parameter controls, wound-overlay review, "
        "quality-control labels, and frame-level group navigation in the same workspace. This "
        "matters for interpreting the quantitative results because the exported measurements "
        "are not isolated table entries: they are linked to the mask, crop, rotation, preset, "
        "manual-correction status, and warnings that produced them. Figure 2 then illustrates "
        "the range of image appearances used in the evaluation. In the clean CSMA image the "
        "wound corridor is visually continuous and strongly separated from the cell sheet; in "
        "the WHAD-MCF7 phase-contrast example the contrast is softer and the wound approaches "
        "late closure; and in the phone-capture example the circular field and acquisition "
        "artefacts create a more difficult segmentation context. These examples are included "
        "to make clear that the numerical validation was not treated as a black-box benchmark "
        "detached from the underlying images.\n\n"
        "The paired area plot and Bland-Altman panel in Figure 3 provide complementary views "
        "of agreement. The identity-line view shows that most paired wound-area measurements "
        "fall close to the WHST reference across the clean and phase-contrast sequences, while "
        "the phone-capture limitation set contributes the more visibly dispersed points. The "
        "Bland-Altman view is intentionally reported on the absolute area scale rather than as "
        "a percentage difference because near-closure frames are numerically unstable: once the "
        "remaining wound is only a few thousand pixels, a small absolute offset can dominate a "
        "relative-error statistic. The median Cytomove-minus-WHST difference was essentially "
        "zero, and the 2.5-97.5th percentile range remained narrow relative to the full range "
        "of wound areas represented in the time courses. This supports the interpretation that "
        "Cytomove is able to follow the main wound-area trajectory in suitable images, while "
        "also showing why individual late frames require visual review rather than automatic "
        "acceptance.\n\n"
        "Figure 4 connects the numeric summaries with visual evidence. The representative "
        "WHST and Cytomove outputs show that agreement is strongest when the wound corridor is "
        "continuous, centrally located, and visually separable from the cell sheet. Conversely, "
        "the more difficult cases show why a reviewable overlay is not a cosmetic addition but "
        "part of the measurement workflow. In fragmented late wounds, a single scalar endpoint "
        "can suggest high correlation across a time course even though one or more frames need "
        "manual inspection. Cytomove's quality-control labels and valid-row metrics therefore "
        "serve as a companion to the numerical output rather than as a post hoc warning.\n\n"
        "The three-method CSMA comparison in Figure 5 adds useful context because it places "
        "Cytomove and WHST beside native CSMA output for the same matched sequence. All three "
        "methods captured the monotonic decrease in wound area, and the pairwise correlations "
        "among CSMA, WHST, and Cytomove were high. The main difference was not the direction of "
        "the trajectory but the residual area retained by native CSMA in later frames. This "
        "pattern is reported as method-context evidence: different tools can preserve the same "
        "biological trend while making different choices at the wound boundary, especially "
        "when residual gaps become small. Cytomove's contribution here is that the choice is "
        "visible in the overlay and traceable in the exported metadata.\n\n"
        "Figure 6 focuses on the WHAD-MCF7 phase-contrast sequence, where the same issue is "
        "more pronounced because the wound approaches near-complete closure. The area and "
        "width trajectories remained strongly correlated with WHST, but the mean area error "
        "was pulled upward by the latest frame. The median area error gives a more representative "
        "summary of the sequence, while the maximum error identifies the review-sensitive "
        "endpoint. This is why Table 3 reports mean, median, maximum, and correlation together. "
        "No single metric is sufficient: correlation captures trend agreement, MAPE captures "
        "average relative discrepancy, median error reduces the influence of the near-closure "
        "tail, and the maximum error identifies the frame that a user should inspect."
    )

    discussion = "\n\n".join(
        [
            "The main finding is that Cytomove can reproduce WHST-like wound-area behaviour "
            "in image sets that are visually suitable for variance-and-threshold segmentation, "
            "while preserving enough visual and metadata context to identify frames that should "
            "not be interpreted automatically. The clean CSMA sequence provides the strongest "
            "agreement evidence, with low mean and median area error and near-unity area and "
            "width correlations. The WHAD-MCF7 sequence supports the same direction of evidence "
            "in phase-contrast microscopy, but it also demonstrates why near-closure frames need "
            "to be reported carefully: small residual wounds turn modest absolute differences "
            "into large percentage errors. The phone-capture sets broaden the evaluation by "
            "showing how circular fields, uneven illumination, focus variation, and fragmented "
            "late wounds appear in the Cytomove quality-control workflow.",
            impact.split("\n\n")[0]
            + "\n\n"
            + impact.split("\n\n")[1],
            "This emphasis on provenance is not merely a software-engineering preference. "
            "Scratch-assay measurements are often used downstream as evidence for treatment "
            "effects, gene perturbation, drug response, or phenotypic differences in migration. "
            "If the exported number is separated from the mask and settings that generated it, "
            "the reader cannot tell whether a reported difference reflects cell movement, a "
            "threshold choice, a crop boundary, an unrecognised field-of-view artefact, or a "
            "manual correction. Cytomove therefore treats the segmentation as an object of "
            "review. This aligns with the older lesson from TScratch that automated detection "
            "should remain visually inspectable, with WHST's measurement vocabulary for area "
            "and width, with PyScratch's emphasis on usability for non-programmers, and with "
            "CSMA's reminder that cells inside the wound region can materially alter how a "
            "gap should be interpreted.",
            "Cytomove does not attempt to replace mature image-analysis ecosystems such as "
            "ImageJ/Fiji, CellProfiler, ilastik, or recent deep-learning segmentation tools. "
            "Instead, it targets a narrower workflow gap: researchers who need an accessible "
            "scratch-assay analysis path that can be opened in a browser, keeps images local, "
            "shows the segmentation overlay before export, and records the settings behind the "
            "reported numbers. This positioning is complementary to TScratch, WHST, PyScratch, "
            "and CSMA. The present implementation adopts their shared lesson that wound masks "
            "must remain inspectable, but places that lesson into a browser-local and export-rich "
            "workflow.",
            "The literature around scratch-assay analysis also shows that the experimental "
            "problem itself is becoming more spatially explicit. Open-source robotic scratching "
            "platforms address one source of variability by making the physical wound more "
            "reproducible, while recent level-set and image-sector approaches analyse migration "
            "as a spatially resolved process rather than a single global closure fraction. "
            "Cytomove is not yet a kinematic or cell-tracking platform, but this direction is "
            "important for its interpretation. A practical wound-healing tool should support "
            "simple area and width outputs for routine users, while leaving a path toward richer "
            "spatial readouts when the image quality and experimental design justify them. The "
            "current export schema already records enough per-image context to support that "
            "future direction, including the selected preset, crop, rotation, valid-row fraction, "
            "quality-control labels, and manual-correction status.",
            "Recent bioimage-analysis literature makes this positioning more, not less, "
            "important. Generalist and foundation-model approaches such as Cellpose3, "
            "Segment Anything for Microscopy, and MedSAM show how rapidly segmentation methods "
            "are advancing across microscopy and medical-imaging domains (Stringer and "
            "Pachitariu, 2025; Archit et al., 2025; Ma et al., 2024). However, those methods "
            "also highlight the need for task-specific validation, appropriate image-domain "
            "adaptation, and careful interpretation of out-of-distribution performance. "
            "For routine scratch assays, an explainable local pipeline with visible overlays "
            "can therefore remain useful even when more powerful segmentation backends become "
            "available, because the workflow problem is not only segmentation accuracy but also "
            "review, provenance, export, and reproducible reporting.",
            "There is also a pragmatic reason not to make a deep model the default baseline for "
            "this first release. Scratch-assay laboratories vary widely in microscope type, "
            "illumination, cell density, wound geometry, and image storage practices. A learned "
            "model can perform impressively when its training distribution matches the test "
            "images, but it can fail silently when the domain shifts. An explainable variance "
            "and threshold pipeline is less powerful, but its behaviour is easier to inspect: "
            "a smooth low-variance wound region, a textured cell sheet, and a visible contour "
            "are concepts that a bench scientist can judge directly on the image. This does not "
            "argue against learned segmentation in Cytomove. Rather, it argues that any future "
            "learned backend should be optional, reviewable, and evaluated against the same "
            "metadata and visual-audit standards used here.",
            "Area is treated as the primary endpoint because it was more stable across the "
            "current validation sets and because it maps naturally to the segmented wound mask. "
            "Width remains valuable as a secondary quality-control endpoint: it tracks wound "
            "closure trends in clean and phase-contrast images, but it is more sensitive to "
            "fragmented residual wounds, partial closure, and row-wise validity. Reporting both "
            "area and width therefore helps expose disagreement rather than hiding it inside a "
            "single summary statistic.",
            "The treatment of near-closure frames deserves particular caution. In a wound-healing "
            "time course, the final biological state may be the most interesting, but it is also "
            "where relative error becomes least stable. A difference of roughly a thousand "
            "pixels can be small in the context of early open wounds yet large as a fraction of "
            "a nearly closed residual gap. This is why the WHAD-MCF7 sequence is useful despite "
            "raising the mean MAPE: it demonstrates a realistic failure mode in which trend "
            "correlation remains excellent but endpoint relative error becomes large. Reporting "
            "both median and maximum error prevents the late frame from being either hidden or "
            "overgeneralised. The correct reading is not that Cytomove is uniformly accurate in "
            "near-closure images, but that the workflow can identify and expose those frames "
            "for review.",
            "The present validation should be interpreted as preliminary. The strongest evidence "
            "comes from the clean CSMA sequence and the public WHAD-MCF7 phase-contrast time "
            "course, whereas the phone-capture sets are included to expose realistic review and "
            "quality-control behaviour rather than to claim solved accuracy under all acquisition "
            "conditions. The study does not yet include multi-rater manual consensus masks, Dice "
            "or intersection-over-union evaluation, broad cell-line diversity, physical-unit "
            "calibration, runtime benchmarking, or a systematic browser-by-browser reproducibility "
            "test. The current algorithm also does not explicitly model wound-internal cells, a "
            "case highlighted by CSMA and important for future development.",
            "The phone-capture sets should be read with the same restraint. They are valuable "
            "because they approximate the imperfect acquisition conditions encountered in many "
            "laboratories: eyepiece capture, circular fields, uneven illumination, focus variation, "
            "and late-frame fragmentation. They are not a substitute for a larger blinded "
            "validation panel. Their role in this preprint is to show that Cytomove can surface "
            "stress cases and preserve the evidence needed to decide whether a measurement is "
            "usable. A stronger follow-up study should stratify images by modality, cell type, "
            "wound geometry, and acquisition quality, and should compare Cytomove not only with "
            "WHST but also with expert manual masks and additional dedicated tools.",
            "Planned work includes wound-internal cell handling, validation against multi-rater "
            "manual consensus masks with spatial-overlap metrics such as the Dice coefficient "
            "and intersection-over-union, spatial and temporal calibration for physical-unit "
            "closure rates, runtime and browser reproducibility testing, and reproducible export "
            "packages aligned with FAIR data principles. A future optional learned-segmentation "
            "backend may be added for difficult images, but the review-first and local-first "
            "workflow should remain the organising principle."
        ]
    )

    references = references.strip()
    if references.endswith("---"):
        references = references[:-3].strip()

    references += (
        "\n\nArchit, Anwai, Luca Freckmann, Sushmita Nair, Marei Freitag, Carolin Teuber, "
        "Sagnik Gupta, Nabeel Khalid, et al. 2025. \"Segment Anything for Microscopy.\" "
        "*Nature Methods* 22:579-591. https://doi.org/10.1038/s41592-024-02580-4."
        "\n\nLin, Y., A. Silverman-Dultz, M. Bailey, and D. J. Cohen. 2024. \"A Programmable, "
        "Open-Source Robot That Scratches Cultured Tissues to Investigate Cell Migration, "
        "Healing, and Tissue Sculpting.\" *Cell Reports Methods* 4 (12):100915. "
        "https://doi.org/10.1016/j.crmeth.2024.100915."
        "\n\nMa, Jun, Yuting He, Feifei Li, Lin Han, Chenyu You, and Bo Wang. 2024. "
        "\"Segment Anything in Medical Images.\" *Nature Communications* 15:654. "
        "https://doi.org/10.1038/s41467-024-44824-z."
        "\n\nStringer, Carsen, and Marius Pachitariu. 2025. \"Cellpose3: One-Click Image "
        "Restoration for Improved Cellular Segmentation.\" *Nature Methods* 22:592-599. "
        "https://doi.org/10.1038/s41592-025-02595-5."
        "\n\nVašinková, Markéta, Michal Krumnikl, Arootin Gharibian, Ondřej Mičulek, "
        "Eva Kriegová, and Petr Gajdoš. 2025. \"A Novel Method for Evaluating and "
        "Visualizing Scratch Wound Healing Assays Using Level-Set and Image Sector "
        "Analysis.\" *PNAS Nexus* 4 (11):pgaf355. "
        "https://doi.org/10.1093/pnasnexus/pgaf355."
    )

    output = "\n\n".join(
        [
            preamble,
            "## Abstract\n\n" + abstract,
            "## Keywords\n\n" + keywords,
            "## Introduction\n\n" + intro,
            "## Materials and Methods\n\n"
            "### Software implementation and workflow\n\n"
            + software
            + "\n\n### Validation datasets and comparator analysis\n\n"
            + methods_intro,
            "## Results\n\n" + results_intro + "\n\n" + results + "\n\n" + results_followup,
            "## Discussion\n\n" + discussion,
            "## Conclusion\n\n"
            "Cytomove provides a browser-local and reviewable workflow for scratch wound "
            "healing assay quantification. The current evidence supports Cytomove as an "
            "accessible, publication-oriented analysis tool that can produce WHST-comparable "
            "wound-area outputs in suitable images, while preserving the overlay and "
            "quality-control context needed to interpret difficult near-closure and "
            "phone-capture cases.",
            "## Ethics statement\n\n" + ethics,
            "## Funding\n\n" + funding,
            "## Declaration of competing interest\n\n" + competing,
            "## CRediT author statement\n\n" + credit,
            "## Data and software availability\n\n" + availability,
            "## Software and code metadata\n\n" + code_meta,
            "## References\n\n" + references,
            "## Figures\n\n" + figures,
            "## Tables\n\n" + tables,
        ]
    )
    output = "\n".join(line.rstrip() for line in output.splitlines()).strip() + "\n"
    output = bold_in_text_citations(output)
    OUT.write_text(output, encoding="utf-8")
    print(OUT)


if __name__ == "__main__":
    main()
