'use client';
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { Pin, Calendar, Tag } from 'lucide-react';

const CATEGORY_COLORS: Record<string, string> = {
  important: 'badge-red',
  event: 'badge-navy',
  logistics: 'badge-gold',
  general: 'badge-gold',
};

export default function AnnouncementsPage() {
  const [user, setUser] = useState<any>(null);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch('/api/profile').then(r => r.json()),
      fetch('/api/announcements').then(r => r.json()),
    ]).then(([u, a]) => {
      setUser(u);
      setAnnouncements(Array.isArray(a) ? a : []);
      setLoading(false);
    });
  }, []);

  const filtered = filter === 'all' ? announcements : announcements.filter(a => a.category === filter);

  if (loading) return <><Navbar user={null} /><div className="pt-32 text-center text-gray-500">Loading…</div></>;

  return (
    <>
      <Navbar user={{ username: user?.username, fullName: user?.fullName, isAdmin: !!user?.isAdmin }} />
      <main className="pt-20 pb-12 px-4 max-w-4xl mx-auto">
        <div className="mt-6 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold mb-1" style={{ color: '#003366' }}>Announcements</h1>
            <p className="text-gray-500 text-sm">Stay updated with the latest news for Silver Jubilee</p>
          </div>
          {/* Filter */}
          <div className="flex gap-2 flex-wrap">
            {['all', 'important', 'event', 'logistics', 'general'].map(cat => (
              <button key={cat} onClick={() => setFilter(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all capitalize ${filter === cat ? 'border-navy text-white' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                style={filter === cat ? { background: '#003366', borderColor: '#003366' } : {}}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Pinned */}
        {filter === 'all' && filtered.some(a => a.pinned) && (
          <div className="mb-2">
            <div className="flex items-center gap-2 mb-3">
              <Pin size={14} style={{ color: '#C8A951' }} />
              <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#8a6b1a' }}>Pinned</span>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {filtered.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <div className="text-4xl mb-3">📭</div>
              <p>No announcements in this category</p>
            </div>
          )}
          {filtered.map((a) => (
            <div key={a.id} className={`iimc-card overflow-hidden ${a.pinned ? 'border-l-4' : ''}`}
              style={a.pinned ? { borderLeftColor: '#C8A951' } : {}}>
              <div className="p-5 cursor-pointer" onClick={() => setExpanded(expanded === a.id ? null : a.id)}>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="font-semibold text-base leading-snug" style={{ color: '#1a1a2e' }}>{a.title}</h3>
                  <div className="flex items-center gap-2 shrink-0">
                    {a.pinned && <Pin size={14} style={{ color: '#C8A951' }} />}
                    <span className={CATEGORY_COLORS[a.category] || 'badge-gold'}>{a.category}</span>
                  </div>
                </div>

                {expanded === a.id ? (
                  <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line mt-3">
                    {a.content}
                  </div>
                ) : (
                  <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">{a.content.split('\n')[0]}</p>
                )}

                <div className="flex items-center gap-3 mt-3 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <Calendar size={11} />
                    {new Date(a.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                  <span>·</span>
                  <span>{a.author}</span>
                  <span className="ml-auto" style={{ color: '#003366' }}>
                    {expanded === a.id ? '▲ Less' : '▼ Read more'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
