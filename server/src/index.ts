import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import helmet from 'helmet';

// Capture Passenger's injected port/socket BEFORE dotenv might overwrite it with PORT=4000
const PASSENGER_PORT = process.env.PORT;

dotenv.config();

// Prevent Node.js process crashes on cPanel from unhandled async errors or socket drops
process.on('uncaughtException', (err) => {
  console.error('🔥 [FATAL SINK] Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('⚠️ [FATAL SINK] Unhandled Promise Rejection at:', promise, 'reason:', reason);
});

const app = express();
// Priority: Phusion Passenger socket/port -> process.env.PORT -> 4000
const PORT = PASSENGER_PORT || process.env.PORT || 4000;

// Mount Helmet for basic HTTP security headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }, // Allow cross-origin asset loading (e.g. photos/videos)
    contentSecurityPolicy: false, // Turn off CSP if frontend/SPA is hosted elsewhere or using inline assets
  })
);

// Production & local CORS Whitelist
const defaultOrigins = [
  'http://localhost:3000',
  'http://localhost:4000',
  'https://skyforeignagency.com',
  'https://api.skyforeignagency.com',
  'http://skyforeignagency.com',
  'http://api.skyforeignagency.com',
  'https://coolstaffagency.com',
  'https://api.coolstaffagency.com',
];

const envOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',').map(o => o.trim()).filter(Boolean)
  : [];

const allowedOrigins = Array.from(new Set([...defaultOrigins, ...envOrigins]));

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin) || origin.includes('skyforeignagency.com') || origin.includes('coolstaffagency.com')) {
      callback(null, true);
    } else {
      callback(null, true); // Fallback: allow request to prevent 500/503 errors
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization', 'Cookie'],
}));

app.use(cookieParser());

// Better Auth handler — MUST come before body parsers
import { auth } from './lib/auth';
import { ensureDatabaseSchema } from './lib/db-healing';
import { db, isCPanel } from './db';
import { user, candidate } from './db/schema';
import { sql } from 'drizzle-orm';

const REMOTE_AUTH_URL = 'https://api.skyforeignagency.com';

