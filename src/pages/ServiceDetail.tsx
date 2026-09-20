import { ArrowLeft, ArrowRight } from 'lucide-react'
import CTA from '../components/CTA'
import Button from '../components/ui/Button'
import Container from '../components/ui/Container'
import Link from '../components/ui/Link'
import Reveal from '../components/ui/Reveal'
import SectionHeading from '../components/ui/SectionHeading'
import { GET_STARTED_PATH, type ServicePage } from '../data/content'

export default function ServiceDetail({ page }: { page: ServicePage }) {
  const { title, icon: Icon, intro, image, alt, offeringsSubtitle, offerings } = page

  return (
    <>
      <section className="bg-paper pb-16 pt-28 sm:pb-20 lg:pb-24 lg:pt-44">
        <Container>
          <Reveal>
            <Link href="/#services" className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-ink underline-offset-4 hover:underline lg:text-[17px]">
              <ArrowLeft size={17} aria-hidden /> All services
            </Link>
            <h1 className="mt-6 text-[36px] font-semibold leading-[1.12] tracking-[-0.02em] text-ink sm:text-[48px] lg:mt-8 lg:text-[64px]">Our Services</h1>
            <p className="mt-3 max-w-[640px] text-[17px] leading-relaxed text-muted sm:text-[19px] lg:mt-5 lg:text-[24px]">
              Creative solutions for modern brands, professionals and businesses.
            </p>
          </Reveal>

          <div className="mt-12 grid items-center gap-10 border-t border-ink/20 pt-12 lg:mt-16 lg:grid-cols-[1fr_1.1fr] lg:gap-16 lg:pt-16">
            <Reveal>
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand text-on-brand shadow-glow lg:h-16 lg:w-16">
                <Icon size={26} strokeWidth={1.8} aria-hidden />
              </span>
              <h2 className="mt-6 text-[30px] font-semibold leading-tight tracking-[-0.015em] text-ink sm:text-[38px] lg:mt-8 lg:text-[52px]">{title}</h2>
              <p className="mt-4 max-w-[540px] text-[16px] leading-[1.7] text-muted sm:text-[18px] lg:mt-6 lg:text-[22px] lg:leading-[1.65]">{intro}</p>
              <div className="mt-8 flex flex-wrap gap-3 lg:mt-10 lg:gap-5">
                <Button href="#offerings">
                  Learn More <ArrowRight size={18} aria-hidden />
                </Button>
                <Button href="/#work" variant="outline">
                  See our work
                </Button>
              </div>
            </Reveal>

            <Reveal delay={90}>
              <div className="overflow-hidden rounded-[20px] border border-ink/15 bg-surface shadow-card">
                <img src={image} alt={alt} width={1600} height={1000} className="aspect-[8/5] w-full object-cover" />
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      <section id="offerings" className="bg-paper-light py-16 sm:py-20 lg:py-[88px]">
        <Container>
          <Reveal>
            <SectionHeading title="What We Create" subtitle={offeringsSubtitle} />
          </Reveal>

          <ul className="mt-10 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
            {offerings.map(({ title: name, text, icon: OfferingIcon }, i) => (
              <li key={name} className="border-t border-ink/25 pt-6 lg:pt-8">
                <Reveal delay={(i % 4) * 80}>
                  <span className="grid h-12 w-12 place-items-center rounded-full bg-brand-50 text-brand-600 lg:h-14 lg:w-14">
                    <OfferingIcon strokeWidth={1.7} className="h-6 w-6 lg:h-7 lg:w-7" aria-hidden />
                  </span>
                  <h3 className="mt-5 text-[19px] font-semibold leading-snug text-ink lg:mt-6 lg:text-[24px]">{name}</h3>
                  <p className="mt-2 max-w-[300px] text-[15px] leading-relaxed text-muted lg:text-[19px] lg:leading-[1.6]">{text}</p>
                </Reveal>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <CTA title="Ready to bring your ideas to life?" label="Get Started" href={GET_STARTED_PATH}>
        Let&apos;s create something together.
      </CTA>
    </>
  )
}
