import type { NextAuthConfig } from 'next-auth';
import { useSearchParams } from 'next/navigation'
import { useCallback } from 'react';

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');

      //-- if callbackUrl is null than use '/dashboard'
      //-- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing
      //-- this is needed because URL does not accept null as value only string|URL
      const fromUrl: string | URL = nextUrl.searchParams.get('callbackUrl') ?? new URL('/dashboard', nextUrl);

      if (isOnDashboard) {
        if (isLoggedIn) return true;

        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        return Response.redirect(new URL(fromUrl, nextUrl));
      }
      return true;
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;
