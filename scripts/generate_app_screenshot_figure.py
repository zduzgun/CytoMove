from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "_screenshot_0.png"
OUT_DIR = ROOT / "docs" / "manuscript_figures"
OUT_PNG = OUT_DIR / "figure_1_app_workspace.png"
OUT_PDF = OUT_DIR / "figure_1_app_workspace.pdf"
OUT_RAW = OUT_DIR / "figure_1_app_screenshot_cropped.png"


def font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    candidates = [
        Path("C:/Windows/Fonts/arialbd.ttf" if bold else "C:/Windows/Fonts/arial.ttf"),
        Path("C:/Windows/Fonts/calibrib.ttf" if bold else "C:/Windows/Fonts/calibri.ttf"),
    ]
    for path in candidates:
        if path.exists():
            return ImageFont.truetype(str(path), size)
    return ImageFont.load_default()


def draw_label(
    draw: ImageDraw.ImageDraw,
    xy: tuple[int, int],
    text: str,
    accent: str = "#0ea5a0",
) -> tuple[int, int, int, int]:
    x, y = xy
    pad_x, pad_y = 16, 10
    label_font = font(28, bold=True)
    bbox = draw.textbbox((0, 0), text, font=label_font)
    w = bbox[2] - bbox[0] + pad_x * 2
    h = bbox[3] - bbox[1] + pad_y * 2
    rect = (x, y, x + w, y + h)
    draw.rounded_rectangle(rect, radius=12, fill="white", outline=accent, width=4)
    draw.text((x + pad_x, y + pad_y - 1), text, font=label_font, fill="#0b2545")
    return rect


def draw_arrow(
    draw: ImageDraw.ImageDraw,
    start: tuple[int, int],
    end: tuple[int, int],
    color: str = "#0ea5a0",
) -> None:
    draw.line([start, end], fill=color, width=5)
    ex, ey = end
    sx, sy = start
    dx = ex - sx
    dy = ey - sy
    if abs(dx) > abs(dy):
        sign = 1 if dx > 0 else -1
        pts = [(ex, ey), (ex - 18 * sign, ey - 10), (ex - 18 * sign, ey + 10)]
    else:
        sign = 1 if dy > 0 else -1
        pts = [(ex, ey), (ex - 10, ey - 18 * sign), (ex + 10, ey - 18 * sign)]
    draw.polygon(pts, fill=color)


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    src = Image.open(SOURCE).convert("RGB")

    # Remove browser print margins and footer while keeping the Cytomove header.
    cropped = src.crop((80, 82, 1648, 2248))
    cropped.save(OUT_RAW)

    target_w = 2200
    target_h = round(cropped.height * target_w / cropped.width)
    panel = cropped.resize((target_w, target_h), Image.Resampling.LANCZOS)

    margin = 70
    header_h = 130
    canvas = Image.new("RGB", (target_w + margin * 2, target_h + header_h + margin), "white")
    draw = ImageDraw.Draw(canvas)

    title_font = font(44, bold=True)
    subtitle_font = font(28)
    draw.text((margin, 32), "Cytomove application workspace", font=title_font, fill="#0b2545")
    draw.text(
        (margin, 86),
        "Local group review with adjustable segmentation controls, overlay inspection, QC summaries, and export-ready outputs.",
        font=subtitle_font,
        fill="#48666a",
    )

    x0 = margin
    y0 = header_h
    canvas.paste(panel, (x0, y0))
    draw.rounded_rectangle((x0, y0, x0 + target_w, y0 + target_h), radius=16, outline="#c7d9d7", width=3)

    # Coordinates below are relative to the resized screenshot panel.
    labels = [
        ((95, 1180), "A  Segmentation controls", (500, 1500)),
        ((970, 200), "B  Overlay review canvas", (1470, 670)),
        ((640, 1240), "C  QC and metric cards", None),
        ((1040, 1435), "D  Group frame review", None),
    ]
    for label_xy, text, target in labels:
        lx, ly = label_xy
        rect = draw_label(draw, (x0 + lx, y0 + ly), text)
        if target:
            tx, ty = target
            start = (rect[2], (rect[1] + rect[3]) // 2)
            draw_arrow(draw, start, (x0 + tx, y0 + ty))

    canvas.save(OUT_PNG, quality=95)
    canvas.save(OUT_PDF, "PDF", resolution=300.0)
    print(OUT_PNG)
    print(OUT_PDF)


if __name__ == "__main__":
    main()
