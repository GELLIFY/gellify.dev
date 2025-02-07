"use client";

import * as React from "react";
import { Input } from "./ui/input";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { CornerDownLeftIcon, FileIcon, SearchIcon } from "lucide-react";
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
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const router = useRouter();
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Command/Ctrl + K to open search
  useHotkeys("mod+k", (e) => {
    e.preventDefault();
    setOpen(true);
  });

  // Reset selected index when results change
  React.useEffect(() => {
    setSelectedIndex(0);
  }, [results]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (results.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + results.length) % results.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const selectedResult = results[selectedIndex];
      if (selectedResult) {
        router.push(selectedResult.url);
        setOpen(false);
      }
    }
  };

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
      const response = await fetch(
        `/api/search?q=${encodeURIComponent(searchQuery)}`
      );
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
        <DialogContent className="sm:max-w-2xl p-0">
          <DialogTitle className="sr-only">Search Documentation</DialogTitle>
          <div className="p-4">
            <Input
              ref={inputRef}
              placeholder="Search documentation..."
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              className="border-none focus-visible:ring-0"
            />
          </div>
          {results.length > 0 && (
            <div className="max-h-[400px] overflow-y-auto p-4">
              {results.map((result, index) => (
                <button
                  key={index}
                  className={`w-full text-left p-2 hover:bg-accent rounded-md relative ${
                    index === selectedIndex ? "bg-accent" : ""
                  }`}
                  onClick={() => {
                    router.push(result.url);
                    setOpen(false);
                  }}
                >
                    <div className="font-medium gri">{result.heading}</div>
                    <div className="text-sm text-muted-foreground line-clamp-1 grid-rows-2 max-w-[90%]">
                      {result.content.replaceAll("#", "")}
                    </div>
                  {index === selectedIndex && <div className="absolute right-4 top-5">
                    <CornerDownLeftIcon className="text-neutral-300" />
                  </div>}
                </button>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
