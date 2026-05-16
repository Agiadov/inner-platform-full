"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { Header } from "@/components/inner/header"
import { Footer } from "@/components/inner/footer"
import { ArrowLeft, Send, Sparkles, AlertTriangle, ExternalLink, User, RefreshCw } from "lucide-react"

type Message = {
  id: number
  from: "user" | "assistant"
  text: string
  time: string
}

const quickButtons = [
  "Как работает INNER?",
  "Какие сроки доставки?",
  "Как формируется цена?",
  "Как проверяете подлинность?",
  "Что если вещь не подойдёт?",
  "Связать с менеджером",
]

export default function SupportPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      from: "assistant",
      text: "Здравствуйте! Я помощник INNER. Помогу разобраться с сервисом, заявками и ценами. Выберите вопрос ниже или напишите свой.",
      time: new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })
    }
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const addMessage = (text: string, from: "user" | "assistant") => {
    const newMessage: Message = {
      id: Date.now(),
      from,
      text,
      time: new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })
    }
    setMessages(prev => [...prev, newMessage])
    return newMessage
  }

  const fetchAIResponse = async (userText: string) => {
    setIsLoading(true)
    setError(null)
    
    try {
      // Get conversation history for context (last 10 messages)
      const conversationHistory = messages
        .filter(m => m.id !== 1) // Exclude greeting
        .slice(-10)
        .map(m => ({
          role: m.from as "user" | "assistant",
          content: m.text
        }))
      
      conversationHistory.push({ role: "user", content: userText })

      const response = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          messages: conversationHistory
        })
      })

      if (!response.ok) {
        throw new Error("Failed to get response")
      }

      const data = await response.json()
      
      if (data.error) {
        throw new Error(data.error)
      }

      addMessage(data.response, "assistant")
    } catch (err) {
      console.error("AI Support error:", err)
      setError("Сейчас не получилось получить ответ. Я могу передать вопрос менеджеру INNER.")
      addMessage(
        "Сейчас не получилось получить ответ. Напишите менеджеру в Telegram: @inner_support — он поможет с вашим вопросом.",
        "assistant"
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickButton = (buttonText: string) => {
    addMessage(buttonText, "user")
    fetchAIResponse(buttonText)
  }

  const handleSend = () => {
    if (!input.trim() || isLoading) return
    
    const userText = input.trim()
    addMessage(userText, "user")
    setInput("")
    fetchAIResponse(userText)
  }

  const handleRetry = () => {
    const lastUserMessage = [...messages].reverse().find(m => m.from === "user")
    if (lastUserMessage) {
      setError(null)
      fetchAIResponse(lastUserMessage.text)
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />
      
      <div className="max-w-[800px] mx-auto px-5 sm:px-6 py-8 pt-24">
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          На главную
        </Link>

        <div className="bg-card border border-border rounded-3xl overflow-hidden">
          {/* Header */}
          <div className="bg-primary p-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-card/10 flex items-center justify-center">
                <Sparkles className="w-7 h-7 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-primary-foreground">Помощник INNER</h1>
                <p className="text-primary-foreground/60">Отвечу на вопросы по сервису и заявкам</p>
              </div>
            </div>
          </div>

          {/* Warning */}
          <div className="bg-[#F59E0B]/10 border-b border-[#F59E0B]/20 px-6 py-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-[#F59E0B] flex-shrink-0 mt-0.5" />
              <p className="text-sm text-warning">
                AI-помощник помогает с информацией по сервису. Финальную цену, наличие и условия выкупа подтверждает менеджер INNER.
              </p>
            </div>
          </div>

          {/* Messages */}
          <div className="h-[400px] overflow-y-auto p-6 space-y-4">
            {messages.map((msg) => (
              <div 
                key={msg.id}
                className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`flex items-end gap-2 max-w-[80%] ${msg.from === "user" ? "flex-row-reverse" : ""}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    msg.from === "user" ? "bg-primary" : "bg-secondary"
                  }`}>
                    {msg.from === "user" ? (
                      <User className="w-4 h-4 text-primary-foreground" />
                    ) : (
                      <Sparkles className="w-4 h-4 text-foreground" />
                    )}
                  </div>
                  <div className={`rounded-2xl px-4 py-3 ${
                    msg.from === "user" 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-background text-foreground"
                  }`}>
                    <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                    <span className={`text-[10px] mt-1 block ${
                      msg.from === "user" ? "text-primary-foreground/50" : "text-placeholder"
                    }`}>
                      {msg.time}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-end gap-2">
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-foreground" />
                  </div>
                  <div className="bg-background rounded-2xl px-4 py-3">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-placeholder rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-2 h-2 bg-placeholder rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-2 h-2 bg-placeholder rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="flex justify-center">
                <button
                  onClick={handleRetry}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-background hover:bg-secondary text-sm text-foreground rounded-xl transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Попробовать снова
                </button>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Buttons */}
          <div className="border-t border-border px-6 py-4">
            <div className="flex flex-wrap gap-2">
              {quickButtons.map((buttonText, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickButton(buttonText)}
                  disabled={isLoading}
                  className="px-3 py-2 bg-background hover:bg-secondary text-sm text-foreground rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {buttonText}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="border-t border-border p-4">
            <div className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                placeholder="Напишите вопрос..."
                disabled={isLoading}
                className="flex-1 px-4 py-3 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/10 disabled:opacity-50"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="px-4 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Manager Link */}
          <div className="border-t border-border px-6 py-4 bg-card-soft">
            <a
              href="https://t.me/inner_support"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full px-4 py-3 border border-border bg-card hover:bg-background rounded-xl text-sm font-medium text-foreground transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Передать вопрос менеджеру
            </a>
          </div>
        </div>
      </div>
      
      <Footer />
    </main>
  )
}
