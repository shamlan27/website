"use client";
import Footer from "../components/Footer";

export default function RefundPolicy() {
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
              Refund <span className="text-blue-600">Policy</span>
            </h1>
            <p className="mt-6 max-w-3xl mx-auto text-lg text-gray-600 leading-relaxed">
              Our commitment to your satisfaction with transparent refund terms.
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
            </div>

            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">30-Day Money-Back Guarantee</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  At Advance Step, we stand behind our digital business card platform. If you're not completely satisfied with our service within the first 30 days of your subscription, we'll provide a full refund - no questions asked.
                </p>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Eligibility for Refunds</h2>
                <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg mb-6">
                  <h3 className="text-xl font-semibold text-blue-900 mb-3">Full Refund (100%)</h3>
                  <ul className="text-blue-800 space-y-2">
                    <li>• Within 30 days of initial purchase or subscription start</li>
                    <li>• If you haven't used the service extensively</li>
                    <li>• For technical issues that prevent normal use (our fault)</li>
                    <li>• If we discontinue a service you paid for</li>
                  </ul>
                </div>

                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-r-lg mb-6">
                  <h3 className="text-xl font-semibold text-yellow-900 mb-3">Partial Refund (50%)</h3>
                  <ul className="text-yellow-800 space-y-2">
                    <li>• Between 30-60 days of subscription</li>
                    <li>• If you cancel due to personal reasons</li>
                    <li>• For unused prepaid services</li>
                  </ul>
                </div>

                <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-lg">
                  <h3 className="text-xl font-semibold text-red-900 mb-3">No Refund</h3>
                  <ul className="text-red-800 space-y-2">
                    <li>• After 60 days of subscription</li>
                    <li>• For physical products that have been used or damaged</li>
                    <li>• For services already consumed or delivered</li>
                    <li>• If terms of service were violated</li>
                  </ul>
                </div>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">How to Request a Refund</h2>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <ol className="text-gray-700 space-y-3 list-decimal list-inside">
                    <li><strong>Contact our support team</strong> via email at refunds@advancestep.com or through our contact form</li>
                    <li><strong>Provide your account details</strong> including email address and subscription information</li>
                    <li><strong>Explain your reason</strong> for requesting a refund (optional but helpful)</li>
                    <li><strong>Wait for confirmation</strong> - we'll review your request within 2-3 business days</li>
                    <li><strong>Receive your refund</strong> via your original payment method within 5-10 business days</li>
                  </ol>
                </div>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Subscription Cancellation</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  You can cancel your subscription at any time through your account dashboard. Upon cancellation:
                </p>
                <ul className="text-gray-600 space-y-2 ml-6">
                  <li>• Your service continues until the end of your current billing period</li>
                  <li>• You retain access to all features during this period</li>
                  <li>• No cancellation fees are charged</li>
                  <li>• You can reactivate your account anytime</li>
                </ul>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Physical Products</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  For physical NFC business cards and other tangible products:
                </p>
                <ul className="text-gray-600 space-y-2 ml-6">
                  <li>• Returns accepted within 14 days if product is unused and in original packaging</li>
                  <li>• Customer pays return shipping costs</li>
                  <li>• Refunds processed after product inspection</li>
                  <li>• Damaged or used items may not be eligible for refund</li>
                </ul>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Refund Processing Time</h2>
                <p className="text-gray-600 leading-relaxed">
                  Refund processing times vary by payment method:
                </p>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="font-medium">Credit/Debit Cards</span>
                    <span className="text-gray-600">3-5 business days</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="font-medium">KOKO</span>
                    <span className="text-gray-600">1-3 business days</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="font-medium">Cash On Delivery</span>
                    <span className="text-gray-600">5-10 business days</span>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Contact Information</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  If you have any questions about our refund policy or need to initiate a refund request, please contact us:
                </p>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Email</h4>
                      <p className="text-blue-600">refunds@advancestep.com</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Business Hours</h4>
                      <p className="text-gray-600">Monday - Friday, 9 AM - 6 PM EST</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r-lg">
                <h3 className="text-lg font-semibold text-yellow-900 mb-2">Important Note</h3>
                <p className="text-yellow-800">
                  This refund policy applies to purchases made through our official website. Refunds for purchases made through third-party marketplaces may be subject to their respective policies.
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