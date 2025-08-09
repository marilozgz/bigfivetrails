import FeaturedSafaris from "./components/FeaturedSafaris"
import Footer from "./components/Footer"
import Hero from "./components/Hero"
import InstagramFeed from "./components/InstagramFeed"
import Testimonials from "./components/Testimonials"
import WhyUs from "./components/WhyUs"

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedSafaris />
      <WhyUs />
      <Testimonials />
      <InstagramFeed />
      <Footer />
    </>
  )
}
