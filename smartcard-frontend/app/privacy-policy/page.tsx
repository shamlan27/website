"use client";
import Footer from "../components/Footer";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen font-sans text-black">
      {/* Hero Section */}
      <header className="relative overflow-hidden hero-gradient py-20">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-16 h-16 bg-purple-200 rounded-lg opacity-30 animate-bounce" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-40 left-1/4 w-12 h-12 bg-green-200 rounded-full opacity-25 animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <div className="text-center">
            <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight drop-shadow-sm" style={{color: 'var(--foreground)'}}>
              Privacy <span className="text-blue-600">Policy</span>
            </h1>
            <p className="mt-6 max-w-3xl mx-auto text-lg text-gray-600 leading-relaxed">
              Your privacy matters to us. Learn how we protect and use your information.
            </p>
          </div>
        </div>
      </header>

      {/* Policy Content */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-4xl px-6">
          <div className="prose prose-lg max-w-none">
            <div className="mb-8">
              <p className="text-gray-600 text-lg leading-relaxed">
                <strong className="text-gray-900">Last updated:</strong> November 14, 2025
              </p>
              <p className="text-gray-600 text-lg leading-relaxed mt-2">
                This Privacy Policy describes how Advance Step ("we," "us," or "our") collects, uses, and protects your personal information when you use our digital business card platform.
              </p>
            </div>

            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">1. Information We Collect</h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Information You Provide</h3>
                    <ul className="text-gray-600 space-y-2 ml-6">
                      <li>• Account information (name, email, password)</li>
                      <li>• Business information (company, title, contact details)</li>
                      <li>• Profile content (photos, bio, social media links)</li>
                      <li>• Payment information (processed securely by third parties)</li>
                      <li>• Communications with our support team</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Information We Collect Automatically</h3>
                    <ul className="text-gray-600 space-y-2 ml-6">
                      <li>• Device information (IP address, browser type, operating system)</li>
                      <li>• Usage data (pages visited, features used, time spent)</li>
                      <li>• Location data (approximate location based on IP)</li>
                      <li>• Cookies and similar technologies</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Analytics and Tracking</h3>
                    <ul className="text-gray-600 space-y-2 ml-6">
                      <li>• Business card view statistics</li>
                      <li>• Contact sharing metrics</li>
                      <li>• User engagement patterns</li>
                      <li>• Performance and error logs</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">2. How We Use Your Information</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  We use the information we collect to:
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-blue-900 mb-3">Service Provision</h3>
                    <ul className="text-blue-800 space-y-2">
                      <li>• Create and manage your account</li>
                      <li>• Provide digital business card services</li>
                      <li>• Process payments and subscriptions</li>
                      <li>• Send service-related notifications</li>
                    </ul>
                  </div>

                  <div className="bg-green-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-green-900 mb-3">Improvement & Analytics</h3>
                    <ul className="text-green-800 space-y-2">
                      <li>• Analyze usage patterns</li>
                      <li>• Improve our platform</li>
                      <li>• Develop new features</li>
                      <li>• Provide customer support</li>
                    </ul>
                  </div>

                  <div className="bg-purple-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-purple-900 mb-3">Communication</h3>
                    <ul className="text-purple-800 space-y-2">
                      <li>• Send product updates</li>
                      <li>• Provide marketing communications</li>
                      <li>• Respond to inquiries</li>
                      <li>• Send promotional offers</li>
                    </ul>
                  </div>

                  <div className="bg-orange-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-orange-900 mb-3">Legal Compliance</h3>
                    <ul className="text-orange-800 space-y-2">
                      <li>• Comply with legal obligations</li>
                      <li>• Prevent fraud and abuse</li>
                      <li>• Protect user rights</li>
                      <li>• Enforce our terms</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">3. Information Sharing</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  We do not sell, trade, or rent your personal information to third parties. We may share your information in the following circumstances:
                </p>

                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Service Providers</h3>
                    <p className="text-gray-600">
                      We share information with trusted third-party service providers who help us operate our platform, process payments, and provide customer support. These providers are contractually obligated to protect your information.
                    </p>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Business Transfers</h3>
                    <p className="text-gray-600">
                      If we are involved in a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction. We will notify you before your information is transferred.
                    </p>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Legal Requirements</h3>
                    <p className="text-gray-600">
                      We may disclose information if required by law, court order, or government request, or to protect our rights, property, or safety, or that of our users.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">4. Data Security</h2>
                <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-r-lg">
                  <h3 className="text-lg font-semibold text-green-900 mb-3">Security Measures</h3>
                  <ul className="text-green-800 space-y-2">
                    <li>• Encryption of data in transit and at rest</li>
                    <li>• Secure server infrastructure with regular updates</li>
                    <li>• Regular security audits and penetration testing</li>
                    <li>• Employee access controls and training</li>
                    <li>• Incident response procedures</li>
                  </ul>
                </div>
                <p className="text-gray-600 leading-relaxed mt-4">
                  While we implement robust security measures, no system is completely secure. We cannot guarantee absolute security of your information.
                </p>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">5. Cookies and Tracking</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  We use cookies and similar technologies to enhance your experience:
                </p>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Essential Cookies</h3>
                    <p className="text-gray-600">
                      Required for basic platform functionality, account security, and service provision. These cannot be disabled.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Analytics Cookies</h3>
                    <p className="text-gray-600">
                      Help us understand how users interact with our platform to improve services and user experience.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Marketing Cookies</h3>
                    <p className="text-gray-600">
                      Used to deliver relevant advertisements and track campaign effectiveness. You can opt out of these.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">6. Your Rights and Choices</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Depending on your location, you may have the following rights regarding your personal information:
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900">Access</h4>
                      <p className="text-gray-600 text-sm">Request a copy of your personal information</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900">Correction</h4>
                      <p className="text-gray-600 text-sm">Update or correct inaccurate information</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900">Deletion</h4>
                      <p className="text-gray-600 text-sm">Request deletion of your personal information</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900">Portability</h4>
                      <p className="text-gray-600 text-sm">Receive your data in a portable format</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900">Opt-out</h4>
                      <p className="text-gray-600 text-sm">Unsubscribe from marketing communications</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900">Restriction</h4>
                      <p className="text-gray-600 text-sm">Limit how we process your information</p>
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 leading-relaxed mt-4">
                  To exercise these rights, contact us at privacy@advancestep.com. We will respond to your request within 30 days.
                </p>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">7. Data Retention</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  We retain your personal information for as long as necessary to provide our services and comply with legal obligations:
                </p>
                <ul className="text-gray-600 space-y-2 ml-6">
                  <li>• Account data: Retained while your account is active and for 3 years after deactivation</li>
                  <li>• Payment information: Retained for 7 years for tax and accounting purposes</li>
                  <li>• Analytics data: Aggregated and anonymized after 2 years</li>
                  <li>• Marketing data: Retained until you unsubscribe or request deletion</li>
                </ul>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">8. International Data Transfers</h2>
                <p className="text-gray-600 leading-relaxed">
                  Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your information during such transfers, including standard contractual clauses and adequacy decisions.
                </p>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">9. Children's Privacy</h2>
                <p className="text-gray-600 leading-relaxed">
                  Our services are not intended for children under 13. We do not knowingly collect personal information from children under 13. If we become aware that we have collected such information, we will delete it immediately.
                </p>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">10. Changes to This Policy</h2>
                <p className="text-gray-600 leading-relaxed">
                  We may update this Privacy Policy from time to time. We will notify you of material changes via email or platform notification. Your continued use of our services after such changes constitutes acceptance of the updated policy.
                </p>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">11. Contact Us</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  If you have questions about this Privacy Policy or our data practices, please contact us:
                </p>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Privacy Officer</h4>
                      <p className="text-blue-600">privacy@advancestep.com</p>
                      <p className="text-gray-600 text-sm mt-1">For privacy-related inquiries</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Data Protection</h4>
                      <p className="text-blue-600">dpo@advancestep.com</p>
                      <p className="text-gray-600 text-sm mt-1">For GDPR and data rights requests</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-gray-600 text-sm">
                      <strong>Mailing Address:</strong> [Your Business Address]<br />
                      <strong>Phone:</strong> [Your Privacy Hotline Number]
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">Your Privacy Rights</h3>
                <p className="text-blue-800">
                  We are committed to protecting your privacy and complying with applicable data protection laws. Your trust is important to us, and we are here to address any privacy concerns you may have.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}