"use client";

import { ComponentPropsWithoutRef, useRef } from "react";
import { toast } from "sonner";
import { Clipboard } from "lucide-react";

export function CodeBlock({ children, ...props }: ComponentPropsWithoutRef<"pre">) {
  const preRef = useRef<HTMLPreElement>(null);

  const handleCopy = async () => {
    try {
      console.log(preRef.current?.innerText ?? "")
      await navigator.clipboard.writeText(preRef.current?.innerText ?? "")
      toast.info("Snippets has been copied!")
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong, try copying by hand :(")
    }
  }
  
  return (
    <pre
        ref={preRef}
        className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold"
        {...props}
      >
        {children}
        <button
          onClick={handleCopy}
          className="absolute right-3 top-3 opacity-50 hover:opacity-100 transition-opacity border rounded p-2 cursor-pointer"
          aria-label="Copy code to clipboard"
        >
          <Clipboard className="text-neutral-100 size-3"/>
        </button>
    </pre>
  )
}