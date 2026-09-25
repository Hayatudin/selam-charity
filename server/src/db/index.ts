import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './schema';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Force override existing cached environment variables with .env file values
dotenv.config({ path: path.join(__dirname, '../../.env'), override: true });
dotenv.config({ path: path.join(__dirname, '../.env'), override: true });
dotenv.config({ path: path.join(__dirname, '.env'), override: true });
dotenv.config({ path: path.resolve(process.cwd(), '.env'), override: true });
dotenv.config({ override: true });

let dbUrl = process.env.DATABASE_URL || '';

// cPanel production auto-detect
export const isCPanel =
  process.env.IS_CPANEL === 'true' ||
  process.env.NODE_ENV === 'production' ||
  Boolean(process.env.HOME?.includes('/home/')) ||
  Boolean(process.env.PWD?.includes('/home/'));

if (!dbUrl && !process.env.DB_USER) {
  console.warn('⚠️ DATABASE_URL is not set in .env. Checking cPanel environment...');
  if (isCPanel) {
    dbUrl = 'mysql://selamcen_user:@localhost:3306/selamcen_db';
    console.log('🤖 Defaulting to local cPanel MySQL socket/TCP: selamcen_db');
  }
}

// Strip ?ssl-mode=REQUIRED from URL
let cleanUrl = dbUrl.replace(/[?&]ssl-mode=[^&]*/i, '').replace(/\?$/, '');

const isCloud = cleanUrl.includes('aivencloud.com') || cleanUrl.includes('rds.amazonaws.com');

// Robust URL parser that safely handles unencoded special characters in passwords
function parseConnectionDetails(urlStr: string) {
  try {
    const match = urlStr.match(/^mysql(?:2)?:\/\/(?:([^:]+):(.*)@)?([^:/]+)(?::(\d+))?\/(.+)$/);
    if (match) {
      const [, rawUser, rawPass, rawHost, rawPort, rawDb] = match;
      return {
        user: decodeURIComponent(rawUser || 'selamcen_user'),
        password: decodeURIComponent(rawPass || ''),
        host: rawHost || 'localhost',
        port: rawPort ? parseInt(rawPort, 10) : 3306,
        database: (rawDb || 'selamcen_db').split('?')[0],
      };
    }
  } catch (err) {
    console.warn('⚠️ Regex URL parse warning, fallback to direct URI:', err);
  }
  return null;
}

const parsedDetails = parseConnectionDetails(cleanUrl);

// Support both discrete DB_ variables AND parsed DATABASE_URL
export const effectiveUser = process.env.DB_USER || parsedDetails?.user || 'selamcen_user';
export const effectivePassword = process.env.DB_PASSWORD !== undefined ? process.env.DB_PASSWORD : (parsedDetails?.password || '');
export const effectiveDatabase = process.env.DB_NAME || parsedDetails?.database || 'selamcen_db';
export const effectiveHost = process.env.DB_HOST || parsedDetails?.host || 'localhost';
export const effectivePort = process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : (parsedDetails?.port || 3306);

// Check for cPanel Unix sockets (native Unix socket on cPanel)
const candidateSockets = [
  '/var/lib/mysql/mysql.sock',
  '/tmp/mysql.sock',
  '/var/run/mysqld/mysqld.sock',
  '/var/run/mysql/mysql.sock',
];
const unixSocket = candidateSockets.find((s) => {
  try {
    return fs.existsSync(s);
  } catch {
    return false;
  }
});

export const dbConfigDiagnostic = {
  effectiveUser,
  effectiveDatabase,
  effectiveHost,
  effectivePort,
  socketPath: unixSocket || null,
  isCloud,
  hasDiscretePassword: Boolean(process.env.DB_PASSWORD),
  passwordLength: effectivePassword.length,
  passwordFirstChar: effectivePassword.length > 0 ? effectivePassword[0] : null,
  passwordLastChar: effectivePassword.length > 0 ? effectivePassword[effectivePassword.length - 1] : null,
};

let poolOptions: mysql.PoolOptions;

if (unixSocket && !isCloud) {
  console.log(`🔌 DB target: Unix Socket (${unixSocket}) [DB: ${effectiveDatabase}, User: ${effectiveUser}]`);
  poolOptions = {
    socketPath: unixSocket,
    user: effectiveUser,
    password: effectivePassword,
    database: effectiveDatabase,
    waitForConnections: true,
    connectionLimit: 15,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
    maxIdle: 15,
    idleTimeout: 60000,
    connectTimeout: 20000,
  };
} else if (!isCloud) {
  const host = effectiveHost === 'localhost' ? '127.0.0.1' : effectiveHost;
  console.log(`🔌 DB target: TCP ${host}:${effectivePort} [DB: ${effectiveDatabase}, User: ${effectiveUser}]`);
  poolOptions = {
    host: host,
    port: effectivePort,
    user: effectiveUser,
    password: effectivePassword,
    database: effectiveDatabase,
    waitForConnections: true,
    connectionLimit: 15,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
    maxIdle: 15,
    idleTimeout: 60000,
    connectTimeout: 20000,
  };
} else {
  poolOptions = {
    uri: cleanUrl,
    waitForConnections: true,
    connectionLimit: 15,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
    maxIdle: 15,
    idleTimeout: 60000,
    connectTimeout: 20000,
    ssl: {
      rejectUnauthorized: false,
    },
  };
}

export const poolConnection = mysql.createPool(poolOptions);

export const db = drizzle(poolConnection, { schema, mode: 'default' });
