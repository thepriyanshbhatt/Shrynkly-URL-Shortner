import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: "What is Shrynkly?",
    answer: "Shrynkly is a lightning-fast, privacy-first URL shortener. We help you take long, unwieldy links and turn them into short, manageable URLs that you can easily share."
  },
  {
    question: "Is it really 100% free?",
    answer: "Yes! Our core URL shortening features are completely free to use. We don't require an account or credit card for basic usage. We also offer Premium and Enterprise tiers for users who need advanced features like custom domains and analytics."
  },
  {
    question: "How long do the links last?",
    answer: "By default, free links expire in 7 days to keep our system fast and clean. If you need links that last forever, you can upgrade to our Pro or Enterprise plans."
  },
  {
    question: "Do you track my data?",
    answer: "No. Privacy is our top priority. Shrynkly processes your links locally where possible, and we do not sell or harvest your data. Any analytics we provide are strictly for your own use."
  },
  {
    question: "Can I use my own domain?",
    answer: "Yes! With our Pro and Enterprise plans, you can connect your own custom domain (like go.yourbrand.com) to create branded short links."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
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
      <p className="text-gray-600 dark:text-gray-400 text-lg mb-16 text-center max-w-2xl">
        Everything you need to know about Shrynkly. Can't find the answer you're looking for? Feel free to contact our support team.
      </p>

      <div className="w-full space-y-4">
        {faqs.map((faq, index) => (
          <div 
            key={index} 
            className="bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm dark:shadow-none transition-colors"
          >
            <button 
              onClick={() => toggleFAQ(index)}
              className="w-full text-left px-6 py-6 flex items-center justify-between focus:outline-none group"
            >
              <span className="text-lg font-bold text-black dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{faq.question}</span>
              <motion.div
                animate={{ rotate: openIndex === index ? 180 : 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <ChevronDown size={20} className="text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
              </motion.div>
            </button>
            
            <AnimatePresence>
              {openIndex === index && (
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
        ))}
      </div>
    </motion.div>
  );
}
