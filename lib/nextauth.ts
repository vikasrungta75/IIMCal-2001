import GoogleProvider from 'next-auth/providers/google';
import AzureADProvider from 'next-auth/providers/azure-ad';
import CredentialsProvider from 'next-auth/providers/credentials';
import type { NextAuthOptions } from 'next-auth';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    // Only include Azure/Microsoft provider if credentials are configured
    ...(process.env.AZURE_AD_CLIENT_ID && process.env.AZURE_AD_CLIENT_SECRET ? [
      AzureADProvider({
        clientId: process.env.AZURE_AD_CLIENT_ID,
        clientSecret: process.env.AZURE_AD_CLIENT_SECRET,
        // 'consumers' supports personal Hotmail/Outlook/Live accounts
        // 'common' supports both personal + work/school
        tenantId: process.env.AZURE_AD_TENANT_ID || 'common',
        authorization: {
          params: {
            scope: 'openid profile email User.Read',
            response_type: 'code',
          },
        },
        profile(profile: any) {
          return {
            id: profile.sub ?? profile.oid,
            name: profile.name ?? profile.preferred_username,
            email: profile.email ?? profile.preferred_username,
            image: null,
          };
        },
      }),
    ] : []),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;
        try {
          const { db } = await import('@/lib/db');
          const user = await db.users.findByUsername(credentials.username);
          if (!user || !user.isAdmin || !user.password) return null;
          const valid = await bcrypt.compare(credentials.password, user.password);
          if (!valid) return null;
          return { id: user.id, name: user.fullName, email: user.email, image: null, username: user.username, isAdmin: true } as any;
        } catch (err) {
          console.error('[Auth] credentials error:', err);
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account, profile, error }: any) {
      if (error) console.error('[NextAuth signIn error]', error);
      // For OAuth providers - create user record if new, but NEVER throw
      if (account?.provider === 'google' || account?.provider === 'azure-ad') {
        try {
          const { db } = await import('@/lib/db');
          const existing = await db.users.findByEmail(user.email);
          if (!existing) {
            const base = (user.email as string).split('@')[0].replace(/[^a-z0-9]/gi, '').toLowerCase();
            const username = base + Math.floor(Math.random() * 900 + 100);
            await db.users.create({
              id: uuidv4(), username, password: '',
              email: user.email, fullName: user.name || username,
              batch: '', programme: '',
              createdAt: new Date().toISOString(),
              status: 'pending', profileSubmitted: false,
              oauthProvider: account.provider,
            });
          }
        } catch (err) {
          // Log but don't block sign-in — user record will be created on next API call
          console.error('[Auth] signIn DB error (non-fatal):', err);
        }
        return true; // Always allow OAuth sign-in
      }
      return true;
    },

    async jwt({ token, user, account }: any) {
      if (user) {
        token.username = (user as any).username;
        token.isAdmin = (user as any).isAdmin || false;
        token.userId = user.id;
      }
      // On initial OAuth sign-in, try to enrich token from DB
      if (account?.provider === 'google' || account?.provider === 'azure-ad') {
        try {
          const { db } = await import('@/lib/db');
          const dbUser = await db.users.findByEmail(token.email as string);
          if (dbUser) {
            token.username = dbUser.username;
            token.userId = dbUser.id;
            token.isAdmin = !!dbUser.isAdmin;
          }
        } catch (err) {
          console.error('[Auth] jwt DB error (non-fatal):', err);
        }
      }
      return token;
    },

    async session({ session, token }: any) {
      if (token) {
        (session.user as any).username = token.username || '';
        (session.user as any).isAdmin = token.isAdmin || false;
        (session.user as any).userId = token.userId || '';
      }
      return session;
    },
  },

  pages: { signIn: '/login', error: '/auth/error' },
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET || 'iimc-jubilee-secret',
};
