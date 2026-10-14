import { useState } from 'react'
import DemoOnlyDialog from '../components/pricing/DemoOnlyDialog'

const tiers = [
  { name: 'Free', price: 'HK$0', detail: 'Full matching, comparison, checklist, evidence tracker and dashboard. Up to 5 saved scholarships.' },
  { name: 'Seasonal Premium', price: 'HK$38 per season', detail: 'Convenience only: unlimited saved scholarships and deadline reminders in a later phase.' },
  { name: 'Institutional Licence', price: 'Quoted per institution', detail: 'Adviser and institution accounts, cohort readiness view and custom scholarship listings in a later phase.' },
]

export default function PricingPage() {
  const [selectedTier, setSelectedTier] = useState<string | null>(null)
  return <div className="space-y-10"><div><p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">Simple, transparent tiers</p><h1 className="mt-2 text-4xl font-bold tracking-tight text-ink">Pricing</h1><p className="mt-4 max-w-3xl text-lg leading-8 text-slate-700">ScholarReady is a front-end demo. No tier changes the matching rules or scholarship visibility.</p></div><p className="rounded-md bg-blue-50 p-4 text-sm font-bold text-ink">Illustrative pricing (demo)</p><div className="grid gap-5 lg:grid-cols-3">{tiers.map((tier) => <article key={tier.name} className="flex flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm"><h2 className="text-2xl font-bold text-ink">{tier.name}</h2><p className="mt-4 text-2xl font-bold text-primary">{tier.price}</p><p className="mt-4 flex-1 text-sm leading-6 text-slate-700">{tier.detail}</p><button type="button" onClick={() => setSelectedTier(tier.name)} className="mt-6 min-h-11 rounded-md bg-primary px-4 py-2 text-sm font-bold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2">View demo tier</button></article>)}</div><section className="rounded-xl border border-slate-200 bg-slate-50 p-6"><h2 className="text-xl font-bold text-ink">Fairness statement</h2><p className="mt-3 text-sm leading-6 text-slate-700">Paying never affects matching results, eligibility reasons, ordering, scholarship visibility or outcomes. Premium adds convenience only.</p></section>{selectedTier && <DemoOnlyDialog open tierName={selectedTier} onClose={() => setSelectedTier(null)} />}</div>
}
