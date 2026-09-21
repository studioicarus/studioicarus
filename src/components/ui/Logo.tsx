import Link from './Link'

type Props = {
  className?: string
  size?: 'md' | 'lg'
  /** Show the logo mark in front of the name. */
  mark?: boolean
}

/** Text wordmark used in the header and footer (both dark gray): ICARUSX as one word: ICARUS in near-white, X in a light shade of the logo teal. */
export default function Logo({ className = '', size = 'md', mark = false }: Props) {
  const t = size === 'lg' ? 'text-[26px] sm:text-[28px] lg:text-[36px]' : 'text-[24px] sm:text-[26px] lg:text-[30px] xl:text-[38px]'
  const x = size === 'lg' ? 'text-[30px] sm:text-[32px] lg:text-[42px]' : 'text-[28px] sm:text-[30px] lg:text-[35px] xl:text-[44px]'
  const m = size === 'lg' ? 'h-10 lg:h-12' : 'h-9 sm:h-10 lg:h-11 xl:h-[52px]'
  return (
    <Link href="/#top" aria-label="ICARUSX — home" className={`group inline-flex items-center gap-2.5 text-on-deep lg:gap-3 ${className}`}>
      {mark && <img src="/images/icarus-logo-mark.webp" alt="" width={130} height={200} className={`w-auto shrink-0 ${m}`} />}
      <span className="relative inline-flex items-baseline">
        <span className={`font-medium tracking-[0.07em] ${t}`}>ICARUS</span>
        <span className={`font-semibold leading-none text-logo-teal-light ${x}`}>X</span>
        <span className="absolute -bottom-1.5 left-0 h-px w-[78%] bg-gradient-to-r from-logo-teal-light/80 via-logo-teal-light/40 to-transparent" aria-hidden />
      </span>
    </Link>
  )
}
