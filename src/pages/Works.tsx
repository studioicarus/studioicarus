import { useState } from 'react'
import CTA from '../components/CTA'
import WorkCard from '../components/WorkCard'
import Container from '../components/ui/Container'
import Reveal from '../components/ui/Reveal'
import { GET_STARTED_PATH, serviceFilters, works } from '../data/content'

const chipClass = 'min-h-11 rounded-full border px-4 py-2 text-[14px] font-semibold transition-colors lg:px-5 lg:py-2.5 lg:text-[16px]'

export default function Works() {
  // Only offer a filter for services that actually have work to show.
  const filters = serviceFilters.filter(({ slug }) => works.some((w) => w.service === slug))
  const [active, setActive] = useState(() => {
    const wanted = new URLSearchParams(window.location.search).get('service')
    return filters.find((f) => f.slug === wanted)?.slug ?? 'all'
  })
  const shown = active === 'all' ? works : works.filter((w) => w.service === active)

  return (
    <>
      <section className="bg-paper pb-16 pt-28 sm:pb-20 lg:pb-24 lg:pt-44">
        <Container>
          <Reveal>
            <h1 className="text-[36px] font-semibold leading-[1.12] tracking-[-0.02em] text-ink sm:text-[48px] lg:text-[64px]">Our Work</h1>
            <p className="mt-3 max-w-[640px] text-[17px] leading-relaxed text-muted sm:text-[19px] lg:mt-5 lg:text-[24px]">
              A glimpse of what we&apos;ve created across video, personal brand and social growth.
            </p>
          </Reveal>

          {filters.length > 1 && (
            <div role="group" aria-label="Filter projects by service" className="mt-10 flex flex-wrap gap-3 lg:mt-12">
              {[{ slug: 'all', title: 'All' }, ...filters].map(({ slug, title }) => (
                <button
                  key={slug}
                  type="button"
                  aria-pressed={active === slug}
                  onClick={() => setActive(slug)}
                  className={`${chipClass} ${active === slug ? 'border-brand bg-brand text-on-brand' : 'border-ink/40 text-ink hover:bg-ink/10'}`}
                >
                  {title}
                </button>
              ))}
            </div>
          )}

          {shown.length > 0 ? (
            <>
              <p className="mt-6 text-[15px] text-muted lg:text-[17px]" aria-live="polite">
                {shown.length} {shown.length === 1 ? 'project' : 'projects'}
              </p>
              <ul className="mt-8 flex flex-wrap justify-center gap-x-8 gap-y-12 lg:mt-10 lg:gap-x-10">
                {shown.map((work, i) => (
                  <li key={work.title} className="w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.7rem)]">
                    <WorkCard work={work} delay={(i % 3) * 80} />
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="mt-12 text-[17px] text-muted lg:text-[20px]">New work is on the way.</p>
          )}
        </Container>
      </section>

      <CTA title="Ready to bring your ideas to life?" label="Get Started" href={GET_STARTED_PATH}>
        Let&apos;s create something together.
      </CTA>
    </>
  )
}
