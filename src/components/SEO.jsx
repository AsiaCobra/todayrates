import { Helmet } from 'react-helmet-async'

export default function SEO({ 
  title = 'Today Rates - Live Exchange Rates & Gold Prices Myanmar',
  description = 'Get real-time exchange rates for 38+ currencies and gold prices in Myanmar. USD, EUR, SGD, THB, CNY, MYR, JPY and more. Live updates, historical data, and accurate rates.',
  keywords = 'myanmar exchange rates, dollar rate myanmar, gold price myanmar, forex myanmar, currency converter myanmar, usd to mmk, exchange rate today, gold rate today, myanmar forex, currency rates',
  image = '/logo.jpg',
  url = 'https://myanmarexchangerates.site',
  type = 'website'
}) {
  const siteUrl = 'https://myanmarexchangerates.site'
  const fullUrl = url.startsWith('http') ? url : `${siteUrl}${url}`
  const fullImage = image.startsWith('http') ? image : `${siteUrl}${image}`

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:site_name" content="Today Rates" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={fullUrl} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={fullImage} />
      
      {/* Additional SEO */}
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English" />
      <meta name="author" content="Today Rates" />
      <link rel="canonical" href={fullUrl} />
    </Helmet>
  )
}
