import PublicLayout from '@/components/layout/PublicLayout';

export default function CookiesPage() {
  return (
    <PublicLayout>
      <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Cookie Policy</h1>
          <p className="text-xl text-primary-100">Last updated: January 2024</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-xl shadow-lg p-8 md:p-12 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">What Are Cookies?</h2>
            <p className="text-gray-700 mb-4">
              Cookies are small text files that are placed on your device when you visit our website. They help us provide you with a better experience by remembering your preferences and understanding how you use our service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Types of Cookies We Use</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">1. Essential Cookies</h3>
                <p className="text-gray-700 mb-2">
                  These cookies are necessary for the website to function properly. They enable core functionality such as security, network management, and accessibility.
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  <li>Authentication and session management</li>
                  <li>Security and fraud prevention</li>
                  <li>Load balancing</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">2. Functional Cookies</h3>
                <p className="text-gray-700 mb-2">
                  These cookies enable enhanced functionality and personalization, such as remembering your preferences and settings.
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  <li>Language preferences</li>
                  <li>Location settings</li>
                  <li>Search filters and preferences</li>
                  <li>Recently viewed items</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">3. Analytics Cookies</h3>
                <p className="text-gray-700 mb-2">
                  These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  <li>Page views and navigation patterns</li>
                  <li>Time spent on pages</li>
                  <li>Error messages encountered</li>
                  <li>Device and browser information</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">4. Marketing Cookies</h3>
                <p className="text-gray-700 mb-2">
                  These cookies track your online activity to help advertisers deliver more relevant advertising or to limit how many times you see an ad.
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  <li>Targeted advertising</li>
                  <li>Social media integration</li>
                  <li>Retargeting campaigns</li>
                  <li>Conversion tracking</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Third-Party Cookies</h2>
            <p className="text-gray-700 mb-4">
              We may use third-party services that set cookies on your device, including:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Google Analytics for website analytics</li>
              <li>Social media platforms for sharing content</li>
              <li>Payment processors for secure transactions</li>
              <li>Advertising networks for targeted ads</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Managing Cookies</h2>
            <p className="text-gray-700 mb-4">
              You can control and manage cookies in several ways:
            </p>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Browser Settings</h3>
                <p className="text-gray-700">
                  Most browsers allow you to refuse or accept cookies. You can usually find these settings in the "Options" or "Preferences" menu of your browser.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Cookie Preferences</h3>
                <p className="text-gray-700 mb-3">
                  You can manage your cookie preferences through our cookie consent banner when you first visit our site.
                </p>
                <button className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition">
                  Manage Cookie Preferences
                </button>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Opt-Out Links</h3>
                <p className="text-gray-700">
                  For third-party cookies, you can opt out through:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4 mt-2">
                  <li>Google Analytics: <a href="https://tools.google.com/dlpage/gaoptout" className="text-primary-600 hover:underline">Opt-out</a></li>
                  <li>Network Advertising Initiative: <a href="http://www.networkadvertising.org/choices/" className="text-primary-600 hover:underline">Opt-out</a></li>
                  <li>Digital Advertising Alliance: <a href="http://www.aboutads.info/choices/" className="text-primary-600 hover:underline">Opt-out</a></li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Impact of Disabling Cookies</h2>
            <p className="text-gray-700 mb-4">
              If you disable cookies, some features of our website may not function properly:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>You may need to log in each time you visit</li>
              <li>Your preferences may not be saved</li>
              <li>Some features may be unavailable</li>
              <li>The website may not display correctly</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Cookie Duration</h2>
            <p className="text-gray-700 mb-4">
              Cookies may be either:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li><strong>Session cookies:</strong> Temporary cookies that expire when you close your browser</li>
              <li><strong>Persistent cookies:</strong> Remain on your device for a set period or until you delete them</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Updates to This Policy</h2>
            <p className="text-gray-700 mb-4">
              We may update this Cookie Policy from time to time to reflect changes in technology, legislation, or our business practices. Please check this page regularly for updates.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
            <p className="text-gray-700">
              If you have questions about our use of cookies, please contact us at:
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
