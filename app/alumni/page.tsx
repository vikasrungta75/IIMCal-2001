'use client';
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { Search, MapPin, Building, Linkedin } from 'lucide-react';

export default function AlumniPage() {
  const [user, setUser] = useState<any>(null);
  const [alumni, setAlumni] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/profile').then(r => r.json()),
      fetch('/api/alumni').then(r => r.json()),
    ]).then(([u, a]) => {
      setUser(u);
      setAlumni(Array.isArray(a) ? a : []);
      setLoading(false);
    });
  }, []);

  const filtered = alumni.filter(a =>
    !search ||
    a.fullName?.toLowerCase().includes(search.toLowerCase()) ||
    a.company?.toLowerCase().includes(search.toLowerCase()) ||
    a.city?.toLowerCase().includes(search.toLowerCase()) ||
    a.batch?.includes(search) ||
    a.designation?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <><Navbar user={null} /><div className="pt-32 text-center text-gray-500">Loading…</div></>;

  return (
    <>
      <Navbar user={{ username: user?.username, fullName: user?.fullName, isAdmin: !!user?.isAdmin }} />
      <main className="pt-20 pb-12 px-4 max-w-6xl mx-auto">
        <div className="mt-6 mb-8">
          <h1 className="font-display text-2xl font-bold mb-1" style={{ color: '#003366' }}>Alumni Directory</h1>
          <p className="text-gray-500 text-sm">{alumni.length} batchmates registered for Silver Jubilee</p>
        </div>

        {/* Search */}
        <div className="relative mb-8">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            className="iimc-input pl-11 py-3 text-base"
            placeholder="Search by name, company, city, batch…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <div className="text-4xl mb-3">🔍</div>
            <p>No alumni found matching "{search}"</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((a) => (
              <div key={a.id} className="iimc-card p-5">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold text-white shrink-0"
                    style={{ background: `hsl(${(a.fullName?.charCodeAt(0) || 0) * 13 % 360}, 50%, 35%)` }}>
                    {a.fullName?.charAt(0) || '?'}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-base truncate" style={{ color: '#003366' }}>{a.fullName}</h3>
                    <p className="text-xs text-gray-500">@{a.username}</p>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <span className="badge-gold">{a.programme}</span>
                    <span className="badge-navy">Batch {a.batch}</span>
                  </div>
                  {(a.designation || a.company) && (
                    <div className="flex items-center gap-1.5 text-gray-600">
                      <Building size={13} className="shrink-0" />
                      <span className="truncate text-xs">{[a.designation, a.company].filter(Boolean).join(' @ ')}</span>
                    </div>
                  )}
                  {(a.city || a.country) && (
                    <div className="flex items-center gap-1.5 text-gray-600">
                      <MapPin size={13} className="shrink-0" />
                      <span className="text-xs">{[a.city, a.country].filter(Boolean).join(', ')}</span>
                    </div>
                  )}
                  {a.bio && (
                    <p className="text-xs text-gray-500 italic line-clamp-2 mt-1">"{a.bio}"</p>
                  )}
                </div>

                {a.linkedIn && (
                  <div className="mt-4 pt-3 border-t border-gray-100">
                    <a href={a.linkedIn} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs font-medium hover:underline"
                      style={{ color: '#0077b5' }}>
                      <Linkedin size={13} /> Connect on LinkedIn
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {alumni.length === 0 && (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🎓</div>
            <h3 className="font-display text-xl font-bold mb-2" style={{ color: '#003366' }}>Be the first to register!</h3>
            <p className="text-gray-500">Invite your batchmates to join the Silver Jubilee portal.</p>
          </div>
        )}
      </main>
    </>
  );
}
