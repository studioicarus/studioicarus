import { WORK_PATH, featuredWorks } from '../data/content'
import WorkCard from './WorkCard'
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
          <Button href={WORK_PATH} variant="outline" size="sm" className="lg:h-[60px] lg:px-9 lg:text-[18px]">
            View Full Portfolio
          </Button>
        </Reveal>

        <ul className="mt-9 flex flex-wrap justify-center gap-x-8 gap-y-12 lg:mt-14 lg:gap-x-10">
          {featuredWorks.map((work, i) => (
            <li key={work.title} className="w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.7rem)]">
              <WorkCard work={work} delay={i * 80} />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
