'use client';
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { Pin, Calendar, Tag, Bell } from 'lucide-react';

const IMGS = {
  campus: '/images/campus.jpg',
  howrah: '/images/howrah.jpg',
};

const CATEGORIES = ['all', 'important', 'event', 'logistics', 'general'];

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/announcements').then(r => r.json()),
      fetch('/api/profile').then(r => r.json()),
    ]).then(([anns, profile]) => {
      setAnnouncements(Array.isArray(anns) ? anns : []);
      if (profile && !profile.error) setUser(profile);
      setLoading(false);
    });
  }, []);

  const filtered = filter === 'all' ? announcements : announcements.filter(a => a.category === filter);

  const categoryColor: Record<string, string> = {
    important: '#8B0000', event: '#003366', logistics: '#166534', general: '#5a5a5a',
  };

  return (
    <>
      <Navbar user={user ? { username: user.username, fullName: user.fullName, isAdmin: user.isAdmin } : null} />

      {/* Hero Banner */}
      <div className="relative pt-16" style={{ height: 220 }}>
        <img src={IMGS.campus} alt="IIM Calcutta" className="absolute inset-0 w-full h-full object-cover" style={{ objectPosition: 'center 30%' }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(0,51,102,0.92), rgba(139,0,0,0.7))' }} />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4 pb-4">
          <Bell size={32} style={{ color: '#C8A951' }} className="mb-3" />
          <h1 className="font-display text-4xl font-bold text-white mb-2">Announcements</h1>
          <p style={{ color: '#E8D5A3' }} className="font-crimson text-lg">Stay updated on all Silver Jubilee news & events</p>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 py-10">
        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${filter === cat ? 'text-white border-transparent' : 'border-gray-300 text-gray-600 hover:border-gray-400'}`}
              style={filter === cat ? { background: categoryColor[cat] || '#003366' } : {}}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-16 text-gray-400">Loading announcements…</div>
        ) : (
          <div className="space-y-5">
            {filtered.map((a) => (
              <div key={a.id} className="iimc-card p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <h2 className="font-display text-xl font-bold leading-snug" style={{ color: '#1a1a2e' }}>{a.title}</h2>
                  {a.pinned && (
                    <span className="flex items-center gap-1 badge-gold shrink-0">
                      <Pin size={11} /> Pinned
                    </span>
                  )}
                </div>
                <pre className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap font-sans mb-4">{a.content}</pre>
                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 pt-3 border-t border-gray-100">
                  <span className="flex items-center gap-1"><Calendar size={12} />
                    {new Date(a.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                  <span className="flex items-center gap-1"><Tag size={12} />
                    <span className="font-semibold" style={{ color: categoryColor[a.category] || '#5a5a5a' }}>
                      {a.category}
                    </span>
                  </span>
                  <span>By {a.author}</span>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="text-center py-16 text-gray-400">No announcements in this category yet.</div>
            )}
          </div>
        )}

        {/* Kolkata strip at bottom */}
        <div className="mt-12 rounded-2xl overflow-hidden relative" style={{ height: 160 }}>
          <img src={IMGS.howrah} alt="Howrah Bridge Kolkata" className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(0,51,102,0.85), rgba(0,26,51,0.5))' }} />
          <div className="absolute inset-0 flex items-center px-8">
            <div>
              <p className="font-display text-2xl font-bold text-white mb-1">See you in Kolkata!</p>
              <p style={{ color: '#C8A951' }} className="font-crimson text-lg">November 14–16, 2025 · Joka Campus</p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
