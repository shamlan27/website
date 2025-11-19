"use client";
import Footer from "../components/Footer";
import { useToast } from "../components/Toast";

export default function Pricing() {
  const { addToast, removeToast } = useToast();

  // Function to add item to cart
  const addToCart = (product: { id: string; name: string; price: number; description: string }) => {
    // Check if we're in browser environment
    if (typeof window === 'undefined') return;

    // Show loading toast
    const loadingToastId = addToast('Adding to cart...', 'loading');

    setTimeout(() => {
      try {
        // Get existing cart from localStorage
        const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');

        // Check if item already exists in cart
        const existingItemIndex = existingCart.findIndex((item: any) => item.id === product.id);

        if (existingItemIndex >= 0) {
          // Increase quantity if item exists
          existingCart[existingItemIndex].quantity += 1;
        } else {
          // Add new item to cart
          existingCart.push({
            ...product,
            quantity: 1
          });
        }

        // Save updated cart to localStorage
        localStorage.setItem('cart', JSON.stringify(existingCart));

        // Dispatch custom event to trigger instant cart update
        window.dispatchEvent(new CustomEvent('cartUpdated', {
          detail: { cart: existingCart }
        }));

        // Remove loading toast and show success toast
        removeToast(loadingToastId);
        addToast(`Thanks for adding our product to cart!`, 'success', true);
      } catch (error) {
        console.error('Error adding item to cart:', error);
        removeToast(loadingToastId);
        addToast('❌ Error adding item to cart. Please try again.', 'error');
      }
    }, 300);
  };

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      price: 9.99,
      period: 'month',
      description: 'Perfect for individuals getting started',
      features: [
        '1 Digital Business Card',
        'Basic customization',
        'Contact sharing',
        'Mobile responsive',
        'Email support'
      ],
      popular: false
    },
    {
      id: 'professional',
      name: 'Professional',
      price: 19.99,
      period: 'month',
      description: 'Ideal for growing professionals',
      features: [
        '5 Digital Business Cards',
        'Advanced customization',
        'Analytics dashboard',
        'QR code integration',
        'Priority support',
        'Custom domain'
      ],
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 49.99,
      period: 'month',
      description: 'For teams and organizations',
      features: [
        'Unlimited Digital Business Cards',
        'Team management',
        'Advanced analytics',
        'API access',
        'White-label solution',
        '24/7 phone support',
        'Custom integrations'
      ],
      popular: false
    }
  ];

  const addons = [
    {
      id: 'nfc-upgrade',
      name: 'NFC Card Upgrade',
      price: 15.00,
      description: 'Physical NFC business card with digital sync',
      features: ['NFC-enabled physical card', 'Auto-sync with digital card', 'Premium materials']
    },
    {
      id: 'custom-domain',
      name: 'Custom Domain',
      price: 25.00,
      period: 'year',
      description: 'Use your own domain for business cards',
      features: ['yourname.com/cards', 'SSL certificate included', 'SEO optimized']
    },
    {
      id: 'analytics-pro',
      name: 'Advanced Analytics',
      price: 12.00,
      period: 'month',
      description: 'Detailed insights into your card performance',
      features: ['Contact tracking', 'Geographic data', 'Conversion metrics', 'Export reports']
    }
  ];

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
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight drop-shadow-sm" style={{color: 'var(--foreground)'}}>
              Simple, Transparent <span className="text-blue-600">Pricing</span>
            </h1>
            <p className="mt-4 sm:mt-6 max-w-3xl mx-auto text-base sm:text-lg text-gray-600 leading-relaxed">
              Choose the perfect plan for your digital business card needs. Upgrade or downgrade at any time.
            </p>
          </div>
        </div>
      </header>

      {/* Pricing Plans */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 ${
                  plan.popular
                    ? 'border-blue-500 scale-105'
                    : 'border-gray-100 hover:border-blue-200'
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-blue-500 text-white px-4 py-1 text-sm font-medium rounded-bl-lg">
                    Most Popular
                  </div>
                )}

                <div className="p-8">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold mb-2" style={{color: 'var(--foreground)'}}>{plan.name}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">{plan.description}</p>
                  </div>

                  <div className="text-center mb-6">
                    <div className="flex items-baseline justify-center">
                      <span className="text-4xl font-bold" style={{color: 'var(--foreground)'}}>${plan.price}</span>
                      <span className="text-gray-600 dark:text-gray-400 ml-1">/{plan.period}</span>
                    </div>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-gray-600 dark:text-gray-400">
                        <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => addToCart({
                      id: plan.id,
                      name: `${plan.name} Plan`,
                      price: plan.price,
                      description: plan.description
                    })}
                    className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 ${
                      plan.popular
                        ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                    }`}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Add-ons Section */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4" style={{color: 'var(--foreground)'}}>Popular Add-ons</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Enhance your digital business card experience with these powerful add-ons.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {addons.map((addon) => (
              <div
                key={addon.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 border border-gray-100 dark:border-gray-700"
              >
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2" style={{color: 'var(--foreground)'}}>{addon.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">{addon.description}</p>
                  <div className="flex items-baseline mb-4">
                    <span className="text-2xl font-bold" style={{color: 'var(--foreground)'}}>${addon.price}</span>
                    {addon.period && <span className="text-gray-600 dark:text-gray-400 ml-1">/{addon.period}</span>}
                  </div>
                </div>

                <ul className="space-y-2 mb-6">
                  {addon.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                      <svg className="w-4 h-4 text-blue-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => addToCart({
                    id: addon.id,
                    name: addon.name,
                    price: addon.price,
                    description: addon.description
                  })}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105"
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold" style={{color: 'var(--foreground)'}}>Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Everything you need to know about our pricing and plans.
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-2" style={{color: 'var(--foreground)'}}>Can I change my plan anytime?</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate the billing accordingly.
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-2" style={{color: 'var(--foreground)'}}>Is there a free trial?</h3>
              <p className="text-gray-600 dark:text-gray-400">
                We offer a 14-day free trial for all plans. No credit card required to get started. Create your account and start building your digital business card immediately.
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-2" style={{color: 'var(--foreground)'}}>What payment methods do you accept?</h3>
              <p className="text-gray-600 dark:text-gray-400">
                We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for annual plans.
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Do you offer refunds?</h3>
              <p className="text-gray-600 dark:text-gray-400">
                We offer a 30-day money-back guarantee. If you're not satisfied with our service, contact our support team for a full refund.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4">Ready to Get Started?</h2>
          <p className="text-base sm:text-lg text-white/90 mb-6 sm:mb-8">
            Join thousands of professionals who trust Advance Step for their digital business cards.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <a
              href="/auth"
              className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 border border-transparent text-base sm:text-lg font-medium rounded-full text-blue-600 bg-white hover:bg-gray-50 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Start Free Trial
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
              </svg>
            </a>
            <a
              href="/contact"
              className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 border-2 border-white text-base sm:text-lg font-medium rounded-full text-white hover:bg-white hover:text-blue-600 transform hover:scale-105 transition-all duration-300"
            >
              Contact Sales
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}