'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { Clock, CheckCircle, Mail, RefreshCw } from 'lucide-react';

export default function PendingPage() {
  const [profile, setProfile] = useState<any>(null);
  const [checking, setChecking] = useState(false);
  const router = useRouter();

  const checkStatus = async () => {
    setChecking(true);
    const res = await fetch('/api/profile');
    const p = await res.json();
    setProfile(p);
    // If approved since last check, redirect to dashboard
    if (p?.status === 'approved') {
      router.replace('/dashboard');
    }
    setChecking(false);
  };

  useEffect(() => {
    checkStatus();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ background: 'linear-gradient(160deg,#003366 0%,#001a33 100%)' }}>
      <img src="/images/logo-white.svg" alt="IIM Calcutta" className="h-14 mb-8 object-contain" />

      <div className="bg-white rounded-2xl p-10 max-w-lg w-full text-center shadow-2xl">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
          style={{ background: 'rgba(200,169,81,0.15)' }}>
          <Clock size={32} style={{ color: '#C8A951' }} />
        </div>

        <h1 className="font-display text-3xl font-bold mb-3" style={{ color: '#003366' }}>
          Awaiting Approval
        </h1>
        <p className="text-gray-600 mb-6 leading-relaxed">
          Thank you, <strong>{profile?.fullName || 'Alumnus'}</strong>! Your profile is pending review by the Silver Jubilee organising committee.
        </p>

        <div className="rounded-xl p-5 mb-6 text-left space-y-3" style={{ background: '#f8f4ec' }}>
          <div className="flex items-center gap-3">
            <CheckCircle size={18} style={{ color: '#166534' }} />
            <span className="text-sm text-gray-700">Profile submitted successfully</span>
          </div>
          <div className="flex items-center gap-3">
            <Clock size={18} style={{ color: '#C8A951' }} />
            <span className="text-sm text-gray-700">Under review — usually within 24 hours</span>
          </div>
          <div className="flex items-center gap-3">
            <Mail size={18} style={{ color: '#003366' }} />
            <span className="text-sm text-gray-700">
              Email will be sent to <strong>{profile?.email || 'your address'}</strong> when approved
            </span>
          </div>
        </div>

        <p className="text-xs text-gray-400 mb-6">
          This verification ensures only genuine Batch 2001 alumni can access the portal.
        </p>

        <div className="space-y-3">
          <button
            onClick={checkStatus}
            disabled={checking}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-medium border-2 transition-all disabled:opacity-50"
            style={{ borderColor: '#003366', color: '#003366' }}
          >
            <RefreshCw size={16} className={checking ? 'animate-spin' : ''} />
            {checking ? 'Checking…' : 'Check Approval Status'}
          </button>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="w-full py-3 rounded-xl font-medium text-gray-500 hover:bg-gray-50 border border-gray-200 transition-all"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
