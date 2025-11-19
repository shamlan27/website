"use client";
import Footer from "../components/Footer";
import { useToast } from "../components/Toast";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ordersAPI, authAPI } from "@/lib/api";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  description?: string;
}

interface ShippingInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  province: string;
  district: string;
  city: string;
  zipCode: string;
  country: string;
}

interface PaymentInfo {
  method: 'visa' | 'mastercard' | 'payhere' | 'mintpay' | 'frimi' | 'koko' | 'cod';
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
  phoneNumber: string;
  password: string;
}

const PROVINCES = [
  'Western',
  'Central',
  'Southern',
  'Eastern',
  'Northern',
  'North Western',
  'North Central',
  'Sabaragamuwa',
  'Uva'
];

const DISTRICTS = {
  'Western': ['Colombo', 'Gampaha', 'Kalutara'],
  'Central': ['Kandy', 'Matale', 'Nuwara Eliya'],
  'Southern': ['Galle', 'Hambantota', 'Matara'],
  'Eastern': ['Ampara', 'Batticaloa', 'Trincomalee'],
  'Northern': ['Jaffna', 'Kilinochchi', 'Mannar', 'Mullaitivu', 'Vavuniya'],
  'North Western': ['Kurunegala', 'Puttalam'],
  'North Central': ['Anuradhapura', 'Polonnaruwa'],
  'Sabaragamuwa': ['Kegalle', 'Ratnapura'],
  'Uva': ['Badulla', 'Monaragala']
};

