import type { DocumentProgress, StudentProfile } from '../types/models'
import type { RepositoryState } from '../lib/repository'

export type AppState = RepositoryState

export type AppAction =
  | { type: 'profile/save'; profile: StudentProfile }
  | { type: 'saved/toggle'; scholarshipId: string }
  | { type: 'compare/add'; scholarshipId: string }
  | { type: 'compare/remove'; scholarshipId: string }
  | { type: 'document/update'; progress: DocumentProgress }
  | { type: 'reset'; state: AppState }

export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'profile/save':
      return {
        ...state,
        profile: action.profile,
        profileSavedAt: action.profile.updatedAt,
      }
    case 'saved/toggle': {
      const savedScholarshipIds = state.savedScholarshipIds.includes(action.scholarshipId)
        ? state.savedScholarshipIds.filter((id) => id !== action.scholarshipId)
        : [...state.savedScholarshipIds, action.scholarshipId]
      return { ...state, savedScholarshipIds }
    }
    case 'compare/add':
      return state.compareIds.includes(action.scholarshipId) || state.compareIds.length >= 3
        ? state
        : { ...state, compareIds: [...state.compareIds, action.scholarshipId] }
    case 'compare/remove':
      return {
        ...state,
        compareIds: state.compareIds.filter((id) => id !== action.scholarshipId),
      }
    case 'document/update': {
      const existing = state.documentProgress.some(
        (item) => item.documentId === action.progress.documentId,
      )
      const documentProgress = existing
        ? state.documentProgress.map((item) =>
            item.documentId === action.progress.documentId ? action.progress : item,
          )
        : [...state.documentProgress, action.progress]
      return { ...state, documentProgress }
    }
    case 'reset':
      return action.state
    default:
      return state
  }
}
