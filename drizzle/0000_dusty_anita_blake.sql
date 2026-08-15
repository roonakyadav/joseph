CREATE TABLE `account_media` (
	`id` varchar(64) NOT NULL,
	`accountId` varchar(64) NOT NULL,
	`url` text NOT NULL,
	`fileKey` varchar(512) NOT NULL,
	`isPrimary` boolean NOT NULL DEFAULT false,
	`sortOrder` int NOT NULL DEFAULT 0,
	`alt` varchar(255) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `account_media_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `accounts` (
	`id` varchar(64) NOT NULL,
	`slug` varchar(160) NOT NULL,
	`title` varchar(160) NOT NULL,
	`ovr` int NOT NULL,
	`price` int NOT NULL,
	`currency` varchar(8) NOT NULL DEFAULT 'USD',
	`status` enum('available','sold') NOT NULL DEFAULT 'available',
	`lifecycle` enum('draft','published','archived') NOT NULL DEFAULT 'draft',
	`coins` bigint NOT NULL DEFAULT 0,
	`gems` int NOT NULL DEFAULT 0,
	`fcPoints` int NOT NULL DEFAULT 0,
	`rank` varchar(48) NOT NULL,
	`formation` varchar(32),
	`keyPlayers` json NOT NULL,
	`description` text NOT NULL,
	`featured` boolean NOT NULL DEFAULT false,
	`sellerWhatsapp` varchar(64),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`publishedAt` timestamp,
	`soldAt` timestamp,
	CONSTRAINT `accounts_id` PRIMARY KEY(`id`),
	CONSTRAINT `accounts_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `sale_proofs` (
	`id` varchar(64) NOT NULL,
	`accountId` varchar(64),
	`ovr` int,
	`imageUrl` text NOT NULL,
	`fileKey` varchar(512) NOT NULL,
	`imageAlt` varchar(255) NOT NULL,
	`kind` enum('handover','account-record','confirmation') NOT NULL,
	`caption` text,
	`isDevelopment` boolean NOT NULL DEFAULT false,
	`isPublished` boolean NOT NULL DEFAULT false,
	`lifecycle` enum('draft','published','archived') NOT NULL DEFAULT 'draft',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`publishedAt` timestamp,
	CONSTRAINT `sale_proofs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `seller_submission_media` (
	`id` varchar(64) NOT NULL,
	`submissionId` varchar(64) NOT NULL,
	`url` text NOT NULL,
	`fileKey` varchar(512) NOT NULL,
	`sortOrder` int NOT NULL DEFAULT 0,
	`alt` varchar(255) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `seller_submission_media_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `seller_submissions` (
	`id` varchar(64) NOT NULL,
	`sellerName` varchar(160) NOT NULL,
	`contactMethod` varchar(32) NOT NULL,
	`sellerContact` varchar(255) NOT NULL,
	`accountTitle` varchar(160) NOT NULL,
	`ovr` int NOT NULL,
	`priceExpectation` int NOT NULL,
	`coins` bigint NOT NULL DEFAULT 0,
	`gems` int NOT NULL DEFAULT 0,
	`fcPoints` int NOT NULL DEFAULT 0,
	`rank` varchar(48),
	`formation` varchar(32),
	`keyPlayers` json NOT NULL,
	`notes` text,
	`status` enum('pending','reviewing','approved','rejected') NOT NULL DEFAULT 'pending',
	`convertedAccountId` varchar(64),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `seller_submissions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `store_settings` (
	`id` int NOT NULL,
	`storeName` varchar(160) NOT NULL DEFAULT 'APEX',
	`whatsappNumber` varchar(64),
	`whatsappCommunityUrl` varchar(512),
	`defaultCurrency` varchar(8) NOT NULL DEFAULT 'USD',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `store_settings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`openId` varchar(64) NOT NULL,
	`name` text,
	`email` varchar(320),
	`loginMethod` varchar(64),
	`role` enum('user','admin') NOT NULL DEFAULT 'user',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`lastSignedIn` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_openId_unique` UNIQUE(`openId`)
);
--> statement-breakpoint
ALTER TABLE `account_media` ADD CONSTRAINT `account_media_accountId_accounts_id_fk` FOREIGN KEY (`accountId`) REFERENCES `accounts`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `sale_proofs` ADD CONSTRAINT `sale_proofs_accountId_accounts_id_fk` FOREIGN KEY (`accountId`) REFERENCES `accounts`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `seller_submission_media` ADD CONSTRAINT `seller_submission_media_submissionId_seller_submissions_id_fk` FOREIGN KEY (`submissionId`) REFERENCES `seller_submissions`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `seller_submissions` ADD CONSTRAINT `seller_submissions_convertedAccountId_accounts_id_fk` FOREIGN KEY (`convertedAccountId`) REFERENCES `accounts`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `account_media_account_index` ON `account_media` (`accountId`,`sortOrder`);--> statement-breakpoint
CREATE INDEX `accounts_public_index` ON `accounts` (`lifecycle`,`status`,`featured`);--> statement-breakpoint
CREATE INDEX `accounts_created_index` ON `accounts` (`createdAt`);--> statement-breakpoint
CREATE INDEX `sale_proofs_public_index` ON `sale_proofs` (`lifecycle`,`isPublished`,`isDevelopment`,`createdAt`);--> statement-breakpoint
CREATE INDEX `sale_proofs_account_index` ON `sale_proofs` (`accountId`);--> statement-breakpoint
CREATE INDEX `seller_submission_media_submission_index` ON `seller_submission_media` (`submissionId`,`sortOrder`);--> statement-breakpoint
CREATE INDEX `seller_submissions_status_index` ON `seller_submissions` (`status`,`createdAt`);--> statement-breakpoint
CREATE INDEX `seller_submissions_conversion_index` ON `seller_submissions` (`convertedAccountId`);