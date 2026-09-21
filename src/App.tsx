import { useEffect, useRef } from 'react'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import { GET_STARTED_PATH, getServicePage } from './data/content'
import { usePath } from './lib/router'
import GetStarted from './pages/GetStarted'
import Home from './pages/Home'
import ServiceDetail from './pages/ServiceDetail'

const homeTitle = document.title

export default function App() {
  const path = usePath()
  const page = getServicePage(path)
  const prevPath = useRef(path)

  useEffect(() => {
    if (page) document.title = `${page.title} — ICARUSX`
    else if (path === GET_STARTED_PATH) document.title = 'Get Started — ICARUSX'
    else document.title = homeTitle

    const changed = prevPath.current !== path
    prevPath.current = path
    const { hash } = window.location
    const target = hash ? document.getElementById(decodeURIComponent(hash.slice(1))) : null
    if (target) target.scrollIntoView()
    else if (changed) window.scrollTo({ top: 0, behavior: 'instant' })
  }, [path, page])

  return (
    <>
      <Navbar />
      <main>
        {page ? <ServiceDetail key={path} page={page} /> : path === GET_STARTED_PATH ? <GetStarted /> : <Home />}
      </main>
      <Footer />
    </>
  )
}