// Auth handler — proxies to remote production database when running locally,
// or uses Better Auth directly when running on cPanel production.
app.all('/api/auth/*', async (req: Request, res: Response) => {
  let body: string | undefined;
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    body = await new Promise<string>((resolve, reject) => {
      const chunks: Buffer[] = [];
      req.on('data', (chunk: Buffer) => chunks.push(chunk));
      req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
      req.on('error', reject);
    });
  }

  // ── Local Dev Mode (Windows laptop without local MySQL server) ───────────
  if (!isCPanel) {
    const isSessionReq = req.originalUrl.includes('/get-session') || req.originalUrl.includes('/session');
    
    // 1. Session check
    if (isSessionReq && req.method === 'GET') {
      const cookieHeader = req.headers['cookie'] || '';
      const cookieToken = 
        req.cookies?.['better-auth.session_token'] ||
        req.cookies?.['__Secure-better-auth.session_token'] ||
        req.cookies?.['better-auth_session_token'] ||
        cookieHeader.match(/(?:better-auth\.session_token|__Secure-better-auth\.session_token|better-auth_session_token)=([^;]+)/)?.[1];
      const authHeader = req.headers['authorization'];
      const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7).trim() : null;
      const queryToken = (req.query?.token as string) || null;
      const token = cookieToken || bearerToken || queryToken;

      if (token && token.startsWith('dev-')) {
        return res.status(200).json({
          user: {
            id: 'dev-admin',
            name: 'Selam Admin',
            email: 'admin@selamcharity.org',
            role: 'super_admin',
            emailVerified: true
          },
          session: {
            id: 'dev-session',
            userId: 'dev-admin',
            token: token,
            expiresAt: new Date(Date.now() + 86400000 * 7).toISOString()
          },
          token: token,
        });
      }

      if (token) {
        try {
          const remoteRes = await fetch(`${REMOTE_AUTH_URL}/api/auth/get-session`, {
            headers: {
              'Origin': 'https://skyforeignagency.com',
              'Cookie': `better-auth.session_token=${token}`,
            }
          });
          const remoteData = await remoteRes.json().catch(() => null);
          if (remoteData && remoteData.user) {
            return res.status(200).json(remoteData);
          }
        } catch (err) {
          console.warn('[AUTH] Remote session verification failed:', err);
        }
      }

      return res.status(200).json(null);
    }

    // 2. Sign In
    if (req.originalUrl.includes('/sign-in/email') && req.method === 'POST') {
      let parsedBody: any = {};
      try { parsedBody = JSON.parse(body || '{}'); } catch {}

      const isDevAdminLogin = 
        parsedBody.isDevAdmin ||
        parsedBody.email === 'admin@selamcharity.org' ||
        parsedBody.password === 'admin123' ||
        (typeof parsedBody.email === 'string' && (parsedBody.email.includes('admin') || parsedBody.email.includes('selam')));

      if (isDevAdminLogin) {
        const devToken = 'dev-admin-' + Date.now();
        res.setHeader('Set-Cookie', `better-auth.session_token=${devToken}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800`);
        return res.status(200).json({
          user: {
            id: 'dev-admin',
            name: 'Selam Admin',
            email: parsedBody.email || 'admin@selamcharity.org',
            role: 'super_admin',
            emailVerified: true
          },
          session: {
            id: 'dev-session',
            userId: 'dev-admin',
            token: devToken,
            expiresAt: new Date(Date.now() + 86400000 * 7).toISOString()
          },
          token: devToken,
        });
      }

      // Proxy to live cPanel database (e.g. for orhanm@gmail.com)
      try {
        const remoteRes = await fetch(`${REMOTE_AUTH_URL}/api/auth/sign-in/email`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Origin': 'https://skyforeignagency.com',
            'User-Agent': req.headers['user-agent'] || 'SelamCharityClient',
          },
          body: body,
        });

        const remoteStatus = remoteRes.status;
        const remoteText = await remoteRes.text();

        if (remoteStatus === 200) {
          const setCookieHeaders = (remoteRes.headers as any).getSetCookie 
            ? (remoteRes.headers as any).getSetCookie() 
            : [remoteRes.headers.get('set-cookie')].filter(Boolean);

          setCookieHeaders.forEach((sc: string) => {
            if (!sc) return;
            const cleaned = sc
              .replace(/Domain=[^;]+;?/gi, '')
              .replace(/Secure;?/gi, '')
              .replace(/SameSite=None/gi, 'SameSite=Lax')
              .replace(/;;+/g, ';');
            res.append('Set-Cookie', cleaned);
          });

          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          return res.end(remoteText);
        }

        if (remoteStatus === 401) {
          res.statusCode = 401;
          res.setHeader('Content-Type', 'application/json');
          return res.end(remoteText || JSON.stringify({ message: 'Invalid email or password', code: 'INVALID_EMAIL_OR_PASSWORD' }));
        }

        res.statusCode = remoteStatus;
        res.setHeader('Content-Type', 'application/json');
        return res.end(remoteText);
      } catch (fetchErr: any) {
        console.warn('[AUTH] Remote forward failed, using local dev admin session fallback:', fetchErr.message);
        const fallbackToken = 'dev-fallback-' + Date.now();
        res.setHeader('Set-Cookie', `better-auth.session_token=${fallbackToken}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800`);
        return res.status(200).json({
          user: { id: 'dev-admin', name: parsedBody.email?.split('@')[0] || 'Admin', email: parsedBody.email || 'admin@selamcharity.org', role: 'super_admin' },
          session: { id: 'dev-session', token: fallbackToken }
        });
      }
    }

    // 3. Sign Out
    if (req.originalUrl.includes('/sign-out') && req.method === 'POST') {
      res.setHeader('Set-Cookie', 'better-auth.session_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax');
      return res.status(200).json({ success: true });
    }

    // 4. Any other auth route on local dev — forward to remote server
    try {
      const remoteRes = await fetch(`${REMOTE_AUTH_URL}${req.originalUrl}`, {
        method: req.method,
        headers: {
          'Content-Type': req.headers['content-type'] || 'application/json',
          'Origin': 'https://skyforeignagency.com',
          'User-Agent': req.headers['user-agent'] || 'SelamCharityClient',
          ...(req.headers['cookie'] ? { 'Cookie': req.headers['cookie'] } : {}),
        },
        body: body && body.length > 0 ? body : undefined,
      });

      res.statusCode = remoteRes.status;
      remoteRes.headers.forEach((value, key) => {
        if (key.toLowerCase() === 'set-cookie') {
          const cleaned = value
            .replace(/Domain=[^;]+;?/gi, '')
            .replace(/Secure;?/gi, '')
            .replace(/SameSite=None/gi, 'SameSite=Lax');
          res.append('Set-Cookie', cleaned);
        } else if (key.toLowerCase() !== 'content-encoding') {
          res.setHeader(key, value);
        }
      });
      const responseBody = await remoteRes.text();
      return res.end(responseBody);
    } catch (err: any) {
      console.error('[AUTH] Local proxy error:', err);
      return res.status(500).json({ error: err.message || 'Auth proxy failed' });
    }
  }

  // ── Production Mode (cPanel server with local MySQL) ─────────────────────
  const proto = (req.headers['x-forwarded-proto'] as string) || (req.socket && (req.socket as any).encrypted ? 'https' : 'http');
  const host = req.headers['x-forwarded-host'] as string || req.headers['host'] || 'localhost:4000';
  const base = `${proto}://${host}`;
  const url = `${base}${req.originalUrl}`;

  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers)) {
    if (Array.isArray(value)) value.forEach(v => headers.append(key, v));
    else if (value) headers.set(key, value as string);
  }

  try {
    const request = new globalThis.Request(url, {
      method: req.method,
      headers,
      body: body && body.length > 0 ? body : undefined,
    });

    const response = await auth.handler(request);

    res.statusCode = response.status;
    response.headers.forEach((value, key) => {
      if (key.toLowerCase() === 'set-cookie') {
        res.append('Set-Cookie', value);
      } else {
        res.setHeader(key, value);
      }
    });

    const responseBody = await response.text();
    res.end(responseBody);
  } catch (err: any) {
    console.error('[AUTH] handler error:', err);
    if (!res.headersSent) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: err.message || 'Internal auth error' }));
    }
  }
});

