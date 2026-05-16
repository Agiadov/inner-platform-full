"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { FileText, Clock, Plus, Check, TrendingUp, Search, Eye, X as XIcon, Truck, ChevronDown, Save, Package, Trash2, AlertCircle } from "lucide-react"

const stats = [
  { name: "Всего заявок", value: "0", change: "+0%", icon: FileText, color: "bg-[#2563EB]" },
  { name: "В работе", value: "0", change: "+0%", icon: Clock, color: "bg-[#F59E0B]" },
  { name: "Новые сегодня", value: "0", change: "+0%", icon: Plus, color: "bg-[#16A34A]" },
  { name: "Выполнено", value: "0", change: "+0%", icon: Check, color: "bg-primary" },
]

const statusOptions = [
  { value: "received", label: "Получена", color: "var(--muted-foreground)" },
  { value: "searching", label: "В поиске", color: "#2563EB" },
  { value: "found", label: "Найдены варианты", color: "#16A34A" },
  { value: "awaiting_confirmation", label: "Ожидает подтверждение", color: "#F59E0B" },
  { value: "pending", label: "Ожидает оплату", color: "#F59E0B" },
  { value: "purchased", label: "Выкуплено", color: "#16A34A" },
  { value: "shipping", label: "В пути", color: "#2563EB" },
  { value: "delivered", label: "Доставлено", color: "#16A34A" },
  { value: "cancelled", label: "Отменено", color: "#EF4444" },
]

const filters = [
  { name: "Все", value: "all" },
  { name: "Получена", value: "received" },
  { name: "В поиске", value: "searching" },
  { name: "Найдены", value: "found" },
  { name: "Оплата", value: "pending" },
  { name: "В пути", value: "shipping" },
  { name: "Доставлено", value: "delivered" },
]

const getStatusBadge = (status: string) => {
  const config = statusOptions.find(s => s.value === status)
  if (!config) return null
  
  const icons: Record<string, typeof Check> = {
    received: Package,
    searching: Clock,
    found: Check,
    awaiting_confirmation: AlertCircle,
    pending: Clock,
    purchased: Check,
    shipping: Truck,
    delivered: Check,
    cancelled: XIcon,
  }
  
  const Icon = icons[status] || Check
  
  return (
    <span 
      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full"
      style={{ backgroundColor: `${config.color}15`, color: config.color }}
    >
      <Icon className="w-3 h-3" />
      {config.label}
    </span>
  )
}

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

type RequestType = {
  id: string
  name: string
  image: string
  size: string
  budget: string
  city: string
  date: string
  status: string
  contactMethod?: string
  contactValue?: string
  comment?: string
  adminComment?: string
  foundOptions?: FoundOption[]
  statusHistory?: Array<{
    status: string
    statusCode?: string
    time: string
    date: string
    description?: string
  }>
}

