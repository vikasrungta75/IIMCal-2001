'use client';
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { Save, User, Briefcase, MapPin, Phone, Link2, FileText, CheckCircle } from 'lucide-react';

const IMGS = {
  campus: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/IIM_Calcutta_MDC.jpg/1280px-IIM_Calcutta_MDC.jpg',
  kolkata: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Kolkata_yellow_taxi.jpg/1280px-Kolkata_yellow_taxi.jpg',
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [form, setForm] = useState<any>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/profile').then(r => r.json()).then(data => {
      setProfile(data);
      setForm({ ...data });
      setLoading(false);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await fetch('/api/profile', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    setSaved(true);
    setSaving(false);
    setTimeout(() => setSaved(false), 3000);
  };

  const field = (label: string, key: string, opts?: { type?: string; placeholder?: string; as?: 'textarea' }) => (
    <div>
      <label className="block text-sm font-medium mb-1.5" style={{ color: '#003366' }}>{label}</label>
      {opts?.as === 'textarea' ? (
        <textarea className="iimc-input" rows={3} placeholder={opts.placeholder} value={form[key] || ''} onChange={e => setForm((p: any) => ({ ...p, [key]: e.target.value }))} />
      ) : (
        <input className="iimc-input" type={opts?.type || 'text'} placeholder={opts?.placeholder} value={form[key] || ''} onChange={e => setForm((p: any) => ({ ...p, [key]: e.target.value }))} />
      )}
    </div>
  );

  return (
    <>
      <Navbar user={profile ? { username: profile.username, fullName: profile.fullName, isAdmin: profile.isAdmin } : null} />

      {/* Hero */}
      <div className="relative pt-16" style={{ height: 200 }}>
        <img src={IMGS.campus} alt="IIM Calcutta" className="absolute inset-0 w-full h-full object-cover" style={{ objectPosition: 'center 35%' }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(0,51,102,0.92), rgba(0,26,51,0.85))' }} />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
          <User size={34} style={{ color: '#C8A951' }} className="mb-2" />
          <h1 className="font-display text-4xl font-bold text-white mb-1">My Profile</h1>
          <p style={{ color: '#E8D5A3' }} className="font-crimson text-lg">Help your batchmates reconnect with you</p>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 py-10">
        {loading ? (
          <div className="text-center py-16 text-gray-400">Loading profile…</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Avatar + Name display */}
            <div className="iimc-card p-6 flex items-center gap-5">
              <div className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold text-white flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #003366, #C8A951)' }}>
                {form.fullName?.charAt(0) || '?'}
              </div>
              <div>
                <div className="font-display text-2xl font-bold" style={{ color: '#003366' }}>{form.fullName || 'Your Name'}</div>
                <div className="text-gray-500 text-sm">@{form.username} · {form.programme} Batch {form.batch}</div>
                {form.company && <div className="text-gray-600 text-sm mt-1">{form.designation ? `${form.designation}, ` : ''}{form.company}</div>}
              </div>
            </div>

            {/* Personal */}
            <div className="iimc-card p-6">
              <div className="flex items-center gap-2 mb-5">
                <User size={18} style={{ color: '#003366' }} />
                <h2 className="font-display text-lg font-bold" style={{ color: '#003366' }}>Personal Information</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {field('Full Name', 'fullName', { placeholder: 'Your full name' })}
                {field('Phone Number', 'phone', { type: 'tel', placeholder: '+91 98765 43210' })}
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: '#003366' }}>Batch Year</label>
                  <select className="iimc-input" value={form.batch || ''} onChange={e => setForm((p: any) => ({ ...p, batch: e.target.value }))}>
                    <option value="">Select batch</option>
                    {['1999', '2000', '2001'].map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: '#003366' }}>Programme</label>
                  <select className="iimc-input" value={form.programme || ''} onChange={e => setForm((p: any) => ({ ...p, programme: e.target.value }))}>
                    <option value="">Select programme</option>
                    {['MBA', 'MBAEx', 'FPM', 'PGDBA', 'PGPEX-VLM'].map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Professional */}
            <div className="iimc-card p-6">
              <div className="flex items-center gap-2 mb-5">
                <Briefcase size={18} style={{ color: '#003366' }} />
                <h2 className="font-display text-lg font-bold" style={{ color: '#003366' }}>Professional Details</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {field('Current Company', 'company', { placeholder: 'e.g. McKinsey & Company' })}
                {field('Designation / Role', 'designation', { placeholder: 'e.g. Managing Director' })}
              </div>
            </div>

            {/* Location */}
            <div className="iimc-card p-6">
              <div className="flex items-center gap-2 mb-5">
                <MapPin size={18} style={{ color: '#003366' }} />
                <h2 className="font-display text-lg font-bold" style={{ color: '#003366' }}>Location</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {field('City', 'city', { placeholder: 'e.g. Mumbai' })}
                {field('Country', 'country', { placeholder: 'e.g. India' })}
              </div>
            </div>

            {/* Bio & Links */}
            <div className="iimc-card p-6">
              <div className="flex items-center gap-2 mb-5">
                <FileText size={18} style={{ color: '#003366' }} />
                <h2 className="font-display text-lg font-bold" style={{ color: '#003366' }}>About You</h2>
              </div>
              <div className="space-y-4">
                {field('Short Bio', 'bio', { as: 'textarea', placeholder: 'A few lines about your journey since Joka…' })}
                {field('LinkedIn URL', 'linkedIn', { placeholder: 'https://linkedin.com/in/yourname' })}
              </div>
            </div>

            {/* Kolkata nostalgic image */}
            <div className="rounded-2xl overflow-hidden relative" style={{ height: 130 }}>
              <img src={IMGS.kolkata} alt="Kolkata" className="w-full h-full object-cover" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(0,51,102,0.85), rgba(0,51,102,0.3))' }} />
              <div className="absolute inset-0 flex items-center px-8">
                <p className="font-crimson text-xl text-white italic">"Keep your batchmates in the loop — update your profile today!"</p>
              </div>
            </div>

            <div className="flex justify-end">
              <button type="submit" disabled={saving}
                className="gold-btn px-8 py-3 rounded-xl font-semibold flex items-center gap-2 disabled:opacity-60">
                {saved ? <><CheckCircle size={18} /> Saved!</> : saving ? 'Saving…' : <><Save size={18} /> Save Profile</>}
              </button>
            </div>
          </form>
        )}
      </main>
    </>
  );
}
