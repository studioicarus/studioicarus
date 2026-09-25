import { useEffect, useRef, type ReactElement } from 'react'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import { GET_STARTED_PATH, TEAM_PATH, WORK_PATH, getServicePage } from './data/content'
import { usePath } from './lib/router'
import GetStarted from './pages/GetStarted'
import Home from './pages/Home'
import ServiceDetail from './pages/ServiceDetail'
import Team from './pages/Team'
import Works from './pages/Works'

const homeTitle = document.title

/** The admin is a separate page in public/admin; a host that hands "/admin" to this app sends visitors on to it. */
const ADMIN_PATH = '/admin'

/** Pages that are not a service page, with their browser-tab titles. */
const pages: Record<string, { title: string; element: () => ReactElement }> = {
  [GET_STARTED_PATH]: { title: 'Get Started — ICARUSX', element: () => <GetStarted /> },
  [TEAM_PATH]: { title: 'Team — ICARUSX', element: () => <Team /> },
  [WORK_PATH]: { title: 'Our Work — ICARUSX', element: () => <Works /> },
}

export default function App() {
  const path = usePath()
  const page = getServicePage(path)
  const other = Object.prototype.hasOwnProperty.call(pages, path) ? pages[path] : undefined
  const prevPath = useRef(path)

  useEffect(() => {
    if (path === ADMIN_PATH) {
      window.location.replace(`${ADMIN_PATH}/`)
      return
    }
    if (page) document.title = `${page.title} — ICARUSX`
    else if (other) document.title = other.title
    else document.title = homeTitle

    const changed = prevPath.current !== path
    prevPath.current = path
    const { hash } = window.location
    const target = hash ? document.getElementById(decodeURIComponent(hash.slice(1))) : null
    if (target) target.scrollIntoView()
    else if (changed) window.scrollTo({ top: 0, behavior: 'instant' })
  }, [path, page, other])

  if (path === ADMIN_PATH) return null

  return (
    <>
      <Navbar />
      <main>
        {page ? <ServiceDetail key={path} page={page} /> : other ? other.element() : <Home />}
      </main>
      <Footer />
    </>
  )
}
