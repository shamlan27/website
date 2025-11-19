"use client";
import Footer from "../components/Footer";
import { useToast } from "../components/Toast";
import Link from "next/link";

export default function Shop() {
  const { addToast, removeToast } = useToast();

  const products = [
    {
      id: 'custom-card',
      name: 'Custom Digital Business Card',
      price: 29.99,
      description: 'Personalized digital business card with your photo and custom information',
      features: ['3D Preview', 'NFC Ready', 'Drag & Drop Design', 'Instant Sharing'],
      image: '/card-preview.png',
      href: '/custom-card'
    },
    {
      id: 'custom-metal-cards',
      name: 'Custom Metal Cards',
      price: 49.99,
      description: 'Premium metal business cards with custom engraving',
      features: ['Metal Finish', 'Custom Engraving', 'Durable', 'Professional'],
      image: '/metal-card.png',
      href: '/custom-card'
    },
    {
      id: 'Tap-cards',
      name: 'Tap-Cards',
      price: 39.99,
      description: 'Innovative Tap-shaped business cards',
      features: ['Unique Design', 'Memorable', 'Custom Colors', 'Premium Material'],
      image: '/tap-card.png',
      href: '/custom-card'
    },
    {
      id: 'Tap-metal-cards',
      name: 'Tap Metal Cards',
      price: 59.99,
      description: 'Tap-shaped metal business cards',
      features: ['Metal + Tap Design', 'Premium Feel', 'Custom Engraving', 'Luxury'],
      image: '/tap-metal.png',
      href: '/custom-card'
    },
    {
      id: 'tap-bracelets',
      name: 'Tap Bracelets',
      price: 79.99,
      description: 'Wearable business card bracelets',
      features: ['Wearable Tech', 'NFC Enabled', 'Custom Design', 'Fashion Forward'],
      image: '/bracelet.png',
      href: '/custom-card'
    }
  ];

  const addToCart = (product: typeof products[0]) => {
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
        addToast(`Thanks for adding ${product.name} to cart!`, 'success', true);
      } catch (error) {
        console.error('Error adding item to cart:', error);
        removeToast(loadingToastId);
        addToast('❌ Error adding item to cart. Please try again.', 'error');
      }
    }, 300);
  };

  return (
    <div className="min-h-screen font-sans text-black">
      {/* Hero Section */}
      <header className="relative overflow-hidden hero-gradient py-20">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-20 h-20 bg-purple-200 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-16 h-16 bg-pink-200 rounded-lg opacity-30 animate-bounce" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-40 left-1/4 w-12 h-12 bg-blue-200 rounded-full opacity-25 animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight drop-shadow-sm" style={{color: 'var(--foreground)'}}>
              Shop <span className="text-purple-600">Business Cards</span>
            </h1>
            <p className="mt-4 sm:mt-6 max-w-3xl mx-auto text-base sm:text-lg text-gray-600 leading-relaxed">
              Discover our premium collection of digital and physical business cards. From custom designs to metal finishes, find the perfect card for your professional needs.
            </p>
          </div>
        </div>
      </header>

      {/* Products Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4" style={{color: 'var(--foreground)'}}>Our Products</h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
              Choose from our wide range of business card options, each designed to make a lasting impression.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="aspect-w-16 aspect-h-9 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-8">
                  <div className="w-full h-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                    </svg>
                  </div>
                </div>

                <div className="p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-semibold mb-2" style={{color: 'var(--foreground)'}}>{product.name}</h3>
                  <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">{product.description}</p>

                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {product.features.map((feature, index) => (
                        <span key={index} className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 sm:gap-0">
                    <span className="text-xl sm:text-2xl font-bold" style={{color: 'var(--foreground)'}}>${product.price}</span>
                    <div className="flex space-x-2">
                      <Link
                        href={product.href}
                        className="flex-1 sm:flex-initial px-3 sm:px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors text-center"
                      >
                        Customize
                      </Link>
                      <button
                        onClick={() => addToCart(product)}
                        className="flex-1 sm:flex-initial px-3 sm:px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4" style={{color: 'var(--foreground)'}}>Why Choose Our Cards?</h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
              Every card is crafted with attention to detail and designed to help you make meaningful connections.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-lg text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4" style={{color: 'var(--foreground)'}}>Custom Design</h3>
              <p className="text-gray-600">
                Create a card that perfectly represents your personal brand with our easy-to-use design tools.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4" style={{color: 'var(--foreground)'}}>Premium Quality</h3>
              <p className="text-gray-600">
                High-quality materials and printing ensure your cards make a professional impression every time.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4" style={{color: 'var(--foreground)'}}>NFC Technology</h3>
              <p className="text-gray-600">
                Tap to share your contact information instantly with NFC-enabled devices and QR codes.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}