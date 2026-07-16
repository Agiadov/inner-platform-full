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
    <div className="min-h-screen bg-background p-6 lg:p-8">
      <section className="mx-auto max-w-6xl">
        <div className="mb-8 rounded-3xl border border-border bg-card p-6 lg:p-8">
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-white/[.05] text-foreground">
            <Icon className="h-7 w-7" />
          </div>
          <p className="mb-2 text-[11px] font-bold tracking-[.16em] text-muted-foreground">INNER CONTROL CENTER</p>
          <h2 className="text-3xl font-semibold tracking-[-.04em] text-foreground lg:text-5xl">{title}</h2>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground lg:text-base">{description}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {actions.map((action) => (
            <Link
              key={`${action.href}-${action.label}`}
              href={action.href}
              className="group rounded-2xl border border-border bg-card p-5 transition-colors hover:border-white/20 hover:bg-white/[.045]"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{action.label}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{action.description}</p>
                </div>
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-white/[.035] text-muted-foreground transition-all group-hover:translate-x-1 group-hover:text-foreground">
                  <ArrowRight className="h-5 w-5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
