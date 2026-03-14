import { NextResponse } from 'next/server';

export async function GET() {
  const clientId = process.env.AZURE_AD_CLIENT_ID;
  const clientSecret = process.env.AZURE_AD_CLIENT_SECRET;
  const tenantId = process.env.AZURE_AD_TENANT_ID || 'common';
  const nextauthUrl = process.env.NEXTAUTH_URL;

  if (!clientId || !clientSecret) {
    return NextResponse.json({
      clientId: clientId ? '✅' : '❌ MISSING',
      clientSecret: clientSecret ? '✅' : '❌ MISSING',
    });
  }

  // Test client credentials are valid by requesting an app token
  try {
    const testRes = await fetch(
      `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          scope: 'https://graph.microsoft.com/.default',
          grant_type: 'client_credentials',
        }),
      }
    );
    const data = await testRes.json();

    if (data.error) {
      return NextResponse.json({
        credentialsValid: false,
        error: data.error,
        errorDescription: data.error_description,
        fix: data.error === 'invalid_client'
          ? 'Client secret is WRONG or EXPIRED — create a new one in Azure Portal'
          : 'Check Azure app registration',
        clientSecretLength: clientSecret.length,
        redirectUri: `${nextauthUrl}/api/auth/callback/azure-ad`,
      });
    }

    return NextResponse.json({
      credentialsValid: true,
      message: '✅ Client ID and Secret are valid!',
      clientSecretLength: clientSecret.length,
      redirectUri: `${nextauthUrl}/api/auth/callback/azure-ad`,
      tokenType: data.token_type,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message });
  }
}
