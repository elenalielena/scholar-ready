import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { seedDocuments, seedRules, seedScholarships } from '../data/seed'
import { useAppState } from '../state/AppStateProvider'
import { evaluateMatch } from '../lib/eligibility'
import DeadlineChip from '../components/common/DeadlineChip'
import MatchGroupBadge from '../components/common/MatchGroupBadge'
import EligibilityReasonList from '../components/matches/EligibilityReasonList'

export default function ScholarshipDetailPage() {
  const { id: scholarshipId } = useParams<{ id: string }>()
  const { state, dispatch } = useAppState()
  const [notice, setNotice] = useState('')
  const scholarship = seedScholarships.find((item) => item.id === scholarshipId)

  if (!scholarship) {
    return (
      <section className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
        <h1 className="text-3xl font-bold text-ink">Scholarship not found</h1>
        <p className="mt-3 text-slate-700">That fictional scholarship is not in the demo catalogue.</p>
        <Link to="/matches" className="mt-6 inline-flex min-h-11 items-center rounded-md bg-primary px-4 py-2 font-bold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2">Back to matches</Link>
      </section>
    )
  }

  const match = evaluateMatch(state.profile, scholarship.id, seedRules)
  const deadlines = state.deadlines.filter((deadline) => deadline.scholarshipId === scholarship.id).sort((a, b) => a.date.localeCompare(b.date))
  const documents = scholarship.requiredDocumentIds.map((id) => {
    const document = seedDocuments.find((item) => item.id === id)
    const progress = state.documentProgress.find((item) => item.documentId === id)
    return { document, progress }
  }).filter((item): item is { document: (typeof seedDocuments)[number]; progress: (typeof state.documentProgress)[number] | undefined } => Boolean(item.document))
  const isSaved = state.savedScholarshipIds.includes(scholarship.id)

  function toggleSaved() {
    if (!isSaved && state.savedScholarshipIds.length >= 5) {
      setNotice('The free demo saves up to 5 scholarships. Visit Pricing for more options.')
      return
    }
    dispatch({ type: 'saved/toggle', scholarshipId: scholarship!.id })
    setNotice(isSaved ? 'Scholarship removed from your saved list.' : 'Scholarship saved.')
  }

  return (
    <div className="space-y-8">
      <Link to="/matches" className="inline-flex rounded-sm text-sm font-bold text-primary underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">← Back to matches</Link>
      <header className="rounded-2xl bg-ink p-8 text-white">
        <p className="text-sm font-semibold text-blue-200">{scholarship.provider}</p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight">{scholarship.name}</h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-100">{scholarship.description}</p>
        <div className="mt-6 flex flex-wrap items-center gap-3"><span className="text-2xl font-bold">HK${scholarship.amountHKD.toLocaleString('en-HK')}</span><MatchGroupBadge group={match.group} /></div>
        <p className="mt-5"><span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-sm font-bold text-blue-950">Fictional provider (demo)</span></p>
      </header>
      <section aria-labelledby="detail-criteria-heading" className="rounded-xl border border-slate-200 p-6"><h2 id="detail-criteria-heading" className="text-2xl font-bold text-ink">Criteria and reasons</h2><p className="mt-2 text-sm font-semibold text-slate-700">{match.metCount} of {match.totalCount} criteria met</p><div className="mt-5"><EligibilityReasonList results={match.results} /></div></section>
      <section aria-labelledby="detail-documents-heading" className="rounded-xl border border-slate-200 p-6"><h2 id="detail-documents-heading" className="text-2xl font-bold text-ink">Required documents</h2><ul className="mt-5 divide-y divide-slate-200">{documents.map(({ document, progress }) => <li key={document.id} className="flex flex-wrap items-center justify-between gap-3 py-4 first:pt-0 last:pb-0"><div><h3 className="font-bold text-ink">{document.name}</h3><p className="mt-1 text-sm text-slate-700">{document.description}</p></div><span className={`rounded-full px-3 py-1 text-sm font-bold ${progress?.status === 'ready' ? 'bg-green-50 text-success-text' : 'bg-slate-100 text-slate-700'}`}>{progress?.status === 'ready' ? 'Ready' : progress?.status === 'in_progress' ? 'In progress' : 'Not started'}</span></li>)}</ul></section>
      <section aria-labelledby="detail-deadlines-heading" className="rounded-xl border border-slate-200 p-6"><h2 id="detail-deadlines-heading" className="text-2xl font-bold text-ink">Deadline timeline</h2><ol className="mt-5 space-y-4 border-l-2 border-blue-200 pl-5">{deadlines.map((deadline) => <li key={deadline.id}><p className="font-bold text-ink">{deadline.label}</p><div className="mt-1 flex flex-wrap items-center gap-3"><DeadlineChip date={deadline.date} /><span className="text-sm text-slate-600">{deadline.type.replace('_', ' ')}</span></div></li>)}</ol></section>
      <div className="flex flex-wrap items-center gap-4"><button type="button" onClick={toggleSaved} className="min-h-12 rounded-md bg-primary px-5 py-3 font-bold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2">{isSaved ? 'Unsave scholarship' : 'Save scholarship'}</button>{notice && <p role="status" className="rounded-md bg-blue-50 p-3 text-sm text-ink">{notice}{notice.includes('Pricing') && <Link to="/pricing" className="ml-1 font-bold underline">Pricing</Link>}</p>}</div>
    </div>
  )
}
