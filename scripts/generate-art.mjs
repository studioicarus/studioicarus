// Generates the cinematic scenes used by the site (hero, banners, service + portfolio thumbnails).
// They are original vector illustrations rendered to WebP — drop real photography into
// public/images and update src/data/content.ts to replace any of them.
//
// Needs sharp:  npm i --no-save sharp   then   node scripts/generate-art.mjs
import sharp from 'sharp'
import { mkdirSync } from 'node:fs'

const OUT = 'public/images'
mkdirSync(OUT, { recursive: true })

/* ------------------------------------------------------------------ helpers */
const rng = (seed) => {
  let s = seed >>> 0
  return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296
}
const n = (v) => +v.toFixed(1)
const smooth = (x, a, b) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}

/** 1D midpoint displacement -> N+1 values normalised to 0..1 */
function noise1d(rand, N = 256, rough = 0.55) {
  const a = new Array(N + 1).fill(0)
  a[0] = rand() * 2 - 1
  a[N] = rand() * 2 - 1
  let step = N
  let disp = 1
  while (step > 1) {
    const half = step / 2
    for (let i = half; i < N; i += step) a[i] = (a[i - half] + a[i + half]) / 2 + (rand() * 2 - 1) * disp
    disp *= rough
    step = half
  }
  const min = Math.min(...a)
  const max = Math.max(...a)
  return a.map((v) => (v - min) / (max - min))
}

/** mountain ridge as a closed path; env(xFraction) scales the height */
function ridge(seed, W, H, { base, amp, rough = 0.55, sharpness = 1.4, env = () => 1, from = 0, to = 1 }) {
  const rand = rng(seed)
  const N = 256
  const a = noise1d(rand, N, rough)
  const pts = []
  for (let i = 0; i <= N; i++) {
    const fx = i / N
    const x = from * W + fx * (to - from) * W
    const b = typeof base === 'function' ? base(x / W) : base
    const y = b - amp * Math.pow(a[i], sharpness) * env(x / W)
    pts.push([x, y])
  }
  const line = pts.map(([x, y]) => `L${n(x)},${n(y)}`).join(' ')
  return {
    fill: `M${n(pts[0][0])},${H} ${line} L${n(pts[N][0])},${H} Z`,
    stroke: `M${pts.map(([x, y]) => `${n(x)},${n(y)}`).join(' L')}`,
    pts,
  }
}

/** jagged polygon between control points */
function jag(points, rand, depth = 3, amt = 14) {
  let pts = points
  for (let d = 0; d < depth; d++) {
    const next = []
    for (let i = 0; i < pts.length - 1; i++) {
      const [x1, y1] = pts[i]
      const [x2, y2] = pts[i + 1]
      next.push(pts[i])
      next.push([(x1 + x2) / 2 + (rand() - 0.5) * amt, (y1 + y2) / 2 + (rand() - 0.5) * amt])
    }
    next.push(pts[pts.length - 1])
    pts = next
    amt *= 0.55
  }
  return pts
}

const stars = (seed, W, H, count, maxY) => {
  const r = rng(seed)
  let s = ''
  for (let i = 0; i < count; i++) {
    const y = r() * maxY * H
    const fade = 1 - y / (maxY * H)
    s += `<circle cx="${n(r() * W)}" cy="${n(y)}" r="${n(0.4 + r() * 1.1)}" fill="#cfe0ff" opacity="${n((0.25 + r() * 0.6) * (0.4 + fade))}"/>`
  }
  return s
}

const bokeh = (seed, W, H, count, colors, [rMin, rMax], [oMin, oMax], region = [0, 0, 1, 1]) => {
  const r = rng(seed)
  let s = ''
  for (let i = 0; i < count; i++) {
    s += `<circle cx="${n((region[0] + r() * (region[2] - region[0])) * W)}" cy="${n((region[1] + r() * (region[3] - region[1])) * H)}" r="${n(rMin + r() * (rMax - rMin))}" fill="${colors[Math.floor(r() * colors.length)]}" opacity="${n(oMin + r() * (oMax - oMin))}"/>`
  }
  return s
}

const cloudBands = (seed, W, H, count, yRange, colors, [rxMin, rxMax], [ryMin, ryMax], blur, opacity) => {
  const r = rng(seed)
  let s = `<g filter="url(#b${blur})" opacity="${opacity}">`
  for (let i = 0; i < count; i++) {
    s += `<ellipse cx="${n(r() * W)}" cy="${n((yRange[0] + r() * (yRange[1] - yRange[0])) * H)}" rx="${n(rxMin + r() * (rxMax - rxMin))}" ry="${n(ryMin + r() * (ryMax - ryMin))}" fill="${colors[Math.floor(r() * colors.length)]}"/>`
  }
  return s + '</g>'
}

const blurDefs = (...vals) => vals.map((v) => `<filter id="b${v}" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="${v}"/></filter>`).join('')

/* ------------------------------------------------------------- silhouettes */
/** closed Catmull-Rom spline through pts -> SVG path */
function smoothClosed(pts, k = 1) {
  const m = pts.length
  let d = 'M' + n(pts[0][0]) + ',' + n(pts[0][1])
  for (let i = 0; i < m; i++) {
    const p0 = pts[(i - 1 + m) % m]
    const p1 = pts[i]
    const p2 = pts[(i + 1) % m]
    const p3 = pts[(i + 2) % m]
    const c1 = [p1[0] + ((p2[0] - p0[0]) / 6) * k, p1[1] + ((p2[1] - p0[1]) / 6) * k]
    const c2 = [p2[0] - ((p3[0] - p1[0]) / 6) * k, p2[1] - ((p3[1] - p1[1]) / 6) * k]
    d += ' C' + n(c1[0]) + ',' + n(c1[1]) + ' ' + n(c2[0]) + ',' + n(c2[1]) + ' ' + n(p2[0]) + ',' + n(p2[1])
  }
  return d + ' Z'
}

/**
 * Back-view figure. The body is one smooth outline authored in "% of height" units and scaled by u;
 * head, hair and bag are authored directly in px (already multiplied by u).
 */
