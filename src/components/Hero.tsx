import Button from './ui/Button'
import Container from './ui/Container'

export default function Hero() {
  return (
    <section id="top" className="relative isolate overflow-hidden bg-paper">
      <img
        src="/images/hero-bg.webp"
        alt=""
        fetchPriority="high"
        className="absolute inset-0 -z-20 h-full w-full object-cover object-[68%_center]"
      />
      {/* light-gray wash so the blue headline reads over the photo and the header blends in */}
      <div className="absolute inset-x-0 top-0 -z-10 h-44 bg-gradient-to-b from-paper from-25% to-transparent" aria-hidden />
      <div className="absolute inset-0 -z-10 bg-paper/80 md:hidden" aria-hidden />
      <div className="absolute inset-0 -z-10 hidden bg-gradient-to-r from-paper from-[30%] via-paper/75 via-[50%] to-transparent to-[75%] md:block" aria-hidden />

      <img
        src="/images/icarus-mark.png"
        alt="ICARUS X winged figure soaring over the mountains"
        width={649}
        height={414}
        className="pointer-events-none absolute -right-8 top-24 -z-[5] w-[82%] max-w-[420px] opacity-40 drop-shadow-[0_0_46px_rgba(29,160,214,0.5)] md:right-[2%] md:top-28 md:w-[50%] md:max-w-none md:opacity-90 lg:right-[2%] lg:top-[20%] lg:w-[40%] xl:right-[4%] xl:w-[42%] lg:max-w-[760px] lg:opacity-100"
      />

      <Container inset className="flex min-h-[640px] items-center pb-16 pt-28 md:min-h-[720px] lg:min-h-[880px] lg:pb-24 lg:pt-44">
        <div className="max-w-[760px]">
          <h1 className="text-[36px] font-semibold leading-[1.12] tracking-[-0.02em] text-ink sm:text-[52px] lg:text-[60px] lg:leading-[1.25] xl:text-[74px] xl:leading-[1.28]">
            We Create.
            <br />
            We Communicate.
            <br />
            We <span className="text-brand-600">Grow.</span>
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
