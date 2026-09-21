import { Play } from 'lucide-react'
import { work } from '../data/content'
import Button from './ui/Button'
import Container from './ui/Container'
import Reveal from './ui/Reveal'
import SectionHeading from './ui/SectionHeading'

export default function SelectedWork() {
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

        <ul className="mt-9 flex flex-wrap justify-center gap-x-8 gap-y-12 lg:mt-14 lg:gap-x-10">
          {work.map(({ title, tag, text, image, alt, skills }, i) => (
            <li key={title} className="w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.7rem)]">
              <Reveal delay={i * 80}>
                <a href="#contact" className="group block">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-[20px] border border-brand/50 bg-paper-deep shadow-[0_18px_40px_-20px_rgba(12,47,50,0.45)] transition duration-300 group-hover:border-brand group-hover:shadow-[0_18px_40px_-14px_rgba(22,150,161,0.6)]">
                    <img
                      src={image}
                      alt={alt}
                      loading="lazy"
                      width={800}
                      height={640}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <span className="absolute left-1/2 top-1/2 grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-brand/90 text-on-brand shadow-[0_6px_20px_rgba(22,150,161,0.6)] ring-4 ring-paper/40 transition duration-300 group-hover:scale-110 lg:h-16 lg:w-16">
                      <Play size={20} fill="currentColor" className="ml-0.5" aria-hidden />
                    </span>
                  </div>
                  <h3 className="mt-5 text-[22px] font-semibold leading-snug text-ink lg:mt-6 lg:text-[26px]">{title}</h3>
                </a>
                <p className="mt-1.5 text-[16px] font-medium leading-snug text-brand-600 lg:text-[18px]">{tag}</p>
                <p className="mt-3 text-[15px] leading-relaxed text-muted lg:text-[17px] lg:leading-[1.65]">{text}</p>
                <ul className="mt-6 flex flex-wrap gap-x-2 gap-y-5 sm:gap-x-3">
                  {skills.map(({ label, icon: Icon }) => (
                    <li key={label} className="flex w-[74px] flex-col items-center text-center sm:w-[84px]">
                      <span className="grid h-14 w-14 place-items-center rounded-full bg-brand-50 text-brand-600">
                        <Icon strokeWidth={1.7} className="h-6 w-6" aria-hidden />
                      </span>
                      <span className="mt-2 text-[13px] font-medium leading-tight text-ink lg:text-[14px]">{label}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
