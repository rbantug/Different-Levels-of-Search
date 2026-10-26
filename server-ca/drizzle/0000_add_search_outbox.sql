CREATE TABLE `recipes` (
	`id` text PRIMARY KEY NOT NULL,
	`recipe_name` text NOT NULL,
	`category` text NOT NULL,
	`area` text NOT NULL,
	`slug` text NOT NULL,
	`instructions` text NOT NULL,
	`recipeThumbnail` text,
	`ingredients` text NOT NULL,
	`keywords` text NOT NULL,
	`embedding` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `recipes_slug_unique` ON `recipes` (`slug`);--> statement-breakpoint
CREATE TABLE `recipe_keywords` (
	`recipe_id` text NOT NULL,
	`keyword` text NOT NULL,
	PRIMARY KEY(`recipe_id`, `keyword`),
	FOREIGN KEY (`recipe_id`) REFERENCES `recipes`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `recipe_keywords_keyword_idx` ON `recipe_keywords` (`keyword`);--> statement-breakpoint
CREATE TABLE `search_outbox` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`recipe_id` text NOT NULL,
	`operation` text NOT NULL,
	`keywords_to_add` text DEFAULT '[]' NOT NULL,
	`keywords_to_remove` text DEFAULT '[]' NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`attempts` integer DEFAULT 0 NOT NULL,
	`last_error` text,
	`created_at` integer NOT NULL,
	`processed_at` integer
);
--> statement-breakpoint
CREATE INDEX `search_outbox_status_id_idx` ON `search_outbox` (`status`,`id`);