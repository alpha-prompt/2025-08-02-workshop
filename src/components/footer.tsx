import { Github } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-auto pt-8 border-t border-border bg-card">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-center gap-4">
          <a
            href="https://github.com/alpha-prompt/2025-07-26-workshop"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
          >
            <Github className="size-5 group-hover:scale-110 transition-transform" />
            <span className="text-sm">View source</span>
          </a>
          <span className="text-muted-foreground">|</span>
          <span className="text-sm text-muted-foreground">
            {new Date().getFullYear()}
          </span>
        </div>
      </div>
    </footer>
  );
}
