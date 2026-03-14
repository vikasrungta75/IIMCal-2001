'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { CheckCircle, User, Briefcase, MapPin, Mail } from 'lucide-react';

export default function CompleteProfilePage() {
  const [oauthData, setOauthData] = useState<any>(null);
  const [form, setForm] = useState({
    fullName: '', batch: '2001', programme: '',
    phone: '', company: '', designation: '', city: '', country: 'India', bio: '',
  });
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/me', { cache: 'no-store' }).then(r => r.json()).then(user => {
      if (!user || user.error) { router.replace('/login'); return; }
      if (user.status === 'approved') { router.replace('/dashboard'); return; }
      if (user.profileSubmitted) { router.replace('/pending'); return; }
      setOauthData(user);
      setForm(f => ({
        ...f,
        fullName: user.fullName || user.sessionName || '',
      }));
      setLoading(false);
    }).catch(() => router.replace('/login'));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const res = await fetch('/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, profileSubmitted: true, status: 'pending' }),
    });
    const updated = await res.json();
    setSaving(false);
    if (updated.status === 'approved') {
      router.replace('/dashboard');
    } else {
      setDone(true);
    }
  };

  const inp = (label: string, key: string, opts?: { type?: string; placeholder?: string; required?: boolean }) => (
    <div>
      <label className="block text-sm font-medium mb-1.5" style={{ color: '#003366' }}>
        {label}{(opts?.required !== false) ? ' *' : ''}
      </label>
      <input className="iimc-input" type={opts?.type || 'text'} placeholder={opts?.placeholder}
        required={opts?.required !== false}
        value={(form as any)[key]}
        onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))} />
    </div>
  );

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#003366' }}>
      <div className="w-10 h-10 border-4 border-white/20 border-t-white rounded-full animate-spin" />
    </div>
  );

  if (done) return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ background: 'linear-gradient(160deg,#003366 0%,#001a33 100%)' }}>
      <img src="/images/logo-white.svg" alt="IIM Calcutta" className="h-12 mb-8 object-contain" />
      <div className="bg-white rounded-2xl p-10 max-w-md w-full text-center shadow-2xl">
        <CheckCircle size={52} style={{ color: '#166534' }} className="mx-auto mb-5" />
        <h2 className="font-display text-2xl font-bold mb-3" style={{ color: '#003366' }}>Profile Submitted!</h2>
        <p className="text-gray-600 mb-4 leading-relaxed">
          Your profile is with the Silver Jubilee committee for verification.
        </p>
        <div className="rounded-xl p-4 mb-6 text-left space-y-2" style={{ background: '#f8f4ec' }}>
          <p className="text-sm text-gray-600 flex items-center gap-2">
            <Mail size={14} style={{ color: '#003366' }} />
            You'll receive an email at <strong>{oauthData?.email}</strong> once approved.
          </p>
          <p className="text-xs text-gray-500 ml-6">After approval, use the Login button to access the portal.</p>
        </div>
        <button onClick={() => signOut({ callbackUrl: '/' })} className="w-full gold-btn py-3 rounded-xl font-semibold">
          OK — I'll log in once approved
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(160deg,#003366 0%,#001a33 100%)' }}>
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <img src="/images/logo-white.svg" alt="IIM Calcutta" className="h-12 mx-auto mb-4 object-contain" />
          <h1 className="font-display text-3xl font-bold text-white mb-2">Complete Your Profile</h1>
          <p style={{ color: '#C8A951' }} className="font-crimson text-lg">IIM Calcutta · Batch 2001 · Silver Jubilee 2026</p>
        </div>

        {/* Email display (from OAuth - not editable) */}
        <div className="bg-white/10 rounded-xl px-5 py-3 mb-5 flex items-center gap-3">
          <Mail size={16} style={{ color: '#C8A951' }} />
          <div>
            <p className="text-white text-sm font-medium">{oauthData?.email}</p>
            <p className="text-blue-300 text-xs">Your registered email — approval notification will be sent here</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Personal */}
            <div className="flex items-center gap-2 pb-1">
              <User size={16} style={{ color: '#003366' }} />
              <h3 className="font-semibold" style={{ color: '#003366' }}>Personal Details</h3>
            </div>

            {inp('Full Name', 'fullName', { placeholder: 'As it appeared at IIMC' })}
            {inp('Phone Number', 'phone', { type: 'tel', placeholder: '+91 98765 43210' })}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#003366' }}>Batch Year *</label>
                <select className="iimc-input" value={form.batch} onChange={e => setForm(p => ({ ...p, batch: e.target.value }))} required>
                  <option value="2001">2001</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#003366' }}>Programme *</label>
                <select className="iimc-input" value={form.programme} onChange={e => setForm(p => ({ ...p, programme: e.target.value }))} required>
                  <option value="">Select</option>
                  <option value="PGDM">PGDM</option>
                  <option value="PGDCM">PGDCM</option>
                </select>
              </div>
            </div>

            {/* Professional */}
            <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
              <Briefcase size={16} style={{ color: '#003366' }} />
              <h3 className="font-semibold" style={{ color: '#003366' }}>Professional Details</h3>
            </div>

            {inp('Current Company', 'company', { placeholder: 'e.g. McKinsey & Company', required: false })}
            {inp('Designation', 'designation', { placeholder: 'e.g. Managing Director', required: false })}

            {/* Location */}
            <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
              <MapPin size={16} style={{ color: '#003366' }} />
              <h3 className="font-semibold" style={{ color: '#003366' }}>Location</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {inp('City', 'city', { placeholder: 'e.g. Mumbai', required: false })}
              {inp('Country', 'country', { placeholder: 'e.g. India', required: false })}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#003366' }}>
                Short Bio <span className="text-xs font-normal text-gray-400">(optional)</span>
              </label>
              <textarea className="iimc-input" rows={3}
                placeholder="A few lines about your journey since Joka…"
                value={form.bio}
                onChange={e => setForm(p => ({ ...p, bio: e.target.value }))} />
            </div>

            <button type="submit"
              disabled={saving || !form.fullName || !form.programme || !form.phone}
              className="w-full gold-btn py-4 rounded-xl font-bold text-base disabled:opacity-50">
              {saving ? 'Submitting…' : 'Submit for Approval →'}
            </button>

            <p className="text-center text-xs text-gray-400">
              An email will be sent to {oauthData?.email} when your profile is approved
            </p>
          </form>
        </div>

        <div className="text-center mt-6">
          <button onClick={() => signOut({ callbackUrl: '/' })} className="text-blue-300 text-sm hover:text-white">
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}
