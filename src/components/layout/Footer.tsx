import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-2 px-6 py-6 text-sm text-ink sm:flex-row sm:items-center sm:justify-between">
        <p>All data is fictional. ScholarReady does not predict outcomes.</p>
        <Link
          to="/privacy"
          className="rounded-md font-semibold text-primary underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2"
        >
          Privacy statement
        </Link>
      </div>
    </footer>
  )
}
