import About from '../components/About'
import AboutBanner from '../components/AboutBanner'
import CTA from '../components/CTA'
import Hero from '../components/Hero'
import Needs from '../components/Needs'
import Process from '../components/Process'
import SelectedWork from '../components/SelectedWork'
import Services from '../components/Services'
import TeamBanner from '../components/TeamBanner'
import WhyUs from '../components/WhyUs'

export default function Home() {
  return (
    <>
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
    </>
  )
}
