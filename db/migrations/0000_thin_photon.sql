CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"email" varchar(255),
	"phone" varchar(15),
	"password" text NOT NULL,
	"role" text DEFAULT 'user',
	"userType" text,
	"profile_image_url" varchar,
	"banner_image_url" varchar,
	"location" varchar(256),
	"bio" text,
	"is_active" boolean DEFAULT true,
	"last_login" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_phone_unique" UNIQUE("phone")
);
