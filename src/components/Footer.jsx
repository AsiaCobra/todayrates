import { Link } from 'react-router-dom'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-slate-900/50 border-t border-slate-800 mt-12 pb-24 md:pb-8">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="font-semibold text-slate-200 mb-3">About</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="text-slate-400 hover:text-yellow-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-slate-400 hover:text-yellow-400 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Rates */}
          <div>
            <h3 className="font-semibold text-slate-200 mb-3">Rates</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/currency" className="text-slate-400 hover:text-yellow-400 transition-colors">
                  Exchange Rates
                </Link>
              </li>
              <li>
                <Link to="/gold" className="text-slate-400 hover:text-yellow-400 transition-colors">
                  Gold Prices
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-slate-200 mb-3">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/privacy-policy" className="text-slate-400 hover:text-yellow-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms-of-service" className="text-slate-400 hover:text-yellow-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="font-semibold text-slate-200 mb-3">Connect</h3>
            <p className="text-sm text-slate-400 mb-3">
              Stay updated with the latest rates
            </p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-xs text-slate-400">Live Updates</span>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-400">
            <p>
              © {currentYear} Today Rates. All rights reserved.
            </p>
            <p className="text-xs">
              Rates are for informational purposes only. Not financial advice.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
