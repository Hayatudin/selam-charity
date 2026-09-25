-- ================================================================
-- SELAM CHARITY MANAGEMENT SYSTEM - PURE CHARITY DATABASE SCHEMA
-- Target: MySQL 5.7+ / 8.0+ / MariaDB (cPanel phpMyAdmin)
-- ================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";

-- ── 1. AUTHENTICATION & USERS ──────────────────────────────────

CREATE TABLE IF NOT EXISTS `Account` (
	`id` varchar(191) NOT NULL,
	`accountId` varchar(191) NOT NULL,
	`providerId` varchar(191) NOT NULL,
	`accessToken` text,
	`refreshToken` text,
	`idToken` text,
	`accessTokenExpiresAt` datetime(3),
	`refreshTokenExpiresAt` datetime(3),
	`scope` varchar(191),
	`password` varchar(191),
	`createdAt` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updatedAt` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
	`userId` varchar(191) NOT NULL,
	CONSTRAINT `Account_id` PRIMARY KEY(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `Session` (
	`id` varchar(191) NOT NULL,
	`expiresAt` datetime(3) NOT NULL,
	`token` varchar(191) NOT NULL,
	`createdAt` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updatedAt` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
	`ipAddress` varchar(191),
	`userAgent` text,
	`userId` varchar(191) NOT NULL,
	CONSTRAINT `Session_id` PRIMARY KEY(`id`),
	CONSTRAINT `Session_token_unique` UNIQUE(`token`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `User` (
	`id` varchar(191) NOT NULL,
	`name` varchar(191) NOT NULL,
	`email` varchar(191) NOT NULL,
	`emailVerified` boolean NOT NULL DEFAULT false,
	`image` varchar(191),
	`role` varchar(191) NOT NULL DEFAULT 'user',
	`agency` varchar(191),
	`major_agency` varchar(191) DEFAULT 'Selam',
	`createdAt` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updatedAt` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
	CONSTRAINT `User_id` PRIMARY KEY(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `Verification` (
	`id` varchar(191) NOT NULL,
	`identifier` varchar(191) NOT NULL,
	`value` varchar(191) NOT NULL,
	`expiresAt` datetime(3) NOT NULL,
	`createdAt` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updatedAt` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
	CONSTRAINT `Verification_id` PRIMARY KEY(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `Notification` (
	`id` varchar(191) NOT NULL,
	`title` varchar(191) NOT NULL,
	`message` varchar(191) NOT NULL,
	`isRead` boolean NOT NULL DEFAULT false,
	`candidateId` varchar(191),
	`major_agency` varchar(191) DEFAULT 'Selam',
	`createdAt` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	CONSTRAINT `Notification_id` PRIMARY KEY(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── 2. CHARITY CORE TABLES ─────────────────────────────────────

CREATE TABLE IF NOT EXISTS `CharityCampaign` (
	`id` varchar(191) NOT NULL,
	`slug` varchar(191) NOT NULL,
	`title` varchar(255) NOT NULL,
	`subtitle` varchar(500),
	`description` longtext NOT NULL,
	`category` varchar(100) NOT NULL DEFAULT 'General',
	`targetAmount` decimal(12,2) NOT NULL DEFAULT '0.00',
	`raisedAmount` decimal(12,2) NOT NULL DEFAULT '0.00',
	`currency` varchar(10) NOT NULL DEFAULT 'ETB',
	`featuredImageUrl` text,
	`galleryImages` json,
	`startDate` datetime(3),
	`endDate` datetime(3),
	`isFeatured` boolean NOT NULL DEFAULT false,
	`status` varchar(50) NOT NULL DEFAULT 'draft',
	`createdById` varchar(191),
	`createdAt` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updatedAt` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
	CONSTRAINT `CharityCampaign_id` PRIMARY KEY(`id`),
	CONSTRAINT `CharityCampaign_slug_unique` UNIQUE(`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `CharityDonation` (
	`id` varchar(191) NOT NULL,
	`campaignId` varchar(191),
	`donorName` varchar(191),
	`donorEmail` varchar(191),
	`donorPhone` varchar(191),
	`isAnonymous` boolean NOT NULL DEFAULT false,
	`amount` decimal(12,2) NOT NULL,
	`currency` varchar(10) NOT NULL DEFAULT 'ETB',
	`paymentMethod` varchar(50) NOT NULL DEFAULT 'manual',
	`bankName` varchar(100),
	`accountNumber` varchar(100),
	`transactionReference` varchar(191),
	`receiptUrl` text,
	`notes` text,
	`status` varchar(50) NOT NULL DEFAULT 'pending',
	`verifiedAt` datetime(3),
	`verifiedBy` varchar(191),
	`userId` varchar(191),
	`createdAt` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updatedAt` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
	CONSTRAINT `CharityDonation_id` PRIMARY KEY(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `CharityGallery` (
	`id` varchar(191) NOT NULL,
	`title` varchar(255) NOT NULL,
	`caption` text,
	`mediaType` varchar(50) NOT NULL DEFAULT 'image',
	`mediaUrl` text NOT NULL,
	`thumbnailUrl` text,
	`category` varchar(100) NOT NULL DEFAULT 'General',
	`orderIndex` int NOT NULL DEFAULT 0,
	`createdAt` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updatedAt` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
	CONSTRAINT `CharityGallery_id` PRIMARY KEY(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `CharityMedia` (
	`id` varchar(191) NOT NULL,
	`name` varchar(255) NOT NULL,
	`originalName` varchar(255) NOT NULL,
	`url` text NOT NULL,
	`fileType` varchar(50) NOT NULL,
	`mimeType` varchar(100),
	`sizeBytes` int DEFAULT 0,
	`caption` text,
	`uploadedById` varchar(191),
	`createdAt` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updatedAt` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
	CONSTRAINT `CharityMedia_id` PRIMARY KEY(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `CharityNews` (
	`id` varchar(191) NOT NULL,
	`slug` varchar(191) NOT NULL,
	`title` varchar(255) NOT NULL,
	`excerpt` text,
	`content` longtext NOT NULL,
	`category` varchar(100) NOT NULL DEFAULT 'General',
	`featuredImageUrl` text,
	`status` varchar(50) NOT NULL DEFAULT 'draft',
	`publishedAt` datetime(3),
	`authorId` varchar(191),
	`viewCount` int NOT NULL DEFAULT 0,
	`createdAt` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updatedAt` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
	CONSTRAINT `CharityNews_id` PRIMARY KEY(`id`),
	CONSTRAINT `CharityNews_slug_unique` UNIQUE(`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `CharityPageContent` (
	`id` varchar(191) NOT NULL,
	`pageKey` varchar(100) NOT NULL,
	`title` varchar(255) NOT NULL,
	`subtitle` varchar(500),
	`content` longtext,
	`bannerImageUrl` text,
	`metadata` json,
	`updatedAt` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
	CONSTRAINT `CharityPageContent_id` PRIMARY KEY(`id`),
	CONSTRAINT `CharityPageContent_pageKey_unique` UNIQUE(`pageKey`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `CharityProject` (
	`id` varchar(191) NOT NULL,
	`title` varchar(255) NOT NULL,
	`slug` varchar(191) NOT NULL,
	`summary` varchar(500),
	`content` longtext,
	`location` varchar(191),
	`coverImageUrl` text,
	`status` varchar(50) NOT NULL DEFAULT 'active',
	`createdAt` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updatedAt` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
	CONSTRAINT `CharityProject_id` PRIMARY KEY(`id`),
	CONSTRAINT `CharityProject_slug_unique` UNIQUE(`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `CharitySchoolContent` (
	`id` varchar(191) NOT NULL,
	`sectionKey` varchar(100) NOT NULL,
	`title` varchar(255) NOT NULL,
	`subtitle` varchar(500),
	`content` longtext,
	`mediaUrls` json,
	`metadata` json,
	`updatedAt` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
	CONSTRAINT `CharitySchoolContent_id` PRIMARY KEY(`id`),
	CONSTRAINT `CharitySchoolContent_sectionKey_unique` UNIQUE(`sectionKey`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `CharityVolunteer` (
	`id` varchar(191) NOT NULL,
	`fullName` varchar(191) NOT NULL,
	`email` varchar(191) NOT NULL,
	`phone` varchar(191) NOT NULL,
	`skills` json,
	`interests` text,
	`availability` varchar(100),
	`status` varchar(50) NOT NULL DEFAULT 'pending',
	`userId` varchar(191),
	`createdAt` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updatedAt` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
	CONSTRAINT `CharityVolunteer_id` PRIMARY KEY(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── 3. SEARCH INDEXES ──────────────────────────────────────────

CREATE INDEX `Account_userId_idx` ON `Account` (`userId`);
CREATE INDEX `Account_providerId_accountId_idx` ON `Account` (`providerId`,`accountId`);
CREATE INDEX `Session_token_idx` ON `Session` (`token`);
CREATE INDEX `Session_userId_idx` ON `Session` (`userId`);
CREATE INDEX `User_email_idx` ON `User` (`email`);
CREATE INDEX `User_role_idx` ON `User` (`role`);
CREATE INDEX `Verification_identifier_idx` ON `Verification` (`identifier`);
CREATE INDEX `Notification_createdAt_idx` ON `Notification` (`createdAt`);
CREATE INDEX `Notification_isRead_idx` ON `Notification` (`isRead`);

CREATE INDEX `CharityCampaign_status_idx` ON `CharityCampaign` (`status`);
CREATE INDEX `CharityCampaign_category_idx` ON `CharityCampaign` (`category`);
CREATE INDEX `CharityDonation_campaignId_idx` ON `CharityDonation` (`campaignId`);
CREATE INDEX `CharityDonation_userId_idx` ON `CharityDonation` (`userId`);
CREATE INDEX `CharityDonation_status_idx` ON `CharityDonation` (`status`);
CREATE INDEX `CharityDonation_createdAt_idx` ON `CharityDonation` (`createdAt`);
CREATE INDEX `CharityGallery_category_idx` ON `CharityGallery` (`category`);
CREATE INDEX `CharityGallery_mediaType_idx` ON `CharityGallery` (`mediaType`);
CREATE INDEX `CharityGallery_orderIndex_idx` ON `CharityGallery` (`orderIndex`);
CREATE INDEX `CharityMedia_fileType_idx` ON `CharityMedia` (`fileType`);
CREATE INDEX `CharityMedia_uploadedById_idx` ON `CharityMedia` (`uploadedById`);
CREATE INDEX `CharityMedia_createdAt_idx` ON `CharityMedia` (`createdAt`);
CREATE INDEX `CharityNews_status_idx` ON `CharityNews` (`status`);
CREATE INDEX `CharityNews_category_idx` ON `CharityNews` (`category`);
CREATE INDEX `CharityNews_publishedAt_idx` ON `CharityNews` (`publishedAt`);
CREATE INDEX `CharityVolunteer_email_idx` ON `CharityVolunteer` (`email`);
CREATE INDEX `CharityVolunteer_status_idx` ON `CharityVolunteer` (`status`);

-- ── 4. DEFAULT ADMIN USER ──────────────────────────────────────

INSERT INTO `User` (`id`, `name`, `email`, `emailVerified`, `role`, `major_agency`, `createdAt`, `updatedAt`) 
VALUES ('dev-admin', 'Selam Admin', 'admin@selamcharity.org', 1, 'super_admin', 'Selam', NOW(), NOW())
ON DUPLICATE KEY UPDATE `role` = 'super_admin';

SET FOREIGN_KEY_CHECKS = 1;
