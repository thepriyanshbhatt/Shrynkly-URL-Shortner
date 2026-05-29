import { motion } from 'framer-motion';
import { Scissors, Link as LinkIcon, Play, ArrowDown, Shield } from 'lucide-react';
import { useEffect } from 'react';

export default function HowItWorks() {
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.3 }}
      className="w-full flex flex-col items-center flex-grow pt-24 pb-32 px-4 bg-gray-50 dark:bg-[#0a0a0a]"
    >
      <div className="max-w-3xl w-full">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-[10px] sm:text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-[0.2em] mb-4">
            How it works
          </p>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-black dark:text-white mb-4">
            Short links in three steps
          </h1>
          <p className="text-gray-600 dark:text-gray-400 font-medium">
            No account needed. No fuss. Just a cleaner link.
          </p>
        </div>

        {/* Steps Container */}
        <div className="relative max-w-2xl mx-auto">
          
          {/* Step 1 */}
          <div className="bg-white dark:bg-[#1c1c1e] border border-gray-200 dark:border-white/5 rounded-2xl p-6 sm:p-8 shadow-sm">
            <div className="flex items-start gap-4 sm:gap-6">
              <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400 flex items-center justify-center flex-shrink-0 text-sm font-bold">
                1
              </div>
              <div>
                <h3 className="text-lg font-bold text-black dark:text-white flex items-center gap-2 mb-2">
                  <LinkIcon size={18} className="text-gray-500 dark:text-gray-400" /> 
                  Paste your long URL
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  Got a URL that looks like a ransom note? Paste it in. We accept anything — tracking parameters, query strings, the whole mess.
                </p>
              </div>
            </div>
          </div>

          {/* Arrow Down */}
          <div className="flex justify-center py-4 text-gray-400 dark:text-gray-600">
            <ArrowDown size={18} strokeWidth={2.5} />
          </div>

          {/* Step 2 */}
          <div className="bg-white dark:bg-[#1c1c1e] border border-gray-200 dark:border-white/5 rounded-2xl p-6 sm:p-8 shadow-sm">
            <div className="flex items-start gap-4 sm:gap-6">
              <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-700 dark:bg-teal-500/20 dark:text-teal-400 flex items-center justify-center flex-shrink-0 text-sm font-bold">
                2
              </div>
              <div>
                <h3 className="text-lg font-bold text-black dark:text-white flex items-center gap-2 mb-2">
                  <Scissors size={18} className="text-gray-500 dark:text-gray-400" /> 
                  Get a clean short link
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  We generate a compact link like <code className="bg-gray-100 dark:bg-black/30 px-1.5 py-0.5 rounded font-mono text-[13px] text-gray-800 dark:text-gray-300">shrynk.ly/abc</code> — easy to share, copy, and actually remember.
                </p>
              </div>
            </div>
          </div>

          {/* Arrow Down */}
          <div className="flex justify-center py-4 text-gray-400 dark:text-gray-600">
            <ArrowDown size={18} strokeWidth={2.5} />
          </div>

          {/* Step 3 */}
          <div className="bg-white dark:bg-[#1c1c1e] border border-gray-200 dark:border-white/5 rounded-2xl p-6 sm:p-8 shadow-sm">
            <div className="flex items-start gap-4 sm:gap-6">
              <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400 flex items-center justify-center flex-shrink-0 text-sm font-bold">
                3
              </div>
              <div>
                <h3 className="text-lg font-bold text-black dark:text-white flex items-center gap-2 mb-2">
                  <Play size={18} className="text-gray-500 dark:text-gray-400" fill="currentColor" /> 
                  Click, redirect, done
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  Anyone who clicks your short link lands at the original destination instantly — no loading screens, no middlemen, no weird detours.
                </p>
              </div>
            </div>
          </div>
          
          {/* Trust Line */}
          <div className="mt-8 bg-gray-100 dark:bg-[#1c1c1e] border border-gray-200 dark:border-white/5 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-center gap-3 text-sm text-gray-600 dark:text-gray-400 text-center sm:text-left shadow-sm">
            <Shield size={18} className="flex-shrink-0 text-gray-400" />
            <p className="font-medium">
              Your original URL is stored securely. Short links never expire unless you delete them.
            </p>
          </div>

        </div>
      </div>
    </motion.main>
  );
}
