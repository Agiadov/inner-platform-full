import Link from 'next/link'
import { ArrowRight, type LucideIcon } from 'lucide-react'

export function AdminSectionPage({
  title,
  description,
  icon: Icon,
  actions,
}: {
  title: string
  description: string
  icon: LucideIcon
  actions: Array<{ label: string; href: string; description: string }>
}) {
  return (
    <div className="p-6 lg:p-8 min-h-screen bg-background">
      <section className="max-w