import { why } from '../data/content'
import Container from './ui/Container'
import Reveal from './ui/Reveal'
import SectionHeading from './ui/SectionHeading'

export default function WhyUs() {
  return (
    <section id="why" className="bg-white py-16 sm:py-20 lg:pb-24 lg:pt-[88px]">
      <Container>
        <Reveal>
          <SectionHeading title="Why Work With Us?" subtitle="More than just a service. A creative partner." />
        </Reveal>

        <ul className="mt-10 grid gap-10 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4 lg:gap-10">
          {why.map(({ title, text, icon: Icon }, i) => (
            <li key={title}>
              <Reveal delay={i * 90}>
                <span className="grid h-14 w-14 place-items-center rounded-full bg-brand-50 text-brand shadow-[0_0_0_6px_rgba(240,245,255,0.8)] lg:h-[84px] lg:w-[84px]">
                  <Icon strokeWidth={1.5} className="h-6 w-6 lg:h-9 lg:w-9" aria-hidden />
                </span>
                <h3 className="mt-6 max-w-[240px] whitespace-pre-line text-[18px] font-semibold leading-snug text-ink lg:mt-9 lg:max-w-[300px] lg:text-[26px]">{title}</h3>
                <p className="mt-2 max-w-[260px] text-[15px] leading-relaxed text-muted lg:mt-3 lg:max-w-[300px] lg:text-[21px] lg:leading-[1.6]">{text}</p>
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
