import { 
  mysqlTable, 
  varchar, 
  boolean, 
  timestamp, 
  index, 
  uniqueIndex, 
  text, 
  int, 
  json, 
  datetime, 
  longtext,
  decimal
} from 'drizzle-orm/mysql-core';
import { sql } from 'drizzle-orm';
import { createId } from '@paralleldrive/cuid2';

// ==========================================
// 1. CHARITY CAMPAIGN TABLE
// ==========================================
export const charityCampaign = mysqlTable('CharityCampaign', {
  id: varchar('id', { length: 191 }).primaryKey().$defaultFn(() => createId()),
  slug: varchar('slug', { length: 191 }).notNull().unique(),
  title: varchar('title', { length: 255 }).notNull(),
  subtitle: varchar('subtitle', { length: 500 }),
  description: longtext('description').notNull(),
  category: varchar('category', { length: 100 }).notNull().default('General'),
  targetAmount: decimal('targetAmount', { precision: 12, scale: 2 }).notNull().default('0.00'),
  raisedAmount: decimal('raisedAmount', { precision: 12, scale: 2 }).notNull().default('0.00'),
  currency: varchar('currency', { length: 10 }).notNull().default('ETB'),
  featuredImageUrl: text('featuredImageUrl'),
  galleryImages: json('galleryImages'),
  startDate: datetime('startDate', { fsp: 3 }),
  endDate: datetime('endDate', { fsp: 3 }),
  isFeatured: boolean('isFeatured').notNull().default(false),
  status: varchar('status', { length: 50 }).notNull().default('draft'), // draft, active, paused, completed
  createdById: varchar('createdById', { length: 191 }),
  createdAt: timestamp('createdAt', { fsp: 3 }).notNull().default(sql`CURRENT_TIMESTAMP(3)`),
  updatedAt: timestamp('updatedAt', { fsp: 3 }).notNull().default(sql`CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)`),
}, (table) => ({
  slugIdx: uniqueIndex('CharityCampaign_slug_key').on(table.slug),
  statusIdx: index('CharityCampaign_status_idx').on(table.status),
  categoryIdx: index('CharityCampaign_category_idx').on(table.category),
}));

// ==========================================
// 2. CHARITY DONATION TABLE
// ==========================================
export const charityDonation = mysqlTable('CharityDonation', {
  id: varchar('id', { length: 191 }).primaryKey().$defaultFn(() => createId()),
  campaignId: varchar('campaignId', { length: 191 }),
  donorName: varchar('donorName', { length: 191 }),
  donorEmail: varchar('donorEmail', { length: 191 }),
  donorPhone: varchar('donorPhone', { length: 191 }),
  isAnonymous: boolean('isAnonymous').notNull().default(false),
  amount: decimal('amount', { precision: 12, scale: 2 }).notNull(),
  currency: varchar('currency', { length: 10 }).notNull().default('ETB'),
  paymentMethod: varchar('paymentMethod', { length: 50 }).notNull().default('manual'), // manual, stripe, chapa, telebirr, bank_transfer
  transactionReference: varchar('transactionReference', { length: 191 }),
  receiptUrl: text('receiptUrl'),
  notes: text('notes'),
  status: varchar('status', { length: 50 }).notNull().default('pending'), // pending, completed, failed, refunded
  userId: varchar('userId', { length: 191 }), // Optional registered user link
  createdAt: timestamp('createdAt', { fsp: 3 }).notNull().default(sql`CURRENT_TIMESTAMP(3)`),
  updatedAt: timestamp('updatedAt', { fsp: 3 }).notNull().default(sql`CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)`),
}, (table) => ({
  campaignIdIdx: index('CharityDonation_campaignId_idx').on(table.campaignId),
  userIdIdx: index('CharityDonation_userId_idx').on(table.userId),
  statusIdx: index('CharityDonation_status_idx').on(table.status),
  createdAtIdx: index('CharityDonation_createdAt_idx').on(table.createdAt),
}));

// ==========================================
// 3. CHARITY PROJECT / CAUSE TABLE
// ==========================================
export const charityProject = mysqlTable('CharityProject', {
  id: varchar('id', { length: 191 }).primaryKey().$defaultFn(() => createId()),
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 191 }).notNull().unique(),
  summary: varchar('summary', { length: 500 }),
  content: longtext('content'),
  location: varchar('location', { length: 191 }),
  coverImageUrl: text('coverImageUrl'),
  status: varchar('status', { length: 50 }).notNull().default('active'), // planning, active, completed
  createdAt: timestamp('createdAt', { fsp: 3 }).notNull().default(sql`CURRENT_TIMESTAMP(3)`),
  updatedAt: timestamp('updatedAt', { fsp: 3 }).notNull().default(sql`CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)`),
}, (table) => ({
  slugIdx: uniqueIndex('CharityProject_slug_key').on(table.slug),
}));

// ==========================================
// 4. CHARITY VOLUNTEER TABLE
// ==========================================
export const charityVolunteer = mysqlTable('CharityVolunteer', {
  id: varchar('id', { length: 191 }).primaryKey().$defaultFn(() => createId()),
  fullName: varchar('fullName', { length: 191 }).notNull(),
  email: varchar('email', { length: 191 }).notNull(),
  phone: varchar('phone', { length: 191 }).notNull(),
  skills: json('skills'),
  interests: text('interests'),
  availability: varchar('availability', { length: 100 }), // weekends, full-time, part-time, remote
  status: varchar('status', { length: 50 }).notNull().default('pending'), // pending, approved, active, inactive
  userId: varchar('userId', { length: 191 }),
  createdAt: timestamp('createdAt', { fsp: 3 }).notNull().default(sql`CURRENT_TIMESTAMP(3)`),
  updatedAt: timestamp('updatedAt', { fsp: 3 }).notNull().default(sql`CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)`),
}, (table) => ({
  emailIdx: index('CharityVolunteer_email_idx').on(table.email),
  statusIdx: index('CharityVolunteer_status_idx').on(table.status),
}));
