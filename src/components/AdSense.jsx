import { useEffect, useRef } from 'react'

export default function AdSense({
  slot,
  format = 'auto',
  responsive = true,
  style = {},
  className = ''
}) {
  const adRef = useRef(null)
  const isLoaded = useRef(false)

  useEffect(() => {
    // Only load ad once
    if (isLoaded.current) return

    try {
      if (window.adsbygoogle && adRef.current) {
        window.adsbygoogle.push({})
        isLoaded.current = true
      }
    } catch (error) {
      console.error('AdSense error:', error)
    }
  }, [])

  return (
    <div className={`ad-container ${className}`} style={{ textAlign: 'center', ...style }}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block', ...style }}
        data-ad-client="ca-pub-7318560556166080"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </div>
  )
}
