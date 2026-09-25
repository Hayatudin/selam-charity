CREATE TABLE `Account` (
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
);
--> statement-breakpoint
CREATE TABLE `Notification` (
	`id` varchar(191) NOT NULL,
	`title` varchar(191) NOT NULL,
	`message` varchar(191) NOT NULL,
	`isRead` boolean NOT NULL DEFAULT false,
	`candidateId` varchar(191),
	`major_agency` varchar(191) DEFAULT 'Sky',
	`createdAt` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	CONSTRAINT `Notification_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `Session` (
	`id` varchar(191) NOT NULL,
	`expiresAt` datetime(3) NOT NULL,
	`token` varchar(191) NOT NULL,
	`createdAt` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updatedAt` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
	`ipAddress` varchar(191),
	`userAgent` text,
	`userId` varchar(191) NOT NULL,
	CONSTRAINT `Session_id` PRIMARY KEY(`id`),
	CONSTRAINT `Session_token_unique` UNIQUE(`token`),
	CONSTRAINT `Session_token_key` UNIQUE(`token`)
);
--> statement-breakpoint
CREATE TABLE `User` (
	`id` varchar(191) NOT NULL,
	`name` varchar(191) NOT NULL,
	`email` varchar(191) NOT NULL,
	`emailVerified` boolean NOT NULL DEFAULT false,
	`image` varchar(191),
	`role` varchar(191) NOT NULL DEFAULT 'user',
	`agency` varchar(191),
	`major_agency` varchar(191) DEFAULT 'Sky',
	`createdAt` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updatedAt` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
	CONSTRAINT `User_id` PRIMARY KEY(`id`),
	CONSTRAINT `User_email_key` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `Verification` (
	`id` varchar(191) NOT NULL,
	`identifier` varchar(191) NOT NULL,
	`value` varchar(191) NOT NULL,
	`expiresAt` datetime(3) NOT NULL,
	`createdAt` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updatedAt` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
	CONSTRAINT `Verification_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `Broker` (
	`id` varchar(191) NOT NULL,
	`name` varchar(191) NOT NULL,
	`isLocked` boolean NOT NULL DEFAULT false,
	`major_agency` varchar(191) DEFAULT 'Sky',
	`isVip` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`leaderId` varchar(191),
	CONSTRAINT `Broker_id` PRIMARY KEY(`id`),
	CONSTRAINT `Broker_name_major_agency_key` UNIQUE(`name`,`major_agency`)
);
--> statement-breakpoint
CREATE TABLE `Candidate` (
	`id` varchar(191) NOT NULL,
	`shelfId` varchar(191),
	`passportNumber` varchar(191) NOT NULL,
	`surname` varchar(191) NOT NULL,
	`givenNames` varchar(191) NOT NULL,
	`dateOfBirth` datetime(3) NOT NULL,
	`gender` varchar(191) NOT NULL,
	`nationality` varchar(191) NOT NULL,
	`issuingCountry` varchar(191) NOT NULL,
	`dateOfIssue` datetime(3) NOT NULL,
	`dateOfExpiry` datetime(3) NOT NULL,
	`placeOfBirth` varchar(191) NOT NULL,
	`maritalStatus` varchar(191) NOT NULL,
	`numberOfChildren` int NOT NULL DEFAULT 0,
	`religion` varchar(191) NOT NULL,
	`bloodType` varchar(191) NOT NULL,
	`height` varchar(191),
	`weight` varchar(191),
	`phone` varchar(191),
	`additionalPhones` json,
	`email` varchar(191),
	`address` varchar(191),
	`city` varchar(191),
	`state` varchar(191),
	`country` varchar(191),
	`idNumber` varchar(191),
	`job` varchar(191),
	`educationLevel` varchar(191),
	`languages` json,
	`workExperience` json,
	`skills` json,
	`medicalStatus` varchar(191) NOT NULL DEFAULT 'Pending',
	`biometricStatus` varchar(191) NOT NULL DEFAULT 'Pending',
	`medicalDate` datetime(3),
	`biometricDate` datetime(3),
	`knownConditions` varchar(191),
	`cvDeadline` datetime(3),
	`emergencyContactName` varchar(191),
	`emergencyContactRelation` varchar(191),
	`emergencyContactPhone` varchar(191),
	`emergencyContactAddress` varchar(191),
	`passportImageUrl` varchar(191),
	`facePhotoUrl` varchar(191),
	`fullBodyPhotoUrl` varchar(191),
	`cocDocumentUrl` text,
	`medicalDocumentUrl` varchar(191),
	`candidateIdImageUrl` text,
	`relativeIdImageUrl` text,
	`labourId` varchar(191),
	`isRequested` boolean NOT NULL DEFAULT false,
	`visaOrContractNumber` varchar(191),
	`isFlagged` boolean NOT NULL DEFAULT false,
	`flaggedAt` datetime(3),
	`Youtube_URL` varchar(191),
	`quickVideoUrl` longtext,
	`registeredAt` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`status` varchar(191) NOT NULL DEFAULT 'pending',
	`visaSelected` boolean NOT NULL DEFAULT false,
	`visaDate` datetime(3),
	`salary` varchar(191) DEFAULT '1000SR',
	`agency` varchar(191),
	`major_agency` varchar(191) DEFAULT 'Sky',
	`deployedDate` datetime(3),
	`isLocked` boolean NOT NULL DEFAULT false,
	`cvDownloaded` boolean NOT NULL DEFAULT false,
	`allowVideo` boolean NOT NULL DEFAULT false,
	`embassyIssue` varchar(191) NOT NULL DEFAULT 'No',
	`cocStatus` varchar(191) NOT NULL DEFAULT 'No',
	`tasheerStatus` varchar(191) NOT NULL DEFAULT 'No',
	`wakalaStatus` varchar(191) NOT NULL DEFAULT 'Unpaid',
	`qrCodeStatus` varchar(191) NOT NULL DEFAULT 'No',
	`selectedType` varchar(191) NOT NULL DEFAULT 'Private',
	`price` varchar(191),
	`travelDate` datetime(3),
	`agencyStatus` varchar(191) NOT NULL DEFAULT 'Under Process',
	`agencySelected` boolean NOT NULL DEFAULT false,
	`flightStatus` varchar(191) NOT NULL DEFAULT 'PENDING',
	`lmisStatus` varchar(191) NOT NULL DEFAULT 'Pending',
	`embassyStatus` varchar(191) NOT NULL DEFAULT 'ready to embassy',
	`sponsorName` varchar(191),
	`destination` varchar(191),
	`applicationNumber` varchar(191),
	`processStatus` varchar(191) NOT NULL DEFAULT 'Pending',
	`brokerId` varchar(191),
	`registeredById` varchar(191),
	CONSTRAINT `Candidate_id` PRIMARY KEY(`id`),
	CONSTRAINT `Candidate_passportNumber_unique` UNIQUE(`passportNumber`),
	CONSTRAINT `Candidate_passportNumber_key` UNIQUE(`passportNumber`)
);
--> statement-breakpoint
CREATE TABLE `GeneratedCV` (
	`id` varchar(191) NOT NULL,
	`candidateId` varchar(191) NOT NULL,
	`templateId` varchar(191) NOT NULL,
	`facePhotoUrl` text,
	`fullBodyPhotoUrl` text,
	`createdAt` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updatedAt` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
	CONSTRAINT `GeneratedCV_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `Invoice` (
	`id` varchar(191) NOT NULL,
	`candidateId` varchar(191) NOT NULL,
	`lmisQrCodeUrl` text NOT NULL,
	`insuranceUrl` text NOT NULL,
	`ticketUrl` text NOT NULL,
	`price` varchar(191) NOT NULL,
	`isDelivered` boolean NOT NULL DEFAULT false,
	`isDownloaded` boolean NOT NULL DEFAULT false,
	`deployedDate` datetime(3),
	`createdAt` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updatedAt` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
	CONSTRAINT `Invoice_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `Leader` (
	`id` varchar(191) NOT NULL,
	`name` varchar(191) NOT NULL,
	`createdAt` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	CONSTRAINT `Leader_id` PRIMARY KEY(`id`),
	CONSTRAINT `Leader_name_unique` UNIQUE(`name`),
	CONSTRAINT `Leader_name_key` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `Passport` (
	`id` varchar(191) NOT NULL,
	`shelfNo` varchar(191) NOT NULL,
	`fullName` varchar(191) NOT NULL,
	`passportNumber` varchar(191) NOT NULL,
	`passportImageUrl` longtext,
	`status` varchar(191) NOT NULL DEFAULT 'Available',
	`major_agency` varchar(191) DEFAULT 'Sky',
	`takenReason` varchar(191),
	`takenByName` varchar(191),
	`takenByPhone` varchar(191),
	`createdAt` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updatedAt` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
	CONSTRAINT `Passport_id` PRIMARY KEY(`id`),
	CONSTRAINT `Passport_passportNumber_unique` UNIQUE(`passportNumber`),
	CONSTRAINT `Passport_passportNumber_key` UNIQUE(`passportNumber`)
);
--> statement-breakpoint
CREATE TABLE `PreRegisteredVideo` (
	`id` varchar(191) NOT NULL,
	`passportNumber` varchar(191) NOT NULL,
	`videoUrl` text NOT NULL,
	`facePhotoUrl` text,
	`fullBodyPhotoUrl` text,
	`createdAt` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	CONSTRAINT `PreRegisteredVideo_id` PRIMARY KEY(`id`),
	CONSTRAINT `PreRegisteredVideo_passportNumber_unique` UNIQUE(`passportNumber`),
	CONSTRAINT `PreRegisteredVideo_passportNumber_key` UNIQUE(`passportNumber`)
);
--> statement-breakpoint
CREATE TABLE `QuickRegistration` (
	`id` varchar(191) NOT NULL,
	`passportNumber` varchar(191) NOT NULL,
	`passportType` varchar(191) DEFAULT 'original',
	`surname` varchar(191) NOT NULL,
	`givenNames` varchar(191) NOT NULL,
	`dateOfBirth` varchar(191),
	`gender` varchar(191),
	`nationality` varchar(191),
	`dateOfExpiry` varchar(191),
	`issuingCountry` varchar(191),
	`placeOfBirth` varchar(191),
	`educationLevel` varchar(191),
	`jobExperience` longtext,
	`maritalStatus` varchar(191),
	`numberOfChildren` int NOT NULL DEFAULT 0,
	`passportImageUrl` longtext,
	`religion` varchar(191),
	`relativePhones` json,
	`createdAt` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`verificationStatus` varchar(191) NOT NULL DEFAULT 'pending',
	`musanedCvUrl` longtext,
	`musanedHoldImageUrl` longtext,
	`verificationNotes` varchar(191),
	`verifiedAt` datetime(3),
	`promotedAt` datetime(3),
	`promotedCandidateId` varchar(191),
	`cocDocumentUrl` longtext,
	`labourId` varchar(191),
	`candidateIdImageUrl` longtext,
	`relativeIdImageUrl` longtext,
	`agency` varchar(191) DEFAULT 'Sky',
	`major_agency` varchar(191) DEFAULT 'Sky',
	`videoUrl` varchar(500),
	`languages` json,
	`allowVideo` boolean NOT NULL DEFAULT false,
	`brokerId` varchar(191),
	`registeredById` varchar(191),
	CONSTRAINT `QuickRegistration_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `TemplatePrice` (
	`templateId` varchar(191) NOT NULL,
	`price` varchar(191) NOT NULL,
	`updatedAt` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
	CONSTRAINT `TemplatePrice_templateId` PRIMARY KEY(`templateId`)
);
--> statement-breakpoint
CREATE TABLE `CharityCampaign` (
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
	CONSTRAINT `CharityCampaign_slug_unique` UNIQUE(`slug`),
	CONSTRAINT `CharityCampaign_slug_key` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `CharityDonation` (
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
);
--> statement-breakpoint
CREATE TABLE `CharityGallery` (
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
);
--> statement-breakpoint
CREATE TABLE `CharityMedia` (
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
);
--> statement-breakpoint
CREATE TABLE `CharityNews` (
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
	CONSTRAINT `CharityNews_slug_unique` UNIQUE(`slug`),
	CONSTRAINT `CharityNews_slug_key` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `CharityPageContent` (
	`id` varchar(191) NOT NULL,
	`pageKey` varchar(100) NOT NULL,
	`title` varchar(255) NOT NULL,
	`subtitle` varchar(500),
	`content` longtext,
	`bannerImageUrl` text,
	`metadata` json,
	`updatedAt` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
	CONSTRAINT `CharityPageContent_id` PRIMARY KEY(`id`),
	CONSTRAINT `CharityPageContent_pageKey_unique` UNIQUE(`pageKey`),
	CONSTRAINT `CharityPageContent_pageKey_key` UNIQUE(`pageKey`)
);
--> statement-breakpoint
CREATE TABLE `CharityProject` (
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
	CONSTRAINT `CharityProject_slug_unique` UNIQUE(`slug`),
	CONSTRAINT `CharityProject_slug_key` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `CharitySchoolContent` (
	`id` varchar(191) NOT NULL,
	`sectionKey` varchar(100) NOT NULL,
	`title` varchar(255) NOT NULL,
	`subtitle` varchar(500),
	`content` longtext,
	`mediaUrls` json,
	`metadata` json,
	`updatedAt` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
	CONSTRAINT `CharitySchoolContent_id` PRIMARY KEY(`id`),
	CONSTRAINT `CharitySchoolContent_sectionKey_unique` UNIQUE(`sectionKey`),
	CONSTRAINT `CharitySchoolContent_sectionKey_key` UNIQUE(`sectionKey`)
);
--> statement-breakpoint
CREATE TABLE `CharityVolunteer` (
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
);
--> statement-breakpoint
CREATE INDEX `Account_userId_idx` ON `Account` (`userId`);--> statement-breakpoint
CREATE INDEX `Account_providerId_accountId_idx` ON `Account` (`providerId`,`accountId`);--> statement-breakpoint
CREATE INDEX `Notification_createdAt_idx` ON `Notification` (`createdAt`);--> statement-breakpoint
CREATE INDEX `Notification_isRead_idx` ON `Notification` (`isRead`);--> statement-breakpoint
CREATE INDEX `Session_token_idx` ON `Session` (`token`);--> statement-breakpoint
CREATE INDEX `Session_userId_idx` ON `Session` (`userId`);--> statement-breakpoint
CREATE INDEX `User_email_idx` ON `User` (`email`);--> statement-breakpoint
CREATE INDEX `User_role_idx` ON `User` (`role`);--> statement-breakpoint
CREATE INDEX `Verification_identifier_idx` ON `Verification` (`identifier`);--> statement-breakpoint
CREATE INDEX `Broker_leaderId_idx` ON `Broker` (`leaderId`);--> statement-breakpoint
CREATE INDEX `Candidate_passportNumber_idx` ON `Candidate` (`passportNumber`);--> statement-breakpoint
CREATE INDEX `Candidate_nationality_idx` ON `Candidate` (`nationality`);--> statement-breakpoint
CREATE INDEX `Candidate_brokerId_idx` ON `Candidate` (`brokerId`);--> statement-breakpoint
CREATE INDEX `Candidate_registeredById_idx` ON `Candidate` (`registeredById`);--> statement-breakpoint
CREATE INDEX `GeneratedCV_candidateId_idx` ON `GeneratedCV` (`candidateId`);--> statement-breakpoint
CREATE INDEX `GeneratedCV_templateId_idx` ON `GeneratedCV` (`templateId`);--> statement-breakpoint
CREATE INDEX `Invoice_candidateId_idx` ON `Invoice` (`candidateId`);--> statement-breakpoint
CREATE INDEX `Passport_passportNumber_idx` ON `Passport` (`passportNumber`);--> statement-breakpoint
CREATE INDEX `Passport_status_idx` ON `Passport` (`status`);--> statement-breakpoint
CREATE INDEX `QuickRegistration_createdAt_idx` ON `QuickRegistration` (`createdAt`);--> statement-breakpoint
CREATE INDEX `QuickRegistration_brokerId_idx` ON `QuickRegistration` (`brokerId`);--> statement-breakpoint
CREATE INDEX `QuickRegistration_registeredById_idx` ON `QuickRegistration` (`registeredById`);--> statement-breakpoint
CREATE INDEX `CharityCampaign_status_idx` ON `CharityCampaign` (`status`);--> statement-breakpoint
CREATE INDEX `CharityCampaign_category_idx` ON `CharityCampaign` (`category`);--> statement-breakpoint
CREATE INDEX `CharityDonation_campaignId_idx` ON `CharityDonation` (`campaignId`);--> statement-breakpoint
CREATE INDEX `CharityDonation_userId_idx` ON `CharityDonation` (`userId`);--> statement-breakpoint
CREATE INDEX `CharityDonation_status_idx` ON `CharityDonation` (`status`);--> statement-breakpoint
CREATE INDEX `CharityDonation_createdAt_idx` ON `CharityDonation` (`createdAt`);--> statement-breakpoint
CREATE INDEX `CharityGallery_category_idx` ON `CharityGallery` (`category`);--> statement-breakpoint
CREATE INDEX `CharityGallery_mediaType_idx` ON `CharityGallery` (`mediaType`);--> statement-breakpoint
CREATE INDEX `CharityGallery_orderIndex_idx` ON `CharityGallery` (`orderIndex`);--> statement-breakpoint
CREATE INDEX `CharityMedia_fileType_idx` ON `CharityMedia` (`fileType`);--> statement-breakpoint
CREATE INDEX `CharityMedia_uploadedById_idx` ON `CharityMedia` (`uploadedById`);--> statement-breakpoint
CREATE INDEX `CharityMedia_createdAt_idx` ON `CharityMedia` (`createdAt`);--> statement-breakpoint
CREATE INDEX `CharityNews_status_idx` ON `CharityNews` (`status`);--> statement-breakpoint
CREATE INDEX `CharityNews_category_idx` ON `CharityNews` (`category`);--> statement-breakpoint
CREATE INDEX `CharityNews_publishedAt_idx` ON `CharityNews` (`publishedAt`);--> statement-breakpoint
CREATE INDEX `CharityVolunteer_email_idx` ON `CharityVolunteer` (`email`);--> statement-breakpoint
CREATE INDEX `CharityVolunteer_status_idx` ON `CharityVolunteer` (`status`);