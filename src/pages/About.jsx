import SEO from '../components/SEO'

export default function About() {
  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-8">
      <SEO 
        title="About - Today Rates"
        description="Learn about Today Rates - your trusted source for real-time currency exchange rates and gold prices in Myanmar. Free, accurate, and always updated."
        keywords="about today rates, Myanmar financial information, exchange rates Myanmar, gold prices Myanmar"
        url="/about"
      />
      
      <div>
        <h1 className="text-3xl font-bold mb-2">About Today Rates</h1>
        <p className="text-slate-400">Your trusted source for exchange rates and gold prices in Myanmar</p>
      </div>

      <div className="glass-card rounded-2xl p-6 space-y-6">
        <section>
          <h2 className="text-xl font-semibold mb-3 text-yellow-400">Our Mission</h2>
          <p className="text-slate-300 leading-relaxed">
            Today Rates is dedicated to providing accurate, real-time exchange rates and gold prices to individuals and businesses in Myanmar. We believe that access to reliable financial information should be easy, fast, and free for everyone.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-yellow-400">What We Offer</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-slate-800/30 rounded-xl p-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center text-blue-400 mb-3">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Exchange Rates</h3>
              <p className="text-sm text-slate-400">
                Real-time currency exchange rates for 38 currencies supported by the Central Bank of Myanmar
              </p>
            </div>

            <div className="bg-slate-800/30 rounded-xl p-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-500/20 to-amber-500/20 flex items-center justify-center text-yellow-400 mb-3">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Gold Prices</h3>
              <p className="text-sm text-slate-400">
                Live gold prices including world gold and Myanmar gold (16 Pae, 15 Pae) with buy and sell rates
              </p>
            </div>

            <div className="bg-slate-800/30 rounded-xl p-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center text-emerald-400 mb-3">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Historical Data</h3>
              <p className="text-sm text-slate-400">
                Access historical rates and trends to track changes over time
              </p>
            </div>

            <div className="bg-slate-800/30 rounded-xl p-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center text-purple-400 mb-3">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Mobile Friendly</h3>
              <p className="text-sm text-slate-400">
                Optimized for mobile devices so you can check rates on the go
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-yellow-400">Why Choose Us</h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-yellow-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-slate-200">Real-Time Updates</p>
                <p className="text-sm text-slate-400 mt-1">Our rates are updated multiple times daily to ensure you have the most current information</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-yellow-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-slate-200">Accurate Data</p>
                <p className="text-sm text-slate-400 mt-1">We source our data from reliable sources including the Central Bank of Myanmar</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-yellow-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-slate-200">Easy to Use</p>
                <p className="text-sm text-slate-400 mt-1">Clean, intuitive interface designed for quick access to the information you need</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-yellow-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-slate-200">Free Access</p>
                <p className="text-sm text-slate-400 mt-1">All our services are completely free with no registration required</p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-yellow-400">Our Commitment</h2>
          <p className="text-slate-300 leading-relaxed">
            We are committed to maintaining the highest standards of data accuracy and service reliability. Our team continuously monitors and updates rates to ensure you receive the most current information available. We also value your privacy and handle all user data in accordance with our Privacy Policy.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-yellow-400">Our Website</h2>
          <p className="text-slate-300 leading-relaxed">
            Visit us at <a href="https://myanmarexchangerates.site" target="_blank" rel="noopener noreferrer" className="text-yellow-400 hover:underline">myanmarexchangerates.site</a> for the latest exchange rates and gold prices in Myanmar.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-yellow-400">Contact Us</h2>
          <p className="text-slate-300 leading-relaxed">
            Have questions, suggestions, or feedback? We'd love to hear from you. Visit our <a href="/contact" className="text-yellow-400 hover:underline">Contact page</a> to get in touch with our team.
          </p>
        </section>
      </div>
    </div>
  )
}
