import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import matter from "gray-matter";

async function getAllMdxFiles(directory: string): Promise<string[]> {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        return getAllMdxFiles(fullPath);
      } else if (entry.name.endsWith('.mdx')) {
        return [fullPath];
      }
      return [];
    })
  );
  return files.flat();
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.toLowerCase();

  if (!query) {
    return NextResponse.json([]);
  }

  try {
    const docsDirectory = path.join(process.cwd(), "app/docs");
    const mdxFiles = await getAllMdxFiles(docsDirectory);

    const results = [];

    for (const filePath of mdxFiles) {
      const content = await fs.readFile(filePath, "utf8");
      const { data, content: mdxContent } = matter(content);
      
      if (
        data.title?.toLowerCase().includes(query) ||
        mdxContent.toLowerCase().includes(query)
      ) {
        // Get relative path from docs directory for the URL
        const relativePath = path.relative(docsDirectory, filePath);
        const urlPath = relativePath.replace('page.mdx', '').replace(/\\/g, '/');
        
        results.push({
          title: data.title || path.basename(filePath).replace(".mdx", ""),
          content: mdxContent.slice(0, 150),
          url: `/docs/${urlPath}`,
        });
      }
    }

    return NextResponse.json(results);
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
} 