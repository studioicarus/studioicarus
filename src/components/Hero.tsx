import Button from './ui/Button'
import Container from './ui/Container'

export default function Hero() {
  return (
    <section id="top" className="relative isolate overflow-hidden bg-paper">
      <Container inset className="flex items-center pb-8 pt-28 lg:min-h-[800px] lg:pb-16 lg:pt-40 xl:min-h-[880px]">
        {/* On wide screens the text stays left of the picture; the cap keeps it off the scene */}
        <div className="max-w-[760px] lg:max-w-[calc(49vw-96px)] xl:max-w-[min(760px,calc(49vw-96px))]">
          <h1 className="text-[36px] font-semibold leading-[1.12] tracking-[-0.02em] text-ink sm:text-[52px] lg:text-[60px] lg:leading-[1.25] xl:text-[74px] xl:leading-[1.28]">
            We Create,
            <br />
            You Own the <span className="text-brand-600">Spotlight.</span>
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

      {/* Below the text on phones and tablets; on wide screens it sits behind the text, flush right */}
      <div className="hero-visual pointer-events-none relative lg:absolute lg:right-0 lg:top-1/2 lg:-z-10 lg:w-[58vw] lg:max-w-[1000px] lg:-translate-y-1/2">
        <img
          src="/images/hero-workspace.webp"
          alt="A laptop editing video on a desk with a camera, notebook and phone, surrounded by floating cards for video content, marketing and ghostwriting"
          width={1153}
          height={940}
          fetchPriority="high"
          className="block h-auto w-full"
        />
      </div>
    </section>
  )
}
