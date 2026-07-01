CREATE TABLE IF NOT EXISTS `content_revisions` (
	`id` text PRIMARY KEY NOT NULL,
	`entity_id` text NOT NULL,
	`entity_type` text NOT NULL,
	`title` text NOT NULL,
	`snapshot_json` text NOT NULL,
	`reason` text,
	`updated_by` text,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `content_revisions_entity_idx` ON `content_revisions` (`entity_id`,`entity_type`);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `team_members` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`role` text NOT NULL,
	`bio` text,
	`photo_url` text,
	`category` text DEFAULT 'executive' NOT NULL,
	`order_index` integer DEFAULT 0 NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`deleted_at` integer
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `team_members_category_idx` ON `team_members` (`category`);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `transparency_documents` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`category` text NOT NULL,
	`file_url` text NOT NULL,
	`file_size` text,
	`year` integer NOT NULL,
	`description` text,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`deleted_at` integer
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `transparency_docs_category_idx` ON `transparency_documents` (`category`);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `transparency_docs_year_idx` ON `transparency_documents` (`year`);