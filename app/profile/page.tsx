'use client';
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { Save, User, Briefcase, MapPin, Phone, Link2, FileText } from 'lucide-react';

const PROGRAMMES = ['MBA', 'PGDM', 'MBAEx', 'CEMS MIM', 'PGDBA', 'PhD', 'Executive PhD', 'PGPEX-VLM'];
const BATCHES = Array.from({ length: 10 }, (_, i) => `${1997 + i}`);

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [form, setForm] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/profile').then(r => r.json()).then(data => {
      setUser(data);
      setForm(data);
      setLoading(false);
    });
  }, []);

  const set = (k: string, v: string) => setForm((p: any) => ({ ...p, [k]: v }));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    const res = await fetch('/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      const updated = await res.json();
      setUser(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } else {
      setError('Failed to save');
    }
    setSaving(false);
  };

  if (loading) return (
    <>
      <Navbar user={null} />
      <div className="pt-32 text-center text-gray-500">Loading…</div>
    </>
  );

  return (
    <>
      <Navbar user={{ username: user.username, fullName: user.fullName, isAdmin: !!user.isAdmin }} />
      <main className="pt-20 pb-12 px-4 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 mt-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white"
              style={{ background: 'linear-gradient(135deg, #003366, #C8A951)' }}>
              {user.fullName?.charAt(0)}
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold" style={{ color: '#003366' }}>{user.fullName}</h1>
              <p className="text-gray-500 text-sm">@{user.username} · {user.programme} {user.batch}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSave}>
          <div className="space-y-6">
            {/* Personal Info */}
            <div className="iimc-card p-6">
              <div className="flex items-center gap-2 mb-5">
                <User size={18} style={{ color: '#003366' }} />
                <h2 className="font-semibold text-lg" style={{ color: '#003366' }}>Personal Information</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-700">Full Name *</label>
                  <input className="iimc-input" value={form.fullName || ''} onChange={e => set('fullName', e.target.value)} required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-700">Email *</label>
                  <input className="iimc-input" type="email" value={form.email || ''} onChange={e => set('email', e.target.value)} required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-700">Batch Year</label>
                  <select className="iimc-input" value={form.batch || '1999'} onChange={e => set('batch', e.target.value)}>
                    {BATCHES.map(b => <option key={b}>{b}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-700">Programme</label>
                  <select className="iimc-input" value={form.programme || 'MBA'} onChange={e => set('programme', e.target.value)}>
                    {PROGRAMMES.map(p => <option key={p}>{p}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Professional Info */}
            <div className="iimc-card p-6">
              <div className="flex items-center gap-2 mb-5">
                <Briefcase size={18} style={{ color: '#003366' }} />
                <h2 className="font-semibold text-lg" style={{ color: '#003366' }}>Professional Details</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-700">Current Company</label>
                  <input className="iimc-input" placeholder="Company name" value={form.company || ''} onChange={e => set('company', e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-700">Designation</label>
                  <input className="iimc-input" placeholder="e.g. Managing Director" value={form.designation || ''} onChange={e => set('designation', e.target.value)} />
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="iimc-card p-6">
              <div className="flex items-center gap-2 mb-5">
                <Phone size={18} style={{ color: '#003366' }} />
                <h2 className="font-semibold text-lg" style={{ color: '#003366' }}>Contact & Location</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-700">Phone</label>
                  <input className="iimc-input" placeholder="+91 9XXXXXXXXX" value={form.phone || ''} onChange={e => set('phone', e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-700">LinkedIn URL</label>
                  <input className="iimc-input" placeholder="https://linkedin.com/in/..." value={form.linkedIn || ''} onChange={e => set('linkedIn', e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-700">City</label>
                  <input className="iimc-input" placeholder="Current city" value={form.city || ''} onChange={e => set('city', e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-700">Country</label>
                  <input className="iimc-input" placeholder="Country" value={form.country || ''} onChange={e => set('country', e.target.value)} />
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="iimc-card p-6">
              <div className="flex items-center gap-2 mb-5">
                <FileText size={18} style={{ color: '#003366' }} />
                <h2 className="font-semibold text-lg" style={{ color: '#003366' }}>About Me</h2>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5 text-gray-700">Bio / Message to Batchmates</label>
                <textarea
                  className="iimc-input resize-none"
                  rows={4}
                  placeholder="Share a little about your journey since IIMC — achievements, family, passions…"
                  value={form.bio || ''}
                  onChange={e => set('bio', e.target.value)}
                />
              </div>
            </div>

            {error && <div className="px-4 py-3 rounded-lg text-sm text-red-700 bg-red-50 border border-red-200">{error}</div>}

            {saved && (
              <div className="px-4 py-3 rounded-lg text-sm text-green-700 bg-green-50 border border-green-200 flex items-center gap-2">
                ✅ Profile saved successfully!
              </div>
            )}

            <button type="submit" disabled={saving}
              className="gold-btn px-8 py-3 rounded-lg font-semibold flex items-center gap-2 disabled:opacity-60">
              {saving ? <div className="w-4 h-4 border-2 border-navy/30 border-t-navy rounded-full animate-spin" /> : <Save size={18} />}
              {saving ? 'Saving…' : 'Save Profile'}
            </button>
          </div>
        </form>
      </main>
    </>
  );
}
