import { booking } from '../data/content'

/** Offset (ms) of a time zone from UTC at a given instant. */
function zoneOffsetMs(instant: Date, tz: string) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).formatToParts(instant)
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value)
  const asUtc = Date.UTC(get('year'), get('month') - 1, get('day'), get('hour'), get('minute'), get('second'))
  return asUtc - Math.floor(instant.getTime() / 1000) * 1000
}

/** The instant at which the wall clock in `tz` reads the given date and time. */
function zonedTimeToUtc(y: number, m: number, d: number, h: number, min: number, tz: string) {
  const guess = Date.UTC(y, m - 1, d, h, min)
  const first = guess - zoneOffsetMs(new Date(guess), tz)
  // Second pass settles times that sit next to a daylight-saving change.
  return new Date(guess - zoneOffsetMs(new Date(first), tz))
}

/** "YYYY-MM-DD" for an instant as seen in `tz`. */
export const dayKey = (d: Date, tz: string) =>
  new Intl.DateTimeFormat('en-CA', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit' }).format(d)

/** Every bookable start time in the coming weeks, as absolute instants. */
export function allSlots(now: Date): Date[] {
  const { hostTimeZone, weekdays, startHour, endHour, minutes, intervalMinutes, minNoticeHours, horizonDays } = booking
  const [y, m, d] = dayKey(now, hostTimeZone).split('-').map(Number)
  const earliest = now.getTime() + minNoticeHours * 3_600_000
  const latest = now.getTime() + horizonDays * 86_400_000
  const slots: Date[] = []

  for (let i = 0; i <= horizonDays + 1; i++) {
    const day = new Date(Date.UTC(y, m - 1, d + i))
    if (!weekdays.includes(day.getUTCDay())) continue
    for (let t = startHour * 60; t + minutes <= endHour * 60; t += intervalMinutes) {
      const start = zonedTimeToUtc(day.getUTCFullYear(), day.getUTCMonth() + 1, day.getUTCDate(), Math.floor(t / 60), t % 60, hostTimeZone)
      if (start.getTime() >= earliest && start.getTime() <= latest) slots.push(start)
    }
  }
  return slots
}

/** Group start times by the calendar day they fall on for the visitor. */
export function groupByDay(slots: Date[], tz: string) {
  const days = new Map<string, Date[]>()
  for (const slot of slots) {
    const key = dayKey(slot, tz)
    const list = days.get(key)
    if (list) list.push(slot)
    else days.set(key, [slot])
  }
  return days
}

export const formatTime = (d: Date, tz: string) =>
  new Intl.DateTimeFormat('en-US', { timeZone: tz, hour: 'numeric', minute: '2-digit' }).format(d).replace(/\s/g, '').toLowerCase()

/** Format a "YYYY-MM-DD" key (calendar days carry no time zone). */
export function formatDay(key: string, options: Intl.DateTimeFormatOptions) {
  const [y, m, d] = key.split('-').map(Number)
  return new Intl.DateTimeFormat('en-US', { timeZone: 'UTC', ...options }).format(new Date(Date.UTC(y, m - 1, d)))
}

/** "3:00pm - 3:30pm, Friday, September 25, 2026" */
export function formatRange(start: Date, tz: string) {
  const end = new Date(start.getTime() + booking.minutes * 60_000)
  const day = formatDay(dayKey(start, tz), { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
  return `${formatTime(start, tz)} - ${formatTime(end, tz)}, ${day}`
}

export const detectTimeZone = () => Intl.DateTimeFormat().resolvedOptions().timeZone || booking.hostTimeZone

export function timeZoneList(current: string) {
  const all = Intl.supportedValuesOf('timeZone')
  return all.includes(current) ? all : [current, ...all]
}
