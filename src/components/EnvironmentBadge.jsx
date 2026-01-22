import { ENV, getEnvironmentColor } from '../config/environment'

export default function EnvironmentBadge() {
  // Only show in non-production environments
  if (ENV.isProduction()) {
    return null
  }

  return (
    <div className="fixed top-0 right-0 z-50 m-2">
      <div className={`${getEnvironmentColor()} text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg`}>
        {ENV.name.toUpperCase()}
      </div>
    </div>
  )
}
