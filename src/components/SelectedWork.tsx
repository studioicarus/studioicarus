import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, Play } from 'lucide-react'
import { work } from '../data/content'
import Button from './ui/Button'
import Container from './ui/Container'
import Reveal from './ui/Reveal'
import SectionHeading from './ui/SectionHeading'

export default function SelectedWork() {
  const track = useRef<HTMLUListElement>(null)
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(false)

  const update = useCallback(() => {
    const el = track.current
    if (!el) return
    setCanPrev(el.scrollLeft > 4)
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4)
  }, [])

  useEffect(() => {
    update()
    const el = track.current
    if (!el) return
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [update])

  const scrollByCard = (dir: 1 | -1) => {
    const el = track.current
    if (!el) return
    const card = el.querySelector('li')
    const step = card ? card.getBoundingClientRect().width + 20 : el.clientWidth * 0.8
    el.scrollBy({ left: dir * step, behavior: 'smooth' })
  }

  const arrow =
    'absolute top-[36%] z-10 hidden h-8 w-8 -translate-y-1/2 place-items-center rounded-full text-ink transition hover:bg-ink/10 disabled:pointer-events-none disabled:opacity-30 sm:grid'

  return (
    <section id="work" className="relative overflow-hidden bg-paper py-16 sm:py-20 lg:py-[88px]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/40 to-transparent" aria-hidden />
      <Container>
        <Reveal className="flex flex-wrap items-end justify-between gap-5">
          <SectionHeading title="Selected Work" subtitle="A glimpse of what we've created." />
          <Button href="#work" variant="outline" size="sm" className="lg:h-[60px] lg:px-9 lg:text-[18px]">
            View Full Portfolio
          </Button>
        </Reveal>

        <div className="relative mt-9 lg:mt-14">
          <button type="button" aria-label="Previous projects" disabled={!canPrev} onClick={() => scrollByCard(-1)} className={`${arrow} -left-2 lg:-left-11`}>
            <ChevronLeft size={20} />
          </button>
          <button type="button" aria-label="Next projects" disabled={!canNext} onClick={() => scrollByCard(1)} className={`${arrow} -right-2 lg:-right-11`}>
            <ChevronRight size={20} />
          </button>

          <ul ref={track} onScroll={update} className="no-scrollbar -mx-5 flex snap-x snap-mandatory scroll-pl-5 gap-5 overflow-x-auto lg:gap-6 scroll-smooth px-5 sm:mx-0 sm:scroll-pl-0 sm:px-0">
            {work.map(({ title, tag, image, alt }, i) => (
              <li key={title} className="w-[76%] shrink-0 snap-start sm:w-[calc(50%-10px)] lg:w-[calc(25%-18px)]">
                <Reveal delay={i * 80}>
                  <a href="#contact" className="group block">
                    <div className="relative aspect-[5/4] overflow-hidden rounded-[20px] border border-brand/50 bg-paper-deep shadow-[0_18px_40px_-20px_rgba(10,82,121,0.45)] transition duration-300 group-hover:border-brand group-hover:shadow-[0_18px_40px_-14px_rgba(29,160,214,0.6)]">
                      <img
                        src={image}
                        alt={alt}
                        loading="lazy"
                        width={800}
                        height={640}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <span className="absolute left-1/2 top-1/2 grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full lg:h-16 lg:w-16 bg-brand/90 text-on-brand shadow-[0_6px_20px_rgba(29,160,214,0.6)] ring-4 ring-paper/40 transition duration-300 group-hover:scale-110">
                        <Play size={20} fill="currentColor" className="ml-0.5" aria-hidden />
                      </span>
                    </div>
                    <h3 className="mt-4 text-[16px] font-semibold text-ink lg:mt-5 lg:text-[24px]">{title}</h3>
                    <p className="mt-0.5 text-[13px] text-muted lg:mt-1 lg:text-[19px]">{tag}</p>
                  </a>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  )
}
