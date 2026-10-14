interface ReadinessMeterProps {
  readyCount: number
  totalCount: number
}

export default function ReadinessMeter({ readyCount, totalCount }: ReadinessMeterProps) {
  const safeReadyCount = Math.max(0, Math.min(readyCount, totalCount))
  const label = `${safeReadyCount} of ${totalCount} ready`
  const progress = totalCount > 0 ? (safeReadyCount / totalCount) * 100 : 0

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-4 text-sm font-semibold text-ink">
        <span>{label}</span>
      </div>
      <div
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={totalCount}
        aria-valuenow={safeReadyCount}
        className="h-3 overflow-hidden rounded-full bg-slate-200"
      >
        <div
          className="h-full rounded-full bg-primary transition-[width]"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}
