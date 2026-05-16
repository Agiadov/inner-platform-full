"use client"

import { useState } from "react"
import Link from "next/link"
import { MessageCircle, X, Sparkles, ArrowRight } from "lucide-react"

export function AISupportButton() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary/90 transition-all flex items-center justify-center group"
        aria-label="Спросить INNER"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageCircle className="w-6 h-6" />
        )}
      </button>

      {/* Popup */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 left-4 sm:left-auto sm:right-6 z-50 sm:w-[320px] bg-card rounded-2xl shadow-xl border border-border overflow-hidden">
          <div className="bg-primary p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-card/10 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-primary-foreground font-semibold">Помощник INNER</h3>
                <p className="text-primary-foreground/60 text-sm">Отвечу на вопросы по сервису</p>
              </div>
            </div>
          </div>
          
          <div className="p-4">
            <p className="text-sm text-muted-foreground mb-4">
              Помогу разобраться с заявкой, ценой или статусом заказа.
            </p>
            
            <div className="space-y-2">
              <Link
                href="/support"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between w-full px-4 py-3 bg-background hover:bg-secondary rounded-xl text-sm font-medium text-foreground transition-colors"
              >
                <span>Открыть помощника</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              
              <a
                href="https://t.me/inner_support"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between w-full px-4 py-3 border border-border hover:bg-background rounded-xl text-sm font-medium text-muted-foreground transition-colors"
              >
                <span>Связаться с менеджером</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
            
            <p className="text-[10px] text-placeholder mt-4 text-center">
              AI-помощник не заменяет менеджера
            </p>
          </div>
        </div>
      )}
    </>
  )
}
