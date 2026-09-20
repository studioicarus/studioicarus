import { ArrowRight } from 'lucide-react'
import { CONTACT_HREF } from '../data/content'
import Button from './ui/Button'
import Container from './ui/Container'
import Reveal from './ui/Reveal'

export default function CTA() {
  return (
    <section id="contact" className="relative overflow-hidden bg-navy-900 py-20 sm:py-24 lg:py-[88px]">
      <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-[720px] -translate-x-1/2 rounded-full bg-brand/10 blur-[90px]" aria-hidden />
      <Container>
        <Reveal className="mx-auto flex max-w-[860px] flex-col items-center text-center">
          <h2 className="text-[28px] font-semibold leading-tight tracking-[-0.015em] text-white sm:text-[34px] lg:text-[44px]">Have Something You Want to Build?</h2>
          <p className="mt-5 max-w-[640px] text-[15px] leading-[1.7] text-slate-300 sm:text-[17px] lg:mt-6 lg:max-w-[860px] lg:text-[22px] lg:leading-[1.65]">
            Let&apos;s talk. Whether you need a video, a personal brand,{' '}<br className="hidden lg:block" />or a complete social media presence — ICARUS X can help you create it.
          </p>
          <Button href={CONTACT_HREF} className="mt-8 lg:mt-10">
            Start a Project <ArrowRight size={18} aria-hidden />
          </Button>
        </Reveal>
      </Container>
    </section>
  )
}
