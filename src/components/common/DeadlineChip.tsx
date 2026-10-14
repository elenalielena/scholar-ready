import { deadlineLabel } from '../../lib/deadlines'

interface DeadlineChipProps {
  date: string
  today?: Date
}

export default function DeadlineChip({ date, today }: DeadlineChipProps) {
  return (
    <span className="inline-flex items-center rounded-md border border-slate-200 bg-slate-50 px-3 py-1 text-sm font-medium text-ink">
      {deadlineLabel(date, today)}
    </span>
  )
}
