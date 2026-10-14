import { RouterProvider } from 'react-router-dom'
import { router } from './routes'
import { AppStateProvider } from './state/AppStateProvider'

function App() {
  return (
    <AppStateProvider>
      <RouterProvider router={router} />
    </AppStateProvider>
  )
}

export default App
