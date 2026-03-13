import GoogleProvider from 'next-auth/providers/google';
import AzureADProvider from 'next-auth/providers/azure-ad';
import CredentialsProvider from 'next-auth/providers/credentials';
import type { NextAuthOptions } from 'next-auth';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || 'PLACEHOLDER',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'PLACEHOLDER',
    }),
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID || 'PLACEHOLDER',
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET || 'PLACEHOLDER',
      tenantId: process.env.AZURE_AD_TENANT_ID || 'common',
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;
        const user = db.users.findByUsername(credentials.username);
        if (!user || !user.password) return null;
        const valid = await bcrypt.compare(credentials.password, user.password);
        if (!valid) return null;
        return {
          id: user.id, name: user.fullName, email: user.email, image: null,
          username: user.username, isAdmin: !!user.isAdmin,
        } as any;
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }: any) {
      if (account?.provider === 'google' || account?.provider === 'azure-ad') {
        const existing = db.users.findByEmail(user.email);
        if (!existing) {
          const base = (user.email as string).split('@')[0].replace(/[^a-z0-9]/gi, '').toLowerCase();
          const username = base + Math.floor(Math.random() * 900 + 100);
          db.users.create({
            id: uuidv4(), username, password: '',
            email: user.email, fullName: user.name || username,
            batch: '', programme: '',
            createdAt: new Date().toISOString(),
          });
        }
      }
      return true;
    },
    async jwt({ token, user, account }: any) {
      if (user) {
        token.username = user.username;
        token.isAdmin = user.isAdmin;
        token.userId = user.id;
      }
      if (account?.provider === 'google' || account?.provider === 'azure-ad') {
        const dbUser = db.users.findByEmail(token.email as string);
        if (dbUser) {
          token.username = dbUser.username;
          token.userId = dbUser.id;
          token.isAdmin = !!dbUser.isAdmin;
        }
      }
      return token;
    },
    async session({ session, token }: any) {
      if (token) {
        (session.user as any).username = token.username;
        (session.user as any).isAdmin = token.isAdmin;
        (session.user as any).userId = token.userId;
      }
      return session;
    },
  },
  pages: { signIn: '/login', error: '/login' },
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET || 'iimc-jubilee-secret',
};
