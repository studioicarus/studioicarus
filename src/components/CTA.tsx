import type { ReactNode } from 'react'
import { ArrowRight } from 'lucide-react'
import { CONTACT_HREF } from '../data/content'
import BrandName from './ui/BrandName'
import Button from './ui/Button'
import Container from './ui/Container'
import Reveal from './ui/Reveal'

type Props = {
  title?: string
  label?: string
  href?: string
  /** Replaces the default supporting copy. */
  children?: ReactNode
}

export default function CTA({ title = 'Have Something You Want to Build?', label = 'Start a Project', href = CONTACT_HREF, children }: Props) {
  return (
    <section id="contact" className="relative overflow-hidden bg-paper py-20 sm:py-24 lg:py-[88px]">
      <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-[720px] -translate-x-1/2 rounded-full bg-brand/25 blur-[90px]" aria-hidden />
      <Container>
        <Reveal className="mx-auto flex max-w-[860px] flex-col items-center text-center">
          <h2 className="text-[28px] font-semibold leading-tight tracking-[-0.015em] text-ink sm:text-[34px] lg:text-[44px]">{title}</h2>
          <p className="mt-5 max-w-[640px] text-[15px] leading-[1.7] text-muted sm:text-[17px] lg:mt-6 lg:max-w-[860px] lg:text-[22px] lg:leading-[1.65]">
            {children ?? (
              <>
                Let&apos;s talk. Whether you need a video, a personal brand,{' '}<br className="hidden lg:block" />or a complete social media presence — <BrandName /> can help you create it.
              </>
            )}
          </p>
          <Button href={href} className="mt-8 lg:mt-10">
            {label} <ArrowRight size={18} aria-hidden />
          </Button>
        </Reveal>
      </Container>
    </section>
  )
}
