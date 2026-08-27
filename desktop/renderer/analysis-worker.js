'use strict';

const ALGORITHM_VERSION='cytomove-whst-variance-v1.0';

function toGray(data, len) {
  const gray = new Uint8Array(len);
  for (let i = 0, p = 0; i < data.length; i += 4, p++) {
    gray[p] = (0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]) | 0;
  }
  return gray;
}

function fovMask(gray, len, cutoff, mode = 'full') {
  const field = new Uint8Array(len);
  if (mode === 'full') {
    field.fill(1);
    return field;
  }
  const threshold = Math.max(1, Number(cutoff) || 18);
  for (let p = 0; p < len; p++) field[p] = gray[p] > threshold ? 1 : 0;
  return field;
}

function enhanceContrast(gray, field, len) {
  const histogram = new Uint32Array(256);
  let count = 0;
  for (let p = 0; p < len; p++) {
    if (field[p]) {
      histogram[gray[p]]++;
      count++;
    }
  }
  let low = 0;
  let high = 255;
  let accumulated = 0;
  const lowTarget = Math.floor(count * 0.01);
  const highTarget = Math.floor(count * 0.99);
  for (let value = 0; value < 256; value++) {
    accumulated += histogram[value];
    if (accumulated >= lowTarget) {
      low = value;
      break;
    }
  }
  accumulated = 0;
  for (let value = 0; value < 256; value++) {
    accumulated += histogram[value];
    if (accumulated >= highTarget) {
      high = value;
      break;
    }
  }
  const range = Math.max(1, high - low);
  const normalized = new Uint8Array(len);
  for (let p = 0; p < len; p++) {
    if (!field[p]) continue;
    normalized[p] = Math.max(0, Math.min(255, ((gray[p] - low) * 255 / range) | 0));
  }
  return normalized;
}

function varianceFilter(source, field, width, height, radius) {
  const length = width * height;
  const sums = new Float64Array(length);
  const squaredSums = new Float64Array(length);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const p = y * width + x;
      const value = source[p];
      const above = y > 0 ? sums[p - width] : 0;
      const left = x > 0 ? sums[p - 1] : 0;
      const diagonal = y > 0 && x > 0 ? sums[p - width - 1] : 0;
      sums[p] = value + above + left - diagonal;
      const aboveSquared = y > 0 ? squaredSums[p - width] : 0;
      const leftSquared = x > 0 ? squaredSums[p - 1] : 0;
      const diagonalSquared = y > 0 && x > 0 ? squaredSums[p - width - 1] : 0;
      squaredSums[p] = value * value + aboveSquared + leftSquared - diagonalSquared;
    }
  }
  const variance = new Float32Array(length);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const p = y * width + x;
      if (!field[p]) continue;
      const y0 = Math.max(0, y - radius);
      const y1 = Math.min(height - 1, y + radius);
      const x0 = Math.max(0, x - radius);
      const x1 = Math.min(width - 1, x + radius);
      const count = (y1 - y0 + 1) * (x1 - x0 + 1);
      const sum = sums[y1 * width + x1]
        - (x0 > 0 ? sums[y1 * width + x0 - 1] : 0)
        - (y0 > 0 ? sums[(y0 - 1) * width + x1] : 0)
        + (x0 > 0 && y0 > 0 ? sums[(y0 - 1) * width + x0 - 1] : 0);
      const squaredSum = squaredSums[y1 * width + x1]
        - (x0 > 0 ? squaredSums[y1 * width + x0 - 1] : 0)
        - (y0 > 0 ? squaredSums[(y0 - 1) * width + x1] : 0)
        + (x0 > 0 && y0 > 0 ? squaredSums[(y0 - 1) * width + x0 - 1] : 0);
      variance[p] = Math.max(0, squaredSum / count - (sum / count) * (sum / count));
    }
  }
  return variance;
}

