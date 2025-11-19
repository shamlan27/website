"use client";
import Footer from "../components/Footer";

export default function ShippingPolicy() {
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
              Shipping <span className="text-blue-600">Policy</span>
            </h1>
            <p className="mt-6 max-w-3xl mx-auto text-lg text-gray-600 leading-relaxed">
              Fast, reliable delivery for all your digital business card products.
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
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Shipping Methods</h2>
                <p className="text-gray-600 leading-relaxed mb-6">
                  We offer multiple shipping options to meet your needs. All physical products are shipped from our fulfillment centers strategically located for fast delivery.
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h3 className="text-xl font-semibold text-blue-900 mb-3">Standard Shipping</h3>
                    <div className="space-y-2 text-blue-800">
                      <p><strong>Delivery Time:</strong> 5-7 business days</p>
                      <p><strong>Cost:</strong> $4.99 (Free on orders over $50)</p>
                      <p><strong>Tracking:</strong> Included</p>
                    </div>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                    <h3 className="text-xl font-semibold text-green-900 mb-3">Express Shipping</h3>
                    <div className="space-y-2 text-green-800">
                      <p><strong>Delivery Time:</strong> 2-3 business days</p>
                      <p><strong>Cost:</strong> $9.99</p>
                      <p><strong>Tracking:</strong> Included</p>
                    </div>
                  </div>

                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                    <h3 className="text-xl font-semibold text-purple-900 mb-3">Priority Shipping</h3>
                    <div className="space-y-2 text-purple-800">
                      <p><strong>Delivery Time:</strong> 1-2 business days</p>
                      <p><strong>Cost:</strong> $14.99</p>
                      <p><strong>Tracking:</strong> Included</p>
                    </div>
                  </div>

                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                    <h3 className="text-xl font-semibold text-orange-900 mb-3">International Shipping</h3>
                    <div className="space-y-2 text-orange-800">
                      <p><strong>Delivery Time:</strong> 7-14 business days</p>
                      <p><strong>Cost:</strong> Calculated at checkout</p>
                      <p><strong>Tracking:</strong> Included</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Processing Time</h2>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Order Processing</h3>
                      <ul className="text-gray-600 space-y-2">
                        <li>• Digital products: Instant delivery</li>
                        <li>• Physical cards: 1-2 business days</li>
                        <li>• Custom orders: 2-3 business days</li>
                        <li>• Bulk orders: 3-5 business days</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Order Cut-off Times</h3>
                      <ul className="text-gray-600 space-y-2">
                        <li>• Standard orders: 2 PM EST</li>
                        <li>• Express orders: 12 PM EST</li>
                        <li>• Weekend orders: Processed Monday</li>
                        <li>• Holiday processing: Extended time</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Shipping Zones</h2>
                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-lg p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">United States</h3>
                    <div className="grid md:grid-cols-3 gap-4 text-gray-600">
                      <div>
                        <strong>Continental US:</strong><br />
                        Standard: 5-7 days<br />
                        Express: 2-3 days
                      </div>
                      <div>
                        <strong>Alaska/Hawaii:</strong><br />
                        Standard: 7-10 days<br />
                        Express: 3-5 days
                      </div>
                      <div>
                        <strong>US Territories:</strong><br />
                        Standard: 7-14 days<br />
                        Express: 4-7 days
                      </div>
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">International</h3>
                    <div className="grid md:grid-cols-2 gap-4 text-gray-600">
                      <div>
                        <strong>Canada & Mexico:</strong><br />
                        Standard: 5-10 days<br />
                        Express: 3-5 days
                      </div>
                      <div>
                        <strong>Europe:</strong><br />
                        Standard: 7-14 days<br />
                        Express: 4-7 days
                      </div>
                      <div>
                        <strong>Asia Pacific:</strong><br />
                        Standard: 7-14 days<br />
                        Express: 4-8 days
                      </div>
                      <div>
                        <strong>Other Regions:</strong><br />
                        Standard: 10-21 days<br />
                        Express: 5-10 days
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Free Shipping</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Enjoy free standard shipping on qualifying orders:
                </p>
                <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-r-lg">
                  <ul className="text-green-800 space-y-2">
                    <li>• Orders over $50 (standard shipping)</li>
                    <li>• All digital products (instant delivery)</li>
                    <li>• Enterprise plan subscribers</li>
                    <li>• Bulk orders (10+ units)</li>
                  </ul>
                </div>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Tracking & Delivery</h2>
                <div className="space-y-4">
                  <p className="text-gray-600 leading-relaxed">
                    Once your order ships, you'll receive a tracking number via email with a direct link to track your package.
                  </p>

                  <div className="bg-blue-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-blue-900 mb-3">What happens if I'm not home?</h3>
                    <ul className="text-blue-800 space-y-2">
                      <li>• Most carriers leave packages at your door</li>
                      <li>• Signature may be required for high-value orders</li>
                      <li>• Contact carrier for redelivery options</li>
                      <li>• Secure locations available at carrier facilities</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Damaged or Lost Packages</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  While we take every precaution to ensure safe delivery, occasionally packages may arrive damaged or be lost in transit.
                </p>

                <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-lg">
                  <h3 className="text-lg font-semibold text-red-900 mb-3">What to do:</h3>
                  <ol className="text-red-800 space-y-2 list-decimal list-inside">
                    <li>Contact us within 48 hours of delivery</li>
                    <li>Provide photos of damaged packaging</li>
                    <li>Include tracking number and order details</li>
                    <li>We'll arrange replacement or refund</li>
                  </ol>
                </div>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Customs & Duties</h2>
                <p className="text-gray-600 leading-relaxed">
                  International orders may be subject to customs duties, taxes, or fees. These charges are the responsibility of the recipient and are not included in our shipping costs. We recommend checking with your local customs office for current rates.
                </p>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Contact Information</h2>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Shipping Questions</h4>
                      <p className="text-blue-600">shipping@advancestep.com</p>
                      <p className="text-gray-600 text-sm mt-1">Response within 24 hours</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Order Tracking</h4>
                      <p className="text-blue-600">orders@advancestep.com</p>
                      <p className="text-gray-600 text-sm mt-1">Include order number</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}