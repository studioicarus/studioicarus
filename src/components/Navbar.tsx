import { useEffect, useRef, useState } from 'react'
import { ChevronDown, Menu, X } from 'lucide-react'
import { GET_STARTED_PATH, navLinks, services } from '../data/content'
import Button from './ui/Button'
import Container from './ui/Container'
import Link from './ui/Link'
import Logo from './ui/Logo'

const linkClass =
  'text-[13px] font-medium text-on-deep underline-offset-8 decoration-brand decoration-2 transition-colors hover:underline lg:text-[16px] xl:text-[18px]'

/** The services that have their own page, for the Services submenu. */
const serviceLinks = services.flatMap(({ title, href, icon }) => (href ? [{ title, href, icon }] : []))

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const closeTimer = useRef<number | undefined>(undefined)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  useEffect(() => {
    if (!servicesOpen) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setServicesOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [servicesOpen])

  useEffect(() => () => window.clearTimeout(closeTimer.current), [])

  const openServices = () => {
    window.clearTimeout(closeTimer.current)
    setServicesOpen(true)
  }
  // A short delay lets the pointer travel from the link down to the menu without it closing.
  const closeServicesSoon = () => {
    closeTimer.current = window.setTimeout(() => setServicesOpen(false), 140)
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-black/10 bg-paper-deep">
      <Container inset>
        <nav aria-label="Primary" className="flex h-[72px] items-center justify-between lg:h-[88px] xl:h-[112px]">
          <Logo mark />

          <ul className="hidden items-stretch gap-7 self-stretch md:flex lg:gap-8 xl:gap-11">
            {navLinks.map((l) =>
              l.label === 'Services' ? (
                <li
                  key={l.href}
                  className="relative flex items-center"
                  onMouseEnter={openServices}
                  onMouseLeave={closeServicesSoon}
                  onBlur={(e) => {
                    if (!e.currentTarget.contains(e.relatedTarget)) setServicesOpen(false)
                  }}
                >
                  <Link href={l.href} className={linkClass}>
                    {l.label}
                  </Link>
                  <button
                    type="button"
                    aria-label="Show services"
                    aria-expanded={servicesOpen}
                    aria-controls="services-menu"
                    onClick={() => setServicesOpen((v) => !v)}
                    className="-mr-1 ml-1 grid h-7 w-7 place-items-center rounded-full text-on-deep transition hover:bg-white/10"
                  >
                    <ChevronDown size={16} aria-hidden className={`transition-transform duration-200 ${servicesOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <div
                    id="services-menu"
                    className={`absolute left-1/2 top-full w-[300px] -translate-x-1/2 pt-1 transition duration-150 ${
                      servicesOpen ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-1 opacity-0'
                    }`}
                  >
                    <ul className="rounded-2xl border border-black/10 bg-surface p-2 shadow-card">
                      {serviceLinks.map(({ title, href, icon: Icon }) => (
                        <li key={href}>
                          <Link
                            href={href}
                            onClick={() => setServicesOpen(false)}
                            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] font-semibold text-ink transition-colors hover:bg-brand-100 lg:text-[16px]"
                          >
                            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand text-on-brand">
                              <Icon size={18} strokeWidth={1.9} aria-hidden />
                            </span>
                            {title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              ) : (
                <li key={l.href} className="flex items-center">
                  <Link href={l.href} className={linkClass}>
                    {l.label}
                  </Link>
                </li>
              ),
            )}
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
              {navLinks.map((l) => {
                const hasServices = l.label === 'Services'
                return (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      onClick={() => setOpen(false)}
                      tabIndex={open ? 0 : -1}
                      className={`block py-3.5 text-[15px] font-medium text-on-deep ${hasServices ? '' : 'border-b border-white/10'}`}
                    >
                      {l.label}
                    </Link>
                    {hasServices && (
                      <ul className="border-b border-white/10 pb-2 pl-4">
                        {serviceLinks.map(({ title, href }) => (
                          <li key={href}>
                            <Link href={href} onClick={() => setOpen(false)} tabIndex={open ? 0 : -1} className="block py-2.5 text-[14px] text-on-deep">
                              {title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                )
              })}
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