function otsuOnMap(variance, field, length) {
  let maxVariance = 0;
  for (let p = 0; p < length; p++) {
    if (field[p] && variance[p] > maxVariance) maxVariance = variance[p];
  }
  maxVariance = Math.max(1, maxVariance);
  const histogram = new Uint32Array(256);
  for (let p = 0; p < length; p++) {
    if (field[p]) histogram[Math.min(255, (variance[p] * 255 / maxVariance) | 0)]++;
  }
  const total = histogram.reduce((sum, value) => sum + value, 0);
  let weightedTotal = 0;
  for (let i = 0; i < 256; i++) weightedTotal += i * histogram[i];
  let weightedBackground = 0;
  let background = 0;
  let best = -1;
  let threshold = 128;
  for (let i = 0; i < 256; i++) {
    background += histogram[i];
    if (!background) continue;
    const foreground = total - background;
    if (!foreground) break;
    weightedBackground += i * histogram[i];
    const backgroundMean = weightedBackground / background;
    const foregroundMean = (weightedTotal - weightedBackground) / foreground;
    const score = background * foreground * (backgroundMean - foregroundMean) ** 2;
    if (score > best) {
      best = score;
      threshold = i;
    }
  }
  return { threshold, maxV: maxVariance };
}

function percentileThresholdOnMap(variance, field, length, maxVariance, percentile) {
  const histogram = new Uint32Array(256);
  let total = 0;
  for (let p = 0; p < length; p++) {
    if (!field[p]) continue;
    histogram[Math.min(255, (variance[p] * 255 / maxVariance) | 0)]++;
    total++;
  }
  const target = Math.max(1, Math.round(total * percentile));
  let accumulated = 0;
  for (let i = 0; i < 256; i++) {
    accumulated += histogram[i];
    if (accumulated >= target) return i;
  }
  return 255;
}

function darkPercentile(gray, field, length, percentile) {
  const histogram = new Uint32Array(256);
  let total = 0;
  for (let p = 0; p < length; p++) {
    if (!field[p]) continue;
    histogram[gray[p]]++;
    total++;
  }
  const target = Math.max(1, Math.round(total * percentile));
  let accumulated = 0;
  for (let i = 0; i < 256; i++) {
    accumulated += histogram[i];
    if (accumulated >= target) return i;
  }
  return 255;
}

function applyThreshold(variance, field, length, threshold, maxVariance, gray, mode) {
  const mask = new Uint8Array(length);
  const normalizedThreshold = threshold * maxVariance / 255;
  const darkThreshold = mode === 'full' ? darkPercentile(gray, field, length, 0.42) : 255;
  const brightfieldFloor = mode === 'cutoff' ? darkPercentile(gray, field, length, 0.18) : 0;
  for (let p = 0; p < length; p++) {
    if (!field[p] || variance[p] > normalizedThreshold) continue;
    if (mode === 'full' && gray[p] > darkThreshold) continue;
    if (mode === 'cutoff' && gray[p] < brightfieldFloor) continue;
    mask[p] = 1;
  }
  return mask;
}

function dilateMaskSquare(mask, width, height, radius) {
  radius = Math.max(0, Math.round(radius));
  if (!radius) return new Uint8Array(mask);
  const stride = width + 1;
  const integral = new Uint32Array((width + 1) * (height + 1));
  for (let y = 0; y < height; y++) {
    let row = 0;
    const sourceRow = y * width;
    const integralRow = (y + 1) * stride;
    const previousRow = y * stride;
    for (let x = 0; x < width; x++) {
      row += mask[sourceRow + x] ? 1 : 0;
      integral[integralRow + x + 1] = integral[previousRow + x + 1] + row;
    }
  }
  const output = new Uint8Array(width * height);
  for (let y = 0; y < height; y++) {
    const y0 = Math.max(0, y - radius);
    const y1 = Math.min(height - 1, y + radius);
    const top = y0 * stride;
    const bottom = (y1 + 1) * stride;
    for (let x = 0; x < width; x++) {
      const x0 = Math.max(0, x - radius);
      const x1 = Math.min(width - 1, x + radius);
      const sum = integral[bottom + x1 + 1] - integral[top + x1 + 1]
        - integral[bottom + x0] + integral[top + x0];
      if (sum > 0) output[y * width + x] = 1;
    }
  }
  return output;
}

