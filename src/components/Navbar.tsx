import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { GET_STARTED_PATH, navLinks } from '../data/content'
import Button from './ui/Button'
import Container from './ui/Container'
import Link from './ui/Link'
import Logo from './ui/Logo'

export default function Navbar() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-black/10 bg-paper-deep/95 backdrop-blur-md">
      <Container inset>
        <nav aria-label="Primary" className="flex h-[72px] items-center justify-between lg:h-[88px] xl:h-[112px]">
          <Logo />

          <ul className="hidden items-center gap-7 md:flex lg:gap-8 xl:gap-11">
            {navLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-[13px] font-medium text-on-deep underline-offset-8 decoration-brand decoration-2 transition-colors hover:underline lg:text-[16px] xl:text-[18px]">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <Button href={GET_STARTED_PATH} size="sm" className="hidden md:inline-flex">
              Get Started
            </Button>
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/25 text-on-deep transition hover:bg-white/10 md:hidden"
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
            <ul className="flex flex-col border-t border-white/15 pt-2">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    tabIndex={open ? 0 : -1}
                    className="block border-b border-white/10 py-3.5 text-[15px] font-medium text-on-deep"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <Button href={GET_STARTED_PATH} className="mt-5 w-full" size="md">
              Get Started
            </Button>
          </Container>
        </div>
      </div>
    </header>
  )
}
