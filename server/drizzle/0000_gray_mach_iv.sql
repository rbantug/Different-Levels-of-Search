CREATE TABLE `recipes` (
	`id` text PRIMARY KEY NOT NULL,
	`recipe_name` text NOT NULL,
	`category` text NOT NULL,
	`area` text NOT NULL,
	`instructions` text NOT NULL,
	`recipeThumbnail` text NOT NULL,
	`ingredients` text NOT NULL,
	`embedding` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
