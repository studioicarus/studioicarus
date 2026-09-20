import type { ReactNode } from 'react'

type Props = {
  title: ReactNode
  subtitle?: string
  className?: string
}

export default function SectionHeading({ title, subtitle, className = '' }: Props) {
  return (
    <div className={className}>
      <h2 className="text-[28px] font-semibold leading-tight tracking-[-0.015em] text-ink sm:text-[34px] lg:text-[46px]">{title}</h2>
      {subtitle && <p className="mt-2 text-[15px] text-muted sm:text-[17px] lg:mt-3 lg:text-[23px]">{subtitle}</p>}
    </div>
  )
}
