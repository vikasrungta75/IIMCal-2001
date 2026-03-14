'use client';
import { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // If already logged in, redirect appropriately
    if (status === 'loading') return;
    if (status === 'authenticated') {
      router.replace('/auth-redirect');
    }
  }, [status]);

  const handleOAuth = async (provider: 'google' | 'azure-ad') => {
    setLoading(provider);
    await signIn(provider, { callbackUrl: '/auth-redirect' });
  };

  if (status === 'loading' || status === 'authenticated') {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#003366' }}>
        <div className="w-10 h-10 border-4 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex" style={{ background: 'linear-gradient(160deg,#003366 0%,#001a33 55%,#0a1628 100%)' }}>
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-end p-12">
        <img src="/images/campus.jpg" alt="IIM Calcutta Campus" className="absolute inset-0 w-full h-full object-cover opacity-30" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,26,51,0.95) 30%, rgba(0,51,102,0.3) 100%)' }} />
        <div className="relative z-10">
          <div className="badge-gold inline-block mb-4">Silver Jubilee 2027</div>
          <h2 className="font-display text-4xl font-bold text-white mb-3 leading-tight">
            Join the<br /><span style={{ color: '#C8A951' }}>Joka Reunion</span>
          </h2>
          <p className="text-blue-200 font-crimson text-xl leading-relaxed">
            Register with your Google or Microsoft account to join the Silver Jubilee portal.
          </p>
          <div className="gold-divider mt-6 w-32" />
          <p className="text-blue-300 text-sm mt-4">December 12–14, 2027 · Joka Campus, Kolkata</p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 py-20">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link href="/"><img src="/images/logo-white.svg" alt="IIM Calcutta" className="h-14 mx-auto mb-4 object-contain" /></Link>
            <h1 className="font-display text-3xl font-bold text-white mb-1">Register</h1>
            <p style={{ color: '#C8A951' }} className="text-sm">Batch 2001 Alumni Portal</p>
          </div>

          <div className="rounded-2xl p-8" style={{ background: 'rgba(255,255,255,0.97)' }}>
            <p className="text-sm font-semibold text-center mb-4" style={{ color: '#003366' }}>How it works</p>
            <div className="space-y-3 mb-6">
              {[
                { step:'1', text:'Sign in with Google or Microsoft' },
                { step:'2', text:'Fill in your Batch 2001 profile details' },
                { step:'3', text:'Admin verifies you\'re Batch 2001' },
                { step:'4', text:'Get full access to the portal' },
              ].map(({ step, text }) => (
                <div key={step} className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ background: '#003366' }}>{step}</div>
                  <p className="text-sm text-gray-600">{text}</p>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-5 space-y-3">
              <button onClick={() => handleOAuth('google')} disabled={loading !== null}
                className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all font-medium text-gray-700 disabled:opacity-50">
                {loading === 'google' ? <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" /> :
                  <svg width="20" height="20" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.8 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 2.9l5.7-5.7C34.5 6.5 29.5 4 24 4 12.95 4 4 12.95 4 24s8.95 20 20 20 20-8.95 20-20c0-1.3-.1-2.6-.4-3.9z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 16 19 12 24 12c3.1 0 5.8 1.1 8 2.9l5.7-5.7C34.5 6.5 29.5 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.3 35.3 26.8 36 24 36c-5.3 0-9.7-3.2-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4-4 5.4l6.2 5.2C41.2 34.9 44 29.9 44 24c0-1.3-.1-2.6-.4-3.9z"/></svg>
                }
                Register with Google
              </button>
              <button onClick={() => handleOAuth('azure-ad')} disabled={loading !== null}
                className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all font-medium text-gray-700 disabled:opacity-50">
                {loading === 'azure-ad' ? <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" /> :
                  <svg width="20" height="20" viewBox="0 0 21 21"><rect x="1" y="1" width="9" height="9" fill="#f25022"/><rect x="11" y="1" width="9" height="9" fill="#7fba00"/><rect x="1" y="11" width="9" height="9" fill="#00a4ef"/><rect x="11" y="11" width="9" height="9" fill="#ffb900"/></svg>
                }
                Register with Microsoft / Hotmail
              </button>
            </div>

            <p className="text-center mt-5 text-sm text-gray-500">
              Already registered?{' '}
              <Link href="/login" className="font-semibold hover:underline" style={{ color: '#003366' }}>Sign in here →</Link>
            </p>
          </div>
          <p className="text-center mt-5 text-blue-300 text-xs">
            <Link href="/" className="hover:text-white transition-colors">← Back to home</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
