import type { Deadline, DocumentProgress, StudentProfile } from '../../types/models'
import { seedDeadlines } from './deadlines'
import { seedDocuments } from './documents'
import { seedRules } from './rules'
import { seedScholarships } from './scholarships'
import { seedStudentProfile } from './student'

export interface SeedState {
  schemaVersion: 1
  seededAt: string
  profile: StudentProfile
  profileSavedAt: string | null
  savedScholarshipIds: string[]
  compareIds: string[]
  documentProgress: DocumentProgress[]
}

function toIsoDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function dateWithOffset(today: Date, offsetDays: number): string {
  const date = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  date.setDate(date.getDate() + offsetDays)
  return toIsoDate(date)
}

export function buildSeed(today: Date): SeedState & { deadlines: Deadline[] } {
  const deadlines = seedDeadlines.map((deadline) => ({
    ...deadline,
    date: dateWithOffset(today, deadline.offsetDays),
  }))

  const updatedAt = today.toISOString()
  const documentProgress: DocumentProgress[] = [
    {
      studentId: seedStudentProfile.id,
      documentId: 'doc-transcript',
      status: 'ready',
      evidenceNote: '',
      updatedAt,
    },
    {
      studentId: seedStudentProfile.id,
      documentId: 'doc-activity',
      status: 'ready',
      evidenceNote: '',
      updatedAt,
    },
    {
      studentId: seedStudentProfile.id,
      documentId: 'doc-statement',
      status: 'in_progress',
      evidenceNote: '',
      updatedAt,
    },
  ]

  return {
    schemaVersion: 1,
    seededAt: updatedAt,
    profile: { ...seedStudentProfile, updatedAt },
    profileSavedAt: null,
    savedScholarshipIds: ['sch-001', 'sch-002'],
    compareIds: [],
    documentProgress,
    deadlines,
  }
}

export { seedDeadlines, seedDocuments, seedRules, seedScholarships, seedStudentProfile }
