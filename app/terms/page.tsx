import PublicLayout from '@/components/layout/PublicLayout';

export default function TermsPage() {
  return (
    <PublicLayout>
      <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms & Conditions</h1>
          <p className="text-xl text-primary-100">Last updated: January 2024</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-xl shadow-lg p-8 md:p-12 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-700 mb-4">
              By accessing and using Car Trust India's platform, you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to these terms, please do not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Use of Service</h2>
            <p className="text-gray-700 mb-4">
              Our platform provides a marketplace for buying and selling used cars. You agree to:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Provide accurate and complete information</li>
              <li>Maintain the security of your account</li>
              <li>Not use the service for any illegal purposes</li>
              <li>Not post false or misleading information</li>
              <li>Comply with all applicable laws and regulations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. User Accounts</h2>
            <p className="text-gray-700 mb-4">
              To access certain features, you must register for an account. You are responsible for:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Maintaining the confidentiality of your account</li>
              <li>All activities that occur under your account</li>
              <li>Notifying us immediately of any unauthorized use</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Listings and Transactions</h2>
            <p className="text-gray-700 mb-4">
              For dealers listing vehicles:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>All listings must be accurate and truthful</li>
              <li>You must have legal right to sell the vehicle</li>
              <li>Photos must represent the actual vehicle</li>
              <li>Pricing must be clearly stated</li>
              <li>We reserve the right to remove any listing</li>
            </ul>
            <p className="text-gray-700 mt-4">
              Car Trust India acts as a platform connecting buyers and sellers. We are not party to the actual transaction between users.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Payment Terms</h2>
            <p className="text-gray-700 mb-4">
              Payment for services rendered through our platform must be made according to the agreed terms. We use secure payment gateways for all transactions. Refunds are subject to our refund policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Intellectual Property</h2>
            <p className="text-gray-700 mb-4">
              All content on this platform, including text, graphics, logos, and software, is the property of Car Trust India and protected by copyright laws. You may not reproduce, distribute, or create derivative works without our permission.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Limitation of Liability</h2>
            <p className="text-gray-700 mb-4">
              Car Trust India shall not be liable for any indirect, incidental, special, or consequential damages arising from:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Use or inability to use our service</li>
              <li>Unauthorized access to your data</li>
              <li>Statements or conduct of any third party</li>
              <li>Any other matter relating to the service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Dispute Resolution</h2>
            <p className="text-gray-700 mb-4">
              Any disputes arising from these terms shall be resolved through arbitration in Noida, India, in accordance with Indian law.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Modifications</h2>
            <p className="text-gray-700 mb-4">
              We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting. Your continued use of the service constitutes acceptance of the modified terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Termination</h2>
            <p className="text-gray-700 mb-4">
              We may terminate or suspend your account and access to the service immediately, without prior notice, for any breach of these terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Contact Information</h2>
            <p className="text-gray-700">
              For questions about these terms, please contact us at:
              <br />
              Email: support@cartrustindia.com
              <br />
              Phone: +91 1800-XXX-XXXX
            </p>
          </section>
        </div>
      </div>
    </div>
    </PublicLayout>
  );
}
