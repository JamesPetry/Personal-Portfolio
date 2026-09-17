#!/usr/bin/env node
/**
 * gen-art.mjs — deterministic procedural SVG placeholder artwork.
 *
 * Writes six monochrome "computational design" plates into public/art/.
 * No dependencies, no randomness: every run produces byte-identical output.
 *
 *   node scripts/gen-art.mjs
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const OUT_DIR = fileURLToPath(new URL('../public/art/', import.meta.url));

/* ------------------------------------------------------------------ utils */

/** Seeded PRNG (mulberry32) — stable across platforms and Node versions. */
function mulberry32(seed) {
  let a = seed >>> 0;
  return function next() {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Seeded 2D value noise on a 256x256 lattice, smoothstep interpolated. */
function makeNoise(seed) {
  const rnd = mulberry32(seed);
  const vals = new Float64Array(256 * 256);
  for (let i = 0; i < vals.length; i++) vals[i] = rnd();
  const at = (ix, iy) => vals[((iy & 255) << 8) + (ix & 255)];
  const fade = (t) => t * t * (3 - 2 * t);
  return function noise(x, y) {
    const x0 = Math.floor(x);
    const y0 = Math.floor(y);
    const fx = fade(x - x0);
    const fy = fade(y - y0);
    const a = at(x0, y0);
    const b = at(x0 + 1, y0);
    const c = at(x0, y0 + 1);
    const d = at(x0 + 1, y0 + 1);
    return (a + (b - a) * fx) * (1 - fy) + (c + (d - c) * fx) * fy;
  };
}

/** Fractal brownian motion over a noise function, returns roughly 0..1. */
function fbm(noise, x, y, octaves = 4) {
  let sum = 0;
  let norm = 0;
  let amp = 0.5;
  let freq = 1;
  for (let i = 0; i < octaves; i++) {
    sum += amp * noise(x * freq, y * freq);
    norm += amp;
    amp *= 0.5;
    freq *= 2;
  }
  return sum / norm;
}

const n1 = (v) => String(Math.round(v * 10) / 10);
const n2 = (v) => String(Math.round(v * 100) / 100);
const clamp = (v, lo, hi) => (v < lo ? lo : v > hi ? hi : v);
const lerp = (a, b, t) => a + (b - a) * t;

/** Polyline -> compact SVG path data. */
const poly = (pts) => 'M' + pts.map((p) => n1(p[0]) + ' ' + n1(p[1])).join('L');

/** Closed polar ring -> compact SVG path data. */
const ring = (pts) => poly(pts) + 'Z';

function svg(w, h, body) {
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" ` +
    `width="${w}" height="${h}" preserveAspectRatio="xMidYMid slice">` +
    body +
    '</svg>\n'
  );
}

/* ------------------------------------------------------- 1. hero: isolines */

function hero() {
  const W = 1920;
  const H = 1080;
  const noise = makeNoise(1337);
  const out = [`<rect width="${W}" height="${H}" fill="#141414"/>`];

  // Subtle construction grid.
  const fine = [];
  for (let x = 0; x <= W; x += 60) fine.push(`M${x} 0L${x} ${H}`);
  for (let y = 0; y <= H; y += 60) fine.push(`M0 ${y}L${W} ${y}`);
  out.push(`<path d="${fine.join('')}" stroke="#fff" stroke-width="0.5" opacity="0.06"/>`);

  const coarse = [];
  for (let x = 0; x <= W; x += 320) coarse.push(`M${x} 0L${x} ${H}`);
  for (let y = 0; y <= H; y += 320) coarse.push(`M0 ${y}L${W} ${y}`);
  out.push(`<path d="${coarse.join('')}" stroke="#fff" stroke-width="0.7" opacity="0.14"/>`);

  // Flowing topographic isolines.
  const COUNT = 74;
  const STEPS = 112;
  const top = -H * 0.28;
  const span = H * 1.56;
  for (let i = 0; i < COUNT; i++) {
    const base = top + (span * i) / (COUNT - 1);
    const pts = [];
    for (let j = 0; j <= STEPS; j++) {
      const x = (W * j) / STEPS;
      const a = fbm(noise, x * 0.0016 + 11, base * 0.0042 + 3, 4) - 0.5;
      const b = fbm(noise, x * 0.0007 + 41, base * 0.0018 + 7, 2) - 0.5;
      pts.push([x, base + a * 128 + b * 190]);
    }
    const t = fbm(noise, base * 0.004 + 91, 5.5, 2);
    out.push(
      `<path d="${poly(pts)}" stroke-width="${n2(lerp(0.5, 1, t))}" opacity="${n2(lerp(0.35, 0.8, t))}"/>`,
    );
  }

  // Registration crosses.
  const marks = [];
  for (const [mx, my] of [
    [320, 320], [960, 640], [1600, 320], [640, 960], [1280, 160],
  ]) {
    marks.push(`M${mx - 9} ${my}L${mx + 9} ${my}M${mx} ${my - 9}L${mx} ${my + 9}`);
  }
  out.push(`<path d="${marks.join('')}" stroke="#fff" stroke-width="0.9" opacity="0.5"/>`);

  return svg(W, H, `<g fill="none" stroke="#fff">${out.join('')}</g>`);
}

/* --------------------------------------------------- 2. p1: façade panels */

function facade() {
  const W = 1600;
  const H = 1000;
  const noise = makeNoise(2027);
  const cols = 32;
  const rows = 20;
  const m = 44;
  const cw = (W - m * 2) / cols;
  const chh = (H - m * 2) / rows;
  const out = [`<rect width="${W}" height="${H}" fill="#1a1a1a"/>`];

  // Mullions.
  const mull = [];
  for (let c = 0; c <= cols; c++) {
    const x = m + c * cw;
    mull.push(`M${n1(x)} ${m}L${n1(x)} ${n1(H - m)}`);
  }
  for (let r = 0; r <= rows; r++) {
    const y = m + r * chh;
    mull.push(`M${m} ${n1(y)}L${n1(W - m)} ${n1(y)}`);
  }
  out.push(`<path d="${mull.join('')}" stroke="#fff" stroke-width="0.5" opacity="0.16"/>`);

  const cells = [];
  const inner = [];
  const ticks = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const f = fbm(noise, c * 0.15 + 3.3, r * 0.19 + 9.1, 3);
      const a = clamp(Math.pow(clamp((f - 0.22) / 0.56, 0, 1), 1.35), 0, 1);
      const cx = m + c * cw + cw / 2;
      const cy = m + r * chh + chh / 2;
      const s = lerp(0.1, 0.84, a) * Math.min(cw, chh);
      const op = n2(lerp(0.3, 0.8, a));
      cells.push(
        `<rect x="${n1(cx - s / 2)}" y="${n1(cy - s / 2)}" width="${n1(s)}" height="${n1(s)}" opacity="${op}"/>`,
      );
      if (a > 0.58) {
        const s2 = s * 0.52;
        inner.push(
          `<rect x="${n1(cx - s2 / 2)}" y="${n1(cy - s2 / 2)}" width="${n1(s2)}" height="${n1(s2)}" opacity="${n2(lerp(0.2, 0.55, a))}"/>`,
        );
      } else if (a < 0.2) {
        ticks.push(`M${n1(cx - 3)} ${n1(cy)}L${n1(cx + 3)} ${n1(cy)}`);
      }
    }
  }
  out.push(`<g stroke-width="0.8">${cells.join('')}</g>`);
  out.push(`<g stroke-width="0.6">${inner.join('')}</g>`);
  out.push(`<path d="${ticks.join('')}" stroke-width="0.6" opacity="0.4"/>`);

  // Frame + section line.
  out.push(
    `<rect x="${m}" y="${m}" width="${W - m * 2}" height="${H - m * 2}" stroke-width="1" opacity="0.5"/>`,
  );
  out.push(`<path d="M${m} ${H * 0.62}L${W - m} ${H * 0.62}" stroke-width="1" opacity="0.45"/>`);

  return svg(W, H, `<g fill="none" stroke="#fff">${out.join('')}</g>`);
}

