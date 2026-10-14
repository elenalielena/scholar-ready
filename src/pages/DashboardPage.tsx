import EmptyState from '../components/common/EmptyState'
import ReadinessMeter from '../components/common/ReadinessMeter'
import DeadlineList from '../components/dashboard/DeadlineList'
import { seedDocuments, seedScholarships } from '../data/seed'
import { useAppState } from '../state/AppStateProvider'
import { Link } from 'react-router-dom'

function ReadinessCard({ scholarshipId, requiredDocumentIds }: { scholarshipId: string; requiredDocumentIds: string[] }) {
  const { state } = useAppState()
  const readyCount = requiredDocumentIds.filter((id) => state.documentProgress.find((item) => item.documentId === id)?.status === 'ready').length
  const scholarship = seedScholarships.find((item) => item.id === scholarshipId)
  return <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="text-lg font-bold text-ink">{scholarship?.name}</h2><p className="mt-1 text-sm text-slate-600">{scholarship?.provider}</p></div><Link to={`/scholarships/${scholarshipId}`} className="text-sm font-bold text-primary underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">View details</Link></div><div className="mt-5"><ReadinessMeter readyCount={readyCount} totalCount={requiredDocumentIds.length} /></div></article>
}

function SavedScholarshipsPanel() {
  const { state, dispatch } = useAppState()
  const saved = seedScholarships.filter((scholarship) => state.savedScholarshipIds.includes(scholarship.id))
  return <section aria-labelledby="saved-scholarships-heading"><div className="flex items-end justify-between gap-4"><h2 id="saved-scholarships-heading" className="text-2xl font-bold text-ink">Saved scholarships</h2><Link to="/matches" className="text-sm font-bold text-primary underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">Find more</Link></div><div className="mt-4 space-y-4">{saved.map((scholarship) => <div key={scholarship.id} className="rounded-xl border border-slate-200 bg-white p-5"><div className="flex flex-wrap items-start justify-between gap-3"><div><h3 className="font-bold text-ink">{scholarship.name}</h3><p className="mt-1 text-sm text-slate-600">HK${scholarship.amountHKD.toLocaleString('en-HK')}</p></div><button type="button" onClick={() => dispatch({ type: 'saved/toggle', scholarshipId: scholarship.id })} className="text-sm font-bold text-danger-text underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">Unsave</button></div><div className="mt-4"><ReadinessCard scholarshipId={scholarship.id} requiredDocumentIds={scholarship.requiredDocumentIds} /></div></div>)}</div></section>
}

function NextActionsPanel() {
  const { state } = useAppState()
  const actions: { label: string; detail: string; to: string }[] = []
  const saved = seedScholarships.filter((scholarship) => state.savedScholarshipIds.includes(scholarship.id))
  for (const scholarship of saved) {
    const nextDocument = scholarship.requiredDocumentIds.find((id) => state.documentProgress.find((item) => item.documentId === id)?.status !== 'ready')
    if (nextDocument) {
      const document = seedDocuments.find((item) => item.id === nextDocument)
      actions.push({ label: `Prepare ${document?.name ?? 'a required document'}`, detail: `Needed for ${scholarship.name}.`, to: '/checklist' })
    }
    if (actions.length >= 3) break
  }
  return <section aria-labelledby="next-actions-heading" className="rounded-xl border border-blue-100 bg-blue-50 p-6"><h2 id="next-actions-heading" className="text-2xl font-bold text-ink">Next actions</h2>{actions.length > 0 ? <ol className="mt-4 space-y-3">{actions.slice(0, 3).map((action) => <li key={`${action.label}-${action.detail}`} className="flex gap-3"><span className="font-bold text-primary">→</span><div><Link to={action.to} className="font-bold text-primary underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">{action.label}</Link><p className="text-sm text-slate-700">{action.detail}</p></div></li>)}</ol> : <p className="mt-3 text-sm text-slate-700">You are up to date on the current saved scholarships.</p>}</section>
}

export default function DashboardPage() {
  const { state } = useAppState()
  const savedScholarships = seedScholarships.filter((scholarship) => state.savedScholarshipIds.includes(scholarship.id))
  if (savedScholarships.length === 0) return <EmptyState heading="Your dashboard is ready when you are" message="Save scholarships from Matches to see deadlines, document readiness and next actions here." actionLabel="Browse matches" actionTo="/matches" />
  const savedDeadlines = state.deadlines.filter((deadline) => state.savedScholarshipIds.includes(deadline.scholarshipId))
  return <div className="space-y-10"><div><p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">Your preparation overview</p><h1 className="mt-2 text-4xl font-bold tracking-tight text-ink">Dashboard</h1><p className="mt-4 max-w-3xl text-lg leading-8 text-slate-700">Keep the next deadline and document task in view.</p></div><section aria-labelledby="deadlines-heading"><h2 id="deadlines-heading" className="text-2xl font-bold text-ink">Deadlines</h2><div className="mt-4"><DeadlineList deadlines={savedDeadlines} today={new Date(state.seededAt)} /></div></section><SavedScholarshipsPanel /><NextActionsPanel /></div>
}
