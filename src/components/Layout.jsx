import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import BottomNav from './BottomNav'
import Footer from './Footer'
import EnvironmentBadge from './EnvironmentBadge'

export default function Layout({ children }) {
  const { user } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  // Check if we're on a detail/history page (show back button)
  const isDetailPage = location.pathname.includes('history/') ||
                       location.pathname === '/login'

  const isAdminPage = location.pathname === '/admin'
  
  const handleBack = () => {
    // If on login page, go to home, otherwise go back in history
    if (location.pathname === '/login') {
      navigate('/')
    } else {
      navigate(-1)
    }
  }

  return (
    <div className="min-h-screen">
      {/* Environment Badge */}
      <EnvironmentBadge />
      
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/50">
        <div className="max-w-lg md:max-w-4xl lg:max-w-6xl xl:max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            {isDetailPage ? (
              <button
                onClick={handleBack}
                className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="text-sm">Back</span>
              </button>
            ) : (
              <Link to="/" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg overflow-hidden">
                  <img src="/logo.jpg" alt="Today Rates" className="w-full h-full object-cover" />
                </div>
                <span className="text-gold-gradient font-semibold">Today Rates</span>
              </Link>
            )}

            <div className="flex items-center gap-3">
              {/* Live indicator */}
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse-gold"></span>
                Live
              </div>

              {/* User status */}
              {user && !isAdminPage && (
                <Link
                  to="/admin"
                  className="text-xs px-2 py-1 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                >
                  Admin
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pb-safe">
        <div className="max-w-lg md:max-w-4xl lg:max-w-6xl xl:max-w-7xl mx-auto px-4 py-6">
          {children}
        </div>
      </main>

      {/* Footer */}
      <Footer />

      {/* Bottom Navigation - hide on login/admin pages */}
      {!isAdminPage && location.pathname !== '/login' && <BottomNav />}
    </div>
  )
}
