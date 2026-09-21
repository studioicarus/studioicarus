import { ArrowRight } from 'lucide-react'
import { services } from '../data/content'
import Container from './ui/Container'
import Link from './ui/Link'
import Reveal from './ui/Reveal'
import SectionHeading from './ui/SectionHeading'

const exploreClass =
  'mt-5 inline-flex items-center gap-1.5 text-[14px] font-semibold text-ink transition-all lg:mt-6 lg:text-[16px] xl:text-[19px]'

export default function Services() {
  return (
    <section id="services" className="bg-paper pb-4 pt-16 sm:pt-20 lg:pt-24">
      <Container>
        <Reveal>
          <SectionHeading title="Our Services" subtitle="Three ways we help you grow" />
        </Reveal>

        <div className="mt-9 grid gap-6 md:grid-cols-3 lg:mt-14 lg:gap-8">
          {services.map(({ title, text, image, alt, icon: Icon, href }, i) => {
            const card = (
              <article className="group h-full overflow-hidden rounded-[20px] border border-ink/15 bg-surface shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_44px_-18px_rgba(12,47,50,0.4)]">
                <div className="aspect-[8/5] overflow-hidden bg-paper-deep">
                  <img
                    src={image}
                    alt={alt}
                    loading="lazy"
                    width={800}
                    height={500}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="px-6 pb-7 lg:px-7 lg:pb-9">
                  <span className="relative -mt-5 grid h-14 w-14 place-items-center rounded-2xl bg-brand text-on-brand shadow-glow ring-4 ring-surface lg:-mt-6 lg:h-16 lg:w-16">
                    <Icon size={26} strokeWidth={1.8} aria-hidden />
                  </span>
                  <h3 className="mt-5 text-[20px] font-semibold leading-snug text-ink lg:mt-9 lg:text-[21px] xl:text-[25px]">{title}</h3>
                  <p className="mt-3 text-[15px] leading-[1.7] text-muted lg:mt-4 lg:text-[16px] lg:leading-[1.7] xl:text-[19px]">{text}</p>
                  {href ? (
                    <span className={`${exploreClass} group-hover:gap-3`}>
                      Explore <ArrowRight size={17} aria-hidden />
                    </span>
                  ) : (
                    <a href="#work" className={`${exploreClass} hover:gap-3`}>
                      Explore <ArrowRight size={17} aria-hidden />
                    </a>
                  )}
                </div>
              </article>
            )

            return (
              <Reveal key={title} delay={i * 90} className="h-full">
                {href ? (
                  <Link href={href} className="block h-full rounded-[20px]">
                    {card}
                  </Link>
                ) : (
                  card
                )}
              </Reveal>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
