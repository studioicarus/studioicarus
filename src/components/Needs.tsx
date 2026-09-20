import { needs } from '../data/content'
import Container from './ui/Container'
import Reveal from './ui/Reveal'
import SectionHeading from './ui/SectionHeading'

export default function Needs() {
  return (
    <section id="needs" className="bg-paper-light pb-16 pt-14 sm:pb-20 lg:pb-24 lg:pt-16">
      <Container>
        <Reveal>
          <SectionHeading title="What Do You Need?" subtitle="Tell us what you're looking for, and we'll help you get started." />
        </Reveal>

        <ul className="mt-9 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:mt-14 lg:grid-cols-5">
          {needs.map(({ lines, icon: Icon }, i) => (
            <li key={lines.join(' ')}>
              <Reveal delay={i * 70}>
                <a href="#contact" className="group flex flex-col items-center text-center">
                  <span className="grid h-[84px] w-[84px] place-items-center rounded-[28px] bg-brand-50 shadow-[0_0_0_7px_rgba(255,255,255,0.45)] transition duration-300 group-hover:-translate-y-1 group-hover:bg-brand-100 lg:h-[120px] lg:w-[120px] lg:rounded-[36px]">
                    <Icon strokeWidth={1.4} className="h-[36px] w-[36px] text-brand-600 lg:h-[56px] lg:w-[56px]" aria-hidden />
                  </span>
                  <span className="mt-6 text-[15px] font-medium leading-[1.5] text-ink lg:mt-8 lg:text-[21px]">
                    {lines[0]}
                    <br />
                    {lines[1]}
                  </span>
                </a>
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
