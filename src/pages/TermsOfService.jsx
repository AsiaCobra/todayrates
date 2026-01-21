import SEO from '../components/SEO'

export default function TermsOfService() {
  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-8">
      <SEO 
        title="Terms of Service - Today Rates"
        description="Terms of Service for Today Rates. Read our terms and conditions for using our currency exchange rates and gold prices service."
        keywords="terms of service, terms and conditions, user agreement Myanmar"
        url="/terms-of-service"
      />
      
      <div>
        <h1 className="text-3xl font-bold mb-2">Terms of Service</h1>
        <p className="text-sm text-slate-500">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
      </div>

      <div className="glass-card rounded-2xl p-6 space-y-6">
        <section>
          <h2 className="text-xl font-semibold mb-3 text-yellow-400">Agreement to Terms</h2>
          <p className="text-slate-300 leading-relaxed">
            By accessing and using Today Rates, you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to these terms, please do not use our service.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-yellow-400">Use of Service</h2>
          <p className="text-slate-300 leading-relaxed mb-3">
            Today Rates provides real-time exchange rates and gold prices for informational purposes only. By using our service, you agree to:
          </p>
          <ul className="list-disc list-inside space-y-2 text-slate-300 ml-4">
            <li>Use the service only for lawful purposes</li>
            <li>Not attempt to gain unauthorized access to our systems</li>
            <li>Not interfere with or disrupt the service</li>
            <li>Not use automated systems or software to extract data (scraping)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-yellow-400">Information Accuracy</h2>
          <p className="text-slate-300 leading-relaxed">
            While we strive to provide accurate and up-to-date exchange rates and gold prices, we do not guarantee the accuracy, completeness, or timeliness of the information. Rates are provided for informational purposes only and should not be considered as financial advice.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-yellow-400">No Financial Advice</h2>
          <p className="text-slate-300 leading-relaxed">
            The information provided on Today Rates is not intended as financial, investment, or trading advice. You should consult with appropriate professionals before making any financial decisions based on the information provided on our website.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-yellow-400">Intellectual Property</h2>
          <p className="text-slate-300 leading-relaxed">
            The content, features, and functionality of Today Rates are owned by us and are protected by international copyright, trademark, and other intellectual property laws. You may not reproduce, distribute, or create derivative works without our express written permission.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-yellow-400">Third-Party Links and Services</h2>
          <p className="text-slate-300 leading-relaxed">
            Our service may contain links to third-party websites or services. We are not responsible for the content, privacy policies, or practices of any third-party sites or services.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-yellow-400">Limitation of Liability</h2>
          <p className="text-slate-300 leading-relaxed">
            Today Rates and its affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service, including but not limited to financial losses due to reliance on information provided.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-yellow-400">Disclaimer of Warranties</h2>
          <p className="text-slate-300 leading-relaxed">
            The service is provided on an "AS IS" and "AS AVAILABLE" basis without warranties of any kind, either express or implied. We do not warrant that the service will be uninterrupted, secure, or error-free.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-yellow-400">Changes to Service</h2>
          <p className="text-slate-300 leading-relaxed">
            We reserve the right to modify or discontinue, temporarily or permanently, the service (or any part thereof) with or without notice at any time.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-yellow-400">Governing Law</h2>
          <p className="text-slate-300 leading-relaxed">
            These Terms shall be governed by and construed in accordance with the laws of Myanmar, without regard to its conflict of law provisions.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-yellow-400">Changes to Terms</h2>
          <p className="text-slate-300 leading-relaxed">
            We reserve the right to modify these terms at any time. We will notify users of any material changes by updating the "Last updated" date. Your continued use of the service after such modifications constitutes acceptance of the updated terms.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-yellow-400">Contact Information</h2>
          <p className="text-slate-300 leading-relaxed">
            If you have any questions about these Terms of Service, please visit our Contact page.
          </p>
        </section>
      </div>
    </div>
  )
}
