import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import DemoBadge from './DemoBadge'
import ResetDemoButton from './ResetDemoButton'

const navigation = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/matches', label: 'Matches' },
  { to: '/compare', label: 'Compare' },
  { to: '/checklist', label: 'Checklist' },
  { to: '/pricing', label: 'Pricing' },
]

function navigationClassName({ isActive }: { isActive: boolean }): string {
  return [
    'inline-flex min-h-11 items-center border-b-2 px-2 text-sm font-semibold transition-colors',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2',
    isActive
      ? 'border-primary text-primary'
      : 'border-transparent text-ink hover:border-primary hover:text-primary',
  ].join(' ')
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  function closeMenu() {
    setMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">
      <div className="mx-auto flex max-w-[1200px] items-center gap-6 px-6 py-3">
        <Link
          to="/"
          className="shrink-0 rounded-md text-lg font-bold tracking-tight text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2"
        >
          ScholarReady
        </Link>

        <nav aria-label="Primary navigation" className="hidden flex-1 lg:block">
          <ul className="flex items-center gap-1">
            {navigation.map((item) => (
              <li key={item.to}>
                <NavLink to={item.to} className={navigationClassName} onClick={closeMenu}>
                  {item.label}
                </NavLink>
              </li>
            ))}
            <li>
              <NavLink to="/profile" className={navigationClassName} onClick={closeMenu}>
                Profile
              </NavLink>
            </li>
          </ul>
        </nav>

        <div className="ml-auto hidden items-center gap-3 lg:flex">
          <DemoBadge />
          <ResetDemoButton />
        </div>

        <button
          type="button"
          className="ml-auto inline-flex min-h-11 items-center rounded-md border border-slate-300 px-3 text-sm font-semibold text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 lg:hidden"
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="sr-only">Toggle navigation</span>
          Menu
        </button>
      </div>

      <div className="border-t border-slate-200 px-6 py-2 lg:hidden">
        <div className="flex flex-wrap items-center gap-3">
          <DemoBadge />
          <ResetDemoButton />
        </div>
      </div>

      {menuOpen && (
        <nav
          id="mobile-navigation"
          aria-label="Mobile navigation"
          className="border-t border-slate-200 bg-white px-6 py-3 lg:hidden"
        >
          <ul className="mx-auto flex max-w-[1200px] flex-col gap-1">
            {navigation.map((item) => (
              <li key={item.to}>
                <NavLink to={item.to} className={navigationClassName} onClick={closeMenu}>
                  {item.label}
                </NavLink>
              </li>
            ))}
            <li>
              <NavLink to="/profile" className={navigationClassName} onClick={closeMenu}>
                Profile
              </NavLink>
            </li>
          </ul>
        </nav>
      )}
    </header>
  )
}
