import { db } from '../db';
import { sql } from 'drizzle-orm';

export async function ensureDatabaseSchema() {
  console.log('🔧 Starting Salam Charity database self-healing checks...');

  // 1. Create Core Better Auth Tables
  try {
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS \`User\` (
        \`id\` VARCHAR(191) NOT NULL,
        \`name\` VARCHAR(191) NOT NULL,
        \`email\` VARCHAR(191) NOT NULL,
        \`emailVerified\` TINYINT(1) NOT NULL DEFAULT 0,
        \`image\` VARCHAR(191) NULL,
        \`role\` VARCHAR(191) NOT NULL DEFAULT 'user',
        \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        \`updatedAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`User_email_key\` (\`email\`),
        INDEX \`User_email_idx\` (\`email\`),
        INDEX \`User_role_idx\` (\`role\`)
      ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
    `);
    console.log(`✅ Verified/Created 'User' table.`);
  } catch (e: any) {
    console.warn('⚠️ User table check warning:', e.message || e);
  }

  try {
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS \`Session\` (
        \`id\` VARCHAR(191) NOT NULL,
        \`expiresAt\` DATETIME(3) NOT NULL,
        \`token\` VARCHAR(191) NOT NULL,
        \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        \`updatedAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
        \`ipAddress\` VARCHAR(191) NULL,
        \`userAgent\` TEXT NULL,
        \`userId\` VARCHAR(191) NOT NULL,
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`Session_token_key\` (\`token\`),
        INDEX \`Session_token_idx\` (\`token\`),
        INDEX \`Session_userId_idx\` (\`userId\`),
        FOREIGN KEY (\`userId\`) REFERENCES \`User\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
      ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
    `);
    console.log(`✅ Verified/Created 'Session' table.`);
  } catch (e: any) {
    console.warn('⚠️ Session table check warning:', e.message || e);
  }

  try {
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS \`Account\` (
        \`id\` VARCHAR(191) NOT NULL,
        \`accountId\` VARCHAR(191) NOT NULL,
        \`providerId\` VARCHAR(191) NOT NULL,
        \`accessToken\` TEXT NULL,
        \`refreshToken\` TEXT NULL,
        \`idToken\` TEXT NULL,
        \`accessTokenExpiresAt\` DATETIME(3) NULL,
        \`refreshTokenExpiresAt\` DATETIME(3) NULL,
        \`scope\` VARCHAR(191) NULL,
        \`password\` VARCHAR(191) NULL,
        \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        \`updatedAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
        \`userId\` VARCHAR(191) NOT NULL,
        PRIMARY KEY (\`id\`),
        INDEX \`Account_userId_idx\` (\`userId\`),
        INDEX \`Account_providerId_accountId_idx\` (\`providerId\`, \`accountId\`),
        FOREIGN KEY (\`userId\`) REFERENCES \`User\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
      ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
    `);
    console.log(`✅ Verified/Created 'Account' table.`);
  } catch (e: any) {
    console.warn('⚠️ Account table check warning:', e.message || e);
  }

  try {
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS \`Verification\` (
        \`id\` VARCHAR(191) NOT NULL,
        \`identifier\` VARCHAR(191) NOT NULL,
        \`value\` VARCHAR(191) NOT NULL,
        \`expiresAt\` DATETIME(3) NOT NULL,
        \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        \`updatedAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
        PRIMARY KEY (\`id\`),
        INDEX \`Verification_identifier_idx\` (\`identifier\`)
      ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
    `);
    console.log(`✅ Verified/Created 'Verification' table.`);
  } catch (e: any) {
    console.warn('⚠️ Verification table check warning:', e.message || e);
  }

  // 2. Charity CMS & Core Tables
  try {
    // CharityMedia
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS \`CharityMedia\` (
        \`id\` VARCHAR(191) NOT NULL,
        \`name\` VARCHAR(255) NOT NULL,
        \`originalName\` VARCHAR(255) NOT NULL,
        \`url\` TEXT NOT NULL,
        \`fileType\` VARCHAR(50) NOT NULL,
        \`mimeType\` VARCHAR(100) NULL,
        \`sizeBytes\` INT DEFAULT 0,
        \`caption\` TEXT NULL,
        \`uploadedById\` VARCHAR(191) NULL,
        \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        \`updatedAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
        PRIMARY KEY (\`id\`),
        INDEX \`CharityMedia_fileType_idx\` (\`fileType\`),
        INDEX \`CharityMedia_uploadedById_idx\` (\`uploadedById\`),
        INDEX \`CharityMedia_createdAt_idx\` (\`createdAt\`)
      ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
    `);

    // CharityNews
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS \`CharityNews\` (
        \`id\` VARCHAR(191) NOT NULL,
        \`slug\` VARCHAR(191) NOT NULL,
        \`title\` VARCHAR(255) NOT NULL,
        \`excerpt\` TEXT NULL,
        \`content\` LONGTEXT NOT NULL,
        \`category\` VARCHAR(100) NOT NULL DEFAULT 'General',
        \`featuredImageUrl\` TEXT NULL,
        \`status\` VARCHAR(50) NOT NULL DEFAULT 'draft',
        \`publishedAt\` DATETIME(3) NULL,
        \`authorId\` VARCHAR(191) NULL,
        \`viewCount\` INT NOT NULL DEFAULT 0,
        \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        \`updatedAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`CharityNews_slug_key\` (\`slug\`),
        INDEX \`CharityNews_status_idx\` (\`status\`),
        INDEX \`CharityNews_category_idx\` (\`category\`),
        INDEX \`CharityNews_publishedAt_idx\` (\`publishedAt\`)
      ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
    `);

    // CharityGallery
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS \`CharityGallery\` (
        \`id\` VARCHAR(191) NOT NULL,
        \`title\` VARCHAR(255) NOT NULL,
        \`caption\` TEXT NULL,
        \`mediaType\` VARCHAR(50) NOT NULL DEFAULT 'image',
        \`mediaUrl\` TEXT NOT NULL,
        \`thumbnailUrl\` TEXT NULL,
        \`category\` VARCHAR(100) NOT NULL DEFAULT 'General',
        \`orderIndex\` INT NOT NULL DEFAULT 0,
        \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        \`updatedAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
        PRIMARY KEY (\`id\`),
        INDEX \`CharityGallery_category_idx\` (\`category\`),
        INDEX \`CharityGallery_mediaType_idx\` (\`mediaType\`),
        INDEX \`CharityGallery_orderIndex_idx\` (\`orderIndex\`)
      ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
    `);

    // CharitySchoolContent
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS \`CharitySchoolContent\` (
        \`id\` VARCHAR(191) NOT NULL,
        \`sectionKey\` VARCHAR(100) NOT NULL,
        \`title\` VARCHAR(255) NOT NULL,
        \`subtitle\` VARCHAR(500) NULL,
        \`content\` LONGTEXT NULL,
        \`mediaUrls\` JSON NULL,
        \`metadata\` JSON NULL,
        \`updatedAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`CharitySchoolContent_sectionKey_key\` (\`sectionKey\`)
      ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
    `);

    // CharityPageContent
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS \`CharityPageContent\` (
        \`id\` VARCHAR(191) NOT NULL,
        \`pageKey\` VARCHAR(100) NOT NULL,
        \`title\` VARCHAR(255) NOT NULL,
        \`subtitle\` VARCHAR(500) NULL,
        \`content\` LONGTEXT NULL,
        \`bannerImageUrl\` TEXT NULL,
        \`metadata\` JSON NULL,
        \`updatedAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`CharityPageContent_pageKey_key\` (\`pageKey\`)
      ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
    `);

    // CharityCampaign
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS \`CharityCampaign\` (
        \`id\` VARCHAR(191) NOT NULL,
        \`slug\` VARCHAR(191) NOT NULL,
        \`title\` VARCHAR(255) NOT NULL,
        \`subtitle\` VARCHAR(500) NULL,
        \`description\` LONGTEXT NOT NULL,
        \`category\` VARCHAR(100) NOT NULL DEFAULT 'General',
        \`targetAmount\` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
        \`raisedAmount\` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
        \`currency\` VARCHAR(10) NOT NULL DEFAULT 'ETB',
        \`featuredImageUrl\` TEXT NULL,
        \`galleryImages\` JSON NULL,
        \`startDate\` DATETIME(3) NULL,
        \`endDate\` DATETIME(3) NULL,
        \`isFeatured\` TINYINT(1) NOT NULL DEFAULT 0,
        \`status\` VARCHAR(50) NOT NULL DEFAULT 'draft',
        \`createdById\` VARCHAR(191) NULL,
        \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        \`updatedAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`CharityCampaign_slug_key\` (\`slug\`),
        INDEX \`CharityCampaign_status_idx\` (\`status\`),
        INDEX \`CharityCampaign_category_idx\` (\`category\`)
      ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
    `);

    // CharityDonation
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS \`CharityDonation\` (
        \`id\` VARCHAR(191) NOT NULL,
        \`campaignId\` VARCHAR(191) NULL,
        \`donorName\` VARCHAR(191) NULL,
        \`donorEmail\` VARCHAR(191) NULL,
        \`donorPhone\` VARCHAR(191) NULL,
        \`isAnonymous\` TINYINT(1) NOT NULL DEFAULT 0,
        \`amount\` DECIMAL(12, 2) NOT NULL,
        \`currency\` VARCHAR(10) NOT NULL DEFAULT 'ETB',
        \`paymentMethod\` VARCHAR(50) NOT NULL DEFAULT 'manual',
        \`bankName\` VARCHAR(100) NULL,
        \`accountNumber\` VARCHAR(100) NULL,
        \`transactionReference\` VARCHAR(191) NULL,
        \`receiptUrl\` TEXT NULL,
        \`notes\` TEXT NULL,
        \`status\` VARCHAR(50) NOT NULL DEFAULT 'pending',
        \`verifiedAt\` DATETIME(3) NULL,
        \`verifiedBy\` VARCHAR(191) NULL,
        \`userId\` VARCHAR(191) NULL,
        \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        \`updatedAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
        PRIMARY KEY (\`id\`),
        INDEX \`CharityDonation_campaignId_idx\` (\`campaignId\`),
        INDEX \`CharityDonation_userId_idx\` (\`userId\`),
        INDEX \`CharityDonation_status_idx\` (\`status\`),
        INDEX \`CharityDonation_createdAt_idx\` (\`createdAt\`)
      ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
    `);

    // CharityProject
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS \`CharityProject\` (
        \`id\` VARCHAR(191) NOT NULL,
        \`title\` VARCHAR(255) NOT NULL,
        \`slug\` VARCHAR(191) NOT NULL,
        \`summary\` VARCHAR(500) NULL,
        \`content\` LONGTEXT NULL,
        \`location\` VARCHAR(191) NULL,
        \`coverImageUrl\` TEXT NULL,
        \`status\` VARCHAR(50) NOT NULL DEFAULT 'active',
        \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        \`updatedAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`CharityProject_slug_key\` (\`slug\`)
      ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
    `);

    // CharityVolunteer
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS \`CharityVolunteer\` (
        \`id\` VARCHAR(191) NOT NULL,
        \`fullName\` VARCHAR(191) NOT NULL,
        \`email\` VARCHAR(191) NOT NULL,
        \`phone\` VARCHAR(191) NOT NULL,
        \`skills\` JSON NULL,
        \`interests\` TEXT NULL,
        \`availability\` VARCHAR(100) NULL,
        \`status\` VARCHAR(50) NOT NULL DEFAULT 'pending',
        \`userId\` VARCHAR(191) NULL,
        \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        \`updatedAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
        PRIMARY KEY (\`id\`),
        INDEX \`CharityVolunteer_email_idx\` (\`email\`),
        INDEX \`CharityVolunteer_status_idx\` (\`status\`)
      ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
    `);

    console.log('✅ Verified/Created all Charity tables.');
  } catch (charityErr: any) {
    console.warn('⚠️ Charity CMS table self-healing warning:', charityErr.message || charityErr);
  }

  // 3. Ensure Master Admin Seed in User and Account tables
  try {
    await db.execute(sql`
      INSERT INTO \`User\` (\`id\`, \`name\`, \`email\`, \`emailVerified\`, \`role\`)
      VALUES ('admin-selam-master', 'Selam Admin', 'admin@selamcharity.org', 1, 'super_admin')
      ON DUPLICATE KEY UPDATE \`role\` = 'super_admin', \`emailVerified\` = 1;
    `);
    console.log('✅ Master Admin user verified in User table.');
  } catch (adminErr: any) {
    console.warn('⚠️ Admin user seed notice:', adminErr.message || adminErr);
  }

  console.log('✅ Salam Charity database initialization complete.');
}
