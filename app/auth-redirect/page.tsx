'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthRedirectPage() {
  const router = useRouter();
  const [msg, setMsg] = useState('Signing you in…');

  useEffect(() => {
    const check = async () => {
      // Retry up to 5 times with increasing delay (session cookie may take a moment)
      for (let attempt = 1; attempt <= 5; attempt++) {
        await new Promise(r => setTimeout(r, attempt * 400));
        
        try {
          const res = await fetch('/api/profile', { cache: 'no-store' });
          const profile = await res.json();
          
          if (!profile || profile.error) {
            if (attempt < 5) { setMsg('Verifying identity…'); continue; }
            router.replace('/login');
            return;
          }

          // Admin → admin panel
          if (profile.isAdmin) { router.replace('/admin'); return; }

          // Rejected → login with error
          if (profile.status === 'rejected') { router.replace('/login?error=rejected'); return; }

          // Approved AND profile complete → dashboard (most common returning user path)
          if (profile.status === 'approved' && profile.profileSubmitted) {
            router.replace('/dashboard');
            return;
          }

          // Profile not yet filled → complete profile form
          if (!profile.profileSubmitted) {
            router.replace('/complete-profile');
            return;
          }

          // Pending approval
          router.replace('/pending');
          return;

        } catch (err) {
          if (attempt < 5) continue;
          router.replace('/login');
        }
      }
    };

    check();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#003366' }}>
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4" />
        <p className="text-white font-display text-lg">{msg}</p>
        <p className="text-blue-300 text-sm mt-1">Please wait</p>
      </div>
    </div>
  );
}
