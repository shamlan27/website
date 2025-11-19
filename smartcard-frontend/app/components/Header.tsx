"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { authAPI } from "@/lib/api";
// Theme disabled: no toggle

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export default function Header() {
  const [shopOpen, setShopOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState<string>("");
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  // Theme disabled: always light, no toggle

  const handleLogout = () => {
    authAPI.logout();
    setShowUserDropdown(false);
    window.location.href = '/';
  };

  // Check if user is logged in
  useEffect(() => {
    const checkAuth = () => {
      const loggedIn = authAPI.isAuthenticated();
      setIsLoggedIn(loggedIn);
      
      if (loggedIn) {
        const user = localStorage.getItem('user');
        if (user) {
          try {
            const userData = JSON.parse(user);
            setUserName(userData.name || userData.lastname || "User");
          } catch (e) {
            console.error('Error parsing user data:', e);
          }
        }
      } else {
        setUserName("");
      }
    };

    checkAuth();

    // Listen for login/logout events
    window.addEventListener('storage', checkAuth);
    window.addEventListener('auth-change', checkAuth);
    
    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('auth-change', checkAuth);
    };
  }, []);

  // Load cart from localStorage on component mount
  useEffect(() => {
    const loadCart = () => {
      if (typeof window === 'undefined') return;

      try {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          setCartItems(JSON.parse(savedCart));
        }
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    };

    loadCart();

    // Listen for storage changes (when cart is updated from other components)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'cart') {
        loadCart();
      }
    };

    // Listen for custom cart update events (for instant updates)
    const handleCartUpdate = (e: CustomEvent) => {
      if (e.detail && e.detail.cart) {
        setCartItems(e.detail.cart);
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleStorageChange);
      window.addEventListener('cartUpdated', handleCartUpdate as EventListener);
      return () => {
        window.removeEventListener('storage', handleStorageChange);
        window.removeEventListener('cartUpdated', handleCartUpdate as EventListener);
      };
    }
  }, []);
  const rootRef = useRef<HTMLDivElement | null>(null);

  // Cart functions
  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(id);
      return;
    }
    setCartItems(items => {
      const updatedItems = items.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      );
      try {
        if (typeof window !== 'undefined') {
          localStorage.setItem('cart', JSON.stringify(updatedItems));
        }
      } catch (error) {
        console.error('Error saving cart to localStorage:', error);
      }
      return updatedItems;
    });
  };

  const removeItem = (id: string) => {
    setCartItems(items => {
      const updatedItems = items.filter(item => item.id !== id);
      try {
        if (typeof window !== 'undefined') {
          localStorage.setItem('cart', JSON.stringify(updatedItems));
        }
      } catch (error) {
        console.error('Error saving cart to localStorage:', error);
      }
      return updatedItems;
    });
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setShopOpen(false);
        setResourcesOpen(false);
        setMobileOpen(false);
        setCartOpen(false);
      }
    }
    function onClick(e: MouseEvent) {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) {
        setShopOpen(false);
        setResourcesOpen(false);
        setCartOpen(false);
      }
    }

    window.addEventListener("keydown", onKey);
    window.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("click", onClick);
    };
  }, []);

  return (
    <header
      ref={rootRef}
      className="sticky top-0 z-50 pointer-events-auto bg-white/90 backdrop-blur-md border-b border-gray-100"
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" aria-label="Home" className="flex items-center gap-3">
              <div className="text-2xl font-bold text-gray-900">Advance Step</div>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-6" aria-label="Main navigation">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setShopOpen((s) => {
                      const next = !s;
                      if (next) setResourcesOpen(false);
                      return next;
                    });
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowDown") {
                      setShopOpen(true);
                      setResourcesOpen(false);
                      const first = rootRef.current?.querySelector('#shop-menu a') as HTMLElement | null;
                      first?.focus();
                      e.preventDefault();
                    }
                  }}
                  aria-expanded={shopOpen}
                  className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-800 hover:text-blue-600 transition-colors duration-200 rounded-md hover:bg-gray-50"
                >
                  Shop
                  <svg className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${shopOpen ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
                  </svg>
                </button>

                {shopOpen && (
                  <div id="shop-menu" className="absolute left-0 mt-2 w-56 rounded-lg bg-white py-2 shadow-xl border border-gray-200 animate-in fade-in slide-in-from-top-2 duration-200">
                    <ul className="text-sm text-gray-700">
                      <li><Link href="/shop" className="block px-4 py-3 hover:bg-gray-50 hover:text-blue-600 transition-colors">All Products</Link></li>
                      <li><Link href="/custom-card" className="block px-4 py-3 hover:bg-gray-50 hover:text-blue-600 transition-colors">Custom Cards</Link></li>
                      <li><Link href="/shop/custom" className="block px-4 py-3 hover:bg-gray-50 hover:text-blue-600 transition-colors">Custom Products</Link></li>
                      <li><Link href="/shop/bundles" className="block px-4 py-3 hover:bg-gray-50 hover:text-blue-600 transition-colors">Bundles</Link></li>
                      <li><Link href="/sale" className="block px-4 py-3 hover:bg-red-50 text-red-600 hover:text-red-700 transition-colors">Sale</Link></li>
                    </ul>
                  </div>
                )}
              </div>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setResourcesOpen((s) => {
                      const next = !s;
                      if (next) setShopOpen(false);
                      return next;
                    });
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowDown") {
                      setResourcesOpen(true);
                      setShopOpen(false);
                      const first = rootRef.current?.querySelector('#resources-menu a') as HTMLElement | null;
                      first?.focus();
                      e.preventDefault();
                    }
                  }}
                  aria-expanded={resourcesOpen}
                  className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-800 hover:text-blue-600 transition-colors duration-200 rounded-md hover:bg-gray-50"
                >
                  Resources
                  <svg className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${resourcesOpen ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
                  </svg>
                </button>

                {resourcesOpen && (
                  <div id="resources-menu" className="absolute left-0 mt-2 w-64 rounded-lg bg-white py-2 shadow-xl border border-gray-200 animate-in fade-in slide-in-from-top-2 duration-200">
                    <ul className="text-sm text-gray-700">
                      <li><Link href="/free-digital-business-card" className="block px-4 py-3 hover:bg-gray-50 hover:text-blue-600 transition-colors">Free Digital Business Card</Link></li>
                      <li><Link href="/company/nfc-business-cards" className="block px-4 py-3 hover:bg-gray-50 hover:text-blue-600 transition-colors">NFC Business Cards</Link></li>
                      <li><Link href="/help" className="block px-4 py-3 hover:bg-gray-50 hover:text-blue-600 transition-colors">Help Center</Link></li>
                      <li><Link href="/blog" className="block px-4 py-3 hover:bg-gray-50 hover:text-blue-600 transition-colors">Blog</Link></li>
                      <li><Link href="/faq" className="block px-4 py-3 hover:bg-gray-50 hover:text-blue-600 transition-colors">FAQ</Link></li>
                      <li><Link href="/privacy-policy" className="block px-4 py-3 hover:bg-gray-50 hover:text-blue-600 transition-colors">Privacy Policy</Link></li>
                      <li><Link href="/terms-of-service" className="block px-4 py-3 hover:bg-gray-50 hover:text-blue-600 transition-colors">Terms of Service</Link></li>
                      <li><Link href="/affiliate" className="block px-4 py-3 hover:bg-gray-50 hover:text-blue-600 transition-colors">Affiliate Program</Link></li>
                      <li><Link href="/contact" className="block px-4 py-3 hover:bg-gray-50 hover:text-blue-600 transition-colors">Contact us</Link></li>
                    </ul>
                  </div>
                )}
              </div>

              <Link href="/business" className="text-sm font-medium text-gray-800 hover:text-blue-600 transition-colors">For Businesses & Enterprise</Link>
              <Link href="/pricing" className="text-sm font-medium text-gray-800 hover:text-blue-600 transition-colors">Pricing</Link>
              <Link href="/about" className="text-sm font-medium text-gray-800 hover:text-blue-600 transition-colors">About</Link>
            </nav>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="lg:hidden text-gray-800"
              onClick={() => {
                setMobileOpen((s) => {
                  const next = !s;
                  if (next) {
                    setShopOpen(false);
                    setResourcesOpen(false);
                  }
                  return next;
                });
              }}
              aria-label="Toggle menu"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            </button>

            {/* Theme toggle removed */}

            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                  title={`Hello, ${userName}`}
                >
                  <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                  </svg>
                  <span className="hidden lg:inline text-sm font-medium text-gray-800">Hello, {userName}</span>
                  <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
                  </svg>
                </button>

                {showUserDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-200">
                    <Link 
                      href="/dashboard" 
                      className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 transition-colors"
                      onClick={() => setShowUserDropdown(false)}
                    >
                      <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                        </svg>
                        <span>Dashboard</span>
                      </div>
                    </Link>
                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        // Navigate to settings tab in dashboard
                        window.location.href = '/dashboard?tab=settings';
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                        </svg>
                        <span>Account Settings</span>
                      </div>
                    </button>
                    <hr className="my-2 border-gray-200" />
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                        </svg>
                        <span>Logout</span>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/login" className="hidden lg:inline text-sm text-gray-800 hover:text-blue-600 transition-colors">Login</Link>
                <Link href="/register" className="inline-flex items-center rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">Register</Link>
              </>
            )}

            {/* Cart Button with Badge */}
            <div className="relative">
              <button
                aria-label="cart"
                className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-800 hover:bg-gray-200 transition-colors duration-200"
                onClick={() => {
                  setCartOpen(!cartOpen);
                  setShopOpen(false);
                  setResourcesOpen(false);
                  setMobileOpen(false);
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 6h15l-1.5 9h-12L6 6z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {getTotalItems() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                    {getTotalItems()}
                  </span>
                )}
              </button>

              {/* Cart Dropdown */}
              {cartOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Shopping Cart</h3>
                      <button
                        onClick={() => setCartOpen(false)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                      </button>
                    </div>

                    {cartItems.length === 0 ? (
                      <div className="text-center py-8">
                        <svg className="w-12 h-12 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5H19M7 13v8a2 2 0 002 2h10a2 2 0 002-2v-3"/>
                        </svg>
                        <p className="text-gray-500">Your cart is empty</p>
                      </div>
                    ) : (
                      <>
                        <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                          {cartItems.map((item) => (
                            <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div className="flex-1">
                                <h4 className="text-sm font-medium text-gray-900">{item.name}</h4>
                                <p className="text-sm text-blue-600 font-semibold">${item.price.toFixed(2)}</p>
                              </div>
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs hover:bg-gray-300"
                                >
                                  -
                                </button>
                                <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs hover:bg-gray-300"
                                >
                                  +
                                </button>
                                <button
                                  onClick={() => removeItem(item.id)}
                                  className="ml-2 text-red-500 hover:text-red-700"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                                  </svg>
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="border-t border-gray-200 pt-4">
                          <div className="flex justify-between items-center mb-4">
                            <span className="text-lg font-semibold text-gray-900">Total:</span>
                            <span className="text-lg font-bold text-blue-600">${getTotalPrice().toFixed(2)}</span>
                          </div>

                          <div className="space-y-2">
                            <Link href="/checkout" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 text-center block">
                              Checkout
                            </Link>
                            <button
                              onClick={() => setCartOpen(false)}
                              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                            >
                              Continue Shopping
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile nav panel */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200 animate-in slide-in-from-top-2 duration-200">
          <div className="mx-auto max-w-7xl px-6 py-4">
            <nav className="flex flex-col gap-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Shop</h3>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li><Link href="/shop" className="block py-2 hover:text-blue-600 transition-colors">All Products</Link></li>
                  <li><Link href="/custom-card" className="block py-2 hover:text-blue-600 transition-colors">Custom Cards</Link></li>
                  <li><Link href="/shop/custom" className="block py-2 hover:text-blue-600 transition-colors">Custom Products</Link></li>
                  <li><Link href="/shop/bundles" className="block py-2 hover:text-blue-600 transition-colors">Bundles</Link></li>
                  <li><Link href="/shop/sale" className="block py-2 text-red-600 hover:text-red-700 transition-colors">Sale</Link></li>
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Resources</h3>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li><Link href="/free-digital-business-card" className="block py-2 hover:text-blue-600 transition-colors">Free Digital Business Card</Link></li>
                  <li><Link href="/nfc-business-cards" className="block py-2 hover:text-blue-600 transition-colors">NFC Business Cards</Link></li>
                  <li><Link href="/help" className="block py-2 hover:text-blue-600 transition-colors">Help Center</Link></li>
                  <li><Link href="/blog" className="block py-2 hover:text-blue-600 transition-colors">Blog</Link></li>
                  <li><Link href="/faq" className="block py-2 hover:text-blue-600 transition-colors">FAQ</Link></li>
                  <li><Link href="/privacy-policy" className="block py-2 hover:text-blue-600 transition-colors">Privacy Policy</Link></li>
                  <li><Link href="/terms-of-service" className="block py-2 hover:text-blue-600 transition-colors">Terms of Service</Link></li>
                  <li><Link href="/affiliate" className="block py-2 hover:text-blue-600 transition-colors">Affiliate Program</Link></li>
                  <li><Link href="/contact" className="block py-2 hover:text-blue-600 transition-colors">Contact us</Link></li>
                </ul>
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-2">
                <Link href="/business" className="block py-2 text-sm font-medium text-gray-800 hover:text-blue-600 transition-colors">For Businesses & Enterprise</Link>
                <Link href="/pricing" className="block py-2 text-sm font-medium text-gray-800 hover:text-blue-600 transition-colors">Pricing</Link>
                <Link href="/about" className="block py-2 text-sm font-medium text-gray-800 hover:text-blue-600 transition-colors">About</Link>
                {!isLoggedIn && (
                  <Link href="/login" className="block py-2 text-sm font-medium text-gray-800 hover:text-blue-600 transition-colors">Login</Link>
                )}
                {isLoggedIn && (
                  <Link href="/dashboard" className="block py-2 text-sm font-medium text-gray-800 hover:text-blue-600 transition-colors">Dashboard</Link>
                )}

                {/* Theme toggle removed */}
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
