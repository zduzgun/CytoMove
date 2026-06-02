from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont, ImageOps


ROOT = Path(__file__).resolve().parents[1]
RESULTS = ROOT / "validation_sets" / "comparator_clean" / "results"
OUT = ROOT / "docs" / "manuscript_figures"


def font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    candidates = [
        Path("C:/Windows/Fonts/arialbd.ttf" if bold else "C:/Windows/Fonts/arial.ttf"),
        Path("C:/Windows/Fonts/calibrib.ttf" if bold else "C:/Windows/Fonts/calibri.ttf"),
    ]
    for candidate in candidates:
        if candidate.exists():
            return ImageFont.truetype(str(candidate), size)
    return ImageFont.load_default()


def fit_tile(path: Path, size: int) -> Image.Image:
    with Image.open(path) as image:
        image = ImageOps.exif_transpose(image).convert("RGB")
        image.thumbnail((size, size), Image.Resampling.LANCZOS)
        tile = Image.new("RGB", (size, size), "white")
        x = (size - image.width) // 2
        y = (size - image.height) // 2
        tile.paste(image, (x, y))
        return tile


def draw_centered(draw: ImageDraw.ImageDraw, box: tuple[int, int, int, int], text: str, fill: str, typeface: ImageFont.ImageFont) -> None:
    left, top, right, bottom = box
    bbox = draw.multiline_textbbox((0, 0), text, font=typeface, spacing=4, align="center")
    width = bbox[2] - bbox[0]
    height = bbox[3] - bbox[1]
    draw.multiline_text(
        (left + (right - left - width) / 2, top + (bottom - top - height) / 2),
        text,
        fill=fill,
        font=typeface,
        spacing=4,
        align="center",
    )


def main() -> None:
    raw_dir = ROOT / "validation_sets" / "comparator_clean" / "images_png" / "csma_sample_11"
    csma_dir = RESULTS / "csma" / "csma_sample_11_native_run" / "results_area"
    whst_dir = RESULTS / "whst" / "csma_sample_11"
    cytomove_dir = RESULTS / "cytomove" / "csma_sample_11" / "cytomove_csma_sample_11_overlay_pngs (1)"

    frame_ids = ["001", "002", "003", "010", "015", "020", "025", "035", "040", "045", "049"]
    rows = [
        ("Raw image", sorted(raw_dir.glob("csma_sample_11_*_from_*.png"))),
        ("CSMA area", [csma_dir / f"timepoint_{i}.png" for i in range(11)]),
        ("WHST", [whst_dir / f"{i}.png" for i in range(1, 12)]),
        ("Cytomove", sorted(cytomove_dir.glob("cytomove_csma_sample_11_*_overlay_1537x1537px.png"))),
    ]

    for label, paths in rows:
        if len(paths) != 11:
            raise RuntimeError(f"{label} expected 11 files, found {len(paths)}")
        missing = [path for path in paths if not path.exists()]
        if missing:
            raise FileNotFoundError(f"{label} missing files: {missing}")

    tile = 300
    label_w = 168
    margin = 36
    title_h = 54
    header_h = 34
    gap = 8
    width = margin * 2 + label_w + len(frame_ids) * tile + (len(frame_ids) - 1) * gap
    height = margin * 2 + title_h + header_h + len(rows) * tile + (len(rows) - 1) * gap

    canvas = Image.new("RGB", (width, height), "#FFFFFF")
    draw = ImageDraw.Draw(canvas)
    title_font = font(28, bold=True)
    small_font = font(18, bold=True)
    row_font = font(22, bold=True)

    draw.text(
        (margin, margin - 6),
        "CSMA sample 11 visual audit: raw images and comparator overlays across the time-course",
        fill="#0F172A",
        font=title_font,
    )

    start_x = margin + label_w
    start_y = margin + title_h + header_h
    for col, frame_id in enumerate(frame_ids):
        x = start_x + col * (tile + gap)
        draw_centered(draw, (x, margin + title_h, x + tile, margin + title_h + header_h), f"F{frame_id}", "#334155", small_font)

    for row_index, (row_label, paths) in enumerate(rows):
        y = start_y + row_index * (tile + gap)
        draw.rounded_rectangle((margin, y, margin + label_w - 14, y + tile), radius=6, fill="#F8FAFC", outline="#CBD5E1")
        draw_centered(draw, (margin + 8, y, margin + label_w - 22, y + tile), row_label, "#0F172A", row_font)
        for col, path in enumerate(paths):
            x = start_x + col * (tile + gap)
            draw.rectangle((x - 1, y - 1, x + tile, y + tile), outline="#CBD5E1", width=1)
            canvas.paste(fit_tile(path, tile), (x, y))

    OUT.mkdir(parents=True, exist_ok=True)
    png_path = OUT / "figure_s2_csma_11_frame_visual_audit.png"
    pdf_path = OUT / "figure_s2_csma_11_frame_visual_audit.pdf"
    canvas.save(png_path, "PNG", dpi=(300, 300))
    canvas.save(pdf_path, "PDF", resolution=300)
    print(png_path)
    print(pdf_path)


if __name__ == "__main__":
    main()
