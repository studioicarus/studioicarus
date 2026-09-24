import { TEAM_PATH } from '../data/content'
import Button from './ui/Button'
import Container from './ui/Container'
import Reveal from './ui/Reveal'

/** Team banner: a photo of the team at work, faded into the page on the text side. */
export default function TeamBanner() {
  return (
    <section id="team" className="relative isolate overflow-hidden bg-paper">
      <div className="relative z-10 md:flex md:min-h-[440px] md:items-center lg:min-h-[480px]">
        <Container inset className="py-12 md:py-0">
          <Reveal className="max-w-[480px]">
            <h2 className="text-[34px] font-semibold leading-[1.12] tracking-[-0.015em] text-ink sm:text-[40px] lg:text-[58px]">
              Many Notes.
              <br />
              One Symphony.
            </h2>
            <p className="mt-4 max-w-[320px] text-[15px] leading-relaxed text-muted lg:mt-6 lg:max-w-[380px] lg:text-[23px] lg:leading-[1.55]">
              A creative technology company built for what&apos;s next.
            </p>
            <Button href={TEAM_PATH} className="mt-7 lg:mt-9">
              Meet Our Team
            </Button>
          </Reveal>
        </Container>
      </div>

      <div className="relative h-60 sm:h-72 md:absolute md:inset-0 md:-z-10 md:h-auto">
        <img
          src="/images/team-workspace.webp"
          alt="A team working on laptops around shared tables in a loft studio while a colleague presents on a wall screen"
          loading="lazy"
          width={1600}
          height={809}
          className="h-full w-full object-cover object-[70%_45%]"
        />
        <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-paper to-transparent md:hidden" aria-hidden />
        <div className="absolute inset-0 hidden bg-gradient-to-r from-paper from-[28%] via-paper/70 via-[44%] to-transparent to-[62%] md:block" aria-hidden />
        <div className="absolute inset-x-0 top-0 hidden h-16 bg-gradient-to-b from-paper/70 to-transparent md:block" aria-hidden />
      </div>
    </section>
  )
}
