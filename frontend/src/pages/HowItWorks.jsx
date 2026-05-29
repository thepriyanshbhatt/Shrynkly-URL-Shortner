import { motion } from 'framer-motion';
import { Scissors, Zap, Map, Rocket } from 'lucide-react';
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
      className="w-full flex flex-col items-center flex-grow pt-24 pb-32 px-4"
    >
      <div className="max-w-4xl w-full">
        <div className="text-center mb-20">
          <div className="inline-flex items-center justify-center p-3 bg-gray-100 dark:bg-white/10 rounded-2xl mb-6 text-black dark:text-white">
            <Zap size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-6 text-black dark:text-white">How Shrynkly Works</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Ever wonder how a giant, messy link turns into a tiny, clean one? Here's the magic behind the scenes, explained simply.
          </p>
        </div>

        <div className="space-y-12">
          {/* Step 1 */}
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
            <div className="w-16 h-16 rounded-3xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0 border border-blue-100 dark:border-blue-800/30">
              <span className="text-2xl font-black">1</span>
            </div>
            <div className="flex-1 bg-white dark:bg-[#111] p-8 rounded-3xl border border-gray-200 dark:border-white/20 shadow-sm hover:shadow-2xl dark:hover:shadow-[0_10px_30px_rgba(255,255,255,0.05)] hover:border-gray-400 dark:hover:border-white/40 transition-all duration-300 hover:-translate-y-1">
              <h3 className="text-2xl font-bold text-black dark:text-white mb-3 flex items-center gap-3">
                <Map className="text-gray-400" size={24} /> 
                You give us a massive map
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
                Imagine you want to invite your friends to a hidden treasure, but the directions are a hundred pages long. That's what a long, messy web address (URL) looks like. When you paste that long link into Shrynkly, you're handing us that giant map.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
            <div className="w-16 h-16 rounded-3xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0 border border-indigo-100 dark:border-indigo-800/30">
              <span className="text-2xl font-black">2</span>
            </div>
            <div className="flex-1 bg-white dark:bg-[#111] p-8 rounded-3xl border border-gray-200 dark:border-white/20 shadow-sm hover:shadow-2xl dark:hover:shadow-[0_10px_30px_rgba(255,255,255,0.05)] hover:border-gray-400 dark:hover:border-white/40 transition-all duration-300 hover:-translate-y-1">
              <h3 className="text-2xl font-bold text-black dark:text-white mb-3 flex items-center gap-3">
                <Scissors className="text-gray-400" size={24} /> 
                We create a tiny nickname
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
                Instead of making your friends read a hundred pages, we put your giant map in a safe locker and put a tiny, easy-to-read sticker on the door. This sticker is your new Shrynkly short link (like `shrynk.ly/abc`).
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
            <div className="w-16 h-16 rounded-3xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0 border border-emerald-100 dark:border-emerald-800/30">
              <span className="text-2xl font-black">3</span>
            </div>
            <div className="flex-1 bg-white dark:bg-[#111] p-8 rounded-3xl border border-gray-200 dark:border-white/20 shadow-sm hover:shadow-2xl dark:hover:shadow-[0_10px_30px_rgba(255,255,255,0.05)] hover:border-gray-400 dark:hover:border-white/40 transition-all duration-300 hover:-translate-y-1">
              <h3 className="text-2xl font-bold text-black dark:text-white mb-3 flex items-center gap-3">
                <Rocket className="text-gray-400" size={24} /> 
                Instant teleportation
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
                When someone clicks your short link, they come to our door. We look at the sticker, instantly grab the giant map from the locker, and teleport them straight to the destination website in the blink of an eye. 
              </p>
            </div>
          </div>
        </div>

        <div className="mt-20 p-8 bg-gray-50 dark:bg-[#0a0a0a] rounded-3xl border border-gray-200 dark:border-white/20 text-center hover:border-gray-400 dark:hover:border-white/40 transition-all duration-300 hover:-translate-y-1 shadow-sm hover:shadow-xl dark:hover:shadow-[0_10px_30px_rgba(255,255,255,0.05)]">
          <h3 className="text-xl font-bold text-black dark:text-white mb-4">Why is this useful?</h3>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl mx-auto">
            Short links are much easier to share on social media, fit perfectly in text messages, and look much cleaner on posters or business cards. Plus, because everyone walks through our door to get to the destination, we can count exactly how many people clicked your link!
          </p>
        </div>
      </div>
    </motion.main>
  );
}
