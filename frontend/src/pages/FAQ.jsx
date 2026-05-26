import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqCategories = [
  {
    id: "general",
    title: "General Queries",
    items: [
      {
        question: "What is Shrynkly?",
        answer: "Shrynkly is a lightning-fast, privacy-first URL shortener. We help you take long, unwieldy links and turn them into short, manageable URLs that you can easily share."
      },
      {
        question: "Is it really 100% free?",
        answer: "Yes! Our core URL shortening features are completely free to use. We don't require an account or credit card for basic usage. We also offer Premium and Enterprise tiers for users who need advanced features like custom domains and analytics."
      },
      {
        question: "Do I need to create an account?",
        answer: "No, you can start shortening links instantly without signing up. However, creating a free account lets you view your link history, access basic analytics, and manage your links across devices."
      },
      {
        question: "How long do the links last?",
        answer: "As a guest, your free links expire in 3 days to keep our system fast and clean. If you create a free account, your links will last for 7 days. If you need links that last forever, you can upgrade to our Pro or Enterprise plans."
      },
      {
        question: "How many links can I shorten?",
        answer: "Free users can shorten up to 50 links per month. If you need more capacity, our Pro plan allows up to 1,000 links per month, and our Enterprise plan offers unlimited shortening."
      }
    ]
  },
  {
    id: "privacy",
    title: "Privacy & Security",
    items: [
      {
        question: "Do you track my data?",
        answer: "No. Privacy is our top priority. Shrynkly processes your links locally where possible, and we do not sell or harvest your data. Any analytics we provide are strictly for your own use."
      },
      {
        question: "Is it safe to click a Shrynkly link?",
        answer: "Yes. Every URL is thoroughly scanned using multiple threat-detection databases to ensure it doesn't lead to malware or phishing sites."
      },
      {
        question: "Can anyone see the analytics for my shortened links?",
        answer: "No, your link analytics (like click counts and locations) are completely private and only accessible to you from your personal dashboard."
      },
      {
        question: "What happens to my data if I delete my account?",
        answer: "We adhere strictly to data minimization principles. If you choose to delete your account, all associated links, history, and analytics data are permanently removed from our servers."
      }
    ]
  },
  {
    id: "troubleshooting",
    title: "Troubleshooting",
    items: [
      {
        question: "Why is my link not working?",
        answer: "If a link isn't working, it may have expired (guest links expire after 3 days, free account links after 7 days) or the original destination URL may no longer exist. Try generating a new link."
      },
      {
        question: "I lost my short link, can I retrieve it?",
        answer: "If you shortened the link while logged in, you can easily find it in your dashboard history. If you were using the tool as a guest and cleared your browser cache, the link cannot be retrieved."
      },
      {
        question: "How do I edit a dynamic QR code?",
        answer: "Dynamic QR codes are available on the Pro and Enterprise plans. You can edit the destination URL from your dashboard without having to generate or print a new QR code."
      },
      {
        question: "Why does my custom branded domain say 'Pending'?",
        answer: "DNS propagation can take anywhere from a few minutes to 24 hours. If it's still pending after 24 hours, double-check that your DNS records exactly match the ones provided in your dashboard settings."
      }
    ]
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  // Fix: Ensure we scroll to the top of the page when the route loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const toggleFAQ = (itemKey) => {
    setOpenIndex(openIndex === itemKey ? null : itemKey);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -100 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-4xl mx-auto px-4 py-32 min-h-[80vh] flex flex-col items-center relative z-10"
    >
      <div className="bg-gray-200 dark:bg-white/10 text-gray-700 dark:text-gray-300 text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
        Support
      </div>
      <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6 text-black dark:text-white text-center">Frequently Asked Questions</h1>
      <p className="text-gray-600 dark:text-gray-400 text-lg mb-12 text-center max-w-2xl">
        Everything you need to know about Shrynkly. Can't find the answer you're looking for? Feel free to contact our support team.
      </p>

      {/* Category Navigation Pills */}
      <div className="flex flex-wrap justify-center gap-3 mb-16">
        {faqCategories.map((category) => (
          <button 
            key={`nav-${category.id}`}
            onClick={() => document.getElementById(category.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
            className="px-5 py-2.5 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 text-sm font-bold text-gray-800 dark:text-gray-200 transition-colors shadow-sm dark:shadow-none"
          >
            {category.title}
          </button>
        ))}
      </div>

      <div className="w-full space-y-16">
        {faqCategories.map((category) => (
          <div key={category.id} id={category.id} className="scroll-mt-32">
            <h2 className="text-2xl font-bold text-black dark:text-white mb-6 pl-4 border-l-4 border-blue-500">
              {category.title}
            </h2>
            
            <div className="w-full space-y-4">
              {category.items.map((faq, index) => {
                const itemKey = `${category.id}-${index}`;
                return (
                  <div 
                    key={itemKey} 
                    className="bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm dark:shadow-none transition-colors"
                  >
                    <button 
                      onClick={() => toggleFAQ(itemKey)}
                      className="w-full text-left px-6 py-6 flex items-center justify-between focus:outline-none group"
                    >
                      <span className="text-lg font-bold text-black dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {faq.question}
                      </span>
                      <motion.div
                        animate={{ rotate: openIndex === itemKey ? 180 : 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                      >
                        <ChevronDown size={20} className="text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                      </motion.div>
                    </button>
                    
                    <AnimatePresence>
                      {openIndex === itemKey && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                        >
                          <div className="px-6 pb-6 text-gray-600 dark:text-gray-400 leading-relaxed border-t border-gray-100 dark:border-white/5 pt-4">
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
