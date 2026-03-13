'use client';
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { Users, Bell, Plane, Plus, Trash2, Pin, Hotel, ChevronDown, ChevronUp, Download, Clock, CheckCircle, XCircle, Shield } from 'lucide-react';

const CATEGORY_OPTIONS = ['general', 'important', 'event', 'logistics'];

export default function AdminPage() {
  const [user, setUser] = useState<any>(null);
  const [tab, setTab] = useState<'overview'|'pending'|'announcements'|'registrations'|'travel'>('overview');
  const [stats, setStats] = useState<any>(null);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [form, setForm] = useState({ title: '', content: '', category: 'general', author: 'Event Committee', pinned: false });
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [expandedAnn, setExpandedAnn] = useState<string|null>(null);
  const [approving, setApproving] = useState<string|null>(null);

  const loadData = () => {
    Promise.all([
      fetch('/api/profile').then(r => r.json()),
      fetch('/api/announcements').then(r => r.json()),
      fetch('/api/admin/stats').then(r => r.json()),
    ]).then(([u, a, s]) => {
      if (!u.isAdmin) { window.location.href = '/dashboard'; return; }
      setUser(u);
      setAnnouncements(Array.isArray(a) ? a : []);
      setStats(s);
      setLoading(false);
    });
  };

  useEffect(() => { loadData(); }, []);

  const handleApprove = async (username: string, action: 'approve' | 'reject') => {
    setApproving(username);
    await fetch('/api/admin/approve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, action, reason: 'Not from Batch 1999-2001' }),
    });
    setApproving(null);
    loadData(); // refresh
  };

  const postAnn = async (e: React.FormEvent) => {
    e.preventDefault();
    setPosting(true);
    const res = await fetch('/api/announcements', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    const created = await res.json();
    setAnnouncements(p => [created, ...p]);
    setForm({ title: '', content: '', category: 'general', author: 'Event Committee', pinned: false });
    setShowForm(false);
    setPosting(false);
  };

  const deleteAnn = async (id: string) => {
    if (!confirm('Delete this announcement?')) return;
    await fetch('/api/announcements', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    setAnnouncements(p => p.filter(a => a.id !== id));
  };

  const exportCSV = () => {
    if (!stats?.alumni) return;
    const header = 'Name,Email,Batch,Programme,Company,Designation,City,Country,Status,Joined\n';
    const rows = stats.alumni.map((r: any) =>
      `"${r.fullName}","${r.email}","${r.batch}","${r.programme}","${r.company||''}","${r.designation||''}","${r.city||''}","${r.country||''}","${r.status||''}","${new Date(r.createdAt).toLocaleDateString()}"`
    ).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'iimc-alumni.csv'; a.click();
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#f5f0e8' }}>
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-navy/20 border-t-navy rounded-full animate-spin mx-auto mb-3" style={{ borderTopColor: '#003366' }} />
        <p style={{ color: '#003366' }}>Loading admin panel…</p>
      </div>
    </div>
  );

  const pendingCount = stats?.pendingCount || 0;

  return (
    <>
      <Navbar user={user ? { username: user.username, fullName: user.fullName, isAdmin: true } : null} />

      {/* Admin hero */}
      <div className="relative pt-16" style={{ height: 160 }}>
        <img src="/images/campus.jpg" alt="Campus" className="absolute inset-0 w-full h-full object-cover" style={{ objectPosition: 'center 30%' }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(139,0,0,0.92), rgba(0,26,51,0.9))' }} />
        <div className="relative z-10 h-full flex items-center px-6 gap-4">
          <Shield size={36} style={{ color: '#C8A951' }} />
          <div>
            <h1 className="font-display text-3xl font-bold text-white">Admin Dashboard</h1>
            <p style={{ color: '#E8D5A3' }}>Silver Jubilee 2025 · Event Management</p>
          </div>
          {pendingCount > 0 && (
            <div className="ml-auto flex items-center gap-2 px-4 py-2 rounded-full" style={{ background: 'rgba(255,165,0,0.2)', border: '1px solid rgba(255,165,0,0.5)' }}>
              <Clock size={16} style={{ color: '#FFD700' }} />
              <span className="text-white text-sm font-semibold">{pendingCount} pending approval{pendingCount > 1 ? 's' : ''}</span>
            </div>
          )}
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-200 pb-4">
          {[
            { key: 'overview', label: 'Overview', icon: '📊' },
            { key: 'pending', label: `Approvals ${pendingCount > 0 ? `(${pendingCount})` : ''}`, icon: '⏳' },
            { key: 'registrations', label: 'Alumni', icon: '👥' },
            { key: 'travel', label: 'Travel', icon: '✈️' },
            { key: 'announcements', label: 'Announcements', icon: '📢' },
          ].map(({ key, label, icon }) => (
            <button key={key} onClick={() => setTab(key as any)}
              className={`px-5 py-2.5 rounded-lg font-medium text-sm transition-all ${tab === key ? 'text-white' : 'text-gray-600 hover:bg-gray-100'}`}
              style={tab === key ? { background: key === 'pending' && pendingCount > 0 ? '#b45309' : '#003366' } : {}}>
              {icon} {label}
            </button>
          ))}
        </div>

        {/* OVERVIEW */}
        {tab === 'overview' && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            {[
              { label: 'Approved Alumni', value: stats?.totalAlumni || 0, icon: '✅', color: '#166534', bg: '#f0fdf4' },
              { label: 'Pending Approval', value: stats?.pendingCount || 0, icon: '⏳', color: '#b45309', bg: '#fffbeb', action: () => setTab('pending') },
              { label: 'Travel Details', value: stats?.travelCount || 0, icon: '✈️', color: '#003366', bg: '#eff6ff' },
              { label: 'Accommodation', value: stats?.accommodationCount || 0, icon: '🏨', color: '#6b21a8', bg: '#faf5ff' },
            ].map(({ label, value, icon, color, bg, action }) => (
              <div key={label} className={`iimc-card p-6 ${action ? 'cursor-pointer hover:shadow-lg transition-shadow' : ''}`}
                style={{ borderLeft: `4px solid ${color}` }} onClick={action}>
                <div className="text-3xl mb-2">{icon}</div>
                <div className="font-display text-3xl font-bold mb-1" style={{ color }}>{value}</div>
                <div className="text-sm text-gray-500">{label}</div>
              </div>
            ))}
          </div>
        )}

        {/* PENDING APPROVALS */}
        {tab === 'pending' && (
          <div>
            <h2 className="font-display text-2xl font-bold mb-2" style={{ color: '#003366' }}>Pending Approvals</h2>
            <p className="text-gray-500 text-sm mb-6">Review and approve alumni who have submitted their profiles for verification.</p>

            {!stats?.pendingRegistrations?.length ? (
              <div className="iimc-card p-12 text-center text-gray-400">
                <CheckCircle size={40} className="mx-auto mb-3" style={{ color: '#166534' }} />
                <p className="font-semibold">All caught up! No pending approvals.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {stats.pendingRegistrations.map((u: any) => (
                  <div key={u.username} className="iimc-card p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold text-white flex-shrink-0"
                          style={{ background: 'linear-gradient(135deg, #003366, #C8A951)' }}>
                          {u.fullName?.charAt(0) || '?'}
                        </div>
                        <div>
                          <div className="font-semibold text-lg" style={{ color: '#003366' }}>{u.fullName}</div>
                          <div className="text-sm text-gray-500">{u.email} · {u.oauthProvider === 'google' ? '🟢 Google' : '🔵 Microsoft'}</div>
                          <div className="text-sm text-gray-600 mt-1">
                            <span className="font-medium">Batch:</span> {u.batch || '—'} &nbsp;·&nbsp;
                            <span className="font-medium">Programme:</span> {u.programme || '—'} &nbsp;·&nbsp;
                            <span className="font-medium">Phone:</span> {u.phone || '—'}
                          </div>
                          {u.company && <div className="text-sm text-gray-600">{u.designation ? `${u.designation}, ` : ''}{u.company} · {u.city}, {u.country}</div>}
                          {u.bio && <div className="text-xs text-gray-400 italic mt-1">"{u.bio}"</div>}
                        </div>
                      </div>
                      <div className="flex gap-3 flex-shrink-0">
                        <button onClick={() => handleApprove(u.username, 'reject')} disabled={approving === u.username}
                          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border-2 transition-all disabled:opacity-50"
                          style={{ borderColor: '#8B0000', color: '#8B0000' }}>
                          <XCircle size={16} /> Reject
                        </button>
                        <button onClick={() => handleApprove(u.username, 'approve')} disabled={approving === u.username}
                          className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold text-white transition-all disabled:opacity-50"
                          style={{ background: '#166534' }}>
                          {approving === u.username
                            ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            : <><CheckCircle size={16} /> Approve</>}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* REGISTRATIONS */}
        {tab === 'registrations' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-2xl font-bold" style={{ color: '#003366' }}>Approved Alumni ({stats?.totalAlumni || 0})</h2>
              <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white" style={{ background: '#003366' }}>
                <Download size={16} /> Export CSV
              </button>
            </div>
            <div className="iimc-card overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: '#f8f4ec' }}>
                    {['Name','Email','Batch','Programme','Company','Location','Joined'].map(h => (
                      <th key={h} className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wider" style={{ color: '#003366' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(stats?.alumni || []).map((u: any, i: number) => (
                    <tr key={u.username} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-4 py-3 font-medium">{u.fullName}</td>
                      <td className="px-4 py-3 text-gray-500">{u.email}</td>
                      <td className="px-4 py-3">{u.batch}</td>
                      <td className="px-4 py-3">{u.programme}</td>
                      <td className="px-4 py-3 text-gray-600">{u.company || '—'}</td>
                      <td className="px-4 py-3 text-gray-500">{u.city ? `${u.city}, ${u.country}` : '—'}</td>
                      <td className="px-4 py-3 text-gray-400 text-xs">{new Date(u.createdAt).toLocaleDateString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TRAVEL */}
        {tab === 'travel' && (
          <div>
            <h2 className="font-display text-2xl font-bold mb-6" style={{ color: '#003366' }}>Travel Details ({stats?.travelCount || 0})</h2>
            <div className="iimc-card overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: '#f8f4ec' }}>
                    {['Alumni','Arrival','Mode','Departure','Accommodation','Dietary'].map(h => (
                      <th key={h} className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wider" style={{ color: '#003366' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(stats?.travel || []).map((t: any, i: number) => {
                    const u = (stats?.alumni || []).find((a: any) => a.id === t.userId);
                    return (
                      <tr key={t.userId} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-4 py-3 font-medium">{u?.fullName || t.userId}</td>
                        <td className="px-4 py-3">{t.arrivalDate} {t.arrivalTime}</td>
                        <td className="px-4 py-3 capitalize">{t.arrivalMode} {t.flightTrainNumber ? `(${t.flightTrainNumber})` : ''}</td>
                        <td className="px-4 py-3">{t.departureDate} {t.departureTime}</td>
                        <td className="px-4 py-3">{t.accommodationRequired ? `✅ ${t.accommodationPreference}${t.roomSharing ? ' (sharing)' : ''}` : '❌ Not needed'}</td>
                        <td className="px-4 py-3 capitalize">{t.dietaryPreference}</td>
                      </tr>
                    );
                  })}
                  {!stats?.travel?.length && <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">No travel details submitted yet.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ANNOUNCEMENTS */}
        {tab === 'announcements' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-2xl font-bold" style={{ color: '#003366' }}>Announcements</h2>
              <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 gold-btn px-5 py-2.5 rounded-lg text-sm font-semibold">
                <Plus size={16} /> New Announcement
              </button>
            </div>

            {showForm && (
              <form onSubmit={postAnn} className="iimc-card p-6 mb-6 space-y-4">
                <h3 className="font-semibold" style={{ color: '#003366' }}>New Announcement</h3>
                <input className="iimc-input" placeholder="Title" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} required />
                <textarea className="iimc-input" rows={5} placeholder="Content…" value={form.content} onChange={e => setForm(p => ({ ...p, content: e.target.value }))} required />
                <div className="grid grid-cols-2 gap-4">
                  <select className="iimc-input" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>
                    {CATEGORY_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <input className="iimc-input" placeholder="Author" value={form.author} onChange={e => setForm(p => ({ ...p, author: e.target.value }))} />
                </div>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={form.pinned} onChange={e => setForm(p => ({ ...p, pinned: e.target.checked }))} />
                  <Pin size={14} /> Pin this announcement
                </label>
                <div className="flex gap-3">
                  <button type="submit" disabled={posting} className="gold-btn px-6 py-2 rounded-lg font-semibold text-sm">{posting ? 'Posting…' : 'Post'}</button>
                  <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2 rounded-lg text-sm border border-gray-300 hover:bg-gray-50">Cancel</button>
                </div>
              </form>
            )}

            <div className="space-y-3">
              {announcements.map(a => (
                <div key={a.id} className="iimc-card p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {a.pinned && <Pin size={14} style={{ color: '#C8A951' }} />}
                        <h3 className="font-semibold" style={{ color: '#003366' }}>{a.title}</h3>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">{a.category}</span>
                      </div>
                      {expandedAnn === a.id
                        ? <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans mt-2">{a.content}</pre>
                        : <p className="text-sm text-gray-500 line-clamp-1">{a.content.split('\n')[0]}</p>}
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button onClick={() => setExpandedAnn(expandedAnn === a.id ? null : a.id)} className="text-gray-400 hover:text-gray-600 p-1">
                        {expandedAnn === a.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                      <button onClick={() => deleteAnn(a.id)} className="text-red-400 hover:text-red-600 p-1"><Trash2 size={16} /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </>
  );
}
