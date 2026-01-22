/**
 * Environment Configuration
 * Provides environment-aware settings for the application
 */

export const ENV = {
  // Current environment (development, staging, production)
  name: import.meta.env.VITE_APP_ENV || import.meta.env.MODE || 'development',
  
  // Supabase configuration
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL,
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
  },
  
  // Application settings
  historyPerPage: parseInt(import.meta.env.VITE_HISTORY_PER_PAGE || '10'),
  
  // Environment checks
  isDevelopment: () => ENV.name === 'development',
  isStaging: () => ENV.name === 'staging',
  isProduction: () => ENV.name === 'production',
}

/**
 * Get environment display color
 */
export const getEnvironmentColor = () => {
  switch (ENV.name) {
    case 'production':
      return 'bg-green-600'
    case 'staging':
      return 'bg-yellow-600'
    case 'development':
      return 'bg-blue-600'
    default:
      return 'bg-gray-600'
  }
}

/**
 * Validate environment configuration
 */
export const validateConfig = () => {
  const errors = []
  
  if (!ENV.supabase.url) {
    errors.push('VITE_SUPABASE_URL is not defined')
  }
  
  if (!ENV.supabase.anonKey) {
    errors.push('VITE_SUPABASE_ANON_KEY is not defined')
  }
  
  if (errors.length > 0) {
    console.error('❌ Environment Configuration Errors:')
    errors.forEach(error => console.error(`  - ${error}`))
    throw new Error('Invalid environment configuration. Check your .env file.')
  }
  
  // Log environment info in development
  if (ENV.isDevelopment()) {
    console.log('🔧 Environment:', ENV.name)
    console.log('🔗 Supabase URL:', ENV.supabase.url)
  }
}

// Validate on module load
validateConfig()
