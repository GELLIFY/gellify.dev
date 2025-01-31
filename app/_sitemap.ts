import { promises as fs } from 'fs';
import path from 'path';

async function getDocsSlugs(dir: string) {
  const entries = await fs.readdir(dir, {
    recursive: true,
    withFileTypes: true,
  });
  return entries
    .filter((entry) => entry.isFile() && entry.name === 'page.mdx')
    .map((entry) => {
      const relativePath = path.relative(
        dir,
        path.join(entry.parentPath, entry.name)
      );
      return path.dirname(relativePath);
    })
    .map((slug) => slug.replace(/\\/g, '/'));
}

export default async function sitemap() {
  const docsDirectory = path.join(process.cwd(), 'app', 'docs');
  const slugs = await getDocsSlugs(docsDirectory);

  const docs = slugs.map((slug) => ({
    url: `https://gellify.dev/docs/${slug}`.replace("/.", ""),
    lastModified: new Date().toISOString(),
  }));

  const routes = ['', '/work'].map((route) => ({
    url: `https://gellify.dev${route}`,
    lastModified: new Date().toISOString(),
  }));

  return [...docs, ...routes];
}
