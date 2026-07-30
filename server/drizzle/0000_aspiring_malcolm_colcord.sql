CREATE TABLE `recipes` (
	`id` text PRIMARY KEY NOT NULL,
	`recipe_name` text NOT NULL,
	`category` text NOT NULL,
	`area` text NOT NULL,
	`slug` text NOT NULL,
	`instructions` text NOT NULL,
	`recipeThumbnail` text NOT NULL,
	`ingredients` text NOT NULL,
	`keywords` text NOT NULL,
	`embedding` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `recipe_keywords` (
	`recipe_id` text NOT NULL,
	`keyword` text NOT NULL,
	PRIMARY KEY(`recipe_id`, `keyword`),
	FOREIGN KEY (`recipe_id`) REFERENCES `recipes`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `recipe_keywords_keyword_idx` ON `recipe_keywords` (`keyword`);