import base64
import io
import time
from collections import deque

import numpy as np
from PIL import Image


def analyze_wound_image_bytes(image_bytes, file_name="local-image", max_side=1200, include_mask=True):
    decode_start = time.perf_counter()
    image = Image.open(io.BytesIO(bytes(image_bytes))).convert("RGB")
    source_width, source_height = image.size
    image = _downsample(image, max_side=max_side)
    analysis_width, analysis_height = image.size
    rgb = np.asarray(image, dtype=np.uint8)
    image_decode_ms = _elapsed_ms(decode_start)

    analysis_start = time.perf_counter()
    gray = _to_gray(rgb)
    norm = _normalize_contrast(gray)
    variance = _local_variance(norm, radius=max(3, round(min(analysis_width, analysis_height) * 0.012)))
    threshold = _otsu_threshold(variance)
    threshold = min(threshold, float(np.percentile(variance, 28)))
    candidate = variance <= threshold
    candidate = _remove_dark_border(candidate, gray)
    mask = _wound_like_component(candidate)
    mask = _fill_small_row_gaps(mask)

    field_area = int(mask.size)
    wound_area = int(mask.sum())
    wound_area_percent = (wound_area * 100.0 / field_area) if field_area else 0.0
    widths = _horizontal_widths(mask)
    mean_width = float(np.mean(widths)) if widths else 0.0
    analysis_ms = _elapsed_ms(analysis_start)

    preview_start = time.perf_counter()
    preview_png = _preview_png(rgb, mask)
    mask_png = _mask_png(mask) if include_mask else None
    preview_ms = _elapsed_ms(preview_start)

    return {
        "fileName": file_name,
        "sourceWidth": source_width,
        "sourceHeight": source_height,
        "analysisWidth": analysis_width,
        "analysisHeight": analysis_height,
        "previewPng": preview_png,
        "maskPng": mask_png,
        "metrics": {
            "woundAreaPercent": round(wound_area_percent, 4),
            "woundAreaPx": wound_area,
            "fieldAreaPx": field_area,
            "meanHorizontalGapWidthPx": round(mean_width, 3),
            "validWidthRows": len(widths),
            "varianceThreshold": round(float(threshold), 6),
        },
        "timings": {
            "imageDecodeMs": image_decode_ms,
            "analysisMs": analysis_ms,
            "previewEncodeMs": preview_ms,
        },
    }


def _downsample(image, max_side=1200):
    max_side = max(200, int(max_side or 1200))
    width, height = image.size
    scale = min(1.0, max_side / max(width, height))
    if scale >= 1:
        return image.copy()
    return image.resize((max(1, round(width * scale)), max(1, round(height * scale))), Image.Resampling.LANCZOS)


def _to_gray(rgb):
    arr = rgb.astype(np.float32)
    return arr[:, :, 0] * 0.2126 + arr[:, :, 1] * 0.7152 + arr[:, :, 2] * 0.0722


def _normalize_contrast(gray):
    lo, hi = np.percentile(gray, [1, 99])
    if hi <= lo:
        return np.zeros_like(gray, dtype=np.float32)
    return np.clip((gray - lo) / (hi - lo), 0, 1).astype(np.float32)


def _local_variance(gray, radius=7):
    radius = max(1, int(radius))
    mean = _box_filter(gray, radius)
    mean_sq = _box_filter(gray * gray, radius)
    return np.maximum(0, mean_sq - mean * mean)


def _box_filter(arr, radius):
    padded = np.pad(arr, radius, mode="edge")
    integral = np.pad(padded, ((1, 0), (1, 0)), mode="constant").cumsum(axis=0).cumsum(axis=1)
    kernel = radius * 2 + 1
    total = (
        integral[kernel:, kernel:]
        - integral[:-kernel, kernel:]
        - integral[kernel:, :-kernel]
        + integral[:-kernel, :-kernel]
    )
    return total / float(kernel * kernel)


def _otsu_threshold(values):
    flat = np.asarray(values, dtype=np.float32).ravel()
    if flat.size == 0:
        return 0.0
    max_value = float(flat.max())
    if max_value <= 0:
        return 0.0
    hist, edges = np.histogram(flat, bins=256, range=(0, max_value))
    total = hist.sum()
    if total <= 0:
        return float(np.percentile(flat, 35))
    centers = (edges[:-1] + edges[1:]) / 2
    weight_bg = np.cumsum(hist)
    weight_fg = total - weight_bg
    sum_bg = np.cumsum(hist * centers)
    sum_total = sum_bg[-1]
    valid = (weight_bg > 0) & (weight_fg > 0)
    score = np.zeros_like(centers)
    score[valid] = ((sum_total * weight_bg[valid] - sum_bg[valid] * total) ** 2) / (
        weight_bg[valid] * weight_fg[valid]
    )
    threshold = float(centers[int(np.argmax(score))])
    return max(threshold, float(np.percentile(flat, 20)))


