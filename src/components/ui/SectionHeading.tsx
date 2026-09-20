import type { ReactNode } from 'react'

type Props = {
  title: ReactNode
  subtitle?: string
  dark?: boolean
  className?: string
}

export default function SectionHeading({ title, subtitle, dark = false, className = '' }: Props) {
  return (
    <div className={className}>
      <h2 className={`text-[28px] font-semibold leading-tight tracking-[-0.015em] sm:text-[34px] lg:text-[46px] ${dark ? 'text-white' : 'text-ink'}`}>{title}</h2>
      {subtitle && <p className={`mt-2 text-[15px] sm:text-[17px] lg:mt-3 lg:text-[23px] ${dark ? 'text-slate-300' : 'text-muted'}`}>{subtitle}</p>}
    </div>
  )
}
