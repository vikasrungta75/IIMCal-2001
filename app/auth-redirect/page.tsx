'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function AuthRedirectPage() {
  const router = useRouter();
  const { data: session, status, update } = useSession();
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    if (status === 'loading') return;
    if (status === 'unauthenticated') { router.replace('/login'); return; }
    if (checking) return;
    setChecking(true);

    // Force refresh session then check DB directly via API
    update().then(() => {
      fetch('/api/profile')
        .then(r => r.json())
        .then(profile => {
          if (!profile || profile.error) { router.replace('/login'); return; }
          if (profile.isAdmin) { router.replace('/admin'); return; }
          if (profile.status === 'rejected') { router.replace('/login?error=rejected'); return; }
          if (!profile.profileSubmitted) { router.replace('/complete-profile'); return; }
          if (profile.status === 'pending') { router.replace('/pending'); return; }
          if (profile.status === 'approved') { router.replace('/dashboard'); return; }
          router.replace('/complete-profile');
        })
        .catch(() => router.replace('/login'));
    });
  }, [status]);

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#003366' }}>
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4" />
        <p className="text-white font-display text-lg">Signing you in…</p>
        <p className="text-blue-300 text-sm mt-1">Please wait</p>
      </div>
    </div>
  );
}
