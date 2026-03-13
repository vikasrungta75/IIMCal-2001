'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import SafeImage from '@/components/SafeImage';
import { Eye, EyeOff, UserPlus, Check } from 'lucide-react';

const BATCHES = Array.from({ length: 10 }, (_, i) => `${1997 + i}`);
const PROGRAMMES = ['MBA', 'PGDM', 'MBAEx', 'CEMS MIM', 'PGDBA', 'PhD', 'Executive PhD', 'PGPEX-VLM'];

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    username: '', password: '', confirmPassword: '',
    email: '', fullName: '', batch: '1999', programme: 'MBA',
    phone: '', company: '', designation: '', city: '', country: 'India',
  });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setError('');
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (res.ok) {
      setSuccess(true);
      setTimeout(() => router.push('/dashboard'), 2000);
    } else {
      setError(data.error || 'Registration failed');
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(160deg, #003366 0%, #001a33 100%)' }}>
        <div className="text-center text-white">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(200,169,81,0.2)', border: '2px solid #C8A951' }}>
            <Check size={36} style={{ color: '#C8A951' }} />
          </div>
          <h2 className="font-display text-3xl font-bold mb-2">Welcome, {form.fullName.split(' ')[0]}!</h2>
          <p style={{ color: '#C8A951' }}>Registration successful. Redirecting to your dashboard…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(160deg, #003366 0%, #001a33 60%, #0a1628 100%)' }}>
      <div className="flex-1 flex items-center justify-center p-4 py-20">
        <div className="w-full max-w-lg">
          <div className="text-center mb-8">
            <Link href="/">
              <SafeImage src="https://www.iimcal.ac.in/sites/default/files/white-logo.png" alt="IIM Calcutta" className="h-14 mx-auto mb-6 object-contain" />
            </Link>
            <h1 className="font-display text-3xl font-bold text-white mb-1">Join the Reunion</h1>
            <p style={{ color: '#C8A951' }} className="text-sm">Silver Jubilee Alumni Portal Registration</p>
          </div>

          {/* Steps */}
          <div className="flex items-center justify-center gap-0 mb-8">
            {[1, 2].map((s, i) => (
              <div key={s} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${step >= s ? 'text-navy' : 'text-white/50'}`}
                  style={{ background: step >= s ? '#C8A951' : 'rgba(255,255,255,0.15)' }}>
                  {step > s ? <Check size={14} /> : s}
                </div>
                <span className={`ml-2 text-xs ${step >= s ? 'text-white' : 'text-white/40'}`}>
                  {s === 1 ? 'Account' : 'Profile'}
                </span>
                {i < 1 && <div className="w-10 h-px mx-4 bg-white/20" />}
              </div>
            ))}
          </div>

          <div className="rounded-2xl p-8" style={{ background: 'rgba(255,255,255,0.95)' }}>
            {step === 1 ? (
              <form onSubmit={handleStep1} className="space-y-4">
                <h3 className="font-semibold text-lg mb-4" style={{ color: '#003366' }}>Account Credentials</h3>

                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: '#003366' }}>Full Name *</label>
                  <input className="iimc-input" placeholder="e.g. Rahul Kumar Sharma" value={form.fullName}
                    onChange={e => set('fullName', e.target.value)} required />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: '#003366' }}>Username *</label>
                    <input className="iimc-input" placeholder="Choose username" value={form.username}
                      onChange={e => set('username', e.target.value.toLowerCase().replace(/\s/g, ''))} required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: '#003366' }}>Email *</label>
                    <input className="iimc-input" type="email" placeholder="your@email.com" value={form.email}
                      onChange={e => set('email', e.target.value)} required />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: '#003366' }}>Batch *</label>
                    <select className="iimc-input" value={form.batch} onChange={e => set('batch', e.target.value)} required>
                      {BATCHES.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: '#003366' }}>Programme *</label>
                    <select className="iimc-input" value={form.programme} onChange={e => set('programme', e.target.value)} required>
                      {PROGRAMMES.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium mb-1.5" style={{ color: '#003366' }}>Password *</label>
                  <input className="iimc-input pr-12" type={showPw ? 'text' : 'password'}
                    placeholder="Minimum 6 characters" value={form.password}
                    onChange={e => set('password', e.target.value)} required />
                  <button type="button" onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 bottom-3 text-gray-400 hover:text-gray-600">
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: '#003366' }}>Confirm Password *</label>
                  <input className="iimc-input" type="password" placeholder="Repeat password" value={form.confirmPassword}
                    onChange={e => set('confirmPassword', e.target.value)} required />
                </div>

                {error && <div className="px-4 py-3 rounded-lg text-sm text-red-700 bg-red-50 border border-red-200">{error}</div>}

                <button type="submit" className="w-full gold-btn py-3 rounded-lg font-semibold">
                  Continue to Profile →
                </button>
              </form>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="font-semibold text-lg mb-4" style={{ color: '#003366' }}>Professional Details</h3>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: '#003366' }}>Phone</label>
                    <input className="iimc-input" placeholder="+91 9XXXXXXXXX" value={form.phone}
                      onChange={e => set('phone', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: '#003366' }}>Company</label>
                    <input className="iimc-input" placeholder="Your organisation" value={form.company}
                      onChange={e => set('company', e.target.value)} />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: '#003366' }}>Designation</label>
                  <input className="iimc-input" placeholder="e.g. Managing Director" value={form.designation}
                    onChange={e => set('designation', e.target.value)} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: '#003366' }}>City</label>
                    <input className="iimc-input" placeholder="Current city" value={form.city}
                      onChange={e => set('city', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: '#003366' }}>Country</label>
                    <input className="iimc-input" placeholder="Country" value={form.country}
                      onChange={e => set('country', e.target.value)} />
                  </div>
                </div>

                {error && <div className="px-4 py-3 rounded-lg text-sm text-red-700 bg-red-50 border border-red-200">{error}</div>}

                <div className="flex gap-3">
                  <button type="button" onClick={() => setStep(1)}
                    className="flex-1 py-3 rounded-lg font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
                    ← Back
                  </button>
                  <button type="submit" disabled={loading}
                    className="flex-1 gold-btn py-3 rounded-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-60">
                    {loading ? <div className="w-5 h-5 border-2 border-navy/30 border-t-navy rounded-full animate-spin" /> : <><UserPlus size={18} /> Register</>}
                  </button>
                </div>
              </form>
            )}

            <p className="text-center mt-5 text-sm text-gray-500">
              Already registered? <Link href="/login" className="font-semibold hover:underline" style={{ color: '#003366' }}>Sign in here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
