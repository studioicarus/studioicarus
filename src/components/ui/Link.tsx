import type { AnchorHTMLAttributes, MouseEvent } from 'react'
import { navigate } from '../../lib/router'

/**
 * Anchor that switches pages without a reload.
 * Only hrefs starting with "/" are handled here; "#hash", mailto: and external links keep the browser default.
 */
export default function Link({ href = '', onClick, ...rest }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e)
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || rest.target === '_blank') return
    if (!href.startsWith('/')) return

    const url = new URL(href, window.location.href)
    // Same page: the browser scrolls to the hash on its own.
    if (url.pathname === window.location.pathname) return

    e.preventDefault()
    // The section exists on the page we're already on (e.g. the contact block): scroll to it instead of leaving.
    const local = url.hash ? document.getElementById(decodeURIComponent(url.hash.slice(1))) : null
    if (local) {
      window.history.pushState(null, '', window.location.pathname + url.hash)
      local.scrollIntoView()
      return
    }
    navigate(url.pathname + url.search + url.hash)
  }

  return <a href={href} onClick={handleClick} {...rest} />
}
