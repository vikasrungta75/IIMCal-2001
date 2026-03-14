import { NextResponse } from 'next/server';

export async function GET() {
  const clientId = process.env.AZURE_AD_CLIENT_ID;
  const clientSecret = process.env.AZURE_AD_CLIENT_SECRET;
  const tenantId = process.env.AZURE_AD_TENANT_ID || 'common';
  const nextauthUrl = process.env.NEXTAUTH_URL;

  if (!clientId || !clientSecret) {
    return NextResponse.json({ 
      error: 'Missing Azure credentials',
      clientId: clientId ? '✅ SET' : '❌ MISSING',
      clientSecret: clientSecret ? '✅ SET' : '❌ MISSING',
    });
  }

  // Test the token endpoint directly
  try {
    const redirectUri = `${nextauthUrl}/api/auth/callback/azure-ad`;
    
    const res = await fetch(
      `https://login.microsoftonline.com/${tenantId}/v2.0/.well-known/openid-configuration`
    );
    const config = await res.json();

    return NextResponse.json({
      status: 'Azure config reachable',
      tenantId,
      redirectUri,
      clientId: clientId.substring(0, 8) + '...',
      clientSecretLength: clientSecret.length,
      tokenEndpoint: config.token_endpoint,
      issuer: config.issuer,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message });
  }
}
