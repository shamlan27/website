import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-20 bg-gray-900 text-gray-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 sm:gap-8">
          <div>
            <h4 className="mb-6 text-sm font-semibold tracking-widest">COMPANY</h4>
            <ul className="space-y-3 text-sm text-gray-300">
              <li><Link href="/">Home</Link></li>
              <li><Link href="/free-digital-business-card">Free Digital Business Card</Link></li>
              <li><Link href="/company/nfc-business-cards">NFC Business Cards</Link></li>
              <li><Link href="/business">For Businesses & Enterprise</Link></li>
              <li><Link href="/login">Profile Login</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-6 text-sm font-semibold tracking-widest">SHOP</h4>
            <ul className="space-y-3 text-sm text-gray-300">
              <li><Link href="/shop">All Products</Link></li>
              <li><Link href="/custom-card">Custom Cards</Link></li>
              <li><Link href="/shop/custom-metal-cards">Custom Metal Cards</Link></li>
              <li><Link href="/shop/tap-cards">Tap Cards</Link></li>
              <li><Link href="/shop/tap-metal-cards">Tap Metal Cards</Link></li>
              <li><Link href="/shop/tap-bracelets">Tap Bracelets</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-6 text-sm font-semibold tracking-widest">RESOURCES</h4>
            <ul className="space-y-3 text-sm text-gray-300">
              <li><Link href="/blog">Blog</Link></li>
              <li><Link href="/faq">FAQ</Link></li>
              <li><Link href="/help">Help Center</Link></li>
              <li><Link href="/about">About us</Link></li>
              <li><Link href="/affiliate">Affiliate Program</Link></li>
              <li><Link href="/contact">Contact us</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-6 text-sm font-semibold tracking-widest">LEGAL</h4>
            <ul className="space-y-3 text-sm text-gray-300">
              <li><Link href="/privacy-policy">Privacy Policy</Link></li>
              <li><Link href="/terms-of-service">Terms of Service</Link></li>
              <li><Link href="/data-privacy">Data Privacy Addendum</Link></li>
              <li><Link href="/refund-policy">Refund Policy</Link></li>
              <li><Link href="/shipping-policy">Shipping Policy</Link></li>
              <li><Link href="/contact">Contact Information</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-6 text-sm font-semibold tracking-widest">Advance Step</h4>
            <p className="text-sm text-gray-300">The easiest to use digital business card for teams and individuals.</p>
            <div className="mt-6 flex items-center gap-4">
              <a href="https://facebook.com/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20">
                <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M22 12.07C22 6.48 17.52 2 11.93 2S2 6.48 2 12.07C2 17.05 5.66 21.16 10.44 21.93v-6.9H7.9v-3.06h2.54V9.41c0-2.5 1.49-3.88 3.77-3.88 1.09 0 2.23.2 2.23.2v2.45h-1.25c-1.23 0-1.61.77-1.61 1.56v1.87h2.74l-.44 3.06h-2.3v6.9C18.34 21.16 22 17.05 22 12.07z"/>
                </svg>
              </a>

              <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20">
                <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.2" />
                  <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.2" />
                  <circle cx="17.5" cy="6.5" r="0.75" fill="currentColor" />
                </svg>
              </a>

              <a href="https://linkedin.com/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20">
                <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M4.98 3.5C4.98 4.6 4.07 5.5 2.98 5.5 1.88 5.5 1 4.6 1 3.5 1 2.4 1.88 1.5 2.98 1.5 4.07 1.5 4.98 2.4 4.98 3.5zM1 8.5h4v12H1v-12zm7 0h3.8v1.6h.1c.5-.9 1.8-1.8 3.6-1.8 3.8 0 4.5 2.5 4.5 5.7v6.5H16V14c0-1.6 0-3.6-2.2-3.6-2.2 0-2.6 1.8-2.6 3.5v6.1H8V8.5z"/>
                </svg>
              </a>

              <a href="https://youtube.com/" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20">
                <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M23.5 6.2s-.2-1.6-.8-2.3c-.8-.9-1.7-.9-2.1-1-2.9-.2-7.3-.2-7.3-.2s-4.4 0-7.3.2c-.4.1-1.3.1-2.1 1C.7 4.6.5 6.2.5 6.2S.2 8 .2 9.7v.6c0 1.7.3 3.5.3 3.5s.2 1.6.8 2.3c.8.9 1.8.9 2.3 1 1.6.1 6.8.2 6.8.2s4.6 0 7.5-.2c.4-.1 1.4-.1 2.1-1 .6-.7.8-2.3.8-2.3s.3-1.8.3-3.5v-.6c0-1.7-.3-3.5-.3-3.5zM9.8 15.1V8.8l5.4 3.1-5.4 3.2z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Payment methods row */}
        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 border-t border-gray-800 pt-4 sm:pt-6">
          <div className="text-xs sm:text-sm text-gray-300 mr-0 sm:mr-4">We accept:</div>
          <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
            <img src="/payment/visa.png" alt="Visa" className="h-8 object-contain" />
            <img src="/payment/mastercard.jpg" alt="Mastercard" className="h-8 object-contain" />
            <img src="/payment/amex.png" alt="American Express" className="h-8 object-contain" />
            <img src="/payment/PayHere.png" alt="PayHere" className="h-8 object-contain" />
            <img src="/payment/mintpay.png" alt="MintPay" className="h-8 object-contain" />
            <img src="/payment/frimi.png" alt="Frimi" className="h-8 object-contain" />
            <img src="/payment/KOKO.png" alt="KOKO" className="h-8 object-contain" />
            <img src="/payment/cod.png" alt="Cash on Delivery" className="h-8 object-contain" />
          </div>
        </div>

        <div className="mt-4 sm:mt-6 border-t border-gray-800 pt-4 sm:pt-6 text-xs sm:text-sm text-gray-400">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0">
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6">
              <div className="text-xl sm:text-2xl font-bold">Advance Step</div>
              <div>© {new Date().getFullYear()} Advance Step</div>
            </div>
            <div className="flex items-center gap-4">AICPA SOC</div>
          </div>
        </div>
      </div>
    </footer>
  );
}
