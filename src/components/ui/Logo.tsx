/** Text wordmark used in the header and footer (both dark gray): ICARUS in pale blue, X in the brand blue. */
export default function Logo({ className = '', size = 'md' }: { className?: string; size?: 'md' | 'lg' }) {
  const t = size === 'lg' ? 'text-[26px] sm:text-[28px] lg:text-[36px]' : 'text-[24px] sm:text-[26px] lg:text-[30px] xl:text-[38px]'
  const x = size === 'lg' ? 'text-[30px] sm:text-[32px] lg:text-[42px]' : 'text-[28px] sm:text-[30px] lg:text-[35px] xl:text-[44px]'
  return (
    <a href="#top" aria-label="ICARUS X — home" className={`group relative inline-flex items-baseline text-on-deep ${className}`}>
      <span className={`font-medium tracking-[0.07em] ${t}`}>ICARUS</span>
      <span className={`ml-0.5 font-semibold leading-none text-brand-400 ${x}`}>X</span>
      <span className="absolute -bottom-1.5 left-0 h-px w-[78%] bg-gradient-to-r from-brand-400/80 via-brand-400/40 to-transparent" aria-hidden />
    </a>
  )
}
