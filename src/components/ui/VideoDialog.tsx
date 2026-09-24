import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import type { Embed } from '../../lib/video'

/** A pop-up video player built on the native <dialog>: Escape closes it, focus stays inside, and the page behind is inert. */
export default function VideoDialog({ embed, title, onClose }: { embed: Embed; title: string; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = ref.current
    if (dialog && !dialog.open) dialog.showModal()
    const { overflow } = document.documentElement.style
    document.documentElement.style.overflow = 'hidden'
    return () => {
      document.documentElement.style.overflow = overflow
    }
  }, [])

  return (
    <dialog
      ref={ref}
      aria-label={title}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) e.currentTarget.close()
      }}
      className="m-auto w-[min(92vw,960px)] overflow-visible rounded-[20px] border-0 bg-black p-0 backdrop:bg-black/70"
    >
      <button
        type="button"
        aria-label="Close video"
        onClick={() => ref.current?.close()}
        className="absolute -top-3 right-0 grid h-10 w-10 -translate-y-full place-items-center rounded-full bg-surface text-ink transition-colors hover:bg-brand-100 sm:-right-3"
      >
        <X size={20} aria-hidden />
      </button>
      <div className="relative aspect-video w-full overflow-hidden rounded-[20px]">
        {embed.kind === 'iframe' ? (
          <iframe
            src={embed.src}
            title={title}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
            className="absolute inset-0 h-full w-full border-0"
          />
        ) : (
          <video src={embed.src} controls autoPlay playsInline className="absolute inset-0 h-full w-full bg-black" />
        )}
      </div>
    </dialog>
  )
}
