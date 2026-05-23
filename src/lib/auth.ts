// src/lib/auth.ts

import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { getSupabaseClient } from '@/storage/database/supabase-client';

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
            .select('id, email, name, image, plan_type')
            .eq('email', credentials.email)
            .maybeSingle();

          if (error || !data) {
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
};