function erodeMaskSquare(mask, width, height, radius) {
  radius = Math.max(0, Math.round(radius));
  if (!radius) return new Uint8Array(mask);
  const stride = width + 1;
  const integral = new Uint32Array((width + 1) * (height + 1));
  for (let y = 0; y < height; y++) {
    let row = 0;
    for (let x = 0; x < width; x++) {
      row += mask[y * width + x] ? 1 : 0;
      const p = (y + 1) * stride + x + 1;
      integral[p] = integral[p - stride] + row;
    }
  }
  const output = new Uint8Array(mask.length);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const x0 = Math.max(0, x - radius);
      const x1 = Math.min(width - 1, x + radius);
      const y0 = Math.max(0, y - radius);
      const y1 = Math.min(height - 1, y + radius);
      const area = (x1 - x0 + 1) * (y1 - y0 + 1);
      const sum = integral[(y1 + 1) * stride + x1 + 1]
        - integral[y0 * stride + x1 + 1]
        - integral[(y1 + 1) * stride + x0]
        + integral[y0 * stride + x0];
      if (sum === area) output[y * width + x] = 1;
    }
  }
  return output;
}

function smoothPhaseContrastMask(mask, width, height, mode) {
  if (mode !== 'full') return { mask, changed: 0, radius: 0 };
  const radius = Math.max(1, Math.min(3, Math.round(Math.min(width, height) * 0.0016)));
  const closed = erodeMaskSquare(dilateMaskSquare(mask, width, height, radius), width, height, radius);
  const opened = dilateMaskSquare(erodeMaskSquare(closed, width, height, 1), width, height, 1);
  const output = new Uint8Array(mask.length);
  let changed = 0;
  for (let p = 0; p < mask.length; p++) {
    output[p] = opened[p];
    if (output[p] !== mask[p]) changed++;
  }
  return { mask: output, changed, radius };
}

function constrainToPrior(raw, width, height, prior) {
  if (!prior) return { mask: raw, applied: false, priorArea: 0, radius: 0 };
  const radius = Math.max(8, Math.min(80, Math.round(Math.min(width, height) * 0.035)));
  const expanded = dilateMaskSquare(prior, width, height, radius);
  const mask = new Uint8Array(raw.length);
  let priorArea = 0;
  let kept = 0;
  for (let p = 0; p < raw.length; p++) {
    if (expanded[p]) priorArea++;
    if (raw[p] && expanded[p]) {
      mask[p] = 1;
      kept++;
    }
  }
  return { mask, applied: kept > 0, priorArea, radius };
}

function tinyIslandMaxArea(width, height, mode = 'medium') {
  const fractions = { off: 0, trace: 0.00025, 'very-low': 0.0006, low: 0.0015, moderate: 0.0035, medium: 0.006, high: 0.018 };
  const fraction = fractions[mode] ?? fractions.medium;
  return fraction <= 0 ? 0 : Math.max(16, Math.round(width * height * fraction));
}

