import { seedScholarships } from '../../data/seed'
import { splitDeadlines } from '../../lib/deadlines'
import DeadlineChip from '../common/DeadlineChip'
import { Link } from 'react-router-dom'
import type { Deadline } from '../../types/models'

interface DeadlineListProps {
  deadlines: Deadline[]
  today?: Date
}

export default function DeadlineList({ deadlines, today = new Date() }: DeadlineListProps) {
  const groups = splitDeadlines(deadlines, today)
  function scholarshipName(id: string) {
    return seedScholarships.find((scholarship) => scholarship.id === id)?.name ?? 'Scholarship'
  }
  function group(title: string, items: Deadline[]) {
    return <section aria-labelledby={`${title.toLowerCase()}-deadlines-heading`}><h2 id={`${title.toLowerCase()}-deadlines-heading`} className="text-xl font-bold text-ink">{title}</h2>{items.length > 0 ? <ol className="mt-3 space-y-3">{items.map((deadline) => <li key={deadline.id} className="rounded-lg border border-slate-200 bg-white p-4"><p className="font-bold text-ink">{deadline.label}</p><Link to={`/scholarships/${deadline.scholarshipId}`} className="mt-1 inline-block text-sm font-semibold text-primary underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">{scholarshipName(deadline.scholarshipId)}</Link><div className="mt-2"><DeadlineChip date={deadline.date} today={today} /></div></li>)}</ol> : <p className="mt-3 rounded-lg border border-dashed border-slate-300 p-4 text-sm text-slate-600">No {title.toLowerCase()} deadlines.</p>}</section>
  }
  return <div className="space-y-8">{group('Upcoming', groups.upcoming)}{group('Passed', groups.passed)}</div>
}
