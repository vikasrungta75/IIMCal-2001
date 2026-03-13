'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { CheckCircle, User, Briefcase, MapPin, Phone } from 'lucide-react';

export default function CompleteProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [form, setForm] = useState({ fullName:'', batch:'', programme:'', phone:'', company:'', designation:'', city:'', country:'India', bio:'' });
  const [saving, setSaving] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/profile').then(r => r.json()).then(p => {
      if (!p || p.error) { router.replace('/login'); return; }
      if (p.status === 'approved') { router.replace('/dashboard'); return; }
      if (p.profileSubmitted) { router.replace('/pending'); return; }
      setProfile(p);
      setForm(f => ({ ...f, fullName: p.fullName || '', batch: p.batch || '', programme: p.programme || '' }));
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    // Save profile + mark as submitted for admin review
    await fetch('/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, profileSubmitted: true, status: 'pending' }),
    });
    setSubmitted(true);
    setSaving(false);
  };

  const f = (label: string, key: string, opts?: { placeholder?: string; type?: string; as?: 'textarea' }) => (
    <div>
      <label className="block text-sm font-medium mb-1.5" style={{ color: '#003366' }}>{label}</label>
      {opts?.as === 'textarea'
        ? <textarea className="iimc-input" rows={3} placeholder={opts.placeholder} value={(form as any)[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))} />
        : <input className="iimc-input" type={opts?.type || 'text'} placeholder={opts?.placeholder} value={(form as any)[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))} />
      }
    </div>
  );

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{ background: 'linear-gradient(160deg,#003366 0%,#001a33 100%)' }}>
        <div className="bg-white rounded-2xl p-10 max-w-md w-full text-center shadow-2xl">
          <CheckCircle size={48} style={{ color: '#166534' }} className="mx-auto mb-4" />
          <h2 className="font-display text-2xl font-bold mb-3" style={{ color: '#003366' }}>Profile Submitted!</h2>
          <p className="text-gray-600 mb-6">Your profile is now with the Silver Jubilee committee for verification. You'll be able to log in once approved — usually within 24 hours.</p>
          <button onClick={() => signOut({ callbackUrl: '/' })} className="w-full gold-btn py-3 rounded-xl font-semibold">OK, got it</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(160deg,#003366 0%,#001a33 100%)' }}>
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <img src="/images/logo-white.svg" alt="IIM Calcutta" className="h-14 mx-auto mb-4 object-contain" />
          <h1 className="font-display text-3xl font-bold text-white mb-2">Complete Your Profile</h1>
          <p style={{ color: '#C8A951' }} className="font-crimson text-lg">Help us verify you're part of Batch 1999–2001</p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-2xl">
          <div className="rounded-xl p-4 mb-6 text-sm" style={{ background: '#f0f7ff', border: '1px solid #bde0fe' }}>
            <p className="text-blue-800 font-medium mb-1">🔒 Why do we verify?</p>
            <p className="text-blue-700 text-xs">This ensures only genuine Batch 1999–2001 alumni can access the portal and your batchmates' contact information.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex items-center gap-2 mb-2">
              <User size={16} style={{ color: '#003366' }} />
              <h3 className="font-semibold" style={{ color: '#003366' }}>Personal Details</h3>
            </div>
            {f('Full Name *', 'fullName', { placeholder: 'As it appeared at IIMC' })}
            {f('Phone Number *', 'phone', { type: 'tel', placeholder: '+91 98765 43210' })}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#003366' }}>Batch Year *</label>
                <select className="iimc-input" value={form.batch} onChange={e => setForm(p => ({ ...p, batch: e.target.value }))} required>
                  <option value="">Select batch</option>
                  {['1999','2000','2001'].map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#003366' }}>Programme *</label>
                <select className="iimc-input" value={form.programme} onChange={e => setForm(p => ({ ...p, programme: e.target.value }))} required>
                  <option value="">Select programme</option>
                  {['MBA','MBAEx','FPM','PGDBA','PGPEX-VLM'].map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-2 mb-2 pt-2 border-t border-gray-100">
              <Briefcase size={16} style={{ color: '#003366' }} />
              <h3 className="font-semibold" style={{ color: '#003366' }}>Professional Details</h3>
            </div>
            {f('Current Company', 'company', { placeholder: 'e.g. McKinsey & Company' })}
            {f('Designation / Role', 'designation', { placeholder: 'e.g. Managing Director' })}

            <div className="flex items-center gap-2 mt-2 mb-2 pt-2 border-t border-gray-100">
              <MapPin size={16} style={{ color: '#003366' }} />
              <h3 className="font-semibold" style={{ color: '#003366' }}>Location</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {f('City', 'city', { placeholder: 'e.g. Mumbai' })}
              {f('Country', 'country', { placeholder: 'e.g. India' })}
            </div>

            {f('Short Bio (optional)', 'bio', { as: 'textarea', placeholder: 'A few lines about your journey since Joka…' })}

            <button type="submit" disabled={saving || !form.fullName || !form.batch || !form.programme || !form.phone}
              className="w-full gold-btn py-4 rounded-xl font-bold text-base disabled:opacity-50 mt-2">
              {saving ? 'Submitting…' : 'Submit for Approval →'}
            </button>
            <p className="text-center text-xs text-gray-400">Your profile will be reviewed by the organising committee</p>
          </form>
        </div>

        <div className="text-center mt-6">
          <button onClick={() => signOut({ callbackUrl: '/' })} className="text-blue-300 text-sm hover:text-white">Sign out</button>
        </div>
      </div>
    </div>
  );
}
