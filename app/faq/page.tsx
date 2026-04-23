'use client';

import PublicLayout from '@/components/layout/PublicLayout';
import { useState } from 'react';
import { ChevronDown, Search } from 'lucide-react';

const faqs = [
  {
    category: 'Buying',
    questions: [
      { q: 'How do I buy a car on Car Trust India?', a: 'Browse our listings, select a car, contact the dealer, schedule an inspection, and complete the purchase with our assistance.' },
      { q: 'Are all cars inspected?', a: 'Yes, every car listed on our platform undergoes a comprehensive 150-point inspection by certified technicians.' },
      { q: 'Can I get a test drive?', a: 'Absolutely! Contact the dealer directly through our platform to schedule a test drive at your convenience.' },
      { q: 'What payment methods are accepted?', a: 'We accept bank transfers, financing options, and cash payments. Financing can be arranged through our partner banks.' },
    ]
  },
  {
    category: 'Selling',
    questions: [
      { q: 'How do I sell my car?', a: 'Register as a dealer, upload your car details with photos, wait for admin approval, and start receiving inquiries from buyers.' },
      { q: 'Is there a listing fee?', a: 'Basic listings are free. Premium features and promoted listings are available at competitive rates.' },
      { q: 'How long does approval take?', a: 'Typically 24-48 hours. Our team reviews each listing to ensure quality and accuracy.' },
      { q: 'Can I edit my listing?', a: 'Yes, you can edit your listing anytime from your dealer dashboard.' },
    ]
  },
  {
    category: 'Services',
    questions: [
      { q: 'What services do you offer?', a: 'We offer inspection services, RC transfer assistance, insurance, extended warranty, and roadside assistance.' },
      { q: 'How much does inspection cost?', a: 'Our comprehensive 150-point inspection starts at ₹2,999. Check our Services page for detailed pricing.' },
      { q: 'Do you help with RC transfer?', a: 'Yes, we provide complete RC transfer assistance including documentation and RTO visits.' },
      { q: 'What warranty options are available?', a: 'We offer 1-year and 2-year extended warranty plans covering engine, transmission, and major components.' },
    ]
  },
  {
    category: 'Account',
    questions: [
      { q: 'How do I create an account?', a: 'Click on Login, enter your mobile number, verify OTP, and choose your role (Customer or Dealer).' },
      { q: 'Can I have both customer and dealer accounts?', a: 'Currently, each mobile number can be registered as either a customer or dealer, not both.' },
      { q: 'How do I reset my password?', a: 'We use OTP-based authentication, so no password is needed. Simply request a new OTP to login.' },
      { q: 'How do I delete my account?', a: 'Contact our support team at support@cartrustindia.com to request account deletion.' },
    ]
  },
  {
    category: 'Payment & Refunds',
    questions: [
      { q: 'Is my payment secure?', a: 'Yes, we use industry-standard encryption and secure payment gateways for all transactions.' },
      { q: 'What is your refund policy?', a: 'Service fees are refundable within 7 days if the service has not been initiated. Car purchases are between buyer and dealer.' },
      { q: 'Do you offer financing?', a: 'Yes, we partner with leading banks to offer competitive car loan rates. Check eligibility on our platform.' },
      { q: 'Are there any hidden charges?', a: 'No, all charges are clearly mentioned upfront. The price you see is the price you pay.' },
    ]
  }
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const filteredFaqs = faqs.map(cat => ({
    ...cat,
    questions: cat.questions.filter(q => 
      q.q.toLowerCase().includes(search.toLowerCase()) || 
      q.a.toLowerCase().includes(search.toLowerCase())
    )
  })).filter(cat => cat.questions.length > 0);

  return (
    <PublicLayout>
      <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-primary-100">Find answers to common questions</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search questions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>

        <div className="space-y-8">
          {filteredFaqs.map((category) => (
            <div key={category.category}>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{category.category}</h2>
              <div className="space-y-3">
                {category.questions.map((faq, idx) => {
                  const key = `${category.category}-${idx}`;
                  return (
                    <div key={key} className="bg-white rounded-lg shadow-sm border border-gray-200">
                      <button
                        onClick={() => setOpenIndex(openIndex === key ? null : key)}
                        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition"
                      >
                        <span className="font-semibold text-gray-900">{faq.q}</span>
                        <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${openIndex === key ? 'rotate-180' : ''}`} />
                      </button>
                      {openIndex === key && (
                        <div className="px-6 pb-4 text-gray-700">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {filteredFaqs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No questions found matching your search.</p>
          </div>
        )}

        <div className="mt-12 bg-primary-50 border border-primary-200 rounded-lg p-6 text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Still have questions?</h3>
          <p className="text-gray-700 mb-4">Can't find the answer you're looking for? Contact our support team.</p>
          <a href="/contact" className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition">
            Contact Support
          </a>
        </div>
      </div>
    </div>
    </PublicLayout>
  );
}
