"use client";
import Footer from "./components/Footer";
import { useToast } from "./components/Toast";

export default function Home() {
  const { addToast, removeToast } = useToast();

  // Function to add item to cart
  const addToCart = (product: { id: string; name: string; price: number }) => {
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
  return (
    <div className="min-h-screen font-sans text-black dark:text-white">
      {/* Hero */}
      <header className="relative overflow-hidden min-h-screen flex items-center">
        {/* Background geometric shapes */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200 dark:bg-blue-800 rounded-full opacity-20 dark:opacity-10 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-16 h-16 bg-purple-200 dark:bg-purple-800 rounded-lg opacity-30 dark:opacity-15 animate-bounce" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-40 left-1/4 w-12 h-12 bg-green-200 dark:bg-green-800 rounded-full opacity-25 dark:opacity-10 animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-1/3 right-10 w-24 h-24 bg-pink-200 dark:bg-pink-800 rounded-lg opacity-20 dark:opacity-10 animate-bounce" style={{animationDelay: '0.5s'}}></div>
          <div className="absolute bottom-20 right-1/3 w-18 h-18 bg-yellow-200 dark:bg-yellow-800 rounded-full opacity-30 dark:opacity-15 animate-pulse" style={{animationDelay: '1.5s'}}></div>
        </div>

        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"></div>
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-8 lg:gap-12">
            <div className="text-center lg:text-left relative">
              {/* Feature badges */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-3 mb-6">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-700">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  NFC Ready
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-700">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/>
                  </svg>
                  QR Code
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-700">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 1.414L10.586 9.5H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd"/>
                  </svg>
                  Instant Share
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight text-gray-900 dark:text-white drop-shadow-sm">
                Digital Business Card by <span className="text-blue-600 dark:text-blue-400">Advance Step</span>
              </h1>
              <p className="mt-4 sm:mt-6 max-w-2xl text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                Create a digital business card for you and your team — share
                contact, socials, and more with a single tap or link.
              </p>
              <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 lg:justify-start">
                <a
                  className="group inline-flex items-center justify-center rounded-full bg-blue-600 px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 hover:bg-blue-700"
                  href="/auth"
                >
                  <span>Get Started</span>
                  <svg className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                  </svg>
                </a>
                <a
                  className="group inline-flex items-center justify-center rounded-full bg-white dark:bg-gray-800 border-2 border-blue-200 dark:border-blue-600 px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base text-blue-700 dark:text-blue-400 font-semibold hover:border-blue-300 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transform hover:scale-105 transition-all duration-300"
                  href="/contact"
                >
                  <span>For Teams</span>
                  <svg className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                  </svg>
                </a>
              </div>
            </div>

            <div className="relative hidden lg:flex items-center justify-center">
              {/* Floating animated icons around phone */}
              <div className="absolute -top-8 -left-8 w-12 h-12 bg-blue-500 dark:bg-blue-600 rounded-full flex items-center justify-center shadow-lg animate-bounce" style={{animationDelay: '0s'}}>
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                </svg>
              </div>

              <div className="absolute -top-4 -right-4 w-10 h-10 bg-green-500 dark:bg-green-600 rounded-full flex items-center justify-center shadow-lg animate-pulse" style={{animationDelay: '1s'}}>
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
              </div>

              <div className="absolute top-1/2 -left-12 w-8 h-8 bg-purple-500 dark:bg-purple-600 rounded-lg flex items-center justify-center shadow-lg animate-bounce" style={{animationDelay: '2s'}}>
                <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>

              <div className="absolute bottom-8 -right-6 w-11 h-11 bg-pink-500 dark:bg-pink-600 rounded-full flex items-center justify-center shadow-lg animate-pulse" style={{animationDelay: '0.5s'}}>
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"/>
                </svg>
              </div>

              <div className="absolute bottom-4 -left-10 w-9 h-9 bg-yellow-500 dark:bg-yellow-600 rounded-lg flex items-center justify-center shadow-lg animate-bounce" style={{animationDelay: '1.5s'}}>
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
                </svg>
              </div>

              {/* Phone mockup */}
              <div className="w-[380px] h-[720px] rounded-3xl bg-gradient-to-br from-blue-200 via-purple-100 to-pink-100 dark:from-blue-900/40 dark:via-purple-900/40 dark:to-pink-900/40 shadow-2xl flex items-center justify-center transform hover:scale-105 transition-transform duration-500">
                <div className="w-[340px] h-[660px] bg-white dark:bg-gray-800 rounded-2xl shadow-inner flex flex-col items-center justify-start p-6">
                  <div className="w-28 h-28 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 mt-6 shadow-lg"></div>
                  <h3 className="mt-6 text-xl font-semibold text-gray-900 dark:text-white">Lucy Diamond</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Head of Sales • New York</p>
                  <div className="mt-8 w-full flex-1" />
                  <div className="w-full mb-6">
                    <div className="h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white flex items-center justify-center font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                      Exchange Contact
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Featured Products Section */}
      <main className="mx-auto max-w-7xl px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Featured Products</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Discover our premium digital business card collection designed for professionals who want to make lasting impressions.
          </p>
        </div>

        {/* Custom Card Highlight */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-700 dark:to-blue-700 rounded-xl sm:rounded-2xl p-6 sm:p-8 mb-8 sm:mb-12 text-center text-white shadow-xl">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Create Your Custom Digital Card</h3>
            <p className="text-base sm:text-lg mb-4 sm:mb-6 opacity-90">
              Design a personalized business card with our interactive 3D preview tool. Upload your photo, customize your information, and create a professional digital presence.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center">
              <a
                href="/custom-card"
                className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                </svg>
                Start Creating Now
              </a>
              <span className="text-sm opacity-75">Free to design • Instant preview • 3D visualization</span>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-12 lg:mb-16">
          {/* Product 1 - NFC Business Card */}
          <div className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700">
            <div className="relative h-48 bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center">
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
                </svg>
              </div>
              <div className="absolute top-4 right-4 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                NFC Ready
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">NFC Business Card</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                Tap-to-share technology with instant contact exchange. Premium matte finish with gold foil accents.
              </p>
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-bold text-blue-600">$29.99</span>
                <div className="flex items-center text-yellow-400">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                  <span className="text-gray-600 dark:text-gray-400 text-sm ml-1">4.8 (120)</span>
                </div>
              </div>
              <button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
                onClick={() => addToCart({ id: 'nfc-card', name: 'NFC Business Card', price: 29.99 })}
              >
                Add to Cart
              </button>
            </div>
          </div>

          {/* Product 2 - QR Code Business Card */}
          <div className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700">
            <div className="relative h-48 bg-gradient-to-br from-green-400 to-blue-600 flex items-center justify-center">
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M12 15h4.01M12 21h4.01M12 12v.01M15 12v.01M18 12v.01M12 18v.01M15 18v.01M18 18v.01M21 21v-4a2 2 0 00-2-2h-4a2 2 0 00-2 2v4m7-10V7a2 2 0 00-2-2h-4a2 2 0 00-2 2v4m7 0H9m7 0v4m0-4H9"/>
                </svg>
              </div>
              <div className="absolute top-4 right-4 bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                QR Code
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">QR Code Business Card</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                Scan-to-connect with custom QR codes. Eco-friendly recycled paper with holographic effects.
              </p>
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-bold text-blue-600">$24.99</span>
                <div className="flex items-center text-yellow-400">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                  <span className="text-gray-600 dark:text-gray-400 text-sm ml-1">4.9 (95)</span>
                </div>
              </div>
              <button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
                onClick={() => addToCart({ id: 'qr-card', name: 'QR Code Business Card', price: 24.99 })}
              >
                Add to Cart
              </button>
            </div>
          </div>

          {/* Product 3 - Premium Metal Card */}
          <div className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700">
            <div className="relative h-48 bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center">
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div className="absolute top-4 right-4 bg-purple-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                Premium
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Premium Metal Card</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                Luxurious metal finish with laser engraving. Waterproof and scratch-resistant with lifetime warranty.
              </p>
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-bold text-blue-600">$49.99</span>
                <div className="flex items-center text-yellow-400">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                  <span className="text-gray-600 dark:text-gray-400 text-sm ml-1">4.7 (85)</span>
                </div>
              </div>
              <button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
                onClick={() => addToCart({ id: 'premium-metal', name: 'Premium Metal Card', price: 49.99 })}
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
