import { Link } from 'react-router-dom'
import { useAppState } from '../state/AppStateProvider'
import MatchPreview from '../components/landing/MatchPreview'

const steps = [
  {
    number: '01',
    title: 'Build your profile',
    text: 'Add the study details and background used for transparent rule checks.',
  },
  {
    number: '02',
    title: 'See why you match',
    text: 'Review every published criterion with a plain-language explanation.',
  },
  {
    number: '03',
    title: 'Track documents and deadlines',
    text: 'Keep one checklist for the evidence and dates across saved scholarships.',
  },
]

const trustStatements = [
  'Matches are based on each scholarship\'s published criteria.',
  'We never estimate whether you will win an award.',
  'Your information stays in this browser.',
  'All scholarships and people in this demo are fictional.',
]

export default function LandingPage() {
  const { state } = useAppState()
  const demoTarget = state.profileSavedAt ? '/dashboard' : '/profile'

  return (
    <div className="space-y-16">
      <section className="grid items-center gap-10 py-8 lg:grid-cols-[1.15fr_0.85fr] lg:py-16">
        <div>
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-primary">
            Transparent scholarship preparation
          </p>
          <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-tight text-ink md:text-6xl">
            Find scholarships you qualify for, and get every application ready.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-700">
            ScholarReady helps you understand published scholarship criteria, collect the
            documents you need and keep deadlines in one place.
          </p>
          <Link
            to={demoTarget}
            className="mt-8 inline-flex min-h-12 items-center rounded-md bg-primary px-5 py-3 font-bold text-white shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2"
          >
            Try the demo
          </Link>
        </div>
        <div className="rounded-2xl border border-blue-100 bg-blue-50 p-8 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
            A clear starting point
          </p>
          <p className="mt-4 text-2xl font-bold leading-tight text-ink">
            Know what you meet, what needs checking and what to prepare next.
          </p>
          <p className="mt-4 text-sm leading-6 text-slate-700">
            All matching is rule-based and tied to fictional published criteria. Readiness
            means documents prepared, not an outcome prediction.
          </p>
        </div>
      </section>

      <section aria-labelledby="how-it-works-heading">
        <div className="mb-6">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">How it works</p>
          <h2 id="how-it-works-heading" className="mt-2 text-3xl font-bold text-ink">
            Three steps from profile to prepared application
          </h2>
        </div>
        <ol className="grid gap-5 md:grid-cols-3">
          {steps.map((step) => (
            <li key={step.number} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <span className="text-sm font-bold text-primary">{step.number}</span>
              <h3 className="mt-4 text-xl font-bold text-ink">{step.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-700">{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <MatchPreview />

      <section aria-labelledby="trust-heading" className="rounded-2xl bg-ink p-8 text-white">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-200">Trust first</p>
        <h2 id="trust-heading" className="mt-2 text-3xl font-bold">What ScholarReady promises</h2>
        <ul className="mt-6 grid gap-4 md:grid-cols-2">
          {trustStatements.map((statement) => (
            <li key={statement} className="flex gap-3 text-sm leading-6 text-slate-100">
              <span aria-hidden="true" className="text-xl text-blue-200">✓</span>
              <span>{statement}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
