import { 
  mysqlTable, 
  varchar, 
  boolean, 
  timestamp, 
  index, 
  uniqueIndex, 
  text, 
  datetime 
} from 'drizzle-orm/mysql-core';
import { sql } from 'drizzle-orm';
import { createId } from '@paralleldrive/cuid2';

// ==========================================
// 1. CORE USER TABLE
// ==========================================
export const user = mysqlTable('User', {
  id: varchar('id', { length: 191 }).primaryKey().$defaultFn(() => createId()),
  name: varchar('name', { length: 191 }).notNull(),
  email: varchar('email', { length: 191 }).notNull(),
  emailVerified: boolean('emailVerified').notNull().default(false),
  image: varchar('image', { length: 191 }),
  role: varchar('role', { length: 191 }).notNull().default('user'),
  agency: varchar('agency', { length: 191 }),
  majorAgency: varchar('major_agency', { length: 191 }).default('Sky'),
  createdAt: timestamp('createdAt', { fsp: 3 }).notNull().default(sql`CURRENT_TIMESTAMP(3)`),
  updatedAt: timestamp('updatedAt', { fsp: 3 }).notNull().default(sql`CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)`),
}, (table) => ({
  emailIdx: index('User_email_idx').on(table.email),
  roleIdx: index('User_role_idx').on(table.role),
  emailUniqueIdx: uniqueIndex('User_email_key').on(table.email),
}));

// ==========================================
// 2. CORE SESSION TABLE
// ==========================================
export const session = mysqlTable('Session', {
  id: varchar('id', { length: 191 }).primaryKey().$defaultFn(() => createId()),
  expiresAt: datetime('expiresAt', { fsp: 3 }).notNull(),
  token: varchar('token', { length: 191 }).notNull().unique(),
  createdAt: timestamp('createdAt', { fsp: 3 }).notNull().default(sql`CURRENT_TIMESTAMP(3)`),
  updatedAt: timestamp('updatedAt', { fsp: 3 }).notNull().default(sql`CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)`),
  ipAddress: varchar('ipAddress', { length: 191 }),
  userAgent: text('userAgent'),
  userId: varchar('userId', { length: 191 }).notNull(),
}, (table) => ({
  tokenIdx: index('Session_token_idx').on(table.token),
  userIdIdx: index('Session_userId_idx').on(table.userId),
  tokenUniqueIdx: uniqueIndex('Session_token_key').on(table.token),
}));

// ==========================================
// 3. CORE ACCOUNT TABLE
// ==========================================
export const account = mysqlTable('Account', {
  id: varchar('id', { length: 191 }).primaryKey().$defaultFn(() => createId()),
  accountId: varchar('accountId', { length: 191 }).notNull(),
  providerId: varchar('providerId', { length: 191 }).notNull(),
  accessToken: text('accessToken'),
  refreshToken: text('refreshToken'),
  idToken: text('idToken'),
  accessTokenExpiresAt: datetime('accessTokenExpiresAt', { fsp: 3 }),
  refreshTokenExpiresAt: datetime('refreshTokenExpiresAt', { fsp: 3 }),
  scope: varchar('scope', { length: 191 }),
  password: varchar('password', { length: 191 }),
  createdAt: timestamp('createdAt', { fsp: 3 }).notNull().default(sql`CURRENT_TIMESTAMP(3)`),
  updatedAt: timestamp('updatedAt', { fsp: 3 }).notNull().default(sql`CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)`),
  userId: varchar('userId', { length: 191 }).notNull(),
}, (table) => ({
  userIdIdx: index('Account_userId_idx').on(table.userId),
  providerIdAccountIdIdx: index('Account_providerId_accountId_idx').on(table.providerId, table.accountId),
}));

// ==========================================
// 4. CORE VERIFICATION TABLE
// ==========================================
export const verification = mysqlTable('Verification', {
  id: varchar('id', { length: 191 }).primaryKey().$defaultFn(() => createId()),
  identifier: varchar('identifier', { length: 191 }).notNull(),
  value: varchar('value', { length: 191 }).notNull(),
  expiresAt: datetime('expiresAt', { fsp: 3 }).notNull(),
  createdAt: timestamp('createdAt', { fsp: 3 }).notNull().default(sql`CURRENT_TIMESTAMP(3)`),
  updatedAt: timestamp('updatedAt', { fsp: 3 }).notNull().default(sql`CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)`),
}, (table) => ({
  identifierIdx: index('Verification_identifier_idx').on(table.identifier),
}));

// ==========================================
// 5. CORE NOTIFICATION TABLE
// ==========================================
export const notification = mysqlTable('Notification', {
  id: varchar('id', { length: 191 }).primaryKey().$defaultFn(() => createId()),
  title: varchar('title', { length: 191 }).notNull(),
  message: varchar('message', { length: 191 }).notNull(),
  isRead: boolean('isRead').notNull().default(false),
  candidateId: varchar('candidateId', { length: 191 }),
  majorAgency: varchar('major_agency', { length: 191 }).default('Sky'),
  createdAt: timestamp('createdAt', { fsp: 3 }).notNull().default(sql`CURRENT_TIMESTAMP(3)`),
}, (table) => ({
  createdAtIdx: index('Notification_createdAt_idx').on(table.createdAt),
  isReadIdx: index('Notification_isRead_idx').on(table.isRead),
}));
