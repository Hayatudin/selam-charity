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
// 1. CHARITY MEDIA / FILE LIBRARY TABLE
// ==========================================
export const charityMedia = mysqlTable('CharityMedia', {
  id: varchar('id', { length: 191 }).primaryKey().$defaultFn(() => createId()),
  name: varchar('name', { length: 255 }).notNull(),
  originalName: varchar('originalName', { length: 255 }).notNull(),
  url: text('url').notNull(),
  fileType: varchar('fileType', { length: 50 }).notNull(), // 'image' | 'video' | 'document'
  mimeType: varchar('mimeType', { length: 100 }),
  sizeBytes: int('sizeBytes').default(0),
  caption: text('caption'),
  uploadedById: varchar('uploadedById', { length: 191 }),
  createdAt: timestamp('createdAt', { fsp: 3 }).notNull().default(sql`CURRENT_TIMESTAMP(3)`),
  updatedAt: timestamp('updatedAt', { fsp: 3 }).notNull().default(sql`CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)`),
}, (table) => ({
  fileTypeIdx: index('CharityMedia_fileType_idx').on(table.fileType),
  uploadedByIdIdx: index('CharityMedia_uploadedById_idx').on(table.uploadedById),
  createdAtIdx: index('CharityMedia_createdAt_idx').on(table.createdAt),
}));

// ==========================================
// 2. CHARITY NEWS TABLE
// ==========================================
export const charityNews = mysqlTable('CharityNews', {
  id: varchar('id', { length: 191 }).primaryKey().$defaultFn(() => createId()),
  slug: varchar('slug', { length: 191 }).notNull().unique(),
  title: varchar('title', { length: 255 }).notNull(),
  excerpt: text('excerpt'),
  content: longtext('content').notNull(),
  category: varchar('category', { length: 100 }).notNull().default('General'),
  featuredImageUrl: text('featuredImageUrl'),
  status: varchar('status', { length: 50 }).notNull().default('draft'), // 'draft' | 'published'
  publishedAt: datetime('publishedAt', { fsp: 3 }),
  authorId: varchar('authorId', { length: 191 }),
  viewCount: int('viewCount').notNull().default(0),
  createdAt: timestamp('createdAt', { fsp: 3 }).notNull().default(sql`CURRENT_TIMESTAMP(3)`),
  updatedAt: timestamp('updatedAt', { fsp: 3 }).notNull().default(sql`CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)`),
}, (table) => ({
  slugIdx: uniqueIndex('CharityNews_slug_key').on(table.slug),
  statusIdx: index('CharityNews_status_idx').on(table.status),
  categoryIdx: index('CharityNews_category_idx').on(table.category),
  publishedAtIdx: index('CharityNews_publishedAt_idx').on(table.publishedAt),
}));

// ==========================================
// 3. CHARITY GALLERY TABLE
// ==========================================
export const charityGallery = mysqlTable('CharityGallery', {
  id: varchar('id', { length: 191 }).primaryKey().$defaultFn(() => createId()),
  title: varchar('title', { length: 255 }).notNull(),
  caption: text('caption'),
  mediaType: varchar('mediaType', { length: 50 }).notNull().default('image'), // 'image' | 'video'
  mediaUrl: text('mediaUrl').notNull(),
  thumbnailUrl: text('thumbnailUrl'),
  category: varchar('category', { length: 100 }).notNull().default('General'),
  orderIndex: int('orderIndex').notNull().default(0),
  createdAt: timestamp('createdAt', { fsp: 3 }).notNull().default(sql`CURRENT_TIMESTAMP(3)`),
  updatedAt: timestamp('updatedAt', { fsp: 3 }).notNull().default(sql`CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)`),
}, (table) => ({
  categoryIdx: index('CharityGallery_category_idx').on(table.category),
  mediaTypeIdx: index('CharityGallery_mediaType_idx').on(table.mediaType),
  orderIndexIdx: index('CharityGallery_orderIndex_idx').on(table.orderIndex),
}));

// ==========================================
// 4. CHARITY SCHOOL CONTENT TABLE
// ==========================================
export const charitySchoolContent = mysqlTable('CharitySchoolContent', {
  id: varchar('id', { length: 191 }).primaryKey().$defaultFn(() => createId()),
  sectionKey: varchar('sectionKey', { length: 100 }).notNull().unique(), // 'intro' | 'programs' | 'activities' | 'facilities'
  title: varchar('title', { length: 255 }).notNull(),
  subtitle: varchar('subtitle', { length: 500 }),
  content: longtext('content'),
  mediaUrls: json('mediaUrls'), // array of image/video URLs
  metadata: json('metadata'), // structured data like program lists, facility features
  updatedAt: timestamp('updatedAt', { fsp: 3 }).notNull().default(sql`CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)`),
}, (table) => ({
  sectionKeyIdx: uniqueIndex('CharitySchoolContent_sectionKey_key').on(table.sectionKey),
}));

