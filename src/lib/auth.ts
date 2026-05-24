// src/lib/auth.ts

import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { getSupabaseClient } from '@/storage/database/supabase-client';
import { createHash } from 'crypto';

const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || 'https://ailiveonline.com';
const cookieDomain = appUrl.includes('ailiveonline.com') ? '.ailiveonline.com' : undefined;

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const supabase = getSupabaseClient();
          const { data, error } = await supabase
            .from('users')
            .select('id, email, name, image, plan_type, auth_provider_id')
            .eq('email', credentials.email)
            .eq('auth_provider', 'email')
            .maybeSingle();

          if (error || !data) {
            return null;
          }

          // Verify password (SHA-256 hash; use bcrypt in production)
          const hashedPassword = createHash('sha256').update(credentials.password).digest('hex');
          if (data.auth_provider_id !== hashedPassword) {
            return null;
          }

          return {
            id: data.id,
            email: data.email,
            name: data.name,
            image: data.image,
            planType: data.plan_type,
          };
        } catch {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.planType = (user as unknown as Record<string, unknown>).planType ?? 'free';
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as unknown as Record<string, unknown>).planType = token.planType;
        (session.user as unknown as Record<string, unknown>).id = token.id;
      }
      return session;
    },
  },
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
  cookies: cookieDomain
    ? {
        sessionToken: {
          name: '__Secure-next-auth.session-token',
          options: {
            httpOnly: true,
            sameSite: 'lax',
            path: '/',
            domain: cookieDomain,
            secure: true,
          },
        },
        callbackUrl: {
          name: '__Secure-next-auth.callback-url',
          options: {
            httpOnly: true,
            sameSite: 'lax',
            path: '/',
            domain: cookieDomain,
            secure: true,
          },
        },
        csrfToken: {
          name: '__Host-next-auth.csrf-token',
          options: {
            httpOnly: true,
            sameSite: 'lax',
            path: '/',
            secure: true,
          },
        },
      }
    : undefined,
};
