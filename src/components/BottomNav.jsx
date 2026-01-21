import { Link, useLocation } from 'react-router-dom'

const navItems = [
  {
    name: 'Home',
    href: '/',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
        <path d="M9 22V12h6v10" />
      </svg>
    ),
  },
  {
    name: 'Gold',
    href: '/gold',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    ),
  },
  {
    name: 'Currency',
    href: '/currency',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
  },
]

export default function BottomNav() {
  const location = useLocation()

  const isActive = (href) => {
    if (href === '/') return location.pathname === '/'
    if (href === '/admin') return location.pathname === '/admin' || location.pathname === '/login'
    return location.pathname.startsWith(href)
  }

  return (
    <nav className="fixed bottom-4 left-4 right-4 z-50">
      <div className="glass-card rounded-2xl gold-glow max-w-md mx-auto">
        <div className="flex justify-around items-center h-16 px-2">
          {navItems.map((item) => {
            const active = isActive(item.href)
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex flex-col items-center justify-center px-4 py-2 rounded-xl transition-all duration-200 ${
                  active
                    ? 'bg-gradient-to-r from-yellow-500/20 to-amber-500/20 text-yellow-400'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className={active ? 'text-yellow-400' : ''}>
                  {item.icon}
                </div>
                <span className={`text-[10px] mt-1 font-medium ${active ? 'text-yellow-400' : ''}`}>
                  {item.name}
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
