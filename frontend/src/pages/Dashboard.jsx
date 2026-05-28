import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Link as LinkIcon, 
  BarChart3, 
  Settings,
  Lock,
  ArrowUpRight,
  Copy,
  MoreVertical,
  QrCode,
  Edit2,
  Trash2,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock Analytics Data for Pro Users
const analyticsData = [
  { name: 'Mon', clicks: 120 },
  { name: 'Tue', clicks: 250 },
  { name: 'Wed', clicks: 180 },
  { name: 'Thu', clicks: 390 },
  { name: 'Fri', clicks: 290 },
  { name: 'Sat', clicks: 450 },
  { name: 'Sun', clicks: 520 },
];

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Dev Tool: Toggle Plan
  const [isPro, setIsPro] = useState(false);

  // Link Data State
  const [links, setLinks] = useState([]);
  const [loadingLinks, setLoadingLinks] = useState(true);

  // Shortening State
  const [url, setUrl] = useState('');
  const [isShortening, setIsShortening] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/');
    }
  }, [user, authLoading, navigate]);

  // Fetch Links
  useEffect(() => {
    const fetchLinks = async () => {
      if (!user) return;
      try {
        const { session } = await import('../utils/supabase').then(m => m.supabase.auth.getSession()).then(res => res.data);
        const headers = { 'Content-Type': 'application/json' };
        if (session?.access_token) {
          headers['Authorization'] = `Bearer ${session.access_token}`;
        }
        
        const apiUrl = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api/links` : '/api/links';
        const response = await fetch(apiUrl, { headers });
        const data = await response.json();
        if (Array.isArray(data)) {
          setLinks(data);
        }
      } catch (e) {
        console.error("Error fetching links", e);
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
        // Prepend the new link so it shows up instantly at the top
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

  if (authLoading || !user) {
    return <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0a0a0a]"><div className="w-8 h-8 border-4 border-black border-t-transparent dark:border-white dark:border-t-transparent rounded-full animate-spin" /></div>;
  }

  // Plan Limits
  const linkLimit = isPro ? 1000 : 50;
  const linksUsed = links.length;
  const progressPercent = Math.min((linksUsed / linkLimit) * 100, 100);

  const totalClicks = links.reduce((sum, link) => sum + (link.clicks || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] flex flex-col md:flex-row">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-white dark:bg-[#111111] border-r border-gray-200 dark:border-white/10 flex flex-col pt-20 md:pt-6 h-auto md:min-h-screen z-10 relative">
        <div className="p-6">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Menu</p>
          <nav className="space-y-1">
            <button onClick={() => setActiveTab('overview')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${activeTab === 'overview' ? 'bg-black text-white dark:bg-white dark:text-black' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'}`}>
              <LayoutDashboard size={18} />
              <span className="font-medium text-sm">Overview</span>
            </button>
            <button onClick={() => setActiveTab('links')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${activeTab === 'links' ? 'bg-black text-white dark:bg-white dark:text-black' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'}`}>
              <LinkIcon size={18} />
              <span className="font-medium text-sm">My Links</span>
            </button>
            <button onClick={() => setActiveTab('analytics')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${activeTab === 'analytics' ? 'bg-black text-white dark:bg-white dark:text-black' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'}`}>
              <BarChart3 size={18} />
              <span className="font-medium text-sm">Analytics</span>
            </button>
            <button onClick={() => setActiveTab('settings')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${activeTab === 'settings' ? 'bg-black text-white dark:bg-white dark:text-black' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'}`}>
              <Settings size={18} />
              <span className="font-medium text-sm">Settings</span>
            </button>
          </nav>
        </div>

        {/* Plan Upgrade Banner */}
        <div className="mt-auto p-6 hidden md:block">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-100 dark:border-blue-900/50 p-4 rounded-2xl relative overflow-hidden">
            {isPro ? (
              <>
                <p className="text-sm font-bold text-blue-900 dark:text-blue-300 mb-1">Pro Plan Active</p>
                <p className="text-xs text-blue-700/80 dark:text-blue-400/80 mb-3">All features unlocked.</p>
                <button onClick={() => setIsPro(false)} className="text-xs bg-white dark:bg-[#111111] border border-blue-200 dark:border-blue-800 px-3 py-1.5 rounded-lg font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/50 transition-colors w-full">
                  [Dev] Switch to Free
                </button>
              </>
            ) : (
              <>
                <p className="text-sm font-bold text-blue-900 dark:text-blue-300 mb-1">Unlock Pro</p>
                <p className="text-xs text-blue-700/80 dark:text-blue-400/80 mb-3">Get advanced analytics, bulk shortening, and 1,000 links/mo.</p>
                <button onClick={() => setIsPro(true)} className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg font-medium hover:bg-blue-700 transition-colors w-full shadow-sm">
                  Upgrade Now
                </button>
                <button onClick={() => setIsPro(true)} className="mt-2 text-[10px] text-center w-full text-blue-600 underline opacity-50 hover:opacity-100">
                  [Dev] Test Pro Mode
                </button>
              </>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 pt-6 overflow-y-auto w-full max-w-[1200px] mx-auto">
        <AnimatePresence mode="wait">
          
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold text-black dark:text-white mb-6">Overview</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Links Created Stat */}
                <div className="bg-white dark:bg-[#111111] p-6 rounded-3xl border border-gray-200 dark:border-white/10 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                      <LinkIcon size={20} />
                    </div>
                    <h3 className="font-medium text-gray-500 dark:text-gray-400">Total Links</h3>
                  </div>
                  <p className="text-4xl font-extrabold text-black dark:text-white">{linksUsed}</p>
                </div>

                {/* Total Clicks Stat */}
                <div className="bg-white dark:bg-[#111111] p-6 rounded-3xl border border-gray-200 dark:border-white/10 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
                      <BarChart3 size={20} />
                    </div>
                    <h3 className="font-medium text-gray-500 dark:text-gray-400">Lifetime Clicks</h3>
                  </div>
                  <p className="text-4xl font-extrabold text-black dark:text-white">{totalClicks}</p>
                </div>

                {/* Quota Stat */}
                <div className="bg-white dark:bg-[#111111] p-6 rounded-3xl border border-gray-200 dark:border-white/10 shadow-sm sm:col-span-2 lg:col-span-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-500 dark:text-gray-400">Monthly Quota</h3>
                    <span className="text-xs font-semibold bg-gray-100 dark:bg-white/10 px-2 py-1 rounded-md text-gray-600 dark:text-gray-300">
                      {isPro ? 'Pro' : 'Free'} Plan
                    </span>
                  </div>
                  <div className="mt-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-bold text-black dark:text-white">{linksUsed}</span>
                      <span className="text-gray-400">{linkLimit}</span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-white/5 rounded-full h-2 overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${progressPercent > 90 ? 'bg-red-500' : 'bg-black dark:bg-white'}`}
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                    {!isPro && progressPercent > 70 && (
                      <p className="text-xs text-orange-500 mt-3 flex items-center gap-1">
                        <AlertCircle size={12} /> Nearing limit. Upgrade to Pro.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Quick Action */}
              <div className="mt-8 bg-black dark:bg-white rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between shadow-xl">
                <div>
                  <h3 className="text-white dark:text-black text-xl font-bold mb-2">Need another short link?</h3>
                  <p className="text-gray-300 dark:text-gray-600 text-sm">Create and track your URLs instantly.</p>
                </div>
                <button onClick={() => { navigate('/'); setTimeout(() => document.getElementById('urlInput')?.focus(), 100); }} className="mt-4 md:mt-0 bg-white text-black dark:bg-black dark:text-white px-6 py-3 rounded-full font-semibold hover:scale-105 transition-transform">
                  Create Link <ArrowUpRight size={16} className="inline ml-1" />
                </button>
              </div>
            </motion.div>
          )}

          {/* MY LINKS TAB */}
          {activeTab === 'links' && (
            <motion.div
              key="links"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-black dark:text-white">My Links</h2>
                <div className="relative group">
                  <button className={`px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-all ${isPro ? 'bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-black dark:text-white' : 'bg-gray-50 dark:bg-white/5 text-gray-400 cursor-not-allowed border border-gray-100 dark:border-white/5'}`}>
                    Bulk Shorten
                    {!isPro && <Lock size={12} />}
                  </button>
                  {!isPro && (
                    <div className="absolute top-full right-0 mt-2 w-48 bg-black dark:bg-white text-white dark:text-black text-xs p-2 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-20 shadow-xl">
                      Upgrade to Pro to shorten multiple URLs at once.
                    </div>
                  )}
                </div>
              </div>

              {/* In-Dashboard Shortener */}
              <div className="bg-white dark:bg-[#111111] p-4 rounded-3xl border border-gray-200 dark:border-white/10 shadow-sm mb-6 flex items-center gap-4 transition-all duration-300 focus-within:ring-2 focus-within:ring-black dark:focus-within:ring-white/20">
                <form onSubmit={handleShorten} className="flex-1 flex gap-2 w-full">
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Paste a long URL to shorten..."
                    className="flex-1 bg-transparent border-0 focus:outline-none px-4 py-2 text-sm md:text-base text-black dark:text-white placeholder:text-gray-400"
                  />
                  <button 
                    type="submit" 
                    disabled={isShortening}
                    className="btn-black py-2 px-6 rounded-full text-sm shrink-0"
                  >
                    {isShortening ? 'Shortening...' : 'Shorten'}
                  </button>
                </form>
              </div>

              <div className="bg-white dark:bg-[#111111] rounded-3xl border border-gray-200 dark:border-white/10 overflow-hidden shadow-sm">
                {loadingLinks ? (
                   <div className="p-8 text-center text-gray-500">Loading links...</div>
                ) : links.length === 0 ? (
                  <div className="p-12 text-center flex flex-col items-center">
                    <div className="w-16 h-16 bg-gray-50 dark:bg-white/5 rounded-full flex items-center justify-center text-gray-400 mb-4">
                      <LinkIcon size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-black dark:text-white mb-2">No links yet</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">You haven't shortened any URLs yet.</p>
                    <button onClick={() => navigate('/')} className="btn-black text-sm px-5 py-2">Create your first link</button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-gray-100 dark:border-white/10">
                          <th className="p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Short Link</th>
                          <th className="p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Original URL</th>
                          <th className="p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Clicks</th>
                          <th className="p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {links.map((link, i) => (
                          <tr key={i} className="border-b border-gray-50 dark:border-white/5 hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors">
                            <td className="p-4">
                              <a href={`${window.location.origin}/${link.shortCode}`} target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
                                {window.location.hostname}/{link.shortCode} <ArrowUpRight size={12} />
                              </a>
                              <p className="text-xs text-gray-400 mt-1">{new Date(link.createdAt).toLocaleDateString()}</p>
                            </td>
                            <td className="p-4 max-w-[200px] truncate">
                              <span className="text-sm text-gray-600 dark:text-gray-300" title={link.targetUrl}>{link.targetUrl}</span>
                            </td>
                            <td className="p-4 text-right">
                              <span className="inline-flex items-center justify-center bg-gray-100 dark:bg-white/10 px-2.5 py-1 rounded-full text-xs font-medium text-gray-700 dark:text-gray-300">
                                {link.clicks || 0}
                              </span>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center justify-end gap-2">
                                <button title="Copy" onClick={() => navigator.clipboard.writeText(`${window.location.origin}/${link.shortCode}`)} className="p-2 text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors">
                                  <Copy size={16} />
                                </button>
                                <button title="QR Code" className="p-2 text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors">
                                  <QrCode size={16} />
                                </button>
                                <div className="relative group/edit">
                                  <button className="p-2 text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors flex items-center">
                                    <Edit2 size={16} />
                                  </button>
                                  {!isPro && (
                                    <div className="absolute right-0 top-full mt-1 w-32 bg-black text-white text-[10px] p-2 rounded-md opacity-0 group-hover/edit:opacity-100 pointer-events-none transition-opacity z-20 text-center">
                                      Pro Feature
                                    </div>
                                  )}
                                </div>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* ANALYTICS TAB */}
          {activeTab === 'analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-black dark:text-white">Deep Analytics</h2>
                {!isPro && (
                  <span className="bg-orange-100 text-orange-700 border border-orange-200 dark:bg-orange-900/30 dark:border-orange-800/50 dark:text-orange-400 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <Lock size={12} /> Pro Feature
                  </span>
                )}
              </div>

              <div className="relative rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#111111] overflow-hidden min-h-[400px] shadow-sm">
                
                {/* Free Tier Lock Overlay */}
                {!isPro && (
                  <div className="absolute inset-0 bg-white/60 dark:bg-[#111111]/70 backdrop-blur-md z-20 flex flex-col items-center justify-center p-6 text-center">
                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4 shadow-lg shadow-blue-500/20">
                      <BarChart3 size={32} />
                    </div>
                    <h3 className="text-2xl font-extrabold text-black dark:text-white mb-2">Unlock Deep Analytics</h3>
                    <p className="text-gray-600 dark:text-gray-400 max-w-md mb-6">See exactly where your traffic is coming from. Track clicks over time, geographic locations, and top referring domains with interactive graphs.</p>
                    <button onClick={() => setIsPro(true)} className="btn-black py-3 px-8 shadow-xl shadow-black/20 dark:shadow-none">
                      Upgrade to Pro
                    </button>
                    <p className="mt-4 text-xs text-gray-400">Cancel anytime. 14-day money-back guarantee.</p>
                  </div>
                )}

                {/* Actual Analytics UI (Visible clearly to Pro, blurred for Free) */}
                <div className={`p-6 ${!isPro ? 'opacity-30 pointer-events-none' : ''}`}>
                  <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-6">Clicks over last 7 days</h3>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={analyticsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" opacity={0.2} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '12px', color: '#fff' }}
                          itemStyle={{ color: '#fff' }}
                        />
                        <Area type="monotone" dataKey="clicks" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorClicks)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* SETTINGS TAB */}
          {activeTab === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <h2 className="text-2xl font-bold text-black dark:text-white mb-6">Settings</h2>
              
              <div className="bg-white dark:bg-[#111111] rounded-3xl border border-gray-200 dark:border-white/10 p-6 shadow-sm mb-6">
                <h3 className="font-semibold text-lg text-black dark:text-white mb-4 border-b border-gray-100 dark:border-white/10 pb-4">Account</h3>
                <div className="flex items-center gap-4 mb-6">
                  <img src={user.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${user.email}`} alt="Avatar" className="w-16 h-16 rounded-full ring-4 ring-gray-50 dark:ring-white/5" />
                  <div>
                    <p className="font-bold text-black dark:text-white text-lg">{user.user_metadata?.full_name || 'Shrynkly User'}</p>
                    <p className="text-gray-500 dark:text-gray-400">{user.email}</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-2xl flex items-center justify-between">
                  <div>
                    <p className="font-medium text-black dark:text-white">Current Plan: {isPro ? 'Pro' : 'Free'}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {isPro ? 'You are on the highest tier.' : 'Upgrade to Pro for advanced features.'}
                    </p>
                  </div>
                  {!isPro && (
                    <button onClick={() => setIsPro(true)} className="btn-black py-2 px-4 text-sm">Upgrade</button>
                  )}
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>
    </div>
  );
}