/* ------------------------------------------- 3. p2: point cloud + NN graph */

function pointCloud() {
  const W = 1600;
  const H = 1000;
  const noise = makeNoise(4409);
  const rnd = mulberry32(90210);
  const out = [`<rect width="${W}" height="${H}" fill="#171717"/>`];

  // Density-weighted rejection sampling.
  const pts = [];
  for (let i = 0; i < 6000 && pts.length < 520; i++) {
    const x = rnd() * W;
    const y = rnd() * H;
    const d = Math.pow(fbm(noise, x * 0.0022 + 5, y * 0.0022 + 13, 4), 2.1);
    if (rnd() < d * 1.9) pts.push([x, y]);
  }

  // Nearest-neighbour graph (k = 3, distance capped).
  const MAX = 150;
  const seen = new Set();
  const edges = [];
  for (let i = 0; i < pts.length; i++) {
    const near = [];
    for (let j = 0; j < pts.length; j++) {
      if (i === j) continue;
      const dx = pts[i][0] - pts[j][0];
      const dy = pts[i][1] - pts[j][1];
      const d = Math.hypot(dx, dy);
      if (d < MAX) near.push([d, j]);
    }
    near.sort((a, b) => a[0] - b[0]);
    for (const [d, j] of near.slice(0, 3)) {
      const key = i < j ? `${i}:${j}` : `${j}:${i}`;
      if (seen.has(key)) continue;
      seen.add(key);
      const op = n2(clamp(0.62 - (d / MAX) * 0.45, 0.14, 0.62));
      edges.push(
        `<path d="M${n1(pts[i][0])} ${n1(pts[i][1])}L${n1(pts[j][0])} ${n1(pts[j][1])}" opacity="${op}"/>`,
      );
    }
  }
  out.push(`<g stroke-width="0.6">${edges.join('')}</g>`);

  // Nodes.
  const nodes = pts.map(([x, y], i) => {
    const r = 1.2 + (i % 7 === 0 ? 1.4 : 0);
    return `<circle cx="${n1(x)}" cy="${n1(y)}" r="${n2(r)}" opacity="${n2(i % 7 === 0 ? 0.8 : 0.5)}"/>`;
  });
  out.push(`<g stroke-width="0.7">${nodes.join('')}</g>`);

  // A few attractor rings.
  const halos = [];
  for (let i = 0; i < 7; i++) {
    const p = pts[Math.floor(rnd() * pts.length)];
    if (!p) continue;
    const r = 26 + rnd() * 70;
    halos.push(`<circle cx="${n1(p[0])}" cy="${n1(p[1])}" r="${n1(r)}" opacity="0.4"/>`);
    halos.push(`<circle cx="${n1(p[0])}" cy="${n1(p[1])}" r="${n1(r * 0.55)}" opacity="0.28"/>`);
  }
  out.push(`<g stroke-width="0.8">${halos.join('')}</g>`);

  return svg(W, H, `<g fill="none" stroke="#fff">${out.join('')}</g>`);
}

