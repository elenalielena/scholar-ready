import { Link } from 'react-router-dom'

interface EmptyStateProps {
  heading: string
  message: string
  actionLabel: string
  actionTo: string
}

export default function EmptyState({
  heading,
  message,
  actionLabel,
  actionTo,
}: EmptyStateProps) {
  return (
    <section className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center">
      <h2 className="text-xl font-bold text-ink">{heading}</h2>
      <p className="mx-auto mt-2 max-w-prose text-sm leading-6 text-slate-700">{message}</p>
      <Link
        to={actionTo}
        className="mt-6 inline-flex min-h-11 items-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2"
      >
        {actionLabel}
      </Link>
    </section>
  )
}
