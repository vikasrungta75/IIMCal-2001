'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * After OAuth login, route based on DB status (always source of truth)
 */
export default function AuthRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    // Small delay to ensure session cookie is set
    setTimeout(() => {
      fetch('/api/profile')
        .then(r => r.json())
        .then(profile => {
          if (!profile || profile.error) { router.replace('/login'); return; }
          if (profile.isAdmin) { router.replace('/admin'); return; }
          if (profile.status === 'rejected') { router.replace('/login?error=rejected'); return; }
          if (!profile.profileSubmitted) { router.replace('/complete-profile'); return; }
          if (profile.status === 'approved') { router.replace('/dashboard'); return; }
          router.replace('/pending');
        })
        .catch(() => router.replace('/login'));
    }, 800);
  }, []);

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
