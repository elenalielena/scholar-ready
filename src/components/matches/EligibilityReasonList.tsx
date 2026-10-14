import type { RuleResult } from '../../types/models'

interface EligibilityReasonListProps {
  results: RuleResult[]
}

const outcomeDetails = {
  met: { icon: '✓', label: 'Meets', className: 'text-success-text' },
  not_met: { icon: '×', label: 'Does not meet', className: 'text-danger-text' },
  check: { icon: '?', label: 'Check', className: 'text-warning-text' },
} as const

export default function EligibilityReasonList({ results }: EligibilityReasonListProps) {
  return (
    <ul className="space-y-3" aria-label="Eligibility reasons">
      {results.map((result) => {
        const detail = outcomeDetails[result.outcome]
        return (
          <li key={result.ruleId} className="flex gap-3 text-sm leading-6">
            <span aria-hidden="true" className={`mt-0.5 font-bold ${detail.className}`}>{detail.icon}</span>
            <span>
              <strong className={detail.className}>{detail.label}:</strong>{' '}
              {result.explanation}
            </span>
          </li>
        )
      })}
    </ul>
  )
}
