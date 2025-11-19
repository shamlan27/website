"use client";
import Footer from "../components/Footer";

export default function TermsOfService() {
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
              Terms of <span className="text-blue-600">Service</span>
            </h1>
            <p className="mt-6 max-w-3xl mx-auto text-lg text-gray-600 leading-relaxed">
              Please read these terms carefully before using our services.
            </p>
          </div>
        </div>
      </header>

      {/* Terms Content */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-4xl px-6">
          <div className="prose prose-lg max-w-none">
            <div className="mb-8">
              <p className="text-gray-600 text-lg leading-relaxed">
                <strong className="text-gray-900">Last updated:</strong> November 14, 2025
              </p>
              <p className="text-gray-600 text-lg leading-relaxed mt-2">
                These Terms of Service ("Terms") govern your use of Advance Step's digital business card platform and services.
              </p>
            </div>

            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
                <p className="text-gray-600 leading-relaxed">
                  By accessing and using Advance Step's services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                </p>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">2. Description of Service</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Advance Step provides a digital business card platform that allows users to:
                </p>
                <ul className="text-gray-600 space-y-2 ml-6">
                  <li>• Create and customize digital business cards</li>
                  <li>• Share contact information via QR codes and links</li>
                  <li>• Access analytics and insights</li>
                  <li>• Purchase physical NFC business cards</li>
                  <li>• Manage multiple business profiles</li>
                </ul>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">3. User Accounts</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Account Creation</h3>
                    <p className="text-gray-600 leading-relaxed">
                      To use our services, you must create an account with accurate, complete, and current information. You are responsible for maintaining the confidentiality of your account credentials.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Account Responsibilities</h3>
                    <ul className="text-gray-600 space-y-2 ml-6">
                      <li>• You are responsible for all activities under your account</li>
                      <li>• Notify us immediately of any unauthorized use</li>
                      <li>• Keep your contact information updated</li>
                      <li>• Use only one account per person</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">4. Acceptable Use Policy</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  You agree not to use our services to:
                </p>

                <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-lg mb-6">
                  <h3 className="text-lg font-semibold text-red-900 mb-3">Prohibited Activities</h3>
                  <ul className="text-red-800 space-y-2">
                    <li>• Violate any laws or regulations</li>
                    <li>• Share false or misleading information</li>
                    <li>• Harass, abuse, or harm others</li>
                    <li>• Distribute malware or harmful code</li>
                    <li>• Attempt to gain unauthorized access</li>
                    <li>• Use the service for spam or unsolicited communications</li>
                    <li>• Impersonate others or misrepresent your identity</li>
                  </ul>
                </div>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">5. Content Ownership and Rights</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Your Content</h3>
                    <p className="text-gray-600 leading-relaxed">
                      You retain ownership of the content you create and upload to our platform. By using our services, you grant us a license to use, display, and distribute your content as necessary to provide our services.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Our Content</h3>
                    <p className="text-gray-600 leading-relaxed">
                      All platform features, templates, and branding materials are owned by Advance Step and are protected by copyright and other intellectual property laws.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">6. Privacy and Data Protection</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Your privacy is important to us. Our collection and use of personal information is governed by our Privacy Policy, which is incorporated into these Terms by reference.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  We implement appropriate security measures to protect your personal information and comply with applicable data protection laws including GDPR.
                </p>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">7. Payment Terms</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Billing</h3>
                    <ul className="text-gray-600 space-y-2 ml-6">
                      <li>• Subscription fees are billed in advance</li>
                      <li>• Payment is due on the billing date</li>
                      <li>• Failed payments may result in service suspension</li>
                      <li>• All fees are non-refundable unless specified otherwise</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Price Changes</h3>
                    <p className="text-gray-600 leading-relaxed">
                      We may change pricing with 30 days notice. Price changes will not affect current billing cycles.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">8. Service Availability</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  While we strive for high availability, we do not guarantee uninterrupted service. We may perform maintenance or experience outages that temporarily affect service availability.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  We reserve the right to modify or discontinue features with reasonable notice.
                </p>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">9. Termination</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">By You</h3>
                    <p className="text-gray-600 leading-relaxed">
                      You may terminate your account at any time. Termination takes effect at the end of your current billing period.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">By Us</h3>
                    <p className="text-gray-600 leading-relaxed">
                      We may terminate or suspend your account for violations of these Terms. We'll provide notice and opportunity to cure where appropriate.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">10. Disclaimers</h2>
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r-lg">
                  <p className="text-yellow-800 leading-relaxed">
                    Our services are provided "as is" without warranties of any kind. We disclaim all warranties, express or implied, including merchantability and fitness for a particular purpose. We do not warrant that the service will be error-free or uninterrupted.
                  </p>
                </div>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">11. Limitation of Liability</h2>
                <p className="text-gray-600 leading-relaxed">
                  To the maximum extent permitted by law, Advance Step shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our services.
                </p>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">12. Indemnification</h2>
                <p className="text-gray-600 leading-relaxed">
                  You agree to indemnify and hold harmless Advance Step from any claims, damages, losses, or expenses arising from your use of our services or violation of these Terms.
                </p>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">13. Governing Law</h2>
                <p className="text-gray-600 leading-relaxed">
                  These Terms shall be governed by and construed in accordance with the laws of [Your Jurisdiction], without regard to its conflict of law provisions.
                </p>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">14. Changes to Terms</h2>
                <p className="text-gray-600 leading-relaxed">
                  We may update these Terms from time to time. We'll notify users of material changes via email or platform notification. Continued use after changes constitutes acceptance.
                </p>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">15. Contact Information</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  If you have questions about these Terms, please contact us:
                </p>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Legal Questions</h4>
                      <p className="text-blue-600">legal@advancestep.com</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">General Support</h4>
                      <p className="text-blue-600">support@advancestep.com</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">Acceptance</h3>
                <p className="text-blue-800">
                  By using Advance Step's services, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
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