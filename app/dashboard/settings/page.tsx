"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Bell, MessageSquare, Mail, Shield, LogOut, Trash2, CheckCircle2, AlertTriangle, Palette } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

type Settings = {
  notifications: {
    telegram: boolean
    whatsapp: boolean
    email: boolean
  }
  preferredContact: "telegram" | "whatsapp" | "email"
}

const defaultSettings: Settings = {
  notifications: {
    telegram: true,
    whatsapp: false,
    email: false,
  },
  preferredContact: "telegram",
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>(defaultSettings)
  const [saved, setSaved] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [showClearConfirm, setShowClearConfirm] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [cleared, setCleared] = useState(false)

  useEffect(() => {
    const savedSettings = localStorage.getItem("inner_user_settings")
    if (savedSettings) {
      try {
        setSettings({ ...defaultSettings, ...JSON.parse(savedSettings) })
      } catch {
        // ignore
      }
    }
    setLoaded(true)
  }, [])

  const saveSettings = (newSettings: Settings) => {
    setSettings(newSettings)
    localStorage.setItem("inner_user_settings", JSON.stringify(newSettings))
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const toggleNotification = (channel: "telegram" | "whatsapp" | "email") => {
    const updated = {
      ...settings,
      notifications: {
        ...settings.notifications,
        [channel]: !settings.notifications[channel],
      },
    }
    saveSettings(updated)
  }

  const setPreferredContact = (method: "telegram" | "whatsapp" | "email") => {
    saveSettings({ ...settings, preferredContact: method })
  }

  const handleClearData = () => {
    localStorage.removeItem("inner_user_profile")
    localStorage.removeItem("inner_user_settings")
    localStorage.removeItem("inner_requests")
    setSettings(defaultSettings)
    setShowClearConfirm(false)
    setCleared(true)
    setTimeout(() => setCleared(false), 3000)
  }

  const handleDeleteProfile = () => {
    localStorage.removeItem("inner_user_profile")
    localStorage.removeItem("inner_user_settings")
    localStorage.removeItem("inner_requests")
    setSettings(defaultSettings)
    setShowDeleteConfirm(false)
    setCleared(true)
    setTimeout(() => setCleared(false), 3000)
  }

  if (!loaded) return null

  return (
    <div className="p-6 lg:p-8">
      <div className="max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-foreground">Настройки</h1>
          <p className="text-sm text-muted-foreground">Управление уведомлениями и данными</p>
        </div>

        {/* Toast */}
        {saved && (
          <div className="fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-xl shadow-lg animate-in fade-in slide-in-from-top-2">
            <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
            <span className="text-sm font-medium">Настройки сохранены</span>
          </div>
        )}
        {cleared && (
          <div className="fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-xl shadow-lg animate-in fade-in slide-in-from-top-2">
            <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
            <span className="text-sm font-medium">Локальные данные очищены</span>
          </div>
        )}

        <div className="space-y-6">
          {/* Appearance */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-xl bg-background flex items-center justify-center">
                <Palette className="w-4 h-4 text-foreground" />
              </div>
              <h2 className="text-base font-semibold text-foreground">Внешний вид</h2>
            </div>
            <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-background">
              <span className="text-sm text-foreground">Тема оформления</span>
              <ThemeToggle />
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-xl bg-background flex items-center justify-center">
                <Bell className="w-4 h-4 text-foreground" />
              </div>
              <h2 className="text-base font-semibold text-foreground">Уведомления</h2>
            </div>
            <div className="space-y-3">
              {([
                { key: "telegram" as const, label: "Telegram", icon: MessageSquare },
                { key: "whatsapp" as const, label: "WhatsApp", icon: MessageSquare },
                { key: "email" as const, label: "Email", icon: Mail },
              ]).map(({ key, label, icon: Icon }) => (
                <div key={key} className="flex items-center justify-between py-3 px-4 bg-background rounded-xl">
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">{label} уведомления</span>
                  </div>
                  <button
                    onClick={() => toggleNotification(key)}
                    className={`relative w-11 h-6 rounded-full transition-colors ${
                      settings.notifications[key] ? "bg-primary" : "bg-toggle-off"
                    }`}
                  >
                    <span
                      className={`absolute top-1 w-4 h-4 rounded-full bg-card transition-transform ${
                        settings.notifications[key] ? "left-6" : "left-1"
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Preferred Contact */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-xl bg-background flex items-center justify-center">
                <MessageSquare className="w-4 h-4 text-foreground" />
              </div>
              <h2 className="text-base font-semibold text-foreground">Основной способ связи</h2>
            </div>
            <div className="space-y-2">
              {([
                { key: "telegram" as const, label: "Telegram" },
                { key: "whatsapp" as const, label: "WhatsApp" },
                { key: "email" as const, label: "Email" },
              ]).map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setPreferredContact(key)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm transition-colors ${
                    settings.preferredContact === key
                      ? "bg-primary text-primary-foreground"
                      : "bg-background text-foreground hover:bg-secondary"
                  }`}
                >
                  <span>{label}</span>
                  {settings.preferredContact === key && (
                    <CheckCircle2 className="w-4 h-4" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Privacy */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-xl bg-background flex items-center justify-center">
                <Shield className="w-4 h-4 text-foreground" />
              </div>
              <h2 className="text-base font-semibold text-foreground">Приватность</h2>
            </div>
            <div className="space-y-3">
              {/* Clear Local Data */}
              {!showClearConfirm ? (
                <button
                  onClick={() => setShowClearConfirm(true)}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-background hover:bg-secondary rounded-xl text-sm text-foreground transition-colors text-left"
                >
                  <Trash2 className="w-4 h-4 text-muted-foreground" />
                  Очистить локальные данные
                </button>
              ) : (
                <div className="px-4 py-4 bg-destructive-bg border border-destructive-border rounded-xl">
                  <div className="flex items-start gap-2 mb-3">
                    <AlertTriangle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-destructive-text">Будут удалены все локальные данные: профиль, заявки и настройки.</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleClearData}
                      className="px-4 py-2 bg-destructive text-primary-foreground rounded-lg text-sm font-medium hover:bg-destructive/90 transition-colors"
                    >
                      Удалить
                    </button>
                    <button
                      onClick={() => setShowClearConfirm(false)}
                      className="px-4 py-2 bg-card border border-border rounded-lg text-sm font-medium text-foreground hover:bg-background transition-colors"
                    >
                      Отмена
                    </button>
                  </div>
                </div>
              )}

              {/* Delete Profile */}
              {!showDeleteConfirm ? (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-background hover:bg-secondary rounded-xl text-sm text-destructive transition-colors text-left"
                >
                  <Trash2 className="w-4 h-4" />
                  Удалить профиль
                </button>
              ) : (
                <div className="px-4 py-4 bg-destructive-bg border border-destructive-border rounded-xl">
                  <div className="flex items-start gap-2 mb-3">
                    <AlertTriangle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-destructive-text">Будут удалены все данные: профиль, заявки, настройки. Действие необратимо.</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleDeleteProfile}
                      className="px-4 py-2 bg-destructive text-primary-foreground rounded-lg text-sm font-medium hover:bg-destructive/90 transition-colors"
                    >
                      Удалить все
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="px-4 py-2 bg-card border border-border rounded-lg text-sm font-medium text-foreground hover:bg-background transition-colors"
                    >
                      Отмена
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Account */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-xl bg-background flex items-center justify-center">
                <LogOut className="w-4 h-4 text-foreground" />
              </div>
              <h2 className="text-base font-semibold text-foreground">Аккаунт</h2>
            </div>
            <Link
              href="/"
              className="w-full flex items-center gap-3 px-4 py-3 bg-background hover:bg-secondary rounded-xl text-sm text-foreground transition-colors"
            >
              <LogOut className="w-4 h-4 text-muted-foreground" />
              Выйти
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
