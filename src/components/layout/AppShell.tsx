import { Outlet } from 'react-router-dom'
import Footer from './Footer'
import Header from './Header'
import SkipLink from './SkipLink'

export default function AppShell() {
  return (
    <div className="min-h-screen bg-white text-ink">
      <SkipLink />
      <Header />
      <main id="main" className="mx-auto min-h-[60vh] max-w-[1200px] px-6 py-10">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
