import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { ArrowLeft, CalendarDays, Check, ChevronLeft, ChevronRight, Clock, Globe, Video } from 'lucide-react'
import Button from '../components/ui/Button'
import Container from '../components/ui/Container'
import { CONTACT_HREF, booking } from '../data/content'
import { allSlots, dayKey, detectTimeZone, formatDay, formatRange, formatTime, groupByDay, timeZoneList } from '../lib/booking'

type Step = 'pick' | 'details' | 'done'
type Errors = { name?: string; email?: string; guests?: string }

const weekdayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const pad = (n: number) => String(n).padStart(2, '0')

const inputClass =
  'mt-2 block w-full rounded-lg border border-ink/35 bg-paper-light px-3.5 py-3 text-[16px] text-ink aria-[invalid=true]:border-2 aria-[invalid=true]:border-ink'
const arrowClass =
  'grid h-10 w-10 place-items-center rounded-full text-ink transition hover:bg-ink/10 disabled:pointer-events-none disabled:opacity-30'

function Field({ id, label, error, children }: { id: string; label: string; error?: string; children: ReactNode }) {
  return (
    <div className="mt-5">
      <label htmlFor={id} className="text-[15px] font-semibold text-ink">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-[14px] font-semibold text-ink">
          {error}
        </p>
      )}
    </div>
  )
}

