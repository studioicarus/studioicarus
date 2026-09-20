import { ArrowRight } from 'lucide-react'
import { services } from '../data/content'
import Container from './ui/Container'
import Reveal from './ui/Reveal'
import SectionHeading from './ui/SectionHeading'

export default function Services() {
  return (
    <section id="services" className="bg-[#fbfcff] pb-4 pt-16 sm:pt-20 lg:pt-24">
      <Container>
        <Reveal>
          <SectionHeading title="Our Services" subtitle="Three ways we help you grow" />
        </Reveal>

        <div className="mt-9 grid gap-6 md:grid-cols-3 lg:mt-14 lg:gap-8">
          {services.map(({ title, text, image, alt, icon: Icon }, i) => (
            <Reveal key={title} delay={i * 90} className="h-full">
              <article className="group h-full overflow-hidden rounded-[20px] border border-slate-200/80 bg-white shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_44px_-18px_rgba(16,48,120,0.38)]">
                <div className="aspect-[8/5] overflow-hidden bg-navy-900">
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
                  <span className="relative -mt-5 grid h-14 w-14 place-items-center rounded-2xl bg-brand text-white shadow-glow ring-4 ring-white lg:-mt-6 lg:h-16 lg:w-16">
                    <Icon size={26} strokeWidth={1.8} aria-hidden />
                  </span>
                  <h3 className="mt-5 text-[20px] font-semibold leading-snug text-ink lg:mt-9 lg:text-[21px] xl:text-[25px]">{title}</h3>
                  <p className="mt-3 text-[15px] leading-[1.7] text-muted lg:mt-4 lg:text-[16px] lg:leading-[1.7] xl:text-[19px]">{text}</p>
                  <a
                    href="#work"
                    className="mt-5 inline-flex items-center gap-1.5 text-[14px] font-semibold text-brand transition-all hover:gap-3 lg:mt-6 lg:text-[16px] xl:text-[19px]"
                  >
                    Explore <ArrowRight size={17} aria-hidden />
                  </a>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}
