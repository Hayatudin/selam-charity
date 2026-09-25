import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '../db';
import * as schema from '../db/schema';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.join(__dirname, '../../.env') });
dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config();

const DEFAULT_AUTH_SECRET = '7fdf41a63c6838df2c028c2e2e71d3a6d71b3e8e8fb425d7b57b98d2ee2b4d81';
const authUrl = process.env.BETTER_AUTH_URL || 'https://api.selamcharity.org';

const getCookieDomain = () => {
  if (!authUrl.startsWith('https://')) return undefined;
  try {
    const parsed = new URL(authUrl);
    const parts = parsed.hostname.split('.');
    if (parts.length >= 2) {
      return '.' + parts.slice(-2).join('.');
    }
    return '.' + parsed.hostname;
  } catch {
    return undefined;
  }
};

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET || DEFAULT_AUTH_SECRET,
  baseURL: authUrl,
  database: drizzleAdapter(db, {
    provider: 'mysql',
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
    },
  }),

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
  },

  session: {
    expiresIn: 60 * 60 * 5,       // 5 hours
    updateAge: 60 * 60,           // 1 hour
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60,  // 1 hour client-side cache
    },
  },

  trustedOrigins: [
    'http://localhost:3000',
    'https://selamcharity.org',
    'https://www.selamcharity.org',
    'https://salamcharity.org',
    'https://www.salamcharity.org',
    // Dynamically loaded from TRUSTED_ORIGINS env var (comma-separated)
    ...(process.env.TRUSTED_ORIGINS
      ? process.env.TRUSTED_ORIGINS.split(',').map(o => o.trim()).filter(Boolean)
      : []),
  ],

  advanced: {
    basePath: '/api/auth',
    useSecureCookies: authUrl.startsWith('https://'),
    defaultCookieAttributes: {
      sameSite: (authUrl.startsWith('https://') ? "none" : "lax") as "none" | "lax",
      secure: authUrl.startsWith('https://'),
      domain: getCookieDomain(),
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
        required: false,
      },
      majorAgency: {
        type: 'string',
        required: false,
        fieldName: 'major_agency',
      },
    },
  },
});

export type Session = typeof auth.$Infer.Session;
export type AuthUser = typeof auth.$Infer.Session.user;
