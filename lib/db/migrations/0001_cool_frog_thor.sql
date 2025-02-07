CREATE TABLE "gellify_nods_page_section" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"page_id" uuid NOT NULL,
	"slug" text,
	"heading" text,
	"content" text NOT NULL,
	"token_count" integer NOT NULL,
	"embedding" vector(1536) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "gellify_nods_page" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"path" text NOT NULL,
	"checksum" text,
	"type" text NOT NULL,
	"source" text NOT NULL,
	"meta" json,
	"parent_page_id" uuid,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "gellify_nods_page_path_unique" UNIQUE("path")
);
--> statement-breakpoint
ALTER TABLE "gellify_nods_page_section" ADD CONSTRAINT "gellify_nods_page_section_page_id_gellify_nods_page_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."gellify_nods_page"("id") ON DELETE no action ON UPDATE no action;