/* ------------------------------------------------ 4. p3: nested cell packing */

function packing() {
  const W = 1600;
  const H = 1000;
  const noise = makeNoise(6151);
  const rnd = mulberry32(31337);
  const out = [`<rect width="${W}" height="${H}" fill="#202020"/>`];

  const circles = [];
  const GAP = 3;
  for (let attempt = 0; attempt < 14000 && circles.length < 430; attempt++) {
    const x = rnd() * W;
    const y = rnd() * H;
    const field = fbm(noise, x * 0.0018 + 21, y * 0.0018 + 2, 3);
    const rmax = lerp(12, 86, Math.pow(field, 1.5));
    let r = rmax;
    for (const c of circles) {
      const d = Math.hypot(x - c[0], y - c[1]) - c[2] - GAP;
      if (d < r) r = d;
      if (r < 6) break;
    }
    r = Math.min(r, rmax, x, y, W - x, H - y);
    if (r >= 7) circles.push([x, y, r]);
  }

  const shells = [];
  for (const [x, y, r] of circles) {
    const op = n2(clamp(0.34 + r / 140, 0.34, 0.78));
    shells.push(`<circle cx="${n1(x)}" cy="${n1(y)}" r="${n1(r)}" opacity="${op}"/>`);
    const nest = r > 52 ? 3 : r > 26 ? 2 : r > 14 ? 1 : 0;
    for (let k = 1; k <= nest; k++) {
      const rr = r * (1 - k * 0.24);
      shells.push(
        `<circle cx="${n1(x)}" cy="${n1(y)}" r="${n1(rr)}" opacity="${n2(clamp(Number(op) - k * 0.08, 0.16, 0.7))}"/>`,
      );
    }
    if (nest === 0) shells.push(`<circle cx="${n1(x)}" cy="${n1(y)}" r="1.2" opacity="0.5"/>`);
  }
  out.push(`<g stroke-width="0.7">${shells.join('')}</g>`);

  // Sparse background lattice for depth.
  const lat = [];
  for (let x = 0; x <= W; x += 100) lat.push(`M${x} 0L${x} ${H}`);
  for (let y = 0; y <= H; y += 100) lat.push(`M0 ${y}L${W} ${y}`);
  out.unshift(`<path d="${lat.join('')}" stroke-width="0.5" opacity="0.07"/>`);

  return svg(W, H, `<g fill="none" stroke="#fff">${out.join('')}</g>`);
}

