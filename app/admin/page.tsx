'use client';
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { Users, Bell, Plane, Plus, Trash2, Pin, Hotel, ChevronDown, ChevronUp, Download } from 'lucide-react';

const CATEGORY_OPTIONS = ['general', 'important', 'event', 'logistics'];

export default function AdminPage() {
  const [user, setUser] = useState<any>(null);
  const [tab, setTab] = useState<'overview'|'announcements'|'registrations'|'travel'>('overview');
  const [stats, setStats] = useState<any>(null);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [form, setForm] = useState({ title: '', content: '', category: 'general', author: 'Event Committee', pinned: false });
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [expandedAnn, setExpandedAnn] = useState<string|null>(null);

  useEffect(() => {
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
  }, []);

  const postAnn = async (e: React.FormEvent) => {
    e.preventDefault();
    setPosting(true);
    const res = await fetch('/api/announcements', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
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
    if (!stats?.recentRegistrations) return;
    const all = stats.recentRegistrations;
    const header = 'Name,Username,Email,Batch,Programme,Company,Designation,City,Country,Joined\n';
    const rows = all.map((r: any) => `"${r.fullName}","${r.username}","${r.email}","${r.batch}","${r.programme}","${r.company||''}","${r.designation||''}","${r.city||''}","${r.country||''}","${new Date(r.createdAt).toLocaleDateString()}"`).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'iimc-registrations.csv'; a.click();
  };

  if (loading) return <><Navbar user={null} /><div className="pt-32 text-center text-gray-500 animate-pulse">Loading admin panel…</div></>;

  const TABS = [
    { key: 'overview', label: '📊 Overview' },
    { key: 'announcements', label: '📣 Announcements' },
    { key: 'registrations', label: '👥 Registrations' },
    { key: 'travel', label: '✈️ Travel' },
  ] as const;

  return (
    <>
      <Navbar user={{ username: user.username, fullName: user.fullName, isAdmin: true }} />
      <main className="pt-20 pb-16 px-4 max-w-7xl mx-auto">
        <div className="mt-6 mb-8 flex items-end justify-between">
          <div>
            <span className="badge-red inline-block mb-2">Admin Panel</span>
            <h1 className="font-display text-3xl font-bold" style={{ color: '#003366' }}>Event Management</h1>
            <p className="text-gray-500 text-sm mt-1">Silver Jubilee 2025 — Control Center</p>
          </div>
          <div className="text-right hidden md:block">
            <div className="text-xs text-gray-400">Logged in as</div>
            <div className="font-semibold text-sm" style={{ color: '#003366' }}>{user.fullName}</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-xl mb-8 overflow-x-auto" style={{ background: '#e8e2d8' }}>
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${tab === t.key ? 'bg-white shadow-sm' : 'text-gray-600 hover:text-gray-800'}`}
              style={tab === t.key ? { color: '#003366' } : {}}>
              {t.label}
            </button>
          ))}
        </div>

        {/* OVERVIEW */}
        {tab === 'overview' && (
          <div className="space-y-8">
            {/* Stat cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: Users, label: 'Registrations', val: stats?.registrations ?? '…', color: '#003366', sub: 'alumni registered' },
                { icon: Bell, label: 'Announcements', val: stats?.announcements ?? '…', color: '#8B0000', sub: 'posts published' },
                { icon: Plane, label: 'Travel Submitted', val: stats?.travelSubmitted ?? '…', color: '#155724', sub: 'itineraries saved' },
                { icon: Hotel, label: 'Need Accommodation', val: stats?.accommodationNeeded ?? '…', color: '#856404', sub: 'room bookings needed' },
              ].map(({ icon: Icon, label, val, color, sub }) => (
                <div key={label} className="iimc-card p-6 text-center">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3" style={{ background: `${color}15` }}>
                    <Icon size={22} style={{ color }} />
                  </div>
                  <div className="font-display text-4xl font-bold mb-1" style={{ color }}>{val}</div>
                  <div className="font-medium text-sm" style={{ color: '#1a1a2e' }}>{label}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{sub}</div>
                </div>
              ))}
            </div>

            {/* Quick actions */}
            <div className="grid md:grid-cols-3 gap-4">
              <button onClick={() => { setTab('announcements'); setShowForm(true); }}
                className="iimc-card p-5 text-left hover:shadow-lg transition-all">
                <div className="text-2xl mb-2">📣</div>
                <div className="font-semibold" style={{ color: '#003366' }}>Post Announcement</div>
                <div className="text-xs text-gray-500 mt-1">Notify all registered alumni</div>
              </button>
              <button onClick={() => setTab('registrations')}
                className="iimc-card p-5 text-left hover:shadow-lg transition-all">
                <div className="text-2xl mb-2">👥</div>
                <div className="font-semibold" style={{ color: '#003366' }}>View Registrations</div>
                <div className="text-xs text-gray-500 mt-1">Browse & export alumni list</div>
              </button>
              <button onClick={() => setTab('travel')}
                className="iimc-card p-5 text-left hover:shadow-lg transition-all">
                <div className="text-2xl mb-2">✈️</div>
                <div className="font-semibold" style={{ color: '#003366' }}>Travel & Accommodation</div>
                <div className="text-xs text-gray-500 mt-1">View all travel plans</div>
              </button>
            </div>

            {/* Event checklist */}
            <div className="iimc-card p-6">
              <h3 className="font-display text-lg font-bold mb-4" style={{ color: '#003366' }}>Organiser Checklist</h3>
              <div className="space-y-2">
                {[
                  { done: true,  task: 'Portal launched and accessible' },
                  { done: true,  task: 'Sample announcements seeded' },
                  { done: false, task: 'Send portal link to all batch alumni (WhatsApp / email)' },
                  { done: false, task: 'Confirm catering numbers — check dietary counts in Travel tab' },
                  { done: false, task: 'Finalize accommodation allocation by Oct 20' },
                  { done: false, task: 'Coordinate airport pickup for Nov 14 arrivals' },
                  { done: false, task: 'Print commemorative name badges for all attendees' },
                  { done: false, task: 'Collect award nominations by Oct 20' },
                  { done: false, task: 'Compile Memory Book content by Nov 1' },
                ].map(({ done, task }) => (
                  <div key={task} className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0">
                    <div className={`w-5 h-5 rounded flex items-center justify-center shrink-0 ${done ? 'bg-green-500' : 'border-2 border-gray-300'}`}>
                      {done && <span className="text-white text-xs">✓</span>}
                    </div>
                    <span className={`text-sm ${done ? 'line-through text-gray-400' : 'text-gray-700'}`}>{task}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ANNOUNCEMENTS */}
        {tab === 'announcements' && (
          <div>
            <div className="flex justify-between items-center mb-5">
              <h2 className="font-semibold text-xl" style={{ color: '#003366' }}>Announcements ({announcements.length})</h2>
              <button onClick={() => setShowForm(!showForm)}
                className="gold-btn px-4 py-2 rounded-lg text-sm flex items-center gap-1.5">
                <Plus size={16} /> New Post
              </button>
            </div>

            {showForm && (
              <form onSubmit={postAnn} className="iimc-card p-6 mb-6 space-y-4">
                <h3 className="font-semibold text-lg" style={{ color: '#003366' }}>Create Announcement</h3>
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-700">Title *</label>
                  <input className="iimc-input" placeholder="Announcement title" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-700">Content * <span className="font-normal text-gray-400">(line breaks supported)</span></label>
                  <textarea className="iimc-input resize-none" rows={7} placeholder="Write the full announcement here…" value={form.content} onChange={e => setForm(p => ({ ...p, content: e.target.value }))} required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5 text-gray-700">Category</label>
                    <select className="iimc-input" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>
                      {CATEGORY_OPTIONS.map(c => <option key={c} value={c} className="capitalize">{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5 text-gray-700">Author / Team</label>
                    <input className="iimc-input" value={form.author} onChange={e => setForm(p => ({ ...p, author: e.target.value }))} />
                  </div>
                </div>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input type="checkbox" checked={form.pinned} onChange={e => setForm(p => ({ ...p, pinned: e.target.checked }))} className="w-4 h-4 rounded" />
                  <span className="text-sm text-gray-700">📌 Pin this announcement (appears at top)</span>
                </label>
                <div className="flex gap-3 pt-1">
                  <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
                  <button type="submit" disabled={posting} className="gold-btn px-7 py-2 rounded-lg text-sm font-semibold disabled:opacity-60">
                    {posting ? 'Posting…' : '📣 Publish'}
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-3">
              {announcements.map(a => (
                <div key={a.id} className="iimc-card overflow-hidden">
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2 min-w-0">
                        {a.pinned && <Pin size={14} style={{ color: '#C8A951' }} className="shrink-0" />}
                        <h4 className="font-semibold text-sm" style={{ color: '#003366' }}>{a.title}</h4>
                        <span className={`shrink-0 ${a.category === 'important' ? 'badge-red' : a.category === 'event' ? 'badge-navy' : 'badge-gold'}`}>{a.category}</span>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button onClick={() => setExpandedAnn(expandedAnn === a.id ? null : a.id)} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded">
                          {expandedAnn === a.id ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                        </button>
                        <button onClick={() => deleteAnn(a.id)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                    {expandedAnn === a.id && (
                      <div className="mt-3 text-sm text-gray-700 leading-relaxed whitespace-pre-line border-t pt-3 border-gray-100">
                        {a.content}
                      </div>
                    )}
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                      <span>{new Date(a.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}</span>
                      <span>·</span><span>{a.author}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* REGISTRATIONS */}
        {tab === 'registrations' && (
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-xl" style={{ color: '#003366' }}>Registered Alumni ({stats?.registrations ?? 0})</h2>
              <button onClick={exportCSV} className="navy-btn px-4 py-2 rounded-lg text-sm flex items-center gap-2">
                <Download size={15} /> Export CSV
              </button>
            </div>
            <div className="iimc-card overflow-hidden overflow-x-auto">
              <table className="w-full iimc-table min-w-[700px]">
                <thead>
                  <tr>
                    <th className="text-left">Name</th>
                    <th className="text-left">Batch</th>
                    <th className="text-left">Programme</th>
                    <th className="text-left">Company / Role</th>
                    <th className="text-left">Location</th>
                    <th className="text-left">Registered</th>
                  </tr>
                </thead>
                <tbody>
                  {(stats?.recentRegistrations || []).map((r: any) => (
                    <tr key={r.id}>
                      <td>
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                            style={{ background: `hsl(${(r.fullName?.charCodeAt(0)||0)*13%360},45%,35%)` }}>
                            {r.fullName?.charAt(0)}
                          </div>
                          <div>
                            <div className="font-medium text-sm" style={{ color:'#003366' }}>{r.fullName}</div>
                            <div className="text-xs text-gray-400">@{r.username}</div>
                          </div>
                        </div>
                      </td>
                      <td className="text-sm">{r.batch}</td>
                      <td className="text-sm">{r.programme}</td>
                      <td className="text-sm text-gray-600">
                        {r.designation && <div>{r.designation}</div>}
                        {r.company && <div className="text-xs text-gray-400">{r.company}</div>}
                        {!r.company && '—'}
                      </td>
                      <td className="text-sm text-gray-600">{r.city ? `${r.city}, ${r.country}` : '—'}</td>
                      <td className="text-xs text-gray-400">{new Date(r.createdAt).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}</td>
                    </tr>
                  ))}
                  {!stats?.recentRegistrations?.length && (
                    <tr><td colSpan={6} className="text-center py-12 text-gray-400">No registrations yet</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TRAVEL */}
        {tab === 'travel' && (
          <div>
            <h2 className="font-semibold text-xl mb-5" style={{ color:'#003366' }}>Travel Submissions ({stats?.travelSubmitted ?? 0})</h2>

            {/* Summary cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[
                { label:'Total Submitted', val: stats?.travelSubmitted ?? 0, emoji:'✈️' },
                { label:'Need Accommodation', val: stats?.accommodationNeeded ?? 0, emoji:'🏨' },
                { label:'Arriving by Flight', val: (stats?.travelDetails||[]).filter((t:any)=>t.arrivalMode==='flight').length, emoji:'🛬' },
                { label:'Arriving by Train', val: (stats?.travelDetails||[]).filter((t:any)=>t.arrivalMode==='train').length, emoji:'🚂' },
              ].map(({label,val,emoji}) => (
                <div key={label} className="iimc-card p-4 text-center">
                  <div className="text-2xl mb-1">{emoji}</div>
                  <div className="font-display text-3xl font-bold" style={{color:'#003366'}}>{val}</div>
                  <div className="text-xs text-gray-500 mt-1">{label}</div>
                </div>
              ))}
            </div>

            <div className="iimc-card overflow-hidden overflow-x-auto">
              <table className="w-full iimc-table min-w-[750px]">
                <thead>
                  <tr>
                    <th className="text-left">Alumnus</th>
                    <th className="text-left">Arrival</th>
                    <th className="text-left">Departure</th>
                    <th className="text-left">Flight/Train</th>
                    <th className="text-left">Accommodation</th>
                    <th className="text-left">Diet</th>
                  </tr>
                </thead>
                <tbody>
                  {(stats?.travelDetails||[]).map((t: any) => (
                    <tr key={t.userId}>
                      <td>
                        <div className="font-medium text-sm" style={{color:'#003366'}}>{t.userName}</div>
                        <div className="text-xs text-gray-400">{t.programme}</div>
                      </td>
                      <td className="text-sm">
                        <div>{t.arrivalDate}</div>
                        <div className="text-xs text-gray-400">{t.arrivalTime} · {t.arrivalMode}</div>
                      </td>
                      <td className="text-sm">
                        <div>{t.departureDate}</div>
                        <div className="text-xs text-gray-400">{t.departureTime} · {t.departureMode}</div>
                      </td>
                      <td className="text-sm text-gray-600">{t.flightTrainNumber || '—'}</td>
                      <td>
                        {t.accommodationRequired
                          ? <span className="badge-gold capitalize">{t.accommodationPreference}</span>
                          : <span className="text-xs text-gray-400">Not needed</span>}
                      </td>
                      <td className="text-sm text-gray-600 capitalize">{t.dietaryPreference}</td>
                    </tr>
                  ))}
                  {!(stats?.travelDetails?.length) && (
                    <tr><td colSpan={6} className="text-center py-12 text-gray-400">No travel submissions yet</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
