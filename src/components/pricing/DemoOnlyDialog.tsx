import Dialog from '../common/Dialog'

interface DemoOnlyDialogProps {
  open: boolean
  tierName: string
  onClose: () => void
}

export default function DemoOnlyDialog({ open, tierName, onClose }: DemoOnlyDialogProps) {
  return <Dialog open={open} title={`${tierName} — demo only`} onClose={onClose}><p className="text-sm leading-6 text-ink">Payments are not available in this demo. No charge has been made.</p><div className="mt-6 flex justify-end"><button type="button" onClick={onClose} className="min-h-11 rounded-md bg-primary px-4 py-2 text-sm font-bold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2">Close</button></div></Dialog>
}
