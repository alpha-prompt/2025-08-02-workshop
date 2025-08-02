import { Link } from "@tanstack/react-router";

import { DateDisplay } from "@/components/date-display";

export function Header() {
  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div>
            <Link to="/">
              <h1 className="text-2xl font-bold terminal-text bloomberg-orange">
                Prompt & Circumstance
              </h1>
            </Link>
            <p className="text-sm font-bold mt-1">A Hands-On AI Workshop</p>
          </div>
          <DateDisplay />
        </div>
      </div>
    </header>
  );
}
