import { useState } from 'react'
import Dialog from '../common/Dialog'
import { repository } from '../../lib/repository'
import { useAppState } from '../../state/AppStateProvider'

export default function ResetDemoButton() {
  const [open, setOpen] = useState(false)
  const { dispatch } = useAppState()

  function handleConfirm() {
    const resetState = repository.reset()
    dispatch({ type: 'reset', state: resetState })
    setOpen(false)
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="min-h-11 rounded-md border border-slate-300 px-3 text-sm font-semibold text-ink hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2"
      >
        Reset demo data
      </button>
      <Dialog open={open} title="Reset demo data?" onClose={() => setOpen(false)}>
        <p className="text-sm leading-6 text-ink">
          This restores the fictional profile, saved scholarships, checklist statuses and
          recalculated deadlines.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="min-h-11 rounded-md border border-slate-300 px-4 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="min-h-11 rounded-md bg-primary px-4 text-sm font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2"
          >
            Reset demo
          </button>
        </div>
      </Dialog>
    </>
  )
}
