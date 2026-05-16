"use client"

import { use, useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Check, Clock, Truck, ShoppingBag, CheckCircle2, Package, MessageSquare, AlertCircle, Send, CreditCard, ExternalLink, Plus, Calculator, Sparkles, AlertTriangle, User } from "lucide-react"

const statusLabels: Record<string, string> = {
  received: "Получена",
  searching: "В поиске",
  found: "Найдены варианты",
  awaiting_confirmation: "Ожидает подтверждение",
  pending: "Ожидает оплату",
  purchased: "Выкуплено",
  shipping: "В пути",
  delivered: "Доставлено",
  cancelled: "Отменено",
}

const progressSteps = [
  { id: 1, status: "received", name: "Получена" },
  { id: 2, status: "searching", name: "В поиске" },
  { id: 3, status: "found", name: "Найдены варианты" },
  { id: 4, status: "awaiting_confirmation", name: "Ожидает подтверждение" },
  { id: 5, status: "pending", name: "Ожидает оплату" },
  { id: 6, status: "purchased", name: "Выкуплено" },
  { id: 7, status: "shipping", name: "В пути" },
  { id: 8, status: "delivered", name: "Доставлено" },
]

type FoundOption = {
  id: number
  source: string
  country: string
  price: string
  oldPrice: string
  delivery: string
  savings: number
  recommended?: boolean
  comment?: string
}

type Message = {
  id: number
  from: "inner" | "client"
  text: string
  time: string
}

type RequestType = {
  id: string
  name: string
  image: string
  images?: string[]
  size: string
  budget: string
  city: string
  date: string
  status: string
  link?: string
  contactMethod?: string
  contactValue?: string
  comment?: string
  adminComment?: string
  foundOptions?: FoundOption[]
  selectedOption?: number
  messages?: Message[]
  statusHistory?: Array<{
    status: string
    statusCode?: string
    time: string
    date: string
    description?: string
  }>
}

