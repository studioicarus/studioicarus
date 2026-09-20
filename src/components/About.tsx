import { aboutItems } from '../data/content'
import Container from './ui/Container'
import Reveal from './ui/Reveal'
import SectionHeading from './ui/SectionHeading'

export default function About() {
  return (
    <section id="about" className="bg-paper-light py-16 sm:py-20 lg:pb-24 lg:pt-[88px]">
      <Container>
        <Reveal>
          <SectionHeading title="About ICARUS X" subtitle="More than just a service. A creative partner." />
        </Reveal>

        <ul className="mt-10 grid gap-10 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4 lg:gap-0">
          {aboutItems.map(({ n, title, text, icon: Icon }, i) => (
            <li key={n} className={i > 0 ? 'lg:border-l lg:border-ink/20 lg:pl-10' : 'lg:pr-10'}>
              <Reveal delay={i * 90}>
                <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-brand-600 shadow-[0_0_0_6px_rgba(255,255,255,0.45)] lg:h-[80px] lg:w-[80px] lg:rounded-[22px]">
                  <Icon strokeWidth={1.7} className="h-6 w-6 lg:h-8 lg:w-8" aria-hidden />
                </span>
                <p className="mt-5 text-[15px] font-bold tracking-wide text-brand-600 lg:mt-7 lg:text-[26px]">{n}</p>
                <h3 className="mt-1 max-w-[240px] whitespace-pre-line text-[18px] font-semibold leading-snug text-ink lg:mt-2 lg:max-w-[300px] lg:text-[26px]">{title}</h3>
                <p className="mt-2 max-w-[260px] text-[15px] leading-relaxed text-muted lg:mt-3 lg:max-w-[300px] lg:text-[21px] lg:leading-[1.6]">{text}</p>
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
