import { NextResponse } from "next/server";
import { QUERIES } from "@/lib/db/queries";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.toLowerCase();

  if (!query) {
    return NextResponse.json([]);
  }

  try {
    const results = await QUERIES.fullTextSearch(query);

    return NextResponse.json(results);
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
} 