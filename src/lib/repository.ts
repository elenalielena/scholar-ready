import { buildSeed } from '../data/seed'
import type { Deadline, DocumentProgress, StudentProfile } from '../types/models'

const STORAGE_KEY = 'scholarready:v1'
const SCHEMA_VERSION = 1 as const
const STORAGE_NOTICE = 'Changes will not be kept after you close this tab.'

export type RepositoryState = {
  schemaVersion: typeof SCHEMA_VERSION
  seededAt: string
  profile: StudentProfile
  profileSavedAt: string | null
  savedScholarshipIds: string[]
  compareIds: string[]
  documentProgress: DocumentProgress[]
  deadlines: Deadline[]
  storageNotice?: string
}

type PersistedState = Omit<RepositoryState, 'deadlines' | 'storageNotice'>

let memoryState: RepositoryState | null = null
let storageUnavailable = false

function addStorageNotice(state: RepositoryState): RepositoryState {
  return storageUnavailable ? { ...state, storageNotice: STORAGE_NOTICE } : state
}

function stateFromPersisted(persisted: PersistedState): RepositoryState {
  const seed = buildSeed(new Date(persisted.seededAt))
  return addStorageNotice({
    ...persisted,
    deadlines: seed.deadlines,
  })
}

function isPersistedState(value: unknown): value is PersistedState {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const state = value as Partial<PersistedState>
  return (
    state.schemaVersion === SCHEMA_VERSION &&
    typeof state.seededAt === 'string' &&
    typeof state.profile === 'object' &&
    state.profile !== null &&
    Array.isArray(state.savedScholarshipIds) &&
    Array.isArray(state.compareIds) &&
    Array.isArray(state.documentProgress)
  )
}

function load(): RepositoryState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed: unknown = JSON.parse(raw)
      if (isPersistedState(parsed)) {
        const state = stateFromPersisted(parsed)
        memoryState = state
        return state
      }
    }
  } catch {
    storageUnavailable = true
    if (memoryState) {
      return addStorageNotice(memoryState)
    }
  }

  const seed = addStorageNotice(buildSeed(new Date()))
  memoryState = seed
  save(seed)
  return seed
}

function save(state: RepositoryState): void {
  memoryState = state
  const persisted: PersistedState = {
    schemaVersion: SCHEMA_VERSION,
    seededAt: state.seededAt,
    profile: state.profile,
    profileSavedAt: state.profileSavedAt,
    savedScholarshipIds: state.savedScholarshipIds,
    compareIds: state.compareIds,
    documentProgress: state.documentProgress,
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(persisted))
    storageUnavailable = false
  } catch {
    storageUnavailable = true
  }
}

function reset(): RepositoryState {
  const seed = buildSeed(new Date())
  memoryState = addStorageNotice(seed)
  save(seed)
  return addStorageNotice(memoryState)
}

export const repository = { load, save, reset }