function fillSmallHoles(mask, width, height, maxHoleArea) {
  const length = width * height;
  const inverse = new Uint8Array(length);
  for (let p = 0; p < length; p++) inverse[p] = mask[p] ? 0 : 1;
  const visited = new Uint8Array(length);
  const queue = new Int32Array(length);
  let head = 0;
  let tail = 0;
  for (let x = 0; x < width; x++) {
    if (inverse[x] && !visited[x]) {
      visited[x] = 1;
      queue[tail++] = x;
    }
    const bottom = (height - 1) * width + x;
    if (inverse[bottom] && !visited[bottom]) {
      visited[bottom] = 1;
      queue[tail++] = bottom;
    }
  }
  for (let y = 1; y < height - 1; y++) {
    const left = y * width;
    if (inverse[left] && !visited[left]) {
      visited[left] = 1;
      queue[tail++] = left;
    }
    const right = left + width - 1;
    if (inverse[right] && !visited[right]) {
      visited[right] = 1;
      queue[tail++] = right;
    }
  }
  const neighbors = [-1, 1, -width, width];
  while (head < tail) {
    const p = queue[head++];
    const x = p % width;
    for (const offset of neighbors) {
      const next = p + offset;
      if (next < 0 || next >= length || visited[next] || !inverse[next]) continue;
      if (offset === -1 && x === 0) continue;
      if (offset === 1 && x === width - 1) continue;
      visited[next] = 1;
      queue[tail++] = next;
    }
  }
  const output = new Uint8Array(mask);
  const holeQueue = new Int32Array(length);
  let filledHoleCount = 0;
  let filledHoleArea = 0;
  let reportedHoleCount = 0;
  let reportedHoleArea = 0;
  let reportedLargestHoleArea = 0;
  const reportHoleArea = Math.max(maxHoleArea * 2, Math.round(width * height * 0.004));
  for (let start = 0; start < length; start++) {
    if (!inverse[start] || visited[start]) continue;
    let holeHead = 0;
    let holeTail = 0;
    let area = 0;
    holeQueue[holeTail++] = start;
    visited[start] = 1;
    while (holeHead < holeTail) {
      const p = holeQueue[holeHead++];
      const x = p % width;
      area++;
      for (const offset of neighbors) {
        const next = p + offset;
        if (next < 0 || next >= length || visited[next] || !inverse[next]) continue;
        if (offset === -1 && x === 0) continue;
        if (offset === 1 && x === width - 1) continue;
        visited[next] = 1;
        holeQueue[holeTail++] = next;
      }
    }
    if (area <= maxHoleArea) {
      filledHoleCount++;
      filledHoleArea += area;
      for (let i = 0; i < holeTail; i++) output[holeQueue[i]] = 1;
    } else if (area >= reportHoleArea) {
      reportedHoleCount++;
      reportedHoleArea += area;
      reportedLargestHoleArea = Math.max(reportedLargestHoleArea, area);
    }
  }
  return {
    mask: output,
    holeCount: reportedHoleCount,
    holeArea: reportedHoleArea,
    filledHoleCount,
    filledHoleArea,
    largestHoleArea: reportedLargestHoleArea,
    maxHoleArea,
    reportHoleArea
  };
}

function filterComponents(mask, width, height, minArea) {
  const length = width * height;
  const labels = new Int32Array(length);
  const areas = [0];
  const queue = new Int32Array(length);
  const neighbors = [-1, 1, -width, width];
  let label = 1;
  for (let start = 0; start < length; start++) {
    if (!mask[start] || labels[start]) continue;
    let head = 0;
    let tail = 0;
    let area = 0;
    queue[tail++] = start;
    labels[start] = label;
    while (head < tail) {
      const p = queue[head++];
      const x = p % width;
      area++;
      for (const offset of neighbors) {
        const next = p + offset;
        if (next < 0 || next >= length || labels[next] || !mask[next]) continue;
        if (offset === -1 && x === 0) continue;
        if (offset === 1 && x === width - 1) continue;
        labels[next] = label;
        queue[tail++] = next;
      }
    }
    areas[label++] = area;
  }
  const output = new Uint8Array(length);
  let keptComponents = 0;
  let largestArea = 0;
  for (let i = 1; i < areas.length; i++) {
    largestArea = Math.max(largestArea, areas[i]);
    if (areas[i] >= minArea) keptComponents++;
  }
  for (let p = 0; p < length; p++) {
    if (labels[p] && areas[labels[p]] >= minArea) output[p] = 1;
  }
  return { mask: output, totalComponents: areas.length - 1, keptComponents, largestArea };
}

function componentDetails(mask, width, height) {
  const length = width * height;
  const labels = new Int32Array(length);
  const queue = new Int32Array(length);
  const details = [];
  const neighbors = [-1, 1, -width, width];
  let label = 1;
  for (let start = 0; start < length; start++) {
    if (!mask[start] || labels[start]) continue;
    let head = 0;
    let tail = 0;
    let area = 0;
    let minX = width;
    let maxX = 0;
    let minY = height;
    let maxY = 0;
    let sumX = 0;
    let sumY = 0;
    queue[tail++] = start;
    labels[start] = label;
    while (head < tail) {
      const p = queue[head++];
      const x = p % width;
      const y = (p / width) | 0;
      area++;
      sumX += x;
      sumY += y;
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);
      for (const offset of neighbors) {
        const next = p + offset;
        if (next < 0 || next >= length || labels[next] || !mask[next]) continue;
        if (offset === -1 && x === 0) continue;
        if (offset === 1 && x === width - 1) continue;
        labels[next] = label;
        queue[tail++] = next;
      }
    }
    details.push({
      label,
      area,
      cx: sumX / area,
      cy: sumY / area,
      rowCoverage: (maxY - minY + 1) / Math.max(1, height),
      colCoverage: (maxX - minX + 1) / Math.max(1, width)
    });
    label++;
  }
  return { labels, details };
}

