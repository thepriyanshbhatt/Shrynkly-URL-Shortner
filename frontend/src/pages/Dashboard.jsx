import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { QRCodeSVG } from 'qrcode.react';
import { 
  Link as LinkIcon, 
  BarChart3, 
  Settings,
  Lock,
  ArrowUpRight,
  Copy,
  QrCode,
  Edit2,
  Trash2,
  AlertCircle,
  Activity,
  Clock,
  LogOut,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Dashboard() {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  
  // Dev Tool: Toggle Plan
  const [isPro, setIsPro] = useState(false);

  // Link Data State
  const [links, setLinks] = useState([]);
  const [loadingLinks, setLoadingLinks] = useState(true);

  // Shortening State
  const [url, setUrl] = useState('');
  const [isShortening, setIsShortening] = useState(false);

  // QR Modal State
  const [activeQR, setActiveQR] = useState(null);

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/');
    }
  }, [user, authLoading, navigate]);

  // Fetch Links from Worker API
  useEffect(() => {
    if (!user) return;
    
    const fetchLinks = async () => {
      try {
        const { session } = await import('../utils/supabase').then(m => m.supabase.auth.getSession()).then(res => res.data);
        const headers = { 'Content-Type': 'application/json' };
        if (session?.access_token) {
          headers['Authorization'] = `Bearer ${session.access_token}`;
        }
        
        const apiUrl = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api/links` : '/api/links';
        const res = await fetch(apiUrl, { headers });
        if (res.ok) {
          const data = await res.json();
          // Sort newest first
          setLinks(data.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)));
        } else {
          console.error('Failed to fetch links');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingLinks(false);
      }
    };
    fetchLinks();
  }, [user]);

  const handleShorten = async (e) => {
    e.preventDefault();
    if (!url.trim()) return;
    
    setIsShortening(true);
    try {
      const { session } = await import('../utils/supabase').then(m => m.supabase.auth.getSession()).then(res => res.data);
      const headers = { 'Content-Type': 'application/json' };
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      }
      
      const apiUrl = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api/shorten` : '/api/shorten';
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({ url: url.trim() })
      });
      
      if (res.ok) {
        const data = await res.json();
        const newLink = {
          shortCode: data.shortCode,
          targetUrl: data.targetUrl || url.trim(),
          clicks: 0,
          createdAt: new Date().toISOString()
        };
        setLinks(prev => [newLink, ...prev]);
        setUrl('');
      } else {
        alert('Failed to shorten URL');
      }
    } catch (err) {
      console.error(err);
      alert('Network error');
    } finally {
      setIsShortening(false);
    }
  };

  const copyToClipboard = (shortCode) => {
    navigator.clipboard.writeText(`${window.location.origin}/${shortCode}`);
    // Optional: add toast notification here
  };

  if (authLoading || !user) {
    return <div className="min-h-screen flex items-center justify-center bg-[#050505]"><div className="w-8 h-8 border-4 border-[#333] border-t-white rounded-full animate-spin" /></div>;
  }

  // Plan Limits
  const linkLimit = isPro ? 1000 : 50;
  const linksUsed = links.length;
  const progressPercent = Math.min((linksUsed / linkLimit) * 100, 100);
  const totalClicks = links.reduce((sum, link) => sum + (link.clicks || 0), 0);
  const firstName = user.user_metadata?.full_name?.split(' ')[0] || 'Creator';

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-white/30">
      
      {/* Top Navbar Removed */}

      {/* Main Bento Grid */}
      <main className="max-w-7xl mx-auto p-4 md:p-6 pb-20 space-y-6">
        
        {/* TOP ROW: Command Center */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#111111] border border-white/10 rounded-[2rem] p-8 md:p-12 relative overflow-hidden"
        >
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="relative z-10 max-w-3xl space-y-6">
            <div className="flex items-center gap-3 text-lg font-medium text-gray-400">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
              Welcome back, {firstName}
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Shrynk a new <span className="text-blue-500">URL</span>
            </h1>
            <p className="text-gray-400 text-sm md:text-base">
              Paste any long link below. {isPro ? 'Pro plan links never expire' : 'Free plan links expire in 7 days'} and include click tracking + a static QR code.
            </p>

            <form onSubmit={handleShorten} className="mt-8 flex items-center bg-[#1a1a1a] border border-white/10 rounded-full p-2 focus-within:border-white/30 focus-within:ring-4 focus-within:ring-white/5 transition-all">
              <div className="pl-4 pr-2 text-gray-500">
                <LinkIcon size={18} />
              </div>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/your-very-long-url-here"
                className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-gray-600 text-sm md:text-base"
              />
              <button 
                type="submit"
                disabled={isShortening}
                className="bg-white text-black px-6 py-2.5 rounded-full font-semibold text-sm hover:scale-105 transition-transform disabled:opacity-70 disabled:hover:scale-100 flex items-center gap-2"
              >
                {isShortening ? 'Shrynking...' : (
                  <>Shrynk it <ArrowUpRight size={16} /></>
                )}
              </button>
            </form>
          </div>
        </motion.div>

        {/* MIDDLE ROW: Stats & Plan */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* 3 Quick Stats (Span 3) */}
          <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-[#111111] border border-white/10 rounded-3xl p-6 flex flex-col justify-between hover:border-white/20 transition-colors cursor-default group">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-xs font-semibold text-gray-500 tracking-wider uppercase">Total Clicks</h3>
                <BarChart3 size={16} className="text-gray-600 group-hover:text-blue-400 transition-colors" />
              </div>
              <div>
                <p className="text-4xl font-bold">{totalClicks}</p>
                <p className="text-xs text-gray-500 mt-2">Across all active links</p>
              </div>
            </motion.div>
            
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-[#111111] border border-white/10 rounded-3xl p-6 flex flex-col justify-between hover:border-white/20 transition-colors cursor-default group">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-xs font-semibold text-gray-500 tracking-wider uppercase">Active Links</h3>
                <Activity size={16} className="text-gray-600 group-hover:text-green-400 transition-colors" />
              </div>
              <div>
                <p className="text-4xl font-bold">{linksUsed}</p>
                <p className="text-xs text-gray-500 mt-2">Shortened via Shrynkly</p>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-[#111111] border border-white/10 rounded-3xl p-6 flex flex-col justify-between hover:border-white/20 transition-colors cursor-default group">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-xs font-semibold text-gray-500 tracking-wider uppercase">Avg. Lifetime</h3>
                <Clock size={16} className="text-gray-600 group-hover:text-purple-400 transition-colors" />
              </div>
              <div>
                <p className="text-4xl font-bold">{isPro ? '∞' : '7d'}</p>
                <p className="text-xs text-gray-500 mt-2">Before expiration</p>
              </div>
            </motion.div>
          </div>

          {/* Plan Usage Card (Span 1) */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="lg:col-span-1 bg-[#111111] border border-white/10 rounded-3xl p-6 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xs font-semibold text-gray-500 tracking-wider uppercase mb-1">{isPro ? 'Pro Plan' : 'Free Plan'}</h3>
                <p className="text-sm font-medium text-white">Monthly usage</p>
              </div>
              <button onClick={() => navigate('/pricing')} className="text-xs flex items-center gap-1 text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 px-2 py-1 rounded-md transition-colors">
                <ArrowUpRight size={12} /> Upgrade
              </button>
            </div>
            
            <div>
              <div className="flex items-baseline gap-1 mb-3">
                <span className="text-4xl font-bold">{linksUsed}</span>
                <span className="text-gray-500 text-sm">/ {linkLimit} links</span>
              </div>
              <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${progressPercent > 90 ? 'bg-red-500' : 'bg-blue-500'}`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="text-[10px] text-gray-500 mt-3">
                Resets on the 1st of every month.
              </p>
            </div>
          </motion.div>

        </div>

        {/* BOTTOM ROW: Recent Links & Plan Details */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Recent Links List (Span 3) */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="lg:col-span-3 bg-[#111111] border border-white/10 rounded-3xl p-6 flex flex-col min-h-[400px]">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-medium text-white text-lg">Recent links</h3>
                <p className="text-xs text-gray-500 mt-1">Links can't be edited after creation. Re-shrynk if needed.</p>
              </div>
              <span className="text-xs text-blue-400 cursor-pointer hover:underline">View all</span>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-2">
              {loadingLinks ? (
                <div className="h-full flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                </div>
              ) : links.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-500">
                  <LinkIcon size={32} className="mb-4 opacity-50" />
                  <p className="text-sm">No links found. Shrynk one above!</p>
                </div>
              ) : (
                links.map((link, i) => (
                  <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-white/5 border border-transparent hover:border-white/10 hover:bg-white/10 transition-all gap-4">
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <a href={`${window.location.origin}/${link.shortCode}`} target="_blank" rel="noreferrer" className="font-semibold text-white hover:text-blue-400 transition-colors">
                          shr.ly/{link.shortCode}
                        </a>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-gray-400">
                          {isPro ? 'Never expires' : 'Expires in 7d'}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 truncate" title={link.targetUrl}>{link.targetUrl}</p>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6 sm:w-[280px]">
                      <div className="flex items-center gap-1.5 text-gray-400 w-24">
                        <Activity size={14} />
                        <span className="text-sm font-medium">{link.clicks || 0}</span>
                      </div>
                      <div className="text-xs text-gray-500 w-16 text-right">
                        {new Date(link.createdAt).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <button onClick={() => copyToClipboard(link.shortCode)} className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors" title="Copy">
                          <Copy size={16} />
                        </button>
                        <button onClick={() => setActiveQR(link.shortCode)} className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors" title="Show QR">
                          <QrCode size={16} />
                        </button>
                        <a href={`${window.location.origin}/${link.shortCode}`} target="_blank" rel="noreferrer" className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors" title="Open">
                          <ArrowUpRight size={16} />
                        </a>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>

          {/* Plan Details Card (Span 1) */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="lg:col-span-1 bg-[#111111] border border-white/10 rounded-3xl p-6 flex flex-col">
            <h3 className="text-xs font-semibold text-gray-500 tracking-wider uppercase mb-1">Your Plan</h3>
            <p className="text-2xl font-medium text-white mb-6">{isPro ? 'Pro' : 'Free'} <span className="text-sm text-gray-500 font-normal">{isPro ? '/ month' : 'forever'}</span></p>
            
            <ul className="space-y-3 flex-1 mb-8">
              <li className="flex items-center gap-2 text-sm text-gray-300">
                <span className="text-green-500">✓</span> {isPro ? '1,000' : '50'} links per month
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-300">
                <span className="text-green-500">✓</span> Links {isPro ? 'never expire' : 'expire in 7 days'}
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-300">
                <span className="text-green-500">✓</span> {isPro ? 'Deep analytics' : 'Basic click tracking'}
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-300">
                <span className="text-green-500">✓</span> Static QR codes
              </li>
              {!isPro && (
                <>
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="text-gray-700">✕</span> Custom domains
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="text-gray-700">✕</span> API Access
                  </li>
                </>
              )}
            </ul>

            {!isPro && (
              <button onClick={() => navigate('/pricing')} className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-medium transition-colors shadow-[0_0_20px_rgba(37,99,235,0.2)]">
                Upgrade to Pro
              </button>
            )}
          </motion.div>

        </div>
      </main>

      {/* QR Code Modal Overlay */}
      <AnimatePresence>
        {activeQR && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setActiveQR(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#111] border border-white/10 p-8 rounded-3xl shadow-2xl relative flex flex-col items-center max-w-sm w-full"
            >
              <button 
                onClick={() => setActiveQR(null)}
                className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
              
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-6 border border-white/10">
                <QrCode size={20} className="text-white" />
              </div>
              
              <h3 className="text-xl font-medium text-white mb-2">Scan QR Code</h3>
              <p className="text-sm text-gray-400 text-center mb-8">
                Points to <span className="text-white">shr.ly/{activeQR}</span>
              </p>
              
              <div className="bg-white p-4 rounded-2xl w-full flex justify-center">
                <QRCodeSVG value={`${window.location.origin}/${activeQR}`} size={200} />
              </div>
              
              <button 
                onClick={() => {
                  copyToClipboard(activeQR);
                  setActiveQR(null);
                }}
                className="mt-8 w-full btn-white rounded-xl py-3"
              >
                Copy Link instead
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
    </div>
  );
}