export default function GetStarted() {
  const [tz, setTz] = useState(detectTimeZone)
  const [loadedAt] = useState(() => new Date())
  const [now, setNow] = useState(() => new Date())
  const [step, setStep] = useState<Step>('pick')
  const [selectedDay, setSelectedDay] = useState<string | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<Date | null>(null)
  const [form, setForm] = useState({ name: '', email: '', guests: '', notes: '' })
  const [showGuests, setShowGuests] = useState(false)
  const [errors, setErrors] = useState<Errors>({})

  const cardRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const prevStep = useRef(step)

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 30_000)
    return () => window.clearInterval(id)
  }, [])

  // Move focus to the new step's heading and bring the card into view.
  useEffect(() => {
    if (prevStep.current === step) return
    prevStep.current = step
    headingRef.current?.focus({ preventScroll: true })
    cardRef.current?.scrollIntoView({ block: 'start' })
  }, [step])

  const days = useMemo(() => groupByDay(allSlots(loadedAt), tz), [loadedAt, tz])
  const dayKeys = useMemo(() => [...days.keys()].sort(), [days])
  const zones = useMemo(() => timeZoneList(detectTimeZone()), [])
  const todayKey = dayKey(now, tz)

  const [cursor, setCursor] = useState(() => {
    const [y, m] = (dayKeys[0] ?? todayKey).split('-').map(Number)
    return { y, m }
  })

  const monthKey = `${cursor.y}-${pad(cursor.m)}`
  const canPrev = monthKey > todayKey.slice(0, 7)
  const canNext = monthKey < (dayKeys.at(-1) ?? todayKey).slice(0, 7)
  const lead = (new Date(Date.UTC(cursor.y, cursor.m - 1, 1)).getUTCDay() + 6) % 7
  const dayCount = new Date(Date.UTC(cursor.y, cursor.m, 0)).getUTCDate()
  const times = selectedDay ? (days.get(selectedDay) ?? []) : []

  const shiftMonth = (delta: number) => {
    const index = cursor.y * 12 + (cursor.m - 1) + delta
    setCursor({ y: Math.floor(index / 12), m: (index % 12) + 1 })
  }

  const changeTz = (value: string) => {
    setTz(value)
    setSelectedDay(null)
    setSelectedSlot(null)
  }

  const mailto = () => {
    if (!selectedSlot) return CONTACT_HREF
    const optional = [form.guests.trim() && `Guests: ${form.guests.trim()}`, form.notes.trim() && `\nNotes:\n${form.notes.trim()}`].filter(Boolean)
    const lines = [
      'Hello ICARUS X,',
      '',
      `I'd like to book a ${booking.title}.`,
      '',
      `When: ${formatRange(selectedSlot, tz)} (${tz})`,
      `Name: ${form.name.trim()}`,
      `Email: ${form.email.trim()}`,
      ...optional,
    ]
    const subject = `${booking.title} request: ${formatRange(selectedSlot, tz)}`
    return `${CONTACT_HREF}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`
  }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!selectedSlot) return
    const next: Errors = {}
    if (!form.name.trim()) next.name = 'Enter your name.'
    if (!emailPattern.test(form.email.trim())) next.email = 'Enter a valid email address.'
    const guests = form.guests.split(/[,;\s]+/).filter(Boolean)
    if (guests.some((g) => !emailPattern.test(g))) next.guests = 'Check the guest email addresses.'
    setErrors(next)
    if (Object.keys(next).length) return
    window.location.href = mailto()
    setStep('done')
  }

  const firstName = form.name.trim().split(/\s+/)[0]

  return (
    <section className="bg-paper pb-20 pt-28 sm:pb-24 lg:pb-28 lg:pt-44">
      <Container>
        <div ref={cardRef} className="mx-auto max-w-[880px] scroll-mt-28 overflow-hidden rounded-[20px] border border-ink/15 bg-surface shadow-card">
          <header className="relative border-b border-ink/15 px-5 pb-8 pt-8 text-center sm:px-8">
            {step === 'details' && (
              <button type="button" aria-label="Back to date and time" onClick={() => setStep('pick')} className={`${arrowClass} absolute left-4 top-4 border border-ink/25 sm:left-6 sm:top-6`}>
                <ArrowLeft size={20} aria-hidden />
              </button>
            )}
            <img
              src="/images/icarus-mark-hero.png"
              alt="ICARUS X logo"
              width={72}
              height={72}
              className="mx-auto h-[72px] w-[72px] rounded-full bg-paper-light object-contain p-1.5 ring-1 ring-ink/15"
            />
            <p className="mt-3 text-[15px] font-semibold text-muted">ICARUS X</p>
            <h1 className="mt-1 text-[28px] font-semibold leading-tight tracking-[-0.015em] text-ink sm:text-[32px]">{booking.title}</h1>
            <ul className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[15px] font-semibold text-muted">
              <li className="flex items-center gap-2">
                <Clock size={18} className="shrink-0" aria-hidden /> {booking.minutes} min
              </li>
              <li className="flex items-center gap-2">
                <Video size={18} className="shrink-0" aria-hidden /> {booking.note}
              </li>
              {selectedSlot && step !== 'pick' && (
                <>
                  <li className="flex items-center gap-2">
                    <CalendarDays size={18} className="shrink-0" aria-hidden /> {formatRange(selectedSlot, tz)}
                  </li>
                  <li className="flex items-center gap-2">
                    <Globe size={18} className="shrink-0" aria-hidden /> {tz}
                  </li>
                </>
              )}
            </ul>
          </header>

          {step === 'pick' && (
            <div className="px-5 py-8 sm:px-8 lg:px-12 lg:py-10">
              <h2 ref={headingRef} tabIndex={-1} className="text-center text-[22px] font-semibold text-ink outline-none lg:text-[26px]">
                Select a Date &amp; Time
              </h2>

              <div className="mt-8 grid gap-10 md:grid-cols-[minmax(0,1fr)_260px] md:gap-12">
                <div>
                  <div className="flex items-center justify-center gap-4">
                    <button type="button" aria-label="Previous month" disabled={!canPrev} onClick={() => shiftMonth(-1)} className={arrowClass}>
                      <ChevronLeft size={22} aria-hidden />
                    </button>
                    <p aria-live="polite" className="min-w-[10rem] text-center text-[17px] font-semibold text-ink">
                      {formatDay(`${monthKey}-01`, { month: 'long', year: 'numeric' })}
                    </p>
                    <button type="button" aria-label="Next month" disabled={!canNext} onClick={() => shiftMonth(1)} className={arrowClass}>
                      <ChevronRight size={22} aria-hidden />
                    </button>
                  </div>

                  <div className="mt-5 grid grid-cols-7 gap-y-1 text-center">
                    {weekdayLabels.map((label) => (
                      <span key={label} aria-hidden className="pb-2 text-[13px] font-semibold text-muted">
                        {label}
                      </span>
                    ))}
                    {Array.from({ length: lead }, (_, i) => (
                      <span key={`gap-${i}`} aria-hidden />
                    ))}
                    {Array.from({ length: dayCount }, (_, i) => {
                      const key = `${monthKey}-${pad(i + 1)}`
                      const open = days.has(key)
                      const active = key === selectedDay
                      return (
                        <button
                          key={key}
                          type="button"
                          disabled={!open}
                          aria-pressed={active}
                          aria-label={formatDay(key, { weekday: 'long', month: 'long', day: 'numeric' })}
                          onClick={() => {
                            setSelectedDay(key)
                            setSelectedSlot(null)
                          }}
                          className={`relative mx-auto grid h-11 w-11 place-items-center rounded-full text-[16px] transition sm:h-12 sm:w-12 ${
                            active
                              ? 'bg-brand font-bold text-on-brand shadow-glow'
                              : open
                                ? 'bg-brand-100 font-semibold text-ink hover:bg-brand hover:text-on-brand'
                                : 'text-ink/55'
                          }`}
                        >
                          {i + 1}
                          {key === todayKey && <span aria-hidden className="absolute bottom-1.5 h-1 w-1 rounded-full bg-current" />}
                        </button>
                      )
                    })}
                  </div>

                  <div className="mt-8">
                    <label htmlFor="time-zone" className="text-[15px] font-semibold text-ink">
                      Time zone
                    </label>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-[15px] text-ink">
                      <Globe size={17} aria-hidden />
                      <select
                        id="time-zone"
                        value={tz}
                        onChange={(e) => changeTz(e.target.value)}
                        className="max-w-full rounded-lg border border-ink/30 bg-paper-light px-2.5 py-1.5 text-[15px] text-ink"
                      >
                        {zones.map((zone) => (
                          <option key={zone} value={zone}>
                            {zone.replace(/_/g, ' ')}
                          </option>
                        ))}
                      </select>
                      <span>({formatTime(now, tz)})</span>
                    </div>
                  </div>
                </div>

                <div>
                  {selectedDay ? (
                    <>
                      <h3 className="text-[17px] font-medium text-ink">{formatDay(selectedDay, { weekday: 'long', month: 'long', day: 'numeric' })}</h3>
                      <ul className="mt-4 flex max-h-[420px] flex-col gap-3 overflow-y-auto pr-1">
                        {times.map((slot) => {
                          const active = selectedSlot?.getTime() === slot.getTime()
                          return (
                            <li key={slot.toISOString()} className="flex gap-2">
                              <button
                                type="button"
                                aria-pressed={active}
                                onClick={() => setSelectedSlot(slot)}
                                className={`h-12 min-w-0 flex-1 rounded-lg border-2 text-[16px] font-semibold transition ${
                                  active ? 'border-paper-deep bg-paper-deep text-on-deep' : 'border-ink/40 text-ink hover:bg-brand-100'
                                }`}
                              >
                                {formatTime(slot, tz)}
                              </button>
                              {active && (
                                <button type="button" onClick={() => setStep('details')} className="h-12 flex-1 rounded-lg bg-brand text-[16px] font-semibold text-on-brand transition hover:bg-brand-400">
                                  Next
                                </button>
                              )}
                            </li>
                          )
                        })}
                      </ul>
                    </>
                  ) : (
                    <p className="text-[16px] leading-relaxed text-muted">Pick a highlighted day to see the times that are open.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {step === 'details' && (
            <form onSubmit={submit} noValidate className="mx-auto max-w-[440px] px-5 py-8 sm:px-0 lg:py-10">
              <h2 ref={headingRef} tabIndex={-1} className="text-[22px] font-semibold text-ink outline-none lg:text-[26px]">
                Enter Details
              </h2>

              <Field id="name" label="Name *" error={errors.name}>
                <input
                  id="name"
                  autoComplete="name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? 'name-error' : undefined}
                  className={inputClass}
                />
              </Field>

              <Field id="email" label="Email *" error={errors.email}>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                  className={inputClass}
                />
              </Field>

              {showGuests ? (
                <Field id="guests" label="Guest emails" error={errors.guests}>
                  <input
                    id="guests"
                    value={form.guests}
                    placeholder="Separate addresses with commas"
                    onChange={(e) => setForm({ ...form, guests: e.target.value })}
                    aria-invalid={!!errors.guests}
                    aria-describedby={errors.guests ? 'guests-error' : undefined}
                    className={inputClass}
                  />
                </Field>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowGuests(true)}
                  className="mt-5 rounded-full border border-ink/40 px-4 py-2 text-[14px] font-semibold text-ink transition hover:bg-ink/10"
                >
                  Add guests
                </button>
              )}

              <Field id="notes" label="Please share anything that will help prepare for our meeting.">
                <textarea id="notes" rows={4} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className={inputClass} />
              </Field>

              <p className="mt-5 text-[14px] leading-relaxed text-muted">By proceeding, you agree that ICARUS X may contact you about this meeting.</p>

              <button
                type="submit"
                className="mt-6 h-12 rounded-full bg-brand px-8 text-[16px] font-semibold text-on-brand shadow-glow transition hover:-translate-y-px hover:bg-brand-400"
              >
                Schedule Event
              </button>
            </form>
          )}

          {step === 'done' && (
            <div className="mx-auto max-w-[480px] px-5 py-10 text-center lg:py-12">
              <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-brand text-on-brand shadow-glow">
                <Check size={26} strokeWidth={2.4} aria-hidden />
              </span>
              <h2 ref={headingRef} tabIndex={-1} className="mt-6 text-[24px] font-semibold text-ink outline-none lg:text-[28px]">
                One last step{firstName ? `, ${firstName}` : ''}
              </h2>
              <p className="mt-3 text-[16px] leading-[1.7] text-muted lg:text-[18px]">
                Your email app should have opened with your request. Send it and we&apos;ll confirm the time.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Button href={mailto()} size="sm">
                  Open email again
                </Button>
                <Button href="/" variant="outline" size="sm">
                  Back to home
                </Button>
              </div>
            </div>
          )}
        </div>
      </Container>
    </section>
  )
}
