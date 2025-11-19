"use client";
import Footer from "../components/Footer";
import { useToast } from "../components/Toast";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";

export default function CustomCard() {
  const { addToast, removeToast } = useToast();
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [cardData, setCardData] = useState({
    name: '',
    title: '',
    company: '',
    email: '',
    phone: '',
    website: '',
    address: ''
  });
  const [rotation, setRotation] = useState({ x: 10, y: -10 });
  const [isDragging3D, setIsDragging3D] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const [renderKey, setRenderKey] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Adjustable Design State
  const [logoPosition, setLogoPosition] = useState({ x: 20, y: 50 });
  const [logoSize, setLogoSize] = useState({ width: 96, height: 64 });
  const [namePosition, setNamePosition] = useState({ x: 70, y: 30 });
  const [phonePosition, setPhonePosition] = useState({ x: 70, y: 70 });
  const [nameSize, setNameSize] = useState(24); // font size for name
  const [phoneSize, setPhoneSize] = useState(18); // font size for phone
  const [draggingElement, setDraggingElement] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [showCustomizationDropdown, setShowCustomizationDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showCustomizationDropdown && !(event.target as Element).closest('.customization-dropdown')) {
        setShowCustomizationDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showCustomizationDropdown]);

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

  const handleImageUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      addToast('Please select a valid image file.', 'error');
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      addToast('Image size should be less than 10MB.', 'error');
      return;
    }

    setIsLoading(true);

    // Compress and resize image
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Calculate new dimensions (max 800px width/height)
      let { width, height } = img;
      const maxSize = 800;

      if (width > height) {
        if (width > maxSize) {
          height = (height * maxSize) / width;
          width = maxSize;
        }
      } else {
        if (height > maxSize) {
          width = (width * maxSize) / height;
          height = maxSize;
        }
      }

      canvas.width = width;
      canvas.height = height;

      // Draw and compress
      ctx?.drawImage(img, 0, 0, width, height);

      canvas.toBlob((blob) => {
        if (blob) {
          const compressedFile = new File([blob], file.name, {
            type: 'image/jpeg',
            lastModified: Date.now(),
          });

          const reader = new FileReader();
          reader.onload = (e) => {
            setUploadedImage(e.target?.result as string);
            setIsLoading(false);
            addToast('Image uploaded and optimized successfully!', 'success');
          };
          reader.onerror = () => {
            setIsLoading(false);
            addToast('Error processing image. Please try again.', 'error');
          };
          reader.readAsDataURL(compressedFile);
        } else {
          setIsLoading(false);
          addToast('Error compressing image. Please try again.', 'error');
        }
      }, 'image/jpeg', 0.8); // 80% quality
    };

    img.onerror = () => {
      setIsLoading(false);
      addToast('Error loading image. Please try again.', 'error');
    };

    img.src = URL.createObjectURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFile(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFile(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFile(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleImageUpload(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleImageUpload(files[0]);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setCardData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCreateCard = () => {
    if (!uploadedImage) {
      addToast('Please upload a photo first.', 'error');
      return;
    }

    if (!cardData.name.trim()) {
      addToast('Please enter your name.', 'error');
      return;
    }

    addToCart({
      id: `custom-card-${Date.now()}`,
      name: 'Custom Digital Business Card',
      price: 29.99,
      description: 'Personalized digital business card with your photo and custom information'
    });
  };

  // 3D Card Interaction Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging3D(true);
    setLastMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging3D) return;

    const deltaX = e.clientX - lastMousePos.x;
    const deltaY = e.clientY - lastMousePos.y;

    setRotation(prev => ({
      x: Math.max(-30, Math.min(30, prev.x + deltaY * 0.5)),
      y: prev.y + deltaX * 0.5
    }));

    setLastMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging3D(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging3D(true);
    const touch = e.touches[0];
    setLastMousePos({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging3D) return;

    const touch = e.touches[0];
    const deltaX = touch.clientX - lastMousePos.x;
    const deltaY = touch.clientY - lastMousePos.y;

    setRotation(prev => ({
      x: Math.max(-30, Math.min(30, prev.x + deltaY * 0.5)),
      y: prev.y + deltaX * 0.5
    }));

    setLastMousePos({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchEnd = () => {
    setIsDragging3D(false);
  };

  const resetRotation = () => {
    setRotation({ x: 10, y: -10 });
  };

  const flipCard = () => {
    setIsCardFlipped(!isCardFlipped);
  };

  // Adjustable Design Drag Handlers
  const handleElementMouseDown = (e: React.MouseEvent, element: string, currentPos: { x: number; y: number }) => {
    e.stopPropagation();
    setDraggingElement(element);
    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleElementMouseMove = (e: React.MouseEvent) => {
    if (!draggingElement) return;

    const cardRect = e.currentTarget.getBoundingClientRect();
    const newX = ((e.clientX - cardRect.left - dragOffset.x) / cardRect.width) * 100;
    const newY = ((e.clientY - cardRect.top - dragOffset.y) / cardRect.height) * 100;

    const clampedX = Math.max(0, Math.min(100, newX));
    const clampedY = Math.max(0, Math.min(100, newY));

    switch (draggingElement) {
      case 'logo':
        setLogoPosition({ x: clampedX, y: clampedY });
        break;
      case 'name':
        setNamePosition({ x: clampedX, y: clampedY });
        break;
      case 'phone':
        setPhonePosition({ x: clampedX, y: clampedY });
        break;
    }
  };

  const handleElementMouseUp = () => {
    setDraggingElement(null);
  };

  // Logo Size Controls
  const increaseLogoSize = () => {
    setLogoSize(prev => ({
      width: Math.min(prev.width + 16, 160),
      height: Math.min(prev.height + 10.67, 106.67)
    }));
  };

  const decreaseLogoSize = () => {
    setLogoSize(prev => ({
      width: Math.max(prev.width - 16, 48),
      height: Math.max(prev.height - 10.67, 32)
    }));
  };

  // Logo Width Controls
  const increaseLogoWidth = () => {
    setLogoSize(prev => ({
      ...prev,
      width: Math.min(prev.width + 16, 160)
    }));
  };

  const decreaseLogoWidth = () => {
    setLogoSize(prev => ({
      ...prev,
      width: Math.max(prev.width - 16, 48)
    }));
  };

  // Logo Height Controls
  const increaseLogoHeight = () => {
    setLogoSize(prev => ({
      ...prev,
      height: Math.min(prev.height + 16, 128)
    }));
  };

  const decreaseLogoHeight = () => {
    setLogoSize(prev => ({
      ...prev,
      height: Math.max(prev.height - 16, 32)
    }));
  };

  // Name Size Controls
  const increaseNameSize = () => {
    setNameSize(prev => Math.min(prev + 2, 36));
  };

  const decreaseNameSize = () => {
    setNameSize(prev => Math.max(prev - 2, 16));
  };

  // Phone Size Controls
  const increasePhoneSize = () => {
    setPhoneSize(prev => Math.min(prev + 2, 28));
  };

  const decreasePhoneSize = () => {
    setPhoneSize(prev => Math.max(prev - 2, 12));
  };

  return (
    <div className="min-h-screen font-sans text-black dark:text-white">
      {/* Hero Section */}
      <header className="relative overflow-hidden hero-gradient py-12 sm:py-16 lg:py-20">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-20 h-20 bg-purple-200 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-16 h-16 bg-pink-200 rounded-lg opacity-30 animate-bounce" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-40 left-1/4 w-12 h-12 bg-blue-200 rounded-full opacity-25 animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight drop-shadow-sm" style={{color: 'var(--foreground)'}}>
              Create Your <span className="text-purple-600">Custom Card</span>
            </h1>
            <p className="mt-4 sm:mt-6 max-w-3xl mx-auto text-base sm:text-lg text-gray-600 leading-relaxed">
              Design a personalized digital business card with your photo and information. Preview in stunning 3D before adding to cart.
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12">
            {/* Left Column - Form */}
            <div className="space-y-6 sm:space-y-8">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">Upload Your Photo</h2>

                {/* Photo Upload Area */}
                <div
                  className={`relative border-2 border-dashed rounded-xl p-6 sm:p-8 text-center transition-all duration-300 ${
                    isDraggingFile
                      ? 'border-purple-500 bg-purple-50'
                      : uploadedImage
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-300 hover:border-purple-400 hover:bg-purple-50'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  {uploadedImage ? (
                    <div className="space-y-4">
                      <div className="relative w-32 h-32 mx-auto">
                        <img
                          src={uploadedImage}
                          alt="Uploaded"
                          className="w-full h-full object-cover rounded-lg shadow-lg"
                        />
                        <button
                          onClick={() => setUploadedImage(null)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                      <p className="text-green-600 dark:text-green-400 font-medium">Photo uploaded successfully!</p>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="text-purple-600 hover:text-purple-700 font-medium"
                      >
                        Change photo
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {isLoading ? (
                        <div className="flex flex-col items-center">
                          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                          <p className="text-gray-600">Uploading...</p>
                        </div>
                      ) : (
                        <>
                          <div className="w-16 h-16 mx-auto bg-purple-100 rounded-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                            </svg>
                          </div>
                          <p className="text-lg font-medium text-gray-900 mb-2">
                            {isDraggingFile ? 'Drop your photo here' : 'Drag & drop your photo here'}
                          </p>
                          <p className="text-gray-600 mb-4">
                            or <button
                              onClick={() => fileInputRef.current?.click()}
                              className="text-purple-600 hover:text-purple-700 font-medium"
                            >
                              browse files
                            </button>
                          </p>
                          <p className="text-sm text-gray-500">
                            Supports JPG, PNG, GIF, WebP up to 10MB • Auto-optimized for best quality
                          </p>
                        </>
                      )}
                    </div>
                  )}

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Card Information Form */}
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">Card Information</h2>

                <div className="space-y-4 sm:space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={cardData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        placeholder="John Doe"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Job Title
                      </label>
                      <input
                        type="text"
                        value={cardData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        placeholder="Software Engineer"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company
                    </label>
                    <input
                      type="text"
                      value={cardData.company}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      placeholder="Advance Step Inc."
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={cardData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        placeholder="john@company.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={cardData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Website
                    </label>
                    <input
                      type="url"
                      value={cardData.website}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      placeholder="https://yourwebsite.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address
                    </label>
                    <textarea
                      value={cardData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                      placeholder="123 Business St, City, State 12345"
                    />
                  </div>
                </div>
              </div>

              {/* Add to Cart Button */}
              <div className="pt-4 sm:pt-6">
                <button
                  onClick={handleCreateCard}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm sm:text-base"
                >
                  Create Custom Card - $29.99
                </button>
                <p className="text-center text-gray-600 mt-3 text-sm">
                  Includes digital card with QR code and NFC compatibility
                </p>
              </div>

              {/* Featured Products */}
              <div className="pt-6 sm:pt-8 border-t border-gray-200">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 text-center">Featured Products</h3>
                <div className="overflow-x-auto">
                  <div className="flex gap-4 sm:gap-6 animate-scroll-products hover:pause-animation px-4 min-w-max">
                      <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200 hover:shadow-lg transition-shadow flex-shrink-0 w-72 sm:w-80">
                        <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900">Metal Business Cards</h4>
                        <p className="text-sm text-gray-600">Premium engraved metal cards</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-lg font-bold text-purple-600">$49.99</span>
                          <button
                            onClick={() => addToCart({
                              id: 'custom-metal-cards',
                              name: 'Custom Metal Cards',
                              price: 49.99,
                              description: 'Premium metal business cards with custom engraving'
                            })}
                            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg transition-colors"
                          >
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200 hover:shadow-lg transition-shadow flex-shrink-0 w-80">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900">NFC Bracelets</h4>
                        <p className="text-sm text-gray-600">Wearable business card bracelets</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-lg font-bold text-purple-600">$79.99</span>
                          <button
                            onClick={() => addToCart({
                              id: 'wave-bracelets',
                              name: 'Wave Bracelets',
                              price: 79.99,
                              description: 'Wearable business card bracelets with NFC'
                            })}
                            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg transition-colors"
                          >
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200 hover:shadow-lg transition-shadow flex-shrink-0 w-80">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z"/>
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900">Wave Cards</h4>
                        <p className="text-sm text-gray-600">Innovative wave-shaped cards</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-lg font-bold text-purple-600">$39.99</span>
                          <button
                            onClick={() => addToCart({
                              id: 'wave-cards',
                              name: 'Wave Cards',
                              price: 39.99,
                              description: 'Innovative wave-shaped business cards'
                            })}
                            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg transition-colors"
                          >
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200 hover:shadow-lg transition-shadow flex-shrink-0 w-80">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/>
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900">Premium Bundle</h4>
                        <p className="text-sm text-gray-600">Custom card + metal card combo</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-lg font-bold text-purple-600">$69.99</span>
                          <button
                            onClick={() => addToCart({
                              id: 'premium-bundle',
                              name: 'Premium Bundle',
                              price: 69.99,
                              description: 'Custom digital card + metal card bundle'
                            })}
                            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg transition-colors"
                          >
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Duplicate products for seamless loop */}
                  <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200 hover:shadow-lg transition-shadow flex-shrink-0 w-80">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900">Metal Business Cards</h4>
                        <p className="text-sm text-gray-600">Premium engraved metal cards</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-lg font-bold text-purple-600">$49.99</span>
                          <button
                            onClick={() => addToCart({
                              id: 'custom-metal-cards',
                              name: 'Custom Metal Cards',
                              price: 49.99,
                              description: 'Premium metal business cards with custom engraving'
                            })}
                            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg transition-colors"
                          >
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200 hover:shadow-lg transition-shadow flex-shrink-0 w-80">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900">NFC Bracelets</h4>
                        <p className="text-sm text-gray-600">Wearable business card bracelets</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-lg font-bold text-purple-600">$79.99</span>
                          <button
                            onClick={() => addToCart({
                              id: 'wave-bracelets',
                              name: 'Wave Bracelets',
                              price: 79.99,
                              description: 'Wearable business card bracelets with NFC'
                            })}
                            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg transition-colors"
                          >
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200 hover:shadow-lg transition-shadow flex-shrink-0 w-80">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z"/>
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900">Wave Cards</h4>
                        <p className="text-sm text-gray-600">Innovative wave-shaped cards</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-lg font-bold text-purple-600">$39.99</span>
                          <button
                            onClick={() => addToCart({
                              id: 'wave-cards',
                              name: 'Wave Cards',
                              price: 39.99,
                              description: 'Innovative wave-shaped business cards'
                            })}
                            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg transition-colors"
                          >
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200 hover:shadow-lg transition-shadow flex-shrink-0 w-80">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/>
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900">Premium Bundle</h4>
                        <p className="text-sm text-gray-600">Custom card + metal card combo</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-lg font-bold text-purple-600">$69.99</span>
                          <button
                            onClick={() => addToCart({
                              id: 'premium-bundle',
                              name: 'Premium Bundle',
                              price: 69.99,
                              description: 'Custom digital card + metal card bundle'
                            })}
                            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg transition-colors"
                          >
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                </div>

                <div className="text-center mt-6">
                  <Link
                    href="/shop"
                    className="inline-flex items-center px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                  >
                    <span>View All Products</span>
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
                    </svg>
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Column - 3D Preview */}
            <div className="lg:sticky lg:top-8">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">3D Preview</h2>
                <div className="flex flex-wrap gap-2">
                  {/* Customization Dropdown */}
                  <div className="relative customization-dropdown">
                    <button
                      onClick={() => setShowCustomizationDropdown(!showCustomizationDropdown)}
                      className="px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"/>
                      </svg>
                      <span>Customize</span>
                      <svg className={`w-4 h-4 transition-transform ${showCustomizationDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
                      </svg>
                    </button>

                    {showCustomizationDropdown && (
                      <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                        <div className="p-4">
                          <h4 className="text-sm font-semibold text-gray-900 mb-3">Size Controls</h4>

                          {/* Logo Controls */}
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-medium text-gray-700">Logo Size</span>
                              <div className="flex items-center space-x-1">
                                <button
                                  onClick={decreaseLogoSize}
                                  className="w-6 h-6 flex items-center justify-center text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
                                  title="Decrease logo size"
                                >
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4"/>
                                  </svg>
                                </button>
                                <span className="text-xs text-gray-500 w-8 text-center">{logoSize.width}×{logoSize.height}</span>
                                <button
                                  onClick={increaseLogoSize}
                                  className="w-6 h-6 flex items-center justify-center text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
                                  title="Increase logo size"
                                >
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                                  </svg>
                                </button>
                              </div>
                            </div>

                            <div className="flex items-center justify-between">
                              <span className="text-xs font-medium text-gray-700">Logo Width</span>
                              <div className="flex items-center space-x-1">
                                <button
                                  onClick={decreaseLogoWidth}
                                  className="w-6 h-6 flex items-center justify-center text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
                                  title="Decrease logo width"
                                >
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4"/>
                                  </svg>
                                </button>
                                <span className="text-xs text-gray-500 w-8 text-center">{logoSize.width}</span>
                                <button
                                  onClick={increaseLogoWidth}
                                  className="w-6 h-6 flex items-center justify-center text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
                                  title="Increase logo width"
                                >
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                                  </svg>
                                </button>
                              </div>
                            </div>

                            <div className="flex items-center justify-between">
                              <span className="text-xs font-medium text-gray-700">Logo Height</span>
                              <div className="flex items-center space-x-1">
                                <button
                                  onClick={decreaseLogoHeight}
                                  className="w-6 h-6 flex items-center justify-center text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
                                  title="Decrease logo height"
                                >
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4"/>
                                  </svg>
                                </button>
                                <span className="text-xs text-gray-500 w-8 text-center">{logoSize.height}</span>
                                <button
                                  onClick={increaseLogoHeight}
                                  className="w-6 h-6 flex items-center justify-center text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
                                  title="Increase logo height"
                                >
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                                  </svg>
                                </button>
                              </div>
                            </div>

                            <div className="flex items-center justify-between">
                              <span className="text-xs font-medium text-gray-700">Name Size</span>
                              <div className="flex items-center space-x-1">
                                <button
                                  onClick={decreaseNameSize}
                                  className="w-6 h-6 flex items-center justify-center text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
                                  title="Decrease name size"
                                >
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4"/>
                                  </svg>
                                </button>
                                <span className="text-xs text-gray-500 w-8 text-center">{nameSize}px</span>
                                <button
                                  onClick={increaseNameSize}
                                  className="w-6 h-6 flex items-center justify-center text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
                                  title="Increase name size"
                                >
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                                  </svg>
                                </button>
                              </div>
                            </div>

                            <div className="flex items-center justify-between">
                              <span className="text-xs font-medium text-gray-700">Phone Size</span>
                              <div className="flex items-center space-x-1">
                                <button
                                  onClick={decreasePhoneSize}
                                  className="w-6 h-6 flex items-center justify-center text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
                                  title="Decrease phone size"
                                >
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4"/>
                                  </svg>
                                </button>
                                <span className="text-xs text-gray-500 w-8 text-center">{phoneSize}px</span>
                                <button
                                  onClick={increasePhoneSize}
                                  className="w-6 h-6 flex items-center justify-center text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
                                  title="Increase phone size"
                                >
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                                  </svg>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={flipCard}
                    className="px-3 sm:px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-xs sm:text-sm font-medium transition-colors"
                  >
                    {isCardFlipped ? 'Front' : 'Back'}
                  </button>
                  <button
                    onClick={resetRotation}
                    className="px-3 sm:px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs sm:text-sm font-medium transition-colors"
                  >
                    Reset View
                  </button>
                </div>
              </div>

              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-4 sm:p-6 lg:p-8 shadow-xl">
                <div className="relative">
                  {/* 3D Card Container */}
                  <div className="relative w-full h-64 sm:h-80 lg:h-96 flex items-center justify-center perspective-1000">
                    <div
                      ref={cardRef}
                      className={`relative w-64 h-40 sm:w-72 sm:h-44 lg:w-80 lg:h-48 transform-gpu cursor-grab active:cursor-grabbing card-glow ${isDragging3D ? 'scale-105' : ''}`}
                      style={{
                        transformStyle: 'preserve-3d',
                        transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y + (isCardFlipped ? 180 : 0)}deg)`,
                        transition: isDragging3D ? 'none' : 'transform 0.1s ease-out',
                      }}
                      onMouseDown={handleMouseDown}
                      onMouseMove={handleMouseMove}
                      onMouseUp={handleMouseUp}
                      onMouseLeave={handleMouseUp}
                      onTouchStart={handleTouchStart}
                      onTouchMove={handleTouchMove}
                      onTouchEnd={handleTouchEnd}
                    >
                      {/* Card Front */}
                      <div
                        className={`absolute inset-0 w-full h-full rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-6 text-white shadow-2xl ${
                          isCardFlipped ? 'backface-hidden' : ''
                        }`}
                        style={{
                          transform: isCardFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                        }}
                        onMouseMove={handleElementMouseMove}
                        onMouseUp={handleElementMouseUp}
                        onMouseLeave={handleElementMouseUp}
                      >
                        {/* Adjustable Logo */}
                        <div
                          className={`absolute cursor-move select-none ${draggingElement === 'logo' ? 'z-10 scale-105' : 'z-0'}`}
                          style={{
                            left: `${logoPosition.x}%`,
                            top: `${logoPosition.y}%`,
                            transform: 'translate(-50%, -50%)',
                          }}
                          onMouseDown={(e) => handleElementMouseDown(e, 'logo', logoPosition)}
                        >
                          {uploadedImage ? (
                            <img
                              src={uploadedImage}
                              alt="Logo"
                              style={{
                                width: `${logoSize.width}px`,
                                height: `${logoSize.height}px`,
                              }}
                              className="rounded-lg object-cover border-2 border-white shadow-lg"
                            />
                          ) : (
                            <div
                              style={{
                                width: `${logoSize.width}px`,
                                height: `${logoSize.height}px`,
                              }}
                              className="bg-white/20 rounded-lg flex items-center justify-center border-2 border-white/30"
                            >
                              <svg className="w-8 h-8 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                              </svg>
                            </div>
                          )}
                        </div>

                        {/* Adjustable Name */}
                        <div
                          className={`absolute cursor-move select-none ${draggingElement === 'name' ? 'z-10 scale-105' : 'z-0'}`}
                          style={{
                            left: `${namePosition.x}%`,
                            top: `${namePosition.y}%`,
                            transform: 'translate(-50%, -50%)',
                          }}
                          onMouseDown={(e) => handleElementMouseDown(e, 'name', namePosition)}
                        >
                          <div className="flex items-center space-x-2">
                            <h3
                              className="font-bold leading-tight text-white"
                              style={{ fontSize: `${nameSize}px` }}
                            >
                              {cardData.name}
                            </h3>
                            <svg className="w-6 h-6 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                            </svg>
                          </div>
                        </div>

                        {/* Adjustable Phone */}
                        <div
                          className={`absolute cursor-move select-none ${draggingElement === 'phone' ? 'z-10 scale-105' : 'z-0'}`}
                          style={{
                            left: `${phonePosition.x}%`,
                            top: `${phonePosition.y}%`,
                            transform: 'translate(-50%, -50%)',
                          }}
                          onMouseDown={(e) => handleElementMouseDown(e, 'phone', phonePosition)}
                        >
                          <div className="flex items-center space-x-2 font-medium text-white">
                            <svg className="w-5 h-5 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                            </svg>
                            <span style={{ fontSize: `${phoneSize}px` }}>{cardData.phone}</span>
                          </div>
                        </div>

                        {/* Shine effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-full animate-pulse"></div>
                      </div>

                      {/* Card Back */}
                      <div
                        className={`absolute inset-0 w-full h-full rounded-xl bg-gradient-to-br from-gray-800 via-gray-900 to-black p-6 text-white shadow-2xl ${
                          !isCardFlipped ? 'backface-hidden' : ''
                        }`}
                        style={{
                          transform: !isCardFlipped ? 'rotateY(180deg)' : 'rotateY(360deg)',
                        }}
                      >
                        <div style={{ transform: isCardFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}>
                          <div className="space-y-1 h-full flex flex-col justify-center px-2">
                            <div className="text-center mb-1">
                              <h4 className="font-bold text-xs text-white">Contact Details</h4>
                            </div>

                            {/* Address */}
                            {cardData.address && (
                              <div className="flex items-start space-x-1.5 p-1 bg-white/10 rounded-sm backdrop-blur-sm">
                                <div className="w-4 h-4 bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                  <svg className="w-2.5 h-2.5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                                  </svg>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-medium text-gray-300 leading-none">Address</p>
                                  <p className="text-xs leading-none">{cardData.address}</p>
                                </div>
                              </div>
                            )}

                            {/* Email */}
                            {cardData.email && (
                              <div className="flex items-center space-x-1.5 p-1 bg-white/10 rounded-sm backdrop-blur-sm">
                                <div className="w-4 h-4 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                                  <svg className="w-2.5 h-2.5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                                  </svg>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-medium text-gray-300 leading-none">Email</p>
                                  <p className="text-xs leading-none truncate">{cardData.email}</p>
                                </div>
                              </div>
                            )}

                            {/* Company Name */}
                            {cardData.company && (
                              <div className="flex items-center space-x-1.5 p-1 bg-white/10 rounded-sm backdrop-blur-sm">
                                <div className="w-4 h-4 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                                  <svg className="w-2.5 h-2.5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                                  </svg>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-medium text-gray-300 leading-none">Company</p>
                                  <p className="text-xs leading-none">{cardData.company}</p>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* NFC Indicator */}
                          <div className="absolute bottom-1 right-1 flex items-center space-x-1 text-xs text-gray-400 bg-black/20 px-1.5 py-0.5 rounded-lg backdrop-blur-sm">
                            <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                            </svg>
                            <span>NFC</span>
                          </div>
                        </div>
                      </div>

                      {/* Card Shadow/Reflection */}
                      <div
                        className="absolute inset-0 w-full h-full rounded-xl bg-gradient-to-t from-black/20 to-transparent pointer-events-none"
                        style={{
                          transform: 'translateZ(-1px) rotateX(180deg)',
                          opacity: 0.3,
                        }}
                      ></div>
                    </div>

                    {/* Lighting effects */}
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
                      <div className="absolute bottom-10 right-10 w-16 h-16 bg-blue-300/20 rounded-full blur-lg"></div>
                    </div>
                  </div>

                  {/* Instructions */}
                  <div className="mt-4 sm:mt-6 text-center">
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 lg:gap-6 text-xs sm:text-sm text-gray-600 mb-2">
                      <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"/>
                        </svg>
                        <span>Drag elements to reposition</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"/>
                        </svg>
                        <span>Drag to rotate 3D</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"/>
                        </svg>
                        <span>Click flip button</span>
                      </div>
                    </div>
                    <p className="text-gray-500 text-xs">
                      Drag elements anywhere • Logo: Size/W/H controls • Name/Phone: Size controls • Front: Custom Layout • Back: Contact Details • NFC Ready
                    </p>
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