// ==========================================
// 5. CHARITY PAGES CMS CONTENT TABLE
// ==========================================
export const charityPageContent = mysqlTable('CharityPageContent', {
  id: varchar('id', { length: 191 }).primaryKey().$defaultFn(() => createId()),
  pageKey: varchar('pageKey', { length: 100 }).notNull().unique(), // 'about' | 'contact' | 'mission' | 'general'
  title: varchar('title', { length: 255 }).notNull(),
  subtitle: varchar('subtitle', { length: 500 }),
  content: longtext('content'),
  bannerImageUrl: text('bannerImageUrl'),
  metadata: json('metadata'), // e.g. contact email/phone/address, mission points, values
  updatedAt: timestamp('updatedAt', { fsp: 3 }).notNull().default(sql`CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)`),
}, (table) => ({
  pageKeyIdx: uniqueIndex('CharityPageContent_pageKey_key').on(table.pageKey),
}));

// ==========================================
// 6. CHARITY CAMPAIGN TABLE
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
  status: varchar('status', { length: 50 }).notNull().default('draft'),
  createdById: varchar('createdById', { length: 191 }),
  createdAt: timestamp('createdAt', { fsp: 3 }).notNull().default(sql`CURRENT_TIMESTAMP(3)`),
  updatedAt: timestamp('updatedAt', { fsp: 3 }).notNull().default(sql`CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)`),
}, (table) => ({
  slugIdx: uniqueIndex('CharityCampaign_slug_key').on(table.slug),
  statusIdx: index('CharityCampaign_status_idx').on(table.status),
  categoryIdx: index('CharityCampaign_category_idx').on(table.category),
}));

// ==========================================
// 7. CHARITY DONATION TABLE
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
  paymentMethod: varchar('paymentMethod', { length: 50 }).notNull().default('manual'),
  bankName: varchar('bankName', { length: 100 }),
  accountNumber: varchar('accountNumber', { length: 100 }),
  transactionReference: varchar('transactionReference', { length: 191 }),
  receiptUrl: text('receiptUrl'),
  notes: text('notes'),
  status: varchar('status', { length: 50 }).notNull().default('pending'),
  verifiedAt: datetime('verifiedAt', { fsp: 3 }),
  verifiedBy: varchar('verifiedBy', { length: 191 }),
  userId: varchar('userId', { length: 191 }),
  createdAt: timestamp('createdAt', { fsp: 3 }).notNull().default(sql`CURRENT_TIMESTAMP(3)`),
  updatedAt: timestamp('updatedAt', { fsp: 3 }).notNull().default(sql`CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)`),
}, (table) => ({
  campaignIdIdx: index('CharityDonation_campaignId_idx').on(table.campaignId),
  userIdIdx: index('CharityDonation_userId_idx').on(table.userId),
  statusIdx: index('CharityDonation_status_idx').on(table.status),
  createdAtIdx: index('CharityDonation_createdAt_idx').on(table.createdAt),
}));

// ==========================================
// 8. CHARITY PROJECT / CAUSE TABLE
// ==========================================
export const charityProject = mysqlTable('CharityProject', {
  id: varchar('id', { length: 191 }).primaryKey().$defaultFn(() => createId()),
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 191 }).notNull().unique(),
  summary: varchar('summary', { length: 500 }),
  content: longtext('content'),
  location: varchar('location', { length: 191 }),
  coverImageUrl: text('coverImageUrl'),
  status: varchar('status', { length: 50 }).notNull().default('active'),
  createdAt: timestamp('createdAt', { fsp: 3 }).notNull().default(sql`CURRENT_TIMESTAMP(3)`),
  updatedAt: timestamp('updatedAt', { fsp: 3 }).notNull().default(sql`CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)`),
}, (table) => ({
  slugIdx: uniqueIndex('CharityProject_slug_key').on(table.slug),
}));

// ==========================================
// 9. CHARITY VOLUNTEER TABLE
// ==========================================
export const charityVolunteer = mysqlTable('CharityVolunteer', {
  id: varchar('id', { length: 191 }).primaryKey().$defaultFn(() => createId()),
  fullName: varchar('fullName', { length: 191 }).notNull(),
  email: varchar('email', { length: 191 }).notNull(),
  phone: varchar('phone', { length: 191 }).notNull(),
  skills: json('skills'),
  interests: text('interests'),
  availability: varchar('availability', { length: 100 }),
  status: varchar('status', { length: 50 }).notNull().default('pending'),
  userId: varchar('userId', { length: 191 }),
  createdAt: timestamp('createdAt', { fsp: 3 }).notNull().default(sql`CURRENT_TIMESTAMP(3)`),
  updatedAt: timestamp('updatedAt', { fsp: 3 }).notNull().default(sql`CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)`),
}, (table) => ({
  emailIdx: index('CharityVolunteer_email_idx').on(table.email),
  statusIdx: index('CharityVolunteer_status_idx').on(table.status),
}));
