import { json, text, timestamp, integer, uuid, vector, index } from 'drizzle-orm/pg-core';
import { pgTable } from './_table';
import { relations, sql } from 'drizzle-orm';

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
  embedding: vector({ dimensions: 1536 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, table => [({
  embeddingIndex: index('embeddingIndex').using(
    'hnsw',
    table.embedding.op('vector_cosine_ops'),
  ),
  searchIndex: index('search_index').using(
    'gin',
    sql`(
        setweight(to_tsvector('english', ${table.heading}), 'A') ||
        setweight(to_tsvector('english', ${table.content}), 'B')
    )`,
  ),
})]);

export type Page = typeof pages.$inferSelect;
export type PageSection = typeof pageSections.$inferSelect;