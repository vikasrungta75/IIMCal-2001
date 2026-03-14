'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { Clock, CheckCircle, Mail, RefreshCw } from 'lucide-react';

export default function PendingPage() {
  const [user, setUser] = useState<any>(null);
  const [checking, setChecking] = useState(false);
  const router = useRouter();

  useEffect(() => { check(); }, []);

  const check = async () => {
    setChecking(true);
    try {
      const res = await fetch('/api/me', { cache: 'no-store' });
      const data = await res.json();
      setUser(data);
      if (data?.status === 'approved') router.replace('/dashboard');
    } catch {}
    setChecking(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ background: 'linear-gradient(160deg,#003366 0%,#001a33 100%)' }}>
      <img src="/images/logo-white.svg" alt="IIM Calcutta" className="h-12 mb-8 object-contain" />

      <div className="bg-white rounded-2xl p-10 max-w-lg w-full text-center shadow-2xl">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
          style={{ background: 'rgba(200,169,81,0.15)' }}>
          <Clock size={32} style={{ color: '#C8A951' }} />
        </div>
        <h1 className="font-display text-3xl font-bold mb-3" style={{ color: '#003366' }}>
          Awaiting Approval
        </h1>
        <p className="text-gray-600 mb-6 leading-relaxed">
          {user?.fullName ? `Thank you, ${user.fullName}!` : 'Thank you!'} Your profile has been submitted and is pending review by the organising committee.
        </p>

        <div className="rounded-xl p-5 mb-6 text-left space-y-3" style={{ background: '#f8f4ec' }}>
          <div className="flex items-center gap-3">
            <CheckCircle size={16} style={{ color: '#166534' }} />
            <span className="text-sm text-gray-700">Profile submitted successfully</span>
          </div>
          <div className="flex items-center gap-3">
            <Clock size={16} style={{ color: '#C8A951' }} />
            <span className="text-sm text-gray-700">Under review — usually within 24 hours</span>
          </div>
          <div className="flex items-center gap-3">
            <Mail size={16} style={{ color: '#003366' }} />
            <span className="text-sm text-gray-700">
              Email notification will be sent to <strong>{user?.email || 'your email'}</strong>
            </span>
          </div>
        </div>

        <p className="text-xs text-gray-400 mb-6">
          Once approved, come back and use the <strong>Login</strong> button to access the portal.
        </p>

        <div className="space-y-3">
          <button onClick={check} disabled={checking}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-medium border-2 transition-all disabled:opacity-50"
            style={{ borderColor: '#003366', color: '#003366' }}>
            <RefreshCw size={16} className={checking ? 'animate-spin' : ''} />
            {checking ? 'Checking…' : 'Check Approval Status'}
          </button>
          <button onClick={() => signOut({ callbackUrl: '/' })}
            className="w-full py-3 rounded-xl font-medium text-gray-500 hover:bg-gray-50 border border-gray-200 transition-all">
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
