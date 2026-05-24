import { useState, useEffect } from 'react';
import { Moon, Sun, Link, ArrowRight, Check, Copy, QrCode, ShieldCheck, Zap, History, Trash2, Scissors } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLinkStore } from './stores/useLinkStore';

function App() {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    }
    return 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  const [url, setUrl] = useState('');
  const [alias, setAlias] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentResult, setCurrentResult] = useState(null);
  const [showHistory, setShowHistory] = useState(false);

  const { links, addLink, removeLink, clearLinks } = useLinkStore();
  const [copiedId, setCopiedId] = useState(null);

  const handleShorten = async (e) => {
    e.preventDefault();
    setError('');
    setCurrentResult(null);

    if (!url) {
      setError('Please enter a URL');
      return;
    }

    try {
      new URL(url);
    } catch {
      setError('Please enter a valid URL (e.g., https://example.com)');
      return;
    }

    setLoading(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api/shorten` : '/api/shorten';
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, alias: alias || undefined })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to shorten URL');
      }

      const newLink = {
        id: data.shortCode,
        originalUrl: url,
        shortUrl: data.shortUrl,
        createdAt: new Date().toISOString()
      };

      setCurrentResult(newLink);
      addLink(newLink);
      setUrl('');
      setAlias('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text, id) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  return (
    <div className="min-h-screen font-sans selection:bg-purple-500/30 transition-colors duration-500 bg-gradient-to-br from-[#f3e8ff] to-[#fdf4ff] text-slate-900 dark:from-[#2e1065] dark:to-[#0f172a] dark:text-white relative z-0">
      <div className="grid-overlay" />
      {/* Header */}
      <header className="fixed top-0 w-full px-6 py-4 flex justify-between items-center z-50">
        <div className="flex items-center gap-2">
          <div className="bg-primary text-white p-2 rounded-xl dark:bg-white dark:text-black">
            <Link size={20} />
          </div>
          <span className="font-bold text-xl tracking-tight">Shortly</span>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center gap-2 text-sm font-semibold opacity-80 hover:opacity-100 transition-opacity"
          >
            <History size={18} />
            <span className="hidden sm:inline">History</span>
          </button>
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 transition-colors backdrop-blur-md"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </header>

      <main className="pt-28 pb-20 px-6 max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-16 min-h-[90vh]">
        
        {/* Left Column: Copy & Trust */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex-1 max-w-xl text-left z-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 dark:bg-white/10 backdrop-blur-md border border-white/40 dark:border-white/5 shadow-sm mb-6">
            <span className="text-sm font-semibold flex items-center gap-1"><Zap size={16} className="text-amber-500"/> AI Link Generator</span>
            <span className="text-black/20 dark:text-white/20">|</span>
            <span className="text-sm font-medium flex items-center gap-1 hover:text-purple-600 cursor-pointer transition-colors">Explore More <ArrowRight size={14}/></span>
          </div>

          <h1 className="text-5xl lg:text-7xl font-black tracking-tighter mb-6 leading-[1.05]">
            Meet Your New <br/>
            <span className="text-gradient">URL Shortcut!</span>
          </h1>
          
          <p className="text-lg opacity-70 mb-10 leading-relaxed max-w-md text-[var(--color-text-secondary-light)] dark:text-[var(--color-text-secondary-dark)]">
            Take control of your links with Shortly, the all-in-one platform designed to simplify sharing. Safe, fast, and 100% free.
          </p>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-16">
            <button 
              onClick={() => document.getElementById('urlInput').focus()}
              className="bg-primary hover:bg-primary-hover dark:bg-white dark:hover:bg-gray-200 dark:text-black text-white font-semibold rounded-full py-4 px-8 flex items-center gap-3 transition-transform hover:scale-105 active:scale-95 shadow-xl"
            >
              Simplify Your Links <ArrowRight size={18} />
            </button>
            <span className="text-sm font-medium opacity-60">Start for Free! <br/> No Card Required</span>
          </div>

          {/* Floating Trust Badge */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="inline-block p-4 rounded-2xl glass-card relative"
          >
            <div className="flex -space-x-3 mb-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-[#1e293b] bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-[10px] font-bold text-white shadow-sm z-10 relative">
                  U{i}
                </div>
              ))}
            </div>
            <p className="text-sm font-bold mt-2">4.9/5 based on 10k+ reviews</p>
            <div className="flex gap-1 text-amber-400 mt-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Right Column: Functional Tool Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
          className="flex-1 w-full max-w-lg z-20 relative"
        >
          {/* Decorative floating elements */}
          <motion.div 
            animate={{ y: [-10, 10, -10], rotate: [0, 5, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-12 -left-12 p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-white/20 hidden md:block"
          >
            <ShieldCheck className="text-green-500" size={32} />
          </motion.div>

          <div className="glass-card rounded-[2rem] p-8 w-full relative overflow-hidden">
            {/* Subtle inner gradient glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-500/20 to-pink-500/20 blur-3xl rounded-full -z-10 transform translate-x-1/2 -translate-y-1/2" />
            
            <form onSubmit={handleShorten} className="space-y-4">
              <div className="relative">
                <input
                  id="urlInput"
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Paste Your Long Link"
                  className={`w-full bg-white/80 dark:bg-black/40 border-2 ${error ? 'border-red-500' : 'border-transparent focus:border-purple-500/50'} rounded-2xl py-4 pl-6 pr-14 text-lg focus:outline-none transition-all shadow-inner backdrop-blur-sm`}
                />
                <button 
                  type="submit"
                  disabled={loading}
                  className="absolute right-2 top-2 bottom-2 aspect-square bg-gradient-to-br from-amber-400 to-amber-600 text-white rounded-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-transform disabled:opacity-70 shadow-md"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <ArrowRight size={20} />
                  )}
                </button>
              </div>

              <AnimatePresence>
                {error && (
                  <motion.p 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-red-500 text-sm font-medium px-2"
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>
              
              <div className="relative">
                 <input
                  type="text"
                  value={alias}
                  onChange={(e) => setAlias(e.target.value.replace(/[^a-zA-Z0-9-_]/g, ''))}
                  placeholder="Custom alias (optional)"
                  className="w-full bg-white/50 dark:bg-black/20 border-2 border-transparent focus:border-purple-500/30 rounded-xl py-3 px-6 text-sm focus:outline-none transition-all placeholder:opacity-50"
                />
              </div>
            </form>

            <AnimatePresence>
              {currentResult && (
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="mt-6 p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-500/20 text-amber-500 flex items-center justify-center flex-shrink-0">
                      <Zap size={20} />
                    </div>
                    <div className="overflow-hidden flex-1">
                      <a href={currentResult.shortUrl} target="_blank" rel="noreferrer" className="text-xl font-bold text-gray-900 dark:text-white hover:text-purple-600 transition-colors truncate block">
                        {currentResult.shortUrl.replace(/^https?:\/\//, '')}
                      </a>
                      <p className="text-sm text-gray-500 truncate flex items-center gap-1 mt-1">
                        <ArrowRight size={12} /> {currentResult.originalUrl}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                    <button
                      onClick={() => copyToClipboard(currentResult.shortUrl, 'current')}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all border-2 ${
                        copiedId === 'current' 
                          ? 'border-green-500 text-green-500 bg-green-50 dark:bg-green-500/10' 
                          : 'border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500'
                      }`}
                    >
                      {copiedId === 'current' ? <><Check size={16}/> Copied</> : <><Copy size={16}/> Copy link</>}
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold border-2 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500 transition-colors">
                      <QrCode size={16} /> Generate QR
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Trusted By section */}
            <div className="mt-10 pt-6 border-t border-black/5 dark:border-white/5">
              <p className="text-xs font-semibold text-center text-gray-400 uppercase tracking-wider mb-4">
                Trusted by Leading Companies
              </p>
              <div className="flex justify-between items-center opacity-40 dark:opacity-60 grayscale">
                {/* Mock Logos */}
                <div className="font-bold text-lg tracking-tighter">Eventbrite</div>
                <div className="font-bold text-lg italic">Podium</div>
                <div className="font-bold text-lg uppercase tracking-widest">Zendesk</div>
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      {/* History Side Panel Overlay */}
      <AnimatePresence>
        {showHistory && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowHistory(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-slate-900 shadow-2xl z-50 flex flex-col border-l border-white/10"
            >
              <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <h2 className="text-xl font-bold flex items-center gap-2"><History size={20}/> Link History</h2>
                <button onClick={() => setShowHistory(false)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  ✕
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
                {links.length === 0 ? (
                  <div className="text-center py-12 opacity-50 flex flex-col items-center gap-3">
                    <Scissors size={32} />
                    <p>No links shortened yet.</p>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-end mb-2">
                      <button onClick={clearLinks} className="text-sm text-red-500 hover:text-red-600 font-semibold flex items-center gap-1">
                        <Trash2 size={14}/> Clear All
                      </button>
                    </div>
                    {links.map((link) => (
                      <div key={link.id} className="bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-gray-700 rounded-2xl p-4 group">
                        <a href={link.shortUrl} target="_blank" rel="noreferrer" className="text-base font-bold text-gray-900 dark:text-white hover:text-purple-600 transition-colors truncate block mb-1">
                          {link.shortUrl.replace(/^https?:\/\//, '')}
                        </a>
                        <p className="text-xs text-gray-500 truncate mb-3">{link.originalUrl}</p>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => copyToClipboard(link.shortUrl, link.id)}
                            className="flex-1 py-1.5 rounded-lg bg-white dark:bg-slate-700 border border-gray-200 dark:border-gray-600 text-sm font-semibold flex items-center justify-center gap-1 hover:border-purple-500 transition-colors"
                          >
                            {copiedId === link.id ? <Check size={14} className="text-green-500"/> : <Copy size={14} />} Copy
                          </button>
                          <button
                            onClick={() => removeLink(link.id)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
