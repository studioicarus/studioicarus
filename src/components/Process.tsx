import { steps } from '../data/content'
import Container from './ui/Container'
import Reveal from './ui/Reveal'
import SectionHeading from './ui/SectionHeading'

export default function Process() {
  return (
    <section id="process" className="bg-paper-light py-16 sm:py-20 lg:pb-24 lg:pt-[88px]">
      <Container>
        <Reveal>
          <SectionHeading title="How ICARUS X Works" subtitle="A simple process. Focused results." />
        </Reveal>

        <ol className="mt-10 grid gap-10 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4 lg:gap-0">
          {steps.map(({ n, title, text, icon: Icon }, i) => (
            <li key={n} className={i > 0 ? 'lg:border-l lg:border-ink/20 lg:pl-10' : 'lg:pr-10'}>
              <Reveal delay={i * 90}>
                <span className="grid h-12 w-12 place-items-center rounded-full bg-brand text-on-brand shadow-glow lg:h-[66px] lg:w-[66px]">
                  <Icon strokeWidth={2} className="h-5 w-5 lg:h-7 lg:w-7" aria-hidden />
                </span>
                <p className="mt-5 text-[20px] font-bold text-brand-600 lg:mt-7 lg:text-[30px]">{n}</p>
                <h3 className="mt-1 text-[19px] font-semibold text-ink lg:mt-2 lg:text-[28px]">{title}</h3>
                <p className="mt-2 max-w-[260px] text-[15px] leading-relaxed text-muted lg:mt-3 lg:max-w-[300px] lg:text-[21px] lg:leading-[1.6]">{text}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  )
}
