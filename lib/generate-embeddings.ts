import { createHash } from 'crypto'
import dotenv from 'dotenv'
import { ObjectExpression } from 'estree'
import { readdir, readFile, stat } from 'fs/promises'
import GithubSlugger from 'github-slugger'
import { RootContent as Content, Root } from 'mdast'
import { fromMarkdown } from 'mdast-util-from-markdown'
import { mdxFromMarkdown, MdxjsEsm } from 'mdast-util-mdx'
import { toMarkdown } from 'mdast-util-to-markdown'
import { toString } from 'mdast-util-to-string'
import { mdxjs } from 'micromark-extension-mdxjs'
import OpenAI from 'openai';
import { basename, dirname, join } from 'path'
import { u } from 'unist-builder'
import { filter } from 'unist-util-filter'
import { eq } from 'drizzle-orm';
import { pages, pageSections } from './db/schema/pages'
import { db } from './db'

dotenv.config()

const ignoredFiles = ['docs/page.mdx', 'work/page.mdx']

/**
 * Extracts ES literals from an `estree` `ObjectExpression`
 * into a plain JavaScript object.
 */
function getObjectFromExpression(node: ObjectExpression) {
  return node.properties.reduce<
    Record<string, string | number | bigint | true | RegExp | undefined>
  >((object, property) => {
    if (property.type !== 'Property') {
      return object
    }

    const key = (property.key.type === 'Identifier' && property.key.name) || undefined
    const value = (property.value.type === 'Literal' && property.value.value) || undefined

    if (!key) {
      return object
    }

    return {
      ...object,
      [key]: value,
    }
  }, {})
}

/**
 * Extracts the `meta` ESM export from the MDX file.
 *
 * This info is akin to frontmatter.
 */
function extractMetaExport(mdxTree: Root) {
  const metaExportNode = mdxTree.children.find((node): node is MdxjsEsm => {
    return (
      node.type === 'mdxjsEsm' &&
      node.data?.estree?.body[0]?.type === 'ExportNamedDeclaration' &&
      node.data.estree.body[0].declaration?.type === 'VariableDeclaration' &&
      node.data.estree.body[0].declaration.declarations[0]?.id.type === 'Identifier' &&
      node.data.estree.body[0].declaration.declarations[0].id.name === 'meta'
    )
  })

  if (!metaExportNode) {
    return undefined
  }

  const objectExpression =
    (metaExportNode.data?.estree?.body[0]?.type === 'ExportNamedDeclaration' &&
      metaExportNode.data.estree.body[0].declaration?.type === 'VariableDeclaration' &&
      metaExportNode.data.estree.body[0].declaration.declarations[0]?.id.type === 'Identifier' &&
      metaExportNode.data.estree.body[0].declaration.declarations[0].id.name === 'meta' &&
      metaExportNode.data.estree.body[0].declaration.declarations[0].init?.type ===
        'ObjectExpression' &&
      metaExportNode.data.estree.body[0].declaration.declarations[0].init) ||
    undefined

  if (!objectExpression) {
    return undefined
  }

  return getObjectFromExpression(objectExpression)
}

/**
 * Splits a `mdast` tree into multiple trees based on
 * a predicate function. Will include the splitting node
 * at the beginning of each tree.
 *
 * Useful to split a markdown file into smaller sections.
 */
function splitTreeBy(tree: Root, predicate: (node: Content) => boolean) {
  return tree.children.reduce<Root[]>((trees, node) => {
    const [lastTree] = trees.slice(-1)

    if (!lastTree || predicate(node)) {
      const tree: Root = u('root', [node])
      return trees.concat(tree)
    }

    lastTree.children.push(node)
    return trees
  }, [])
}

type Meta = ReturnType<typeof extractMetaExport>

type Section = {
  content: string
  heading?: string
  slug?: string
}

type ProcessedMdx = {
  checksum: string
  meta: Meta
  sections: Section[]
}

/**
 * Processes MDX content for search indexing.
 * It extracts metadata, strips it of all JSX,
 * and splits it into sub-sections based on criteria.
 */
function processMdxForSearch(content: string): ProcessedMdx {
  const checksum = createHash('sha256').update(content).digest('base64')

  const mdxTree = fromMarkdown(content, {
    extensions: [mdxjs()],
    mdastExtensions: [mdxFromMarkdown()],
  })

  const meta = extractMetaExport(mdxTree)

  // Remove all MDX elements from markdown
  const mdTree = filter(
    mdxTree,
    (node) =>
      ![
        'mdxjsEsm',
        'mdxJsxFlowElement',
        'mdxJsxTextElement',
        'mdxFlowExpression',
        'mdxTextExpression',
      ].includes(node.type)
  )

  if (!mdTree) {
    return {
      checksum,
      meta,
      sections: [],
    }
  }

  const sectionTrees = splitTreeBy(mdTree, (node) => node.type === 'heading')

  const slugger = new GithubSlugger()

  const sections = sectionTrees.map((tree) => {
    const [firstNode] = tree.children

    const heading = firstNode.type === 'heading' ? toString(firstNode) : undefined
    const slug = heading ? slugger.slug(heading) : undefined

    return {
      content: toMarkdown(tree),
      heading,
      slug,
    }
  })

  return {
    checksum,
    meta,
    sections,
  }
}

type WalkEntry = {
  path: string
  parentPath?: string
}

