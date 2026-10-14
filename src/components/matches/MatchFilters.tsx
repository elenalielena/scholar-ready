import type { AwardType } from '../../types/models'

export interface MatchFilterValues {
  awardType: AwardType | 'all'
  minimumAmount: number
  deadlineDays: 14 | 30 | 60 | 'all'
  sort: 'deadline' | 'amount' | 'name'
}

interface MatchFiltersProps {
  value: MatchFilterValues
  onChange: (value: MatchFilterValues) => void
}

const awardTypes: { value: AwardType | 'all'; label: string }[] = [
  { value: 'all', label: 'All award types' },
  { value: 'merit', label: 'Merit' },
  { value: 'need_based', label: 'Need-based' },
  { value: 'leadership', label: 'Leadership' },
  { value: 'community', label: 'Community' },
  { value: 'sports', label: 'Sports' },
  { value: 'arts', label: 'Arts' },
]

export default function MatchFilters({ value, onChange }: MatchFiltersProps) {
  return (
    <fieldset className="rounded-xl border border-slate-200 bg-slate-50 p-5">
      <legend className="px-2 text-lg font-bold text-ink">Filter and sort matches</legend>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <label htmlFor="award-type" className="block text-sm font-bold text-ink">Award type</label>
          <select id="award-type" value={value.awardType} onChange={(event) => onChange({ ...value, awardType: event.target.value as MatchFilterValues['awardType'] })} className="mt-2 min-h-11 w-full rounded-md border border-slate-300 bg-white px-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
            {awardTypes.map((type) => <option key={type.value} value={type.value}>{type.label}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="minimum-amount" className="block text-sm font-bold text-ink">Minimum amount (HKD)</label>
          <input id="minimum-amount" type="number" min="0" step="1000" value={value.minimumAmount} onChange={(event) => onChange({ ...value, minimumAmount: Number(event.target.value) })} className="mt-2 min-h-11 w-full rounded-md border border-slate-300 bg-white px-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus" />
        </div>
        <div>
          <label htmlFor="deadline-days" className="block text-sm font-bold text-ink">Deadline within</label>
          <select id="deadline-days" value={value.deadlineDays} onChange={(event) => onChange({ ...value, deadlineDays: event.target.value === 'all' ? 'all' : Number(event.target.value) as 14 | 30 | 60 })} className="mt-2 min-h-11 w-full rounded-md border border-slate-300 bg-white px-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
            <option value="all">Any deadline</option><option value="14">14 days</option><option value="30">30 days</option><option value="60">60 days</option>
          </select>
        </div>
        <div>
          <label htmlFor="match-sort" className="block text-sm font-bold text-ink">Sort</label>
          <select id="match-sort" value={value.sort} onChange={(event) => onChange({ ...value, sort: event.target.value as MatchFilterValues['sort'] })} className="mt-2 min-h-11 w-full rounded-md border border-slate-300 bg-white px-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
            <option value="deadline">Deadline soonest</option><option value="amount">Amount highest</option><option value="name">Name A to Z</option>
          </select>
        </div>
      </div>
    </fieldset>
  )
}
