import { nanoid } from '@/lib/utils';
import { index, text, varchar, vector } from 'drizzle-orm/pg-core';
import { resources } from './resources';
import { pgTable } from './_table';

export const embeddings = pgTable(
  'embeddings',
  {
    id: varchar({ length: 191 })
      .primaryKey()
      .$defaultFn(() => nanoid()),
    resourceId: varchar({ length: 191 }).references(
      () => resources.id,
      { onDelete: 'cascade' },
    ),
    content: text().notNull(),
    embedding: vector({ dimensions: 1536 }).notNull(),
  },
  table => [({
    embeddingIndex: index('embeddingIndex').using(
      'hnsw',
      table.embedding.op('vector_cosine_ops'),
    ),
  })],
);