import { Link } from 'react-router-dom'
import PdpoStatement from '../components/profile/PdpoStatement'

export default function PrivacyPage() {
  return (
    <div className="space-y-8">
      <div className="max-w-3xl">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">Your information</p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-ink">Privacy statement</h1>
        <p className="mt-4 text-lg leading-8 text-slate-700">
          Read how this fictional demo uses and stores the information in your browser.
        </p>
      </div>
      <PdpoStatement />
      <Link
        to="/profile"
        className="inline-flex min-h-11 items-center rounded-md border border-primary px-4 py-2 font-bold text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2"
      >
        Back to profile
      </Link>
    </div>
  )
}