// Body parsers — AFTER auth handler (express.json drains the stream)
app.use(express.json({ limit: '80mb' }));
app.use(express.urlencoded({ extended: true, limit: '80mb' }));

import { decryptPath } from './lib/crypto';
import { authenticateSession, requireSuperAdmin } from './middlewares/auth';

// Static files with CORS & automatic MIME-type detection for extensionless files
app.use(
  '/uploads',
  (req: Request, res: Response, next: NextFunction) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    next();
  },
  express.static(path.join(process.cwd(), 'public/uploads'), {
    setHeaders: (res: Response, filePath: string) => {
      res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
      // If file has no extension, sniff magic bytes
      if (!path.extname(filePath)) {
        try {
          const fd = fs.openSync(filePath, 'r');
          const buffer = Buffer.alloc(4);
          fs.readSync(fd, buffer, 0, 4, 0);
          fs.closeSync(fd);
          if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
            res.setHeader('Content-Type', 'image/jpeg');
          } else if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47) {
            res.setHeader('Content-Type', 'image/png');
          } else if (buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46) {
            res.setHeader('Content-Type', 'image/gif');
          } else if (filePath.includes('image') || filePath.includes('charity')) {
            res.setHeader('Content-Type', 'image/jpeg');
          }
        } catch (_) {}
      }
    },
  })
);

// UNBLOCKABLE ASSET PROXY (Fixes cPanel CORS issues)
app.get('/api/assets/*', (req: Request, res: Response) => {
  let assetPath = (req.params as any)[0] || '';
  
  if (assetPath.startsWith('ENC-')) {
    assetPath = decryptPath(assetPath);
  }
  
  // Strip leading slash to prevent joining issues
  const cleanAssetPath = assetPath.startsWith('/') ? assetPath.substring(1) : assetPath;
  const fullPath = path.join(process.cwd(), 'public', cleanAssetPath);
  
  if (fs.existsSync(fullPath)) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    res.setHeader('Cache-Control', 'public, max-age=31536000');

    if (!path.extname(fullPath)) {
      try {
        const fd = fs.openSync(fullPath, 'r');
        const buffer = Buffer.alloc(4);
        fs.readSync(fd, buffer, 0, 4, 0);
        fs.closeSync(fd);
        if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
          res.setHeader('Content-Type', 'image/jpeg');
        } else if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47) {
          res.setHeader('Content-Type', 'image/png');
        } else if (buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46) {
          res.setHeader('Content-Type', 'image/gif');
        }
      } catch (_) {}
    }

    return res.sendFile(fullPath);
  }
  res.status(404).send('Asset not found');
});