export default function Checkout() {
  const { addToast, removeToast } = useToast();
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [currentStep, setCurrentStep] = useState<'cart' | 'shipping' | 'payment' | 'review' | 'confirmation'>('cart');
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    province: '',
    district: '',
    city: '',
    zipCode: '',
    country: 'Sri Lanka'
  });
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    method: 'visa',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    phoneNumber: '',
    password: ''
  });
  const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);
  const [orderNumber, setOrderNumber] = useState('');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  // Load cart from localStorage
  useEffect(() => {
    const loadCart = () => {
      if (typeof window === 'undefined') return;

      try {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          const items = JSON.parse(savedCart);
          setCartItems(items);
          if (items.length === 0) {
            // Redirect to shop if cart is empty
            window.location.href = '/shop';
          }
        } else {
          // Redirect to shop if no cart
          window.location.href = '/shop';
        }
      } catch (error) {
        console.error('Error loading cart:', error);
        addToast('Error loading cart. Please try again.', 'error');
      }
    };

    loadCart();
  }, [addToast]);

  const getSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getShipping = () => {
    return getSubtotal() > 50 ? 0 : 9.99;
  };

  const getTax = () => {
    return getSubtotal() * 0.08; // 8% tax
  };

  const getTotal = () => {
    return getSubtotal() + getShipping() + getTax();
  };

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Basic validation
    if (!shippingInfo.firstName || !shippingInfo.lastName || !shippingInfo.email || !shippingInfo.phone || !shippingInfo.address || !shippingInfo.province || !shippingInfo.district || !shippingInfo.city) {
      addToast('Please fill in all required fields.', 'error');
      return;
    }
    setCurrentStep('payment');
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Basic validation based on payment method
    if (paymentInfo.method === 'visa' || paymentInfo.method === 'mastercard') {
      if (!paymentInfo.cardNumber || !paymentInfo.expiryDate || !paymentInfo.cvv || !paymentInfo.cardholderName) {
        addToast('Please fill in all payment fields.', 'error');
        return;
      }
    } else if (['mintpay', 'frimi', 'koko'].includes(paymentInfo.method)) {
      if (!paymentInfo.phoneNumber || !paymentInfo.password) {
        addToast('Please fill in all payment fields.', 'error');
        return;
      }
    }
    // For payhere, no additional validation needed
    setCurrentStep('review');
  };

  const handlePlaceOrder = async () => {
    setIsPlacingOrder(true);
    
    try {
      // Check if user is logged in
      if (!authAPI.isAuthenticated()) {
        addToast('Please login to place an order', 'error', true);
        router.push('/login');
        setIsPlacingOrder(false);
        return;
      }

      // Generate order number
      const orderNum = 'ORD-' + Date.now().toString().slice(-8);
      setOrderNumber(orderNum);

      // Prepare order data
      const orderData = {
        order_id: orderNum,
        items: cartItems.map(item => ({
          product_id: item.id,
          product_name: item.name,
          quantity: item.quantity,
          price: item.price,
          image: item.image
        })),
        shipping_address: shippingInfo,
        billing_address: shippingInfo, // Using same address for billing
        payment_method: paymentInfo.method,
        total_amount: getTotal()
      };

      // Create order via API
      const response = await ordersAPI.create(orderData);

      console.log('Order API response:', response);

      if (response.success || response.order) {
        // Clear cart
        localStorage.removeItem('cart');
        setCartItems([]);

        // Show success message and navigate to confirmation
        addToast(`Order placed successfully! Order ID: ${orderNum}`, 'success', true);
        setCurrentStep('confirmation');
      } else {
        throw new Error(response.message || 'Failed to place order');
      }
    } catch (error: any) {
      console.error('Order error:', error);
      addToast(error.message || 'Failed to place order. Please try again.', 'error', true);
    } finally {
      setIsPlacingOrder(false);
    }
  };
  
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\D/g, '');
    if (v.length >= 2) {
      return v.slice(0, 2) + '/' + v.slice(2, 4);
    }
    return v;
  };

  const handleCardNumberChange = (value: string) => {
    const formatted = formatCardNumber(value);
    const firstDigit = value.charAt(0);
    let method = paymentInfo.method;
    
    // Only auto-select payment method if it's currently visa or mastercard
    if (paymentInfo.method === 'visa' || paymentInfo.method === 'mastercard') {
      if (firstDigit === '4') {
        method = 'visa';
      } else if (firstDigit === '5') {
        method = 'mastercard';
      }
    }
    
    setPaymentInfo({...paymentInfo, cardNumber: formatted, method: method as 'visa' | 'mastercard' | 'payhere' | 'mintpay' | 'frimi' | 'koko' | 'cod'});
  };

  const isVisaCard = (cardNumber: string) => {
    const cleanNumber = cardNumber.replace(/\s+/g, '');
    return cleanNumber.startsWith('4');
  };

  const isMastercard = (cardNumber: string) => {
    const cleanNumber = cardNumber.replace(/\s+/g, '');
    return cleanNumber.startsWith('5');
  };

  if (cartItems.length === 0 && currentStep !== 'confirmation') {
    return (
      <div className="min-h-screen font-sans text-black dark:text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <Link href="/shop" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans text-black dark:text-white">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold" style={{color: 'var(--foreground)'}}>
              Advance Step
            </Link>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Secure Checkout
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {[
              { step: 'cart', label: 'Cart', icon: '🛒' },
              { step: 'shipping', label: 'Shipping', icon: '📦' },
              { step: 'payment', label: 'Payment', icon: '💳' },
              { step: 'review', label: 'Review', icon: '✅' },
              { step: 'confirmation', label: 'Confirmation', icon: '🎉' }
            ].map((step, index) => (
              <div key={step.step} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full text-sm font-medium ${
                  currentStep === step.step
                    ? 'bg-blue-600 text-white'
                    : ['cart', 'shipping', 'payment', 'review', 'confirmation'].indexOf(currentStep) >= index
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {step.icon}
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  currentStep === step.step ? 'text-blue-600' : 'text-gray-600'
                }`}>
                  {step.label}
                </span>
                {index < 4 && (
                  <div className={`w-12 h-0.5 mx-4 ${
                    ['cart', 'shipping', 'payment', 'review', 'confirmation'].indexOf(currentStep) > index
                      ? 'bg-green-600'
                      : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {currentStep === 'cart' && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-6">Shopping Cart</h2>

                <div className="space-y-4 mb-6">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-semibold" style={{color: 'var(--foreground)'}}>{item.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
                        <p className="text-lg font-bold text-blue-600">${item.price.toFixed(2)}</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-lg font-medium">Qty: {item.quantity}</span>
                        <span className="text-lg font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between">
                  <Link
                    href="/shop"
                    className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white px-6 py-3 rounded-lg"
                  >
                    Continue Shopping
                  </Link>
                  <button
                    onClick={() => setCurrentStep('shipping')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            )}

            {currentStep === 'shipping' && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-6">Shipping Information</h2>

                <form onSubmit={handleShippingSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        value={shippingInfo.firstName}
                        onChange={(e) => setShippingInfo({...shippingInfo, firstName: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        value={shippingInfo.lastName}
                        onChange={(e) => setShippingInfo({...shippingInfo, lastName: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={shippingInfo.email}
                      onChange={(e) => setShippingInfo({...shippingInfo, email: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={shippingInfo.phone}
                      onChange={(e) => setShippingInfo({...shippingInfo, phone: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      value={shippingInfo.address}
                      onChange={(e) => setShippingInfo({...shippingInfo, address: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Province *
                      </label>
                      <select
                        value={shippingInfo.province}
                        onChange={(e) => setShippingInfo({...shippingInfo, province: e.target.value, district: ''})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        required
                      >
                        <option value="">Select Province</option>
                        {PROVINCES.map((province) => (
                          <option key={province} value={province}>
                            {province} Province
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        District *
                      </label>
                      <select
                        value={shippingInfo.district}
                        onChange={(e) => setShippingInfo({...shippingInfo, district: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        disabled={!shippingInfo.province}
                        required
                      >
                        <option value="">Select District</option>
                        {shippingInfo.province && DISTRICTS[shippingInfo.province as keyof typeof DISTRICTS]?.map((district) => (
                          <option key={district} value={district}>
                            {district}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        value={shippingInfo.city}
                        onChange={(e) => setShippingInfo({...shippingInfo, city: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        placeholder="Enter your city"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        ZIP Code
                      </label>
                      <input
                        type="text"
                        value={shippingInfo.zipCode}
                        onChange={(e) => setShippingInfo({...shippingInfo, zipCode: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={() => setCurrentStep('cart')}
                      className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white px-6 py-3 rounded-lg"
                    >
                      Back to Cart
                    </button>
                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
                    >
                      Continue to Payment
                    </button>
                  </div>
                </form>
              </div>
            )}

            {currentStep === 'payment' && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-6">Payment Information</h2>

                <form onSubmit={handlePaymentSubmit} className="space-y-6">
                  {/* Payment Method Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                      Payment Method *
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="visa"
                          name="paymentMethod"
                          value="visa"
                          checked={paymentInfo.method === 'visa'}
                          onChange={(e) => setPaymentInfo({...paymentInfo, method: e.target.value as 'visa'})}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <label htmlFor="visa" className="ml-3 flex items-center">
                          <img src="/payment/visa.png" alt="Visa" className="h-6 w-6 mr-2" />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Visa</span>
                        </label>
                      </div>

                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="mastercard"
                          name="paymentMethod"
                          value="mastercard"
                          checked={paymentInfo.method === 'mastercard'}
                          onChange={(e) => setPaymentInfo({...paymentInfo, method: e.target.value as 'mastercard'})}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <label htmlFor="mastercard" className="ml-3 flex items-center">
                          <img src="/payment/mastercard.jpg" alt="Mastercard" className="h-6 w-6 mr-2" />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Mastercard</span>
                        </label>
                      </div>

                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="payhere"
                          name="paymentMethod"
                          value="payhere"
                          checked={paymentInfo.method === 'payhere'}
                          onChange={(e) => setPaymentInfo({...paymentInfo, method: e.target.value as 'payhere'})}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <label htmlFor="payhere" className="ml-3 flex items-center">
                          <img src="/payment/PayHere.png" alt="PayHere" className="h-6 w-6 mr-2" />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">PayHere</span>
                        </label>
                      </div>

                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="mintpay"
                          name="paymentMethod"
                          value="mintpay"
                          checked={paymentInfo.method === 'mintpay'}
                          onChange={(e) => setPaymentInfo({...paymentInfo, method: e.target.value as 'mintpay'})}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <label htmlFor="mintpay" className="ml-3 flex items-center">
                          <img src="/payment/mintpay.png" alt="MintPay" className="h-6 w-6 mr-2" />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">MintPay</span>
                        </label>
                      </div>

                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="frimi"
                          name="paymentMethod"
                          value="frimi"
                          checked={paymentInfo.method === 'frimi'}
                          onChange={(e) => setPaymentInfo({...paymentInfo, method: e.target.value as 'frimi'})}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <label htmlFor="frimi" className="ml-3 flex items-center">
                          <img src="/payment/frimi.png" alt="Frimi" className="h-6 w-6 mr-2" />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Frimi</span>
                        </label>
                      </div>

                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="koko"
                          name="paymentMethod"
                          value="koko"
                          checked={paymentInfo.method === 'koko'}
                          onChange={(e) => setPaymentInfo({...paymentInfo, method: e.target.value as 'koko'})}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <label htmlFor="koko" className="ml-3 flex items-center">
                          <img src="/payment/KOKO.png" alt="KOKO" className="h-6 w-6 mr-2" />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">KOKO</span>
                        </label>
                      </div>

                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="cod"
                          name="paymentMethod"
                          value="cod"
                          checked={paymentInfo.method === 'cod'}
                          onChange={(e) => setPaymentInfo({...paymentInfo, method: e.target.value as 'cod'})}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <label htmlFor="cod" className="ml-3 flex items-center">
                          <img src="/payment/cod.png" alt="COD" className="h-6 w-6 mr-2" />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Cash on Delivery</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Card Payment Form - Only show if visa or mastercard is selected */}
                  {(paymentInfo.method === 'visa' || paymentInfo.method === 'mastercard') && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Cardholder Name *
                        </label>
                        <input
                          type="text"
                          value={paymentInfo.cardholderName}
                          onChange={(e) => setPaymentInfo({...paymentInfo, cardholderName: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                          placeholder="John Doe"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Card Number *
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={paymentInfo.cardNumber}
                            onChange={(e) => handleCardNumberChange(e.target.value)}
                            className="w-full px-3 py-2 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                            placeholder="1234 5678 9012 3456"
                            maxLength={19}
                            required
                          />
                          {isVisaCard(paymentInfo.cardNumber) && (
                            <img
                              src="/payment/visa.png"
                              alt="Visa"
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 h-6 w-8 object-contain"
                            />
                          )}
                          {isMastercard(paymentInfo.cardNumber) && (
                            <img
                              src="/payment/mastercard.jpg"
                              alt="Mastercard"
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 h-6 w-8 object-contain"
                            />
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Expiry Date *
                          </label>
                          <input
                            type="text"
                            value={paymentInfo.expiryDate}
                            onChange={(e) => setPaymentInfo({...paymentInfo, expiryDate: formatExpiryDate(e.target.value)})}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                            placeholder="MM/YY"
                            maxLength={5}
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            CVV *
                          </label>
                          <input
                            type="text"
                            value={paymentInfo.cvv}
                            onChange={(e) => setPaymentInfo({...paymentInfo, cvv: e.target.value.replace(/[^0-9]/g, '')})}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                            placeholder="123"
                            maxLength={4}
                            required
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {/* MintPay Form */}
                  {paymentInfo.method === 'mintpay' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          value={paymentInfo.phoneNumber}
                          onChange={(e) => setPaymentInfo({...paymentInfo, phoneNumber: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                          placeholder="07X XXX XXXX"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          MintPay Password/PIN *
                        </label>
                        <input
                          type="password"
                          value={paymentInfo.password}
                          onChange={(e) => setPaymentInfo({...paymentInfo, password: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                          placeholder="Enter your MintPay password"
                          required
                        />
                      </div>
                    </div>
                  )}

                  {/* Frimi Form */}
                  {paymentInfo.method === 'frimi' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          value={paymentInfo.phoneNumber}
                          onChange={(e) => setPaymentInfo({...paymentInfo, phoneNumber: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                          placeholder="07X XXX XXXX"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Frimi Password/PIN *
                        </label>
                        <input
                          type="password"
                          value={paymentInfo.password}
                          onChange={(e) => setPaymentInfo({...paymentInfo, password: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                          placeholder="Enter your Frimi password"
                          required
                        />
                      </div>
                    </div>
                  )}

                  {/* KOKO Form */}
                  {paymentInfo.method === 'koko' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          value={paymentInfo.phoneNumber}
                          onChange={(e) => setPaymentInfo({...paymentInfo, phoneNumber: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                          placeholder="07X XXX XXXX"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          KOKO Password/PIN *
                        </label>
                        <input
                          type="password"
                          value={paymentInfo.password}
                          onChange={(e) => setPaymentInfo({...paymentInfo, password: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                          placeholder="Enter your KOKO password"
                          required
                        />
                      </div>
                    </div>
                  )}

                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="billingSame"
                        checked={billingSameAsShipping}
                        onChange={(e) => setBillingSameAsShipping(e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="billingSame" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                        Billing address is the same as shipping address
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={() => setCurrentStep('shipping')}
                      className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white px-6 py-3 rounded-lg"
                    >
                      Back to Shipping
                    </button>
                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
                    >
                      Review Order
                    </button>
                  </div>
                </form>
              </div>
            )}

            {currentStep === 'review' && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-6">Review Your Order</h2>

                <div className="space-y-6">
                  {/* Order Items */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Order Items</h3>
                    <div className="space-y-3">
                      {cartItems.map((item) => (
                        <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <div>
                            <h4 className="font-medium">{item.name}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Quantity: {item.quantity}</p>
                          </div>
                          <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Shipping Info */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Shipping Address</h3>
                    <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <p>{shippingInfo.firstName} {shippingInfo.lastName}</p>
                      <p>{shippingInfo.address}</p>
                      <p>{shippingInfo.city}, {shippingInfo.district}, {shippingInfo.province} Province {shippingInfo.zipCode}</p>
                      <p>{shippingInfo.email}</p>
                      {shippingInfo.phone && <p>{shippingInfo.phone}</p>}
                    </div>
                  </div>

                  {/* Payment Info */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Payment Method</h3>
                    <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      {paymentInfo.method === 'visa' && (
                        <>
                          <div className="flex items-center mb-2">
                            <img src="/payment/visa.png" alt="Visa" className="h-6 w-6 mr-2" />
                            <span className="font-medium">Visa</span>
                          </div>
                          <p>Card ending in {paymentInfo.cardNumber.slice(-4)}</p>
                          <p>{paymentInfo.cardholderName}</p>
                        </>
                      )}
                      {paymentInfo.method === 'mastercard' && (
                        <>
                          <div className="flex items-center mb-2">
                            <img src="/payment/mastercard.jpg" alt="Mastercard" className="h-6 w-6 mr-2" />
                            <span className="font-medium">Mastercard</span>
                          </div>
                          <p>Card ending in {paymentInfo.cardNumber.slice(-4)}</p>
                          <p>{paymentInfo.cardholderName}</p>
                        </>
                      )}
                      {paymentInfo.method === 'payhere' && (
                        <div className="flex items-center">
                          <img src="/payment/PayHere.png" alt="PayHere" className="h-6 w-6 mr-2" />
                          <span className="font-medium">PayHere</span>
                        </div>
                      )}
                      {paymentInfo.method === 'mintpay' && (
                        <div className="flex items-center">
                          <img src="/payment/mintpay.png" alt="MintPay" className="h-6 w-6 mr-2" />
                          <div>
                            <span className="font-medium">MintPay</span>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{paymentInfo.phoneNumber}</p>
                          </div>
                        </div>
                      )}
                      {paymentInfo.method === 'frimi' && (
                        <div className="flex items-center">
                          <img src="/payment/frimi.png" alt="Frimi" className="h-6 w-6 mr-2" />
                          <div>
                            <span className="font-medium">Frimi</span>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{paymentInfo.phoneNumber}</p>
                          </div>
                        </div>
                      )}
                      {paymentInfo.method === 'koko' && (
                        <div className="flex items-center">
                          <img src="/payment/KOKO.png" alt="KOKO" className="h-6 w-6 mr-2" />
                          <div>
                            <span className="font-medium">KOKO</span>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{paymentInfo.phoneNumber}</p>
                          </div>
                        </div>
                      )}
                      {paymentInfo.method === 'cod' && (
                        <div className="flex items-center">
                          <img src="/payment/cod.png" alt="COD" className="h-6 w-6 mr-2" />
                          <span className="font-medium">Cash on Delivery</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <button
                      onClick={() => setCurrentStep('payment')}
                      disabled={isPlacingOrder}
                      className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white px-6 py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Back to Payment
                    </button>
                    <button
                      onClick={handlePlaceOrder}
                      disabled={isPlacingOrder}
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center justify-center min-w-[150px] disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isPlacingOrder ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </>
                      ) : (
                        'Place Order'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 'confirmation' && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                  </svg>
                </div>

                <h2 className="text-2xl font-bold mb-4">Order Confirmed!</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Thank you for your order. We've sent an invoice confirmation email to {shippingInfo.email}.
                </p>

                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-6">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Order Number</p>
                  <p className="text-xl font-bold text-blue-600">{orderNumber}</p>
                </div>

                <div className="space-y-3">
                  <Link
                    href="/dashboard?tab=orders"
                    className="block w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
                  >
                    View Order Details
                  </Link>
                  <Link
                    href="/"
                    className="block w-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white px-6 py-3 rounded-lg font-medium"
                  >
                    Continue Shopping
                  </Link>
                  <Link
                    href="/contact"
                    className="block w-full border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-800 dark:text-white px-6 py-3 rounded-lg font-medium"
                  >
                    Need Help?
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          {currentStep !== 'confirmation' && (
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 sticky top-4">
                <h3 className="text-lg font-semibold mb-4">Order Summary</h3>

                <div className="space-y-3 mb-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>{item.name} × {item.quantity}</span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-200 dark:border-gray-600 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>${getSubtotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span>{getShipping() === 0 ? 'Free' : `$${getShipping().toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax</span>
                    <span>${getTax().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg border-t border-gray-200 dark:border-gray-600 pt-2">
                    <span>Total</span>
                    <span>${getTotal().toFixed(2)}</span>
                  </div>
                </div>

                {getSubtotal() < 50 && (
                  <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      Add ${(50 - getSubtotal()).toFixed(2)} more for free shipping!
                    </p>
                  </div>
                )}

                <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                  <p>✓ Secure SSL encryption</p>
                  <p>✓ 30-day return policy</p>
                  <p>✓ Free shipping over $50</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Loading Overlay */}
      {isPlacingOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-sm w-full mx-4 text-center">
            <div className="mb-4">
              <svg className="animate-spin h-16 w-16 text-blue-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Processing Your Order</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">Please wait while we confirm your order...</p>
            <div className="flex items-center justify-center space-x-1">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}