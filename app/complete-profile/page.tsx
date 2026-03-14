'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { CheckCircle, User, Briefcase, MapPin, Phone, Mail } from 'lucide-react';

export default function CompleteProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [form, setForm] = useState({
    fullName: '', email: '', batch: '', programme: '',
    phone: '', company: '', designation: '', city: '', country: 'India', bio: ''
  });
  const [saving, setSaving] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/profile').then(r => r.json()).then(p => {
      if (!p || p.error) { router.replace('/login'); return; }
      // Already approved — go straight to dashboard
      if (p.status === 'approved') { router.replace('/dashboard'); return; }
      // Already submitted — show pending page
      if (p.profileSubmitted) { router.replace('/pending'); return; }
      setProfile(p);
      // Pre-fill from OAuth data
      setForm(f => ({
        ...f,
        fullName: p.fullName || p.sessionName || '',
        email: p.email || '',
        batch: p.batch || '',
        programme: p.programme || '',
      }));
      setLoading(false);
    });
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
    // If admin pre-approved this email, go straight to dashboard
    if (updated.status === 'approved') {
      router.replace('/dashboard');
    } else {
      setSubmitted(true);
    }
  };

  const field = (label: string, key: string, opts?: { placeholder?: string; type?: string; required?: boolean }) => (
    <div>
      <label className="block text-sm font-medium mb-1.5" style={{ color: '#003366' }}>
        {label}{opts?.required !== false ? ' *' : ''}
      </label>
      <input
        className="iimc-input"
        type={opts?.type || 'text'}
        placeholder={opts?.placeholder}
        value={(form as any)[key]}
        onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
        required={opts?.required !== false}
      />
    </div>
  );

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#003366' }}>
      <div className="w-10 h-10 border-4 border-white/20 border-t-white rounded-full animate-spin" />
    </div>
  );

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4"
        style={{ background: 'linear-gradient(160deg,#003366 0%,#001a33 100%)' }}>
        <div className="bg-white rounded-2xl p-10 max-w-md w-full text-center shadow-2xl">
          <CheckCircle size={52} style={{ color: '#166534' }} className="mx-auto mb-5" />
          <h2 className="font-display text-2xl font-bold mb-3" style={{ color: '#003366' }}>Profile Submitted!</h2>
          <p className="text-gray-600 mb-3 leading-relaxed">
            Thank you, <strong>{form.fullName}</strong>! Your profile is with the Silver Jubilee committee for verification.
          </p>
          <div className="rounded-xl p-4 mb-5 text-left space-y-2" style={{ background: '#f8f4ec' }}>
            <p className="text-sm text-gray-600 flex items-center gap-2">
              <Mail size={14} style={{ color: '#003366' }} />
              You'll receive an email at <strong>{form.email}</strong> once approved.
            </p>
            <p className="text-sm text-gray-500">Usually within 24 hours.</p>
          </div>
          <button onClick={() => signOut({ callbackUrl: '/' })} className="w-full gold-btn py-3 rounded-xl font-semibold">
            Got it — Sign out
          </button>
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
          <p style={{ color: '#C8A951' }} className="font-crimson text-lg">Help us verify you're part of Batch 2001</p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-2xl">
          <div className="rounded-xl p-4 mb-6 text-sm" style={{ background: '#f0f7ff', border: '1px solid #bde0fe' }}>
            <p className="text-blue-800 font-medium mb-1">🔒 Why do we verify?</p>
            <p className="text-blue-700 text-xs">This ensures only genuine Batch 2001 alumni can access the portal and your batchmates' contact information. You'll get an email when approved.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Personal */}
            <div className="flex items-center gap-2 mb-1">
              <User size={16} style={{ color: '#003366' }} />
              <h3 className="font-semibold" style={{ color: '#003366' }}>Personal Details</h3>
            </div>
            {field('Full Name', 'fullName', { placeholder: 'As it appeared at IIMC' })}

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#003366' }}>
                Email Address * <span className="text-xs font-normal text-gray-400">(for approval notification)</span>
              </label>
              <input
                className="iimc-input bg-gray-50"
                type="email"
                value={form.email}
                readOnly
              />
              <p className="text-xs text-green-600 mt-1">✓ From your {profile?.oauthProvider === 'google' ? 'Google' : 'Microsoft'} account — cannot be changed</p>
            </div>

            {field('Phone Number', 'phone', { type: 'tel', placeholder: '+91 98765 43210' })}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#003366' }}>Batch Year *</label>
                <select className="iimc-input" value={form.batch} onChange={e => setForm(p => ({ ...p, batch: e.target.value }))} required>
                  <option value="">Select batch</option>
                  {['2001'].map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#003366' }}>Programme *</label>
                <select className="iimc-input" value={form.programme} onChange={e => setForm(p => ({ ...p, programme: e.target.value }))} required>
                  <option value="">Select programme</option>
                  {['PGDM','PGDCM'].map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            </div>

            {/* Professional */}
            <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
              <Briefcase size={16} style={{ color: '#003366' }} />
              <h3 className="font-semibold" style={{ color: '#003366' }}>Professional Details</h3>
            </div>
            {field('Current Company', 'company', { placeholder: 'e.g. McKinsey & Company', required: false })}
            {field('Designation / Role', 'designation', { placeholder: 'e.g. Managing Director', required: false })}

            {/* Location */}
            <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
              <MapPin size={16} style={{ color: '#003366' }} />
              <h3 className="font-semibold" style={{ color: '#003366' }}>Location</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {field('City', 'city', { placeholder: 'e.g. Mumbai', required: false })}
              {field('Country', 'country', { placeholder: 'e.g. India', required: false })}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#003366' }}>Short Bio <span className="text-xs font-normal text-gray-400">(optional)</span></label>
              <textarea className="iimc-input" rows={3}
                placeholder="A few lines about your journey since Joka…"
                value={form.bio}
                onChange={e => setForm(p => ({ ...p, bio: e.target.value }))}
              />
            </div>

            <button
              type="submit"
              disabled={saving || !form.fullName || !form.email || !form.batch || !form.programme || !form.phone}
              className="w-full gold-btn py-4 rounded-xl font-bold text-base disabled:opacity-50"
            >
              {saving ? 'Submitting…' : 'Submit for Approval →'}
            </button>
            <p className="text-center text-xs text-gray-400">
              You'll receive an email at {form.email || 'your address'} when approved
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
