import { useRef, useState } from 'react'
import type { FormEvent } from 'react'
import type { ActivityTag, Faculty, StudentProfile } from '../../types/models'
import { useAppState } from '../../state/AppStateProvider'
import LiveRegion from '../common/LiveRegion'
import PdpoStatement from './PdpoStatement'

const faculties: Faculty[] = [
  'Arts',
  'Business',
  'Education',
  'Engineering',
  'Law',
  'Medicine',
  'Science',
  'Social Science',
]

const activityOptions: { value: ActivityTag; label: string }[] = [
  { value: 'community_service', label: 'Community service' },
  { value: 'leadership', label: 'Leadership' },
  { value: 'sports', label: 'Sports' },
  { value: 'arts', label: 'Arts' },
  { value: 'research', label: 'Research' },
  { value: 'entrepreneurship', label: 'Entrepreneurship' },
  { value: 'exchange', label: 'Exchange' },
]

const languageOptions = ['English', 'Cantonese', 'Putonghua']

type FormValues = StudentProfile

type FormErrors = Partial<Record<'yearOfStudy' | 'faculty' | 'programme' | 'gpa', string>>

export default function ProfileForm({ profile }: { profile: StudentProfile }) {
  const { dispatch } = useAppState()
  const [values, setValues] = useState<FormValues>(profile)
  const [errors, setErrors] = useState<FormErrors>({})
  const [announcement, setAnnouncement] = useState('')
  const errorSummaryRef = useRef<HTMLDivElement>(null)

  function updateValues(patch: Partial<FormValues>) {
    setValues((current) => ({ ...current, ...patch }))
  }

  function validate(): FormErrors {
    const nextErrors: FormErrors = {}
    if (!values.yearOfStudy) nextErrors.yearOfStudy = 'Select your year of study.'
    if (!values.faculty) nextErrors.faculty = 'Select your faculty.'
    if (!values.programme.trim()) nextErrors.programme = 'Enter your programme.'
    if (values.gpa === null || values.gpa < 0 || values.gpa > 4.3) {
      nextErrors.gpa = 'Enter a GPA from 0.00 to 4.30.'
    }
    return nextErrors
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors = validate()
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      requestAnimationFrame(() => errorSummaryRef.current?.focus())
      return
    }

    const updatedProfile = { ...values, updatedAt: new Date().toISOString() }
    dispatch({ type: 'profile/save', profile: updatedProfile })
    setAnnouncement('Profile saved. Matches updated.')
  }

  function toggleActivity(activity: ActivityTag) {
    const activities = values.activities.includes(activity)
      ? values.activities.filter((item) => item !== activity)
      : [...values.activities, activity]
    updateValues({ activities })
  }

  function toggleLanguage(language: string) {
    const languages = values.languages.includes(language)
      ? values.languages.filter((item) => item !== language)
      : [...values.languages, language]
    updateValues({ languages })
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-8">
      {Object.keys(errors).length > 0 && (
        <div
          ref={errorSummaryRef}
          tabIndex={-1}
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 p-4 text-danger-text outline-none"
        >
          <h2 className="font-bold">Please correct the highlighted fields</h2>
          <ul className="mt-2 list-disc pl-5 text-sm">
            {Object.entries(errors).map(([field, message]) => (
              <li key={field}>
                <a className="underline" href={`#${field}`}>
                  {message}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <fieldset className="rounded-xl border border-slate-200 p-6">
        <legend className="px-2 text-xl font-bold text-ink">Study details</legend>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label htmlFor="yearOfStudy" className="block text-sm font-bold text-ink">Year of study</label>
            <p id="yearOfStudy-help" className="mt-1 text-xs text-slate-600">Used to check year-specific criteria.</p>
            <select
              id="yearOfStudy"
              value={values.yearOfStudy}
              onChange={(event) => updateValues({ yearOfStudy: Number(event.target.value) as StudentProfile['yearOfStudy'] })}
              aria-describedby="yearOfStudy-help"
              className="mt-2 min-h-11 w-full rounded-md border border-slate-300 bg-white px-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
            >
              {[1, 2, 3, 4].map((year) => <option key={year} value={year}>Year {year}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="faculty" className="block text-sm font-bold text-ink">Faculty</label>
            <p id="faculty-help" className="mt-1 text-xs text-slate-600">Used for faculty-specific criteria.</p>
            <select
              id="faculty"
              value={values.faculty}
              onChange={(event) => updateValues({ faculty: event.target.value as Faculty })}
              aria-describedby="faculty-help"
              className="mt-2 min-h-11 w-full rounded-md border border-slate-300 bg-white px-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
            >
              {faculties.map((faculty) => <option key={faculty} value={faculty}>{faculty}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="programme" className="block text-sm font-bold text-ink">Programme</label>
            <p id="programme-help" className="mt-1 text-xs text-slate-600">Shown in your demo profile only.</p>
            <input
              id="programme"
              value={values.programme}
              onChange={(event) => updateValues({ programme: event.target.value })}
              aria-describedby={`programme-help${errors.programme ? ' programme-error' : ''}`}
              className="mt-2 min-h-11 w-full rounded-md border border-slate-300 px-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
            />
            {errors.programme && <p id="programme-error" className="mt-1 text-sm text-danger-text">{errors.programme}</p>}
          </div>
          <div>
            <label htmlFor="gpa" className="block text-sm font-bold text-ink">GPA</label>
            <p id="gpa-help" className="mt-1 text-xs text-slate-600">Enter a value from 0.00 to 4.30 for matching.</p>
            <input
              id="gpa"
              type="number"
              min="0"
              max="4.3"
              step="0.01"
              value={values.gpa ?? ''}
              onChange={(event) => updateValues({ gpa: event.target.value === '' ? null : Number(event.target.value) })}
              aria-describedby={`gpa-help${errors.gpa ? ' gpa-error' : ''}`}
              className="mt-2 min-h-11 w-full rounded-md border border-slate-300 px-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
            />
            {errors.gpa && <p id="gpa-error" className="mt-1 text-sm text-danger-text">{errors.gpa}</p>}
          </div>
        </div>
      </fieldset>

      <fieldset className="rounded-xl border border-slate-200 p-6">
        <legend className="px-2 text-xl font-bold text-ink">Background</legend>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <span className="block text-sm font-bold text-ink">Residency</span>
            <p className="mt-1 text-xs text-slate-600">Used for residency criteria.</p>
            <div className="mt-3 flex gap-5">
              {(['local', 'non_local'] as const).map((residency) => (
                <label key={residency} className="flex min-h-11 items-center gap-2 text-sm">
                  <input type="radio" name="residency" checked={values.residency === residency} onChange={() => updateValues({ residency })} />
                  {residency === 'local' ? 'Local' : 'Non-local'}
                </label>
              ))}
            </div>
          </div>
          <div>
            <span className="block text-sm font-bold text-ink">Financial need</span>
            <p className="mt-1 text-xs text-slate-600">Self-declared yes or no only; no figures are collected.</p>
            <div className="mt-3 flex gap-5">
              {[true, false].map((value) => (
                <label key={String(value)} className="flex min-h-11 items-center gap-2 text-sm">
                  <input type="radio" name="financialNeed" checked={values.financialNeedDeclared === value} onChange={() => updateValues({ financialNeedDeclared: value })} />
                  {value ? 'Yes' : 'No'}
                </label>
              ))}
            </div>
          </div>
          <div>
            <label htmlFor="firstGenerationStudent" className="block text-sm font-bold text-ink">First-generation student</label>
            <p id="first-generation-help" className="mt-1 text-xs text-slate-600">Used only where a scholarship asks for it.</p>
            <select
              id="firstGenerationStudent"
              value={values.firstGenerationStudent === null ? '' : String(values.firstGenerationStudent)}
              onChange={(event) => updateValues({ firstGenerationStudent: event.target.value === '' ? null : event.target.value === 'true' })}
              aria-describedby="first-generation-help"
              className="mt-2 min-h-11 w-full rounded-md border border-slate-300 bg-white px-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
            >
              <option value="">Prefer not to say</option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>
        </div>
      </fieldset>

      <fieldset className="rounded-xl border border-slate-200 p-6">
        <legend className="px-2 text-xl font-bold text-ink">Activities</legend>
        <p className="text-sm text-slate-600">Select activities used to check published criteria.</p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 md:grid-cols-3">
          {activityOptions.map((activity) => (
            <label key={activity.value} className="flex min-h-11 items-center gap-2 text-sm">
              <input type="checkbox" checked={values.activities.includes(activity.value)} onChange={() => toggleActivity(activity.value)} />
              {activity.label}
            </label>
          ))}
        </div>
        <span className="mt-6 block text-sm font-bold text-ink">Languages</span>
        <p className="mt-1 text-xs text-slate-600">Select languages relevant to language criteria.</p>
        <div className="mt-3 flex flex-wrap gap-4">
          {languageOptions.map((language) => (
            <label key={language} className="flex min-h-11 items-center gap-2 text-sm">
              <input type="checkbox" checked={values.languages.includes(language)} onChange={() => toggleLanguage(language)} />
              {language}
            </label>
          ))}
        </div>
      </fieldset>

      <PdpoStatement />
      <div className="flex items-center justify-between gap-4 border-t border-slate-200 pt-6">
        <p className="text-sm text-slate-600">Save your profile to update matching results.</p>
        <button type="submit" className="min-h-12 rounded-md bg-primary px-5 py-3 font-bold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2">Save profile</button>
      </div>
      <LiveRegion message={announcement} />
    </form>
  )
}
