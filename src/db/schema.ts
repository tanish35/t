import {
  bigint,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { cuid2 } from "drizzle-cuid2/postgres";
import { user } from "./auth-schema";
export * from "./auth-schema";
// export const todos = pgTable("todos", {
//   id: serial().primaryKey(),
//   title: text().notNull(),
//   createdAt: timestamp("created_at").defaultNow(),
// });

export const recordingStatus = pgEnum("recording_status", [
  "created",
  "recording",
  "processing",
  "ready",
  "failed",
]);

export const replayEventType = pgEnum("replay_event_type", [
  "navigation",
  "click",
  "console",
  "network",
  "error",
  "metadata",
  "rrweb",
]);

export const projects = pgTable("projects", {
  id: cuid2().defaultRandom().primaryKey(),
  ownerId: text("owner_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  name: text().notNull(),
  description: text(),
  createdAt: timestamp("created_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", {
    withTimezone: true,
  })
    .defaultNow()
    .$onUpdateFn(() => new Date())
    .notNull(),
});

export const recordings = pgTable(
  "recordings",
  {
    id: cuid2().defaultRandom().primaryKey(),
    projectId: cuid2("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    name: text().notNull(),
    status: recordingStatus().notNull().default("created"),
    publicId: cuid2("public_id").unique(),
    startedAt: timestamp("started_at", { withTimezone: true }),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", {
      withTimezone: true,
    })
      .defaultNow()
      .$onUpdateFn(() => new Date())
      .notNull(),
  },
  (table) => [index("recordings_project_id_idx").on(table.projectId)],
);

export const replayEvents = pgTable(
  "replay_events",
  {
    id: cuid2().defaultRandom().primaryKey(),
    recordingId: cuid2("recording_id")
      .notNull()
      .references(() => recordings.id, { onDelete: "cascade" }),
    sequence: integer().notNull(),
    occurredAt: bigint("occurred_at", { mode: "number" }).notNull(),
    type: replayEventType().notNull(),
    payload: jsonb().$type<Record<string, unknown>>().notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("replay_events_recording_id_idx").on(table.recordingId),
    uniqueIndex("replay_events_recording_sequence_unique").on(
      table.recordingId,
      table.sequence,
    ),
  ],
);

export const ingestTokens = pgTable(
  "ingest_tokens",
  {
    id: cuid2().defaultRandom().primaryKey(),
    projectId: cuid2("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    name: text().notNull(),
    tokenHash: text("token_hash").notNull().unique(),
    tokenSuffix: text("token_suffix").notNull(),
    lastUsedAt: timestamp("last_used_at", { withTimezone: true }),
    expiresAt: timestamp("expires_at", { withTimezone: true }),
    revokedAt: timestamp("revoked_at", { withTimezone: true }),
    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
  },
  (table) => [index("ingest_tokens_project_id_idx").on(table.projectId)],
);
