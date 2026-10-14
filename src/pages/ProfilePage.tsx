import ProfileForm from '../components/profile/ProfileForm'
import { useAppState } from '../state/AppStateProvider'

export default function ProfilePage() {
  const { state } = useAppState()
  return (
    <div>
      <div className="mb-10 max-w-3xl">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">Your demo profile</p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-ink">Build your profile</h1>
        <p className="mt-4 text-lg leading-8 text-slate-700">
          Review the fictional student profile and edit the details used to compare published scholarship criteria.
        </p>
      </div>
      <ProfileForm key={state.profile.updatedAt} profile={state.profile} />
    </div>
  )
}
