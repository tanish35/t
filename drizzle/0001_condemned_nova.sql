ALTER TYPE "public"."replay_event_type" ADD VALUE 'rrweb';--> statement-breakpoint
ALTER TABLE "ingest_tokens" ADD COLUMN "token_suffix" text NOT NULL;