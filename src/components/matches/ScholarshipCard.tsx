import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { Deadline, MatchResult, Scholarship } from '../../types/models'
import { useAppState } from '../../state/AppStateProvider'
import DeadlineChip from '../common/DeadlineChip'
import MatchGroupBadge from '../common/MatchGroupBadge'
import EligibilityReasonList from './EligibilityReasonList'

interface ScholarshipCardProps {
  scholarship: Scholarship
  match: MatchResult
  deadline?: Deadline
}

export default function ScholarshipCard({ scholarship, match, deadline }: ScholarshipCardProps) {
  const { state, dispatch } = useAppState()
  const [expanded, setExpanded] = useState(false)
  const [notice, setNotice] = useState('')
  const isSaved = state.savedScholarshipIds.includes(scholarship.id)
  const closeDeadline = deadline ?? { date: new Date().toISOString() }

  function toggleSaved() {
    if (!isSaved && state.savedScholarshipIds.length >= 5) {
      setNotice('The free demo saves up to 5 scholarships. Explore Pricing for more options.')
      return
    }
    dispatch({ type: 'saved/toggle', scholarshipId: scholarship.id })
    setNotice(isSaved ? 'Scholarship removed from your saved list.' : 'Scholarship saved.')
  }

  function addToCompare() {
    if (!state.compareIds.includes(scholarship.id) && state.compareIds.length >= 3) {
      setNotice('Compare up to 3 scholarships at a time. Remove one from Compare to add another.')
      return
    }
    dispatch({ type: 'compare/add', scholarshipId: scholarship.id })
    setNotice('Scholarship added to Compare.')
  }

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-600">{scholarship.provider}</p>
          <h3 className="mt-1 text-2xl font-bold text-ink">
            <Link to={`/scholarships/${scholarship.id}`} className="rounded-sm underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">{scholarship.name}</Link>
          </h3>
        </div>
        <MatchGroupBadge group={match.group} />
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-700">{scholarship.summary}</p>
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <span className="text-xl font-bold text-ink">HK${scholarship.amountHKD.toLocaleString('en-HK')}</span>
        <DeadlineChip date={closeDeadline.date} />
        <span className="text-sm font-semibold text-slate-700">{match.metCount} of {match.totalCount} criteria met</span>
      </div>
      <div className="mt-5 flex flex-wrap gap-3">
        <button type="button" onClick={() => setExpanded((current) => !current)} aria-expanded={expanded} className="min-h-11 rounded-md border border-slate-300 px-4 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2">
          {expanded ? 'Hide reasons' : 'Why this match?'}
        </button>
        <button type="button" onClick={toggleSaved} className="min-h-11 rounded-md bg-primary px-4 text-sm font-bold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2">
          {isSaved ? 'Unsave' : 'Save'}
        </button>
        <button type="button" onClick={addToCompare} className="min-h-11 rounded-md border border-primary px-4 text-sm font-bold text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2">
          Add to compare
        </button>
      </div>
      {notice && (
        <p className="mt-4 rounded-md bg-blue-50 p-3 text-sm leading-6 text-ink" role="status">
          {notice}{' '}
          {notice.includes('Pricing') && <Link to="/pricing" className="font-bold underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">View Pricing</Link>}
        </p>
      )}
      {expanded && (
        <div className="mt-6 border-t border-slate-200 pt-5">
          <EligibilityReasonList results={match.results} />
        </div>
      )}
    </article>
  )
}
