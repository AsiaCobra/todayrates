import SEO from '../components/SEO'

export default function PrivacyPolicy() {
  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-8">
      <SEO 
        title="Privacy Policy - Today Rates"
        description="Privacy Policy for Today Rates. Learn how we collect, use, and protect your information when using our currency exchange and gold price service."
        keywords="privacy policy, data protection, user privacy Myanmar"
        url="/privacy-policy"
      />
      
      <div>
        <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-sm text-slate-500">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
      </div>

      <div className="glass-card rounded-2xl p-6 space-y-6">
        <section>
          <h2 className="text-xl font-semibold mb-3 text-yellow-400">Introduction</h2>
          <p className="text-slate-300 leading-relaxed">
            Today Rates ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-yellow-400">Information We Collect</h2>
          <p className="text-slate-300 leading-relaxed mb-3">
            We collect information that you provide directly to us, including:
          </p>
          <ul className="list-disc list-inside space-y-2 text-slate-300 ml-4">
            <li>Account information (email, password) for admin users</li>
            <li>Usage data and analytics through cookies and similar technologies</li>
            <li>Device information (browser type, IP address, operating system)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-yellow-400">How We Use Your Information</h2>
          <p className="text-slate-300 leading-relaxed mb-3">
            We use the information we collect to:
          </p>
          <ul className="list-disc list-inside space-y-2 text-slate-300 ml-4">
            <li>Provide and maintain our services</li>
            <li>Improve user experience and website functionality</li>
            <li>Send administrative information and updates</li>
            <li>Analyze usage patterns and trends</li>
            <li>Display relevant advertisements through Google AdSense</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-yellow-400">Cookies and Tracking Technologies</h2>
          <p className="text-slate-300 leading-relaxed">
            We use cookies and similar tracking technologies to track activity on our website and store certain information. Third-party services like Google AdSense may also use cookies to display personalized advertisements based on your browsing activity.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-yellow-400">Third-Party Services</h2>
          <p className="text-slate-300 leading-relaxed mb-3">
            We use third-party services that may collect information about you:
          </p>
          <ul className="list-disc list-inside space-y-2 text-slate-300 ml-4">
            <li><strong>Google AdSense:</strong> We use Google AdSense to display advertisements. Google uses cookies to serve ads based on your prior visits to our website or other websites.</li>
            <li><strong>Supabase:</strong> We use Supabase for database and authentication services.</li>
          </ul>
          <p className="text-slate-300 leading-relaxed mt-3">
            You may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-yellow-400 hover:underline">Google Ads Settings</a>.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-yellow-400">Data Security</h2>
          <p className="text-slate-300 leading-relaxed">
            We implement appropriate security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-yellow-400">Your Rights</h2>
          <p className="text-slate-300 leading-relaxed">
            You have the right to access, update, or delete your personal information. If you wish to exercise these rights, please contact us using the information provided on our Contact page.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-yellow-400">Children's Privacy</h2>
          <p className="text-slate-300 leading-relaxed">
            Our service is not directed to children under 13. We do not knowingly collect personal information from children under 13.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-yellow-400">Changes to This Policy</h2>
          <p className="text-slate-300 leading-relaxed">
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-yellow-400">Contact Us</h2>
          <p className="text-slate-300 leading-relaxed">
            If you have any questions about this Privacy Policy, please visit our Contact page.
          </p>
        </section>
      </div>
    </div>
  )
}
