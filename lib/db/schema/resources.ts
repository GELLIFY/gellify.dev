import { sql } from "drizzle-orm";
import { text, varchar, timestamp } from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { nanoid } from "@/lib/utils";
import { pgTable } from "./_table";

export const resources = pgTable("resources", {
  id: varchar({ length: 191 })
    .primaryKey()
    .$defaultFn(() => nanoid()),
  content: text().notNull(),

  createdAt: timestamp()
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp()
    .notNull()
    .default(sql`now()`),
});

// Schema for resources - used to validate API requests
export const insertResourceSchema = createSelectSchema(resources)
  .extend({})
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  });

// Type for resources - used to type API request params and within Components
export type NewResourceParams = z.infer<typeof insertResourceSchema>;