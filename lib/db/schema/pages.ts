import { json, text, timestamp, integer, uuid } from 'drizzle-orm/pg-core';
import { pgTable } from './_table';
import { relations } from 'drizzle-orm';

export const pages = pgTable('nods_page', {
  id: uuid('id').primaryKey().defaultRandom(),
  path: text('path').unique().notNull(),
  checksum: text('checksum'),
  type: text('type').notNull(),
  source: text('source').notNull(),
  meta: json('meta'),
  parentPageId: uuid('parent_page_id'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const pagesRelations = relations(pages, ({ one }) => ({
	parentPage: one(pages, {
		fields: [pages.parentPageId],
		references: [pages.id],
	}),
}));

export const pageSections = pgTable('nods_page_section', {
  id: uuid('id').primaryKey().defaultRandom(),
  pageId: uuid('page_id').references(() => pages.id).notNull(),
  slug: text('slug'),
  heading: text('heading'),
  content: text('content').notNull(),
  tokenCount: integer('token_count').notNull(),
  embedding: text('embedding').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export type Page = typeof pages.$inferSelect;
export type PageSection = typeof pageSections.$inferSelect;