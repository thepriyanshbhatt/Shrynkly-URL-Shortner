import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link2, Clock, BarChart, QrCode, Users, Minus, Calendar, LineChart, Layers, Edit, Lock, Headphones } from 'lucide-react';

export default function Pricing() {
  // Ensure we scroll to the top of the page when the route loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -100 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="w-full bg-[#fafafa] dark:bg-[#050505] py-32 px-4 relative z-10 transition-colors duration-300 min-h-[80vh] flex flex-col items-center"
    >
      <div className="max-w-6xl mx-auto flex flex-col items-center w-full">
        <div className="bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
          Pricing
        </div>
        <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-24 text-black dark:text-white text-center">Pick a plan that scales with you</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-3xl mx-auto items-stretch">
          {/* Free Tier */}
          <div className="bg-white dark:bg-[#0f0f0f] border border-gray-200 dark:border-white/10 rounded-[2rem] p-8 lg:p-10 flex flex-col h-full shadow-sm dark:shadow-none hover:border-gray-300 dark:hover:border-white/20 transition-colors">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Free</h3>
            <div className="flex items-end gap-2 mb-8">
              <span className="text-5xl font-black text-black dark:text-white">$0</span>
              <span className="text-sm font-medium text-gray-500 mb-1">Forever</span>
            </div>
            <ul className="flex flex-col gap-4 mb-10 flex-1">
              {[
                { text: '50 links / mo', icon: <Link2 size={16} /> },
                { text: 'Links expire in 7 days', icon: <Clock size={16} /> },
                { text: 'Basic analytics (clicks only)', icon: <BarChart size={16} /> },
                { text: 'Static QR codes', icon: <QrCode size={16} /> },
                { text: 'Community support', icon: <Users size={16} /> },
                { text: 'No bulk shortening', icon: <Minus size={16} />, negative: true },
                { text: 'No link editing after creation', icon: <Minus size={16} />, negative: true }
              ].map((feature, i) => (
                <li key={i} className={`flex items-center gap-3 text-sm font-medium ${feature.negative ? 'text-gray-400 dark:text-gray-500' : 'text-gray-600 dark:text-gray-300'}`}>
                  <div className={`shrink-0 ${feature.negative ? 'text-gray-400 dark:text-gray-500' : 'text-gray-500 dark:text-gray-400'}`}>
                    {feature.icon}
                  </div>
                  {feature.text}
                </li>
              ))}
            </ul>
            <button className="w-full py-3 px-4 rounded-xl font-bold bg-gray-50 hover:bg-gray-100 dark:bg-white/5 dark:hover:bg-white/10 text-black dark:text-white border border-gray-200 dark:border-white/10 transition-colors">
              Start Free
            </button>
          </div>

          {/* Pro Tier */}
          <div className="bg-white dark:bg-[#111111] border-2 border-blue-500 dark:border-blue-600 rounded-[2rem] p-8 lg:p-10 flex flex-col h-full shadow-2xl dark:shadow-[0_0_40px_rgba(37,99,235,0.1)] relative z-10">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-blue-600 dark:bg-blue-600/90 text-white text-xs font-semibold px-4 py-1 rounded-full whitespace-nowrap shadow-sm">
              Most popular
            </div>
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4 mt-2">Pro</h3>
            <div className="flex items-end gap-2 mb-8">
              <span className="text-5xl font-black text-black dark:text-white">$4.99</span>
              <span className="text-sm font-medium text-gray-500 mb-1">per month</span>
            </div>
            <ul className="flex flex-col gap-4 mb-10 flex-1">
              {[
                { text: '1,000 links / mo', icon: <Link2 size={16} /> },
                { text: 'Custom link expiration', icon: <Calendar size={16} /> },
                { text: 'Deep analytics (clicks, location, referrers)', icon: <LineChart size={16} /> },
                { text: 'Dynamic (editable) QR codes', icon: <QrCode size={16} /> },
                { text: 'Bulk shortening', icon: <Layers size={16} /> },
                { text: 'Edit destination URL after creation', icon: <Edit size={16} /> },
                { text: 'Password-protected links', icon: <Lock size={16} /> },
                { text: 'Priority support', icon: <Headphones size={16} /> }
              ].map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-200 font-medium">
                  <div className="shrink-0 text-blue-600 dark:text-blue-400">
                    {feature.icon}
                  </div>
                  {feature.text}
                </li>
              ))}
            </ul>
            <button className="w-full py-3 px-4 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25 transition-colors">
              Go Pro
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