/* --------------------------------------- 5. studio: sparse grid + contours */

function studio() {
  const W = 1200;
  const H = 1500;
  const noise = makeNoise(8123);
  const out = [`<rect width="${W}" height="${H}" fill="#e9e9e6"/>`];

  // Sparse tick grid.
  const ticks = [];
  for (let x = 60; x <= W - 60; x += 50) {
    for (let y = 60; y <= H - 60; y += 50) {
      ticks.push(`M${x - 3} ${y}L${x + 3} ${y}M${x} ${y - 3}L${x} ${y + 3}`);
    }
  }
  out.push(`<path d="${ticks.join('')}" stroke-width="0.6" opacity="0.3"/>`);

  // Contour ring clusters.
  const clusters = [
    [380, 430, 9, 34],
    [820, 900, 7, 42],
    [470, 1240, 5, 30],
  ];
  const rings = [];
  for (let ci = 0; ci < clusters.length; ci++) {
    const [cx, cy, count, step] = clusters[ci];
    for (let k = 1; k <= count; k++) {
      const r0 = 24 + k * step;
      const pts = [];
      for (let a = 0; a <= 96; a++) {
        const th = (a / 96) * Math.PI * 2;
        const wob =
          fbm(noise, Math.cos(th) * 1.5 + ci * 7 + 3, Math.sin(th) * 1.5 + k * 0.22, 3) - 0.5;
        const r = r0 * (1 + wob * 0.28);
        pts.push([cx + Math.cos(th) * r, cy + Math.sin(th) * r * 0.86]);
      }
      rings.push(`<path d="${ring(pts)}" opacity="${n2(clamp(0.75 - k * 0.05, 0.28, 0.75))}"/>`);
    }
    rings.push(`<circle cx="${cx}" cy="${cy}" r="2" opacity="0.8"/>`);
  }
  out.push(`<g stroke-width="0.7">${rings.join('')}</g>`);

  // Construction lines.
  out.push(
    `<path d="M60 ${H * 0.2}L${W - 60} ${H * 0.2}M60 ${H * 0.76}L${W - 60} ${H * 0.76}M${W * 0.5} 60L${W * 0.5} ${H - 60}" stroke-width="0.7" opacity="0.4"/>`,
  );
  out.push(
    `<rect x="60" y="60" width="${W - 120}" height="${H - 120}" stroke-width="0.9" opacity="0.55"/>`,
  );

  return svg(W, H, `<g fill="none" stroke="#1e1e1e">${out.join('')}</g>`);
}

