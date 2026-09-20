// Cuts the ICARUS X wing mark out of media/logo.png (white background) into a transparent PNG.
// Needs sharp:  npm i --no-save sharp
import sharp from 'sharp'

const src = 'media/logo.png'
const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
const { width, height } = info

const smooth = (x, a, b) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}

for (let i = 0; i < width * height; i++) {
  const r = data[i * 4], g = data[i * 4 + 1], b = data[i * 4 + 2]
  const diff = Math.max(255 - r, 255 - g, 255 - b) // distance from white
  const a = smooth(diff, 28, 120)
  const x = i % width, y = Math.floor(i / width)
  // drop the top of the wordmark's "X" that sits inside the crop box
  data[i * 4 + 3] = x > 1100 && y > 480 ? 0 : Math.round(a * 255)
}

const full = sharp(data, { raw: { width, height, channels: 4 } })

// Mark only (wing + figure) — crop above the wordmark.
const cropped = await full
  .clone()
  .extract({ left: 560, top: 130, width: 700, height: 450 })
  .png()
  .toBuffer()

await sharp(cropped).trim({ threshold: 5 }).png({ compressionLevel: 9 }).toFile('public/images/icarus-mark.png')

const meta = await sharp('public/images/icarus-mark.png').metadata()
console.log('mark', meta.width, meta.height)
