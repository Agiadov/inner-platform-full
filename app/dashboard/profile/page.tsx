"use client"

import { useState, useEffect } from "react"
import { User, Save, CheckCircle2 } from "lucide-react"

type Profile = {
  name: string
  telegram: string
  whatsapp: string
  email: string
  city: string
  address: string
  clothingSize: string
  shoeSize: string
  favoriteBrands: string
  comment: string
}

const emptyProfile: Profile = {
  name: "",
  telegram: "",
  whatsapp: "",
  email: "",
  city: "",
  address: "",
  clothingSize: "",
  shoeSize: "",
  favoriteBrands: "",
  comment: "",
}

const clothingSizes = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"]
const shoeSizes = ["36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46", "47"]

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile>(emptyProfile)
  const [saved, setSaved] = useState(false)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const savedProfile = localStorage.getItem("inner_user_profile")
    if (savedProfile) {
      try {
        setProfile({ ...emptyProfile, ...JSON.parse(savedProfile) })
      } catch {
        // ignore
      }
    }
    setLoaded(true)
  }, [])

  const handleChange = (field: keyof Profile, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }))
    setSaved(false)
  }

  const handleSave = () => {
    localStorage.setItem("inner_user_profile", JSON.stringify(profile))
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  if (!loaded) return null

  return (
    <div className="p-6 lg:p-8">
      <div className="max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-foreground">Профиль</h1>
          <p className="text-sm text-muted-foreground">Ваши данные для заявок</p>
        </div>

        {/* Success Toast */}
        {saved && (
          <div className="fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-xl shadow-lg animate-in fade-in slide-in-from-top-2">
            <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
            <span className="text-sm font-medium">Профиль сохранен</span>
          </div>
        )}

        {/* Avatar */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center">
            <User className="w-8 h-8 text-muted-foreground" />
          </div>
          <div>
            <p className="text-lg font-medium text-foreground">{profile.name || "Имя не указано"}</p>
            <p className="text-sm text-muted-foreground">{profile.telegram || profile.email || "Контакт не указан"}</p>
          </div>
        </div>

        {/* Form */}
        <div className="space-y-6">
          {/* Contact Info */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <h2 className="text-base font-semibold text-foreground mb-5">Контактные данные</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Имя</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="Как к вам обращаться"
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder:text-placeholder focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-foreground transition-all text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Telegram</label>
                <input
                  type="text"
                  value={profile.telegram}
                  onChange={(e) => handleChange("telegram", e.target.value)}
                  placeholder="@username"
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder:text-placeholder focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-foreground transition-all text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">WhatsApp / телефон</label>
                <input
                  type="text"
                  value={profile.whatsapp}
                  onChange={(e) => handleChange("whatsapp", e.target.value)}
                  placeholder="+7 999 123 45 67"
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder:text-placeholder focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-foreground transition-all text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="email@example.com"
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder:text-placeholder focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-foreground transition-all text-sm"
                />
              </div>
            </div>
          </div>

          {/* Delivery */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <h2 className="text-base font-semibold text-foreground mb-5">Доставка</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Город</label>
                <input
                  type="text"
                  value={profile.city}
                  onChange={(e) => handleChange("city", e.target.value)}
                  placeholder="Москва"
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder:text-placeholder focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-foreground transition-all text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Адрес доставки</label>
                <input
                  type="text"
                  value={profile.address}
                  onChange={(e) => handleChange("address", e.target.value)}
                  placeholder="Улица, дом, квартира"
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder:text-placeholder focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-foreground transition-all text-sm"
                />
              </div>
            </div>
          </div>

          {/* Sizes & Preferences */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <h2 className="text-base font-semibold text-foreground mb-5">Размеры и предпочтения</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Размер одежды</label>
                <div className="flex flex-wrap gap-2">
                  {clothingSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => handleChange("clothingSize", profile.clothingSize === size ? "" : size)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                        profile.clothingSize === size
                          ? "bg-primary text-primary-foreground"
                          : "bg-background border border-border text-muted-foreground hover:border-hover-border hover:text-foreground"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Размер обуви</label>
                <div className="flex flex-wrap gap-2">
                  {shoeSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => handleChange("shoeSize", profile.shoeSize === size ? "" : size)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                        profile.shoeSize === size
                          ? "bg-primary text-primary-foreground"
                          : "bg-background border border-border text-muted-foreground hover:border-hover-border hover:text-foreground"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Любимые бренды</label>
                <input
                  type="text"
                  value={profile.favoriteBrands}
                  onChange={(e) => handleChange("favoriteBrands", e.target.value)}
                  placeholder="Nike, Stone Island, Balenciaga..."
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder:text-placeholder focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-foreground transition-all text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Комментарий</label>
                <textarea
                  value={profile.comment}
                  onChange={(e) => handleChange("comment", e.target.value)}
                  placeholder="Пожелания, предпочтения, что-то важное для нас"
                  rows={3}
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder:text-placeholder focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-foreground transition-all text-sm resize-none"
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            className="w-full flex items-center justify-center gap-2 py-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl text-base font-medium transition-colors"
          >
            <Save className="w-5 h-5" />
            Сохранить профиль
          </button>
        </div>
      </div>
    </div>
  )
}
