import { useSyncExternalStore } from 'react'

/** Minimal History API router: the site only has a handful of pages, so no library is needed. */
const listeners = new Set<() => void>()
const emit = () => listeners.forEach((l) => l())

function subscribe(cb: () => void) {
  listeners.add(cb)
  window.addEventListener('popstate', cb)
  return () => {
    listeners.delete(cb)
    window.removeEventListener('popstate', cb)
  }
}

const normalize = (p: string) => p.replace(/\/+$/, '') || '/'

export function usePath() {
  return useSyncExternalStore(subscribe, () => normalize(window.location.pathname), () => '/')
}

export function navigate(to: string) {
  window.history.pushState(null, '', to)
  emit()
}
