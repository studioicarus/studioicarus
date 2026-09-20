import type { ReactNode } from 'react'

type Props = {
  href: string
  variant?: 'primary' | 'outline'
  size?: 'sm' | 'md'
  className?: string
  children: ReactNode
}

const variants = {
  primary: 'bg-brand text-on-brand shadow-glow hover:bg-brand-400 hover:-translate-y-px',
  outline: 'border border-ink/40 bg-transparent text-ink hover:border-ink hover:bg-ink/10',
}

const sizes = {
  sm: 'h-9 px-5 text-[13px] lg:h-12 lg:px-7 lg:text-[16px] xl:h-[58px] xl:px-9 xl:text-[17px]',
  md: 'h-12 px-7 text-[15px] lg:h-[60px] lg:px-9 lg:text-[18px] xl:h-[70px] xl:px-11 xl:text-[20px]',
}

export default function Button({ href, variant = 'primary', size = 'md', className = '', children }: Props) {
  return (
    <a
      href={href}
      className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-semibold transition duration-200 ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </a>
  )
}
