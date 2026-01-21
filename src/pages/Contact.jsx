import { useState } from 'react'
import { supabase } from '../lib/supabase'
import SEO from '../components/SEO'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    try {
      const { error: submitError } = await supabase
        .from('contacts')
        .insert([{
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          status: 'unread'
        }])
      
      if (submitError) throw submitError
      
      setSubmitted(true)
      setTimeout(() => {
        setSubmitted(false)
        setFormData({ name: '', email: '', subject: '', message: '' })
      }, 3000)
    } catch (err) {
      console.error('Error submitting contact form:', err)
      setError('Failed to send message. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-8">
      <SEO 
        title="Contact Us - Today Rates"
        description="Contact Today Rates team for inquiries, feedback, or support. We're here to help with your questions about exchange rates and gold prices in Myanmar."
        keywords="contact today rates, Myanmar exchange rates support, contact financial information Myanmar"
        url="/contact"
      />
      
      <div>
        <h1 className="text-3xl font-bold mb-2">Contact Us</h1>
        <p className="text-slate-400">Get in touch with the Today Rates team</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Contact Form */}
        <div className="glass-card rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-4 text-yellow-400">Send us a message</h2>
          
          {submitted ? (
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 text-center">
              <svg className="w-12 h-12 text-emerald-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <p className="text-emerald-400 font-medium">Message sent successfully!</p>
              <p className="text-sm text-slate-400 mt-1">We'll get back to you soon.</p>
            </div>
          ) : (
            <>
              {error && (
                <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-3 mb-4">
                  <p className="text-sm text-rose-400">{error}</p>
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 focus:outline-none transition-colors"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 focus:outline-none transition-colors"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-slate-300 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 focus:outline-none transition-colors"
                  placeholder="What's this about?"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-slate-300 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 focus:outline-none transition-colors resize-none"
                  placeholder="Your message..."
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-lg font-medium bg-gradient-to-r from-yellow-500 to-amber-500 text-slate-900 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-slate-900/30 border-t-slate-900 animate-spin"></div>
                    <span>Sending...</span>
                  </>
                ) : (
                  'Send Message'
                )}
              </button>
            </form>
            </>
          )}
        </div>

        {/* Contact Information */}
        <div className="space-y-6">
          <div className="glass-card rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-4 text-yellow-400">Get in Touch</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center text-blue-400 flex-shrink-0">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-sm">Email</p>
                  <p className="text-slate-400 text-sm mt-1">todaysrate15@gmail.com</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-500/20 to-amber-500/20 flex items-center justify-center text-yellow-400 flex-shrink-0">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-sm">Response Time</p>
                  <p className="text-slate-400 text-sm mt-1">Within 24-48 hours</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-sm">Location</p>
                  <p className="text-slate-400 text-sm mt-1">Yangon, Myanmar</p>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6">
            <h3 className="font-semibold mb-3">Frequently Asked Questions</h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="font-medium text-slate-300">How often are rates updated?</p>
                <p className="text-slate-400 mt-1">Our rates are updated multiple times throughout the day to ensure accuracy.</p>
              </div>
              <div>
                <p className="font-medium text-slate-300">Can I use this data for trading?</p>
                <p className="text-slate-400 mt-1">Our rates are for informational purposes only. Please consult with financial professionals for trading advice.</p>
              </div>
              <div>
                <p className="font-medium text-slate-300">How can I report an issue?</p>
                <p className="text-slate-400 mt-1">Use the contact form above to report any issues or inaccuracies.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
