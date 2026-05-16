"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, Check, Clock, Truck, X as XIcon, Eye, Package, AlertCircle } from "lucide-react"

const filters = [
  { name: "Все", value: "all" },
  { name: "Получена", value: "received" },
  { name: "В поиске", value: "searching" },
  { name: "Найдены", value: "found" },
  { name: "Ожидает", value: "awaiting_confirmation" },
  { name: "Оплата", value: "pending" },
  { name: "Выкуплено", value: "purchased" },
  { name: "В пути", value: "shipping" },
  { name: "Доставлено", value: "delivered" },
]

const statusLabels: Record<string, { label: string; color: string; bgColor: string; icon: typeof Check }> = {
  received: { label: "Получена", color: "var(--muted-foreground)", bgColor: "#6B7280", icon: Package },
  searching: { label: "В поиске", color: "#2563EB", bgColor: "#2563EB", icon: Clock },
  found: { label: "Найдены варианты", color: "#16A34A", bgColor: "#16A34A", icon: Check },
  awaiting_confirmation: { label: "Ожидает подтверждение", color: "#F59E0B", bgColor: "#F59E0B", icon: AlertCircle },
  pending: { label: "Ожидает оплату", color: "#F59E0B", bgColor: "#F59E0B", icon: Clock },
  purchased: { label: "Выкуплено", color: "#16A34A", bgColor: "#16A34A", icon: Check },
  shipping: { label: "В пути", color: "#2563EB", bgColor: "#2563EB", icon: Truck },
  delivered: { label: "Доставлено", color: "#16A34A", bgColor: "#16A34A", icon: Check },
  cancelled: { label: "Отменено", color: "#EF4444", bgColor: "#EF4444", icon: XIcon },
}

const getStatusBadge = (status: string) => {
  const config = statusLabels[status]
  if (!config) return null
  const Icon = config.icon
  return (
    <span 
      className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full"
      style={{ backgroundColor: `${config.bgColor}15`, color: config.color }}
    >
      <Icon className="w-3 h-3" />
      {config.label}
    </span>
  )
}

type RequestType = {
  id: string
  name: string
  image: string
  size: string
  budget: string
  city: string
  date: string
  status: string
}

export default function DashboardPage() {
  const [activeFilter, setActiveFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [requests, setRequests] = useState<RequestType[]>([])

  useEffect(() => {
    const loadRequests = () => {
      const savedRequests = localStorage.getItem("inner_requests")
      if (savedRequests) {
        setRequests(JSON.parse(savedRequests))
      }
    }
    
    loadRequests()
    
    // Listen for storage changes
    const handleStorage = () => loadRequests()
    window.addEventListener("storage", handleStorage)
    
    // Refresh every 2 seconds to catch admin changes
    const interval = setInterval(loadRequests, 2000)
    
    return () => {
      window.removeEventListener("storage", handleStorage)
      clearInterval(interval)
    }
  }, [])

  const filteredRequests = requests.filter(req => {
    if (activeFilter !== "all" && req.status !== activeFilter) return false
    if (searchQuery && !req.name.toLowerCase().includes(searchQuery.toLowerCase()) && !req.id.includes(searchQuery)) return false
    return true
  })

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-foreground mb-2">Мои заявки</h1>
        <p className="text-muted-foreground">Управляйте своими заявками и отслеживайте статус</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Поиск по ID или названию..."
            className="w-full pl-12 pr-4 py-3 bg-card border border-border rounded-xl text-foreground placeholder:text-placeholder focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-foreground transition-all"
          />
        </div>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
        {filters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => setActiveFilter(filter.value)}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
              activeFilter === filter.value
                ? "bg-primary text-primary-foreground"
                : "bg-card border border-border text-muted-foreground hover:border-hover-border hover:text-foreground"
            }`}
          >
            {filter.name}
          </button>
        ))}
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-background">
                <th className="text-left py-4 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Товар</th>
                <th className="text-left py-4 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Размер</th>
                <th className="text-left py-4 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Бюджет</th>
                <th className="text-left py-4 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Город</th>
                <th className="text-left py-4 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Дата</th>
                <th className="text-left py-4 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Статус</th>
                <th className="text-right py-4 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((request, index) => (
                <tr 
                  key={request.id} 
                  className={`border-b border-border hover:bg-background/50 transition-colors ${
                    index === filteredRequests.length - 1 ? "border-b-0" : ""
                  }`}
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-background flex-shrink-0">
                        {request.image ? (
                          request.image.startsWith("data:") ? (
                            <img src={request.image} alt={request.name} className="w-full h-full object-cover" />
                          ) : (
                            <Image src={request.image} alt={request.name} width={48} height={48} className="w-full h-full object-cover" />
                          )
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="w-5 h-5 text-placeholder" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{request.name}</p>
                        <p className="text-xs text-muted-foreground">#{request.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-sm text-foreground">{request.size}</td>
                  <td className="py-4 px-4 text-sm text-foreground">{request.budget}</td>
                  <td className="py-4 px-4 text-sm text-muted-foreground">{request.city}</td>
                  <td className="py-4 px-4 text-sm text-muted-foreground">{request.date}</td>
                  <td className="py-4 px-4">{getStatusBadge(request.status)}</td>
                  <td className="py-4 px-4 text-right">
                    <Link
                      href={`/dashboard/request/${request.id}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-background rounded-lg transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      Смотреть
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="md:hidden divide-y divide-border">
          {filteredRequests.map((request) => (
            <Link
              key={request.id}
              href={`/dashboard/request/${request.id}`}
              className="flex items-center gap-4 p-4 hover:bg-background/50 transition-colors"
            >
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-background flex-shrink-0">
                {request.image ? (
                  request.image.startsWith("data:") ? (
                    <img src={request.image} alt={request.name} className="w-full h-full object-cover" />
                  ) : (
                    <Image src={request.image} alt={request.name} width={64} height={64} className="w-full h-full object-cover" />
                  )
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="w-6 h-6 text-placeholder" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className="text-sm font-medium text-foreground truncate">{request.name}</p>
                  <span className="text-xs text-muted-foreground">#{request.id}</span>
                </div>
                <p className="text-xs text-muted-foreground mb-2">{request.size} • {request.budget}</p>
                {getStatusBadge(request.status)}
              </div>
            </Link>
          ))}
        </div>

        {filteredRequests.length === 0 && (
          <div className="py-16 text-center">
            <Package className="w-12 h-12 text-placeholder mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">Заявок пока нет</p>
            <Link 
              href="/request"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Создать заявку
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
