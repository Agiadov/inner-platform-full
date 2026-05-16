"use client"

import Link from "next/link"
import { Send } from "lucide-react"

const footerLinks = {
  "Навигация": [
    { name: "Услуги", href: "/services" },
    { name: "Как это работает", href: "/how-it-works" },
    { name: "О нас", href: "/about" },
    { name: "FAQ", href: "/faq" },
  ],
  "Контакты": [
    { name: "Telegram", href: "https://t.me/innerlabel" },
    { name: "support@inner.ru", href: "mailto:support@inner.ru" },
  ],
}

export function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-[1200px] mx-auto px-5 sm:px-6">
        {/* Main Footer */}
        <div className="py-12 sm:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Brand */}
            <div className="lg:col-span-2">
              <Link href="/" className="inline-flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">IN</span>
                </div>
                <span className="text-xl font-semibold text-foreground">INNER</span>
              </Link>
              <p className="text-sm text-muted-foreground mb-6 max-w-sm leading-relaxed">
                Персональный шопинг-сервис. Найдём брендовую вещь по фото или ссылке, проверим подлинность и доставим.
              </p>
              <Link
                href="https://t.me/innerlabel"
                target="_blank"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl text-sm font-medium transition-colors"
              >
                <Send className="w-4 h-4" />
                Telegram
              </Link>
            </div>

            {/* Links */}
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title}>
                <h3 className="text-sm font-semibold text-foreground mb-4">{title}</h3>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        target={link.href.startsWith("http") ? "_blank" : undefined}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="py-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} INNER. Все права защищены.
          </p>
          <p className="text-sm text-muted-foreground">
            Москва, Россия
          </p>
        </div>
      </div>
    </footer>
  )
}
