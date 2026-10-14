import type { MatchGroup } from '../../types/models'

interface MatchGroupBadgeProps {
  group: MatchGroup
}

const groupDetails: Record<MatchGroup, { icon: string; label: string; className: string }> = {
  eligible: {
    icon: '✓',
    label: 'Eligible',
    className: 'border-green-200 bg-green-50 text-success-text',
  },
  partial: {
    icon: '!',
    label: 'Partial match',
    className: 'border-amber-200 bg-amber-50 text-warning-text',
  },
  not_eligible: {
    icon: '×',
    label: 'Not eligible',
    className: 'border-red-200 bg-red-50 text-danger-text',
  },
}

export default function MatchGroupBadge({ group }: MatchGroupBadgeProps) {
  const detail = groupDetails[group]
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-bold ${detail.className}`}
    >
      <span aria-hidden="true">{detail.icon}</span>
      {detail.label}
    </span>
  )
}
