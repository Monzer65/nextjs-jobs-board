CREATE TABLE IF NOT EXISTS "employer" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"company_name" varchar(255) NOT NULL,
	"company_website" varchar,
	"company_logo" varchar,
	"company_size" varchar,
	"company_industry" varchar,
	"location" varchar(256),
	"bio" text,
	"linkedin_profile" varchar,
	"github_profile" varchar,
	"saved_candidates" text[],
	"job_postings" text[],
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "freelancer" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"online" boolean NOT NULL,
	"profile_image_url" varchar,
	"banner_image_url" varchar,
	"bio" text,
	"skills" text,
	"hourly_rate" integer,
	"experience" text,
	"education" text,
	"availability" text,
	"location" varchar(256),
	"github_profile" varchar,
	"linkedin_profile" varchar,
	"portfolio_website" varchar,
	"resume" text,
	"saved_projects" text[],
	"project_alerts" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "job_seeker" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"online" boolean NOT NULL,
	"profile_image_url" varchar,
	"banner_image_url" varchar,
	"dob" timestamp,
	"bio" text,
	"skills" text,
	"experience" text,
	"education" text,
	"availability" text,
	"location" varchar(256),
	"github_profile" varchar,
	"linkedin_profile" varchar,
	"portfolio_website" varchar,
	"resume" text NOT NULL,
	"saved_jobs" text[],
	"job_alerts" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" varchar(255) NOT NULL,
	"phone" varchar(255),
	"email" varchar(255),
	"phone_verified" boolean DEFAULT false NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"confirmation_code" varchar(255),
	"password" varchar(255) NOT NULL,
	"role" text DEFAULT 'user' NOT NULL,
	"is_active" boolean DEFAULT true,
	"last_login" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_phone_unique" UNIQUE("phone"),
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DROP TABLE "users" CASCADE;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "employer" ADD CONSTRAINT "employer_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "freelancer" ADD CONSTRAINT "freelancer_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "job_seeker" ADD CONSTRAINT "job_seeker_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
