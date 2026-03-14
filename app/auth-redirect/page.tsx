'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function AuthRedirectPage() {
  const { status } = useSession();
  const router = useRouter();
  const [msg, setMsg] = useState('Signing you in…');

  useEffect(() => {
    if (status === 'loading') return;
    if (status === 'unauthenticated') { router.replace('/login'); return; }
    
    // Session ready — check profile from DB
    let attempts = 0;
    const check = async () => {
      attempts++;
      if (attempts > 1) setMsg(`Setting up your account…`);
      
      try {
        const res = await fetch('/api/me', { cache: 'no-store' });
        if (!res.ok) throw new Error(`${res.status}`);
        const user = await res.json();
        if (!user || user.error) throw new Error('no user');

        if (user.isAdmin)                                       return router.replace('/admin');
        if (user.status === 'rejected')                         return router.replace('/login?error=rejected');
        if (user.status === 'approved' && user.profileSubmitted) return router.replace('/dashboard');
        if (!user.profileSubmitted)                             return router.replace('/complete-profile');
        return router.replace('/pending');
      } catch {
        if (attempts < 6) setTimeout(check, 1200);
        else router.replace('/login');
      }
    };
    
    check();
  }, [status]);

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#003366,#001a33)' }}>
      <div className="text-center">
        <img src="/images/logo-white.svg" alt="IIM Calcutta" className="h-12 mx-auto mb-8 object-contain opacity-80" />
        <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4" />
        <p className="text-white font-display text-lg">{msg}</p>
        <p className="text-blue-300 text-sm mt-2">Please wait</p>
      </div>
    </div>
  );
}
