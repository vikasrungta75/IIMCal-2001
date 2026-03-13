'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';

const BATCHES = Array.from({ length: 12 }, (_, i) => `${1996 + i}`);
const PROGRAMMES = ['MBA','PGDM','MBAEx','CEMS MIM','PGDBA','PhD','Executive PhD','PGPEX-VLM'];

export default function CompleteProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [form, setForm] = useState({ batch: '1999', programme: 'MBA', company: '', designation: '', city: '', country: 'India', phone: '' });
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/profile').then(r => r.json()).then(u => {
      setUser(u);
      if (u.batch) router.push('/dashboard'); // Already complete
    });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await fetch('/api/profile', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    router.push('/dashboard');
  };

  return (
    <>
      <Navbar user={user ? { username: user.username, fullName: user.fullName, isAdmin: false } : null} />
      <div className="min-h-screen flex items-center justify-center px-4 py-24" style={{ background: 'linear-gradient(160deg,#003366,#001a33)' }}>
        <div className="w-full max-w-lg">
          <div className="text-center mb-8">
            <div className="text-4xl mb-3">🎓</div>
            <h1 className="font-display text-3xl font-bold text-white mb-2">Almost there, {user?.fullName?.split(' ')[0]}!</h1>
            <p style={{ color: '#C8A951' }} className="text-sm">Complete your IIMC alumni profile to continue</p>
          </div>
          <div className="rounded-2xl p-8" style={{ background: 'rgba(255,255,255,0.97)' }}>
            <form onSubmit={handleSave} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: '#003366' }}>Batch Year *</label>
                  <select className="iimc-input" value={form.batch} onChange={e => setForm(p => ({ ...p, batch: e.target.value }))} required>
                    {BATCHES.map(b => <option key={b}>{b}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: '#003366' }}>Programme *</label>
                  <select className="iimc-input" value={form.programme} onChange={e => setForm(p => ({ ...p, programme: e.target.value }))} required>
                    {PROGRAMMES.map(p => <option key={p}>{p}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#003366' }}>Company</label>
                <input className="iimc-input" placeholder="Current organisation" value={form.company} onChange={e => setForm(p => ({ ...p, company: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#003366' }}>Designation</label>
                <input className="iimc-input" placeholder="e.g. Managing Director" value={form.designation} onChange={e => setForm(p => ({ ...p, designation: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: '#003366' }}>City</label>
                  <input className="iimc-input" placeholder="Current city" value={form.city} onChange={e => setForm(p => ({ ...p, city: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: '#003366' }}>Country</label>
                  <input className="iimc-input" placeholder="Country" value={form.country} onChange={e => setForm(p => ({ ...p, country: e.target.value }))} />
                </div>
              </div>
              <button type="submit" disabled={saving} className="w-full gold-btn py-3 rounded-lg font-semibold disabled:opacity-60">
                {saving ? 'Saving…' : 'Complete Profile & Enter Portal →'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
