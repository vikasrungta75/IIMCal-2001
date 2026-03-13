'use client';
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { Search, MapPin, Building, Linkedin, Users } from 'lucide-react';

const IMGS = {
  campus: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/IIM_Calcutta_MDC.jpg/1280px-IIM_Calcutta_MDC.jpg',
  kolkata: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Victoria_Memorial_%28Kolkata%29_in_Blue_Hour.jpg/1280px-Victoria_Memorial_%28Kolkata%29_in_Blue_Hour.jpg',
};

export default function AlumniPage() {
  const [alumni, setAlumni] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/alumni').then(r => r.json()),
      fetch('/api/profile').then(r => r.json()),
    ]).then(([list, profile]) => {
      setAlumni(Array.isArray(list) ? list : []);
      if (profile && !profile.error) setUser(profile);
      setLoading(false);
    });
  }, []);

  const filtered = alumni.filter(a =>
    [a.fullName, a.company, a.city, a.country, a.batch, a.designation].join(' ')
      .toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Navbar user={user ? { username: user.username, fullName: user.fullName, isAdmin: user.isAdmin } : null} />

      {/* Hero Banner */}
      <div className="relative pt-16" style={{ height: 240 }}>
        <img src={IMGS.campus} alt="IIM Calcutta Campus" className="absolute inset-0 w-full h-full object-cover" style={{ objectPosition: 'center 40%' }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(0,51,102,0.90), rgba(0,26,51,0.85))' }} />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
          <Users size={36} style={{ color: '#C8A951' }} className="mb-3" />
          <h1 className="font-display text-4xl font-bold text-white mb-2">Alumni Directory</h1>
          <p style={{ color: '#E8D5A3' }} className="font-crimson text-lg">Batch 1999–2001 · Joka Family</p>
          <p className="text-blue-300 text-sm mt-1">{alumni.length} alumni registered and counting</p>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-10">
        {/* Search */}
        <div className="relative mb-8 max-w-lg mx-auto">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            className="iimc-input pl-12 w-full"
            placeholder="Search by name, company, city, batch…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="text-center py-16 text-gray-400">Loading alumni…</div>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-4 text-center">{filtered.length} alumni found</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((a) => (
                <div key={a.username} className="iimc-card p-5 hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold text-white flex-shrink-0"
                      style={{ background: 'linear-gradient(135deg, #003366, #C8A951)' }}>
                      {a.fullName?.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold truncate" style={{ color: '#003366' }}>{a.fullName}</div>
                      <div className="text-xs text-gray-500">{a.programme} · Batch {a.batch}</div>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    {a.designation && a.company && (
                      <div className="flex items-center gap-2 text-gray-700">
                        <Building size={13} className="text-gray-400 flex-shrink-0" />
                        <span className="truncate">{a.designation}, {a.company}</span>
                      </div>
                    )}
                    {(a.city || a.country) && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin size={13} className="text-gray-400 flex-shrink-0" />
                        <span>{[a.city, a.country].filter(Boolean).join(', ')}</span>
                      </div>
                    )}
                    {a.bio && (
                      <p className="text-xs text-gray-500 italic line-clamp-2 mt-2 pt-2 border-t border-gray-100">"{a.bio}"</p>
                    )}
                  </div>
                  {a.linkedIn && (
                    <a href={a.linkedIn} target="_blank" rel="noreferrer"
                      className="mt-3 flex items-center gap-1.5 text-xs font-medium hover:underline" style={{ color: '#0077b5' }}>
                      <Linkedin size={13} /> Connect on LinkedIn
                    </a>
                  )}
                </div>
              ))}
            </div>
            {filtered.length === 0 && (
              <div className="text-center py-16 text-gray-400">No alumni match your search.</div>
            )}
          </>
        )}

        {/* Kolkata footer image */}
        <div className="mt-14 rounded-2xl overflow-hidden relative" style={{ height: 180 }}>
          <img src={IMGS.kolkata} alt="Victoria Memorial Kolkata" className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(0,51,102,0.88), rgba(0,51,102,0.4))' }} />
          <div className="absolute inset-0 flex items-center px-8">
            <div>
              <p className="font-display text-2xl font-bold text-white mb-1">45,000+ IIMC Alumni Worldwide</p>
              <p style={{ color: '#C8A951' }} className="text-sm">All connected by one unforgettable campus — Joka</p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
