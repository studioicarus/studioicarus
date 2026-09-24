import { useState } from 'react'
import { Play } from 'lucide-react'
import { skillIcon, type WorkItem } from '../data/content'
import { toEmbed, youtubeThumb } from '../lib/video'
import Reveal from './ui/Reveal'
import VideoDialog from './ui/VideoDialog'

const titleClass = 'mt-5 text-[22px] font-semibold leading-snug text-ink lg:mt-6 lg:text-[26px]'

/** One project: cover, title, what it is, the skills used. With a video, the cover opens a player; without one it leads to the contact section. */
export default function WorkCard({ work, delay = 0 }: { work: WorkItem; delay?: number }) {
  const [playing, setPlaying] = useState(false)
  const { title, tag, text, alt, video, skills } = work
  const embed = video ? toEmbed(video) : null
  const image = work.image || (video ? youtubeThumb(video) : undefined)

  const frame = (
    <div className="relative aspect-[4/3] overflow-hidden rounded-[20px] border border-brand/50 bg-paper-deep shadow-[0_18px_40px_-20px_rgba(12,47,50,0.45)] transition duration-300 group-hover:border-brand group-hover:shadow-[0_18px_40px_-14px_rgba(22,150,161,0.6)]">
      {image ? (
        <img
          src={image}
          alt={alt}
          loading="lazy"
          width={800}
          height={640}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      ) : (
        <div className="h-full w-full bg-brand-50" aria-hidden />
      )}
      <span className="absolute left-1/2 top-1/2 grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-brand/90 text-on-brand shadow-[0_6px_20px_rgba(22,150,161,0.6)] ring-4 ring-paper/40 transition duration-300 group-hover:scale-110 lg:h-16 lg:w-16">
        <Play size={20} fill="currentColor" className="ml-0.5" aria-hidden />
      </span>
    </div>
  )

  return (
    <Reveal delay={delay}>
      {embed ? (
        <div className="group">
          <button type="button" tabIndex={-1} aria-hidden onClick={() => setPlaying(true)} className="block w-full text-left">
            {frame}
          </button>
          <h3 className={titleClass}>
            <button type="button" onClick={() => setPlaying(true)} className="text-left" aria-label={`Play video: ${title}`}>
              {title}
            </button>
          </h3>
        </div>
      ) : (
        <a href="#contact" className="group block">
          {frame}
          <h3 className={titleClass}>{title}</h3>
        </a>
      )}

      <p className="mt-1.5 text-[16px] font-medium leading-snug text-brand-600 lg:text-[18px]">{tag}</p>
      <p className="mt-3 text-[15px] leading-relaxed text-muted lg:text-[17px] lg:leading-[1.65]">{text}</p>
      {skills.length > 0 && (
        <ul className="mt-6 flex flex-wrap gap-x-2 gap-y-5 sm:gap-x-3">
          {skills.map(({ label, icon }) => {
            const Icon = skillIcon(icon)
            return (
              <li key={label} className="flex w-[74px] flex-col items-center text-center sm:w-[84px]">
                <span className="grid h-14 w-14 place-items-center rounded-full bg-brand-50 text-brand-600">
                  <Icon strokeWidth={1.7} className="h-6 w-6" aria-hidden />
                </span>
                <span className="mt-2 text-[13px] font-medium leading-tight text-ink lg:text-[14px]">{label}</span>
              </li>
            )
          })}
        </ul>
      )}

      {playing && embed && <VideoDialog embed={embed} title={title} onClose={() => setPlaying(false)} />}
    </Reveal>
  )
}