export default function RequestDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [request, setRequest] = useState<RequestType | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [newMessage, setNewMessage] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [aiMessages, setAiMessages] = useState<Array<{ id: number; from: "user" | "assistant"; text: string; time: string }>>([])
  const [aiInput, setAiInput] = useState("")
  const [aiTyping, setAiTyping] = useState(false)
  const [aiError, setAiError] = useState(false)

  useEffect(() => {
    const loadRequest = () => {
      const savedRequests = localStorage.getItem("inner_requests")
      if (savedRequests) {
        const requests = JSON.parse(savedRequests)
        const found = requests.find((r: RequestType) => r.id === id)
        if (found) {
          setRequest(found)
          if (found.selectedOption) {
            setSelectedOption(found.selectedOption)
          }
          // Load messages or create default
          if (found.messages) {
            setMessages(found.messages)
          } else if (found.adminComment) {
            setMessages([
              { id: 1, from: "inner", text: found.adminComment, time: "10:00" }
            ])
          }
        }
      }
      setLoading(false)
    }
    
    loadRequest()
    
    const interval = setInterval(loadRequest, 2000)
    return () => clearInterval(interval)
  }, [id])

  const handleSelectOption = (optionId: number) => {
    setSelectedOption(optionId)
  }

  const handleConfirmSelection = () => {
    if (!selectedOption || !request) return
    
    const savedRequests = JSON.parse(localStorage.getItem("inner_requests") || "[]")
    const now = new Date()
    const timeStr = now.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })
    const selectedOpt = request.foundOptions?.find(o => o.id === selectedOption)
    
    const updatedRequests = savedRequests.map((r: RequestType) => {
      if (r.id === id) {
        return {
          ...r,
          status: "pending",
          selectedOption: selectedOption,
          statusHistory: [
            {
              status: "Ожидает оплату",
              statusCode: "pending",
              time: timeStr,
              date: "Сегодня",
              description: `Выбран вариант: ${selectedOpt?.source}, ${selectedOpt?.price} ₽`
            },
            ...(r.statusHistory || [])
          ]
        }
      }
      return r
    })
    
    localStorage.setItem("inner_requests", JSON.stringify(updatedRequests))
    
    setRequest(prev => prev ? {
      ...prev,
      status: "pending",
      selectedOption: selectedOption
    } : null)
  }

  const handleSendMessage = () => {
    if (!newMessage.trim() || !request) return
    
    const now = new Date()
    const timeStr = now.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })
    
    const newMsg: Message = {
      id: messages.length + 1,
      from: "client",
      text: newMessage.trim(),
      time: timeStr
    }
    
    const updatedMessages = [...messages, newMsg]
    setMessages(updatedMessages)
    setNewMessage("")
    
    // Save to localStorage
    const savedRequests = JSON.parse(localStorage.getItem("inner_requests") || "[]")
    const updatedRequests = savedRequests.map((r: RequestType) => {
      if (r.id === id) {
        return { ...r, messages: updatedMessages }
      }
      return r
    })
    localStorage.setItem("inner_requests", JSON.stringify(updatedRequests))
  }

  const handleMarkPaid = () => {
    if (!request) return
    
    const now = new Date()
    const timeStr = now.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })
    
    const savedRequests = JSON.parse(localStorage.getItem("inner_requests") || "[]")
    const updatedRequests = savedRequests.map((r: RequestType) => {
      if (r.id === id) {
        return {
          ...r,
          status: "purchased",
          statusHistory: [
            {
              status: "Оплата подтверждена",
              statusCode: "purchased",
              time: timeStr,
              date: "Сегодня",
              description: "Клиент подтвердил оплату"
            },
            ...(r.statusHistory || [])
          ]
        }
      }
      return r
    })
    
    localStorage.setItem("inner_requests", JSON.stringify(updatedRequests))
    setRequest(prev => prev ? { ...prev, status: "purchased" } : null)
  }

  // AI Assistant functions
  const aiQuickButtons = [
    "Что с заявкой?",
    "Когда доставка?",
    "Почему такая цена?",
    "Можно дешевле?",
    "Как выбрать?",
  ]

  const getRequestContext = () => {
    if (!request) return undefined
    
    const selectedOpt = request.foundOptions?.find(o => o.id === request.selectedOption)
    
    return {
      id: request.id,
      name: request.name,
      size: request.size,
      budget: request.budget,
      city: request.city,
      status: request.status,
      statusLabel: statusLabels[request.status] || request.status,
      selectedOption: selectedOpt ? {
        source: selectedOpt.source,
        country: selectedOpt.country,
        price: selectedOpt.price,
        delivery: selectedOpt.delivery
      } : undefined,
      foundOptions: request.foundOptions?.map(o => ({
        source: o.source,
        country: o.country,
        price: o.price,
        delivery: o.delivery,
        recommended: o.recommended
      })),
      adminComment: request.adminComment,
      statusHistory: request.statusHistory?.slice(0, 5)
    }
  }

  const fetchAiResponse = async (userText: string) => {
    setAiTyping(true)
    setAiError(false)
    
    try {
      const conversationHistory = aiMessages.slice(-10).map(m => ({
        role: m.from as "user" | "assistant",
        content: m.text
      }))
      conversationHistory.push({ role: "user", content: userText })

      const response = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: conversationHistory,
          requestContext: getRequestContext()
        })
      })

      if (!response.ok) throw new Error("Failed")

      const data = await response.json()
      if (data.error) throw new Error(data.error)

      const responseTime = new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })
      setAiMessages(prev => [...prev, { id: Date.now(), from: "assistant", text: data.response, time: responseTime }])
    } catch {
      setAiError(true)
      const responseTime = new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })
      setAiMessages(prev => [...prev, { 
        id: Date.now(), 
        from: "assistant", 
        text: "Сейчас не получилось получить ответ. Напишите менеджеру в Telegram: @inner_support", 
        time: responseTime 
      }])
    } finally {
      setAiTyping(false)
    }
  }

  const handleAiQuickButton = (text: string) => {
    const now = new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })
    setAiMessages(prev => [...prev, { id: Date.now(), from: "user", text, time: now }])
    fetchAiResponse(text)
  }

  const handleAiSend = () => {
    if (!aiInput.trim() || aiTyping) return
    
    const userText = aiInput.trim()
    const now = new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })
    setAiMessages(prev => [...prev, { id: Date.now(), from: "user", text: userText, time: now }])
    setAiInput("")
    fetchAiResponse(userText)
  }

  const getStepStatus = (stepStatus: string) => {
    if (!request) return { completed: false, active: false }
    
    const currentIndex = progressSteps.findIndex(s => s.status === request.status)
    const stepIndex = progressSteps.findIndex(s => s.status === stepStatus)
    
    if (request.status === "cancelled") {
      return { completed: false, active: false, cancelled: true }
    }
    
    return {
      completed: stepIndex < currentIndex,
      active: stepIndex === currentIndex
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-foreground border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Загрузка...</p>
        </div>
      </div>
    )
  }

  if (!request) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-[800px] mx-auto px-5 sm:px-6 py-8">
          <div className="bg-card border border-border rounded-3xl p-8 text-center">
            <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
            <h1 className="text-2xl font-semibold text-foreground mb-2">Заявка не найдена</h1>
            <p className="text-muted-foreground mb-6">Заявка #{id} не существует или была удалена</p>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Назад в кабинет
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const selectedOptionData = request.foundOptions?.find(o => o.id === selectedOption || o.id === request.selectedOption)
  const hasOptions = request.foundOptions && request.foundOptions.length > 0
  const canSelectOption = hasOptions && !request.selectedOption && ["found", "awaiting_confirmation"].includes(request.status)
  const isPending = request.status === "pending"

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[1200px] mx-auto px-5 sm:px-6 py-8">
        <Link 
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Назад к заявкам
        </Link>

        {/* Header */}
        <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 mb-6">
          <div className="flex items-start justify-between gap-4 flex-wrap mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-semibold text-foreground">Заявка #{request.id}</h1>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-full ${
                  request.status === "cancelled" ? "bg-destructive/10 text-destructive" :
                  request.status === "delivered" ? "bg-[#16A34A]/10 text-[#16A34A]" :
                  request.status === "pending" ? "bg-[#F59E0B]/10 text-[#F59E0B]" :
                  request.status === "found" || request.status === "awaiting_confirmation" ? "bg-[#16A34A]/10 text-[#16A34A]" :
                  "bg-[#2563EB]/10 text-[#2563EB]"
                }`}>
                  {request.status === "cancelled" ? <AlertCircle className="w-4 h-4" /> :
                   request.status === "delivered" ? <Check className="w-4 h-4" /> :
                   request.status === "shipping" ? <Truck className="w-4 h-4" /> :
                   <Clock className="w-4 h-4" />}
                  {statusLabels[request.status] || request.status}
                </span>
              </div>
              <p className="text-muted-foreground">Создана {request.date}</p>
            </div>
          </div>

          {/* Progress Tracker */}
          {request.status !== "cancelled" && (
            <div className="relative overflow-x-auto pb-2">
              <div className="flex items-center justify-between min-w-[600px]">
                {progressSteps.map((step, index) => {
                  const { completed, active } = getStepStatus(step.status)
                  
                  return (
                    <div key={step.id} className="flex flex-col items-center relative flex-1">
                      {index < progressSteps.length - 1 && (
                        <div 
                          className={`absolute top-4 left-1/2 w-full h-0.5 ${
                            completed ? "bg-[#16A34A]" : "bg-border"
                          }`}
                        />
                      )}
                      
                      <div 
                        className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                          completed 
                            ? "bg-[#16A34A] text-primary-foreground" 
                            : active 
                              ? "bg-[#2563EB] text-primary-foreground ring-4 ring-[#2563EB]/20"
                              : "bg-secondary text-muted-foreground"
                        }`}
                      >
                        {completed ? <Check className="w-4 h-4" /> : step.id}
                      </div>
                      
                      <span className={`mt-2 text-[10px] sm:text-xs text-center leading-tight max-w-[60px] sm:max-w-[80px] ${
                        completed || active ? "text-foreground font-medium" : "text-muted-foreground"
                      }`}>
                        {step.name}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Payment Block - показывается когда статус pending */}
            {isPending && selectedOptionData && (
              <div className="bg-[#F59E0B]/10 border-2 border-[#F59E0B] rounded-3xl p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-[#F59E0B]/20 flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-[#F59E0B]" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">Ожидает оплату</h2>
                    <p className="text-sm text-muted-foreground">Оплатите заказ для начала выкупа</p>
                  </div>
                </div>

                <div className="bg-card rounded-2xl p-5 mb-5">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-16 h-16 rounded-xl bg-background overflow-hidden flex-shrink-0">
                      {request.image ? (
                        <img src={request.image} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-6 h-6 text-placeholder" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">{request.name}</h3>
                      <p className="text-sm text-muted-foreground">{selectedOptionData.source}, {selectedOptionData.country}</p>
                    </div>
                  </div>

                  <div className="space-y-3 border-t border-border pt-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Сумма к оплате</span>
                      <span className="text-xl font-bold text-foreground">{selectedOptionData.price} ₽</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Срок доставки</span>
                      <span className="text-foreground">{selectedOptionData.delivery}</span>
                    </div>
                    {request.adminComment && (
                      <div className="pt-3 border-t border-border">
                        <p className="text-sm text-muted-foreground">
                          <span className="font-medium text-foreground">Комментарий INNER:</span> {request.adminComment}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href="https://t.me/inner_support"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 border border-border bg-card text-foreground rounded-xl text-sm font-medium hover:bg-background transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Связаться с менеджером
                  </a>
                  <button
                    onClick={handleMarkPaid}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#16A34A] text-primary-foreground rounded-xl text-sm font-medium hover:bg-[#15803d] transition-colors"
                  >
                    <Check className="w-4 h-4" />
                    Я оплатил
                  </button>
                </div>
              </div>
            )}

            {/* Product Info */}
            <div className="bg-card border border-border rounded-3xl p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Информация о товаре</h2>
              <div className="flex gap-5">
                <div className="w-28 h-28 rounded-2xl overflow-hidden bg-background flex-shrink-0">
                  {request.image ? (
                    <img src={request.image} alt={request.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-8 h-8 text-placeholder" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground mb-3">{request.name}</h3>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Размер:</span>
                      <span className="text-foreground font-medium">{request.size}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Бюджет:</span>
                      <span className="text-foreground font-medium">{request.budget}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Город:</span>
                      <span className="text-foreground font-medium">{request.city}</span>
                    </div>
                    {request.link && (
                      <div className="flex items-center gap-2 col-span-2">
                        <span className="text-muted-foreground">Ссылка:</span>
                        <a href={request.link} target="_blank" rel="noopener noreferrer" className="text-[#2563EB] hover:underline truncate">
                          {request.link}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Messages / Chat */}
            <div className="bg-card border border-border rounded-3xl p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Сообщения по заявке</h2>
              
              <div className="space-y-4 mb-4 max-h-[300px] overflow-y-auto">
                {messages.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">Пока нет сообщений</p>
                ) : (
                  messages.map((msg) => (
                    <div 
                      key={msg.id} 
                      className={`flex ${msg.from === "client" ? "justify-end" : "justify-start"}`}
                    >
                      <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        msg.from === "client" 
                          ? "bg-primary text-primary-foreground" 
                          : "bg-background text-foreground"
                      }`}>
                        <p className="text-sm">{msg.text}</p>
                        <span className={`text-[10px] mt-1 block ${
                          msg.from === "client" ? "text-primary-foreground/60" : "text-muted-foreground"
                        }`}>
                          {msg.from === "inner" ? "INNER" : "Вы"} · {msg.time}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
              
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Написать сообщение..."
                  className="flex-1 px-4 py-3 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/10"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="px-4 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* How Price is Formed */}
            <div className="bg-card border border-border rounded-3xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                  <Calculator className="w-5 h-5 text-foreground" />
                </div>
                <h2 className="text-lg font-semibold text-foreground">Как формируется цена</h2>
              </div>
              
              <div className="bg-background rounded-2xl p-5">
                <div className="flex flex-wrap items-center justify-center gap-2 text-sm">
                  <span className="px-3 py-2 bg-card rounded-lg font-medium text-foreground">Цена товара</span>
                  <Plus className="w-4 h-4 text-muted-foreground" />
                  <span className="px-3 py-2 bg-card rounded-lg font-medium text-foreground">Доставка</span>
                  <Plus className="w-4 h-4 text-muted-foreground" />
                  <span className="px-3 py-2 bg-card rounded-lg font-medium text-foreground">Комиссия</span>
                  <Plus className="w-4 h-4 text-muted-foreground" />
                  <span className="px-3 py-2 bg-card rounded-lg font-medium text-foreground">Пошлины*</span>
                  <span className="text-muted-foreground">=</span>
                  <span className="px-3 py-2 bg-[#16A34A] text-primary-foreground rounded-lg font-semibold">Финальная цена</span>
                </div>
                <p className="text-xs text-muted-foreground text-center mt-4">
                  * Пошлины включаются при стоимости товара свыше лимита беспошлинного ввоза
                </p>
              </div>
              
              <p className="text-sm text-muted-foreground mt-4">
                Вы знаете финальную стоимость до оплаты. Никаких скрытых платежей.
              </p>
            </div>

            {/* Status History */}
            {request.statusHistory && request.statusHistory.length > 0 && (
              <div className="bg-card border border-border rounded-3xl p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">История статусов</h2>
                <div className="space-y-4">
                  {request.statusHistory.map((item, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-3 h-3 rounded-full ${
                          index === 0 
                            ? item.statusCode === "cancelled" ? "bg-destructive" : "bg-[#16A34A]"
                            : "bg-border"
                        }`} />
                        {index < request.statusHistory!.length - 1 && (
                          <div className="w-0.5 h-full bg-border mt-2" />
                        )}
                      </div>
                      <div className="pb-4">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-foreground">{item.status}</span>
                          <span className="text-xs text-muted-foreground">{item.date} {item.time}</span>
                        </div>
                        {item.description && (
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Found Options */}
            {hasOptions && canSelectOption && (
              <div className="bg-card border border-border rounded-3xl p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-lg font-semibold text-foreground">Найденные варианты</h2>
                  <span className="text-sm text-muted-foreground">{request.foundOptions!.length} предложения</span>
                </div>
                <div className="space-y-4">
                  {request.foundOptions!.map((option) => (
                    <div 
                      key={option.id}
                      className={`flex flex-col sm:flex-row sm:items-center gap-4 p-5 rounded-2xl border transition-all cursor-pointer ${
                        selectedOption === option.id
                          ? "border-foreground bg-background ring-2 ring-primary/10"
                          : option.recommended 
                            ? "border-[#16A34A] bg-[#16A34A]/5" 
                            : "border-border-soft bg-card-soft hover:border-border"
                      }`}
                      onClick={() => handleSelectOption(option.id)}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-base font-semibold text-foreground">{option.source}</h3>
                          {option.recommended && (
                            <span className="px-2 py-0.5 bg-[#16A34A] text-primary-foreground text-[10px] font-semibold rounded">
                              Лучшая цена
                            </span>
                          )}
                          {selectedOption === option.id && (
                            <span className="px-2 py-0.5 bg-primary text-primary-foreground text-[10px] font-semibold rounded flex items-center gap-1">
                              <Check className="w-3 h-3" /> Выбран
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{option.country}</p>
                        <div className="flex items-baseline gap-2">
                          <span className="text-xl font-bold text-foreground">{option.price} ₽</span>
                          {option.oldPrice && (
                            <>
                              <span className="text-sm text-muted-foreground line-through">{option.oldPrice} ₽</span>
                              <span className="text-sm font-semibold text-[#16A34A]">-{option.savings}%</span>
                            </>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                          <Truck className="w-4 h-4" />
                          Доставка {option.delivery}
                        </div>
                      </div>
                      <button 
                        className={`px-6 py-3 text-sm font-medium rounded-xl transition-colors w-full sm:w-auto ${
                          selectedOption === option.id
                            ? "bg-primary text-primary-foreground"
                            : option.recommended 
                              ? "bg-[#16A34A] hover:bg-[#15803d] text-primary-foreground"
                              : "bg-secondary hover:bg-border text-foreground"
                        }`}
                        onClick={(e) => {
                          e.stopPropagation()
                          handleSelectOption(option.id)
                        }}
                      >
                        {selectedOption === option.id ? "Выбран" : "Выбрать"}
                      </button>
                    </div>
                  ))}
                </div>

                {selectedOption && (
                  <div className="mt-6 pt-6 border-t border-border">
                    <button
                      onClick={handleConfirmSelection}
                      className="w-full py-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl text-base font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 className="w-5 h-5" />
                      Подтвердить выбор
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column - AI Assistant + Summary */}
          <div className="space-y-6">
            {/* AI Assistant */}
            <div className="bg-card border border-border rounded-3xl overflow-hidden">
              <div className="bg-primary p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-card/10 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h2 className="text-primary-foreground font-semibold">Помощник INNER</h2>
                    <p className="text-primary-foreground/60 text-xs">Отвечу по этой заявке</p>
                  </div>
                </div>
              </div>
              
              {/* AI Warning */}
              <div className="bg-[#F59E0B]/10 px-4 py-3 border-b border-[#F59E0B]/20">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-[#F59E0B] flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-warning">
                    AI-помощник помогает с информацией. Финальную цену и условия подтверждает менеджер.
                  </p>
                </div>
              </div>
              
              {/* AI Context */}
              <div className="px-4 py-3 bg-card-soft border-b border-border">
                <p className="text-xs text-muted-foreground">
                  Знаю о заявке: {request.name}, размер {request.size}, бюджет {request.budget}, город {request.city}, статус "{statusLabels[request.status]}"
                  {hasOptions && `, ${request.foundOptions!.length} вариант(а)`}
                </p>
              </div>
              
              {/* AI Messages */}
              <div className="h-[200px] overflow-y-auto p-4 space-y-3">
                {aiMessages.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-4">Выберите вопрос или напишите свой</p>
                ) : (
                  aiMessages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
                      <div className={`flex items-end gap-1.5 max-w-[85%] ${msg.from === "user" ? "flex-row-reverse" : ""}`}>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                          msg.from === "user" ? "bg-primary" : "bg-secondary"
                        }`}>
                          {msg.from === "user" ? (
                            <User className="w-3 h-3 text-primary-foreground" />
                          ) : (
                            <Sparkles className="w-3 h-3 text-foreground" />
                          )}
                        </div>
                        <div className={`rounded-xl px-3 py-2 ${
                          msg.from === "user" ? "bg-primary text-primary-foreground" : "bg-background text-foreground"
                        }`}>
                          <p className="text-xs whitespace-pre-wrap">{msg.text}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
                {aiTyping && (
                  <div className="flex justify-start">
                    <div className="flex items-end gap-1.5">
                      <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center">
                        <Sparkles className="w-3 h-3 text-foreground" />
                      </div>
                      <div className="bg-background rounded-xl px-3 py-2">
                        <div className="flex gap-1">
                          <span className="w-1.5 h-1.5 bg-placeholder rounded-full animate-bounce" />
                          <span className="w-1.5 h-1.5 bg-placeholder rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                          <span className="w-1.5 h-1.5 bg-placeholder rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* AI Quick Buttons */}
              <div className="px-4 py-3 border-t border-border">
                <div className="flex flex-wrap gap-1.5">
                  {aiQuickButtons.map((btn) => (
                    <button
                      key={btn}
                      onClick={() => handleAiQuickButton(btn)}
                      disabled={aiTyping}
                      className="px-2.5 py-1.5 bg-background hover:bg-secondary text-xs text-foreground rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {btn}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* AI Input */}
              <div className="p-3 border-t border-border">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={aiInput}
                    onChange={(e) => setAiInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleAiSend()}
                    placeholder="Ваш вопрос..."
                    disabled={aiTyping}
                    className="flex-1 px-3 py-2 bg-background border border-border rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-primary/10 disabled:opacity-50"
                  />
                  <button
                    onClick={handleAiSend}
                    disabled={!aiInput.trim() || aiTyping}
                    className="px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              {/* Manager Link */}
              <div className="px-4 py-3 border-t border-border bg-card-soft">
                <a
                  href="https://t.me/inner_support"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full px-3 py-2 border border-border bg-card hover:bg-background rounded-lg text-xs font-medium text-foreground transition-colors"
                >
                  <ExternalLink className="w-3 h-3" />
                  Передать вопрос менеджеру
                </a>
              </div>
            </div>

            {/* Summary */}
            <div className="bg-card border border-border rounded-3xl p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Сводка</h2>
              
              {hasOptions && (
                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between py-3 border-b border-border">
                    <span className="text-muted-foreground">Лучшая цена</span>
                    <span className="text-lg font-semibold text-foreground">
                      {request.foundOptions![0].price} ₽
                    </span>
                  </div>
                  {request.foundOptions![0].oldPrice && (
                    <>
                      <div className="flex items-center justify-between py-3 border-b border-border">
                        <span className="text-muted-foreground">Розничная цена</span>
                        <span className="text-muted-foreground line-through">{request.foundOptions![0].oldPrice} ₽</span>
                      </div>
                      <div className="flex items-center justify-between py-3">
                        <span className="text-muted-foreground">Экономия</span>
                        <span className="text-lg font-semibold text-[#16A34A]">
                          {request.foundOptions![0].savings}%
                        </span>
                      </div>
                    </>
                  )}
                </div>
              )}

              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Truck className="w-5 h-5" />
                  Доставка {hasOptions ? request.foundOptions![0].delivery : "7–14 дней"}
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Check className="w-5 h-5 text-[#16A34A]" />
                  Проверка подлинности
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <ShoppingBag className="w-5 h-5" />
                  Полное сопровождение
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-border">
                <Link
                  href="/terms"
                  className="text-sm text-[#2563EB] hover:underline flex items-center gap-1"
                >
                  Условия сервиса
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
