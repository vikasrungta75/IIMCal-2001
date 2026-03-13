'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import SafeImage from '@/components/SafeImage';
import { Eye, EyeOff, LogIn } from 'lucide-react';

export default function LoginPage() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState<string | null>(null);
  const router = useRouter();

  const handleCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading('credentials');
    setError('');
    const result = await signIn('credentials', {
      username: form.username,
      password: form.password,
      redirect: false,
    });
    if (result?.ok) {
      router.push('/dashboard');
      router.refresh();
    } else {
      setError('Invalid username or password');
    }
    setLoading(null);
  };

  const handleOAuth = async (provider: 'google' | 'azure-ad') => {
    setLoading(provider);
    await signIn(provider, { callbackUrl: '/dashboard' });
  };

  return (
    <div className="min-h-screen flex" style={{ background: 'linear-gradient(160deg,#003366 0%,#001a33 55%,#0a1628 100%)' }}>
      {/* Left: campus image panel (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-end p-12">
        <img
          src="/images/campus.svg"
          alt="IIM Calcutta Campus"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,26,51,0.95) 30%, rgba(0,51,102,0.3) 100%)' }} />
        <div className="relative z-10">
          <div className="badge-gold inline-block mb-4">Est. 1961</div>
          <h2 className="font-display text-4xl font-bold text-white mb-3 leading-tight">
            25 Years of<br />
            <span style={{ color: '#C8A951' }}>Joka Brotherhood</span>
          </h2>
          <p className="text-blue-200 font-crimson text-xl leading-relaxed">
            "The bonds forged at Joka last a lifetime — welcome home, batchmate."
          </p>
          <div className="gold-divider mt-6 w-32" />
          <p className="text-blue-300 text-sm mt-4">November 14–16, 2025 · Joka Campus, Kolkata</p>
        </div>
      </div>

      {/* Right: login form */}
      <div className="flex-1 flex items-center justify-center p-6 py-20">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link href="/">
              <SafeImage src="/images/logo-white.svg" alt="IIM Calcutta" className="h-14 mx-auto mb-4 object-contain" />
            </Link>
            <h1 className="font-display text-3xl font-bold text-white mb-1">Welcome Back</h1>
            <p style={{ color: '#C8A951' }} className="text-sm">Silver Jubilee Alumni Portal</p>
          </div>

          <div className="rounded-2xl p-8" style={{ background: 'rgba(255,255,255,0.97)' }}>
            {/* OAuth Buttons */}
            <div className="space-y-3 mb-6">
              <button onClick={() => handleOAuth('google')} disabled={loading !== null}
                className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all font-medium text-gray-700 disabled:opacity-50">
                {loading === 'google' ? <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" /> :
                  <svg width="20" height="20" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.8 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 2.9l5.7-5.7C34.5 6.5 29.5 4 24 4 12.95 4 4 12.95 4 24s8.95 20 20 20 20-8.95 20-20c0-1.3-.1-2.6-.4-3.9z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 16 19 12 24 12c3.1 0 5.8 1.1 8 2.9l5.7-5.7C34.5 6.5 29.5 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.3 35.3 26.8 36 24 36c-5.3 0-9.7-3.2-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4-4 5.4l6.2 5.2C41.2 34.9 44 29.9 44 24c0-1.3-.1-2.6-.4-3.9z"/></svg>
                }
                Continue with Google
              </button>

              <button onClick={() => handleOAuth('azure-ad')} disabled={loading !== null}
                className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all font-medium text-gray-700 disabled:opacity-50">
                {loading === 'azure-ad' ? <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" /> :
                  <svg width="20" height="20" viewBox="0 0 21 21"><rect x="1" y="1" width="9" height="9" fill="#f25022"/><rect x="11" y="1" width="9" height="9" fill="#7fba00"/><rect x="1" y="11" width="9" height="9" fill="#00a4ef"/><rect x="11" y="11" width="9" height="9" fill="#ffb900"/></svg>
                }
                Continue with Microsoft / Hotmail
              </button>
            </div>

            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-gray-400 font-medium">or sign in with username</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* Credentials form */}
            <form onSubmit={handleCredentials} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#003366' }}>Username</label>
                <input className="iimc-input" placeholder="Your username" value={form.username}
                  onChange={e => setForm(p => ({ ...p, username: e.target.value }))} required autoComplete="username" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#003366' }}>Password</label>
                <div className="relative">
                  <input className="iimc-input pr-12" type={showPw ? 'text' : 'password'} placeholder="Your password"
                    value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} required autoComplete="current-password" />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              {error && <div className="px-4 py-3 rounded-lg text-sm text-red-700 bg-red-50 border border-red-200">{error}</div>}
              <button type="submit" disabled={loading !== null}
                className="w-full gold-btn py-3 rounded-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-60">
                {loading === 'credentials' ? <div className="w-5 h-5 border-2 border-navy/30 border-t-navy rounded-full animate-spin" /> : <><LogIn size={18} />Sign In</>}
              </button>
            </form>

            <p className="text-center mt-5 text-sm text-gray-500">
              No account yet?{' '}
              <Link href="/register" className="font-semibold hover:underline" style={{ color: '#003366' }}>Register here</Link>
            </p>
            <div className="mt-4 p-3 rounded-lg text-xs text-center text-gray-500" style={{ background: '#f8f4ec' }}>
              Demo: <strong>admin</strong> / <strong>admin123</strong>
            </div>
          </div>
          <p className="text-center mt-5 text-blue-300 text-xs">
            <Link href="/" className="hover:text-white transition-colors">← Back to home</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
