import { createBrowserRouter } from 'react-router-dom'
import AppShell from './components/layout/AppShell'
import ComparePage from './pages/ComparePage'
import DashboardPage from './pages/DashboardPage'
import ChecklistPage from './pages/ChecklistPage'
import LandingPage from './pages/LandingPage'
import MatchesPage from './pages/MatchesPage'
import NotFoundPage from './pages/NotFoundPage'
import PricingPage from './pages/PricingPage'
import ProfilePage from './pages/ProfilePage'
import PrivacyPage from './pages/PrivacyPage'
import ScholarshipDetailPage from './pages/ScholarshipDetailPage'
import SignInPage from './pages/SignInPage'

export const router = createBrowserRouter([
  {
    element: <AppShell />,
    children: [
      { path: '/', element: <LandingPage /> },
      { path: '/profile', element: <ProfilePage /> },
      { path: '/matches', element: <MatchesPage /> },
      { path: '/scholarships/:id', element: <ScholarshipDetailPage /> },
      { path: '/compare', element: <ComparePage /> },
      { path: '/checklist', element: <ChecklistPage /> },
      { path: '/dashboard', element: <DashboardPage /> },
      { path: '/pricing', element: <PricingPage /> },
      { path: '/privacy', element: <PrivacyPage /> },
      { path: '/sign-in', element: <SignInPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
