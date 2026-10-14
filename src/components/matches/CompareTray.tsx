import { Link } from 'react-router-dom'
import { seedScholarships } from '../../data/seed'
import { useAppState } from '../../state/AppStateProvider'

export default function CompareTray() {
  const { state, dispatch } = useAppState()
  if (state.compareIds.length === 0) return null

  const selected = state.compareIds
    .map((id) => seedScholarships.find((scholarship) => scholarship.id === id))
    .filter((scholarship): scholarship is (typeof seedScholarships)[number] => Boolean(scholarship))

  return (
    <aside className="sticky bottom-4 z-30 rounded-xl border border-blue-200 bg-blue-50 p-4 shadow-lg" aria-label="Compare tray">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-bold text-ink">Compare ({selected.length} of 3)</h2>
          <p className="text-sm text-slate-700">Add up to three scholarships side by side.</p>
        </div>
        <Link to="/compare" className="min-h-11 rounded-md bg-primary px-4 py-2 text-sm font-bold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2">Open compare</Link>
      </div>
      <ul className="mt-3 flex flex-wrap gap-2">
        {selected.map((scholarship) => (
          <li key={scholarship.id} className="flex items-center gap-2 rounded-md bg-white px-3 py-2 text-sm">
            <span>{scholarship.name}</span>
            <button type="button" onClick={() => dispatch({ type: 'compare/remove', scholarshipId: scholarship.id })} aria-label={`Remove ${scholarship.name} from compare`} className="font-bold text-danger-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">×</button>
          </li>
        ))}
      </ul>
    </aside>
  )
}
