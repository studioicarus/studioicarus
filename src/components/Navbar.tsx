import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { navLinks } from '../data/content'
import Button from './ui/Button'
import Container from './ui/Container'
import Logo from './ui/Logo'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const solid = scrolled || open

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter,border-color] duration-300 ${
        solid ? 'border-b border-white/[0.06] bg-navy-950/85 backdrop-blur-md' : 'border-b border-transparent bg-transparent'
      }`}
    >
      <Container inset>
        <nav aria-label="Primary" className="flex h-[72px] items-center justify-between lg:h-[88px] xl:h-[112px]">
          <Logo />

          <ul className="hidden items-center gap-7 md:flex lg:gap-8 xl:gap-11">
            {navLinks.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="text-[13px] font-medium text-white/90 transition-colors hover:text-brand-400 lg:text-[16px] xl:text-[18px]">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <Button href="#contact" size="sm" className="hidden md:inline-flex">
              Get Started
            </Button>
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white transition hover:bg-white/10 md:hidden"
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>
      </Container>

      <div
        id="mobile-menu"
        className={`grid overflow-hidden transition-[grid-template-rows] duration-300 md:hidden ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
      >
        <div className="min-h-0">
          <Container className="pb-6">
            <ul className="flex flex-col border-t border-white/10 pt-2">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    tabIndex={open ? 0 : -1}
                    className="block border-b border-white/[0.06] py-3.5 text-[15px] font-medium text-white/90"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
            <Button href="#contact" className="mt-5 w-full" size="md">
              Get Started
            </Button>
          </Container>
        </div>
      </div>
    </header>
  )
}