function enforceWoundContinuity(mask, width, height, orientation, mode) {
  const { labels, details } = componentDetails(mask, width, height);
  if (details.length <= 1) return { mask, kept: details.length, total: details.length, applied: false };
  const vertical = orientation !== 'horizontal';
  const center = vertical ? width / 2 : height / 2;
  const halfSize = Math.max(1, vertical ? width : height);
  const phaseContrast = mode === 'full';
  const maxArea = Math.max(1, [...details].sort((a, b) => b.area - a.area)[0]?.area || 1);
  const scored = details.map(detail => {
    const axis = vertical ? detail.cx : detail.cy;
    const centerDist = Math.abs(axis - center) / halfSize;
    const span = vertical ? detail.rowCoverage : detail.colCoverage;
    const areaNorm = detail.area / maxArea;
    return { ...detail, centerDist, span, score: span * 2.2 + areaNorm * 0.9 - centerDist * 1.6 };
  });
  const centerCandidates = phaseContrast
    ? scored.filter(detail => detail.centerDist <= 0.24 && detail.span >= 0.18)
    : scored;
  const ranked = (centerCandidates.length ? centerCandidates : scored).sort((a, b) => b.score - a.score);
  const primary = ranked[0];
  if (phaseContrast && (!primary || primary.centerDist > 0.3 || primary.span < 0.16)) {
    return { mask: new Uint8Array(mask.length), kept: 0, total: details.length, applied: true };
  }
  const spanFloor = phaseContrast ? Math.max(0.18, primary.span * 0.55) : Math.max(0.04, primary.span * 0.35);
  const centerFloor = phaseContrast
    ? Math.min(0.28, Math.max(0.1, primary.centerDist + 0.08))
    : Math.min(0.24, Math.max(0.12, primary.centerDist + 0.10));
  let kept = new Set(ranked
    .filter(detail => detail.span >= spanFloor && detail.centerDist <= centerFloor)
    .map(detail => detail.label));
  if (!kept.size) kept = new Set([primary.label]);
  const output = new Uint8Array(mask.length);
  for (let p = 0; p < mask.length; p++) {
    if (labels[p] && kept.has(labels[p])) output[p] = 1;
  }
  return { mask: output, kept: kept.size, total: details.length, applied: true };
}

function closePhaseContrastSlits(mask, width, height, mode) {
  if (mode !== 'full') return { mask, filled: 0, slits: 0 };
  const output = new Uint8Array(mask);
  const maxGap = Math.max(3, Math.round(width * 0.028));
  const minSpan = Math.max(10, Math.round(height * 0.035));
  const columnHits = new Map();
  let filled = 0;
  let slits = 0;
  for (let y = 0; y < height; y++) {
    let x = 0;
    while (x < width) {
      while (x < width && mask[y * width + x]) x++;
      const start = x;
      while (x < width && !mask[y * width + x]) x++;
      const end = x - 1;
      const gapWidth = end - start + 1;
      if (gapWidth <= 0 || gapWidth > maxGap) continue;
      if (!(start > 0 && mask[y * width + start - 1]) || !(end < width - 1 && mask[y * width + end + 1])) continue;
      const key = Math.round(Math.round((start + end) / 2) / 3);
      const hit = columnHits.get(key) || { count: 0, pixels: [] };
      hit.count++;
      for (let gapX = start; gapX <= end; gapX++) {
        const p = y * width + gapX;
        output[p] = 2;
        hit.pixels.push(p);
      }
      columnHits.set(key, hit);
    }
  }
  for (const hit of columnHits.values()) {
    if (hit.count < minSpan) continue;
    slits++;
    for (const p of hit.pixels) {
      if (output[p] !== 1) {
        output[p] = 1;
        filled++;
      }
    }
  }
  for (let p = 0; p < output.length; p++) {
    if (output[p] === 2) output[p] = 0;
  }
  return { mask: output, filled, slits };
}

