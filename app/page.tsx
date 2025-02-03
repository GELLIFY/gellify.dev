import Link from "next/link";
import { Github, Linkedin, Rocket, Twitter, Youtube } from "lucide-react";

export default function Page() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center !h-[calc(100svh-var(--header-height))] p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <section className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        {/* Logo */}
        <h1 className="font-mono text-2xl">acme-app</h1>

        {/* Instructions */}
        <ol className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2">
            <code className="relative bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-semibold group hover:cursor-pointer hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
              npx create-next-app [project-name]
              <span className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-xs">
                Copy
              </span>
            </code>
            .
          </li>
          <li>Start coding your next app.</li>
        </ol>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Rocket className="size-4" />
            Deploy now
          </a>
          <Link
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-36"
            href="/docs/introduction"
            rel="noopener noreferrer"
          >
            Read docs
          </Link>
        </div>
      </section>
      <Footer />
    </div>
  );
}

function Footer() {
  const links = [
    { name: "@gellifygroup", url: "https://x.com/gellifygroup", icon: Twitter },
    {
      name: "youtube",
      url: "https://www.youtube.com/@gellifygroup4917",
      icon: Youtube,
    },
    {
      name: "linkedin",
      url: "https://it.linkedin.com/company/gellify",
      icon: Linkedin,
    },
    { name: "github", url: "https://github.com/GELLIFY", icon: Github },
  ];

  return (
    <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
      {links.map((link) => (
        <a
          key={link.name}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
        >
          <link.icon className="size-4" />
          {link.name}
        </a>
      ))}
    </footer>
  );
}