function personShape(color, { u, female, hair, skirt, armSpread = 0, bag }) {
  const SW = female ? 10.6 : 13.6 // shoulder half-width
  const HW = female ? 9.4 : 10.2 // hip half-width
  const A = armSpread
  const L = [
    [-2.6, -90.4], [-6.6, -87.8], [-SW + 1.6, -85.6], [-SW, -82.4], // neck -> shoulder
    [-SW - 1.0, -74], [-SW - 1.5 - A * 0.5, -62], [-SW - 1.6 - A, -52], // outer arm
    [-SW - 1.2 - A, -47.6], [-SW + 0.8 - A * 0.6, -46.4], // hand
  ]
  if (skirt) L.push([-HW - 1.4, -45], [-HW - 3.2, -34.5], [-HW - 2.2, -33], [-HW * 0.68, -32])
  else L.push([-HW - 0.5, -44], [-HW + 0.1, -37], [-HW * 0.86, -27])
  L.push([-HW * 0.66, -15], [-HW * 0.6, -6], [-HW * 0.72, -1.2], [-HW * 0.62, 0.4], [-2.6, 0.4]) // shin + foot
  L.push([-2.2, -5], [-1.9, -20], [-1.3, -36], [0, -46]) // inner leg to crotch
  const R = L.slice(0, -1).reverse().map(([x, y]) => [-x, y])
  const body = '<g transform="scale(' + u + ')"><path d="' + smoothClosed([...L, ...R], 0.9) + '" fill="' + color + '"/></g>'

  let out = body
  out += '<rect x="' + n(-2.4 * u) + '" y="' + n(-92 * u) + '" width="' + n(4.8 * u) + '" height="' + n(8 * u) + '" fill="' + color + '"/>'
  out += '<ellipse cx="0" cy="' + n(-94.7 * u) + '" rx="' + n((female ? 4.2 : 4.5) * u) + '" ry="' + n(5.2 * u) + '" fill="' + color + '"/>'
  if (hair)
    out +=
      '<path d="M' + n(-5.2 * u) + ',' + n(-95 * u) + ' C' + n(-8 * u) + ',' + n(-86 * u) + ' ' + n(-8.4 * u) + ',' + n(-77 * u) + ' ' + n(-6.2 * u) + ',' + n(-71.5 * u) +
      ' C' + n(-2 * u) + ',' + n(-70 * u) + ' ' + n(2 * u) + ',' + n(-70 * u) + ' ' + n(6.2 * u) + ',' + n(-71.5 * u) +
      ' C' + n(8.4 * u) + ',' + n(-77 * u) + ' ' + n(8 * u) + ',' + n(-86 * u) + ' ' + n(5.2 * u) + ',' + n(-95 * u) +
      ' C' + n(4 * u) + ',' + n(-101.4 * u) + ' ' + n(-4 * u) + ',' + n(-101.4 * u) + ' ' + n(-5.2 * u) + ',' + n(-95 * u) + ' Z" fill="' + color + '"/>'
  if (bag) out += '<rect x="' + n((SW + 1.4 + A) * u) + '" y="' + n(-56 * u) + '" width="' + n(6 * u) + '" height="' + n(10 * u) + '" rx="' + n(1.8 * u) + '" fill="' + color + '"/>'
  return out
}

/** rim + body for a person whose feet are at (x, baseY) */
function personParts(x, baseY, H, o, tone, rim, rimOffset = 1.3) {
  const u = H / 100
  const opts = { u, ...o }
  return {
    rim: '<g transform="translate(' + n(x + rimOffset * u) + ',' + n(baseY - 0.35 * u) + ')" opacity="0.55">' + personShape(rim, opts) + '</g>',
    body: '<g transform="translate(' + n(x) + ',' + n(baseY) + ')">' + personShape(tone, opts) + '</g>',
  }
}

const CREW = [
  { h: 0.96, female: true, hair: true, armSpread: 0.2 },
  { h: 1.0, female: false, armSpread: 0.4 },
  { h: 0.9, female: true, hair: true, skirt: true },
  { h: 0.98, female: true, hair: true, armSpread: 0.3 },
  { h: 1.03, female: false, armSpread: 0.7 },
  { h: 0.94, female: false, bag: true, armSpread: 0.2 },
]

function crew(xs, baseYs, H, tone, rim, count = 6) {
  const parts = xs
    .slice(0, count)
    .map((x, i) => personParts(x, (Array.isArray(baseYs) ? baseYs[i] : baseYs) + (((i * 37) % 5) - 2) * 3, H * CREW[i].h, CREW[i], tone, rim))
  // every rim highlight first, then every body, so neighbours never draw a light seam over each other
  return parts.map((p) => p.rim).join('') + parts.map((p) => p.body).join('')
}

