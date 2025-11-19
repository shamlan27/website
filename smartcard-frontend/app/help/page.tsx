'use client';
import React, { JSX,use, useEffect, useRef, useState } from 'react';

const WHATSAPP_NUMBER: string = '94771234567'; // <-- REPLACE

type Sender = 'agent' | 'user';

interface Message {
  id: number;
  from: Sender;
  text: string;
  time: string;
}

export default function HelpCenter(): JSX.Element {
  const [open, setOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, from: 'agent', text: 'Hi! Welcome to Support — how can we help you today?', time: new Date().toLocaleTimeString() },
  ]);
  const [input, setInput] = useState<string>('');
  const [typing, setTyping] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    scrollToBottom();
    // Optional: add keyboard shortcut to toggle chat or focus input
    const onKey = (e: KeyboardEvent) => {
      if (e.key === '/') {
        e.preventDefault();
        setOpen(true);
        // focusing input would require a ref on the input element
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [messages, open]);

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }

  function sendMessage(e?: React.FormEvent) {
    e?.preventDefault();
    if (!input.trim()) return;
    const msg: Message = { id: Date.now(), from: 'user', text: input.trim(), time: new Date().toLocaleTimeString() };
    setMessages(prev => [...prev, msg]);
    setInput('');

    // Simulate agent / bot reply
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages(prev => [...prev, { id: Date.now() + 1, from: 'agent', text: `Thanks — we received: "${msg.text}". An agent will respond shortly.`, time: new Date().toLocaleTimeString() }]);
    }, 1200 + Math.random() * 1200);
  }

  function clearChat() {
    setMessages([]);
  }

  const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hello, I need help with...')}`;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <header className="max-w-6xl mx-auto mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Help Center</h1>
        <div className="text-sm text-gray-600">Support available 8:00 — 22:00 (local time)</div>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: FAQ */}
        <section className="lg:col-span-2">
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>

            <details className="mb-3" open>
              <summary className="cursor-pointer font-medium">How do I track my order?</summary>
              <p className="mt-2 text-sm text-gray-600">Go to Orders &gt; Track and enter your order ID. We'll also email tracking updates.</p>
            </details>

            <details className="mb-3">
              <summary className="cursor-pointer font-medium">What are your returns policies?</summary>
              <p className="mt-2 text-sm text-gray-600">Most items are returnable within 14 days of delivery. See our Returns page for details.</p>
            </details>

            <details className="mb-3">
              <summary className="cursor-pointer font-medium">Can I change my shipping address?</summary>
              <p className="mt-2 text-sm text-gray-600">If your order hasn't shipped yet, contact support and we'll try to update the address.</p>
            </details>

            <div className="mt-6">
              <h3 className="font-semibold mb-2">Still need help?</h3>
              <p className="text-sm text-gray-600">Use live chat (bottom right), contact form, or WhatsApp — we'll get back quickly.</p>

              <form onSubmit={(e) => { e.preventDefault(); alert('Contact form sent (mock)'); (e.target as HTMLFormElement).reset(); }} className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input name="name" placeholder="Your name" className="border rounded p-2" required />
                <input name="email" type="email" placeholder="Email" className="border rounded p-2" required />
                <textarea name="message" placeholder="Message" className="border rounded p-2 col-span-1 sm:col-span-2" rows={4} required />
                <button type="submit" className="col-span-1 sm:col-span-2 bg-indigo-600 text-white py-2 rounded">Send message</button>
              </form>
            </div>
          </div>
        </section>

        {/* Right: Contact options quick */}
        <aside className="lg:col-span-1">
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold mb-2">Contact options</h3>
            <ul className="space-y-3 text-sm text-gray-700">
              <li>📞 Phone: +94 77 123 4567</li>
              <li>✉️ Email: support@example.com</li>
              <li>💬 Live Chat: Click the bubble at bottom-right</li>
              <li>🟢 WhatsApp: Quick replies and attachments</li>
            </ul>

            <div className="mt-4">
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="w-full inline-block text-center bg-green-600 text-white py-2 rounded">Message on WhatsApp</a>
            </div>
          </div>

          <div className="mt-4 bg-white p-4 rounded shadow text-sm text-gray-600">
            <h4 className="font-medium">Business hours</h4>
            <p className="mt-2">Mon — Sun: 08:00 — 22:00</p>
            <p className="mt-2 text-xs text-gray-500">Outside hours, leave a message and we’ll reply next available shift.</p>
          </div>
        </aside>
      </main>


      {/* ----------------- Live Chat widget (floating) ----------------- */}
      <div className={`fixed right-6 bottom-6 flex flex-col items-end z-50`}>
        {/* Floating WhatsApp button (stacked above chat toggle) */}
        <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="mb-3 rounded-full shadow-lg p-3 bg-green-600 text-white flex items-center gap-2" title="Message us on WhatsApp">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M20.52 3.48A11.94 11.94 0 0012 .5C6.21.5 1.5 5.21 1.5 11c0 1.94.5 3.77 1.46 5.38L.5 23.5l6.29-2.07A11.44 11.44 0 0012 22.5c5.79 0 10.5-4.71 10.5-10.5 0-3.02-1.18-5.75-3.98-8.52zM12 20.5c-1.14 0-2.24-.2-3.26-.58l-.23-.09-3.73 1.23 1.25-3.64-.07-.24A8.5 8.5 0 013.5 11c0-4.69 3.81-8.5 8.5-8.5S20.5 6.31 20.5 11 16.69 20.5 12 20.5z"/></svg>
          <span className="hidden sm:inline">WhatsApp</span>
        </a>

        {/* Chat toggle button */}
        <button onClick={() => setOpen(v => !v)} className="rounded-full shadow-lg p-3 bg-indigo-600 text-white flex items-center gap-2" title="Open live chat">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M20 2H4a2 2 0 00-2 2v18l4-4h14a2 2 0 002-2V4a2 2 0 00-2-2z"/></svg>
          <span className="hidden sm:inline">Support</span>
        </button>

        {/* Chat panel */}
        {open && (
          <div className="mt-3 w-80 sm:w-96 bg-white rounded shadow-lg overflow-hidden flex flex-col">
            <div className="px-4 py-3 bg-indigo-600 text-white flex items-center justify-between">
              <div>
                <div className="font-semibold">Live Support</div>
                <div className="text-xs opacity-90">Online — Replies usually within a few minutes</div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => { alert('This would open a full chat window in a real app.'); }} className="text-sm underline">Open</button>
                <button onClick={() => setOpen(false)} aria-label="Close chat">✕</button>
              </div>
            </div>

            <div className="p-3 h-64 overflow-auto flex-1" aria-live="polite">
              <div className="space-y-3">
                {messages.map(m => (
                  <div key={m.id} className={`flex ${m.from === 'agent' ? 'justify-start' : 'justify-end'}`}>
                    <div className={`${m.from === 'agent' ? 'bg-gray-100 text-gray-800' : 'bg-indigo-600 text-white'} rounded-lg p-2 max-w-[80%]`}> 
                      <div className="text-sm">{m.text}</div>
                      <div className="text-xs opacity-60 mt-1 text-right">{m.time}</div>
                    </div>
                  </div>
                ))}
                {typing && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-lg p-2 max-w-[70%]">
                      <div className="text-xs text-gray-600">Agent is typing...</div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            <form onSubmit={(e) => sendMessage(e)} className="p-3 border-t">
              <div className="flex gap-2">
                <input value={input} onChange={e => setInput(e.target.value)} placeholder="Type a message" className="flex-1 border rounded p-2 text-sm" />
                <button type="submit" className="bg-indigo-600 text-white px-3 rounded">Send</button>
              </div>
              <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                <div className="flex items-center gap-2">
                  <label className="cursor-pointer">
                    <input type="file" className="hidden" onChange={(e) => { alert('File upload mock — implement backend to handle files.'); }} />
                    <span className="underline">Attach</span>
                  </label>
                  <button type="button" onClick={() => { setMessages(prev => [...prev, { id: Date.now(), from: 'agent', text: 'This is a canned reply sent by the system.', time: new Date().toLocaleTimeString() }]); }} className="underline">Canned reply</button>
                </div>
                <div>
                  <button type="button" onClick={clearChat} className="underline">Clear</button>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>

    </div>
  );
}














