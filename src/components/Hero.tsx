import Button from './ui/Button'
import Container from './ui/Container'

export default function Hero() {
  return (
    <section id="top" className="relative isolate overflow-hidden bg-paper">
      <img
        src="/images/icarus-mark-hero.png"
        alt="ICARUS X winged figure in flight"
        width={649}
        height={414}
        fetchPriority="high"
        className="pointer-events-none absolute -right-6 top-24 -z-[5] w-[62%] max-w-[320px] opacity-30 md:right-[3%] md:top-1/2 md:w-[36%] md:max-w-none md:-translate-y-[45%] md:opacity-100 lg:w-[30%] lg:max-w-[560px] xl:right-[6%] xl:w-[30%]"
      />

      <Container inset className="flex min-h-[640px] items-center pb-16 pt-28 md:min-h-[720px] lg:min-h-[880px] lg:pb-24 lg:pt-44">
        <div className="max-w-[760px]">
          <h1 className="text-[36px] font-semibold leading-[1.12] tracking-[-0.02em] text-ink sm:text-[52px] lg:text-[60px] lg:leading-[1.25] xl:text-[74px] xl:leading-[1.28] md:max-w-[calc(61vw-56px)] lg:max-w-[calc(67vw-104px)] xl:max-w-[min(760px,calc(64vw-104px))]">
            We Create,
            <br />
            You Own the <span className="text-brand-600">Spotlight</span>
          </h1>
          <p className="mt-6 max-w-[430px] text-[17px] leading-relaxed text-muted sm:text-[19px] lg:mt-9 lg:max-w-[560px] lg:text-[24px] lg:leading-[1.5] xl:max-w-[680px] xl:text-[30px]">
            Creative technology for modern businesses, brands and professionals.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 lg:mt-11 lg:gap-5">
            <Button href="#services">Explore Our Services</Button>
            <Button href="#work" variant="outline">
              View Our Work
            </Button>
          </div>
        </div>
      </Container>
    </section>
  )
}
