'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function AuthRedirectPage() {
  const router = useRouter();
  const { status } = useSession();
  const [attempts, setAttempts] = useState(0);
  const [msg, setMsg] = useState('Signing you in…');

  useEffect(() => {
    // Wait for NextAuth session to be ready
    if (status === 'loading') return;
    if (status === 'unauthenticated') {
      router.replace('/login');
      return;
    }
    // Session is authenticated - now check DB profile
    checkProfile();
  }, [status]);

  const checkProfile = async (attempt = 0) => {
    if (attempt > 0) setMsg(`Verifying your account… (${attempt}/5)`);
    
    try {
      const res = await fetch('/api/profile', { cache: 'no-store' });
      
      if (!res.ok) {
        if (attempt < 5) {
          setTimeout(() => checkProfile(attempt + 1), 1000);
          return;
        }
        router.replace('/login');
        return;
      }

      const profile = await res.json();

      if (!profile || profile.error) {
        if (attempt < 5) {
          setTimeout(() => checkProfile(attempt + 1), 1000);
          return;
        }
        router.replace('/login');
        return;
      }

      if (profile.isAdmin) { router.replace('/admin'); return; }
      if (profile.status === 'rejected') { router.replace('/login?error=rejected'); return; }
      
      // Approved and profile complete → dashboard
      if (profile.status === 'approved' && profile.profileSubmitted) {
        router.replace('/dashboard');
        return;
      }
      
      // Profile not filled yet → complete it
      if (!profile.profileSubmitted) {
        router.replace('/complete-profile');
        return;
      }

      // Pending approval
      router.replace('/pending');

    } catch (err) {
      if (attempt < 5) {
        setTimeout(() => checkProfile(attempt + 1), 1000);
      } else {
        router.replace('/login');
      }
    }
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
