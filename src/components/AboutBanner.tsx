import BrandName from './ui/BrandName'
import Button from './ui/Button'
import Container from './ui/Container'
import Reveal from './ui/Reveal'

/** Cliff-and-sunset banner, washed in light gray on the text side. */
export default function AboutBanner() {
  return (
    <section className="relative isolate overflow-hidden bg-paper">
      <div className="relative z-10 md:flex md:min-h-[440px] md:items-center lg:min-h-[480px]">
        <Container inset className="py-12 md:py-0">
          <Reveal className="max-w-[480px]">
            <h2 className="text-[34px] font-semibold leading-[1.12] tracking-[-0.015em] text-ink sm:text-[40px] lg:text-[58px]">
              About.
              <br />
              <BrandName />
            </h2>
            <p className="mt-4 max-w-[320px] text-[15px] leading-relaxed text-muted lg:mt-6 lg:max-w-[360px] lg:text-[23px] lg:leading-[1.55]">
              A creative technology company built to define what&apos;s next.
            </p>
            <Button href="#team" className="mt-7 lg:mt-9">
              Meet Our Team
            </Button>
          </Reveal>
        </Container>
      </div>

      <div className="relative h-60 sm:h-72 md:absolute md:inset-0 md:-z-10 md:h-auto">
        <img
          src="/images/about-banner.webp"
          alt="A group of people standing on a cliff edge looking toward the sunset"
          loading="lazy"
          width={1920}
          height={640}
          className="h-full w-full object-cover object-[80%_center]"
        />
        <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-paper to-transparent md:hidden" aria-hidden />
        <div className="absolute inset-0 hidden bg-gradient-to-r from-paper from-[28%] via-paper/70 via-[44%] to-transparent to-[62%] md:block" aria-hidden />
        <div className="absolute inset-x-0 top-0 hidden h-16 bg-gradient-to-b from-paper/70 to-transparent md:block" aria-hidden />
      </div>
    </section>
  )
}
