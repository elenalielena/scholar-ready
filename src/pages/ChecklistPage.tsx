import { useState } from 'react'
import { seedDocuments, seedScholarships } from '../data/seed'
import DocumentRow from '../components/checklist/DocumentRow'
import EmptyState from '../components/common/EmptyState'
import ReadinessMeter from '../components/common/ReadinessMeter'
import { useAppState } from '../state/AppStateProvider'
import type { DocumentProgress, DocumentStatus } from '../types/models'

export default function ChecklistPage() {
  const { state, dispatch } = useAppState()
  const [statusFilter, setStatusFilter] = useState<DocumentStatus | 'all'>('all')
  const [scholarshipFilter, setScholarshipFilter] = useState('all')
  const savedScholarships = seedScholarships.filter((scholarship) => state.savedScholarshipIds.includes(scholarship.id))

  if (savedScholarships.length === 0) return <EmptyState heading="Your checklist is empty" message="Save a scholarship from Matches to collect its unique application documents here." actionLabel="Find scholarships" actionTo="/matches" />

  const scopedScholarships = scholarshipFilter === 'all' ? savedScholarships : savedScholarships.filter((scholarship) => scholarship.id === scholarshipFilter)
  const documentIds = [...new Set(scopedScholarships.flatMap((scholarship) => scholarship.requiredDocumentIds))]
  const rows = documentIds.map((documentId) => {
    const document = seedDocuments.find((item) => item.id === documentId)
    if (!document) return null
    const usedBy = savedScholarships.filter((scholarship) => scholarship.requiredDocumentIds.includes(documentId))
    const relatedDeadlines = state.deadlines.filter((deadline) => usedBy.some((scholarship) => scholarship.id === deadline.scholarshipId)).sort((a, b) => a.date.localeCompare(b.date))
    const savedProgress = state.documentProgress.find((item) => item.documentId === documentId)
    const progress: DocumentProgress = savedProgress ?? { studentId: state.profile.id, documentId, status: 'not_started', evidenceNote: '', updatedAt: state.seededAt }
    return { document, progress, usedBy, earliestDeadline: relatedDeadlines[0] }
  }).filter((row): row is NonNullable<typeof row> => row !== null)
  const filteredRows = statusFilter === 'all' ? rows : rows.filter((row) => row.progress.status === statusFilter)
  const readyCount = rows.filter((row) => row.progress.status === 'ready').length

  function updateDocument(documentId: string, patch: Pick<DocumentProgress, 'status' | 'evidenceNote'>) {
    dispatch({ type: 'document/update', progress: { studentId: state.profile.id, documentId, ...patch, updatedAt: new Date().toISOString() } })
  }

  return (
    <div className="space-y-8">
      <div><p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">Application preparation</p><h1 className="mt-2 text-4xl font-bold tracking-tight text-ink">Document checklist</h1><p className="mt-4 max-w-3xl text-lg leading-8 text-slate-700">One row per unique document across your saved scholarships.</p></div>
      <section className="rounded-xl border border-blue-100 bg-blue-50 p-5"><ReadinessMeter readyCount={readyCount} totalCount={rows.length} /></section>
      <fieldset className="grid gap-4 rounded-xl border border-slate-200 bg-slate-50 p-5 md:grid-cols-2"><legend className="px-2 text-lg font-bold text-ink">Filter checklist</legend><div><label htmlFor="checklist-status" className="block text-sm font-bold text-ink">Status</label><select id="checklist-status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as DocumentStatus | 'all')} className="mt-2 min-h-11 w-full rounded-md border border-slate-300 bg-white px-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"><option value="all">All statuses</option><option value="not_started">Not started</option><option value="in_progress">In progress</option><option value="ready">Ready</option></select></div><div><label htmlFor="checklist-scholarship" className="block text-sm font-bold text-ink">Scholarship</label><select id="checklist-scholarship" value={scholarshipFilter} onChange={(event) => setScholarshipFilter(event.target.value)} className="mt-2 min-h-11 w-full rounded-md border border-slate-300 bg-white px-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"><option value="all">All saved scholarships</option>{savedScholarships.map((scholarship) => <option key={scholarship.id} value={scholarship.id}>{scholarship.name}</option>)}</select></div></fieldset>
      <div className="space-y-5">{filteredRows.length > 0 ? filteredRows.map(({ document, progress, usedBy, earliestDeadline }) => <DocumentRow key={document.id} document={document} progress={progress} usedBy={usedBy} earliestDeadline={earliestDeadline} onUpdate={(patch) => updateDocument(document.id, patch)} />) : <p className="rounded-lg border border-dashed border-slate-300 p-6 text-sm text-slate-600">No documents match this filter.</p>}</div>
    </div>
  )
}
