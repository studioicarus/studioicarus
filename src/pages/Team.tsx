import CTA from '../components/CTA'
import Container from '../components/ui/Container'
import { Linkedin } from '../components/ui/BrandIcons'
import Reveal from '../components/ui/Reveal'
import { GET_STARTED_PATH, team } from '../data/content'

/** "Jane Doe" becomes "JD"; a single name gives one letter. */
function initials(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean)
  if (words.length === 0) return ''
  return (words[0][0] + (words.length > 1 ? words[words.length - 1][0] : '')).toUpperCase()
}

export default function Team() {
  return (
    <>
      <section className="bg-paper pb-16 pt-28 sm:pb-20 lg:pb-24 lg:pt-44">
        <Container>
          <Reveal>
            <h1 className="text-[36px] font-semibold leading-[1.12] tracking-[-0.02em] text-ink sm:text-[48px] lg:text-[64px]">Meet the Team</h1>
            <p className="mt-3 max-w-[640px] text-[17px] leading-relaxed text-muted sm:text-[19px] lg:mt-5 lg:text-[24px]">
              The people behind the work. One team, many skills.
            </p>
          </Reveal>

          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3 lg:gap-8">
            {team.map(({ name, role, bio, photo, linkedin }, i) => (
              <li key={`${name}-${i}`}>
                <Reveal delay={(i % 3) * 90} className="h-full">
                  <article className="h-full overflow-hidden rounded-[20px] border border-ink/15 bg-surface shadow-card">
                    {photo ? (
                      <img src={photo} alt={`${name}, ${role}`} loading="lazy" width={800} height={800} className="aspect-square w-full object-cover" />
                    ) : (
                      <div className="grid aspect-square w-full place-items-center bg-brand-50" aria-hidden>
                        <span className="text-[64px] font-semibold tracking-[-0.02em] text-brand-600 lg:text-[80px]">{initials(name)}</span>
                      </div>
                    )}
                    <div className="px-6 pb-7 pt-6 lg:px-7 lg:pb-8">
                      <h2 className="text-[22px] font-semibold leading-snug text-ink lg:text-[26px]">{name}</h2>
                      <p className="mt-1 text-[16px] font-medium text-brand-600 lg:text-[18px]">{role}</p>
                      <p className="mt-3 text-[15px] leading-relaxed text-muted lg:text-[17px] lg:leading-[1.65]">{bio}</p>
                      {linkedin && (
                        <a
                          href={linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${name} on LinkedIn`}
                          className="mt-5 inline-grid h-11 w-11 place-items-center rounded-full border border-ink/25 text-ink transition hover:bg-ink/10"
                        >
                          <Linkedin size={20} strokeWidth={1.8} />
                        </a>
                      )}
                    </div>
                  </article>
                </Reveal>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <CTA title="Want to work with us?" label="Get Started" href={GET_STARTED_PATH}>
        Tell us about your project and we&apos;ll take it from there.
      </CTA>
    </>
  )
}