function bridgeWoundGaps(mask, width, height, orientation) {
  if (orientation === 'horizontal') return { mask, filled: 0, gaps: 0 };
  const rows = [];
  for (let y = 0; y < height; y++) {
    let low = -1;
    let high = -1;
    for (let x = 0; x < width; x++) {
      if (!mask[y * width + x]) continue;
      if (low < 0) low = x;
      high = x;
    }
    if (low >= 0) rows.push({ y, low, high, center: (low + high) / 2, width: high - low + 1 });
  }
  if (rows.length < 2) return { mask, filled: 0, gaps: 0 };
  const output = new Uint8Array(mask);
  const maxGap = Math.max(6, Math.round(height * 0.22));
  const maxShift = Math.max(18, Math.round(width * 0.14));
  let filled = 0;
  let gaps = 0;
  for (let i = 0; i < rows.length - 1; i++) {
    const first = rows[i];
    const second = rows[i + 1];
    const gap = second.y - first.y - 1;
    if (gap <= 0 || gap > maxGap || Math.abs(first.center - second.center) > maxShift) continue;
    const overlap = Math.min(first.high, second.high) - Math.max(first.low, second.low);
    if (overlap < -Math.max(10, Math.round(Math.min(first.width, second.width) * 0.65))) continue;
    gaps++;
    for (let y = first.y + 1; y < second.y; y++) {
      const progress = (y - first.y) / (second.y - first.y);
      const padding = Math.max(2, Math.round(Math.min(first.width, second.width) * 0.08));
      const low = Math.max(0, Math.round(first.low + (second.low - first.low) * progress) - padding);
      const high = Math.min(width - 1, Math.round(first.high + (second.high - first.high) * progress) + padding);
      for (let x = low; x <= high; x++) {
        const p = y * width + x;
        if (!output[p]) {
          output[p] = 1;
          filled++;
        }
      }
    }
  }
  return { mask: output, filled, gaps };
}

function extendWoundToFrameEdges(mask, width, height, orientation, mode) {
  if (orientation === 'horizontal' || mode !== 'cutoff') return { mask, filled: 0, edges: 0 };
  const rows = [];
  for (let y = 0; y < height; y++) {
    let low = -1;
    let high = -1;
    for (let x = 0; x < width; x++) {
      if (!mask[y * width + x]) continue;
      if (low < 0) low = x;
      high = x;
    }
    if (low >= 0) rows.push({ y, low, high, center: (low + high) / 2, width: high - low + 1 });
  }
  if (!rows.length) return { mask, filled: 0, edges: 0 };
  const output = new Uint8Array(mask);
  const minWidth = Math.max(8, Math.round(width * 0.025));
  const maxShift = Math.max(18, Math.round(width * 0.12));
  const maxLook = Math.max(8, Math.round(height * 0.22));
  let filled = 0;
  let edges = 0;
  const paint = (row, direction) => {
    if (!row || row.width < minWidth) return;
    const edgeGap = direction < 0 ? row.y : height - 1 - row.y;
    if (edgeGap <= 0 || edgeGap > maxLook) return;
    const nearby = direction < 0
      ? rows.filter(item => item.y >= row.y && item.y <= row.y + Math.max(4, Math.round(height * 0.04)))
      : rows.filter(item => item.y <= row.y && item.y >= row.y - Math.max(4, Math.round(height * 0.04)));
    if (nearby.length >= 2 && !nearby.every(item => Math.abs(item.center - row.center) <= maxShift)) return;
    edges++;
    const startY = direction < 0 ? 0 : row.y;
    const endY = direction < 0 ? row.y : height - 1;
    const padding = Math.max(2, Math.round(row.width * 0.08));
    const low = Math.max(0, row.low - padding);
    const high = Math.min(width - 1, row.high + padding);
    for (let y = startY; y <= endY; y++) {
      for (let x = low; x <= high; x++) {
        const p = y * width + x;
        if (!output[p]) {
          output[p] = 1;
          filled++;
        }
      }
    }
  };
  paint(rows[0], -1);
  paint(rows[rows.length - 1], 1);
  return { mask: output, filled, edges };
}

