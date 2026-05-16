import { Header } from "./header"
import { Footer } from "./footer"

interface PageLayoutProps {
  children: React.ReactNode
}

export function PageLayout({ children }: PageLayoutProps) {
  return (
    <main className="min-h-screen bg-card">
      <Header />
      <div className="pt-16">
        {children}
      </div>
      <Footer />
    </main>
  )
}
