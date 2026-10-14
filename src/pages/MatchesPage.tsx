import { useMemo, useState } from 'react'
import { seedRules, seedScholarships } from '../data/seed'
import ScholarshipCard from '../components/matches/ScholarshipCard'
import CompareTray from '../components/matches/CompareTray'
import MatchFilters, { type MatchFilterValues } from '../components/matches/MatchFilters'
import { evaluateMatch } from '../lib/eligibility'
import { useAppState } from '../state/AppStateProvider'
import type { MatchGroup } from '../types/models'

const groupOrder: { key: MatchGroup; title: string; description: string }[] = [
  { key: 'eligible', title: 'Eligible', description: 'Every published criterion is met from the current profile.' },
  { key: 'partial', title: 'Partial match', description: 'Some criteria need checking or supporting evidence.' },
  { key: 'not_eligible', title: 'Not eligible', description: 'At least one published criterion is not met.' },
]

const initialFilters: MatchFilterValues = { awardType: 'all', minimumAmount: 0, deadlineDays: 'all', sort: 'deadline' }

export default function MatchesPage() {
  const { state } = useAppState()
  const [filters, setFilters] = useState(initialFilters)

  const results = useMemo(() => {
    const today = new Date(state.seededAt)
    const matches = seedScholarships.map((scholarship) => {
      const match = evaluateMatch(state.profile, scholarship.id, seedRules)
      const deadline = state.deadlines.find((item) => item.scholarshipId === scholarship.id && item.type === 'application_close')
      return { scholarship, match, deadline }
    })
    const filtered = matches.filter(({ scholarship, deadline }) => {
      if (filters.awardType !== 'all' && scholarship.awardType !== filters.awardType) return false
      if (scholarship.amountHKD < filters.minimumAmount) return false
      if (filters.deadlineDays !== 'all' && deadline) {
        const remaining = Math.ceil((new Date(`${deadline.date}T00:00:00`).getTime() - today.getTime()) / 86400000)
        if (remaining > filters.deadlineDays || remaining < 0) return false
      }
      return true
    })
    return filtered.sort((a, b) => {
      if (filters.sort === 'amount') return b.scholarship.amountHKD - a.scholarship.amountHKD
      if (filters.sort === 'name') return a.scholarship.name.localeCompare(b.scholarship.name)
      return (a.deadline?.date ?? '').localeCompare(b.deadline?.date ?? '')
    })
  }, [filters, state.profile, state.seededAt, state.deadlines])

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">Rule-based matches</p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-ink">Scholarship matches</h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-700">Review what your current profile meets, what needs checking and what does not meet the fictional published criteria.</p>
      </div>
      <aside className="rounded-xl border border-blue-100 bg-blue-50 p-5 text-sm leading-6 text-ink" aria-label="How matching works">
        <strong>How matching works:</strong> ScholarReady applies each scholarship&apos;s fictional published rules to your profile. It never predicts an award outcome.
      </aside>
      <MatchFilters value={filters} onChange={setFilters} />
      <div className="space-y-10">
        {groupOrder.map((group) => {
          const groupResults = results.filter((result) => result.match.group === group.key)
          return (
            <section key={group.key} aria-labelledby={`${group.key}-heading`}>
              <div className="mb-4 flex items-end justify-between gap-4">
                <div><h2 id={`${group.key}-heading`} className="text-2xl font-bold text-ink">{group.title}</h2><p className="mt-1 text-sm text-slate-600">{group.description}</p></div>
                <span className="text-sm font-semibold text-slate-600">{groupResults.length} scholarships</span>
              </div>
              {groupResults.length > 0 ? <div className="grid gap-5">{groupResults.map(({ scholarship, match, deadline }) => <ScholarshipCard key={scholarship.id} scholarship={scholarship} match={match} deadline={deadline} />)}</div> : <p className="rounded-lg border border-dashed border-slate-300 p-6 text-sm text-slate-600">No scholarships match these filters.</p>}
            </section>
          )
        })}
      </div>
      <CompareTray />
    </div>
  )
}