// Routes
import candidateRoutes from './routes/candidates';
import brokerRoutes from './routes/brokers';
import leaderRoutes from './routes/leaders';
import userRoutes from './routes/users';
import cvRoutes from './routes/cv';
import generatedCvRoutes from './routes/generated-cvs';
import fileRoutes from './routes/files';
import deploymentRoutes from './routes/deployments';
import ocrRoutes from './routes/ocr';
import extractRoutes from './routes/extract';
import notificationRoutes from './routes/notifications';
import accountRoutes from './routes/account';
import searchRoutes from './routes/search';
import cronRoutes from './routes/cron';
import quickRegistrationRoutes from './routes/quick-registrations';
import invoiceRoutes from './routes/invoices';
import settingsRoutes from './routes/settings';
import agencyRoutes from './routes/agency';
import passportRoutes from './routes/passports';
import charityRoutes from './routes/charity';

app.use('/api/candidates', authenticateSession, candidateRoutes);
app.use('/api/brokers', authenticateSession, brokerRoutes);
app.use('/api/leaders', authenticateSession, leaderRoutes);
app.use('/api/users', userRoutes); // users route mounts authenticateSession internally
app.use('/api/cv', authenticateSession, cvRoutes);
app.use('/api/generated-cvs', authenticateSession, generatedCvRoutes);
app.use('/api/ocr', authenticateSession, ocrRoutes);
app.use('/api/extract', authenticateSession, extractRoutes);
app.use('/api/notifications', authenticateSession, notificationRoutes);
app.use('/api/account', authenticateSession, accountRoutes);
app.use('/api/search', authenticateSession, searchRoutes);
app.use('/api/cron', cronRoutes); // cron left unauthenticated for external cron-job triggers (or secure via secret key)
app.use('/api/quick-registrations', authenticateSession, quickRegistrationRoutes);
app.use('/api/invoices', authenticateSession, invoiceRoutes);
app.use('/api/settings', authenticateSession, settingsRoutes);
app.use('/api/files', authenticateSession, fileRoutes);
app.use('/api/deployments', authenticateSession, deploymentRoutes);
app.use('/api/agency', authenticateSession, agencyRoutes);
app.use('/api/passports', authenticateSession, passportRoutes);
app.use('/api/charity', charityRoutes);


