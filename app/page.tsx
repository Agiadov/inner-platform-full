import { Header } from "@/components/inner/header"
import { Hero } from "@/components/inner/hero"
import { Features } from "@/components/inner/features"
import { ServiceBlock } from "@/components/inner/service-block"
import { Footer } from "@/components/inner/footer"

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-background">
      <Header />
      <Hero />
      <Features />
      <ServiceBlock />
      <Footer />
    </main>
  )
}
