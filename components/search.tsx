"use client";

import * as React from "react";
import { Input } from "./ui/input";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { SearchIcon } from "lucide-react";
import { useHotkeys } from "react-hotkeys-hook";

type SearchResult = {
  heading: string;
  content: string;
  url: string;
};

export function Search() {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<SearchResult[]>([]);
  const router = useRouter();
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Command/Ctrl + K to open search
  useHotkeys("mod+k", (e) => {
    e.preventDefault();
    setOpen(true);
  });

  React.useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  const handleSearch = async (searchQuery: string) => {
    setQuery(searchQuery);
    if (searchQuery.length === 0) {
      setResults([]);
      return;
    }

    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error("Search failed:", error);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        className="relative w-[300px] justify-start text-muted-foreground hidden md:flex"
        onClick={() => setOpen(true)}
      >
        <SearchIcon className="mr-2 h-4 w-4" />
        <span>Search documentation...</span>
        <kbd className="pointer-events-none absolute right-2 top-[50%] translate-y-[-50%] inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[850px] p-0">
            <DialogTitle className="sr-only">Search Documentation</DialogTitle>
          <div className="p-4 border-b">
            <Input
              ref={inputRef}
              placeholder="Search documentation..."
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              className="border-none focus-visible:ring-0"
            />
          </div>
          {results.length > 0 && (
            <div className="max-h-[400px] overflow-y-auto p-4">
              {results.map((result, index) => (
                <button
                  key={index}
                  className="w-full text-left p-2 hover:bg-accent rounded-md"
                  onClick={() => {
                    router.push(result.url);
                    setOpen(false);
                  }}
                >
                  <div className="font-medium">{result.heading}</div>
                  <div className="text-sm text-muted-foreground line-clamp-1">
                    {result.content.replaceAll("#", "")}
                  </div>
                </button>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
} 