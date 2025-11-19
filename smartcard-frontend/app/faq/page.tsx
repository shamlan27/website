"use client";
import Footer from "../components/Footer";

export default function FAQ() {
  const faqs = [
    {
      question: "What is a digital business card?",
      answer: "A digital business card is a modern alternative to traditional paper business cards. It's a digital profile that contains your contact information, social media links, and other professional details that can be shared instantly via QR code, NFC, or direct link."
    },
    {
      question: "How do I create my digital business card?",
      answer: "Creating a digital business card is simple! Sign up for an account, choose a template, add your information (name, title, company, contact details, social media links), customize the design, and you're ready to share. The entire process takes less than 5 minutes."
    },
    {
      question: "Can I customize my digital business card?",
      answer: "Absolutely! Our platform offers extensive customization options including colors, fonts, layouts, background images, and branding elements. You can match your company's brand guidelines or create a unique personal style."
    },
    {
      question: "How do I share my digital business card?",
      answer: "You can share your digital business card in multiple ways: 1) Generate a QR code that others can scan, 2) Share a direct link via email, messaging apps, or social media, 3) Use NFC-enabled physical cards that automatically open your digital profile, or 4) Integrate with your email signature."
    },
    {
      question: "Is my information secure?",
      answer: "Yes, security is our top priority. All data is encrypted and stored securely. You control what information is visible on your card, and you can update or deactivate your card at any time. We comply with GDPR and other privacy regulations."
    },
    {
      question: "Can I track who views my business card?",
      answer: "Yes! Our Professional and Enterprise plans include analytics that show you how many times your card has been viewed, when it was accessed, and basic geographic information about your contacts."
    },
    {
      question: "What happens if I change jobs or contact information?",
      answer: "You can easily update your digital business card anytime through your dashboard. Changes are reflected immediately across all shared links and QR codes. No need to reprint physical cards!"
    },
    {
      question: "Do you offer physical NFC business cards?",
      answer: "Yes! We offer premium NFC-enabled physical business cards that automatically open your digital profile when tapped with a smartphone. These cards combine the best of both worlds - traditional networking with modern technology."
    },
    {
      question: "Can I integrate my digital business card with my email signature?",
      answer: "Definitely! We provide HTML code that you can add to your email signature in Outlook, Gmail, or other email clients. This makes it easy for recipients to save your contact information directly to their phone."
    },
    {
      question: "What devices and browsers are supported?",
      answer: "Our digital business cards work on all modern smartphones, tablets, and computers. They are optimized for iOS Safari, Chrome, Firefox, and other popular browsers. The NFC feature works on Android devices and iPhones with NFC capability."
    },
    {
      question: "Can I have multiple business cards for different purposes?",
      answer: "Yes! With our Professional and Enterprise plans, you can create multiple business cards for different roles, departments, or events. Each card can have its own design and contact information."
    },
    {
      question: "How do I cancel my subscription?",
      answer: "You can cancel your subscription anytime from your account settings. Your digital business card will remain active until the end of your billing period. We don't charge cancellation fees, and you can reactivate your account at any time."
    },
    {
      question: "Do you offer refunds?",
      answer: "We offer a 30-day money-back guarantee for all paid plans. If you're not satisfied with our service, contact our support team within 30 days of purchase for a full refund."
    },
    {
      question: "Can I export my contacts or data?",
      answer: "Yes, you can export your analytics data and contact information at any time. We believe in data portability and make it easy for you to take your information with you if you decide to leave our platform."
    },
    {
      question: "Do you have a mobile app?",
      answer: "We offer mobile-optimized web experiences that work perfectly on all smartphones. While we don't have a dedicated app yet, our responsive design provides an app-like experience when saved to your home screen."
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
            <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight drop-shadow-sm" style={{color: 'var(--foreground)'}}>
              Frequently Asked <span className="text-blue-600">Questions</span>
            </h1>
            <p className="mt-6 max-w-3xl mx-auto text-lg text-gray-600 leading-relaxed">
              Everything you need to know about digital business cards and our platform.
            </p>
          </div>
        </div>
      </header>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-4xl px-6">
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300 border border-gray-100"
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-3 leading-tight">
                  {faq.question}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Still Have Questions?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Our support team is here to help you succeed with digital business cards.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-full text-blue-600 bg-white hover:bg-gray-50 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Contact Support
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
              </svg>
            </a>
            <a
              href="/help"
              className="inline-flex items-center px-8 py-4 border-2 border-white text-lg font-medium rounded-full text-white hover:bg-white hover:text-blue-600 transform hover:scale-105 transition-all duration-300"
            >
              Help Center
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}