function estimateWidth(mask, width, height) {
  const spans = [];
  const minValidWidth = Math.max(3, Math.round(width * 0.002));
  for (let y = 0; y < height; y++) {
    let low = -1;
    let high = -1;
    for (let x = 0; x < width; x++) {
      if (!mask[y * width + x]) continue;
      if (low < 0) low = x;
      high = x;
    }
    if (low >= 0 && high - low + 1 >= minValidWidth) spans.push(high - low + 1);
  }
  if (!spans.length) {
    return { mean: 0, median: 0, sd: 0, cv: 0, min: 0, max: 0, validRows: 0, validRowFraction: 0, minValidWidth };
  }
  spans.sort((a, b) => a - b);
  const mean = spans.reduce((sum, value) => sum + value, 0) / spans.length;
  const midpoint = Math.floor(spans.length / 2);
  const median = spans.length % 2 ? spans[midpoint] : (spans[midpoint - 1] + spans[midpoint]) / 2;
  const standardDeviation = Math.sqrt(spans.reduce((sum, value) => sum + (value - mean) ** 2, 0) / spans.length);
  return {
    mean,
    median,
    sd: standardDeviation,
    cv: mean ? standardDeviation * 100 / mean : 0,
    min: spans[0],
    max: spans[spans.length - 1],
    validRows: spans.length,
    validRowFraction: spans.length * 100 / height,
    minValidWidth
  };
}

function countComponents(mask, width, height) {
  const length = width * height;
  const visited = new Uint8Array(length);
  const queue = new Int32Array(length);
  const neighbors = [-1, 1, -width, width];
  let totalComponents = 0;
  let largestArea = 0;
  for (let start = 0; start < length; start++) {
    if (!mask[start] || visited[start]) continue;
    totalComponents++;
    let head = 0;
    let tail = 0;
    let area = 0;
    queue[tail++] = start;
    visited[start] = 1;
    while (head < tail) {
      const p = queue[head++];
      const x = p % width;
      area++;
      for (const offset of neighbors) {
        const next = p + offset;
        if (next < 0 || next >= length || visited[next] || !mask[next]) continue;
        if (offset === -1 && x === 0) continue;
        if (offset === 1 && x === width - 1) continue;
        visited[next] = 1;
        queue[tail++] = next;
      }
    }
    largestArea = Math.max(largestArea, area);
  }
  return { totalComponents, keptComponents: totalComponents, largestArea };
}

function boundaryPixels(mask, width, height) {
  const boundary = new Int32Array(mask.length);
  let count = 0;
  for (let p = 0; p < mask.length; p++) {
    if (!mask[p]) continue;
    const x = p % width;
    const y = (p / width) | 0;
    if (x === 0 || y === 0 || x === width - 1 || y === height - 1
      || !mask[p - 1] || !mask[p + 1] || !mask[p - width] || !mask[p + width]) boundary[count++] = p;
  }
  return boundary.slice(0,count);
}

