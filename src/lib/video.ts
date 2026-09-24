export type Embed = { kind: 'iframe'; src: string } | { kind: 'file'; src: string }

const YOUTUBE = /(?:youtube\.com\/(?:watch\?(?:[^#]*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{11})/
const VIMEO = /vimeo\.com\/(?:video\/)?(\d+)/
const VIDEO_FILE = /\.(mp4|webm|mov)(\?[^#]*)?$/i

const youtubeId = (url: string) => url.match(YOUTUBE)?.[1]

/**
 * Turns a pasted link into something safe to play. Only YouTube, Vimeo and direct video files are accepted,
 * so a typo or a stray link in the content can never embed an arbitrary page.
 */
export function toEmbed(url: string): Embed | null {
  const link = url.trim()
  if (!link) return null

  const yt = youtubeId(link)
  if (yt) return { kind: 'iframe', src: `https://www.youtube-nocookie.com/embed/${yt}?autoplay=1&rel=0` }

  const vimeo = link.match(VIMEO)?.[1]
  if (vimeo) return { kind: 'iframe', src: `https://player.vimeo.com/video/${vimeo}?autoplay=1` }

  const local = link.startsWith('/') && !link.startsWith('//')
  if (VIDEO_FILE.test(link) && (local || link.startsWith('https://'))) return { kind: 'file', src: link }
  return null
}

/** A cover image for YouTube links, used when a work has a video but no cover image of its own. */
export function youtubeThumb(url: string) {
  const id = youtubeId(url.trim())
  return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : undefined
}
