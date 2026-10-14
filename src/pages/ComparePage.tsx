import EmptyState from '../components/common/EmptyState'
import { seedDocuments, seedRules, seedScholarships } from '../data/seed'
import { evaluateMatch } from '../lib/eligibility'
import { useAppState } from '../state/AppStateProvider'
import MatchGroupBadge from '../components/common/MatchGroupBadge'
import DeadlineChip from '../components/common/DeadlineChip'

export default function ComparePage() {
  const { state, dispatch } = useAppState()
  const scholarships = state.compareIds.map((id) => seedScholarships.find((item) => item.id === id)).filter((item): item is (typeof seedScholarships)[number] => Boolean(item))

  if (scholarships.length === 0) {
    return <EmptyState heading="Nothing to compare yet" message="Choose up to three scholarships from Matches to see their criteria, documents and deadlines side by side." actionLabel="Browse matches" actionTo="/matches" />
  }

  const comparisons = scholarships.map((scholarship) => {
    const match = evaluateMatch(state.profile, scholarship.id, seedRules)
    const documents = scholarship.requiredDocumentIds.map((id) => seedDocuments.find((item) => item.id === id)?.name).filter(Boolean).join(', ')
    const deadlines = state.deadlines.filter((item) => item.scholarshipId === scholarship.id).sort((a, b) => a.date.localeCompare(b.date))
    return { scholarship, match, documents, deadlines }
  })
  const criteria = [...new Set(comparisons.flatMap(({ match }) => match.results.map((result) => result.ruleId)))]

  return (
    <div className="space-y-8">
      <div><p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">Side by side</p><h1 className="mt-2 text-4xl font-bold tracking-tight text-ink">Compare scholarships</h1><p className="mt-4 text-lg leading-8 text-slate-700">Compare up to three fictional scholarships using the same criteria and preparation details.</p></div>
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-[760px] w-full border-collapse text-left text-sm">
          <caption className="border-b border-slate-200 p-5 text-left text-lg font-bold text-ink">Scholarship comparison</caption>
          <thead className="bg-slate-50"><tr><th scope="col" className="w-48 p-4 font-bold text-ink">Detail</th>{comparisons.map(({ scholarship }) => <th scope="col" key={scholarship.id} className="min-w-56 p-4 align-top"><div className="text-base font-bold text-ink">{scholarship.name}</div><button type="button" onClick={() => dispatch({ type: 'compare/remove', scholarshipId: scholarship.id })} className="mt-3 rounded-sm text-xs font-bold text-danger-text underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">Remove</button></th>)}</tr></thead>
          <tbody className="divide-y divide-slate-200">
            <tr><th scope="row" className="p-4 font-bold text-ink">Amount</th>{comparisons.map(({ scholarship }) => <td key={scholarship.id} className="p-4 font-bold">HK${scholarship.amountHKD.toLocaleString('en-HK')}</td>)}</tr>
            <tr><th scope="row" className="p-4 font-bold text-ink">Provider</th>{comparisons.map(({ scholarship }) => <td key={scholarship.id} className="p-4">{scholarship.provider}</td>)}</tr>
            <tr><th scope="row" className="p-4 font-bold text-ink">Award type</th>{comparisons.map(({ scholarship }) => <td key={scholarship.id} className="p-4">{scholarship.awardType.replace('_', ' ')}</td>)}</tr>
            <tr><th scope="row" className="p-4 font-bold text-ink">Match group</th>{comparisons.map(({ scholarship, match }) => <td key={scholarship.id} className="p-4"><MatchGroupBadge group={match.group} /></td>)}</tr>
            <tr><th scope="row" className="p-4 font-bold text-ink">Criteria met</th>{comparisons.map(({ scholarship, match }) => <td key={scholarship.id} className="p-4">{match.metCount} of {match.totalCount}</td>)}</tr>
            {criteria.map((criterion) => <tr key={criterion}><th scope="row" className="p-4 font-bold text-ink">Criterion {criterion}</th>{comparisons.map(({ scholarship, match }) => <td key={scholarship.id} className="p-4">{match.results.find((result) => result.ruleId === criterion)?.explanation ?? 'Not applicable'}</td>)}</tr>)}
            <tr><th scope="row" className="p-4 font-bold text-ink">Documents</th>{comparisons.map(({ scholarship, documents }) => <td key={scholarship.id} className="p-4">{documents}</td>)}</tr>
            <tr><th scope="row" className="p-4 font-bold text-ink">Deadlines</th>{comparisons.map(({ scholarship, deadlines }) => <td key={scholarship.id} className="space-y-2 p-4">{deadlines.map((deadline) => <div key={deadline.id}><span className="font-semibold">{deadline.label}</span><br /><DeadlineChip date={deadline.date} /></div>)}</td>)}</tr>
            <tr><th scope="row" className="p-4 font-bold text-ink">Renewable</th>{comparisons.map(({ scholarship }) => <td key={scholarship.id} className="p-4">{scholarship.renewable ? 'Yes' : 'No'}</td>)}</tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