/* ------------------------------------------------------------------- output */
const save = async (name, W, H, body, q = 84) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${body}</svg>`
  await sharp(Buffer.from(svg)).webp({ quality: q, effort: 5 }).toFile(`${OUT}/${name}.webp`)
  console.log('wrote', name)
}

/* --------------------------------------------------------------------- hero */
async function hero() {
  const W = 1920
  const H = 1080
  const right = (x) => 0.18 + 0.82 * smooth(x, 0.28, 0.85)
  const far = ridge(11, W, H, { base: H * 0.7, amp: H * 0.17, sharpness: 1.6, env: right })
  const mid = ridge(23, W, H, { base: H * 0.81, amp: H * 0.24, sharpness: 1.7, env: right })
  const near = ridge(37, W, H, { base: H * 0.92, amp: H * 0.23, sharpness: 1.5, env: (x) => 0.2 + 0.8 * smooth(x, 0.4, 0.95) })
  const front = ridge(53, W, H, { base: H * 1.0, amp: H * 0.14, sharpness: 1.3, env: (x) => 0.35 + 0.65 * smooth(x, 0.05, 0.7) })
  const body = `
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#030816"/><stop offset=".3" stop-color="#071a47"/><stop offset=".52" stop-color="#11306b"/>
      <stop offset=".68" stop-color="#425899"/><stop offset=".8" stop-color="#c58f9e"/><stop offset=".89" stop-color="#f5a674"/><stop offset="1" stop-color="#f6bd90"/>
    </linearGradient>
    <radialGradient id="sun" cx=".8" cy=".78" r=".5"><stop offset="0" stop-color="#ffe0b8" stop-opacity="1"/><stop offset=".3" stop-color="#ffa470" stop-opacity=".65"/><stop offset="1" stop-color="#ff8a5a" stop-opacity="0"/></radialGradient>
    <radialGradient id="hot" cx=".8" cy=".74" r=".3"><stop offset="0" stop-color="#ffe6c4" stop-opacity=".95"/><stop offset=".4" stop-color="#ffb07a" stop-opacity=".55"/><stop offset="1" stop-color="#ff9a60" stop-opacity="0"/></radialGradient>
    <radialGradient id="cool" cx=".72" cy=".33" r=".5"><stop offset="0" stop-color="#3f86ff" stop-opacity=".30"/><stop offset="1" stop-color="#3f86ff" stop-opacity="0"/></radialGradient>
    <linearGradient id="left" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#02071a" stop-opacity=".94"/><stop offset=".42" stop-color="#02071a" stop-opacity=".6"/><stop offset=".78" stop-color="#02071a" stop-opacity="0"/></linearGradient>
    <linearGradient id="strokeFade" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="${W}" y2="0"><stop offset=".45" stop-color="#ffc39c" stop-opacity="0"/><stop offset=".85" stop-color="#ffc39c" stop-opacity=".3"/></linearGradient>
    <linearGradient id="haze" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8aa0d6" stop-opacity="0"/><stop offset="1" stop-color="#8aa0d6" stop-opacity=".22"/></linearGradient>
    ${blurDefs(6, 14, 26, 50)}
  </defs>
  <rect width="${W}" height="${H}" fill="url(#sky)"/>
  ${stars(5, W, H, 220, 0.55)}
  <rect width="${W}" height="${H}" fill="url(#cool)"/>
  <rect width="${W}" height="${H}" fill="url(#sun)"/>
  ${cloudBands(3, W, H, 16, [0.5, 0.8], ['#0b1c4a', '#152b63', '#243a78'], [140, 420], [12, 38], 14, 0.55)}
  ${cloudBands(9, W, H, 9, [0.68, 0.84], ['#ffc09a', '#ffd8b8', '#f6a98a'], [120, 360], [8, 24], 14, 0.4)}
  <path d="${far.fill}" fill="#4a5f9c" opacity=".5"/>
  <rect width="${W}" height="${H}" fill="url(#hot)"/>
  <path d="${far.stroke}" fill="none" stroke="url(#strokeFade)" stroke-width="2"/>
  <path d="${mid.fill}" fill="#1f3269"/>
  <path d="${mid.stroke}" fill="none" stroke="url(#strokeFade)" stroke-width="2"/>
  <rect y="${H * 0.62}" width="${W}" height="${H * 0.4}" fill="url(#haze)"/>
  <path d="${near.fill}" fill="#0b1737"/>
  <path d="${near.stroke}" fill="none" stroke="#6f8fd8" stroke-opacity=".25" stroke-width="1.5"/>
  <path d="${front.fill}" fill="#050b1e"/>
  <rect width="${W}" height="${H}" fill="url(#left)"/>
  `
  await save('hero-bg', W, H, body, 82)
}

/* ------------------------------------------------------------- team banner */
async function teamBanner() {
  const W = 1920
  const H = 640
  const far = ridge(71, W, H, { base: H * 0.7, amp: H * 0.46, sharpness: 1.9, env: (x) => 0.35 + 0.65 * smooth(x, 0.05, 0.5) * (1 - 0.4 * smooth(x, 0.85, 1)) })
  const mid = ridge(83, W, H, { base: H * 0.78, amp: H * 0.28, sharpness: 1.5, env: (x) => 0.4 + 0.6 * smooth(x, 0.25, 0.8) })
  const nearR = ridge(97, W, H, { base: (x) => H * (1.25 - 0.35 * smooth(x, 0.3, 0.6)), amp: H * 0.2, sharpness: 1.3, env: (x) => smooth(x, 0.3, 0.6) })
  const ground = ridge(101, W, H, { base: (x) => H * (1.2 - 0.32 * smooth(x, 0.38, 0.62)), amp: H * 0.03, rough: 0.6, sharpness: 1 })
  const xs = [0.6, 0.66, 0.72, 0.78, 0.84, 0.9].map((f) => f * W)
  const body = `
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9fb2dc"/><stop offset=".4" stop-color="#cbc2d8"/><stop offset=".62" stop-color="#f1cdbc"/><stop offset="1" stop-color="#f7dcc2"/></linearGradient>
    <radialGradient id="sun" cx=".62" cy=".5" r=".3"><stop offset="0" stop-color="#fff6ea" stop-opacity=".98"/><stop offset=".3" stop-color="#ffe2c4" stop-opacity=".6"/><stop offset="1" stop-color="#ffe2c4" stop-opacity="0"/></radialGradient>
    <linearGradient id="farM" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#dfe6f4"/><stop offset=".6" stop-color="#b6c4e0"/><stop offset="1" stop-color="#c9cfe4"/></linearGradient>
    <linearGradient id="midM" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9db0d6"/><stop offset="1" stop-color="#7f93bd"/></linearGradient>
    <linearGradient id="nearM" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6b7ea9"/><stop offset="1" stop-color="#4f5f88"/></linearGradient>
    <linearGradient id="gr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b0866a"/><stop offset=".3" stop-color="#7a5a49"/><stop offset="1" stop-color="#2b2226"/></linearGradient>
    ${blurDefs(10, 22, 40)}
    <filter id="soft" x="-5%" y="-5%" width="110%" height="110%"><feGaussianBlur stdDeviation="0.9"/></filter>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#sky)"/>
  <rect width="${W}" height="${H}" fill="url(#sun)"/>
  ${cloudBands(4, W, H, 10, [0.15, 0.5], ['#ffffff', '#f8e6dc'], [160, 420], [10, 30], 22, 0.55)}
  <path d="${far.fill}" fill="url(#farM)"/>
  <path d="${mid.fill}" fill="url(#midM)" opacity=".92"/>
  <path d="${mid.stroke}" fill="none" stroke="#fff0e0" stroke-opacity=".5" stroke-width="2"/>
  <g filter="url(#b40)" opacity=".85"><ellipse cx="${W * 0.55}" cy="${H * 0.74}" rx="${W * 0.32}" ry="34" fill="#ffffff"/><ellipse cx="${W * 0.85}" cy="${H * 0.78}" rx="${W * 0.2}" ry="30" fill="#fff4ea"/></g>
  <path d="${nearR.fill}" fill="url(#nearM)"/>
  <path d="${nearR.stroke}" fill="none" stroke="#ffe8d0" stroke-opacity=".35" stroke-width="2"/>
  <g filter="url(#b22)" opacity=".5"><ellipse cx="${W * 0.7}" cy="${H * 0.86}" rx="${W * 0.3}" ry="18" fill="#ffffff"/></g>
  <path d="${ground.fill}" fill="url(#gr)"/>
  <g filter="url(#soft)">${crew(xs, H * 0.925, H * 0.6, '#131a30', '#ffc9a0')}</g>
  <g filter="url(#b22)" opacity=".55"><ellipse cx="${W * 0.76}" cy="${H * 0.93}" rx="${W * 0.22}" ry="14" fill="#f3d9c6"/></g>
  `
  await save('team-banner', W, H, body, 84)
}

/* ------------------------------------------------------------ about banner */
async function aboutBanner() {
  const W = 1920
  const H = 640
  const r = rng(131)
  const cliff = jag(
    [
      [W * 0.33, H], [W * 0.355, H * 0.62], [W * 0.372, H * 0.36], [W * 0.4, H * 0.2], [W * 0.43, H * 0.09], [W * 0.47, H * 0.06],
      [W * 0.5, H * 0.11], [W * 0.52, H * 0.2], [W * 0.535, H * 0.36], [W * 0.552, H * 0.52], [W * 0.58, H * 0.72], [W * 0.61, H],
    ],
    r, 3, 34,
  )
  const cliffPath = `M${cliff.map(([x, y]) => `${n(x)},${n(y)}`).join(' L')} Z`
  const far = ridge(141, W, H, { base: (x) => H * (1.1 - 0.34 * smooth(x, 0.4, 0.62)), amp: H * 0.3, sharpness: 1.6, env: (x) => smooth(x, 0.42, 0.9) })
  const mid = ridge(149, W, H, { base: (x) => H * (1.15 - 0.3 * smooth(x, 0.42, 0.62)), amp: H * 0.2, sharpness: 1.4, env: (x) => smooth(x, 0.45, 0.8) })
  const ground = ridge(157, W, H, { base: (x) => H * (1.2 - 0.3 * smooth(x, 0.4, 0.62)), amp: H * 0.03, rough: 0.6, sharpness: 1 })
  const xs = [0.67, 0.72, 0.77, 0.82, 0.87, 0.92].map((f) => f * W)
  const fr = rng(211)
  let facets = ''
  for (let i = 0; i < 16; i++) {
    const cx = W * (0.34 + fr() * 0.22)
    const cy = H * (0.1 + fr() * 0.85)
    const s1 = 30 + fr() * 90
    facets += `<polygon points="${n(cx)},${n(cy)} ${n(cx + s1)},${n(cy + s1 * (0.2 + fr() * 0.5))} ${n(cx + s1 * 0.3)},${n(cy + s1 * (0.9 + fr() * 0.6))}" fill="#000000" opacity="${n(0.05 + fr() * 0.08)}"/>`
  }
  const body = `
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1f3f86"/><stop offset=".35" stop-color="#4a68ad"/><stop offset=".62" stop-color="#a889a8"/><stop offset=".78" stop-color="#f0a06e"/><stop offset="1" stop-color="#f4bd90"/></linearGradient>
    <radialGradient id="sun" cx=".8" cy=".76" r=".3"><stop offset="0" stop-color="#ffdfb8" stop-opacity=".95"/><stop offset=".4" stop-color="#ffab72" stop-opacity=".45"/><stop offset="1" stop-color="#ff9a60" stop-opacity="0"/></radialGradient>
    <linearGradient id="left" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#040c26"/><stop offset=".3" stop-color="#061434" stop-opacity=".96"/><stop offset=".5" stop-color="#0a2260" stop-opacity=".55"/><stop offset=".68" stop-color="#0a2260" stop-opacity="0"/></linearGradient>
    <radialGradient id="glow" cx=".14" cy=".55" r=".35"><stop offset="0" stop-color="#1f6bff" stop-opacity=".38"/><stop offset="1" stop-color="#1f6bff" stop-opacity="0"/></radialGradient>
    <linearGradient id="rock" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#16214a"/><stop offset=".45" stop-color="#2f3860"/><stop offset=".78" stop-color="#5a4f66"/><stop offset="1" stop-color="#b27d64"/></linearGradient>
    <linearGradient id="rockTop" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4f7a3a" stop-opacity="1"/><stop offset=".5" stop-color="#2f4a26" stop-opacity=".6"/><stop offset="1" stop-color="#2e4126" stop-opacity="0"/></linearGradient>
    <linearGradient id="farM" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7d86b6"/><stop offset="1" stop-color="#8b7fa4"/></linearGradient>
    <linearGradient id="gr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a2b30"/><stop offset=".25" stop-color="#181420"/><stop offset="1" stop-color="#070a18"/></linearGradient>
    <linearGradient id="leftSoft" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#040c26" stop-opacity=".85"/><stop offset=".2" stop-color="#040c26" stop-opacity="0"/></linearGradient>
    <clipPath id="cl"><path d="${cliffPath}"/></clipPath>
    ${blurDefs(3, 12, 24, 40)}
    <filter id="soft" x="-5%" y="-5%" width="110%" height="110%"><feGaussianBlur stdDeviation="0.9"/></filter>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#sky)"/>
  <rect width="${W}" height="${H}" fill="url(#sun)"/>
  ${cloudBands(6, W, H, 10, [0.2, 0.6], ['#ffd9c0', '#c7b5d8', '#e8a98a'], [150, 380], [8, 22], 12, 0.4)}
  <path d="${far.fill}" fill="url(#farM)" opacity=".85"/>
  <path d="${far.stroke}" fill="none" stroke="#ffd0a8" stroke-opacity=".4" stroke-width="2"/>
  <path d="${mid.fill}" fill="#3b3f6b" opacity=".9"/>
  <g filter="url(#b40)" opacity=".5"><ellipse cx="${W * 0.72}" cy="${H * 0.8}" rx="${W * 0.28}" ry="22" fill="#ffc9a8"/></g>
  <rect width="${W}" height="${H}" fill="url(#left)"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>
  <path d="${cliffPath}" fill="url(#rock)"/>
  <g clip-path="url(#cl)">
    <g filter="url(#b12)">${facets}</g>
    <rect x="${W * 0.32}" y="0" width="${W * 0.3}" height="${H * 0.5}" fill="url(#rockTop)"/>
    <path d="${cliffPath}" fill="none" stroke="#ffb27c" stroke-opacity=".4" stroke-width="4" transform="translate(4,0)"/>
  </g>
  <path d="${ground.fill}" fill="url(#gr)"/>
  <g filter="url(#soft)">${crew(xs, H * 0.935, H * 0.56, '#0e152b', '#ffb887')}</g>
  <rect width="${W}" height="${H}" fill="url(#leftSoft)"/>
  `
  await save('about-banner', W, H, body, 84)
}

/* -------------------------------------------------------------------- "in" */
const inGlyph = (x, y, s, fill = '#fff') =>
  `<g transform="translate(${x},${y}) scale(${s / 100})" fill="${fill}"><circle cx="24" cy="24" r="8.5"/><rect x="16" y="38" width="16" height="44" rx="1.5"/><path d="M42,38 h15 v6.5 c3.5,-5.5 9,-8 15.5,-8 c14,0 19.5,9 19.5,22 v25.5 h-16 v-22.5 c0,-6.5 -2.5,-10 -8,-10 c-6,0 -9,4 -9,10.5 v22 h-17 z"/></g>`

/* ------------------------------------------------------ service thumbnails */
async function svcVideo() {
  const W = 800
  const H = 500
  const body = `
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0a1322"/><stop offset="1" stop-color="#16213a"/></linearGradient>
    <linearGradient id="scr" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1c4d6e"/><stop offset=".55" stop-color="#0f2a44"/><stop offset="1" stop-color="#2a1f4a"/></linearGradient>
    <linearGradient id="desk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1b2438"/><stop offset="1" stop-color="#0a0f1c"/></linearGradient>
    <radialGradient id="glow" cx=".4" cy=".45" r=".5"><stop offset="0" stop-color="#3f8bff" stop-opacity=".35"/><stop offset="1" stop-color="#3f8bff" stop-opacity="0"/></radialGradient>
    ${blurDefs(4, 10, 20)}
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <g filter="url(#b10)">${bokeh(2, W, H, 14, ['#ffb86b', '#5aa2ff', '#ffd7a0'], [10, 26], [0.18, 0.5], [0, 0, 0.95, 0.5])}</g>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>
  <!-- back shelf -->
  <rect x="40" y="60" width="90" height="180" fill="#0f1828" opacity=".8"/><rect x="60" y="80" width="50" height="6" fill="#ffb86b" opacity=".6"/>
  <!-- small left monitor -->
  <rect x="50" y="215" width="150" height="100" rx="6" fill="#070c16" stroke="#26344f"/>
  <rect x="58" y="223" width="134" height="84" rx="3" fill="#123047"/><rect x="66" y="236" width="50" height="6" fill="#6fd0c8" opacity=".7"/><rect x="66" y="250" width="90" height="5" fill="#8aa8d0" opacity=".5"/><rect x="66" y="262" width="70" height="5" fill="#8aa8d0" opacity=".4"/>
  <!-- main monitor -->
  <rect x="195" y="105" width="360" height="230" rx="8" fill="#060a13" stroke="#2a3b5a" stroke-width="2"/>
  <rect x="205" y="115" width="340" height="210" rx="4" fill="url(#scr)"/>
  <rect x="215" y="125" width="200" height="112" rx="3" fill="#0b1c30"/>
  <path d="M215,205 C260,170 300,215 340,190 C370,172 395,200 415,188 L415,237 L215,237 Z" fill="#2a8f86" opacity=".55"/>
  <circle cx="315" cy="181" r="22" fill="#1c74ff"/><path d="M308,170 L326,181 L308,192 Z" fill="#fff"/>
  <rect x="425" y="125" width="110" height="112" rx="3" fill="#0e2038"/>
  ${[0, 1, 2, 3, 4].map((i) => `<rect x="433" y="${135 + i * 20}" width="${70 + (i % 3) * 14}" height="8" rx="2" fill="#5f86bd" opacity="${0.45 + (i % 2) * 0.2}"/>`).join('')}
  <rect x="215" y="245" width="320" height="70" rx="3" fill="#081426"/>
  ${[
    [222, 254, 90, '#2ea89c'], [316, 254, 60, '#3d7cff'], [380, 254, 110, '#8a5cf0'], [222, 276, 60, '#e2933e'], [286, 276, 130, '#3d7cff'], [420, 276, 70, '#2ea89c'], [222, 297, 100, '#8a5cf0'], [326, 297, 80, '#e2933e'],
  ].map(([x, y, w, c]) => `<rect x="${x}" y="${y}" width="${w}" height="16" rx="3" fill="${c}" opacity=".85"/>`).join('')}
  <rect x="330" y="248" width="2" height="66" fill="#ffffff" opacity=".9"/>
  <rect x="360" y="335" width="60" height="26" fill="#0d1526"/><rect x="330" y="358" width="120" height="8" rx="3" fill="#0d1526"/>
  <!-- desk -->
  <rect x="0" y="365" width="${W}" height="135" fill="url(#desk)"/>
  <rect x="200" y="378" width="270" height="20" rx="4" fill="#0b1220" stroke="#1f2c47"/>
  <g stroke="#26344f" opacity=".7">${Array.from({ length: 13 }, (_, i) => `<line x1="${212 + i * 20}" y1="382" x2="${212 + i * 20}" y2="394"/>`).join('')}</g>
  <!-- person (side/back view, headphones) -->
  <path d="M560,500 C560,400 600,340 650,325 C700,312 760,330 800,370 L800,500 Z" fill="#141c30"/>
  <path d="M600,360 C640,335 700,330 740,345" fill="none" stroke="#3b5f9a" stroke-opacity=".55" stroke-width="3"/>
  <ellipse cx="660" cy="240" rx="52" ry="62" fill="#1a2238"/>
  <path d="M640,178 C690,170 715,205 712,250 C700,215 668,196 640,206 Z" fill="#0a0f1c"/>
  <path d="M620,238 C616,180 660,150 705,172" fill="none" stroke="#c9d3e6" stroke-width="9" stroke-linecap="round"/>
  <rect x="612" y="228" width="30" height="50" rx="14" fill="#c9d3e6"/><rect x="618" y="236" width="18" height="34" rx="9" fill="#1e2c48"/>
  <path d="M600,232 C612,214 640,214 650,228" fill="none" stroke="#5fa0ff" stroke-opacity=".6" stroke-width="3"/>
  <rect x="640" y="290" width="46" height="60" fill="#1a2238"/>
  `
  await save('svc-video', W, H, body)
}

async function svcLinkedin() {
  const W = 800
  const H = 500
  const body = `
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0b1524"/><stop offset="1" stop-color="#1a2438"/></linearGradient>
    <linearGradient id="scr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e9f0fb"/><stop offset=".45" stop-color="#b9c8de"/><stop offset="1" stop-color="#65728a"/></linearGradient>
    <linearGradient id="base" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a4254"/><stop offset="1" stop-color="#1a1f2c"/></linearGradient>
    <linearGradient id="desk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3b2f2a"/><stop offset="1" stop-color="#171214"/></linearGradient>
    ${blurDefs(4, 12, 24)}
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <g filter="url(#b12)">${bokeh(8, W, H, 12, ['#ffb86b', '#5aa2ff', '#ffe0b0'], [14, 30], [0.15, 0.4], [0, 0, 1, 0.55])}</g>
  <rect y="400" width="${W}" height="100" fill="url(#desk)"/>
  <!-- laptop -->
  <polygon points="150,60 660,86 668,352 128,356" fill="#0a0e17" stroke="#2c384f" stroke-width="3"/>
  <polygon points="164,74 648,98 655,340 144,344" fill="url(#scr)"/>
  <path d="M144,344 L155,290 C230,250 280,300 360,262 C440,225 520,290 655,250 L655,340 Z" fill="#4c5a74" opacity=".55"/>
  <path d="M144,344 L160,300 C240,285 320,320 420,300 C520,285 600,320 655,300 L655,340 Z" fill="#2d3850" opacity=".6"/>
  <rect x="300" y="120" width="230" height="30" rx="6" fill="#ffffff" opacity=".45"/>
  <g transform="translate(360,128) skewY(1.6)"><rect width="110" height="110" rx="14" fill="#0a66c2"/>${inGlyph(12, 10, 88)}</g>
  <polygon points="118,360 676,354 736,420 50,428" fill="url(#base)"/>
  <polygon points="118,360 676,354 680,364 114,370" fill="#4a5368"/>
  <g stroke="#0e1320" opacity=".8">${Array.from({ length: 9 }, (_, i) => `<line x1="${170 + i * 55}" y1="378" x2="${160 + i * 60}" y2="416"/>`).join('')}</g>
  <ellipse cx="640" cy="440" rx="120" ry="14" fill="#000" opacity=".3" filter="url(#b12)"/>
  <rect x="660" y="330" width="90" height="70" rx="6" fill="#1b2438" opacity=".8"/>
  `
  await save('svc-linkedin', W, H, body)
}

async function svcProduct() {
  const W = 800
  const H = 500
  const petals = [
    [520, 420, 500, 250, 560, 190, 590, 260, 600, 420, '#e9defb'],
    [560, 420, 585, 200, 640, 150, 660, 250, 640, 420, '#cdb8f0'],
    [610, 430, 650, 260, 710, 230, 700, 330, 680, 430, '#f4e7ef'],
    [470, 430, 470, 320, 500, 280, 520, 340, 540, 430, '#b59be6'],
  ]
  const body = `
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#241a56"/><stop offset=".5" stop-color="#5a44a6"/><stop offset="1" stop-color="#9a7fd8"/></linearGradient>
    <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c58a5a"/><stop offset=".3" stop-color="#6b4636"/><stop offset="1" stop-color="#21151a"/></linearGradient>
    <linearGradient id="glass" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#1a0f0a"/><stop offset=".3" stop-color="#8a5a34"/><stop offset=".55" stop-color="#4a2b18"/><stop offset="1" stop-color="#170c07"/></linearGradient>
    <radialGradient id="halo" cx=".62" cy=".4" r=".45"><stop offset="0" stop-color="#e3d0ff" stop-opacity=".6"/><stop offset="1" stop-color="#e3d0ff" stop-opacity="0"/></radialGradient>
    ${blurDefs(3, 8, 16)}
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#halo)"/>
  <g filter="url(#b8)">${bokeh(4, W, H, 22, ['#ffffff', '#ffd8a8', '#c9b3ff'], [3, 14], [0.2, 0.6], [0, 0, 1, 0.8])}</g>
  <rect y="405" width="${W}" height="95" fill="url(#floor)"/>
  ${petals
    .map(([x1, y1, cx1, cy1, tx, ty, cx2, cy2, x2, , c], i) => `<path d="M${x1},${y1} C${cx1},${cy1} ${tx - 30},${ty + 10} ${tx},${ty} C${cx2},${cy2 + 10} ${x2},${y1 - 40} ${x2},${y1} Z" fill="${c}" opacity="${0.75 - i * 0.05}"/>`)
    .join('')}
  <ellipse cx="400" cy="415" rx="90" ry="12" fill="#000" opacity=".45" filter="url(#b8)"/>
  <!-- bottle -->
  <rect x="352" y="168" width="96" height="248" rx="16" fill="url(#glass)"/>
  <rect x="362" y="180" width="8" height="220" rx="4" fill="#fff" opacity=".22"/>
  <rect x="384" y="130" width="32" height="42" rx="4" fill="#0b0b0e"/>
  <rect x="378" y="52" width="44" height="86" rx="20" fill="#0e0e12"/>
  <rect x="384" y="62" width="6" height="60" rx="3" fill="#fff" opacity=".18"/>
  <rect x="368" y="236" width="64" height="116" rx="3" fill="#e9dfcc" opacity=".82"/>
  <circle cx="400" cy="262" r="8" fill="none" stroke="#6b4a2a" stroke-width="2"/><path d="M400,254 v16 M392,262 h16" stroke="#6b4a2a" stroke-width="1.5"/>
  ${[292, 304, 316, 328].map((y, i) => `<rect x="376" y="${y}" width="${48 - i * 6}" height="3" fill="#6b4a2a" opacity=".55"/>`).join('')}
  <path d="M352,200 C352,180 360,170 380,168" stroke="#ffd9a8" stroke-opacity=".4" stroke-width="2" fill="none"/>
  <path d="M150,420 C190,340 200,300 230,270 C226,330 232,380 260,425 Z" fill="#f0e6ff" opacity=".35"/>
  `
  await save('svc-product', W, H, body)
}

/* ------------------------------------------------------ portfolio thumbnails */
const skinGrad = (id, a, b) => `<linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>`

async function workPodcast() {
  const W = 800
  const H = 640
  const body = `
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0b1a3a"/><stop offset="1" stop-color="#132a52"/></linearGradient>
    <linearGradient id="table" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5a86c2"/><stop offset="1" stop-color="#1c3560"/></linearGradient>
    ${skinGrad('s1', '#d8a07e', '#8e5b40')}${skinGrad('s2', '#a56d4c', '#5c3624')}
    <radialGradient id="neon" cx=".5" cy=".3" r=".6"><stop offset="0" stop-color="#3f9bff" stop-opacity=".45"/><stop offset="1" stop-color="#3f9bff" stop-opacity="0"/></radialGradient>
    ${blurDefs(6, 14)}
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#neon)"/>
  <g filter="url(#b14)">${bokeh(12, W, H, 12, ['#ff9a4a', '#4aa8ff', '#ffd08a'], [10, 24], [0.25, 0.6], [0, 0, 1, 0.45])}</g>
  <rect x="300" y="60" width="200" height="120" rx="6" fill="#1a5aa6" opacity=".8"/><rect x="310" y="70" width="180" height="100" fill="#3f96ff" opacity=".35"/>
  <rect x="0" y="40" width="${W}" height="6" fill="#5fb0ff" opacity=".8" filter="url(#b6)"/>
  <!-- left person -->
  <ellipse cx="220" cy="270" rx="58" ry="70" fill="url(#s1)"/>
  <path d="M158,262 C150,190 210,170 262,196 C282,212 282,240 278,262 C262,232 216,220 178,240 Z" fill="#141823"/>
  <path d="M100,640 C96,470 140,360 220,350 C300,344 350,420 352,640 Z" fill="#141b2e"/>
  <!-- right person -->
  <ellipse cx="580" cy="272" rx="56" ry="68" fill="url(#s2)"/>
  <path d="M526,262 C520,196 572,180 620,200 C638,216 636,244 632,262 C620,234 566,224 540,244 Z" fill="#0f131d"/>
  <path d="M470,640 C470,480 500,380 580,362 C666,352 720,430 730,640 Z" fill="#e9ecf2"/>
  <path d="M540,380 L580,470 L620,380" fill="#cfd5e0"/>
  <!-- table + mics -->
  <rect x="0" y="470" width="${W}" height="170" fill="url(#table)"/>
  <rect x="0" y="470" width="${W}" height="4" fill="#9cc6ff" opacity=".7"/>
  <rect x="250" y="410" width="10" height="80" fill="#0a0e18"/><rect x="230" y="376" width="50" height="46" rx="22" fill="#0a0e18"/>
  <rect x="540" y="418" width="10" height="72" fill="#0a0e18"/><rect x="520" y="384" width="50" height="46" rx="22" fill="#0a0e18"/>
  <ellipse cx="400" cy="560" rx="150" ry="18" fill="#0b1830" opacity=".5"/>
  `
  await save('work-podcast', W, H, body)
}

async function workProduct() {
  const W = 800
  const H = 640
  const body = `
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f2ebe0"/><stop offset="1" stop-color="#c9b7a2"/></linearGradient>
    <linearGradient id="table" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#a06a44"/><stop offset="1" stop-color="#4a2c1c"/></linearGradient>
    ${skinGrad('s1', '#c48a68', '#7d4d35')}
    <linearGradient id="cyl" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#c6ccd8"/><stop offset=".4" stop-color="#ffffff"/><stop offset="1" stop-color="#aab2c2"/></linearGradient>
    <radialGradient id="halo" cx=".5" cy=".62" r=".35"><stop offset="0" stop-color="#7fc8ff" stop-opacity=".7"/><stop offset="1" stop-color="#7fc8ff" stop-opacity="0"/></radialGradient>
    ${blurDefs(6, 18)}
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect x="80" y="40" width="130" height="330" fill="#fff" opacity=".35" filter="url(#b18)"/>
  <rect x="600" y="60" width="110" height="300" fill="#fff" opacity=".3" filter="url(#b18)"/>
  <path d="M250,640 C250,470 300,380 400,360 C500,380 550,470 550,640 Z" fill="#15171d"/>
  <ellipse cx="400" cy="250" rx="66" ry="82" fill="url(#s1)"/>
  <path d="M338,240 C334,168 400,150 462,176 C470,200 468,226 462,246 C440,214 380,208 346,236 Z" fill="#241a17"/>
  <path d="M348,270 C360,330 440,330 452,270 C440,296 360,296 348,270 Z" fill="#251b18" opacity=".9"/>
  <rect y="470" width="${W}" height="170" fill="url(#table)"/>
  <rect y="470" width="${W}" height="4" fill="#e6c9a6" opacity=".6"/>
  <rect width="${W}" height="${H}" fill="url(#halo)"/>
  <ellipse cx="400" cy="486" rx="76" ry="14" fill="#000" opacity=".35" filter="url(#b6)"/>
  <rect x="330" y="300" width="140" height="185" rx="8" fill="url(#cyl)"/>
  <ellipse cx="400" cy="300" rx="70" ry="12" fill="#f4f6fa"/>
  <ellipse cx="400" cy="300" rx="52" ry="7" fill="#d7dde8"/>
  <rect x="345" y="392" width="110" height="3" fill="#7fc8ff" opacity=".8"/>
  <rect x="368" y="420" width="64" height="8" rx="2" fill="#8c95a8" opacity=".6"/>
  `
  await save('work-product', W, H, body)
}

async function workLinkedin() {
  const W = 800
  const H = 640
  const body = `
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0a1830"/><stop offset="1" stop-color="#0d2a58"/></linearGradient>
    <linearGradient id="scr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f3f6fb"/><stop offset="1" stop-color="#cfdcf0"/></linearGradient>
    <radialGradient id="glow" cx=".55" cy=".5" r=".5"><stop offset="0" stop-color="#2f7bff" stop-opacity=".55"/><stop offset="1" stop-color="#2f7bff" stop-opacity="0"/></radialGradient>
    ${blurDefs(10, 20)}
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>
  <!-- background dashboard window -->
  <rect x="40" y="90" width="300" height="420" rx="10" fill="#0c1a34" stroke="#2b4d86" stroke-opacity=".7"/>
  ${Array.from({ length: 9 }, (_, i) => `<rect x="58" y="${112 + i * 42}" width="${170 + ((i * 37) % 90)}" height="8" rx="3" fill="#5f88c8" opacity="${0.3 + (i % 3) * 0.12}"/><rect x="58" y="${126 + i * 42}" width="${110 + ((i * 53) % 120)}" height="6" rx="3" fill="#5f88c8" opacity=".2"/>`).join('')}
  <rect x="58" y="450" width="264" height="44" rx="6" fill="#1c6dff" opacity=".35"/>
  <!-- tablet -->
  <rect x="280" y="60" width="330" height="500" rx="22" fill="#05080f" stroke="#3d68b3" stroke-width="3"/>
  <rect x="294" y="76" width="302" height="468" rx="12" fill="url(#scr)"/>
  <rect x="294" y="76" width="302" height="46" rx="12" fill="#0a66c2"/><rect x="294" y="100" width="302" height="22" fill="#0a66c2"/>
  ${inGlyph(308, 84, 30)}
  <rect x="348" y="92" width="110" height="12" rx="6" fill="#fff" opacity=".35"/>
  <!-- post cards -->
  <rect x="308" y="138" width="274" height="180" rx="8" fill="#fff" stroke="#d5deee"/>
  <circle cx="332" cy="164" r="14" fill="#7fa3dd"/><rect x="354" y="154" width="100" height="8" rx="3" fill="#2b3f66"/><rect x="354" y="168" width="70" height="6" rx="3" fill="#9aa9c6"/>
  ${[190, 204, 218].map((y, i) => `<rect x="322" y="${y}" width="${240 - i * 40}" height="7" rx="3" fill="#41547a" opacity=".7"/>`).join('')}
  <rect x="322" y="240" width="246" height="62" rx="6" fill="#dbe7fb"/><rect x="336" y="256" width="70" height="30" rx="4" fill="#2f7bff" opacity=".8"/><rect x="418" y="256" width="130" height="8" rx="3" fill="#5c76a8"/><rect x="418" y="272" width="90" height="8" rx="3" fill="#5c76a8" opacity=".6"/>
  <rect x="308" y="332" width="274" height="196" rx="8" fill="#fff" stroke="#d5deee"/>
  <circle cx="332" cy="358" r="14" fill="#e0a877"/><rect x="354" y="348" width="90" height="8" rx="3" fill="#2b3f66"/><rect x="354" y="362" width="60" height="6" rx="3" fill="#9aa9c6"/>
  ${[384, 398, 412, 426].map((y, i) => `<rect x="322" y="${y}" width="${246 - (i % 2) * 60}" height="7" rx="3" fill="#41547a" opacity=".7"/>`).join('')}
  <path d="M322,500 h30 M370,500 h30 M418,500 h30" stroke="#0a66c2" stroke-width="6" stroke-linecap="round"/>
  <!-- right floating card -->
  <rect x="640" y="150" width="130" height="200" rx="10" fill="#10264c" stroke="#3d68b3" stroke-opacity=".8"/>
  <rect x="654" y="168" width="102" height="60" rx="5" fill="#2f7bff" opacity=".45"/>
  ${[244, 260, 276, 292].map((y, i) => `<rect x="654" y="${y}" width="${100 - i * 14}" height="6" rx="3" fill="#7fa3dd" opacity=".55"/>`).join('')}
  `
  await save('work-linkedin', W, H, body)
}

async function workEducation() {
  const W = 800
  const H = 640
  const body = `
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8fb9f0"/><stop offset=".7" stop-color="#d7e6f7"/><stop offset="1" stop-color="#f3e6dc"/></linearGradient>
    <linearGradient id="hill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6fae5c"/><stop offset="1" stop-color="#3f7d45"/></linearGradient>
    <linearGradient id="soil" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c9a184"/><stop offset="1" stop-color="#8a6450"/></linearGradient>
    <linearGradient id="tab" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f7f9fd"/><stop offset="1" stop-color="#dfe7f3"/></linearGradient>
    ${blurDefs(6, 14)}
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <g filter="url(#b14)" opacity=".9"><ellipse cx="180" cy="120" rx="120" ry="26" fill="#fff"/><ellipse cx="560" cy="80" rx="140" ry="22" fill="#fff"/></g>
  <path d="M0,470 C120,400 250,410 380,450 C520,490 640,430 800,440 L800,640 L0,640 Z" fill="url(#hill)"/>
  <rect y="540" width="${W}" height="100" fill="url(#soil)"/>
  <!-- tree -->
  <rect x="118" y="330" width="16" height="140" fill="#6b4430"/>
  <circle cx="126" cy="300" r="62" fill="#3f8d4a"/><circle cx="96" cy="330" r="42" fill="#4ea55a"/><circle cx="158" cy="332" r="40" fill="#357f43"/>
  <!-- balloon -->
  <ellipse cx="290" cy="190" rx="38" ry="46" fill="#ff6f6f"/><path d="M252,190 C270,150 310,150 328,190" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="4"/><path d="M290,236 L280,262 M290,236 L300,262" stroke="#6a4a3a" stroke-width="2"/><rect x="274" y="262" width="32" height="22" rx="3" fill="#b07a4a"/>
  <!-- little house -->
  <rect x="200" y="420" width="76" height="58" fill="#f4b6c2"/><polygon points="192,420 238,382 284,420" fill="#c9506b"/><rect x="226" y="446" width="24" height="32" fill="#7a4a3a"/>
  <!-- tablet -->
  <rect x="420" y="90" width="300" height="420" rx="18" fill="#2a2f3d"/>
  <rect x="432" y="104" width="276" height="392" rx="8" fill="url(#tab)"/>
  <rect x="446" y="120" width="120" height="10" rx="4" fill="#2b3f66"/><rect x="446" y="140" width="200" height="6" rx="3" fill="#9aa9c6"/>
  <rect x="446" y="166" width="248" height="130" rx="8" fill="#cfe2fb"/>
  <path d="M446,296 C500,230 540,270 580,236 C620,204 660,250 694,220 L694,296 Z" fill="#7fb6ff" opacity=".7"/><circle cx="640" cy="200" r="16" fill="#ffd166"/>
  <rect x="446" y="316" width="112" height="86" rx="6" fill="#fff" stroke="#d5deee"/><rect x="456" y="328" width="70" height="8" rx="3" fill="#2f7bff" opacity=".8"/><rect x="456" y="346" width="90" height="6" rx="3" fill="#9aa9c6"/><rect x="456" y="360" width="60" height="6" rx="3" fill="#9aa9c6"/>
  <rect x="574" y="316" width="120" height="86" rx="6" fill="#fff" stroke="#d5deee"/><circle cx="634" cy="359" r="26" fill="#fff" stroke="#2f7bff" stroke-width="10" stroke-dasharray="110 200"/>
  <rect x="446" y="418" width="248" height="60" rx="6" fill="#fff" stroke="#d5deee"/>${[430, 446, 462].map((y, i) => `<rect x="456" y="${y}" width="${200 - i * 40}" height="6" rx="3" fill="#41547a" opacity=".6"/>`).join('')}
  `
  await save('work-education', W, H, body)
}

await hero()
await teamBanner()
await aboutBanner()
await svcVideo()
await svcLinkedin()
await svcProduct()
await workPodcast()
await workProduct()
await workLinkedin()
await workEducation()
