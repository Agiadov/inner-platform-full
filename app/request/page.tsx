"use client"

import { useState } from "react"
import Link from "next/link"
import { Upload, Link as LinkIcon, ArrowLeft, ArrowRight, X, CheckCircle2, MessageCircle, Phone, Mail } from "lucide-react"
import { Header } from "@/components/inner/header"
import { Footer } from "@/components/inner/footer"

const sizes = ["XXS", "XS", "S", "M", "L", "XL", "XXL", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46"]

const contactMethods = [
  { id: "telegram", label: "Telegram", icon: MessageCircle, placeholder: "@username" },
  { id: "whatsapp", label: "WhatsApp", icon: Phone, placeholder: "+7 999 123 45 67" },
  { id: "phone", label: "Телефон", icon: Phone, placeholder: "+7 999 123 45 67" },
  { id: "email", label: "Email", icon: Mail, placeholder: "email@example.com" },
]

// Convert file to base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = error => reject(error)
  })
}

export default function RequestPage() {
  const [formData, setFormData] = useState({
    link: "",
    brand: "",
    size: "",
    budget: "",
    city: "",
    comment: "",
    contactMethod: "",
    contactValue: "",
  })
  const [images, setImages] = useState<string[]>([]) // base64 strings
  const [dragActive, setDragActive] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [requestNumber, setRequestNumber] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState("")

  const validateAndAddImages = async (files: FileList | File[]) => {
    const newErrors: Record<string, string> = { ...errors }
    delete newErrors.images
    
    const validFiles: File[] = []
    const maxSize = 10 * 1024 * 1024 // 10MB
    const remaining = 5 - images.length
    
    for (const file of Array.from(files).slice(0, remaining)) {
      if (!file.type.startsWith("image/")) {
        newErrors.images = "Можно загружать только изображения (PNG, JPG, GIF)"
        continue
      }
      if (file.size > maxSize) {
        newErrors.images = `Размер файла "${file.name}" превышает 10MB`
        continue
      }
      validFiles.push(file)
    }
    
    if (images.length + validFiles.length >= 5 && Array.from(files).length > remaining) {
      newErrors.images = "Максимум 5 фото"
    }
    
    setErrors(newErrors)
    
    if (validFiles.length > 0) {
      const base64Images = await Promise.all(validFiles.map(file => fileToBase64(file)))
      setImages(prev => [...prev, ...base64Images].slice(0, 5))
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      await validateAndAddImages(files)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    const files = e.dataTransfer.files
    if (files) {
      await validateAndAddImages(files)
    }
  }

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    const hasPhoto = images.length > 0
    const hasLink = formData.link.trim() !== ""
    const hasBrand = formData.brand.trim() !== ""
    
    if (!hasPhoto && !hasLink && !hasBrand) {
      newErrors.product = "Загрузите фото, укажите ссылку или название товара"
    }
    
    if (!formData.contactMethod) {
      newErrors.contactMethod = "Выберите способ связи"
    }
    if (formData.contactMethod && !formData.contactValue.trim()) {
      newErrors.contactValue = "Укажите контактные данные"
    }
    
    if (!formData.city.trim()) {
      newErrors.city = "Укажите город доставки"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsSubmitting(true)
    setSubmitError("")
    
    const existingRequests = JSON.parse(localStorage.getItem("inner_requests") || "[]")
    const newId = 1249 + existingRequests.length
    const newRequestNumber = `#${newId}`
    const now = new Date()
    const timeStr = now.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })
    const dateStr = now.toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })
    
    const newRequest = {
      id: String(newId),
      name: formData.brand || "Товар по фото",
      image: images[0] || "",
      images: images,
      size: formData.size || "Не указан",
      budget: formData.budget ? `${formData.budget} ₽` : "Не указан",
      city: formData.city,
      date: "Сегодня",
      createdAt: now.toISOString(),
      status: "received",
      link: formData.link,
      contactMethod: formData.contactMethod,
      contactValue: formData.contactValue,
      comment: formData.comment,
      adminComment: "",
      foundOptions: [],
      statusHistory: [
        { 
          status: "Заявка получена", 
          statusCode: "received",
          time: timeStr, 
          date: "Сегодня",
          description: "Заявка принята в обработку"
        }
      ]
    }
    
    // Send to Telegram
    try {
      const telegramRes = await fetch("/api/telegram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestNumber: newRequestNumber,
          itemName: formData.brand || "Товар по фото",
          brand: formData.brand,
          productUrl: formData.link,
          size: formData.size,
          budget: formData.budget ? `${formData.budget} ₽` : "Не указан",
          city: formData.city,
          contactMethod: formData.contactMethod,
          contactValue: formData.contactValue,
          comment: formData.comment,
          createdAt: dateStr,
          imagesCount: images.length || 0,
        }),
      })
      
      const responseData = await telegramRes.json()
      
      if (!telegramRes.ok) {
        console.error("[INNER] Telegram API error:", JSON.stringify(responseData, null, 2))
        throw new Error(responseData.error || "Telegram send failed")
      }
    } catch (err) {
      console.error("[INNER] Telegram submit error:", err)
      // Save locally even on Telegram failure so data is not lost
      existingRequests.unshift(newRequest)
      localStorage.setItem("inner_requests", JSON.stringify(existingRequests))
      setIsSubmitting(false)
      setSubmitError("Заявка сохранена, но Telegram-уведомление не отправилось. Проверьте настройки бота.")
      return
    }
    
    // Save locally only after successful Telegram send
    existingRequests.unshift(newRequest)
    localStorage.setItem("inner_requests", JSON.stringify(existingRequests))
    
    setRequestNumber(newRequestNumber)
    setIsSubmitted(true)
    setIsSubmitting(false)
  }

  const handleNewRequest = () => {
    setFormData({
      link: "",
      brand: "",
      size: "",
      budget: "",
      city: "",
      comment: "",
      contactMethod: "",
      contactValue: "",
    })
    setImages([])
    setIsSubmitted(false)
    setRequestNumber("")
    setErrors({})
    setSubmitError("")
  }

  if (isSubmitted) {
    return (
      <main className="min-h-screen bg-background">
        <Header />
        <div className="pt-20 sm:pt-24 pb-16">
          <div className="max-w-md mx-auto px-5 sm:px-6 text-center">
            <div className="bg-card rounded-3xl border border-border p-8 sm:p-12">
              <div className="w-16 h-16 rounded-full bg-[#16A34A]/10 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-8 h-8 text-[#16A34A]" />
              </div>
              <h1 className="text-2xl font-semibold text-foreground mb-2">Заявка создана</h1>
              <p className="text-muted-foreground mb-6">
                Номер заявки <span className="font-semibold text-foreground">{requestNumber}</span>
              </p>
              <p className="text-sm text-muted-foreground mb-8">
                Мы начали поиск и свяжемся с вами в ближайшее время. Обычно это занимает до 15 минут.
              </p>
              <div className="flex flex-col gap-3">
                <Link
                  href="/dashboard"
                  className="w-full flex items-center justify-center gap-2 py-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl text-base font-medium transition-colors"
                >
                  Перейти в кабинет
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <button
                  onClick={handleNewRequest}
                  className="w-full py-4 bg-card border border-border hover:border-hover-border text-foreground rounded-2xl text-base font-medium transition-colors"
                >
                  Создать ещё заявку
                </button>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="pt-20 sm:pt-24 pb-16">
        <div className="max-w-2xl mx-auto px-5 sm:px-6">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            На главную
          </Link>

          <div className="mb-10">
            <h1 className="text-2xl sm:text-3xl font-semibold text-foreground mb-3">Новая заявка</h1>
            <p className="text-muted-foreground">Загрузите фото, вставьте ссылку или опишите товар</p>
          </div>

          {errors.product && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-2xl">
              <p className="text-sm text-destructive">{errors.product}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">Фото товара</label>
              <div
                className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-colors ${
                  dragActive ? "border-foreground bg-secondary" : "border-border hover:border-hover-border"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center">
                  <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center mb-4">
                    <Upload className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-foreground font-medium mb-1">Перетащите фото сюда или нажмите для загрузки</p>
                  <p className="text-xs text-muted-foreground">PNG, JPG до 10MB. Максимум 5 фото</p>
                </div>
              </div>

              {errors.images && (
                <p className="text-sm text-destructive mt-3">{errors.images}</p>
              )}

              {images.length > 0 && (
                <div className="flex gap-3 mt-4 flex-wrap">
                  {images.map((img, index) => (
                    <div key={index} className="relative w-20 h-20 rounded-xl overflow-hidden border border-border">
                      <img src={img} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 w-5 h-5 bg-black/50 rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
                      >
                        <X className="w-3 h-3 text-primary-foreground" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-3">Ссылка на товар</label>
              <div className="relative">
                <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="url"
                  value={formData.link}
                  onChange={(e) => setFormData({...formData, link: e.target.value})}
                  placeholder="https://..."
                  className="w-full pl-12 pr-4 py-4 bg-card border border-border rounded-2xl text-foreground placeholder:text-placeholder focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-foreground transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-3">Бренд / модель</label>
              <input
                type="text"
                value={formData.brand}
                onChange={(e) => setFormData({...formData, brand: e.target.value})}
                placeholder="Например: Nike Air Max 90"
                className="w-full px-4 py-4 bg-card border border-border rounded-2xl text-foreground placeholder:text-placeholder focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-foreground transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-3">Размер</label>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setFormData({...formData, size})}
                    className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      formData.size === size
                        ? "bg-primary text-primary-foreground"
                        : "bg-card border border-border text-foreground hover:border-hover-border"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-3">Бюджет</label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.budget}
                  onChange={(e) => setFormData({...formData, budget: e.target.value})}
                  placeholder="до 50 000"
                  className="w-full px-4 py-4 bg-card border border-border rounded-2xl text-foreground placeholder:text-placeholder focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-foreground transition-all"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">₽</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                Город доставки <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({...formData, city: e.target.value})}
                placeholder="Москва"
                className={`w-full px-4 py-4 bg-card border rounded-2xl text-foreground placeholder:text-placeholder focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-foreground transition-all ${
                  errors.city ? "border-destructive" : "border-border"
                }`}
              />
              {errors.city && <p className="text-sm text-destructive mt-2">{errors.city}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                Как с вами связаться? <span className="text-destructive">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                {contactMethods.map((method) => (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setFormData({...formData, contactMethod: method.id, contactValue: ""})}
                    className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      formData.contactMethod === method.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-card border border-border text-foreground hover:border-hover-border"
                    }`}
                  >
                    <method.icon className="w-4 h-4" />
                    {method.label}
                  </button>
                ))}
              </div>
              {errors.contactMethod && <p className="text-sm text-destructive mb-2">{errors.contactMethod}</p>}
              
              {formData.contactMethod && (
                <input
                  type="text"
                  value={formData.contactValue}
                  onChange={(e) => setFormData({...formData, contactValue: e.target.value})}
                  placeholder={contactMethods.find(m => m.id === formData.contactMethod)?.placeholder}
                  className={`w-full px-4 py-4 bg-card border rounded-2xl text-foreground placeholder:text-placeholder focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-foreground transition-all ${
                    errors.contactValue ? "border-destructive" : "border-border"
                  }`}
                />
              )}
              {errors.contactValue && <p className="text-sm text-destructive mt-2">{errors.contactValue}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-3">Комментарий</label>
              <textarea
                value={formData.comment}
                onChange={(e) => setFormData({...formData, comment: e.target.value})}
                placeholder="Дополнительные пожелания..."
                rows={4}
                className="w-full px-4 py-4 bg-card border border-border rounded-2xl text-foreground placeholder:text-placeholder focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-foreground transition-all resize-none"
              />
            </div>

            {submitError && (
              <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-2xl">
                <p className="text-sm text-destructive">{submitError}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl text-base font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Отправка..." : "Отправить заявку"}
              {!isSubmitting && <ArrowRight className="w-5 h-5" />}
            </button>

            <p className="text-center text-sm text-muted-foreground">Обычно отвечаем в течение 15 минут</p>
          </form>
        </div>
      </div>
      <Footer />
    </main>
  )
}
