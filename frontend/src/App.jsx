import { useState, useEffect } from 'react';
import { Link, ArrowRight, Check, Copy, QrCode, Zap, History, Trash2, Scissors, Globe, Layers, Shield, Clock, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
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
  const [showQR, setShowQR] = useState(false);

  const handleShorten = async (e) => {
    e.preventDefault();
    setError('');
    setCurrentResult(null);
    setShowQR(false);

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
    <div className="min-h-screen font-sans selection:bg-black/10 dark:selection:bg-white/20 bg-white text-black dark:bg-[#0a0a0a] dark:text-white relative z-0 transition-colors duration-300">
      
      {/* Header */}
      <header className="sticky top-0 w-full z-50 px-4 py-4 border-b border-gray-200 dark:border-white/10 bg-white/70 dark:bg-[#0a0a0a]/70 backdrop-blur-md transition-colors duration-300">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="font-bold text-2xl tracking-tight flex items-center gap-2 text-black dark:text-white">
              <img src="/logo.png" alt="Shrynkly Logo" className="w-10 h-10 object-contain" />
              Shrynkly
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600 dark:text-gray-400">
            <a href="#tools" className="hover:text-black dark:hover:text-white transition-colors">All Tools</a>
            <a href="#why" className="hover:text-black dark:hover:text-white transition-colors">Why Shrynkly</a>
            <a href="#request" className="hover:text-black dark:hover:text-white transition-colors">Request Tool</a>
          </nav>
          <div className="flex items-center gap-2 sm:gap-4">
            <button 
              onClick={() => setShowHistory(!showHistory)}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors hidden sm:block text-gray-700 dark:text-gray-300"
            >
              <History size={18} />
            </button>
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-gray-700 dark:text-gray-300"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button className="bg-black text-white dark:bg-white dark:text-black rounded-full py-2 px-5 text-sm font-semibold flex items-center gap-2 hover:bg-gray-900 dark:hover:bg-gray-100 transition-colors">
              Sign In <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content with Grid Overlay */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative w-full pt-12 md:pt-20 pb-16 overflow-hidden min-h-[90vh] flex flex-col items-center"
      >
        <div className="grid-overlay" />
        
        {/* Hero Section */}
        <section className="w-full max-w-4xl mx-auto px-4 text-center z-10 flex flex-col items-center">
          
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-xs font-bold uppercase tracking-wide mb-8 text-gray-800 dark:text-gray-200">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            100% Free & Privacy First
          </div>

          <h1 className="text-[2.75rem] sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter mb-6 leading-[1.05] text-black dark:text-white max-w-5xl text-balance mx-auto">
            Long URLs were a mistake. <span className="whitespace-nowrap"><strong>Shrynkly</strong> fixes that.</span>
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            URLs got out of hand. Shrynkly puts them back in their place - shorter, smarter, and fully under your control. Your browser does the work. Your data stays yours.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 w-full">
            <button onClick={() => document.getElementById('urlInput').focus()} className="btn-black w-full sm:w-auto">
              Get Started <ArrowRight size={16} />
            </button>
            <a href="#tools" className="btn-white w-full sm:w-auto">
              Explore Tools
            </a>
          </div>

          {/* Shortener Box - Oval Shape */}
          <div className="w-full max-w-2xl bg-white dark:bg-[#111111] border border-gray-200 dark:border-white/10 rounded-full p-2 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none relative z-20 transition-all duration-500 hover:shadow-xl hover:border-gray-400 dark:hover:border-white/30 focus-within:ring-4 focus-within:ring-black/5 dark:focus-within:ring-white/10 focus-within:border-black dark:focus-within:border-white">
            <form onSubmit={handleShorten} className="flex flex-col sm:flex-row gap-2">
              <input
                id="urlInput"
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Paste your long URL here..."
                className="flex-1 bg-transparent border-0 py-4 px-6 text-lg focus:outline-none placeholder:text-gray-400 dark:placeholder:text-gray-600 font-medium text-black dark:text-white rounded-full"
              />
              <button 
                type="submit"
                disabled={loading}
                className="btn-black flex items-center justify-center min-w-[140px]"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white dark:border-black/30 dark:border-t-black rounded-full animate-spin" />
                ) : (
                  "Shrynkly It"
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
                className="text-red-500 text-sm font-medium px-4 mt-4"
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
                className="w-full max-w-2xl mt-6 p-6 bg-white dark:bg-[#111111] border border-gray-200 dark:border-white/10 rounded-[2rem] text-left shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none z-20 relative"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="overflow-hidden flex-1 w-full">
                    <a href={currentResult.shortUrl} target="_blank" rel="noreferrer" className="text-2xl font-bold text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors truncate block">
                      {currentResult.shortUrl.replace(/^https?:\/\//, '')}
                    </a>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate mt-1">
                      {currentResult.originalUrl}
                    </p>
                    <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300 text-xs font-semibold">
                      <Clock size={12} />
                      <span>Expires in 7 days ({new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })})</span>
                    </div>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => copyToClipboard(currentResult.shortUrl, 'current')}
                      className={`flex-1 sm:flex-none flex items-center justify-center gap-2 p-4 rounded-xl transition-all border ${
                        copiedId === 'current' 
                          ? 'bg-green-50 dark:bg-green-500/10 border-green-200 dark:border-green-500/20 text-green-600 dark:text-green-400' 
                          : 'bg-white dark:bg-[#1a1a1a] border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 text-black dark:text-white'
                      }`}
                    >
                      {copiedId === 'current' ? <Check size={18}/> : <Copy size={18}/>}
                    </button>
                    <button 
                      onClick={() => setShowQR(!showQR)}
                      className={`flex-1 sm:flex-none flex items-center justify-center gap-2 p-4 rounded-xl transition-all border ${
                        showQR ? 'bg-gray-100 dark:bg-white/20 border-gray-300 dark:border-white/30 text-black dark:text-white' : 'bg-white dark:bg-[#1a1a1a] border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 text-gray-600 dark:text-gray-300'
                      }`} 
                    >
                      <QrCode size={18} />
                    </button>
                  </div>
                </div>
                
                {/* QR Code Expansion */}
                <AnimatePresence>
                  {showQR && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden flex justify-center border-t border-gray-100 dark:border-white/10 mt-6 pt-6"
                    >
                      <div className="p-4 border border-gray-200 dark:border-white/10 rounded-2xl bg-white dark:bg-white shadow-sm">
                        <QRCodeSVG value={currentResult.shortUrl} size={160} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </motion.div>

      {/* Stats Banner */}
      <motion.section 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="w-full border-y border-gray-100 dark:border-white/5 py-16 bg-white dark:bg-[#0a0a0a] relative z-10 transition-colors duration-300"
      >
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0 text-center divide-x-0 md:divide-x divide-gray-100 dark:divide-white/5">
          <div className="flex flex-col items-center px-4">
            <h3 className="text-2xl md:text-3xl font-black tracking-tight mb-2 text-black dark:text-white">Private</h3>
            <p className="text-[10px] sm:text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest leading-relaxed">Never leaves your device</p>
          </div>
          <div className="flex flex-col items-center px-4">
            <h3 className="text-2xl md:text-3xl font-black tracking-tight mb-2 text-black dark:text-white">Quick, safe.</h3>
            <p className="text-[10px] sm:text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest leading-relaxed">built for speed and security</p>
          </div>
          <div className="flex flex-col items-center px-4">
            <h3 className="text-2xl md:text-3xl font-black tracking-tight mb-2 text-black dark:text-white">None</h3>
            <p className="text-[10px] sm:text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest leading-relaxed">Data stored</p>
          </div>
          <div className="flex flex-col items-center px-4">
            <h3 className="text-2xl md:text-3xl font-black tracking-tight mb-2 text-black dark:text-white">Start free</h3>
            <p className="text-[10px] sm:text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest leading-relaxed">Upgrade when you are ready</p>
          </div>
        </div>
      </motion.section>

      {/* Tools Grid */}
      <motion.section 
        id="tools" 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="w-full bg-[#fcfcfc] dark:bg-[#0f0f0f] py-32 px-4 relative z-10 border-b border-gray-100 dark:border-white/5 transition-colors duration-300"
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16 flex flex-col items-center">
            <div className="bg-gray-200 dark:bg-white/10 text-gray-700 dark:text-gray-300 text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
              All-In-One Solution
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4 text-black dark:text-white">Powerful <span className="text-gray-400 dark:text-gray-600">Link Tools</span></h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto italic">Everything you need to work with your links, completely free and 100% private.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: <Globe size={20} />, title: 'Branded Domains', desc: 'Connect your own domain to build trust.' },
              { icon: <QrCode size={20} />, title: 'Dynamic QR', desc: 'Create editable QR codes instantly.' },
              { icon: <History size={20} />, title: 'Deep Analytics', desc: 'Track clicks, locations, and referrers.' },
              { icon: <Scissors size={20} />, title: 'A/B Testing', desc: 'Split traffic between multiple links.' },
              { icon: <Layers size={20} />, title: 'Link-in-Bio', desc: 'Create a beautiful landing page.' },
              { icon: <Link size={20} />, title: 'Bulk Shorten', desc: 'Shorten thousands of links at once.' },
            ].map((tool, i) => (
              <div key={i} className="bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-[1.5rem] p-8 hover:border-gray-400 dark:hover:border-white/30 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl dark:hover:shadow-[0_20px_50px_rgba(255,255,255,0.05)] group cursor-pointer shadow-sm dark:shadow-none">
                <div className="w-12 h-12 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 rounded-xl flex items-center justify-center text-black dark:text-white mb-6 group-hover:scale-110 transition-transform duration-300">
                  {tool.icon}
                </div>
                <h3 className="text-xl font-bold mb-2 tracking-tight text-black dark:text-white">{tool.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 leading-relaxed">{tool.desc}</p>
                <div className="flex items-center gap-1 text-[10px] font-bold text-gray-500 dark:text-gray-500 uppercase tracking-widest group-hover:text-black dark:group-hover:text-white transition-colors">
                  Open Tool <ArrowRight size={12} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Why Shrynkly (Black Section) */}
      <motion.section 
        id="why" 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="w-full bg-black dark:bg-[#050505] text-white py-32 px-4 relative z-10 border-b border-transparent dark:border-white/5 transition-colors duration-300"
      >
        <div className="max-w-6xl mx-auto flex flex-col items-center">
          <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4 text-center">Why Shrynkly?</h2>
          <p className="text-gray-400 text-lg mb-16 text-center">Built for speed, privacy, and simplicity.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-16">
            <div className="bg-[#111111] dark:bg-[#0a0a0a] border border-white/5 dark:border-white/10 rounded-[2rem] p-8 hover:bg-[#151515] dark:hover:bg-[#111] transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl group">
              <div className="w-12 h-12 bg-white dark:bg-white/10 text-black dark:text-white rounded-xl flex items-center justify-center mb-6 border border-transparent dark:border-white/20 group-hover:scale-110 transition-transform duration-300">
                <Zap size={20} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Lightning Fast</h3>
              <p className="text-gray-400 text-sm leading-relaxed">Process links in milliseconds with our heavily optimized edge engine.</p>
            </div>
            
            <div className="bg-[#111111] dark:bg-[#0a0a0a] border border-white/5 dark:border-white/10 rounded-[2rem] p-8 hover:bg-[#151515] dark:hover:bg-[#111] transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl group">
              <div className="w-12 h-12 bg-white dark:bg-white/10 text-black dark:text-white rounded-xl flex items-center justify-center mb-6 border border-transparent dark:border-white/20 group-hover:scale-110 transition-transform duration-300">
                <Shield size={20} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">100% Secure</h3>
              <p className="text-gray-400 text-sm leading-relaxed">Your data never leaves your device. Links are processed locally.</p>
            </div>
            
            <div className="bg-[#111111] dark:bg-[#0a0a0a] border border-white/5 dark:border-white/10 rounded-[2rem] p-8 hover:bg-[#151515] dark:hover:bg-[#111] transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl group">
              <div className="w-12 h-12 bg-white dark:bg-white/10 text-black dark:text-white rounded-xl flex items-center justify-center mb-6 border border-transparent dark:border-white/20 group-hover:scale-110 transition-transform duration-300">
                <Globe size={20} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Works Anywhere</h3>
              <p className="text-gray-400 text-sm leading-relaxed">Use on any device, any browser, completely responsive.</p>
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 text-xs font-medium">
            <span className="px-4 py-2 rounded-full border border-white/10 flex items-center gap-2"><Check size={14} className="text-green-500"/> No signup required</span>
            <span className="px-4 py-2 rounded-full border border-white/10 flex items-center gap-2"><Check size={14} className="text-green-500"/> Works offline</span>
            <span className="px-4 py-2 rounded-full border border-white/10 flex items-center gap-2"><Check size={14} className="text-green-500"/> No limits</span>
            <span className="px-4 py-2 rounded-full border border-white/10 flex items-center gap-2"><Check size={14} className="text-green-500"/> Forever free</span>
          </div>
        </div>
      </motion.section>

      {/* CTA / Request Tool */}
      <motion.section 
        id="request" 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="w-full bg-white dark:bg-[#0a0a0a] py-32 px-4 relative z-10 border-b border-gray-100 dark:border-white/5 overflow-hidden transition-colors duration-300"
      >
        <div className="grid-overlay opacity-50 dark:opacity-20" />
        <div className="max-w-3xl mx-auto bg-white/50 dark:bg-[#111]/80 backdrop-blur-3xl border border-gray-100 dark:border-white/10 rounded-[3rem] p-12 md:p-20 text-center relative z-20 shadow-2xl dark:shadow-none">
          <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4 text-black dark:text-white">Need a specific tool?</h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg mb-8 max-w-lg mx-auto">
            If there's a feature you need that's missing, I'd love to build it for you. Request new tools at <span className="text-black dark:text-white font-bold">hello@shrynkly.com</span>
          </p>
          <button className="btn-black mx-auto">
            Request a Tool <ArrowRight size={16} />
          </button>
        </div>
      </motion.section>

      <div className="w-full bg-white dark:bg-[#0a0a0a] py-8 text-center border-b border-gray-100 dark:border-white/5 flex flex-col md:flex-row items-center justify-center gap-4 transition-colors duration-300">
        <div className="flex gap-1 text-black dark:text-white text-xl">
          ★★★★★
        </div>
        <span className="text-gray-600 dark:text-gray-400 text-sm font-medium">Loved by <strong className="text-black dark:text-white">10,000+</strong> users worldwide</span>
      </div>

      {/* Footer */}
      <footer className="w-full bg-black dark:bg-[#050505] text-white pt-24 pb-8 px-6 relative z-10 transition-colors duration-300">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1">
            <span className="font-bold text-2xl tracking-tight flex items-center gap-2 mb-4">
              <Link size={24} />
              Shrynkly
            </span>
            <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
              Free online link tools for everyone. Process links securely in your browser — your data never leaves your device.
            </p>
          </div>
          
          <div>
            <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-6">Product</h4>
            <ul className="space-y-4 text-sm text-gray-300">
              <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-white transition-colors">How It Works</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-6">Legal</h4>
            <ul className="space-y-4 text-sm text-gray-300">
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Disclaimer</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-6">Company</h4>
            <ul className="space-y-4 text-sm text-gray-300">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
              <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <div>© 2026 Shrynkly. All rights reserved.</div>
          <div className="flex items-center gap-2 text-gray-400">Built with ❤️ by <strong className="text-white">You</strong></div>
          <div className="px-3 py-1.5 rounded-full bg-[#111] dark:bg-white/5 border border-white/5 dark:border-white/10 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Processing 100% locally
          </div>
        </div>
      </footer>

      {/* History Side Panel Overlay */}
      <AnimatePresence>
        {showHistory && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowHistory(false)}
              className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-[#111] shadow-2xl z-50 flex flex-col border-l border-gray-100 dark:border-white/10"
            >
              <div className="p-6 border-b border-gray-100 dark:border-white/10 flex items-center justify-between">
                <h2 className="text-xl font-bold flex items-center gap-2 text-black dark:text-white"><History size={20}/> Link History</h2>
                <button onClick={() => setShowHistory(false)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-gray-500 dark:text-gray-400">
                  ✕
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
                {links.length === 0 ? (
                  <div className="text-center py-12 flex flex-col items-center gap-3 text-gray-400 dark:text-gray-600">
                    <Scissors size={32} />
                    <p>No links shortened yet.</p>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-end mb-2">
                      <button onClick={clearLinks} className="text-sm text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 font-semibold flex items-center gap-1">
                        <Trash2 size={14}/> Clear All
                      </button>
                    </div>
                    {links.map((link) => (
                      <div key={link.id} className="bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 rounded-2xl p-4 group">
                        <a href={link.shortUrl} target="_blank" rel="noreferrer" className="text-base font-bold text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors truncate block mb-1">
                          {link.shortUrl.replace(/^https?:\/\//, '')}
                        </a>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate mb-3">{link.originalUrl}</p>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => copyToClipboard(link.shortUrl, link.id)}
                            className="flex-1 py-1.5 rounded-lg bg-white dark:bg-[#222] border border-gray-200 dark:border-white/10 text-sm font-semibold flex items-center justify-center gap-1 hover:border-black dark:hover:border-white transition-colors text-black dark:text-white"
                          >
                            {copiedId === link.id ? <Check size={14} className="text-green-500"/> : <Copy size={14} />} Copy
                          </button>
                          <button
                            onClick={() => removeLink(link.id)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:text-red-400 dark:hover:bg-red-500/10 transition-colors"
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
