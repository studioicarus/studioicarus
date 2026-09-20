import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
  className?: string
  /** "inset" adds the wider left/right gutter the reference uses for the nav, hero and banner copy. */
  inset?: boolean
}

export default function Container({ children, className = '', inset = false }: Props) {
  return (
    <div className={`mx-auto w-full max-w-[1400px] px-5 sm:px-8 ${inset ? 'lg:px-20' : 'lg:px-14'} ${className}`}>{children}</div>
  )
}
