import type { Deadline, DocumentItem, DocumentProgress, Scholarship } from '../../types/models'
import { Link } from 'react-router-dom'

interface DocumentRowProps {
  document: DocumentItem
  progress: DocumentProgress
  usedBy: Scholarship[]
  earliestDeadline?: Deadline
  onUpdate: (patch: Pick<DocumentProgress, 'status' | 'evidenceNote'>) => void
}

export default function DocumentRow({ document, progress, usedBy, earliestDeadline, onUpdate }: DocumentRowProps) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div><h2 className="text-lg font-bold text-ink">{document.name}</h2><p className="mt-1 text-sm leading-6 text-slate-700">{document.description}</p></div>
        <div>
          <label htmlFor={`status-${document.id}`} className="block text-xs font-bold uppercase tracking-wide text-slate-600">Status</label>
          <select id={`status-${document.id}`} value={progress.status} onChange={(event) => onUpdate({ status: event.target.value as DocumentProgress['status'], evidenceNote: progress.evidenceNote })} className="mt-1 min-h-11 rounded-md border border-slate-300 bg-white px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
            <option value="not_started">Not started</option><option value="in_progress">In progress</option><option value="ready">Ready</option>
          </select>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2 text-sm"><span className="font-semibold text-slate-600">Used by:</span>{usedBy.map((scholarship) => <Link key={scholarship.id} to={`/scholarships/${scholarship.id}`} className="rounded-full bg-blue-50 px-3 py-1 font-semibold text-primary underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">{scholarship.name.replace(/ Scholarship| Award| Grant| Bursary| Fellowship/g, '')}</Link>)}</div>
      <div className="mt-4"><label htmlFor={`evidence-${document.id}`} className="block text-sm font-bold text-ink">Evidence note</label><textarea id={`evidence-${document.id}`} value={progress.evidenceNote} maxLength={280} onChange={(event) => onUpdate({ status: progress.status, evidenceNote: event.target.value.slice(0, 280) })} rows={3} className="mt-2 w-full rounded-md border border-slate-300 p-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus" /><p className="mt-1 text-right text-xs text-slate-600" aria-live="polite">{progress.evidenceNote.length} / 280</p></div>
      <p className="mt-3 text-xs text-slate-600">Last updated: {new Date(progress.updatedAt).toLocaleDateString('en-GB')}{earliestDeadline ? ` · Earliest related deadline: ${new Date(`${earliestDeadline.date}T00:00:00`).toLocaleDateString('en-GB')}` : ''}</p>
    </article>
  )
}