async function walk(dir: string, parentPath?: string): Promise<WalkEntry[]> {
  const immediateFiles = await readdir(dir)

  const recursiveFiles = await Promise.all(
    immediateFiles.map(async (file) => {
      const path = join(dir, file)
      const stats = await stat(path)
      if (stats.isDirectory()) {
        // Keep track of document hierarchy (if this dir has corresponding doc file)
        const docPath = `${basename(path)}.mdx`

        return walk(
          path,
          immediateFiles.includes(docPath) ? join(dirname(path), docPath) : parentPath
        )
      } else if (stats.isFile()) {
        return [
          {
            path: path,
            parentPath,
          },
        ]
      } else {
        return []
      }
    })
  )

  const flattenedFiles = recursiveFiles.reduce(
    (all, folderContents) => all.concat(folderContents),
    []
  )

  return flattenedFiles.sort((a, b) => a.path.localeCompare(b.path))
}

abstract class BaseEmbeddingSource {
  checksum?: string
  meta?: Meta
  sections?: Section[]

  constructor(public source: string, public path: string, public parentPath?: string) {}

  abstract load(): Promise<{
    checksum: string
    meta?: Meta
    sections: Section[]
  }>
}

class MarkdownEmbeddingSource extends BaseEmbeddingSource {
  type: 'markdown' = 'markdown'

  constructor(source: string, public filePath: string, public parentFilePath?: string) {
    const path = filePath.replace(/^app/, '').replace(/\.mdx?$/, '')
    const parentPath = parentFilePath?.replace(/^app/, '').replace(/\.mdx?$/, '')

    super(source, path, parentPath)
  }

  async load() {
    const contents = await readFile(this.filePath, 'utf8')

    const { checksum, meta, sections } = processMdxForSearch(contents)

    this.checksum = checksum
    this.meta = meta
    this.sections = sections

    return {
      checksum,
      meta,
      sections,
    }
  }
}

type EmbeddingSource = MarkdownEmbeddingSource

async function generateEmbeddings() {
  const shouldRefresh = false;

  if (!process.env.DATABASE_URL || !process.env.OPENAI_API_KEY) {
    return console.log(
      'Environment variables DATABASE_URL and OPENAI_API_KEY are required: skipping embeddings generation'
    )
  }

  const embeddingSources: EmbeddingSource[] = [
    ...(await walk('app/docs'))
      .filter(({ path }) => /\.mdx?$/.test(path))
      .filter(({ path }) => !ignoredFiles.includes(path))
      .map((entry) => new MarkdownEmbeddingSource('guide', entry.path)),
  ]

  console.log(`Discovered ${embeddingSources.length} docs`)

  if (!shouldRefresh) {
    console.log('Checking which doc pages are new or have changed')
  } else {
    console.log('Refresh flag set, re-generating all doc pages')
  }

  for (const embeddingSource of embeddingSources) {
    const { type, source, path, parentPath } = embeddingSource

    try {
      const { checksum, meta, sections } = await embeddingSource.load()

      // Check for existing page in DB and compare checksums
      const existingPage = await db.query.pages.findFirst({
        where: eq(pages.path, path),
        with: {
          parentPage: true
        }
      });

      // We use checksum to determine if this page & its sections need to be regenerated
      if (!shouldRefresh && existingPage?.checksum === checksum) {
        // If parent page changed, update it
        if (existingPage.parentPage?.path !== parentPath) {
          console.log(`[${path}] Parent page has changed. Updating to '${parentPath}'...`)
          const parentPage = await db.query.pages.findFirst({
            where: eq(pages.path, parentPath!)
          });

          if (parentPage) {
            await db.update(pages)
              .set({ parentPageId: parentPage.id })
              .where(eq(pages.id, existingPage.id));
          }
        }
        continue
      }

      if (existingPage) {
        if (!shouldRefresh) {
          console.log(`[${path}] Docs have changed, removing old page sections and their embeddings`)
        } else {
          console.log(`[${path}] Refresh flag set, removing old page sections and their embeddings`)
        }

        await db.delete(pageSections)
          .where(eq(pageSections.pageId, existingPage.id));
      }

      const parentPage = await db.query.pages.findFirst({
        where: eq(pages.path, parentPath!)
      });

      // Create/update page record
      const [page] = await db.insert(pages)
        .values({
          checksum: null,
          path,
          type,
          source,
          meta: meta as any,
          parentPageId: parentPage?.id,
        })
        .onConflictDoUpdate({
          target: pages.path,
          set: {
            checksum: null,
            type,
            source,
            meta: meta as any,
            parentPageId: parentPage?.id,
          }
        })
        .returning();

      console.log(`[${path}] Adding ${sections.length} page sections (with embeddings)`)
      for (const { slug, heading, content } of sections) {
        const input = content.replace(/\n/g, ' ')

        try {
          const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
          })

          const embeddingResponse = await openai.embeddings.create({
            model: 'text-embedding-3-small',
            input,
          })

          const [responseData] = embeddingResponse.data

          await db.insert(pageSections)
            .values({
              pageId: page.id,
              slug,
              heading,
              content,
              tokenCount: embeddingResponse.usage.total_tokens,
              embedding: responseData.embedding,
            });

        } catch (err) {
          console.error(
            `Failed to generate embeddings for '${path}' page section starting with '${input.slice(
              0,
              40
            )}...'`
          )
          throw err
        }
      }

      // Set page checksum
      await db.update(pages)
        .set({ checksum })
        .where(eq(pages.id, page.id));

    } catch (err) {
      console.error(
        `Page '${path}' or one/multiple of its page sections failed to store properly. Page has been marked with null checksum to indicate that it needs to be re-generated.`
      )
      console.error(err)
    }
  }

  console.log('Embedding generation complete')
}

async function main() {
  await generateEmbeddings()
}

main().catch((err) => console.error(err))