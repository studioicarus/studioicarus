import { footerColumns } from '../data/content'
import { Instagram, Linkedin, Tiktok, Youtube } from './ui/BrandIcons'
import Container from './ui/Container'
import Logo from './ui/Logo'

const socials = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/', icon: Linkedin },
  { label: 'YouTube', href: 'https://www.youtube.com/', icon: Youtube },
  { label: 'Instagram', href: 'https://www.instagram.com/', icon: Instagram },
  { label: 'TikTok', href: 'https://www.tiktok.com/', icon: Tiktok },
]

export default function Footer() {
  return (
    <footer className="border-t border-brand/25 bg-navy-950 text-slate-300">
      <Container inset className="grid gap-10 pb-12 pt-14 sm:grid-cols-2 lg:grid-cols-[1.55fr_1.25fr_1fr_1fr] lg:gap-8 lg:pb-16 lg:pt-20">
        <div>
          <Logo size="lg" />
          <p className="mt-6 text-[14px] text-slate-400 lg:mt-8 lg:text-[18px]">Technology • Creativity • Innovation</p>
        </div>

        {footerColumns.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <h3 className="text-[15px] font-semibold text-white lg:text-[20px]">{col.title}</h3>
            <ul className="mt-4 space-y-2.5 lg:mt-6 lg:space-y-3.5">
              {col.links.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="text-[14px] text-slate-400 transition-colors hover:text-white lg:text-[18px]">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ))}

        <div>
          <h3 className="text-[15px] font-semibold text-white lg:text-[20px]">Connect</h3>
          <ul className="mt-4 flex gap-3 lg:mt-6 lg:gap-4">
            {socials.map(({ label, href, icon: Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="grid h-10 w-10 place-items-center rounded-full text-slate-200 transition hover:bg-white/10 hover:text-white lg:h-11 lg:w-11"
                >
                  <Icon strokeWidth={1.8} className="h-5 w-5 lg:h-6 lg:w-6" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Container>

      <div className="border-t border-white/[0.07]">
        <Container inset className="flex flex-col gap-2 py-6 text-[13px] text-slate-400 sm:flex-row sm:items-center sm:justify-between lg:py-9 lg:text-[16px]">
          <p>© 2026 ICARUS X. All rights reserved.</p>
          <p>Built for what&apos;s next.</p>
        </Container>
      </div>
    </footer>
  )
}
