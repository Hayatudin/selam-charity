import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './schema';
import dotenv from 'dotenv';
import path from 'path';

// Load .env from multiple candidate paths
dotenv.config({ path: path.join(__dirname, '../../.env') });
dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config();

let dbUrl = process.env.DATABASE_URL || '';

// cPanel production auto-detect
export const isCPanel =
  process.env.IS_CPANEL === 'true' ||
  process.env.NODE_ENV === 'production' ||
  Boolean(process.env.HOME?.includes('/home/')) ||
  Boolean(process.env.PWD?.includes('/home/'));

if (!dbUrl) {
  console.warn('⚠️ DATABASE_URL is not set in .env. Checking cPanel environment...');
  if (isCPanel) {
    // Standard cPanel credential format for selamcen
    dbUrl = 'mysql://selamcen_user:@127.0.0.1:3306/selamcen_db';
    console.log('🤖 Defaulting to local cPanel MySQL socket/TCP: selamcen_db');
  }
}

// Strip ?ssl-mode=REQUIRED from URL — mysql2 handles SSL via pool options
let cleanUrl = dbUrl.replace(/[?&]ssl-mode=[^&]*/i, '').replace(/\?$/, '');

const isCloud = cleanUrl.includes('aivencloud.com') || cleanUrl.includes('rds.amazonaws.com');

// Robust URL parser that safely handles unencoded special characters in passwords
function parseConnectionDetails(urlStr: string) {
  try {
    // Regex matches: mysql://user:password@host:port/database
    const match = urlStr.match(/^mysql(?:2)?:\/\/(?:([^:]+):(.*)@)?([^:/]+)(?::(\d+))?\/(.+)$/);
    if (match) {
      const [, rawUser, rawPass, rawHost, rawPort, rawDb] = match;
      const host = rawHost === 'localhost' ? '127.0.0.1' : rawHost;
      return {
        user: decodeURIComponent(rawUser || 'selamcen_user'),
        password: decodeURIComponent(rawPass || ''),
        host: host || '127.0.0.1',
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

import fs from 'fs';

// Check for cPanel Unix sockets (standard across cPanel servers for fastest & most reliable local connection)
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

let poolOptions: mysql.PoolOptions;

if (unixSocket && !isCloud) {
  console.log(`🔌 DB target: Unix Socket (${unixSocket}) [DB: ${parsedDetails?.database || 'selamcen_db'}, User: ${parsedDetails?.user || 'selamcen_user'}]`);
  poolOptions = {
    socketPath: unixSocket,
    user: parsedDetails?.user || 'selamcen_user',
    password: parsedDetails?.password || '',
    database: parsedDetails?.database || 'selamcen_db',
    waitForConnections: true,
    connectionLimit: 15,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
    maxIdle: 15,
    idleTimeout: 60000,
    connectTimeout: 20000,
  };
} else if (parsedDetails && !isCloud) {
  console.log(`🔌 DB target: TCP ${parsedDetails.host}:${parsedDetails.port} [DB: ${parsedDetails.database}, User: ${parsedDetails.user}]`);
  poolOptions = {
    host: parsedDetails.host,
    port: parsedDetails.port,
    user: parsedDetails.user,
    password: parsedDetails.password,
    database: parsedDetails.database,
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
  // Normalize localhost -> 127.0.0.1 for MySQL TCP reliability on Node.js
  if (!isCloud && cleanUrl.includes('@localhost:')) {
    cleanUrl = cleanUrl.replace('@localhost:', '@127.0.0.1:');
  }

  console.log('🔌 DB target:', cleanUrl.replace(/:([^:@]{3})[^:@]*@/, ':***@'), isCloud ? '[SSL]' : '[TCP/IP]');

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
    ...(isCloud && {
      ssl: {
        rejectUnauthorized: false,
      },
    }),
  };
}

export const poolConnection = mysql.createPool(poolOptions);

export const db = drizzle(poolConnection, { schema, mode: 'default' });

