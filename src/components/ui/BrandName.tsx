/** The company name in running text (one word), with the X in a shade of the logo teal. */
export default function BrandName({ onDark = false }: { onDark?: boolean }) {
  return (
    <>
      ICARUS<span className={onDark ? 'text-logo-teal-light' : 'text-logo-teal-dark'}>X</span>
    </>
  )
}
