import EmptyState from '../components/common/EmptyState'

export default function NotFoundPage() {
  return <EmptyState heading="Page not found" message="We could not find that ScholarReady page. Try returning to your dashboard." actionLabel="Go to dashboard" actionTo="/dashboard" />
}