function analyze(message) {
  const started = performance.now();
  const width = message.width;
  const height = message.height;
  const length = width * height;
  const settings = message.settings;
  const rgba=new Uint8ClampedArray(message.rgbaBuffer);
  const prior = message.priorBuffer ? new Uint8Array(message.priorBuffer) : null;
  const gray = toGray(rgba, length);
  const field = fovMask(gray, length, settings.fovCutoff, settings.fovMode);
  const normalized = enhanceContrast(gray, field, length);
  const variance = varianceFilter(normalized, field, width, height, settings.varianceRadius);
  const { threshold: otsuThreshold, maxV } = otsuOnMap(variance, field, length);
  const fallbackThreshold = percentileThresholdOnMap(variance, field, length, maxV, 0.38);
  const baseThreshold = otsuThreshold < 3 ? fallbackThreshold : otsuThreshold;
  const threshold = Math.max(1, Math.min(255, baseThreshold + settings.thresholdOffset));
  const raw = applyThreshold(variance, field, length, threshold, maxV, gray, settings.fovMode);
  const priorResult = constrainToPrior(raw, width, height, prior);
  const filtered = filterComponents(priorResult.mask, width, height, settings.minComponent);
  const holeFillLimit = tinyIslandMaxArea(width, height, settings.tinyIslandMode);
  const holeResult = fillSmallHoles(filtered.mask, width, height, holeFillLimit);
  for (let p = 0; p < length; p++) {
    if (!field[p]) holeResult.mask[p] = 0;
  }
  const continuity = enforceWoundContinuity(holeResult.mask, width, height, settings.scratchOrientation, settings.fovMode);
  const slitClose = closePhaseContrastSlits(continuity.mask, width, height, settings.fovMode);
  const smooth = smoothPhaseContrastMask(slitClose.mask, width, height, settings.fovMode);
  const bridge = bridgeWoundGaps(smooth.mask, width, height, settings.scratchOrientation);
  const edgeExtend = extendWoundToFrameEdges(bridge.mask, width, height, settings.scratchOrientation, settings.fovMode);
  const finalHoleResult = fillSmallHoles(edgeExtend.mask, width, height, holeFillLimit);
  const finalMask = finalHoleResult.mask;
  const finalComponents = countComponents(finalMask, width, height);
  let area = 0;
  let fieldArea = 0;
  for (let p = 0; p < length; p++) {
    fieldArea += field[p];
    area += finalMask[p];
  }
  const measuredWidth = estimateWidth(finalMask, width, height);
  const boundary = boundaryPixels(finalMask, width, height);
  return {
    result: {
      algorithmVersion: ALGORITHM_VERSION,
      area,
      fieldArea,
      areaPct: fieldArea ? area * 100 / fieldArea : 0,
      width: measuredWidth,
      threshold,
      otsuThreshold,
      fallbackThreshold,
      baseThreshold,
      thresholdFallbackUsed: otsuThreshold < 3,
      maxV,
      boundaryCount: boundary.length,
      totalComponents: filtered.totalComponents,
      keptComponents: filtered.keptComponents,
      largestArea: filtered.largestArea,
      finalComponents: finalComponents.totalComponents,
      groupPriorApplied: priorResult.applied,
      groupPriorArea: priorResult.priorArea,
      groupPriorRadius: priorResult.radius,
      continuityKeptComponents: continuity.kept,
      continuityTotalComponents: continuity.total,
      phaseSlitFilledPx: slitClose.filled,
      phaseSlitCount: slitClose.slits,
      phaseSmoothChangedPx: smooth.changed,
      phaseSmoothRadius: smooth.radius,
      bridgeFilledPx: bridge.filled,
      bridgeGapCount: bridge.gaps,
      edgeExtendedPx: edgeExtend.filled,
      edgeExtendedCount: edgeExtend.edges,
      finalHoleFilledCount: finalHoleResult.filledHoleCount,
      finalHoleFilledArea: finalHoleResult.filledHoleArea,
      internalIslandCount: finalHoleResult.holeCount,
      internalIslandArea: finalHoleResult.holeArea,
      largestInternalIslandArea: finalHoleResult.largestHoleArea,
      filledSmallIslandCount: holeResult.filledHoleCount + finalHoleResult.filledHoleCount,
      filledSmallIslandArea: holeResult.filledHoleArea + finalHoleResult.filledHoleArea,
      holeFillMaxArea: holeResult.maxHoleArea,
      darkGuideThreshold: darkPercentile(gray, field, length, 0.48),
      workerRuntimeMs: Math.round(performance.now() - started)
    },
    rgba,
    gray,
    field,
    variance,
    mask: finalMask,
    boundary
  };
}

self.addEventListener('message', event => {
  const id = event.data?.id;
  try {
    const output = analyze(event.data);
    self.postMessage({
      id,
      ok: true,
      result: output.result,
      rgbaBuffer: output.rgba.buffer,
      grayBuffer: output.gray.buffer,
      fieldBuffer: output.field.buffer,
      varianceBuffer: output.variance.buffer,
      maskBuffer: output.mask.buffer,
      boundaryBuffer: output.boundary.buffer
    }, [output.rgba.buffer, output.gray.buffer, output.field.buffer, output.variance.buffer, output.mask.buffer, output.boundary.buffer]);
  } catch (error) {
    self.postMessage({ id, ok: false, error: error?.message || String(error) });
  }
});
