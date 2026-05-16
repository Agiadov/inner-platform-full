"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X, User } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

const navLinks = [
  { name: "Услуги", href: "/services" },
  { name: "Как это работает", href: "/how-it-works" },
  { name: "О нас", href: "/about" },
  { name: "FAQ", href: "/faq" },
]

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => { document.body.style.overflow = "" }
  }, [isMobileMenuOpen])

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div 
        className={`transition-all duration-200 ${
          isScrolled 
            ? "bg-card/95 backdrop-blur-md shadow-sm border-b border-border" 
            : "bg-background"
        }`}
      >
        <nav className="max-w-[1200px] mx-auto px-5 sm:px-6">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">IN</span>
              </div>
              <span className="text-xl font-semibold text-foreground tracking-tight">
                INNER
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Desktop Right */}
            <div className="hidden lg:flex items-center gap-3">
              <ThemeToggle />
              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <User className="w-4 h-4" />
                Войти
              </Link>
              <Link
                href="/request"
                className="flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl text-sm font-medium transition-colors"
              >
                Отправить заявку
              </Link>
            </div>

            {/* Mobile Right */}
            <div className="flex lg:hidden items-center gap-2">
              <Link
                href="/dashboard"
                className="p-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <User className="w-5 h-5" />
              </Link>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </nav>
      </div>
      
      {/* Mobile Menu */}
      <div
        className={`lg:hidden fixed inset-0 top-16 z-40 bg-card transition-all duration-300 ${
          isMobileMenuOpen 
            ? "opacity-100 pointer-events-auto" 
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-col h-full px-5 py-6 border-t border-border">
          <div className="flex-1 flex flex-col">
            {navLinks.map((link, i) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`py-4 text-base font-medium text-foreground border-b border-border transition-all duration-300 ${
                  isMobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
                style={{ transitionDelay: isMobileMenuOpen ? `${i * 50}ms` : "0ms" }}
              >
                {link.name}
              </Link>
            ))}
          </div>
          
          <div 
            className={`pt-6 flex flex-col gap-3 transition-all duration-300 ${
              isMobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: isMobileMenuOpen ? "200ms" : "0ms" }}
          >
            <div className="flex items-center justify-between px-1 py-2">
              <span className="text-sm text-muted-foreground">Тема</span>
              <ThemeToggle />
            </div>
            <Link
              href="/request"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-center w-full py-4 text-base font-medium bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl transition-colors"
            >
              Отправить заявку
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
