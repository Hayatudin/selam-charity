import { createAuthClient } from 'better-auth/react';

const getAuthBaseUrl = () => {
  if (typeof window !== 'undefined') {
    // In browser, route requests through same origin (Next.js rewrite proxies /api/auth/* to backend)
    // This avoids cross-origin/cross-port cookie rejection in modern browsers
    return window.location.origin;
  }
  return process.env.NEXT_PUBLIC_BETTER_AUTH_URL || 'http://localhost:4000';
};

export const authClient = createAuthClient({
  baseURL: getAuthBaseUrl(),
  fetchOptions: {
    onRequest: (ctx) => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('selam_session_token');
        if (token) {
          ctx.headers.set('Authorization', `Bearer ${token}`);
        }
      }
    },
  },
  user: {
    additionalFields: {
      role: {
        type: 'string',
        defaultValue: 'user',
      },
      agency: {
        type: 'string',
      },
      majorAgency: {
        type: 'string',
      },
    },
  },
});

const baseSignOut = authClient.signOut;

export const signOut = async (options?: any) => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('selam_session_token');
    localStorage.removeItem('selam_user');
    document.cookie = 'better-auth.session_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
  }
  try {
    return await baseSignOut(options);
  } catch (e) {
    return { error: e };
  }
};

export const {
  signIn,
  signUp,
  useSession,
  getSession,
  changePassword,
  updateUser,
} = authClient;

