'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function AuthRedirectPage() {
  const router = useRouter();
  const { status } = useSession();
  const [msg, setMsg] = useState('Signing you in…');

  useEffect(() => {
    if (status === 'loading') return;
    if (status === 'unauthenticated') { router.replace('/login'); return; }
    // Authenticated - check DB status
    route();
  }, [status]);

  const route = async () => {
    for (let i = 0; i < 6; i++) {
      if (i > 0) {
        setMsg(`Verifying… (${i}/5)`);
        await new Promise(r => setTimeout(r, 1000));
      }
      try {
        // Use /api/me which reads JWT directly - reliable even with NEXTAUTH_URL issues
        const res = await fetch('/api/me', { cache: 'no-store' });
        if (!res.ok) continue;
        const user = await res.json();
        if (!user || user.error) continue;

        if (user.isAdmin)                                  { router.replace('/admin');           return; }
        if (user.status === 'rejected')                    { router.replace('/login?error=rejected'); return; }
        if (user.status === 'approved' && user.profileSubmitted) { router.replace('/dashboard');  return; }
        if (!user.profileSubmitted)                        { router.replace('/complete-profile'); return; }
        router.replace('/pending');
        return;
      } catch {}
    }
    // All retries failed - send to login
    router.replace('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#003366' }}>
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4" />
        <p className="text-white font-display text-lg">{msg}</p>
        <p className="text-blue-300 text-sm mt-2">Please wait</p>
      </div>
    </div>
  );
}
