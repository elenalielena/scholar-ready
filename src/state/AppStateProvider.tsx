/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useReducer } from 'react'
import type { ReactNode } from 'react'
import { repository } from '../lib/repository'
import { appReducer, type AppAction, type AppState } from './reducer'

interface AppStateContextValue {
  state: AppState
  dispatch: (action: AppAction) => void
}

const AppStateContext = createContext<AppStateContextValue | null>(null)

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, undefined, repository.load)

  useEffect(() => {
    repository.save(state)
  }, [state])

  const value = useMemo(() => ({ state, dispatch }), [state])

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>
}

export function useAppState(): AppStateContextValue {
  const context = useContext(AppStateContext)
  if (!context) {
    throw new Error('useAppState must be used within AppStateProvider')
  }
  return context
}