export default function AdminPage() {
  const [activeFilter, setActiveFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [requests, setRequests] = useState<RequestType[]>([])
  const [editingRequest, setEditingRequest] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({
    status: "",
    adminComment: "",
  })
  const [foundOptions, setFoundOptions] = useState<FoundOption[]>([])
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [computedStats, setComputedStats] = useState(stats)

  useEffect(() => {
    const loadRequests = () => {
      const savedRequests = localStorage.getItem("inner_requests")
      if (savedRequests) {
        const parsed = JSON.parse(savedRequests)
        setRequests(parsed)
        
        // Compute stats
        const total = parsed.length
        const inWork = parsed.filter((r: RequestType) => ["searching", "found", "awaiting_confirmation", "pending"].includes(r.status)).length
        const newToday = parsed.filter((r: RequestType) => r.date === "Сегодня").length
        const completed = parsed.filter((r: RequestType) => r.status === "delivered").length
        
        setComputedStats([
          { ...stats[0], value: String(total) },
          { ...stats[1], value: String(inWork) },
          { ...stats[2], value: String(newToday) },
          { ...stats[3], value: String(completed) },
        ])
      }
    }
    
    loadRequests()
    const interval = setInterval(loadRequests, 2000)
    return () => clearInterval(interval)
  }, [])

  const filteredRequests = requests.filter(req => {
    if (activeFilter !== "all" && req.status !== activeFilter) return false
    if (searchQuery && !req.name.toLowerCase().includes(searchQuery.toLowerCase()) && !req.id.includes(searchQuery)) return false
    return true
  })

  const openEdit = (request: RequestType) => {
    setEditingRequest(request.id)
    setEditForm({
      status: request.status,
      adminComment: request.adminComment || "",
    })
    setFoundOptions(request.foundOptions || [])
    setSaveSuccess(false)
  }

  const addFoundOption = () => {
    const newId = foundOptions.length > 0 ? Math.max(...foundOptions.map(o => o.id)) + 1 : 1
    setFoundOptions([...foundOptions, {
      id: newId,
      source: "",
      country: "",
      price: "",
      oldPrice: "",
      delivery: "7–10 дней",
      savings: 0,
      recommended: foundOptions.length === 0,
      comment: ""
    }])
  }

  const updateFoundOption = (id: number, field: keyof FoundOption, value: string | number | boolean) => {
    setFoundOptions(foundOptions.map(opt => {
      if (opt.id === id) {
        const updated = { ...opt, [field]: value }
        // Auto-calculate savings
        if (field === "price" || field === "oldPrice") {
          const price = parseInt(String(field === "price" ? value : opt.price).replace(/\s/g, "")) || 0
          const oldPrice = parseInt(String(field === "oldPrice" ? value : opt.oldPrice).replace(/\s/g, "")) || 0
          if (oldPrice > 0 && price > 0) {
            updated.savings = Math.round((1 - price / oldPrice) * 100)
          }
        }
        return updated
      }
      return opt
    }))
  }

  const removeFoundOption = (id: number) => {
    setFoundOptions(foundOptions.filter(opt => opt.id !== id))
  }

  const handleSave = () => {
    const now = new Date()
    const timeStr = now.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })
    
    const updatedRequests = requests.map(req => {
      if (req.id === editingRequest) {
        let newStatus = editForm.status
        let newHistory = req.statusHistory || []
        
        // Автоматически меняем статус на found если добавлены варианты и статус received/searching
        const hadNoOptions = !req.foundOptions || req.foundOptions.length === 0
        const hasNewOptions = foundOptions.length > 0
        if (hadNoOptions && hasNewOptions && (req.status === "received" || req.status === "searching")) {
          newStatus = "found"
          newHistory = [
            {
              status: "Найдены варианты",
              statusCode: "found",
              time: timeStr,
              date: "Сегодня",
              description: `Найдено ${foundOptions.length} вариант(а)`
            },
            ...newHistory
          ]
        }
        
        // Если статус изменён вручную
        const statusChanged = req.status !== newStatus && newStatus === editForm.status
        if (statusChanged && !(hadNoOptions && hasNewOptions)) {
          const statusLabel = statusOptions.find(s => s.value === newStatus)?.label || newStatus
          newHistory = [
            {
              status: statusLabel,
              statusCode: newStatus,
              time: timeStr,
              date: "Сегодня",
              description: `Статус изменён на "${statusLabel}"`
            },
            ...newHistory
          ]
        }
        
        return {
          ...req,
          status: newStatus,
          adminComment: editForm.adminComment,
          foundOptions: foundOptions,
          statusHistory: newHistory,
        }
      }
      return req
    })
    
    setRequests(updatedRequests)
    localStorage.setItem("inner_requests", JSON.stringify(updatedRequests))
    setSaveSuccess(true)
    
    setTimeout(() => {
      setEditingRequest(null)
      setSaveSuccess(false)
    }, 1000)
  }

  return (
    <div className="p-6 lg:p-8 min-h-screen bg-background">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {computedStats.map((stat) => (
          <div key={stat.name} className="bg-card border border-border rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xs text-[#16A34A] font-medium flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3" />
                {stat.change}
              </span>
            </div>
            <p className="text-2xl font-semibold text-foreground mb-1">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.name}</p>
          </div>
        ))}
      </div>

      {/* Recent Requests */}
      <div className="bg-card border border-border rounded-3xl overflow-hidden">
        <div className="p-5 border-b border-border">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-lg font-semibold text-foreground">Управление заявками</h2>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="p-4 border-b border-border bg-card-soft">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Поиск по ID или товару..."
                className="w-full pl-9 pr-4 py-2.5 bg-card border border-border rounded-xl text-sm text-foreground placeholder:text-placeholder focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-foreground transition-all"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {filters.map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setActiveFilter(filter.value)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                    activeFilter === filter.value
                      ? "bg-primary text-primary-foreground"
                      : "bg-card border border-border text-muted-foreground hover:border-hover-border"
                  }`}
                >
                  {filter.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-card-soft">
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">ID</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Товар</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Бюджет</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Город</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Статус</th>
                <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Действия</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((request, index) => (
                <tr 
                  key={request.id} 
                  className={`border-b border-border hover:bg-card-soft transition-colors ${
                    index === filteredRequests.length - 1 ? "border-b-0" : ""
                  }`}
                >
                  <td className="py-4 px-4 text-sm font-medium text-foreground">#{request.id}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl overflow-hidden bg-background flex-shrink-0">
                        {request.image ? (
                          request.image.startsWith("data:") ? (
                            <img src={request.image} alt={request.name} className="w-full h-full object-cover" />
                          ) : (
                            <Image src={request.image} alt={request.name} width={40} height={40} className="w-full h-full object-cover" />
                          )
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="w-4 h-4 text-placeholder" />
                          </div>
                        )}
                      </div>
                      <span className="text-sm text-foreground truncate max-w-[200px]">{request.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-sm text-foreground">{request.budget}</td>
                  <td className="py-4 px-4 text-sm text-muted-foreground">{request.city}</td>
                  <td className="py-4 px-4">{getStatusBadge(request.status)}</td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => openEdit(request)}
                        className="px-3 py-1.5 text-sm font-medium text-foreground bg-background hover:bg-secondary rounded-lg transition-colors"
                      >
                        Редактировать
                      </button>
                      <Link 
                        href={`/dashboard/request/${request.id}`}
                        className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-background rounded-lg transition-colors inline-flex"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredRequests.length === 0 && (
          <div className="py-16 text-center">
            <Package className="w-12 h-12 text-placeholder mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">Заявок пока нет</p>
            <button
              onClick={() => {
                const demoRequests = [
                  {
                    id: "1248",
                    name: "Stone Island Jacket",
                    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=100&h=100&fit=crop",
                    size: "L",
                    budget: "50 000 ₽",
                    city: "Москва",
                    date: "Сегодня",
                    status: "searching",
                    contactMethod: "telegram",
                    contactValue: "@demo_user",
                    statusHistory: [{ status: "Заявка получена", statusCode: "received", time: "10:00", date: "Сегодня" }]
                  },
                  {
                    id: "1247",
                    name: "Nike Dunk Low",
                    image: "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=100&h=100&fit=crop",
                    size: "43",
                    budget: "15 000 ₽",
                    city: "Санкт-Петербург",
                    date: "Вчера",
                    status: "found",
                    contactMethod: "whatsapp",
                    contactValue: "+7 999 123 45 67",
                    foundOptions: [
                      { id: 1, source: "StockX", country: "США", price: "11 500", oldPrice: "18 990", delivery: "10 дней", savings: 39, recommended: true }
                    ],
                    statusHistory: [
                      { status: "Найдены варианты", statusCode: "found", time: "14:30", date: "Вчера" },
                      { status: "Заявка получена", statusCode: "received", time: "09:15", date: "Вчера" }
                    ]
                  }
                ]
                localStorage.setItem("inner_requests", JSON.stringify(demoRequests))
                setRequests(demoRequests)
              }}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Показать демо-заявки
            </button>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-card rounded-3xl w-full max-w-2xl overflow-hidden my-8">
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground">Редактировать заявку #{editingRequest}</h3>
                <button onClick={() => setEditingRequest(null)} className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-background rounded-lg transition-colors">
                  <XIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Статус заявки</label>
                <div className="relative">
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm({...editForm, status: e.target.value})}
                    className="w-full px-4 py-3 bg-card border border-border rounded-xl text-sm text-foreground appearance-none focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-foreground transition-all"
                  >
                    {statusOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                </div>
              </div>

              {/* Admin Comment */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Комментарий для клиента</label>
                <textarea
                  value={editForm.adminComment}
                  onChange={(e) => setEditForm({...editForm, adminComment: e.target.value})}
                  placeholder="Этот комментарий увидит клиент..."
                  rows={3}
                  className="w-full px-4 py-3 bg-card border border-border rounded-xl text-sm text-foreground placeholder:text-placeholder focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-foreground transition-all resize-none"
                />
              </div>

              {/* Found Options */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-foreground">Найденные варианты</label>
                  <button
                    onClick={addFoundOption}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-foreground bg-background hover:bg-secondary rounded-lg transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Добавить
                  </button>
                </div>
                
                {foundOptions.length === 0 ? (
                  <div className="text-center py-8 bg-card-soft rounded-xl border border-dashed border-border">
                    <p className="text-sm text-muted-foreground">Нет добавленных вариантов</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {foundOptions.map((option, index) => (
                      <div key={option.id} className="p-4 bg-card-soft rounded-xl border border-border">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-medium text-foreground">Вариант {index + 1}</span>
                          <div className="flex items-center gap-2">
                            <label className="flex items-center gap-2 text-xs text-muted-foreground">
                              <input
                                type="checkbox"
                                checked={option.recommended || false}
                                onChange={(e) => updateFoundOption(option.id, "recommended", e.target.checked)}
                                className="rounded border-border"
                              />
                              Лучшая цена
                            </label>
                            <button
                              onClick={() => removeFoundOption(option.id)}
                              className="p-1 text-destructive hover:bg-destructive/10 rounded transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs text-muted-foreground mb-1">Источник</label>
                            <input
                              type="text"
                              value={option.source}
                              onChange={(e) => updateFoundOption(option.id, "source", e.target.value)}
                              placeholder="Farfetch"
                              className="w-full px-3 py-2 bg-card border border-border rounded-lg text-sm text-foreground placeholder:text-placeholder focus:outline-none focus:ring-1 focus:ring-primary/10"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-muted-foreground mb-1">Страна</label>
                            <input
                              type="text"
                              value={option.country}
                              onChange={(e) => updateFoundOption(option.id, "country", e.target.value)}
                              placeholder="Италия"
                              className="w-full px-3 py-2 bg-card border border-border rounded-lg text-sm text-foreground placeholder:text-placeholder focus:outline-none focus:ring-1 focus:ring-primary/10"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-muted-foreground mb-1">Цена (₽)</label>
                            <input
                              type="text"
                              value={option.price}
                              onChange={(e) => updateFoundOption(option.id, "price", e.target.value)}
                              placeholder="46 000"
                              className="w-full px-3 py-2 bg-card border border-border rounded-lg text-sm text-foreground placeholder:text-placeholder focus:outline-none focus:ring-1 focus:ring-primary/10"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-muted-foreground mb-1">Старая цена (₽)</label>
                            <input
                              type="text"
                              value={option.oldPrice}
                              onChange={(e) => updateFoundOption(option.id, "oldPrice", e.target.value)}
                              placeholder="89 000"
                              className="w-full px-3 py-2 bg-card border border-border rounded-lg text-sm text-foreground placeholder:text-placeholder focus:outline-none focus:ring-1 focus:ring-primary/10"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-muted-foreground mb-1">Срок доставки</label>
                            <input
                              type="text"
                              value={option.delivery}
                              onChange={(e) => updateFoundOption(option.id, "delivery", e.target.value)}
                              placeholder="5–7 дней"
                              className="w-full px-3 py-2 bg-card border border-border rounded-lg text-sm text-foreground placeholder:text-placeholder focus:outline-none focus:ring-1 focus:ring-primary/10"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-muted-foreground mb-1">��кономия (%)</label>
                            <input
                              type="number"
                              value={option.savings}
                              onChange={(e) => updateFoundOption(option.id, "savings", parseInt(e.target.value) || 0)}
                              placeholder="48"
                              className="w-full px-3 py-2 bg-card border border-border rounded-lg text-sm text-foreground placeholder:text-placeholder focus:outline-none focus:ring-1 focus:ring-primary/10"
                            />
                          </div>
                          <div className="col-span-2">
                            <label className="block text-xs text-muted-foreground mb-1">Комментарий</label>
                            <input
                              type="text"
                              value={option.comment || ""}
                              onChange={(e) => updateFoundOption(option.id, "comment", e.target.value)}
                              placeholder="Дополнительная информация..."
                              className="w-full px-3 py-2 bg-card border border-border rounded-lg text-sm text-foreground placeholder:text-placeholder focus:outline-none focus:ring-1 focus:ring-primary/10"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 border-t border-border bg-card-soft flex gap-3">
              <button
                onClick={() => setEditingRequest(null)}
                className="flex-1 px-4 py-3 bg-card border border-border text-foreground rounded-xl text-sm font-medium hover:bg-background transition-colors"
              >
                Отмена
              </button>
              <button
                onClick={handleSave}
                className={`flex-1 px-4 py-3 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                  saveSuccess 
                    ? "bg-[#16A34A] text-primary-foreground" 
                    : "bg-primary text-primary-foreground hover:bg-primary/90"
                }`}
              >
                {saveSuccess ? (
                  <>
                    <Check className="w-4 h-4" />
                    Сохранено
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Сохранить
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
