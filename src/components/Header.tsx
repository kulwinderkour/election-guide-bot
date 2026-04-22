import { Link } from "@tanstack/react-router";
import { Vote } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link to="/" className="group flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-hero shadow-soft transition-transform group-hover:scale-105">
            <Vote className="h-5 w-5 text-primary-foreground" strokeWidth={2.5} />
          </div>
          <div className="leading-tight">
            <div className="font-display text-base font-bold text-foreground">ElectionGuide</div>
            <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Bot · India</div>
          </div>
        </Link>
        <nav className="flex items-center gap-1 text-sm font-medium">
          {[
            { to: "/", label: "Home" },
            { to: "/chat", label: "Chat" },
            { to: "/timeline", label: "Timeline" },
            { to: "/eligibility", label: "Eligibility" },
            { to: "/quiz", label: "Quiz" },
          ].map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="rounded-lg px-2.5 py-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground sm:px-3"
              activeProps={{ className: "rounded-lg px-2.5 py-1.5 sm:px-3 bg-secondary text-foreground" }}
              activeOptions={{ exact: l.to === "/" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