def _remove_dark_border(mask, gray):
    border = np.concatenate([gray[0, :], gray[-1, :], gray[:, 0], gray[:, -1]])
    dark_cutoff = max(4, np.percentile(border, 8) + 3)
    return mask & (gray > dark_cutoff)


def _wound_like_component(mask):
    height, width = mask.shape
    visited = np.zeros(mask.shape, dtype=bool)
    best_pixels = []
    best_score = -1.0
    for y in range(height):
        row = mask[y]
        for x in np.flatnonzero(row & ~visited[y]):
            if visited[y, x] or not mask[y, x]:
                continue
            pixels = _collect_component(mask, visited, int(x), int(y))
            score = _wound_component_score(pixels, width, height)
            if score > best_score:
                best_score = score
                best_pixels = pixels

    out = np.zeros(mask.shape, dtype=bool)
    if best_pixels:
        ys, xs = zip(*best_pixels)
        out[np.array(ys), np.array(xs)] = True
    return out


def _wound_component_score(pixels, width, height):
    if not pixels:
        return 0.0
    ys = np.fromiter((p[0] for p in pixels), dtype=np.float32)
    xs = np.fromiter((p[1] for p in pixels), dtype=np.float32)
    x_span = float(xs.max() - xs.min() + 1)
    y_span = float(ys.max() - ys.min() + 1)
    center_x = float(xs.mean())
    center_score = 1.0 / (1.0 + abs(center_x - width / 2.0) / max(1.0, width / 3.0))
    vertical_score = min(1.0, y_span / max(1.0, height * 0.55))
    narrow_score = max(0.08, 1.0 - x_span / max(1.0, width))
    return len(pixels) * center_score * vertical_score * narrow_score


def _collect_component(mask, visited, start_x, start_y):
    height, width = mask.shape
    queue = deque([(start_y, start_x)])
    visited[start_y, start_x] = True
    pixels = []
    while queue:
        y, x = queue.popleft()
        pixels.append((y, x))
        for ny, nx in ((y - 1, x), (y + 1, x), (y, x - 1), (y, x + 1)):
            if 0 <= ny < height and 0 <= nx < width and not visited[ny, nx] and mask[ny, nx]:
                visited[ny, nx] = True
                queue.append((ny, nx))
    return pixels


def _fill_small_row_gaps(mask):
    out = mask.copy()
    height, width = out.shape
    max_gap = max(2, round(width * 0.015))
    for y in range(height):
        xs = np.flatnonzero(out[y])
        if xs.size < 2:
            continue
        start = int(xs[0])
        prev = int(xs[0])
        for x in xs[1:]:
            x = int(x)
            if x - prev <= max_gap:
                out[y, prev:x + 1] = True
            prev = x
        out[y, start:prev + 1] = True
    return out


def _horizontal_widths(mask):
    widths = []
    min_width = max(3, round(mask.shape[1] * 0.003))
    for row in mask:
        xs = np.flatnonzero(row)
        if xs.size:
            width = int(xs[-1] - xs[0] + 1)
            if width >= min_width:
                widths.append(width)
    return widths


def _preview_png(rgb, mask):
    preview = rgb.copy()
    edge = _mask_edge(mask)
    overlay = mask & ~edge
    preview[overlay] = (preview[overlay] * 0.72 + np.array([255, 76, 76]) * 0.28).astype(np.uint8)
    preview[edge] = np.array([255, 0, 0], dtype=np.uint8)
    return _array_png_data_url(preview)


def _mask_png(mask):
    img = np.zeros((*mask.shape, 4), dtype=np.uint8)
    img[mask] = np.array([255, 255, 255, 255], dtype=np.uint8)
    return _array_png_data_url(img)


def _mask_edge(mask):
    edge = mask.copy()
    edge[1:, :] &= mask[:-1, :]
    edge[:-1, :] &= mask[1:, :]
    edge[:, 1:] &= mask[:, :-1]
    edge[:, :-1] &= mask[:, 1:]
    return mask & ~edge


def _array_png_data_url(arr):
    buffer = io.BytesIO()
    Image.fromarray(arr).save(buffer, format="PNG")
    encoded = base64.b64encode(buffer.getvalue()).decode("ascii")
    return f"data:image/png;base64,{encoded}"


def _elapsed_ms(start):
    return int(round((time.perf_counter() - start) * 1000))
