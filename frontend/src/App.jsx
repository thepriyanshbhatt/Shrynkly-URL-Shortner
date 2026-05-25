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
        shortUrl: `${window.location.origin}/${data.shortCode}`,
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
    <div className="min-h-screen font-sans selection:bg-purple-500/30 transition-colors duration-500 bg-background-light text-slate-900 dark:bg-background-dark dark:text-white relative z-0">
      <div className="grid-overlay opacity-30 dark:opacity-10" />
      
      {/* Header */}
      <header className="fixed top-0 w-full z-50 px-4 py-4">
        <div className="max-w-7xl mx-auto px-6 py-3 rounded-full liquid-glass flex justify-between items-center hover-scale">
          <div className="flex items-center gap-2">
            <span className="font-bold text-xl tracking-tight flex items-center gap-2">
              <Link size={20} className="text-primary dark:text-white" />
              shrynkly.
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium opacity-80">
            <a href="#features" className="hover:opacity-100 transition-opacity">Features</a>
            <a href="#pricing" className="hover:opacity-100 transition-opacity">Pricing</a>
            <a href="#enterprise" className="hover:opacity-100 transition-opacity">Enterprise</a>
          </nav>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowHistory(!showHistory)}
              className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors hidden sm:block"
            >
              <History size={18} />
            </button>
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button className="bg-black text-white dark:bg-white dark:text-black font-semibold rounded-full py-2 px-5 text-sm transition-transform hover:scale-105 active:scale-95">
              Get Started
            </button>
          </div>
        </div>
      </header>

      <main className="pt-32 pb-20 px-4 max-w-5xl mx-auto flex flex-col items-center justify-center text-center min-h-[90vh]">
        
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col items-center z-10 w-full"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50 text-xs font-bold uppercase tracking-wider mb-8 hover-scale">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            Now with Dynamic QR Codes
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-black tracking-tighter mb-6 leading-[1.1]">
            Make your links <br/>
            <span className="text-gradient">shorter than ever.</span>
          </h1>
          
          <p className="text-lg md:text-xl opacity-70 mb-12 leading-relaxed max-w-2xl text-[var(--color-text-secondary-light)] dark:text-[var(--color-text-secondary-dark)]">
            The enterprise-grade URL shortener designed for modern marketing teams. 
            Track, optimize, and brand every click in real-time.
          </p>

          {/* Shortener Box */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
            className="w-full max-w-3xl z-20 relative"
          >
            <div className="liquid-glass rounded-[2rem] p-2 w-full relative overflow-hidden transition-all duration-300 hover:shadow-2xl">
              <form onSubmit={handleShorten} className="flex flex-col sm:flex-row gap-2">
                <input
                  id="urlInput"
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Paste your long URL here..."
                  className="flex-1 bg-transparent border-0 py-4 px-6 text-lg focus:outline-none placeholder:opacity-50"
                />
                <button 
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-[1.5rem] py-4 px-8 sm:px-10 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 flex items-center justify-center min-w-[140px]"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    "Shrynk It"
                  )}
                </button>
              </form>
            </div>

            <AnimatePresence>
              {error && (
                <motion.p 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-red-500 text-sm font-medium px-4 mt-3 text-left"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>
            
            <AnimatePresence>
              {currentResult && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="mt-4 p-4 liquid-glass-strong rounded-2xl text-left"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="overflow-hidden flex-1">
                      <a href={currentResult.shortUrl} target="_blank" rel="noreferrer" className="text-xl font-bold text-gray-900 dark:text-white hover:text-blue-500 transition-colors truncate block">
                        {currentResult.shortUrl.replace(/^https?:\/\//, '')}
                      </a>
                      <p className="text-xs text-gray-500 truncate mt-1">
                        {currentResult.originalUrl}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => copyToClipboard(currentResult.shortUrl, 'current')}
                        className={`flex items-center justify-center gap-2 p-3 rounded-xl transition-all ${
                          copiedId === 'current' 
                            ? 'bg-green-500/10 text-green-500' 
                            : 'bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20'
                        }`}
                        title="Copy"
                      >
                        {copiedId === 'current' ? <Check size={18}/> : <Copy size={18}/>}
                      </button>
                      <button className="flex items-center justify-center gap-2 p-3 rounded-xl bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 transition-all" title="QR Code">
                        <QrCode size={18} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex flex-wrap justify-center gap-6 sm:gap-12 mt-12 text-xs font-bold text-gray-500 uppercase tracking-widest opacity-80">
              <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div> 3.4M LINKS CREATED</span>
              <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-green-500"></div> 99.9% UPTIME</span>
              <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div> NO CREDIT CARD REQUIRED</span>
            </div>
          </motion.div>
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
