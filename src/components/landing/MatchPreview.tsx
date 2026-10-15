import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { seedRules, seedScholarships } from '../../data/seed'
import { evaluateMatch } from '../../lib/eligibility'
import { useAppState } from '../../state/AppStateProvider'
import MatchGroupBadge from '../common/MatchGroupBadge'

export default function MatchPreview() {
  const { state } = useAppState()
  const preview = useMemo(() => {
    return seedScholarships
      .map((scholarship) => {
        const match = evaluateMatch(state.profile, scholarship.id, seedRules)
        const deadline = state.deadlines.find(
          (item) => item.scholarshipId === scholarship.id && item.type === 'application_close',
        )
        return { scholarship, match, deadline }
      })
      .filter(({ match }) => match.group === 'eligible')
      .sort((a, b) => (a.deadline?.date ?? '').localeCompare(b.deadline?.date ?? ''))[0]
  }, [state.deadlines, state.profile])

  return (
    <section aria-labelledby="match-preview-heading" className="rounded-2xl border border-blue-100 bg-blue-50 p-8 shadow-sm">
      <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">Example match (demo data)</p>
      <h2 id="match-preview-heading" className="mt-2 text-3xl font-bold text-ink">A clear next match</h2>
      {preview ? (
        <article className="mt-6 rounded-xl border border-slate-200 bg-white p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-slate-600">{preview.scholarship.provider}</p>
              <h3 className="mt-1 text-2xl font-bold text-ink">{preview.scholarship.name}</h3>
            </div>
            <MatchGroupBadge group={preview.match.group} />
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-4">
            <span className="text-xl font-bold text-ink">HK${preview.scholarship.amountHKD.toLocaleString('en-HK')}</span>
            <span className="text-sm font-semibold text-slate-700">{preview.match.metCount} of {preview.match.totalCount} criteria met</span>
          </div>
        </article>
      ) : (
        <p className="mt-6 rounded-xl border border-slate-200 bg-white p-6 text-sm leading-6 text-slate-700">
          Update your profile to see an example match.
        </p>
      )}
      <Link
        to="/matches"
        className="mt-6 inline-flex min-h-11 items-center rounded-md border border-primary px-4 py-2 font-bold text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2"
      >
        See all matches
      </Link>
    </section>
  )
}
