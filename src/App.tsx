import About from './components/About'
import AboutBanner from './components/AboutBanner'
import CTA from './components/CTA'
import Footer from './components/Footer'
import Hero from './components/Hero'
import Navbar from './components/Navbar'
import Needs from './components/Needs'
import Process from './components/Process'
import SelectedWork from './components/SelectedWork'
import Services from './components/Services'
import TeamBanner from './components/TeamBanner'
import WhyUs from './components/WhyUs'

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Services />
        <Needs />
        <SelectedWork />
        <Process />
        <TeamBanner />
        <About />
        <AboutBanner />
        <WhyUs />
        <CTA />
      </main>
      <Footer />
    </>
  )
}