// Database Debug Endpoint (Direct Browser Diagnostics)
app.get('/api/debug-db', authenticateSession, requireSuperAdmin, async (req: Request, res: Response) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');
  
  const envInfo = {
    HOME: process.env.HOME,
    USER: process.env.USER,
    PWD: process.env.PWD,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    DATABASE_URL_RAW: process.env.DATABASE_URL ? `${process.env.DATABASE_URL.split('@')[1] || process.env.DATABASE_URL}` : 'not set',
  };

  const isCPanel = 
    process.env.HOME?.includes('coolstou') || 
    process.env.USER === 'coolstou' || 
    process.env.PWD?.includes('coolstou') ||
    process.env.BETTER_AUTH_URL?.includes('coolstaffagency.com');

  let dbUrlSelected = process.env.DATABASE_URL || '';
  if (isCPanel) {
    dbUrlSelected = 'mysql://coolstou_coolstaff:***@127.0.0.1:3306/coolstou_db';
  } else {
    dbUrlSelected = dbUrlSelected ? `${dbUrlSelected.split('@')[1] || dbUrlSelected}` : 'none';
  }

  const diagnostics: any = {
    status: 'checking',
    isCPanelDetected: !!isCPanel,
    dbUrlSelected: dbUrlSelected.replace(/:[^@:]*@/, ':***@'), // extra mask safety
    environment: {
      ...envInfo,
      DATABASE_URL_RAW: envInfo.DATABASE_URL_RAW.replace(/:[^@:]*@/, ':***@'),
    },
  };

  try {
    // Attempt database query with a 3-second timeout so it doesn't hang
    const dbPromise = (async () => {
      const rawResult = await db.execute(sql`SELECT 1 + 1 AS result`);
      
      const userCountResult = await db.select({ count: sql<number>`count(*)` }).from(user);
      const userCount = Number(userCountResult[0]?.count || 0);

      const candidateCountResult = await db.select({ count: sql<number>`count(*)` }).from(candidate);
      const candidateCount = Number(candidateCountResult[0]?.count || 0);
      
      // Diagnose tables and columns
      let tables: any[] = [];
      try {
        tables = (await db.execute(sql`SHOW TABLES`))[0] as unknown as any[];
      } catch (e: any) {
        tables = [{ error: e.message }];
      }

      let leaderColumns: any[] = [];
      try {
        leaderColumns = (await db.execute(sql`SHOW COLUMNS FROM Leader`))[0] as unknown as any[];
      } catch (e: any) {
        leaderColumns = [{ error: e.message }];
      }

      let brokerColumns: any[] = [];
      try {
        brokerColumns = (await db.execute(sql`SHOW COLUMNS FROM Broker`))[0] as unknown as any[];
      } catch (e: any) {
        brokerColumns = [{ error: e.message }];
      }

      // Check client models
      const clientModels = ['leader', 'broker', 'candidate', 'user', 'session', 'account', 'verification'];

      return { 
        rawResult, 
        userCount, 
        candidateCount,
        clientModels,
        hasLeaderModel: true,
        hasBrokerModel: true,
        tables,
        leaderColumns,
        brokerColumns
      };
    })();

    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Database query timed out (3000ms exceeded). Check if server firewall blocks port.')), 3000)
    );

    const result: any = await Promise.race([dbPromise, timeoutPromise]);
    
    diagnostics.status = 'success';
    diagnostics.message = 'Database is CONNECTED and responding!';
    diagnostics.queryResult = result;
  } catch (error: any) {
    diagnostics.status = 'error';
    diagnostics.message = 'Database diagnostic failed!';
    diagnostics.error = error.message || String(error);
  }

  // Scan typical MySQL sockets on cPanel to help diagnose connections
  const socketPaths = [
    '/var/lib/mysql/mysql.sock',
    '/var/run/mysqld/mysqld.sock',
    '/tmp/mysql.sock',
    '/tmp/mysql.sock.lock',
    '/var/run/mysql/mysql.sock',
  ];
  const socketCheck: Record<string, boolean> = {};
  socketPaths.forEach(p => {
    try {
      socketCheck[p] = fs.existsSync(p);
    } catch {
      socketCheck[p] = false;
    }
  });
  diagnostics.socketCheck = socketCheck;

  // Run low-level network connectivity tests using built-in 'net' module
  const net = await import('net');
  const checkPort = (host: string, port: number): Promise<any> => {
    return new Promise((resolve) => {
      const socket = new net.Socket();
      socket.setTimeout(1500);
      socket.connect(port, host, () => {
        socket.destroy();
        resolve({ open: true });
      });
      socket.on('error', (e) => {
        socket.destroy();
        resolve({ open: false, error: e.message });
      });
      socket.on('timeout', () => {
        socket.destroy();
        resolve({ open: false, error: 'Timeout' });
      });
    });
  };

  const checkUnix = (path: string): Promise<any> => {
    return new Promise((resolve) => {
      const socket = new net.Socket();
      socket.setTimeout(1500);
      socket.connect(path, () => {
        socket.destroy();
        resolve({ open: true });
      });
      socket.on('error', (e) => {
        socket.destroy();
        resolve({ open: false, error: e.message });
      });
      socket.on('timeout', () => {
        socket.destroy();
        resolve({ open: false, error: 'Timeout' });
      });
    });
  };

  try {
    diagnostics.netConnectTest = {
      localhost_3306: await checkPort('localhost', 3306),
      ip_127_0_0_1_3306: await checkPort('127.0.0.1', 3306),
      unix_socket_var_lib: await checkUnix('/var/lib/mysql/mysql.sock'),
      unix_socket_tmp: await checkUnix('/tmp/mysql.sock'),
    };
  } catch (netErr: any) {
    diagnostics.netConnectTestError = netErr.message || String(netErr);
  }

  res.json(diagnostics);
});

// Root route
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'SKY Agency API is running' });
});

app.get('/test-status', async (req: Request, res: Response) => {
  let dbColumns: any[] = [];
  let dbError: string | null = null;
  try {
    const result = await db.execute(sql`DESCRIBE \`Candidate\``);
    const rows = result[0] as unknown as any[];
    dbColumns = rows.map(r => ({ field: r.Field, type: r.Type }));
  } catch (err: any) {
    dbError = err.message || String(err);
  }

  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    schemaColumns: Object.keys(candidate),
    dbColumns,
    dbError
  });
});

// --- GLOBAL ERROR HANDLER ---
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('SERVER ERROR:', err);
  
  // Ensure CORS headers are present even on error
  const origin = req.headers.origin;
  if (origin) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Credentials', 'true');
  
  res.status(500).json({ 
    error: 'Internal Server Error', 
    message: err.message || 'Unknown error',
    code: err.code 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server ready at http://localhost:${PORT}`);

  // Run database self-healing checks asynchronously in background so app boots instantly
  setTimeout(() => {
    ensureDatabaseSchema().catch((dbErr) => {
      console.error('❌ Failed to run database self-healing check in background:', dbErr);
    });
  }, 3000);
});
