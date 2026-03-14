'use client';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

const ERROR_MESSAGES: Record<string, string> = {
  Configuration: 'Server configuration error. Contact the admin.',
  AccessDenied: 'Access denied. You may not have permission.',
  Verification: 'Token verification failed.',
  OAuthSignin: 'Error starting OAuth sign-in.',
  OAuthCallback: 'Error during OAuth callback — redirect URI may not match.',
  OAuthCreateAccount: 'Could not create account.',
  EmailCreateAccount: 'Could not create email account.',
  Callback: 'Error in callback handler.',
  OAuthAccountNotLinked: 'Account already linked to another provider.',
  SessionRequired: 'Please sign in to continue.',
  Default: 'An unexpected error occurred.',
};

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error') || 'Default';
  const message = ERROR_MESSAGES[error] || ERROR_MESSAGES.Default;

  return (
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'linear-gradient(160deg,#003366 0%,#001a33 100%)' }}>
      <div className="bg-white rounded-2xl p-10 max-w-md w-full text-center shadow-2xl">
        <div className="text-5xl mb-5">⚠️</div>
        <h1 className="font-display text-2xl font-bold mb-3" style={{ color: '#8B0000' }}>
          Sign-in Failed
        </h1>
        <p className="text-gray-600 mb-2">{message}</p>
        <div className="mt-3 mb-6 p-3 rounded-lg text-xs font-mono text-left" style={{ background: '#f5f5f5', color: '#666' }}>
          Error code: <strong>{error}</strong>
        </div>

        {error === 'OAuthCallback' && (
          <div className="mb-5 p-4 rounded-xl text-sm text-left" style={{ background: '#fff5f5', border: '1px solid #fecaca' }}>
            <p className="font-semibold text-red-700 mb-2">Common fixes for Microsoft/Hotmail:</p>
            <ul className="text-red-600 space-y-1 text-xs">
              <li>• Check redirect URI in Azure Portal matches exactly</li>
              <li>• Verify client secret hasn't expired</li>
              <li>• Check AZURE_AD_CLIENT_SECRET in Vercel env vars</li>
            </ul>
          </div>
        )}

        <Link href="/login"
          className="block w-full py-3 rounded-xl font-semibold text-white text-center"
          style={{ background: '#003366' }}>
          Back to Login
        </Link>
      </div>
    </div>
  );
}
