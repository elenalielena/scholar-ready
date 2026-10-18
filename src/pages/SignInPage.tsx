import { Link } from 'react-router-dom'
import { useAppState } from '../state/AppStateProvider'

export default function SignInPage() {
  const { state } = useAppState()
  const demoTarget = state.profileSavedAt ? '/dashboard' : '/profile'

  return (
    <div className="space-y-10">
      <div className="max-w-3xl">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">Demo access</p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-ink">Sign in</h1>
        <p className="mt-4 text-lg leading-8 text-slate-700">
          Accounts are not available in this demo. Continue with the fictional demo account to try every feature.
        </p>
      </div>

      <section className="max-w-2xl rounded-2xl border border-blue-100 bg-blue-50 p-8 shadow-sm" aria-labelledby="demo-account-heading">
        <h2 id="demo-account-heading" className="text-2xl font-bold text-ink">
          Continue with the demo account
        </h2>
        <p className="mt-3 leading-7 text-slate-700">
          No account details are needed. This fictional account uses the demo profile already stored in this browser.
        </p>
        <Link
          to={demoTarget}
          className="mt-6 inline-flex min-h-12 items-center rounded-md bg-primary px-5 py-3 font-bold text-white shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2"
        >
          Continue with the demo account
        </Link>
      </section>

      <section className="max-w-2xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm" aria-labelledby="create-account-heading">
        <h2 id="create-account-heading" className="text-xl font-bold text-ink">
          Create an account
        </h2>
        <p className="mt-2 leading-7 text-slate-700">
          Sign-up, sign-in and password reset will be added in a later release.
        </p>
      </section>
    </div>
  )
}
