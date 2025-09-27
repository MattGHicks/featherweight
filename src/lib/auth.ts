import { NextAuthOptions } from 'next-auth';
import EmailProvider from 'next-auth/providers/email';
import GitHubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';

import { PrismaAdapter } from '@auth/prisma-adapter';

import { prisma } from './prisma';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
    ...(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET
      ? [
          GitHubProvider({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
          }),
        ]
      : []),
  ],
  pages: {
    signIn: '/login',
    signOut: '/login',
    error: '/login',
    verifyRequest: '/login',
  },
  callbacks: {
    async session({ token, session }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.picture;
      }

      return session;
    },
    async jwt({ token, user, account }) {
      if (!token.email) {
        return token;
      }

      // If this is a new sign-in (user object exists)
      if (user) {
        token.id = user.id;
        return token;
      }

      // For subsequent requests, get user from database
      const dbUser = await prisma.user.findFirst({
        where: {
          email: token.email,
        },
      });

      if (!dbUser) {
        // This shouldn't happen with Prisma adapter, but handle gracefully
        return token;
      }

      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        picture: dbUser.image,
      };
    },
    async signIn({ user, account, profile }) {
      // Allow all sign-ins - Prisma adapter will handle user creation
      return true;
    },
  },
  events: {
    async createUser({ user }) {
      console.log(`New user created: ${user.email} (${user.id})`);
    },
    async signIn({ user, account, isNewUser }) {
      if (isNewUser) {
        console.log(`New user signed in: ${user.email}`);
      } else {
        console.log(`Existing user signed in: ${user.email}`);
      }
    },
  },
  session: {
    strategy: 'jwt',
  },
};