/* ------------------------------------------------ 6. method: density bands */

function method() {
  const W = 1200;
  const H = 1500;
  const noise = makeNoise(9377);
  const out = [`<rect width="${W}" height="${H}" fill="#e9e9e6"/>`];

  const x0 = 90;
  const bw = W - 180;
  const bh = 300;
  const gap = 45;
  const y0 = (H - (bh * 4 + gap * 3)) / 2;

  for (let b = 0; b < 4; b++) {
    const by = y0 + b * (bh + gap);
    out.push(
      `<rect x="${x0}" y="${n1(by)}" width="${bw}" height="${bh}" stroke-width="0.9" opacity="0.6"/>`,
    );
    const marks = [];
    if (b === 0) {
      for (let x = x0 + 4; x < x0 + bw; x += 4) {
        const t = fbm(noise, x * 0.01, 1.2, 3);
        const h = bh * clamp(0.25 + t * 0.7, 0.2, 0.95);
        marks.push(`M${n1(x)} ${n1(by + bh)}L${n1(x)} ${n1(by + bh - h)}`);
      }
      out.push(`<path d="${marks.join('')}" stroke-width="0.6" opacity="0.55"/>`);
    } else if (b === 1) {
      const dots = [];
      for (let x = x0 + 12; x < x0 + bw; x += 15) {
        for (let y = by + 12; y < by + bh; y += 15) {
          const t = fbm(noise, x * 0.006 + 30, y * 0.006, 3);
          dots.push(`<circle cx="${n1(x)}" cy="${n1(y)}" r="${n2(clamp(t * 4.2, 0.4, 4))}"/>`);
        }
      }
      out.push(`<g stroke-width="0.6" opacity="0.6">${dots.join('')}</g>`);
    } else if (b === 2) {
      // Diagonal hatch, clipped to the band.
      const cid = `h${b}`;
      out.push(
        `<clipPath id="${cid}"><rect x="${x0}" y="${n1(by)}" width="${bw}" height="${bh}"/></clipPath>`,
      );
      for (let k = -bh; k < bw; k += 16) {
        marks.push(`M${n1(x0 + k)} ${n1(by)}L${n1(x0 + k + bh)} ${n1(by + bh)}`);
      }
      out.push(
        `<path d="${marks.join('')}" stroke-width="0.6" opacity="0.5" clip-path="url(#${cid})"/>`,
      );
    } else {
      for (let y = by + 6; y < by + bh; y += 9) {
        const pts = [];
        for (let i = 0; i <= 80; i++) {
          const x = x0 + (bw * i) / 80;
          const d = (fbm(noise, x * 0.004 + 60, y * 0.003 + 4, 3) - 0.5) * 16;
          pts.push([x, clamp(y + d, by + 2, by + bh - 2)]);
        }
        marks.push(poly(pts));
      }
      out.push(`<path d="${marks.join('')}" stroke-width="0.6" opacity="0.55"/>`);
    }
  }

  return svg(W, H, `<g fill="none" stroke="#1e1e1e">${out.join('')}</g>`);
}

/* ------------------------------------------------------------------ write */

const PLATES = [
  ['hero.svg', hero],
  ['p1.svg', facade],
  ['p2.svg', pointCloud],
  ['p3.svg', packing],
  ['studio.svg', studio],
  ['method.svg', method],
];

mkdirSync(OUT_DIR, { recursive: true });
for (const [name, fn] of PLATES) {
  const data = fn();
  writeFileSync(OUT_DIR + name, data);
  const kb = (Buffer.byteLength(data) / 1024).toFixed(1);
  console.log(`public/art/${name.padEnd(11)} ${kb.padStart(7)} KB`);
}
