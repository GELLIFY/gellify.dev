import "server-only";

import { desc, sql, eq } from "drizzle-orm";
import { db } from ".";
import { pages as pagesSchema } from "./schema/pages";
import { pageSections as pageSectionsSchema } from "./schema/pages";

export const QUERIES = {
  fullTextSearch: function (query: string) {
    const matchQuery = sql`(
      setweight(to_tsvector('english', ${pageSectionsSchema.heading}), 'A') ||
      setweight(to_tsvector('english', ${pageSectionsSchema.content}), 'B')), to_tsquery('english', ${query})`;
    
    return db
      .select({
        heading: pageSectionsSchema.heading,
        content: pageSectionsSchema.content,
        url: sql<string>`REPLACE(${pagesSchema.path}, '/page', '') || '#' || LTRIM(${pageSectionsSchema.slug}, '-')`,
        rank: sql`ts_rank(${matchQuery})`,
        rankCd: sql`ts_rank_cd(${matchQuery})`,
      })
      .from(pageSectionsSchema)
      .innerJoin(pagesSchema, eq(pageSectionsSchema.pageId, pagesSchema.id))
      .where(
        sql`(
          setweight(to_tsvector('english', ${pageSectionsSchema.heading}), 'A') ||
          setweight(to_tsvector('english', ${pageSectionsSchema.content}), 'B'))
          @@ to_tsquery('english', ${query}
        )`
      )
      .orderBy((t) => desc(t.rank))
      .limit(5);
  },
};
