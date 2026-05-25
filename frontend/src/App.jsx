import { useState, useEffect } from 'react';
import { Moon, Sun, Link, ArrowRight, Check, Copy, QrCode, ShieldCheck, Zap, History, Trash2, Scissors, BarChart3, Globe, Code, Layers, Shield } from 'lucide-react';
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
    <div className="min-h-screen font-sans selection:bg-purple-500/30 transition-colors duration-500 bg-[#f8fafc] text-slate-900 dark:bg-[#070b14] dark:text-white relative z-0">
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
            className="w-full max-w-2xl z-20 relative"
          >
            <div className="liquid-glass rounded-full p-2 w-full relative overflow-hidden transition-all duration-300 hover:shadow-2xl">
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
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full py-4 px-8 sm:px-10 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 flex items-center justify-center min-w-[140px]"
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
                      <button 
                        onClick={() => setShowQR(!showQR)}
                        className={`flex items-center justify-center gap-2 p-3 rounded-xl transition-all ${
                          showQR ? 'bg-blue-500/10 text-blue-500' : 'bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20'
                        }`} 
                        title="Toggle QR Code"
                      >
                        <QrCode size={18} />
                      </button>
                    </div>
                  </div>
                  
                  {/* QR Code Expansion */}
                  <AnimatePresence>
                    {showQR && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        className="overflow-hidden flex justify-center border-t border-black/5 dark:border-white/5"
                      >
                        <div className="p-4 bg-white rounded-xl shadow-inner mt-4">
                          <QRCodeSVG value={currentResult.shortUrl} size={150} />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
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

      {/* Features Section */}
      <section id="features" className="py-24 px-4 w-full max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">Everything you need to <span className="text-gradient">succeed.</span></h2>
          <p className="text-lg opacity-70 max-w-2xl mx-auto">Powerful features to help you track, brand, and optimize every single click.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="liquid-glass rounded-[2rem] p-8 hover-scale">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center mb-6">
              <BarChart3 size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3">Deep Analytics</h3>
            <p className="opacity-70 text-sm leading-relaxed">Get granular data on who clicks your links, where they come from, and which devices they use.</p>
            <div className="mt-8 h-32 w-full rounded-xl bg-gradient-to-t from-purple-500/20 to-transparent border-b-2 border-purple-500/50 relative overflow-hidden flex items-end justify-between px-4 pb-2">
               <div className="w-4 h-12 bg-purple-500/80 rounded-t-sm"></div>
               <div className="w-4 h-24 bg-blue-500/80 rounded-t-sm"></div>
               <div className="w-4 h-16 bg-cyan-500/80 rounded-t-sm"></div>
               <div className="w-4 h-20 bg-purple-400/80 rounded-t-sm"></div>
               <div className="w-4 h-28 bg-blue-400/80 rounded-t-sm"></div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="liquid-glass rounded-[2rem] p-8 hover-scale">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-6">
              <Globe size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3">Branded Domains</h3>
            <p className="opacity-70 text-sm leading-relaxed">Replace shrynk.ly with your own domain to build trust and increase your click-through rate by up to 34%.</p>
            <div className="mt-8 py-3 px-4 rounded-xl bg-black/10 dark:bg-black/40 border border-white/5 font-mono text-xs text-blue-400 text-center">
               go.yourbrand.com/summer-sale
            </div>
          </div>

          {/* Card 3 */}
          <div className="liquid-glass rounded-[2rem] p-8 hover-scale">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center mb-6">
              <QrCode size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3">Dynamic QR Codes</h3>
            <p className="opacity-70 text-sm leading-relaxed">Generate beautiful, customizable QR codes for every link that you can update even after printing.</p>
            <div className="mt-8 flex justify-center opacity-80">
               <QrCode size={80} strokeWidth={1} />
            </div>
          </div>

          {/* Card 4 */}
          <div className="liquid-glass rounded-[2rem] p-8 hover-scale">
            <div className="w-12 h-12 rounded-xl bg-pink-500/10 text-pink-500 flex items-center justify-center mb-6">
              <Code size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3">Developer API</h3>
            <p className="opacity-70 text-sm leading-relaxed">Shorten links programmatically with a clean REST API, webhooks, and SDKs for every major language.</p>
          </div>

          {/* Card 5 */}
          <div className="liquid-glass rounded-[2rem] p-8 hover-scale">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center mb-6">
              <Layers size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3">Link-in-Bio</h3>
            <p className="opacity-70 text-sm leading-relaxed">Spin up a polished landing page in seconds. One link to host every link your audience needs.</p>
          </div>

          {/* Card 6 */}
          <div className="liquid-glass rounded-[2rem] p-8 hover-scale">
            <div className="w-12 h-12 rounded-xl bg-green-500/10 text-green-500 flex items-center justify-center mb-6">
              <Shield size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3">Enterprise Security</h3>
            <p className="opacity-70 text-sm leading-relaxed">SOC 2 compliant, SSO, audit logs, and link-level password protection — built for serious teams.</p>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-24 px-4 w-full max-w-5xl mx-auto relative z-10 border-t border-black/5 dark:border-white/5">
        <div className="text-center mb-16">
          <p className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-3">How it works</p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Three steps. Zero friction.</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {/* Connector Line */}
          <div className="hidden md:block absolute top-[60px] left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-transparent via-purple-500/30 to-transparent -z-10"></div>
          
          <div className="liquid-glass rounded-[2rem] p-8 relative hover-scale text-center md:text-left">
             <div className="text-4xl font-black text-purple-500 mb-6 font-mono opacity-80">01</div>
             <h3 className="text-2xl font-bold mb-3">Paste</h3>
             <p className="opacity-70 text-sm">Drop in any URL — long, ugly, or full of UTM params. We don't judge.</p>
          </div>
          
          <div className="liquid-glass rounded-[2rem] p-8 relative hover-scale text-center md:text-left">
             <div className="text-4xl font-black text-blue-500 mb-6 font-mono opacity-80">02</div>
             <h3 className="text-2xl font-bold mb-3">Shrynk</h3>
             <p className="opacity-70 text-sm">Get a clean, branded link in milliseconds, ready to share anywhere.</p>
          </div>

          <div className="liquid-glass rounded-[2rem] p-8 relative hover-scale text-center md:text-left">
             <div className="text-4xl font-black text-cyan-500 mb-6 font-mono opacity-80">03</div>
             <h3 className="text-2xl font-bold mb-3">Track</h3>
             <p className="opacity-70 text-sm">Watch clicks roll in across geos, devices, and referrers in real-time.</p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-4 w-full max-w-7xl mx-auto relative z-10 border-t border-black/5 dark:border-white/5">
        <div className="text-center mb-16">
          <p className="text-xs font-bold text-purple-500 uppercase tracking-widest mb-3">Pricing</p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Pick a plan that scales with you</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto items-center">
          {/* Free Tier */}
          <div className="liquid-glass rounded-[2rem] p-8 hover-scale flex flex-col h-[28rem]">
            <h3 className="text-lg font-bold text-gray-500 uppercase tracking-widest mb-4">Free</h3>
            <div className="flex items-end gap-1 mb-8">
              <span className="text-5xl font-black">$0</span>
              <span className="text-sm font-medium opacity-60 mb-2">Forever</span>
            </div>
            <ul className="space-y-4 mb-auto opacity-80 text-sm">
              <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div> 50 links / mo</li>
              <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div> Links expire in 7 days</li>
              <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div> Basic analytics</li>
              <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div> Standard QR codes</li>
              <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div> Community support</li>
            </ul>
            <button className="w-full py-4 mt-8 rounded-xl bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 font-bold transition-colors">Start Free</button>
          </div>

          {/* Pro Tier (Highlighted) */}
          <div className="liquid-glass-strong rounded-[2.5rem] p-8 hover-scale relative border-purple-500/50 dark:border-purple-500/30 shadow-purple-500/20 flex flex-col h-[32rem] transform md:-translate-y-4">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold uppercase tracking-widest py-1 px-4 rounded-full">Most Popular</div>
            <h3 className="text-lg font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-4 mt-2">Pro</h3>
            <div className="flex items-end gap-1 mb-8">
              <span className="text-6xl font-black">$14</span>
              <span className="text-sm font-medium opacity-60 mb-2">per month</span>
            </div>
            <ul className="space-y-4 mb-auto text-sm">
              <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]"></div> 1,000 links / mo</li>
              <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]"></div> 1 month link expiration</li>
              <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]"></div> Advanced analytics</li>
              <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]"></div> 2 Custom branded domains</li>
              <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]"></div> Dynamic QR codes</li>
              <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]"></div> Priority support</li>
            </ul>
            <button className="w-full py-4 mt-8 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-colors shadow-lg">Go Pro</button>
          </div>

          {/* Enterprise Tier */}
          <div className="liquid-glass rounded-[2rem] p-8 hover-scale flex flex-col h-[28rem]">
            <h3 className="text-lg font-bold text-gray-500 uppercase tracking-widest mb-4">Enterprise</h3>
            <div className="flex items-end gap-1 mb-8">
              <span className="text-5xl font-black">Custom</span>
            </div>
            <ul className="space-y-4 mb-auto opacity-80 text-sm">
              <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div> Unlimited links</li>
              <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div> Custom link duration</li>
              <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div> SSO & SAML</li>
              <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div> Audit logs</li>
              <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div> 99.99% SLA</li>
              <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div> Dedicated success manager</li>
            </ul>
            <button className="w-full py-4 mt-8 rounded-xl bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 font-bold transition-colors">Contact Sales</button>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-24 px-4 w-full max-w-6xl mx-auto relative z-10">
        <div className="rounded-[3rem] bg-gradient-to-br from-blue-500 to-purple-600 text-white p-12 md:p-20 text-center shadow-2xl relative overflow-hidden">
          {/* Abstract background shapes */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6 relative z-10 tracking-tight">Ready to shorten your first link?</h2>
          <p className="text-lg opacity-80 mb-10 max-w-xl mx-auto relative z-10">Join thousands of creators and businesses who use Shrynkly to power their digital growth.</p>
          <button className="bg-black hover:bg-gray-900 text-white font-bold rounded-full py-4 px-10 transition-transform hover:scale-105 active:scale-95 shadow-xl relative z-10">
            Create Free Account
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t border-black/5 dark:border-white/5 py-12 px-6 mt-12 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <span className="font-bold text-2xl tracking-tight flex items-center gap-2">
            <Link size={24} className="text-primary dark:text-white" />
            shrynkly.
          </span>
          <div className="flex flex-wrap justify-center gap-8 text-sm font-medium opacity-60">
            <a href="#" className="hover:opacity-100 transition-opacity">Privacy</a>
            <a href="#" className="hover:opacity-100 transition-opacity">Terms</a>
            <a href="#" className="hover:opacity-100 transition-opacity">API Docs</a>
            <a href="#" className="hover:opacity-100 transition-opacity">Contact</a>
          </div>
          <p className="text-sm opacity-40">© 2026 SHRYNKLY SYSTEMS INC.</p>
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
